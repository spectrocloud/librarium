#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
POST_SUCCESS_TO_SLACK="${POST_SUCCESS_TO_SLACK:-false}"
REPORT_FILE="${REPORT_FILE:-${REPO_ROOT}/versioned_links_report.json}"

BROKEN_LINK_COUNT=0
CHECKED_LINK_COUNT=0

resolve_target_path() {
  local source_file="$1"
  local rel_url="$2"

  python3 - "$REPO_ROOT" "$source_file" "$rel_url" <<'PY'
from pathlib import Path
import re
import sys

repo_root = Path(sys.argv[1]).resolve()
source_file = sys.argv[2]
rel_url = sys.argv[3]

rel_url = rel_url.split("#", 1)[0].split("?", 1)[0]
rel_url = re.sub(r'(?<!:)/{2,}', '/', rel_url)

source_path = (repo_root / source_file).resolve()
docs_root = (repo_root / "docs" / "docs-content").resolve()

target = (source_path.parent / rel_url).resolve()

def clean_relative_path(value: str) -> str:
    cleaned = value
    while cleaned.startswith("../"):
        cleaned = cleaned[3:]
    while cleaned.startswith("./"):
        cleaned = cleaned[2:]
    return cleaned

try:
    target.relative_to(docs_root)
except ValueError:
    cleaned_rel_url = clean_relative_path(rel_url)

    if cleaned_rel_url.startswith("static/"):
        target = (repo_root / cleaned_rel_url).resolve()
    else:
        target = (docs_root / cleaned_rel_url).resolve()

print(target)
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

  [[ -z "$source_file" || -z "$rel_url" ]] && continue

  if [[ "$source_file" == deprecated/* || "$source_file" == */deprecated/* ]]; then
    continue
  fi

  if [[ "$rel_url" != ./* && "$rel_url" != ../* ]]; then
    continue
  fi

  ((CHECKED_LINK_COUNT+=1))

  resolved_path=$(resolve_target_path "$source_file" "$rel_url")

  if ! target_exists "$resolved_path"; then
    ((BROKEN_LINK_COUNT+=1))
    COMMENT="${COMMENT}
:file_folder: Source: ${source_file}:${line}
:link: Relative Link: ${rel_url}
:red_circle: Missing target: ${resolved_path}
"
  fi
done < <(jq -c '.[]' "$REPORT_FILE")

# Final message construction
if [[ "$CHECKED_LINK_COUNT" -eq 0 ]]; then
  COMMENT=":information_source: No relative (./ or ../) links found.

Source: :github: - librarium"

elif [[ "$BROKEN_LINK_COUNT" -eq 0 ]]; then
  COMMENT=":partyblob: All relative links resolved successfully.

Checked: ${CHECKED_LINK_COUNT}

Source: :github: - librarium"

else
  COMMENT=":old-man-yells-markdown: Broken relative links detected!

${COMMENT}

Total checked: ${CHECKED_LINK_COUNT}
Broken: ${BROKEN_LINK_COUNT}

Source: :github: - librarium"
fi

# Slack logic
if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
  if [[ "$BROKEN_LINK_COUNT" -gt 0 || "$POST_SUCCESS_TO_SLACK" == "true" ]]; then
    jq -n --arg text "$COMMENT" '{text: $text}' | \
      curl -s -X POST -H 'Content-type: application/json' --data @- "$SLACK_WEBHOOK_URL"
  fi
else
  echo -e "$COMMENT"
fi