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

Palette supports provisioning and end-to-end lifecycle management of Kubernetes clusters (workload clusters) on various public cloud environments. Palette supports provisioning new clusters on public clouds using the cloud provider's infrastructure by provisioning new VMs for control plane and worker pools and through their managed Kubernetes services such as EKS, AKS, GKE, and more. 

Workload clusters are instantiated from cloud specific [_Cluster Profiles_](/cluster-profiles) templates that are created with pre-configured layers and components required for cluster deployments. You can use one of the cluster profiles provided out-of-the-box or create a new one.


# Supported Environments

The following pages provide detailed instructions for setting up new workload clusters in the various environments.

* [Amazon Web Services](/clusters/public-cloud/aws)
* [Azure](/clusters/public-cloud/azure)
* [Google Cloud](/clusters/public-cloud/gcp)
* [Tencent](/clusters/public-cloud/tke)

