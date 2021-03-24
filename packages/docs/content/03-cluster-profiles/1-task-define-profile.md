---
title: "Creating Cluster Profiles"
metaTitle: "Creating Cluster Profiles"
metaDescription: "The method for creating a Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

## Creating Cluster Profiles

Cluster profiles are created by configuring various layers of the Kubernetes infrastructure stack. The following steps need to be performed to create a new cluster profile:

* Provide basic profile information such as Name, Description, Profile Type and Tags. Profile Type (Full, Infra, Add-on) will dictate the layers that can be configured in the cluster profile. Tags on a cluster profile are propagated to the VMs deployed on the cloud/data center environments when clusters are created from the cluster profile.
* For a cluster profile of the type Infra or Full, select a cloud/data center environment. 
* Configure the layers of the infrastructure stack. The following layers are considered "core infrastructure" layers. Configuring these layers is mandatory for cluster profiles of the type Infra or Full. These layers are not configurable for "Add-On" cluster profiles:
   
  * OS
  * Kubernetes
  * Network
  * Storage

* Additional layers such as Monitoring, Security, Load Balancers, etc. may be added and configured as desired. These layers may be configured for the profiles of the type "Full" or "Add-On". These add-on layers can be added in one of the following ways:

  * Add New - Add a Spectro Cloud Pack from a pack registry or a Helm Chart from a chart registry. The public Spectro Cloud Pack registry and a few popular helm chart repositories are already availale out of the box. Additional pack registries or public/private chart registries can be added to Spectro Cloud. 
  * Import - Charts can be discovred from an existing Kubernetes Cluster. One or more of these discovered charts can be added to the cluster profile. During disovery, charts discovered from a cluster may not be available in any of the chart repository avaialble in Spectro Cloud. Users can provide the registry information that is hosting these charts during the import process to complete addition of such charts. 
  * Pack Manifests - Layers can be constructed using raw manifests to provision kubernetes resources that are not available via Spectro Clouds or Charts. Pack Manifests provide a pass through mechanism wherein additional kubernetes resources can be orchestrated on to a cluster along with rest of stack. 


* Configure each layer as follows:

  * Choose the desired version. Choices include pinning to a specific version (e.g. 1.1.1) or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates on the train will result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version, without having to make subsequent updates to the profile.
  * The configuration option and version selected might provide configuration parameters to provide granular control or fine-tune certain aspects of the functionality. For the packs provided out of the box, the configuration parameters are set to values based on common best practices. Users may override these parameters as desired. Additionally for certain layers, Spectro Cloud provides a bunch of presets to quickly enable or configure a feature within the add-on. These presets are a group of properties preset with defaults to provide a quick and easy way to modify a set of relevant properties. If available, users can also enable one or more presets as appropriate. 
  * Attach additional manifests to the layer if desired. Attach manifests provide a way for provisionin of additional kubernetes resources that support an integraton or an add-on. Certain integrations offered through packs or charts, may require creation of resources like secrets, crds etc, in order to complete the installation end to end. This can be achieved by adding one or more 'Attach Manifests' to the layer. 

* Review your changes and save the cluster profile.
