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
