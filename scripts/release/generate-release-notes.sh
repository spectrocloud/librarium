#!/bin/bash
# Import utility functions
source scripts/release/utilities.sh

# Define release note related files
RELEASE_NOTES_FILE="${RELEASE_NOTES_FILE:-docs/docs-content/release-notes/release-notes.md}"
RELEASE_NOTES_TEMPLATE_FILE="scripts/release/templates/release-notes.md"
RELEASE_NOTES_HEADING_TEMPLATE_FILE="scripts/release/templates/release-notes-heading.md"
EDGE_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-edge-callout.md"
AUTOMATION_CALLOUT_TEMPLATE_FILE="scripts/release/templates/release-notes-automation-callout.md"
AUTOMATION_FEATURES_TEMPLATE_FILE="scripts/release/templates/release-notes-automation-features.md"
RELEASE_NOTES_COMPOSED_FILE="scripts/release/release-notes-composed.md"
RELEASE_NOTES_PARAMETERISED_FILE="scripts/release/release-notes-output.md"
RELEASE_NOTES_HEADING_PARAMETERISED_FILE="scripts/release/release-notes-heading-output.md"

# REFRESH_ONLY limits the run to rewriting the heading of a release block that has already been
# drafted, and never inserts a new one. `make generate-release` uses it so the heading is corrected
# alongside the component versions that generate-release-notes-callouts.sh refreshes.
#
# The two have to move together. RELEASE_VERSION appears both in the heading and inside the Edge and
# Automation callouts, so refreshing only the callouts left the block naming the drafting-time
# version in its heading and the shipping version in its prose. A block that names two versions is
# worse than one that is uniformly stale.
#
# Inserting is deliberately excluded rather than merely unlikely: `make generate-release` runs on
# every component bump, including before the block for a new RELEASE_NAME has been drafted, and the
# insert branch would silently add an empty release skeleton to the published page each time.
REFRESH_ONLY="${REFRESH_ONLY:-false}"

# RELEASE_CANVOS and RELEASE_PALETTE_CLI_VERSION fill the Edge and Automation callouts. Both are
# required, because generate_parameterised_file substitutes an unset variable with an empty string
# and would leave a sentence that names no version rather than a visible placeholder.
#
# RELEASE_TERRAFORM_VERSION deliberately fills both the Terraform provider and the Crossplane
# provider entries under Automation. The two providers have so far always released on the same
# version, so they share one variable; split it if that ever stops being true.
#
# Refresh-only mode asks for none of those three, because it never renders the templates that name
# them. Requiring them anyway would make a heading correction depend on values it does not use, and
# `make generate-release` would skip the correction whenever one was still blank.
if [[ "$REFRESH_ONLY" == "true" ]]; then
    REQUIRED_VARS=(RELEASE_DATE RELEASE_NAME RELEASE_VERSION)
else
    REQUIRED_VARS=(
        RELEASE_DATE
        RELEASE_NAME
        RELEASE_CANVOS
        RELEASE_PALETTE_CLI_VERSION
        RELEASE_TERRAFORM_VERSION
        RELEASE_VERSION
    )
fi

# Every variable is checked rather than stopping at the first missing one, so a run that is short
# of several reports all of them in one pass instead of one per re-run.
missing_vars=()
for var in "${REQUIRED_VARS[@]}"; do
    check_env "$var" || missing_vars+=("$var")
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    # Refresh-only keeps the convention the other release generators follow of reporting and
    # skipping rather than failing, because it runs inside `make generate-release` alongside eight
    # other generators and a formatting pass. Exiting non-zero there would abort the target part
    # way through, and generate-release-notes-callouts.sh already skips a region the same way when
    # a version it needs is blank.
    if [[ "$REFRESH_ONLY" == "true" ]]; then
        echo "‼️  Skipping the release notes heading refresh in $RELEASE_NOTES_FILE due to missing environment variables. ‼️"
        exit 0
    fi

    # Drafting a block either writes every one of these values or writes nothing, and it used to
    # write nothing while still exiting 0. That reads as a target that ran and had no work to do,
    # so a first run against a half-filled .env looked like the release notes needed no changes.
    # Fail instead, and name both what to set and what to set it to, because there is no prompt:
    # release-variables.sh has the machinery for one but no target calls it.
    echo "❌ Cannot draft the release notes block in $RELEASE_NOTES_FILE."
    echo "   Set the following in your .env file, then run 'make generate-release-notes' again:"
    for var in "${missing_vars[@]}"; do
        echo "     - $var"
    done
    echo "   All ${#REQUIRED_VARS[@]} of ${REQUIRED_VARS[*]} are required, because the block names every one of them."
    echo "   For a version that is not settled yet, use the release's own identifier as a placeholder, for example"
    echo "   '4.10.0' for the GA or '4.10.a' for a patch release in that train. Do not use '4.10.x', which is too"
    echo "   broad to search for and replace on release day."
    exit 1
fi

if [[ ! -f "$RELEASE_NOTES_FILE" ]]; then
    echo "❌ Release notes file $RELEASE_NOTES_FILE not found. Nothing was generated."
    exit 1
fi

