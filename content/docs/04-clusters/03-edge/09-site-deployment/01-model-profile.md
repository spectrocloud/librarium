---
title: "Model Edge Native Cluster Profile"
metaTitle: "Instructions for creating an Edge Native Cluster Profile"
metaDescription: "Instructions for creating an Edge Native Cluster Profile"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

[Cluster profiles](/cluster-profiles) contain the desired specifications the Kubernetes cluster  Edge host makes up. The cluster profile defines the following components.

<br />

- Kubernetes flavor and version

- Operating system (OS)

- Container network interface (CNI)

- Container storage interface (CSI)  

You define these components in an Edge Native Infrastructure profile. As with any other environment in Palette, you can define additional add-on cluster profiles. You can use add-on profiles to define integrations or applications that must be included when Palette deploys the cluster.

<br/>

## Profile Scope

You can create a profile in the tenant scope or the project scope. The choice depends on how you would like to organize your Edge deployments. If all your Edge deployments are organized within a single project, you can define the cluster profile in the project scope. However, if you would like to use projects to group related sites or have one site per project, then define the cluster profile in the tenant scope. You can share cluster profiles that you define in the tenant scope among all the projects in your tenant.

# Create Edge Native Cluster Profile

Use the following steps to create a cluster profile for Edge hosts.

# Prerequisites

No prerequisites.

# Enablement

1. Log in to [Palette](https://console.spectrocloud.com).


2. Choose the desired scope, project or **Tenant Admin**.

![Select the scope by using the drop-down Menu.  Either project or tenant admin are the displayed values in the screenshot.](/clusters_site_deployment_mode-profile_scope-selector.png)

<br />

3. Navigate to the left **Main Menu** and select **Profiles**.


4. Click the **Add new Profile** button.


5. Provide the profile with a name, description, version, and tags. Select **Full** for the profile type. Click on **Next**.


6. Select **Edge Native** as the cloud type and click on **Next**.


7. In the profile layers screen, for the OS layer, choose the desired OS type and  OS version. Click on **Next layer**.

<InfoBox>

You can select the *Bring Your Own OS (BYOOS)* if you build your enterprise Edge artifacts. Specify the registry that hosts your provider images as the system URI. You can also provide additional cloud-init configurations in the OS pack's YAML file to set up Edge host users, install other OS packages, install certificates, and more. Refer to the [Cloud-Init Stages](/clusters/edge/edge-configuration/cloud-init) resource to learn more about the cloud-init stages.

</InfoBox>


8. Choose the desired Kubernetes distribution and version. Click on **Next layer**.


9. Choose the desired CNI type and version. Click on **Next layer**.


10. Review and save your cluster profile.

You now have a cluster profile you can use for deploying Edge hosts.

Consider creating additional profiles with out-of-the-box packs for monitoring, security, authentication, or other capabilities. If you need remote access to the cluster, consider adding the [Spectro Proxy](/integrations/frp) pack to one of the add-on profiles.

Optionally, add additional Helm or OCI registries and include applications hosted in those registries in add-on profiles. Check out the guide for adding a [Helm](/registries-and-packs/helm-charts) or [OCI](/registries-and-packs/oci-registry) registry to learn more.

# Create a Custom Cluster Profile With BYOOS Pack

The [Bring Your Own Operating System (BYOOS)](/https://docs.spectrocloud.com/cluster-profiles/byoos) pack allows you to upload your own OS images, configure the necessary drivers, and customize the OS to meet specific requirements for your environment.
The BYOOS feature gives you flexibility and control over your OS and helps manage Kubernetes clusters. The **BYOS Edge OS** pack supports commercial and open-source distribution OS to perform optimally and meet unique requirements as you build cluster profiles. 


The following steps will guide you to deploy an Edge cluster using the **BYOS Edge OS** pack in your cluster profile.

# Prerequisites

- Provider images are built.


- A constructed `system.uri`. 

# Enablement


1. Log in to [Palette](https://console.spectrocloud.com) as a **Tenant Admin**.


2. Navigate to the left **Main Menu** and select **Profiles**.


3. Click on **Add Cluster Profile**. 


4. Provide **Basic Information**, such as profile name and description. Select **Full** and click on **Next**. <br /> <br />


5. Select **Edge Native** as the **Cloud Type** and click on **Next**.


6. Select **Public Repo** in the **Registry field**.


7. Select **BYOS Edge OS** in the **Pack Name** field and the pack version. 


8. The pack editor is displayed, and you can customize the **BYOS Edge OS** pack as needed. 

## Installer Parameters

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `pack:content:` | Specifies the content of the **BYOS Edge OS** pack. |
| `pack.content.images` | Specifies the list of OS images to use for the pack. |
| `pack.content.images.-  images` | Specifies a specific OS image to use for the pack. |


## User Data Parameters

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `options.system.uri:` | The system URI specifying the location of the BYOOS image. |
| `image.registry` | The domain of the registry where the BYOOS image is stored. |
| `image.repo` | The name of the BYOOS image repository. |
| `image.palette.edge.version` | The Palette Edge software version used in the BYOOS container image. |
| `image.client.tag` |  The tag given to the image used for the BYOOS, specifying its version. |


Example BYOOS Pack Customization File

<br />

```yaml
pack:
 content:
   images: 
    - image: ‘{{.spectro.pack.edge-native-byoi.options.system.uri}}’
    
options: 
 system.uri: “{{.spectro.pack.edge-native-byoi.image.registry}}/{{.spectro.pack.edge-native-byoi.image.repo}}:{{.spectro.system.kunernetes.version}}-{{.spectro.pack.edge-native-byoi.image.version}}_{{.spectro.pack.edge-native-byoi.image.client.tag}}”

image: 
 registry: "" 
 repo: ""
 palette.edge.version: ""
 client.tag: ""
```

<br />

Refer to the [BYOOS Pack](/) resource to learn more about the pack details.
<br />

9. Review your custom BYOOS pack, and close the updated pack editor. Click on the **Next layer** to configure the Kubernetes layer. 

You have successfully configured the BYOOS pack to update your custom images to build the Edge cluster profile. 

# Validation

Verify you created a cluster profile for Edge hosts by using the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Choose the desired scope, project or **Tenant Admin**.


3. Navigate to the left **Main Menu** and select **Profiles**.


4. Use the **Cloud Types drop-down Menu** and select **Edge Native**.


5. Your newly created cluster profile is displayed along with other cluster profiles of the same type.


# Next Steps

Your next step in the deployment lifecycle is to prepare the Edge host for the installation. Use the [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) guide to continue.

<br />
