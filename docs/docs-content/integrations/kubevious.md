---
sidebar_label: "Kubevious"
title: "Kubevious"
description: "Kubevious Monitoring pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kubevious/blobs/sha256:5e33d7b51b1317a834b4552d96fc1cc8463000a7eedbcb4b784ea07236f3d7f7?type=image/png"
tags: ["packs", "kubevious", "monitoring"]
---

Kubevious integration provides a graphical interface that renders easy to understand, application-centric Kubernetes
configurations.

## Versions Supported

<Tabs>
<TabItem label="1.0.x" value="1.0.x">

- **1.0.10**

</TabItem>
<TabItem label="0.8.x" value="0.8.x">

- **0.8.15**

</TabItem>
<TabItem label="0.5.x" value="0.5.x">

- **0.5.9**

</TabItem>
</Tabs>

## Components

This integration deploys the following components:

- Deployment
- MySql DB
- UI
- Parser

## Ingress

Follow the steps below to configure Ingress on Kubevious, according to the corresponding version

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

## References

- [Kubevious GitHub](https://github.com/kubevious/kubevious)
