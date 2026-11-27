#!/usr/bin/env bash

####################################################################################################
# Posts a digest of a Jira epic's unassigned tickets to Slack so that team members can self-assign
# them. The STIG Weekly Digest workflow (.github/workflows/stig-weekly-digest.yaml) runs it every
# Monday.
#
# librarium is a public repository, and anyone can read its Actions logs. This script never writes
# ticket keys, summaries, or query results to standard output, standard error, or the step summary.
# It prints only counts and HTTP status codes, and posts the digest from a payload file in a private
# temporary directory.
#
# Every query is scoped to JIRA_PROJECT, because other projects also use the label, and their
# tickets must not be posted.
#
# Required environment variables:
#   JIRA_EMAIL, JIRA_API_TOKEN  Basic auth for the Jira REST API.
#   EPIC_KEY                    The epic to watch, for example DOC-3509.
#   SLACK_WEBHOOK_URL           The incoming webhook that receives the digest. Not needed with DRY_RUN=1.
#
# Optional environment variables:
#   EPIC_LABEL    Also include tickets in JIRA_PROJECT that carry this label but are not in the epic
#                 yet. The label also titles the message. Default: none.
#   JIRA_PROJECT  The project that every query is scoped to. Default: DOC.
#   MAX_TICKETS   The most tickets listed before "and N more". Default: 15.
#   DRY_RUN       Set to 1 to print the message to this terminal instead of posting it. Refused in
#                 GitHub Actions, because it prints ticket data.
#
# Local dry run:
#   JIRA_EMAIL=<you>@spectrocloud.com JIRA_API_TOKEN=<token> EPIC_KEY=DOC-3509 EPIC_LABEL=STIG \
#     DRY_RUN=1 ./scripts/jira-epic-digest.sh
####################################################################################################

set -euo pipefail

JIRA_DOMAIN="https://spectrocloud.atlassian.net"
JIRA_PROJECT="${JIRA_PROJECT:-DOC}"
EPIC_KEY="${EPIC_KEY:-}"
EPIC_LABEL="${EPIC_LABEL:-}"
MAX_TICKETS="${MAX_TICKETS:-15}"
DRY_RUN="${DRY_RUN:-0}"

# fail <message> [hint]
# Prints the message, passes the hint (default: the message) to the workflow's failure notice, and
# exits. Neither may contain ticket data.
fail() {
  echo "❌  $1" >&2
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "failure_hint=${2:-$1}" >>"$GITHUB_OUTPUT"
  fi
  exit 1
}

for var in JIRA_EMAIL JIRA_API_TOKEN EPIC_KEY; do
  if [[ -z "${!var:-}" ]]; then
    fail "${var} is not set."
  fi
done

if [[ "$DRY_RUN" == "1" ]]; then
  if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
    fail "DRY_RUN prints ticket data, so it is refused in GitHub Actions, whose logs are public."
  fi
elif [[ -z "${SLACK_WEBHOOK_URL:-}" ]]; then
  fail "SLACK_WEBHOOK_URL is not set. Set DRY_RUN=1 to print the message instead." "The Slack webhook secret is empty."
fi

# These values go into JQL, so accept only the characters they need.
[[ "$EPIC_KEY" =~ ^[A-Z][A-Z0-9_]+-[0-9]+$ ]] || fail "EPIC_KEY must be an issue key, such as DOC-1234."
[[ "$JIRA_PROJECT" =~ ^[A-Z][A-Z0-9_]+$ ]] || fail "JIRA_PROJECT must be a project key, such as DOC."
[[ -z "$EPIC_LABEL" || "$EPIC_LABEL" =~ ^[A-Za-z0-9_-]+$ ]] || fail "EPIC_LABEL can contain only letters, digits, hyphens, and underscores."
[[ "$MAX_TICKETS" =~ ^[1-9][0-9]*$ ]] || fail "MAX_TICKETS must be a positive whole number."

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

# Escapes a value for a double-quoted curl config entry. sed reads the value on standard input, so it
# never appears on a command line, and it escapes the same way in every bash version.
curlrc_quote() {
  printf '"%s"' "$(printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')"
}

