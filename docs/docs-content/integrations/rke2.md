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

  <br />

1. Provides defaults and configuration options that allow clusters to pass the CIS Kubernetes Benchmark v1.6 with minimal operator intervention.


2. Enables Federal Information Processing Standard 140-2 (FIPS 140-2) compliance.


3. Scans components regularly for Common Vulnerabilities and Exposures (CVEs) using Trivy in the build pipeline.


RKE2 launches control plane components as static pods, managed by the kubelet instead of relying on Docker. Additionally, the embedded container runtime is containerd.

You can deploy RKE2 by adding this pack to a cluster profile. Once the cluster profile is created, you can deploy the RKE2-based Kubernetes clusters through Palette.


<br />

:::warning

RKE2 is only available for Edge host deployments. Refer to the [Edge](../clusters/edge/edge.md) documentation to learn more about Edge.

:::

## Versions Supported

The following RKE2 versions are supported to work with Palette.

<br />

<Tabs queryString="versions">
<TabItem label="1.26.x" value="k8s_rke2_1.26.x">


## Prerequisites

- A Linux operating system. Refer to the official [RKE2 requirements](https://docs.rke2.io/install/requirements) for more details on supported Linux distributions and versions.

- 8 GB Memory 

- 4 CPU

- An Edge host. Refer to the [Edge](../clusters/edge/edge.md) documentation to learn more about Edge.


## Usage

You can add RKE2 to an Edge cluster profile as the Kubernetes layer. Refer to the [Create an Infrastructure Profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide to learn more.

RKE2 offers several customization options, ranging from networking to security. We recommend you review the following RKE2 documentation:

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](../clusters/cluster-management/cluster-management.md) reference resource to learn more about Palette and Day-2 operations.

</TabItem>
<TabItem label="1.25.x" value="k8s_rke2_1.25.x">


## Prerequisites

- A Linux operating system. Refer to the official [RKE2 requirements](https://docs.rke2.io/install/requirements) for more details on supported Linux distributions and versions.

- 8 GB Memory 

- 4 CPU

- An Edge host. Refer to the [Edge](../clusters/edge/edge.md) documentation to learn more about Edge.

## Usage

You can add RKE2 to an Edge cluster profile as the Kubernetes layer. To learn more, refer to the [Create Cluster Profiles](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide.

RKE2 offers several customization options, ranging from networking to security. We recommend you review the following RKE2 documentation:

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](../clusters/cluster-management/cluster-management.md) reference resource to learn more about Palette and Day-2 operations.

</TabItem>
<TabItem label="1.24.x" value="k8s_rke2_1.24.x">


## Prerequisites

- A Linux operating system. Refer to the official [RKE2 requirements](https://docs.rke2.io/install/requirements) for more details on supported Linux distributions and versions.

- 8 GB Memory 

- 4 CPU

- An Edge host. Refer to the [Edge](../clusters/edge/edge.md) documentation to learn more about Edge.


## Usage

You can add RKE2 to an Edge cluster profile as the Kubernetes layer. To learn more, refer to the [Create Cluster Profiles](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide.

RKE2 offers several customization options, ranging from networking to security. We recommend you review the following RKE2 documentation:

<br />


- [Configuration Options](https://docs.rke2.io/install/configuration)


- [Inbound Network Rules](https://docs.rke2.io/install/requirements#inbound-network-rules)


- [Registries Configuration](https://docs.rke2.io/install/containerd_registry_configuration)


- [Advanced Options](https://docs.rke2.io/advanced)


Many of the Day-2 cluster management responsibilities are handled by Palette. Review the [Cluster Management](../clusters/cluster-management/cluster-management.md) reference resource to learn more about Palette and Day-2 operations.

</TabItem>

<TabItem label="Deprecated" value="k8s_rke2_deprecated">


The following major versions of RKE2 are deprecated.


<br />


- 1.23.x


- 1.22.x




</TabItem>
</Tabs>



## Terraform

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

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