#!/bin/bash

# Enable error handling
set -euo pipefail

# Import utility functions
source scripts/release/utilities.sh
source .env

JIRA_DOMAIN=https://spectrocloud.atlassian.net/
RELEASE_NOTES_FILE="${RELEASE_NOTES_FILE:-docs/docs-content/release-notes/release-notes.md}"
PATCH_NOTES_TEMPLATE_FILE="scripts/release/templates/patch-release-notes.md"
PATCH_NOTES_OUTPUT_FILE="scripts/release/patch-release-notes-output.md"
MANUAL_BODY_TEMPLATE_FILE="scripts/release/templates/patch-release-notes-manual-body.md"
MANUAL_BODY_OUTPUT_FILE="scripts/release/patch-release-notes-manual-body-output.md"
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
INSTALL_FILE="${INSTALL_FILE:-docs/docs-content/automation/palette-cli/install-palette-cli.md}"
NICKFURY_REPO="spectrocloud/nickfury"
NICKFURY_VERSIONS_PATH="release/spectro_versions.txt"
# Columns in the Edge Compatibility Matrix table that hold the versions to compare against, and the
# checksum column in the CLI Tools table.
MATRIX_CANVOS_COLUMN=2
MATRIX_PALETTE_CLI_COLUMN=3
DOWNLOADS_CLI_VERSION_COLUMN=2
DOWNLOADS_SHA_COLUMN=4
# Markers written into a documentation table or heading in place of a value that is not known yet,
# so a reviewer can see which cells still need filling and can grep the docs for "PENDING".
PENDING_VERSION="VERSION PENDING"
PENDING_URL="URL PENDING"
PENDING_SHA="SHA PENDING"
PENDING_DATE="DATE PENDING"
PENDING_BODY="BODY PENDING"
# PENDING_VERSION, PENDING_URL, PENDING_SHA, PENDING_DATE, and PENDING_BODY are the markers written
# in place of a value that is not known yet. They come from scripts/release/utilities.sh, because
# the scripts this one hands them off to write the rows that carry them.
#
# This target is run more than once for the same patch, because most of what it records is only
# settled on the day the patch ships. The first run scaffolds the section from whatever the ticket
# says, and each later run corrects it: the candidate issues, the release date, the release
# version, the component versions, and the Palette CLI checksums are all answered again, and the
# rows a previous run wrote for a value that has since changed are removed rather than left behind.

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

# Reading nickfury needs a token that can see a private repository. GITHUB_TOKEN comes from .env
# for a local run and from the workflow environment in CI. When it is absent, fall back to the
# token the GitHub CLI already holds, which is usually signed in to the organisation on a writer's
# machine.
if [[ -z "${GITHUB_TOKEN:-}" ]] && command -v gh >/dev/null 2>&1; then
  GITHUB_TOKEN="$(gh auth token 2>/dev/null || true)"
  [[ -n "$GITHUB_TOKEN" ]] && export GITHUB_TOKEN
fi

if [[ -z "${PATCH_RELEASE_TICKET:-}" ]]; then
  read -p "Specify ticket to generate patch release notes for (for example, DOC-2815): " PATCH_RELEASE_TICKET
fi

echo "Generating patch release notes for $PATCH_RELEASE_TICKET ..."

TICKET_MARKER="<!-- PATCH RELEASE TICKET: $PATCH_RELEASE_TICKET -->"

# Reads a value this ticket's section recorded on an earlier run. The markers sit directly below
# the ticket marker, inside the section, so the scan is bounded by the next H2.
# Params:
# $1 - marker name, for example "PATCH RELEASE VERSION"
# Prints the recorded value, or nothing when this ticket has no section or no such marker.
read_section_marker() {
  local marker_name="$1"

  [[ -f "$RELEASE_NOTES_FILE" ]] || return 0

  awk -v ticket="$PATCH_RELEASE_TICKET" -v marker="<!-- $marker_name: " '
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" { in_section = 1; next }
    in_section && /^## [^#]/ { exit }
    in_section && index($0, marker) == 1 {
      value = substr($0, length(marker) + 1)
      sub(/ -->[ \t]*$/, "", value)
      print value
      exit
    }
  ' "$RELEASE_NOTES_FILE"
}

# What an earlier run of this ticket recorded. The table rows this script writes are anchored on
# the release version, so a run that confirms a version after an earlier run scaffolded a
# placeholder would leave the placeholder row behind unless the superseded version is known. The
# candidate list is recorded for the same reason: the set of tickets a patch ships is only final on
# release day, so a re-run has to be able to see which ones were added and which were dropped.
PREVIOUS_RELEASE_PATCH=$(read_section_marker "PATCH RELEASE VERSION" || true)
PREVIOUS_CANDIDATE_KEYS=$(read_section_marker "PATCH RELEASE CANDIDATES" || true)

# The date is not recorded in a marker, because the heading is where it is published, so it is read
# back from there. A date already in a heading was typed by someone who had been told it, which is
# why it outranks the seeds the issue tracker offers.
PREVIOUS_RELEASE_DATE=$(awk -v ticket="$PATCH_RELEASE_TICKET" '
  { lines[NR] = $0 }

  END {
    marker = "<!-- PATCH RELEASE TICKET: " ticket " -->"

    for (i = 1; i <= NR; i++) {
      if (index(lines[i], marker) == 0) { continue }

      # Walk back to the H2 that opens this section, stopping at any other heading.
      for (j = i - 1; j >= 1; j--) {
        if (lines[j] ~ /^## .* - Release /) {
          heading = lines[j]
          sub(/^## /, "", heading)
          sub(/ - Release .*$/, "", heading)
          print heading
          exit
        }

        if (lines[j] ~ /^#/) { break }
      }
    }
  }
' "$RELEASE_NOTES_FILE" || true)

if [[ "$PREVIOUS_RELEASE_DATE" == "$PENDING_DATE" ]]; then
  PREVIOUS_RELEASE_DATE=""
fi

# "none" is what a run that resolved no candidates records, so that a section written before this
# marker existed, which records nothing at all, is not mistaken for one that documented no tickets.
if [[ "$PREVIOUS_CANDIDATE_KEYS" == "none" ]]; then
  PREVIOUS_CANDIDATE_KEYS=""
fi

# Whether an earlier run of this ticket wrote component content. This is what makes it safe to
# remove a component row further down: a row is only ever this ticket's to remove when this
# ticket's section documented that component before. Rows that belong to `make generate-release`,
# or to another patch ticket, are left alone.
SECTION_COMPONENTS=$(awk -v ticket="$PATCH_RELEASE_TICKET" '
  $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" { in_section = 1; next }
  in_section && /^## [^#]/ { exit }
  in_section && /^### Edge[ \t]*$/ { edge = 1 }
  in_section && /^### Automation[ \t]*$/ { automation = 1 }

  END {
    found = ""

    if (edge) { found = "edge" }
    if (automation) { found = found " automation" }

    print found
  }
' "$RELEASE_NOTES_FILE" || true)

case "$SECTION_COMPONENTS" in
  *edge*) SECTION_HAD_EDGE=true ;;
  *) SECTION_HAD_EDGE=false ;;
esac

case "$SECTION_COMPONENTS" in
  *automation*) SECTION_HAD_AUTOMATION=true ;;
  *) SECTION_HAD_AUTOMATION=false ;;
esac