# Pass the Jira credentials and the webhook URL to curl in config files instead of on its command
# line, where other processes could read them. printf is a shell builtin, so it does not expose them
# either.
umask 077
printf 'user = %s\n' "$(curlrc_quote "${JIRA_EMAIL}:${JIRA_API_TOKEN}")" >"$WORKDIR/jira.curlrc"
if [[ "$DRY_RUN" != "1" ]]; then
  printf 'url = %s\n' "$(curlrc_quote "$SLACK_WEBHOOK_URL")" >"$WORKDIR/slack.curlrc"
fi

# jira_request <method> <path> [body-file]
# Writes the response body to $WORKDIR/response.json and the status code to HTTP_STATUS. Each
# request gives up after about a minute, so the whole run stays inside the workflow's step timeout.
jira_request() {
  local method=$1 path=$2 body=${3:-}
  local args=(-sS -K "$WORKDIR/jira.curlrc" -X "$method" -o "$WORKDIR/response.json" -w '%{http_code}'
    --max-time 20 --retry 2 --retry-delay 5 --retry-max-time 45
    -H "Accept: application/json")
  if [[ -n "$body" ]]; then
    args+=(-H "Content-Type: application/json" --data "@${body}")
  fi
  : >"$WORKDIR/response.json"
  HTTP_STATUS=$(curl "${args[@]}" "${JIRA_DOMAIN}${path}") || HTTP_STATUS="000"
}

# check_jira <what>
# Fails with a data-free hint unless the last request returned 200.
check_jira() {
  local what=$1 hint
  if [[ "$HTTP_STATUS" == "200" ]]; then
    return 0
  fi
  case "$HTTP_STATUS" in
  401 | 403)
    hint="Jira returned HTTP ${HTTP_STATUS}. The JIRA_API_TOKEN secret has likely expired or been rotated, or the JIRA_EMAIL account lost access to the ${JIRA_PROJECT} project."
    ;;
  404)
    hint="Jira returned HTTP 404 for the ${what}. Check the epic key, and that the JIRA_EMAIL account can see the epic."
    ;;
  000)
    hint="The Jira ${what} got no response: it timed out or could not connect."
    ;;
  *)
    hint="Jira returned HTTP ${HTTP_STATUS} for the ${what}."
    ;;
  esac
  # Jira's error messages can quote the query, so show them only outside GitHub Actions.
  if [[ "${GITHUB_ACTIONS:-}" != "true" ]]; then
    jq -r '.errorMessages[]?' "$WORKDIR/response.json" >&2 2>/dev/null || true
  fi
  fail "Jira ${what} failed with HTTP ${HTTP_STATUS}." "$hint"
}

# jira_search <what> <jql> <fields-json> <out-file>
# Writes every matching issue, across all result pages, to <out-file> as one JSON array.
jira_search() {
  local what=$1 jql=$2 fields=$3 out=$4 token="" pages=0
  echo '[]' >"$out"
  while :; do
    pages=$((pages + 1))
    if ((pages > 20)); then
      fail "The ${what} returned more than 20 pages of results."
    fi
    jq -n --arg jql "$jql" --argjson fields "$fields" --arg token "$token" \
      '{jql: $jql, fields: $fields, maxResults: 100} + (if $token == "" then {} else {nextPageToken: $token} end)' \
      >"$WORKDIR/request.json"
    jira_request POST /rest/api/3/search/jql "$WORKDIR/request.json"
    check_jira "$what"
    jq -s '.[0] + (.[1].issues // [])' "$out" "$WORKDIR/response.json" >"$WORKDIR/merged.json"
    mv "$WORKDIR/merged.json" "$out"
    token=$(jq -r '.nextPageToken // ""' "$WORKDIR/response.json")
    if [[ -z "$token" ]]; then
      break
    fi
  done
  echo "Jira ${what}: HTTP 200, $(jq length "$out") results."
}

