#!/bin/bash

# Enable error handling
set -e

# Import utility functions
source scripts/release/utilities.sh

JIRA_DOMAIN=https://spectrocloud.atlassian.net/
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
PATCH_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes.md"
PATCH_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-output.md"


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

read -p "Specify ticket to generate patch release notes for (for example, DOC-2815): " patch_release_ticket
echo "Generating patch release notes for $patch_release_ticket ..."

CANDIDATES_LINK=$(curl -s --fail-with-body \
  --url "${JIRA_DOMAIN}/rest/api/3/issue/${patch_release_ticket}?fields=description" \
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
  echo "No 'List of candidates' link found" >&2
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
RELEASE_DATE=$(date -j -f "%Y-%m-%d" "$END_DATE" +"%B %-d, %Y")
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

echo "ℹ️  Candidate issues found: ${ISSUE_KEYS[*]}."

QUESTION="Summarise ${ISSUE_KEYS[*]} into 1 phrase each.
Use the following example for the format
<!-- https://spectrocloud.atlassian.net/browse/PE-8328 -->
- Fixed an issue that caused nodes deleted via \`kubectl\` to remain visible in the Palette UI, resulting in duplicate entries when the node rejoined the cluster."

BUG_FIXES_BODY=$(
  curl -sS --fail-with-body \
    --request POST \
    --url https://api.super.work/v1/super \
    --header "Authorization: Bearer ${SUPER_API_TOKEN}" \
    --header "Content-Type: application/json" \
    --data "$(jq -n --arg question "$QUESTION" '{question: $question}')" \
  | jq -r '.answer // empty'
)

if [[ -z "$BUG_FIXES_BODY" ]]; then
  echo "❌ BUG_FIXES_BODY is empty" >&2
  exit 1
fi

generate_parameterised_file_local_vars \
  "$PATCH_NOTES_TEMPLATE_FILE" \
  "$PATCH_NOTES_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_PATCH" \
  "BUG_FIXES_BODY"

insert_file_after "<ReleaseNotesVersions />" $PATCH_NOTES_OUTPUT_FILE $RELEASE_NOTES_FILE
echo "✅ Patch release notes generated and inserted into $RELEASE_NOTES_FILE."
cleanup $PATCH_NOTES_OUTPUT_FILE
