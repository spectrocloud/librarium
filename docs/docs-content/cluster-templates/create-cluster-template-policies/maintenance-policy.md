---
sidebar_label: "Maintenance Policies"
title: "Maintenance Policies"
description: "Test" # UPDATE
hide_table_of_contents: false
sidebar_position: 10
tags: ["cluster templates", "policies"]
---

:::preview

:::

A maintenance policy is a mandatory policy used with cluster templates. Maintenance policies determine when and how
upgrades are executed on the cluster. Since clusters can be provisioned across multiple regions and time zones, upgrades
are executed based on the Coordinated Universal Time (UTC).

Maintenance policies are triggered when the cluster profile version linked to a cluster template is updated and an
active cluster is attached to the updated cluster template. The cluster is then updated during the maintenance window
specified in the linked maintenance policy. Each maintenance policy can have multiple upgrade schedules, giving you the
flexibility to trigger upgrades across clusters whenever necessary. Upgrades can also be manually triggered outside of
your schedule.

If the cluster profile version is updated several times within a short span, the following rules are applied:

-

| **Scenario**                                | **Details**                                                                                                                                                                                                                                                     | **Result**                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single Profile Update**                   | 1,000 clusters are deployed from Cluster Template A. A cluster profile linked to Cluster Template A is updated from version 1.0.0 to 2.0.0.                                                                                                                     | The cluster profile attached to 1,000 clusters is upgraded to version 2.0.0 during the next scheduled maintenance window, as defined by the maintenance policy.                     |
| **Multiple Profile Updates Before Rollout** | 1,000 clusters are deployed from Cluster Template B. A cluster profile linked to Cluster Template B is updated from version 1.0.0 to 2.0.0. Before the maintenance window, an additional update is made, and the profile version is bumped from 2.0.0 to 3.0.0. | The cluster profile attached to 1,000 clusters is upgraded to version 3.0.0 during the next scheduled maintenance window, as defined by the maintenance policy.                     |
| **Multiple Profile Updates During Rollout** | 1,000 clusters are deployed from Cluster Template C. A cluster profile linked to Cluster Template C is updated from version 1.0.0 to 2.0.0. During the maintenance window, an additional update is made, and the profile version is bumped from 2.0.0 to 3.0.0. | If the cluster profile attached to some of the clusters was already upgraded to 2.0.0, the update to version 3.0.0 is blocked until all cluster have been updated to version 2.0.0. |

If the cluster profile version is updated several times before the

Scenario 1: Standard Upgrade Flow

    Day 1: 1,000 clusters are deployed from Cluster Template A.

    Day 2: A cluster profile linked to the template is updated from v1 to v2.

    ✅ All 1,000 clusters will upgrade to v2 during their next scheduled maintenance window, as defined by the upgrade policy.

Scenario 2: Multiple Profile Updates Before Full Rollout

    Day 1: 1,000 clusters are deployed from Cluster Template B.

    Day 2: A cluster profile is updated from v1 to v2.

    ⏭ Shortly after, the template owner attempts another update — from v2 to v3.

The rules applied are as follow:

    ✅ If no clusters have upgraded to v2 yet (i.e., maintenance windows not reached), the update to v3 is allowed.

    ❌ If some or all clusters have already upgraded to v2, the update to v3 is blocked until 100% of clusters have completed the previous upgrade.

    ⚠ If some clusters missed their maintenance window or failed to upgrade, the template enters a “partially applied” state — and further updates are blocked.

        The system will re-attempt the upgrade during the next maintenance window.

        A manual “Upgrade Now” action can also be used to force the upgrade on eligible clusters.

## Create Maintenance Policies

### Prerequisites

- The **ClusterTemplate** [feature flag](../../enterprise-version/system-management/feature-flags.md) enabled.

