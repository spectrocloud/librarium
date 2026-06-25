#!/bin/bash

# Adds (or updates) the current release's row in the Edge Compatibility Matrix
# documentation page. Runs as part of `make generate-release`.
#
# Component versions are sourced automatically from the nickfury repo's
# spectro_versions.txt at the release tag (see DOC-2911 / DOC-1978), falling back
# to environment-provided values when nickfury cannot be reached. The release row
# is rendered from a template and inserted at the top of the matrix table, or
# replaced in place if a row for this release already exists.

# Import utility functions
source scripts/release/utilities.sh

# Source environment variables from .env if present, so the script works when run
# directly in a terminal that has not already sourced them.
if [[ -f .env ]]; then
    source .env
fi

# Define Edge Compatibility Matrix related files
EDGE_COMPATIBILITY_MATRIX_FILE="${EDGE_COMPATIBILITY_MATRIX_FILE:-docs/docs-content/clusters/edge/edge-compatibility-matrix.md}"
EDGE_COMPATIBILITY_TEMPLATE_FILE="scripts/release/templates/edge-compatibility-matrix.md"
EDGE_COMPATIBILITY_PARAMETERISED_FILE="scripts/release/edge-compatibility-matrix-output.md"
# nickfury is the source of truth for component versions (see DOC-2911 / DOC-1978).
NICKFURY_REPO="spectrocloud/nickfury"
NICKFURY_VERSIONS_PATH="release/spectro_versions.txt"
# Rows to skip past the table header and its separator before inserting a new row.
TABLE_OFFSET=2

# RELEASE_NAME and RELEASE_VERSION are always required; the component versions can
# be sourced automatically from nickfury (below) or supplied via the environment.
if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION"; then
    echo "‼️  Skipping generate $EDGE_COMPATIBILITY_MATRIX_FILE due to missing environment variables. ‼️"
    exit 0
fi

# Source component versions from nickfury's spectro_versions.txt at the release
# tag. The matrix columns map to nickfury keys as:
#   CanvOS / Stylus / Edge Host -> stylus
#   Palette CLI Version         -> palette-cli
#   Edge CLI (when not deprecated) -> stylus
# Falls back to any values already present in the environment if GITHUB_TOKEN is
# unset or the fetch fails, so the script still works without network access.
nickfury_ref="v${RELEASE_VERSION}"
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    nickfury_versions="$(fetch_github_file "$NICKFURY_REPO" "$nickfury_ref" "$NICKFURY_VERSIONS_PATH")" || nickfury_versions=""
    if [[ -n "$nickfury_versions" ]]; then
        nf_nickfury="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "nickfury")"
        nf_stylus="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "stylus")"
        nf_palette_cli="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "palette-cli")"

        if [[ -n "$nf_nickfury" && "$nf_nickfury" != "$RELEASE_VERSION" ]]; then
            echo "⚠️  nickfury@$nickfury_ref reports version '$nf_nickfury' but RELEASE_VERSION is '$RELEASE_VERSION'."
        fi

        [[ -n "$nf_stylus" ]] && RELEASE_CANVOS="$nf_stylus"
        [[ -n "$nf_palette_cli" ]] && RELEASE_PALETTE_CLI_VERSION="$nf_palette_cli"
        if [[ "${RELEASE_EDGE_CLI_DEPRECATED}" != "true" && -z "${RELEASE_EDGE_CLI_VERSION:-}" ]]; then
            RELEASE_EDGE_CLI_VERSION="$nf_stylus"
        fi
        echo "ℹ️  Sourced Edge matrix versions from nickfury@$nickfury_ref (stylus=$nf_stylus, palette-cli=$nf_palette_cli)"
    else
        echo "⚠️  Could not fetch $NICKFURY_VERSIONS_PATH from nickfury@$nickfury_ref; using environment-provided values."
    fi
else
    echo "ℹ️  GITHUB_TOKEN not set; using environment-provided Edge matrix versions."
fi

# Component versions must now be present, whether from nickfury or the environment.
if ! check_env "RELEASE_CANVOS" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION"; then
    echo "‼️  Skipping generate $EDGE_COMPATIBILITY_MATRIX_FILE due to missing component versions. ‼️"
    exit 0
fi

# Determine the value for the "Palette Edge CLI Status" column: a deprecation
# notice if the Edge CLI is deprecated, otherwise the Edge CLI version (which
# tracks the stylus/CanvOS version).
if [[ "${RELEASE_EDGE_CLI_DEPRECATED}" == "true" ]]; then
    RELEASE_EDGE_CLI_STATUS="Deprecated. Use Palette CLI for supported workflows."
elif [[ -n "${RELEASE_EDGE_CLI_VERSION}" ]]; then
    RELEASE_EDGE_CLI_STATUS="$RELEASE_EDGE_CLI_VERSION"
else
    RELEASE_EDGE_CLI_STATUS="$RELEASE_CANVOS"
fi

export RELEASE_EDGE_CLI_STATUS

if [[ ! -f "$EDGE_COMPATIBILITY_MATRIX_FILE" ]]; then
    echo "❌ Edge Compatibility Matrix file $EDGE_COMPATIBILITY_MATRIX_FILE not found. Nothing was inserted."
    exit 1
fi

# Render the release row from the template into an intermediate output file.
generate_parameterised_file_local_vars \
    "$EDGE_COMPATIBILITY_TEMPLATE_FILE" "$EDGE_COMPATIBILITY_PARAMETERISED_FILE" \
    RELEASE_NAME RELEASE_VERSION RELEASE_CANVOS RELEASE_PALETTE_CLI_VERSION RELEASE_EDGE_CLI_STATUS

# Check whether a row for this release already exists, then replace it in place;
# otherwise insert the new row at the top of the matrix table.
# Match the full anchor (including the closing " -->") so a shorter release name
# such as "4-9-2" does not substring-match an existing "4-9-20" row.
existing_entry=$(search_line "edge-compat-$RELEASE_NAME -->" "$EDGE_COMPATIBILITY_MATRIX_FILE")
if [[ -n "$existing_entry" && "$existing_entry" -ne 0 ]]; then
    echo "ℹ️ Edge Compatibility Matrix entry for $RELEASE_NAME has already been generated in $EDGE_COMPATIBILITY_MATRIX_FILE"
    replace_line "$existing_entry" "$EDGE_COMPATIBILITY_PARAMETERISED_FILE" "$EDGE_COMPATIBILITY_MATRIX_FILE"
    echo "✅ Replaced Edge Compatibility Matrix line entry in $EDGE_COMPATIBILITY_MATRIX_FILE"
else
    insert_file_offset "$TABLE_OFFSET" "Palette Release" "$EDGE_COMPATIBILITY_PARAMETERISED_FILE" "$EDGE_COMPATIBILITY_MATRIX_FILE"
    echo "✅ Parameterised Edge Compatibility Matrix changes inserted into $EDGE_COMPATIBILITY_MATRIX_FILE"
fi

cleanup "$EDGE_COMPATIBILITY_PARAMETERISED_FILE"
