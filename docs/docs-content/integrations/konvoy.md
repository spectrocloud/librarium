---
sidebar_label: "Konvoy"
title: "Konvoy"
description: "Konvoy Kubernetes distribution"
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
tags: ["packs", "konvoy", "kubernetes"]
---

[Konvoy](https://d2iq.com/products/konvoy) is a Kubernetes distribution by D2iQ. It is built on pure open-source
Kubernetes and includes a full suite of integrated and supported best-of-breed Day-2 platform applications for an
out-of-the-box, production-ready experience.

Palette offers Konvoy as an available Kubernetes distribution for creating and managing clusters. You can use Konvoy
when creating a [cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) and
then use it to create a cluster.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.27.x" value="1.27.x">

## Prerequisites

- A minimum of 4 CPU and 4 GB Memory.

- Users or groups mapped to a Kubernetes RBAC role.

- Konvoy requires the [BYOOS](./byoos.md) pack to reference the image created through the Konvoy image builder project.
  Refer to the [Usage](#usage) section for more information.

- Operating System (OS) dependencies as listed in the table.

### Supported Infrastructure Platforms

Palette supports the following infrastructure platforms and Operating Systems (OS) combinations for Konvoy.

- RHEL version 8.8 or later for VMware vSphere.

<!-- | Infrastructure Platform | OS                       | Version        | Supported?         |
| ----------------------- | ------------------------ | -------------- | ------------------ |
| VMware vSphere          | Red Hat Linux Enterprise | 8.8 or greater | :white_check_mark: | -->

## Parameters

| Parameter                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.palette.config.oidcidentityProvider`  | OIDC identity provider configuration.                                                                                                                                                                                                                                                                                                                                                                                               |
| `pack.podCIDR`                              | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                                                      |
| `pack.serviceClusterIpRange`                | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                                           |
| `pack.serviceDomain`                        | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes-generic.md?platform=AKS&versions=k8s_v1.27#change-cluster-dns-service-domain) section. |
| `kubeadmconfig.apiServer.extraArgs`         | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.apiServer.extraVolumes`      | A list of additional volumes to mount on apiServer.                                                                                                                                                                                                                                                                                                                                                                                 |
| `kubeadmconfig.controllerManager.extraArgs` | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                                                |
| `kubeadmconfig.scheduler.extraArgs`         | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.kubeletExtraArgs`            | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                           |
| `kubeadmconfig.files`                       | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                                    |
| `kubeadmconfig.preKubeadmCommands`          | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.postKubeadmCommands`         | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                         |

## Usage

To use Konvoy, you must use the [Konvoy image builder project](https://github.com/mesosphere/konvoy-image-builder) to
create a custom image. The custom image contains the underlying OS and Kubernetes components. You can then use the
[BYOOS](./byoos.md) pack to reference the custom image when creating a cluster profile.

:::info

Check out the [RHEL and Konvoy](../byoos/usecases/vmware/konvoy.md) guide to learn how to create a custom image using
the Konvoy image builder project.

:::

Select Konvoy as the Kubernetes distribution when choosing a Kubernetes distribution in the cluster profile.

![A view of the cluster profile Kubernetes selection screen](/byoos_vmware_konvoy_cluster-profile-view.png)

</TabItem>
<TabItem label="Deprecated" value="deprecated">

:::warning

All versions less than v1.27.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

</TabItem>
</Tabs>

## Terraform

You can retrieve details about the Konvoy pack by using the following Terraform code. Change the version number to the
version you want to use.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-konvoy"
  version = "1.27.6"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Konvoy](https://d2iq.com/products/konvoy)

- [RHEL and Konvoy](../byoos/usecases/vmware/konvoy.md)

- [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder)
