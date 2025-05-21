---
sidebar_label: "Upload Content Bundle"
title: "Upload Content Bundle"
description: "Instructions for building and uploading content to Edge hosts."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

You can build a content bundle and upload it to a locally managed Edge host through Local UI. The content you upload can
include images, helm charts, and packs. This allows you to provision clusters locally using the content you upload to
the Edge host when the host does not have a connection to a central Palette instance or an image repository. You can
upload one or more content bundles as long as your Edge host has enough physical storage and you have allocated
sufficient storage to your registry.

If you upload a content bundle to the leader node of a group of linked hosts, the content bundle will be synced to the
rest of the group of linked hosts.

This page guides you through how to upload a content bundle to an Edge host using either Local UI or the Palette CLI.

## Upload Content Bundle with Local UI

### Prerequisites

- An Edge host with installed with Edge Installer 4.3 or later using the local management mode.

- You have built a content bundle that's necessary for provisioning a cluster using your intended cluster profile. For
  more information, refer to [Build Content Bundles](../../edgeforge-workflow/palette-canvos/build-content-bundle.md).

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

### Upload Content

1. Log in to [Local UI](../host-management/access-console.md#log-in-to-local-ui).

2. From the left main menu, click **Content**.

3. Under the upper-right user menu, Click **Actions** > **Upload Content**.

4. Select your content bundle to upload it to your Edge host.

### Validate

1. After the upload is complete, click **Content** on the left main menu and confirm the images in your content bundle
   are present in the Edge host.

## Upload Content Bundle with Palette CLI

### Prerequisites

- An Edge host with SSH access.

- A Linux machine (physical or VM) with an AMD64 architecture and network access to the Edge host.

- You have built a content bundle using your intended cluster profile. For more information, refer to
  [Build Content Bundles](../../edgeforge-workflow/palette-canvos/build-content-bundle.md). The content bundle must be
  available in your Linux machine.

  :::warning

  The content bundle must have a unique name. This can be specified using the `--name` flag with the
  [`content build`](../../../../automation/palette-cli/commands/content.md#build) command. If a unique name is not
  provided, the `build` command generates a default name in the `<bundle>-<project-id>` format, which is not unique and
  may lead to issues, as bundles using the same default name can be overwritten during upload to Local UI.

  :::

### Upload Bundle

1. SSH into the Edge host and copy the authentication token located at `/opt/spectrocloud/.upload-auth-token`. This
   token is required to upload the content bundle to the Edge host.

   ```shell
   cat /opt/spectrocloud/.upload-auth-token
   ```

2. Open a terminal window on the Linux machine and download the Palette CLI. Refer to the
   [Palette Components Compatibility Matrix](../../../../downloads/cli-tools.md) to find a compatible CLI version and
   replace `<palette-cli-version>` with the selected version.

   ```shell
   VERSION=<palette-cli-version>
   wget https://software.spectrocloud.com/palette-cli/v$VERSION/linux/cli/palette
   chmod +x palette
   ```

3. Use the following command to move the `palette` binary to the **/usr/local/bin** directory to make the binary
   available in your system $PATH. This allows you to issue the `palette` command from any directory in your development
   environment.

   ```bash
   mv palette /usr/local/bin
   ```

4. Verify that the Palette CLI is part of your system path by issuing the Palette CLI `version` command.

   ```bash
   palette version
   ```

   ```hideClipboard text
   Palette CLI version: [version number]
   ```

5. Issue the following command to upload the content bundle to the Edge host. Replace `<content-bundle-file-path>` with
   the file path of the content bundle, `<edge-host-token>` with the Edge host token, and `<edge-host-ip>` with the IP
   address of your Edge host. If the content bundle contains an embedded cluster definition, this definition will also
   be automatically uploaded to Local UI. Refer to the
   [upload](../../../../automation/palette-cli/commands/content.md#upload) command section for a complete list of
   supported flags and examples.

   ```shell
   palette content upload --file <content-bundle-file-path> --token <edge-host-token> <edge-host-ip>
   ```

### Validate

1. Log in to [Local UI](../host-management/access-console.md#log-in-to-local-ui).

2. From the left main menu, click **Content** and confirm that the uploaded content bundle is listed.
