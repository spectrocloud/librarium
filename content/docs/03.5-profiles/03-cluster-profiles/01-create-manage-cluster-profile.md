---
title: "Create a Cluster Profile"
metaTitle: "Create a Cluster Profile"
metaDescription: "Learn how to create a cluster profile in Palette."
icon: ""
hideToC: false
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

## Enablement

Use these steps to create a cluster profile.

<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. From the left **Main Menu** click **Profiles**.


3. Click on the **Add Cluster Profile** button. 


4. Enter basic information for the profile: name, version if desired, and optional description. You only need to specify a version if you create multiple versions of a profile using the same profile name. To learn more about creating multiple profile versions, check out [Cluster Profile Versioning](/profiles/cluster-profiles/cluster-profile-versioning).


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

	- When you create an add-on profile, you choose from available integrations, and not core layers. Core layers do not apply to Add-On profiles. Refer to [Add-on Profiles](/profiles/add-on-profiles) for more information.


10. Select the **Registry**, **Pack Name**, and **Pack Version**. You can add Container Storage Interface (CSI) and Container Network Interface (CNI) layers as Helm Charts from customized Helm registries and link them to Spectro Registry packs. **Pack Values** are displayed as a YAML configuration file at right. You can modify values in most YAML files. 

	<br />

	<InfoBox>
	
	OS configurations are immutable. In the Palette eXtended Kubernetes (PKE) pack, you can configure OpenID Connect (OIDC) to use Single Sign-On (SSO). Palette displays deprecated packs with an information icon next to the pack name. To learn more about pack maintenance and deprecation, review [Pack maintenance policy](/integrations/maintenance-policy). 

	</InfoBox>  
	
<br />

11. When you create a Full or Add-On profile, you can use options described in the tabs below to customize the cluster profile.

  <br />
  
  <Tabs>
  
  <Tabs.TabPane tab="Add New Pack" key="Add New Pack">
  
  **Add New Pack** - Add a Palette pack from a pack registry or a Helm Chart from a chart registry. Palette's public pack registry and a few popular Helm chart repositories are available out-of-the-box. You can add pack registries or public or private Helm chart registries to Palette.
  
  </Tabs.TabPane>

  
  
  <Tabs.TabPane tab="Import from cluster" key="Import from cluster">
  
  **Import from cluster** - Charts can be discovered from an existing Kubernetes cluster. One or more of these discovered charts can be added to the cluster profile. During discovery, charts discovered from a cluster may not be available in any of the chart repositories available with Palette. You can provide the registry information for these charts during the import process.
  
  </Tabs.TabPane>

  
  
  <Tabs.TabPane tab="Add Manifest" key="Add Manifest">
  
  **Add Manifest** - You can construct a layer using raw manifest to provision Kubernetes resources that are not available in Palette or Helm Charts. Pack manifests provide a pass-through mechanism that orchestrates additional Kubernetes resources onto a cluster along with the rest of stack.
  
  </Tabs.TabPane>
  
  
  
  <Tabs.TabPane tab="Add Helm Chart" key="Add Helm Chart">
  
  **Add Helm Chart** - Select from the available Helm Charts to add applications to a your cluster profile.

  By default Palette uses Helm chart release names in the format `packName-chartName`. In cases where a long chart release name causes issues, you can customize the chart name using the `releaseNameOverride` property as shown in the example below.

  <br />

  ```yaml hideClipboard
  pack:
    namespace: kube-system
    releaseNameOverride:
      actual_chart_name1: custom_name1
      actual_chart_name2: custom_name2
  ```
  
  </Tabs.TabPane>
  
  

  <Tabs.TabPane tab="Add Zarf" key="Add Zarf">
  
  **Add Zarf** - Zarf is an open-source packaging strategy for packaging Kubernetes manifests and Helm Charts and deploying them in air-gapped and semi-connected environments.
  
  </Tabs.TabPane>
  
  </Tabs>

    
## Validate


## Add a Pack Multiple Times in a Profile

You can deploy the same integration multiple times in a cluster profile. This can be required in scenarios where you want to install an integration more than once with a different configuration. For example, you may have two or more applications in the profile that need to use the Postgres database. You will need to launch the Postgres database twice with different configurations.

Follow the steps below to allow adding a pack multiple times in a profile:

1. Using the YAML editor, add the `spectrocloud.com/display-name: <custom_name>` key to the pack values, as shown in the example below. Replace `custom_name` with a pack name that is unique in the profile and across the cluster. 


```yaml hideClipboard
pack:
  # The namespace (on the target cluster) to install this chart
  # When not found, a new namespace will be created
  namespace: "external-dns"
  # Custom pack name for multi-layer support
  spectrocloud.com/display-name: "dns-1"
```
  
2. If the same pack is needed at another layer, repeat the above block with the same namespace but a different name such as `dns-2`. Display names used for a pack across layers must be unique.



<!-- <br />

<InfoBox>

By default Palette uses Helm chart release names in the format `packName-chartName`. In cases where a long chart release name causes issues, you can customize the chart name using the `releaseNameOverride` property as shown in the example below.

<br />
       
```yaml hideClipboard
pack:
  namespace: kube-system
  releaseNameOverride:
    actual_chart_name1: custom_name1
    actual_chart_name2: custom_name2
```

</InfoBox> -->

<br />   

<br />


      
 




