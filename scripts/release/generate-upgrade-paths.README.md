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

Mirrors what the published docs show. Matching is by **keyword, not exact equality**, so a cell
that has been editorialized (`Supported (staggered)`, `Supported*`) still classifies instead of
dropping its row from the published table. The narrower cases are tested first, because
`not supported` contains `supported` and a staggered cell usually says `supported` too.

| Confluence cell contains                                                                                  | Published mark |
| --------------------------------------------------------------------------------------------------------- | -------------- |
| `staggered` / `conditional` / `intermediate` / `see note` / `two-step` / `not supported directly` / `❓`   | ❓             |
| `not … supported` / `unsupported` / `fails` / `failed` / `❌`                                              | ❌             |
| `supported` / `verified` / `passed` / `✅`                                                                 | ✅             |
| `n/a` / `none` / `not applicable` / `not tested` / `in progress` / `pending` / `tbd` / blank               | _dropped_      |

The ❓ mark renders as a link to the **Kubernetes Version Constraint** section, which exists on
both the VerteX and self-hosted Palette upgrade pages. Use it for a path that is supported only
through an intermediate hop.

Any other non-blank cell is **reported** (with its install, source, target, and text) and its row
is not published. That report exists because a dropped row is the one failure a reader of the
published page cannot detect.

## Kubernetes version constraint

Kubernetes minor versions cannot be skipped during an upgrade, so a validated path that
crosses two or more minors is a contradiction. That contradiction is what DOC-3097 was raised
for: the tables marked every `4.8.x` → `4.9.23`+ path as supported while the prose on the same
page said those upgrades were unsupported.

The published marks now **mirror Confluence exactly**. Engineering marks the unsupported direct
paths in the matrix itself, so the script does not need to derive them. What the script does add
is a **cross-check**:

1. It reads the bundled Kubernetes version from the matrix's own header and row labels, for
   example `4.9.x · K8s 1.33.10`. These are per install type, which matters: **the EC binary and
   the Appliance Installer ship different Kubernetes versions for the same Palette release**
   (`4.8.x` is `1.32.9` on EC but `1.33.9` on the appliance), so the constraint bites on one and
   not the other.
2. Any path marked supported whose own labels say it crosses more than one Kubernetes minor
   version is **reported**, not rewritten. A disagreement means either the mark or the label is
   wrong, and both live in Confluence — fix it at source rather than papering over it here.
3. Labels carrying no version are skipped. That is normal for Helm installs (the cluster's
   Kubernetes version is managed independently of Palette) and for `K8s TBD` on an unreleased
   version.

The Kubernetes version tables on the upgrade pages are for readers only; nothing parses them.
Keep them consistent with the matrix labels by hand, per installation type.

## Failure modes

Every run prints the rows it adds, removes, and re-marks per block, so a Confluence change that
quietly halves a table cannot look like a clean run.

These abort the run **before anything is written**, because each one would otherwise leave whole
marker blocks silently stranded at their old content:

- A table with no install-type heading above it, inside the auto-managed version range. Usually
  an `h3` was renamed, so `INSTALL_MAP` no longer matches and the table is discarded. The error
  names the heading it found.
- An install that parsed zero rows.

These are warnings or notes, and the run continues:

- Bare tables in the legacy version groups below 4.6 (`4.3 → 4.4`, `4.1 through 4.3`). These have
  always been hand-maintained and out of scope, so they are only noted.
- An `h3` heading that maps to no install and has no table under it.
- A status cell that cannot be classified.
- A path marked supported that skips a Kubernetes minor version (refer to the cross-check above).
- A Confluence block the Markdown has no marker for. Add the marker pair and rerun. This is
  expected for a version whose docs live on another branch — for example `4.10` blocks are
  reported here and added on `docs-rel-4-10-0`.

## Setup

Create an Atlassian API token at
<https://id.atlassian.com/manage-profile/security/api-tokens>.

The `CONFLUENCE_*` vars live in `.env` alongside the other release credentials.
Run `make init-release` once to scaffold them (`CONFLUENCE_BASE_URL` and
`CONFLUENCE_PAGE_ID` are pre-filled), then add your email and token:

```bash
make init-release
# Edit .env and set:
#   export CONFLUENCE_EMAIL=you@spectrocloud.com
#   export CONFLUENCE_API_TOKEN=...
source .env
```

`.env` is git-ignored, so the credentials stay local and are never committed.

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

## Tests

```bash
npx jest scripts/release/generate-upgrade-paths.test.js
```

The suite runs against fixtures (a trimmed Confluence storage-format page and the Kubernetes
version table), so it needs no credentials and no network. It covers the status keyword
precedence, the constraint rule and its exemptions, the fail-open behavior, the structural-drift
reports, and the row diff.

## Notes

- No extra dependencies — uses the repo's `cheerio` and Node's built-in `fetch`
  (Node 20+).
- Always run `npm run format` after `--write`; the script emits plain tables and
  relies on Prettier to align columns to repo style.
- If the Confluence page gains a block the docs don't have a marker for (e.g. a
  new `appliance-4.6`), the script prints a `Note:` line instead of failing —
  add the marker pair to the Markdown and rerun.
- Never hand-edit rows between the markers. A block is rebuilt in full on every
  run, so a manual fix is reverted the next time the script runs — encode it in
  Confluence or in the constraint rule instead.
- When a Confluence service account is available, the same script runs unchanged
  in CI; the `CONFLUENCE_*` env vars become repository secrets.
