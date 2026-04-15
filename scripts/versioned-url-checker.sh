#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
POST_SUCCESS_TO_SLACK="${POST_SUCCESS_TO_SLACK:-false}"
REPORT_FILE="${REPORT_FILE:-${REPO_ROOT}/versioned_links_report.json}"
PACKS_DATA_FILE="${PACKS_DATA_FILE:-${REPO_ROOT}/.docusaurus/packs-integrations/api_pack_response.json}"
STRICT_PACK_VALIDATION="${STRICT_PACK_VALIDATION:-true}"

BROKEN_LINK_COUNT=0
CHECKED_LINK_COUNT=0
VALIDATED_DYNAMIC_PACK_COUNT=0
BROKEN_DYNAMIC_PACK_COUNT=0

validate_known_dynamic_pack_link() {
  local url="$1"
  local packs_data_file="$2"
  local strict_pack_validation="$3"

  python3 - "$url" "$packs_data_file" "$strict_pack_validation" <<'PY'
import json
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

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
docs_root = (repo_root / "docs" / "docs-content").resolve()
partials_root = (repo_root / "_partials").resolve()

candidates = []
seen = set()


def add_candidate(path: Path) -> None:
    normalized = path.resolve()
    key = str(normalized)
    if key not in seen:
        seen.add(key)
        candidates.append(normalized)


def clean_relative_path(value: str) -> str:
    cleaned = value
    while cleaned.startswith("../"):
        cleaned = cleaned[3:]
    while cleaned.startswith("./"):
        cleaned = cleaned[2:]
    while cleaned.startswith("/"):
        cleaned = cleaned[1:]
    return cleaned

if raw_url.startswith("./") or raw_url.startswith("../"):
    add_candidate((source_path.parent / raw_url).resolve())

cleaned_rel_url = clean_relative_path(raw_url)

if cleaned_rel_url:
    if cleaned_rel_url.startswith("static/"):
        add_candidate((repo_root / cleaned_rel_url).resolve())
    else:
        add_candidate((docs_root / cleaned_rel_url).resolve())
        add_candidate((partials_root / cleaned_rel_url).resolve())

for candidate in candidates:
    print(candidate)
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

if [[ ! -f "$REPORT_FILE" ]]; then
  echo "Error: Report file '$REPORT_FILE' not found"
  exit 1
fi

COMMENT=":loudspeaker: Relative Links Report :spectro:\n"

while IFS= read -r item; do
  source_file=$(echo "$item" | jq -r '.source_file // empty')
  rel_url=$(echo "$item" | jq -r '.url // empty')
  line=$(echo "$item" | jq -r '.line // 0')
  match_type=$(echo "$item" | jq -r '.match_type // "unknown"')

  [[ -z "$source_file" || -z "$rel_url" ]] && continue

  if [[ "$source_file" == deprecated/* || "$source_file" == */deprecated/* ]]; then
    continue
  fi

  if [[ "$rel_url" != ./* && "$rel_url" != ../* && "$rel_url" != /* ]]; then
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
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Invalid pack slug: ${pack_slug}
:package: Packs data source: ${PACKS_DATA_FILE}
"
      continue
      ;;
    PACK_QUERY_MISSING)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Missing required pack query parameter for /integrations/packs/
"
      continue
      ;;
    PACK_DATA_MISSING:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_MISSING:}"
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Pack validation data file not found (${pack_context})
"
      continue
      ;;
    PACK_DATA_UNREADABLE:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_UNREADABLE:}"
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Pack validation data file could not be read (${pack_context})
"
      continue
      ;;
    PACK_DATA_INVALID:*)
      ((BROKEN_LINK_COUNT+=1))
      ((BROKEN_DYNAMIC_PACK_COUNT+=1))
      pack_context="${pack_validation_result#PACK_DATA_INVALID:}"
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Pack validation data is invalid (${pack_context})
"
      continue
      ;;
    PACK_VALIDATION_SKIPPED:*)
      ;;
    NOT_DYNAMIC_PACK_LINK)
      ;;
    *)
      ((BROKEN_LINK_COUNT+=1))
      COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Unexpected pack validation result: ${pack_validation_result}
"
      continue
      ;;
  esac

  resolved_path=""
  found_target="false"

  while IFS= read -r candidate; do
    [[ -z "$candidate" ]] && continue
    resolved_path="$candidate"
    if target_exists "$candidate"; then
      found_target="true"
      break
    fi
  done < <(resolve_target_candidates "$source_file" "$rel_url")

  if [[ "$found_target" != "true" ]]; then
    ((BROKEN_LINK_COUNT+=1))
    COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Link (${match_type}): ${rel_url}
:red_circle: Missing target: ${resolved_path}
"
  fi
done < <(jq -c '.[]' "$REPORT_FILE")

if [[ "$CHECKED_LINK_COUNT" -eq 0 ]]; then
  COMMENT=":information_source: No supported local links found.

Source: :github: - librarium"
elif [[ "$BROKEN_LINK_COUNT" -eq 0 ]]; then
  COMMENT=":partyblob: All local links resolved successfully.

Checked: ${CHECKED_LINK_COUNT}
Validated dynamic packs: ${VALIDATED_DYNAMIC_PACK_COUNT}
Broken dynamic packs: ${BROKEN_DYNAMIC_PACK_COUNT}

Source: :github: - librarium"
else
  COMMENT=":old-man-yells-markdown: Broken local links detected!

${COMMENT}

Total checked: ${CHECKED_LINK_COUNT}
Validated dynamic packs: ${VALIDATED_DYNAMIC_PACK_COUNT}
Broken dynamic packs: ${BROKEN_DYNAMIC_PACK_COUNT}
Broken: ${BROKEN_LINK_COUNT}

Source: :github: - librarium"
fi

if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
  if [[ "$BROKEN_LINK_COUNT" -gt 0 || "$POST_SUCCESS_TO_SLACK" == "true" ]]; then
    jq -n --arg text "$COMMENT" '{text: $text}' | \
      curl -s -X POST -H 'Content-type: application/json' --data @- "$SLACK_WEBHOOK_URL"
  fi
else
  echo -e "$COMMENT"
fi
