#!/bin/bash

# Define cli related files
DOWNLOADS_FILE="docs/docs-content/spectro-downloads.md"
CLI_TEMPLATE_FILE="scripts/release/cli-template.md"
EDGE_CLI_TEMPLATE_FILE="scripts/release/edge-cli-template.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
EDGE_CLI_PARAMETERISED_FILE="scripts/release/edge-cli-output.md"
TEMP_FILE="scripts/release/temp_file.md"

# Define functions
generate_parameterised_files() {
    # Make a copy of the template file to parameterise
    cp "$CLI_TEMPLATE_FILE" "$CLI_PARAMETERISED_FILE"
    cp "$EDGE_CLI_TEMPLATE_FILE" "$EDGE_CLI_PARAMETERISED_FILE"

    # Loop through all RELEASE_ environment variables
    for var in $(compgen -e | grep ^RELEASE_); do
        value=$(printf '%s' "${!var}")
        placeholder="{{${var}}}"  # Define placeholder format {{RELEASE_VERSION}}

        # Replace placeholder in file
        sed -i '' "s|$placeholder|$value|g" "$CLI_PARAMETERISED_FILE"
        sed -i '' "s|$placeholder|$value|g" "$EDGE_CLI_PARAMETERISED_FILE"
    done
}

insert_cli() {
    # Process the file line by line until we find linux/cli/palette
    cli_inserted=false
    while IFS= read -r line; do
        # If we find the first occurrence of "linux/cli/palette"
        if [[ "$line" == *"linux/cli/palette"* && "$cli_inserted" == false ]]; then
            cat "$CLI_PARAMETERISED_FILE" >> "$TEMP_FILE"  # Insert file content
            cli_inserted=true  # Mark as inserted
        fi

        echo "$line" >> "$TEMP_FILE" 
    done < "$DOWNLOADS_FILE"

    # Replace the original file with the updated one
    mv "$TEMP_FILE" "$DOWNLOADS_FILE"

    echo "✅ Parameterised CLI changes inserted into $DOWNLOADS_FILE"
}

insert_edge_cli() {
    # Process the file line by line until we find cli/linux/palette-edge
    edge_cli_inserted=false
    while IFS= read -r line; do
        if [[ "$line" == *"cli/linux/palette-edge"* && "$edge_cli_inserted" == false ]]; then
            cat "$EDGE_CLI_PARAMETERISED_FILE" >> "$TEMP_FILE"  # Insert file content
            edge_cli_inserted=true  # Mark as inserted
        fi

        echo "$line" >> "$TEMP_FILE" 
    done < "$DOWNLOADS_FILE"

    # Replace the original file with the updated one
    mv "$TEMP_FILE" "$DOWNLOADS_FILE"

    echo "✅ Parameterised edge CLI changes inserted into $DOWNLOADS_FILE"
}

cleanup() {
    # Cleanup
    rm $CLI_PARAMETERISED_FILE
    rm $EDGE_CLI_PARAMETERISED_FILE
}

# MAIN FLOW
generate_parameterised_files

# Check if the cli for this Palette release has already been added
existing_cli=$(grep -m1 -n "cli-$RELEASE_PALETTE_NAME" "$DOWNLOADS_FILE" | cut -d: -f1)
if [[ -n "$existing_cli" ]]; then
    echo "ℹ️ CLI entry for $RELEASE_PALETTE_NAME has already been generated in $DOWNLOADS_FILE"
    sed -i '' "${existing_cli}r $CLI_PARAMETERISED_FILE" "$DOWNLOADS_FILE" && sed -i '' "${existing_cli}d" "$DOWNLOADS_FILE"
    echo "✅ Replaced CLI line entry in $DOWNLOADS_FILE"
else
    insert_cli
fi

# Check if the cli for this Palette release has already been added
existing_edge_cli=$(grep -m1 -n "edge-$RELEASE_PALETTE_NAME" "$DOWNLOADS_FILE" | cut -d: -f1)
if [[ -n "$existing_edge_cli" ]]; then
    echo "ℹ️ Edge CLI entry for $RELEASE_PALETTE_NAME has already been generated in $DOWNLOADS_FILE"
    sed -i '' "${existing_edge_cli}r $EDGE_CLI_PARAMETERISED_FILE" "$DOWNLOADS_FILE" && sed -i '' "${existing_edge_cli}d" "$DOWNLOADS_FILE"
    echo "✅ Replaced edge CLI line entry in $DOWNLOADS_FILE"
else
    insert_edge_cli
fi

cleanup