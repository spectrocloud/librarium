---
sidebar_label: "Security Advisories"
title: "Security Advisories"
description: "Palette Security Advisories for Common Vulnerabilities and Exposures (CVEs)."
icon: ""
hide_table_of_contents: false
tags: ["security", "cve", "advisories"]
---

## NGINX Vulnerability

- **Release Date**: 03/27/2025
- **Last Updated**: 03/27/2025
- **Severity**: 9.8
- **Affected Versions**: All versions prior to v1.11.0, v1.11.0 - v1.11.4, and v1.12.0
- **Fixed Versions**: v1.11.5 and v1.12.1

### Related CVEs

- [CVE-2025-1097](https://github.com/kubernetes/kubernetes/issues/131007)
- [CVE-2025-1098](https://github.com/kubernetes/kubernetes/issues/131008)
- [CVE-2025-1974](https://github.com/kubernetes/kubernetes/issues/131009)
- [CVE-2025-24513](https://github.com/kubernetes/kubernetes/issues/131005)
- [CVE-2025-24514](https://github.com/kubernetes/kubernetes/issues/131006)

### Timeline

- 03/24/2025: First notified
- 03/24/2025: CVE bulletin published
- 03/26/2025: New Nginx pack published
- 03/26/2025: All managed Palette instances patched
- 03/27/2025: Manual patch procedure provided for self-hosted Palette for connected and airgapped installations

ETA for patch release with the fix for Palette/VerteX 4.6/4.5/4.4:

- 03/28/2025, 10:00 PM PST: Palette/Vertex Connected
- 04/02/2025, 10:00 PM PST: Palette/Vertex Airgapped

### Summary

The identified CVEs affect all ingress-nginx controller deployments using the vulnerable image versions mentioned above.
When chained together, the vulnerabilities can enable unauthenticated users to execute arbitrary code and download
confidential information such as secrets available in the cluster. Palette and VerteX use the vulnerable images in the
management plane. Spectro Cloud also provides the Nginx pack to customers for their workload clusters.

As of March 26, 2025, all managed Palette instances have been patched. Customers should follow the below procedure to
patch self-hosted Palette and VerteX deployments and use the newly published Nginx pack (`1.11.5`) to update affected
workload clusters.

### Recommended Actions

This vulnerability affects both workload clusters and Palette deployments.

- If you have any workload clusters using the affected version of the Nginx pack, you must update the cluster profile to
  use version `1.11.5` of the Nginx pack. Refer to the
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
  for instructions on how to update a cluster profile and apply the updates to workload clusters.

- If you have any self-hosted instances of Palette or VerteX with the affected version of the `ingress-nginx-controller`
  DaemonSet, you must update it to version `1.11.5`. Follow the steps described below to manually upgrade the
  controller.

#### Multi-Tenant and Dedicated SaaS Palette

As of March 26, 2025, the `ingress-nginx-controller` DaemonSet used for multi-tenant and dedicated SaaS Palette has been
upgraded to version `1.11.5`. However, affected host clusters must be identified and updated manually to use version
`1.11.5` of the Nginx pack.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select a host cluster to review. Navigate to the cluster's **Profile** tab and note if the cluster profile being used
   contains Nginx.

4. Repeat step 3 for each cluster to ensure all cluster profiles using Nginx are identified.

5. Update all cluster profiles currently using the affected version of the Nginx pack to `1.11.5`. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

#### Self-Hosted Instances of Palette or VerteX Installed with Helm Charts

If you have any self-hosted instances of Palette or VerteX installed via Helm Charts with the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

1. Use the `kubeconfig` file and `kubectl` tool to access your self-hosted Palette or VerteX cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

2. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

3. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

#### Self-Hosted Instances of Palette or VerteX Installed with the Palette CLI

If you have any self-hosted instances of Palette or VerteX installed via the Palette CLI with the affected version of
the `ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

1. Use the `kubeconfig` file and `kubectl` tool to access your self-hosted Palette or VerteX cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

2. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

3. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

4. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

5. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

6. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

#### Airgap Self-Hosted Instances of Palette or VerteX

If you have any airgap self-hosted instances of Palette or VerteX using the affected version of the
`ingress-nginx-controller` DaemonSet, you must update it to version `1.11.5`. Follow the steps below to download the
updated version of the component and update your instance.

<Tabs>

<TabItem value="Self-Hosted Palette" label="Self-Hosted Palette">

1. Download the `airgap-palette-nginx` binary
   (`https://software-private.spectrocloud.com/airgap/packs/airgap-palette-nginx-1.11.5.bin`) and upload it to the
   registry. Follow the [Usage Instructions](../../enterprise-version/install-palette/airgap/supplemental-packs.md)
   guide for detailed steps on downloading and installing the binary.

2. Log in to the Palette system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Use the `kubeconfig` file and `kubectl` tool to access your self-hosted Palette cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

5. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

6. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

7. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

8. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

9. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Download the `airgap-palette-nginx` binary
   (`https://software-private.spectrocloud.com/airgap/packs/airgap-palette-nginx-1.11.5.bin`) and upload it to the
   registry. Follow the [Usage Instructions](../../vertex/install-palette-vertex/airgap/supplemental-packs.md) guide for
   detailed steps on downloading and installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left **Main Menu**, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Use the `kubeconfig` file and `kubectl` tool to access your self-hosted Palette cluster. Refer to the
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md) guide for more information.

5. Scale down the `palette-controller-manager` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment palette-controller-manager --replicas=0 --namespace cluster-mgmt-*
   ```

6. Scale down the `cluster-management-agent` deployment to zero replicas in the `cluster-mgmt-*` namespace, replacing
   `*` with the suffix associated with your namespace.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace cluster-mgmt-*
   ```

7. Confirm that both deployments have been scaled down to zero replicas. Replace `*` with the suffix associated with
   your namespace.

   ```shell
   kubectl get deployments --namespace cluster-mgmt-*
   ```

8. Check the image used by the `ingress-nginx-controller` DaemonSet in the `ingress-nginx` namespace.

   ```shell
   kubectl get daemonset ingress-nginx-controller --namespace ingress-nginx --output yaml | grep 'image:'
   ```

9. Once you identify the image, update its tag to `v1.11.5`. You can use the `kubectl set image` command to update the
   image.

- If the `ingress-nginx-controller` DaemonSet is using the image
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.2`, update it to
  `gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the name
  of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=gcr.io/spectro-images-public/release-fips/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

- If the `ingress-nginx-controller` DaemonSet is using the image
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.2`, update it to
  `us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5`. Replace `<container-name>` with the
  name of the container.

  ```shell
  kubectl set image daemonset/ingress-nginx-controller <container-name>=us-docker.pkg.dev/palette-images/third-party/ingress-nginx/controller:v1.11.5 --namespace ingress-nginx
  ```

</TabItem>

</Tabs>

#### Airgap Workload Clusters Using the Nginx Pack

If you have any airgap workload clusters using the affected version of the Nginx pack, you must update the cluster
profile to version `1.11.5` of the Nginx pack. Follow the steps below to download the updated pack and modify your
cluster profile.

<Tabs>

<TabItem value="Self-Hosted Palette" label="Self-Hosted Palette">

1. Download the Ngnix airgap pack binary
   (`https://software-private.spectrocloud.com/airgap/packs/airgap-pack-nginx-1.11.5.bin`) and upload it to the
   registry. Follow the [Usage Instructions](../../enterprise-version/install-palette/airgap/supplemental-packs.md)
   guide for detailed steps on downloading and installing the binary.

2. Log in to the Palette system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

<TabItem value="Palette VerteX" label="Palette VerteX">

1. Download the Ngnix airgap pack binary
   (`https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-pack-nginx-1.11.5.bin`) and upload it to the
   registry. Follow the [Usage Instructions](../../vertex/install-palette-vertex/airgap/supplemental-packs.md) guide for
   detailed steps on downloading and installing the binary.

2. Log in to the Palette VerteX system console.

3. From the left main menu, select **Administration > Pack Registries**. Then, next to the packs registry, click the
   three-dot button > **Sync**. Wait for the registry synchronization to complete.

4. Log in to the Palette VerteX console.

5. Update all cluster profiles currently using the affected version of the Nginx pack. Refer to the
   [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) guide
   for instructions on how to update a cluster profile.

6. Apply the profile updates to all affected clusters. Refer to the
   [Apply Profile Updates to Clusters](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#apply-profile-updates-to-clusters)
   guide to learn how to apply profile updates to clusters.

</TabItem>

</Tabs>
