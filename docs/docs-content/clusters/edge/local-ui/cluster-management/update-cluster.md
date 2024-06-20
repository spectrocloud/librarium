---
sidebar_label: "Update Local Cluster"
title: "Update Local Cluster"
description: "Instructions for updating a locally manageg cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 40
tags: ["edge"]
---

You can update existing local clusters from the local UI by uploading a new cluster profile version. This guide explains
how to update an existing cluster in local UI.

:::preview

:::

## Prerequisites

- Network access to the Edge device’s IP and port where the local UI is exposed. The default port is 5080.

- Credentials to log into the local UI. Any OS user can be used to log in to the local UI.

- A local cluster created in local UI. For more information, refer to [Create Local Cluster](create-cluster.md).

## Update Local Cluster

1. Log into the local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more
   information, refer to [Access Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, select **Cluster**, and then select the **Configuration** tab.

3. In the upper-right corner, select **Upload Configuration**.

4. In the **Upload Configuration** wizard, browse or drag and drop the new cluster profile version **.tgz** file. Once
   the upload finishes, select **Review Changes**.

   To learn more about how to export a cluster profile and import it during this step, refer to
   [Export Cluster Definition](./export-cluster-definition.md).

5. Local UI displays the **Review Changes** modal, where you can review the update summary and verify all incoming
   changes to the cluster profile variables. Your current configuration is displayed on the left, and the incoming
   changes are displayed on the right.

   For more information on cluster profile variables, refer to
   [Define and Manage Profile Variables](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md).

6. Click each profile variable and review the changes. You can specify values for new profile variables, override the
   incoming default values, or leave the incoming changes as is, depending on your local cluster configuration.

   :::info

   If your current cluster configuration overrides the default profile variable values, local UI will preserve your
   configuration in case the update introduces new defaults. To use the new default values, click **Use default** in the
   respective profile variable field.

   :::

7. Once all incoming changes have the **Reviewed** status, click **Confirm Changes**.

8. Review all profile variables on the **Configuration** tab to make sure that the cluster configuration matches your
   expectations.

9. In the bottom-left corner, click **Update**.

## Validate

1. Log in to the local UI.

2. From the left **Main Menu**, select **Cluster**.

3. Verify that your cluster is in the **Running** status.
