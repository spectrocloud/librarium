---
title: "Public Cloud Clusters"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "server"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import Tooltip from 'shared/components/ui/Tooltip';


# Public Cloud Clusters 

Palette supports provisioning and end-to-end lifecycle management of Kubernetes clusters (workload clusters) on various public clouds environments. On public clouds, Palette supports provisioning new clusters using the cloud provider's infrastructure by provisioning new VMs for control plane and worker pools as well as through their managed Kubernetes services such as EKS, AKS etc. 

<br />

<InfoBox>
Workload clusters are instantiated from cloud specific <Tooltip trigger={<u>cluster profiles</u>}><a href="/cluster-profiles">Cluster profiles</a> are instantiated templates that are created with pre-configured layers/components needed for cluster deployments.</Tooltip>. You can use one of the cluster profiles provided out-of-the-box or create a new one.
</InfoBox>

# Environments

The following pages provide detailed instructions for setting up new workload clusters in various environments :

* [Amazon Web Services](/clusters/public-cloud/aws)
* [Amazon Elastic Kubernetes Service (EKS)](/clusters/public-cloud/eks)
* [Azure](/clusters/public-cloud/azure)
* [Azure Kubernetes Service (AKS)](/clusters/public-cloud/aks)
* [GCP](/clusters/public-cloud/gcp)
* [Tencent (TKE)](/clusters/public-cloud/tke)

