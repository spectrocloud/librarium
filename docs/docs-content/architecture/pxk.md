---
sidebar_label: "Palette eXtended Kubernetes"
title: "Palette eXtended Kubernetes"
description: "An overview of Palette eXtended Kubernetes and how it's different from the upstream Kubeadm."
hide_table_of_contents: false
---

<VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=k8s" /> is a customized version
of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be
deployed through Palette to all major infrastructure providers, public cloud providers, and private data center
providers. This is the default distribution when deploying a Kubernetes cluster through Palette. For Edge deployments,
we also offer Palette eXtended Kubernetes - Edge (PXK-E), which is a version of PXK specifically designed for Edge
deployments.

PXK and <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=k8s-native" />
share the core Cloud Native Computing Foundation (CNCF) binaries, with out-of-the-box security hardening that makes them
ideal for production workloads without manual intervention. The following table offers a comparison overview between PXK
and CNCF Kubeadm.

| Feature                 | PXK                      | Kubeadm         |
| ----------------------- | ------------------------ | --------------- |
| Audit logging           | ✅ Enabled               | ❌ Manual       |
| PodSecurity admission   | ✅ Enabled + configured  | ❌ Not enabled  |
| Hardened kubelet config | ✅ Enforced              | ❌ Optional     |
| Kernel tuning           | ✅ Applied automatically | ❌ Manual       |
| Lifecycle hooks         | ✅ Pre/Post support      | ❌ Not built-in |

## Shared Core with CNCF-Distribution

Both PXK and PXK-E use official upstream images from registry.k8s.io, the same registry used by CNCF distributions.
These images include all essential components:

- kube-apiserver
- etcd
- kube-scheduler
- kube-controller-manager
- kube-proxy
- CoreDNS
- pause

We do not fork or modify Kubernetes binaries. This ensures that PXK and PXK-E are fully CNCF-conformant and compatible
with ecosystem tools such as Helm, `kubectl`, and Kubernetes-native APIs.

## Security Hardening

In addition to being CNCF-conformant, PXK comes with out-of-the-box security hardening:

- PodSecurity admission enabled with baseline enforcement and strict warning
- Audit logging configured with sane filters and volume mounts
- Secure API server flags
- Kubelet hardened with read-only port disabled and cert rotation.

These security hardening measures make your clusters production ready without manual security intervention.

## Host-level System Tuning

By default, PXK applies Linux kernel parameter tuning that aligns with Kubernetes best practices and production
hardening:

- Allows VM memory overcommit to ensure predictable memory allocation behavior for Pods.
- Automatically reboots the node 10 seconds after a kernel panic.
- Treats kernel “oops” events as fatal, triggering panic and recovery.

## Lifecycle Management

PXK supports declarative lifecycle hooks that allow operators to inject custom logic before and after kubeadm
provisioning:

- Pre-init hooks (`preKubeadmCommands`) can apply kernel parameters, prepare certificates, or customize node behavior.
- Post-init hooks (`postKubeadmCommands`) can adjust permissions, deploy agents, or perform cleanup.

This approach simplifies integration with existing automation workflows, eliminates the need for brittle wrapper
scripts, and ensures consistent behavior across environments.

## PXK vs PXK-E

PXK-E makes a few adjustments on top of PXK to account for the Edge environments by streamlining configuration files,
reducing deployment complexity, and emphasizing immutability. The following table provides a brief comparison between
PXK and PXK-E.

| Feature                | PXK                                         | PXK-E                                                                       |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| Pod Security Admission | ✅ Included                                 | Not explicitly configured                                                   |
| Kubelet config         | `kubeletExtraArgs` + sysctl files           | Native `kubeletConfiguration` block                                         |
| Audit Policy           | External file (mounted)                     | Inline YAML                                                                 |
| Lifecycle hooks        | `preKubeadmCommands`, `postKubeadmCommands` | Uses [cloud-init stages](../clusters/edge/edge-configuration/cloud-init.md) |
| etcd tuning            | Default                                     | Custom arguments for storage efficiency and hardened security               |

## Resources

- <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=k8s" />
- <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=k8s-native" />
