---
title: "Platform Security"
metaTitle: "Platform Security"
metaDescription: "Learn how Palette provides platform infrastructure security."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Based on the deployment model, Spectro Cloud Platform is composed of a multi-layer deployment stack: Cloud > VM > OS > Container Runtime > Kubernetes > Pods.

Spectro Cloud follows defense-in-depth principles that prescribe securing each layer in a multi-layer deployment stack to ensure maximum security.

For SaaS deployment models, cloud and Virtual Machine (VM) security are handled by SaaS platform operation security controls. For on-prem deployment models, the customer’s data center infrastructure team typically handles cloud and VM security.

## Operating Systems

The operating system used for instances that form the Spectro Cloud Management Platform Kubernetes cluster is Ubuntu 20.04 LTS. Spectro Cloud follows CIS standard to harden the operating system.

These hardened images are used to launch control planes and worker nodes for the Kubernetes cluster hosting Palette. Additionally, all OS images are scanned for vulnerabilities prior to being published to a repository.

## Container Security

Spectro Cloud uses containerd for container runtime. Containerd is an industry-standard container runtime that emphasizes simplicity, robustness, and portability in managing the complete container lifecycle. It runs as a demon on the Ubuntu instances.

Container images for various application services are built using distroless images, which have significantly fewer packages and improve security by reducing the attack surface.

All container images are scanned for vulnerabilities prior to being published to a repository or deployed to the SaaS platform.

## Kubernetes Hardening

Kubernetes version used for Spectro Cloud’s platform is secured per CIS Kubernetes Benchmark. Several additional rules are also enforced on components such as the API Server, Controller Manager, Scheduler, and Kubelet.
