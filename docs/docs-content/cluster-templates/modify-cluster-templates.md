---
sidebar_label: "Modify Cluster Templates"
title: "Modify Cluster Templates"
description:
  "Learn how to modify cluster templates, including cluster profile versions and policies, and trigger manual updates."
hide_table_of_contents: false
sidebar_position: 20
toc_max_heading_level: 5
tags: ["cluster templates"]
---

:::preview

:::

[Cluster templates](./cluster-templates.md) use [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) and
cluster [template policies](./create-cluster-template-policies/create-cluster-template-policies.md) to declaratively
define and manage the software stack and lifecycle of clusters deployed with Palette. Since cluster templates are
wrappers that reference existing profiles and policies as objects, you can modify cluster profiles and policies
independent of cluster templates, regardless of whether the template is linked to a cluster.

Each resource in Palette, such as profiles, policies, and templates, has a unique identifier (UID). When a cluster is
deployed, it references the UID of the associated cluster template, which in turn references the UIDs of linked profiles
and policies to define the cluster's infrastructure, applications, and operational settings.

If a linked object is updated, such as changing a cluster profile version from 1.0.0 to 2.0.0, the cluster template is
updated to reference the new UID. During the cluster's next upgrade window, it uses this updated reference to apply the
changes. This modular architecture allows users to swap out components in a cluster template at any time, enabling
flexible, version-driven management.

![Diagram showing how cluster templates reference profiles and policies as objects](/cluster-templates_modify-cluster-templates_cluster-template-links.webp)

## Prerequisites