# Jira treats a bad or expired token as an anonymous user instead of rejecting it: searches return
# HTTP 200 with no results, and issue lookups return 404. Check the token, then the epic, before
# searching, so an empty result can never read as "no tickets need an owner".
jira_request GET /rest/api/3/myself
check_jira "token check"
echo "Jira token check: HTTP 200."

# A mistyped key that points at an ordinary ticket would also return 200, so check that it is an
# epic in the project.
jira_request GET "/rest/api/3/issue/${EPIC_KEY}?fields=issuetype,project"
check_jira "epic lookup"
if ! jq -e --arg project "$JIRA_PROJECT" \
  '.fields.issuetype.name == "Epic" and .fields.project.key == $project' \
  "$WORKDIR/response.json" >/dev/null; then
  fail "${EPIC_KEY} is not an epic in the ${JIRA_PROJECT} project." "${EPIC_KEY} is not an epic in the ${JIRA_PROJECT} project. Check the EPIC_KEY value in the workflow."
fi
echo "Jira epic lookup: HTTP 200."

# Tickets in the epic, plus labeled tickets in the same project that are not in the epic yet. The
# epic itself carries the label, so leave epics out.
SCOPE="project = ${JIRA_PROJECT} AND issuetype != Epic AND (parent = ${EPIC_KEY}"
if [[ -n "$EPIC_LABEL" ]]; then
  SCOPE+=" OR labels = \"${EPIC_LABEL}\""
fi
SCOPE+=")"

UNASSIGNED_JQL="${SCOPE} AND assignee IS EMPTY AND statusCategory != Done AND status != \"ON HOLD\" ORDER BY priority DESC, created ASC"
# statusCategoryChangedDate is set when the ticket closes. The resolution date is filled in by a
# nightly job, so it lags by up to a day.
RESOLVED_JQL="${SCOPE} AND statusCategory = Done AND statusCategoryChangedDate >= -7d"
IN_PROGRESS_JQL="${SCOPE} AND statusCategory = \"In Progress\" AND status != \"ON HOLD\""
ON_HOLD_JQL="${SCOPE} AND status = \"ON HOLD\""

jira_search "unassigned search" "$UNASSIGNED_JQL" '["summary", "priority", "created"]' "$WORKDIR/unassigned.json"
jira_search "resolved search" "$RESOLVED_JQL" '["status"]' "$WORKDIR/resolved.json"
jira_search "in-progress search" "$IN_PROGRESS_JQL" '["status"]' "$WORKDIR/in-progress.json"
jira_search "on-hold search" "$ON_HOLD_JQL" '["status"]' "$WORKDIR/on-hold.json"

UNASSIGNED_COUNT=$(jq length "$WORKDIR/unassigned.json")
RESOLVED_COUNT=$(jq length "$WORKDIR/resolved.json")
IN_PROGRESS_COUNT=$(jq length "$WORKDIR/in-progress.json")
ON_HOLD_COUNT=$(jq length "$WORKDIR/on-hold.json")

