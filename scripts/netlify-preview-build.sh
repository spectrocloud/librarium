#!/bin/bash
#
# Build command for Netlify deploy previews (DOC 3427). Wired up in netlify.toml.
#
# Deploy previews skip the pack pages (DISABLE_PACKS_INTEGRATIONS=true) to stay under the build machine's memory
# limit. A preview builds the pack pages when either of these is true:
#   - The PR has the "pack-pr" label. Netlify does not rebuild when a label changes, so retry the deploy after adding it.
#   - The PR changes a pack README page (docs/docs-content/integrations/*.mdx), a partial in _partials/packs/, or a
#     pack-pipeline file (listed in pack_paths).
# If a check fails, it counts as no, and the log says why.
#
# Production (Release to Production) and the version-* branch deploys do not use this script.
#
# The Rspack persistent cache (node_modules/.cache/rspack, which Netlify restores between builds) is cleared when the
# pack mode differs from the mode of the cached build. Refer to step 3.
#
# GITHUB_READ_TOKEN, when set, authenticates the label lookup (5,000 instead of 60 GitHub API requests an hour).
#
# Testing: PACK_PREVIEW_DRY_RUN=1 prints the decisions without building, clearing the cache, or recording the pack
# mode. PACK_PREVIEW_LABEL, PACK_PREVIEW_BASE, and PACK_PREVIEW_HEAD override the label name and the commits that the
# pack-file check compares. PACK_PREVIEW_CACHE_DIR overrides the Rspack cache directory.

set -uo pipefail

log() { echo "[pack-preview] $*"; }

repo="spectrocloud/librarium"
label="${PACK_PREVIEW_LABEL:-pack-pr}"
head_ref="${PACK_PREVIEW_HEAD:-HEAD}"
pack_paths='^(static/packs-data/|_partials/packs/|plugins/packs-integrations\.js|plugins/packs-logo-fallback/|src/constants/packs\.ts|src/services/api/|utils/pack-cves/|src/components/(Packs[A-Za-z]*|PackCVEVersion|RedirectPackPage|Technologies|Integrations/Packs)/|docs/docs-content/integrations/[^/]+\.mdx$)'
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
  # The pack pages take the build to the build machine's 11 GiB memory limit (DOC 3452). Render fewer pages at once
  # during static site generation (the Docusaurus default is 32), and print how long each build phase takes
  # (DOCUSAURUS_PERF_LOGGER, an undocumented Docusaurus variable). A memory kill (exit code 137) after the
  # "[PERF] ... Bundling with rspack" line happened during static site generation; one before it happened while
  # Rspack was bundling. To try another concurrency without a code change, set DOCUSAURUS_SSR_CONCURRENCY in Netlify.
  export DOCUSAURUS_SSR_CONCURRENCY="${DOCUSAURUS_SSR_CONCURRENCY:-4}"
  export DOCUSAURUS_PERF_LOGGER=true
  log "Static site generation renders ${DOCUSAURUS_SSR_CONCURRENCY} pages at a time. Build phase timings are on."
else
  export DISABLE_PACKS_INTEGRATIONS=true
  log "Skipping the pack pages. Add the ${label} label and retry the deploy to build them."
fi

# 3. The Rspack persistent cache. Its key covers the Docusaurus version, the theme aliases, and the contents of
# docusaurus.config.js, but not DISABLE_PACKS_INTEGRATIONS. A cache saved with the pack pages on and reused with them
# off, or the other way around, makes Rspack panic ("should mgm exist", exit code 134). Netlify saves the cache only
# after a successful build, so a PR keeps failing until the cache is cleared. Record the pack mode next to the cache,
# and clear the cache when the mode changes.
cache_dir="${PACK_PREVIEW_CACHE_DIR:-node_modules/.cache/rspack}"
mode_file="$(dirname "$cache_dir")/pack-preview-mode"
if [[ "$build_packs" == true ]]; then mode="packs-on"; else mode="packs-off"; fi
cached_mode=$(cat "$mode_file" 2>/dev/null) || true
cached_mode="${cached_mode:-unknown}"
dry_run=false
[[ "${PACK_PREVIEW_DRY_RUN:-}" == "1" ]] && dry_run=true

if [[ ! -d "$cache_dir" ]]; then
  log "No Rspack persistent cache to reuse."
elif [[ "$cached_mode" == "$mode" ]]; then
  log "Reusing the Rspack persistent cache (${mode})."
elif [[ "$dry_run" == true ]]; then
  log "Dry run: would clear the Rspack persistent cache (cached build: ${cached_mode}, this build: ${mode})."
elif rm -rf "$cache_dir"; then
  log "Cleared the Rspack persistent cache (cached build: ${cached_mode}, this build: ${mode})."
else
  log "Could not clear ${cache_dir}. If the build fails with \"should mgm exist\", retry the deploy without cache."
fi

if [[ "$dry_run" == true ]]; then
  log "Dry run: DISABLE_PACKS_INTEGRATIONS=${DISABLE_PACKS_INTEGRATIONS}. Not building."
  exit 0
