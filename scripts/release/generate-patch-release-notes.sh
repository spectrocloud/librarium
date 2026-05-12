#!/bin/bash

# Enable error handling
set -euo pipefail

# Import utility functions
source scripts/release/utilities.sh

JIRA_DOMAIN=https://spectrocloud.atlassian.net/
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
PATCH_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes.md"
PATCH_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-output.md"
SUPER_ASSISTANT_ID="8fxCluEt-1T6w_" # ID for the assistant configured to write patch release notes based on Jira issues
MAX_RETRIES=5
SLEEP_SECONDS=2

if ! check_env "JIRA_EMAIL"; then
    echo "‼️  JIRA_EMAIL environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "JIRA_API_TOKEN"; then
    echo "‼️  JIRA_API_TOKEN environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "SUPER_API_TOKEN"; then
    echo "‼️  SUPER_API_TOKEN environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if [[ -z "${PATCH_RELEASE_TICKET:-}" ]]; then
  read -p "Specify ticket to generate patch release notes for (for example, DOC-2815): " PATCH_RELEASE_TICKET
fi

echo "Generating patch release notes for $PATCH_RELEASE_TICKET ..."

CANDIDATES_LINK=$(curl -s --fail-with-body \
  --url "${JIRA_DOMAIN}/rest/api/3/issue/${PATCH_RELEASE_TICKET}?fields=description" \
  --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json" | jq -r '
  .fields.description.content[]
  | select(.type=="blockquote")
  | .. 
  | objects
  | select(.type=="text" and (.text | ascii_downcase)=="list of candidates")
  | .marks[]
  | select(.type=="link")
  | .attrs.href
')

if [[ -z "$CANDIDATES_LINK" ]]; then
  echo "❌  No 'List of candidates' link found" >&2
  exit 1
fi

echo "ℹ️  Candidates link found: $CANDIDATES_LINK."

# Extract + decode JQL from link
JQL_ENCODED=$(printf '%s\n' "$CANDIDATES_LINK" | sed -n 's/.*[?&]jql=\([^&]*\).*/\1/p')

if [[ -z "$JQL_ENCODED" ]]; then
  echo "❌  No JQL found in List of candidates link" >&2
  exit 1
fi

# Safe decode: handle %XX and +
JQL=$(printf '%b' "${JQL_ENCODED//%/\\x}")
JQL=${JQL//+/ }

END_DATE=$(printf '%s' "$JQL" | sed -n 's/.*duedate <= "\([^"]*\)".*/\1/p')
# Try parsing with BSD date first (macOS), fallback to GNU date (Linux)
if date -j -f "%Y-%m-%d" "$END_DATE" +"%B %-d, %Y" >/dev/null 2>&1; then
  RELEASE_DATE=$(date -j -f "%Y-%m-%d" "$END_DATE" +"%B %-d, %Y")
else
  RELEASE_DATE=$(date -d "$END_DATE" +"%B %-d, %Y")
fi
RELEASE_PATCH=$(printf '%s' "$JQL" | sed -n 's/.*fixVersion IN (\([^)]*\)).*/\1/p')
echo "ℹ️  Extracted release date: $RELEASE_DATE."
echo "ℹ️  Extracted release patch: $RELEASE_PATCH."

# Fetch issues
ISSUE_RESPONSE=$(curl -s --fail-with-body \
  --url "${JIRA_DOMAIN}/rest/api/3/search/jql" \
  --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json" \
  --get \
  --data-urlencode "jql=${JQL}" \
  --data-urlencode "maxResults=100")

ISSUE_KEYS=()
for id in $(echo "$ISSUE_RESPONSE" | jq -r '.issues[].id'); do
  key=$(curl -s --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/issue/${id}" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
    | jq -r '.key')

  ISSUE_KEYS+=("$key")
done

# Filter out issues that are already in the release notes
NEW_ISSUE_KEYS=()
for key in "${ISSUE_KEYS[@]}"; do
  if ! grep -q "$key" "$RELEASE_NOTES_FILE"; then
    NEW_ISSUE_KEYS+=("$key")
  fi
done

echo "ℹ️  Candidate issues found: ${ISSUE_KEYS[*]}."
echo "ℹ️  New issues to include in release notes: ${NEW_ISSUE_KEYS[*]}."

QUESTION=$(cat <<EOF
Generate patch release notes for these tickets:

${NEW_ISSUE_KEYS[*]}
EOF
)

BUG_FIXES_BODY=""

BUG_FIXES_BODY=""

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "Attempt Super POST call $i/$MAX_RETRIES..."

  if RESPONSE=$(
    curl -sS --fail-with-body \
      --request POST \
      --url https://api.super.work/v1/super \
      --header "Authorization: Bearer ${SUPER_API_TOKEN}" \
      --header "Content-Type: application/json" \
      --data "$(jq -n --arg question "$QUESTION" --arg assistantID "$SUPER_ASSISTANT_ID" '{question: $question, assistantId: $assistantID}')"
  ); then
    BUG_FIXES_BODY=$(echo "$RESPONSE" | jq -r '.answer // empty')

    if [[ -n "$BUG_FIXES_BODY" ]]; then
      echo "✅ Successfully retrieved bug fixes body from Super API."
      break
    fi

    echo "⚠️ Empty response, retrying in ${SLEEP_SECONDS}s..." >&2
  else
    echo "⚠️ Super API call failed, retrying in ${SLEEP_SECONDS}s..." >&2
  fi

  if (( i < MAX_RETRIES )); then
    sleep "$SLEEP_SECONDS"
    SLEEP_SECONDS=$((SLEEP_SECONDS * 2))
  fi

done

if [[ -z "$BUG_FIXES_BODY" ]]; then
  echo "❌ Failed to retrieve BUG_FIXES_BODY after $MAX_RETRIES attempts" >&2
  exit 1
fi

release_notes_header="## $RELEASE_DATE - Release $RELEASE_PATCH"

if grep -qF "$release_notes_header" "$RELEASE_NOTES_FILE"; then
  echo "ℹ️ Release notes for $RELEASE_PATCH already exist in $RELEASE_NOTES_FILE" >&2
  echo "ℹ️ Appending new bug fixes to existing release notes section for $RELEASE_PATCH."

  # Find exact release notes header line
  start_line=$(
    awk -v header="$release_notes_header" '
      $0 == header { print NR; exit }
    ' "$RELEASE_NOTES_FILE"
  )

  # Find next H2 header after current header
  next_header_line=$(
    awk -v start="$start_line" '
      NR > start && /^## [^#]/ { print NR; exit }
    ' "$RELEASE_NOTES_FILE"
  )

  # If no next H2, insert at end of file
  if [[ -z "$next_header_line" ]]; then
    next_header_line=$(( $(wc -l < "$RELEASE_NOTES_FILE") + 1 ))
  fi

  tmp_text_file="$(mktemp)"
  printf '%s' "$BUG_FIXES_BODY" > "$tmp_text_file"

  awk -v insert_line="$next_header_line" -v text_file="$tmp_text_file" '
    NR == insert_line {
      print ""
      while ((getline line < text_file) > 0) {
        print line
      }
      close(text_file)
    }
    { print }
  ' "$RELEASE_NOTES_FILE" > "${RELEASE_NOTES_FILE}.tmp" \
    && mv "${RELEASE_NOTES_FILE}.tmp" "$RELEASE_NOTES_FILE"

  rm -f "$tmp_text_file"

  exit 0

fi

echo "ℹ️ Release notes for $RELEASE_PATCH do not already exist in $RELEASE_NOTES_FILE" >&2

generate_parameterised_file_local_vars \
  "$PATCH_NOTES_TEMPLATE_FILE" \
  "$PATCH_NOTES_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_PATCH" \
  "PATCH_RELEASE_TICKET" \
  "BUG_FIXES_BODY"

insert_file_after "<ReleaseNotesVersions />" $PATCH_NOTES_OUTPUT_FILE $RELEASE_NOTES_FILE
echo "✅ Patch release notes generated and inserted into $RELEASE_NOTES_FILE."
cleanup $PATCH_NOTES_OUTPUT_FILE
