#!/bin/bash

# Refreshes the component versions recorded in the current release's published release notes, so a
# component bumped after the notes were drafted is corrected everywhere rather than only in the
# tables. Runs as part of `make generate-release`.
#
# We aim to settle the CanvOS and Palette CLI versions before a release ships, but either can be
# bumped again on the day, and the rest of `make generate-release` already picks a new version up
# from .env on a re-run. The release notes did not: generate-release-notes.sh writes the block once
# and afterwards only refreshes its heading, because everything else in the block is hand-written.
# That left the two callouts naming a version no later run could correct.
#
# Each region is therefore delimited by a start and an end marker keyed on RELEASE_NAME, which is
# stable across a release cycle even while RELEASE_VERSION is still a placeholder. The region
# between them is owned by this script and rewritten in full, so nothing outside it is touched and
# the markers are re-rendered ready for the next run.
#
# Three regions are managed: the Edge CanvOS callout, the Automation Palette CLI callout, and the
# Terraform and Crossplane provider bullets under Automation. Those bullets sit in a section writers
# also add to, so the region covers only the two provider bullets and anything below the end marker
# survives a refresh untouched. Splitting the list with a comment matches how the release notes
# already separate bullets with their ticket URL comments.
#
# A release whose notes predate the markers is reported and skipped. Add the markers around the
# existing content to bring that release under the script, or leave it alone if it has shipped.

# Import utility functions
source scripts/release/utilities.sh

# Define release note related files
RELEASE_NOTES_FILE="${RELEASE_NOTES_FILE:-docs/docs-content/release-notes/release-notes.md}"
EDGE_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-edge-callout.md"
AUTOMATION_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-automation-callout.md"
EDGE_CALLOUT_PARAMETERISED_FILE="scripts/release/release-notes-edge-callout-output.md"
AUTOMATION_CALLOUT_PARAMETERISED_FILE="scripts/release/release-notes-automation-callout-output.md"
AUTOMATION_FEATURES_TEMPLATE_FILE="scripts/release/templates/release-notes-automation-features.md"
AUTOMATION_FEATURES_PARAMETERISED_FILE="scripts/release/release-notes-automation-features-output.md"

# Only the two variables every region needs are required here. A region whose own version variable
# is unset is skipped individually below, so one missing value cannot stop the others refreshing.
if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION" ; then
    echo "‼️  Skipping refresh of the $RELEASE_NOTES_FILE component versions due to missing environment variables. ‼️"
    exit 0
fi

if [[ ! -f "$RELEASE_NOTES_FILE" ]]; then
    echo "❌ Release notes file $RELEASE_NOTES_FILE not found. Nothing was refreshed."
    exit 1
fi

# Each spec carries the display name used in log output, the marker base the region is keyed on,
# the template rendering that region, the file the rendered region is written to, and the names of
# the variables the template needs beyond RELEASE_NAME and RELEASE_VERSION.
REGIONS=(
    "Edge callout|release-notes-edge-callout|$EDGE_CALLOUT_TEMPLATE_FILE|$EDGE_CALLOUT_PARAMETERISED_FILE|RELEASE_CANVOS"
    "Automation callout|release-notes-automation-callout|$AUTOMATION_CALLOUT_TEMPLATE_FILE|$AUTOMATION_CALLOUT_PARAMETERISED_FILE|RELEASE_PALETTE_CLI_VERSION"
    "Automation provider bullets|release-notes-automation-features|$AUTOMATION_FEATURES_TEMPLATE_FILE|$AUTOMATION_FEATURES_PARAMETERISED_FILE|RELEASE_TERRAFORM_VERSION"
)

for spec in "${REGIONS[@]}"; do
    IFS='|' read -r region_name marker_base template_file output_file version_var <<< "$spec"

    start_marker="<!-- ${marker_base}-${RELEASE_NAME}-start -->"
    end_marker="<!-- ${marker_base}-${RELEASE_NAME}-end -->"

    if [[ -z "${!version_var:-}" ]]; then
        echo "🟠 '$version_var' is empty or not set, leaving the $region_name for $RELEASE_NAME unchanged." >&2
        continue
    fi

    if ! grep -qF "$start_marker" "$RELEASE_NOTES_FILE"; then
        echo "ℹ️ $RELEASE_NOTES_FILE has no $region_name marker for $RELEASE_NAME, so it is skipped."
        continue
    fi

    # Only the variables the template uses are substituted, and through awk rather than sed,
    # because `sed -i ''` is BSD-only.
    generate_parameterised_file_local_vars \
        "$template_file" "$output_file" \
        RELEASE_NAME RELEASE_VERSION "$version_var"

    if replace_region "$start_marker" "$end_marker" "$output_file" "$RELEASE_NOTES_FILE"; then
        echo "✅ Refreshed the $region_name for $RELEASE_NAME in $RELEASE_NOTES_FILE (${version_var}=${!version_var})"
    else
        echo "🟠 $RELEASE_NOTES_FILE has a $region_name start marker for $RELEASE_NAME but no matching end marker, so it was left unchanged." >&2
    fi

    cleanup "$output_file"
done