fi

mkdir -p "$(dirname "$mode_file")" && echo "$mode" >"$mode_file"

# 4. Memory sampler (temporary diagnostic for DOC 3452; remove once the memory kills are resolved). For builds with
# the pack pages, log the container's memory every few seconds until the build exits. Netlify's usage table reports
# only the container total, which includes file cache that the kernel can free. The sampler splits the total into
# process memory (anon) and file cache, and adds the resident memory of all processes and of the largest one (Node,
# which also holds Rspack's native memory). PACK_PREVIEW_MEM_SAMPLER=0 turns it off, PACK_PREVIEW_MEM_INTERVAL sets
# the seconds between samples (default 3), and PACK_PREVIEW_CGROUP_DIR overrides /sys/fs/cgroup for testing.
cgroup_dir="${PACK_PREVIEW_CGROUP_DIR:-/sys/fs/cgroup}"
mem_interval="${PACK_PREVIEW_MEM_INTERVAL:-3}"

to_gib() { awk -v b="${1:-}" 'BEGIN { if (b ~ /^[0-9]+$/) printf "%.2f", b / 1073741824; else printf "?" }'; }
stat_value() { awk -v k="$1" '$1 == k { print $2; exit }' "$2" 2>/dev/null; }

mem_sample() {
  local total="" anon="" file="" dirty="" ooms="" procs="" out
  if [[ -f "$cgroup_dir/memory.current" ]]; then
    total=$(cat "$cgroup_dir/memory.current" 2>/dev/null)
    anon=$(stat_value anon "$cgroup_dir/memory.stat")
    file=$(stat_value file "$cgroup_dir/memory.stat")
    dirty=$(stat_value file_dirty "$cgroup_dir/memory.stat")
    ooms=$(stat_value oom_kill "$cgroup_dir/memory.events")
  elif [[ -f "$cgroup_dir/memory/memory.usage_in_bytes" ]]; then
    total=$(cat "$cgroup_dir/memory/memory.usage_in_bytes" 2>/dev/null)
    anon=$(stat_value total_rss "$cgroup_dir/memory/memory.stat")
    file=$(stat_value total_cache "$cgroup_dir/memory/memory.stat")
    dirty=$(stat_value total_dirty "$cgroup_dir/memory/memory.stat")
    ooms=$(stat_value oom_kill "$cgroup_dir/memory/memory.oom_control")
  fi
  # Resident memory in bytes: "<all processes> <largest process> <its name>".
  if [[ -d /proc/self ]]; then
    procs=$(cat /proc/[0-9]*/status 2>/dev/null | awk '
      /^Name:/ { n = $2 }
      /^VmRSS:/ { t += $2; if ($2 > m) { m = $2; mn = n } }
      END { printf "%d %d %s", t * 1024, m * 1024, (mn == "" ? "?" : mn) }')
  else
    procs=$(ps -A -o rss=,comm= 2>/dev/null | awk '
      { n = $2; sub(/.*\//, "", n); t += $1; if ($1 > m) { m = $1; mn = n } }
      END { printf "%d %d %s", t * 1024, m * 1024, (mn == "" ? "?" : mn) }')
  fi
  read -r procs_total procs_max procs_name <<<"$procs"
  out="Memory:"
  if [[ -n "$total" ]]; then
    out+=" container $(to_gib "$total") GiB (anon $(to_gib "$anon"), file cache $(to_gib "$file"),"
    out+=" dirty $(to_gib "$dirty")),"
  fi
  out+=" processes $(to_gib "${procs_total:-}") GiB (largest: ${procs_name:-?} $(to_gib "${procs_max:-}") GiB)"
  [[ -n "$ooms" ]] && out+=", oom_kill ${ooms}"
  log "$out"
}

start_mem_sampler() {
  local watch_pid="$1" limit="" version=""
  if [[ -f "$cgroup_dir/memory.max" ]]; then
    limit=$(cat "$cgroup_dir/memory.max" 2>/dev/null) version="v2"
  elif [[ -f "$cgroup_dir/memory/memory.limit_in_bytes" ]]; then
    limit=$(cat "$cgroup_dir/memory/memory.limit_in_bytes" 2>/dev/null) version="v1"
  fi
  local where
  where="cgroup ${version}, limit $(to_gib "$limit") GiB"
  [[ -z "$version" ]] && where="no cgroup memory files in ${cgroup_dir}, so processes only"
  log "Memory sampler on: every ${mem_interval} s until the build exits (${where})."
  (
    while kill -0 "$watch_pid" 2>/dev/null; do
      mem_sample
      sleep "$mem_interval"
    done
  ) &
}

# exec keeps this shell's PID, so the sampler stops within one interval of npm exiting.
if [[ "$build_packs" == true && "${PACK_PREVIEW_MEM_SAMPLER:-1}" != "0" ]]; then
  start_mem_sampler "$$"
fi

exec npm run build
