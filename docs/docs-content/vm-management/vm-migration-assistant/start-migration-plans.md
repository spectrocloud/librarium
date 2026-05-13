---
sidebar_label: "Start Migration Plans"
title: "Start Migration Plans"
description: "Learn how to start migration plans in the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 40
tags: ["vmo", "vm migration assistant"]
---

Follow this guide to start migration plans in the VM Migration Assistant.

Cold migrations can be started at any time, but require downtime on the source VM. Warm migrations require a cutover
date and time to be set, which initiates the final synchronization and cutover process. Refer to each relevant section
for detailed instructions.

## Start Cold Migration Plans

### Prerequisites

<!--prettier-ignore-->
- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.
  - The VM Migration Assistant service console must be accessible from a web browser.

- A cold migration plan created and ready to start. Refer to [Create Migration Plans](./create-migration-plans.md) for
  guidance.

- One or more VMs hosted in VMware vSphere.

  - VMs operating Windows must be shut down at the virtualized OS level.

### Start Cold Migration

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Migration plans**.

3. In the top-left corner, use the **Namespace** drop-down menu to select your Kubernetes namespace for the migration,
   or select **All Namespaces**.

4. Find your plan in the table and click the plan name to view its details. You can use the table filters to help locate
   your plan if needed.

5. On the **Details** tab, under **Plan details: Status**, click **Start**.

6. Click **Start** in the pop-up window.

7. Click on the **Virtual Machines** tab.

8. In the table, click the **>** icon for each VM to view the status of the migration. The **Migration progress**
   section displays the stages of the migration and their status.

   You can also click the **>** icon next to the **Migration resources** to view the Kubernetes resources created for
   the migration of that VM.

### Validate

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Migration plans**.

3. In the top-left corner, use the **Namespace** drop-down menu to select your Kubernetes namespace for the migration,
   or select **All Namespaces**.

4. Find your plan in the table and click the plan name to view its details. You can use the table filters to help locate
   your plan if needed.

5. On the **Details** tab, under **Plan details: Status**, check that the status displays as **Complete**.

6. Click on the **Virtual Machines** tab.

7. In the table, check that the **Pipeline status** column displays as **Succeeded** for each VM.

   ![Successful VM Migration](/vm-migration-assistant/start-migration-plans_succeeded-vm-tab.webp)

8. Log in to [Palette](https://console.spectrocloud.com).

9. From the left main menu, select **Clusters**. Then, choose the VMO cluster that you migrated your VMs to. The
   **Overview** tab appears.

10. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down menu.
    Your migrated VMs appear.

11. For each migrated VM, click on the three-dot menu and select **Start**. Your VMs are now ready to use.

    ![Start migrated VM](/vm-migration-assistant/start-migration-plans_start-migrated-vm.webp)

## Start Warm Migration Plans

### Prerequisites

<!--prettier-ignore-->
- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.
  - The VM Migration Assistant service console must be accessible from a web browser.

- A warm migration plan created and ready to start. Refer to [Create Migration Plans](./create-migration-plans.md) for
  guidance.

- One or more VMs hosted in VMware vSphere.

- [Changed Block Tracking](https://knowledge.broadcom.com/external/article/315370/enabling-or-disabling-changed-block-trac.html)
  must be enabled on your VMs.

### Start Warm Migration

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Migration plans**.

3. In the top-left corner, use the **Namespace** drop-down menu to select your Kubernetes namespace for the migration,
   or select **All Namespaces**.

4. Find your plan in the table and click the plan name to view its details.

5. On the **Details** tab, under **Plan details: Status**, click **Start**.

6. Click **Start** in the pop-up window.

7. Click on the **Virtual Machines** tab.

8. In the table, click the **>** icon for each VM to view the status of the migration. The **Migration progress**
   section displays the stages of the migration and their status.

   You can also click the **>** icon next to the **Migration resources** to view the Kubernetes resources created for
   the migration of that VM.

9. Monitor the migration progress until the **Pipeline status** shows as **Waiting** and the **Migration progress**
   section shows **Paused**. This indicates that the migration is ready for the final cutover to be initiated.

   ![Ready for Cutover](/vm-migration-assistant/start-migration-plans_schedule-cutover.webp)

10. Click **Schedule cutover**.

11. In the pop-up window, click on the calendar icon and select a cutover date in the calendar. Next, click on the clock
    icon and select a cutover time from the drop-down menu.

    :::warning

    The cutover process will power off the source VM and power on the target VM. Ensure that you have scheduled the
    cutover for a time that minimizes disruption to users.

    :::

12. Click **Set cutover** once complete.

When the cutover is initiated, the source VM is powered off, and a final synchronization of remaining disk changes is
completed. The target VM is then created and powered on on the destination VMO cluster.

### Validate

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Migration plans**.

3. In the top-left corner, use the **Namespace** drop-down menu to select your Kubernetes namespace for the migration,
   or select **All Namespaces**.

4. Find your plan in the table and click the plan name to view its details. You can use the table filters to help locate
   your plan if needed.

5. On the **Details** tab, under **Plan details: Status**, check that the status displays as **Complete**.

6. Click on the **Virtual Machines** tab.

7. In the table, check that the **Pipeline status** column displays as **Succeeded** for each VM.

8. Log in to [Palette](https://console.spectrocloud.com).

9. From the left main menu, select **Clusters**. Then, choose the VMO cluster that you migrated your VMs to. The
   **Overview** tab appears.

10. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down menu.
    Your migrated VMs appear with a **Running** status.

    ![Running VM in VMO](/vm-migration-assistant/start-migration-plans_running-vm-vmo.webp)

## Next Steps

- You can [create more migration plans](./create-migration-plans.md) and start them as needed.

- You can [cancel active migration plans](./cancel-active-migration-plans.md) if necessary.
