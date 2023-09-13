---
sidebar_label: "Create a Cluster Profile"
title: "Create a Cluster Profile"
description: "Learn how to create a cluster profile in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
---


<video src="/videos/cluster-profiles/aws-full-profile.mp4"></video>

## Basic Information and Core Layers

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


4. **Add-on Layers** are additional layers such as **Monitoring**, **Security**, **Load Balancers**, **Ingress**, **Logging**, **Monitoring**, **Security**, **Authentication**, **Service Mesh** etc. may be added and configured as desired. These layers may be configured for the profiles of the type **Full** or **Add-On**. These add-on layers can be added in one of the following ways:

    <Tabs queryString="type">
    <TabItem label="Add New Pack" value="Add New Pack"> 
    <b>Add New Pack</b> - Add a Palette Pack from a pack registry or a Helm Chart from a chart registry. The public Palette Pack registry and a few popular Helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.
     
    </TabItem>   
    
    <TabItem label="Import from cluster" value="Import from cluster">
    
    <b>Import from cluster</b> - Charts can be discovered from an existing Kubernetes Cluster. One or more of these discovered charts can be added to the cluster profile. During discovery, charts discovered from a cluster may not be available in any of the chart repositories available with Palette. Users can provide the registry information on hosting these charts during the import process to complete addition of such charts.
        
    </TabItem>
    
    <TabItem label="Add Manifest" value="Add Manifest">
    <b>Add Manifest</b> - Layers can be constructed using raw manifests to provision Kubernetes resources that are not available via Palette or Charts. Pack Manifests provide a pass through mechanism wherein additional Kubernetes resources can be orchestrated on to a cluster along with rest of the stack.

    </TabItem>
    </Tabs>
    
  <br />
    Configure each layer as follows:

    <Tabs>

    <TabItem label="Versions" value="Versions">
    Versions- Choose the desired version. Choices include pinning to a specific version (e.g. 1.1.1) or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates on the train will result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version, without having to make subsequent updates to the profile.
  
    </TabItem>

    <TabItem label="Configuration Parameters" value="Configuration Parameters">    
    <b>Configuration Parameters</b> - The configuration option and version selected might provide configuration parameters to provide granular control or fine-tune certain aspects of the functionality. For the packs provided out of the box, the configuration parameters are set to values based on common best practices. Users may override these parameters as desired. Additionally, for certain layers, Palette provides a bunch of presets to quickly enable or configure a feature within the add-on. These presets are a group of properties presets with defaults to provide a quick and easy way to modify a set of relevant properties. If available, users can also enable one or more presets as appropriate.
    
    </TabItem>
        
    <TabItem label="Manifest" value="Manifest">
    <b>Manifest</b> - Attach additional manifests to the layer if desired. Attached manifests provide a way for provisioning additional Kubernetes resources that support an integration or an add-on. Certain integrations offered through packs or charts, may require creation of resources like Secrets or CustomResourceDefinition (CRDs) in order to complete the installation end to end. This can be achieved by adding one or more Attach Manifests to the layer.
    
    </TabItem>
    
    </Tabs>

<br/>

----

Palette allows users to deploy the same pack to multiple layers which can be required in certain scenarios, where an integration needs to be installed multiple times with different configuration. As an example, you may have two or more applications in the profile that need to use the Postgres database. You will be required to launch the Postgres database twice in this case with different configurations.

In order to allow packs to be added multiple times in a profile, add the `spectrocloud.com/display-name: <custom_name>` key to the pack values in the YAML editor. The key `<custom_name>` is a name unique across a cluster profile and the cluster.

  **Example:**

  <br />

  ```yaml hideClipboard
  pack:
  namespace: "external-dns"
  spectrocloud.com/display-name: "dns-1"
  ```

  
  If the same pack is needed at another layer, repeat the above block with the same namespace but a different name such as `dns-2`. Display names used for a pack across layers should be unique.

<br />   

By default Palette uses Helm chart release name in the format packName-chartName. In cases where a lengthy release name causes some complicacy we can customize Helm chart `releaseNames` using the format below.

<br />

```yaml hideClipboard
pack:
  namespace: kube-system
  releaseNameOverride:
    actual_chart_name1: custom_name1
    actual_chart_name2: custom_name2
```


<br />
      




