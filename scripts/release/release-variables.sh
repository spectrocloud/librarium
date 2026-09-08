#!/usr/bin/env bash

# Collects the values `make generate-release` needs and writes them to release.env, so a whole
# release's variables can be gathered in one pass and sourced into the current shell.
#
# Every prompt shows an example rather than a default, and an empty reply leaves the value empty.
# That is deliberate. The script exists to confirm that the values for *this* release are in hand,
# and a prompt that offers a value an empty reply accepts is not confirming anything: the earlier
# version of this script carried hardcoded 4.8.c versions forward, and reading them from .env would
# only move the same problem one release closer, because .env still holds the previous release when
# a cycle starts. So nothing is ever carried forward silently, and the run ends by naming whatever
# was left blank.
#
# Each entry below is "VARIABLE|example". The three Palette CLI checksums are optional, because
# generate-downloads.sh records "SHA PENDING" for one it does not know and a later run fills the
# cell in. Everything else is guarded by check_env in the script that reads it, so a blank stops
# that page from being generated.

set -uo pipefail

OUTPUT_FILE="${OUTPUT_FILE:-release.env}"

# Groups and order match the .env layout that `make init-release` writes, so the two files can be
# compared line by line. Identity and component versions lead because together they are what
# `make generate-release-notes` needs. There is no credentials group: tokens are set once and do not
# belong in a file regenerated every release.
IDENTITY=(
    "RELEASE_NAME|for example, 4.10.0"
    "RELEASE_VERSION|for example, 4.10.13"
    "RELEASE_DATE|for example, September 6, 2026"
)
COMPONENTS=(
    "RELEASE_CANVOS|for example, 4.10.3"
    "RELEASE_PALETTE_CLI_VERSION|for example, 4.10.3"
    "RELEASE_TERRAFORM_VERSION|for example, 0.30.0"
    "RELEASE_PALETTE_CLI_SHA|SHA256 checksum, or empty to record as pending"
    "RELEASE_PALETTE_CLI_ARM64_SHA|SHA256 checksum, or empty to record as pending"
    "RELEASE_PALETTE_CLI_MACOS_SHA|SHA256 checksum, or empty to record as pending"
    "RELEASE_SPECTRO_CLI_VERSION|for example, 4.10.0"
    "RELEASE_REGISTRY_VERSION|for example, 4.10.0"
)
KUBERNETES=(
    "RELEASE_VMWARE_KUBERNETES_VERSION|for example, 1.34.6"
    "RELEASE_VMWARE_OVA_URL|for example, https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1346-0.ova"
    "RELEASE_VMWARE_FIPS_OVA_URL|for example, https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1346-fips.ova"
    "RELEASE_HIGHEST_KUBERNETES_VERSION|for example, 1.35.6"
    "RELEASE_PCG_KUBERNETES_VERSION|for example, 1.34.6"
)

# The checksums a run may legitimately leave empty. Reported separately at the end, so a pending
# checksum is not mixed in with a blank that will stop a page being generated.
OPTIONAL=(RELEASE_PALETTE_CLI_SHA RELEASE_PALETTE_CLI_ARM64_SHA RELEASE_PALETTE_CLI_MACOS_SHA)

is_optional() {
    local var="$1" opt
    for opt in "${OPTIONAL[@]}"; do
        [[ "$var" == "$opt" ]] && return 0
    done
    return 1
}

# Ask for one variable, showing the example in the prompt so the format is clear without a value
# being asserted. An empty reply leaves the variable empty.
prompt_var() {
    local var="$1" example="$2" reply
    read -r -p "$var ($example): " reply
    printf -v "$var" '%s' "$reply"
}

# Quote only a value that contains whitespace, matching how .env records the release date but leaves
# versions and URLs bare, so a line can be copied between the two files unchanged.
emit() {
    local entry var value
    for entry in "$@"; do
        var="${entry%%|*}"
        value="${!var}"
        if [[ "$value" == *[[:space:]]* ]]; then
            printf 'export %s="%s"\n' "$var" "$value"
        else
            printf 'export %s=%s\n' "$var" "$value"
        fi
    done
}

echo "Every value is for this release. The prompts show examples, not defaults, so an empty reply"
echo "leaves the value empty and is reported at the end."
echo ""

for entry in "${IDENTITY[@]}" "${COMPONENTS[@]}" "${KUBERNETES[@]}"; do
    prompt_var "${entry%%|*}" "${entry#*|}"
done

{
    echo "# RELEASE IDENTITY"
    emit "${IDENTITY[@]}"
    echo ""
    echo "# COMPONENT VERSIONS"
    emit "${COMPONENTS[@]}"
    echo ""
    echo "# KUBERNETES REQUIREMENTS"
    emit "${KUBERNETES[@]}"
} > "$OUTPUT_FILE"

echo ""
echo "Saved to $OUTPUT_FILE. Run 'source $OUTPUT_FILE' to use the values in this shell."

missing=()
pending=()
for entry in "${IDENTITY[@]}" "${COMPONENTS[@]}" "${KUBERNETES[@]}"; do
    var="${entry%%|*}"
    [[ -n "${!var}" ]] && continue
    if is_optional "$var"; then
        pending+=("$var")
    else
        missing+=("$var")
    fi
done

if (( ${#pending[@]} )); then
    echo ""
    echo "ℹ️  Recorded as pending, for a later run to fill in:"
    printf '     %s\n' "${pending[@]}"
fi

if (( ${#missing[@]} )); then
    echo ""
    echo "⚠️  Left empty. Each of these stops the page that reads it from being generated:"
    printf '     %s\n' "${missing[@]}"
fi
