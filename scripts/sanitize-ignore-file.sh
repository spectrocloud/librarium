#!/bin/bash
set -euo pipefail

echo "🧹 Removing empty lines from vale-spellcheck-ignore.txt to prevent CI failures..."

if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' '/^$/d' vale-spellcheck-ignore.txt
else
  sed -i '/^$/d' vale-spellcheck-ignore.txt
fi