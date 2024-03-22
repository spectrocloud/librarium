---
sidebar_label: "Architecture"
title: "Azure Architecture"
description: "Learn about how Palette integrates with Azure and the architecture that powers the integration"
hide_table_of_contents: false
tags: ["public cloud", "azure", "architecture"]
sidebar_position: 0
---

Palette supports the deployment of host clusters in both Azure and Azure Kubernetes Service (AKS). This page covers the
architecture of the integration between Palette and Azure.

## IaaS Architecture

The following are some architectural highlights of Azure clusters deployed by Palette:

- Azure cluster resources are placed within an existing Resource Group.

- Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane
  nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can
  span across multiple availability zones (AZs).

- Worker nodes are distributed across multiple AZs.

- None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is
  accessed through a public load balancer.

![An Azure IaaS architecture diagram](/clusters_azure_architecture_iaas-overview.webp)

## AKS Architecture

The integration between Palette and Azure AKS unlocks the following capabilities.

- Palette platform enables effortless deployment and management of containerized applications with fully managed AKS.

- Palette provides you with a with serverless Kubernetes experience, an integrated continuous integration and continuous
  delivery (CI/CD) experience, and enterprise-grade security and governance.

- Palette helps you unite the development and operations to a single platform. This unification helps you achieve faster
  builds, delivery, and scaling of applications with credence.

- The infrastructure has event-driven autoscaling and triggers that enable elastic provisioning for self-managed
  infrastructure.

- Leverage extensive authentication and authorization capabilities by using Azure Active Directory and dynamic rules
  enforcement, across multiple clusters with Azure Policy.

![An Azure AKS architecture diagram](/clusters_azure_architecture_aks-diagram.webp)

## Azure Storage

During an Azure cluster deployment, Palette creates an
[Azure storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) and storage
container. Palette copies the base virtual hard disk (VHD) image to the Palette default storage container in the default
Palette storage account. The storage account Palette created has unrestricted access and has an auto-generated name. You
can attach a custom storage account or storage containers to the Azure cluster.

Before the Azure cluster creation process, you must have created custom storage accounts or containers. All custom
storage accounts and containers will be listed in the **Cluster config** page during the cluster creation process. If
you need help creating a custom storage account or container, check out the Azure
[Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
guide or the Azure [Manage Containers](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal)
guide.

The following sections cover a few scenarios where you have the need to customize Azure storage in an Azure cluster.

## Custom Name

If you need a custom name for the storage resources, you must create the storage resource and attach it to the cluster.
Palette, by default, creates a storage account and container with an auto-generated name. Specify a custom storage
account or container with the custom name during the cluster creation process. You can attach a custom storage account,
custom container, or both if needed.

## Restrict User Access

To restrict the user access to the storage resource, apply custom policies, or limit the network access, then you need
to attach a custom storage account or container to the Azure cluster that contains the desired security customization.

## Network Access

Clusters that use a Palette self-hosted [Private Cloud Gateway](../../pcg/architecture.md) (PCG), should use a custom
storage account and container that are restricted to the VNet that the PCG and cluster are located in. Ensure you
disable public access and use private access for the Azure storage account.

## Pricing Options

You can configure Service Level Agreements (SLA)-based
[pricing options](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers) for Azure AKS cluster control
planes. You have the ability to set these options in the Kubernetes YAML file, allowing you to embed pricing options in
the cluster profile.

Use the `managedControlPlane.sku` parameter, as shown in the examples, to specify `Standard` for production clusters and
`Free` for non-production or small clusters.

<Tabs queryString="charge-options">
<TabItem label="Standard" value="standard">

```yaml
managedControlPlane:
  aadProfile:
    managed: true
    adminGroupObjectIDs:
      - <id>
  sku: Standard
```

</TabItem>

<TabItem label="Free" value="free">

```yaml
managedControlPlane:
  aadProfile:
    managed: false
    adminGroupObjectIDs:
      - <id>
  sku: Free
```

</TabItem>

</Tabs>

## Tags

You can assign tags to clusters deployed to Azure. Tags can help you with user access control management and more
granularly restrict access to various Palette resources, including clusters. Check out the
[Resource Filters](../../cluster-management/cluster-tag-filter/create-add-filter.md) documentation page to learn more
about using tags to restrict resource access.

The custom tags you create are assigned to the clusters during the creation process. Tags follow the key-value pair
format: `department:finance`.

### Reserved Tags

The following tags are reserved for internal purposes and are not available for usage. Palette will return an error if
you use any of the following tags.

- `azure`

- `microsoft`

- `windows`
