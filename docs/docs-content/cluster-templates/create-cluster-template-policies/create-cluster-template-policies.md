---
sidebar_label: "Create and Manage Cluster Template Policies"
title: "Create and Manage Cluster Template Policies"
description: "Test" # UPDATE
hide_table_of_contents: false
sidebar_position: 0
tags: ["cluster templates", "policies"]
---

:::preview

:::

Policies are an integral part of cluster templates. While the cluster profile defines the infrastructure and software
stack for your clusters, policies define the how the cluster operates, including its lifecycle. Policies are linked
rather than embedded within cluster templates, allowing you to manage them independently, along with updating and
swapping them as needed to create a comprehensive governance stack.

Currently, Palette supports maintenance policies. Each cluster template can only be linked to one policy of each type.
For example, while you can create multiple maintenance policies that you can swap as needed, only one can be attached to
the cluster template at any time. However, the same policy can be attached to multiple cluster templates.

Cluster template policies are created and managed from the **Policies** tab, accessible by selecting **Cluster
Configurations** from the left main menu.

[INCLUDE SCREENSHOT HERE]

## Create and Edit Cluster Template Policies

Create a cluster template policy by making a selection from the **Create Policy** drop-down menu in the top-right. To
edit an existing policy, locate it in **Policies** tab, select the three-dot menu beside the policy, and choose
**Edit**. Policies can be edited at any time, regardless of whether they are currently part of a cluster template that
is or is not being used in an active cluster.

The fields and steps associated with creating and editing policies depend on the type of policy. At this time,
maintenance policies are the only policy type. For more information, refer to our
[Maintenance Policy](./maintenance-policy.md) guide.

## View Cluster Template Policies

Use the **Policies** tab to view and manage existing cluster template policies. In the menu bar, locate your policy by
name, **Type**, or **Tags**. Select the column headers to sort in ascending or descending order. To change how the
columns are displayed, select the gear icon on the right of the table. Clear and mark check boxes to hide and display
columns. Select and hold the three vertical dots beside each column, and drag to rearrange the column order. Select the
pin icon to pin the column to the front of the table. Select **Reset to Default** to revert your changes. Columns can be
hidden, rearranged, and pinned to the front of the table as desired.

The following table lists the available columns.

| **Column**           | **Description**                                                                                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Type**             | The type of cluster template policy. At this time, **Maintenance** is the only policy type.                                                                                                                                                  |
| **Name**             | The name of the policy. Each policy name must be unique.                                                                                                                                                                                     |
| **Last Modified**    | The date the policy was last modified.                                                                                                                                                                                                       |
| **In Use Templates** | Specifies if the policy is linked to a cluster template. If a policy is linked, select the icon beside it to view which templates the profile is linked to. Refer to the [In Use Templates](#in-use-templates) section for more information. |
| **Scope**            | Specifies if the policy is part of the tenant or project scope.                                                                                                                                                                              |
| **Tags**             | Tags assigned to the policy.                                                                                                                                                                                                                 |

### In Use Templates

If a policy is linked to a cluster template, select the icon beside the policy to view which templates the policy is
linked to. A window similar to the **Policies** tab is displayed, listing all cluster templates with a link to the
selected policy.

In the menu bar, locate your template by name, infrastructure **Environment**, types of **Policies**, or **Tags**.
Select the column headers to sort in ascending or descending order. Use the arrow beside **Tags** to view the
**Policies** selected and **Clear All** or individual policies from the filter.

To change how the columns are displayed, select the gear icon on the right of the table. Clear and mark check boxes to
hide and display columns. Select and hold the three vertical dots beside each column, and drag to rearrange the column
order. Select the pin icon to pin the column to the front of the table. Select **Reset to Default** to revert your
changes.

The following table lists the available columns.

| **Column**          | **Description**                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**            | The name of the cluster template. Each template name must be unique.                                                                                                                                                                                  |
| **Env**             | The infrastructure environment of the cluster template. This is based on the infrastructure or managed Kubernetes provider selected when creating the linked infrastructure or full cluster profile.                                                  |
| **Last Modified**   | The date the template was last modified.                                                                                                                                                                                                              |
| **In use clusters** | Specifies if the template is linked to an active cluster. If a template is linked, select the icon beside it to view details about the template. For more information, refer to our [Modify Cluster Templates](../modify-cluster-templates.md) guide. |
| **Scope**           | Specifies if the template is part of the tenant or project scope.                                                                                                                                                                                     |
| **Tags**            | Tags assigned to the template.                                                                                                                                                                                                                        |

## Delete Cluster Template Policies

Policies can be deleted only when they are not referenced in any cluster template, regardless of whether the cluster
template is or is not being used in an active cluster. To delete a policy, select the three-dot menu beside the policy,
and choose **Delete**.

## Next Steps

Check our guide to create the policy you need.

- Create Maintenance Policies

## QUESTIONS

- What is an **In Use Template** status of `Unknown` and how does it happen?
