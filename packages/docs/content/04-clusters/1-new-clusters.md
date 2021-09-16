---
title: "New Clusters"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "server"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# Deploying your first cluster 

Deploying your first [cluster](https://kubernetes.io/docs/setup/best-practices/cluster-large/#setup) should be a walk in the park. As an overview, Spectro Cloud mandates the creation of a cluster profile before a cluster can be created. This is because the <Tooltip trigger={<u>cluster profiles</u>}><a href="/cluster-profiles">Cluster profiles</a> are instantiated templates that are created with pre-configured layers/components needed for cluster deployments.</Tooltip> A Cluster Profile contains the configurations needed for your cluster. The cluster profile helps you prepare a readymade configuration of - the OS, the Kubernetes layer, the network layer, and the storage layers. These four are the mandatory layers without which a cluster profile cannot be created. There are a host of other layers and components available to add in the cluster profile (load balancers, authentication, monitoring, and logging, etc.) which are detailed in the [cluster profile](/cluster-profiles/) section.


<WarningBox>

The creation of cluster profiles is a mandatory prerequisite for deploying Spectro Cloud clusters.

</WarningBox>


## We support the following clusters:

* [AKS Cluster](/clusters/new-clusters/aks)
* [AWS Cluster](/clusters/new-clusters/aws)
* [Azure Cluster](/clusters/new-clusters/azure)
* [EKS Cluster](/clusters/new-clusters/eks)
* [GCP Cluster](/clusters/new-clusters/gcp)
* [MaaS Cluster](/clusters/new-clusters/maas)
* [OpenStack Cluster](/clusters/new-clusters/openstack)
* [VMWare Cluster](/clusters/new-clusters/vmware)
