#!/bin/bash
# Import utility functions
source scripts/release/utilities.sh

# Define release note related files
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
RELEASE_NOTES_TEMPLATE_FILE="scripts/release/release-notes-template.md"
RELEASE_NOTES_HEADING_TEMPLATE_FILE="scripts/release/release-notes-heading-template.md"
RELEASE_NOTES_PARAMETERISED_FILE="scripts/release/release-notes-output.md"
RELEASE_NOTES_HEADING_PARAMETERISED_FILE="scripts/release/release-notes-heading-output.md"

generate_parameterised_file $RELEASE_NOTES_TEMPLATE_FILE $RELEASE_NOTES_PARAMETERISED_FILE
generate_parameterised_file $RELEASE_NOTES_HEADING_TEMPLATE_FILE $RELEASE_NOTES_HEADING_PARAMETERISED_FILE

# First, let's see if the release notes have already been generated
search_line "#release-notes-$RELEASE_NAME" $RELEASE_NOTES_FILE
existing_notes=$?
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    echo "ℹ️ Release notes for $RELEASE_NAME have already been generated in $RELEASE_NOTES_FILE"
    replace_line $existing_notes $RELEASE_NOTES_HEADING_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced release notes heading in $RELEASE_NOTES_FILE"
else
    insert_file_after "<ReleaseNotesVersions />" $RELEASE_NOTES_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Parameterised release notes inserted into $RELEASE_NOTES_FILE"
fi


# Cleanup
cleanup $RELEASE_NOTES_PARAMETERISED_FILE
cleanup $RELEASE_NOTES_HEADING_PARAMETERISED_FILE
