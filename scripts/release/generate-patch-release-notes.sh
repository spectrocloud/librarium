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

if (( ${#ISSUE_KEYS[@]} == 0 )); then
  echo "❌  No candidate issues found with JQL: $JQL" >&2
  exit 1
fi

echo "ℹ️  Candidate issues found: ${ISSUE_KEYS[*]}."

# Check if release notes section for this patch already exists in the release notes file
RELEASE_PATCH_EXISTING_BODY=""

if grep -qF "$PATCH_RELEASE_TICKET" "$RELEASE_NOTES_FILE"; then
  echo "⚠️  Release notes for $PATCH_RELEASE_TICKET already exist in $RELEASE_NOTES_FILE."

  RELEASE_PATCH_EXISTING_BODY=$(awk -v ticket="$PATCH_RELEASE_TICKET" '
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" { in_section=1; next }
    in_section && /^## [^#]/ { exit }
    in_section { print }
  ' "$RELEASE_NOTES_FILE")
fi

SUPER_QUESTION=""

# Construct the Super API question
if [[ -z "$RELEASE_PATCH_EXISTING_BODY" ]]; then
  echo "ℹ️  No existing release notes body found for $PATCH_RELEASE_TICKET."

  SUPER_QUESTION=$(cat <<EOF
Generate patch release notes for these tickets:

${ISSUE_KEYS[*]}
EOF
)
else
  SUPER_QUESTION=$(cat <<EOF
Generate patch release notes for these tickets:

${ISSUE_KEYS[*]}

Existing release notes body for $PATCH_RELEASE_TICKET:
$RELEASE_PATCH_EXISTING_BODY
EOF
)
fi

SUPER_BUG_FIXES_BODY=""

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "Attempt Super POST call $i/$MAX_RETRIES..."

  if RESPONSE=$(
    curl -sS --fail-with-body \
      --request POST \
      --url https://api.super.work/v1/super \
      --header "Authorization: Bearer ${SUPER_API_TOKEN}" \
      --header "Content-Type: application/json" \
      --data "$(jq -n --arg question "$SUPER_QUESTION" --arg assistantID "$SUPER_ASSISTANT_ID" '{question: $question, assistantId: $assistantID}')"
  ); then
    SUPER_BUG_FIXES_BODY=$(echo "$RESPONSE" | jq -r '.answer // empty')

    if [[ -n "$SUPER_BUG_FIXES_BODY" ]]; then
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

if [[ -z "$SUPER_BUG_FIXES_BODY" ]]; then
  echo "❌ Failed to retrieve SUPER_BUG_FIXES_BODY after $MAX_RETRIES attempts" >&2
  exit 1
fi


# If the release notes section for this patch already exists, will replace the existing body with the new one generated by Super, otherwise will insert a new section for this patch release.
if grep -qF "$PATCH_RELEASE_TICKET" "$RELEASE_NOTES_FILE"; then
  tmp_body_file="$(mktemp)"
  printf '%s' "$SUPER_BUG_FIXES_BODY" > "$tmp_body_file"

  awk -v ticket="$PATCH_RELEASE_TICKET" -v body_file="$tmp_body_file" '
    # When we hit the ticket marker, print it and inject new body
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" {
      print
      while ((getline line < body_file) > 0) {
        print line
      }
      close(body_file)
      skip=1
      next
    }

    # Skip old body until next H2
    skip && /^## [^#]/ {
      skip=0
    }

    # Skip lines while in old body
    skip {
      next
    }

    # Print everything else
    {
      print
    }
  ' "$RELEASE_NOTES_FILE" > "${RELEASE_NOTES_FILE}.tmp" \
    && mv "${RELEASE_NOTES_FILE}.tmp" "$RELEASE_NOTES_FILE"

  rm -f "$tmp_body_file"

  echo "✅ Patch release notes updated for $PATCH_RELEASE_TICKET in $RELEASE_NOTES_FILE."

  exit 0
fi

echo "ℹ️ Release notes for $RELEASE_PATCH do not already exist in $RELEASE_NOTES_FILE" >&2

generate_parameterised_file_local_vars \
  "$PATCH_NOTES_TEMPLATE_FILE" \
  "$PATCH_NOTES_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_PATCH" \
  "PATCH_RELEASE_TICKET" \
  "SUPER_BUG_FIXES_BODY"

insert_file_after "<ReleaseNotesVersions />" $PATCH_NOTES_OUTPUT_FILE $RELEASE_NOTES_FILE
echo "✅ Patch release notes generated and inserted into $RELEASE_NOTES_FILE."
cleanup $PATCH_NOTES_OUTPUT_FILE
