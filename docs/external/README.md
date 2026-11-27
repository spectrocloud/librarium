# External Contributions

This directory holds documentation that Spectro Cloud contributes to other projects' documentation sites. Docusaurus
does not build this directory, so nothing here appears on docs.spectrocloud.com.

## Layout

Each file sits at the same path that it has in the upstream repository, under `docs/external/<org>/<repo>/`. The
upstream pull request is then a straight copy of the file.

| File in this directory                                                   | Upstream repository                                                     | Upstream path                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `nvidia/cloud-native-docs/partner-validated/spectro-cloud-paletteai.rst` | [NVIDIA/cloud-native-docs](https://github.com/NVIDIA/cloud-native-docs) | `partner-validated/spectro-cloud-paletteai.rst` |

## Workflow

1. Draft the file in this directory and review it in a pull request to this repository.

2. Copy the reviewed file into a pull request to the upstream repository. Follow that project's contribution rules, not
   the Spectro Cloud style guide. For NVIDIA, refer to the
   [NVIDIA contribution guide](https://github.com/NVIDIA/cloud-native-docs/blob/main/CONTRIBUTING.md), which requires a
   Developer Certificate of Origin sign-off on every commit.

3. If the upstream reviewers change the wording, copy their changes back to this directory. The copy in this directory
   is the source of truth.

## Checks

CI does not check the reStructuredText files in this directory. Vale lints only Markdown, and Prettier has no
reStructuredText parser. Review reStructuredText files by hand against the upstream project's contribution guide.
