#!/bin/bash
#
# Build command for Netlify deploy previews (DOC 3427). Wired up in netlify.toml.
#
# Deploy previews skip the pack pages (DISABLE_PACKS_INTEGRATIONS=true) to stay under the build machine's memory
# limit. A preview builds the pack pages when either of these is true:
#   - The PR has the "pack-pr" label. Netlify does not rebuild when a label changes, so retry the deploy after adding it.
#   - The PR changes a pack README page (docs/docs-content/integrations/*.mdx) or a pack-pipeline file (listed in
#     pack_paths).
# If a check fails, it counts as no, and the log says why.
#
# Production (Release to Production) and the version-* branch deploys do not use this script.
#
# GITHUB_READ_TOKEN, when set, authenticates the label lookup (5,000 instead of 60 GitHub API requests an hour).
#
# Testing: PACK_PREVIEW_DRY_RUN=1 prints the decision without building. PACK_PREVIEW_LABEL, PACK_PREVIEW_BASE, and
# PACK_PREVIEW_HEAD override the label name and the commits that the pack-file check compares.

set -uo pipefail

log() { echo "[pack-preview] $*"; }

repo="spectrocloud/librarium"
label="${PACK_PREVIEW_LABEL:-pack-pr}"
head_ref="${PACK_PREVIEW_HEAD:-HEAD}"
pack_paths='^(static/packs-data/|plugins/packs-integrations\.js|src/constants/packs\.ts|src/services/api/|utils/pack-cves/|src/components/(Packs[A-Za-z]*|PackCVEVersion|RedirectPackPage|Technologies|Integrations/Packs)/|docs/docs-content/integrations/[^/]+\.mdx$)'
build_packs=false
base_branch="master"

# 1. The pack-pr label, and the PR's base branch for step 2. REVIEW_ID is the PR number that Netlify sets for previews.
if [[ -n "${REVIEW_ID:-}" ]]; then
  if [[ -n "${GITHUB_READ_TOKEN:-}" ]]; then
    pr_json=$(curl -fsS --max-time 15 -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer ${GITHUB_READ_TOKEN}" "https://api.github.com/repos/${repo}/pulls/${REVIEW_ID}")
    rc=$?
  else
    pr_json=$(curl -fsS --max-time 15 -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${repo}/pulls/${REVIEW_ID}")
    rc=$?
  fi
  if [[ $rc -eq 0 && -n "$pr_json" ]]; then
    parsed=$(printf '%s' "$pr_json" | node -e '
      let d = "";
      process.stdin.on("data", (c) => (d += c)).on("end", () => {
        const pr = JSON.parse(d);
        const names = (pr.labels || []).map((l) => l.name);
        console.log((names.includes(process.argv[1]) ? "yes" : "no") + " " + ((pr.base && pr.base.ref) || "master"));
      });' "$label" 2>/dev/null)
    if [[ -n "$parsed" ]]; then
      read -r has_label base_branch <<<"$parsed"
      if [[ "$has_label" == "yes" ]]; then
        build_packs=true
        log "PR #${REVIEW_ID} has the ${label} label."
      else
        log "PR #${REVIEW_ID} does not have the ${label} label. Base branch: ${base_branch}."
      fi
    else
      log "Could not read the labels of PR #${REVIEW_ID} from the GitHub API response; checking pack files only."
    fi
  else
    log "Could not read PR #${REVIEW_ID} from the GitHub API (rate limit, network, or no such PR); checking pack files only."
  fi
else
  log "REVIEW_ID is not set, so this is not a PR preview; checking pack files only."
fi

# 2. Pack files changed in the PR, compared with where it branched from its base branch.
if [[ "$build_packs" == false ]]; then
  base="${PACK_PREVIEW_BASE:-}"
  if [[ -z "$base" ]] && git fetch --quiet --no-tags origin "$base_branch" 2>/dev/null; then
    base=$(git merge-base "$head_ref" FETCH_HEAD 2>/dev/null) || base=""
  fi
  if [[ -z "$base" ]]; then
    log "Could not find where the PR branched from ${base_branch}; skipping the pack-file check."
  elif changed=$(git diff --name-only --no-renames "$base" "$head_ref" 2>/dev/null); then
    matches=$(printf '%s\n' "$changed" | grep -E "$pack_paths")
    if [[ -n "$matches" ]]; then
      build_packs=true
      log "This PR changes pack files:"
      printf '%s\n' "$matches" | sed 's/^/[pack-preview]   /'
    else
      log "This PR does not change pack files."
    fi
  else
    log "Could not list the PR's changed files; skipping the pack-file check."
  fi
fi

if [[ "$build_packs" == true ]]; then
  export DISABLE_PACKS_INTEGRATIONS=false
  log "Building the pack pages."
else
  export DISABLE_PACKS_INTEGRATIONS=true
  log "Skipping the pack pages. Add the ${label} label and retry the deploy to build them."
fi

if [[ "${PACK_PREVIEW_DRY_RUN:-}" == "1" ]]; then
  log "Dry run: DISABLE_PACKS_INTEGRATIONS=${DISABLE_PACKS_INTEGRATIONS}. Not building."
  exit 0
fi

exec npm run build
