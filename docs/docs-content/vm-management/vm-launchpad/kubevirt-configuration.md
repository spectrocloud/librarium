---
sidebar_label: "KubeVirt Configuration"
title: "KubeVirt Configuration"
description:
  "Adjust feature gates, migration policy, workload updates, and KSM on the cluster-scoped KubeVirt custom resource in
  PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 8
tags: ["vmo", "vm launchpad", "kubevirt", "configuration"]
---

The **KubeVirt Configuration** page is a guided editor for the cluster-scoped `KubeVirt` custom resource that
[KubeVirt](https://kubevirt.io/user-guide/) uses to configure the virtualization layer. Use the page to adjust feature
gates, eviction and migration policy, workload update behavior, and Kernel Same-Page Merging (KSM) without editing the
custom resource directly.

Virtual Machine Orchestrator (VMO) submits your changes with
[Server-Side Apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/) and identifies itself as the
`vmo-manager` field manager. This allows VMO to share the resource with the KubeVirt operator and other controllers that
own fields on it.

:::warning

This page edits the live configuration of your cluster. Changes take effect when you apply them and affect every VM that
runs on the appliance.

:::

## Configuration Sections

The page is organized into the following sections, each of which maps to a part of the `KubeVirt` resource.

| **Section**                 | **Description**                                                                       | **Resource fields**                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Developer Configuration** | CPU emulation, cluster-wide overcommit ratios, and the list of enabled feature gates. | `spec.configuration.developerConfiguration`, including `featureGates`                                   |
| **Strategies**              | Cluster defaults for eviction, VM rollout, and uninstall behavior.                    | `spec.configuration.evictionStrategy`, `spec.configuration.vmRolloutStrategy`, `spec.uninstallStrategy` |
| **Live Migration**          | Concurrency, bandwidth, and timeout limits that apply to live migration.              | `spec.configuration.migrations`                                                                         |
| **Workload Updates**        | How KubeVirt applies updates to VMs that are already running.                         | `spec.workloadUpdateStrategy`                                                                           |
| **KSM Configuration**       | Node label selector that determines where KSM runs.                                   | `spec.configuration.ksmConfiguration`                                                                   |
| **Ownership**               | Read-only list of the controllers that own fields on the resource.                    | `metadata.managedFields`                                                                                |

## Access the KubeVirt Configuration Page

1. Log in to VMO.

2. From the VMO left main menu, select **Settings**.

3. Under **Configuration**, select **KubeVirt**. The page loads the current `KubeVirt` resource from the cluster.

## Configure KubeVirt

1. Access the **KubeVirt Configuration** page.

2. Adjust the fields you want to change in any section. To reach fields that the form does not display, select **Open
   YAML** and edit the resource spec directly. VMO validates your YAML and merges it into the same draft as the form
   fields.

3. Select **Apply**. VMO makes **Apply** available only when your draft differs from the version stored in the cluster
   and every field passes validation.

4. Review the **Diff Preview**, which compares the current spec with the spec you are about to submit.

5. Select **Apply** in the **Diff Preview** to send the change to the cluster. VMO reloads the form from the updated
   resource and clears your draft.

Select **Reload** at any point to discard your draft and fetch the current resource from the cluster.

## Developer Configuration

| **Field**                       | **Description**                                                                                                                                                                                                             | **Default** |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Enable CPU emulation**        | Falls back to software CPU emulation when the host does not provide hardware virtualization extensions. Intended for lab and development environments.                                                                      | Cleared     |
| **Memory overcommit ratio (%)** | Sets the cluster-wide level of memory overcommit. At `100`, the memory request of a VM equals its guest memory. Higher values reduce the request proportionally, so `200` requests about half and allows more VMs per node. | `100`       |
| **CPU allocation ratio**        | Defines how much physical CPU is reserved per vCPU. Lower values give each vCPU more guaranteed CPU. Higher values increase VM density with less CPU per VM.                                                                | `10`        |
| **Feature gates**               | KubeVirt feature gates enabled on the cluster.                                                                                                                                                                              | _Varies_    |

To enable a feature gate, enter its name in the **Add a gate** field and select **Add**. To disable a gate, select the
**x** on the gate. VMO submits the list as you entered it, so the KubeVirt admission webhook rejects a name it does not
recognize when you apply.

:::info

The overcommit ratios change resource density across the whole cluster. To review the trade-offs before you adjust them,
refer to [VM Overcommitment and Memory Optimization](./vmo-overcommit-memory-optimization-appliance.md).

:::

## Strategies

| **Field**                     | **Description**                                                                    | **Default**                            |
| ----------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------- |
| **Default eviction strategy** | What KubeVirt does with a running VM when its node is drained.                     | **Live migrate**                       |
| **VM rollout strategy**       | When a configuration change to a VM takes effect.                                  | **Live update**                        |
| **Uninstall strategy**        | Whether KubeVirt can be uninstalled while VM workloads still exist on the cluster. | **Block uninstall if workloads exist** |

## Live Migration

| **Field**                                        | **Description**                                                                                                     | **Default** |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Parallel outbound migrations per node**        | Maximum number of migrations that can leave a single node at the same time.                                         | Empty       |
| **Parallel migrations per cluster**              | Maximum number of migrations that can run across the cluster at the same time.                                      | Empty       |
| **Bandwidth per migration**                      | Network bandwidth limit for a single migration. Enter a Kubernetes quantity, such as `1Gi`. Enter `0` for no limit. | Empty       |
| **Completion timeout (s / GiB)**                 | Seconds allowed for each GiB of memory before KubeVirt cancels a migration that has not finished.                   | `150`       |
| **Progress timeout (s)**                         | Seconds that a migration can run without making progress before KubeVirt cancels it.                                | Empty       |
| **Allow auto-converge**                          | Throttles the guest CPU when a migration cannot keep pace with the rate at which the guest changes memory.          | Selected    |
| **Allow post-copy**                              | Allows KubeVirt to switch to post-copy migration when pre-copy migration does not converge.                         | Cleared     |
| **Allow workload disruption during maintenance** | Allows KubeVirt to disrupt workloads that cannot migrate when a node enters maintenance.                            | Cleared     |

An empty field means that the KubeVirt default applies. VMO validates the bandwidth format before you apply, so a value
in the wrong format keeps **Apply** unavailable instead of failing at the admission webhook.

## Workload Updates

| **Field**                   | **Description**                                                                                | **Default**     |
| --------------------------- | ---------------------------------------------------------------------------------------------- | --------------- |
| **Workload update methods** | How KubeVirt updates VMs that are already running. Select **LiveMigrate**, **Evict**, or both. | **LiveMigrate** |
| **Batch eviction size**     | Number of VMs that KubeVirt updates in a single batch.                                         | Empty           |
| **Batch eviction interval** | Time that KubeVirt waits between batches. Enter a Go duration, such as `1m0s`.                 | Empty           |

## KSM Configuration

[KSM](https://docs.kernel.org/admin-guide/mm/ksm.html) is a Linux kernel feature that allows deduplication of identical
memory pages across VMs. It reduces memory consumption when many VMs run the same guest operating system.

The **Node label selector** determines where KSM runs. KSM runs on the nodes whose labels match every key and value pair
in the selector. You can add up to eight pairs.

To restrict KSM to a set of nodes, enter a label key and its value, and then select **Add**. To remove a pair, select
the delete icon at the end of its row.

:::info

KSM adds CPU overhead because the kernel continuously scans memory pages. For guidance on when the memory savings are
worth that cost, refer to
[VM Overcommitment and Memory Optimization](./vmo-overcommit-memory-optimization-appliance.md).

:::

## Ownership

The **Ownership** section lists every field manager that owns fields on the `KubeVirt` resource, along with the
operation it used, when it last wrote, and how many fields it owns. Typical managers are `vmo-manager`,
`virt-controller`, and `virt-operator`.

This section is read-only. Review it when you plan to change a field that another controller manages, because
Server-Side Apply returns a conflict when two managers claim the same field.

## Apply Errors

VMO displays the following errors at the top of the form when an apply does not succeed.

| **Error**                    | **Cause**                                                                                                                                                               | **Resolution**                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Server-Side Apply conflict   | Another field manager, often the KubeVirt operator, owns a field that you changed.                                                                                      | Select **Reload** to fetch the current resource, and then make your change again on the updated state.  |
| Kubernetes permission denied | Your Kubernetes identity does not hold `update` permission on the `kubevirts.kubevirt.io` resource. Both your VMO permission and Kubernetes RBAC must allow the change. | Ask a cluster administrator to grant the permission, or apply the change with an account that holds it. |
| Admission rejection          | The KubeVirt admission webhook rejected the change, such as an unrecognized feature gate name or a malformed duration.                                                  | Correct the value that the message identifies, and then apply again.                                    |

## Permissions

Two permissions control this page.

- `vmo:kubevirt:read` - Displays the configuration and the YAML editor in read-only form.

- `vmo:kubevirt:write` - Allows you to edit the draft and apply changes. Without this permission, the page displays a
  read-only banner and **Apply** remains unavailable.

Only the built-in **Platform Admin** role holds these permissions. Because the `KubeVirt` resource is cluster-scoped,
the **Configuration** group is available only to users whose access is not restricted to specific namespaces.

To review the permissions that each built-in role holds, refer to
[VM User Roles and Permissions](../rbac/vm-roles-permissions.md).

## Feature Gate Considerations

The `DeclarativeHotplugVolumes` gate is required to define a CD-ROM drive that has no ISO mounted when you create a VM.
Without the gate, VMO omits empty CD-ROM entries from the manifest it generates. For more information about adding
CD-ROM drives, refer to [Create a VM](./virtual-machines/creating.md).

`HotplugVolumes` and `DeclarativeHotplugVolumes` can both appear in the list without the admission webhook rejecting
them. When the list contains both gates, `HotplugVolumes` takes precedence for the imperative hotplug API, while
`DeclarativeHotplugVolumes` still allows empty CD-ROM drives at creation time. To move fully to the declarative model,
remove `HotplugVolumes` and keep `DeclarativeHotplugVolumes`.

:::warning

Before you remove `DeclarativeHotplugVolumes`, attach an ISO to every VM that has an empty CD-ROM drive, or remove the
empty drive from those VMs. VMs that keep an empty CD-ROM drive after you remove the gate can enter a degraded state.

:::
