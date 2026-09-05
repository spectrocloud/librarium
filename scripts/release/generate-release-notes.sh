#!/bin/bash
# Import utility functions
source scripts/release/utilities.sh

# Define release note related files
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
RELEASE_NOTES_TEMPLATE_FILE="scripts/release/templates/release-notes.md"
RELEASE_NOTES_HEADING_TEMPLATE_FILE="scripts/release/templates/release-notes-heading.md"
EDGE_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-edge-callout.md"
AUTOMATION_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-automation-callout.md"
RELEASE_NOTES_COMPOSED_FILE="scripts/release/release-notes-composed.md"
RELEASE_NOTES_PARAMETERISED_FILE="scripts/release/release-notes-output.md"
RELEASE_NOTES_HEADING_PARAMETERISED_FILE="scripts/release/release-notes-heading-output.md"

# RELEASE_CANVOS and RELEASE_PALETTE_CLI_VERSION fill the Edge and Automation callouts. Both are
# required, because generate_parameterised_file substitutes an unset variable with an empty string
# and would leave a sentence that names no version rather than a visible placeholder.
#
# RELEASE_TERRAFORM_VERSION deliberately fills both the Terraform provider and the Crossplane
# provider entries under Automation. The two providers have so far always released on the same
# version, so they share one variable; split it if that ever stops being true.
if ! check_env "RELEASE_DATE" ||
   ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_CANVOS" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION" ||
   ! check_env "RELEASE_TERRAFORM_VERSION" ||
   ! check_env "RELEASE_VERSION" ; then
    echo "‼️  Skipping generate $RELEASE_NOTES_FILE due to missing environment variables. ‼️"
    exit 0
fi

# The Edge and Automation callouts are held in their own templates, because the component versions
# they name can be bumped again on the day of release and generate-release-notes-callouts.sh has to
# be able to rewrite them in the published notes afterwards. They are composed into the release
# notes template here rather than duplicated inline, so each sentence has one definition and the
# published callout cannot drift from the one a later refresh would write.
#
# The composed file still carries the {{RELEASE_*}} placeholders the callout templates use, so the
# substitution pass below fills them along with the rest of the template.
EDGE_CALLOUT="$(cat "$EDGE_CALLOUT_TEMPLATE_FILE")"
AUTOMATION_CALLOUT="$(cat "$AUTOMATION_CALLOUT_TEMPLATE_FILE")"

generate_parameterised_file_local_vars \
    "$RELEASE_NOTES_TEMPLATE_FILE" "$RELEASE_NOTES_COMPOSED_FILE" \
    EDGE_CALLOUT AUTOMATION_CALLOUT

generate_parameterised_file $RELEASE_NOTES_COMPOSED_FILE $RELEASE_NOTES_PARAMETERISED_FILE
generate_parameterised_file $RELEASE_NOTES_HEADING_TEMPLATE_FILE $RELEASE_NOTES_HEADING_PARAMETERISED_FILE

# The anchor is matched with its closing brace so a release name cannot substring-match a longer
# one, for example "#release-notes-4.10.1" matching an existing "#release-notes-4.10.10" heading
# and relabelling that release's block instead of inserting a new one.
existing_notes=$(search_line "#release-notes-$RELEASE_NAME}" $RELEASE_NOTES_FILE)
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    echo "ℹ️ Release notes for $RELEASE_NAME have already been generated in $RELEASE_NOTES_FILE"
    replace_line $existing_notes $RELEASE_NOTES_HEADING_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced release notes heading in $RELEASE_NOTES_FILE"
    echo "ℹ️ Only the heading is refreshed here, because the rest of the block is hand-written. Run 'make generate-release' to refresh the Edge and Automation component version callouts."
else
    insert_file_after "<ReleaseNotesVersions />" $RELEASE_NOTES_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Parameterised release notes inserted into $RELEASE_NOTES_FILE"
fi

cleanup $RELEASE_NOTES_COMPOSED_FILE
cleanup $RELEASE_NOTES_PARAMETERISED_FILE
cleanup $RELEASE_NOTES_HEADING_PARAMETERISED_FILE
