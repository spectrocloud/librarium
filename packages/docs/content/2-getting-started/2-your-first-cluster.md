---
title: "Your First Cluster"
metaTitle: "This is the title tag of this page"
metaDescription: "This is the meta description"
---

# Deploying your first cluster

Deploying your first [cluster](https://kubernetes.io/docs/setup/best-practices/cluster-large/#setup) should be a walk in the park. As an overview, Spectro Cloud mandates the creation of a cluster profile before a cluster can be created. This is because the [Cluster Profile](/cluster-profiles/task-define-profile) contains the configurations needed for your cluster. The cluster profile helps you prepare a readymade configuration of - at a minimum - the OS, the k8s layer, the network layer and the storage layers. These four are the mandatory layers without which a CP cannot be created. There are a host of other layers and components available to add in the cluster profile (load balancers, authentication, monitoring and logging, etc.) which will be detailed in the cluster profile section.
