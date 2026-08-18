<!-- vale off -->

# Release Process

The following section discusses the basics of creating a new documentation release based on an upcoming Palette release.
Refer to the
[Confluence Release Checklist](https://spectrocloud.atlassian.net/wiki/spaces/DE/pages/1830420481/Release+Checklist) for
details.

## Release

To create a new release, use the following steps.

1. Create a release branch. Use the following naming pattern `docs-rel-X-X-X`.

2. Create a commit using the semantic-release syntax that matches the Palette release increment. Replace `X-X` with the
   upcoming release number.

   - For patch increments, use `fix: update documentation for docs-rel-X-X-X`.
   - For minor increments, use `feat: update documentation for docs-rel-X-X-X`.
   - For major increments, include `BREAKING CHANGE` in the commit message body or footer.

   ```text
   feat: update documentation for docs-rel-X-X-X

   BREAKING CHANGE: update documentation for X.X.0
   ```

3. Push up the commit and create a new Pull Request (PR).

4. Merge PRs related to the upcoming release into the `docs-rel-X-X-X` branch. Apart from individual issue-tracking
   tickets capturing product changes, use [release scripts](#palette-release#documentation) to populate values specific
   to each release.

5. Merge the release branch.

- If the branch `version-X-X` that corresponds to the current major-minor version of Palette already exists, add the
  labels auto-backport and backport-version-X-X, where version-X-X corresponds to the current major-minor version of
  Palette.

- If no `version-X-X` branch that corresponds to the current major-minor of Palette exists, create a new `version-X-X`
  branch from the source branch used for versioning the documentation, and push the new version branch to the remote
  repository.

6. Trigger a new release to publish the release.

The semantic-release logic and the GitHub Actions in the [release.yaml](../../.github/workflows/release.yaml) ensure the
new release tag is created.

> [!WARNING]
>
> Unless merging a release branch, don't use `feat`,`perf`, `fix`, or other semantic-release key words that trigger a
> version change. Use the commit message prefix `docs: yourMessageHere` for regular documentation commits.

## Product Documentation Versions

Palette's archived documentation lives on separate `version-X-Y` branches, each deployed to its own
`legacy.docs.spectrocloud.com` subdomain. That model freezes the whole site, so it only works for a product that _is_
the site.

Products that release on their own schedule are versioned differently. Each one gets its own docs collection, and its
older versions are kept as frozen folders in this repository. Every version ships from one `master` build, so no branch,
subdomain, or DNS entry is involved. The registry of these products is [productDocs.js](../../productDocs.js).

> [!WARNING]
>
> Never backport a product's documentation to a `version-X-Y` branch. Those branches archive Palette, and a product's
> release schedule has no relationship to Palette's. Product versions are cut with the command below instead.

### Cut a New Product Version

> [!WARNING]
>
> **You archive the version you are leaving, not the version you are shipping.**
>
> When PaletteAI Inference Launchpad 1.1.0 ships, you cut `1.0.x`. Running the command with `1.1.0` freezes the new
> documentation as an archive and leaves the old content published as `latest`. Nothing errors when you get this
> backwards, so check the number before you run it.

The examples below cut `1.0.x` at the moment 1.1.0 ships. Substitute your own product `id` and version.

#### Before You Begin

- The 1.1.0 content is written and reviewed, but **not yet merged into `master`**. The cut copies whatever is on disk,
  so any 1.1.0 content present when you run it lands in the 1.0.x archive by mistake.
- Your `.env` file has `ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_KEY`, and `ALGOLIA_INDEX_NAME` set. `make init` adds
  placeholders. Without them the command fails with `"algolia.appId" is required`.
- You are on a branch off the current `master`, not on a `version-X-Y` branch.

#### Name the Version

Use `X.Y.x`, so `1.0.x` rather than `1.0.0`. Two reasons:

- One archive covers a whole patch line. A fix released as 1.0.4 belongs in the `1.0.x` archive, not a new one.
- `visuals/screenshot.docs.spec.ts` skips paths matching `/\d+\.\d+\.x\//`. A version named `1.0.0` is not excluded, so
  every archived page enters visual regression testing.

#### Steps

1. Confirm you are cutting the version you are leaving behind. List what already exists.

   ```shell
   cat inference-launchpad_versions.json 2>/dev/null || echo "no versions cut yet"
   ```

   ```bash hideClipboard title="Expected output"
   no versions cut yet
   ```

2. Cut the version. Use the product `id` from [productDocs.js](../../productDocs.js).

   ```shell
   npm run docusaurus -- docs:version:inference-launchpad 1.0.x
   ```

   ```bash hideClipboard title="Expected output"
   [SUCCESS] [inference-launchpad]: version 1.0.x created!
   ```

3. Confirm the three artifacts exist. All three are committed.

   ```shell
   ls -d inference-launchpad_versioned_docs/version-1.0.x inference-launchpad_versioned_sidebars && cat inference-launchpad_versions.json
   ```

   ```bash hideClipboard title="Expected output"
   inference-launchpad_versioned_docs/version-1.0.x
   inference-launchpad_versioned_sidebars
   [
     "1.0.x"
   ]
   ```

4. Confirm the archive holds the released content and not the new content. The file count must match the live folder.

   ```shell
   find inference-launchpad_versioned_docs/version-1.0.x -name '*.md' | wc -l
   find docs/products/paletteai-inference-launchpad -name '*.md' | wc -l
   ```

   ```bash hideClipboard title="Expected output"
   37
   37
   ```

5. Build the site.

   ```shell
   make build
   ```

   ```bash hideClipboard title="Expected output"
   [SUCCESS] Generated static files in "build".
   ```

6. Confirm the current documentation URLs did not change. This count must be identical before and after the cut.

   ```shell
   find build/paletteai-inference-launchpad -name index.html | grep -v '/tags/' | grep -v '/1.0.x/' | wc -l
   ```

   ```bash hideClipboard title="Expected output"
   37
   ```

7. Confirm the archive is reachable and de-indexed.

   ```shell
   grep -o 'content="noindex, nofollow"' build/paletteai-inference-launchpad/1.0.x/index.html
   ```

   ```bash hideClipboard title="Expected output"
   content="noindex, nofollow"
   ```

8. Commit all three artifacts, open a pull request against `master`, and confirm on the Netlify deploy preview that the
   version dropdown now lists `latest` and `v1.0.x`, and that switching versions from a nested page keeps you on the
   same page.

9. Merge the cut, then merge the 1.1.0 content. Alternatively, put both in one pull request with the cut as the
   **first** commit. Either way the cut must land first, or the archive captures 1.1.0 content.

No configuration edit is required. The registry reads `<id>_versions.json` from disk, which is why the dropdown appears
on its own, and why the configuration can never name a version that has not been cut.

#### If You Cut the Wrong Version

Before committing, delete the three artifacts and start again. Nothing else changed.

```shell
rm -rf inference-launchpad_versioned_docs inference-launchpad_versioned_sidebars inference-launchpad_versions.json
```

```bash hideClipboard title="Expected output"
(no output)
```

After committing, revert the commit. After merging, the archive is in the published site and in git history, so remove
it in a follow-up pull request and note the correction in the release notes.

#### Common Mistakes

| Mistake                                             | What happens                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Cutting `1.1.0` instead of `1.0.x`                  | The new content becomes the archive. No error is raised.                      |
| Cutting after merging the 1.1.0 content             | The archive contains 1.1.0 content, so both versions show the same pages.     |
| Naming the version `1.0.0` instead of `1.0.x`       | Archived pages are not excluded from visual regression testing.               |
| Editing files under `<id>_versioned_docs/` by habit | You are editing a shipped version. Everyday edits belong in `docs/products/`. |
| Running the command without `.env` loaded           | Fails with `"algolia.appId" is required`.                                     |

> [!NOTE]
>
> Do not create a `docs-rel-*` branch for a product release. That branch pattern deploys to
> `docs-latest.spectrocloud.com`, which Palette release previews use, and a second branch would overwrite whatever is
> published there. Use an ordinary feature branch and the Netlify deploy preview instead.

Archived versions are set to `noIndex`, matching how `version-X-Y` branches are treated by
[versions_robot.yaml](../../.github/workflows/versions_robot.yaml). This also removes them from `sitemap.xml`, and
therefore from the visual-regression sweep and the Algolia crawler. Re-run the
[Algolia crawler](../../.github/workflows/aloglia_crawler.yaml) after the release deploys.

Archived pages do not display a "no longer actively maintained" notice, which matches Palette's archived sites. Because
archived versions are de-indexed and absent from the sitemap, no search engine or site search routes a reader to one,
and a bookmark cannot lead to one either, because a version is served from the unversioned URL while it is current.

Archived pages do show a **Version: v1.0.x** label above the title. The current version shows no label, because there it
would tell the reader nothing.

### Backport a Fix to an Older Product Version

Unlike Palette, a product's older versions are not on separate branches, so there is no cherry-pick, no `auto-backport`
label, and no waiting for a branch deploy. Edit the file inside `<id>_versioned_docs/version-<version>/` in an ordinary
pull request against `master`. The fix ships with the next production release.

Because both copies live in the same branch, a fix that applies to the current documentation and to an older version can
be made in a single pull request, so a reviewer sees both changes together.

Two things to know:

- Frozen pages are excluded from Prettier so that a Prettier upgrade cannot rewrite a shipped version. Match the
  surrounding formatting by hand. Vale still runs, so style and spelling are checked as usual.
- Links inside a frozen page resolve within that same version, and the build fails on broken links. You therefore cannot
  accidentally link an older version to a page that only exists in the current documentation.

### Add a New Product

1. Add an entry to [productDocs.js](../../productDocs.js).
2. Create the content directory under `docs/products/`.
3. Create a sidebar file. It must be its own file rather than a key in `sidebars.js`, because `docs:version` snapshots
   the entire sidebar module and a shared file would freeze one product's sidebar into another product's version.

Shared partials are not versioned per product. A frozen page falls back to the current partial, so a partial edit is
visible in every version. To pin a partial to one version, add it under `versioned_partials/version-<version>/`.

## Unreleased Version Banner

The `UNRELEASED_VERSION_BANNER` environment variable determines whether the unreleased version banner displays. For
example, the banner can display on
[https://docs-latest.spectrocloud.com/release-notes/](https://docs-latest.spectrocloud.com/release-notes/). The default
value is `false`. To display the unreleased version banner, set the `UNRELEASED_VERSION_BANNER` environment variable to
`true`.

```shell
export UNRELEASED_VERSION_BANNER=true
```

## Palette Release Documentation

We have a series of scripts that automatically make updates to the documentation with a new Palette release. These
scripts rely on environment variables for their information.

The scripts update the following files.

- [Advanced CLI Configuration](../docs-content/registries-and-packs/advanced-configuration.md)
- [Downloads](../docs-content/downloads/cli-tools.md)
- [Install Palette CLI](../docs-content/automation/palette-cli/install-palette-cli.md)
- [`_palette-vmware-kubernetes-versions.mdx`](../../_partials/self-hosted/_palette-vmware-kubernetes-versions.mdx)
- [`_palette-vmware-kubernetes-versions.mdx`](../../_partials/vertex/_palette-vmware-kubernetes-versions.mdx)
- [`_palette-kubernetes-versions.mdx`](../../_partials/_palette-kubernetes-versions.mdx)
- [Private Cloud Gateway](../docs-content/clusters/pcg/pcg.md)
- [Release Notes](../docs-content/release-notes/release-notes.md)
- [Spectro Cloud CLI Tool](../docs-content/registries-and-packs/spectro-cli-reference.md)

### Environment Variables

The following table provides an overview of all the environment variables and the pages that use them. Set these
variables in your local `.env` file to automatically populate pages with the necessary values. For ease of recognition,
these scripts use the `RELEASE_` prefix for all release-related environment variables. For more information on where to
find these values, refer to the
[Confluence Release Checklist](https://spectrocloud.atlassian.net/wiki/spaces/DE/pages/1830420481/Release+Checklist)
page.

#### Issue Tracker and Super API

| **Environment Variable** | **Description**          | **Example Value**       |
| ------------------------ | ------------------------ | ----------------------- |
| `JIRA_EMAIL`             | Issue tracker email.     | `name@spectrocloud.com` |
| `JIRA_API_TOKEN`         | Issue tracker API token. | `XXX`                   |
| `SUPER_API_TOKEN`        | Super API token.         | `XXX`                   |

Super API keys are personal, and Super only accepts a key while its owner has a current SSO session. When the owner has
not signed in to [Super](https://app.super.work) recently, Super rejects the key with an HTTP 401 error. Because Super
has no way to complete an SSO login from a script, the `generate-patch-release-notes` and `generate-component-updates`
targets check the key before they make any other API calls. In a terminal, the script opens Super so that you can sign
in, waits for you to confirm, and then continues. A GitHub Actions runner has no browser, so the script stops with an
error instead. The owner of the key stored in the `SUPER_API_TOKEN` repository secret must sign in to Super before you
run the workflow again.

#### Release Notes

| **Environment Variable**    | **Description**                                       | **Example Value**  |
| --------------------------- | ----------------------------------------------------- | ------------------ |
| `RELEASE_NAME`              | The internal release name.                            | `4-7-c`            |
| `RELEASE_VERSION`           | The external release version.                         | `4.7.6`            |
| `RELEASE_DATE`              | The date that the release takes place.                | `"March 18, 2025"` |
| `RELEASE_CANVOS`            | The CanvOS version.                                   | `4.7.13`           |
| `RELEASE_TERRAFORM_VERSION` | The version of the Terraform and Crossplane provider. | `0.24.5`           |

#### Component Updates

| **Environment Variable**       | **Description**               | **Example Value** |
| ------------------------------ | ----------------------------- | ----------------- |
| `RELEASE_ARTIFACT_STUDIO`      | Artifact Studio version.      | `4.9.0`           |
| `RELEASE_MANAGEMENT_APPLIANCE` | Management Appliance version. | `4.9.8`           |

#### Other Release Updates

| **Environment Variable**             | **Description**                                                                                                                                                                                    | **Example Value**                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `RELEASE_PALETTE_CLI_VERSION`        | The Palette CLI version.                                                                                                                                                                           | `4.6.0`                                                               |
| `RELEASE_PALETTE_CLI_SHA`            | The SHA of the Palette CLI corresponding to the provided version.                                                                                                                                  | `07d63693a8c90483f6f000d4580cfd86f81178e4b96cfbd32e0f50955d57eec7`    |
| `RELEASE_REGISTRY_VERSION`           | The Spectro registry version.                                                                                                                                                                      | `4.6.1`                                                               |
| `RELEASE_SPECTRO_CLI_VERSION`        | The Spectro CLI version.                                                                                                                                                                           | `4.6.0`                                                               |
| `RELEASE_VMWARE_KUBERNETES_VERSION`  | The Kubernetes version of the Palette [VMware installation](https://docs.spectrocloud.com/enterprise-version/install-palette/#kubernetes-requirements).                                            | `1.30.9`                                                              |
| `RELEASE_VMWARE_OVA_URL`             | The OS and Kubernetes OVA Download URL corresponding to the Palette release for [VMware installations](https://docs.spectrocloud.com/enterprise-version/install-palette/#kubernetes-requirements). | `https://vmwaregoldenimage.s3.amazonaws.com/u-2204-0-k-1309-0.ova`    |
| `RELEASE_VMWARE_FIPS_OVA_URL`        | The OS and Kubernetes FIPS OVA Download URL corresponding to the Palette for [VMware installations](https://docs.spectrocloud.com/enterprise-version/install-palette/#kubernetes-requirements).    | `https://vmwaregoldenimage.s3.amazonaws.com/u-2004-0-k-1309-fips.ova` |
| `RELEASE_HIGHEST_KUBERNETES_VERSION` | The highest supported Kubernetes version for Palette [Kubernetes installation](https://docs.spectrocloud.com/enterprise-version/install-palette/#kubernetes-requirements).                         | `1.30.9`                                                              |
| `RELEASE_PCG_KUBERNETES_VERSION`     | The Kubernetes cluster version required for PCG [installations](https://docs.spectrocloud.com/clusters/pcg/#kubernetes-requirements).                                                              | `1.30.9`                                                              |

### Commands

- `make init-release` creates placeholders for all the release related environment variables in your `.env` file. Use
  the placeholders to fill in the values relevant to the Palette release.
- `make generate-release-notes` creates only the release notes changes for the Palette release.
- `make generate-release` creates all Palette release related updates, excluding release notes.
- `make generate-component-updates` creates component updates using the issue tracker API and Super.
- `make generate-patch-release-notes` creates patch release notes using the issue tracker API and Super.
- `make ci-local` installs or updates all node dependencies required to start and build the site locally. This command
  is preferred over `npm ci` as it prevents scripts from running during the installation process except for the Sharp
  module dependency.
