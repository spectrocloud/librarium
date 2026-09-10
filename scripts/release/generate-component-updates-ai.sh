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

if ! check_env "RELEASE_MANAGEMENT_APPLIANCE"; then
    echo "‼️  RELEASE_MANAGEMENT_APPLIANCE environment variable is not set. Please set it in your .env file. ‼️"
    exit 1
fi

# Artifact Studio and Terraform versions are optional: not every week releases these components.
# Normalize an unset variable to empty so `set -u` does not trip, and so the corresponding
# component-table row can be dropped when the version is blank (see the render step below).
RELEASE_ARTIFACT_STUDIO="${RELEASE_ARTIFACT_STUDIO:-}"
RELEASE_TERRAFORM_VERSION="${RELEASE_TERRAFORM_VERSION:-}"

# Release signal (DOC-3195). A Component Updates run is a "release run" when its base branch is a
# release branch (docs-rel-<major>-<minor>-<0|a|b|c>) rather than master. The operator picks this
# with the workflow's Base branch field, so no separate input is needed. The workflows pass the
# base branch as RELEASE_BASE_BRANCH: the generate form passes its base_branch input; the comment
# workflow reads the PR's base branch via gh. Default to master for a local or manual run.
RELEASE_BASE_BRANCH="${RELEASE_BASE_BRANCH:-master}"

# Validate the base branch: it must be master or a well-formed release branch. This mirrors the
# fast-fail guard in both workflows -- keep the regex in sync if it ever changes.
if [[ "$RELEASE_BASE_BRANCH" != "master" && ! "$RELEASE_BASE_BRANCH" =~ ^docs-rel-[0-9]+-[0-9]+-(0|a|b|c)$ ]]; then
  echo "‼️  RELEASE_BASE_BRANCH is '$RELEASE_BASE_BRANCH'; expected 'master' or 'docs-rel-<major>-<minor>-<0|a|b|c>' (for example, docs-rel-4-10-a). ‼️" >&2
  exit 1
fi

# Derive release-ness and, on a release run, the release version (docs-rel-4-10-a -> 4.10.a).
# IS_RELEASE_RUN and RELEASE_VERSION drive the release-week fold-in and appliance-table updates
# added in later phases of DOC-3195.
if [[ "$RELEASE_BASE_BRANCH" == "master" ]]; then
  IS_RELEASE_RUN=false
  RELEASE_VERSION=""
else
  IS_RELEASE_RUN=true
  RELEASE_VERSION=$(echo "$RELEASE_BASE_BRANCH" | sed -E 's/^docs-rel-([0-9]+)-([0-9]+)-(0|a|b|c)$/\1.\2.\3/')
fi

echo "ℹ️ Base branch: $RELEASE_BASE_BRANCH (release run: $IS_RELEASE_RUN${RELEASE_VERSION:+, version: $RELEASE_VERSION})"

# Confirm Super authentication up front. The token is only rejected until its owner signs
# in to Super through SSO, so checking here avoids making every issue tracker call below
# and then failing at the one call that needs Super.
if ! require_super_auth "$SUPER_ASSISTANT_ID"; then
    exit 1
fi

if [[ -z "${JIRA_TICKET:-}" ]]; then
  read -p "Specify ticket to generate component updates for (for example, DOC-2852): " JIRA_TICKET
fi

echo "ℹ️ Generating component updates for $JIRA_TICKET ..."
echo "ℹ️ Release date: $RELEASE_DATE"
echo "ℹ️ Release management appliance: $RELEASE_MANAGEMENT_APPLIANCE"
echo "ℹ️ Release artifact studio: $RELEASE_ARTIFACT_STUDIO"
echo "ℹ️ Release terraform version: $RELEASE_TERRAFORM_VERSION"

