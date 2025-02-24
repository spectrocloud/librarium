#!/bin/bash

# Define release note related files
RELEASE_NOTES_FILE="docs/docs-content/release-notes/release-notes.md"
RELEASE_NOTES_TEMPLATE_FILE="scripts/release/release-notes-template.md"
RELEASE_NOTES_PARAMETERISED_FILE="scripts/release/release-notes-output.md"
TEMP_FILE="scripts/release/temp_file.md"

# First, let's see if the release notes have already been generated
existing_notes=$(grep -m1 -n "#release-notes-$RELEASE_PALETTE_NAME" "$RELEASE_NOTES_FILE" | cut -d: -f1)
if [[ -n "$existing_notes" ]]; then
    echo "ℹ️ Release notes for $RELEASE_PALETTE_NAME have already been generated in $RELEASE_NOTES_FILE"
    sed -i '' "${existing_notes}s|.*|## $RELEASE_DATE - Release $RELEASE_VERSION {#release-notes-$RELEASE_PALETTE_NAME}|" "$RELEASE_NOTES_FILE"
    echo "✅ Updated release notes heading only in $RELEASE_NOTES_FILE"
    exit 0
fi

# Make a copy of the template file to parameterise
cp "$RELEASE_NOTES_TEMPLATE_FILE" "$RELEASE_NOTES_PARAMETERISED_FILE"

# Loop through all RELEASE_ environment variables
for var in $(compgen -e | grep ^RELEASE_); do
    value=$(printf '%s' "${!var}")
    placeholder="{{${var}}}"  # Define placeholder format (e.g., {{RELEASE_VERSION}})

    # Replace placeholder in file
    sed -i '' "s|$placeholder|$value|g" "$RELEASE_NOTES_PARAMETERISED_FILE"
done

# Process the target file line by line
while IFS= read -r line; do
    echo "$line" >> "$TEMP_FILE"

    # When encountering <ReleaseNotesVersions />, insert a new line and the parameterised content
    if [[ "$line" == "<ReleaseNotesVersions />" ]]; then
        echo "" >> "$TEMP_FILE"  # Insert a blank line
        cat "$RELEASE_NOTES_PARAMETERISED_FILE" >> "$TEMP_FILE"
    fi
done < "$RELEASE_NOTES_FILE"

# Replace original release notes with the updated one
mv "$TEMP_FILE" "$RELEASE_NOTES_FILE"
echo "✅ Parameterised release notes inserted into $RELEASE_NOTES_FILE"

# Cleanup
rm $RELEASE_NOTES_PARAMETERISED_FILE
