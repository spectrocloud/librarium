<!-- vale off -->

# Checks and CI

## Netlify Previews

By default, Netlify previews are enabled for pull requests. However, some branches do not require Netlify previews. The
[netlify.toml](../../netlify.toml) file configures the [scripts/netlify.sh](../../scripts/netlify.sh) script as the
Netlify `ignore` command, which determines whether a build proceeds based on the deploy context and the branch name.

A separate allowed branches list, stored in the Netlify site build settings, controls which branches may create a
preview that enables the Netlify Collab drawer. By default, only deploy previews that target the production branch are
allowed. The [scripts/netlify_add_branch.sh](../../scripts/netlify_add_branch.sh) and
[scripts/netlify_remove_branch.sh](../../scripts/netlify_remove_branch.sh) scripts manage this list through the Netlify
API.

If you want to add a branch whereby any pull request to that branch will trigger a Netlify Preview, go to the
[**Branches and deploy contexts** in Netlify](https://app.netlify.com/projects/docs-spectrocloud/configuration/deploys#branches-and-deploy-contexts)
and click **Configure**. Add your branch to the **Additional branches** field, and click **Save**.

### Version Branch Builds

Branches that match the `version-X-Y` pattern host the documentation for released Palette versions. To reduce the number
of redundant builds during backports, Netlify does not build these branches on every push or merge. Instead, the
[netlify-version-release.yaml](../../.github/workflows/netlify-version-release.yaml) workflow rebuilds them twice daily,
mirroring the production release cadence. You can also trigger a build on demand from the **Actions** tab in GitHub by
running the **Netlify Version Branch Release** workflow, optionally specifying a single `version-X-Y` branch.

The [scripts/netlify.sh](../../scripts/netlify.sh) script enforces this behavior. It allows a `version-X-Y`
branch-deploy build only when the build originates from the scheduled Netlify build hook, and it skips plain push or
merge builds.

## Check Writing

We leverage [Vale](https://vale.sh/) to help us enforce our writing style programmatically and to avoid common writing
mistakes. The writing checks are executed upon a pull request. You may also conduct a writing check locally by using the
Vale CLI. Follow the steps below to install the Vale CLI and execute the writing checks.

Start by installing Vale by following the [installation steps](https://vale.sh/docs/vale-cli/installation/) in the Vale
documentation.

Next, download the required Vale plugins.

```shell
make sync-vale
```

To execute the writing check, issue the command below. The command below will identify files that are modified by
comparing the current git branch against the `master` branch. Ensure your local `master` branch is up to date for
accurate results.

```shell
make check-writing
```

You may also use the Vale CLI to directly scan a file and receive feedback.

Example:

```shell
vale content/docs/08-user-management.md
```

## Vale

The [.vale.ini](../../.vale.ini) file contains the configuration for Vale. We use the
[Spectro Cloud Vale](https://github.com/spectrocloud/spectro-vale-pkg) package to enforce our writing style.

### Spellcheck Entire Librarium

The [spellcheck-report.yaml](../../.github/workflows/spellcheck-report.yaml) is a recurrent job that uses Vale to run
weekly spelling checks on the entire repository. The Documentation & Education team monitors the results of these
spelling scans and ensures that errors are rectified.

If you find an error, you can remediate it through the following possible actions:

1. Raise a PR to add a new word to the [`spectro-vale-pkg`](https://github.com/spectrocloud/spectro-vale-pkg) accept
   list.
2. Skip Vale checks on the portion of the file that is triggering the error using the `<!-- vale off -->` element. This
   element must be set on a separate line, so it cannot be used to ignore a single line of a table or Markdown file
   front matter.
3. Add the error to the `vale-spellcheck-ignore.txt` file to flag it as an exception to the Vale spelling check job.

## Check Formatting

We use [Prettier](https://prettier.io/) to maintain uniform and consistent formatting across the docbase. When you
commit changes, Prettier formats the staged files automatically. Then, once you create a pull request, it verifies that
the formatting in all files complies with our Prettier configuration.

> [!NOTE]
>
> The CI will automatically format the files and commit the changes, if necessary.

To manually check the formatting before pushing your work upstream, execute the following command in your terminal:

```shell
make format-check
```

Console output if all files are formatted:

```shell
Checking formatting...
All matched files use Prettier code style!
```

Console output if some of the files require re-formatting:

```shell
Checking formatting...
[warn] README.md
[warn] Code style issues found in the above file. Run Prettier to fix.
```

To manually format all files, issue the following command:

```shell
make format
```

### Known Caveats

- When using callouts/admonitions,
  [pay attention to their syntax](https://docusaurus.io/docs/markdown-features/admonitions#usage-with-prettier).

  ```
  <!-- Prettier doesn't change this -->
  :::note

  Hello world

  :::

  <!-- Prettier changes this -->

  :::note
  Hello world
  :::

  <!-- to this, interfering with the admonition rendering and breaking JSX components -->

  ::: note Hello world:::

  ```

- When you add JSX or HTML syntax, Prettier can introduce empty artifacts around them `{" "}` to ensure that whitespace
  is preserved in the rendered output – a helpful feature in React development. However, Docusaurus can sometimes parse
  them as valid HTML, making these artifacts visible to readers. For this reason, check your docs before pushing changes
  upstream and remove any `{" "}` you find.

## Exit Codes

Librarium provides the following exit codes. These exit codes are returned by both the `npm run start` and
`npm run build` commands.

> [!NOTE]
>
> Any exit codes added to the table must also be added to the Makefile's `build-ci` command.

| **Exit Code**                 | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`                           | The command was executed successfully.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `5`                           | The command failed due to errors received from the API service related to packs. These requests are issued by the [Packs Component](generated-content.md#packs-component) and librarium cannot start without loading packs, either from the API service or the [cached packs data](generated-content.md#cached-packs-data)                                                                                                                                                                   |
| `7`                           | The command failed due to errors received from the API service related to security bulletins. These requests are issued by the [CVE script](../../utils/cves/index.js) and librarium cannot start without loading the security bulletins. The [Build with Cached CVE](../../.github/actions/build-cached-cves/action.yaml) action is built to handle this exit situation and build with cached CVEs. You can issue the command `make get-cached-cves` to fetch cached CVEs to build locally. |
| Any other non-zero exit code. | The command failed due to another error. Check the command output.                                                                                                                                                                                                                                                                                                                                                                                                                           |
