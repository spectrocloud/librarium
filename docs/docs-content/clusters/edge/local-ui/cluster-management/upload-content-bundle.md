---
sidebar_label: "Upload Content Bundle"
title: "Upload Content Bundle"
description: "Instructions for building and uploading content to Edge hosts."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

You can build a content bundle and upload it to an Edge host through the local UI. The content you upload can include
images, helm charts, and packs. This allows you to provision clusters locally using the content you upload to the Edge
host when the host does not have a connection to a central Palette instance or an image repository.

This page guides you through how to build a content bundle and upload it to an Edge host using the Edge management
console.

:::preview

:::

## Prerequisites

- An Edge host with installed with Edge Installer 4.3 or later using the `airgapped` install mode.

- You have built a content bundle that's necessary for provisioning a cluster using your intended cluster profile. For
  more information, refer to [Build Content Bundles](../../edgeforge-workflow/build-content-bundle.md).

- Network access to the Edge host's port where the local UI is exposed. The default port is 5080.

## Upload Content

1. Log in to the [local UI](../host-management/access-console.md#log-in-to-local-ui).

2. From the left **Main Menu**, click **Content**.

3. Under the upper-right user menu, Click **Actions** > **Upload Content**.

4. Select your content bundle to upload it to your Edge host.

## Validate

1. After the upload is complete, click **Content** on the left **Main Menu** and confirm images in your content bundle
   are present in the Edge host.
