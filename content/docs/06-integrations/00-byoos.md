---
title: "Bring Your Own OS (BYOOS)"
metaTitle: "Bring your own OS (BYOOS)"
metaDescription: "Bring Your Own OS (BYOOS) pack in Palette."
hiddenFromNav: true
type: "integration"
category: ['operating system', 'amd64']
logoUrl: "https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Bring Your Own Operating System (BYOOS) 

The [Bring Your Own Operating System (BYOOS)](/cluster-profiles/byoos) enables you to use a custom Operating System (OS) with Palette. Palette comes with several operating systems out-of-the-box, but the existing OS list may not meet all users' needs. 

Using your custom OS provides several benefits, including the ability to control your own dependencies, improve performance, and ensure compatibility with your existing applications. With BYOOS, you can choose the OS that best fits your needs, whether it's a commercial or open-source distribution, and integrate it with your Kubernetes clusters. The BYOOS pack can be used with both Edge and non-Edge environments. 

# Versions Supported

**1.0.x**

<br />

<Tabs>

<Tabs.TabPane tab="Edge" key="edge">

## Prerequisites 


<br />

- The Edge Provider images you have created and uploaded to a container registry. Refer to the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide for steps on how to create the Edge artifacts and how to upload your custom OS to a registry.


- Palette 3.3.0 or greater.

## Parameters

The BYOS Edge OS pack supports the following parameters. 

### Parameters

| Parameter            | Description                                            | Type | Default Value |
|----------------------|--------------------------------------------------------|------| ------------- |
| `pack:content` | Specifies the content of the **BYOS Edge OS** pack. | map | N/A |
| `pack.content.images` | Specifies a list of OS images to use with the pack. | list | N/A |
| `pack.content.images.image` | An OS image to use with the pack. | string| `'{{.spectro.pack.edge-native-byoi.options.system.uri}}'`|
| `pack.drain:` | Specifies the drain configuration for the node. | map | N/A
| `pack.drain.cordon` | Specifies whether to cordon the node. | boolean | `false` | 
| `pack.drain.timeout` | The time in seconds to attempt draining the node before aborting the operation. A zero value indicates no timeout window and to continue waiting indefinitely.   | integer | `60` |
| `pack.drain.gracePeriod` | The time in seconds each pod has to terminate gracefully. If negative, the default value specified in the pod will be used. | integer | `60` |
| `pack.drain.ignoreDaemonSets` | Specifies whether to ignore DaemonSets. | boolean | `false` |
| `pack.drain.deleteLocalData` | Specifies whether to continue if there are pods using the emptyDir volume. If enabled local data will be deleted during a drainage operation. | boolean | `false` |
| `pack.drain.force` | Specifies whether to continue if there are pods that do not declare a controller. | boolean | `false` |
| `pack.drain.disableEviction` | Specifies whether to allow a force drain and use delete, including if pod eviction is supported. This option will bypass checking if [*PodDisruptionBudgets*](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) are allocated. Use this option with caution. | boolean | `false` |
| `pack.drain.skipWaitForDeleteTimeout` | Specifies whether to skip waiting for the pod to terminate if the pod *DeletionTimestamp* is older than the specified number of seconds. The number of seconds must be greater than zero to skip. | integer | `60` |
| `system.uri` | The system URI specifies the location of the BYOOS image. | string|  


<br />


  ```yaml hideClipboard
  pack:
    content:
      images:
        - image: '{{.spectro.pack.edge-native-byoi.options.system.uri}}'
    # Below config is default value, please uncomment if you want to modify default values
    #drain:
      #cordon: true
      #timeout: 60 # The length of time to wait before giving up, zero means infinite
      #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
      #ignoreDaemonSets: true
      #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
      #force: true # Continue even if there are pods that do not declare a controller
      #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
      #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
  options:
    system.uri: ""
      system.uri: example.io/my-images/example-custom-os:v1.4.5
  ```

## Usage

BYOOS enables you to use a custom OS for your Edge host. You can use this feature to customize the desired specifications of your OS layer in the Edge host. You can reference the custom OS through the BYOOS pack.


To use a custom OS, you must include all the Edge artifacts and provider images required by the Edge Installer in the custom OS. Refer to the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide for steps on how to create a custom OS that includes all the required components for the Edge Installer.


Select the BYOOS pack and fill out the required parameters during the cluster profile creation process. The `system.uri` parameter specifies the location of the BYOOS image. Refer to the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn how to create Edge Artifacts.

![A view of the Kubernetes pack editor with a YAML configuration](/clusters_site-deployment_model-profile_byoos-pack-yaml.png)

<br />

### Node Drainage

The BYOOS pack supports node drainage. Node drainage is the process of cordoning and removing workloads from a node. Cordoning a node prevents new pods from being scheduled on the node. Draining a node gracefully terminates all pods on the node and reschedules them on other healthy nodes.

To enable node drainage, you must include the `pack.drain` parameter block and set the `pack.drain.cordon` parameter to `true`. 

<br />

  ```yaml
  pack:
    drain:
      cordon: true
  ```

You can customize the node drainage process by using the additional parameters in the `pack.drain` parameter block. Refer to the [parameters](#parameters) section for a list of the supported parameters.

You can change the node drainage behavior after a cluster is deployed by updating the cluster profile and applying the changes to the cluster. 

<br />

<WarningBox>

Changing the node drainage behavior after a cluster is deployed will trigger a rolling update on the cluster nodes. Each node will reboot so that the new node drainage behavior can be applied.

</WarningBox>




</Tabs.TabPane>

<Tabs.TabPane tab="Non-Edge" key="Non-Edge">

## Prerequisites 

To use the non-Edge BYOOS pack, you must have the following:

<br />

- A custom OS that you created. Refer to the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn how to create a custom OS for Palette.

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


<InfoBox>

Check out the [Create Cluster Profile](/cluster-profiles/task-define-profile/) guide to learn how to create a cluster profile.

</InfoBox>

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





Check out the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn to create a custom image for Palette. 


---

<br />

Image creation tools are available to help you create custom OS images for the infrastructure provider you are using. The following is a list of commonly used tools for creating a custom OS:

<br />

* [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/).


* [Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview?tabs=azure-powershell). 


* [HashiCorp Packer](https://developer.hashicorp.com/packer). 


* [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html). 


</Tabs.TabPane>

</Tabs>


# Terraform 

<Tabs>
<Tabs.TabPane tab="Edge" key="edge">

You can retrieve details about the BYOOS Edge OS agent pack using the following Terraform code.

<br />


```terraform
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "edge-native-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

</Tabs.TabPane>

<Tabs.TabPane tab="Non-Edge" key="non-Edge">


You can retrieve details about the BYOOS pack by using the following Terraform code.

<br />

```terraform
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "generic-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
```

</Tabs.TabPane>

</Tabs>

# References

- [Create a Custom Cluster Profile with BYOOS](/clusters/edge/site-deployment/model-profile)


- [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos)


- [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)


- [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/)


- [Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview?tabs=azure-powershell) 


- [HashiCorp Packer](https://developer.hashicorp.com/packer) 


- [Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html) 