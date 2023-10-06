---
sidebar_label: "Airgap Instructions"
title: "Install in an Air Gap Environment"
description: "Learn how to install Palette into an air gap environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["self-hosted", "enterprise", "air-gap"]
---

You can install a self-hosted version of Palette into a VMware vSpheres environment without direct internet access. This type of installation is referred to as an *air gap* installation. 

In a standard Palette installation, the following artifacts are downloaded by default from the public Palette repository.

* Palette platform manifests and required platform packages.


* Container images for core platform components and 3rd party dependencies.


* Palette Packs.


The installation process for an airgap install is different due to the lack of internet access. Before the primary Palette installation step, you must download the three required Palette artifacts mentioned above. The other significant change is that Palette's default public OCI registry is not used. Instead, a private OCI registry is utilized storing images and packs.

The following diagram outlines the major install steps for an airgap installation.


![An architecture diagram outlining the five different install phases](/enterprise-version_air-gap-repo_overview-order-diagram.png)

1. Download the airgap setup binary from the support team. The airgap setup binary is a self-extracting archive that contains the Palette platform manifests, images, and required packs. The airgap setup binary is used to upload the Palette images, and packs to your OCI registry.The airgap setup binary is a one-time use binary. You will not use the airgap setup binary again after the initial installation.

2. Extract the manifest content from the airgap setup binary. The manifest content is hosted on a file server.

3. Install Palette using the Palette CLI. The Palette CLI is used to install Palette into your vSphere environment. 

4. Configure your Palette environment.


This guide will provide instructions for how to prepare your airgap environment for a Palette installation, by ensuring you complete all the required preperatory steps (step 1 -3). The actual installation process is covered in the [Install on VMware](../install-on-vmware/install-on-vmware.md) guide.


## Prepare Airgap Installation

Use the following steps to prepare your airgap environment for a Palette installation. 

:::tip

