---
sidebar_label: "VMware vSphere Airgap Instructions"
title: "VMware vSphere Airgap Instructions"
description: "Learn how to install VerteX in an air gap environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "enterprise", "airgap", "vmware", "vsphere"]
keywords: ["self-hosted", "vertex"]
---


This guide provides instructions for preparing your airgap environment for a Palette VerteX installation, by ensuring you complete all the required preparatory steps shown in the diagram. The installation process is covered in the respective installation guides for each platform.


![Overview diagram of the pre-install steps eager-load](/vertex_airgap_vmware-vsphere-airgap-instructions_order-operations.png)




## Prepare Airgap Installation

Use the following steps to prepare your airgap environment for a VerteX installation. 

:::tip

Carefully review the [prerequisites](#prerequisites) section before proceeding. This will save you time and frustration. Each prerequisite is required for a successful installation.

:::

## Prerequisites


- Internet access to download the VerteX install OVA. For sensitive environments, you can download the OVA to a system with internet access and transfer the OVA to your airgap environment. The two following OVAs are required for the airgap installation:

  - An install OVA that deploys an initializes the airgap support VM.

  - An OVA that contains the Operating System and Kubernetes distribution required for the VerteX nodes. 


- 120 GB of disk space available for the airgap support VM.


- Dynamic Host Configuration Protocol (DHCP) is required for the airgap support VM so that you can access the VM with SSH. You can disable DHCP or modify the IP address after the airgap support VM is deployed.

- Review the required vSphere [permissions](../install-on-vmware/vmware-system-requirements.md). Ensure you have created the proper custom roles and zone tags. Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. Refer to [Zone Tagging](../install-on-vmware/install-on-vmware.md#vsphere-machine-configuration) for information.


<br />

:::info

Self-hosted VerteX installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection to VerteX. To learn how to install a PCG on VMware, check out the [VMware](../../../clusters/data-center/vmware.md) guide.

:::

<br />

## Instructions


Complete the following steps before deploying the airgap VerteX installation.

1. Log in to your vCenter environment.


2. Create a vSphere VM and Template folder with the name `spectro-templates`. Ensure this folder is accessible by the user account you will use to deploy the airgap VerteX installation.


3. Use the URL below to import the Operating System and Kubernetes distribution OVA required for the install. Place the OVA in the `spectro-templates` folder. Refer to the [Import Items to a Content Library](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-B413FBAE-8FCB-4598-A3C2-8B6DDA772D5C.html?hWord=N4IghgNiBcIJYFsAOB7ATgFwAQYKbIjDwGcQBfIA) guide for information about importing an OVA in vCenter.

  ```url
  https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-1268-fips.ova
  ```

4. Append an `r_` prefix to the OVA name after the import. For example, `r_u-2004-0-k-12510-fips.ova`. This prefix is required for the install process to identify the OVA. Refer to the [Supplement Packs](./supplemental-packs.md#additional-ovas) page for a list of additional OVAs you can download and upload to your vCenter environment.

  :::tip

  You can also use the **Deploy OVF Template** wizard in vCenter to make the OVA available in the `spectro-templates` folder. Append the `r_` prefix when assiging a name and target location. You can terminate the deployment after the OVA is available in the `spectro-templates` folder.
  :::

5. 



You now have completed the preparation steps for an airgap installation. Check out the [Validate](#validate) section to ensure the airgap setup process completed successfully.


## Validate

Use the following steps to validate the airgap setup process completed successfully.


1. Log in to your OCI registry and verify the VerteX images and packs are available. 


2. Verify the manifest file is accessible from the file server. The manifest file is required for the VerteX installation process. The screenshot below is an example of a file server hosting the unzipped manifest content. The example is using Caddy as the file server.

  ![Example of a file server hosting the unzipped manifest content](/enterprise-version_airgap_airgap-instructions_file-server-caddy.png)


3. Ensure your file server is accessible from the environment in which you are installing VerteX. Use the following command to verify the manifest content is accessible from the file server. Replace the hostname or IP address below with your file server hostname or IP address.

  ```shell
  curl http://<hostname>:<port>/roar/nickfury/versions.yaml
  ```

  ```yaml hideClipboard
    versions:
    - version: "3.3"
      filepath: "/roar/nickfury/3.3/version.yaml"
      patchVersionsFilepath: "/roar/nickfury/3.3/versions.yaml"
    - version: "3.4"
      filepath: "/roar/nickfury/3.4/version.yaml"
      patchVersionsFilepath: "/roar/nickfury/3.4/versions.yaml"
    - version: "4.0"
      filepath: "/roar/nickfury/4.0/version.yaml"
      patchVersionsFilepath: "/roar/nickfury/4.0/versions.yaml"
  ```

## Next Steps

You are now ready to deploy the airgap VerteX installation. You will specify your OCI registry and file server during the installation process. Refer to the [VMware Install Instructions](../install-on-vmware/install-on-vmware.md) guide for detailed guidance on installing VerteX. 