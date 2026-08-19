#!/bin/bash

# Enable error handling
set -euo pipefail

# Import utility functions
source scripts/release/utilities.sh
source .env

JIRA_DOMAIN=https://spectrocloud.atlassian.net/
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
PATCH_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes.md"
PATCH_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-output.md"
SUPER_ASSISTANT_ID="8fxCluEt-1T6w_" # ID for the assistant configured to write patch release notes based on Jira issues
MAX_RETRIES=5
SLEEP_SECONDS=2

# Component version handling. A patch ticket asks whether the CanvOS (stylus) and Palette CLI
# (palette-cli) versions moved in this patch; nickfury is the source of truth for both, and the
# Edge Compatibility Matrix records what is currently documented.
EDGE_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes-edge.md"
EDGE_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-edge-output.md"
AUTOMATION_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes-automation.md"
AUTOMATION_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-automation-output.md"
EDGE_COMPATIBILITY_MATRIX_FILE="${EDGE_COMPATIBILITY_MATRIX_FILE:-docs/docs-content/clusters/edge/edge-compatibility-matrix.md}"
DOWNLOADS_FILE="${DOWNLOADS_FILE:-docs/docs-content/downloads/cli-tools.md}"
NICKFURY_REPO="spectrocloud/nickfury"
NICKFURY_VERSIONS_PATH="release/spectro_versions.txt"
# Columns in the Edge Compatibility Matrix table that hold the versions to compare against.
MATRIX_CANVOS_COLUMN=2
MATRIX_PALETTE_CLI_COLUMN=3
# Markers written in place of a value that is not known yet. Each names what is missing, so a
# reviewer can see which cells still need filling and can grep the docs for "PENDING".
PENDING_VERSION="VERSION PENDING"
PENDING_URL="URL PENDING"
PENDING_SHA="SHA PENDING"

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

# Confirm Super authentication up front. The token is only rejected until its owner signs
# in to Super through SSO, so checking here avoids making every issue tracker call below
# and then failing at the one call that needs Super.
if ! require_super_auth "$SUPER_ASSISTANT_ID"; then
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
  first(
    .fields.description
    | ..
    | objects
    | select(.type=="text" and (.text | ascii_downcase)=="list of candidates")
    | .marks[]?
    | select(.type=="link")
    | .attrs.href
  ) // empty
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

# Bail out on a missing due date rather than guessing one. On macOS the GNU fallback below
# reads `date -d ""` as the daylight saving time flag and silently returns today's date,
# which would date the release notes wrongly instead of failing.
if [[ -z "$END_DATE" ]]; then
  echo "❌  No 'duedate <= \"YYYY-MM-DD\"' clause found in the candidates JQL" >&2
  exit 1
fi

# Try parsing with BSD date first (macOS), fallback to GNU date (Linux)
if date -j -f "%Y-%m-%d" "$END_DATE" +"%B %-d, %Y" >/dev/null 2>&1; then
  RELEASE_DATE=$(date -j -f "%Y-%m-%d" "$END_DATE" +"%B %-d, %Y")
else
  RELEASE_DATE=$(date -d "$END_DATE" +"%B %-d, %Y")
fi

# The fixVersion in the candidates JQL is often still a placeholder such as "4.9.x", so it
# only seeds the release heading. The prompt below confirms the real version.
RELEASE_PATCH=$(printf '%s' "$JQL" | sed -n 's/.*fixVersion IN (\([^)]*\)).*/\1/p')

if [[ -z "$RELEASE_PATCH" ]]; then
  echo "❌  No 'fixVersion IN (...)' clause found in the candidates JQL" >&2
  exit 1
fi

echo "ℹ️  Extracted release date: $RELEASE_DATE."
echo "ℹ️  Extracted release patch: $RELEASE_PATCH."

