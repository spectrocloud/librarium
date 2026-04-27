#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
POST_SUCCESS_TO_SLACK="${POST_SUCCESS_TO_SLACK:-false}"
REPORT_FILE="${REPORT_FILE:-${REPO_ROOT}/versioned_links_report.json}"
PACKS_DATA_FILE="${PACKS_DATA_FILE:-${REPO_ROOT}/.docusaurus/packs-integrations/api_pack_response.json}"

# Default to false for local runs to avoid requiring packs data.
# CI should set STRICT_PACK_VALIDATION=true to enforce pack validation.
STRICT_PACK_VALIDATION="${STRICT_PACK_VALIDATION:-false}"
MAX_SLACK_SAMPLE_ITEMS="${MAX_SLACK_SAMPLE_ITEMS:-10}"
MAX_SLACK_CHARS="${MAX_SLACK_CHARS:-3500}"

BROKEN_LINK_COUNT=0
CHECKED_LINK_COUNT=0
VALIDATED_DYNAMIC_PACK_COUNT=0
BROKEN_DYNAMIC_PACK_COUNT=0
SAMPLED_BROKEN_COUNT=0

SLACK_DETAILS=""

validate_known_dynamic_pack_link() {
  local url="$1"
  local packs_data_file="$2"
  local strict_pack_validation="$3"

  python3 - "$url" "$packs_data_file" "$strict_pack_validation" <<'PY'
import json
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

url = sys.argv[1].strip()
packs_data_file = Path(sys.argv[2])
strict_pack_validation = sys.argv[3].strip().lower() == "true"

parsed = urlparse(url)
path = parsed.path.rstrip("/")
query = parse_qs(parsed.query)
pack_values = [value.strip() for value in query.get("pack", []) if value.strip()]

if path != "/integrations/packs":
    print("NOT_DYNAMIC_PACK_LINK")
    sys.exit(0)

if not pack_values:
    print("PACK_QUERY_MISSING")
    sys.exit(0)

pack_slug = pack_values[0]

if not packs_data_file.is_file():
    if strict_pack_validation:
        print(f"PACK_DATA_MISSING:{pack_slug}:{packs_data_file}")
    else:
        print(f"PACK_VALIDATION_SKIPPED:{pack_slug}:{packs_data_file}")
    sys.exit(0)

try:
    with packs_data_file.open("r", encoding="utf-8") as f:
        data = json.load(f)
except Exception as exc:
    if strict_pack_validation:
        print(f"PACK_DATA_UNREADABLE:{pack_slug}:{exc}")
    else:
        print(f"PACK_VALIDATION_SKIPPED:{pack_slug}:{exc}")
    sys.exit(0)

pack_map = data.get("packMDMap", {})
if not isinstance(pack_map, dict):
    if strict_pack_validation:
        print(f"PACK_DATA_INVALID:{pack_slug}:packMDMap missing or invalid")
    else:
        print(f"PACK_VALIDATION_SKIPPED:{pack_slug}:packMDMap missing or invalid")
    sys.exit(0)

valid_pack_names = set(pack_map.keys())

if pack_slug in valid_pack_names:
    print(f"PACK_OK:{pack_slug}")
else:
    print(f"PACK_MISSING:{pack_slug}")
PY
}

resolve_target_candidates() {
  local source_file="$1"
  local rel_url="$2"

  python3 - "$REPO_ROOT" "$source_file" "$rel_url" <<'PY'
from pathlib import Path
import re
import sys

repo_root = Path(sys.argv[1]).resolve()
source_file = sys.argv[2]
rel_url = sys.argv[3]

raw_url = rel_url.split("#", 1)[0].split("?", 1)[0].strip()
raw_url = re.sub(r'(?<!:)/{2,}', '/', raw_url)

source_path = (repo_root / source_file).resolve()

if raw_url.startswith("./") or raw_url.startswith("../"):
    print((source_path.parent / raw_url).resolve())
PY
}

target_exists() {
  local target="$1"

  [[ -e "$target" ]] && return 0
  [[ -e "${target}.md" ]] && return 0
  [[ -e "${target}.mdx" ]] && return 0
  [[ -e "${target}/index.md" ]] && return 0
  [[ -e "${target}/index.mdx" ]] && return 0

  return 1
}

append_slack_detail() {
  local source_file="$1"
  local line="$2"
  local match_type="$3"
  local rel_url="$4"
  local reason="$5"

  if (( SAMPLED_BROKEN_COUNT >= MAX_SLACK_SAMPLE_ITEMS )); then
    return
  fi

  SLACK_DETAILS+="
• ${source_file}:${line} | ${match_type} | ${rel_url}
  ${reason}
"
  ((SAMPLED_BROKEN_COUNT+=1))
}

