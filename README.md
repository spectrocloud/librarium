<!-- vale off -->

# Spectro Cloud Documentation

![Spectro Cloud logo with docs inline](/static/img/spectrocloud-logo-light.svg)

Welcome to the Spectro Cloud documentation repository. This repository contains the source for
[docs.spectrocloud.com](https://docs.spectrocloud.com).

Use this README as a quick start for contributing. For deeper guidance, see the contributor guides linked below.

For internal Spectro Cloud users, review the
[contributions](https://spectrocloud.atlassian.net/wiki/spaces/DE/pages/1765572627/Contribution) section of the
Documentation & Education team's home page.

## Quick Start

The recommended local development path uses Docker.

1. Install the required software listed in the
   [Local Development](./docs/contributing/local-development.md#prerequisites) guide.

2. Initialize the repository.

   ```shell
   make init
   ```

3. Add your Palette API key to the `.env` file.

   ```shell
   PALETTE_API_KEY="<your-palette-api-key>"
   ```

4. Start the Docker-based local development server.

   ```shell
   make docker-start
   ```

5. Open [http://localhost:9000](http://localhost:9000) to view the documentation website.

For the non-Docker setup, refer to [Local Development](./docs/contributing/local-development.md).

## Make Documentation Changes

Create a branch for your changes.

```shell
git checkout -b <branch_name>
```

Most documentation pages are in the [docs/docs-content](./docs/docs-content/) folder. Make changes to the relevant
Markdown or MDX files, then preview them locally.

```shell
make start
```

When your changes are ready, stage and commit them.

```shell
git add -A && git commit -m "docs: your commit message here"
```

Use the `docs:` commit prefix for regular documentation changes. Avoid `feat:`, `fix:`, `perf:`, and other
semantic-release prefixes unless you intentionally need to trigger a version change.

## Validate Your Changes

Run the checks that match your change before opening a pull request.

| Check               | Command              | More information                                                       |
| ------------------- | -------------------- | ---------------------------------------------------------------------- |
| Writing style       | `make check-writing` | [Checks and CI](./docs/contributing/checks-and-ci.md#check-writing)    |
| Formatting          | `make format-check`  | [Checks and CI](./docs/contributing/checks-and-ci.md#check-formatting) |
| Full local CI setup | `make ci-local`      | [Release Process](./docs/contributing/release-process.md#commands)     |

The content in this repository requires approval from the documentation team. Approval rules are defined in
[CODEOWNERS](./CODEOWNERS).

## Contributor Guides

| Guide                                                                          | Use it for                                                                              |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Local Development](./docs/contributing/local-development.md)                  | Prerequisites, Docker setup, non-Docker setup, and local environment variables.         |
| [Authoring Content](./docs/contributing/authoring-content.md)                  | Creating pages, organizing sidebars, tutorials, and reviewer guidance.                  |
| [Markdown and MDX](./docs/contributing/markdown-and-mdx.md)                    | Links, images, redirects, code blocks, and admonitions.                                 |
| [Components](./docs/contributing/components.md)                                | Tabs, videos, tooltips, partials, badges, cards, and Palette/VerteX URL helpers.        |
| [Generated Content and Integrations](./docs/contributing/generated-content.md) | API docs, security bulletins, packs, cached generated data, and the Kapa widget.        |
| [Checks and CI](./docs/contributing/checks-and-ci.md)                          | Netlify previews, Vale, Prettier, spellcheck, and build exit codes.                     |
| [Release Process](./docs/contributing/release-process.md)                      | Release branches, unreleased banners, Palette release automation, and release commands. |
| [Style Guide](./style-guide.md)                                                | Spectro Cloud documentation style, grammar, formatting, and usage guidance.             |

## Repository References

| File or directory                                         | Description                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| [docs/docs-content](./docs/docs-content/)                 | Main documentation content.                                 |
| [docs/api-content](./docs/api-content/)                   | API documentation content generated from OpenAPI specs.     |
| [\_partials](./_partials/)                                | Reusable MDX partials.                                      |
| [static/assets/docs/images](./static/assets/docs/images/) | Documentation image assets.                                 |
| [CODEOWNERS](./CODEOWNERS)                                | Pull request ownership and approval rules.                  |
| [Makefile](./Makefile)                                    | Local development, validation, and release helper commands. |

## Related GitHub Repositories

| Repository                                                                                                    | Use it for                                                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [spectrocloud/librarium](https://github.com/spectrocloud/librarium)                                           | Spectro Cloud documentation source.                           |
| [spectrocloud/spectro-vale-pkg](https://github.com/spectrocloud/spectro-vale-pkg)                             | Spectro Cloud Vale style rules.                               |
| [spectrocloud/tutorials](https://github.com/spectrocloud/tutorials)                                           | Tutorial source and supporting examples.                      |
| [spectrocloud/docs-assignments](https://github.com/spectrocloud/docs-assignments)                             | Documentation assignment tracking.                            |
| [spectrocloud/docusaurus-versioning-template](https://github.com/spectrocloud/docusaurus-versioning-template) | Historical Docusaurus versioning reference and demo template. |
| [spectrocloud/hello-universe](https://github.com/spectrocloud/hello-universe)                                 | Hello Universe sample application.                            |
| [spectrocloud/hello-universe-api](https://github.com/spectrocloud/hello-universe-api)                         | Hello Universe API service.                                   |
| [spectrocloud/hello-universe-db](https://github.com/spectrocloud/hello-universe-db)                           | Hello Universe database service.                              |
