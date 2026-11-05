#!/usr/bin/env bash
# Writes the bot PR's description and its review comment from the run's outputs.
#
# Usage: write-pr-text.sh <work-dir>
# Reads <work-dir>/out/{fix-report.md,decision.json,diff-check.txt,backport-labels.txt,manual-backports.txt}
# and <work-dir>/review/review.md. Writes <work-dir>/out/pr-body.md and <work-dir>/out/pr-comment.md.
# Needs REVIEW_MODEL in the environment.
set -euo pipefail

out=$1/out
review=$1/review/review.md
confident=$(jq -r '.confident' "$out/decision.json")
reason=$(jq -r '.reason' "$out/decision.json")

if [[ $confident == true ]]; then
  decision="After the review, the agent is confident in these changes. ${reason}"
else
  decision="After the review, the agent is not confident in these changes. What to check: ${reason}"
fi
plan="Once every CI check passes, the agent tests the Netlify deploy preview and posts the result as a comment. If it is still confident, it merges this PR. The master ruleset requires a docs code owner's approval first, so it turns on auto-merge, and the PR merges on that approval. Otherwise, it hands the PR to a human."
flags=()
grep -q '^PROSE_CHANGED=1' "$out/diff-check.txt" && flags+=("- The agent changed text beyond URL swaps.")
grep -q '^UNVERIFIED_LINKS=1' "$out/diff-check.txt" && flags+=("- The link checker could not verify at least one new URL. The diff check output in the job summary lists it.")

if [[ -s $out/backport-labels.txt ]]; then
  backport="Added \`auto-backport\` and $(sed 's/.*/`&`/' "$out/backport-labels.txt" | paste -sd ' ' -), where the fix applies cleanly."
else
  backport="No version branch takes the fix cleanly."
fi
[[ -s $out/manual-backports.txt ]] && backport+=" Manual backport needed: $(paste -sd ' ' "$out/manual-backports.txt")."

{
  cat << EOF
# ✅ Pull Request Checklist

The link fix agent opened this PR and checked the items it could do itself. A docs code owner does the rest.

- [x] The **PR description** explains what changed. _The agent's fix report is below._
- [x] A **Jira ticket** is provided. _No Jira ticket: weekly broken-links report fix._
- [ ] **Preview links** for all affected pages. _The changed files are listed below._
- [ ] Conduct a **self-review** for your pages using your preview links.
- [x] Run a **review buddy check** in a separate context window. _pr-review-buddy ran on \`${REVIEW_MODEL}\` in a fresh context before this PR opened. The agent's responses are in a comment._
- [ ] **Check formatting** for your pages.
- [ ] Ensure all **Vale comments** are resolved.
- [ ] All **CI jobs** have completed successfully. _The agent waits for every check before it merges._
- [x] Add **Backport labels**. _${backport}_
- [x] **Outside review:** _No._
- [ ] Add the \`notify-slack\` label. _The agent adds it after it tests the deploy preview._

---

## 📝 Describe the Change

**Review:** ${decision}

**Merge plan:** ${plan}

EOF
  [[ ${#flags[@]} -gt 0 ]] && printf '%s\n' "${flags[@]}" ""
  cat "$out/fix-report.md"
  printf '\n---\n\n## 💻 Changed Pages\n\n'
  git diff --name-only HEAD | sed 's/.*/- `&`/'
  cat << 'EOF'

---

## 🎫 Jira Tickets

No Jira ticket (weekly broken-links report fix).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
} > "$out/pr-body.md"

{
  printf '## Review buddy\n\npr-review-buddy ran on `%s` in a fresh context before this PR opened.\n\n' "$REVIEW_MODEL"
  printf '<details><summary>Review report</summary>\n\n'
  cat "$review"
  printf '\n</details>\n\n## Responses from the link fix agent\n\n'
  jq -r 'if (.findings | length) == 0 then "No findings to address."
    else .findings[] | "- **\(.action | ascii_upcase):** \(.finding)\n  - \(.note)" end' "$out/decision.json"
} > "$out/pr-comment.md"
