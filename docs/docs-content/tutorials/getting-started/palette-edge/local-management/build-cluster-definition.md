---
sidebar_label: "Build Cluster Definition"
title: "Build Cluster Definition"
description:
  "Get started with Kubernetes at the edge. Learn how to build the artifacts required for your locally managed Edge
  deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["getting-started", "tutorial", "locally-managed", "edge"]
---

With locally managed Edge, you must export the [cluster profile](../../../../profiles/profiles.md) from Palette as a [Cluster Definition](../../../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) and upload it to the Edge device. A Cluster Definition contains one or more cluster profiles, including their profile variables.

A [Content Bundle](../../../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) is an archive that includes all required container images for one or more profiles. It contains the Helm charts, Packs, and manifest files needed to deploy your Edge host cluster. In addition to core container images, the Content Bundle can also include application artifacts that you want to deploy to the Edge cluster.

This tutorial teaches you how to create the content bundle you created in the [Deploy Edge Cluster](./deploy-edge-cluster.md) tutorial using either the [Palette CLI](../../../../downloads/cli-tools.md#palette-cli) or [Palette Edge CLI](../../../../downloads/cli-tools.md#palette-edge-cli).  

![Palette Edge architecture diagram](../../../../../../static/assets/docs/images/tutorials/local-edge/local-edge_content-bundle_content-bundle-architecture-diagram_4-8.webp)

## Prerequisites

- You have completed the steps in the [Deploy Edge Cluster](./deploy-edge-cluster.md), and [Prepare Edge Host](./prepare-edge-host.md) tutorials.
- A [Palette account](https://www.spectrocloud.com/get-started).
- A valid Palette [API Key](../../../../user-management/authentication/api-key/create-api-key.md).
- The [Project ID](../../../../tenant-settings/projects/projects.md#project-id) where you created your cluster profile.
- The [Cluster Profile ID](../../../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md#enablement-1).
- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture. You can issue the
  following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

### Export and Download Cluster Profile


<Tabs groupId="cli-options">

<TabItem label="Palette CLI" value="Palette CLI">

With the cluster profile created, you will need to export it as a compressed `.tgz` file. You will need to download 
[Palette CLI](../../../../downloads/cli-tools.md#palette-cli) to your Linux machine. For this tutorial, you will use version 4.8.7.

<!-- vale off -->

```shell
wget https://software.spectrocloud.com/palette-cli/v4.8.7/cli/linux/palette
chmod +x palette-edge
```

Use the Palette CLI tool to authenticate against Palette, and download a specific cluster profile from a
specific project. The output will be found in `<current-directory>/output/content-bundle` folder. The following table identifies the specific commands and subcommands that will be used, and identifies the information required. 

| **Option**                         | **Definition** |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `content`                          | Creates and manages content bundles, which are archives containing all the images and artifacts required for deploying an Edge cluster. |
| `build`                            | Build a content bundle. |
| `--arch`                           | The architecture of the bundle to be built. The available options are `amd64` and `arm64`.
| `--api-key`                        | Palette API key. Omit for interactive login. |
| `--project-id`                     | The ID of the Palette project. |
| `--cluster-profile-ids`            | The ID of the cluster profile in Palette.|
| `--cluster-definition-name`        | The filename of the cluster definition .tgz file. |
| `--cluster-definition-profile-ids` | A comma-separated list of cluster profile IDs to be included in the cluster definition. For this tutorial, only one cluster profile ID is needed. |
| `--name`                           | The name of the content bundle. This is required to generate bundles with unique names. If not provided, the command generates a default name in the `<bundle>-<project-id>` format, which is not unique and may lead to issues, as bundles using the same default name can be overwritten during upload to Local UI. |

For the tutorial, you will use the following Palette CLI command to generate the cluster profile compressed `.tgz` file.

```shell
./palette content build --arch <bundle-architecture> \
--project-id <project-id> \
--profiles <cluster-profile-id1,cluster-profile-id2...> \
--cluster-definition-name <cluster-definition-name> \
--cluster-definition-profile-ids <cluster-definition-profile-ids> \
--name <bundle-name>
```

<!-- vale on -->

Alternatively, you can use the interactive script below to prompt you when doing the Palette CLI command for the values. The API key will
appear blank for security reasons.

<!-- vale off -->
```shell
#!/usr/bin/env bash
set -euo pipefail

# --- Inputs ---
read -rsp "Enter Palette API key: " apikey
echo
read -rp "Enter Palette Project UID: " projectuid
read -rp "Enter Cluster Profile UID(s) (comma-separated if multiple): " profileuids
read -rp "Palette console URL [https://console.spectrocloud.com]: " console_url
read -rp "Enter custom tag (used for naming): " custom_tag
read -rsp "Enter Palette CLI encryption passphrase: " enc_pass
echo

# Default console URL
console_url=${console_url:-https://console.spectrocloud.com}

bundle_name="${custom_tag}-content-bundle"
definition_name="${custom_tag}-cluster-definition"

echo
echo "Logging into Palette CLI..."
palette login \
  --api-key "${apikey}" \
  --console-url "${console_url}" \
  --encryption-passphrase "${enc_pass}"

echo
echo "Building content bundle..."
echo "  Cluster definition: ${definition_name}"
echo "  Bundle name:        ${bundle_name}"
echo

palette content build \
  --arch amd64 \
  --project-id "${projectuid}" \
  --profiles "${profileuids}" \
  --cluster-definition-name "${definition_name}" \
  --cluster-definition-profile-ids "${profileuids}" \
  --name "${bundle_name}" \
  --include-core-palette-images-only \
  --progress

bundle_path="./output/content-bundle/${bundle_name}.tar.zst"

echo
echo "Done ✅"
echo
echo "Content bundle created:"
echo "  ${bundle_path}"
echo
echo "Transfer this file to the airgapped Edge device and upload it via:"
echo "  - Local UI"
echo "  - or: palette content upload (from a reachable system)"
echo
```
<!-- vale on -->

</TabItem>

<TabItem label="Palette Edge CLI" value="Palette Edge CLI">
With the cluster profile created, you will need to export it as a compressed `.tgz` file. You will need to download either the [Palette Edge CLI](../../../../downloads/cli-tools.md#palette-edge-cli) to your Linux machine. For this tutorial, you will use Palette CLI version 4.8.8.

<!-- vale off -->

```shell
wget https://software.spectrocloud.com/stylus/v4.8.8/cli/linux/palette-edge
chmod +x palette-edge
```

Use the Palette Edge CLI tool to authenticate against Palette, and download a specific cluster profile from a
specific project. The output will be found in `<current-directory>`. The following table identifies the specific commands and subcommands that will be used, and identifies the information required. 

| **Option**                         | **Definition** |
|------------------------------------|-----------------------------------------------|
| `build`                            | Build a content bundle. |
| `--api-key`                        | Palette API key. Omit for interactive login. |
| `--project-id`                     | The ID of the Palette project. |
| `--cluster-profile-ids`            | The ID of the cluster profile in Palette.|
| `--cluster-definition-name`        | The filename of the cluster definition .tgz file. |
| `--palette-endpoint`               | The url for palette-endpoint. The format should be `https://<palette-address>/api` |
| `--cluster-definition-profile-ids` |The cluster profile ID to be included in the cluster definition. |
| `--outfile`                        | The name of the content bundle. This is required to generate bundles with unique names. If not provided, the command generates a default name in the `<bundle>-<project-id>` format, which is not unique and may lead to issues, as bundles using the same default name can be overwritten during upload to Local UI. |
| `--include-palette-content`        | This will ensure that preloaded Palette components are included. |

For the tutorial, you will use the following Palette CLI command to generate the cluster profile compressed `.tgz` file.

```shell
./palette-edge build \
  --api-key <apikey> \
  --project-id <projectuid> \
  --cluster-profile-ids <profileuid> \
  --cluster-definition-profile-ids <profileuid> \
  --palette-endpoint <apiendpoint> \
  --cluster-definition-name <cluster-definition> \
  --outfile <content-bundle> \
  --include-palette-content

```

Alternatively, you can use the script below to prompt you when doing the Palette Edge CLI command. The API key will
appear blank for security reasons.

<!-- vale off -->
```shell
#!/usr/bin/env bash

set -euo pipefail

# Prompt for variables
read -rsp "Enter API key: " apikey #hide the API when entered in
echo
read -rp "Enter Project UID: " projectuid
read -rp "Enter Profile UID: " profileuid
read -rp "Palette API endpoint [https://api.spectrocloud.com]: " apiendpoint
read -rp "Enter custom tag (used for naming): " custom_tag

# Default endpoint if empty
apiendpoint=${apiendpoint:-https://api.spectrocloud.com}

echo
echo "Building content bundle..."
echo "  Cluster definition: ${custom_tag}-cluster-definition"
echo "  Output file:        ${custom_tag}-content-bundle"
echo

./palette-edge build \
  --api-key "$apikey" \
  --project-id "$projectuid" \
  --cluster-profile-ids "$profileuid" \
  --cluster-definition-profile-ids "$profileuid" \
  --palette-endpoint "$apiendpoint" \
  --cluster-definition-name "${custom_tag}-cluster-definition" \
  --outfile "${custom_tag}-content-bundle" \
  --include-palette-content

echo
echo "Done ✅"
```
<!-- vale on -->

</TabItem>

</Tabs>

The `.tgz` file will need to be uploaded to the locally managed Edge device after it is built using the Edge UI. If you
are using a browser on a system other than your Linux system to access the Edge UI, you will need to download the `.tgz`
file. As an example, you can use `scp` to connect to a remote connection, and download the `tgz` file to `<current-directory>`.

```shell

scp <username>@<ip-of-linux-system>:/path/to/<filename>.tgz .

```

## Next Steps

In this tutorial, you learned how create and download a cluster definition to be used on your Edge device. We
recommend proceeding to the [Deploy Cluster](./deploy-edge-cluster.md) tutorial to learn how to deploy the cluster on the locally managed Edge device.