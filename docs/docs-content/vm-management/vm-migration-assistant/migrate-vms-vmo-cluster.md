---
sidebar_label: "Migrate VMs to a VMO cluster"
title: "Migrate VMs to a VMO cluster"
description: "Learn how to migrate VMs to Palette VMO using the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm migration assistant"]
---

Follow this guide to create source providers and migrate your VMs to your VMO cluster.

## Limitations

- You can only migrate VMs hosted in VMware vSphere.
- Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.

## Prerequisites

- A healthy VMO cluster. Refer to the [Create a VMO Profile](../create-vmo-profile.md) for further guidance.

  - The VMO cluster must have access to VMware and the VMs you want to migrate.

  :::warning

  If you need to provision `Block` storage volumes during the VM migration process, add the following custom
  configuration to your VMO cluster OS pack. Applying this configuration may cause a cluster repave. For more
  information, refer to
  [Repave Behaviors and Configurations](../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration)

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
  - Migration can be optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.
- One or more VMs hosted in VMware vSphere. Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.

  - If you are migrating more than one VM in the same plan, they must all share the same network.
  - For cold migrations, ensure that VMs operating Windows are shut down at the virtualized OS level.
  - For warm migrations,
    [Changed Block Tracking](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vddk-programming-guide/GUID-7B12E618-7851-4BD3-8E39-819454D8C016.html)
    must be enabled on your VMs.

<!--prettier-ignore-->
- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant-pack"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.
  - The VM Migration Assistant service console must be accessible from a web browser.

- We recommend providing a
  [VMware Virtual Disk Development Kit (VDDK) image](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest)
  for the migration. This will significantly speed up the migration.

  - The VDDK image must be built and uploaded to your image registry before starting the migration.

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

       Replace the `<myregistry/myrepository:tag>` with your chosen base image registry/repository (for example: `alpine:latest`).

    4. Build the image.

       ```shell
       docker buildx build --platform linux/amd64 --tag <docker-registry>/vddk:<tag> .
       ```

    5. Push the built image to your image registry.

       ```shell
       docker push <docker-registry>/vddk:<tag>
       ```

    </details>

  - The migration host must have access to your image registry.
  - If you are using a private image registry, you must create a Secret to be used for the migration. The Secret must be
    created in the namespace where the VMs will be migrated to, and the `metadata.name` value must be
    `vddk-image-pull-secret`.

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
    --namespace=myVmMigrationNamespace \
    --output yaml
    ```

    This creates the Secret named `vddk-image-pull-secret` in your destination cluster under the namespace provided.
    Ensure that this namespace matches the one you have chosen for the VM migration.

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
    `vddk-image-pull-secret`.

    Refer to the
    [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
    and
    [kubectl create secret docker-registry](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_docker-registry/)
    documentation for additional guidance.

    </details>

## Migrate VMs

### Create Source Provider

1. Log in to the VM Migration Assistant.

2. From the left **Main Menu**, select **Providers for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

   If you want to create a new namespace, click **Create Namespace**. Provide the **Name**, **Labels**, and select the
   **Default network policy** in the drop-down Menu. After filling in the details, click **Create**.

4. Click **Create Provider**.

5. Select your provider type and click **Create provider**.

6. Fill in the provider details.

   <Tabs  groupId="provider-type">

   <TabItem label="VM vSphere" value="vm-vsphere">

   | Setting                         | Description                                                                                                                                                                                                                                                                                                                                                   |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Provider resource name**      | A unique name for your provider.                                                                                                                                                                                                                                                                                                                              |
   | **Endpoint type**               | Select the type of endpoint to configure the connection. Choose **vCenter** if managing multiple hosts through a central server, or **ESXi** if connecting directly to a standalone host.                                                                                                                                                                     |
   | **URL**                         | Your vSphere / ESXi API endpoint for the SDK. You can specify a Full Qualified Domain Name (FQDN) or an IP address. For example, `https://vcenter.mycompany.com/sdk`.                                                                                                                                                                                         |
   | **VDDK init image**             | Provide the registry URL to the VMware Virtual Disk Development Kit (VDDK) image, or select **Skip VMware Virtual Disk Development Kit (VDDK) SDK acceleration, migration may be slow.**. If providing an image, make sure you specify the registry URL without the HTTP scheme `https://` or `http://`. For example, `docker.io/myorganization/vddk:v8.0.3`. |
   | **Username**                    | Your vSphere / ESXi account username. For example, `user@VSPHERE.LOCAL`.                                                                                                                                                                                                                                                                                      |
   | **Password**                    | Your vSphere / ESXi account password.                                                                                                                                                                                                                                                                                                                         |
   | **Skip certificate validation** | Enabling this option bypasses x509 CA verification. In production environments, do not enable if you are using a custom registry with self-signed SSL certificates, as the certificate can be provided in the next setting.                                                                                                                                   |
   | **CA certificate**              | Upload or drag and drop the CA certificate for your vSphere / ESXi. You can also use the **Fetch certificate from URL** option if your CA certificate is not third party or self-managed.                                                                                                                                                                     |

   </TabItem>

   <TabItem label="Open Virtual Appliance (OVA)" value="ova">

   :::warning

   The Open Virtual Appliance (OVA) provider type is not supported.

   :::

   </TabItem>

   </Tabs>

