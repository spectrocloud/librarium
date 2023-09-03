---
sidebar_label: 'RKE2'
title: 'RKE2'
description: 'RKE2 pack in Palette'
hide_table_of_contents: true
type: "integration"
category: ['kubernetes', 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/kubernetes-rke2/blobs/sha256:47cde61005d9996f1571c132ba9f753982134a7a0d8e445e27001ab8519e6051?type=image/png'
---

[RKE2](https://docs.rke2.io/) is a fully conformant Kubernetes distribution focusing on security and compliance within the U.S. Federal Government sector. To meet the Kubernetes security and compliance goals required by the U.S. Federal Government, RKE2 establishes the following:

1. Provides defaults and configuration options that allow clusters to pass the CIS Kubernetes Benchmark v1.6 with minimal operator intervention.<p></p><br />

2. Enables Federal Information Processing Standard 140-2 (FIPS 140-2) compliance.<p></p><br />

3. Scans components regularly for Common Vulnerabilities and Exposures (CVEs) using Trivy in the build pipeline.<p></p><br />

This next generation of Kubernetes Combined with the best of K3s and RKE1 features, RKE2 launches control plane components as static pods, managed by the kubelet instead of relying on Docker. Moreover, the embedded container runtime is containerd.


3. Scans components regularly for Common Vulnerabilities and Exposures (CVEs) using Trivy in the build pipeline.


RKE2 launches control plane components as static pods, managed by the kubelet instead of relying on Docker. Additionally, the embedded container runtime is containerd.

You can deploy RKE2 by adding this pack to a cluster profile. Once the cluster profile is created, you can deploy the RKE2-based Kubernetes clusters through Palette.


<br />

:::caution

RKE2 is only available for Edge host deployments. Refer to the [Edge](/clusters/edge) documentation to learn more about Edge.

:::

## Versions Supported

The following RKE2 versions are supported to work with Palette.

<br />

<Tabs queryString="versions">
<TabItem label="1.26.x" value="k8s_rke2_1.26.x">

<Tabs.TabPane tab="RKE2 1.23.x" key="k8s_rke2_1.23.x">

* **k8s_rke2_1.23.9**

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](/clusters/cluster-management) reference resource to learn more about Palette and Day-2 operations.

</TabItem>
<TabItem label="1.25.x" value="k8s_rke2_1.25.x">

* **k8s_rke2_1.22.12**

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](/clusters/cluster-management) reference resource to learn more about Palette and Day-2 operations.

</TabItem>
<TabItem label="1.24.x" value="k8s_rke2_1.24.x">


## Prerequisites

- A Linux operating system. Refer to the official [RKE2 requirements](https://docs.rke2.io/install/requirements) for more details on supported Linux distributions and versions.

- 8 GB Memory 

- 4 CPU

- An Edge host. Refer to the [Edge](/clusters/edge) documentation to learn more about Edge.


## Usage

You can add RKE2 to an Edge cluster profile as the Kubernetes layer. To learn more, refer to the [Create Cluster Profiles](/cluster-profiles/task-define-profile) guide.

RKE2 offers several customization options, ranging from networking to security. We recommend you review the following RKE2 documentation:

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](/clusters/cluster-management) reference resource to learn more about Palette and Day-2 operations.

</TabItem>

<TabItem label="Deprecated" value="k8s_rke2_deprecated">


The following major versions of RKE2 are deprecated.


<br />


- 1.23.x


- 1.22.x




</TabItem>
</Tabs>

# Prerequisites

- Linux<p></p><br />
  - RAM - 4 GB Minimum (we recommend at least 8 GB)<p></p><br />
  - CPU - 2 Minimum (we recommend at least 4CPU)<p></p><br />
- You will need access to a Palette Account. Refer to the [Getting Started with Palette](/getting-started). <p></p><br />

# Deploying an RKE2 Cluster on Palette

1. Create a New Cluster Profile from the slide menu and select the layers for provisioning the first cluster profile. Complete the entries for each layer as follows:

   **Operating System Layer**
    1. From the Registry dropdown, select **Public Repo**.
    2. Select the **Ubuntu** image listed under the Public Registry.
    3. Pick the Pack Version and then, continue to the **Next Layer**.<p></p><br />

   **Kubernetes Layer**
    1. From the Registry dropdown, select **Public Repo**.
    2. Select the **RKE2** pack listed under Pack Name.
    3. Pick the Pack Version and then, continue to the **Next Layer**.<p></p><br />

   **Network Layer**
    1. From the Registry dropdown, select **Public Repo**.
    2. Select the **Calico** or **Cilium Enterprise** Pack Name.
    3. Pick the Pack Version and then, continue to the **Next Layer**.<p></p><br />

   **Storage Layer**
    1. From the Registry dropdown, select **Public Repo**.
    2. Select your storage provisioner under Pack name. The most common is CSI.
    3. Pick the Pack Version and then, click **Confirm**.<p></p><br />

See the [Cluster Profile](/cluster-profiles/task-define-profile) page for more information.<p></p><br />

2. Click **Finish Configuration** to complete the Cluster Profile creation wizard.<p></p><br />

3. Create a new cluster as specified in the [New Cluster](/clusters) page.<br />
    **Note**: Palette is supporting the following two Infrastructure providers for RKE2--MAAS and VMware.<p></p><br />

4. You will be able to confirm and view the Cluster Details Status from the Overview page.

![RKE2 Kubernetes](/rke2-cluster-profile.png)<p></p><br />


## Terraform

[RKE2](https://docs.rke2.io)

data "spectrocloud_pack_simple" "k8s" {
  name    = "edge-rke2"
  version = "1.25.2"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## Resources

- [RKE2 Documentation](https://docs.rke2.io)


- [RKE2 GitHub Repository](https://github.com/rancher/rke2)