# Read the ticket once. Its description carries the candidates link when it has one, its summary
# usually names the patch release version, and its own due date is a second opinion on the release
# date, so all three are taken from the same response.
TICKET_JSON=$(curl -s --fail-with-body \
  --url "${JIRA_DOMAIN}/rest/api/3/issue/${PATCH_RELEASE_TICKET}?fields=description,summary,duedate" \
  --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Accept: application/json") || TICKET_JSON=""

if [[ -z "$TICKET_JSON" ]] || ! printf '%s' "$TICKET_JSON" | jq -e '.fields' >/dev/null 2>&1; then
  echo "❌  Could not read $PATCH_RELEASE_TICKET from the issue tracker. Check the ticket key and that JIRA_EMAIL and JIRA_API_TOKEN are current." >&2
  exit 1
fi

TICKET_SUMMARY=$(printf '%s' "$TICKET_JSON" | jq -r '.fields.summary // empty')
TICKET_DUE_DATE=$(printf '%s' "$TICKET_JSON" | jq -r '.fields.duedate // empty')

# Every string in the description, whether it is prose, a link target, or a smart link, flattened
# so the issue keys in it can be read when there is no candidates link to follow.
DESCRIPTION_TEXT=$(printf '%s' "$TICKET_JSON" | jq -r '
  [
    .fields.description
    | ..
    | objects
    | (.text?), (.attrs?.href?), (.attrs?.url?)
  ]
  | map(select(type == "string"))
  | join("\n")
' 2>/dev/null || true)

# The candidates link is a saved search, so following it gives the whole candidate list at once.
# Its link text is normally "List of candidates", which is matched first, and any other link that
# carries a JQL query is accepted as a second chance, because the text is written by hand and does
# not always use those words.
CANDIDATES_LINK=$(printf '%s' "$TICKET_JSON" | jq -r '
  first(
    .fields.description
    | ..
    | objects
    | select(.type=="text" and (.text | ascii_downcase | gsub("^[[:space:]]+|[[:space:]]+$"; ""))=="list of candidates")
    | .marks[]?
    | select(.type=="link")
    | .attrs.href
  ) // empty
' 2>/dev/null || true)

if [[ -z "$CANDIDATES_LINK" ]]; then
  CANDIDATES_LINK=$(printf '%s' "$TICKET_JSON" | jq -r '
    first(
      .fields.description
      | ..
      | objects
      | (.attrs?.href?), (.attrs?.url?)
      | select(type == "string" and (contains("jql=")))
    ) // empty
  ' 2>/dev/null || true)

  if [[ -n "$CANDIDATES_LINK" ]]; then
    echo "ℹ️  No 'List of candidates' link found, but another link in the description carries a query, so that is used."
  fi
fi

JQL=""

if [[ -n "$CANDIDATES_LINK" ]]; then
  echo "ℹ️  Candidates link found: $CANDIDATES_LINK."

  # Extract + decode JQL from link
  JQL_ENCODED=$(printf '%s\n' "$CANDIDATES_LINK" | sed -n 's/.*[?&]jql=\([^&]*\).*/\1/p')

  if [[ -n "$JQL_ENCODED" ]]; then
    # Safe decode: handle %XX and +
    JQL=$(printf '%b' "${JQL_ENCODED//%/\\x}")
    JQL=${JQL//+/ }
  else
    echo "🟠 The candidates link carries no JQL query, so the candidate issues are resolved from the description instead." >&2
  fi
else
  # Plenty of patch tickets carry no saved search. They name a single ticket, list a couple of keys
  # in prose, or only describe what the patch is for. None of that is a reason to stop, because
  # every other value this target records is still worth writing, so the candidate issues are
  # resolved from whatever the description does carry and the body is left for you when it carries
  # nothing.
  echo "🟠 $PATCH_RELEASE_TICKET has no candidates link, so the candidate issues are resolved from the description instead." >&2
fi

# ---------------------------------------------------------------------------------------------
# Candidate issues
#
# The final set of tickets a patch documents is only settled on release day, so this is resolved
# from scratch on every run rather than carried over from the section an earlier run wrote. The
# sources are tried in order of how specific they are: what the caller passed, the saved search the
# ticket links to, the keys written into its description, and finally what you type at the prompt.
# ---------------------------------------------------------------------------------------------
CANDIDATE_KEYS=""
CANDIDATE_SOURCE=""

# Confirms that each key given names an issue the tracker knows about, so a key read out of prose
# is not passed on to Super as though it were a candidate. Issues closed as not a bug are dropped
# here too, matching what the saved search path does. Each key costs one request, and this path
# only runs for the handful of keys a description names, so they are checked one at a time rather
# than in a single query: one unknown key in a `key in (...)` clause fails the whole query.
# Params:
# $1 - space-separated issue keys
# Prints the keys the tracker recognises, in the order given.
validate_issue_keys() {
  local keys="$1"
  local key status kept=""

  for key in $keys; do
    status=$(curl -s \
      --url "${JIRA_DOMAIN}/rest/api/3/issue/${key}?fields=status" \
      --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
      --header "Accept: application/json" \
      | jq -r '.fields.status.name // empty' 2>/dev/null || true)

    if [[ -z "$status" ]]; then
      echo "🟠 '$key' is not an issue the tracker recognises, so it is not treated as a candidate." >&2
      continue
    fi

    if [[ "$(printf '%s' "$status" | tr '[:upper:]' '[:lower:]')" == "not a bug" ]]; then
      echo "ℹ️  $key is closed as not a bug, so it is not treated as a candidate." >&2
      continue
    fi

    kept="$kept $key"
  done

  printf '%s' "${kept# }"
}

if [[ -n "${PATCH_CANDIDATE_ISSUES:-}" ]]; then
  # A caller that has the final list supplies it directly, which is the release day case: the
  # tickets have been confirmed in a call or a channel rather than in the saved search.
  CANDIDATE_KEYS=$(printf '%s' "$PATCH_CANDIDATE_ISSUES" | tr ',;' '  ' | extract_issue_keys | tr '\n' ' ')
  CANDIDATE_KEYS="${CANDIDATE_KEYS%% }"
  CANDIDATE_SOURCE="PATCH_CANDIDATE_ISSUES"
fi

if [[ -z "$CANDIDATE_KEYS" && -n "$JQL" ]]; then
  ISSUE_RESPONSE=$(curl -s --fail-with-body \
    --url "${JIRA_DOMAIN}/rest/api/3/search/jql" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json" \
    --get \
    --data-urlencode "jql=${JQL}" \
    --data-urlencode "fields=status" \
    --data-urlencode "maxResults=100") || ISSUE_RESPONSE=""

  if [[ -z "$ISSUE_RESPONSE" ]]; then
    echo "🟠 The candidates query could not be run, so the candidate issues are resolved from the description instead. The query was: $JQL" >&2
  else
    CANDIDATE_KEYS=$(printf '%s' "$ISSUE_RESPONSE" | jq -r '
      [
        .issues[]?
        | select((.fields.status.name // "" | ascii_downcase) != "not a bug")
        | .key // empty
      ]
      | join(" ")
    ' 2>/dev/null || true)

    # The search response normally carries each issue's key alongside its id, which is one request
    # for the whole list. Fall back to looking each id up when it does not, rather than treating a
    # response full of issues as no candidates at all.
    if [[ -z "$CANDIDATE_KEYS" ]] && printf '%s' "$ISSUE_RESPONSE" | jq -e '(.issues // []) | length > 0' >/dev/null 2>&1; then
      echo "ℹ️  The candidates query returned issues without their keys, so each one is looked up by ID."

      for id in $(printf '%s' "$ISSUE_RESPONSE" | jq -r '
        .issues[]?
        | select((.fields.status.name // "" | ascii_downcase) != "not a bug")
        | .id // empty
      '); do
        key=$(curl -s --fail-with-body \
          --url "${JIRA_DOMAIN}/rest/api/3/issue/${id}" \
          --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
          --header "Accept: application/json" \
          | jq -r '.key // empty' 2>/dev/null || true)

        if [[ -n "$key" ]]; then
          CANDIDATE_KEYS="$CANDIDATE_KEYS $key"
        fi
      done

      CANDIDATE_KEYS="${CANDIDATE_KEYS# }"
    fi

    if [[ -n "$CANDIDATE_KEYS" ]]; then
      CANDIDATE_SOURCE="the candidates query"
    else
      echo "🟠 The candidates query matched no issues, so the candidate issues are resolved from the description instead. The query was: $JQL" >&2
    fi
  fi
fi

if [[ -z "$CANDIDATE_KEYS" && -n "$DESCRIPTION_TEXT" ]]; then
  # The ticket's own key is always in the description text, because the link that carries it is
  # part of the flattened description, and it is never one of its own candidates.
  SCRAPED_KEYS=$(printf '%s\n' "$DESCRIPTION_TEXT" \
    | extract_issue_keys \
    | grep -vxF "$PATCH_RELEASE_TICKET" \
    | tr '\n' ' ' || true)
  SCRAPED_KEYS="${SCRAPED_KEYS%% }"

  if [[ -n "$SCRAPED_KEYS" ]]; then
    echo "ℹ️  Issue keys found in the description: $SCRAPED_KEYS. Checking them against the tracker..."
    CANDIDATE_KEYS=$(validate_issue_keys "$SCRAPED_KEYS")

    if [[ -n "$CANDIDATE_KEYS" ]]; then
      CANDIDATE_SOURCE="the ticket description"
    fi
  fi
fi

if [[ -t 0 ]]; then
  # Whatever was resolved is offered for confirmation rather than used unseen, because this is the
  # value most likely to have changed since the notes were drafted: tickets get added to a patch
  # and pulled from it up to the moment it ships. Editing the list here is the release day
  # correction, and clearing it hands the body over to you.
  if [[ -n "$CANDIDATE_KEYS" ]]; then
    echo "ℹ️  Candidate issues from $CANDIDATE_SOURCE: $CANDIDATE_KEYS."
    echo "   Press Enter to document these, or paste the final list to replace them. Clearing the"
    echo "   list leaves the release notes body for you to write by hand."
    CANDIDATE_REPLY=$(prompt_with_default "   Candidate issues" "$CANDIDATE_KEYS")
  else
    echo "🟠 No candidate issues could be resolved for $PATCH_RELEASE_TICKET." >&2
    echo "   Paste the issue keys to document, separated by spaces, or leave this empty to write the"
    echo "   release notes body by hand."
    CANDIDATE_REPLY=$(prompt_with_default "   Candidate issues" "")
  fi

  if [[ "$CANDIDATE_REPLY" != "$CANDIDATE_KEYS" ]]; then
    CANDIDATE_KEYS=$(printf '%s' "$CANDIDATE_REPLY" | tr ',;' '  ' | extract_issue_keys | tr '\n' ' ')
    CANDIDATE_KEYS="${CANDIDATE_KEYS%% }"
    CANDIDATE_SOURCE="the prompt"
  fi
fi

if [[ -z "$CANDIDATE_KEYS" ]]; then
  echo "🟠 No candidate issues to document, so the release notes body is left for you to write. Search $RELEASE_NOTES_FILE for '$PENDING_BODY' to find where." >&2
else
  echo "ℹ️  Candidate issues found: $CANDIDATE_KEYS."

  # Report how the list has moved since the last run, so a ticket that was pulled from the patch is
  # visible rather than silently carried in the body an earlier run wrote. The removals are handed
  # to Super below, because only Super can take an entry back out of its own prose.
  if [[ -n "$PREVIOUS_CANDIDATE_KEYS" ]]; then
    ADDED_KEYS=""
    REMOVED_KEYS=""

    for key in $CANDIDATE_KEYS; do
      if ! printf '%s\n' $PREVIOUS_CANDIDATE_KEYS | grep -qxF "$key"; then
        ADDED_KEYS="$ADDED_KEYS $key"
      fi
    done

    for key in $PREVIOUS_CANDIDATE_KEYS; do
      if ! printf '%s\n' $CANDIDATE_KEYS | grep -qxF "$key"; then
        REMOVED_KEYS="$REMOVED_KEYS $key"
      fi
    done

    ADDED_KEYS="${ADDED_KEYS# }"
    REMOVED_KEYS="${REMOVED_KEYS# }"

    if [[ -n "$ADDED_KEYS" ]]; then
      echo "ℹ️  Added since the last run: $ADDED_KEYS."
    fi

    if [[ -n "$REMOVED_KEYS" ]]; then
      echo "⚠️  Dropped since the last run: $REMOVED_KEYS. Their entries are removed from the body."
    fi

    if [[ -z "$ADDED_KEYS" && -z "$REMOVED_KEYS" ]]; then
      echo "ℹ️  The candidate list is unchanged since the last run."
    fi
  fi

  # Confirm Super authentication before anything else is asked for. The token is only rejected
  # until its owner signs in to Super through SSO, so checking here avoids working through the
  # whole interview and then failing at the one call that needs Super. A run with no candidate
  # issues never calls Super, so it is never asked to sign in.
  if ! require_super_auth "$SUPER_ASSISTANT_ID"; then
    exit 1
  fi
fi

# ---------------------------------------------------------------------------------------------
# Patch release version
#
# The version heads the new release notes section, and it is the key the documentation pages
# record the component versions against. A patch ticket names its fixVersion as a placeholder such
# as "4.9.x" and its summary as the real version, and the summary is the field that gets corrected
# as the release firms up, so it is preferred. Both are only seeds: the answer below decides.
# ---------------------------------------------------------------------------------------------

# "Release notes for 4.9.53 patch release" names the version; "Release notes for 4.9.x security
# patch release" names a placeholder. Both are useful, and both are proposed rather than used.
SUMMARY_VERSION=$(printf '%s\n' "$TICKET_SUMMARY" \
  | tr ' ' '\n' \
  | grep -m1 -E '^[0-9]+\.[0-9]+\.[0-9A-Za-z]+$' || true)

# A candidates link can name one version, "fixVersion = 4.9.x", or a list, "fixVersion IN (4.9.x)",
# so both are read, and the value is unquoted either way.
JQL_VERSION=$(printf '%s' "$JQL" | sed -n 's/.*fixVersion[[:space:]]*IN[[:space:]]*(\([^)]*\)).*/\1/p')

if [[ -z "$JQL_VERSION" ]]; then
  JQL_VERSION=$(printf '%s' "$JQL" | sed -n 's/.*fixVersion[[:space:]]*=[[:space:]]*"\{0,1\}\([^"[:space:]]*\).*/\1/p')
fi

JQL_VERSION=${JQL_VERSION//\"/}

RELEASE_PATCH_VERSION="${PATCH_RELEASE_VERSION:-}"

if [[ -z "$RELEASE_PATCH_VERSION" ]]; then
  # A version already recorded for this ticket outranks both seeds when it is a real version rather
  # than a placeholder, because someone confirmed it deliberately and the ticket summary is often
  # never corrected. Without that, the **Update Patch Release Notes** workflow, which reruns with no
  # variables set at all, would move a confirmed section back onto a placeholder and take its rows
  # with it. Otherwise the summary leads, because that is the field that gets corrected as a release
  # firms up, and the placeholder in the saved search usually does not.
  if [[ "$PREVIOUS_RELEASE_PATCH" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    VERSION_DEFAULT="$PREVIOUS_RELEASE_PATCH"
  else
    VERSION_DEFAULT="$SUMMARY_VERSION"

    if [[ -z "$VERSION_DEFAULT" ]]; then
      VERSION_DEFAULT="$JQL_VERSION"
    fi

    if [[ -z "$VERSION_DEFAULT" ]]; then
      VERSION_DEFAULT="$PREVIOUS_RELEASE_PATCH"
    fi
  fi

  if [[ -t 0 ]]; then
    echo "ℹ️  Patch release version seeds: ticket summary '${SUMMARY_VERSION:-none}', candidates query '${JQL_VERSION:-none}', last generated '${PREVIOUS_RELEASE_PATCH:-none}'."
    echo "   A placeholder such as 4.9.x is a valid answer while the version is undecided. Re-running"
    echo "   this target once it is confirmed corrects the heading and moves the rows across."
    RELEASE_PATCH_VERSION=$(prompt_with_default "   Specify the Palette patch release version" "$VERSION_DEFAULT")
  else
    RELEASE_PATCH_VERSION="$VERSION_DEFAULT"
  fi
fi

# With no version from the prompt or from the ticket there is nothing to head the section with, and
# unlike the release date a placeholder cannot be invented, because the version is the key a later
# run matches the section on.
if [[ -z "$RELEASE_PATCH_VERSION" ]]; then
  echo "❌  No patch release version given. Specify one at the prompt, or set PATCH_RELEASE_VERSION." >&2
  exit 1
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
  echo "ℹ️  Using confirmed patch release version: $RELEASE_PATCH."
else
  echo "ℹ️  Using the patch release version placeholder: $RELEASE_PATCH."
fi

# Drop the rows an earlier run wrote for a version that has since changed, so a confirmed version
# replaces its placeholder rather than sitting alongside it. This happens here, before anything
# reads the component pages, because those rows sit at the top of their tables: leaving them in
# place until later would have the version comparisons below read a superseded placeholder as
# though it were the version the previous release documents, and conclude that every component
# moved. Only rows keyed on a version this ticket generated are touched, so a row that belongs to
# `make generate-release` or to another patch ticket is left alone.
if [[ -n "$PREVIOUS_RELEASE_PATCH" && "$PREVIOUS_RELEASE_PATCH" != "$RELEASE_PATCH" ]]; then
  echo "ℹ️  $PATCH_RELEASE_TICKET was last generated for $PREVIOUS_RELEASE_PATCH, so its rows are superseded by $RELEASE_PATCH."

  if [[ "$SECTION_HAD_EDGE" == true || "$SECTION_HAD_AUTOMATION" == true ]]; then
    if remove_line_containing "edge-compat-$PREVIOUS_RELEASE_PATCH -->" "$EDGE_COMPATIBILITY_MATRIX_FILE"; then
      echo "✅ Removed the superseded $PREVIOUS_RELEASE_PATCH row from $EDGE_COMPATIBILITY_MATRIX_FILE."
    fi

    if remove_line_containing "cli-$PREVIOUS_RELEASE_PATCH -->" "$DOWNLOADS_FILE"; then
      echo "✅ Removed the superseded $PREVIOUS_RELEASE_PATCH row from $DOWNLOADS_FILE."
    fi
  fi
fi

# ---------------------------------------------------------------------------------------------
# Release date
#
# A patch release slips, and the issue tracker is not corrected when it does, so the date the
# candidates query implies is a seed rather than an answer. The prompt below always offers it for
# confirmation so that the date you were actually given on release day can replace it.
# ---------------------------------------------------------------------------------------------

# The seed comes from the end of the due date window the candidates JQL searches. The tracker
# accepts both "duedate" and its "due" alias, and a candidates link can carry either, so both are
# read. The last matching clause wins, because the window is written as a lower bound followed by
# an upper one.
JQL_END_DATE=$(printf '%s' "$JQL" \
  | grep -oiE '(^|[^[:alnum:]_])due(date)?[[:space:]]*<=[[:space:]]*"[^"]+"' \
  | tail -1 \
  | sed -n 's/.*"\([^"]*\)".*/\1/p' || true)

# The heading already carries a formatted date rather than a YYYY-MM-DD one, so a run that keeps it
# settles RELEASE_DATE directly and skips the formatting below. Everything else settles END_DATE and
# is formatted.
END_DATE=""
RELEASE_DATE=""

if [[ -n "${PATCH_RELEASE_DATE:-}" ]]; then
  # A caller that names the date overrides every seed, which is the release day case.
  if [[ "$(printf '%s' "$PATCH_RELEASE_DATE" | tr '[:upper:]' '[:lower:]')" == "pending" ]]; then
    echo "ℹ️  PATCH_RELEASE_DATE is 'pending', so the release notes heading records '$PENDING_DATE'."
  elif format_release_date "$PATCH_RELEASE_DATE" >/dev/null; then
    END_DATE="$PATCH_RELEASE_DATE"
  else
    echo "❌  PATCH_RELEASE_DATE '$PATCH_RELEASE_DATE' is not a date in YYYY-MM-DD form, for example 2026-09-14. Use 'pending' to record '$PENDING_DATE'." >&2
    exit 1
  fi
elif [[ ! -t 0 ]]; then
  # An unattended re-run keeps the date already in the heading rather than reverting it to a seed,
  # for the same reason the version above is kept: the heading records what someone was told. The
  # **Update Patch Release Notes** workflow reruns with no variables set at all, so without this a
  # date given at a prompt would be replaced by the candidates query's window every time.
  if [[ -n "$PREVIOUS_RELEASE_DATE" ]]; then
    RELEASE_DATE="$PREVIOUS_RELEASE_DATE"
    echo "ℹ️  Keeping the release date already in the heading: $RELEASE_DATE."
  else
    END_DATE="$JQL_END_DATE"

    if [[ -z "$END_DATE" ]]; then
      END_DATE="$TICKET_DUE_DATE"
    fi
  fi
else
  DATE_DEFAULT="$JQL_END_DATE"

  if [[ -z "$DATE_DEFAULT" ]]; then
    DATE_DEFAULT="$TICKET_DUE_DATE"
  fi

  echo "ℹ️  Release date seeds: the heading already records '${PREVIOUS_RELEASE_DATE:-none}', the candidates query window ends '${JQL_END_DATE:-none}', and the ticket due date is '${TICKET_DUE_DATE:-none}'."
  echo "   The tracker is not a reliable record of when a patch actually shipped, so give the date you"
  echo "   were told on release day. Enter 'keep' to leave the date already in the heading as it is, or"
  echo "   'pending' to record '$PENDING_DATE' and correct it on a later run."

  while true; do
    DATE_REPLY=$(prompt_with_default "   Specify the release date as YYYY-MM-DD" "$DATE_DEFAULT")

    case "$(printf '%s' "$DATE_REPLY" | tr '[:upper:]' '[:lower:]')" in
      keep)
        if [[ -n "$PREVIOUS_RELEASE_DATE" ]]; then
          RELEASE_DATE="$PREVIOUS_RELEASE_DATE"
          break
        fi

        echo "   The heading records no date to keep, so give one or enter 'pending'." >&2
        continue
        ;;
      pending | "")
        break
        ;;
    esac

    if format_release_date "$DATE_REPLY" >/dev/null; then
      END_DATE="$DATE_REPLY"
      break
    fi

    echo "   '$DATE_REPLY' is not a date in YYYY-MM-DD form, for example 2026-09-14." >&2
  done
fi

if [[ -n "$RELEASE_DATE" ]]; then
  echo "ℹ️  Using release date: $RELEASE_DATE."
elif [[ -z "$END_DATE" ]]; then
  RELEASE_DATE="$PENDING_DATE"
  echo "ℹ️  No release date given, so the release notes heading records '$PENDING_DATE'. Re-run this script once the date is known to correct the heading."
elif ! RELEASE_DATE=$(format_release_date "$END_DATE"); then
  echo "❌  '$END_DATE' is not a date in YYYY-MM-DD form, for example 2026-09-14." >&2
  exit 1
else
  echo "ℹ️  Using release date: $RELEASE_DATE."
fi

# ---------------------------------------------------------------------------------------------
# Component versions
#
# A patch ticket asks whether the CanvOS (stylus) and Palette CLI (palette-cli) versions moved in
# this patch. Whether they did is often only known on release day, and so is the answer, so
# nickfury is consulted and then every version it reports is offered for confirmation.
# ---------------------------------------------------------------------------------------------
RELEASE_CANVOS=""
RELEASE_PALETTE_CLI_VERSION=""

# Whether there is any component work to do at all. A patch release often ships the same CanvOS and
# Palette CLI as the release before it, in which case none of the component pages should carry a row
# for it and the run is only about the release notes body.
#
# Unattended, the answer is inferred from whether a ref, a version, or a checksum was supplied, so a
# workflow that passes none of them behaves as though nothing changed.
#
# Whether the answer was given or merely inferred is recorded too, because only a given answer may
# remove a row further down. "No new component versions" is a deliberate statement when someone
# answers the question or fills the workflow's tick box in, and it is only the absence of inputs
# when nothing was set at all. The **Update Patch Release Notes** workflow reruns with nothing set,
# so treating that as a statement would have it delete the component rows of every patch it touches.
if [[ -n "${PATCH_COMPONENT_UPDATES:-}" ]]; then
  COMPONENT_ANSWER_GIVEN=true

  case "$PATCH_COMPONENT_UPDATES" in
    true | yes | 1) COMPONENT_UPDATES=true ;;
    *) COMPONENT_UPDATES=false ;;
  esac
elif [[ -t 0 ]]; then
  COMPONENT_ANSWER_GIVEN=true
  if confirm "Does this patch release add a new CanvOS or Palette CLI version, or both?" n; then
    COMPONENT_UPDATES=true
  else
    COMPONENT_UPDATES=false
  fi
elif [[ -n "${NICKFURY_REF:-}" ]] ||
     [[ -n "${PATCH_CANVOS_VERSION:-}" ]] ||
     [[ -n "${PATCH_PALETTE_CLI_VERSION:-}" ]] ||
     [[ -n "${PATCH_PALETTE_CLI_SHA:-}" ]]; then
  COMPONENT_ANSWER_GIVEN=true
  COMPONENT_UPDATES=true
else
  COMPONENT_ANSWER_GIVEN=false
  COMPONENT_UPDATES=false
fi

if [[ "$COMPONENT_UPDATES" == false ]]; then
  echo "ℹ️  No new CanvOS or Palette CLI versions, so only the release notes body is generated."

  # A branch, tag, version, or checksum supplied alongside a "no" answer is a mismatch worth
  # naming, because the workflow form makes it easy to fill those fields in and leave the tick box
  # clear.
  if [[ -n "${NICKFURY_REF:-}" ]] ||
     [[ -n "${PATCH_CANVOS_VERSION:-}" ]] ||
     [[ -n "${PATCH_PALETTE_CLI_VERSION:-}" ]] ||
     [[ -n "${PATCH_PALETTE_CLI_SHA:-}" ]]; then
    echo "⚠️  A branch or tag, a component version, or a checksum was supplied but no new component versions were requested, so it is ignored. Answer yes to the component version question, or set PATCH_COMPONENT_UPDATES=true, to use it." >&2
  fi
elif [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "ℹ️  No GitHub token is available, so $NICKFURY_REPO cannot be read. Supply the component versions at the prompts below, or add 'export GITHUB_TOKEN=<token>' to your .env file to look them up. 'make init-release' adds the .env placeholder." >&2
fi

if [[ "$COMPONENT_UPDATES" == true && -n "${GITHUB_TOKEN:-}" ]]; then
  # The release engineers hand over a branch or a tag, and neither is named after the patch
  # release version alone: a branch is "release-<version>" and a tag is "v<version>", where a
  # tag can also carry an "-rc.N" release candidate suffix. Ask for that name directly rather
  # than guessing it from the version, because the two do not always correspond. For example,
  # Palette 4.9.47 can be built from tag v4.9.47-rc.2 or from branch release-4.9.
  if [[ -z "${NICKFURY_REF:-}" && -t 0 ]]; then
    # The consequence of answering no belongs in the question, so the choice is clear before it is
    # made. Answering no leaves NICKFURY_REF empty, and the prompts below still let the versions be
    # given by hand.
    if confirm "Do you know the $NICKFURY_REPO branch or tag name? Answering no lets you give the versions by hand" y; then
      echo "   Its refs are named:"
      echo "      branch  release-<version>   for example, release-4.9 or release-$RELEASE_PATCH"
      echo "      tag     v<version>          for example, v$RELEASE_PATCH or v$RELEASE_PATCH-rc.2"
      read -r -p "   Specify the branch or tag name: " NICKFURY_REF
    fi
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
    # Nothing given, so the lookup is not attempted and the prompts below decide the versions.
    NICKFURY_LOOKUP=false
    NICKFURY_REF_CANDIDATES=("")
    echo "ℹ️  No branch or tag given, so the component versions come from the prompts below."
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
      echo "⚠️  No component versions available from $NICKFURY_REPO, so the prompts below decide them. Confirm the branch or tag name with the release engineers: a branch is named release-<version> and a tag v<version>, optionally with an -rc.N suffix. Then re-run with NICKFURY_REF set to that name." >&2
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

# What the component pages already record for the release before this one. This is both what a
# resolved version is compared against, to decide whether it moved, and what "same" resolves to at
# the prompts below. The lookup skips any row this script has already written for this version, so
# a re-run compares against the previous release rather than against its own output.
DOCUMENTED_CANVOS=""
DOCUMENTED_PALETTE_CLI=""

if [[ "$COMPONENT_UPDATES" == true ]]; then
  DOCUMENTED_CANVOS=$(get_documented_table_version \
    "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_CANVOS_COLUMN" "$RELEASE_PATCH")
  DOCUMENTED_PALETTE_CLI=$(get_documented_table_version \
    "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_PALETTE_CLI_COLUMN" "$RELEASE_PATCH")
fi

# Settles one component version. nickfury is only readable from a ref, that ref is only cut when
# the release is built, and even then a version can be bumped after the notes are drafted, so
# whatever was resolved above is offered for confirmation rather than used unseen. Answering with
# the version that is already documented is what tells this script the component did not move, so
# "same" is accepted as a word for it.
# Params:
# $1 - label used in prompts and log output, for example "CanvOS"
# $2 - name of the environment variable that answers without prompting
# $3 - the version resolved so far, which may be empty
# $4 - the version the component pages already document for the previous release
# Prints the settled version, which is a real version or PENDING_VERSION.
resolve_component_version() {
  local label="$1"
  local env_var="$2"
  local resolved="$3"
  local documented="$4"
  local reply default

  default="$resolved"

  if [[ -z "$default" ]]; then
    default="pending"
  fi

  reply="${!env_var:-}"

  if [[ -z "$reply" && -t 0 ]]; then
    if [[ -n "$documented" ]]; then
      echo "   $label is documented as $documented for the release before $RELEASE_PATCH. Answer 'same' if" >&2
      echo "   this patch did not bump it, 'pending' if it is not known yet, or give the version." >&2
    else
      echo "   Answer 'pending' if the $label version is not known yet, or give the version." >&2
    fi

    reply=$(prompt_with_default "   $label version for $RELEASE_PATCH" "$default")
  fi

  if [[ -z "$reply" ]]; then
    reply="$default"
  fi

  case "$(printf '%s' "$reply" | tr '[:upper:]' '[:lower:]')" in
    same | unchanged)
      if [[ -n "$documented" ]]; then
        printf '%s' "$documented"
        return 0
      fi

      echo "⚠️  $label has no documented version to keep, so it is recorded as pending." >&2
      printf '%s' "$PENDING_VERSION"
      return 0
      ;;
    pending | "")
      printf '%s' "$PENDING_VERSION"
      return 0
      ;;
  esac

  if [[ ! "$reply" =~ ^[0-9]+\.[0-9]+\.[^[:space:]]+$ ]]; then
    echo "⚠️  '$reply' is not a $label version, for example 4.9.21, so it is recorded as pending." >&2
    printf '%s' "$PENDING_VERSION"
    return 0
  fi

  printf '%s' "$reply"
}

# Whatever is still unknown is recorded as pending rather than omitted, so the release notes and
# the tables are scaffolded on the first run and only need their values corrected later. Each
# marker names what is missing, so the placeholders are easy to spot and to grep for.
if [[ "$COMPONENT_UPDATES" == true ]]; then
  RELEASE_CANVOS=$(resolve_component_version \
    "CanvOS" "PATCH_CANVOS_VERSION" "$RELEASE_CANVOS" "$DOCUMENTED_CANVOS")
  RELEASE_PALETTE_CLI_VERSION=$(resolve_component_version \
    "Palette CLI" "PATCH_PALETTE_CLI_VERSION" "$RELEASE_PALETTE_CLI_VERSION" "$DOCUMENTED_PALETTE_CLI")

  # Never turn a version this release already documents back into a pending marker without being
  # told to. A re-run that answers "no" to the branch or tag question would otherwise undo correct,
  # published content, and the install page carries whichever version the last run resolved. The
  # existing value is kept unless the overwrite is confirmed, and an unattended run always keeps it.
  guard_pending_overwrite() {
    local label="$1"
    local resolved="$2"
    local file="$3"
    local column="$4"
    local existing

    if [[ "$resolved" != "$PENDING_VERSION" ]]; then
      printf '%s' "$resolved"
      return 0
    fi

    existing=$(get_table_cell_for_release "$file" "$column" "$RELEASE_PATCH")

    if [[ -z "$existing" || "$existing" == "$PENDING_VERSION" ]]; then
      printf '%s' "$resolved"
      return 0
    fi

    echo "⚠️  $RELEASE_PATCH already documents $label $existing, and this run has no version for it." >&2

    if confirm "   Replace $label $existing with '$PENDING_VERSION'?" n; then
      printf '%s' "$resolved"
    else
      echo "ℹ️  Keeping $label $existing." >&2
      printf '%s' "$existing"
    fi
  }

  RELEASE_CANVOS=$(guard_pending_overwrite "CanvOS" "$RELEASE_CANVOS" \
    "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_CANVOS_COLUMN")
  RELEASE_PALETTE_CLI_VERSION=$(guard_pending_overwrite "the Palette CLI" "$RELEASE_PALETTE_CLI_VERSION" \
    "$EDGE_COMPATIBILITY_MATRIX_FILE" "$MATRIX_PALETTE_CLI_COLUMN")
fi

# Only document a component whose version actually moved. Restating an unchanged version would add
# a release note and a table row that say nothing new.
CANVOS_CHANGED=false
PALETTE_CLI_CHANGED=false

if [[ "$COMPONENT_UPDATES" == true ]]; then
  # A pending version is always written, because the point of recording it is to scaffold the entry
  # that a later run fills in. Only a known version is worth comparing against what is published.
  if [[ "$RELEASE_CANVOS" == "$PENDING_VERSION" ]]; then
    CANVOS_CHANGED=true
  elif [[ "$RELEASE_CANVOS" != "$DOCUMENTED_CANVOS" ]]; then
    CANVOS_CHANGED=true
    echo "ℹ️  CanvOS moved from $DOCUMENTED_CANVOS to $RELEASE_CANVOS."
  else
    echo "ℹ️  CanvOS is unchanged at $RELEASE_CANVOS, so this patch is not documented as bumping it."
  fi

  if [[ "$RELEASE_PALETTE_CLI_VERSION" == "$PENDING_VERSION" ]]; then
    PALETTE_CLI_CHANGED=true
  elif [[ "$RELEASE_PALETTE_CLI_VERSION" != "$DOCUMENTED_PALETTE_CLI" ]]; then
    PALETTE_CLI_CHANGED=true
    echo "ℹ️  The Palette CLI moved from $DOCUMENTED_PALETTE_CLI to $RELEASE_PALETTE_CLI_VERSION."
  else
    echo "ℹ️  The Palette CLI is unchanged at $RELEASE_PALETTE_CLI_VERSION, so this patch is not documented as bumping it."
  fi
fi

if [[ "$COMPONENT_UPDATES" == true && "$CANVOS_CHANGED" == false && "$PALETTE_CLI_CHANGED" == false ]]; then
  echo "ℹ️  CanvOS ($RELEASE_CANVOS) and the Palette CLI ($RELEASE_PALETTE_CLI_VERSION) are unchanged from the documented versions, so no Edge or Automation notes are added."
fi

# The downloads table also needs the binary's checksum, which nickfury does not carry. A checksum
# only ever matches one build, so the RELEASE_PALETTE_CLI_SHA that .env holds for the current named
# release is deliberately ignored here: pairing it with a different Palette CLI version would
# publish a checksum that does not verify. PATCH_PALETTE_CLI_SHA is the override for this script.
RELEASE_PALETTE_CLI_SHA="${PATCH_PALETTE_CLI_SHA:-}"

RELEASE_PALETTE_CLI_URL=""

if [[ "$PALETTE_CLI_CHANGED" == true ]]; then
  # A pending version names no binary, so there is nothing to ask for or to download.
  if [[ "$RELEASE_PALETTE_CLI_VERSION" != "$PENDING_VERSION" ]]; then
    if [[ -z "$RELEASE_PALETTE_CLI_SHA" && -t 0 ]]; then
      echo "ℹ️  The SHA256 checksum for Palette CLI $RELEASE_PALETTE_CLI_VERSION is published in ReTool. Look it up there."
      read -r -p "   Specify the checksum, type 'derive' to read it from the published binary, or leave blank to record it as pending: " RELEASE_PALETTE_CLI_SHA
    fi

    # Deriving it streams the binary, which is around 400 MB, so it is opt-in rather than the
    # fallback. The helper checks that the binary is published first, so an unreleased version
    # costs one request rather than a transfer that cannot succeed.
    if [[ "$RELEASE_PALETTE_CLI_SHA" == "derive" ]]; then
      RELEASE_PALETTE_CLI_SHA=$(fetch_palette_cli_sha "$RELEASE_PALETTE_CLI_VERSION") || RELEASE_PALETTE_CLI_SHA=""
    fi

    if [[ -n "$RELEASE_PALETTE_CLI_SHA" && ! "$RELEASE_PALETTE_CLI_SHA" =~ ^[0-9a-f]{64}$ ]]; then
      echo "⚠️  '$RELEASE_PALETTE_CLI_SHA' is not a SHA256 checksum, so it is ignored." >&2
      RELEASE_PALETTE_CLI_SHA=""
    fi

    RELEASE_PALETTE_CLI_URL="https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/linux/cli/palette"
  fi

  # The row is still written when the checksum or the version is unknown, so the entry exists and
  # only its pending cells need filling once the binary is published. A checksum this release
  # already records is kept, for the same reason the versions above are, since a re-run that simply
  # skips the checksum prompt should not discard one that was found earlier.
  if [[ -z "$RELEASE_PALETTE_CLI_SHA" ]]; then
    EXISTING_PALETTE_CLI_SHA=$(get_table_cell_for_release \
      "$DOWNLOADS_FILE" "$DOWNLOADS_SHA_COLUMN" "$RELEASE_PATCH")

    if [[ "$EXISTING_PALETTE_CLI_SHA" =~ ^[0-9a-f]{64}$ ]]; then
      echo "⚠️  $RELEASE_PATCH already records a Palette CLI checksum, and this run has none." >&2

      if confirm "   Replace it with '$PENDING_SHA'?" n; then
        RELEASE_PALETTE_CLI_SHA="$PENDING_SHA"
      else
        RELEASE_PALETTE_CLI_SHA="$EXISTING_PALETTE_CLI_SHA"
        echo "ℹ️  Keeping the recorded checksum."
      fi
    else
      RELEASE_PALETTE_CLI_SHA="$PENDING_SHA"
      echo "ℹ️  No checksum given, so the CLI Tools row records '$PENDING_SHA'. Look the checksum up in ReTool, then re-run this script or edit the row by hand to fill it in."
    fi
  fi

  if [[ -z "$RELEASE_PALETTE_CLI_URL" ]]; then
    RELEASE_PALETTE_CLI_URL="$PENDING_URL"
  fi
fi

# Check if release notes section for this patch already exists in the release notes file
RELEASE_PATCH_EXISTING_BODY=""

if grep -qF "$TICKET_MARKER" "$RELEASE_NOTES_FILE"; then
  echo "⚠️  Release notes for $PATCH_RELEASE_TICKET already exist in $RELEASE_NOTES_FILE."

  RELEASE_PATCH_EXISTING_BODY=$(awk -v ticket="$PATCH_RELEASE_TICKET" '
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" { in_section=1; next }
    in_section && /^## [^#]/ { exit }
    in_section { print }
  ' "$RELEASE_NOTES_FILE")

  # Keep the component sections aside before they are stripped. A run that was not told whether the
  # component versions moved puts these back verbatim rather than regenerating them, so that it
  # leaves the component content exactly as published, the same way it leaves the rows alone.
  PRESERVED_COMPONENT_SECTIONS=$(printf '%s\n' "$RELEASE_PATCH_EXISTING_BODY" | awk '
    /^### (Edge|Automation)[ \t]*$/ { keep = 1 }
    keep && /^#/ && !/^### (Edge|Automation)[ \t]*$/ { keep = 0 }
    keep { print }
  ')

  # Drop what this script writes around the body, so what is left is only the body itself. The
  # Edge and Automation sections are rebuilt from a template further down, and the markers are
  # re-emitted from the values this run settled on, so carrying either over would duplicate it.
  # Passing the component sections to Super as context also invites it to restate or rewrite the
  # component versions in its own answer.
  RELEASE_PATCH_EXISTING_BODY=$(printf '%s\n' "$RELEASE_PATCH_EXISTING_BODY" | awk '
    index($0, "<!-- PATCH RELEASE VERSION: ") == 1 { next }
    index($0, "<!-- PATCH RELEASE CANDIDATES: ") == 1 { next }
    /^### (Edge|Automation)[ \t]*$/ { skip=1; next }
    skip && /^#/ { skip=0 }
    skip { next }
    { print }
  ')

  # Trim the blank lines the removals leave at either end, so a body that is reused verbatim does
  # not gain a growing gap on every run.
  RELEASE_PATCH_EXISTING_BODY=$(printf '%s\n' "$RELEASE_PATCH_EXISTING_BODY" | awk '
    { lines[NR] = $0 }

    END {
      first = 1
      last = NR

      while (first <= last && lines[first] ~ /^[ \t]*$/) { first++ }
      while (last >= first && lines[last] ~ /^[ \t]*$/) { last-- }

      for (i = first; i <= last; i++) { print lines[i] }
    }
  ')
fi

# ---------------------------------------------------------------------------------------------
# Release notes body
#
# Super writes the body from the candidate issues. A patch ticket that names none leaves nothing to
# write it from, so the body is left for you: an existing one is kept exactly as it is, and a new
# section is scaffolded with a marker naming where the entries go. Every other value this target
# records is still written either way, so the run is still worth making.
# ---------------------------------------------------------------------------------------------
SUPER_BUG_FIXES_BODY=""

if [[ -z "$CANDIDATE_KEYS" ]]; then
  if [[ -n "$RELEASE_PATCH_EXISTING_BODY" ]]; then
    SUPER_BUG_FIXES_BODY="$RELEASE_PATCH_EXISTING_BODY"
    echo "ℹ️  No candidate issues, so the body already in $RELEASE_NOTES_FILE is kept as it is and only the heading and the component sections are refreshed."
  else
    generate_parameterised_file_local_vars \
      "$MANUAL_BODY_TEMPLATE_FILE" \
      "$MANUAL_BODY_OUTPUT_FILE" \
      "PATCH_RELEASE_TICKET" \
      "PENDING_BODY"

    SUPER_BUG_FIXES_BODY=$(cat "$MANUAL_BODY_OUTPUT_FILE")
    cleanup "$MANUAL_BODY_OUTPUT_FILE"
    echo "ℹ️  The new section records '$PENDING_BODY' where the bug fix entries go. Write them by hand, or re-run with PATCH_CANDIDATE_ISSUES set to have Super draft them."
  fi
else
  SUPER_QUESTION=""

  # Construct the Super API question
  if [[ -z "$RELEASE_PATCH_EXISTING_BODY" ]]; then
    echo "ℹ️  No existing release notes body found for $PATCH_RELEASE_TICKET."

    SUPER_QUESTION=$(cat <<EOF
Generate patch release notes for these tickets:

$CANDIDATE_KEYS
EOF
)
  else
    SUPER_QUESTION=$(cat <<EOF
Generate patch release notes for these tickets:

$CANDIDATE_KEYS

Existing release notes body for $PATCH_RELEASE_TICKET:
$RELEASE_PATCH_EXISTING_BODY
EOF
)
  fi

  # The candidate list is only final on release day, so a re-run can be documenting fewer tickets
  # than the run before it. Super is given the existing body as context, so it has to be told which
  # entries to take back out of it, or it keeps them.
  if [[ -n "${REMOVED_KEYS:-}" && -n "$RELEASE_PATCH_EXISTING_BODY" ]]; then
    SUPER_QUESTION=$(cat <<EOF
$SUPER_QUESTION

These tickets are no longer part of this patch release. Remove their entries from the existing
release notes body and do not write an entry for any of them:

$REMOVED_KEYS
EOF
)
  fi

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

# Append the component version sections to the body, so that both the insert and the update path
# below carry them without any extra handling. This happens before the body is normalised so that
# Prettier wraps these sentences to the same width as the rest of the notes. The citation stripper
# only matches brace-wrapped markers, so it cannot alter them.
if [[ "$COMPONENT_ANSWER_GIVEN" == false && -n "${PRESERVED_COMPONENT_SECTIONS:-}" ]]; then
  # Not told whether the versions moved, so the sections that are published stay exactly as they
  # are, matching the rows that were left alone above.
  SUPER_BUG_FIXES_BODY="$SUPER_BUG_FIXES_BODY"$'\n\n'"$PRESERVED_COMPONENT_SECTIONS"
  echo "ℹ️  Kept the Edge and Automation sections $PATCH_RELEASE_TICKET already publishes."
else
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
fi

# Super's answer is inserted verbatim, so normalise it before it reaches the release notes: drop the
# inline citation markers the assistant appends to sentences, and restore the blank lines and prose
# wrapping the published notes use. Prettier cannot repair either afterwards, because .prettierrc
# parses *.md as MDX and the MDX parser leaves prose exactly as written.
SUPER_BUG_FIXES_BODY=$(printf '%s\n' "$SUPER_BUG_FIXES_BODY" | normalize_super_body)

if [[ -z "$SUPER_BUG_FIXES_BODY" ]]; then
  echo "❌ Normalising the release notes body left it empty" >&2
  exit 1
fi

# ---------------------------------------------------------------------------------------------
# Component pages
#
# Rows this ticket wrote on an earlier run that this run no longer wants are removed first, then
# the rows it does want are written. The removal matters on release day: a patch that turns out to
# ship the same CanvOS and Palette CLI as the release before it should leave no trace in the
# component pages, not a placeholder row with pending checksums for a version that never moved.
# Rows keyed on a superseded version were already removed above, before the comparisons that read
# these tables. Only rows this ticket's section documented are touched, and only when the component
# question was actually answered, so a re-run that simply did not mention the components keeps what
# is published rather than taking silence for a decision.
# ---------------------------------------------------------------------------------------------
if [[ "$COMPONENT_ANSWER_GIVEN" == false && ( "$SECTION_HAD_EDGE" == true || "$SECTION_HAD_AUTOMATION" == true ) ]]; then
  echo "ℹ️  This run was not told whether the component versions moved, so the rows $PATCH_RELEASE_TICKET already documents are left as they are. Answer the component version question, or set PATCH_COMPONENT_UPDATES, to change them."
fi

if [[ "$COMPONENT_ANSWER_GIVEN" == true &&
      ( "$SECTION_HAD_EDGE" == true || "$SECTION_HAD_AUTOMATION" == true ) ]]; then
  # The CLI Tools table only records a release whose Palette CLI moved, and the Edge Compatibility
  # Matrix only records one where either component moved, so an earlier run's scaffolding is taken
  # back out rather than left to be tidied by hand.
  if [[ "$SECTION_HAD_AUTOMATION" == true && "$PALETTE_CLI_CHANGED" == false ]]; then
    if remove_line_containing "cli-$RELEASE_PATCH -->" "$DOWNLOADS_FILE"; then
      echo "✅ The Palette CLI did not move in $RELEASE_PATCH, so its rows were removed from $DOWNLOADS_FILE."
    fi
  fi

  if [[ "$CANVOS_CHANGED" == false && "$PALETTE_CLI_CHANGED" == false ]]; then
    if remove_line_containing "edge-compat-$RELEASE_PATCH -->" "$EDGE_COMPATIBILITY_MATRIX_FILE"; then
      echo "✅ Neither component moved in $RELEASE_PATCH, so its row was removed from $EDGE_COMPATIBILITY_MATRIX_FILE."
    fi
  fi
fi

# The install page records one version rather than a row per release, so it cannot be keyed on the
# patch and removed the way a row can. What it can be is repaired: an earlier run that had no
# Palette CLI version to record left a pending marker on a published page.
#
# The version it is repaired to is the newest one the CLI Tools table records, not this patch's
# own. The page documents the version a reader should install, which is the newest published one
# whatever train this patch belongs to, so repairing a 4.9 patch's pending marker with 4.9.21 would
# replace a correct 4.10 version with an older one.
if [[ "$COMPONENT_UPDATES" == true && "$PALETTE_CLI_CHANGED" == false ]] &&
   grep -qF "$PENDING_VERSION" "$INSTALL_FILE"; then
  NEWEST_DOCUMENTED_CLI=$(get_documented_table_version \
    "$DOWNLOADS_FILE" "$DOWNLOADS_CLI_VERSION_COLUMN" "$RELEASE_PATCH")

  if [[ "$NEWEST_DOCUMENTED_CLI" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]; then
    echo "ℹ️  $INSTALL_FILE records '$PENDING_VERSION', so it is corrected to Palette CLI $NEWEST_DOCUMENTED_CLI, the newest version the CLI Tools table records."
    RELEASE_PALETTE_CLI_VERSION="$NEWEST_DOCUMENTED_CLI" ./scripts/release/generate-install-palette-cli.sh
  else
    echo "⚠️  $INSTALL_FILE records '$PENDING_VERSION' and the CLI Tools table has no version to correct it from, so fix the page by hand." >&2
  fi
fi

# Propagate the component versions to the documentation pages that record them, reusing the scripts
# `make generate-release` runs so the tables keep one format and one insert-or-replace behaviour.
# The release is keyed on the patch version, so each page gains a row anchored to it and a re-run
# replaces that row instead of adding a second one.
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

  ./scripts/release/generate-edge-compatibility-matrix.sh

  if [[ "$PALETTE_CLI_CHANGED" == true ]]; then
    ./scripts/release/generate-install-palette-cli.sh

    export RELEASE_PALETTE_CLI_SHA
    export RELEASE_PALETTE_CLI_URL
    ./scripts/release/generate-downloads.sh
  fi
fi


# If the release notes section for this patch already exists, will replace the existing body with the new one generated by Super, otherwise will insert a new section for this patch release.
if grep -qF "$TICKET_MARKER" "$RELEASE_NOTES_FILE"; then
  tmp_body_file="$(mktemp)"
  printf '%s' "$SUPER_BUG_FIXES_BODY" > "$tmp_body_file"

  awk -v ticket="$PATCH_RELEASE_TICKET" -v body_file="$tmp_body_file" -v version="$RELEASE_PATCH" -v candidates="${CANDIDATE_KEYS:-none}" '
    # When we hit the ticket marker, print it, re-record the version and the candidate issues this
    # section is now generated for, and inject the new body. The markers are rewritten rather than
    # carried over, because the old ones sit inside the body region that is being replaced.
    $0 ~ "<!-- PATCH RELEASE TICKET: " ticket " -->" {
      print
      print "<!-- PATCH RELEASE VERSION: " version " -->"
      print "<!-- PATCH RELEASE CANDIDATES: " candidates " -->"
      print ""

      while ((getline line < body_file) > 0) {
        print line
      }
      close(body_file)

      # The body is written without the blank lines that surrounded it, so the ones separating it
      # from the markers above and from the next section below are added back here. Without them
      # the heading that follows would be absorbed into the last paragraph of this section.
      print ""
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
  # later run, once the version is confirmed, has to correct it. The date is refreshed for the
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

# A run that resolved no candidates records "none" rather than an empty marker, so that a later run
# tells "this ticket has never resolved a candidate list" apart from "this ticket documented these".
PATCH_RELEASE_CANDIDATES="${CANDIDATE_KEYS:-none}"

generate_parameterised_file_local_vars \
  "$PATCH_NOTES_TEMPLATE_FILE" \
  "$PATCH_NOTES_OUTPUT_FILE" \
  "RELEASE_DATE" \
  "RELEASE_PATCH" \
  "PATCH_RELEASE_TICKET" \
  "PATCH_RELEASE_CANDIDATES" \
  "SUPER_BUG_FIXES_BODY"

insert_file_after "<ReleaseNotesVersions />" $PATCH_NOTES_OUTPUT_FILE $RELEASE_NOTES_FILE
echo "✅ Patch release notes generated and inserted into $RELEASE_NOTES_FILE."
cleanup $PATCH_NOTES_OUTPUT_FILE
