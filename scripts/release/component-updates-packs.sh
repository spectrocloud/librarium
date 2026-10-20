#!/bin/bash

# Functions that build the packs table of a weekly Component Updates block (DOC-3336).
#
# Sourced by generate-component-updates-ai.sh. They live in their own file so the packs table can be
# dry-run against a Component Updates ticket without calling Super or editing release-notes.md.
#
# The callers must set JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN, and COMPONENT_UPDATES_WORK_DIR to
# an empty scratch directory. PALETTE_API_KEY is optional: without it, the registry check is skipped
# and every pack is linked, as before DOC-3336.

PACK_REGISTRY_API="${PALETTE_API_URL:-https://api.spectrocloud.com}"

# A Platone task summary, for example:
#   [Platone] piraeus-operator 2.12.0 · week 2026-42 · csi · FIPS
# The version is any string without spaces, because registry versions can carry a suffix, such as
# kubernetes-rke2 1.36.3-rke2r1-build20260723.
PLATONE_SUMMARY_REGEX='^\[([^]]+)\] ([^[:space:]]+) ([^[:space:]]+) · week ([0-9]{4}-[0-9]{2}) · ([^[:space:]]+) · (non-FIPS|FIPS)$'

# GET a Jira REST path, for example /rest/api/3/issue/DOC-3304.
jira_get() {
  curl --fail-with-body -sS \
    --url "${JIRA_DOMAIN}${1}" \
    --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
    --header "Accept: application/json"
}

