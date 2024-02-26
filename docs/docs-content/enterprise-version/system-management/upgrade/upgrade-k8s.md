---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn how to upgrade self-hosted Palette with Helm and Kubernetes."
icon: ""
sidebar_position: 20
tags: ["palette", "self-hosted", "kubernetes", "management", "upgrades"]
keywords: ["self-hosted", "enterprise"]
---

## Prerequisites

- Access to the Palette system console.
- Access to the latest Palette Helm Chart. Send an email to support@spectrocloud.com to request access. Refer to
  [Access Palette](/enterprise-version/#access-palette) for more details.

## Upgrade Palette

:::tip

Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify the steps to
match your environment.

:::

1. Open a terminal session and navigate to the directory with the Palette installation zip file you've aquired from our
   support. Unzip the file to a **palette-install** directory.

   ```shell
   unzip release-*.zip -d palette-install
   ```

2. Navigate to the release directory inside **palette-install**.

   ```shell
   cd palette-install/charts/release-*
   ```

3. Update the cert-manager chart using the following command. Replace `cert-manager-*` with the cert manager version you
   downloaded alongside the new Palette installation binary.

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

4. You can reuse the `values.yaml` you configured
   [when installing Palette](/enterprise-version/install-palette/install-on-kubernetes/install) or update it as
   necessary.

:::warning

Ensure your `values.yaml` file is ready before proceeding.

:::

5.  If you are upgrading an airgap Palette instance or using a self-hosted OCI registry with caching, upgrade the
    image-swap chart with the following command. Specify the `values.yaml` file from step four.

    Replace `image-swap-*` with the image-swap version you downloaded alongside the new Palette installation binary.

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
    reach-system chart with the following command. Specify the `values.yaml` file from step four.

    Replace `reach-system-*` with the reach-system version you downloaded alongside the new Palette installation binary.

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

8.  Track the upgrade with the following command. Palette is upgraded when the deployments in the namespaces
    `cp-system`, `hubble-system`, `ingress-nginx`, `jet-system` , and `ui-system` are in the **Ready** status. The
    upgrade usually takes two to three minutes.

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

## Validate

1. In your terminal, run the following command.

   ```shell
   helm ls
   ```

<<<<<<< Updated upstream
  You should receive an output with details about each installed app. Review the version of the 
=======
  You should receive an output with details about each installed app. Review the version of the 

>>>>>>> Stashed changes
