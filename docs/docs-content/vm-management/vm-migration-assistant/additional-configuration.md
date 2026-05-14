---
sidebar_label: "Additional Configuration"
title: "VM Migration Assistant Additional Configuration"
description: "Learn how to configure additional settings in the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo", "vm migration assistant"]
---

This guide explains the additional configuration options available in the VM Migration Assistant, including how to
adjust settings for your migration controller, providers, and migration plans.

## Overview

The **Overview** page of the VM Migration Assistant provides additional tuning and configuration options for your migration
controller. It also displays metrics for your migrations and health of the operational pods used for migration.

![VM Migration Assistant - Overview Page](/vm-migration-assistant/additional-configuration_overview-page.webp)

### Overview Tab

View the overall status of your VM Migration Assistant on the **Overview** tab. This includes metrics for your
migrations and the health of the operational pods used for migration.

### YAML Tab

The **YAML** tab displays a YAML code editor for the VM Migration Assistant (`ForkliftController` resource).

View and edit the
[Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) YAML on this
tab.

### Health Tab

View the health status and logs for pods used by the VM Migration Assistant on the **Health** tab.

### History Tab

View the history of migrations initiated by the VM Migration Assistant on the **History** tab.

### Settings Tab

The **Settings** tab has configurable settings for the VM Migration Assistant. These parameters define the resource
allocation, performance tuning, and operational settings for efficiently managing virtual machine migrations.

Perform the following steps to change a setting.

1. Click the **Edit** option next to **Settings**.

