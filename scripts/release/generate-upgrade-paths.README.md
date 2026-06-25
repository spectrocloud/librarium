<!-- vale off -->

# generate-upgrade-paths.js

Regenerates the self-hosted **upgrade-path tables** in the Palette and VerteX
"Upgrade" pages from the **Upgrade Paths** section of the Confluence
[Release Artifacts](https://spectrocloud.atlassian.net/wiki/spaces/ENGINEERIN/pages/2087419998/Release+Artifacts)
page.

It rewrites only the content between marker comments, for example:

```md
<!-- upgrade-paths:vmware-4.9:start -->
...generated table...
<!-- upgrade-paths:vmware-4.9:end -->
```

## Scope

Only matrix blocks for **version 4.6 and newer** are auto-managed
(`vmware`/`kubernetes` 4.6+, `appliance` 4.7+). The `*-prior` and legacy
4.5 / 4.4 blocks are left untouched for hand maintenance.

## Status mapping

Mirrors what the published docs show:

- `supported` / `verified` / `✅` → ✅
- `fails` / `not supported` / `❌` / `:cross_mark:` → ❌
- `n/a` / `NA` / `In Progress` / blank → _dropped_ (not published)

## Setup

Create an Atlassian API token at
<https://id.atlassian.com/manage-profile/security/api-tokens> and export the
credentials (a `confluence-upgrade.env` file kept **outside** the repo works
well — never commit it):

```bash
export CONFLUENCE_BASE_URL="https://spectrocloud.atlassian.net"
export CONFLUENCE_PAGE_ID="2087419998"
export CONFLUENCE_EMAIL="you@spectrocloud.com"
export CONFLUENCE_API_TOKEN="..."
```

## Usage

```bash
# Preview what would change
node scripts/release/generate-upgrade-paths.js --dry-run

# Apply the changes, then align tables and review
node scripts/release/generate-upgrade-paths.js --write
npm run format
git diff
```

Run `node scripts/release/generate-upgrade-paths.js --help` for all flags.

## Notes

- No extra dependencies — uses the repo's `cheerio` and Node's built-in `fetch`
  (Node 20+).
- Always run `npm run format` after `--write`; the script emits plain tables and
  relies on Prettier to align columns to repo style.
- If the Confluence page gains a block the docs don't have a marker for (e.g. a
  new `appliance-4.6`), the script prints a `Note:` line instead of failing —
  add the marker pair to the Markdown and rerun.
- When a Confluence service account is available, the same script runs unchanged
  in CI; the `CONFLUENCE_*` env vars become repository secrets.
