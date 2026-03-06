---
sidebar_label: "Build Content Bundle"
title: "Build Content Bundle"
description:
  "Get started with Kubernetes at the edge. Learn how to build the artifacts required for your locally managed Edge
  deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["getting-started", "tutorial", "locally-managed", "airgap", "edge"]
---

[Cluster profiles](../../../../profiles/profiles.md) are declarative, full-stack models that Palette uses to provision,
scale, and maintain Kubernetes clusters. They are composed of layers, which can be Kubernetes manifests, Helm charts, or
packs. [Packs](../../../../registries-and-packs/registries-and-packs.md) are a collection of files and configurations
deployed to a cluster to provide core infrastructure functionality or customize the cluster's behavior through add-on
integrations. With centrally managed Edge, these are automatically provisioned when the Edge device is connected. With locally managed Edge, the cluster profile needs to be exported from Palette as a [Content Bundle](../../../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md#create-content-bundle), and upload the bundle to the Edge device. 

This tutorial teaches you how to export the cluster profile you created in the [Deploy Edge Cluster](./deploy-edge-cluster.md) tutorial using either the [Palette CLI](../../../../downloads/cli-tools.md#palette-cli) or [Palette Edge CLI](../../../../downloads/cli-tools.md#palette-edge-cli).  


![Palette Edge architecture diagram](../../../../../../static/assets/docs/images/tutorials/local-edge/local-edge_content-bundle_content-bundle-architecture-diagram_4-8.webp)

## Prerequisites

- You have completed the steps in the [Deploy Edge Cluster](./deploy-edge-cluster.md), and [Prepare Edge Host](./prepare-edge-host.md) tutorials.
- A [Palette account](https://www.spectrocloud.com/get-started).
- A valid Palette [API Key](../../../../user-management/authentication/api-key/create-api-key.md).
- The [Project ID](../../../../tenant-settings/projects/projects.md#project-id) where you created your cluster profile.
- The [Cluster Profile ID](../../../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md#enablement-1).

### Export and Download Cluster Profile

With the cluster profile created, you will need to export it as a compressed `.tgz` file. You will need to download either the
[Palette CLI](../../../../downloads/cli-tools.md#palette-cli) or [Palette Edge CLI](../../../../downloads/cli-tools.md#palette-edge-cli) to your Linux machine.

<!-- vale off -->

**Palette CLI**
```shell
VERSION=<palette-edge-cli-version>
wget https://software.spectrocloud.com/palette-cli/v$VERSION/cli/linux/palette
chmod +x palette-edge
```

**Palette Edge CLI**
```shell
VERSION=<palette-edge-cli-version>
wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
chmod +x palette-edge
```

<Tabs groupId="cli-options">

<TabItem label="Palette CLI" value="Palette CLI">

You will use the Palette CLI tool to authenticate against Palette, and download a specific cluster profile from a
specific project. 

Use the following Palette Edge ClI to generate the cluster profile compressed `.tgz` file.

```shell
./palette content build --arch <bundle-architecture> \
--project-id <project-id> \
--profiles <cluster-profile-id1,cluster-profile-id2...> \
--cluster-definition-name <cluster-definition-name> \
--cluster-definition-profile-ids <cluster-definition-profile-ids> \
--name <bundle-name>
```

<!-- vale on -->

Alternatively, you can use the script below to prompt you when doing the Palette Edge CLI command. The API key will
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
file.

```shell

scp <username>@<ip-of-linux-system>:/path/to/<filename>.tgz .

```

## Next Steps

In this tutorial, you learned how to install the Palette agent on your host and register the host with Palette. We
recommend proceeding to the [Deploy Cluster](./deploy-edge-cluster.md) tutorial to learn how to build the cluster
content bundle to use on the locally managed Edge device.