---
title: "Getting Started"
metaTitle: "Getting Started"
metaDescription: "Spectro Cloud Getting Started"
icon: "overview"
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Getting Started: Deploying your first cluster

Deploying your first [cluster](https://kubernetes.io/docs/setup/best-practices/cluster-large/#setup) should be a walk in the park. As an overview, Spectro Cloud mandates the creation of a cluster profile before a cluster can be created. This is because the [Cluster Profile](/cluster-profiles/task-define-profile) contains the configurations needed for your cluster. The cluster profile helps you prepare a readymade configuration of - at a minimum - the OS, the Kubernetes layer, the network layer, and the storage layers. These four are the mandatory layers without which a cluster profile cannot be created. There are a host of other layers and components available to add in the cluster profile (load balancers, authentication, monitoring, and logging, etc.) which will be detailed in the cluster profile section.
