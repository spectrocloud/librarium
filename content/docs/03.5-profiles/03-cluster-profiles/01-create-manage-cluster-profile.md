---
title: "Create a Cluster Profile"
metaTitle: "Create a Cluster Profile"
metaDescription: "Learn how to create a cluster profile in Palette."
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Create a Cluster Profile

Create a cluster profile by adding core infrastructure layers (OS, Kubernetes, Network, and Storage) and special purpose functionality that integrations provide.

<!-- `video: /aws-full-profile.mp4` -->


## Prerequisites

There are no prerequisites.

## Create a Profile

Use these steps to create a cluster profile.

<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. From the left **Main Menu** click **Profiles**.


3. Click on the **Add Cluster Profile** button. 


4. Enter basic information for the profile: name, version if desired, and optional description. You only need to specify a version if you create multiple versions of a profile using the same profile name. To learn more about creating multiple profile versions, check out [Cluster Profile Versioning](/profiles/cluster-profiles/create-manage-cluster-profile#clusterprofileversioning).


5. Select the profile type:

	<br />

	- **Full**: This will model the combined core infrastructure and add-on cluster profile layers.

	<br />

	- **Infrastructure**: This will model the core layers of a cluster, which includes the Operating System (OS), Kubernetes, Container Network Interface (CNI), and Core Storage Interface (CSI).

	<br />

	-  **Add-on**: This will model the core infrastructure with any integrations and applications that exist. 

	<br />

6. Add optional tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile.


7. Click **Next**.


<!-- Provide the **Basic Information** such as:

<br />

  |**Parameter**  |**Description**  |
  |---------|---------|
  |**Name**     |    Give a name for the new cluster.     |
  |**Version**    |   Include the [Cluster Profile Version](/cluster-profiles/task-define-profile#clusterprofileversioning) number for the cluster under which the cluster profile needs to be created.  See below for more information.      |
  |**Description**     |   Provide quick description of your cluster. This is optional. |
  |**Profile Type (Full, Infrastructure, Add-on)**| Dictates the layers that can be configured in the cluster profile.  If the cluster profile type is Infrastructure or Full, you are able to select a Cloud Type or Data Center environments. For more information on [Add-on](/cluster-profiles/task-define-profile#Addon) types go to step four.  |
  |**Tags**     |  Tags on a cluster profile are propagated to the VMs deployed on the cloud/data center environments when clusters are created from the cluster profile. This is optional.      | -->


8. At the **Cloud Type** stage of the wizard, select the **Infrastructure Provider** and click **Next**.
  

9. Configure the **Profile Layers**. This stage of the wizard varies based on your selection in step 5. 

	<br />
	
	- When you create an Infrastructure or Full profile, you will add these core layers: OS, Kubernetes, Network, and Storage. 

	<br />

	- When you create a Full profile, you will add on top the infrastructure layers any integrations or applications such as Monitoring, Security, and Load Balancers. To learn about available integrations, check out the [Packs List](/integrations). 

	<br />

	- When you create an add-on profile, you choose from available integrations, and not core layers. Core layers do not apply to Add-On profiles. Refer to [Add-on Profiles]() for more information.


10. Select the **Registry**, **Pack Name**, and **Pack Version**. You can add Container Storage Interface (CSI) and Container Network Interface (CNI) layers as Helm Charts from customized Helm registries and link them to Spectro Registry packs. **Pack Values** are displayed as a YAML configuration file at right. You can modify values in most YAML files. 

	<br />

	<InfoBox>
	
	OS configurations are immutable. In the Palette eXtended Kubernetes (PKE) pack, you can configure OpenID Connect (OIDC) to use Single Sign-On (SSO). Palette displays deprecated packs with an information icon next to the pack name. To learn more about pack maintenance and deprecation, review [Pack maintenance policy](/integrations/maintenance-policy). 

	</InfoBox>  
	
<br />

11. When you create a Full or Add-On profile, you can use the options in the tabs below to customize the cluster profile.


<Tabs>

<Tabs.TabPane tab="Add New Pack" key="Add New Pack"> 

**Add New Pack** - Add a Palette pack from a pack registry or a Helm Chart from a chart registry. Palette's public pack registry and a few popular Helm chart repositories are available out-of-the-box. Additional pack registries or public or private chart registries can be added to Palette.
     
</Tabs.TabPane>   
    

<Tabs.TabPane tab="Import from cluster" key="Import from cluster">
    
**Import from cluster** - Charts can be discovered from an existing Kubernetes cluster. One or more of these discovered charts can be added to the cluster profile. During discovery, charts discovered from a cluster may not be available in any of the chart repositories available with Palette. You can provide the registry information for these charts during the import process.
        
</Tabs.TabPane>


    
<Tabs.TabPane tab="Add Manifest" key="Add Manifest">

**Add Manifest** - You can construct a layer using raw manifest to provision Kubernetes resources that are not available in Palette or Helm Charts. Pack manifests provide a pass-through mechanism that orchestrates additional Kubernetes resources onto a cluster along with the rest of stack.

</Tabs.TabPane>



<Tabs.TabPane tab="Add Helm Chart" key="Add Helm Chart">
    
**Add Helm Chart** - Select from the available Helm Charts to add applications to a your cluster profile.
        
</Tabs.TabPane>


<Tabs.TabPane tab="Add Zarf" key="Add Zarf">
    
**Add Zarf** - Zarf is an open-source packaging strategy for packaging Kubernetes manifests and Helm Charts and deploying them in air-gapped and semi-connected environments.
        
</Tabs.TabPane>


</Tabs>
    

<!-- Configure each layer as follows:

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
    
</Tabs> -->

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
By default Palette uses Helm chart release name in the format ``packName-chartName``. In cases where a lengthy release name causes some complicacy we can customize Helm chart releaseNames using the format below:

 
**Example:**
       
```yaml
pack:
  namespace: kube-system
  releaseNameOverride:
    actual_chart_name1: custom_name1
    actual_chart_name2: custom_name2
```

</InfoBox>


      
 




