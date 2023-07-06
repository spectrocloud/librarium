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

Palette supports provisioning new workload clusters on public clouds using cloud providers' infrastructure. It achieves this by provisioning new virtual machines (VMs) for the control plane and worker pools and uses their managed Kubernetes services such as EKS, AKS, GKE, TKE, and more. 

Workload clusters are instantiated from cloud specific [_Cluster Profiles_](/cluster-profiles) templates that are created with pre-configured layers and components required for cluster deployments. You can use one of the cluster profiles provided out-of-the-box or create a new one.

# Get Started

Learn how to deploy a cluster to a public cloud provider by using Palette. Check out the [Deploy a Cluster with Palette](/clusters/public-cloud/deploy-k8s-cluster) tutorial to get started.


# Supported Environments

The following pages provide detailed instructions for setting up new workload clusters in the various environments.

* [Amazon Web Services](/clusters/public-cloud/aws)
* [Azure](/clusters/public-cloud/azure)
* [Cox Edge](/clusters/public-cloud/cox-edge)
* [Google Cloud](/clusters/public-cloud/gcp)
* [Tencent](/clusters/public-cloud/tke)

