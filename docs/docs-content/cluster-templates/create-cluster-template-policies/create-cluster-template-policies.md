---
sidebar_label: "Create and Manage Template Policies"
title: "Create and Manage Cluster Template Policies"
description: "Learn the basics of cluster template policies and how to create, view, and delete them."
hide_table_of_contents: false
sidebar_position: 0
tags: ["cluster templates", "policies"]
---

:::preview

:::

Policies are an integral part of cluster templates. While cluster profiles define the infrastructure and software stack
for your clusters, cluster template policies are modular, reusable definitions that define how the cluster operates as
well as its lifecycle. Policies are linked rather than embedded within cluster templates, allowing you to manage
policies independently; this includes updating and swapping them as needed to create a comprehensive governance stack
for your clusters.

Currently, Palette supports [maintenance policies](maintenance-policy.md). Each cluster template can be linked only to
one policy of each type. For example, while you can create multiple maintenance policies that you can update or swap as
needed, only one can be attached to the cluster template at any time. However, the same policy can be attached to
multiple cluster templates.

## Policies Tab

From the left main menu, select **Cluster Configurations > Policies** to create, edit, and delete cluster template
policies. Use the menu bar to locate your policy by name, **Type**, or **Tags**. Select the column headers to sort in
ascending or descending order.

Select the gear icon on the right of the table to customize the list of policies in any of the following ways:

- Clear and mark check boxes to hide and display columns.
- Select and hold the three vertical dots beside each column and drag to rearrange the column order.
- Select the pin icon to pin the column to the front of the table.
- Select **Reset to Default** to revert your changes.

The following table lists the available columns.

| **Column**           | **Description**                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Type**             | Type of cluster template policy. At this time, **Maintenance** is the only policy type.                                                                                                                                                                |
| **Name**             | Name of the policy. Each policy name must be unique.                                                                                                                                                                                                   |
| **Last Modified**    | Date the policy was last modified.                                                                                                                                                                                                                     |
| **In Use Templates** | Specifies if the policy is linked to a cluster template. If a policy is linked, select the drawer trigger beside it to view which templates the profile is linked to. Refer to the [In Use Templates](#in-use-templates) section for more information. |
| **Scope**            | Specifies if the policy is part of the tenant or project scope.                                                                                                                                                                                        |
| **Tags**             | Tags assigned to the policy.                                                                                                                                                                                                                           |

### In Use Templates

If a policy is linked to a cluster template, select the drawer trigger beside the policy to view which templates the
policy is linked to. A drawer similar to the **Policies** tab is displayed, listing all cluster templates linked to the
selected policy.

Use the menu bar to locate your template by name, infrastructure **Environment**, types of **Policies**, or **Tags**.
Select the column headers to sort in ascending or descending order. Use the arrow beside **Tags** to view the
**Policies** selected. To remove policies from the filter, select **Clear All** to remove all policies or select **x** to remove individual policies.

Select the gear icon on the right of the table to customize the display using the same methods used to modify the list
of policies. The following table lists the available columns.

| **Column**          | **Description**                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**            | Name of the cluster template. Each template name must be unique.                                                                                                                                                                                                                                                                                                               |
| **Env**             | Infrastructure environment of the cluster template. This is based on the infrastructure or managed Kubernetes provider selected when creating the linked [infrastructure](../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) or [full cluster profile](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md). |
| **Last Modified**   | Date the template was last modified.                                                                                                                                                                                                                                                                                                                                           |
| **In use clusters** | Specifies if the template is linked to an active cluster. If a template is linked, select the drawer icon beside it to view details about the template. For more information, refer to our [Modify Cluster Templates](../modify-cluster-templates.md) guide.                                                                                                                   |
| **Scope**           | Specifies if the template is part of the tenant or project scope.                                                                                                                                                                                                                                                                                                              |
| **Tags**            | Tags assigned to the template.                                                                                                                                                                                                                                                                                                                                                 |

## Create and Edit Cluster Template Policies

To create a policy, make a selection from the **Create Policy** drop-down menu in the top-right of the **Policies** tab.

![Creating a new cluster template policy](/cluster-templates_create-cluster-template-policies_policies-tab.webp)

To edit an existing policy, either select the policy, or select the three-dot menu beside the policy and choose **Edit**. Policies can be edited at
any time, regardless of whether they are currently part of a cluster template that is or is not attached to a cluster.

The fields and steps associated with creating and editing policies depend on the type of policy. At this time,
maintenance policies are the only policy type. For detailed information on creating maintenance policies, refer to our
[Maintenance Policy](./maintenance-policy.md) guide.

## Delete Cluster Template Policies

Policies can be deleted only when they are not referenced in any cluster template, regardless of whether the cluster
template is or is not being used in an active cluster. To delete a policy, select the three-dot menu beside the policy,
and choose **Delete**.

## Next Steps

Cluster template policies are a required component of cluster templates. At this time, Palette supports maintenance
policies only. Refer to our [Maintenance Policies](maintenance-policy.md) guide to learn more about creating and
managing maintenance policies.

Once you have a maintenance policy as well as a
[full](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
[infrastructure cluster profile](../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md),
you can [create a cluster template](../create-cluster-templates.md) and deploy a new cluster using your cluster
template.
