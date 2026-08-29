---
sidebar_label: "Upgrade the Platform"
title: "Upgrade the Platform"
description:
  "How to upgrade the PaletteAI Inference Launchpad appliance from Local UI by uploading a newer content bundle and
  applying the Update action."
hide_table_of_contents: false
sidebar_position: 0.7
tags: ["paletteai-inference-launchpad", "upgrade", "how-to"]
keywords: ["launchpad", "ai", "upgrade", "local ui", "content bundle", "artifact studio", "day two"]
---

Upgrade the PaletteAI Inference Launchpad appliance by uploading a newer content bundle from Artifact Studio and
applying the **Update** action in Local UI. You do not reinstall the OS or redeploy the cluster.

## Prerequisites

Confirm each prerequisite before starting:

- A running PaletteAI Inference Launchpad appliance and network access to Local UI on the leader node at
  `https://<node-ip>:5080`.
- The [Zot registry](../reference/profile-variables.md#container-registry-zot) password you set during the initial
  installation. The upgrade wizard requires you to re-enter this password.
- A newer [content bundle](../reference/glossary.md#content-bundle) from Artifact Studio that matches the appliance's
  GPU vendor, NVIDIA or AMD.

## Upgrade the Platform

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
    watch progress. The appliance may reboot during the upgrade, which briefly makes Local UI unreachable.

## Validate

1. In Local UI, from the left main menu, select **Cluster** and confirm that the `palette-ai` pack shows the upgraded
   version and is in the **Running** state.

2. Open the appliance console and confirm that models are still serving. You do not re-upload model weights unless the
   release notes for that version say to.

## Next Steps

- [Manage Cluster Infrastructure](./manage-cluster-infrastructure.md)
- [Deploy a Model](./deploy-a-model.md)
