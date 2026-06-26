---
sidebar_label: "Troubleshooting"
title: "Troubleshooting Launchpad for VMs"
description: "Troubleshooting steps for common Launchpad for VMs (VMO 2.0) scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "launchpad for vms", "troubleshooting"]
---

This page provides troubleshooting guidance for common scenarios you may encounter when using the
[Launchpad for VMs appliance](./launchpad-for-vms.md).

## Scenario - VM Migration Fails During Guest Conversion on Block-Based Storage

When you use the [VM Migration Assistant](../vm-migration-assistant/vm-migration-assistant.md) to migrate VMs to a VMO
cluster backed by a block-based Container Storage Interface (CSI) — such as the LINSTOR/DRBD storage used by the
Launchpad for VMs appliance — migrations can fail during the guest conversion (`ConvertGuest`) phase. The migration
plan reports only a generic message:

```text
error: { phase: "ConvertGuest", reasons: ["Guest conversion failed. See pod logs for details."] }
```

This occurs because the destination volumes are provisioned in `Block` volume mode. During conversion, `virt-v2v`
serves the raw block device through `nbdkit`, which probes the device's minimum block size. When the underlying
storage reports a block size outside the range that `nbdkit` accepts, the conversion fails. Linux guests (for example,
Ubuntu) are most commonly affected, while Windows guests may still succeed.

Use the following steps to confirm the cause and apply a workaround.

### Debug Steps

1. [Access the VM Migration Assistant service console](../vm-migration-assistant/create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console)
   and confirm that the affected VMs failed at the **ConvertGuest** phase.

2. Connect to your host cluster using [kubectl](https://kubernetes.io/docs/tasks/tools/). Follow the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide to obtain access.

3. Inspect the logs of the guest conversion pod for the failed migration plan. The conversion pods run in the migration
   namespace and are named after the plan and VM, for example `plan-01-vm-*`.

   ```bash
   kubectl logs --namespace <migration-namespace> <conversion-pod-name>
   ```

4. Confirm the failure signature. Logs that contain the following lines indicate that `nbdkit` is operating on a
   block device whose minimum block size it cannot handle.

   ```text
   nbdkit: file[1]: debug: extents disabled: lseek: SEEK_HOLE: Invalid argument
   nbdkit: file[1]: error: plugin must set minimum block size between 1 and 64K
   ```

5. Route the migration to a `Filesystem`-mode storage class to work around the issue. Create a storage class that uses
   the same provisioner and parameters as your default storage class, and patch its
   [StorageProfile](https://kubevirt.io/user-guide/storage/containerized_data_importer/#storageprofile) to force
   `Filesystem` volume mode.

   ```yaml
   spec:
     claimPropertySets:
       - accessModes: ["ReadWriteOnce"]
         volumeMode: Filesystem
   ```

6. Recreate the migration plan and, in the **Storage map** step, map the source storage to the new `Filesystem`-mode
   storage class. Ensure the storage map specifies `accessMode: ReadWriteOnce` and `volumeMode: Filesystem`. Refer to
   [Create Migration Plans](../vm-migration-assistant/create-migration-plans.md) for guidance, then start the plan
   again.

   :::warning

   This workaround is temporary. On block-based storage such as LINSTOR/DRBD, `Filesystem` mode is `ReadWriteOnce`
   (`RWO`) only. VMs migrated this way **cannot be live-migrated**, because KubeVirt live migration requires
   `ReadWriteMany` (`RWX`), which is only available in `Block` mode on this storage. To restore live migration, your
   VMO environment must be updated with a guest conversion image that handles the block-size constraints reported by
   the storage. Contact your Spectro Cloud support representative for the status of this fix.

   :::
