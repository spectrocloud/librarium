#!/bin/bash
# Import utility functions
source scripts/release/utilities.sh

# Define release note related files
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
COMPONENT_UPDATES_TEMPLATE_FILE="scripts/release/templates/component-updates.md"
COMPONENT_UPDATES_HEADING_TEMPLATE_FILE="scripts/release/templates/component-updates-heading.md"
COMPONENT_UPDATES_PARAMETERISED_FILE="scripts/release/component-updates-output.md"
COMPONENT_UPDATES_HEADING_PARAMETERISED_FILE="scripts/release/component-updates-heading-output.md"

if ! check_env "RELEASE_DATE" || 
   ! check_env "RELEASE_COMPONENT_YEAR" ||  
   ! check_env "RELEASE_COMPONENT_WEEK" ||  
   ! check_env "RELEASE_COMPONENT_START_VERSION" ||  
   ! check_env "RELEASE_COMPONENT_END_VERSION" ||  
   ! check_env "RELEASE_TERRAFORM_VERSION" ; then
    echo "‼️  Skipping component updates in $RELEASE_NOTES_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $COMPONENT_UPDATES_TEMPLATE_FILE $COMPONENT_UPDATES_PARAMETERISED_FILE
generate_parameterised_file $COMPONENT_UPDATES_HEADING_TEMPLATE_FILE $COMPONENT_UPDATES_HEADING_PARAMETERISED_FILE
existing_notes=$(search_line "#component-updates-$RELEASE_COMPONENT_YEAR-$RELEASE_COMPONENT_WEEK" $RELEASE_NOTES_FILE)
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    echo "ℹ️ Component updates for $RELEASE_COMPONENT_YEAR - $RELEASE_COMPONENT_WEEK have already been generated in $RELEASE_NOTES_FILE"
    replace_line $existing_notes $COMPONENT_UPDATES_HEADING_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced component updates heading in $RELEASE_NOTES_FILE"
else
    insert_file_after "<ReleaseNotesVersions />" $COMPONENT_UPDATES_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Parameterised component updates inserted into $RELEASE_NOTES_FILE"
fi

cleanup $COMPONENT_UPDATES_PARAMETERISED_FILE
cleanup $COMPONENT_UPDATES_HEADING_PARAMETERISED_FILE