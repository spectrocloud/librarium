#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
DOWNLOADS_FILE="${DOWNLOADS_FILE:-docs/docs-content/downloads/cli-tools.md}"
CLI_TEMPLATE_FILE="scripts/release/templates/palette-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
TABLE_OFFSET=2
# 1-based columns of the CLI Tools table, counting the Palette Release cell as column 1. Used to
# read back what a release's row already records, so a re-run can reuse a checksum it derived
# earlier instead of downloading the binary again.
DOWNLOADS_CLI_VERSION_COLUMN=2
DOWNLOADS_SHA_COLUMN=4

# The checksums are deliberately not required. Each architecture's row records a marker naming its
# missing checksum instead, so the entry exists from the first run and a later run only has to fill
# the cell in. Requiring the AMD64 checksum here used to skip the whole file, which left the ARM64
# and macOS rows unwritten even when their own checksums were known.
if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION" ; then
    echo "‼️  Skipping generate $DOWNLOADS_FILE due to missing environment variables. ‼️"
    exit 0
fi

# The Palette CLI table is split into three tabs, one per supported architecture. Each spec
# below carries the display name used in log output, the marker that anchors the tab's table
# in the downloads file, the URL suffix under
# https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/, and the names
# of the variables holding that architecture's checksum and, optionally, its download URL.
# Loop-scoped indirection lets one template render all three rows. PALETTE_CLI_ARCHES in
# scripts/release/generate-patch-release-notes.sh mirrors this list, so a new architecture has to
# be added in both places.
ARCHES=(
    "Linux AMD64|palette-cli-version-table|linux/cli/palette|RELEASE_PALETTE_CLI_SHA|RELEASE_PALETTE_CLI_URL"
    "Linux ARM64|palette-cli-linux-arm64-table|linux-arm64/cli/palette|RELEASE_PALETTE_CLI_ARM64_SHA|RELEASE_PALETTE_CLI_ARM64_URL"
    "macOS ARM64|palette-cli-macos-arm64-table|darwin-arm64/cli/palette|RELEASE_PALETTE_CLI_MACOS_SHA|RELEASE_PALETTE_CLI_MACOS_URL"
)

for spec in "${ARCHES[@]}"; do
    IFS='|' read -r arch_name marker url_suffix sha_var url_var <<< "$spec"

    # A tab the target file does not have is skipped rather than treated as a failure. The release
    # branches for versions published before the table was split carry the AMD64 tab alone, and
    # insert_file_offset exits the whole script when its marker is missing, which would otherwise
    # abandon the run part-way through with only some of the rows written.
    if ! grep -qF "$marker" "$DOWNLOADS_FILE"; then
        echo "ℹ️ $DOWNLOADS_FILE has no $marker table, so the $arch_name row is skipped."
        continue
    fi

    # Resolve this architecture's checksum, in order of preference:
    #
    #   1. The value already in the environment, normally from .env. This wins outright, including
    #      when it is a pending marker, because a caller that resolved a value itself is telling us
    #      what to record. generate-patch-release-notes.sh always passes something, so it never
    #      reaches the steps below and its own prompt stays the only place it asks.
    #   2. The checksum this release's row already records, but only when that row also records the
    #      Palette CLI version this run is writing. Matching on the version is what makes reuse safe:
    #      after a release-day bump the recorded checksum belongs to the previous binary, so it has
    #      to be re-derived rather than carried over onto a new download URL.
    #   3. The published binary, hashed as it downloads. This is a fallback rather than the norm
    #      because the transfer runs to several hundred megabytes per architecture.
    #   4. A marker naming what is missing, so the row exists from the first run and a later run
    #      only has to fill the cell in.
    RELEASE_PALETTE_CLI_SHA="${!sha_var:-}"
    sha_source=""

    if [[ -n "$RELEASE_PALETTE_CLI_SHA" ]]; then
        sha_source="$sha_var"
    else
        recorded_cli_version=$(get_table_cell_for_release \
            "$DOWNLOADS_FILE" "$DOWNLOADS_CLI_VERSION_COLUMN" "$RELEASE_VERSION" "$marker")
        recorded_sha=$(get_table_cell_for_release \
            "$DOWNLOADS_FILE" "$DOWNLOADS_SHA_COLUMN" "$RELEASE_VERSION" "$marker")

        if [[ "$recorded_cli_version" == "$RELEASE_PALETTE_CLI_VERSION" && "$recorded_sha" =~ ^[0-9a-f]{64}$ ]]; then
            RELEASE_PALETTE_CLI_SHA="$recorded_sha"
            sha_source="the checksum already recorded for Palette CLI $RELEASE_PALETTE_CLI_VERSION"
        else
            # A version that is not published yet returns HTTP 403, which the helper checks for
            # before trusting a digest, so an unavailable binary costs one request and reports
            # itself. That is an expected outcome on release day rather than a failure, so the run
            # continues and the cell is left pending.
            echo "ℹ️  '$sha_var' is empty or not set, so the $arch_name checksum is derived from the published binary." >&2

            if RELEASE_PALETTE_CLI_SHA=$(fetch_palette_cli_sha "$RELEASE_PALETTE_CLI_VERSION" "$url_suffix"); then
                sha_source="the published binary"
            else
                RELEASE_PALETTE_CLI_SHA="$PENDING_SHA"
                echo "🟠 The $arch_name Palette CLI $RELEASE_PALETTE_CLI_VERSION binary could not be hashed, so the row records '$PENDING_SHA'. Set '$sha_var' in your .env file, or re-run this script once the binary is published." >&2
            fi
        fi
    fi

    if [[ -n "$sha_source" ]]; then
        echo "ℹ️  $arch_name checksum sourced from $sha_source."
    fi

    # The download URL is normally derived from the Palette CLI version, but a caller that does not
    # yet know the version can pass a placeholder instead of a link that would not resolve.
    RELEASE_PALETTE_CLI_URL="${!url_var:-}"

    if [[ -z "$RELEASE_PALETTE_CLI_URL" ]]; then
        RELEASE_PALETTE_CLI_URL="https://software.spectrocloud.com/palette-cli/v${RELEASE_PALETTE_CLI_VERSION}/${url_suffix}"
    fi

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
