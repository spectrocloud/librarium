---
sidebar_label: "Migrate a VM to a VMO cluster"
title: "Migrate a VM to a VMO cluster"
description: "Learn how to migrate VMs to Palette VMO using the Palette CLI."
icon: " "
hide_table_of_contents: false
sidebar_position: 40
tags: ["vmo", "palette-cli"]
---

During large scale Kubernetes adoptions, workloads are often rehosted or migrated instead of being redeployed from
scratch. This process allows system administrators to copy the application, together with its data, to a Kubernetes
cluster. However, the migration of VMs can be time consuming if done manually, so it is often automated with open source
tools such as [Forklift](https://github.com/kubev2v/forklift).

The [Palette CLI](../../../automation/palette-cli/palette-cli.md) provides the ability to migrate Virtual Machines (VMs)
from VMware vSphere to Palette VMO.

## Limitations

- You can only migrate VMs hosted in VMware vSphere.
- Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.

- The network type <VersionedLink text="Multus CNI" url="/integrations/packs/?pack=cni-multus" /> requires a Network
  Attachment Definition (NAD) to exist in the migration target namespace in the destination cluster. The NAD name must
  also match the name assigned to the migration. The migration name is assigned during the wizard, which is started by
  the Palette CLI's `vmo migrate-vm` command.

## Prerequisites

- A Healthy VMO cluster. Refer to the [Create a VMO Profile](../../create-vmo-profile.md) for further guidance.

  - The VMO cluster must have access to VMware and the VM you want to migrate.

  :::warning

  If you need to provision `Block` storage volumes during the VM migration process, add the following custom
  configuration to your VMO cluster OS pack. Applying this configuration may cause a cluster repave. For more
  information, refer to
  [Repave Behaviors and Configurations](../../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration)

  Additionally, we recommend provisioning volumes with the `ReadWriteMany` access mode to ensure that VMs can be
  [live migrated](https://kubevirt.io/user-guide/compute/live_migration/#limitations).

  ```yaml
  kubeadmconfig:
     preKubeadmCommands:
        # Start containerd with new configuration
        - systemctl daemon-reload
        - systemctl restart containerd
     files:
        - targetPath: /etc/containerd/config.toml
        targetOwner: "root:root"
        targetPermissions: "0644"
        content: |
           ## template: jinja

           # Use config version 2 to enable new configuration fields.
           version = 2

           imports = ["/etc/containerd/conf.d/*.toml"]

           [plugins]
              [plugins."io.containerd.grpc.v1.cri"]
              sandbox_image = "registry.k8s.io/pause:3.9"
              device_ownership_from_security_context = true
              [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
              runtime_type = "io.containerd.runc.v2"
              [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
              SystemdCgroup = true
  ```

  :::

- A VMware vSphere user account with the necessary permissions to manage the VMs you want to migrate.
  - Migration can optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.
- One or more VMs hosted in VMware vSphere. Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.
  - The VMs must be powered off before migration.
  - Ensure that VMs operating Windows are shut down at the virtualized OS level.
  - If you are migrating more than one VM in the same plan, they must all share the same network.
- The Palette CLI installed and setup. Refer to the
  [Installation](../../../automation/palette-cli/install-palette-cli.md) guide for further details.
  - The Palette CLI must have access to both the VMO cluster and the machines to be migrated.
- The kubectl command-line tool should also be installed. Refer to the
  [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) guide to learn more.

## Migrate VMware vSphere VMs

1. Download the [Kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file of the VMO cluster to the host
   where the Palette CLI is installed.

2. Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

3. Optionally, create a namespace where your VM will be migrated. We recommend that you migrate a VM to a dedicated
   namespace.

   ```shell
   kubectl create namespaces <migration-namespace>
   ```

4. Execute the following command to start an interactive shell and begin the migration process to the cluster specified
   by the `KUBECONFIG` variable.

   ```shell
   palette vmo migrate-vm
   ```

   :::tip

   You can save your configuration to a file, allowing you to revise your configuration and perform the migration later.

   ```shell
   palette vmo migrate-vm --config-only
   ```

   :::

   The Palette CLI prompts you for information regarding the VM you want to migrate, vSphere environment, and resource
   configurations.

   | **Parameter**                                            | **Description**                                                                                                                                                                                                           | **Values**                                   |
   | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
   | **Migration Source Type**                                | The hypervisor configured on your migration VM.                                                                                                                                                                           | `vCenter` / `vCenter + ESXi host`            |
   | **Migration Name**                                       | The name of your migration and its corresponding configuration files. A default name is generated by the Palette CLI.                                                                                                     |                                              |
   | **Forklift Installation Type**                           | A cluster to be used for performing the migration. You can either choose to create a local cluster or use the destination cluster. [Forklift](https://github.com/kubev2v/forklift) is installed on the migration cluster. | `Local Kind Cluster` / `Destination Cluster` |
   | **Install Forklift?**                                    | Specify whether to install Forklift on the migration cluster.                                                                                                                                                             | `Y` / `n`                                    |
   | **Migration Namespace**                                  | Namespace where the migration VM is created. The namespace must exist on the cluster. You can enter the namespace you created earlier or use the `default` namespace.                                                     |                                              |
   | **vSphere Endpoint**                                     | Your vSphere endpoint. You can specify a Full Qualified Domain Name (FQDN) or an IP address. Make sure you specify the endpoint without the HTTP scheme `https://` or `http://`. Example: `vcenter.mycompany.com.`        |                                              |
   | **vSphere Username (with domain)**                       | Your vSphere account username.                                                                                                                                                                                            |                                              |
   | **vSphere Password**                                     | Your vSphere account password.                                                                                                                                                                                            |                                              |
   | **Allow Insecure Connection (Bypass x509 Verification)** | Enabling this option bypasses x509 CA verification. In production environments, enter `N` if using a custom registry with self-signed SSL certificates. Otherwise, enter `Y`.                                             | `Y`/`n`                                      |
   | **Datacenter**                                           | The vSphere data center of the VM to migrate.                                                                                                                                                                             |                                              |
   | **Cluster**                                              | The vSphere compute cluster of the VM to migrate.                                                                                                                                                                         |                                              |
   | **ESXi Hypervisor**                                      | The IP address of the node corresponding to the VM to migrate. If you have selected the `vCenter + ESXi host` migration source type, you will need to provide ESXi credentials.                                           |                                              |
   | **VM**                                                   | The VM to migrate from the selected host.                                                                                                                                                                                 |                                              |
   | **Add Another VM?**                                      | Indicate whether you want to select multiple VM from the vSphere environment.                                                                                                                                             | `Y` / `n`                                    |
   | **Add Another Host?**                                    | Indicate whether you would like to perform two migrations in the same configuration.                                                                                                                                      |                                              |
   | **Destination Network Type**                             | The network that the VMs will be mapped to in the VMO cluster.                                                                                                                                                            | `pod` / `multus`                             |
   | **Destination StorageClass**                             | The storage class on the destination that will be used to create the VM volumes.                                                                                                                                          |                                              |
   | **Destination StorageClass Access Mode**                 | The configured access mode on the cluster storage class.                                                                                                                                                                  | `ReadWriteOnce` / `ReadWriteMany`            |

5. The migration begins as soon as you complete the configuration. Execute the following command to watch the migration
   status. Replace the `<migration-name>` placeholder with the migration name you have configured.

   ```shell
   watch --interval 2 'kubectl --namespace konveyor-forklift get migrations.forklift.konveyor.io <migration-name>-migration'
   ```

   The migration with take approximately 20 minutes, depending on the size of the VM to migrate. Once the migration is
   complete, the `watch` command will output the following.

   ```shell
   Every 2.0s: kubectl --namespace konveyor-forklift get migrations.forklift.konveyor.io vmo-migration

   NAME           READY   RUNNING   SUCCEEDED   FAILED   AGE
   vmo-migration   True              True                 18m
   ```

## Validate

1. Log into [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Then, choose the VMO cluster that you migrated your VM to. The
   **Overview** tab appears.

3. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down Menu.
   Your migrated VM appears.

4. Click on the **three-dot Menu** and select **Start**. Your VM is now ready to use.

   ![Start migrated VM](/migrate-vm-kubevirt-guide/vm-management_create-manage-vm_migrate-vm-kubevirt_start_migrated_vm.webp)
