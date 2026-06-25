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

## Upgrade Notes

### All Versions

- Before upgrading Palette to a new major version, you must first update it to the latest patch version of the latest
  minor version available. Refer to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for
  details.

- If your setup includes a PCG, you must also
  [allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
  Palette upgrade.

### Specific Versions

- <PartialsComponent category="self-hosted" name="gke-nginx-cleanup-iam" edition="Palette" />

- <PartialsComponent category="self-hosted" name="nginx-values-hygiene" edition="Palette" />

- <PartialsComponent category="self-hosted" name="nginx-traefik-upgrade" edition="Palette" />

- <PartialsComponent category="self-hosted" name="certificate-loss" />

## Prerequisites

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) and [`helm`](https://helm.sh/docs/intro/install/)
  available in your system.

- Access to the kubeconfig file of the target Kubernetes cluster. You must be able to interact with the cluster through
  `kubectl` and have sufficient permissions to upgrade Palette. We recommend using a role with the cluster-admin
  permissions.

- `unzip` or a similar tool available in your system.

- Access to the latest Palette Helm Chart. Refer to [Access Palette](/enterprise-version/#access-palette) for more
  details.

- The Kubernetes cluster must be set up on a version of Kubernetes that is compatible to your upgraded version. Refer to
  the [Kubernetes Requirements](../../install-palette/install-palette.md#kubernetes-requirements) section to find the
  version required for your Palette installation.

## Upgrade

:::info

Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify these steps to
match your environment.

:::

1.  Open a terminal session and navigate to the directory where you downloaded the Palette install ZIP file provided by
    our support. Unzip the file to a directory named `palette-install`.

    ```shell
    unzip charts.zip -d palette-install
    ```

2.  Navigate to the `palette-install` directory.

    ```shell
    cd palette-install
    ```

3.  Update the cert-manager chart using the following command.

    ```shell
    helm upgrade --install cert-manager \
      ./extras/cert-manager/cert-manager-*.tgz \
      --namespace cert-manager \
      --create-namespace \
      --values ./extras/cert-manager/values.yaml
    ```

    ```shell hideClipboard title="Example output"
    Release "cert-manager" has been upgraded. Happy Helming!
    NAME: cert-manager
    LAST DEPLOYED: Wed Jun 17 14:54:45 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

4.  Upgrade the Spectro Management CRDs chart.

    ```shell
    helm upgrade --install spectro-mgmt-crds \
      extras/spectro-mgmt-crds/spectro-mgmt-crds-*.tgz \
      --values extras/spectro-mgmt-crds/values.yaml
    ```

    ```shell hideClipboard title="Example output"
    Release "spectro-mgmt-crds" has been upgraded. Happy Helming!
    NAME: spectro-mgmt-crds
    LAST DEPLOYED: Wed Jun 17 14:55:28 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

5.  Prepare the Palette configuration file `values.yaml`. If you saved your `values.yaml` used during the Palette
    installation, you can refer to it when upgrading. Ensure you carry over any necessary configurations, such as root
    domains, certificates, image-swap paths, and registries. Refer to
    [Kubernetes Installation Instructions](../../install-palette/install-on-kubernetes/install.md) for basic
    `values.yaml` guidance. For a full list of parameters, refer to
    [Helm Configuration Reference](../../install-palette/install-on-kubernetes/palette-helm-ref.md).

6.  _(Self-hosted OCI registry only)_ If you use image swap for self-hosted OCI registries, upgrade the image-swap chart
    with the following command. Point to the `palette/values.yaml` file from step 5.

    ```shell
    helm upgrade --values palette/values.yaml \
    image-swap extras/image-swap/image-swap-*.tgz --install
    ```

    ```shell hideClipboard title="Example output"
    Release "image-swap" has been upgraded. Happy Helming!
    NAME: image-swap
    LAST DEPLOYED: Thu Feb 22 19:44:13 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

7.  _(Proxy environments only)_ If you are upgrading a Palette instance in an environment where a network proxy must be
    configured for Palette to access the internet, upgrade the reach-system chart with the following command. Point to
    the `palette/values.yaml` file from step 5.

    ```shell
    helm upgrade --values palette/values.yaml \
    reach-system extras/reach-system/reach-system-*.tgz --install
    ```

    ```shell hideClipboard title="Example output"
    Release "reach-system" has been upgraded. Happy Helming!
    NAME: reach-system
    LAST DEPLOYED: Thu Feb 22 19:47:10 2024
    NAMESPACE: default
    STATUS: deployed
    REVISION: 2
    TEST SUITE: None
    ```

8.  Upgrade Palette with the following command.

    ```shell
    helm upgrade --values palette/values.yaml \
    hubble palette/spectro-mgmt-plane-*.tgz --install
    ```

    ```shell hideClipboard title="Example output"
      Release "hubble" has been upgraded. Happy Helming!
      NAME: hubble
      LAST DEPLOYED: Wed Jun 17 15:44:47 2026
      NAMESPACE: default
      STATUS: deployed
      REVISION: 2
      TEST SUITE: None
    ```

9.  Use the following command to track the upgrade process.

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

    :::tip

    For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to track the
    upgrade.

    :::

    The upgrade usually takes up to five minutes. Palette is upgraded when the deployments in the namespaces
    `cp-system`, `hubble-system`, `ingress-traefik`, `jet-system`, and `ui-system` are in the **Ready** status.

## Validate

1. In your terminal, issue the following command.

   ```shell
   helm ls
   ```

   You should receive an output with the version and other details of the currently deployed apps. Check the
   `App Version` column of `cert-manager`, `image-swap`, `reach-system`, and `hubble` to verify that they have the
   expected versions.

   ```shell hideClipboard title="Example output"
   NAME        	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART                   	APP VERSION
   cert-manager	default  	2       	2024-02-22 19:42:33.776829 +0100 CET	deployed	cert-manager-1.11.0     	1.11.0
   image-swap  	default  	2       	2024-02-22 19:44:13.209592 +0100 CET	deployed	image-swap-v1.5.2-spectro-4.1.1	1.5.2
   reach-system	default  	2       	2024-02-22 19:47:10.558061 +0100 CET	deployed	reach-system-4.2.0             	4.2.0
   hubble      	default  	2       	2024-02-22 19:47:24.085305 +0100 CET	deployed	spectro-mgmt-plane-4.2.7	4.2.7
   ```

2. Issue the following command to verify that the Palette clusters work as expected.

   ```shell
   kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
   | grep --extended-regexp '^(cp-system|hubble-system|ingress-traefik|jet-system|ui-system)\s'
   ```

   The command should return a list of deployments in the `cp-system`, `hubble-system`, `ingress-traefik`, `jet-system`,
   and `ui-system` namespaces. All deployments should have the status `Running`.

   ```shell hideClipboard title="Example output"
   cp-system        spectro-cp-ui-689984f88d-54wsw             Running
   hubble-system    auth-85b748cbf4-6drkn                      Running
   hubble-system    auth-85b748cbf4-dwhw2                      Running
   hubble-system    cloud-fb74b8558-lqjq5                      Running
   hubble-system    cloud-fb74b8558-zkfp5                      Running
   hubble-system    configserver-685fcc5b6d-t8f8h              Running
   hubble-system    event-68568f54c7-jzx5t                     Running
   hubble-system    event-68568f54c7-w9rnh                     Running
   hubble-system    foreq-6b689f54fb-vxjts                     Running
   hubble-system    hashboard-897bc9884-pxpvn                  Running
   hubble-system    hashboard-897bc9884-rmn69                  Running
   hubble-system    hutil-6d7c478c96-td8q4                     Running
   hubble-system    hutil-6d7c478c96-zjhk4                     Running
   hubble-system    mgmt-85dbf6bf9c-jbggc                      Running
   hubble-system    mongo-0                                    Running
   hubble-system    mongo-1                                    Running
   hubble-system    mongo-2                                    Running
   hubble-system    msgbroker-6c9b9fbf8b-mcsn5                 Running
   hubble-system    oci-proxy-7789cf9bd8-qcjkl                 Running
   hubble-system    packsync-28205220-bmzcg                    Succeeded
   hubble-system    spectrocluster-6c57f5775d-dcm2q            Running
   hubble-system    spectrocluster-6c57f5775d-gmdt2            Running
   hubble-system    spectrocluster-6c57f5775d-sxks5            Running
   hubble-system    system-686d77b947-8949z                    Running
   hubble-system    system-686d77b947-cgzx6                    Running
   hubble-system    timeseries-7865bc9c56-5q87l                Running
   hubble-system    timeseries-7865bc9c56-scncb                Running
   hubble-system    timeseries-7865bc9c56-sxmgb                Running
   hubble-system    user-5c9f6c6f4b-9dgqz                      Running
   hubble-system    user-5c9f6c6f4b-hxkj6                      Running
   ingress-traefik  traefik-ingress-controller-9dmzq           Running
   ingress-traefik  traefik-ingress-controller-tpwtf           Running
   ingress-traefik  traefik-ingress-controller-xz4jf           Running
   jet-system       jet-6599b9856d-t9mr4                       Running
   ui-system        spectro-ui-76ffdf67fb-rkgx8                Running
   ```
