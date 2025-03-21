---
sidebar_label: "Nutanix CSI"
title: "Nutanix CSI"
description: "Learn how to use the Nutanix CSI pack to provide persistent storage for your applications."
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/nutanix-csi/blobs/sha256:7944cb5fecaaac0b5d5bf47a311ab80573147a34ac438954a70f97c69d65d733?type=image.webp"
tags: ["packs", "Nutanix", "Storage"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="2.6.x" value="2.6.x">

## Configure Storage Container

Palette provides a default Volume storage class called `spectro-storage-class` to allow applications requiring volumes
to access persistent volumes. This storage class is created by the Nutanix CSI pack.

A storage container must be configured in the Prism Element UI to enable the pack to create the storage class. Once the
storage container is configured, specify its name during the cluster profile creation. The container name must be
included in the values of the `nutanix-csi-storage` chart, under the `storageContainer:` line. The code snippet below
showcases an example configuration with a storage container named **test-container**.

```bash
storageContainer: "test-container"
```

## Configure ISCSI Data Services IP Address

Nutanix Volumes utilize an Internet Small Computer System Interface (iSCSI) data service IP address to provide access to
cluster storage. In the Prism Element UI, go to the **Cluster Details** page and configure the ISCSI data services IP
address as described in the
[Adding an ISCSI Data Services IP Address](https://portal.nutanix.com/page/documents/details?targetId=Volumes-Guide:vol-cluster-details-modify-wc-t.html)
guide.

:::warning

The iSCSI daemon needs to be enabled during the Nutanix cloud registration step. Refer to the
[Register Nutanix Cloud](../clusters/data-center/nutanix/register-nutanix-cloud.md) to learn more about the Nutanix
registration process.

:::

</TabItem>

</Tabs>

## Terraform

You can reference the Nutanix CSI pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "nutanix-csi" {
  name    = "nutanix-csi"
  version = "2.6.6"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
