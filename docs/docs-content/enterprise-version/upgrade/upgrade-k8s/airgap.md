---
sidebar_label: "Airgap"
title: "Upgrade Airgap Palette Installed with Kubernetes"
description: "Learn how to upgrade self-hosted airgap Palette."
icon: ""
sidebar_position: 10
tags: ["palette", "self-hosted", "airgap", "kubernetes", "upgrade"]
keywords: ["self-hosted", "enterprise", "airgap", "kubernetes"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed on Kubernetes.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest minor version available. Refer
to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade.

:::

## Prerequisites

- Access to the x86 Linux jumpbox or bastion host with connectivity to the target platform where you have installed
  Palette.

- An OCI registry such as [Harbor](https://goharbor.io/) or [AWS ECR](https://aws.amazon.com/ecr/) configured and
  available to store the new Palette images and packages.

- Access to the latest Palette airgap setup binary. Refer to [Access Palette](/enterprise-version/#access-palette) for
  more details.

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) and [`helm`](https://helm.sh/docs/intro/install/)
  available in your system.

- Access to the `kubeconfig` file of the target Kubernetes cluster. You must be able to interact with the cluster
  through `kubectl` and have sufficient permissions to upgrade Palette. We recommend using a role with the cluster-admin
  permissions.

- `unzip` or a similar tool available in your system.

- Access to the latest Palette Helm Chart. Refer to [Access Palette](/enterprise-version/#access-palette) for more
  details.

## Upgrade

1.  Log in to the Linux environment from which you can access your self-hosted airgap Palette instance.
2.  Authenticate with your OCI registry and get credentials to your `spectro-packs` and `spectro-images` repositories.

    :::info

    Be mindful of the auth token timeout. Uploading Palette images and packages to the OCI registry can take about an
    hour. If your auth token expires before everything is uploaded, you will need to re-authenticate and start the
    upload again.

    :::

    Select one of the following tabs for instructions on how to authenticate with Harbor and AWS ECR.

    <Tabs>

    <TabItem value="harbor" label="Harbor" default>

    Use the following command template to authenticate with your Harbor OCI registry through `oras`. Refer to the
    [oras login](https://oras.land/docs/commands/oras_login/) docs for more details about the available CLI flags and
    examples.

    ```shell
    oras login X.X.X.X --user 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    :::tip

    If your Harbor registry has a self-signed certificate, use the `--insecure` flag.

    ```shell
    oras login X.X.X.X --insecure --user 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    :::

    </TabItem>

    <TabItem value="aws-ecr" label="AWS ECR">

    To get the authentication commands for your specific registries, navigate to the AWS ECR console and click **View
    push commands**. Refer to the
    [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
    docs for more details.

    Alternatively, you can use the following command templates:

    - Authenticate with your private `spectro-packs` registry.

      ```shell
      aws ecr get-login-password --region xxxxx | oras login --username AWS --password-stdin 1234567890.dkr.ecr.us-east-1.amazonaws.com
      ```

    - Authenticate with your public `spectro-images` registry.

      ```shell
      aws ecr-public get-login-password --region xxxxx | docker login --username AWS --password-stdin public.ecr.aws/xxxxxxx
      ```

    </TabItem>

    </Tabs>

3.  Prepare and export the environment variables required by the Palette airgap binary. Select one of the following tabs
    for instructions on how to prepare these variables for Harbor and AWS ECR.

    <Tabs>

    <TabItem value="harbor" label="Harbor" default>

    - `OCI_IMAGE_REGISTRY`: The IP address or domain name of the `spectro-images` registry.
    - `OCI_IMAGE_BASE`: The namespace or repository that hosts the images.
    - `OCI_PACK_REGISTRY`: The IP address or domain name of the `spectro-packs` registry.
    - `OCI_PACK_BASE`: The namespace or repository that hosts the packages.

      ```shell
      export OCI_IMAGE_REGISTRY=<harbor-endpoint>
      export OCI_IMAGE_BASE=spectro-images
      export OCI_PACK_REGISTRY=<harbor-endpoint>
      export OCI_PACK_BASE=spectro-packs
      ```

    Consider the following example for reference.

    ```shell
    export OCI_IMAGE_REGISTRY=example.internal.com
    export OCI_IMAGE_BASE=spectro-images
    export OCI_PACK_REGISTRY=10.10.100.48
    export OCI_PACK_BASE=spectro-packs
    ```

    </TabItem>

    <TabItem value="aws-ecr" label="AWS ECR">

    - `ECR_IMAGE_REGISTRY`: The IP address or domain name of the public `spectro-images` registry.
    - `ECR_IMAGE_BASE`: The namespace or repository that hosts the images.
    - `ECR_IMAGE_REGISTRY_REGION`: The AWS region where the ECR registry is located.
    - `ECR_PACK_REGISTRY`: The IP address or domain name of the public `spectro-packs` registry.
    - `ECR_PACK_BASE`: The namespace or repository that hosts the packages.
    - `ECR_PACK_REGISTRY_REGION`: The AWS region where the ECR registry is located.

      ```shell
      export ECR_IMAGE_REGISTRY=<ecr-endpoint>
      export ECR_IMAGE_BASE=spectro-images
      export ECR_IMAGE_REGISTRY_REGION=us-east-1
      export ECR_PACK_REGISTRY=<ecr-endpoint>
      export ECR_PACK_BASE=spectro-packs
      export ECR_PACK_REGISTRY_REGION=us-east-1
      ```

    Consider the following example for reference.

    ```shell
    export ECR_IMAGE_REGISTRY=public.ecr.aws/1234567890
    export ECR_IMAGE_BASE=spectro-images
    export ECR_IMAGE_REGISTRY_REGION=us-east-1
    export ECR_PACK_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com
    export ECR_PACK_BASE=spectro-packs
    export ECR_PACK_REGISTRY_REGION=us-east-1
    ```

    </TabItem>

    </Tabs>

4.  Download the airgap setup binary using the credentials our support team provided along with the binary version. Use
    the following command template to set up a `VERSION` variable you'll use in the following steps.

    ```shell
    VERSION=<x.y.z>
    ```

    Then, use the following command template to download the airgap setup binary.

    ```shell
    curl --user <username>:<password> https://software-private.spectrocloud.com/airgap/$VERSION/airgap-v$VERSION.bin  \
    --output airgap-v$VERSION.bin
    ```

5.  Use the following command to make the airgap binary executable.

    ```shell
    chmod +x airgap-v$VERSION.bin
    ```

6.  Use the following command to start the airgap setup binary.

    ```shell
    ./airgap-v$VERSION.bin
    ```

    After the binary execution is done, you should receive the following success message (the example is shortened for
    brewity). As a result of running the binary, you should have a `spectro-manifests` archive in your temporary
    directory.

    ```shell
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Setup - Version 4.0.17  100%
    Setting up Packs
    - Pushing Pack cni-calico:3.25.1
    ...
    Setting up Images
    - Pushing image docker.io/kindest/kindnetd:v20230227-15197099
    - Pushing image gcr.io/cloud-provider-vsphere/cpi/release/manager:v1.22.8
    ...
    // highlight-start
    Preparing Manifests Archive
    Manifests are available in /tmp/spectro-manifests-1696971110.zip. Extract the archive to a file server to serve as a Spectro Cloud Repository
    // highlight-end
    Setup Completed
    ```

7.  Move the `spectro-manifests` archive to a directory that your file server can access and use the following command
    template to unzip it.

    ```shell
    unzip spectro-manifests-<file-id>.zip -d /target/folder
    ```

8.  Refer to the [Additional Packs](../../install-palette/airgap/supplemental-packs.md) page and update the packages you
    are currently using. You must update each package separetely.

    To update a package, use the following command template to download and execute the pack binary.

    ```shell
    chmod +x <pack-name-version>.bin && ./<pack-name-version>.bin
    ```

    Consider the following example for reference.

    ```shell
    chmod +x airgap-pack-aws-alb-2.5.1.bin && ./airgap-pack-aws-alb-2.5.1.bin
    ```

    ```shell
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Pack - aws-alb Version 4.0.17  100%
    Setting up Packs
    - Pushing Pack aws-alb:2.5.1
    Setting up Images
    Setup Completed
    ```

:::info

Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify the following
Palette installation steps to match your environment.

:::

9.  Open a terminal session and navigate to the directory with the Palette installation zip file. Unzip the file to a
    **palette-install** directory.

    ```shell
    unzip release-*.zip -d palette-install
    ```

10. Navigate to the release directory inside **palette-install**.

    ```shell
    cd palette-install/charts/release-*
    ```

11. Update the cert-manager chart using the following command.

    ```shell
    helm upgrade --values extras/cert-manager/values.yaml \
    cert-manager extras/cert-manager/cert-manager-*.tgz --install
    ```

    You should receive an output similar to the following.

    ```shell
    Release "cert-manager" has been upgraded. Happy Helming!
    NAME: cert-manager
    LAST DEPLOYED: Thu Feb 22 19:42:33 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

12. Prepare the Palette configuration file `values.yaml`. If you saved `values.yaml` used during the Palette
    installation, you can reuse it for the upgrade. Alternatively, follow the
    [Kubernetes Installation Instructions](../../install-palette/install-on-kubernetes/install.md) to populate your
    `values.yaml`.

:::warning

Ensure that the `values.yaml` file is ready before proceeding. Specifically, make sure that the `ociPackEcrRegistry` and
`ociImageRegistry` configurations include the parameters necessary to interact with your `spectro-images` and
`spectro-packs` repositories.

:::

13. Upgrade the image-swap chart with the following command. Point to the `palette/values.yaml` file from step twelve.

    ```shell
    helm upgrade --values palette/values.yaml \
    image-swap extras/image-swap/image-swap-*.tgz --install
    ```

    You should receive an output similar to the following.

    ```shell
    Release "image-swap" has been upgraded. Happy Helming!
    NAME: image-swap
    LAST DEPLOYED: Thu Feb 22 19:44:13 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

14. Upgrade the reach-system chart with the following command. Point to the `palette/values.yaml` file from step twelve.

    ```shell
    helm upgrade --values palette/values.yaml \
    reach-system extras/reach-system/reach-system-\*.tgz --install
    ```

    You should receive an output similar to the following.

    ```shell
    Release "reach-system" has been upgraded. Happy Helming!
    NAME: reach-system
    LAST DEPLOYED: Thu Feb 22 19:47:10 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

15. Upgrade Palette with the following command.

    ```shell
    helm upgrade --values palette/values.yaml \
    hubble palette/spectro-mgmt-plane-\*.tgz --install
    ```

    You should receive an output similar to the following.

    ```shell
    Release "hubble" has been upgraded. Happy Helming!
    NAME: hubble
    LAST DEPLOYED: Thu Feb 22 20:05:24 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

16. Use the following command to track the upgrade process.

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

    :::tip

    For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to track the
    upgrade.

    :::

    The upgrade usually takes up to five minutes. Palette is upgraded when the deployments in the namespaces
    `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` are in the **Ready** status.

## Validate

1. In your terminal, run the following command.

   ```shell
   helm ls
   ```

   You should receive an output with the version and other details of the currently deployed apps.

   ```shell
   NAME        	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART                   	APP VERSION
   cert-manager	default  	2       	2024-02-22 19:42:33.776829 +0100 CET	deployed	cert-manager-1.11.0     	1.11.0
   image-swap  	default  	2       	2024-02-22 19:44:13.209592 +0100 CET	deployed	image-swap-v1.5.2-spectro-4.1.1	1.5.2
   reach-system	default  	2       	2024-02-22 19:47:10.558061 +0100 CET	deployed	reach-system-4.2.0             	4.2.0
   hubble      	default  	2       	2024-02-22 19:47:24.085305 +0100 CET	deployed	spectro-mgmt-plane-4.2.7	4.2.7
   ```

2. Check the `App Version` column of `cert-manager`, `image-swap`, `reach-system`, and `hubble` to verify that they have
   the expected versions.
