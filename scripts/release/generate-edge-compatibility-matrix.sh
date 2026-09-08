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
# directly in a terminal that has not already sourced them. A calling script that has
# already resolved these versions sets RELEASE_SKIP_DOTENV, because .env also defines
# RELEASE_CANVOS and RELEASE_PALETTE_CLI_VERSION and would overwrite the values it
# passed in.
if [[ -f .env && -z "${RELEASE_SKIP_DOTENV:-}" ]]; then
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

# Resolve the component versions the matrix records. The environment, normally .env, is the
# authoritative source: `make generate-release` exists so that a version bumped on the day of
# release can be corrected by editing .env and re-running, and every other page in that run takes
# its value from there. nickfury's spectro_versions.txt is consulted as a second opinion, and its
# values fill anything .env does not set, so the script still records a row when a version has not
# been added to .env yet. The matrix columns map to nickfury keys as:
#   CanvOS / Stylus / Edge Host -> stylus
#   Palette CLI Version         -> palette-cli
#
# Where both sources have a value and they disagree, .env is used and the difference is reported,
# because that is usually either a .env that has not caught up with the release or a release tag
# that does not match the versions being documented, and both are worth seeing.
#
# NICKFURY_REF lets a caller that has already resolved a ref pass it in, because a
# patch release can be documented from a release branch rather than a release tag.
# RELEASE_SKIP_NICKFURY lets a calling script that has already resolved these versions, or has
# deliberately recorded them as pending, keep the values it passed in.
nickfury_ref="${NICKFURY_REF:-v${RELEASE_VERSION}}"
env_canvos="${RELEASE_CANVOS:-}"
env_palette_cli="${RELEASE_PALETTE_CLI_VERSION:-}"
nf_stylus=""
nf_palette_cli=""
canvos_source=""
palette_cli_source=""

if [[ -n "${RELEASE_SKIP_NICKFURY:-}" ]]; then
    canvos_source="the calling script"
    palette_cli_source="the calling script"
elif [[ -n "${GITHUB_TOKEN:-}" ]]; then
    nickfury_versions="$(fetch_github_file "$NICKFURY_REPO" "$nickfury_ref" "$NICKFURY_VERSIONS_PATH")" || nickfury_versions=""
    if [[ -n "$nickfury_versions" ]]; then
        nf_nickfury="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "nickfury")"
        nf_stylus="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "stylus")"
        nf_palette_cli="$(printf '%s\n' "$nickfury_versions" | get_keyed_value "palette-cli")"

        if [[ -n "$nf_nickfury" && "$nf_nickfury" != "$RELEASE_VERSION" ]]; then
            echo "⚠️  nickfury@$nickfury_ref reports version '$nf_nickfury' but RELEASE_VERSION is '$RELEASE_VERSION'."
        fi
    else
        echo "⚠️  Could not fetch $NICKFURY_VERSIONS_PATH from nickfury@$nickfury_ref, so only the .env values are available."
    fi
else
    echo "ℹ️  GITHUB_TOKEN is not set, so nickfury cannot be read and only the .env values are available."
fi

if [[ -z "$canvos_source" ]]; then
    if [[ -n "$env_canvos" ]]; then
        RELEASE_CANVOS="$env_canvos"
        canvos_source=".env"

        if [[ -n "$nf_stylus" && "$nf_stylus" != "$env_canvos" ]]; then
            echo "⚠️  .env sets RELEASE_CANVOS to '$env_canvos' but nickfury@$nickfury_ref reports stylus '$nf_stylus'. The .env value is used."
        fi
    elif [[ -n "$nf_stylus" ]]; then
        RELEASE_CANVOS="$nf_stylus"
        canvos_source="nickfury@$nickfury_ref"
    fi
fi

if [[ -z "$palette_cli_source" ]]; then
    if [[ -n "$env_palette_cli" ]]; then
        RELEASE_PALETTE_CLI_VERSION="$env_palette_cli"
        palette_cli_source=".env"

        if [[ -n "$nf_palette_cli" && "$nf_palette_cli" != "$env_palette_cli" ]]; then
            echo "⚠️  .env sets RELEASE_PALETTE_CLI_VERSION to '$env_palette_cli' but nickfury@$nickfury_ref reports palette-cli '$nf_palette_cli'. The .env value is used."
        fi
    elif [[ -n "$nf_palette_cli" ]]; then
        RELEASE_PALETTE_CLI_VERSION="$nf_palette_cli"
        palette_cli_source="nickfury@$nickfury_ref"
    fi
fi

# Component versions must now be present, from whichever source supplied them.
if ! check_env "RELEASE_CANVOS" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION"; then
    echo "‼️  Skipping generate $EDGE_COMPATIBILITY_MATRIX_FILE due to missing component versions. ‼️"
    exit 0
fi

echo "ℹ️  Edge matrix versions: CanvOS $RELEASE_CANVOS (from $canvos_source), Palette CLI $RELEASE_PALETTE_CLI_VERSION (from $palette_cli_source)."

# The "Palette Edge CLI Status" column is fixed. The Palette Edge CLI is deprecated
# from Palette 4.9.14 onwards and there will be no further Palette Edge CLI releases,
# so every new row carries the deprecation notice rather than a version.
RELEASE_EDGE_CLI_STATUS="Deprecated. Use Palette CLI for supported workflows."

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
