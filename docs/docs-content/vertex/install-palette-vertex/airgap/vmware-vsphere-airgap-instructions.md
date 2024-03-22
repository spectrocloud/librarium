---
sidebar_label: "VMware vSphere Airgap Instructions"
title: "VMware vSphere Airgap Instructions"
description: "Learn how to install VerteX in an air gap environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "enterprise", "airgap", "vmware", "vsphere"]
---

![Overview diagram of the pre-install steps eager-load](/enterprise-version_air-gap-repo_overview-order-diagram-focus.webp)

This guide provides instructions for preparing your airgap environment for a Palette VerteX installation, by ensuring
you complete all the required preparatory steps 1 and 2 shown in the diagram. The installation process is covered in the
respective installation guides for each platform.

## Prepare Airgap Installation

Use the following steps to prepare your airgap environment for a VerteX installation.

:::tip

Carefully review the [prerequisites](#prerequisites) section before proceeding. This will save you time and frustration.
Each prerequisite is required for a successful installation.

:::

The following diagram offers a general overview of the steps you will complete to prepare your airgap environment for
VerteX.

![Overview diagram of the pre-install steps eager-load](/vertex_airgap_vmware-vsphere-airgap-instructions_order-operations.webp)

## Prerequisites

- An x86 Linux jumpbox or bastion host with connectivity to the target platform where you are installing VerteX.

- 30 GB of disk space available for the airgap setup binary and temporary files. The uncompressed airgap content is
  approximately 20 GB.

- An OCI registry such as [Harbor](https://goharbor.io/) or [AWS ECR](https://aws.amazon.com/ecr/) to store VerteX
  images and packages. The OCI registry must be accessible from the VMware vSphere environment. We have verified the
  installation against Harbor and AWS ECR. Other OCI registries may work but have not been tested.

  :::warning

  Ensure the OCI registries are set up with HTTPS. AWS ECR is enabled with HTTPS by default. Harbor requires you to
  enable HTTPS. If you are using Harbor, you must enable HTTPS to authenticate with the registry. Refer to the
  [Harbor](https://goharbor.io/docs/2.9.0/install-config/configure-https) documentation for guidance.

  :::

- An HTTP file server to host the VerteX manifest. The file server must be accessible from the target environment where
  VerteX will be installed. Below is a list of common HTTP file servers:

  - [Apache HTTP Server](https://httpd.apache.org/)

  - [Nginx](https://www.nginx.com/)

  - [Caddy](https://caddyserver.com/)

  <br />

  :::warning

  Take the necessary steps to secure your file server and ensure it can automatically recover from a failure. The file
  server is a critical component of the airgap installation and must be available post-install for VerteX to function
  properly.

  :::

- jq - Command-line JSON processor installed and available. Refer to the [jq](https://jqlang.github.io/jq/download/)
  download page for guidance.

- To interact with the OCI registry, you must have the following tools installed and available.

  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - Required for AWS ECR.

  - [Oras](https://oras.land/docs/installation.html) CLI v1.0.0 - This version is explicitly required for the setup
    script.

  - [zip](https://linux.die.net/man/3/zip) - required for the setup script.

  - [unzip](https://linux.die.net/man/1/unzip) - or equivalent for extracting the manifest content from the airgap setup
    binary.

- Palette CLI installed and available. Refer to the Palette CLI
  [Install](../../../palette-cli/install-palette-cli.md#download-and-setup) page for guidance.

- Review the required vSphere [permissions](../install-on-vmware/vmware-system-requirements.md). Ensure you have created
  the proper custom roles and zone tags. Zone tagging is required for dynamic storage allocation across fault domains
  when provisioning workloads that require persistent storage. Refer to
  [Zone Tagging](../install-on-vmware/vmware-system-requirements.md) for information.

<br />

:::info

Self-hosted VerteX installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not
require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into
remote data centers that do not have a direct incoming connection to VerteX. To learn how to install a PCG on VMware,
check out the [VMware](../../../clusters/data-center/vmware.md) guide.

:::

<br />

## Instructions

Complete the following steps before deploying the airgap VerteX installation.

1. Log in to your vCenter environment.

2. Create a vSphere VM and Template folder with the name `spectro-templates`. Ensure this folder is accessible by the
   user account you will use to deploy the airgap VerteX installation.

3. Use the URL below to import the Operating System and Kubernetes distribution OVA required for the install. Place the
   OVA in the `spectro-templates` folder. Refer to the
   [Import Items to a Content Library](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-B413FBAE-8FCB-4598-A3C2-8B6DDA772D5C.html?hWord=N4IghgNiBcIJYFsAOB7ATgFwAQYKbIjDwGcQBfIA)
   guide for information about importing an OVA in vCenter.

```url
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-12510-fips.ova
```

4. Append an `r_` prefix to the OVA name after the import. For example, `r_u-2004-0-k-12510-fips.ova`. This prefix is
   required for the install process to identify the OVA. Refer to the
   [Supplement Packs](./supplemental-packs.md#additional-ovas) page for a list of additional OVAs you can download and
   upload to your vCenter environment.

5. In your OCI registry, create a repository with the name `spectro-packs` and ensure the repository is private. This
   repository will host the VerteX Packs.

   - Refer to the [Create Projects](https://goharbor.io/docs/2.0.0/working-with-projects/create-projects/) guide for
     information about creating a repository in Harbor.
   - Refer to the [Create a repository](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html)
     guide for information about creating a repository in AWS ECR.

6. In your OCI registry, create another repository with the name `spectro-images` and ensure the repository is public.
   The repositry will host VerteX images.

7. Download the Certificate Authority (CA) for your OCI registry. You will need to provide the CA during the
   installation process. Otherwise, you may encounter errors when authenticating with the OCI registry, which could
   result in an incomplete install.

8. Log in to the Linux environment where you will download the airgap binaries and complete the remaining steps,
   including the VerteX installation.

9. Authenticate with your OCI registry and acquire credentials to both repositories you created earlier. You will need
   these credentials when deploying the airgap VerteX installation.

  <Tabs groupId="oci-registry"> 
  <TabItem label="Harbor" value="harbor">

Use `oras` to log in to your OCI registry. Replace the values below with your environment configuration values. Check
out the [oras login](https://oras.land/docs/commands/oras_login) documentation for information about additional CLI
flags and examples.

```shell
oras login X.X.X.X --user 'yourUserNameHere' --password 'yourPasswordHere'
```

    ![View of the OVF deploy wizard](/vertex_airgap_vmware-vsphere-airgap-instructions_ovf-wizard.webp)

```shell
oras login X.X.X.X --insecure --user 'yourUserNameHere' --password 'yourPasswordHere'
```

  </TabItem>
  <TabItem label="AWS ECR" value="aws-ecr">

You can acquire the AWS ECR authentication command from the AWS ECR console. From the ECR repository details page, click
on the **View push commands** button to access the command. Refer to the
[AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
documentation for more information.

Below is the command you will use to authenticate to AWS ECR. The output of the `aws` command is passed to `oras` to
authenticate with the ECR registry. Replace the values below with your environment configuration values.

```shell
aws ecr get-login-password --region xxxxx | oras login --username AWS --password-stdin 1234567890.dkr.ecr.us-east-1.amazonaws.com
```

For the public image repository, use the `docker` CLI instead of using `oras`. Replace the values below with your
environment configuration values.

```shell
aws ecr-public get-login-password --region xxxxx | docker login --username AWS --password-stdin public.ecr.aws/xxxxxxx
```

  </TabItem>
  </Tabs>

:::tip

Be aware of the timeout period for the authentication token. The process of uploading images and packages to the OCI
registry can take a approximately an hour. If the authentication token expires, you will need to re-authenticate to the
OCI registry and restart the upload process.

:::

---

10. The airgap setup binary requires a set of environment variables to be available and populated. The environment
    variables will be different depending on the OCI registry you are using. Select the OCI registry and populate the
    environment variables accordingly.

  <Tabs groupId="oci-registry">
  <TabItem label="Harbor" value="harbor">

<br />

    - `OCI_IMAGE_REGISTRY`: The IP address or domain name of the OCI registry.
    - `OCI_PACK_BASE`: The namespace or repository name that hosts the VerteX Packs.
    - `OCI_PACK_REGISTRY`: The IP address or domain name of the OCI registry.
    - `OCI_IMAGE_BASE`: The namespace or repository name that hosts the VerteX images.

    ```shell
    export OCI_IMAGE_REGISTRY=<harbor-endpoint>
    export OCI_PACK_BASE=spectro-packs
    export OCI_PACK_REGISTRY=<harbor-endpoint>
    export OCI_IMAGE_BASE=spectro-images
    ```

    Example

    ```shell hideClipboard
    export OCI_IMAGE_REGISTRY=example.internal.com
    export OCI_PACK_BASE=spectro-packs
    export OCI_PACK_REGISTRY=10.10.100.48
    export OCI_IMAGE_BASE=spectro-images
    ```

  </TabItem>
  <TabItem label="AWS ECR" value="aws-ecr">

<br />

    - `ECR_IMAGE_REGISTRY`: The IP address or domain name of the public OCI registry for images.
    - `ECR_IMAGE_BASE`: The namespace or repository name that hosts the VerteX images.
    - `ECR_IMAGE_REGISTRY_REGION`: The AWS region where the ECR registry is located.
    - `ECR_PACK_BASE`: The namespace or repository name that hosts the VerteX Packs.
    - `ECR_PACK_REGISTRY`: The IP address or domain name of the OCI registry.
    - `ECR_PACK_REGISTRY_REGION`: The AWS region where the ECR registry is located.

    ```shell
    export ECR_IMAGE_REGISTRY=<ecr-endpoint>
    export ECR_IMAGE_BASE=spectro-images
    export ECR_IMAGE_REGISTRY_REGION=us-east-1
    export ECR_PACK_REGISTRY=<ecr-endpoint>
    export ECR_PACK_BASE=spectro-packs
    export ECR_PACK_REGISTRY_REGION=us-east-1
    ```

    Example

    ```shell hideClipboard
    export ECR_IMAGE_REGISTRY=public.ecr.aws/1234567890
    export ECR_IMAGE_BASE=spectro-images
    export ECR_IMAGE_REGISTRY_REGION=us-east-1
    export ECR_PACK_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com
    export ECR_PACK_BASE=spectro-packs
    export ECR_PACK_REGISTRY_REGION=us-east-1
    ```

  </TabItem>
  </Tabs>

---

11. Download the airgap setup binary. Replace the placeholder values in the commands below with the recommended version
    and credentials that our support team provides.

```shell
VERSION=X.X.X
```

```shell
curl --user XXXXX:YYYYYYY https://software-private.spectrocloud.com/airgap-fips/$VERSION/airgap-fips-v$VERSION.bin  \
--output airgap-fips-v$VERSION.bin
```

12. Update the airgap setup binary permissions to allow execution. Replace the file name below with the name of the
    airgap setup binary you downloaded.

```shell
chmod +x airgap-fips-v$VERSION.bin
```

13. Start the airgap setup binary. Replace the file name below with the name of the airgap setup binary you downloaded.

```shell
./airgap-fips-v$VERSION.bin
```

Upon completion, a success message will be displayed. The output is condensed for brevity.

    ```shell hideClipboard {10}
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Setup - Version 4.0.17  100%
    Setting up Packs
    - Pushing Pack cni-calico:3.25.1
    ...
    Setting up Images
    - Pushing image docker.io/kindest/kindnetd:v20230227-15197099
    - Pushing image gcr.io/cloud-provider-vsphere/cpi/release/manager:v1.22.8
    .....
    Preparing Manifests Archive
    Manifests are available in /tmp/spectro-manifests-1696971110.zip. Extract the archive to a file server to serve as a Spectro Cloud Repository
    Setup Completed
    ```

:::info

If you encounter an error during the airgap setup process, verify the required environment variables are set and
populated correctly. If you are still having issues, reach out to our support team for assistance.

:::

14. Move the manifest file located in your temporary directory to the location of your file server. Unzip the manifest
    file to a folder accessible by the file server. Replace the file name below with the name of the manifest file
    provided to you by the airgap setup.

    ```shell
    unzip spectro-manifests-XXXXXXXXXXXX.zip -d /target/folder
    ```

    :::tip

    If you want to get started quickly with a file server, install
    [Caddy](https://caddyserver.com/docs/quick-starts/static-files) or use Python3's
    [http sever](https://docs.python.org/3/library/http.server.html) and issue one of the following commands in the
    folder where you unzipped the manifest content. Each command will start a file server on port 2015.

    ```shell
    caddy file-server --listen :2015 --browse
    ```

    ```shell
    python3 -m http.server 2015
    ```

    We do not recommend serving the manifest content over HTTP, but it is an option if you want to get started quickly.
    For production workloads, enable HTTPS on your file server.

    :::

15. Review the additional packs available for download. The supplemental packs are optional and not required for a
    successful installation. However, to create cluster profiles you may require several of the packs available for
    download. Refer to the [Additional Packs](supplemental-packs.md) resource for a list of available packs.

16. Once you select the packs you want to install, download the pack binaries and start the binary to initiate the
    upload process.

In the example below, the `airgap-fips-pack-amazon-linux-eks-1.0.0.bin` binary is downloaded and started.

```shell
chmod +x airgap-fips-pack-amazon-linux-eks-1.0.0.bin && \
./airgap-fips-pack-amazon-linux-eks-1.0.0.bin
```

```shell hideClipboard
  Verifying archive integrity...  100%   MD5 checksums are OK. All good.
  Uncompressing Airgap Pack - amazon-linux-eks Version 4.0.17  100%
  Setting up Packs
  - Pushing Pack amazon-linux-eks:1.0.0
  Setup Completed
```

17. Repeat step 16 for each pack you want to install.

You now have completed the preparation steps for an airgap installation. Check out the [Validate](#validate) section to
ensure the airgap setup process completed successfully.

## Validate

Use the following steps to validate the airgap setup process completed successfully.

1. Log in to your OCI registry and verify the VerteX images and packs are available.

2. Verify the manifest file is accessible from the file server. The manifest file is required for the VerteX
   installation process. The screenshot below is an example of a file server hosting the unzipped manifest content. The
   example is using Caddy as the file server.

   ![Example of a file server hosting the unzipped manifest content](/enterprise-version_airgap_airgap-instructions_file-server-caddy.webp)

3. Ensure your file server is accessible from the environment in which you are installing VerteX. Use the following
   command to verify the manifest content is accessible from the file server. Replace the hostname or IP address below
   with your file server hostname or IP address.

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

You are now ready to deploy the airgap VerteX installation. You will specify your OCI registry and file server during
the installation process. Refer to the [VMware Install Instructions](../install-on-vmware/install-on-vmware.md) guide
for detailed guidance on installing VerteX.