build_slack_message() {
  local status_emoji="$1"
  local headline="$2"
  local message

  message="${status_emoji} ${headline}

Checked: ${CHECKED_LINK_COUNT}
Broken: ${BROKEN_LINK_COUNT}
Validated dynamic packs: ${VALIDATED_DYNAMIC_PACK_COUNT}
Broken dynamic packs: ${BROKEN_DYNAMIC_PACK_COUNT}"

  if (( BROKEN_LINK_COUNT > 0 )) && [[ -n "$SLACK_DETAILS" ]]; then
    message+="

Sample broken links (first ${SAMPLED_BROKEN_COUNT} of ${BROKEN_LINK_COUNT}):${SLACK_DETAILS}"
  fi

  if (( BROKEN_LINK_COUNT > MAX_SLACK_SAMPLE_ITEMS )); then
    message+="
Full details are available in ${REPORT_FILE}."
  fi

  message+="

Source: :github: - librarium"

  if (( ${#message} > MAX_SLACK_CHARS )); then
    message="${message:0:MAX_SLACK_CHARS}

...[truncated]

Source: :github: - librarium"
  fi

  printf '%s' "$message"
}

post_to_slack() {
  local text="$1"

  printf '%s' "$text" | jq -Rs '{text: .}' | \
    curl -sS --fail -X POST -H 'Content-type: application/json' --data @- "$SLACK_WEBHOOK_URL" >/dev/null
}

if [[ ! -f "$REPORT_FILE" ]]; then
  echo "Error: Report file '$REPORT_FILE' not found" >&2
  exit 1
fi

while IFS= read -r item; do
  source_file=$(printf '%s' "$item" | jq -r '.source_file // empty')
  rel_url=$(printf '%s' "$item" | jq -r '.url // empty')
  line=$(printf '%s' "$item" | jq -r '.line // 0')
  match_type=$(printf '%s' "$item" | jq -r '.match_type // "unknown"')

  [[ -z "$source_file" || -z "$rel_url" ]] && continue

  if [[ "$source_file" == deprecated/* || "$source_file" == */deprecated/* ]]; then
    continue
  fi

  # Only validate:
  # 1) true relative file links: ./... and ../...
  # 2) known dynamic pack links: /integrations/packs?...
  # Root-relative site routes and root-relative assets like /getting-started/ or /foo.webp
  # are intentionally skipped here because they are site routes/assets, not direct repo paths.
  if [[ "$rel_url" != ./* && "$rel_url" != ../* && "$rel_url" != /integrations/packs* ]]; then
    continue
  fi
  # Skip directory-style links (Docusaurus routes)
  if [[ "$rel_url" == */ ]]; then
    continue
  fi

  ((CHECKED_LINK_COUNT+=1))

  pack_validation_result="$(validate_known_dynamic_pack_link "$rel_url" "$PACKS_DATA_FILE" "$STRICT_PACK_VALIDATION")"

  case "$pack_validation_result" in
    PACK_OK:*)
      ((VALIDATED_DYNAMIC_PACK_COUNT+=1))
      continue
      ;;
    PACK_MISSING:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_slug="${pack_validation_result#PACK_MISSING:}"
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Invalid pack slug: ${pack_slug}"
      continue
      ;;
    PACK_QUERY_MISSING)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Missing required pack query parameter for /integrations/packs/"
      continue
      ;;
    PACK_DATA_MISSING:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_MISSING:}"
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Pack validation data file not found (${pack_context})"
      continue
      ;;
    PACK_DATA_UNREADABLE:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_UNREADABLE:}"
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Pack validation data file could not be read (${pack_context})"
      continue
      ;;
    PACK_DATA_INVALID:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_INVALID:}"
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Pack validation data is invalid (${pack_context})"
      continue
      ;;
    PACK_VALIDATION_SKIPPED:*)
      continue
      ;;
    NOT_DYNAMIC_PACK_LINK)
      ;;
    *)
      ((BROKEN_LINK_COUNT+=1))
      append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Unexpected pack validation result: ${pack_validation_result}"
      continue
      ;;
  esac

resolved_path="$(resolve_target_candidates "$source_file" "$rel_url" | head -n 1)"

if [[ -z "$resolved_path" ]]; then
  ((BROKEN_LINK_COUNT+=1))
  append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Could not resolve relative path"
elif ! target_exists "$resolved_path"; then
  ((BROKEN_LINK_COUNT+=1))
  append_slack_detail "$source_file" "$line" "$match_type" "$rel_url" "Missing target: ${resolved_path}"
fi

done < <(jq -c '.[]' "$REPORT_FILE")

if [[ "$CHECKED_LINK_COUNT" -eq 0 ]]; then
  CONSOLE_MESSAGE=":information_source: No supported relative file links or dynamic pack links found.

Source: :github: - librarium"
elif [[ "$BROKEN_LINK_COUNT" -eq 0 ]]; then
  CONSOLE_MESSAGE=":partyblob: All checked relative file links and dynamic pack links resolved successfully.

Checked: ${CHECKED_LINK_COUNT}
Validated dynamic packs: ${VALIDATED_DYNAMIC_PACK_COUNT}
Broken dynamic packs: ${BROKEN_DYNAMIC_PACK_COUNT}

Source: :github: - librarium"
else
  CONSOLE_MESSAGE=":old-man-yells-markdown: Broken relative file links or dynamic pack links detected.

Checked: ${CHECKED_LINK_COUNT}
Broken: ${BROKEN_LINK_COUNT}
Validated dynamic packs: ${VALIDATED_DYNAMIC_PACK_COUNT}
Broken dynamic packs: ${BROKEN_DYNAMIC_PACK_COUNT}
Sampled in Slack: ${SAMPLED_BROKEN_COUNT}
Full detail: ${REPORT_FILE}

Source: :github: - librarium"
fi

if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
  if [[ "$BROKEN_LINK_COUNT" -gt 0 || "$POST_SUCCESS_TO_SLACK" == "true" ]]; then
    if [[ "$CHECKED_LINK_COUNT" -eq 0 ]]; then
      SLACK_MESSAGE="$(build_slack_message ":information_source:" "No supported relative file links or dynamic pack links found.")"
    elif [[ "$BROKEN_LINK_COUNT" -eq 0 ]]; then
      SLACK_MESSAGE="$(build_slack_message ":partyblob:" "All checked relative file links and dynamic pack links resolved successfully.")"
    else
      SLACK_MESSAGE="$(build_slack_message ":old-man-yells-markdown:" "Broken relative file links or dynamic pack links detected.")"
    fi

    post_to_slack "$SLACK_MESSAGE"
  fi
else
  echo -e "$CONSOLE_MESSAGE"
fi
