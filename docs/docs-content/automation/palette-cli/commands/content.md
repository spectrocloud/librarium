---
sidebar_label: "Content"
title: "Content"
description: "Command to create and manage content bundles."
hide_table_of_contents: false
sidebar_position: 5
toc_max_heading_level: 3
tags: ["palette-cli"]
---

The `content` command supports the creation and management of
[content bundles](../../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md), which are archives
containing all the images and artifacts required for deploying an Edge cluster. You can also use this command to export
[cluster definitions](../../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) from one or more
cluster profiles in Palette, and to
[upload content bundles](../../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to Edge hosts.

## Prerequisites

- An Edge Native cluster profile. Refer to the
  [Create Edge Native Cluster Profile](../../../clusters/edge/site-deployment/model-profile.md) guide to learn how to
  create an Edge Native cluster profile.

- You must authenticate the Palette CLI with Palette using the [`login`](./login.md) command.

- You must provide an encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters
  long and contain a capital letter, a lowercase letter, a digit, and a special character. You can provide the
  passphrase through the `PALETTE_ENCRYPTION_PASSWORD` environment variable or the `-k` or `--encryption-passphrase`
  flag. Refer to the [Encryption](./../palette-cli.md#encryption) guide for more information on encryption.

## Subcommands

The `content` command includes the following subcommands:

- [`build`](#build) - Build a content bundle.
- [`copy`](#copy) - Copy a specific bundle from one repository to another.
- [`definition`](#definition) - Display the definition of a content bundle.
- [`list`](#list) - List available content bundles.
- [`push`](#push) - Push the bundle to a specific OCI registry.
- [`registry-login`](#registry-login) - Login to a private OCI registry.
- [`save`](#save) - Save the content bundle locally.
- [`serve`](#serve) - Serve the content bundle as a registry.
- [`upload`](#upload) - Upload the content bundle to an Edge host.

### Build

Use the `build` subcommand to create a content bundle or export a cluster definition. Refer to the
[Build Content Bundle](../../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) and
[Export Cluster Definition](../../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) guides for
additional information.

```shell
palette content build [flags]
```

The following flags are supported by the `build` subcommand.

| Short Flag | Long Flag                            | Description                                                                                                                                                                                                                                                                                                                                                                                 | Type    |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
|            | `--application-release-name`         | The name of the application release to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                       | string  |
|            | `--application-release-notes`        | The release notes for the application to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                     | string  |
|            | `--application-release-version`      | The version of the application release to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                    | string  |
| `-a`       | `--arch`                             | The architecture of the bundle to be built. Available options are `amd64` and `arm64`. If not specified, the command builds a multi-architecture content bundle.                                                                                                                                                                                                                            | string  |
|            | `--build-type`                       | The type of build. The available options are `local`, where the build is performed locally, and `remote`, where the build is performed directly on the registry. The default value is `local`. To enable remote builds, you must also specify the registry address using the `--registry` flag.                                                                                             | string  |
|            | `--ca-cert`                          | The path to the CA certificate file.                                                                                                                                                                                                                                                                                                                                                        | string  |
|            | `--cluster-definition-name`          | The filename of the cluster definition `.tgz` file.                                                                                                                                                                                                                                                                                                                                         | string  |
|            | `--cluster-definition-profile-ids`   | A comma-separated list of cluster profile IDs to be included in the cluster definition.                                                                                                                                                                                                                                                                                                     | string  |
|            | `--compression-level`                | The compression level for the archive file. The default value is `3`.                                                                                                                                                                                                                                                                                                                       | integer |
|            | `--download-cluster-config-only`     | If enabled, only the cluster configuration will be downloaded.                                                                                                                                                                                                                                                                                                                              | boolean |
|            | `--existing-bundles`                 | Existing `.tar.zst` bundle archives to include as part of the content bundle build. This avoids the need to redownload images, charts, and raw files that are already present in local bundles.                                                                                                                                                                                             | string  |
| `-k`       | `--encryption-passphrase`            | The encryption passphrase used to secure sensitive data.                                                                                                                                                                                                                                                                                                                                    | string  |
|            | `--exclude-profiles`                 | A comma-separated list of cluster profile IDs whose content should be excluded from the generated content bundle.                                                                                                                                                                                                                                                                           | string  |
|            | `--fips`                             | If enabled, the bundle will include only FIPS service images.                                                                                                                                                                                                                                                                                                                               | boolean |
| `-h`       | `--help`                             | Help for the `build` subcommand.                                                                                                                                                                                                                                                                                                                                                            | -       |
|            | `--images-only`                      | Includes only images in the content bundle, excluding charts and `tar.gz` pack files. This flag is applicable only when used with the `--packs` flag.                                                                                                                                                                                                                                       | boolean |
|            | `--include-core-palette-images-only` | Whether to include only the essential Palette images required for cluster creation, excluding day-2 images. This option is recommended for airgap installations to reduce the size of the content bundle. By default, this flag is set to `false`, and the `build` command includes both core and day-2 images.                                                                             | boolean |
|            | `--include-packs`                    | Includes `tar.gz` pack files in the content bundle, as they are not included by default. This flag is applicable only when used with the `--profiles` flag.                                                                                                                                                                                                                                 | boolean |
|            | `--include-service-images`           | Wether to include Palette service images. The default value is `true`.                                                                                                                                                                                                                                                                                                                      | boolean |
| `-i`       | `--insecure`                         | Skips Transport Layer Security (TLS) verification (bypasses x509 verification).                                                                                                                                                                                                                                                                                                             | boolean |
| `-f`       | `--metadata-file`                    | The file path to the content bundle definition metadata file `bundle-definition.yaml` to be used for building the content bundle.                                                                                                                                                                                                                                                           | string  |
|            | `--metadata-only`                    | If enabled, only the bundle definition metadata file `bundle-definition.yaml` is generated. You can edit this file, for example to change a registry path, and then use it with the `--metadata-file` flag to build a content bundle.                                                                                                                                                       | boolean |
| `-n`       | `--name`                             | The name of the content bundle. This is required to generate bundles with unique names. If not provided, the command generates a default name in the `<bundle>-<project-id>` format, which is not unique and may lead to issues, as bundles using the same default name can be overwritten during [upload](#upload) to Local UI.                                                            | string  |
| `-o`       | `--output`                           | The output directory where the bundle will be saved. If not specified, the bundle will be saved to `<current-directory>/output/content-bundle/` by default.                                                                                                                                                                                                                                 | string  |
|            | `--packs`                            | Comma-separated list of local paths to the pack `tar.gz` archive or directory files to include in the bundle.                                                                                                                                                                                                                                                                               | string  |
|            | `--private-key`                      | The path to the private key used to sign the content bundle and cluster definition if it is present. If the Edge host has an embedded corresponding public key, the signature of the uploaded content will be verified. For more information, refer to [Embed Public Key in Edge Artifacts](../../../clusters/edge/edgeforge-workflow/palette-canvos/signed-content.md).                    | string  |
|            | `--profiles`                         | Comma-separated list of cluster profile IDs to download content for the content bundle. Ensure that between all the profiles you include in the content bundle, only one infrastructure layer exists. For example, you can have one infrastructure profile and many add-on files, or one full profile and many add-on files, but you cannot have multiple infrastructure and full profiles. | string  |
|            | `--progress`                         | Displays the build progress output.                                                                                                                                                                                                                                                                                                                                                         | boolean |
|            | `--project-id`                       | The ID of the Palette project.                                                                                                                                                                                                                                                                                                                                                              | string  |
| `-p`       | `--push`                             | Pushes the content bundle to the OCI registry after creation. This applies only if the build type is set to `local`. The default value is `false`.                                                                                                                                                                                                                                          | boolean |
| `-r`       | `--registry`                         | The address of the OCI registry to push the images to. Applies if `--push` is set to `true`.                                                                                                                                                                                                                                                                                                | string  |
|            | `--skip-cleanup`                     | Skips the clean up of temporary files generated during the build process in the output folder.                                                                                                                                                                                                                                                                                              | boolean |
|            | `--tls-cert`                         | The path to the TLS certificate file.                                                                                                                                                                                                                                                                                                                                                       | string  |
|            | `--tls-key`                          | The path to the TLS key file.                                                                                                                                                                                                                                                                                                                                                               | string  |

#### Examples

The following example creates a content bundle named `example-bundle.tar.zst` using the cluster profiles specified by
the `--profiles` flag. The bundle is created in the `<current-directory>/output/content-bundle/` folder by default.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929 --name example-bundle
```

```text hideClipBoard title="Example Output"
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to /home/ubuntu/output/content-bundle/example-bundle.tar.zst
```

The following example creates a cluster definition named `example-definition.tgz` using the cluster profiles specified
by the `--cluster-definition-profile-ids` flag. The definition is created in the `<current-directory>/output/` folder by
default.

```shell
palette content build --arch amd64 --download-cluster-config-only --project-id 1617181929 --cluster-definition-name example-definition --cluster-definition-profile-ids 12345678910
```

```text hideClipBoard title="Example Output"
Downloaded cluster config at /home/ubuntu/output/example-definition.tgz
```

The following example creates both a content bundle named `example-bundle.tar.zst` and a cluster definition named
`example-definition.tgz`. The definition is created in the `<current-directory>/output/` folder, and the bundle is
created in the `<current-directory>/output/content-bundle/` folder by default. When you create a cluster definition and
content bundle using a single `build` command, the cluster definition is also embedded into the content bundle.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929 --cluster-definition-name example-definition --cluster-definition-profile-ids 12345678910 --name example-bundle
```

```text hideClipBoard title="Example Output"
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to /home/ubuntu/output/content-bundle/example-bundle.tar.zst
```

The following example creates a bundle definition named `bundle-definition.yaml` in the
`<current-directory>/output/content-bundle/` folder.

```shell
palette content build --arch amd64 --metadata-only --profiles 12345678910 --project-id 1617181929 --name example-bundle
```

```text hideClipBoard title="Example Output"
Writing flattened bundle definition file at path /home/ubuntu/output/content-bundle/bundle-definition.yaml
```

You can modify the definition according to your use case. For example, you can change the registry path of the images
and then use the `--metadata-file` flag to build a content bundle from the updated definition file.

```shell
palette content build --metadata-file /home/ubuntu/output/content-bundle/bundle-definition.yaml
```

```text hideClipBoard title="Example Output"
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to /home/ubuntu/output/content-bundle/example-bundle.tar.zst
```

The following example creates a new content bundle named `example-bundle.tar.zst` using the cluster profiles specified
by the `--profiles` flag and the existing bundle specified by the `--existing-bundles` flag. This avoids the need to
redownload images defined in the profiles that are already present in the existing bundle.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929 --name example-bundle --existing-bundles ./bundles/example-existing-bundle.tar.zst
```

```text hideClipBoard title="Example Output"
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to /home/ubuntu/output/content-bundle/example-bundle.tar.zst
```

You can exclude content defined in specific cluster profiles from a content bundle using the `--exclude-profiles` flag.
This is useful in day-2 scenarios, where a new version of a cluster profile includes most of the same content as before,
with only minor additions, such as a new pack. By specifying the older profile version under `--exclude-profiles`, you
can exclude any content that was already included in a previous bundle, ensuring that only the new content is added.

The following command creates a new content bundle named `example-bundle.tar.zst` using the cluster profiles specified
by the `--profiles` flag, while excluding any images, charts, or raw files defined in the profiles listed under the
`--exclude-profiles` flag. For example, suppose you created a content bundle on day-1 from cluster profile
`11121314151`, containing packs A, B, and C. On day-2, you create a new version of the cluster profile and add pack D.
You can then use the `--exclude-profiles` flag to create a new bundle that includes only pack D and excludes the packs
already present in the first profile version.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929 --name example-bundle --exclude-profiles 11121314151
```

```text hideClipBoard title="Example Output"
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to /home/ubuntu/output/content-bundle/example-bundle.tar.zst
```

### Copy

Use the `copy` subcommand to copy a content bundle from one repository to another, either locally or remotely.

```shell
palette content copy [flags]
```

The following flags are supported by the `copy` subcommand.

| Short Flag | Long Flag               | Description                                                                                                                                                                                                                                                     | Type    |
| ---------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
|            | `--annotation-selector` | Filters artifacts based on key-value pairs. The default value is `[]`.                                                                                                                                                                                          | string  |
| `-a`       | `--arch`                | The architecture of the bundle to be copied.                                                                                                                                                                                                                    | string  |
|            | `--ca-cert`             | The path to the CA certificate file.                                                                                                                                                                                                                            | string  |
| `-d`       | `--destination`         | The destination repository address. If the repository is remote, use a standard address format (for example, `example.com/bundle/example-bundle.tar.zst`). For local repositories, use the URI (Uniform Resource Identifier) format (`file:///path/to/bundle`). | string  |
| `-h`       | `--help`                | Help for the `copy` subcommand.                                                                                                                                                                                                                                 | -       |
| `-i`       | `--insecure`            | Skips Transport Layer Security (TLS) verification (bypasses x509 verification).                                                                                                                                                                                 | boolean |
|            | `--progress`            | Displays the progress of the copy operation.                                                                                                                                                                                                                    | boolean |
| `-s`       | `--source`              | The source repository address. Specify a remote repository using the standard address format (for example, `example.com/bundle/example-bundle.tar.zst`), or use the URI format (`file:///path/to/bundle`) for local repositories.                               | string  |
|            | `--tls-cert`            | The path to the TLS certificate file.                                                                                                                                                                                                                           | string  |
|            | `--tls-key`             | The path to the TLS key file.                                                                                                                                                                                                                                   | string  |

#### Example

The following command copies the `example-bundle.tar.zst` bundle from the `home/ubuntu/copy/` local repository to the
`home/ubuntu/paste/` repository.

```shell
palette content copy --source file:///home/ubuntu/copy/example-bundle.tar.zst --destination file:///home/ubuntu/paste
```

```text hideClipboard title="Example Output"
-----------------------------
Copy Summary
-----------------------------
bundle /home/ubuntu/copy/tmp/bundle-extract/example-bundle.tar copied to /home/ubuntu/paste
```

### Definition

Use the `definition` subcommand to retrieve the definition of a content bundle.

```shell
palette content definition [path] [flags]
```

The following flags are supported by the `definition` subcommand.

| Short Flag | Long Flag    | Description                                                                     | Type    |
| ---------- | ------------ | ------------------------------------------------------------------------------- | ------- |
| `-a`       | `--arch`     | The architecture of the content bundle.                                         | string  |
|            | `--ca-cert`  | The path to the CA certificate file.                                            | string  |
| `-h`       | `--help`     | Help for the `definition` subcommand.                                           | -       |
| `-i`       | `--insecure` | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
|            | `--progress` | Displays the command progress.                                                  | boolean |
|            | `--tls-cert` | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`  | The path to the TLS key file.                                                   | string  |

#### Example

The following example prints the bundle definition of the content bundle located in `output/bundle-definition.yaml`.

```shell
palette content definition output/bundle-definition.yaml
```

### List

Use the `list` subcommand to get a list of available content bundles in the specified remote repository.

```shell
palette content list [flags]
```

The following flags are supported by the `list` subcommand.

| Short Flag | Long Flag    | Description                                                                     | Type    |
| ---------- | ------------ | ------------------------------------------------------------------------------- | ------- |
| `-a`       | `--arch`     | The architecture of the content bundle.                                         | string  |
|            | `--ca-cert`  | The path to the CA certificate file.                                            | string  |
| `-h`       | `--help`     | Help for the `list` subcommand.                                                 | -       |
| `-i`       | `--insecure` | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
|            | `--progress` | Displays the command progress.                                                  | boolean |
| `-r`       | `--repo`     | The remote repository from which to list bundles.                               | string  |
|            | `--tls-cert` | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`  | The path to the TLS key file.                                                   | string  |

#### Example

The following example command lists the content bundles in the `docs` repository.

```shell
palette content list --repo example.com/docs/bundle-definition
```

```text hideClipboard title="Example Output"
Listing bundles
example.com/docs/bundle-definition:bundle-123456acbdecaec2e
```

### Push

Use the `push` subcommand to push a content bundle to an OCI registry. Refer to the
[Upload Cluster Images to Registry with the CLI](../../../clusters/edge/site-deployment/deploy-custom-registries/upload-images-to-registry.md)
guide for more information on how to push content bundles to external registries.

```shell
palette content push [flags]
```

The following flags are supported by the `push` subcommand.

| Short Flag | Long Flag               | Description                                                                     | Type    |
| ---------- | ----------------------- | ------------------------------------------------------------------------------- | ------- |
|            | `--annotation-selector` | Filters artifacts based on key-value pairs. The default value is `[]`.          | string  |
| `-a`       | `--arch`                | The architecture of the bundle to be pushed.                                    | string  |
|            | `--ca-cert`             | The path to the CA certificate file.                                            | string  |
| `-f`       | `--file`                | The file path of the content bundle.                                            | string  |
| `-h`       | `--help`                | Help for the `push` subcommand.                                                 | -       |
| `-i`       | `--insecure`            | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
|            | `--progress`            | Displays the command progress.                                                  | boolean |
| `-r`       | `--registry`            | The address of the registry to push the bundle to.                              | string  |
|            | `--tls-cert`            | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`             | The path to the TLS key file.                                                   | string  |

#### Example

The following example pushes the bundle named `example-bundle.tar.zst` to the `example.com/bundle` registry.

```shell
palette content push --file example-bundle.tar.zst --registry example.com/bundle
```

```text hideClipboard title="Example Output"
-----------------------------
Push Summary
-----------------------------
local bundle example-bundle pushed to example.com/bundle
```

### Registry-login

Use the `registry-login` subcommand to login to a private OCI registry using the provided credentials.

```shell
palette content registry-login [flags]
```

The following flags are supported by the `registry-login` subcommand.

| Short Flag | Long Flag    | Description                                                                     | Type    |
| ---------- | ------------ | ------------------------------------------------------------------------------- | ------- |
| `-a`       | `--arch`     | The architecture of the bundle to be pushed.                                    | string  |
|            | `--ca-cert`  | The path to the CA certificate file.                                            | string  |
| `-h`       | `--help`     | Help for the `registry-login` subcommand.                                       | -       |
| `-i`       | `--insecure` | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
| `-p`       | `--password` | The password for the registry.                                                  | string  |
|            | `--progress` | Displays the command progress.                                                  | boolean |
| `-r`       | `--registry` | The registry to log into.                                                       | string  |
|            | `--tls-cert` | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`  | The path to the TLS key file.                                                   | string  |
| `-u`       | `--username` | The username for the registry.                                                  | string  |

#### Example

The following example logs into the `example.com` registry with the `docs` username and password.

```shell
palette content registry-login --registry example.com --username docs --password ********
```

### Save

Use the `save` subcommand to save a content bundle from an OCI registry locally.

```shell
palette content save [flags]
```

The following flags are supported by the `save` subcommand.

| Short Flag | Long Flag             | Description                                                                     | Type    |
| ---------- | --------------------- | ------------------------------------------------------------------------------- | ------- |
| `-a`       | `--arch`              | The architecture of the bundle to be saved.                                     | string  |
|            | `--ca-cert`           | The path to the CA certificate file.                                            | string  |
|            | `--compression-level` | The compression level for the archive file. The default value is `3`.           | integer |
|            | `--definition-only`   | Save only the bundle definition.                                                | boolean |
| `-h`       | `--help`              | Help for the `save` subcommand.                                                 | -       |
| `-i`       | `--insecure`          | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
| `-o`       | `--output`            | The output directory where the bundle will be saved.                            | string  |
|            | `--progress`          | Displays the command progress.                                                  | boolean |
| `-s`       | `--source`            | The source registry address.                                                    | string  |
|            | `--tls-cert`          | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`           | The path to the TLS key file.                                                   | string  |

#### Example

The following example saves the content bundle `example-bundle` from the `example.com/bundle` registry locally in the
`output-example` directory.

```shell
palette content save --source example.com/bundle/bundle-definition:example-bundle --output output-example
```

```text hideClipboard title="Example Output"
-----------------------------
Save Summary
-----------------------------
bundle example.com/bundle/bundle-definition:example-bundle copied to /home/ubuntu/output-example
bundle example.com/bundle/bundle-definition:example-bundle saved to /home/ubuntu/output-example/example-bundle.tar
```

### Serve

Use the `serve` subcommand to serve a content bundle as a registry.

```shell
palette content serve [flags]
```

The following flags are supported by the `serve` subcommand.

| Short Flag | Long Flag    | Description                                                                     | Type    |
| ---------- | ------------ | ------------------------------------------------------------------------------- | ------- |
| `-a`       | `--arch`     | The architecture of the bundle to be served.                                    | string  |
| `-b`       | `--bundle`   | The path to the content bundle.                                                 | string  |
|            | `--ca-cert`  | The path to the CA certificate file.                                            | string  |
| `-d`       | `--disk`     | The path to the registry disk.                                                  | string  |
| `-h`       | `--help`     | Help for the `serve` subcommand.                                                | -       |
|            | `--host`     | The host on which the bundle will be served.                                    | string  |
| `-i`       | `--insecure` | Skips Transport Layer Security (TLS) verification (bypasses x509 verification). | boolean |
| `-p`       | `--port`     | The port to serve the bundle on. The default port is `8080`.                    | string  |
|            | `--progress` | Displays the command progress.                                                  | boolean |
|            | `--tls-cert` | The path to the TLS certificate file.                                           | string  |
|            | `--tls-key`  | The path to the TLS key file.                                                   | string  |

#### Example

The following example serves the `output/example-bundle.tar.zst` content bundle as a registry locally on port `5000`.

```shell
palette content serve --port 5000 --bundle output/example-bundle.tar.zst --disk disk-example
```

```text hideClipboard title="Example Output"
-----------------------------
Push Summary
-----------------------------
local bundle example-bundle pushed to :5000/bundle
```

:::tip

You can use the [ORAS CLI](https://oras.land) tool to confirm that the content bundle is being served correctly. For
example, the command `oras repo list --plain-http localhost:5000/bundle` should list all repositories available in the
bundle. Replace `localhost` with the host's address if you are hosting the registry externally.

:::

### Upload

Use the `upload` subcommand to upload a content bundle to an Edge host. Refer to the
[Upload Content Bundle](../../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) for additional
information on how to upload content bundles to Edge hosts.

```shell
palette content upload [flags] [host]
```

The following flags are supported by the `upload` subcommand.

| Short Flag | Long Flag          | Description                                                                                                                                                          | Type   |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
|            | `--cluster-export` | The cluster definition `.tgz` file to be uploaded. You can only upload a cluster definition if a content bundle is not being uploaded in the same command execution. | string |
| `-f`       | `--file`           | The file path of the content bundle to be uploaded.                                                                                                                  | string |
| `-h`       | `--help`           | Help for the `upload` subcommand.                                                                                                                                    | -      |
| `-p`       | `--port`           | The Edge host target port. The default port is `5082`.                                                                                                               | string |
|            | `--token`          | The authentication token used to validate the client. The token is located on the Edge host at `/opt/spectrocloud/.upload-auth-token`.                               | string |

#### Example

The following example uploads the `example-bundle.tar.zst` content bundle to the Edge host at IP address `10.45.67.89`.
If the content bundle contains an embedded cluster definition, this definition will also be automatically uploaded to
Local UI.

```shell
palette content upload --file output/example-bundle.tar.zst --token ABC1234566b31221do 10.45.67.89
```

```text hideClipboard title="Example Output"
uploading file example-bundle.tar.zst to appliance
4.97 GiB / 4.97 GiB [=============================================================] 100.00%
response: Uploaded content successfully
```

After the upload, the content bundle can be viewed in [Local UI](../../../clusters/edge/local-ui/local-ui.md) under the
**Content** section.

:::warning

The content bundle must have a unique name. This can be specified using the `--name` flag with the `content build`
command. If a unique name is not provided, the `build` command generates a default name in the `<bundle>-<project-id>`
format, which is not unique and may lead to issues, as bundles using the same default name can be overwritten during
upload to Local UI.

:::
