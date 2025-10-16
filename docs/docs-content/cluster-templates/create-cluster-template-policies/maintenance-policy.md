---
sidebar_label: "Maintenance Policies"
title: "Maintenance Policies"
description: "Learn what maintenance policies are, including how to create, edit, and delete them."
hide_table_of_contents: false
sidebar_position: 10
tags: ["cluster templates", "policies"]
---

:::preview

:::

A maintenance policy is a required component for [cluster templates](../cluster-templates.md). Maintenance policies
determine when and how upgrades are executed on the cluster. Since clusters can be provisioned across multiple regions
and time zones, upgrades are executed based on Coordinated Universal Time (UTC). [THIS WILL BE CHANGED TO LOCAL TIME IN
THE FUTURE]

When the cluster profile version linked to a cluster template is updated, or when profiles are added, deleted, or
replaced, the associated maintenance policy automatically schedules upgrades for all active clusters. These clusters are
then upgraded during the upgrade window defined in the maintenance policy. Each maintenance policy can have multiple
upgrade schedules, and upgrades can be manually triggered outside of the defined schedule, giving you the flexibility to
trigger upgrades across clusters whenever necessary.

All clusters must be on the same version and all cluster profile variables must be in an **Assigned** state before
upgrading to the next version. If some clusters fail to upgrade during the upgrade window, the template enters a
"partially applied" state, and further version upgrades are blocked until all clusters are on the same version again. In
this situation, you can either wait for the next upgrade window, at which time the system will attempt to upgrade the
remaining clusters, or you can force the upgrade using the **Upgrade now** button.

The following table discusses several upgrade scenarios, as well as the result.

| **Scenario**                                      | **Details**                                                                                                                                                                                                                                                                                                             | **Result**                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single Profile Update**                         | 1,000 clusters are deployed from Cluster Template **A**. A cluster profile linked to Cluster Template **A** is updated from version 1.0.0 to 2.0.0.                                                                                                                                                                     | All 1,000 clusters are upgraded to version 2.0.0 during the next scheduled upgrade window.                                                                                                                                                                                                                       |
| **Multiple Profile Updates Before Rollout**       | 1,000 clusters are deployed from Cluster Template **B**. A cluster profile linked to Cluster Template **B** is updated from version 1.0.0 to 2.0.0. An additional update is made before the upgrade window begins, and the profile version is bumped from 2.0.0 to 3.0.0.                                               | Since the upgrade window did not begin until version 3.0.0 was specified, version 2.0.0 is skipped, and all 1,000 clusters are upgraded from version 1.0.0 to 3.0.0 during the next scheduled upgrade window.                                                                                                    |
| **Multiple Profile Updates During Rollout**       | 1,000 clusters are deployed from Cluster Template **C**. A cluster profile linked to Cluster Template **C** is updated from version 1.0.0 to 2.0.0. During the upgrade window, as clusters are being upgraded from 1.0.0 to 2.0.0, an additional update is made, and the profile version is bumped from 2.0.0 to 3.0.0. | If some clusters were already upgraded to 2.0.0, the update to version 3.0.0 is blocked until all clusters have been updated to version 2.0.0. Once all clusters are updated to version 2.0.0, all 1,000 clusters are upgraded from version 2.0.0 to 3.0.0 during the next upgrade window.                       |
| **Updates Do Not Complete During Upgrade Window** | 1,000 clusters are deployed from Cluster Template **D**. A cluster profile linked to Cluster Template **D** is updated from version 1.0.0 to 2.0.0. Some clusters begin to update to version 2.0.0 during the next scheduled upgrade window, but the updates do not finish before the upgrade window closes.            | Some clusters are upgraded to 2.0.0, and others remain on 1.0.0, forcing the template to enter a "partially applied" state and blocking additional version upgrades. During the next upgrade window, or via a forced upgrade, the clusters finish upgrading to version 2.0.0, and future upgrades are unblocked. |

## Create Maintenance Policies

Use the following procedure to create a maintenance policy to schedule automatic updates for clusters deployed with
cluster templates.

### Prerequisites

- The **ClusterTemplate** [feature flag](../../enterprise-version/system-management/feature-flags.md) enabled.

- The `spcPolicy.create` permission to create cluster template policies. Refer to our
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

### Enablement

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  From the top-right of the **Policies** tab, select **Create Policy > Maintenance Policy**.

4.  On the **Basic Information** window, enter a unique **Name** for the maintenance policy, and add any desired
    **Tags**.

5.  In the **Upgrade schedule** section, select **Add Schedule** to open the **Configure schedule** drawer.

6.  Enter a **Name** for your first schedule. The name must be unique within the scope of the current maintenance
    policy.

