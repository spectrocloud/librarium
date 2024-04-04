---
sidebar_label: "Non-airgap"
title: "Upgrade Palette Installed with Kubernetes"
description: "Learn how to upgrade self-hosted non-airgap Palette with Helm and Kubernetes."
icon: ""
sidebar_position: 0
tags: ["palette", "self-hosted", "non-airgap", "kubernetes", "management", "upgrades"]
keywords: ["self-hosted", "enterprise"]
---

This guide takes you through the process of upgrading a self-hosted Palette instance installed with Helm on Kubernetes.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest minor version available. Refer
to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade.

:::

## Prerequisites

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) and [`helm`](https://helm.sh/docs/intro/install/)
  available in your system.

- Access to the `kubeconfig` file of the target Kubernetes cluster. You must be able to interact with the cluster
  through `kubectl` and have sufficient permissions to upgrade Palette. We recommend using a role with the cluster-admin
  permissions.

- `unzip` or a similar tool available in your system.

- Access to the latest Palette Helm Chart. Refer to [Access Palette](/enterprise-version/#access-palette) for more
  details.

## Upgrade

:::info

Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify these steps to
match your environment.

:::

1. Open a terminal session and navigate to the directory with the Palette installation zip file. Unzip the file to a
   **palette-install** directory.

   ```shell
   unzip release-*.zip -d palette-install
   ```

2. Navigate to the release directory inside **palette-install**.

   ```shell
   cd palette-install/charts/release-*
   ```

3. In a code editor of your choice, open the **extras/cert-manager/values.yaml** file and replace the `controllerImage`,
   `webhookImage`, and `amceResolverImage` image URLs with your OCI image registry URLs.

   ```yaml
   image:
   cainjectorImage: "gcr.io/spectro-images-public/release-fips/jetstack/cert-manager-cainjector:spectro-v1.11.0-20230427"
   // highlight-start
   controllerImage: "<your-oci-registry-url>/spectro-images-public/release-fips/jetstack/cert-manager-controller:spectro-v1.11.0-20230427"
   webhookImage: "<your-oci-registry-url>/spectro-images-public/release-fips/jetstack/cert-manager-webhook:spectro-v1.11.0-20230808"
   amceResolverImage: "<your-oci-registry-url>/spectro-images-public/release-fips/jetstack/cert-manager-acmesolver:spectro-v1.11.0-20230427"
   // highlight-end

   featureGates: "AdditionalCertificateOutputFormats=true"
   ```

   Consider the following example for reference.

   ```yaml
   image:
   cainjectorImage: "gcr.io/spectro-images-public/release-fips/jetstack/cert-manager-cainjector:spectro-v1.11.0-20230427"
   // highlight-start
   controllerImage: "harbor.docs.spectro.dev/spectro-images-public/release-fips/jetstack/cert-manager-controller:spectro-v1.11.0-20230427"
   webhookImage: "harbor.docs.spectro.dev/spectro-images-public/release-fips/jetstack/cert-manager-webhook:spectro-v1.11.0-20230808"
   amceResolverImage: "harbor.docs.spectro.dev/spectro-images-public/release-fips/jetstack/cert-manager-acmesolver:spectro-v1.11.0-20230427"
   // highlight-end

   featureGates: "AdditionalCertificateOutputFormats=true"
   ```

4. Update the cert-manager chart using the following command.

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

5. Prepare the Palette configuration file `values.yaml`. If you saved `values.yaml` used during the Palette
   installation, you can reuse it for the upgrade. Alternatively, follow the
   [Kubernetes Installation Instructions](../../install-palette/install-on-kubernetes/install.md) to populate your
   `values.yaml`.

:::warning

Ensure that the `values.yaml` file is ready before proceeding. If you're using a self-hosted OCI registry, make sure
that the `ociImageRegistry.mirrorRegistries` parameter in your `values.yaml` includes the necessary mirror links.

:::

5.  If you are using a self-hosted OCI registry, upgrade the image-swap chart with the following command. Point to the
    `palette/values.yaml` file from step four.

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

6.  If you are upgrading a Palette instance in an environment that requires network proxy configuration, upgrade the
    reach-system chart with the following command. Point to the `palette/values.yaml` file from step four.

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

7.  Upgrade Palette with the following command.

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

8.  Use the following command to track the upgrade process.

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
