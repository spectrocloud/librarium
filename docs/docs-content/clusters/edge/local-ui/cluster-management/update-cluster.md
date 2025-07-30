---
sidebar_label: "Update Local Cluster"
title: "Update Local Cluster"
description: "Instructions for updating a locally managed cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

You can update existing local clusters in a locally managed Edge host from Local UI by uploading a new cluster profile
version. This guide explains how to update an existing cluster in Local UI.

## Prerequisites

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log into Local UI. Any OS user can be used to log in to Local UI.

- A local cluster created in Local UI. For more information, refer to [Create Local Cluster](create-cluster.md).

## Update Local Cluster

1. Log into Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more information,
   refer to [Access Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, select **Cluster**, and then select the **Configuration** tab.

3. In the upper-right corner, select **Upload Configuration**.

4. In the **Upload Configuration** wizard, browse or drag and drop the new cluster profile version **.tgz** file. Once
   the upload finishes, select **Review Changes**.

   To learn more about how to export a cluster profile and import it during this step, refer to
   [Export Cluster Definition](./export-cluster-definition.md).

5. Local UI displays the **Review Changes** modal, where you can review the update summary and verify all incoming
   changes to the
   [Cluster Profile Variables](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md).
   Your current configuration is displayed on the left, and the incoming changes are displayed on the right.

6. Click each profile variable and review the changes. You can specify values for new profile variables, override the
   incoming default values, or leave the incoming changes as is, depending on your local cluster configuration.

   :::info

   If your current cluster configuration overrides the default profile variable values, Local UI will preserve your
   configuration in case the update introduces new defaults. To use the new default values, click **Use default** in the
   respective profile variable field.

   :::

7. Once all incoming changes have the **Reviewed** status, click **Confirm Changes**.

8. Review all profile variables on the **Configuration** tab to make sure that the cluster configuration matches your
   expectations.

9. In the bottom-left corner, click **Update**.

   :::info
   
   If you upload a content bundle built after a Palette version upgrade, along with a modified cluster definition, and update the cluster through the Local UI, it will lead to the Palette agent being upgraded in accordance with the version included in the content bundle.

   :::

## Validate

1. Log in to Local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Verify that your cluster is in the **Running** status.
