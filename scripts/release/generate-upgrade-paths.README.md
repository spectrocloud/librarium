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

Kubernetes minor versions cannot be skipped during an upgrade, so a path that crosses two or more
minors is supportable only as a staggered upgrade. Rather than relying on Confluence to carry that
judgment, the script derives it (DOC-3097):

1. It reads the bundled Kubernetes version per release from the **Kubernetes Version Constraint**
   table **on the page it is writing**, so the rule and the published table cannot disagree. Both
   cell shapes are understood — an explicit list (`4.8.54, 4.8.56, 4.8.58, 4.8.61`) and a floor
   (`4.9.23 and later`, confined to its own `major.minor` so it never describes a `4.10.x`
   release).
2. For `vmware` (EC binary) and `appliance` installs, a ✅ whose source and target are two or more
   Kubernetes minors apart becomes ❓. `kubernetes` (Helm) installs are exempt, because on a
   customer-managed cluster the Kubernetes version is managed independently of Palette.
3. An explicit ❌ from Confluence is never overridden.

The rule **fails open**: a release the constraint table does not describe keeps the mark Confluence
gave it, so a newly shipped release is never mislabeled by guesswork. Such a release is reported
only when the other end of the path *is* described, since that is the case where a missing table
entry hides a real answer. Adding the release to the **Kubernetes Version Constraint** table brings
it under the rule.

## Failure modes

Every run prints the rows it adds, removes, and re-marks per block, so a Confluence change that
quietly halves a table cannot look like a clean run.

These abort the run **before anything is written**, because each one would otherwise leave whole
marker blocks silently stranded at their old content:

- A table with no install-type heading above it. Usually an `h3` was renamed, so `INSTALL_MAP` no
  longer matches and the table is discarded. The error names the heading it found.
- An install that parsed zero rows.

These are warnings, and the run continues:

- An `h3` heading that maps to no install and has no table under it.
- A status cell that cannot be classified.
- A release with no documented bundled Kubernetes version (refer to the fail-open behavior above).
- A Confluence block the Markdown has no marker for. Add the marker pair and rerun.

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
