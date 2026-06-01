#!/bin/bash

# Enable error handling
set -euo pipefail

# Import utility functions
source scripts/release/utilities.sh
source .env

JIRA_DOMAIN=https://spectrocloud.atlassian.net/
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
COMPONENT_UPDATES_TEMPLATE_FILE="scripts/release/templates/component-updates.md"
COMPONENT_UPDATES_OUTPUT_FILE="scripts/release/component-updates-output.md"
COMPONENT_UPDATES_CROSS_LINK_TEMPLATE_FILE="scripts/release/templates/component-updates-cross-link.md"
COMPONENT_UPDATES_CROSS_LINK_OUTPUT_FILE="scripts/release/templates/component-updates-cross-link-output.md"
COMPONENT_UPDATES_HEADING_TEMPLATE_FILE="scripts/release/templates/component-updates-heading.md"
COMPONENT_UPDATES_HEADING_OUTPUT_FILE="scripts/release/component-updates-heading-output.md"
SUPER_ASSISTANT_ID="3hGjyJjygs5nyP" # ID for the assistant configured to generate component updates based on Jira issues
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

if ! check_env "RELEASE_DATE"; then
    echo "‼️  RELEASE_DATE environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_COMPONENT_YEAR"; then
    echo "‼️  RELEASE_COMPONENT_YEAR environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_COMPONENT_WEEK"; then
    echo "‼️  RELEASE_COMPONENT_WEEK environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_COMPONENT_START_VERSION"; then
    echo "‼️  RELEASE_COMPONENT_START_VERSION environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_COMPONENT_END_VERSION"; then
    echo "‼️  RELEASE_COMPONENT_END_VERSION environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_MANAGEMENT_APPLIANCE"; then
    echo "‼️  RELEASE_MANAGEMENT_APPLIANCE environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_ARTIFACT_STUDIO"; then
    echo "‼️  RELEASE_ARTIFACT_STUDIO environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if ! check_env "RELEASE_TERRAFORM_VERSION"; then
    echo "‼️  RELEASE_TERRAFORM_VERSION environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

if [[ -z "${JIRA_TICKET:-}" ]]; then
  read -p "Specify ticket to generate component updates for (for example, DOC-2852): " JIRA_TICKET
fi

echo "ℹ️ Generating component updates for $JIRA_TICKET ..."

# Fetch linked issues, excluding PRM- tickets and Pack Updates tickets
LINKED_ISSUES=()
while IFS= read -r issue; do
  LINKED_ISSUES+=("$issue")
