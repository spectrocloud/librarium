---
title: "Bring Your Own OS (BYOOS)"
metaTitle: "Bring your own OS (BYOOS)"
metaDescription: "Customize your Edge host deployment with your own Operating System."
hiddenFromNav: true
type: "integration"
category: ['operating system']
logoUrl: "https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Bring Your Own Operating System (BYOOS) 

The [Bring Your Own Operating System (BYOOS)](/https://docs.spectrocloud.com/cluster-profiles/byoos) offers greate flexibility and control over your infrastructure. BYOOS feature optimizes infrastructure and streamlines workflows. This allows you to specify a host runtime operating system, and  customize to meet your specific needs.

The BYOOS pack allows you to upload your own OS images, configure the necessary drivers, and customize the OS to meet your specific requirements. Spectro Cloud offers BYOOS support for both Edge and non-Edge environments. 

To learn how to use BYOOS in Edge, check out the [Create a Custom Cluster Profile with BYOOS Pack](https://docs.spectrocloud.com/clusters/edge/site-deployment/model-profile), and  for  non-Edge environments, check out the [Create Cluster Profiles](https://docs.spectrocloud.com/cluster-profiles/task-update-profile).

# Versions Supported

**1.0.x**

<br />

<Tabs>

<Tabs.TabPane tab="Edge" key="edge">

## Prerequisites 

To use the Edge BYOOS pack, you must have the following:

- Provider images needs to be built

- Palette 3.3.0

## Parameters

The BYOS Edge OS pack supports the following parameters. 

### Parameters

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `pack:content:` | Specifies the content of the **BYOS Edge OS** pack. |
| `pack.content.images` | Specifies the list of OS images to use for the pack. |
| `pack.content.images.-  images` | Specifies a specific OS image to use for the pack. |
| `system.uri` | The system URI specifying the location of the BYOOS image. 

## Usage

BYOOS enables you to build a custom OS for your Edge host runtime with the model Edge Native Infrastructure profile. This Palette feature offers flexibility to customize the desired specifications of your OS layer in the Kubernetes cluster Edge host.


To manage the custom OS and optimally meet your environment needs, you are required to build your own custom OS image. It is important to create your Edge artifact containing the user data file. This file contains the `system.uri` parameter specifying the location of the BYOOS image, which is required later to customize your BYOS Edge OS pack. Refer to the [EdgeForge Build Images](https://docs.spectrocloud.com/clusters/edge/edgeforge-workflow/build-images/) guide if you are missing a custom OS image.


The Edge Native cluster profile requires the following components: 
* The Kubernetes flavor and version
* Operating system (OS) 
* Container network interfce (CNI) 
* Container storage interface (CSI) 

 You can define the cluster profile components in Palette using the **Add Cluster Profile** feature in the **Profiles** page. The cluster profile has the following profile layers:
 * Basic Information
 * Cloud Type 
 * Profile Layers 


<br />

![A view of the Kubernetes pack editior with a YAML configuration](/clusters_site-deployment_model-profile_byoos-pack-yaml.png)


You can edit your custom BYOS Edge OS image after defining the pack type, registry, pack name and version in **Profile Layers**. In the pack editor, you must update the `system.uri` parameter using the custom OS image built in the EdgeFroge process. This parameter is a macro updating the `image.registry:`, `image.repo:`, `kubernetes.version:`, `image.version:` and the `client.tag:` parameters. 


The `images:` section contains the meta data detials about the OS image. Within the BYOS Edge OS pack, the installer image can be updated if you want to add additonal images as part of your content bundle. The `-image:` parameter specifies the entry for an additonal image. 


```yaml
pack:
 content:
   images: 
    - image: ‘{{.spectro.pack.edge-native-byoi.options.system.uri}}’
    
options: 
 system.uri: “{{.spectro.pack.edge-native-byoi.image.registry}}/{{.spectro.pack.edge-native-byoi.image.repo}}:{{.spectro.system.kunernetes.version}}-{{.spectro.pack.edge-native-byoi.image.version}}_{{.spectro.pack.edge-native-byoi.image.client.tag}}”

```

# Terraform

You can retrieve details about the BYOOS Edge OS agent pack by using the following Terraform code.


```yaml
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "edge-native-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

# References
* [Model Edge Native Cluster Profile](https://docs.spectrocloud.com/clusters/edge/site-deployment/model-profile)
<br />
* [Containered](https://containerd.io/)


</Tabs.TabPane>

<Tabs.TabPane tab="Non-Edge" key="Non-Edge">

## Prerequisites 

To use the non-Edge BYOOS pack, you must have the following:

- Access to a non-Edge repository that contains the generic BYOOS pack.

## Parameters

You can use the tag values Packer assigns to the image to determine the correct value to provide the pack YAML. 

The following list of parameters will help when you update the pack YAML to point to your custom image:  
<br/>

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `osImageOverride` | The image ID used as the base OS layer. This is the image ID as assigned in the infrastructure environment it belongs to. Example: `ami-0f4804aff4cf9c5a2` |
| `osName` | The name of the OS distribution. Example: `rhel`. |
| `osVersion` | The version of the OS distribution. Example: `8` |

## Usage

To use the BYOOS pack for a non-Edge envrionment, you have to add this pack to your cluster profile or when creating a cluster profile. Check out the [Create Cluster Profile](https://docs.spectrocloud.com/cluster-profiles/task-define-profile/) guide to learn how to create a cluster profile.


You can deploy custom OS images based on the infrastructure provider tool you are using. 
You can use the following:

* The [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/) for AWS.
* The [Azure VM Image Builder]() for Azure. 
* Platform agnostic tools, such as [HashiCorp Packer](https://developer.hashicorp.com/packer), or 
* The [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html) project for tailored projects. 

You are required to create a custom Red Hat Enterprise Linux (RHEL) for Amazon Web Services (AWS) to create custom images that you can use with Palette using KIB. Check out the [Create Images with Image Builder](https://docs.spectrocloud.com/cluster-profiles/byoos/image-builder/) to learn how to create custom images with KIB. 
<br/>

After completing your build process and generating the `image ID`, you have to log in to Palette. In Palette, you can create a cluster profile using  **Add Cluster Profile**. After filling out the input fields and the infrastructure type, you can customize the BYOS pack. 


Use the following information to find the BYOOS pack.
* Pack Type: OS
* Registry: Public Repo
* Pack Name: Bring Your Own OS (BYO-OS)
* Pack Version: 1.0.x or higher
You can update the pack YAML to point to your custom images.
<br/>

Check out the [Create Images with Image Builder](https://docs.spectrocloud.com/cluster-profiles/byoos/image-builder/) guide to learn about the implementation and validation steps for a custom image deployment. 


You can custom the BYOOS pack list by using the following YAML code: 
```yaml
pack:
  osImageOverride: "ami-0f4804aff4cf9c5a2"
  osName: "rhel"
  osVersion: "8"
```

# Terraform

You can retrieve details about the BYOOS pack by using the following Terraform code.

```yaml
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "generic-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

# References
* [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html)
<br />
* [Bring Your Own OS (BYOOS)](https://docs.spectrocloud.com/cluster-profiles/byoos/)

</Tabs.TabPane>

</Tabs>