2. Adjust each setting as desired in the modal window. The configurable parameters are described in the following
   table.

   | Parameter                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Default Value |
   | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
   | **Maximum concurrent VM migrations**            | The maximum number of VMs that can be migrated simultaneously. Consider the available system resources and network bandwidth, as too many concurrent migrations can overload the system and cause slower speeds or congestion. Start with a lower value and gradually increase it to find the optimal balance. Migration plans can enter an **Unknown** state if you have selected to migrate more VMs than this setting allows. Refer to [Scenario - Virtual Machine (VM) Migrations Plans in Unknown State](../../troubleshooting/vmo-issues.md#scenario---virtual-machine-vm-migration-plans-in-unknown-state) in our troubleshooting section for details of this scenario. | `20`          |
   | **Controller main container CPU limit**         | The CPU limit (in millicpu) allocated to the main container in the `forklift-controller` pod. Environments running a high number of concurrent migrations, or using providers that require frequent reconciliation, may need this limit increased to prevent throttling from slowing migration progress.                                                                                                                                                                                                                                                                                                                                                                       | `500m`        |
   | **Controller main container memory limit**      | The memory limit (in mebibytes) allocated to the main container in the `forklift-controller` pod. Environments running many parallel migrations may need this limit raised above the default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `800Mi`       |
   | **Controller inventory container memory limit** | The memory limit (in mebibytes) allocated to the inventory container in the `forklift-controller` pod. The inventory container's memory demand scales with the number of VMs and providers being tracked, so large environments may need this limit raised above the default.                                                                                                                                                                                                                                                                                                                                                                                                  | `1000Mi`      |
   | **Precopy interval**                            | _(Only applicable to warm migrations)_ The interval (in minutes) at which new Changed Block Tracking (CBT) snapshots are requested and transferred throughout the precopy stage. Shorter intervals reduce the amount of data transferred at cutover but consume the snapshot limit faster, which can cause warm migrations to fail if cutover is not triggered in time.                                                                                                                                                                                                                                                                                                        | `60min`       |
   | **Snapshot polling interval**                   | _(Only applicable to warm migrations)_ The frequency at which the migration controller polls check whether a snapshot creation or removal operation has completed. A shorter interval means the controller detects completed snapshots sooner and can proceed to the next step faster, at the cost of slightly increased API call frequency against the source provider.                                                                                                                                                                                                                                                                                                    | `10s`         |
   | **Controller transfer network**                 | Choose a network for the host provider to use for disk transfer during migrations. Using a dedicated network for transfers helps avoid saturating the default pod network. If no network is selected, the pod network is used by default, which may not be optimal for large disk transfers.                                                                                                                                                                                                                                                                                                                                                                                   | `None`        |

3. Click **Save** after making changes.

## Provider Settings

Select **Providers** on the left main menu to view your source and host providers.

Click on a provider name to view its settings.

![Providers Page](/vm-migration-assistant/additional-configuration_providers-page.webp)

### Details Tab

<Tabs queryId="provider-details-tabs">

<TabItem value="source-provider" label="Source Provider">

Perform the following steps to change a setting.

1. Click the pencil icon next to each value.

2. Adjust the value in the modal window.

   The configurable settings are described in the following table. These are defined when you perform the
   steps in [Create Source Providers](./create-source-providers.md).

   | Setting                  | Description                                                                                                                                                                                                                                                                                                                                                     |
   | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **URL**                  | Your vSphere / ESXi API endpoint for the software development kit (SDK). You can specify a Fully Qualified Domain Name (FQDN) or an IP address. For example, `https://vcenter.mycompany.com/sdk`.                                                                                                                                                               |
   | **VDDK init image**      | Provide the registry URL to the VMware Virtual Disk Development Kit (VDDK) image. Specify the value without the HTTP scheme `https://` or `http://`. For example, `docker.io/myorganization/vddk:v8.0.3`.                                                                                                                                                       |
   | **External web UI link** | Your vSphere / ESXi UI endpoint. You can specify an FQDN or an IP address. For example, `https://vcenter.mycompany.com/ui`.                                                                                                                                                                                                        |
   | **Convert Disk**         | When enabled, disk conversion is handled using `virt-v2v`. For example, if you're migrating from VMware to Virtual Machine Orchestrator (VMO), `virt-v2v` can convert Virtual Machine Disk (VMDK) to raw or QEMU copy-on-write version 2 (qcow2) formats that are optimal for the target environment. When disabled, disks are transferred using raw copy mode. |

3. Click **Save** after making changes.

</TabItem>

<TabItem value="host-provider" label="Host Provider">

Perform the following steps to change a setting.

1. Click the pencil icon next to each value.

2. Adjust the value in the modal window.

   The configurable settings are described in the following table.

   | Setting                      | Description                                                                                                                                                                                                                                                               |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Default Transfer Network** |  _Use the [Settings Tab](#settings-tab) on the [Overview](#overview) page to adjust this setting at the controller level. This prevents changes from being overridden._ <br /> <br /> Select a default migration network. If no network is selected, the pod network is used by default.  |

3. Click **Save** after making changes.

</TabItem>

</Tabs>

### YAML Tab

The **YAML** tab displays a YAML code editor for the provider resource.

View and edit the
[Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) YAML on this
tab.

### Credentials Tab

Perform the following steps to edit the provider credentials.

1. Click the **Edit** option next to **Credentials**.

2. In the modal window, update the value for each setting that you want to change.

   The configurable settings are described in the following table. These are defined when you perform the
   steps in [Create Source Providers](./create-source-providers.md).

   | Setting                              | Description                                                                                               |
   | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
   | **Username**                         | Your vSphere / ESXi account username. For example, `user@vsphere.local`.                                  |
   | **Password**                         | Your vSphere / ESXi account password.                                                                     |
   | **Certificate validation**           | **Configure certificate validation** for your vSphere / ESXi provider or **Skip certificate validation**. |
   | **Configure certificate validation** | Upload or drag and drop the certificate authority (CA) certificate for your vSphere / ESXi.                                       |
   | **Skip certificate validation**      | Enabling this option bypasses x509 CA verification.                                                       |

3. Click **Save** after making changes.

### Virtual Machines Tab

The **Virtual Machines** tab displays a table of virtual machines from the provider.

You can initiate migrations from this tab by selecting VMs and clicking on **Create migration plan**. Refer to
[Create Migration Plans](./create-migration-plans.md) for guidance.

### ESXi Hosts Tab

The **ESXi Hosts** tab displays a table of hosts from the provider. This tab is not visible on host clusters.

Use the following steps to configure the migration network for each listed host in the table.

:::info

Using the default management network for migration can lead to poor performance. Disk transfer operations may saturate
may saturate network bandwidth, which could affect communication between vCenter and ESXi hosts.

A dedicated migration network can improve performance and reduce risks to the VMware environment.

:::

1. For each host that you want to configure, click the checkbox next to the hosts' name.

2. Click on **Select migration network**.

3. The configurable settings are described in the following table.

   | Setting                      | Description                                                  |
   | ---------------------------- | ------------------------------------------------------------ |
   | **Network**                  | Select the migration network to use from the drop-down Menu. |
   | **ESXi host admin username** | Specify the ESXi host admin username. For example, `root`.   |
   | **ESXi host admin password** | Specify the ESXi host admin password.                        |

4. After making changes, click **Save**.

### Networks Tab

The **Networks** tab displays a table of
[NetworkAttachmentDefinitions](https://docs.openshift.com/container-platform/4.8/rest_api/network_apis/networkattachmentdefinition-k8s-cni-cncf-io-v1.html)
from the cluster. This tab is only visible on host clusters.

Use the following steps to select a default migration network for the cluster to improve disk transfer performance. If
no network is selected, the pod network is used by default, which may not be optimal.

1. Click on **Set provider default transfer network**.

2. Select a network from the **Default transfer Network** drop-down.

3. After making changes, click **Save**.

## Plan Settings

Select **Plans** on the left main menu to view your migration plans.

Click on a migration plan name to view its settings.

![Migration Plans Page](/vm-migration-assistant/additional-configuration_migration-plans-page.webp)

:::info

Settings cannot be changed for migration plans that are in progress or complete.

:::

### Details Tab

Perform the following steps to change a setting.

1. Click the pencil icon next to each value.

2. Adjust the value in the modal window.

   The configurable settings are described in the following table. Some of these are defined when you
   perform the steps in [Create Migration Plans](./create-migration-plans.md).

   #### Defined at Plan Creation

   | Setting                 | Description                                                                                                                                                                                                                                                                                                              |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Description**         | An optional description for your migration plan.                                                                                                                                                                                                                                                                         |
   | **Migration type**      | Choose whether this will be a warm or cold migration. A cold migration is when VMs are shut down at the start of migration. A warm migration is when active VMs are migrated while they are running and are shut down during the final switchover.                                                                      |
   | **Target namespace**    | Select the target namespace from the drop-down. The target namespace is where the VMs will be located on your VMO cluster after migration.                                                                                                                                                                               |
   | **Disk decryption**     | _The **Use network-bound disk encryption (NBDE/Clevis)** option is not supported._ <br /><br /> Provide a list of passphrases for [LUKS-encrypted devices](https://docs.fedoraproject.org/en-US/quick-docs/encrypting-drives-using-LUKS/#_encrypting_block_devices_using_dm_cryptluks) on the VMs you intend to migrate. |
   | **Shared disks**        | Choose whether to migrate shared disks. If you enable this option, ensure that your VMO cluster has access to the shared storage from the storage maps configured for the migration.                                                                                                                                     |
   | **Transfer network**    | Change the migration transfer network for this plan. If a migration transfer network is defined for the source provider and exists in the target namespace, it is used by default. Otherwise, the pod network is used.                                                                                                   |
   | **Preserve static IPs** | Choose whether to preserve the static IPs of the VMs migrated from vSphere.                                                                                                                                                                                                                                              |
   | **Root device**         | Choose the root filesystem to convert. By default, the first root device is chosen in multi-boot systems. You can specify a root device (for example, `/dev/sda1`) for multi-boot systems, but if it is not detected as a root device, the migration will fail.                                                          |

   #### Additional Configurable Settings

   | Setting                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
   | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Guest conversion mode**    | _This is defined at the Provider level with the **Convert disk** option, but can be overridden at the Plan level by using this setting._ <br /><br /> When enabled, disk conversion is handled using `virt-v2v`. For example, if you are migrating from VMware to VMO, `virt-v2v` can convert VMDK to raw or QEMU copy-on-write version 2 (qcow2) formats that are optimal for the target environment. When disabled, disks are transferred using raw copy mode. |
   | **VM target labels**         | Key-value pairs applied as [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) to the migrated VMs in the target namespace. Labels are useful for organizing VMs by environment, tier, or owner, and can be referenced by selectors, network policies, and other Kubernetes resources to identify and manage groups of migrated VMs.                                                                                                                                       |
   | **VM target affinity rules** | Defines [Kubernetes affinity and anti-affinity rules](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) for the migrated VMs. These rules control which nodes a VM can be scheduled on based on node labels or the presence of other VMs, and are useful for placement requirements such as pinning VMs to specific hardware or separating replicas across nodes for high availability.                                                                            |
   | **PVC name template**        | A [Go template](https://pkg.go.dev/text/template) string used to generate names for the Persistent Volume Claims (PVCs) created for each VM disk during migration. The template can reference variables such as the VM name (`.VmName`) and disk index (`.DiskIndex`). If not specified, a default naming convention is used.                                                                                                                                                                                         |
   | **Volume name template**     | A [Go template](https://pkg.go.dev/text/template) string used to generate names for the volumes (disk definitions) within each migrated VM. The template can reference variables such as the PVC name (`.PVCName`) and volume index (`.VolumeIndex`). If not specified, a default naming convention is used.                                                                                                                                                                                                          |
   | **Network name template**    | A [Go template](https://pkg.go.dev/text/template) string used to generate names for the network interfaces attached to the migrated VMs. The template can reference variables such as the network name (`.NetworkName`) and network index (`.NetworkIndex`). If not specified, a default naming convention is used.                                                                                                                                                                                                   |
   | **VM target power state**    | Specifies the desired power state of each VM after migration is complete. Options include powering the VM on, leaving it powered off, or matching the source VM's power state at the time of cutover.                                                                                                                                                                                                                                                                                                                 |
   | **VM target node selector**  | A set of key-value label pairs used as a [Kubernetes node selector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) to constrain which nodes the migrated VMs can be scheduled on. Only nodes matching all specified labels are eligible to run the migrated VMs. Use this to target specific hardware or node groups, such as nodes with GPU resources or a particular availability zone.                                                                                     |

3. Click **Save** after making changes.

### YAML Tab

The **YAML** tab displays a YAML editor for the plan resource.

View and edit the
[Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) YAML on this
tab.

### Virtual Machines Tab

The **Virtual Machines** tab displays a table of VMs from the migration plan.

You can view the status of your VM migrations in the **Pipeline status** column for each VM.

#### Remove VMs from Plan

:::info

If you only have one VM remaining in your plan, you must delete the plan instead. Deleting all VMs from a plan is not allowed.

:::

Perform the following steps to remove VMs from your plan. You cannot remove VMs from a plan if it is already in progress
or complete.

1. Click the checkbox next to each VM that you want to remove from the plan.

2. Click on **Delete virtual machines**.

3. Click **Delete** in the dialog window.

### Resources Tab

The **Resources** tab displays the total amount of CPU and memory resources that all VMs in the migration plan will
require in the target environment.

### Mappings tab

The **Mappings** tab displays the network and storage mappings for the migration plan. These are defined
when you perform the steps in [Create Migration Plans](./create-migration-plans.md).

#### Manage Mappings

1. Click **Edit** next to **Network map** or **Storage map**.

2. Adjust the current mapping by selecting a different option from the drop-downs.

   You can click **Add mapping** to add an additional mapping and delete existing mappings by clicking the minus icon
   next to each mapping.

3. Click **Save** after making changes.

### Hooks Tab

The **Hooks** tab displays the migration hooks for the migration plan. These are defined when you perform
the steps in [Create Migration Plans](./create-migration-plans.md).

#### Manage Hooks

1. Click **Edit** next to **Pre migration hook** or **Post migration hook**.

2. You can enable or disable the hook using the toggle. If you enable the hook, additional settings are displayed as
   described in the following table.

   | Setting               | Description                                                                                                                                                                                           | Example                       |
   | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
   | **Hook runner image** | Specify a repository and tag for the hook runner image or custom image. The hook runner is a container that runs your pre-migration and post-migration hooks.                                         | `quay.io/myrepo/hooks:latest` |
   | **Service account**   | Specify a service account for the hook runner to use. The service account must exist in your target namespace.                                                                                        | `hook-runner-service-account` |
    | **Ansible playbook**  | You can optionally provide an [Ansible playbook](https://ansible.readthedocs.io/projects/runner/en/stable/intro/) for the hook. You can only specify a playbook if you enter a **Hook runner image**. |         N/A                      |

3. Click **Save** after making changes.

## Network Maps

Select **Network maps** on the left main menu to view your network maps. A network map defines the mapping of source
networks to target networks, ensuring VM network interfaces are correctly connected in the destination environment.

Network maps are visible on this page once you have [created a migration plan](./create-migration-plans.md). Click on a
network plan name to view its details.

## Storage Maps

Select **Storage maps** on the left main menu to view your storage maps. A storage map defines the mapping of source
storage domains to target storage classes or datastores, ensuring VM disks are correctly placed in the destination
environment.

Storage maps are visible on this page once you have [created a migration plan](./create-migration-plans.md). Click on a
storage plan name to view its details.
