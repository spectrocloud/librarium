---
sidebar_label: "Platform Security"
title: "Platform Security"
description: "Learn how Palette provides platform infrastructure security."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["security"]
---

Based on the deployment model, Palette is composed of a multi-layer deployment stack: Cloud > VM > OS > Container
Runtime > Kubernetes > Pods.

To ensure maximum security, we follow defense-in-depth principles that prescribe securing each layer in a multi-layer
deployment stack.

For SaaS deployment models, cloud and Virtual Machine (VM) security are handled by SaaS platform operation security
controls. For on-prem deployment models, the customer’s data center infrastructure team typically handles cloud and VM
security.

## Operating Systems

The operating system that Palette uses for its Kubernetes management cluster is Ubuntu 22.04 LTS. We follow CIS
standards to harden the operating system.

These hardened images are used to launch control planes and worker nodes for the Kubernetes cluster hosting Palette.
Additionally, all OS images are scanned for vulnerabilities prior to being published to a repository.

## Container Security

Spectro Cloud uses Containerd for container runtime. Containerd is an industry-standard container runtime that
emphasizes simplicity, robustness, and portability in managing the complete container lifecycle. It runs as a demon on
Ubuntu instances.

Container images for various application services are built using distroless images, which have significantly fewer
packages and improve security by reducing attack surface.

All container images are scanned for vulnerabilities prior to being published to a repository or deployed to the SaaS
platform.

## Kubernetes Hardening

We secure Palette's Kubernetes version based on Center for Internet Security (CIS) Kubernetes benchmarks. Several
additional rules are also enforced on components such as the API Server, Controller Manager, Scheduler, and Kubelet.
