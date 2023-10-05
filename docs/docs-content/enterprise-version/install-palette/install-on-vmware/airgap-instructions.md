---
sidebar_label: "Airgap Instructions"
title: "Install in an Air Gap Environment"
description: "Learn how to install Palette into an air gap environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["self-hosted", "enterprise", "air-gap"]
---

You can install a self-hosted version of Palette into a VMware environment without direct internet access. This type of installation is referred to as an *air gap* installation. 

In a standard Palette installation, the following artifacts are downloaded by default from the public Palette repository.

* Palette platform manifests and required platform packages.


* Container images for core platform components and 3rd party dependencies.


* Palette Packs.


The installation process changes a bit in an air gap environment due to the lack of internet access. Before the primary Palette installation step, you must download the three required Palette artifacts mentioned above. The other significant change is that Palette's default public repository is not used. Instead, a private repository supports all Palette operations pertaining to storing images and packages. 



## Prerequisites


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


- The following minimum resources are required to deploy Palette.

  - 8 CPUs per VM.

  - 16 GB Memory per VM.

  - 100 GB Disk Space per VM. Storage sizing depends on your intended update frequency and data retention model. 

- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound to and outbound from the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed cluster's Kubernetes API server.


- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format. This file is optional.


- Assigned IP addresses for application workload services, such as Load Balancer services.


- Shared Storage between VMware vSphere hosts.

<br />

:::info

Self-hosted Palette installations provide a system Private Cloud Gateway (PCG) out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the Palette console. To learn how to install a PCG on VMware, check out the [VMware](../../../clusters/data-center/vmware.md) guide.

:::

<br />



## Deploy Air Gapped Palette

Use the following steps to deploy an air gapped Palette installation. 

:::tip

Carefully review the [prerequisites](#prerequisites) section before proceeding. This will save you time and frustration. Each prerequisite listed is required for a successful installation.

:::

### Preperation

Complete the following steps before deploying the air gapped Palette installation.

1. Log in to your vCenter environment.

2. Create a vSphere VM and Template folder with the name `spectro-templates`. Ensure this folder is accessible by the user account you will use to deploy the air gapped Palette installation.



3. Import the OVA provided by our support team. Place the OVA in the `spectro-templates` folder. Refer to the [Import Items to a Content Library](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-B413FBAE-8FCB-4598-A3C2-8B6DDA772D5C.html?hWord=N4IghgNiBcIJYFsAOB7ATgFwAQYKbIjDwGcQBfIA) guide for information about importing an OVA in vCenter.

4. In your OCI registry, create a repository with the name `spectro-packs` and ensure the repository is private. This repository will host the Palette Packs. Refer to the [Create Projects](https://goharbor.io/docs/2.0.0/working-with-projects/create-projects/) guide for information about creating a repository in Harbor. Refer to the [Create a repository](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html) guide for information about creating a repository in AWS ECR.

5. In your OCI registry, create another repository with the name `spectro-images` and ensure the repository is public. The repositry will host Palette images.

6. Authenticate with your OCI registry and aquire credentials to both respositories you created earlier. You will need these credentials when deploying the air gapped Palette installation. 

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

7. The airgap setup binary require a set of environment variables to be available and populated. Depending on what OCI registry you are using, the environment variables will be different. Select the OCI registry you are using and populate the environment variables accordingly.

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
    export OCI_PACK_REGISTRY=example.internal.com
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

8. Download the airgap setup binary. Our support team will provide you with the download link and the necessary credentials. 

9. Update the airgap setup binary permissions to allow execution. Replace the file name below with the name of the airgap setup binary you downloaded.

  ```shell
  chmod +x airgap-vX.X.X.bin
  ```

10. Start the airgap setup binary. Replace the file name below with the name of the airgap setup binary you downloaded.

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