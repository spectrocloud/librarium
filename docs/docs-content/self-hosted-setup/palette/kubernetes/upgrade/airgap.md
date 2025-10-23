---
sidebar_label: "Upgrade Airgap Palette"
title: "Upgrade Self-Hosted, Airgap Palette Installed on a Kubernetes Cluster"
description: "Upgrade a self-hosted, airgapped Palette instance installed on a Kubernetes cluster."
icon: ""
sidebar_position: 30
tags: ["self-hosted", "airgap", "kubernetes", "upgrade", "helm"]
keywords: ["self-hosted", "airgap", "kubernetes", "upgrade", "helm"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed on Kubernetes.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest patch version of the latest
minor version available. Refer to the [Supported Upgrade Paths](./upgrade.md#supported-upgrade-paths) section for
details.

:::

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade.

## Prerequisites

- Access to the x86 Linux jumpbox or bastion host with connectivity to the target platform where you have installed
  Palette.

- An OCI registry such as [Harbor](https://goharbor.io/) or [AWS ECR](https://aws.amazon.com/ecr/) configured and
  available to store the new Palette images and packs.

- Access to the latest Palette airgap setup binary. Refer to [Access Palette](../../palette.md#access-palette) for more
  details.

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) and [`helm`](https://helm.sh/docs/intro/install/)
  available in your system.

- Access to the kubeconfig file of the target Kubernetes cluster. You must be able to interact with the cluster through
  `kubectl` and have sufficient permissions to upgrade Palette. We recommend using a role with the cluster-admin
  permissions.

- `unzip` or a similar tool available in your system.

- Access to the latest Palette Helm Chart. Refer to [Access Palette](../../palette.md#access-palette) for more details.

- The Kubernetes cluster must be set up on a version of Kubernetes that is compatible to your upgraded version. Refer to
  the [Kubernetes Requirements](../install/install.md#kubernetes-requirements) section to find the version required for
  your Palette installation.

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
    oras login X.X.X.X --username 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    :::tip

    If your Harbor registry has a self-signed certificate, use the `--insecure` flag.

    ```shell
    oras login X.X.X.X --insecure --username 'yourUserNameHere' --password 'yourPasswordHere'
    ```

    :::

    </TabItem>

    <TabItem value="aws-ecr" label="AWS ECR">

    To get the authentication commands for your specific registries, navigate to the AWS ECR console and click **View
    push commands**. Refer to the
    [AWS ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html#cli-authenticate-registry)
    docs for more details.

    Alternatively, you can use the following command templates:

    - Authenticate with your private `spectro-packs` registry:

      - `<ecr-region>`: Replace with the region where your ECR repository is hosted.
      - `<aws-account-id>`: Replace with your AWS account ID.

        ```shell
        aws ecr get-login-password --region <ecr-region> | oras login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<ecr-region>.amazonaws.com
        ```

        Consider the following example for reference.

        ```shell
        aws ecr get-login-password --region us-east-1 | oras login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
        ```

    - Authenticate with your public `spectro-images` registry:

      - `<ecr-region>`: Replace with the region where your ECR repository is hosted.
      - `<public-ecr-url>`: Replace with the URL to your public ECR registry.

        ```shell
        aws ecr-public get-login-password --region <ecr-region> | docker login --username AWS --password-stdin <public-ecr-url>
        ```

        Consider the following example for reference.

        ```shell
        aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/dfa987f
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

      Consider the following example.

      ```shell hideClipboard title="Example values"
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

4.  Download the airgap setup binary using the credentials our support team provided along with the binary version. Use
    the following command template to set up a `VERSION` variable you'll use in the following steps.

    ```shell
    export VERSION=<x.y.z>
    ```

    Consider the following example for reference.

    ```shell
    export VERSION=4.2.7
    ```

5.  Use the following command template to download the new Palette airgap installation bin. Enter the username,
    password, and the Palette airgap installation URL you received from our support team. In the output file name,
    replace `<version>` with the Palette version you're downloading.

    ```shell
    curl --user <username>:<password> --output airgap-<version>.bin <url-to-airgap-installation-bin>
    ```

    Consider the following command example for reference.

    ```shell
    curl --user <username>:<password> --output airgap-4.2.7.bin https://software.spectrocloud.com/airgap-v4.2.7.bin
    ```

6.  Use the following command template to execute the new Palette airgap installation bin.

    ```shell
    chmod +x airgap-v$VERSION.bin && ./airgap-v$VERSION.bin
    ```

    After the binary execution is done, you should receive the following success message (the example is shortened for
    brevity). As a result of starting the binary, you should have a `spectro-manifests` archive in your temporary
    directory.

    <PartialsComponent category="self-hosted" name="airgap-binary-execution" />

7.  Refer to the [Additional Packs](../../../../downloads/self-hosted-palette/additional-packs.md) page and update the
    packages you are currently using. You must update each package separately.

    :::info

    Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify the
    following Palette upgrade steps to match your environment.

    :::

8.  Navigate to the directory with the Palette installation zip file. Unzip the file to a **palette-install** directory.

    ```shell
    unzip release-*.zip -d palette-install
    ```

9.  Navigate to the release directory inside **palette-install**.

    ```shell
    cd palette-install/charts/release-*
    ```

10. In a code editor of your choice, open the **extras/cert-manager/values.yaml** file and replace the
    `cainjectorImage`,`controllerImage`, `webhookImage`, and `amceResolverImage` image URLs and with your OCI image
    registry URL and the `/spectro-images/` namespace.

    ```yaml {2-5}
    image:
      cainjectorImage: "<your-oci-registry-url>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:v1.17.0-spectro-4.6.1"
      controllerImage: "<your-oci-registry-url>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:v1.17.0-spectro-4.6.1"
      webhookImage: "<your-oci-registry-url>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:v1.17.0-spectro-4.6.1"
      amceResolverImage: "<your-oci-registry-url>/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:v1.17.0-spectro-4.6.1"

    featureGates: "AdditionalCertificateOutputFormats=true"
    ```

    Consider the following example for reference.

    ```yaml {2-5}
    image:
      cainjectorImage: "harbor.docs.spectro.dev/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:v1.17.0-spectro-4.6.1"
      controllerImage: "harbor.docs.spectro.dev/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:v1.17.0-spectro-4.6.1"
      webhookImage: "harbor.docs.spectro.dev/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:v1.17.0-spectro-4.6.1"
      amceResolverImage: "harbor.docs.spectro.dev/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:v1.17.0-spectro-4.6.1"

    featureGates: "AdditionalCertificateOutputFormats=true"
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
    [Kubernetes Installation Instructions](../install/airgap.md) to populate your `values.yaml`.

    :::warning

    Ensure that the `values.yaml` file is ready before proceeding. Specifically, make sure that the `ociPackEcrRegistry`
    and `ociImageRegistry` configurations include the parameters necessary to interact with your `spectro-images` and
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

1. In your terminal, issue the following command.

   ```shell
   helm ls
   ```

   You should receive an output with the version and other details of the currently deployed apps. Check the
   `App Version` column of `cert-manager`, `image-swap`, `reach-system`, and `hubble` to verify that they have the
   expected versions.

   ```shell
   NAME        	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART                   	APP VERSION
   cert-manager	default  	2       	2024-02-22 19:42:33.776829 +0100 CET	deployed	cert-manager-1.11.0     	1.11.0
   image-swap  	default  	2       	2024-02-22 19:44:13.209592 +0100 CET	deployed	image-swap-v1.5.2-spectro-4.1.1	1.5.2
   reach-system	default  	2       	2024-02-22 19:47:10.558061 +0100 CET	deployed	reach-system-4.2.0             	4.2.0
   hubble      	default  	2       	2024-02-22 19:47:24.085305 +0100 CET	deployed	spectro-mgmt-plane-4.2.7	4.2.7
   ```

2. Issue the following command to verify that the Palette clusters work as expected.

   ```shell
   kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
   | grep -E '^(cp-system|hubble-system|ingress-nginx|jet-system|ui-system)\s'
   ```

   The command should return a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system`,
   and `ui-system` namespaces. All deployments should have the status `Running`.

   ```shell
   cp-system       spectro-cp-ui-689984f88d-54wsw             Running
   hubble-system   auth-85b748cbf4-6drkn                      Running
   hubble-system   auth-85b748cbf4-dwhw2                      Running
   hubble-system   cloud-fb74b8558-lqjq5                      Running
   hubble-system   cloud-fb74b8558-zkfp5                      Running
   hubble-system   configserver-685fcc5b6d-t8f8h              Running
   hubble-system   event-68568f54c7-jzx5t                     Running
   hubble-system   event-68568f54c7-w9rnh                     Running
   hubble-system   foreq-6b689f54fb-vxjts                     Running
   hubble-system   hashboard-897bc9884-pxpvn                  Running
   hubble-system   hashboard-897bc9884-rmn69                  Running
   hubble-system   hutil-6d7c478c96-td8q4                     Running
   hubble-system   hutil-6d7c478c96-zjhk4                     Running
   hubble-system   mgmt-85dbf6bf9c-jbggc                      Running
   hubble-system   mongo-0                                    Running
   hubble-system   mongo-1                                    Running
   hubble-system   mongo-2                                    Running
   hubble-system   msgbroker-6c9b9fbf8b-mcsn5                 Running
   hubble-system   oci-proxy-7789cf9bd8-qcjkl                 Running
   hubble-system   packsync-28205220-bmzcg                    Succeeded
   hubble-system   spectrocluster-6c57f5775d-dcm2q            Running
   hubble-system   spectrocluster-6c57f5775d-gmdt2            Running
   hubble-system   spectrocluster-6c57f5775d-sxks5            Running
   hubble-system   system-686d77b947-8949z                    Running
   hubble-system   system-686d77b947-cgzx6                    Running
   hubble-system   timeseries-7865bc9c56-5q87l                Running
   hubble-system   timeseries-7865bc9c56-scncb                Running
   hubble-system   timeseries-7865bc9c56-sxmgb                Running
   hubble-system   user-5c9f6c6f4b-9dgqz                      Running
   hubble-system   user-5c9f6c6f4b-hxkj6                      Running
   ingress-nginx   ingress-nginx-controller-2txsv             Running
   ingress-nginx   ingress-nginx-controller-55pk2             Running
   ingress-nginx   ingress-nginx-controller-gmps9             Running
   jet-system      jet-6599b9856d-t9mr4                       Running
   ui-system       spectro-ui-76ffdf67fb-rkgx8                Running
   ```
