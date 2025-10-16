---
sidebar_label: "Modify Cluster Templates"
title: "Modify Cluster Templates"
description:
  "Learn how to modify cluster templates, including cluster profile versions and policies, and trigger manual updates."
hide_table_of_contents: false
sidebar_position: 20
toc_max_heading_level: 4
tags: ["cluster templates"]
---

:::preview

:::

[Cluster templates](./cluster-templates.md) use [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) and
cluster [template policies](./create-cluster-template-policies/create-cluster-template-policies.md) to declaratively
define and manage the software stack and lifecycle of clusters deployed with Palette. Since cluster templates are
wrappers that reference existing profiles and policies as objects, you can modify cluster profiles and policies
independent of cluster templates, regardless of whether the template is linked to a cluster.

Each resource in Palette, such as profiles, policies, and templates, has a unique identifier (UID). When a cluster is deployed, it references the UID of the associated cluster template, which in turn references the UIDs of linked profiles and policies to define its infrastructure, applications, and operational settings.

If a linked object is updated, such as changing a cluster profile version from 1.0.0 to 2.0.0, the cluster template is updated to reference the new UID. During the cluster's next upgrade window, it uses this updated reference to apply the changes. This modular architecture allows users to swap out components in a cluster template at any time, enabling flexible, version-driven management.

![Diagram showing how cluster templates reference profiles and policies as objects](/cluster-templates_modify-cluster-templates_cluster-template-links.webp)

## Prerequisites

- The **ClusterTemplate** [feature flag](../enterprise-version/system-management/feature-flags.md) enabled.

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

Use the **Overview** tab to manually update clusters linked to your cluster template and to view the following information about your cluster template:

- Basic metadata
- Number of linked policies
- Number of clusters linked to the cluster template
- List of linked cluster profiles and their packs

The option to manually trigger cluster updates is available only if a cluster template is linked to a cluster _and_
there is a discrepancy between the cluster profile variable versions used in the cluster and the versions referenced in
the template. This is caused when a cluster profile has been recently added to or removed from the cluster template, or
the version of a cluster profile linked to a cluster template has been updated, but the upgrade window specified in the
attached maintenance policy has not passed.

To force cluster updates and bypass the scheduled maintenance window, select **Options > Upgrade now**.

![Manually updating clusters attached to a cluster template](/cluster-templates_modify-cluster-templates_upgrade-now.webp)

:::warning

