---
sidebar_label: "Cilium"
title: "Cilium"
description: "Cilium network pack for Spectro Cloud Palette"
hide_table_of_contents: true
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/cni-cilium/blobs/sha256:dbc239ac739ea2939ef41dd0743b82281bc82c360326cd7c536f73f0053e2cd2?type=image.webp"
tags: ["packs", "cilium", "network"]
---

Palette Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. For more Kubernetes
network model design goals visit
[here](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

Palette supports **Cilium**, an open-source software for securing and observing network connectivity between
cloud-native container workloads. Cilium is underpinned by a Linux Kernel technology called eBPF, to enable dynamic and
strong security visibility and control logic within Linux. As eBPF runs within the Linux Kernel, Cilium security
policies are applied and updated independent of the application code or container configuration.

The Cilium agent runs on all clusters and servers to provide networking, security and observability to the workload
running on that node.

## Prerequisite

- If the user is going for the BYO (Bring your own) Operating system use case then, HWE (Hardware Enabled) Kernel or a
  Kernel that supports [eBPF](https://ebpf.io/) modules needs to be provisioned.

**Palette OS images are by default provisioned with the above pre-requisite.**

## Versions Supported

<Tabs>

<TabItem label="1.10.x" value="1.10.x">

**1.10.9**

</TabItem>

</Tabs>

## References

- [Cilium Documentation](https://docs.cilium.io/en/stable)