done < <(
  curl --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/issue/${JIRA_TICKET}?fields=issuelinks" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
  | jq -r '
      .fields.issuelinks[]
      | (.outwardIssue // .inwardIssue)
      | select(.key | startswith("PRM-") | not)
      | select(.fields.summary | contains("Pack Updates") | not)
      | .key
    '
)

if (( ${#LINKED_ISSUES[@]} == 0 )); then
  echo "❌  No linked issues found for ticket: $JIRA_TICKET" >&2
  exit 1
fi

echo "ℹ️  Linked issues retrieved: ${LINKED_ISSUES[*]}"

# Check if release notes section for this component update ticket already exists in the release notes file
COMPONENT_UPDATES_EXISTING_BODY=""

if grep -qF "$JIRA_TICKET" "$RELEASE_NOTES_FILE"; then
  echo "⚠️  Release notes for $JIRA_TICKET already exist in $RELEASE_NOTES_FILE."

  COMPONENT_UPDATES_EXISTING_BODY=$(awk -v ticket="$JIRA_TICKET" '
    $0 ~ "<!-- BEGIN COMPONENT UPDATES BODY. DO NOT DELETE. -->" { in_section=1; next }
    in_section && $0 ~ "<!-- END COMPONENT UPDATES BODY. DO NOT DELETE. -->" { exit }
    in_section { print }
  ' "$RELEASE_NOTES_FILE")
fi

generate_parameterised_file $COMPONENT_UPDATES_CROSS_LINK_TEMPLATE_FILE $COMPONENT_UPDATES_CROSS_LINK_OUTPUT_FILE
generate_parameterised_file $COMPONENT_UPDATES_HEADING_TEMPLATE_FILE $COMPONENT_UPDATES_HEADING_OUTPUT_FILE

existing_notes=$(search_line "{#component-updates-$RELEASE_COMPONENT_YEAR-$RELEASE_COMPONENT_WEEK}" $RELEASE_NOTES_FILE)
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    replace_line $existing_notes $COMPONENT_UPDATES_HEADING_OUTPUT_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced component updates heading in $RELEASE_NOTES_FILE"
fi

# Search all lines containing the component updates links and update them
cross_link_regex="- \[.* - Component Updates\](#component-updates-$RELEASE_COMPONENT_YEAR-$RELEASE_COMPONENT_WEEK)"
grep -n -- "$cross_link_regex" "$RELEASE_NOTES_FILE" \
  | cut -d: -f1 \
  | while IFS= read -r line_number; do
      replace_line "$line_number" "$COMPONENT_UPDATES_CROSS_LINK_OUTPUT_FILE" "$RELEASE_NOTES_FILE"
    done

cleanup $COMPONENT_UPDATES_CROSS_LINK_OUTPUT_FILE
cleanup $COMPONENT_UPDATES_HEADING_OUTPUT_FILE

SUPER_QUESTION=""

# Construct the Super API question
if [[ -z "$COMPONENT_UPDATES_EXISTING_BODY" ]]; then
  echo "ℹ️  No existing component updates body found for $JIRA_TICKET."

  SUPER_QUESTION=$(cat <<EOF
Generate documentation for these tickets:

${LINKED_ISSUES[*]}
EOF
)
else
  SUPER_QUESTION=$(cat <<EOF
Generate documentation for these tickets:

${LINKED_ISSUES[*]}

Existing documentation body for $JIRA_TICKET:
$COMPONENT_UPDATES_EXISTING_BODY
EOF
)
fi

SUPER_COMPONENT_UPDATES_BODY=""

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
    SUPER_COMPONENT_UPDATES_BODY=$(echo "$RESPONSE" | jq -r '.answer // empty')

    if [[ -n "$SUPER_COMPONENT_UPDATES_BODY" ]]; then
      echo "✅ Successfully retrieved component updates body from Super API."
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

if [[ -z "$SUPER_COMPONENT_UPDATES_BODY" ]]; then
  echo "❌ Failed to retrieve SUPER_COMPONENT_UPDATES_BODY after $MAX_RETRIES attempts" >&2
  exit 1
fi

# If the release notes section for this component update ticket already exists, will replace the existing body with the new one generated by Super, otherwise will insert a new section for this component update ticket.
if grep -qF "$JIRA_TICKET" "$RELEASE_NOTES_FILE"; then
  tmp_body_file="$(mktemp)"
  printf '%s' "$SUPER_COMPONENT_UPDATES_BODY" > "$tmp_body_file"

  awk -v body_file="$tmp_body_file" '
    # When we hit the updates body marker, print it and inject new body
    $0 ~ "<!-- BEGIN COMPONENT UPDATES BODY. DO NOT DELETE. -->" {
      print
      while ((getline line < body_file) > 0) {
        print line
      }
      close(body_file)
      skip=1
      next
    }

    # Skip old body until we hit the end marker
    skip && $0 ~ "<!-- END COMPONENT UPDATES BODY. DO NOT DELETE. -->" {
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

  echo "✅ Component updates body updated for $JIRA_TICKET in $RELEASE_NOTES_FILE."

  exit 0
fi

echo "ℹ️  Component updates for $JIRA_TICKET do not already exist in $RELEASE_NOTES_FILE" >&2

generate_parameterised_file_local_vars \
  "$COMPONENT_UPDATES_TEMPLATE_FILE" \
  "$COMPONENT_UPDATES_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_COMPONENT_YEAR" \
  "RELEASE_COMPONENT_WEEK" \
  "JIRA_TICKET" \
  "RELEASE_COMPONENT_START_VERSION" \
  "RELEASE_COMPONENT_END_VERSION" \
  "RELEASE_ARTIFACT_STUDIO" \
  "RELEASE_TERRAFORM_VERSION" \
  "RELEASE_MANAGEMENT_APPLIANCE" \
  "SUPER_COMPONENT_UPDATES_BODY"

insert_file_after "<ReleaseNotesVersions />" $COMPONENT_UPDATES_OUTPUT_FILE $RELEASE_NOTES_FILE
echo "✅ Component updates generated and inserted into $RELEASE_NOTES_FILE."

cleanup $COMPONENT_UPDATES_OUTPUT_FILE
