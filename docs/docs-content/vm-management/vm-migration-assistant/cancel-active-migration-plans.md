---
sidebar_label: "Cancel Active Migration Plans"
title: "Cancel Active Migration Plans"
description: "Learn how to cancel active migration plans in the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 50
tags: ["vmo", "vm migration assistant"]
---

Follow this guide if you need to cancel active migration plans in the VM Migration Assistant. An active migration plan
is a migration plan that has been started, but not yet completed.

## Prerequisites

<!--prettier-ignore-->
- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.
  - The VM Migration Assistant service console must be accessible from a web browser.

- An active migration plan.

### Cancel VM Migration

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace drop-down Menu** to select your Kubernetes namespace for the migration.

4. Click on the active migration plan name to view its details.

5. Click on the **Virtual Machines** tab.

6. Select the VMs that you want to stop from migrating.

7. Click **Cancel**.

8. Click **Yes, cancel** to confirm the cancellation.

### Validate

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace drop-down Menu** to select your Kubernetes namespace for the migration.

4. Click on the migration plan name to view its details.

5. Click on the **Virtual Machines** tab.

6. In the table, check that the migration status shown for each VM is **Cancelled**.

## Resources

- [Start Migration Plans](./start-migration-plans.md)
