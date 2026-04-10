#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

OUTPUT_FILE="${OUTPUT_FILE:-${REPO_ROOT}/versioned_links_report.json}"
TEMP_FILE="$(mktemp)"

grep -rHnE '(\./|\.\./)' \
  --include="*.md" \
  --include="*.mdx" \
  "${REPO_ROOT}/docs" "${REPO_ROOT}/_partials" > "$TEMP_FILE" || true

echo "TEMP_FILE=$TEMP_FILE"
wc -l "$TEMP_FILE"
head -n 5 "$TEMP_FILE"

python3 - "$TEMP_FILE" "$OUTPUT_FILE" "$REPO_ROOT" <<'PY'
import json
import re
import sys
from pathlib import Path

inp, out, repo_root = sys.argv[1], sys.argv[2], Path(sys.argv[3]).resolve()

results = []
seen = set()

# Standard markdown links: [text](../foo.md) or [text](../../bar.md#anchor)
md_link_pattern = re.compile(r'\]\(((?:\./|\.\./)[^)\s]*)\)')

# Optional: HTML href="../foo.md"
html_href_pattern = re.compile(r'href=["\']((?:\./|\.\./)[^"\']+)["\']')

# Optional: MDX Link to="../foo.md"
mdx_to_pattern = re.compile(r'\bto=["\']((?:\./|\.\./)[^"\']+)["\']')

with open(inp, "r", encoding="utf-8") as f:
    for raw in f:
        raw = raw.rstrip("\n")
        if not raw:
            continue

        parts = raw.split(":", 2)
        if len(parts) != 3:
            continue

        source_file, line, content = parts

        # Normalize to repo-relative path for cleaner JSON
        try:
            source_path = Path(source_file).resolve()
            source_file_rel = str(source_path.relative_to(repo_root))
        except Exception:
            source_file_rel = source_file

        matches = []
        matches.extend(md_link_pattern.findall(content))
        matches.extend(html_href_pattern.findall(content))
        matches.extend(mdx_to_pattern.findall(content))

        for match in matches:
            url = match.split("#", 1)[0].strip()
            if not url:
                continue

            key = (source_file_rel, line, url)
            if key in seen:
                continue
            seen.add(key)

            results.append({
                "source_file": source_file_rel,
                "url": url,
                "line": int(line),
            })

with open(out, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"Wrote {len(results)} entries to {out}")
PY

rm -f "$TEMP_FILE"