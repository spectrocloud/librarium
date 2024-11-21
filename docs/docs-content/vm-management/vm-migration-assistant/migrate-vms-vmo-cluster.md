---
sidebar_label: "Migrate VMs to a VMO cluster"
title: "Migrate VMs to a VMO cluster using the VM Migration Assistant"
description: "Learn how to migrate VMs to Palette VMO using the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm migration assistant"]
#toc_max_heading_level: 4
---

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
       FROM registry.access.redhat.com/ubi8/ubi-minimal
       USER 1001
       COPY vmware-vix-disklib-distrib /vmware-vix-disklib-distrib
       RUN mkdir -p /opt
       ENTRYPOINT ["cp", "-r", "/vmware-vix-disklib-distrib", "/opt"]
       EOF
       ```

    4. Build the image.

       ```shell
       docker buildx build --platform linux/amd64 --tag <docker-registry>/vddk:<tag> .
       ```

    5. Push the built image to your image registry.

       ```shell
       docker push <docker-registry>/vddk:<tag>
       ```

    Refer to the
    [Creating a VDDK image](https://docs.redhat.com/en/documentation/migration_toolkit_for_virtualization/2.6/html/installing_and_using_the_migration_toolkit_for_virtualization/prerequisites_mtv#creating-vddk-image_mtv)
    documentation for additional guidance.

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

## Migrate VMware vSphere VMs

To migrate VMs to VMO, perform the steps in the [Create Source Providers](#create-source-providers) section to add your
source providers for the VMs.

Once complete, perform the steps in the [Create Migration Plans](#create-and-start-migration-plans) section to plan and
execute migrations.

### Create Source Providers

Complete the following steps for each source provider.

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
   | **Username**                    | Your vSphere / ESXi account username.                                                                                                                                                                                                                                                                                                                         |
   | **Password**                    | Your vSphere / ESXi account password.                                                                                                                                                                                                                                                                                                                         |
   | **Skip certificate validation** | Enabling this option bypasses x509 CA verification. In production environments, do not enable if you are using a custom registry with self-signed SSL certificates, as the certificate can be provided in the next setting.                                                                                                                                   |
   | **CA certificate**              | Upload or drag and drop the CA certificate for your vSphere / ESXi. You can also use the **Fetch certificate from URL** option if your CA certificate is not third party or self-managed.                                                                                                                                                                     |

   </TabItem>

   <TabItem label="Open Virtual Appliance (OVA)" value="ova">

   | Setting                    | Description                                                                                                                                                                                            |
   | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Provider resource name** | A unique name for your provider.                                                                                                                                                                       |
   | **URL**                    | The URL and path to your NFS shared directory containing the Open Virtual Appliance (OVA) files. You can specify a Full Qualified Domain Name (FQDN) or an IP address. For example, `10.10.0.10:/ova`. |

   </TabItem>

   </Tabs>

7. Click **Create Provider**.

After successful validation of the provider, the provider details are shown. If anything is incorrect or you need to
change something, click the **Actions** drop-down in the top-right corner, and select the available options as needed.

### Create and Start Migration Plans

1. Log in to the VM Migration Assistant.

2. From the left **Main Menu**, select **Plans for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

4. In the top-right corner, click **Create Plan**.

5. Click on your source provider to select it, the **Select virtual machines** table appears.

6. For each VM that you want to migrate, click the checkbox next to the VM name. You can use the filters at the top of
   the table to help you search.

7. Once you have selected your VMs, click **Next**.

8. Fill in the migration plan details.

   | Setting              | Description                                                                   |
   | -------------------- | ----------------------------------------------------------------------------- |
   | **Plan name**        | A unique name for your migration plan.                                        |
   | **Target provider**  | Select the target provider from the drop-down Menu.                           |
   | **Target namespace** | Select the target namespace for the VM migration from the drop-down Menu.     |
   | **Network map**      | Add or remove additional network maps, or leave the default mapping in place. |
   | **Storage map**      | Add or remove additional storage maps, or leave the default mapping in place. |

9. Click **Create migration plan**.

   The plan details are then validated. If anything is incorrect or you need to change something, click the **Actions**
   drop-down in the top-right corner, and select the available options as needed.

10. Once the **Status** field displays **Ready** in the **Plan details**, click **Start migration** in the top-right
    corner.

11. Click **Start** in the pop-up window.

Wait until the **Status** shows as **Successful** before [validating](#validate) the migration.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Then, choose the VMO cluster that you migrated your VM to. The
   **Overview** tab appears.

3. Select the **Virtual Machines** tab. Then, select your migration namespace from the **Namespace** drop-down Menu.
   Your migrated VM appears.

4. Click on the **three-dot Menu** and select **Start**. Your VM is now ready to use.

   ![Start migrated VM](/migrate-vm-kubevirt-guide/vm-management_create-manage-vm_migrate-vm-kubevirt_start_migrated_vm.webp)

## Resources

- [Additional Configuration](./additional-configuration.md)