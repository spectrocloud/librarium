---
sidebar_label: "Register Nutanix Cloud"
title: "Register Nutanix Cloud"
description: "Learn how to register a Nutanix cloud in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---


A System Administrator registers the Nutanix cloud in Palette by invoking system-level APIs. These APIs provide specific cloud information, the cloud logo, and the key-value pairs required to add the cloud to Palette. They also enable uploading the YAML templates used to create the cluster, control plane, and worker nodes. This section provides instructions on how to use the APIs to register a Nutanix cloud to Palette.


## Prerequisites

- A Nutanix Prism Central account.

- A Palette account with system-level access.

- A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide.

- Downloaded infrastructure-components.yaml from the Nutanix space in GitHub. The YAML contains all the Custom Resource Definitions (CRDs) for Nutanix cluster resources.

- YAML templates, which can be found on the cloud provider release pages in GitHub:
  - control-plane template
  - worker template
  - cluster template (cluster-template.yaml)


## Register the Cloud

Use the following steps to register a Nutanix cloud.

1. Visit [Palette APIs](https://docs.spectrocloud.com/api/category/palette-api-v1). 

2. 

Access the [Nutanix Cluster API infrastructure provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) page on GitHub.

  | **Template** | **Objects** |
  |-----------|-----------------|
  | **Control-plane**| KubeadmControlPlane (KCP)<br />NutanixdMachineTemplate |
  | **Worker**| MachineDeployment (MD)<br />KubeadmConfigTemplate<br />NutanixMachineTemplate |
  | **Cluster**|Cluster<br />CloudCluster<br />Secrets<br />ConfigMap<br />MachineHealthCheck |

 user replaces anything in braces.

 
 
 "divide into three files"

Some Cluster templates contain all of these objects, and others may not contain Secrets, configMap, and healthcheck 

Cluster template gets installed first. If any of the control-plane and worker objects are not 

1. Get the templates. 
:::caution
When selecting templates, check to see if the cloud provider has a compatibility matrix ensure you download the latest CAPI version. 
:::
2. Register four templates using APIs. 

3. 