# Print the issues linked to a ticket as a JSON array of {key, summary, status} objects.
fetch_ticket_links() {
  jira_get "/rest/api/3/issue/${1}?fields=issuelinks" | jq -c '
    [ .fields.issuelinks[]
      | (.outwardIssue // .inwardIssue)
      | { key: .key, summary: .fields.summary, status: (.fields.status.name | ascii_downcase) } ]
  '
}

# Print "<key>\t<summary>\t<parent key>" for every [Platone] child of the given issues, skipping
# children closed as Not a Bug. Follows the search pagination, because one epic can hold more than
# a page of tasks.
fetch_platone_children() {
  local jql token="" response
  jql="parent in ($(IFS=,; echo "$*"))"
  while :; do
    response=$(
      curl --fail-with-body -sS --get \
        --url "${JIRA_DOMAIN}/rest/api/3/search/jql" \
        --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
        --header "Accept: application/json" \
        --data-urlencode "jql=${jql}" \
        --data-urlencode "fields=summary,status,parent" \
        --data-urlencode "maxResults=100" \
        ${token:+--data-urlencode "nextPageToken=${token}"}
    )
    jq -r '
      .issues[]
      | select(.fields.summary | contains("[Platone]"))
      | select(.fields.status.name | ascii_downcase != "not a bug")
      | [.key, .fields.summary, .fields.parent.key] | @tsv
    ' <<< "$response"
    token=$(jq -r 'if .isLast == false then .nextPageToken // empty else empty end' <<< "$response")
    [[ -n "$token" ]] || break
  done
}

# Record a line for one section of the run report. Sections: shi, skipped, unlinked, expanded,
# not_in_registry, notes.
report_add() {
  printf '%s\n' "$2" >> "${COMPONENT_UPDATES_WORK_DIR}/report-${1}.txt"
}

report_has() {
  [[ -s "${COMPONENT_UPDATES_WORK_DIR}/report-${1}.txt" ]]
}

report_lines() {
  report_has "$1" && sort -u "${COMPONENT_UPDATES_WORK_DIR}/report-${1}.txt"
  return 0
}

# Load the registries and pack types the docs site lists, so the registry check uses the same rules
# as plugins/packs-integrations.js, which builds the data that versioned-url-checker.sh validates
# pack links against.
load_documented_pack_rules() {
  DOCUMENTED_PACK_REGISTRIES=$(sed -n -E 's/^[[:space:]]*repositories: (\[.*\]),?$/\1/p' docusaurus.config.js | head -n1)
  DOCUMENTED_PACK_LAYERS=$(sed -n -E 's/^export const layerTypes = (\[.*\]) as const;$/\1/p' src/constants/packs.ts | head -n1)
  DOCUMENTED_ADDON_TYPES=$(sed -n '/^export const addOnTypes = \[/,/\]/p' src/constants/packs.ts | grep -o '"[^"]*"' | jq -s -c . 2>/dev/null || true)

  if ! jq -e 'type == "array" and length > 0' <<< "${DOCUMENTED_PACK_REGISTRIES:-null}" >/dev/null 2>&1 \
    || ! jq -e 'type == "array" and length > 0' <<< "${DOCUMENTED_PACK_LAYERS:-null}" >/dev/null 2>&1 \
    || ! jq -e 'type == "array" and length > 0' <<< "${DOCUMENTED_ADDON_TYPES:-null}" >/dev/null 2>&1; then
    echo "⚠️ Could not read the documented pack registries or pack types from docusaurus.config.js and src/constants/packs.ts; the registry check is skipped." >&2
    report_add notes "The registry check was skipped, because the documented pack registries or pack types could not be read from \`docusaurus.config.js\` and \`src/constants/packs.ts\`. Every pack is linked."
    PACK_REGISTRY_CHECK=false
    return 0
  fi

  if [[ -z "${PALETTE_API_KEY:-}" ]]; then
    echo "⚠️ PALETTE_API_KEY is not set, so the registry check is skipped and every pack is linked." >&2
    report_add notes "The registry check was skipped, because \`PALETTE_API_KEY\` is not set. Every pack is linked, and versions come from the Platone task summaries."
    PACK_REGISTRY_CHECK=false
    return 0
  fi

  PACK_REGISTRY_CHECK=true
}

# Look a pack up in the documented registries once, and cache the result in the work directory:
#   <slug>.status    linked, unlinked, or unknown (the lookup failed, so the pack stays linked)
#   <slug>.versions  every version the registry lists for the pack, one per line
registry_lookup() {
  local slug="$1" cache="${COMPONENT_UPDATES_WORK_DIR}/registry-$1" response pick uid layer cloud_type

  [[ -f "${cache}.status" ]] && return 0
  : > "${cache}.versions"

  if [[ "${PACK_REGISTRY_CHECK:-false}" != true ]]; then
    echo unknown > "${cache}.status"
    return 0
  fi

  if jq -e --arg name "$slug" 'index($name) != null' static/packs-data/exclude_packs.json >/dev/null 2>&1; then
    echo unlinked > "${cache}.status"
    return 0
  fi

  if ! response=$(
    curl --fail-with-body -sS --max-time 60 \
      --request POST \
      --url "${PACK_REGISTRY_API}/v1/packs/search?limit=50" \
      --header "ApiKey: ${PALETTE_API_KEY}" \
      --header "Content-Type: application/json" \
      --data "$(jq -cn --arg name "$slug" '{filter: {name: {eq: $name}, type: ["spectro", "oci"]}}')" 2>/dev/null
  ); then
    echo "⚠️ The pack registry search failed for $slug; leaving it linked." >&2
    report_add notes "The registry search failed for \`$slug\`, so it is linked without a check."
    echo unknown > "${cache}.status"
    return 0
  fi

  # Keep the packs the docs site lists: a documented registry, and a layer or add-on type the site
  # shows. Prefer the registries in the order docusaurus.config.js lists them.
  pick=$(
    jq -r \
      --arg name "$slug" \
      --argjson registries "$DOCUMENTED_PACK_REGISTRIES" \
      --argjson layers "$DOCUMENTED_PACK_LAYERS" \
      --argjson addons "$DOCUMENTED_ADDON_TYPES" '
      [ .items[]?
        | .spec
        | select(.name == $name)
        | select((.layer as $l | $layers | index($l)) or (.layer == "addon" and (.addonType as $a | $addons | index($a))))
        | . as $spec
        | (.registries // [])[]
        | select(.name as $n | $registries | index($n))
        | { uid: .uid,
            layer: $spec.layer,
            cloudType: (if (($spec.cloudTypes // []) | index("all")) or (($spec.cloudTypes // []) | length == 0) then "all" else $spec.cloudTypes[0] end),
            rank: (.name as $n | $registries | index($n)) } ]
      | sort_by(.rank)
      | first // empty
      | [.uid, .layer, .cloudType]
      | @tsv
    ' <<< "$response"
  )

  if [[ -z "$pick" ]]; then
    echo unlinked > "${cache}.status"
    return 0
  fi

  echo linked > "${cache}.status"
  IFS=$'\t' read -r uid layer cloud_type <<< "$pick"
  curl --fail-with-body -sS --max-time 120 --get \
    --url "${PACK_REGISTRY_API}/v1/packs/${slug}/registries/${uid}" \
    --header "ApiKey: ${PALETTE_API_KEY}" \
    --data-urlencode "cloudType=${cloud_type}" \
    --data-urlencode "layer=${layer}" 2>/dev/null \
    | jq -r '[.tags[]?.version | select(. != null)] | unique | .[]' > "${cache}.versions" 2>/dev/null \
    || : > "${cache}.versions"
}

# Print the version to show for a pack. A Platone summary can shorten a registry version, for
# example 1.33.13 for kubernetes-rke2 1.33.13-rke2r1-build20260612. When the summary version is not
# in the registry but exactly one registry version starts with "<version>-", use that one.
registry_version() {
  local slug="$1" version="$2" versions="${COMPONENT_UPDATES_WORK_DIR}/registry-$1.versions" matches count

  if [[ ! -s "$versions" ]] || grep -qxF -- "$version" "$versions"; then
    printf '%s' "$version"
    return 0
  fi

  matches=$(awk -v prefix="${version}-" 'index($0, prefix) == 1 && $0 !~ /-shi/' "$versions")
  count=$(printf '%s' "$matches" | grep -c . || true)
  if [[ "$count" -eq 1 ]]; then
    report_add expanded "| \`$slug\` | $version | $matches |"
    printf '%s' "$matches"
    return 0
  fi

  report_add not_in_registry "| \`$slug\` | $version |"
  printf '%s' "$version"
}

# Read "<key>\t<summary>" Platone rows and print the packs table, including the prettier-ignore
# wrapper that release-notes.md expects between the PACKS LIST BODY markers.
render_packs_table() {
  local rows_file="$1" parsed="${COMPONENT_UPDATES_WORK_DIR}/packs-parsed.tsv"
  local issue summary pack_name version layer variant normalized_pack status

  : > "$parsed"
  load_documented_pack_rules

  while IFS=$'\t' read -r issue summary; do
    [[ -n "$issue" ]] || continue
    if [[ ! "$summary" =~ $PLATONE_SUMMARY_REGEX ]]; then
      echo "⚠️ Skipping issue $issue because summary does not match expected format: $summary" >&2
      report_add skipped "| $issue | $summary |"
      continue
    fi

    pack_name="${BASH_REMATCH[2]}"
    version="${BASH_REMATCH[3]}"
    # Summaries write the layer in either case (K8S, k8s); the published tables use lowercase.
    layer=$(printf '%s' "${BASH_REMATCH[5]}" | tr '[:upper:]' '[:lower:]')
    variant="${BASH_REMATCH[6]}"

    # SHI builds are not documented yet. Platone's pack API has a shi field, but the generator runs
    # on GitHub-hosted runners that cannot reach Platone, so the version suffix is the signal for now.
    if [[ "$version" == *-shi* ]]; then
      echo "ℹ️ Excluding SHI build $issue: $pack_name $version" >&2
      report_add shi "| $issue | \`$pack_name\` | $version |"
      continue
    fi

    # Remove trailing -fips so FIPS/non-FIPS variants can be merged
    normalized_pack="${pack_name%-fips}"

    registry_lookup "$normalized_pack"
    status=$(cat "${COMPONENT_UPDATES_WORK_DIR}/registry-${normalized_pack}.status")
    if [[ "$status" == unlinked ]]; then
      report_add unlinked "- \`$normalized_pack\`"
    fi
    version=$(registry_version "$normalized_pack" "$version")

    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$normalized_pack" \
      "$layer" \
      "$version" \
      "$variant" \
      "$status" >> "$parsed"
  done < "$rows_file"

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
    linked[key] = ($5 != "unlinked")

    if ($4 == "non-FIPS") {
      nonfips[key] = ":white_check_mark:"
    } else if ($4 == "FIPS") {
      fips[key] = ":white_check_mark:"
    }
  }

  END {
    for (key in pack) {
      nf = (key in nonfips) ? nonfips[key] : ":x:"
      fp = (key in fips) ? fips[key] : ":x:"

      # Packs that are not in a documented registry have no integrations page, so a VersionedLink
      # would fail versioned-url-checker.sh. Name them in backticks instead.
      if (linked[key]) {
        name = sprintf("<VersionedLink text=\"%s\" url=\"/integrations/packs/?pack=%s\" />", pack[key], pack[key])
      } else {
        name = sprintf("`%s`", pack[key])
      }

      printf "%s\t%s\t| %s | `%s` | %s | %s | %s |\n", pack[key], version[key], name, layer[key], nf, fp, version[key]
    }
  }' "$parsed" | sort -t $'\t' -k1,1 -k2,2 | cut -f3-

  echo ""
  echo "<!-- prettier-ignore-end -->"
  echo ""
}

# Write the run report: print it to the log, append it to the GitHub job summary, and copy it to
# COMPONENT_UPDATES_REPORT_FILE so the workflow can add it to the pull request.
write_packs_report() {
  local out="${COMPONENT_UPDATES_WORK_DIR}/report.md"

  {
    echo "### Packs Table Report"
    echo ""

    if report_has epics; then
      echo "Epics read for [Platone] tasks: $(report_lines epics | paste -sd, - | sed 's/,/, /g')."
      echo ""
    fi

    if report_has skipped; then
      echo "**Skipped issues.** These summaries do not match the Platone format, so they are not in the table. Add them by hand if they belong."
      echo ""
      echo "| Issue | Summary |"
      echo "| ----- | ------- |"
      report_lines skipped
      echo ""
    fi

    if report_has shi; then
      echo "**Excluded SHI builds.** SHI packs are not documented yet."
      echo ""
      echo "| Issue | Pack | Version |"
      echo "| ----- | ---- | ------- |"
      report_lines shi
      echo ""
    fi

    if report_has unlinked; then
      echo "**Packs without a link.** These packs are not in a documented pack registry, so the table names them in backticks instead of linking them. A pack that never reached the registry might also be rejected in Platone, so confirm each one before you keep its row."
      echo ""
      report_lines unlinked
      echo ""
    fi

    if report_has expanded; then
      echo "**Versions taken from the registry.** The Platone summary shortens these versions."
      echo ""
      echo "| Pack | Summary version | Registry version |"
      echo "| ---- | --------------- | ---------------- |"
      report_lines expanded
      echo ""
    fi

    if report_has not_in_registry; then
      echo "**Versions not in the registry yet.** The pack might still be in validation, or Platone might have rejected the build. Confirm each one in Platone."
      echo ""
      echo "| Pack | Version |"
      echo "| ---- | ------- |"
      report_lines not_in_registry
      echo ""
    fi

    if report_has notes; then
      report_lines notes | sed 's/^/- /'
      echo ""
    fi

    echo "The generator cannot reach Platone, so it does not check each pack's Platone status. Before you merge, compare the table with the week's non-SHI list in Platone and remove any rejected pack."
  } > "$out"

  echo ""
  cat "$out"

  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
    cat "$out" >> "$GITHUB_STEP_SUMMARY"
  fi

  if [[ -n "${COMPONENT_UPDATES_REPORT_FILE:-}" ]]; then
    cp "$out" "$COMPONENT_UPDATES_REPORT_FILE"
  fi
}
