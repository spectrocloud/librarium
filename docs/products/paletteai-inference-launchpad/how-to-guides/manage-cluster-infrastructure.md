---
sidebar_label: "Manage Cluster Infrastructure"
title: "Manage Cluster Infrastructure"
description:
  "How platform operators create, scale, and upgrade a PaletteAI Inference Launchpad cluster from Local UI, including
  uploading a new content bundle so the cluster Update action becomes available."
hide_table_of_contents: false
sidebar_position: 0.5
tags: ["paletteai-inference-launchpad", "install", "upgrade", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "upgrade",
    "local ui",
    "content bundle",
    "scale",
    "cluster",
    "day two",
    "artifact studio",
  ]
---

Day-one install and day-two cluster operations for PaletteAI Inference Launchpad use the node's
[Local UI](../reference/glossary.md#local-ui), the same Edge Local UI that creates, scales, and updates a locally
managed cluster. This page points to those Local UI guides and adds the Launchpad-specific upgrade path: download a new
content bundle from Artifact Studio, upload it the same way as day one, then apply **Update** on the cluster
**Configuration** tab.

For first-time install, including the Palette TUI, bond, storage, and first cluster deploy, refer to
[Install the Appliance](./install-the-appliance.md). For why install is split across the jumpbox and Local UI, refer to
[Installation Architecture](../explanation/installation-architecture.md).

## Access Local UI

Open Local UI at `https://<node-ip>:5080` on the leader node. For sign-in and credentials, refer to
[Access Local UI](/clusters/edge/local-ui/host-management/access-console/).

The appliance console that serves models is a different UI, reached after the cluster is running. Cluster create, scale,
content upload, and platform upgrade stay in Local UI.

## Create the Cluster

Creating the cluster is part of day-one install. Follow
[Deploy the Cluster](./install-the-appliance.md#deploy-the-cluster) in the install guide. The same Local UI wizard is
documented for Edge in [Create Local Cluster](/clusters/edge/local-ui/cluster-management/create-cluster/).

## Upload a Content Bundle

A [content bundle](../reference/glossary.md#content-bundle) is the platform and application layers. You upload one during
install, and you upload a newer one to upgrade. On a multi-node cluster, upload on the leader; content synchronizes to
linked hosts.

Use the Palette CLI from the jumpbox. The bundle is more than 20 GB, so a browser upload is slow and can time out. The
Launchpad install guide has the CLI steps, including the upload token and target port `5082`. Refer to
[Upload with the Palette CLI](./install-the-appliance.md#upload-with-the-palette-cli-recommended).

The Edge Local UI procedure is in
[Upload Content Bundle](/clusters/edge/local-ui/cluster-management/upload-content-bundle/).

## Scale the Cluster

To add or remove nodes, use Local UI on the leader. Link each new host before you add it to a pool. Refer to
[Link Hosts](/clusters/edge/local-ui/cluster-management/link-hosts/) and
[Scale a Cluster](/clusters/edge/local-ui/cluster-management/scale-cluster/).

## Upgrade the Platform

An upgrade replaces the cluster's platform packs with the versions in a newer content bundle. It is not a reinstall of
the OS, and you do not redeploy the cluster. The appliance is airgapped, so the bundle is the upgrade payload for both
connected jumpbox workflows and airgapped sites. Download the bundle that matches the node's GPU, NVIDIA or AMD.

1. Download the new content bundle from Artifact Studio. It must match the hardware GPU, as described in
   [Download the Artifacts](./install-the-appliance.md#download-the-artifacts).

2. Upload the bundle to the leader, the same way as day one. Refer to
   [Upload the Content Bundle](./install-the-appliance.md#upload-the-content-bundle).

3. In Local UI, open **Cluster**. The **Overview** tab shows **Update available** when the bundle includes a newer
   cluster definition. The **Configuration** tab shows **Update**.

4. Select **Update**, review the configuration diff, then select **Update** at the bottom of the page to apply.

The review-and-apply steps, including profile variables and **Use default**, are in
[Update Local Cluster](/clusters/edge/local-ui/cluster-management/update-cluster/).

After the cluster returns to **Running**, open the appliance console and confirm that models are still serving. You do
not re-upload model weights unless the release notes for that version say to.

## Next Steps

- [Install the Appliance](./install-the-appliance.md)
- [Deploy a Model](./deploy-a-model.md)
- [Local UI](/clusters/edge/local-ui/)
