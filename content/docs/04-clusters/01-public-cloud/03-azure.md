---
title: "Azure"
metaTitle: "Creating new clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

The following are some architectural highlights of Azure clusters deployed by Palette:

1. Azure cluster resources are placed within an existing Resource Group.


2. Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple availability zones (AZs).  


3. Worker nodes are distributed across multiple AZs.


4. None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is accessed through a public load balancer.

![azure_cluster_architecture.png](azure_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying a workload cluster in Azure:

1. You must have an active Azure cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.


2. You must register your Azure cloud account in Palette as described in the "Creating an Azure Cloud account" section below.


3. You should have an Infrastructure cluster profile created in Palette for Azure cloud.

# Section Highlights

This section of the document describes the following capabilities:



[Creating an Azure Cloud Account](/clusters/public-cloud/azure/azure-cloud)


[Deploying an Azure Cluster](/clusters/public-cloud/azure/create-azure-cluster#deployinganazurecluster)


[Deleting an Azure Cluster](/clusters/public-cloud/azure/create-azure-cluster#deletinganazurecluster)


[Force Delete a Cluster](/clusters/public-cloud/azure/create-azure-cluster#forcedeleteacluster)


[Manage Clusters](/clusters/cluster-management)


