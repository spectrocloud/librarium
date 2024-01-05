---
sidebar_label: "Nutanix CSI"
title: "Nutanix CSI"
description: "Learn how to use the Nutanix CSI pack to provide persistent storage for your applications."
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/nutanix-csi/blobs/sha256:7944cb5fecaaac0b5d5bf47a311ab80573147a34ac438954a70f97c69d65d733?type=image/png"
tags: ["packs", "Nutanix", "Storage"]
---

The Nutanix Container Storage Interface (CSI) pack provides persistent storage for stateful applications. The pack consists of two Helm charts - **nutanix-csi-storage** and **nutanix-cloud-provider**.

The Nutanix Container Storage Interface (CSI) Volume Driver chart leverages Nutanix Volumes and Nutanix Files to provide scalable and persistent storage for applications.

The Nutanix Cloud Provider chart is a plugin that allows the integration of the Nutanix Acropolis Hypervisor (AHV) platform with Kubernetes by implementing a node controller function.


## Versions Supported

- 2.6.6


## Prerequisites

- A Nutanix Prism Central account.

- A Nutanix Prism Element cluster created.

- A Nutanix cloud registered with Palette with the name `nutanix`. For more information, refer to [Register Nutanix Cloud](../clusters/data-center/nutanix/register-nutanix-cloud.md).

- The cluster must use Kubernetes version 1.20 or higher.


## Parameters

The table below lists commonly used parameters you can configure when adding the Nutanix CSI pack. Review the [Nutanix CSI Pack](https://github.com/spectrocloud/pax/edit/master/stable/storage/nutanix-csi-2.6.6/README.md) GitHub page for a complete parameters list.

|**Parameter**|**Description**|**Default**|
|-------------|---------------|-----------|
|`nutanix-cloud-provider.createConfig`| Creates a config for the Nutanix Cloud Provider. The existing config will be used if this parameter is set as `false`. |`true`|
|`nutanix-cloud-provider.configName`| Name of the ConfigMap for the Nutanix Cloud Provider config. |`nutanix-config`|
|`nutanix-cloud-provider.createSecret`| Creates a secret for the Nutanix Cloud Provider. The existing secret will be used if this parameter is set as `false`. |`true`|
|`nutanix-cloud-provider.enableCustomLabeling`| Adds additional and custom Nutanix labels to nodes. |`false`|
|`nutanix-cloud-provider.topologyDiscovery.type`| Defines how topology will be discovered (Prism or Categories). |`Prism`|
|`nutanix-cloud-provider.podAnnotations`| Adds annotations to the Cloud Provider Pod. |`{}`|
|`nutanix-csi-storage.volumeClass`| Activates the Nutanix Volumes Storage Class. |`false`|
|`nutanix-csi-storage.volumeClassName`| Name of the Nutanix Volumes Storage Class. |`nutanix-volume`|
|`nutanix-csi-storage.volumeClassRetention`| Retention policy for the Volumes Storage Class (Delete or Retain). |`Delete`|
|`nutanix-csi-storage.fileClass`| Activates Nutanix Files Storage Class. |`false`|


## Usage

Palette provides a default Volume storage class called `spectro-storage-class` to allow applications requiring volumes to access persistent volumes. This storage class is created by the Nutanix CSI pack.

A storage container must be configured in the Prism Element UI to enable the pack to create the storage class. Once the storage container is configured, specify its name during the cluster profile creation. The container name must be included in the values of the `nutanix-csi-storage` chart, under the `storageContainer:` line. The code snippet below showcases an example configuration with a storage container named **test-container**.

```bash
storageContainer: "test-container"
```

Nutanix Volumes utilize an Internet Small Computer System Interface (iSCSI) data service IP address to provide access to cluster storage. In the Prism Element UI, go to the **Cluster Details** page and configure the iSCSI Data services IP address as described in the [Adding an ISCSI Data Services IP Address](https://portal.nutanix.com/page/documents/details?targetId=Volumes-Guide:vol-cluster-details-modify-wc-t.html) guide.

:::caution
The iSCSI daemon needs to be enabled during the Nutanix cloud registration step. Refer to the [Register Nutanix Cloud](../clusters/data-center/nutanix/register-nutanix-cloud.md) to learn more about the Nutanix registration process.
:::


## Terraform

You can reference the Nutanix CSI pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack_simple" "nutanix-csi" {
  name    = "nutanix-csi"
  version = "2.6.6"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```


## References

- [Nutanix Documentation](https://www.nutanixbible.com)
- [Nutanix Cloud Controller Manager on GitHub](https://github.com/nutanix-cloud-native/cloud-provider-nutanix)
- [Nutanix CSI Volume Driver Documentation](https://portal.nutanix.com/page/documents/details?targetId=CSI-Volume-Driver-v2_6:CSI-Volume-Driver-v2_6)
- [Nutanix CSI Pack on GitHub](https://github.com/spectrocloud/pax/tree/master/stable/storage/nutanix-csi-2.6.6)