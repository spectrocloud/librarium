---
sidebar_label: "Environment Setup"
title: "Environment Setup"
description: "Learn how to prepare VerteX for an airgap install"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vertex", "enterprise", "airgap", "kubernetes"]
keywords: ["self-hosted", "vertex"]
---

![Overview diagram of the pre-install steps eager-load](/enterprise-version_air-gap-repo_k8s-overview-order-diagram-clean.webp)

This guide provides instructions to prepare your airgap environment for a Palette VerteX installation by completing the
required preparatory steps one through four shown in the diagram. The respective installation guides for each platform
cover the remaining installation process.

## Prepare Airgap Installation

Use the following steps to prepare your airgap environment for a VerteX installation.

:::tip

Carefully review the [prerequisites](#prerequisites) section before proceeding. This will save you time and frustration.
Each prerequisite is required for a successful installation.

:::

## Prerequisites

- An x86 Linux jumpbox or bastion host with connectivity to the target platform where you are installing VerteX.

- 120 GB of disk space available for the airgap setup binary and temporary files. The uncompressed airgap content is
  approximately 20 GB.

- An OCI registry such as [Harbor](https://goharbor.io/) or [AWS ECR](https://aws.amazon.com/ecr/) to store VerteX
  images and packages. The OCI registry must be accessible from the Kubernetes cluster. We have verified the
  installation against Harbor and AWS ECR. Other OCI registries may work but have not been tested.

  :::warning

  Ensure the OCI registries are set up with HTTPS. AWS ECR is enabled with HTTPS by default. Harbor requires you to
  enable HTTPS. If you are using Harbor, you must enable HTTPS to authenticate with the registry. Refer to the
  [Harbor](https://goharbor.io/docs/2.9.0/install-config/configure-https) documentation for guidance.

  :::

- To interact with the OCI registry, you must have the following tools installed and available.

  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - Required for AWS ECR.
  - [Oras](https://oras.land/docs/installation.html) CLI v1.0.0 - This version is explicitly required for the setup
    script.
  - [zip](https://linux.die.net/man/3/zip) - Required for the setup script.
  - [unzip](https://linux.die.net/man/1/unzip) - Or equivalent for extracting the manifest content from the airgap setup
    binary.
  - [jq](https://jqlang.github.io/jq/download/) - Command-line JSON processor installed and available.
  - [Docker](https://docs.docker.com/get-docker/) - The airgap setup binary requires Docker to be installed and
    available.

## Instructions

Complete the following steps before deploying the airgap VerteX installation.

1. Log in to the OCI registry where you will host the VerteX images and packages.

2. Create a private repository named `spectro-packs`. This repository will host the VerteX packs.

   - Refer to the [Create Projects](https://goharbor.io/docs/2.0.0/working-with-projects/create-projects/) guide for
     information about creating a repository in Harbor.
   - Refer to the [Create a repository](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html)
     guide for information about creating a repository in AWS ECR.

3. In your OCI registry, create a public repository named `spectro-images`. The public repository will host the images
   required by VerteX.

4. Download the Certificate Authority (CA) for your OCI registry and make it available in the local file system. You
   will need to provide the CA to the Palette CLI installation wizard later in the installation process. If you don't
   give the Palette CLI the file path to the CA when prompted, you may encounter errors when authenticating with the OCI
   registry, which could result in an incomplete installation. Skip this step if you are using AWS ECR.

5. Log in to the Linux environment where you will download the airgap binaries. This steps requires internet access to
   download the airgap setup binary.

6. Download the airgap setup binary. Our support team will provide you with the proper version and credentials. Replace
   the values in the commands below with our support team's recommended version and credentials.

   ```shell
   VERSION=X.X.X
   ```

   ```shell
   curl --user XXXXX:YYYYYYY https://software-private.spectrocloud.com/airgap-fips/$VERSION/airgap-fips-v$VERSION.bin  \
   --output airgap-fips-v$VERSION.bin
   ```

7. Update the airgap setup binary permissions to allow execution. Replace the file name below with the name of the
   airgap setup binary you downloaded.

   ```shell
   chmod +x airgap-fips-v$VERSION.bin
   ```

8. Copy or move the airgap binary to another Linux environment inside your airgap environment. Use any approved method
   to transfer the binary to the airgap environment.

9. Log in to the Linux environment inside your airgap environment where you copied the airgap setup binary.

10. Authenticate with your OCI registry and acquire credentials to both repositories you created earlier. You will need
    these credentials when deploying the airgap VerteX installation.

    <Tabs groupId="oci-registry">

    <TabItem label="Harbor" value="harbor">

    Use `oras` to log in to your OCI registry. Replace the values below with your environment configuration values.
    Check out the [oras login](https://oras.land/docs/commands/oras_login) documentation for information about
    additional CLI flags and examples.

    ```shell
    oras login X.X.X.X --username 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    If you are using a Harbor registry with a self-signed certificate, you will need to add the `--insecure` flag to the
    `oras` command.

    ```shell
    oras login X.X.X.X --insecure --username 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    </TabItem>

    <TabItem label="AWS ECR" value="aws-ecr">

    You can acquire the AWS ECR authentication command from the AWS ECR console. From the ECR repository details page,
    click on the **View push commands** button to access the command. Refer to the
    [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
    documentation for more information.

    Use the following command to authenticate with AWS ECR. The output of the `aws` command is passed to `oras` to
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
    registry can take a approximately an hour. If the authentication token expires, you will need to re-authenticate to
    the OCI registry and restart the upload process.

    :::

11. The airgap setup binary requires a set of environment variables to be available and populated. The environment
    variables will be different depending on the OCI registry you are using. Select the OCI registry and populate the
    environment variables accordingly.

    <Tabs groupId="oci-registry">

    <TabItem label="Harbor" value="harbor">

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

      Consider the following example.

      ```shell hideClipboard title="Example values"
      export OCI_IMAGE_REGISTRY=example.internal.com
      export OCI_PACK_BASE=spectro-packs
      export OCI_PACK_REGISTRY=10.10.100.48
      export OCI_IMAGE_BASE=spectro-images
      ```

    </TabItem>

    <TabItem label="AWS ECR" value="aws-ecr">

    - `ECR_IMAGE_REGISTRY`: The IP address or domain name of the public OCI registry for images.
    - `ECR_IMAGE_BASE`: The namespace or repository name that hosts the VerteX images.
    - `ECR_IMAGE_REGISTRY_REGION`: The AWS region where the ECR registry is located.
    - `ECR_PACK_BASE`: The namespace or repository name that hosts the VerteX Packs.
    - `ECR_PACK_REGISTRY`: The IP address or domain name of the OCI registry.
    - `ECR_PACK_REGISTRY_REGION`: The AWS region where the ECR registry is located.

      ```shell
      export ECR_IMAGE_REGISTRY=<ecr-endpoint>
      export ECR_IMAGE_BASE=spectro-images
      export ECR_IMAGE_REGISTRY_REGION=<ecr-region>
      export ECR_PACK_REGISTRY=<ecr-endpoint>
      export ECR_PACK_BASE=spectro-packs
      export ECR_PACK_REGISTRY_REGION=<ecr-region>
      ```

      Consider the following example.

      ```shell hideClipboard title="Example values"
      export ECR_IMAGE_REGISTRY=public.ecr.aws/1234567890
      export ECR_IMAGE_BASE=spectro-images
      export ECR_IMAGE_REGISTRY_REGION=us-east-1
      export ECR_PACK_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com
      export ECR_PACK_BASE=spectro-packs
      export ECR_PACK_REGISTRY_REGION=us-east-1
      ```

    </TabItem>

    </Tabs>

12. Start the airgap setup binary. Replace the file name below with the name of the airgap setup binary you downloaded.

    ```shell
    ./airgap-fips-v$VERSION.bin
    ```

    Upon completion, a success message will be displayed. The output is condensed for brevity.

    <PartialsComponent category="self-hosted" name="airgap-binary-execution" />

    :::info

    If you encounter an error during the airgap setup process, verify the required environment variables are set and
    populated correctly. If you are still having issues, reach out to our support team for assistance.

    :::

13. Review the additional packs available for download. The supplemental packs are optional and not required for a
    successful installation. However, to create cluster profiles you may require several of the packs available for
    download. Refer to the [Additional Packs](../../../../downloads/palette-vertex/additional-packs.md) resource for a
    list of available packs.

14. Once you select the packs you want to install, download the pack binaries and start the binary to initiate the
    upload process. This step requires internet access, so you may have to download the binaries on a separate machine
    outside the airgap environment and transfer them to the airgap environment using an approved method.

    In the example below, the `airgap-fips-pack-amazon-linux-eks-1.0.0.bin` binary permissions are updated to allow
    execution and the binary is started.

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

15. Repeat step 13 for each pack you want to install.

You now have completed the preparation steps for an airgap installation. Check out the [Validate](#validate) section to
ensure the airgap setup process completed successfully.

## Validate

Use the following steps to validate the airgap setup process completed successfully.

1. Log in to your OCI registry and verify the VerteX images and packs are available.

## Next Steps

You are now ready to deploy the airgap VerteX installation. The important difference is that you will specify your OCI
registry during the installation process. Refer to the [VerteX Install](./install.md) guide for detailed guidance on
installing VerteX.
