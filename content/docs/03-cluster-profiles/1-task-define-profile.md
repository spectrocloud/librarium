---
title: "Creating Cluster Profiles"
metaTitle: "Creating Cluster Profiles"
metaDescription: "The method for creating a Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

 ![alt text](/aws-full-profile.mp4)

# Basic Information and Core Layers

Cluster profiles are created by configuring various layers of the Kubernetes infrastructure stack. To create a **New Cluster Profile**, follow these steps:

1. Provide the **Basic Information** such as:

    |**Parameter**  |**Description**  |
    |---------|---------|
    |**Name**     |    Give a name for the new cluster.     |
    |**Version**    |   Include the [Cluster Profile Version](/cluster-profiles/task-define-profile#clusterprofileversioning) number for the cluster under which the cluster profile needs to be created.  See below for more information.      |
    |**Description**     |   Provide quick description of your cluster. This is optional. |
    |**Profile Type (Full, Infrastructure, Add-on)**| Dictates the layers that can be configured in the cluster profile.  If the cluster profile type is Infrastructure or Full, you are able to select a Cloud Type or Data Center environments. For more information on [Add-on](/cluster-profiles/task-define-profile#Addon) types go to step four.  |
    |**Tags**     |  Tags on a cluster profile are propagated to the VMs deployed on the cloud/data center environments when clusters are created from the cluster profile. This is optional.      |


2. In the **Cloud Type** section, select the **Environment** you are working with. This list displays the environments supported in Palette.
  

3. Configure the **Profile Layers** of the infrastructure stack. The following layers are considered **Core Infrastructure** layers. Configuring these layers is mandatory for Full or Infrastructure cluster profiles. 

    **Note**: These layers are not configurable for **Add-On** cluster profiles:

    - OS
    - Kubernetes
    - Network
    - Storage
    
    Select the **Registry**, **Pack Name**, **Pack Version**, and **Pack Values** and click on **Next Layer** to go through each profile layer to completely build the core infrastructure.

    **Note**: Container Storage Interface (CSI) and Container Network Interface (CNI) layers can be added as Helm Charts from customized Helm registries and linked to Spectro Registry packs. 


4. **Add-on Layers** are additional layers such as **Monitoring, Security**, or **Load Balancers** may be added and configured as desired. These layers may be configured for the profiles of the type **Full** or **Add-On**. These add-on layers can be added in one of the following ways:

    <Tabs>
    <Tabs.TabPane tab="Add New Pack" key="Add New Pack"> 
    <b>Add New Pack</b> - Add a Palette Pack from a pack registry or a Helm Chart from a chart registry. The public Palette Pack registry and a few popular Helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.
     
    </Tabs.TabPane>   
    
    <Tabs.TabPane tab="Import from cluster" key="Import from cluster">
    
    <b>Import from cluster</b> - Charts can be discovered from an existing Kubernetes Cluster. One or more of these discovered charts can be added to the cluster profile. During discovery, charts discovered from a cluster may not be available in any of the chart repositories available with Palette. Users can provide the registry information on hosting these charts during the import process to complete addition of such charts.
        
    </Tabs.TabPane>
    
    <Tabs.TabPane tab="Add Manifest" key="Add Manifest">
    <b>Add Manifest</b> - Layers can be constructed using raw manifests to provision Kubernetes resources that are not available via Palette or Charts. Pack Manifests provide a pass through mechanism wherein additional Kubernetes resources can be orchestrated on to a cluster along with rest of the stack.

    </Tabs.TabPane>
    </Tabs>
    
  <br />
    Configure each layer as follows:

    <Tabs>

    <Tabs.TabPane tab="Versions" key="Versions">
    <a href="Version"></a>Versions- Choose the desired version. Choices include pinning to a specific version (e.g. 1.1.1) or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates on the train will result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version, without having to make subsequent updates to the profile.
  
    </Tabs.TabPane>

    <Tabs.TabPane tab="Configuration Parameters" key="Configuration Parameters">    
    <b>Configuration Parameters</b> - The configuration option and version selected might provide configuration parameters to provide granular control or fine-tune certain aspects of the functionality. For the packs provided out of the box, the configuration parameters are set to values based on common best practices. Users may override these parameters as desired. Additionally, for certain layers, Palette provides a bunch of presets to quickly enable or configure a feature within the add-on. These presets are a group of properties presets with defaults to provide a quick and easy way to modify a set of relevant properties. If available, users can also enable one or more presets as appropriate.
    
    </Tabs.TabPane>
        
    <Tabs.TabPane tab="Manifest" key="Manifest">
    <b>Manifest</b> - Attach additional manifests to the layer if desired. Attached manifests provide a way for provisioning additional Kubernetes resources that support an integration or an add-on. Certain integrations offered through packs or charts, may require creation of resources like Secrets or CustomResourceDefinition (CRDs) in order to complete the installation end to end. This can be achieved by adding one or more Attach Manifests to the layer.
    
    </Tabs.TabPane>
    
    </Tabs>

<br/>

<InfoBox>
Palette allows users to deploy the same pack to multiple layers which can be required in certain scenarios, where an integration needs to be installed multiple times with different configuration. As an example, you may have two or more applications in the profile that need to use the Postgres database. You will be required to launch the Postgres database twice in this case with different configurations.

In order to allow packs to be added multiple times in a profile, add the following key to the pack values in the yaml editor:

      spectrocloud.com/display-name: <custom_name>

   where `<custom_name>` is a name unique across a cluster profile and the cluster.

  **Example:**

    pack:
      # The namespace (on the target cluster) to install this chart
      # When not found, a new namespace will be created
      namespace: "external-dns"
      # Custom pack name for multi-layer support
      spectrocloud.com/display-name: "dns-1"
  
  If the same pack is needed at another layer, repeat the above block with the same namespace but a different name such as `dns-2`. Display names used for a pack across layers should be unique.
</InfoBox>

<br />   

<InfoBox>
By Default, Palette uses the packName-chartNames convention while installing Helm Charts. However, if the name goes beyond 64 characters for a custom name, use pack.releaseNameOverride in the layer.

 
**Example:**
       
```yaml
pack:
  namespace: kube-system
  releaseNameOverride:
    actual_chart_name1: custom_name1
    actual_chart_name2: custom_name2
```

</InfoBox>

## Cluster Profile Versioning

Palette enables users to create multiple versions of a cluster profile within the scope of a single profile name. The **Version** field of the cluster profile takes a semantic versioning format (only numbers supported) as below: 

  **`major.minor.patch`** represented as: Version 1.1.2
         
 Profile versioning is an optional field with a default value of **1.0.0** . The users can create multiple versions of a cluster profile under a single profile name and each of these versions can have its own pack configurations.
 
Cluster profile versions are grouped under their unique names and their uniqueness is decided by the name and version within the scope and promotes backward compatibility to profile changes.

 **Example:** Profile-1 can have multiple versions like 1.0.0 and 2.0.1. These versions are grouped under the **Cluster Profile Name** Profile-1. The menu next to the cluster profile name contains the different versions under that name.
          
 The version numbers can be edited from the **Settings > Edit Info** option from the Cluster Profile page. While deleting the profile, select the version to be deleted.
      
 




