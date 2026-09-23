---
sidebar_label: "Attach a Cluster to a Cluster Template"
title: "Attach an Existing Cluster to a Cluster Template"
description:
  "Learn how to attach a running Palette-provisioned cluster to a cluster template so it comes under template
  governance."
hide_table_of_contents: false
sidebar_position: 15
tags: ["cluster templates"]
---

You can attach a running, Palette-provisioned cluster to a [cluster template](./cluster-templates.md). Once attached,
the template governs the cluster's future upgrades and policy enforcement in the same way as clusters originally
deployed from the template.

## How Attachment Works

Attachment brings the cluster's configuration under the template's governance. If your cluster's current setup differs
from the template's, Palette shows you a summary of the changes before you confirm, and applies them at the template's
next scheduled maintenance window.

Review the summary carefully. Some of your cluster's existing settings are replaced during attachment, and once
replaced, they cannot be restored.

- The cluster's cluster profile is replaced with the template's. If the versions differ, the cluster stays on its
  current version until the next maintenance window applies the swap.

- Any add-on profiles on the cluster that the template does not include are removed.

- Pack settings that you set directly on the cluster (settings that were not defined as profile variables) are
  overwritten with the template's values.

- Variable values that you set on the cluster are cleared. If the template's profiles require variables you have not
  assigned, the cluster waits in a pending state until you assign them.

- If the change affects the operating system or Kubernetes version, the cluster is
  [repaved](../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration).

Not every template can be attached to a given cluster. The template picker marks each template as compatible or not,
with the reason for the ones that are not.

After attachment, you can still add, update, and remove machine pools. You cannot edit the cluster's profiles or
variable values directly; those come from the template.

## Prerequisites

- A [cluster template](./create-cluster-templates.md).

- A Palette-provisioned cluster that meets all of the following conditions:

  - It is in the **Running** state (not currently mid-upgrade and not in an error state).

  - It has a time zone configured.

  - It is not already attached to a cluster template.

- Your Palette account role must include the following permissions:

  - `cluster.update`

  - `clusterTemplate.get`

  Refer to [Permissions](../user-management/palette-rbac/permissions.md) for more information about roles and
  permissions.

## Attach the Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, then select the cluster you want to attach.

3. Select the **Profile** tab.

4. From the top right of the page, select **Settings** > **Attach to Cluster Template**.

5. Choose the cluster template and select **Confirm Selection**

6. Review any differences between the cluster's current configuration and the template. You must review all differences
   before proceeding.

7. Select **Attach to Template**.

By default, the profile swap runs at the next upgrade window defined by the linked
[maintenance policy](./create-cluster-template-policies/maintenance-policy.md). To trigger it immediately instead, use
**Actions > Upgrade now** on the template's **Overview** tab. Refer to
[Modify Cluster Templates](./modify-cluster-templates.md#overview-tab) for details.

## Next Steps

- To change the template that governs the cluster, refer to [Modify Cluster Templates](./modify-cluster-templates.md).

- To adjust when the profile swap runs, refer to
  [Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md).