# Build the message in Slack mrkdwn: single asterisks for bold, <url|text> links, and &, <, and >
# escaped in ticket text.
jq -n \
  --slurpfile unassigned "$WORKDIR/unassigned.json" \
  --argjson resolved "$RESOLVED_COUNT" \
  --argjson in_progress "$IN_PROGRESS_COUNT" \
  --argjson on_hold "$ON_HOLD_COUNT" \
  --argjson max "$MAX_TICKETS" \
  --arg domain "$JIRA_DOMAIN" \
  --arg epic "$EPIC_KEY" \
  --arg label "$EPIC_LABEL" \
  --arg jql "$UNASSIGNED_JQL" '
  def esc: gsub("&"; "&amp;") | gsub("<"; "&lt;") | gsub(">"; "&gt;");
  # Cuts at the last whole word that fits in $n characters.
  def trunc($n): if length > $n then (.[0:$n + 1] | sub(" +[^ ]*$"; "") | .[0:$n]) + "…" else . end;
  def link($key): "<\($domain)/browse/\($key)|\($key)>";
  # Jira timestamps look like 2026-11-23T10:17:25.090-0800. Anything else gives no output.
  def epoch:
    capture("^(?<dt>[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2})(\\.[0-9]+)?(?<tz>Z|(?<sign>[+-])(?<hh>[0-9]{2}):?(?<mm>[0-9]{2}))$")
    | ((.dt + "Z") | fromdateiso8601)
      - (if .tz == "Z" then 0
        else (if .sign == "+" then 1 else -1 end) * ((.hh | tonumber) * 3600 + (.mm | tonumber) * 60)
        end);
  def age:
    ([(.fields.created // "") | epoch][0]) as $created
    | if $created == null then "age unknown"
      else ((now - $created) / 86400 | floor) as $days
        | if $days < 1 then "opened today" elif $days == 1 then "1 day" else "\($days) days" end
      end;

  $unassigned[0] as $issues
  | ($issues | length) as $count
  | (if $label == "" then $epic else $label end) as $name
  | [
      (if $count == 0
        then "*\($name) docs: no tickets need an owner* (\(link($epic)))"
        elif $count == 1
        then "*\($name) docs: 1 ticket needs an owner* (\(link($epic)))"
        else "*\($name) docs: \($count) tickets need an owner* (\(link($epic)))"
        end),
      ($issues[0:$max][]
        | "• \(link(.key)) \((.fields.summary // "") | trunc(80) | esc) · \((.fields.priority.name // "No priority") | esc) · \(age)"),
      (if $count > $max
        then "…and \($count - $max) more. <\($domain)/issues/?jql=\($jql | @uri)|See them all in Jira>."
        else empty
        end),
      "Last 7 days: \($resolved) resolved. Now: \($in_progress) in progress\(if $on_hold > 0 then ", \($on_hold) on hold" else "" end).",
      (if $count > 0
        then "To take one, open it, select *Assign to me*, and reply in this thread."
        else empty
        end)
    ]
  | {text: join("\n"), unfurl_links: false, unfurl_media: false}
  ' >"$WORKDIR/payload.json"

SUMMARY="${UNASSIGNED_COUNT} unassigned, ${RESOLVED_COUNT} resolved in the last 7 days, ${IN_PROGRESS_COUNT} in progress, ${ON_HOLD_COUNT} on hold."

if [[ "$DRY_RUN" == "1" ]]; then
  echo "DRY_RUN=1, so nothing was posted. ${SUMMARY} The message:"
  echo
  jq -r .text "$WORKDIR/payload.json"
  exit 0
fi

# No retry here, so a slow response can never post the digest twice. curl writes no response file
# when it cannot connect, so start with an empty one.
: >"$WORKDIR/slack-response.txt"
SLACK_STATUS=$(curl -sS -K "$WORKDIR/slack.curlrc" -X POST -o "$WORKDIR/slack-response.txt" -w '%{http_code}' \
  --max-time 30 -H "Content-Type: application/json" --data "@${WORKDIR}/payload.json") || SLACK_STATUS="000"
if [[ "$SLACK_STATUS" == "000" ]]; then
  # Slack might have delivered the message before the connection failed.
  fail "The Slack post got no response: it timed out or could not connect." \
    "The Slack post got no response, so the digest might have posted anyway. Check the channel before you rerun the workflow."
elif [[ "$SLACK_STATUS" != "200" ]]; then
  # Slack answers with a short error code, such as invalid_token or channel_not_found.
  SLACK_ERROR=$(tr -cd 'a-z_' <"$WORKDIR/slack-response.txt" | head -c 60)
  fail "Slack rejected the digest with HTTP ${SLACK_STATUS} (${SLACK_ERROR:-no error code})." \
    "Slack rejected the digest with HTTP ${SLACK_STATUS} (${SLACK_ERROR:-no error code}). Check the webhook secret."
fi

echo "Slack: HTTP 200. Posted the digest. ${SUMMARY}"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  echo "Posted the ${EPIC_LABEL:-$EPIC_KEY} digest to Slack: ${SUMMARY}" >>"$GITHUB_STEP_SUMMARY"
fi