Carefully review the [prerequisites](#prerequisites) section before proceeding. This will save you time and frustration. Each prerequisite listed is required for a successful installation.

:::

### Prerequisites


- An AMD64 Linux environment with connectivity to the VMware vSphere environment. 


- 30 GB of disk space available for the airgap setup binary and temporary files. The airgap content uncompessed is approximately 20 GB. 

- An OCI registry such as [Harbor](https://goharbor.io/) or [AWS ECR](https://aws.amazon.com/ecr/) to store Palette images and packages. The OCI registry must be accessible from the VMware vSphere environment. We have verified the installation against Harbor and AWS ECR. Other OCI registries may work but have not been tested.

  :::caution

    Ensure the OCI registries are set up with HTTPS. AWS ECR is enabled with HTTPS by default. Harbor requires you to enable HTTPS. If you are using Harbor, you must enable HTTPS to authenticate with the registry 
    Refer to the [Harbor](https://goharbor.io/docs/2.9.0/install-config/configure-https) documentation for guidance.
  :::


- A file server to host the Palette manifest. The file server must be accessible from the VMware vSphere environment. Below is a list of common file servers:
  - [Apache HTTP Server](https://httpd.apache.org/)

  - [Nginx](https://www.nginx.com/)

  - [Caddy](https://caddyserver.com/)


- jq - Command-line JSON processor installed and available. Refer to the [jq](https://jqlang.github.io/jq/download/) download page for guidance. 


- To interact with the OCI registry, you must have the following tools installed and available. 

  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - Required for AWS ECR.

  - [Oras](https://oras.land/docs/installation.html) - Required for the setup script.


- Palette CLI installed and available. Refer to the Palette CLI [Install](../../../palette-cli/install-palette-cli.md#download-and-setup) page for guidance.


- Review the required VMware vSphere [permissions](vmware-system-requirements.md). Ensure you have created the proper custom roles and zone tags. Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. Refer to [Zone Tagging](../install-on-vmware/install-on-vmware.md#vsphere-machine-configuration) for information.


<br />

:::info

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the Palette console. To learn how to install a PCG on VMware, check out the [VMware](../../../clusters/data-center/vmware.md) guide.

:::

<br />

### Preperation

Complete the following steps before deploying the air gapped Palette installation.

1. Log in to your vCenter environment.


2. Create a vSphere VM and Template folder with the name `spectro-templates`. Ensure this folder is accessible by the user account you will use to deploy the air gapped Palette installation.


3. Use the URL below to import the Operating System and Kubernetes distribution OVA required for the install. Place the OVA in the `spectro-templates` folder. Refer to the [Import Items to a Content Library](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-B413FBAE-8FCB-4598-A3C2-8B6DDA772D5C.html?hWord=N4IghgNiBcIJYFsAOB7ATgFwAQYKbIjDwGcQBfIA) guide for information about importing an OVA in vCenter.

  ```url
  https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12510-0.ova
  ```

4. Append an `r_` prefix to the OVA name after the import. For example, `r_u-2204-0-k-12510-0.ova`. This prefix is required for the install process to identify the OVA.


5. In your OCI registry, create a repository with the name `spectro-packs` and ensure the repository is private. This repository will host the Palette Packs. Refer to the [Create Projects](https://goharbor.io/docs/2.0.0/working-with-projects/create-projects/) guide for information about creating a repository in Harbor. Refer to the [Create a repository](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html) guide for information about creating a repository in AWS ECR.

6. In your OCI registry, create another repository with the name `spectro-images` and ensure the repository is public. The repositry will host Palette images.

7. Authenticate with your OCI registry and aquire credentials to both respositories you created earlier. You will need these credentials when deploying the air gapped Palette installation. 

  <Tabs groupId="oci-registry"> 
  <TabItem label="Harbor" value="harbor">

  Use `oras` to login to your OCI registry. Replace the values below with your environment configuration values. Check out the [oras login](https://oras.land/docs/commands/oras_login) documentation for information about additional CLI flags and examples.

  ```shell
  oras login X.X.X.X --user 'yourUserNameHere' --password 'yourPasswordHere' 
  ```

  </TabItem>
  <TabItem label="AWS ECR" value="aws-ecr">

  You can aquire the AWS ECR authentication command from the AWS ECR console. From the ECR repository details page, click on the **View push commands** button to access the command. Refer to the [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry) documentation for more information.

  Below is the command you will use to authenticate to AWS ECR. The output of the `aws` command is passed to `oras` to authenticate with the ECR registry. Replace the values below with your environment configuration values.

  ```shell
  aws ecr get-login-password --region xxxxx | oras login --username AWS --password-stdin 1234567890.dkr.ecr.us-east-1.amazonaws.com
  ```

  For the public image repository, use the `docker` CLI instead of using `oras`. Replace the values below with your environment configuration values.

  ```shell
  aws ecr-public get-login-password --region xxxxx | docker login --username AWS --password-stdin public.ecr.aws/xxxxxxx
  ```

  </TabItem>
  </Tabs>

  :::tip

  Be aware of the timeout period for the authentication token. The process of uploading images and packages to the OCI registry can take a approximatly an hour. If the authentication token expires, you will need to reauthenticate to the OCI registry and restart the upload process.

  :::

---

8. The airgap setup binary require a set of environment variables to be available and populated. Depending on what OCI registry you are using, the environment variables will be different. Select the OCI registry you are using and populate the environment variables accordingly.

  <Tabs groupId="oci-registry">
  <TabItem label="Harbor" value="harbor">

  <br />

    - `OCI_IMAGE_REGISTRY`: The IP address or domain name of the OCI registry.
    - `OCI_PACK_BASE`: The namespace or repository name that hosts the Palette Packs.
    - `OCI_PACK_REGISTRY`: The IP address or domain name of the OCI registry.
    - `OCI_IMAGE_BASE`: The namespace or repository name that hosts the Palette images.

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
    - `ECR_IMAGE_BASE`: The namespace or repository name that hosts the Palette images.
    - `ECR_IMAGE_REGISTRY_REGION`: The AWS region where the ECR registry is located.
    - `ECR_PACK_BASE`: The namespace or repository name that hosts the Palette Packs.
    - `ECR_PACK_REGISTRY`: The IP address or domain name of the OCI registry.
    - `ECR_PACK_REGISTRY_REGION`: The AWS region where the ECR registry is located.

    ```shell
    export ECR_IMAGE_REGISTRY=<ecr-endpoint>
    export ECR_IMAGE_BASE=airgap-packs
    export ECR_IMAGE_REGISTRY_REGION=us-east-1
    export ECR_PACK_REGISTRY=<ecr-endpoint>
    export ECR_PACK_BASE=airgap-images
    export ECR_PACK_REGISTRY_REGION=us-east-1
    ```

    Example

    ```shell hideClipboard
    export ECR_IMAGE_REGISTRY=public.ecr.aws/1234567890
    export ECR_IMAGE_BASE=docs-images
    export ECR_IMAGE_REGISTRY_REGION=us-east-1
    export ECR_PACK_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com
    export ECR_PACK_BASE=spectro-packs
    export ECR_PACK_REGISTRY_REGION=us-east-1
    ```

  </TabItem>
  </Tabs>

---

9. Download the airgap setup binary. Our support team will provide you with the download link and the necessary credentials. 

10. Update the airgap setup binary permissions to allow execution. Replace the file name below with the name of the airgap setup binary you downloaded.

  ```shell
  chmod +x airgap-vX.X.X.bin
  ```

11. Start the airgap setup binary. Replace the file name below with the name of the airgap setup binary you downloaded.

  ```shell
  ./airgap-vX.X.X.bin
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
    Setup Completed
    ```

  :::info

  If you encounter an error during the airgap setup process, verify the required environment variables are set and populated correctly. If you are still having issues, reach out to our support team for assistance.
  :::


12. Move the manfiest file located in your temporary directory to the location of your file server. Unzip the manifest file to a folder accessible by the file server.
  
    ```shell
    unzip spectro-manifests-XXXXXXXXXXXX.zip
    ```

### Validate


## Pack Binaries

Review the following table to determine which pack binaries you need to download and upload to your OCI registry. 

| File Name                                    |
|----------------------------------------------|
| `airgap-pack-aws-alb-2.5.1.bin`              |
| `airgap-pack-aws-cluster-autoscaler-1.26.3.bin` |
| `airgap-pack-cni-calico-3.25.1.bin`          |
| `airgap-pack-cni-calico-3.26.0.bin`          |
| `airgap-pack-cni-cilium-oss-1.13.3.bin`      |
| `airgap-pack-cni-cilium-oss-1.14.1.bin`      |
| `airgap-pack-csi-aws-ebs-1.20.0.bin`         |
| `airgap-pack-csi-longhorn-1.4.1.bin`         |
| `airgap-pack-csi-longhorn-addon-1.4.1.bin`   |
| `airgap-pack-csi-rook-ceph-1.10.10.bin`      |
| `airgap-pack-csi-rook-ceph-addon-1.10.10.bin` |
| `airgap-pack-csi-rook-ceph-helm-1.11.9.bin`  |
| `airgap-pack-csi-rook-ceph-helm-addon-1.11.9.bin` |
| `airgap-pack-csi-vsphere-csi-3.0.0.bin`      |
| `airgap-pack-csi-vsphere-csi-3.0.2.bin`      |
| `airgap-pack-edge-k3s-1.24.6.bin`            |
| `airgap-pack-edge-k3s-1.25.0.bin`            |
| `airgap-pack-edge-k3s-1.25.2.bin`            |
| `airgap-pack-edge-k3s-1.26.4.bin`            |
| `airgap-pack-edge-k3s-1.27.2.bin`            |
| `airgap-pack-edge-k8s-1.24.6.bin`            |
| `airgap-pack-edge-k8s-1.25.2.bin`            |
| `airgap-pack-edge-k8s-1.26.4.bin`            |
| `airgap-pack-edge-k8s-1.27.2.bin`            |
| `airgap-pack-edge-native-byoi-1.0.0.bin`     |
| `airgap-pack-edge-rke2-1.25.0.bin`           |
| `airgap-pack-edge-rke2-1.25.2.bin`           |
| `airgap-pack-edge-rke2-1.26.4.bin`           |
| `airgap-pack-edge-rke2-1.27.2.bin`           |
| `airgap-pack-generic-byoi-1.0.0.bin`         |
| `airgap-pack-image-swap-1.5.1.bin`           |
| `airgap-pack-image-swap-1.5.2.bin`           |
| `airgap-pack-k8s-dashboard-2.7.0.bin`        |
| `airgap-pack-kubernetes-1.25.10.bin`         |
| `airgap-pack-kubernetes-1.25.9.bin`          |
| `airgap-pack-kubernetes-1.26.4.bin`          |
| `airgap-pack-kubernetes-1.26.5.bin`          |
| `airgap-pack-kubernetes-1.27.1.bin`          |
| `airgap-pack-lb-metallb-helm-0.13.10.bin`    |
| `airgap-pack-prometheus-operator-46.4.0.bin` |
| `airgap-pack-spectro-grafana-dashboards-4.0.0.bin` |
| `airgap-pack-spectro-k8s-dashboard-2.7.1.bin` |
| `airgap-pack-spectro-namespace-labeler-1.0.0.bin` |
| `airgap-pack-spectro-proxy-1.4.1.bin`        |
| `airgap-pack-ubuntu-aws-20.04.bin`           |
| `airgap-pack-ubuntu-aws-22.04.bin`           |
| `airgap-pack-ubuntu-vsphere-20.04.bin`       |
| `airgap-pack-ubuntu-vsphere-22.04.bin`       |
| `airgap-pack-vault-0.24.1.bin`               |



## Checklist

Use the following checklist to ensure you have completed all the required steps before deploying the airgap Palette installation.

- [ ] `oras` CLI, and `aws` v2 CLI is installed and available.

- [ ] Downloaded the airgap setup binary from the support team.

- [ ] Created a vSphere VM and Template folder with the name `spectro-templates`.

- [ ] Imported the Operating System and Kubernetes distribution OVA required for the install and placed the OVA in the `spectro-templates` folder.

- [ ] Appended an `r_` prefix to the OVA name after the import.

- [ ] Created a private repository with the name `spectro-packs` in your OCI registry.

- [ ] Created a public repository with the name `spectro-images` in your OCI registry.

- [ ] Authenticated with your OCI registry and aquired credentials to both respositories.

- [ ] Set the required environment variables for the airgap setup binary. Refer to step 8 in the [Preperation](#preperation) section for information.

- [ ] Started the airgap setup binary and verified the setup completed successfully

- [ ] Reviewed the list of pack binaries to download and upload to your OCI registry. 

- [ ] Extracted the manifest content from the airgap setup binary to a file server.

- [ ] Ensured the manifest content is hosted on a file server that is accessible from the VMware vSphere environment.


## Next Steps

You are now ready to deploy the airgap Palette installation. The important difference is that you will specify your OCI registry and file server during the installation process. Refer to the [Install on VMware](../install-on-vmware/install-on-vmware.md) guide for detailed guidance on installing Palette. 