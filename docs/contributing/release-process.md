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
- [Edge Compatibility Matrix](../docs-content/clusters/edge/edge-compatibility-matrix.md)
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

| **Environment Variable** | **Description**                                                                  | **Example Value**       |
| ------------------------ | -------------------------------------------------------------------------------- | ----------------------- |
| `JIRA_EMAIL`             | Issue tracker email.                                                             | `name@spectrocloud.com` |
| `JIRA_API_TOKEN`         | Issue tracker API token.                                                         | `XXX`                   |
| `SUPER_API_TOKEN`        | Super API token.                                                                 | `XXX`                   |
| `GITHUB_TOKEN`           | GitHub token with read access to the private `spectrocloud/nickfury` repository. | `XXX`                   |

`GITHUB_TOKEN` is only needed to look up component versions. Set it in your `.env` file, the same as the other tokens.
When it is not set, the scripts fall back to the token the GitHub CLI already holds, so a machine that has run
`gh auth login` against the organisation needs no `.env` entry at all. The scripts say which of the two they used.

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

### Patch Release Notes

The `make generate-patch-release-notes` target reads the issue tracker ticket for a patch release, generates the release
notes body with Super, and inserts it into the [Release Notes](../docs-content/release-notes/release-notes.md) page. A
patch release can also ship a new CanvOS or Palette CLI version, so the target records those versions across the pages
that document them.

Run the target more than once for the same ticket. Most of what it records is only settled on the day the patch ships,
so the first run scaffolds the section from whatever the ticket says, and each later run corrects it. Every value is
asked for again on each run, and the rows an earlier run wrote for a value that has since changed are removed rather
than left behind.

| **Value**             | **Settled on release day because**                                | **Environment Variable**    |
| --------------------- | ----------------------------------------------------------------- | --------------------------- |
| Candidate issues      | Tickets are added to a patch and pulled from it until it ships.   | `PATCH_CANDIDATE_ISSUES`    |
| Patch release version | A ticket names its `fixVersion` as a placeholder such as `4.9.x`. | `PATCH_RELEASE_VERSION`     |
| Release date          | A patch slips, and the tracker is not corrected when it does.     | `PATCH_RELEASE_DATE`        |
| CanvOS version        | Whether it moved is confirmed when the release is built.          | `PATCH_CANVOS_VERSION`      |
| Palette CLI version   | The same, and it often does not move at all.                      | `PATCH_PALETTE_CLI_VERSION` |
| Palette CLI checksums | The binaries are only published once the release is out.          | `PATCH_PALETTE_CLI_*_SHA`   |

The target asks a short series of questions, so you are only asked for values that apply to this patch. Each question is
skipped when its environment variable is already set, and every question that has something to propose offers it as a
default, so confirming it costs one keystroke.

| **Question**                                                      | **Answer**                                                                                       | **Environment Variable**    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| Candidate issues                                                  | Press Enter to keep the list shown, paste the final list, or clear it to write the body by hand. | `PATCH_CANDIDATE_ISSUES`    |
| Specify the Palette patch release version                         | Press Enter to take the version shown, or give another. A placeholder such as `4.9.x` is valid.  | `PATCH_RELEASE_VERSION`     |
| Specify the release date as YYYY-MM-DD                            | Press Enter to take the date shown, give the date you were told, or enter `pending`.             | `PATCH_RELEASE_DATE`        |
| Does this patch add a new CanvOS or Palette CLI version, or both? | No, only the release notes body is generated.                                                    | `PATCH_COMPONENT_UPDATES`   |
| Do you know the nickfury branch or tag name?                      | Yes, give the name. No, give the versions at the next two questions instead.                     | `NICKFURY_REF`              |
| CanvOS version                                                    | Press Enter to take the version shown, give another, enter `same`, or enter `pending`.           | `PATCH_CANVOS_VERSION`      |
| Palette CLI version                                               | Press Enter to take the version shown, give another, enter `same`, or enter `pending`.           | `PATCH_PALETTE_CLI_VERSION` |
| The Palette CLI checksum                                          | Paste it from ReTool, type `derive`, or leave it empty to record it as pending.                  | `PATCH_PALETTE_CLI_SHA`     |

An unattended run answers from the environment variables alone. It generates the release notes body only, unless
`NICKFURY_REF`, either component version variable, or `PATCH_PALETTE_CLI_SHA` is supplied, which is taken to mean the
component versions are wanted. The **Generate Patch Release Notes** workflow presents the same values as form fields, in
the same order, and its component version tick box has to be set for the branch or tag, version, and checksum fields to
be used.

