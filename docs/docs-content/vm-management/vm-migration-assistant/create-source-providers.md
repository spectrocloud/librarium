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

## Limitations

- You can migrate only VMs hosted in VMware vSphere 7.0 or 8.0.

- You can migrate only VMs whose operating systems are present in the
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) list. Refer to
  [Verified Migrations](./vm-migration-assistant.md#verified-migrations) for a list of operating systems and migration
  combinations verified by Spectro Cloud.

- If you are migrating more than one VM in the same plan, they must all share the same network.

- Open Virtual Appliance (OVA) files are not supported as a provider type for migrations.

## Prerequisites

<!-- prettier-ignore-start -->

- The <VersionedLink text="Virtual Machine Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> pack must be added to your cluster profile. Refer to [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md) for guidance.

<!-- prettier-ignore-end -->

- The VM Migration Assistant service console must be accessible from a web browser.

- A healthy Virtual Machine Orchestrator (VMO) cluster. Refer to the [Create a VMO Profile](../create-vmo-profile.md)
  for further guidance.

  - The VMO cluster must have network connectivity to vCenter and ESXi hosts, and the VMs you want to migrate.

- A vCenter user account with the following necessary privileges to perform migrations.

  | **Privileges**                                                                                                                                                                                                            | **Description**                                                                                                                                                                                         |
  | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | [**Virtual Machine Interaction Privileges** (all)](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security-8-0/defined-privileges/virtual-machine-interaction-privileges.html)                | Allow creating, cloning, modifying, customizing, and managing templates, virtual machines, their files, and customization specifications, as well as performing disk and deployment-related operations. |
  | **[Virtual machine.Snapshot management.Create snapshot](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security-8-0/defined-privileges/virtual-machine-snapshot-management-privileges.html)** | Allows capturing the current state of a virtual machine as a snapshot.                                                                                                                                  |
  | **[Virtual machine.Snapshot management.Remove Snapshot](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-security-8-0/defined-privileges/virtual-machine-snapshot-management-privileges.html)** | Permits deletion of a snapshot from the snapshot history.                                                                                                                                               |

  - Migrations can be optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.

- One or more VMs hosted in VMware vSphere.

  - For cold migrations, ensure that VMs operating Windows are shut down at the guest OS level.
  - For warm migrations,
    [Changed Block Tracking](https://knowledge.broadcom.com/external/article/315370/enabling-or-disabling-changed-block-trac.html)
    must be enabled on your VMs.

- We recommend providing a
  [VMware Virtual Disk Development Kit (VDDK) image](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest)
  for the migration. This will significantly speed up the migration. The migration engine uses VDDK on the destination
  VMO cluster to read virtual disks from the source environment, transfer the data, and write it to the target storage.

  - You must build and host the VDDK image in your own image registry, which must be accessible to the destination VMO
    cluster for migrations.

    <!-- prettier-ignore-start -->

    <details>

    <summary> Example steps to build and upload VDDK image </summary>

    <Tabs>

    <TabItem label="Non-Airgap" value="non-airgap">

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

    1.  Download the VDDK image from the
        [Broadcom Developer Portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest).

    2.  Copy or move the VDDK image to another Linux environment inside your airgap environment. Use any approved method
        to transfer the binary to the airgap environment.

    3.  Log in to the Linux environment inside your airgap environment where you copied the VDDK image.

    4.  Decompress the downloaded image.

        ```shell
        tar -xzf VMware-vix-disklib-<version>.x86_64.tar.gz
        ```

    5.  Create a Dockerfile to build the VDDK image.

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

    6.  Authenticate with your OCI registry. The following examples are for Harbor and AWS ECR.

           <Tabs groupId="oci-registry">

           <TabItem label="Harbor" value="harbor">

             Use `oras` to log in to your OCI registry. Replace `<username>` and `<password>` with your registry credentials, and

        replace `<harbor-address>` with your Harbor hostname / IP address. Check out the
        [oras login](https://oras.land/docs/commands/oras_login) documentation for information about additional CLI
        flags and examples.

             ```shell
             oras login <harbor-address> --username '<username>' --password '<password>'
             ```

             If you are using a Harbor registry with a self-signed certificate, you will need to add the `--insecure` flag to the
             `oras` command.

             ```shell
             oras login <harbor-address> --insecure --username '<username>' --password '<password>'
             ```

           </TabItem>

           <TabItem label="AWS ECR" value="aws-ecr">

             You can acquire the AWS ECR authentication command from the AWS ECR console. From the ECR repository details page,
             click on the **View push commands** button to access the command. Refer to the
             [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
             documentation for more information.

             Use the following command to authenticate with AWS ECR. The output of the `aws` command is passed to `oras` to
             authenticate with the ECR registry. Replace `<username>` with your registry username and `<aws-ecr-url>` with your
             registry URL. Enter your registry password when prompted.

             ```shell
             aws ecr get-login-password --region xxxxx | oras login --username <username> --password-stdin <aws-ecr-url>
             ```

             For a public image repository, use the `docker` CLI instead of using `oras`. Replace `<username>` with your registry
             username and `<aws-ecr-url>` with your registry URL. Enter your registry password when prompted.

             ```shell
             aws ecr-public get-login-password --region xxxxx | docker login --username <username> --password-stdin <aws-ecr-url>
             ```

           </TabItem>

           </Tabs>

    7.  Build the image.

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

    8.  Push the built image to your image registry.

        <Tabs groupId="oci-registry">

        <TabItem label="Harbor" value="harbor">

             Replace `<harbor-address>` with your Harbor hostname / IP address, `<project-name>` with the target project name in
             Harbor, and `<tag>` with your chosen image tag.

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

        <!-- prettier-ignore-start -->

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

        <!-- prettier-ignore-end -->

## Create Source Provider

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Providers for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

   If you want to create a new namespace, click **Create Namespace**. Provide the **Name**, **Labels**, and select the
   **Default network policy** in the drop-down Menu. After filling in the details, click **Create**.

4. Click **Create Provider**.

5. Select your provider type and click **Create provider**.

6. Fill in the provider details.

   :::warning

   The Open Virtual Appliance (OVA) provider type is not supported.

   :::

   | Setting                         | Description                                                                                                                                                                                                                                                                                                                                                   |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Provider resource name**      | A unique name for your provider.                                                                                                                                                                                                                                                                                                                              |
   | **Endpoint type**               | Select the type of endpoint to configure the connection. Choose **vCenter** if managing multiple hosts through a central server, or **ESXi** if connecting directly to a standalone host.                                                                                                                                                                     |
   | **URL**                         | Your vSphere / ESXi API endpoint for the SDK. You can specify a Full Qualified Domain Name (FQDN) or an IP address. For example, `https://vcenter.mycompany.com/sdk`.                                                                                                                                                                                         |
   | **VDDK init image**             | Provide the registry URL to the VMware Virtual Disk Development Kit (VDDK) image, or select **Skip VMware Virtual Disk Development Kit (VDDK) SDK acceleration, migration may be slow.**. If providing an image, make sure you specify the registry URL without the HTTP scheme `https://` or `http://`. For example, `docker.io/myorganization/vddk:v8.0.3`. |
   | **Username**                    | Your vSphere / ESXi account username. For example, `user@vsphere.local`.                                                                                                                                                                                                                                                                                      |
   | **Password**                    | Your vSphere / ESXi account password.                                                                                                                                                                                                                                                                                                                         |
   | **Skip certificate validation** | Enabling this option bypasses x509 CA verification. In production environments, do not enable if you are using a custom registry with self-signed SSL certificates, as the certificate can be provided in the next setting.                                                                                                                                   |
   | **CA certificate**              | Upload or drag and drop the CA certificate for your vSphere / ESXi. You can also use the **Fetch certificate from URL** option if your CA certificate is not third party or self-managed.                                                                                                                                                                     |
   | **Convert Disk**                | When enabled, disk conversion is handled using virt-v2v. For example, if you're migrating from VMware vSphere to VMO, virt-v2v can convert Virtual Machine Disk (VMDK) to raw or QEMU copy-on-write version 2 (qcow2) formats that are optimal for the target environment.                                                                                    |

7. Click **Create Provider**. The provider details are then shown.

8. If you need to change a setting, click the pencil icon next to each value and adjust it in the pop-up window. Click
   **Save** after making changes.

If you want to explore additional settings, refer to the
[Additional Configuration - Provider Settings](./additional-configuration.md#provider-settings) for guidance.

## Validate

1. [Access the VM Migration Assistant service console](./create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Providers for virtualization**.

3. In the top-left corner, use the **Namespace** drop-down Menu to select your Kubernetes namespace for the migration.

4. In the table, click on a provider name to view the provider details.

5. In the **Details** tab, the provider status displays as **Ready**.

   ![Provider Ready Status](/vm-management_vm-migration-assistant_migrate-vms-vmo-cluster_provider-ready.webp)

## Next Steps

You can now create migration plans in the VM Migration Assistant. Refer to the
[Create Migration Plans](./create-migration-plans.md) guide to start creating your plans.

## Resources

- [Create VM Migration Assistant Profile](./create-vm-migration-assistant-profile.md)
- [Additional Configuration](./additional-configuration.md)
