---
sidebar_label: "Manage Cluster Infrastructure"
title: "Manage Cluster Infrastructure"
description:
  "How platform operators create, scale, and upgrade a PaletteAI Inference Launchpad appliance cluster from Local UI,
  including uploading a new content bundle so the cluster Update action becomes available."
hide_table_of_contents: false
sidebar_position: 0.5
tags: ["paletteai-inference-launchpad", "install", "upgrade", "how-to"]
keywords: ["launchpad", "ai", "upgrade", "local ui", "content bundle", "scale", "cluster", "day two", "artifact studio"]
---

PaletteAI Inference Launchpad is an appliance. Day-one install and day-two infrastructure operations use the node's
[Local UI](../reference/glossary.md#local-ui) at `https://<node-ip>:5080`. Local UI is the Edge host console; this
appliance uses it to create the cluster, upload content, scale nodes, and apply a platform upgrade. It is not the
[appliance console](../reference/glossary.md#appliance-console) that serves models after the cluster is running.

This page covers those appliance infrastructure tasks. The step-by-step Local UI screens for sign-in, content upload,
cluster create, and scale are in the Edge Local UI guides linked below. Platform upgrade for this appliance is described
here: download a new content bundle from Artifact Studio, upload it the same way as day one, then apply **Update** on
the cluster **Configuration** tab.

For first-time install, including the Palette TUI, bond, storage, and first cluster deploy, refer to
[Install the Appliance](./install-the-appliance.md). For why install is split across the jumpbox and Local UI, refer to
[Installation Architecture](../explanation/installation-architecture.md).

## Access Local UI

Open Local UI at `https://<node-ip>:5080` on the leader node. For sign-in and credentials, refer to
[Access Local UI](/clusters/edge/local-ui/host-management/access-console/).

## Create the Cluster

Creating the cluster is part of day-one install. Follow
[Deploy the Cluster](./install-the-appliance.md#deploy-the-cluster) in the install guide. The Local UI cluster wizard is
also described in [Create Local Cluster](/clusters/edge/local-ui/cluster-management/create-cluster/).

## Upload a Content Bundle

A [content bundle](../reference/glossary.md#content-bundle) is the platform and application layers. You upload one
during install, and you upload a newer one to upgrade. On a multi-node cluster, upload on the leader; content
synchronizes to linked hosts.

Use the Palette CLI from the jumpbox. The bundle is more than 20 GB, so a browser upload is slow and can time out. The
install guide has the CLI steps, including the upload token and target port `5082`. Refer to
[Upload with the Palette CLI](./install-the-appliance.md#upload-with-the-palette-cli-recommended).

The Local UI upload screens are in
[Upload Content Bundle](/clusters/edge/local-ui/cluster-management/upload-content-bundle/).

## Scale the Cluster

To add or remove nodes, use Local UI on the leader. Link each new host before you add it to a pool. Refer to
[Link Hosts](/clusters/edge/local-ui/cluster-management/link-hosts/) and
[Scale a Cluster](/clusters/edge/local-ui/cluster-management/scale-cluster/).

## Upgrade the Platform

An upgrade replaces the cluster's platform packs and application charts with the versions in a newer content bundle. It
is not a reinstall of the OS, and you do not redeploy the cluster. The appliance is airgapped, so the content bundle is
the upgrade payload for both connected jumpbox workflows and airgapped sites. Download the bundle that matches the
node's GPU, NVIDIA or AMD.

Before you begin, confirm that you have the following:

- A running PaletteAI Inference Launchpad appliance and network access to Local UI on the leader node at
  `https://<node-ip>:5080`.
- SSH access to the leader node, or the node's kubeconfig copied to your jumpbox. Refer to
  [Validate the Installation](./install-the-appliance.md#validate-the-installation) for how to copy the kubeconfig off
  the node.
- The [Zot registry](../reference/profile-variables.md#container-registry-zot) password you set during the initial
  installation. The upgrade wizard requires you to re-enter this password.

Complete the following steps to upgrade the platform.

1. Download the new content bundle from Artifact Studio. It must match the hardware GPU, as described in
   [Download the Artifacts](./install-the-appliance.md#download-the-artifacts).

2. Upload the bundle to the leader node the same way as day one, and wait for the upload and sync to complete. Refer to
   [Upload the Content Bundle](./install-the-appliance.md#upload-the-content-bundle).

3. Log in to Local UI at `https://<node-ip>:5080` on the leader node.

4. From the left main menu, select **Cluster**. On the **Overview** tab, confirm that the **Update available** indicator
   appears. The indicator appears when the uploaded content bundle contains a newer cluster definition.

5. Select the **Configuration** tab. In the upper-right corner, select the **Update** drop-down menu, and then select
   **Review Changes**.

6. Local UI displays the **Review Changes** modal. Review the incoming configuration in the diff editor. Your current
   configuration is displayed on the left, and the incoming changes are displayed on the right. Select each profile
   variable and review the proposed change. Where the incoming default differs from your current value, decide whether
   to keep the current value or accept the incoming default.

7. Confirm that the Zot registry password matches the password you set during the initial installation.

   :::warning

   The upgrade fails if the Zot registry password does not match the password used during the initial installation.
   Verify the password before you continue.

   :::

8. After you have reviewed every profile variable, select **Confirm Changes**.

9. At the bottom of the page, select **Update** to start the upgrade.

10. Wait for the appliance cluster to return to the **Running** state. From the left main menu, select **Cluster** to
    monitor progress. The appliance may reboot during the upgrade, which briefly makes Local UI unreachable.

11. Roll the application charts forward on the appliance cluster. The content-bundle upload stages new versions of the
    `mural-crds` and `mural` charts in the appliance's in-cluster registry, but Flux does not advance the releases
    automatically. From the leader node with `sudo`, or from the jumpbox with the node's kubeconfig, patch the Flux
    `OCIRepository` resources in the `mural-system` namespace to the new chart versions. Patch `mural-crds` first, then
    `mural`. Order matters; patching `mural` before `mural-crds` skips the CRD upgrade and can leave the release in a
    failed state.

## Validate the Upgrade

1. In Local UI, from the left main menu, select **Cluster** and confirm that the `palette-ai` pack shows the upgraded
   version and is in the **Running** state.

2. From the leader node or from the jumpbox with the node's kubeconfig, confirm that both `HelmRelease` resources report
   ready.

   ```bash
   kubectl --kubeconfig <kubeconfig-location> get helmrelease --namespace mural-system
   ```

   ```bash hideClipboard title="Expected output"
   NAME         AGE   READY   STATUS
   mural        3h    True    Release reconciliation succeeded
   mural-crds   3h    True    Release reconciliation succeeded
   ```

   Both `mural-crds` and `mural` must show `READY: True`. If either shows `READY: False`, review the release conditions
   with `kubectl describe helmrelease <release-name> --namespace mural-system` and refer to
   [Known Issues](../reference/known-issues.md).

3. Open the appliance console and confirm that models are still serving. You do not re-upload model weights unless the
   release notes for that version say to.

## Next Steps

- [Install the Appliance](./install-the-appliance.md)
- [Deploy a Model](./deploy-a-model.md)
