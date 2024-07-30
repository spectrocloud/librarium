---
sidebar_label: "Kubevious"
title: "Kubevious"
description: "Kubevious Monitoring pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kubevious/blobs/sha256:5e33d7b51b1317a834b4552d96fc1cc8463000a7eedbcb4b784ea07236f3d7f7?type=image.webp"
tags: ["packs", "kubevious", "monitoring"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="1.0.x" value="1.0.x">

## Components

This integration deploys the following components:

- Deployment
- MySql DB
- UI
- Parser

## Configure Ingress

Follow the steps below to configure Ingress on Kubevious, according to the corresponding version.

1. Within the manifest, find the kubevious section **user** > **interface** > **service** > **type** and confirm/change,
   according to the Kubevious version as listed in the table below.

   | **Versions** | **Parameters**                   | **Action**                                                           |
   | ------------ | -------------------------------- | -------------------------------------------------------------------- |
   | **1.0.10**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.8.15**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.5.9**    | ui: svcType: **LoadBalancer**    | Change kubevious.ui.svcType from **LoadBalancer** to **Cluster IP**. |

2. Configure Ingress
   - Enable Ingress; change enabled from _false_ to **true**.
   - Set Ingress rules like annotations, path, hosts, etc.

With these configuration changes, you can access the Kubevious service on the Ingress Controller LoadBalancer
hostname/IP.

</TabItem>
<TabItem label="0.8.x" value="0.8.x">

## Components

This integration deploys the following components:

- Deployment
- MySql DB
- UI
- Parser

## Configure Ingress

Follow the steps below to configure Ingress on Kubevious, according to the corresponding version.

1. Within the manifest, find the kubevious section **user** > **interface** > **service** > **type** and confirm/change,
   according to the Kubevious version as listed in the table below.

   | **Versions** | **Parameters**                   | **Action**                                                           |
   | ------------ | -------------------------------- | -------------------------------------------------------------------- |
   | **1.0.10**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.8.15**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.5.9**    | ui: svcType: **LoadBalancer**    | Change kubevious.ui.svcType from **LoadBalancer** to **Cluster IP**. |

2. Configure Ingress
   - Enable Ingress; change enabled from _false_ to **true**.
   - Set Ingress rules like annotations, path, hosts, etc.

With these configuration changes, you can access the Kubevious service on the Ingress Controller LoadBalancer
hostname/IP.

</TabItem>
<TabItem label="0.5.x" value="0.5.x">

## Components

This integration deploys the following components:

- Deployment
- MySql DB
- UI
- Parser

## Configure Ingress

Follow the steps below to configure Ingress on Kubevious, according to the corresponding version.

1. Within the manifest, find the kubevious section **user** > **interface** > **service** > **type** and confirm/change,
   according to the Kubevious version as listed in the table below.

   | **Versions** | **Parameters**                   | **Action**                                                           |
   | ------------ | -------------------------------- | -------------------------------------------------------------------- |
   | **1.0.10**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.8.15**   | ui: service: type: **ClusterIP** | Confirm that it states **ClusterIP**.                                |
   | **0.5.9**    | ui: svcType: **LoadBalancer**    | Change kubevious.ui.svcType from **LoadBalancer** to **Cluster IP**. |

2. Configure Ingress
   - Enable Ingress; change enabled from _false_ to **true**.
   - Set Ingress rules like annotations, path, hosts, etc.

With these configuration changes, you can access the Kubevious service on the Ingress Controller LoadBalancer
hostname/IP.

</TabItem>
</Tabs>

## Terraform

You can reference the Kubevious pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "kubevious" {
  name    = "kubevious"
  version = "1.0.10"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