# Reading nickfury needs a token that can see a private repository. Resolve it before prompting for
# anything, so the run states up front whether the component versions can be looked up at all,
# rather than asking for a version and then quietly ignoring it.
#
# GITHUB_TOKEN comes from .env for a local run and from the workflow environment in CI. When it is
# absent, fall back to the token the GitHub CLI already holds, which is usually signed in to the
# organisation on a writer's machine.
if [[ -z "${GITHUB_TOKEN:-}" ]] && command -v gh >/dev/null 2>&1; then
  GITHUB_TOKEN="$(gh auth token 2>/dev/null || true)"

  if [[ -n "$GITHUB_TOKEN" ]]; then
    export GITHUB_TOKEN
    echo "ℹ️  GITHUB_TOKEN is not set, so the GitHub CLI token from 'gh auth token' is used to read $NICKFURY_REPO."
  fi
fi

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "⚠️  No GitHub token is available, so $NICKFURY_REPO cannot be read and the CanvOS and Palette CLI versions are not looked up. Add 'export GITHUB_TOKEN=<token>' to your .env file, or run 'gh auth login', then re-run this script. 'make init-release' adds the .env placeholder." >&2
else
  echo "ℹ️  Component versions will be read from $NICKFURY_REPO."
fi

# Confirm the patch release version. It heads the new release notes section, and it is the key the
# documentation pages record the CanvOS and Palette CLI versions against. A placeholder such as
# 4.9.x is a valid answer while the real version is still being decided.
#
# Every prompt below is skipped when its environment variable is already set, and when there is no
# terminal to prompt on, so the same script still runs unattended in CI.
RELEASE_PATCH_VERSION="${PATCH_RELEASE_VERSION:-}"

if [[ -z "$RELEASE_PATCH_VERSION" && -t 0 ]]; then
  echo "ℹ️  The patch release version heads the new release notes section. A placeholder such as"
  echo "    $RELEASE_PATCH is fine while the real version is still being decided."

  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    echo "    A follow-up prompt then asks for the $NICKFURY_REPO branch or tag that holds the CanvOS"
    echo "    and Palette CLI versions for it. The version and that ref name are separate values."
  fi

  read -p "Specify the Palette patch release version, for example 4.9.48 or the $RELEASE_PATCH placeholder [$RELEASE_PATCH]: " RELEASE_PATCH_VERSION
fi

# Pressing Enter, and an unattended run with no version supplied, both accept the version the
# candidates JQL reported. That is usually a placeholder such as 4.9.x, which is a valid answer.
if [[ -z "$RELEASE_PATCH_VERSION" ]]; then
  RELEASE_PATCH_VERSION="$RELEASE_PATCH"
fi

# A version is either a real patch release, such as 4.9.48, or a placeholder standing in for one,
# such as 4.9.x. Both are accepted, but only a real version can name a download or be compared
# against a published component version.
if [[ ! "$RELEASE_PATCH_VERSION" =~ ^[0-9]+\.[0-9]+\.[^[:space:]]+$ ]]; then
  echo "❌  '$RELEASE_PATCH_VERSION' is not a Palette patch release version or placeholder, for example 4.9.48 or 4.9.x." >&2
  exit 1
fi

RELEASE_PATCH="$RELEASE_PATCH_VERSION"