Super API keys are personal, and Super only accepts a key while its owner has a current SSO session, so the target
checks the key before it asks you anything. In a terminal, it opens Super so that you can sign in, waits for you to
confirm, and then continues. A run with no candidate issues never calls Super, so it never asks you to sign in.

#### Candidate Issues

Most patch tickets carry a **List of candidates** link, which is a saved search covering the whole candidate list.
Plenty do not. A ticket can name a single issue as a smart link, list a couple of keys in prose, or only describe what
the patch is for. The target works through the following sources in order, so all of those shapes are handled.

1. `PATCH_CANDIDATE_ISSUES`, when it is set. Use this on release day, when the final list has been confirmed somewhere
   other than the saved search.
2. The **List of candidates** link. Any other link in the description that carries a JQL query is accepted too, because
   the link text is written by hand and does not always use those words.
3. The issue keys written into the description, whether as prose, as links, or as smart links. Each key is checked
   against the tracker, so a key that is part of a URL or a security identifier is not mistaken for a candidate.
4. What you type at the prompt.

Whatever is resolved is offered at the prompt for confirmation rather than used unseen, so editing the list is how you
make the release day correction. An issue closed as **Not a Bug** is dropped whichever source named it.

A ticket that names no candidates at all is not a reason to stop, because every other value the target records is still
worth writing. A new section is scaffolded with a `BODY PENDING` marker where the bug fix entries go, for you to write
from the ticket. Re-running the target then leaves that body exactly as you wrote it and refreshes only the heading and
the component sections, so you can correct the version and the date without losing your work.

Each generated section records the candidate list it was built from in a `<!-- PATCH RELEASE CANDIDATES: ... -->`
comment. A later run reports which tickets were added and which were dropped, and tells Super to take the dropped
tickets' entries back out of the body.

#### Release Version and Date

The section heading names the release version and the date. Both are proposed from the ticket and confirmed at a prompt.

The version is seeded from the ticket summary first, because a summary such as "Release notes for 4.9.53 patch release"
names the real version and is corrected as the release firms up, while the `fixVersion` in the candidates query usually
stays a placeholder such as `4.9.x`. The version last generated for the ticket is the final fallback. A placeholder is a
valid answer, and re-running the target once the version is confirmed corrects the heading and moves the rows across.

The date is seeded from the end of the due date window that the candidates query searches, then from the ticket's own
due date. Neither is a reliable record of when a patch actually shipped, so give the date you were told on release day.
Entering `pending` heads the section with a `DATE PENDING` marker instead, and a later run replaces it. Entering `keep`
leaves the date already in the heading as it is. The target reads both spellings of the due date field, `due` and
`duedate`, and both shapes of the `fixVersion` clause, a single value and a list, so a candidates link written either
way is understood.

An unattended run keeps whatever the section already records rather than reverting it to a seed. A version already in
the `<!-- PATCH RELEASE VERSION: ... -->` comment wins over both seeds when it is a real version rather than a
placeholder, and a date already in the heading wins over both of its seeds. Someone confirmed those at a prompt, and a
ticket summary or due date is often never corrected afterwards, so the **Update Patch Release Notes** workflow would
otherwise move a confirmed section back onto a placeholder every time it ran. Set `PATCH_RELEASE_VERSION` or
`PATCH_RELEASE_DATE` to change either one unattended.

Each generated section records the version it was built for in a `<!-- PATCH RELEASE VERSION: ... -->` comment. When a
later run confirms a different version, the target removes the rows the earlier run wrote for the old one, so a
confirmed version replaces its placeholder rather than sitting alongside it.

#### Component Versions

The nickfury question asks for a branch or tag name, because a ref name does not always correspond to the patch release
version. Release engineering hands over one of the following, so use the name you were given rather than one derived
from the version.

| **Ref**  | **Naming**          | **Example**                    |
| -------- | ------------------- | ------------------------------ |
| Branch   | `release-<version>` | `release-4.9`, `release-4.9.b` |
| Tag      | `v<version>`        | `v4.9.46`                      |
| Tag (RC) | `v<version>-rc.<N>` | `v4.9.47-rc.2`                 |

Palette `4.9.47`, for example, can be built from the tag `v4.9.47-rc.2`, which no version-derived guess would find. The
prompt accepts a name copied straight from a release ticket, including a full `refs/tags/...` or `refs/heads/...` path.
Supplying a bare version instead of a name also works: the target tries `v<version>` and then `release-<version>`.