- The **ClusterTemplate** [feature flag](..//self-hosted-setup/palette/system-management/feature-flags.md) enabled.

- The `clusterTemplate.update` permission to modify cluster templates. Refer to our
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

- An existing [cluster template](./cluster-templates.md).

## Modify Cluster Templates

Use the appropriate cluster template tab depending on the required modification.

| **Tab**                                     | **Available Actions**                                                                                                                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Overview**](#overview-tab)               | - Update your cluster to the latest version, regardless of the upgrade schedule specified in the maintenance policy.                                                                                                   |
| [**Policies**](#policies-tab)               | - Add, update, replace, and remove referenced cluster templates and policies. <br /> - Modify the cluster profile version of a linked cluster profile.                                                                 |
| [**Variable values**](#variable-values-tab) | - Get a high-level overview of all cluster profile variables deployed using the cluster profiles linked to the cluster template. <br /> - Perform batch updates for cluster variable values across specified clusters. |

### Overview Tab

Use the **Overview** tab to manually update clusters linked to your cluster template and to view the following
information about your cluster template:

- Basic metadata

- Number of linked policies

- Number of clusters linked to the cluster template

- List of linked cluster profiles and their packs

The option to manually trigger cluster updates is available only if a cluster template is linked to a cluster _and_
there is a discrepancy between the cluster profile variable versions used in the cluster and the versions referenced in
the template. This is caused when a cluster profile has been recently added to or removed from the cluster template, or
the version of a cluster profile linked to a cluster template has been updated, but the upgrade window specified in the
attached maintenance policy has not passed.

To force cluster updates and bypass the scheduled maintenance window, select **Options > Upgrade now**. The **Upgrade
now** button is disabled while the upgrade is in progress.

![Manually updating clusters attached to a cluster template](/cluster-templates_modify-cluster-templates_upgrade-now.webp)

:::warning

- If there are any pending variable assignments, the banner **[N] cluster(s) pending variable assignment** is displayed.
  Even if you attempt to force an upgrade, any clusters with pending variable assignments will _not_ be updated when you
  select **Upgrade now**. Navigate to the [**Variable values**](#variable-values-tab) tab and assign a **New Value** to
  each variable before attempting the upgrade again.

- If your changes require a cluster repave, you must
  [approve the repave](../clusters/cluster-management/node-pool.md#approve-cluster-repave) before the upgrade can
  proceed.

:::

### Policies Tab

Use the **Policies** tab to perform the following actions:

- Replace the linked [maintenance policy](./create-cluster-template-policies/maintenance-policy.md).

- Replace the linked
  [infrastructure](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) or
  [full cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md).

- Add, remove, or replace
  [add-on cluster profiles](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md).

- Update the version of a linked cluster profile.

:::info

Infrastructure and full cluster profiles, as well as maintenance policies, can only be replaced, not removed, as they
are required components of cluster templates.

:::

#### Maintenance Policies

Currently, maintenance policies are the only policy type. To swap the current maintenance policy attached to your
cluster template for another, select **Replace** and choose another maintenance policy. **Save** your changes when
finished, or **Discard** your changes to revert to the previous policy.

To edit an existing maintenance policy, refer to our
[Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md#edit-maintenance-policies) guide.

    :::tip

    - If you do not have a maintenance policy that fits your needs, choose **Create a maintenance policy**. Refer to our [Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md) guide for more information on creating maintenance policies.

    - The **In Use Templates** column indicates if the maintenance policy is currently referenced by another cluster template. Refer to our [Create and Manage Cluster Template Policies](./create-cluster-template-policies/create-cluster-template-policies.md#policies-tab) guide for details on modifying the default display for policies.

    :::

#### Cluster Profiles

Once a cluster profile version is linked to a cluster template, that version of the cluster profile is immutable. To
make changes to a cluster profile attached to a cluster template, you must
[create a new version](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) of your cluster
profile and update the version referenced in the cluster template. Cluster profiles are modified the same way,
regardless of whether a cluster is or is not deployed using the cluster template.

##### Update Cluster Profile Version

To update the cluster profile version linked to a cluster template, expand the version drop-down menu beside the cluster
profile, and choose the version that contains the desired changes.

![Updating the cluster profile version linked in a cluster template](/cluster-templates_modify-cluster-templates_update-profile-version.webp)

Depending on the changes made to the updated cluster profile version and whether the cluster template is linked to a
cluster, you have the option to either **Save** or **Review & Save** your changes.

Selecting **Review & Save** opens the **Review changes** dialog. The items displayed on the left depend on your changes.

| **Template Linked to Cluster** | **Pack YAML Changes** | **Variable Changes** | **Button Displayed** | **Items Displayed**                                                                                |
| ------------------------------ | --------------------- | -------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| :x:                            | :x:                   | :x:                  | **Save**             | N/A                                                                                                |
| :x:                            | :x:                   | :white_check_mark:   | **Save**             | N/A                                                                                                |
| :x:                            | :white_check_mark:    | :x:                  | **Review & Save**    | - [Modified Packs](#modified-packs)                                                                |
| :x:                            | :white_check_mark:    | :white_check_mark:   | **Review & Save**    | - [Modified Packs](#modified-packs)                                                                |
| :white_check_mark:             | :x:                   | :x:                  | **Save**             | N/A                                                                                                |
| :white_check_mark:             | :x:                   | :white_check_mark:   | **Review & Save**    | - [Profile Variable Changes](#profile-variable-changes)                                            |
| :white_check_mark:             | :white_check_mark:    | :x:                  | **Review & Save**    | - [Modified Packs](#modified-packs)                                                                |
| :white_check_mark:             | :white_check_mark:    | :white_check_mark:   | **Review & Save**    | - [Modified Packs](#modified-packs) <br /> - [Profile Variable Changes](#profile-variable-changes) |

###### Modified Packs

Select each pack to view the changes in read-only mode. Once you view a pack, the empty circle changes to a check mark.
If you need to make changes, you must modify the applicable cluster profile version. You cannot select **Apply changes**
until you have viewed each pack.

###### Profile Variable Changes

Use the search bar and drop-down menus to filter your changes. To view a list of removed variables and variables without
definition changes, clear the **Show only new variables or variables with a configuration change** check box.

You can assign values for new or updated variables either now or at a later time via the
[**Variable Values** Tab](#variable-values-tab). To update or assign values in batches, select the check box beside each
cluster, and choose **Assign new value**. If you do not assign a new value, the **Running value** is retained.

Values assigned are propagated to the applicable clusters during the next upgrade window defined in the attached
maintenance policy.

:::info

A new value cannot be assigned if the changes made to the variable definition do not affect the current value. Hover
over the icon preceding the **Running value** column for additional information on what variable changes were made.

:::

![Review changes dialog when updating cluster profile version of cluster template](/cluster-templates_modify-cluster-templates_review-changes.webp)

If at any time you want to revert your cluster profile stack to its previous state, return to the **Policies** tab and
**Discard** your changes. Once changes are applied, they cannot be discarded.

:::warning

If you attempt to update the cluster profile version when cluster profile variable values are in a **Pending** state,
you will not be able to save your changes, as the upgrade is blocked until all variable values are in an **Assigned**
state. Refer to the [**Variable Values** Tab](#variable-values-tab) section of this guide for additional information.

:::

##### Add Profiles

Use the **Add Addon Profile** button to link
[add-on profiles](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md) to
your cluster template. **Confirm** each addition, and ensure the correct profile version is selected. A cluster profile
version cannot be linked to a cluster template if that profile version is already being used by a cluster that is not
attached to a cluster template.

When you are finished, **Save** your changes, or **Discard** your changes to revert your cluster profile stack to its
previous state. If your changes include cluster profile version updates and the cluster template is linked to a cluster,
you must **Review & Save** your changes. Refer to the [Update Cluster Profile Version](#update-cluster-profile-version)
section for more information.

:::info

Only one infrastructure or full cluster profile can be linked to a cluster template. To change the infrastructure or
full cluster profile linked to a cluster template, select the three-dot menu beside the profile, and **Replace** the
profile with a new one.

:::

##### Replace or Delete Profiles

To replace or delete an add-on profile, select either the three-dot menu beside the add-on profile in the left menu and
choose **Replace** or **Remove**; alternatively, select the three-dot menu beside the add-on profile version in the
expanded **Linked profiles** panel and choose **Replace** or **Remove**.

When you are finished, **Save** your changes, or **Discard** your changes to revert your cluster profile stack to its
previous state. If your changes include cluster profile version updates and the cluster template is linked to a cluster,
you must **Review & Save** your changes. Refer to the [Update Cluster Profile Version](#update-cluster-profile-version)
section for more information.

:::info

Only add-on profiles can be deleted. To change the infrastructure or full cluster profile linked to a cluster template,
select the three-dot menu beside the profile, and **Replace** the profile with a new one.

:::

##### Update Process

If a cluster is currently deployed using the cluster template, the cluster will update during the next upgrade window
specified in the linked maintenance policy. To force cluster updates and bypass the scheduled maintenance window,
navigate to the **Overview** tab, and select **Options > Upgrade now**.

:::warning

- If there are any pending variable assignments, the banner **[N] cluster(s) pending variable assignment** is displayed.
  Even if you attempt to force an upgrade, any clusters with pending variable assignments will _not_ be updated when you
  select **Upgrade now**. Navigate to the [**Variable values**](#variable-values-tab) tab and assign a **New Value** to
  each variable before attempting the upgrade again.

- If your changes require a cluster repave, you must
  [approve the repave](../clusters/cluster-management/node-pool.md#approve-cluster-repave) before the upgrade can
  proceed.

:::

### Variable Values Tab

If your cluster template is linked to a cluster profile that contains
[cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
(regardless if variables are present in the layer configuration) and a cluster is deployed using the cluster template,
the **Variable values** tab is populated.

Since cluster profile versions are immutable once linked to a cluster template, cluster profile variables remain the
recommended way to configure environment-specific values per cluster, such as IPs, resource limits, and more.

Variable values are assigned and propagated when you deploy a cluster using a cluster template. Once the cluster is
deployed, the variables appear on the **Variable values** tab of your cluster template with an **Assignment** status of
**Assigned** and the **Running value** listed.

![Variables with a status of Assigned](/cluster-templates_variables-assigned.webp)

Cluster templates help with the initial propagation of new variable values, but they are not the source of truth for
ongoing variable management across clusters. The source of truth remains the cluster profile, which defines the schema,
and the cluster itself, where values are updated in real time.

Use the following table to help you determine which workflow to use when updating profile variables.

| **Scenario**                                                 | **Recommended Workflow**                                                                                                                                                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modify existing variable values for individual clusters      | [**Clusters > Profile > Configure Values**](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/modify-cluster-profile-variables.md#modify-profile-variable-values-in-an-active-cluster) |
| Modify existing variable values for several clusters at once | [**Variable Values** tab](#update-variables-via-the-variable-values-tab)                                                                                                                                           |
| Add or remove variables                                      | [**Variable Values** tab](#update-variables-via-the-variable-values-tab)                                                                                                                                           |
| Update the schema of an existing variable                    | [**Variable Values** tab](#update-variables-via-the-variable-values-tab)                                                                                                                                           |

#### Update Variables via the Variable Values Tab

When you update the cluster profile version linked to a cluster template or add or remove a cluster profile containing
variables, any required values that were not assigned in the [**Profile variable changes**](#profile-variable-changes)
panel enter a **Pending** state. Upon viewing your cluster or the cluster profile version linked to your cluster
template, the banner **Action required: This cluster is managed by the template [name] and has unassigned profile
variables** is displayed. Select the linked cluster template to view the list of cluster **Variable values** attached to
your cluster template via cluster profiles.

![Action required banner when viewing a cluster with pending variables](/cluster-templates_action-required.webp)

Until you verify a **New Value** for all variables in the cluster and all variables are in an **Assigned** state, the
cluster will not update to the latest profile version, regardless of whether you wait until the next update window
specified by the [maintenance policy](./create-cluster-template-policies/maintenance-policy.md) or initiate the update
from the **Overview** tab using **Options > Upgrade now**.

Use the following procedure to modify variable values across a fleet of clusters deployed with the same cluster
template.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  Select the **Policies** tab. Add, replace, and update your cluster profiles as necessary, and **Save** your changes
    when finished. Refer to the [Cluster Profiles](#cluster-profiles) section of this guide for additional information.

4.  Navigate to the **Variable values** tab. Each variable has its own collapsible panel, identified using the formula
    `<cluster-profile> / <variable-display-name>`. Each variable contains a list of all clusters that have the variable
    defined in their cluster profile. When you update the profiles linked to the cluster template, all variables revert
    to a **Pending** state.

5.  To proceed with cluster updates, each variable must be in an **Assigned** state. To resolve each variable, use one
    of the following workflows:

        - To set individual values for a single cluster or multiple clusters, enter the **New Value** for one or multiple clusters. When finished, select **Apply changes [N] > OK**, where **[N]** is the number of clusters for which you set the value.

        - To set the same value for multiple clusters, select the check box to the left of each applicable cluster, and
          choose **Assign new value**. Update the value and **Apply** your changes.

6.  Once a new value is applied, the variable's **Assignment** status changes to **Assigned**, and the **New value**
    column is disabled. The updated value becomes the **Running value**. Repeat step 5 until all variables are
    **Assigned**.

7.  Once all variables have an **Assigned** value, you can proceed with cluster updates. Either wait until the next
    upgrade window specified in the linked maintenance policy, or force the updates by navigating to the **Overview**
    tab and selecting **Options > Upgrade now**.

#### Validate

Take the following steps to verify that your cluster is using the correct profile variable values.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Locate a cluster deployed with your cluster template in one of the following ways:

   - From the left main menu, select **Clusters**. Locate and select the desired cluster.

   - From the left main menu, select **Cluster Configurations**. Navigate to the **Templates** tab, and select the
     drawer icon in the **In use clusters** column to view a list of all clusters linked to the cluster template. Locate
     and select the desired cluster.

3. From the cluster **Overview** page, select the **Profile** tab.

4. Below the list of cluster profiles, select **Configure Values** to open the **Settings** drawer.

5. Scroll through the **Profile Variables Configuration** list. Note that the variable values currently used in the
   cluster are the same as those specified on the **Variable values** tab.
