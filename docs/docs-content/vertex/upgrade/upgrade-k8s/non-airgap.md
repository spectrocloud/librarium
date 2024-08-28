---
sidebar_label: "Non-airgap"
title: "Upgrade Palette VerteX Installed with Kubernetes"
description: "Learn how to upgrade self-hosted non-airgap Palette VerteX with Helm and Kubernetes."
icon: ""
sidebar_position: 0
tags: ["vertex", "self-hosted", "non-airgap", "kubernetes", "management", "upgrades"]
keywords: ["self-hosted", "vertex"]
---

This guide takes you through the process of upgrading a self-hosted Palette VerteX instance installed with Helm on
Kubernetes.

:::warning

Before upgrading Palette VerteX to a new major version, you must first update it to the latest patch version of the
latest minor version available. Refer to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section
for details.

:::

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette VerteX upgrade.

## Prerequisites

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) and [`helm`](https://helm.sh/docs/intro/install/)
  available in your system.

- Access to the kubeconfig file of the target Kubernetes cluster. You must be able to interact with the cluster through
  `kubectl` and have sufficient permissions to upgrade Palette VerteX. We recommend using a role with the cluster-admin
  permissions.

- `unzip` or a similar tool available in your system.

- Access to the latest Palette VerteX Helm Chart. Refer to
  [Access Palette VerteX](../../vertex.md#access-palette-vertex) for more details.

## Upgrade

:::info

Depending on your underlying infrastructure provider and Kubernetes distribution, you may need to modify these steps to
match your environment.

:::

1. Open a terminal session and navigate to the directory with the Palette VerteX installation zip file. Unzip the file
   to a **palette-install** directory.

   ```shell
   unzip release-*.zip -d palette-install
   ```

2. Navigate to the release directory inside **palette-install**.

   ```shell
   cd palette-install/charts/release-*
   ```

3. Update the cert-manager chart using the following command.

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

4. Prepare the Palette VerteX configuration file `values.yaml`. If you saved `values.yaml` used during the Palette
   VerteX installation, you can reuse it for the upgrade. Alternatively, follow the
   [Kubernetes Installation Instructions](../../install-palette-vertex/install-on-kubernetes/install.md) to populate
   your `values.yaml`.

   :::warning

   Ensure that the `values.yaml` file is ready before proceeding. If you're using a self-hosted OCI registry, make sure
   that the `ociImageRegistry.mirrorRegistries` parameter in your `values.yaml` includes the necessary mirror links.

   :::

5. If you are using a self-hosted OCI registry, upgrade the image-swap chart with the following command. Point to the
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

6. If you are upgrading a Palette VerteX instance in an environment that requires network proxy configuration, upgrade
   the reach-system chart with the following command. Point to the `palette/values.yaml` file from step four.

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

7. Upgrade Palette VerteX with the following command.

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

8. Use the following command to track the upgrade process.

   ```shell
   kubectl get pods --all-namespaces --watch
   ```

   :::tip

   For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to track the upgrade.

   :::

   The upgrade usually takes up to five minutes. Palette VerteX is upgraded when the deployments in the namespaces
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

2. Issue the following command to verify that the Palette VerteX clusters work as expected.

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