- The `spcPolicy.create` permission to create cluster template policies. Refer to our
  [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

### Enablement

Take the following steps to create a maintenance policy:

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
    - **Every two weeks at midnight** - On sunday? From the date the cluster is deployed?
    - **Every month on the 1st at midnight**
    - **Every two months on the 1st at midnight**
    - **Custom**

### Custom Schedules

    If you select **Custom**, you have a variety of combinations. Available options are described in the following
    table.

    :::info

    All upgrade times are relative to UTC.

    :::

    ![Configuring a schedule for a maintenance policy](/cluster-templates_create-cluster-template-policies_maintenance-policies_schedule.webp)

    - With months, what happens if you select a day that is not part of a month? Like 31? Will it be skipped that month
      or triggered when the month rolls over?

      | **Every** | **Options**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
      | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
      | **day**   | - **every hour** - Initiate the update **every hour** or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
      | **week**  | - **every day of the week** - Initiate the update **every day of the week** or select one or multiple days of the week (Sunday - Saturday). <br /> - **every hour** - Initiate the update **every hour** of the selected weekday or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                                                                                                                                                                                                                                                               |
      | **month** | - **every day of the month** - Initiate the update **every day of the month** or select one or multiple days of the month within the range 01 - 31. <br /> - **every day of the week** - Initiate the update **every day of the week** or multiple days of the week (Sunday - Saturday) in the selected month in addition to the selected day of the month. <br /> - **every hour** - Initiate the update **every hour** of the selected day of the month or day of the week or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59.                                                                                                                                   |
      | **year**  | - **every month** - Initiate the update **every month** or select one or multiple months of the year (January - December). <br /> - **every day of the month** - Initiate the update **every day of the month** or select one or multiple days of the month within the range 01 - 31. <br /> - **every day of the week** - Initiate the update **every day of the week** or multiple days of the week (Sunday - Saturday) in the selected month in addition to the selected day of the month. <br /> - **every hour** - Initiate the update **every hour** of the selected day of the month or day of the week or select one or multiple hours within the range 00 - 23. <br /> - **every minute** - Initiate the update **every minute** of the selected hour or select one or multiple minutes within the range 00 - 59. |

8.  Select how many hours you want the **Upgrade window** to last. Values range from 1 - 24 hours. During the duration
    of the upgrade window, updates will be rolled out to the cluster.

    Depending on the number of clusters attached to the template, as well as cluster or environment constraints, the
    upgrade may not be applied to all eligible clusters within the specified time frame. In this scenario, the template
    enters a "partially applied" state, and further updates to the cluster are blocked. Updates to the cluster resume
    during the next maintenance window or when manually triggered using the **Upgrade now** button on the cluster
    template **Overview** tab. Once all clusters are on the same cluster profile version, normal updates are resumed.

9.  When finished, select **Confirm** to save your schedule.

10. Your schedule appears in the **Upgrade schedule** section of the **Basic information** window. If you would like to
    add additional schedules, select **Add Schedule**, and repeat steps 5 - 10; otherwise, select **Next**.

:::tip

Each template can be linked to one maintenance policy only. All schedules attached to a maintenance policy are initiated
on the attached clusters during the specified time. If you do not want all schedules applied to certain clusters,
consider making another maintenance policy and attaching it to a separate cluster template.

:::

12. Review your maintenance policy. If any changes are needed, return to the **Previous** screen, and make the necessary
    modifications; otherwise, **Finalize** your maintenance policy.

13. Your maintenance policy is added to the **Policies** list. Repeat steps 3 - 12 to create additional policies as
    needed.

## Edit Maintenance Policies

### Prerequisites

### Enablement

Maintenance policies can be edited at any time, regardless if they are attached to a cluster template and if the
template is attached to an active cluster. Take the following steps to edit a maintenance policy:

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  Locate your maintenance policy on the **Policies** tab. Beside your maintenance policy, select the three-dot menu,
    and choose **Edit**.

4.  On the **Basic Information** window, modify the **Name** and **Tags** as necessary.

5.  In the **Upgrade schedule** section, select the **Edit** icon to modify an existing schedule, the **Delete** icon to
    remove a schedule from the policy, or **Add Schedule** to add a new upgrade schedule.

    If you choose to edit or add a new schedule, refer to [Create Maintenance Policies](#create-maintenance-policies)
    section for field details.

    :::info

    If your maintenance policy is linked to a running cluster via a cluster template, you must always have at least one
    upgrade schedule; if you delete all upgrade schedules, you cannot save your changes to the maintenance policy.

    :::

6.  When you are finished editing your maintenance policy, select **Next** and **Finalize** your changes.

## Delete Maintenance Policies

You can only delete a maintenance policy if it is not linked to a cluster template, regardless of whether the template
is being used to deploy a cluster.

### Prerequisites

### Enablement

Take the following steps to remove an unlinked maintenance policy:

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Cluster Configurations**.

3. Locate your maintenance policy on the **Policies** tab. Beside your maintenance policy, select the three-dot menu,
   and choose **Delete**. This option is available only if the maintenance policy is not attached to a cluster template.

4. **Confirm** the deletion of your maintenance policy. Your maintenance policy is removed from the **Policies** list.

## Next Steps

Once you have created a maintenance policy, you can use it to create a cluster template or replace it with another
maintenance policy attached to a cluster template.
