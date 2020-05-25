---
title: "Cluster Profiles"
metaTitle: "Spectrocloud Concepts"
metaDescription: "Most important concepts of Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

# Cluster Profiles

Cluster profiles are like templates that are created with pre-configured layers/components needed for cluster deployments. A user can create as many profiles as needed. Choose one, add a cluster and deploy. A cluster profile contains the details of the configurations needed for a particular type of deployment. The mandatory layers are the OS, the K8s itself, the networking and the storage layers. Beyond this, other available layers are:

- System apps (More to be added)
- Authentication
- Security
- Monitoring
- Logging
- Ingress
- Load balancer

There exist possibilities of having multiple copies of the same layer, should you choose to have a profile in such a manner. The profile would then read, as an example: OS, K8s, Networking, Storage, Monitoring, Monitoring, Ingress, Ingress.

The next sections detail the process of creating and saving a profile.
