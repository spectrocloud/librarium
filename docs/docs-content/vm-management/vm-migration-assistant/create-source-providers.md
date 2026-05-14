---
sidebar_label: "Create Source Providers"
title: "Create Source Providers"
description: "Learn how to create source providers using the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm migration assistant"]
---

Follow this guide to create source providers using the VM Migration Assistant. Source providers host the Virtual
Machines (VMs) that need to be migrated.

## Prerequisites

<!-- prettier-ignore-start -->

- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.

<!-- prettier-ignore-end -->

- The VM Migration Assistant service console must be accessible from a web browser.

- A healthy Virtual Machine Orchestrator (VMO) cluster. Refer to the [Create a VMO Profile](../create-vmo-profile.md)
  for further guidance.

  - The VMO cluster must have network connectivity to vCenter and ESXi hosts, and the VMs you want to migrate.

- A vCenter user account with the following necessary privileges to perform migrations.

  | **Privileges**                                                                                                                                                                                                        | **Description**                                                                                                                                                                                         |
  | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | [**Virtual Machine Interaction Privileges** (all)](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security/defined-privileges/virtual-machine-interaction-privileges.html)                | Allow creating, cloning, modifying, customizing, and managing templates, virtual machines, their files, and customization specifications, as well as performing disk and deployment-related operations. |
  | **[Virtual machine.Snapshot management.Create snapshot](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security/defined-privileges/virtual-machine-snapshot-management-privileges.html)** | Allows capturing the current state of a virtual machine as a snapshot.                                                                                                                                  |
  | **[Virtual machine.Snapshot management.Remove Snapshot](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security/defined-privileges/virtual-machine-snapshot-management-privileges.html)** | Permits deletion of a snapshot from the snapshot history.                                                                                                                                               |

  - If you want to browse resources using the vCenter UI, you may require additional privileges. Refer to the
    [Required vCenter Server Privileges for Common Tasks](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security/vsphere-permissions-and-user-management-tasks/required-privileges-for-common-tasks.html)
    documentation for more information.

  - Migrations can be optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.