Once the ref resolves, the target reads the `stylus` and `palette-cli` versions from `release/spectro_versions.txt` in
the `spectrocloud/nickfury` repository. It then proposes each of them at its own prompt, so a version that was bumped
after the ref was cut can be replaced with the one you were given. The ref question only appears when a GitHub token is
available, because without one there is nothing to read, and the version prompts appear either way.

Answer `same` when a component did not move in this patch. That is the common case: a patch release often ships the same
CanvOS and Palette CLI as the release before it. The target compares whatever version is settled against the version
already recorded in the [Edge Compatibility Matrix](../docs-content/clusters/edge/edge-compatibility-matrix.md), and
only a component whose version moved is documented.

| **Component**             | **nickfury Key** | **Pages Updated When the Version Moves**                                                                                                                          |
| ------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CanvOS, Stylus, Edge host | `stylus`         | An **Edge** section in the release notes, and a row in the Edge Compatibility Matrix.                                                                             |
| Palette CLI               | `palette-cli`    | An **Automation** section in the release notes, a row in the Edge Compatibility Matrix, the Install Palette CLI version output, and a row in the CLI Tools table. |

A component that turns out not to have moved has no rows to write, and the target also removes any that an earlier run
wrote for this ticket. Confirming that the Palette CLI stayed put takes its rows, and their pending checksums, back out
of the CLI Tools table, and confirming that neither component moved takes the Edge Compatibility Matrix row out too.
Answering no to the component version question does the same.

A row is only removed when the component question was actually answered, either at the prompt or through the workflow's
tick box, and only when this ticket's own section documented that component. A run that was never told anything about
the components leaves every row and both release notes sections exactly as published and says so, so a row that belongs
to `make generate-release`, to another patch ticket, or to an earlier run of this one is never removed by silence. That
matters most for the **Update Patch Release Notes** workflow, which reruns on a pull request comment with no values set
at all.

#### Pending Values

The CLI Tools table needs each binary's checksum, which nickfury does not carry, and the binaries are only published
after the release. Rather than omit an entry, the target writes it with a marker naming what is still missing, so the
scaffolding exists from the first run and a later run only has to fill in the values.

| **Marker**        | **Stands in for**                                                 |
| ----------------- | ----------------------------------------------------------------- |
| `VERSION PENDING` | A CanvOS or Palette CLI version.                                  |
| `DATE PENDING`    | The release date in the section heading.                          |
| `URL PENDING`     | The Palette CLI download URL.                                     |
| `SHA PENDING`     | The Palette CLI checksum.                                         |
| `BODY PENDING`    | The bug fix entries, for a ticket that named no candidate issues. |

Search the documentation for `PENDING` to find every value still to be confirmed.

Re-running the target replaces the values it wrote before, so a run that fills in a branch or tag turns the pending
markers into real versions. It will not do the reverse silently: when a run has no version for a component that the
release already documents, it says so and asks before replacing a real value with a marker. Declining keeps what is
published, and an unattended run always keeps it. A checksum already recorded for the version being written is kept the
same way.

> [!WARNING]
>
> The target replaces whole rows rather than individual cells, so a row you have edited yourself is overwritten. Re-run
> the target with the branch or tag name, and with the checksum variables set or the binaries published, rather than
> filling a row in by hand and re-running.

> [!WARNING]
>
> A release candidate branch or tag holds prerelease component versions, such as `4.9.38-rc.1`. The target warns you
> when it reads one. Re-run it against the final release branch or tag before you merge the pull request.

> [!WARNING]
>
> The component pages are written before the release notes body is, so a run that fails at the Super call can leave a
> row removed and its replacement unwritten. Re-run the target to finish the job, and check `git diff` before you
> commit.

### Commands

- `make init-release` creates placeholders for all the release related environment variables in your `.env` file. Use
  the placeholders to fill in the values relevant to the Palette release.
- `make generate-release-notes` creates only the release notes changes for the Palette release.
- `make generate-release` creates all Palette release related updates, excluding release notes.
- `make generate-component-updates` creates component updates using the issue tracker API and Super.
- `make generate-patch-release-notes` creates patch release notes using the issue tracker API and Super, and records any
  CanvOS or Palette CLI version the patch ships. Run it again on the day the patch ships to correct the candidate
  issues, the version, the date, the component versions, and the checksum, and to remove the rows that the values it
  wrote earlier no longer warrant. Refer to [Patch Release Notes](#patch-release-notes) for the values it prompts for.
- `make ci-local` installs or updates all node dependencies required to start and build the site locally. This command
  is preferred over `npm ci` as it prevents scripts from running during the installation process except for the Sharp
  module dependency.
