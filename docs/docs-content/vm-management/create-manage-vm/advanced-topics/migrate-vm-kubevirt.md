---
sidebar_label: "Migrate a VM to a VMO cluster using the Palette CLI"
title: "Migrate a VM to a VMO cluster using the Palette CLI"
description: "Learn how to migrate VMs from VMware vSphere to Palette VMO using the Palette CLI"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "palette cli"]
#toc_max_heading_level: 4
---

:::info

We recommend using the [VM Migration Assistant](../../vm-migration-assistant/vm-migration-assistant.md) instead of this
method for new migrations.

:::

This migration method uses the [Palette CLI](../../../automation/palette-cli/palette-cli.md).

## Limitations

- You can migrate only VMs hosted in VMware vSphere 7.0 or 8.0.

- You can migrate only VMs whose operating systems are present in the
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) list. Refer to
  [Verified Migrations](../../vm-migration-assistant/vm-migration-assistant.md#verified-migrations) for a list of
  operating systems and migration combinations verified by Spectro Cloud.

- If you are migrating more than one VM in the same plan, they must all share the same network.

## Prerequisites

- A healthy VMO cluster. Refer to the [Create a VMO Profile](../../create-vmo-profile.md) for further guidance.

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

- A vCenter user account with the following necessary privileges to perform migrations.

  | **Privileges**                                                                                                                                                                          | **Description**                                                                                                                                                                                         |
  | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **[Virtual machine.Interaction.Power Off](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-3D47149A-947D-4608-88B3-E5811129EFA8.html)**               | Allows shutting down a powered-on virtual machine, powering down its guest operating system.                                                                                                            |
  | **[Virtual machine.Interaction.Power On](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-3D47149A-947D-4608-88B3-E5811129EFA8.html)**                | Enables starting a powered-off virtual machine or resuming a suspended one.                                                                                                                             |
  | [**Virtual Machine Interaction Privileges**](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-3D47149A-947D-4608-88B3-E5811129EFA8.html)              | Allow creating, cloning, modifying, customizing, and managing templates, virtual machines, their files, and customization specifications, as well as performing disk and deployment-related operations. |
  | **[Virtual machine.Snapshot management.Create snapshot](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-222FE721-0968-4E9E-9F98-7CB03E7185E8.html)** | Allows capturing the current state of a virtual machine as a snapshot.                                                                                                                                  |
  | **[Virtual machine.Snapshot management.Remove Snapshot](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-222FE721-0968-4E9E-9F98-7CB03E7185E8.html)** | Permits deletion of a snapshot from the snapshot history.                                                                                                                                               |

  - Migrations can be optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.

- One or more VMs hosted in VMware vSphere.

  - The VMs must be powered off before migration.
  - Ensure that VMs operating Windows are shut down at the virtualized OS level.

- The Palette CLI installed and setup. Refer to the
  [Installation](../../../automation/palette-cli/install-palette-cli.md) guide for further details.
  - The Palette CLI must have access to both the VMO cluster and the machines to be migrated.
- The kubectl command-line tool should also be installed. Refer to the
  [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) guide to learn more.
- We recommend providing a
  [VMware Virtual Disk Development Kit (VDDK) image](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest)
  for the migration. This will significantly speed up the migration. The migration engine uses VDDK on the destination
  VMO cluster to read virtual disks from the source environment, transfer the data, and write it to the target storage.

  - You must build and host the VDDK image in your own image registry, which must be accessible to the destination VMO
    cluster for migrations.

    <!--prettier-ignore-->
    <details>
    <summary> Example steps to build and upload VDDK image </summary>

    1. Download the VDDK image from the
       [Broadcom Developer Portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest).

    2. Decompress the downloaded image.

       ```shell
       tar -xzf VMware-vix-disklib-<version>.x86_64.tar.gz
       ```

    3. Create a Dockerfile to build the VDDK image.

       ```shell
       cat > Dockerfile <<EOF
       FROM <myregistry/myrepository:tag>
       USER 1001
       COPY vmware-vix-disklib-distrib /vmware-vix-disklib-distrib
       RUN mkdir -p /opt
       ENTRYPOINT ["cp", "-r", "/vmware-vix-disklib-distrib", "/opt"]
       EOF
       ```

       Replace the `<myregistry/myrepository:tag>` with your chosen base image registry/repository (for example:
       `alpine:latest`).

    4. Build the image.

       ```shell
       docker buildx build --platform linux/amd64 --tag <docker-registry>/vddk:<tag> .
       ```

    5. Push the built image to your image registry.

       ```shell
       docker push <docker-registry>/vddk:<tag>
       ```

    </details>

  - If you are using a private image registry, you must create a Secret to be used for the migration. The Secret must be
    in the form of a YAML file and the `metadata.name` value must be `vddk-image-pull-secret`. The `metadata.namespace`
    value should be left blank or omitted, as the Palette CLI will automatically populate it.

    <!--prettier-ignore-->
    <details>
    <summary> Example Secret Creation </summary>

    A Secret can be created by issuing the following command.

    ```shell
    kubectl create secret docker-registry vddk-image-pull-secret \
    --docker-server=myRegistryServer \
    --docker-username=myUsername \
    --docker-password=myPassword \
    --docker-email=myEmail \
    --kubeconfig=/path/to/myKubeconfig \
    --output yaml > image-pull-secret.yaml
    ```

    This creates the `image-pull-secret.yaml` file in your working directory.

    ```yaml hideClipboard
    apiVersion: v1
    kind: Secret
    metadata:
      name: vddk-image-pull-secret
    data:
      .dockerconfigjson: #base64 encoded dockerconfigjson
    type: kubernetes.io/dockerconfigjson
    ```

    The `data.dockerconfigjson` value contains your registry credentials, which have been base64 encoded by the command.

    Alternatively, you can manually encode a `config.json` by issuing the following command.

    ```shell
    cat path/to/config.json | base64 --wrap=0
    ```

    ```text hideClipboard title="Example output"
    eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    ```

    You can then use this output to create your own Secret manually. Ensure that the `metadata.name` is set to
    `vddk-image-pull-secret`, and the `metadata.namespace` is left blank or omitted.

    Refer to the
    [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
    and
    [kubectl create secret docker-registry](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_docker-registry/)
    documentation for additional guidance.

    </details>

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
   kubectl create namespace <migration-namespace>
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

   | **Parameter**                                                      | **Description**                                                                                                                                                                                                           | **Values**                                   |
   | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
   | **Migration Source Type**                                          | The hypervisor configured on your migration VM.                                                                                                                                                                           | `vCenter` / `vCenter + ESXi host`            |
   | **Migration Name**                                                 | The name of your migration and its corresponding configuration files. A default name is generated by the Palette CLI.                                                                                                     |                                              |
   | **Forklift Installation Type**                                     | A cluster to be used for performing the migration. You can either choose to create a local cluster or use the destination cluster. [Forklift](https://github.com/kubev2v/forklift) is installed on the migration cluster. | `Local Kind Cluster` / `Destination Cluster` |
   | **Install Forklift?**                                              | Specify whether to install Forklift on the migration cluster.                                                                                                                                                             | `Y` / `n`                                    |
   | **KUBECONFIG path**                                                | The local filesystem path to the kubeconfig for your destination cluster. For example, `~/path/to/mycluster.kubeconfig`.                                                                                                  |                                              |
   | **Migration Namespace**                                            | Namespace where the migration VM is created. The namespace must exist on the cluster. You can enter the namespace you created earlier or use the `default` namespace.                                                     |                                              |
   | **vSphere Endpoint**                                               | Your vSphere endpoint. You can specify a Full Qualified Domain Name (FQDN) or an IP address. Make sure you specify the endpoint without the HTTP scheme `https://` or `http://`. For example, `vcenter.mycompany.com`.    |                                              |
   | **vSphere Username (with domain)**                                 | Your vSphere account username.                                                                                                                                                                                            |                                              |
   | **vSphere Password**                                               | Your vSphere account password.                                                                                                                                                                                            |                                              |
   | **Allow Insecure Connection (Bypass x509 Verification)**           | Enabling this option bypasses x509 CA verification. In production environments, enter `N` if using a custom registry with self-signed SSL certificates. Otherwise, enter `Y`.                                             | `Y`/`n`                                      |
   | **Use VDDK (recommended)?**                                        | Specify whether to provide a VMware Virtual Disk Development Kit (VDDK) image.                                                                                                                                            | `Y` / `n`                                    |
   | **VDDK image**                                                     | Provide the registry URL to the VDDK image. Make sure you specify the registry URL without the HTTP scheme `https://` or `http://`. For example, `docker.io/myorganization/vddk:v8.0.3`.                                  |                                              |
   | **VDDK image pull secret file path (optional, hit enter to skip)** | If your VDDK image is hosted on a private registry, provide the local filesystem path to your image pull secret file. For example, `~/path/to/image-pull-secret.yaml`.                                                    |                                              |
   | **Datacenter**                                                     | The vSphere data center of the VM to migrate.                                                                                                                                                                             |                                              |
   | **Cluster**                                                        | The vSphere compute cluster of the VM to migrate.                                                                                                                                                                         |                                              |
   | **ESXi Hypervisor**                                                | The IP address of the node corresponding to the VM to migrate. If you have selected the `vCenter + ESXi host` migration source type, you will need to provide ESXi credentials.                                           |                                              |
   | **VM**                                                             | The VM to migrate from the selected host.                                                                                                                                                                                 |                                              |
   | **Add Another VM?**                                                | Indicate whether you want to select multiple VM from the vSphere environment.                                                                                                                                             | `Y` / `n`                                    |
   | **Add Another Host?**                                              | Indicate whether you would like to perform two migrations in the same configuration.                                                                                                                                      |                                              |
   | **Destination Network Type**                                       | The network that the VMs will be mapped to in the VMO cluster.                                                                                                                                                            | `pod` / `multus`                             |
   | **Destination StorageClass**                                       | The storage class on the destination that will be used to create the VM volumes.                                                                                                                                          |                                              |
   | **Destination StorageClass Access Mode**                           | The configured access mode on the cluster storage class.                                                                                                                                                                  | `ReadWriteOnce` / `ReadWriteMany`            |

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

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Then, choose the VMO cluster that you migrated your VM to. The
   **Overview** tab appears.

3. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down Menu.
   Your migrated VM appears.

4. Click on the **three-dot Menu** and select **Start**. Your VM is now ready to use.

   ![Start migrated VM](/migrate-vm-kubevirt-guide/vm-management_create-manage-vm_migrate-vm-kubevirt_start_migrated_vm.webp)
