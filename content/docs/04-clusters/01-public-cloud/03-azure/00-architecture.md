---
title: "Architecture"
metaTitle: "Azure Architecture with Palette"
metaDescription: "Learn about how Palette integrates with Azure and the architecture that powers the integration"
hideToC: false
fullWidth: false
---

# Azure IaaS Architecture

The following are some architectural highlights of Azure clusters deployed by Palette:

- Azure cluster resources are placed within an existing Resource Group.


- Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple availability zones (AZs).  


- Worker nodes are distributed across multiple AZs.


- None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is accessed through a public load balancer.


![An Azure IaaS architecture diagram](clusters_azure_architecture_iaas-overview.png)



# Azure AKS Architecture

The integration between Palette and Azure AKS unlocks the following capabilities.

- Palette platform enables containerized applications' effortless deployment and management with fully managed AKS. 


- Palette provides the you with a with serverless Kubernetes experience, an integrated continuous integration and continuous delivery (CI/CD) experience, and enterprise-grade security and governance.


- Palette helps you unite the development and operations to a single platform.  This unification helps you achieve faster builds, delivery, and scaling of applications with credence.


- The infrastructure has event-driven autoscaling and triggers that enable elastic provisioning for self-managed infrastructure.


- Leverage extensive authentication and authorization capabilities by using Azure Active Directory and dynamic rules enforcement, across multiple clusters with Azure Policy.


![An Azure AKS architecture diagram](clusters_azure_architecture_aks-diagram.png)


# Azure Storage

During an Azure cluster deployment, Palette creates an [Azure storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) and storage container. Palette copies the base virtual hard disk (VHD) image to the Palette default storage container in the default Palette storage account. The storage account Palette created has unrestricted access and has an auto-generated name. You can attach a custom storage account or storage containers to the Azure cluster. 

Palette supports the linking of custom storage accounts or containers. Before the Azure cluster creation process, you must have created custom storage accounts or containers. All custom storage accounts and containers will be listed in the **Cluster config** page during the cluster creation process. If you need help creating a custom storage account or container, check out the Azure [Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) guide or the Azure [Manage Containers](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal) guide.


The following section covers a few scenarios where you might have the need to attach a custom storage account or container to an Azure cluster. 

## Custom Name

If you need a custom name for the storage resource, you must attach a custom storage account or container to the Azure cluster. Palette, by default, creates a storage account and container with an auto-generated name. Specify a custom storage account or container with the custom name during the cluster creation process.


## Restrict Access

To restrict the user access to the storage resource, apply custom policies, or limit the network access, then you need to attach a custom storage account or container to the Azure cluster that contains the desired security customization. Use a [Palette Private Cloud Gateway](/clusters/public-cloud/azure/gateways/) to restrict network access to a private cluster and its resources, including the storage account and container.