JIRA_TITLE=$(
  curl --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/issue/${JIRA_TICKET}?fields=summary" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
  | jq -r '.fields.summary'
)
# Extract the version from the JIRA title using regex. The version is expected to be in the format (YYYY-WW) where YYYY is the year and WW is the week number.
VERSION=$(echo "$JIRA_TITLE" | sed -n 's/.*(\([0-9]\{4\}-[0-9]\{2\}\)).*/\1/p')
RELEASE_COMPONENT_YEAR=${VERSION%%-*}
RELEASE_COMPONENT_WEEK=${VERSION##*-}

echo "ℹ️ JIRA ticket $JIRA_TICKET corresponds to year: $RELEASE_COMPONENT_YEAR, week: $RELEASE_COMPONENT_WEEK"

# Extract the start and end versions for the component update from the release notes file. The start version is the last heading in the release notes file that matches the pattern "## .* - Release X.Y.Z" and the end version is the first heading that matches this pattern.
RELEASE_COMPONENT_START_VERSION=$(
  grep -E '^## .* - Release [0-9]+\.[0-9]+\.[0-9]+' "$RELEASE_NOTES_FILE" |
  tail -n1 |
  sed -E 's/^## .* - Release ([0-9]+\.[0-9]+\.[0-9]+).*/\1/'
)
RELEASE_COMPONENT_END_VERSION=$(
  grep -m1 -E '^## .* - Release [0-9]+\.[0-9]+\.[0-9]+' "$RELEASE_NOTES_FILE" \
  | sed -E 's/^## .* - Release ([0-9]+\.[0-9]+\.[0-9]+).*$/\1/'
)

echo "ℹ️ Release component start version: $RELEASE_COMPONENT_START_VERSION"
echo "ℹ️ Release component end version: $RELEASE_COMPONENT_END_VERSION"

# Fetch linked issues, excluding PRM- tickets, Platone and Pack Updates tickets
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
      | select(.fields.summary | contains("[Platone]") | not)
      | select(.fields.status.name | ascii_downcase != "not a bug")
      | .key
    '
)

