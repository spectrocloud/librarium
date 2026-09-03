#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
DOWNLOADS_FILE="${DOWNLOADS_FILE:-docs/docs-content/downloads/cli-tools.md}"
CLI_TEMPLATE_FILE="scripts/release/templates/palette-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION" ||
   ! check_env "RELEASE_PALETTE_CLI_SHA" ||
   ! check_env "RELEASE_PALETTE_CLI_ARM64_SHA" ||
   ! check_env "RELEASE_PALETTE_CLI_MACOS_SHA" ; then
    echo "‼️  Skipping generate $DOWNLOADS_FILE due to missing environment variables. ‼️"
    exit 0
fi

# The Palette CLI table is split into three tabs, one per supported architecture. Each spec
# below carries the display name used in log output, the marker that anchors the tab's table
# in the downloads file, the URL suffix under
# https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/, and the name
# of the env var holding that architecture's SHA256. Loop-scoped indirection lets one template
# render all three rows.
ARCHES=(
    "Linux AMD64|palette-cli-version-table|linux/cli/palette|RELEASE_PALETTE_CLI_SHA"
    "Linux ARM64|palette-cli-linux-arm64-table|linux-arm64/cli/palette|RELEASE_PALETTE_CLI_ARM64_SHA"
    "macOS ARM64|palette-cli-macos-arm64-table|darwin-arm64/cli/palette|RELEASE_PALETTE_CLI_MACOS_SHA"
)

for spec in "${ARCHES[@]}"; do
    IFS='|' read -r arch_name marker url_suffix sha_var <<< "$spec"

    RELEASE_PALETTE_CLI_URL="https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/${url_suffix}"
    RELEASE_PALETTE_CLI_SHA="${!sha_var}"

    # Only the variables the template uses are substituted, and through awk rather than
    # sed, because `sed -i ''` is BSD-only and this script also runs on a Linux runner.
    generate_parameterised_file_local_vars \
        "$CLI_TEMPLATE_FILE" "$CLI_PARAMETERISED_FILE" \
        RELEASE_NAME RELEASE_VERSION RELEASE_PALETTE_CLI_VERSION RELEASE_PALETTE_CLI_URL RELEASE_PALETTE_CLI_SHA

    # Check whether this arch's table already has a row for this release, scoped to the tab.
    # search_line_after starts scanning after the tab's marker and stops at </TabItem>, so a
    # cli-<release> --> anchor in another tab's table cannot match. The needle includes the
    # closing " -->" so a shorter release name such as "4.9.4" does not substring-match an
    # existing "4.9.48" row.
    existing_cli=$(search_line_after "$marker" "cli-$RELEASE_NAME -->" "$DOWNLOADS_FILE")
    if [[ -n "$existing_cli" && "$existing_cli" -ne 0 ]]; then
        echo "ℹ️ $arch_name CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
        replace_line "$existing_cli" "$CLI_PARAMETERISED_FILE" "$DOWNLOADS_FILE"
        echo "✅ Replaced $arch_name CLI line entry in $DOWNLOADS_FILE"
    else
        insert_file_offset "$TABLE_OFFSET" "$marker" "$CLI_PARAMETERISED_FILE" "$DOWNLOADS_FILE"
        echo "✅ Parameterised $arch_name CLI changes inserted into $DOWNLOADS_FILE"
    fi

    cleanup "$CLI_PARAMETERISED_FILE"
done
