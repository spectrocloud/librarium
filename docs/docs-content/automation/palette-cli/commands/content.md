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
cluster profiles in Palette and use the definition to provision an Edge cluster.

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

### Build

Use the `build` subcommand to create a content bundle or export a cluster definition.

```shell
palette content build [flags]
```

The following flags are supported by the `build` subcommand.

| Short Flag | Long Flag                            | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Type    |
| ---------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
|            | `--application-release-name`         | The name of the application release to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                                           | string  |
|            | `--application-release-notes`        | The release notes for the application to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                                         | string  |
|            | `--application-release-version`      | The version of the application release to be added as metadata to the bundle definition.                                                                                                                                                                                                                                                                                                                        | string  |
| `-a`       | `--arch`                             | The architecture of the bundle to be built. The available options are `amd64` and `arm64`.                                                                                                                                                                                                                                                                                                                      | string  |
|            | `--build-type`                       | The type of build. The available options are `local`, where the build is performed locally, and `remote`, where the build is performed directly on the registry. The default value is `local`. To enable remote builds, you must also specify the registry address using the `--registry` flag.                                                                                                                 | string  |
|            | `--ca-cert`                          | The path to the CA certificate file.                                                                                                                                                                                                                                                                                                                                                                            | string  |
|            | `--cluster-definition-name`          | The filename of the cluster definition `.tgz` file.                                                                                                                                                                                                                                                                                                                                                             | string  |
|            | `--cluster-definition-profile-ids`   | A comma-separated list of cluster profile IDs to be included in the cluster definition.                                                                                                                                                                                                                                                                                                                         | string  |
|            | `--compression-level`                | The compression level for the archive file. The default value is `3`.                                                                                                                                                                                                                                                                                                                                           | integer |
|            | `--download-cluster-config-only`     | If enabled, only the cluster configuration will be downloaded.                                                                                                                                                                                                                                                                                                                                                  | boolean |
| `-k`       | `--encryption-passphrase`            | The encryption passphrase used to secure sensitive data.                                                                                                                                                                                                                                                                                                                                                        | string  |
|            | `--fips`                             | If enabled, the bundle will include only FIPS service images.                                                                                                                                                                                                                                                                                                                                                   | boolean |
| `-h`       | `--help`                             | Help for the `build` subcommand.                                                                                                                                                                                                                                                                                                                                                                                | -       |
|            | `--include-all-palette-images`       | Whether to include images for the Palette agent itself, including images to support cluster creation and management. The default value is `true`. For airgap installations, you must use either this option or the `--include-core-palette-images-only` option. We recommend that you use `--include-core-palette-images-only` to reduce the size of the content bundle.                                        | boolean |
|            | `--include-core-palette-images-only` | Whether to include images for the Palette agent that are necessary for cluster creation only. For airgap installations, we recommend using this option instead of `--include-all-palette-images` to reduce the size of the content bundle. The default value is `false`. To enable this parameter, you must include the flag `--include-core-palette-images-only` and set `--include-all-palette-images=false`. | boolean |
|            | `--include-service-images`           | Wether to include Palette service images. The default value is `true`.                                                                                                                                                                                                                                                                                                                                          | boolean |
| `-i`       | `--insecure`                         | Skips Transport Layer Security (TLS) verification (bypasses x509 verification).                                                                                                                                                                                                                                                                                                                                 | boolean |
|            | `--metadata-file`                    | The filepath for the content bundle metadata.                                                                                                                                                                                                                                                                                                                                                                   | string  |
|            | `--metadata-only`                    | If enabled, only the bundle definition metadata is generated.                                                                                                                                                                                                                                                                                                                                                   | boolean |
| `-n`       | `--name`                             | The name of the content bundle.                                                                                                                                                                                                                                                                                                                                                                                 | string  |
| `-o`       | `--output`                           | The output directory where the bundle will be saved.                                                                                                                                                                                                                                                                                                                                                            | string  |
|            | `--packs`                            | Comma-separated list of local paths to the pack `tar.gz` archive or directory files to include in the bundle.                                                                                                                                                                                                                                                                                                   | string  |
|            | `--private-key`                      | The path to the private key used to sign the content bundle and cluster definition if it is present. This is required if your Edge host has an embedded corresponding public key. For more information, refer to [Embed Public Key in Edge Artifacts](../../../clusters/edge/edgeforge-workflow/palette-canvos/signed-content.md).                                                                              | string  |
|            | `--profiles`                         | Comma-separated list of cluster profile IDs to download content for. Ensure that between all the profiles you include in the content bundle, only one infrastructure layer exists. For example, you can have one infrastructure profile and many add-on files, or one full profile and many add-on files, but you cannot have multiple infrastructure and full profiles.                                        | string  |
|            | `--progress`                         | Displays the build progress output.                                                                                                                                                                                                                                                                                                                                                                             | boolean |
|            | `--project-id`                       | The ID of the Palette project.                                                                                                                                                                                                                                                                                                                                                                                  | string  |
| `-p`       | `--push`                             | Pushes the content bundle to the OCI registry after creation. This applies only if the build type is set to `local`. The default value is `false`.                                                                                                                                                                                                                                                              | boolean |
| `-r`       | `--registry`                         | The address of the OCI registry to push the images to. Applies if `--push` is set to `true`.                                                                                                                                                                                                                                                                                                                    | string  |
|            | `--tls-cert`                         | The path to the TLS certificate file.                                                                                                                                                                                                                                                                                                                                                                           | string  |
|            | `--tls-key`                          | The path to the TLS key file.                                                                                                                                                                                                                                                                                                                                                                                   | string  |

#### Examples

The following example creates a content bundle named `example-bundle`.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929  --output ./output --name example-bundle
```

The output confirm that the bundle was built successfully.

```text hideClipBoard
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to output/example-bundle.tar.zst
```

The following example creates a content bundle named `example-bundle` and a cluster definition named
`example-definition`.

```shell
palette content build --arch amd64 --profiles 12345678910 --project-id 1617181929 --cluster-definition-name example-definition --cluster-definition-profile-ids 12345678910 --output ./output --name example-bundle
```

```text hideClipBoard
-----------------------------
Build Summary
-----------------------------
bundle example-bundle saved to output/example-bundle.tar.zst
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

The following command copies the `example-bundle` bundle from the `home/ubuntu/copy/` local repository to the
`home/ubuntu/paste/` repository.

```shell
palette content copy --source file:///home/ubuntu/copy/example-bundle.tar.zst --destination file:///home/ubuntu/paste
```

```text hideClipboard
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

The following example command lists the content bundles in the `bundle` repository.

```shell
palette content list --repo example.com/docs/bundle-definition
```

```text hideClipboard
Listing bundles
example.com/docs/bundle-definition:bundle-123456acbdecaec2e
```

### Push

Use the `push` subcommand to push the content bundle to an OCI registry.

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

```text hideClipboard
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

```text hideClipboard
-----------------------------
Save Summary
-----------------------------
bundle example.com/bundle/bundle-definition:example-bundle copied to /home/ubuntu/output-example
bundle example.com/bundle/bundle-definition:example-bundle saved to /home/ubuntu/output-example/example-bundle.tar
```

### Serve

Use the `serve` subcommand to serve the content bundle as a registry.

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

The following example serves the `output/example-bundle` content bundle as a registry locally on port `5000`.

```shell
palette content serve --port 5000 --bundle output/example-bundle.tar.zst --disk disk-example
```

```text hideClipboard
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