7. Click **Create Provider**. The provider details are then shown.

8. The provider details have been successfully validated once the provider status displays as **Ready**.

   ![Provider Ready Status](/vm-management_vm-migration-assistant_migrate-vms-vmo-cluster_provider-ready.webp)

9. If you need to change a setting, click the pencil icon next to each value and adjust it in the pop-up window. Click
   **Save** after making changes.

10. If you want to explore additional settings, refer to the
    [Additional Configuration - Provider Settings](./additional-configuration.md#provider-settings) for guidance.

### Create Migration Plan

1. Log in to the VM Migration Assistant.

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

4. In the top-right corner, click **Create Plan**.

5. Click on your source provider to select it, the **Select virtual machines** table appears.

6. For each VM that you want to migrate, click the checkbox next to the VM name. You can use the filters at the top of
   the table to help you search.

7. Once you have selected your VMs, click **Next**.

8. Fill in the migration plan details.

   | Setting              | Description                                                                                                    | Example                                    |
   | -------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
   | **Plan name**        | A unique name for your migration plan.                                                                         | `myMigrationPlan`                          |
   | **Target provider**  | Select the target provider from the drop-down Menu. By default, this will be your host cluster.                | `host`                                     |
   | **Target namespace** | Select the target namespace for the VM migration from the drop-down Menu.                                      | `myVmMigrationNamespace`                   |
   | **Network map**      | The source provider to target provider network map. Adjust the mapping, or leave the default mapping in place. | `VM-NETWORK` / `Pod Networking`            |
   | **Storage map**      | The source provider to target provider storage map. Adjust the mapping, or leave the default mapping in place. | `vsanDatastore1` / `spectro-storage-class` |

9. Click **Create migration plan**.

10. The plan details have been successfully validated once the plan status displays as **Ready**.

   <!-- ![Plan Ready Status](/vm-management_vm-migration-assistant_migrate-vms-vmo-cluster_plan-ready.webp) -->

11. Review the **Details** tab and check that the following settings are configured to your requirements.

    If you need to change a setting, click the pencil icon next to each value and adjust it in the pop-up window. Click
    **Save** after making changes.

    | Setting                         | Description                                                                                                                                                                                                                                                     |
    | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Warm migration**              | Choose whether this will be a warm or cold migration. A cold migration is when VMs are shut down at the start of migration. A warm migration is when VMs are shut down during the final switchover.                                                             |
    | **Target namespace**            | The target namespace for the migrated VMs.                                                                                                                                                                                                                      |
    | **Disk decryption passphrases** | Provide a list of passphrases for [LUKS-encrypted devices](https://docs.fedoraproject.org/en-US/quick-docs/encrypting-drives-using-LUKS/#_encrypting_block_devices_using_dm_cryptluks) on the VMs you intend to migrate.                                        |
    | **Transfer Network**            | Change the migration transfer network for this plan. If a migration transfer network is defined for the source provider and exists in the target namespace, it is used by default. Otherwise, the pod network is used.                                          |
    | **Preserve static IPs**         | Choose whether to preserve the static IPs of the VMs migrated from vSphere.                                                                                                                                                                                     |
    | **Root device**                 | Choose the root filesystem to convert. By default, the first root device is chosen in multi-boot systems. You can specify a root device (for example, `/dev/sda1`) for multi-boot systems, but if it is not detected as a root device, the migration will fail. |

    If you want to explore all additional plan settings, refer to the
    [Additional Configuration - Plan Settings](./additional-configuration.md#plan-settings) for guidance.

### Start Migration Plan

1. Once the **Status** field displays **Ready** in the **Plan details**, click **Start migration** in the top-right
   corner.

2. Click **Start** in the pop-up window.

3. Click on the **Virtual Machines** tab.

4. In the table, view the status of the migration for each VM in the **Pipeline status** column.

   Wait until the **Status** shows as **Successful** before [validating](#validate) the migration.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Then, choose the VMO cluster that you migrated your VMs to. The
   **Overview** tab appears.

3. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down Menu.
   Your migrated VMs appear.

4. For each migrated VM, click on the **three-dot Menu** and select **Start**. Your VMs are now ready to use.

   ![Start migrated VM](/migrate-vm-kubevirt-guide/vm-management_create-manage-vm_migrate-vm-kubevirt_start_migrated_vm.webp)

## Cancel Active Migration

### Prerequisites

- An active migration plan.

### Cancel VM Migration

1. Log in to the VM Migration Assistant.

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

4. Click on the active migration plan name to view its details.

5. Click on the **Virtual Machines** tab.

6. Select the VMs that you want to stop from migrating.

7. Click **Cancel**.

8. Click **Yes, cancel** to confirm the cancellation.

### Validate

1. Log in to the VM Migration Assistant.

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

4. Click on the migration plan name to view its details.

5. Click on the **Virtual Machines** tab.

6. In the table, check that the migration status for each VM is **Cancelled**.

## Resources

- [Additional Configuration](./additional-configuration.md)
