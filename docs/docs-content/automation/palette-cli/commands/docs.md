---
sidebar_label: "Docs"
title: "Docs"
description: "Learn how to enable the Palette documentation site in your local environment for an offline experience."
hide_table_of_contents: false
sidebar_position: 10
tags: ["palette-cli"]
---

The `docs` command starts the Palette documentation site in your local environment for an offline experience. A
[container image](https://github.com/spectrocloud/librarium/pkgs/container/librarium) with the latest documentation
content is downloaded and a local [Caddy](https://caddyserver.com/) server is started to serve the documentation site.
You can access the Palette documentation site at `http://localhost:8080` using your browser.

:::tip

To stop the documentation site, type `Ctrl+C` in the terminal window where you started it.

:::

The `docs` command exposes the following flags.

| **Short Flag** | **Long Flag** | **Description**                                                                                      | **Type** |
| -------------- | ------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| `-d`           | `--detach`    | Start the container in the background and print the container ID.                                    | boolean  |
| `-h`           | `--help`      | Help with any command.                                                                               | N/A      |
|                | `--host`      | The address of the host to expose the container on. The default value is set to `127.0.0.1`          | string   |
|                | `--image`     | The documentation container image to use. Default value is `ghcr.io/spectrocloud/librarium:nightly`. | string   |
|                | `--name`      | The name of the container. Default value is `spectrocloud-docs`.                                     | string   |
|                | `--port`      | The port to expose the container on. The default value is set to `8080`.                             | string   |

### Examples

Start the documentation site in the background.

```bash
palette docs --detach
```

```shell hideClipboard
{"status":"Pulling from spectrocloud/librarium","id":"nightly"}
{"status":"Digest: sha256:754a75fe5b2724ad7fdd42389432fa8f81c2362880c236dabaa29ef6963b7ac6"}
{"status":"Status: Image is up to date for ghcr.io/spectrocloud/librarium:nightly"}
Started ghcr.io/spectrocloud/librarium:nightly at 127.0.0.1:8080
d7c8190bb73f4e96b5275fd0d7e1f27a06b784c881ec9437a233ac0a3a8ca979
```

Start the documentation site in the background and expose it on port `9000`.

```bash
palette docs --detach --port 9000
```

```shell {4} hideClipboard
{"status":"Pulling from spectrocloud/librarium","id":"nightly"}
{"status":"Digest: sha256:754a75fe5b2724ad7fdd42389432fa8f81c2362880c236dabaa29ef6963b7ac6"}
{"status":"Status: Image is up to date for ghcr.io/spectrocloud/librarium:nightly"}
Started ghcr.io/spectrocloud/librarium:nightly at 127.0.0.1:9000
cd9b79f7947b317c76d9517cc5c09ad6e12e7606c08ce24b497e07c7af6775c3
```

Start the documentation site in the background and change the container name.

```bash
palette docs --detach --name palette-offline
```

```shell hideClipboard
{"status":"Pulling from spectrocloud/librarium","id":"nightly"}
{"status":"Digest: sha256:754a75fe5b2724ad7fdd42389432fa8f81c2362880c236dabaa29ef6963b7ac6"}
{"status":"Status: Image is up to date for ghcr.io/spectrocloud/librarium:nightly"}
Started ghcr.io/spectrocloud/librarium:nightly at 127.0.0.1:8080
94928fc8b2dd9118fe66c72dd7e977f1075f85e234a131832f43537d91e27bc3
```

Start the documentation site in the background and change container image to a self-hosted registry. Check put the
[Offline Documentation](../../../vertex/install-palette-vertex/airgap/offline-docs.md) to learn how to extract the
container image into a tarball which you can then load into another device and upload to a self-hosted registry.

```bash
palette docs --detach --name palette-offline --image internal.example.org/spectrocloud/librarium:nightly
```

```shell hideClipboard
{"status":"Pulling from spectrocloud/librarium","id":"nightly"}
{"status":"Digest: sha256:754a75fe5b2724ad7fdd42389432fa8f81c2362880c236dabaa29ef6963b7ac6"}
{"status":"Status: Image is up to date for internal.example.org/spectrocloud/librarium:nightly"}
Started internal.example.org/spectrocloud/librarium:nightly at 127.0.0.1:8080
94928fc8b2dd9118fe66c72dd7e977f1075f85e234a131832f43537d91e27bc3
```