7.  Use the **Schedule** drop-down menu to specify when to initiate cluster updates. Available options include the
    following:

    - **Every week on Sunday at midnight**
    - **Every two weeks at midnight** [ON SUNDAY? FROM THE DATE THE CLUSTER IS DEPLOYED?]
    - **Every month on the 1st at midnight**
    - **Every two months on the 1st at midnight**
    - **Custom**

    <br />

    #### Custom Schedules

    Use the options described in the following table to create a **Custom** schedule.

    :::info

    All upgrade times are relative to UTC. [THIS WILL BE LOCAL TIME IN THE FUTURE]

    :::

    ![Configuring a schedule for a maintenance policy](/cluster-templates_create-cluster-template-policies_maintenance-policies_schedule.webp)

    | **Every** | **Options**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **day**   | - **every hour** - Initiate the update **every hour** or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **week**  | - **every day of the week** - Initiate the update **every day of the week** or select one or multiple days of the week (Sunday - Saturday). <br /> - **every hour** - Initiate the update **every hour** of the selected weekday or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                                                                                                                                                                                                                                                               |
    | **month** | - **every day of the month** - Initiate the update **every day of the month** or select one or multiple days of the month within the range 01 - 31. <br /> - **every day of the week** - Initiate the update **every day of the week** or multiple days of the week (Sunday - Saturday) in the selected month in addition to the selected day of the month. <br /> - **every hour** - Initiate the update **every hour** of the selected day of the month or day of the week or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                   |
    | **year**  | - **every month** - Initiate the update **every month** or select one or multiple months of the year (January - December). <br /> - **every day of the month** - Initiate the update **every day of the month** or select one or multiple days of the month within the range 01 - 31. <br /> - **every day of the week** - Initiate the update **every day of the week** or multiple days of the week (Sunday - Saturday) in the selected month in addition to the selected day of the month. <br /> - **every hour** - Initiate the update **every hour** of the selected day of the month or day of the week or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59. |

    - [FOR MONTHS, WHAT HAPPENS IF YOU SELECT A DAY THAT IS NOT PART OF A MONTH? LIKE 31? WILL IT BE SKIPPED THAT MONTH
      OR WILL IT TRIGGER WHEN THE MONTH ROLLS OVER TO THE 1ST?]

8.  Select how many hours you want the **Upgrade window** to last. Values range from 1 - 24 hours. During the duration
    of the upgrade window, updates will be rolled out to the cluster.

    :::warning

    Depending on the number of clusters attached to the template, as well as cluster or environment constraints, the
    upgrade may not be applied to all eligible clusters within the specified time frame. In this scenario, the template
    enters a "partially applied" state, and further updates to the cluster are blocked. Updates to the cluster resume
    during the next upgrade window or when manually triggered using the **Upgrade now** button on the cluster template
    **Overview** tab. Once all clusters are on the same cluster profile version, normal updates are resumed.

    :::

9.  When finished, **Confirm** your schedule.

10. Your schedule appears in the **Upgrade schedule** section of the **Basic information** window. If you would like to
    add additional schedules, select **Add Schedule**, and repeat steps 5 - 10; otherwise, select **Next**.

    :::tip

    Each template can be linked to one maintenance policy only. All schedules attached to a maintenance policy are
    initiated on the attached clusters during the specified upgrade window. If you do not want all schedules applied to
    certain clusters, consider making another maintenance policy and attaching it to a separate cluster template.

    :::

11. Review your maintenance policy. If any changes are needed, return to the **Previous** screen, and make the necessary
    modifications; otherwise, **Finalize** your maintenance policy.

12. Your maintenance policy is added to the **Policies** list. Repeat steps 3 - 12 to create additional policies as
    needed.

## Edit Maintenance Policies

Use the following procedure to modify an existing maintenance policy. You can edit maintenance policies at any time,
regardless if they are attached to a cluster template and the template is or is not linked to a cluster.

### Prerequisites

- The **ClusterTemplate** [feature flag](../../enterprise-version/system-management/feature-flags.md) enabled.

- The `spcPolicy.update` permission to update cluster template policies. Refer to our
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

### Enablement

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  On the **Policies** tab, locate your maintenance policy. Beside the policy, select the three-dot menu, and choose
    **Edit**.

4.  On the **Basic Information** window, modify the **Name** and **Tags** as necessary.

5.  In the **Upgrade schedule** section, make one of the following selections:

    | **Option**       | **Description**                                                                                                                                                                                                                                               |
    | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Edit** icon    | Modify an existing schedule. Refer to the [Create Maintenance Policies](#create-maintenance-policies) section for field details.                                                                                                                              |
    | **Delete** icon  | Remove a schedule from the policy. If your maintenance policy is linked to a cluster via a cluster template, you must always have at least one upgrade schedule; if you delete all upgrade schedules, you cannot save your changes to the maintenance policy. |
    | **Add Schedule** | Add a new upgrade schedule to your policy. Refer to the [Create Maintenance Policies](#create-maintenance-policies) section for field details.                                                                                                                |

6.  When you are finished editing your maintenance policy, select **Next** and **Finalize** your changes.

## Delete Maintenance Policies

Use the following procedure to delete an existing, detached maintenance policy. You can delete a maintenance policy only
if it is not linked to a cluster template, regardless of whether the template is attached to a cluster.

### Prerequisites

- The **ClusterTemplate** [feature flag](../../enterprise-version/system-management/feature-flags.md) enabled.

- The `spcPolicy.delete` permission to delete cluster template policies. Refer to our
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Cluster Configurations**.

3. Locate your maintenance policy on the **Policies** tab. Beside your maintenance policy, select the three-dot menu,
   and choose **Delete**. This option is available only if the maintenance policy is not attached to a cluster template.

4. **Confirm** the deletion of your maintenance policy. Your maintenance policy is removed from the **Policies** list.

## Next Steps

Once you create a maintenance policy and have a
[full](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
[infrastructure cluster profile](../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md),
you can [create a cluster template](../create-cluster-templates.md) to deploy a synchronized cluster fleet.
Alternatively, you can use any existing maintenance policy to replace one currently linked to a cluster template,
regardless if clusters are deployed using the template. For more information, refer to our
[Modify Cluster Templates](../modify-cluster-templates.md) guide.
