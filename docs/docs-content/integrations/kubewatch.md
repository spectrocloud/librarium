---
sidebar_label: "kube-watch"
title: "kube-watch"
description: "kube-watch monitoring pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/kubewatch/blobs/sha256:a277fb90357df9cbffe98eea1ed100fba1b17970b8fc056d210c4f7bfe4f17a3?type=image/png"
tags: ["packs", "kube-watch", "monitoring"]
---

Kubewatch is a Kubernetes watcher that currently publishes notification to available collaboration hubs/notification
channels. It is run in the k8s cluster for monitoring resource changes and event notifications are obtained through
webhooks. The supported webhooks are:

- slack
- hipchat
- mattermost
- flock
- webhook
- smtp

## Usage:

kubewatch [flags] kubewatch [command]

## Versions Supported

<Tabs>

<TabItem label="1.0.x" value="1.0.x">

**1.0.7**

</TabItem>
</Tabs>

## References

- [kube-watch GitHub](https://github.com/robusta-dev/kubewatch)