- One or more VMs hosted in VMware vSphere 7.0 or 8.0. The VM's OS must be present in the [virt-v2v supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) list. 

  - For cold migrations, ensure that VMs operating Windows are shut down at the guest OS level.
  - For warm migrations,
    [Changed Block Tracking](https://knowledge.broadcom.com/external/article/315370/enabling-or-disabling-changed-block-trac.html)
    must be enabled on your VMs.

- A
  [VMware Virtual Disk Development Kit (VDDK) image](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/8.0)
  is required for migrations. The migration engine uses VDDK on the destination VMO cluster to read virtual disks from
  the source environment, transfer the data, and write it to the target storage.

  - The VDDK version used must be **8.0.2.1** or earlier.

  - You must build and host the VDDK image in your own image registry, which must be accessible to the destination VMO
    cluster for migrations.

    <!-- prettier-ignore-start -->

    <details>

    <summary> Example steps to build and upload VDDK image </summary>

    <Tabs>

    <TabItem label="Non-Airgap" value="non-airgap">

    1. Download the VDDK image from the
       [Broadcom Developer Portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/8.0).

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

       Replace the `<myregistry/myrepository:tag>` with your chosen base image registry, repository, and tag (for
       example: `ubuntu:22.04`).

    4. Build the image.

       ```shell
       docker buildx build --platform linux/amd64 --tag <docker-registry>/vddk:<tag> .
       ```

    5. Push the built image to your image registry.

       ```shell
       docker push <docker-registry>/vddk:<tag>
       ```

    </TabItem>

    <TabItem label="Airgap" value="airgap">

    1. Download the VDDK image from the
       [Broadcom Developer Portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/8.0).

    2. Copy or move the VDDK image to another Linux environment inside your airgap environment.

    3. Log in to the Linux environment inside your airgap environment where you copied the VDDK image.

    4. Decompress the downloaded image.

       ```shell
       tar -xzf VMware-vix-disklib-<version>.x86_64.tar.gz
       ```

    5. Create a Dockerfile to build the VDDK image.

       ```shell
       cat > Dockerfile <<EOF
       FROM <myregistry/myrepository:tag>
       USER 1001
       COPY vmware-vix-disklib-distrib /vmware-vix-disklib-distrib
       RUN mkdir -p /opt
       ENTRYPOINT ["cp", "-r", "/vmware-vix-disklib-distrib", "/opt"]
       EOF
       ```

       Replace the `<myregistry/myrepository:tag>` with your chosen base image registry, repository, and tag (for
       example: `ubuntu:22.04`).

    6. Authenticate with your OCI registry. The following examples are for Harbor and AWS ECR.

       <Tabs groupId="oci-registry">

       <TabItem label="Harbor" value="harbor">

       Use `oras` to log in to your OCI registry. Replace `<username>` and `<password>` with your registry credentials,
       and replace `<harbor-address>` with your Harbor hostname / IP address. Check out the
       [oras login](https://oras.land/docs/commands/oras_login) documentation for information about additional CLI flags
       and examples.

       ```shell
       oras login <harbor-address> --username '<username>' --password '<password>'
       ```

       If you are using a Harbor registry with a self-signed certificate, add the `--insecure` flag to the `oras`
       command.

       ```shell
       oras login <harbor-address> --insecure --username '<username>' --password '<password>'
       ```

       </TabItem>

       <TabItem label="AWS ECR" value="aws-ecr">

       Acquire the AWS ECR authentication command from the AWS ECR console. From the ECR repository details page, click
       on the **View push commands** button to access the command. Refer to the
       [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
       documentation for more information.

       Use the following command to authenticate with AWS ECR. The output of the `aws` command is passed to `oras` to
       authenticate with the ECR registry. Replace `<username>` with your registry username and `<aws-ecr-url>` with
       your registry URL. Enter your registry password when prompted.

       ```shell
       aws ecr get-login-password --region xxxxx | oras login --username <username> --password-stdin <aws-ecr-url>
       ```

       For a public image repository, use the `docker` CLI instead of `oras`. Replace `<username>` with your registry
       username and `<aws-ecr-url>` with your registry URL. Enter your registry password when prompted.

       ```shell
       aws ecr-public get-login-password --region xxxxx | docker login --username <username> --password-stdin <aws-ecr-url>
       ```

       </TabItem>

       </Tabs>

    7. Build the image.

       <Tabs groupId="oci-registry">

       <TabItem label="Harbor" value="harbor">

       Replace `<harbor-address>` with your Harbor hostname / IP address, `<project-name>` with the target project name
       in Harbor, and `<tag>` with your chosen image tag.

       ```shell
       docker buildx build --platform linux/amd64 --tag <harbor-address>/<project-name>/vddk:<tag> .
       ```

       </TabItem>

       <TabItem label="AWS ECR" value="aws-ecr">

       Replace `<aws-ecr-url>` with your registry URL and `<tag>` with your chosen image tag.

       ```shell
       docker buildx build --platform linux/amd64 --tag <aws-ecr-url>:<tag> .
       ```

       </TabItem>

       </Tabs>

    8. Push the built image to your image registry.

       <Tabs groupId="oci-registry">

       <TabItem label="Harbor" value="harbor">

       Replace `<harbor-address>` with your Harbor hostname / IP address, `<project-name>` with the target project name
       in Harbor, and `<tag>` with your chosen image tag.

       ```shell
       docker push <harbor-address>/<project-name>/vddk:<tag>
       ```

       </TabItem>

       <TabItem label="AWS ECR" value="aws-ecr">

       Replace `<aws-ecr-url>` with your registry URL and `<tag>` with your chosen image tag.

       ```shell
       docker push <aws-ecr-url>:<tag>
       ```

       </TabItem>

       </Tabs>

    </TabItem>

    </Tabs>

    </details>

    <!-- prettier-ignore-end -->

  - If you are using a private image registry, you must create a Secret to be used for the migration. The Secret must be
    created in the namespace where the VMs will be migrated to, and the `metadata.name` value must be
    `vddk-image-pull-secret`.

    <details>

    <summary> Example Secret Creation </summary>

    You can create a Secret by issuing the following command.

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
      .dockerconfigjson: #base64-encoded dockerconfigjson
    type: kubernetes.io/dockerconfigjson
    ```

    The `data.dockerconfigjson` value contains your registry credentials, which have been base64-encoded by the command.

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

## Create Source Provider

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Providers**, then click **Create provider** in the top-right corner.

3. On the **Create provider** page, select the **Provider namespace** from the drop-down.

   The provider namespace is the Kubernetes namespace where the provider credentials and configuration will be stored.
   This should be the same namespace where you plan to migrate your VMs to.

4. Select the **VMware vSphere** from the **Provider type** drop-down. Once you select a provider type, additional
   fields appear. The following table describes the details to fill in for the provider.

   :::warning

   The Open Virtual Appliance (OVA) provider type is not supported.

   :::

   #### Provider Settings

   | Setting                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
   | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Provider name**                                                        | A unique name for your provider.                                                                                                                                                                                                                                                                                                                                                                                   |
   | **vSphere endpoint**                                                     | Select the type of endpoint to configure the connection. Choose **vCenter** if managing multiple hosts through a central server, or **ESXi** if connecting directly to a standalone host.                                                                                                                                                                                                                          |
   | **API endpoint URL**                                                     | Your vSphere / ESXi API endpoint for the software development kit (SDK). You can specify a Fully Qualified Domain Name (FQDN) or an IP address. For example, `https://vcenter.mycompany.com/sdk`.                                                                                                                                                                                                                  |
   | **Virtual Disk Development Kit (VDDK) setup**                            | Select the option to **Manually specify the VDDK image URL**. A VDDK image is required for VM migrations. Refer to the [Prerequisites](#prerequisites) for more information.                                                                                                                                                                                                                                       |
   | **Upload a VDDK archive to generate the image URL**                      | _Unsupported method_.                                                                                                                                                                                                                                                                                                                                                                                               |
   | **Manually specify the VDDK image URL**                                  | Provide the registry URL to the VDDK image in the **VDDK init image** field. Specify the registry URL without the HTTP scheme `https://` or `http://`. For example, `docker.io/myorganization/vddk:v8.0.3`.                                                                                                                                                                                                        |
   | **Use VMware Virtual Disk Development Kit (VDDK) async IO Optimization** | When enabled, this option uses asynchronous input/output operations to process multiple disk read/write requests simultaneously during VM migration, rather than sequentially. This can significantly improve disk transfer speeds, particularly for environments with high-latency storage or high-bandwidth networks, but increases memory usage on the VMware ESXi host's Network File Copy (NFC) server.                |
   | **Convert Disk**                                                         | When enabled, disk conversion is handled using virt-v2v. For example, if you are migrating from VMware vSphere to VMO, virt-v2v can convert Virtual Machine Disk (VMDK) to raw or QEMU copy-on-write version 2 (qcow2) formats that are optimal for the target environment. When disabled, disks are transferred using raw copy mode. This option appears after the [Provider Credentials](#provider-credentials). |

   #### Provider Credentials

   | Setting                              | Description                                                                                               |
   | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
   | **Username**                         | Your vSphere / ESXi account username. For example, `user@vsphere.local`.                                  |
   | **Password**                         | Your vSphere / ESXi account password.                                                                     |
   | **Certificate validation**           | **Configure certificate validation** for your vSphere / ESXi provider or **Skip certificate validation**. |
   | **Configure certificate validation** | Upload or drag and drop the certificate authority (CA) certificate for your vSphere / ESXi.                                       |
   | **Skip certificate validation**      | Enabling this option bypasses x509 CA verification.                               |

5. Click **Create Provider**.

6. On the provider details page, if you need to change a setting, click the pencil icon next to each value and adjust it
   in the pop-up window. Click **Save** after making changes.

If you want to explore additional settings, refer to
[Additional Configuration - Provider Settings](./additional-configuration.md#provider-settings) for guidance.

## Validate

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left main menu, select **Providers**.

3. All namespaces are displayed by default. If you want to view a specific namespace, use the **Namespace** drop-down
   in the top-left corner to select your Kubernetes namespace for the migration.

4. Find your provider in the table and click the provider name to view its details. You can use the table filters to
   help locate your provider if needed.

5. On the **Details** tab, the provider status displays as **Ready**.

   ![Provider Ready Status](/vm-migration-assistant/create-source-providers_provider-ready.webp)

   If the provider status is not **Ready**, check the **Conditions** section in the **Details** tab for any failed
   conditions.

## Next Steps

- You can now create migration plans in the VM Migration Assistant. Refer to the
  [Create Migration Plans](./create-migration-plans.md) guide to start creating your plans.

- If you want to explore additional provider settings, refer to the
  [Additional Configuration - Provider Settings](./additional-configuration.md#provider-settings) for guidance.