if [[ "$RELEASE_PATCH" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
  RELEASE_PATCH_IS_PLACEHOLDER=false
  echo "ℹ️  Using confirmed patch release version: $RELEASE_PATCH."
else
  RELEASE_PATCH_IS_PLACEHOLDER=true
  echo "ℹ️  Using the patch release version placeholder: $RELEASE_PATCH."
fi

RELEASE_CANVOS=""
RELEASE_PALETTE_CLI_VERSION=""

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  # The release engineers hand over a branch or a tag, and neither is named after the patch
  # release version alone: a branch is "release-<version>" and a tag is "v<version>", where a
  # tag can also carry an "-rc.N" release candidate suffix. Ask for that name directly rather
  # than guessing it from the version, because the two do not always correspond. For example,
  # Palette 4.9.47 can be built from tag v4.9.47-rc.2 or from branch release-4.9.
  if [[ -z "${NICKFURY_REF:-}" && -t 0 ]]; then
    echo "ℹ️  Component versions come from $NICKFURY_REPO, whose refs are named:"
    echo "      branch  release-<version>   for example, release-4.9 or release-$RELEASE_PATCH"
    echo "      tag     v<version>          for example, v$RELEASE_PATCH or v$RELEASE_PATCH-rc.2"
    read -p "Specify the $NICKFURY_REPO branch or tag name, or leave blank to record the versions as pending: " NICKFURY_REF
  fi

  # Accept a ref pasted in full, for example "refs/tags/v4.9.47-rc.2", and tolerate stray
  # whitespace, so a value copied from a release ticket does not have to be tidied by hand.
  NICKFURY_REF="$(printf '%s' "${NICKFURY_REF:-}" | tr -d '[:space:]')"
  NICKFURY_REF="${NICKFURY_REF#refs/tags/}"
  NICKFURY_REF="${NICKFURY_REF#refs/heads/}"

  # An empty candidate list is expressed as a flag rather than an empty array, because expanding
  # an empty array trips "unbound variable" under the bash 3.2 that ships with macOS.
  NICKFURY_LOOKUP=true

  if [[ -z "$NICKFURY_REF" ]]; then
    # Nothing given, so the component versions stay pending and the lookup is not attempted.
    NICKFURY_LOOKUP=false
    NICKFURY_REF_CANDIDATES=("")
    echo "ℹ️  No branch or tag given, so the component versions are recorded as pending."
  elif [[ "$NICKFURY_REF" == v* || "$NICKFURY_REF" == release-* ]]; then
    # Already a ref name, so use exactly what was given.
    NICKFURY_REF_CANDIDATES=("$NICKFURY_REF")
  else
    # A bare version was given rather than a ref name, so try both conventions for it.
    echo "ℹ️  '$NICKFURY_REF' is a version rather than a ref name, so both naming conventions are tried."
    NICKFURY_REF_CANDIDATES=("v$NICKFURY_REF" "release-$NICKFURY_REF")
  fi

  NICKFURY_VERSIONS=""

  if [[ "$NICKFURY_LOOKUP" == true ]]; then
    for ref in "${NICKFURY_REF_CANDIDATES[@]}"; do
      if NICKFURY_VERSIONS=$(fetch_github_file "$NICKFURY_REPO" "$ref" "$NICKFURY_VERSIONS_PATH") &&
         [[ -n "$NICKFURY_VERSIONS" ]]; then
        NICKFURY_REF="$ref"
        break
      fi

      echo "⚠️  Could not read $NICKFURY_VERSIONS_PATH from $NICKFURY_REPO@$ref." >&2
      NICKFURY_VERSIONS=""
    done

    if [[ -z "$NICKFURY_VERSIONS" ]]; then
      echo "⚠️  No component versions available from $NICKFURY_REPO, so they are recorded as pending. Confirm the branch or tag name with the release engineers: a branch is named release-<version> and a tag v<version>, optionally with an -rc.N suffix. Then re-run with NICKFURY_REF set to that name." >&2
    fi
  fi

  if [[ -n "$NICKFURY_VERSIONS" ]]; then
    RELEASE_CANVOS=$(printf '%s\n' "$NICKFURY_VERSIONS" | get_keyed_value "stylus" || true)
    RELEASE_PALETTE_CLI_VERSION=$(printf '%s\n' "$NICKFURY_VERSIONS" | get_keyed_value "palette-cli" || true)
    NICKFURY_SELF_VERSION=$(printf '%s\n' "$NICKFURY_VERSIONS" | get_keyed_value "nickfury" || true)

    if [[ -n "$NICKFURY_SELF_VERSION" && "$NICKFURY_SELF_VERSION" != "$RELEASE_PATCH" ]]; then
      echo "⚠️  $NICKFURY_REPO@$NICKFURY_REF reports version '$NICKFURY_SELF_VERSION' but the patch release version is '$RELEASE_PATCH'. Confirm that the branch or tag matches the patch release."
    fi

    echo "ℹ️  Sourced component versions from $NICKFURY_REPO@$NICKFURY_REF (stylus=$RELEASE_CANVOS, palette-cli=$RELEASE_PALETTE_CLI_VERSION)."

    # A release candidate ref carries prerelease component versions, which must not reach the
    # published documentation. Warn loudly rather than stopping, so the notes can still be
    # drafted ahead of the final tag.
    if [[ "$RELEASE_CANVOS" == *-rc* || "$RELEASE_PALETTE_CLI_VERSION" == *-rc* ]]; then
      echo "⚠️  $NICKFURY_REPO@$NICKFURY_REF holds release candidate component versions. Re-run against the final release branch or tag before merging."
    fi
  fi
fi

# Whatever is still unknown is recorded as pending rather than omitted, so the release notes and
# the tables are scaffolded on the first run and only need their values corrected later. Each
# marker names what is missing, so the placeholders are easy to spot and to grep for.
if [[ -z "$RELEASE_CANVOS" ]]; then
  RELEASE_CANVOS="$PENDING_VERSION"
fi

if [[ -z "$RELEASE_PALETTE_CLI_VERSION" ]]; then
  RELEASE_PALETTE_CLI_VERSION="$PENDING_VERSION"
fi

# Only document a component whose version actually moved. A patch release often ships the same
# CanvOS and Palette CLI as the release before it, and restating an unchanged version would add a
# release note and a table row that say nothing new. The comparison skips any row this script has
# already written for this version, so a re-run compares against the previous release rather than
# against its own output.
# The table rows this script writes are anchored on the release version, so a run that confirms a
# version after an earlier run scaffolded a placeholder would leave the placeholder row behind. The
# version each section was last generated with is recorded alongside its ticket marker, so a change
# can be detected and the superseded rows removed further down.
PREVIOUS_RELEASE_PATCH=$(awk -v ticket="$PATCH_RELEASE_TICKET" -v marker="<!-- PATCH RELEASE VERSION: " '
  $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" { in_section = 1; next }
  in_section && /^## [^#]/ { exit }
  in_section && index($0, marker) == 1 {
    value = substr($0, length(marker) + 1)
    sub(/ -->[ \t]*$/, "", value)
    print value
    exit
  }
' "$RELEASE_NOTES_FILE" || true)

if [[ -n "$PREVIOUS_RELEASE_PATCH" && "$PREVIOUS_RELEASE_PATCH" != "$RELEASE_PATCH" ]]; then
  echo "ℹ️  $PATCH_RELEASE_TICKET was last generated for $PREVIOUS_RELEASE_PATCH, so its rows are superseded by $RELEASE_PATCH."
fi

CANVOS_CHANGED=false
PALETTE_CLI_CHANGED=false

DOCUMENTED_CANVOS=$(get_documented_table_version \
  "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_CANVOS_COLUMN" "$RELEASE_PATCH")
DOCUMENTED_PALETTE_CLI=$(get_documented_table_version \
  "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_PALETTE_CLI_COLUMN" "$RELEASE_PATCH")

# A pending version is always written, because the point of recording it is to scaffold the entry
# that a later run fills in. Only a known version is worth comparing against what is published.
if [[ "$RELEASE_CANVOS" == "$PENDING_VERSION" ]]; then
  CANVOS_CHANGED=true
elif [[ "$RELEASE_CANVOS" != "$DOCUMENTED_CANVOS" ]]; then
  CANVOS_CHANGED=true
  echo "ℹ️  CanvOS moved from $DOCUMENTED_CANVOS to $RELEASE_CANVOS."
fi

if [[ "$RELEASE_PALETTE_CLI_VERSION" == "$PENDING_VERSION" ]]; then
  PALETTE_CLI_CHANGED=true
elif [[ "$RELEASE_PALETTE_CLI_VERSION" != "$DOCUMENTED_PALETTE_CLI" ]]; then
  PALETTE_CLI_CHANGED=true
  echo "ℹ️  The Palette CLI moved from $DOCUMENTED_PALETTE_CLI to $RELEASE_PALETTE_CLI_VERSION."
fi

if [[ "$CANVOS_CHANGED" == false && "$PALETTE_CLI_CHANGED" == false ]]; then
  echo "ℹ️  CanvOS ($RELEASE_CANVOS) and the Palette CLI ($RELEASE_PALETTE_CLI_VERSION) are unchanged from the documented versions, so no Edge or Automation notes are added."
fi

# The downloads table also needs the binary's checksum, which nickfury does not carry. A checksum
# only ever matches one build, so the RELEASE_PALETTE_CLI_SHA that .env holds for the current named
# release is deliberately ignored here: pairing it with a different Palette CLI version would
# publish a checksum that does not verify. PATCH_PALETTE_CLI_SHA is the override for this script.
RELEASE_PALETTE_CLI_SHA="${PATCH_PALETTE_CLI_SHA:-}"

RELEASE_PALETTE_CLI_URL=""

if [[ "$PALETTE_CLI_CHANGED" == true ]]; then
  # A pending version names no binary, so there is nothing to prompt for or download.
  if [[ "$RELEASE_PALETTE_CLI_VERSION" != "$PENDING_VERSION" ]]; then
    if [[ -z "$RELEASE_PALETTE_CLI_SHA" && -t 0 ]]; then
      read -p "Specify the SHA256 checksum for Palette CLI $RELEASE_PALETTE_CLI_VERSION, or leave blank to derive it from the published binary: " RELEASE_PALETTE_CLI_SHA
    fi

    # The helper checks that the binary is published before transferring it, so an unreleased
    # version costs one request rather than a download that cannot succeed.
    if [[ -z "$RELEASE_PALETTE_CLI_SHA" ]]; then
      RELEASE_PALETTE_CLI_SHA=$(fetch_palette_cli_sha "$RELEASE_PALETTE_CLI_VERSION") || RELEASE_PALETTE_CLI_SHA=""
    fi

    if [[ -n "$RELEASE_PALETTE_CLI_SHA" && ! "$RELEASE_PALETTE_CLI_SHA" =~ ^[0-9a-f]{64}$ ]]; then
      echo "⚠️  '$RELEASE_PALETTE_CLI_SHA' is not a SHA256 checksum, so it is ignored." >&2
      RELEASE_PALETTE_CLI_SHA=""
    fi

    RELEASE_PALETTE_CLI_URL="https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/linux/cli/palette"
  fi

  # The row is still written when the checksum or the version is unknown, so the entry exists and
  # only its pending cells need filling once the binary is published.
  if [[ -z "$RELEASE_PALETTE_CLI_SHA" ]]; then
    RELEASE_PALETTE_CLI_SHA="$PENDING_SHA"
    echo "ℹ️  No checksum available for the Palette CLI yet, so the CLI Tools row records '$PENDING_SHA'. Re-run with PATCH_PALETTE_CLI_SHA set, or once the binary is published, to fill it in."
  fi

  if [[ -z "$RELEASE_PALETTE_CLI_URL" ]]; then
    RELEASE_PALETTE_CLI_URL="$PENDING_URL"
  fi
fi

# Fetch issues
ISSUE_RESPONSE=$(curl -s --fail-with-body \
  --url "${JIRA_DOMAIN}/rest/api/3/search/jql" \
  --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json" \
  --get \
  --data-urlencode "jql=${JQL}" \
  --data-urlencode "fields=status" \
  --data-urlencode "maxResults=100")

ISSUE_KEYS=()
for id in $(echo "$ISSUE_RESPONSE" | jq -r '
  .issues[]
  | select(.fields.status.name | ascii_downcase != "not a bug")
  | .id
'); do
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

  # Drop any Edge and Automation sections a previous run generated. They are rebuilt from a
  # template further down, and passing them to Super as context invites it to restate or
  # rewrite the component versions in its own answer.
  RELEASE_PATCH_EXISTING_BODY=$(printf '%s\n' "$RELEASE_PATCH_EXISTING_BODY" | awk '
    /^### (Edge|Automation)[ \t]*$/ { skip=1; next }
    skip && /^#/ { skip=0 }
    skip { next }
    { print }
  ')
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

RESPONSE_FILE="$(mktemp)"
trap 'rm -f "$RESPONSE_FILE"' EXIT

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "Attempt Super POST call $i/$MAX_RETRIES..."

  HTTP_STATUS=$(
    curl -sS \
      --output "$RESPONSE_FILE" \
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
    exit 1
  fi

  if [[ "$HTTP_STATUS" == "200" ]]; then
    SUPER_BUG_FIXES_BODY=$(jq -r '.answer // empty' < "$RESPONSE_FILE" 2>/dev/null || true)

    if [[ -n "$SUPER_BUG_FIXES_BODY" ]]; then
      echo "✅ Successfully retrieved bug fixes body from Super API."
      break
    fi

    echo "⚠️ Empty response, retrying in ${SLEEP_SECONDS}s..." >&2
  else
    echo "⚠️ Super API call failed (HTTP $HTTP_STATUS): $(head -c 300 "$RESPONSE_FILE")" >&2
    echo "⚠️ Retrying in ${SLEEP_SECONDS}s..." >&2
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

# A pending marker is written as inline code in prose, because Prettier reflows a release note to
# 120 columns and would otherwise split "VERSION PENDING" across two lines. A real version needs no
# such treatment, so the note-facing values differ from the table-facing ones only when pending.
if [[ "$RELEASE_CANVOS" == "$PENDING_VERSION" ]]; then
  RELEASE_CANVOS_NOTE="\`$RELEASE_CANVOS\`"
else
  RELEASE_CANVOS_NOTE="$RELEASE_CANVOS"
fi

if [[ "$RELEASE_PALETTE_CLI_VERSION" == "$PENDING_VERSION" ]]; then
  RELEASE_PALETTE_CLI_VERSION_NOTE="\`$RELEASE_PALETTE_CLI_VERSION\`"
else
  RELEASE_PALETTE_CLI_VERSION_NOTE="$RELEASE_PALETTE_CLI_VERSION"
fi

# Append the component version sections to Super's answer, so that both the insert and the update
# path below carry them without any extra handling. This happens before the body is normalised so
# that Prettier wraps these sentences to the same width as the rest of the notes. The citation
# stripper only matches brace-wrapped markers, so it cannot alter them.
if [[ "$CANVOS_CHANGED" == true ]]; then
  generate_parameterised_file_local_vars \
    "$EDGE_NOTES_TEMPLATE_FILE" \
    "$EDGE_NOTES_OUTPUT_FILE" \
    "RELEASE_PATCH" \
    "RELEASE_CANVOS_NOTE"

  SUPER_BUG_FIXES_BODY="$SUPER_BUG_FIXES_BODY"$'\n\n'"$(cat "$EDGE_NOTES_OUTPUT_FILE")"
  cleanup "$EDGE_NOTES_OUTPUT_FILE"
  echo "ℹ️  Added an Edge section for CanvOS $RELEASE_CANVOS."
fi

if [[ "$PALETTE_CLI_CHANGED" == true ]]; then
  generate_parameterised_file_local_vars \
    "$AUTOMATION_NOTES_TEMPLATE_FILE" \
    "$AUTOMATION_NOTES_OUTPUT_FILE" \
    "RELEASE_PATCH" \
    "RELEASE_PALETTE_CLI_VERSION_NOTE"

  SUPER_BUG_FIXES_BODY="$SUPER_BUG_FIXES_BODY"$'\n\n'"$(cat "$AUTOMATION_NOTES_OUTPUT_FILE")"
  cleanup "$AUTOMATION_NOTES_OUTPUT_FILE"
  echo "ℹ️  Added an Automation section for Palette CLI $RELEASE_PALETTE_CLI_VERSION."
fi

# Super's answer is inserted verbatim, so normalise it before it reaches the release notes: drop the
# inline citation markers the assistant appends to sentences, and restore the blank lines and prose
# wrapping the published notes use. Prettier cannot repair either afterwards, because .prettierrc
# parses *.md as MDX and the MDX parser leaves prose exactly as written.
SUPER_BUG_FIXES_BODY=$(printf '%s\n' "$SUPER_BUG_FIXES_BODY" | normalize_super_body)

if [[ -z "$SUPER_BUG_FIXES_BODY" ]]; then
  echo "❌ Normalising the Super response left an empty bug fixes body" >&2
  exit 1
fi

# Propagate the component versions to the other documentation pages that record them, reusing the
# scripts `make generate-release` runs so the tables keep one format and one insert-or-replace
# behaviour. The release is keyed on the patch version, so each page gains a row anchored to it and
# a re-run replaces that row instead of adding a second one.
if [[ "$CANVOS_CHANGED" == true || "$PALETTE_CLI_CHANGED" == true ]]; then
  export RELEASE_NAME="$RELEASE_PATCH"
  export RELEASE_VERSION="$RELEASE_PATCH"
  export RELEASE_CANVOS
  export RELEASE_PALETTE_CLI_VERSION
  export NICKFURY_REF
  # The Edge matrix script sources .env when run on its own, which would put the release-wide
  # CanvOS and Palette CLI versions back over the ones resolved above.
  export RELEASE_SKIP_DOTENV=true
  # It also reads nickfury itself. The lookup already happened above, so repeating it here would
  # either waste a request or, when the versions are pending, replace them with values the release
  # notes do not mention.
  export RELEASE_SKIP_NICKFURY=true

  # Drop the rows an earlier run wrote for a version that has since changed, so a confirmed version
  # replaces its placeholder rather than sitting alongside it.
  if [[ -n "$PREVIOUS_RELEASE_PATCH" && "$PREVIOUS_RELEASE_PATCH" != "$RELEASE_PATCH" ]]; then
    if remove_line_containing "edge-compat-$PREVIOUS_RELEASE_PATCH -->" "$EDGE_COMPATIBILITY_MATRIX_FILE"; then
      echo "✅ Removed the superseded $PREVIOUS_RELEASE_PATCH row from $EDGE_COMPATIBILITY_MATRIX_FILE."
    fi

    if remove_line_containing "cli-$PREVIOUS_RELEASE_PATCH -->" "$DOWNLOADS_FILE"; then
      echo "✅ Removed the superseded $PREVIOUS_RELEASE_PATCH row from $DOWNLOADS_FILE."
    fi
  fi

  ./scripts/release/generate-edge-compatibility-matrix.sh

  if [[ "$PALETTE_CLI_CHANGED" == true ]]; then
    ./scripts/release/generate-install-palette-cli.sh

    export RELEASE_PALETTE_CLI_SHA
    export RELEASE_PALETTE_CLI_URL
    ./scripts/release/generate-downloads.sh
  fi
fi


# If the release notes section for this patch already exists, will replace the existing body with the new one generated by Super, otherwise will insert a new section for this patch release.
if grep -qF "$PATCH_RELEASE_TICKET" "$RELEASE_NOTES_FILE"; then
  tmp_body_file="$(mktemp)"
  printf '%s' "$SUPER_BUG_FIXES_BODY" > "$tmp_body_file"

  awk -v ticket="$PATCH_RELEASE_TICKET" -v body_file="$tmp_body_file" -v version="$RELEASE_PATCH" '
    # When we hit the ticket marker, print it, re-record the version this section is now generated
    # for, and inject the new body. The version marker is rewritten rather than carried over,
    # because the old one sits inside the body region that is being replaced.
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" {
      print
      print "<!-- PATCH RELEASE VERSION: " version " -->"
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

  # Refresh this section's heading too. A patch ticket usually names its fixVersion as a
  # placeholder such as "4.9.x", so the first run heads the section with that placeholder and a
  # later run, once the version is confirmed, has to correct it. The due date is refreshed for the
  # same reason, because a patch release can slip after the notes are first drafted.
  awk -v ticket="$PATCH_RELEASE_TICKET" -v heading="## $RELEASE_DATE - Release $RELEASE_PATCH" '
    { lines[NR] = $0 }

    END {
      marker = "<!-- PATCH RELEASE TICKET: " ticket " -->"

      for (i = 1; i <= NR; i++) {
        if (index(lines[i], marker) == 0) {
          continue
        }

        # Walk back to the H2 that opens this section, stopping at any other heading so a
        # neighbouring section is never rewritten.
        for (j = i - 1; j >= 1; j--) {
          if (lines[j] ~ /^## [^#]/) {
            lines[j] = heading
            break
          }

          if (lines[j] ~ /^#/) {
            break
          }
        }
      }

      for (i = 1; i <= NR; i++) {
        print lines[i]
      }
    }
  ' "$RELEASE_NOTES_FILE" > "${RELEASE_NOTES_FILE}.tmp" \
    && mv "${RELEASE_NOTES_FILE}.tmp" "$RELEASE_NOTES_FILE"

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
