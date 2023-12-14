---
sidebar_label: "Cluster Profiles"
title: "Cluster Profiles"
description: "Use cluster profiles to ensure consistency across your Palette workload cluster deployments."
hide_table_of_contents: false
tags: ["profiles", "cluster profiles"]
---

Cluster profiles are composed of layers using packs, Helm charts, and custom manifests to meet specific types of workloads on your Palette cluster deployments. You can create as many profiles as needed for your workload cluster deployments.

Below are cluster profile types you can create:

  - *Infrastructure* profiles provide the essential components for workload cluster deployments within a [tenant](../../glossary-all.md#tenant): Operating System (OS), Kubernetes, Network, and Storage. Collectively, these layers form the infrastructure for your cluster. For more information, review the [Create an Infrastructure Profile](../cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) guide.

  - *Add-on* profiles are exclusively composed of add-on layers. They usually do not contain infrastructure components and are instead designed for reusability across multiple clusters and multiple projects within a tenant. Since they provide the flexibility to configure clusters based on specific requirements, *add-on* profiles can be added to *infrastructure* profiles to create what we call a *full profile*. For an overview of how to build add-on profiles using various types of layers, review the [Create an Add-on Profile](../cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md) guide.

  - *Full profiles* combine infrastructure packs with add-on layers. By adding layers, you can enhance cluster functionality. For example, you might add system apps, authentication, monitoring, ingress, load balancers, and more to your cluster. Refer to the [Create a Full Profile](../cluster-profiles/create-cluster-profiles/create-full-profile.md) guide for more details.

The diagram below illustrates the components of these profile types and how you can build on infrastructure layers with add-on layers to create a full cluster profile. You can also create separate add-on profiles to reuse among multiple clusters.

![A flow diagram that shows how you can add layers to an infrastructure profile to create a full profile.](/profiles_cluster-profiles_cluster-profiles.png)

:::info

Cluster profiles created from the Tech Preview cloud type are part of a generic framework Palette provides that is built upon the open-source Cluster API (CAPI) initiative. The Operating System (OS) and Kubernetes layers of these profiles get populated during cluster creation from YAML files created at the system level. During cluster creation, you specify the OS image and Kubernetes version. Palette also provides out-of-the-box packs for the OS layer and for the network and storage layers.

For more information about Palette's generic framework implementing Nutanix as a Tech Preview, check out our Nutanix documentation.

:::


## Profile Layers

Each cluster profile layer provides a specific functionality. Profile layers can be packs, Helm Charts, or custom manifests, as described in the table. Adding a pack multiple times to the same cluster profile is possible. To learn more about this scenario, review [Deploy Same Pack to Multiple Layers](../cluster-profiles/create-cluster-profiles/duplicate-pack-in-profile.md).

| **Layer** | **Description** |
|-----------|---------------------------|
| **Packs** | A pack is a collection of files and configurations that can be deployed to a cluster to add functionality or customize the cluster's behavior. We maintain a public pack registry that makes packs available to all tenants. Check out the [Packs List](../../integrations/integrations.mdx) reference to learn more about individual packs. |
| **Helm Charts** | Helm charts are a collection of Kubernetes resource files capable of deploying various services. We provide both a public and a private Helm registry. Additionally, your organization can add any public or private Helm registries to Palette to leverage charts from those registries. You can then attach customized charts to profiles. |
| **Manifests** | You can construct profile layers using manifests to provision Kubernetes resources that are unavailable in Palette or Helm Charts. Manifests also provide a pass-through mechanism to orchestrate Kubernetes resources in a cluster. For example, specific integrations may require the creation of secrets or Custom Resource Definitions (CRDs) to complete the installation. You can provision these additional resources by attaching a manifest file to a layer in a cluster profile. |


Use these guidelines to configure layers and customize certain aspects of a pack's functionality:

- **Pack version**: You can choose a specific pack version, such as `1.27.5`, or a major/minor train, such as `1.x` or `1.1.x`. A major/minor train provides dynamic version association. The latest release from that train is linked to the pack. When a pack is updated, its latest version gets linked to the pack, ensuring clusters always use the latest released pack versions without the need to manually update cluster profiles.

- **Configuration parameters**: Packs provide default configuration parameters that are set to values based on common best practices. You can override these parameters as needed in the configuration file. 

- **Presets**: Some layers offer preset options that allow you to enable or configure a feature within that layer. When presets are available, they display in a slide panel in the YAML editor.


## Resources

- [Create Cluster Profiles](../cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)

- [Modify Cluster Profiles](../cluster-profiles/modify-cluster-profiles/modify-cluster-profiles.md)

- [Clone a Cluster Profile](clone-cluster-profile.md)

- [Export and Import a Cluster Profile](export-import-cluster-profile.md)

- [Version a Cluster Profile](../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)

- [Delete a Cluster Profile](delete-cluster-profile)