# The heading and the component version sections are held in their own templates, because a later
# run has to be able to rewrite them in the published notes: the heading when RELEASE_VERSION or
# RELEASE_DATE is settled after the notes were drafted, and the callouts when a component is bumped
# again on the day of release. They are composed into the release notes template here rather than
# duplicated inline, so each has one definition and the published text cannot drift from what a
# later refresh would write.
#
# The heading in particular used to be written out identically in both this template and
# release-notes-heading.md, so a change to its shape had to be made twice or the refresh would
# rewrite a newly inserted block's heading into a different form.
#
# The Automation features region covers only the two provider bullets. Anything a writer adds to
# that section goes outside the end marker and is left alone by a refresh.
#
# The composed file still carries the {{RELEASE_*}} placeholders these templates use, so the
# substitution pass below fills them along with the rest of the template.
#
# Skipped in refresh-only mode, which replaces a single heading line and so never reads the full
# block. Composing it there would also require the component version variables that mode does not
# ask for, and would substitute each one to an empty string.
if [[ "$REFRESH_ONLY" != "true" ]]; then
    RELEASE_HEADING="$(cat "$RELEASE_NOTES_HEADING_TEMPLATE_FILE")"
    EDGE_CALLOUT="$(cat "$EDGE_CALLOUT_TEMPLATE_FILE")"
    AUTOMATION_CALLOUT="$(cat "$AUTOMATION_CALLOUT_TEMPLATE_FILE")"
    AUTOMATION_FEATURES="$(cat "$AUTOMATION_FEATURES_TEMPLATE_FILE")"

    generate_parameterised_file_local_vars \
        "$RELEASE_NOTES_TEMPLATE_FILE" "$RELEASE_NOTES_COMPOSED_FILE" \
        RELEASE_HEADING EDGE_CALLOUT AUTOMATION_CALLOUT AUTOMATION_FEATURES

    generate_parameterised_file $RELEASE_NOTES_COMPOSED_FILE $RELEASE_NOTES_PARAMETERISED_FILE
fi

generate_parameterised_file $RELEASE_NOTES_HEADING_TEMPLATE_FILE $RELEASE_NOTES_HEADING_PARAMETERISED_FILE

# The anchor is matched with its closing brace so a release name cannot substring-match a longer
# one, for example "#release-notes-4.10.1" matching an existing "#release-notes-4.10.10" heading
# and relabelling that release's block instead of inserting a new one.
#
# It is keyed on RELEASE_NAME rather than RELEASE_VERSION, because the anchor is the page's permanent
# deep link and stays frozen for the cycle even once the shipping version is known. A release drafted
# as 4.10.0 that ships as 4.10.13 keeps "#release-notes-4.10.0" and gains a "Release 4.10.13"
# heading, so editing RELEASE_NAME mid-cycle both breaks inbound links and stops this match finding
# the block.
existing_notes=$(search_line "#release-notes-$RELEASE_NAME}" $RELEASE_NOTES_FILE)
if [[ -n "$existing_notes" && "$existing_notes" -ne 0 ]]; then
    echo "ℹ️ Release notes for $RELEASE_NAME have already been generated in $RELEASE_NOTES_FILE"
    replace_line $existing_notes $RELEASE_NOTES_HEADING_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Replaced release notes heading in $RELEASE_NOTES_FILE (RELEASE_VERSION=$RELEASE_VERSION, RELEASE_DATE=$RELEASE_DATE)"

    if [[ "$REFRESH_ONLY" != "true" ]]; then
        echo "ℹ️ Only the heading is refreshed here, because the rest of the block is hand-written. Run 'make generate-release' to refresh the Edge and Automation component versions."
    fi
elif [[ "$REFRESH_ONLY" == "true" ]]; then
    # Two different situations reach here, and they want opposite advice, so they are told apart by
    # the component version markers that generate-release-notes-callouts.sh keys on RELEASE_NAME. A
    # block that has never been drafted carries no markers and genuinely wants
    # `make generate-release-notes`. A block whose heading anchor has been edited away still carries
    # them, and running that target against it takes the insert branch and adds a second copy of the
    # release rather than repairing the heading.
    #
    # The second case is also the one arrangement in which refreshing the callouts and refreshing the
    # heading come apart, because the callouts are found by their markers while the heading is found
    # by its anchor. That is the inconsistency this mode exists to prevent, so it is reported rather
    # than left for a reader to notice on the published page.
    block_markers_found=false
    for marker_base in release-notes-edge-callout release-notes-automation-callout release-notes-automation-features; do
        if grep -qF "<!-- ${marker_base}-${RELEASE_NAME}-start -->" "$RELEASE_NOTES_FILE"; then
            block_markers_found=true
            break
        fi
    done

    if [[ "$block_markers_found" == "true" ]]; then
        echo "🟠 $RELEASE_NOTES_FILE carries component version markers for $RELEASE_NAME but no '{#release-notes-$RELEASE_NAME}' heading anchor, so the heading still names the version it was drafted with while the callouts name $RELEASE_VERSION. Restore the anchor on that release's heading and re-run. Do not run 'make generate-release-notes', which would insert a second copy of the release." >&2
    else
        echo "ℹ️ $RELEASE_NOTES_FILE has no release notes block for $RELEASE_NAME, so the heading refresh is skipped. Run 'make generate-release-notes' to draft the block."
    fi
else
    insert_file_after "<ReleaseNotesVersions />" $RELEASE_NOTES_PARAMETERISED_FILE $RELEASE_NOTES_FILE
    echo "✅ Parameterised release notes inserted into $RELEASE_NOTES_FILE"
fi

# Guarded individually, because cleanup removes a named file and the composed and parameterised
# release notes are only written outside refresh-only mode.
[[ -f "$RELEASE_NOTES_COMPOSED_FILE" ]] && cleanup $RELEASE_NOTES_COMPOSED_FILE
[[ -f "$RELEASE_NOTES_PARAMETERISED_FILE" ]] && cleanup $RELEASE_NOTES_PARAMETERISED_FILE
cleanup $RELEASE_NOTES_HEADING_PARAMETERISED_FILE