If there are any pending variable assignments, the banner **[N] cluster(s) pending variable assignment** is displayed.
Even if you attempt to force an upgrade, the cluster will _not_ be updated when you select **Upgrade now**. Navigate to
the [**Variable values**](#variable-values-tab) tab and assign a **New Value** to each variable before attempting the
upgrade again.

:::

### Policies Tab

Use the **Policies** tab to perform the following actions:

- Replace the linked maintenance policy.
- Replace the linked infrastructure or full cluster profile.
- Add or remove add-on cluster profiles.
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

    - If you do not have a maintenance policy that fits your needs, choose **Create a maintenance policy**. Refer to our [Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md) guide for more information on creating maintenance polices.

    - The **In Use Templates** column indicates if the maintenance policy is currently referenced by another cluster template. Refer to our [Create and Manage Cluster Template Policies](./create-cluster-template-policies/create-cluster-template-policies.md#policies-tab) guide for details on modifying the default display for policies.

    :::

#### Cluster Profiles

Once a cluster profile is linked to a cluster template, that version of the cluster profile is immutable. To make
changes to a cluster profile attached to a cluster template, you must create a new version of your cluster profile and
update the version referenced in the cluster template. Cluster profiles are modified the same way, regardless of whether
a cluster is currently deployed using the cluster template.

To update the cluster profile version used for clusters deployed with the cluster template, expand the version drop-down
menu beside the cluster profile, and choose the version that contains the desired changes.

![Updating the cluster profile version linked in a cluster template](/cluster-templates_modify-cluster-templates_update-profile-version.webp)

Use the **Add Addon Profile** button to link
[add-on profiles](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md) to
your cluster template. **Confirm** each addition, and ensure the correct profile version is selected. A cluster profile
version cannot be linked to a cluster template if that profile version is already being used by a cluster that is not
attached to a cluster template.

    To replace or delete an add-on profile, select either the three-dot menu beside the add-on profile in the left menu
    and choose **Replace** or **Remove**; alternatively, select the three-dot menu beside the add-on profile version in
    the expanded **Linked profiles** panel and choose **Replace** or **Remove**

When you are finished, **Save** your changes, or **Discard** your changes to revert your cluster profile stack to its
previous state.

If you have made any cluster profile changes and a cluster is currently deployed using the cluster template, the cluster
will update during the next upgrade window specified in the linked maintenance policy. To force cluster updates and
bypass the scheduled maintenance window, navigate to the **Overview** tab, and select **Options > Upgrade now**.

:::warning

If there are any pending variable assignments, the banner **[N] cluster(s) pending variable assignment** is displayed.
Even if you attempt to force an upgrade, the cluster will _not_ be updated when you select **Upgrade now**. Navigate to
the [**Variable values**](#variable-values-tab) tab and assign a **New Value** to each variable before attempting the
upgrade again.

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
**Assigned**.

![Variables with a status of Assigned](/cluster-templates_variables-assigned.webp)

Cluster templates help with the initial propagation of new variable values, but they are not the source of truth for
ongoing variable management across clusters. The source of truth remains the cluster profile, which defines the schema,
and the cluster itself, where values are updated in real time.

Use the following table to help you determine which workflow to use when updating profile variables.

| **Scenario**                                                       | **Recommended Workflow**                                                                                                                                                                                           |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Modify existing variable values for individual clusters**        | [**Clusters > Profile > Configure Values**](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/modify-cluster-profile-variables.md#modify-profile-variable-values-in-an-active-cluster) |
| **Add or remove variables**                                        | [**Variable Values tab**](#update-variables-via-the-variable-values-tab)                                                                                                                                           |
| **Update the schema of an existing variable**                      | [**Variable Values tab**](#update-variables-via-the-variable-values-tab)                                                                                                                                           |
| **Modify existing variable values for a large number of clusters** | [**Variable Values tab**](#update-variables-via-the-variable-values-tab)                                                                                                                                           |

#### Update Variables via the Variable Values Tab

When you either update the cluster profile version linked to a cluster template or add a cluster profile containing
variables, all variables enter a **Pending** state. Upon viewing your cluster or the cluster profile version linked to
your cluster template, the banner **Action required: This cluster is managed by the template [name] and has unassigned
profile variables** is displayed. Select the linked cluster template to view the list of cluster **Variable values**
attached to your cluster template via cluster profiles.

![Action required banner when viewing a cluster with pending variables](/cluster-templates_action-required.webp)

Until you verify a **New Value** for all variables and all variables are in an **Assigned** state, clusters attached to
the template will not update to the latest profile version, regardless of whether you wait until the next update window
specified by the [maintenance policy](./create-cluster-template-policies/maintenance-policy.md) or initiate the update
from the **Overview** tab using **Options > Upgrade now**.

Use the following procedure to modify variable values across a fleet of clusters deployed with the same cluster
template:

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

    :::danger

    When you upgrade the cluster profile version, the **New Value** reverts to the default variable value
    configured in the cluster profile. If a default value is not configured, the **New Value** is blank. Make sure you
    closely review each **New Value** to avoid unexpected changes.

    :::

        - To set a value for a _single cluster_, enter the **New Value** for the cluster, and select **Apply changes > OK**.

        - To set the same value for _multiple clusters_, select the check box to the left of each applicable cluster, and
          choose **Assign new value**. Update the value and **Apply** your changes.

        :::tip

        If you do not need to make any changes to the **New Value**, mark the check box to the left of the cluster, select **Assign new value**, and choose **Apply** without making any changes. Doing so disables the **New Value** field and allows you to proceed with cluster updates.

        :::

6.  Once a new value is applied, the variable's **Assignment** status changes to **Assigned**, and the **New value**
    column is disabled. Repeat step 5 until all variables are **Assigned**.

7.  Once all variables have an **Assigned** value, you can proceed with cluster updates. Either wait until the next
    upgrade window specified in the linked maintenance policy, or force the updates by navigating to the **Overview**
    tab and selecting **Options > Upgrade now**.

#### Validate

Take the following steps to verify that your cluster is using the correct profile variable values:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Locate a cluster deployed with your cluster template in one of the following ways:

   - From the left main menu, select **Clusters**. Locate and select the desired cluster.

   - From the left main menu, select **Cluster Configurations**. Navigate to the **Templates** tab, and select the drawer
     icon in the **In use clusters** column to view a list of all clusters linked to the cluster template. Locate and
     select the desired cluster.

3. From the cluster **Overview** page, select the **Profile** tab.

4. Below the list of cluster profiles, select **Configure Values** to open the **Settings** drawer.

5. Scroll through the **Profile Variables Configuration** list. Note that the variable values currently used in the
   cluster are the same as those specified on the **Variable values** tab.