if (( ${#LINKED_ISSUES[@]} == 0 )); then
  echo "❌  No linked issues found for ticket: $JIRA_TICKET" >&2
  exit 1
fi

echo "ℹ️  Linked issues retrieved: ${LINKED_ISSUES[*]}"

# Fetch only Platone tickets to create the packs list in the release notes
PLATONE_ISSUES=()
while IFS= read -r issue; do
  PLATONE_ISSUES+=("$issue")
done < <(
  curl --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/issue/${JIRA_TICKET}?fields=issuelinks" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
  | jq -r '
      .fields.issuelinks[]
      | (.outwardIssue // .inwardIssue)
      | select(.fields.summary | contains("[Platone]"))
      | select(.fields.status.name | ascii_downcase != "not a bug")
      | .key
    '
)

# Find the "Pack Updates" ticket linked to the component update ticket.
PACK_UPDATES_TICKET=$(
  curl --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/issue/${JIRA_TICKET}?fields=issuelinks" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
  | jq -r '
      [ .fields.issuelinks[]
        | (.outwardIssue // .inwardIssue)
        | select(.fields.summary | contains("Pack Updates"))
        | select(.fields.status.name | ascii_downcase != "not a bug")
        | .key
      ] | first // empty
    '
)

# Fetch the child tickets of the Pack Updates ticket whose summary contains
# "[Platone]" and add them to the Platone issues list, then dedupe.
if [[ -n "$PACK_UPDATES_TICKET" ]]; then
  echo "ℹ️ Pack Updates ticket linked to $JIRA_TICKET: $PACK_UPDATES_TICKET"
  while IFS= read -r issue; do
    [[ -n "$issue" ]] && PLATONE_ISSUES+=("$issue")
  done < <(
    curl --fail-with-body \
      --get \
      --url "${JIRA_DOMAIN}/rest/api/3/search/jql" \
      --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
      --header "Accept: application/json" \
      --data-urlencode "jql=parent = ${PACK_UPDATES_TICKET}" \
      --data-urlencode "fields=summary,status" \
      --data-urlencode "maxResults=100" \
    | jq -r '
        .issues[]
        | select(.fields.summary | contains("[Platone]"))
        | select(.fields.status.name | ascii_downcase != "not a bug")
        | .key
      '
  )
else
  echo "⚠️ No Pack Updates ticket linked to $JIRA_TICKET." >&2
fi

# Dedupe the combined Platone issues list.
if (( ${#PLATONE_ISSUES[@]} > 0 )); then
  DEDUPED_ISSUES=()
  while IFS= read -r issue; do
    [[ -n "$issue" ]] && DEDUPED_ISSUES+=("$issue")
  done < <(printf '%s\n' "${PLATONE_ISSUES[@]}" | sort -u)
  PLATONE_ISSUES=("${DEDUPED_ISSUES[@]}")
fi

echo "ℹ️ Platone issues retrieved: ${PLATONE_ISSUES[*]:-}"

# Check if release notes section for this component update ticket already exists in the release notes file
COMPONENT_UPDATES_EXISTING_BODY=""

if grep -qF "$JIRA_TICKET" "$RELEASE_NOTES_FILE"; then
  echo "⚠️  Release notes for $JIRA_TICKET already exist in $RELEASE_NOTES_FILE."

  COMPONENT_UPDATES_EXISTING_BODY=$(
    awk -v ticket="$JIRA_TICKET" '
      $0 == "<!-- BEGIN COMPONENT UPDATES BODY: " ticket ". DO NOT DELETE. -->" {
        in_section = 1
        next
      }

      in_section && $0 == "<!-- END COMPONENT UPDATES BODY: " ticket ". DO NOT DELETE. -->" {
        exit
      }

      in_section {
        print
      }
    ' "$RELEASE_NOTES_FILE"
  )
fi

generate_parameterised_file_local_vars \
  "$COMPONENT_UPDATES_CROSS_LINK_TEMPLATE_FILE" \
  "$COMPONENT_UPDATES_CROSS_LINK_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_COMPONENT_YEAR" \
  "RELEASE_COMPONENT_WEEK"
generate_parameterised_file_local_vars \
  "$COMPONENT_UPDATES_HEADING_TEMPLATE_FILE" \
  "$COMPONENT_UPDATES_HEADING_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_COMPONENT_YEAR" \
  "RELEASE_COMPONENT_WEEK"

# On a release run the Component Updates block nests under the release "## ... - Release X.Y.z"
# heading, so demote its own heading one level (## -> ###). DOC-3195 Phase C. The anchor and text
# are untouched, so the existing-heading search and cross-link updates below still match.
if [[ "$IS_RELEASE_RUN" == true ]]; then
  sed -i '' '1s/^## /### /' "$COMPONENT_UPDATES_HEADING_OUTPUT_FILE"
fi

existing_notes=$(search_line "{#component-updates-$RELEASE_COMPONENT_YEAR-$RELEASE_COMPONENT_WEEK}" $RELEASE_NOTES_FILE)
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    replace_line $existing_notes $COMPONENT_UPDATES_HEADING_OUTPUT_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced component updates heading in $RELEASE_NOTES_FILE"
fi

# Search all lines containing the component updates links and update them
anchor="#component-updates-${RELEASE_COMPONENT_YEAR}-${RELEASE_COMPONENT_WEEK}"
awk -v anchor="$anchor" '
  index($0, " - Component Updates](" anchor ")") { print NR }
' "$RELEASE_NOTES_FILE" |
while IFS= read -r line_number; do
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

SUPER_RESPONSE_FILE="$(mktemp)"

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "Attempt Super POST call $i/$MAX_RETRIES..."

  HTTP_STATUS=$(
    curl -sS \
      --output "$SUPER_RESPONSE_FILE" \
      --write-out '%{http_code}' \
      --request POST \
      --url https://api.super.work/v1/super \
      --header "Authorization: Bearer ${SUPER_API_TOKEN}" \
      --header "Content-Type: application/json" \
      --data "$(jq -n --arg question "$SUPER_QUESTION" --arg assistantID "$SUPER_ASSISTANT_ID" '{question: $question, assistantId: $assistantID}')" || echo "000"
  )

  # Retrying an authentication failure never helps, because the token stays rejected until
  # its owner signs in to Super through SSO.
  if [[ "$HTTP_STATUS" == "401" || "$HTTP_STATUS" == "403" ]]; then
    echo "❌ Super rejected SUPER_API_TOKEN (HTTP $HTTP_STATUS) part way through this run. Sign in at https://app.super.work and run this script again." >&2
    rm -f "$SUPER_RESPONSE_FILE"
    exit 1
  fi

  if [[ "$HTTP_STATUS" == "200" ]]; then
    SUPER_COMPONENT_UPDATES_BODY=$(jq -r '.answer // empty' < "$SUPER_RESPONSE_FILE" 2>/dev/null || true)

    if [[ -n "$SUPER_COMPONENT_UPDATES_BODY" ]]; then
      echo "✅ Successfully retrieved component updates body from Super API."
      break
    fi

    echo "⚠️ Empty response, retrying in ${SLEEP_SECONDS}s..." >&2
  else
    echo "⚠️ Super API call failed (HTTP $HTTP_STATUS): $(head -c 300 "$SUPER_RESPONSE_FILE")" >&2
    echo "⚠️ Retrying in ${SLEEP_SECONDS}s..." >&2
  fi

  if (( i < MAX_RETRIES )); then
    sleep "$SLEEP_SECONDS"
    SLEEP_SECONDS=$((SLEEP_SECONDS * 2))
  fi

done

rm -f "$SUPER_RESPONSE_FILE"

if [[ -z "$SUPER_COMPONENT_UPDATES_BODY" ]]; then
  echo "❌ Failed to retrieve SUPER_COMPONENT_UPDATES_BODY after $MAX_RETRIES attempts" >&2
  exit 1
fi

# Strip the inline citation markers Super appends to sentences, which would otherwise be inserted
# verbatim into the release notes. Unlike the patch release notes body, this one is left otherwise
# untouched: it carries JSX and prettier-ignore regions that must reach the file exactly as written.
SUPER_COMPONENT_UPDATES_BODY=$(printf '%s\n' "$SUPER_COMPONENT_UPDATES_BODY" | strip_super_citations)

if [[ -z "$SUPER_COMPONENT_UPDATES_BODY" ]]; then
  echo "❌ Stripping citations from the Super response left an empty component updates body" >&2
  exit 1
fi

# If the release notes section for this component update ticket already exists, will replace the existing body with the new one generated by Super, otherwise will insert a new section for this component update ticket.
if grep -qF "$JIRA_TICKET" "$RELEASE_NOTES_FILE"; then
  tmp_body_file="$(mktemp)"
  printf '%s' "$SUPER_COMPONENT_UPDATES_BODY" > "$tmp_body_file"

  awk -v body_file="$tmp_body_file" -v ticket="$JIRA_TICKET" '
    {
      begin_marker = "<!-- BEGIN COMPONENT UPDATES BODY: " ticket ". DO NOT DELETE. -->"
      end_marker = "<!-- END COMPONENT UPDATES BODY: " ticket ". DO NOT DELETE. -->"
    }

    # When we hit the ticket-specific updates body marker, print it and inject new body
    $0 == begin_marker {
      print
      while ((getline line < body_file) > 0) {
        print line
      }
      close(body_file)
      skip = 1
      next
    }

    # Skip old body until we hit the ticket-specific end marker
    skip && $0 == end_marker {
      skip = 0
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

fi

if ! grep -qF "$JIRA_TICKET" "$RELEASE_NOTES_FILE"; then

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

  # Artifact Studio and Terraform are optional. When their version is blank, drop the matching
  # component-table row(s) rather than emit an empty version cell (which reads as an error).
  # RELEASE_TERRAFORM_VERSION feeds BOTH the Terraform and Crossplane rows. The metadata HTML
  # comments above the table keep the (empty) value so the comment-triggered refresh round-trips.
  if [[ -z "$RELEASE_ARTIFACT_STUDIO" ]]; then
    remove_line_containing "[Artifact Studio]" "$COMPONENT_UPDATES_OUTPUT_FILE" || true
  fi
  if [[ -z "$RELEASE_TERRAFORM_VERSION" ]]; then
    remove_line_containing "Spectro Cloud Terraform provider" "$COMPONENT_UPDATES_OUTPUT_FILE" || true
    remove_line_containing "Spectro Cloud Crossplane provider" "$COMPONENT_UPDATES_OUTPUT_FILE" || true
  fi

  if [[ "$IS_RELEASE_RUN" == true ]]; then
    # Release run: fold the block into the release section. Demote its heading one level (## -> ###)
    # so it nests under the release "##", then replace the {{ WEEKLY_COMPONENT_RELEASE_UPDATES }}
    # placeholder the release scaffold left (see scripts/release/templates/release-notes.md) instead
    # of adding a new top-level section after <ReleaseNotesVersions />. The block carries its own
    # "### Packs" (with markers keyed to the component-updates ticket), so the scaffold's markerless
    # "### Packs" was removed to leave a single packs table. DOC-3195 Phase C.
    sed -i '' '1s/^## /### /' "$COMPONENT_UPDATES_OUTPUT_FILE"
    placeholder_line=$(search_line "{{ WEEKLY_COMPONENT_RELEASE_UPDATES }}" "$RELEASE_NOTES_FILE")
    if [[ -z "$placeholder_line" || "$placeholder_line" -eq 0 ]]; then
      echo "❌ Release run, but the {{ WEEKLY_COMPONENT_RELEASE_UPDATES }} placeholder was not found in $RELEASE_NOTES_FILE. Was the release scaffold generated from the updated template?" >&2
      exit 1
    fi
    replace_line "$placeholder_line" "$COMPONENT_UPDATES_OUTPUT_FILE" "$RELEASE_NOTES_FILE"
    echo "✅ Component updates folded into the release section at the placeholder in $RELEASE_NOTES_FILE."
  else
    insert_file_after "<ReleaseNotesVersions />" $COMPONENT_UPDATES_OUTPUT_FILE $RELEASE_NOTES_FILE
    echo "✅ Component updates generated and inserted into $RELEASE_NOTES_FILE."
  fi
  cleanup $COMPONENT_UPDATES_OUTPUT_FILE

fi

# ---------------------------------------------------------------------------------------------------
# Appliance Kubernetes Requirements tables (DOC-3195 Phase D).
#
# On a release run that coincides with a Management Appliance release, prepend a newest-first row to
# the Palette and VerteX "... Management Appliance" Kubernetes Requirements tables. The Palette Version
# column is RELEASE_MANAGEMENT_APPLIANCE (a form input); the Kubernetes Version is derived from the
# spectro-appliance-builder RC values so it is never transcribed by hand. A RELEASE_MANAGEMENT_APPLIANCE
# of "NA" or empty means no appliance shipped this release, so the tables are left untouched. Deriving
# the version and comparing it against the current top row also makes reruns idempotent.
# ---------------------------------------------------------------------------------------------------

APPLIANCE_BUILDER_REPO="spectrocloud/spectro-appliance-builder"
APPLIANCE_BUILDER_REF="main"
INSTALL_PALETTE_FILE="docs/docs-content/enterprise-version/install-palette/install-palette.md"
INSTALL_VERTEX_FILE="docs/docs-content/vertex/install-palette-vertex/install-palette-vertex.md"

# Derive the Kubernetes version from a spectro-appliance-builder k8s.yaml. Prefer the explicit
# kubernetesVersion field; fall back to the kube-apiserver image tag. Strips the leading v.
derive_appliance_k8s_version() {
  local values_path="$1" contents k8s
  contents=$(fetch_github_file "$APPLIANCE_BUILDER_REPO" "$APPLIANCE_BUILDER_REF" "$values_path") || return 1
  k8s=$(printf '%s\n' "$contents" | grep -m1 -E '^[[:space:]]*kubernetesVersion:' | sed -E 's/.*kubernetesVersion:[[:space:]]*v?([0-9]+\.[0-9]+\.[0-9]+).*/\1/')
  if [[ -z "$k8s" ]]; then
    k8s=$(printf '%s\n' "$contents" | grep -m1 -E 'kube-apiserver:v?[0-9]+\.[0-9]+\.[0-9]+' | sed -E 's/.*kube-apiserver:v?([0-9]+\.[0-9]+\.[0-9]+).*/\1/')
  fi
  [[ -n "$k8s" ]] || return 1
  printf '%s' "$k8s"
}

# Read the top data row's Palette Version cell from an appliance Kubernetes Requirements table (the
# table whose header row carries both "Palette Version" and "Kubernetes Version").
appliance_table_top_version() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  awk '
    !in_table && /^\|/ && index($0, "Palette Version") && index($0, "Kubernetes Version") { in_table = 1; next }
    !in_table { next }
    /^\|[[:space:]]*-+/ { next }
    !/^\|/ { exit }
    { split($0, cells, "|"); v = cells[2]; gsub(/\*/, "", v); gsub(/^[[:space:]]+|[[:space:]]+$/, "", v); print v; exit }
  ' "$file"
}

# Prepend "| <appliance> | <k8s> |" directly after the appliance table's header separator row.
prepend_appliance_row() {
  local file="$1" appliance="$2" k8s="$3" tmp
  tmp="$(mktemp)"
  awk -v appliance="$appliance" -v k8s="$k8s" '
    done { print; next }
    { print }
    /^\|/ && index($0, "Palette Version") && index($0, "Kubernetes Version") { in_appliance = 1; next }
    in_appliance && /^\|[[:space:]]*-+/ { print "| " appliance " | " k8s " |"; done = 1; in_appliance = 0 }
  ' "$file" > "$tmp" && mv "$tmp" "$file"
}

update_appliance_table() {
  local edition_label="$1" file="$2" values_path="$3" k8s top
  if ! k8s=$(derive_appliance_k8s_version "$values_path"); then
    echo "⚠️ Could not derive the $edition_label Kubernetes version from $APPLIANCE_BUILDER_REPO ($values_path); leaving $file unchanged." >&2
    return 0
  fi
  top=$(appliance_table_top_version "$file")
  if [[ "$top" == "$RELEASE_MANAGEMENT_APPLIANCE" ]]; then
    echo "ℹ️ $edition_label appliance table already lists $RELEASE_MANAGEMENT_APPLIANCE; no change."
    return 0
  fi
  prepend_appliance_row "$file" "$RELEASE_MANAGEMENT_APPLIANCE" "$k8s"
  npx prettier --write "$file" >/dev/null 2>&1 || true
  echo "✅ Prepended $RELEASE_MANAGEMENT_APPLIANCE / $k8s to the $edition_label appliance table in $file."
}

if [[ "$IS_RELEASE_RUN" == true && -n "$RELEASE_MANAGEMENT_APPLIANCE" && "$RELEASE_MANAGEMENT_APPLIANCE" != "NA" ]]; then
  echo "ℹ️ Release run with Management Appliance $RELEASE_MANAGEMENT_APPLIANCE; checking the appliance Kubernetes Requirements tables."
  update_appliance_table "Palette" "$INSTALL_PALETTE_FILE" "values-yaml/rc/palette-values/k8s.yaml"
  update_appliance_table "VerteX" "$INSTALL_VERTEX_FILE" "values-yaml/rc/vertex-values/k8s.yaml"
fi

# Process the Platone issues to generate the packs list in the release notes
if (( ${#PLATONE_ISSUES[@]} == 0 )); then
  echo "ℹ️  No Platone issues found for ticket: $JIRA_TICKET. Nothing to do here." >&2
  exit 0
fi

PACKS_LIST_FILE="$(mktemp)"
TMP_PACKS="$(mktemp)"

cleanup_tmp_packs() {
  rm -f "$PACKS_LIST_FILE" "$TMP_PACKS"
}
trap cleanup_tmp_packs EXIT

for issue in "${PLATONE_ISSUES[@]}"; do
  issue_name=$(
    curl --fail-with-body \
      -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
      -H "Accept: application/json" \
      "${JIRA_DOMAIN}/rest/api/3/issue/$issue" \
      | jq -r '.fields.summary'
  )

  if [[ "$issue_name" =~ ^\[([^]]+)\]\ ([^[:space:]]+)\ ([0-9]+\.[0-9]+\.[0-9]+)\ ·\ week\ ([0-9]{4}-[0-9]{2})\ ·\ ([^[:space:]]+)\ ·\ (non-FIPS|FIPS)$ ]]; then
    pack_name="${BASH_REMATCH[2]}"
    version="${BASH_REMATCH[3]}"
    layer="${BASH_REMATCH[5]}"
    variant="${BASH_REMATCH[6]}"

    # Remove trailing -fips so FIPS/non-FIPS variants can be merged
    normalized_pack="${pack_name%-fips}"

    printf '%s\t%s\t%s\t%s\n' \
      "$normalized_pack" \
      "$layer" \
      "$version" \
      "$variant" >> "$TMP_PACKS"
  else
    echo "⚠️ Skipping issue $issue because summary does not match expected format: $issue_name" >&2
  fi
done

{
  echo "<!-- prettier-ignore-start -->"
  echo ""
  echo "| Pack Name | Layer | Non-FIPS | FIPS | New Version |"
  echo "| --------- | ----- | -------- | ---- | ----------- |"

  awk -F'\t' '
  {
    key = $1 "|" $3

    pack[key] = $1
    layer[key] = $2
    version[key] = $3

    if ($4 == "non-FIPS") {
      nonfips[key] = ":white_check_mark:"
    } else if ($4 == "FIPS") {
      fips[key] = ":white_check_mark:"
    }
  }

  END {
    for (key in pack) {
      if (key in nonfips) {
        nf = nonfips[key]
      } else {
        nf = ":x:"
      }

      if (key in fips) {
        fp = fips[key]
      } else {
        fp = ":x:"
      }

      printf "| <VersionedLink text=\"%s\" url=\"/integrations/packs/?pack=%s\" /> | `%s` | %s | %s | %s |\n",
        pack[key],
        pack[key],
        layer[key],
        nf,
        fp,
        version[key]
    }
  }' "$TMP_PACKS" | sort

  echo ""
  echo "<!-- prettier-ignore-end -->"
  echo ""
} > "$PACKS_LIST_FILE"

awk -v body_file="$PACKS_LIST_FILE" -v ticket="$JIRA_TICKET" '
  BEGIN {
    begin_marker = "<!-- BEGIN PACKS LIST BODY: " ticket ". DO NOT DELETE. -->"
    end_marker   = "<!-- END PACKS LIST BODY: " ticket ". DO NOT DELETE. -->"
  }

  $0 == begin_marker {
    print
    while ((getline line < body_file) > 0) {
      print line
    }
    close(body_file)
    skip = 1
    next
  }

  skip && $0 == end_marker {
    skip = 0
    print
    next
  }

  skip {
    next
  }

  {
    print
  }
  ' "$RELEASE_NOTES_FILE" > "${RELEASE_NOTES_FILE}.tmp" \
    && mv "${RELEASE_NOTES_FILE}.tmp" "$RELEASE_NOTES_FILE"

echo "✅ Packs list updated for $JIRA_TICKET in $RELEASE_NOTES_FILE."