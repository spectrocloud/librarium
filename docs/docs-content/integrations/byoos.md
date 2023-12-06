---
sidebar_label: "Bring Your Own OS (BYOOS)"
title: "Bring your own OS (BYOOS)"
description: "Bring Your Own OS (BYOOS) pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ['operating system', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png"
tags: ["packs", "byoos", "operating system"]
---




# Bring Your Own Operating System (BYOOS) 

The [Bring Your Own Operating System (BYOOS)](../byoos/byoos.md) enables you to use a custom Operating System (OS) with Palette. Palette comes with several operating systems out-of-the-box, but the existing OS list may not meet all users' needs. 

Using your custom OS provides several benefits, including the ability to control your own dependencies, improve performance, and ensure compatibility with your existing applications. With BYOOS, you can choose the OS that best fits your needs, whether it's a commercial or open-source distribution, and integrate it with your Kubernetes clusters. The BYOOS pack can be used with both Edge and non-Edge environments. 

## Versions Supported

<br />
<Tabs queryString="versions">

<TabItem label="1.0.x" value="1.0.x">

<Tabs queryString="edge-non-edge">

<TabItem label="Edge" value="edge">

## Prerequisites 


<br />

- The Edge Provider images you have created and uploaded to a container registry. Refer to the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md) guide for steps on how to create the Edge artifacts and how to upload your custom OS to a registry.


- Palette 3.3.0 or greater.

## Parameters

The BYOS Edge OS pack supports the following parameters. 

### Parameters

| Parameter            | Description                                            | Type |
|----------------------|--------------------------------------------------------|------|
| `pack:content:` | Specifies the content of the **BYOS Edge OS** pack. | map |
| `pack.content.images` | Specifies a list of OS images to use with the pack. | list |
| `pack.content.images.image` | An OS image to use with the pack. | string|
| `system.uri` | The system URI specifies the location of BYOOS image. | string|  
| `providerCredentials.registry` | Specifies the private registry for the cluster to pull images from | string |  
| `providerCredentials.username` | Specifies the username used for authentication with a private registry. | string |
| `providerCredentials.password` | Specifies the password used for authentication with a private registry. | string |
| `providerCredentials.certificate` | Specifies the certificate used for authentication and encryption with a private registry | string |

  ```yaml
  pack:
  content:
    images: 
      - image: '{{.spectro.pack.edge-native-byoi.options.system.uri}}'
      # - image: example.io/my-other-images/example:v1.0.0 
      # - image: example.io/my-super-other-images/example:v1.0.0 
    
  options: 
    system.uri: example.io/my-images/example-custom-os:v1.4.5
  ```

## Usage

BYOOS enables you to use a custom OS for your Edge host. You can use this feature to customize the desired specifications of your OS layer in the Edge host. You can reference the custom OS through the BYOOS pack.


To use a custom OS, you must include all the Edge artifacts and provider images required by the Edge Installer in the custom OS. Refer to the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md) guide for steps on how to create a custom OS that includes all the required components for the Edge Installer.


Select the BYOOS pack and fill out the required parameters during the cluster profile creation process. The `system.uri` parameter specifies the location of the BYOOS image. Refer to the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md) guide to learn how to create Edge Artifacts.

![A view of the Kubernetes pack editor with a YAML configuration](/clusters_site-deployment_model-profile_byoos-pack-yaml.png)


</TabItem>

<TabItem label="Non-Edge" value="Non-Edge">

</TabItem>
</Tabs>

## Prerequisites 

To use the non-Edge BYOOS pack, you must have the following:

<br />

- A custom OS that you created. Refer to the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md) guide to learn how to create a custom OS for Palette.

## Parameters

The following is a list of parameters required when using the BYOOS pack.

<br/>

| Parameter            | Description                                            | Type |
|----------------------|--------------------------------------------------------|---|
| `osImageOverride` | The image ID used as the base OS layer. This is the image ID as assigned in the infrastructure environment the image belongs to. Example: `ami-0f4804aff4cf9c5a2` | string|
| `osName` | The name of the OS distribution. Example: `rhel` | string |
| `osVersion` | The version of the OS distribution. Example: `"8"` | string |

## Usage

Use the BYOOS pack when selecting the OS layer during the cluster profile creation. Use the following information to find the BYOOS pack.

* Pack Type: OS
* Registry: Public Repo
* Pack Name: Bring Your Own OS (BYO-OS)
* Pack Version: 1.0.x or higher


:::info

Check out the [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md) reference to learn about profile types and how to create a cluster profile.

:::

<br/>


Fill out the required parameters with information about your custom OS, such as the ID, OS distribution, and version.

<br />

```yaml
pack:
  osImageOverride: "ami-0f4804aff4cf9c5a2"
  osName: "rhel"
  osVersion: "8"
```



<br />


  ![View of the cluster profile wizard](/clusters_byoos_image-builder_cluster-profile-byoos-yaml.png)





Check out the [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md  ) guide to learn to create a custom image for Palette. 


---

<br />

Image creation tools are available to help you create custom OS images for the infrastructure provider you are using. The following is a list of commonly used tools for creating a custom OS:

<br />

* [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/).


* [Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview?tabs=azure-powershell). 


* [HashiCorp Packer](https://developer.hashicorp.com/packer). 


* [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html). 


</TabItem>

</Tabs>


## Terraform 

<Tabs queryString="platform">
<TabItem label="Edge" value="edge">

You can retrieve details about the BYOOS Edge OS agent pack using the following Terraform code.

<br />


```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "edge-native-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

</TabItem>

<TabItem label="Non-Edge" value="non-Edge">


You can retrieve details about the BYOOS pack by using the following Terraform code.

<br />

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "generic-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

</TabItem>

</Tabs>

## References

- [Create a Custom Cluster Profile with BYOOS](../clusters/edge/site-deployment/model-profile.md)


- [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos.md)


- [Model Edge Native Cluster Profile](../clusters/edge/site-deployment/model-profile.md)


- [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/)


- [Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview?tabs=azure-powershell) 


- [HashiCorp Packer](https://developer.hashicorp.com/packer) 


- [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html) 