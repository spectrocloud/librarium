---
title: "Creating Cluster Profiles"
metaTitle: "Creating Cluster Profiles"
metaDescription: "The method for creating a Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

## Creating Cluster Profiles

Cluster profiles are created by configuring various layers of the Kubernetes Infrastructure stack. The following steps need to be performed to create a new cluster profile:

* Provide basic profile information such as Name, Description and Tags. Tags on a cluster profile are propagated to the VMs deployed on the cloud / data center environments when clusters are created from the cluster profile.
* Select a cloud / data center environment. Cluster profiles are environment specific.
* Configure the layers of the infrastructure stack. The following layers are considered “core” layers. Configuring these layers is mandatory for every cluster profile:
  * OS.
  * Kubernetes.
  * Network.
  * Storage.
  * Additional layers such as Monitoring, Security, Load Balancers, etc. may be added and configured as desired.

* Configure each layer as follows:
  * Select from one of the configuration options (packs) provided for the layer. Spectro Cloud provides several packs out of the box. These are synchronized from Spectro Cloud's **Public Repo**. The platform allows extending or customizing the choice of packs. Users may *define their own Pack Repository and link it to Spectro Cloud*. When configuring layers in the cluster profile, users can select packs from Spectro Cloud's Public Repo or from their own private pack repository.
  * Choose the desired version for the selected pack. Choices include pinning to specific version of the pack (e.g. 1.1.1), or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates in the train result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version, without having to make subsequent updates to the profile.
  * The configuration option and version selected might provide configuration parameters to provide granular control or fine tune certain aspects of the functionality. For the packs provided out of the box, the configuration parameters are set to values based on common best practices. Users may override these parameters as desired.

* Review your changes and save the cluster profile.
