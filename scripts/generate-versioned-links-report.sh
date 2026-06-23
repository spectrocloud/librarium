#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

OUTPUT_FILE="${OUTPUT_FILE:-${REPO_ROOT}/versioned_links_report.json}"

python3 - "$OUTPUT_FILE" "$REPO_ROOT" <<'PY'
import json
import re
import sys
from pathlib import Path

out, repo_root = sys.argv[1], Path(sys.argv[2]).resolve()

search_roots = [
    repo_root / "docs",
    repo_root / "_partials",
]

results = []
seen = set()

patterns = [
    ("markdown", re.compile(r'\]\(((?:\./|\.\./|/)[^)\s]+)\)')),
    ("html_href", re.compile(r'href=["\']((?:\./|\.\./|/)[^"\']+)["\']')),
    ("mdx_to", re.compile(r'\bto=["\']((?:\./|\.\./|/)[^"\']+)["\']')),
    ("versioned_link", re.compile(r'<VersionedLink\b[^>]*\burl=["\']((?:\./|\.\./|/)[^"\']+)["\']', re.DOTALL)),
]


def line_number_for_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def mask_code(text: str) -> str:
    """Blank out code so links inside it are not treated as real links.

    Fenced code blocks (``` or ~~~) and inline code spans are replaced with
    spaces. Newlines and overall length are preserved so byte offsets — and
    therefore reported line numbers — remain accurate.
    """
    fence_re = re.compile(r'(`{3,}|~{3,})')

    masked_lines = []
    in_fence = False
    fence_char = None
    for line in text.split("\n"):
        match = fence_re.match(line.lstrip())
        if not in_fence and match:
            in_fence = True
            fence_char = match.group(1)[0]
            masked_lines.append(" " * len(line))
            continue
        if in_fence:
            if match and match.group(1)[0] == fence_char:
                in_fence = False
                fence_char = None
            masked_lines.append(" " * len(line))
            continue
        masked_lines.append(line)

    masked = "\n".join(masked_lines)

    # Blank out inline code spans (e.g. `(./foo.md)`).
    masked = re.sub(r'`+[^`\n]*`+', lambda m: " " * len(m.group(0)), masked)

    return masked


for root in search_roots:
    if not root.exists():
        continue

    for path in root.rglob("*"):
        if not path.is_file() or path.suffix not in {".md", ".mdx"}:
            continue

        content = path.read_text(encoding="utf-8")
        # Strip code blocks/spans so example links inside them are not flagged.
        search_text = mask_code(content)
        source_file_rel = str(path.resolve().relative_to(repo_root))

        for match_type, pattern in patterns:
            for match in pattern.finditer(search_text):
                url = match.group(1).split("#", 1)[0].strip()
                if not url:
                    continue

                line = line_number_for_offset(content, match.start(1))
                key = (source_file_rel, line, url, match_type)
                if key in seen:
                    continue
                seen.add(key)

                results.append({
                    "source_file": source_file_rel,
                    "url": url,
                    "line": line,
                    "match_type": match_type,
                })

with open(out, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"Wrote {len(results)} entries to {out}")
PY
