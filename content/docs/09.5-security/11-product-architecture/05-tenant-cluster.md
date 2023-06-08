---
title: "Tenant Cluster Security"
metaTitle: "Tenant Cluster Security"
metaDescription: "Lorem ipsum dolor"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Tenant Kubernetes clusters can be launched in the tenant’s choice of public cloud, private cloud, or bare metal environment.

Palette has security controls for the operating system, containers, and Kubernetes. Tenant clusters are Kubernetes clusters deployed by Palette for customers (tenants) in their choice of public or private cloud or bare metal environment. Palette offers complete flexibility and control for designing these tenant clusters through a construct called [Cluster Profiles](/cluster-profiles).

Cluster profiles are cluster construction templates that enable customers to construct a blueprint for the tenant cluster. Palette’s provisioning engine deploys a Kubernetes cluster based on what the profile specifies.

A cluster profile definition consists of various system layers like Operating System (OS), Kubernetes Distro, Storage, Networking, Monitoring, Logging, and more. The OS and Kubernetes layers are considered core layers, whereas layers such as Logging, Monitoring, and others are add-on layers. Several choices are presented for each layer in the profile in the form of Packs.

Spectro Cloud provides several packs out-of-the-box for all the layers and at the same time provides extensibility by allowing customers to bring their own packs. The flexibility and extensibility of the platform make the security of the tenant clusters a shared responsibility.

|Layer            |Out of the box Pack | Custom Pack|
|:---------------|:---------|:--------------|
|Operating System |Spectro Cloud Responsibility|Customer Responsibility|
|Kubernetes|Spectro Cloud Responsibility|Customer Responsibility|
|Storage|Spectro Cloud Responsibility|Customer Responsibility|
|Networking|Spectro Cloud Responsibility|Customer Responsibility|
|Add-Ons|Spectro Cloud & Customer Responsibility|Customer Responsibility|

We ensure our out-of-the-box core layers are secure. Customers are responsible for security if they bring their own packs. Palette provides defaults for its out-of-the-box add-on layers based on third-party best practices. Customers have the flexibility to tune the configuration to best fit their needs, making it a shared responsibility.

## Cloud Infrastructure Security

When deployed in a public cloud, Kubernetes nodes from tenant clusters are deployed within a logically isolated virtual network (e.g., VPC in AWS) that has private and public subnets. The control plane and worker nodes for the Kubernetes cluster are launched in a private network. All ports on the nodes are protected from external access.

Each tenant cluster has a management agent that runs as a pod. This agent has an outbound internet connection to Palette using static Network Address Translation (NAT) with Transport Layer Security (TLS) protocol v1.2 or higher and a hardened cipher suite. The agent periodically reports health, heartbeat, and statistics and connects to Palette's public repository over HTTPS for any out-of-the-box integration packs.

In a self-hosted environment, where Palette is typically deployed on-prem behind a firewall, you must ensure security controls in your environment. Palette automatically generates security keys at installation and stores them in the management cluster. You can import an optional certificate and private key to match the management cluster Fully Qualified Domain Name (FQDN). Palette supports enabling disk encryption policies for management cluster VMs if required.


## Hardened Operating System

Palette provides Ubuntu or CentOS images for supported cloud environments. Images that are hardened according to Center for Internet Security (CIS) Benchmarks are used to launch control planes and worker nodes for the Kubernetes cluster.

Palette's OS hardening utility performs the following tasks:

<br />

- Applies the latest available security updates.


- Hardens SSH server parameters, network parameters (sysctl), and system files by ensuring proper file permissions are set.


- Removes legacy services and graphical user interface (GUI) packages.

Palette allows you to set up OS patching policies. You can patch the base OS when you deploy the cluster. Refer to the [OS Patching](/clusters/cluster-management/os-patching) documentation to learn more.

<br />

## Hardened Containers

Container images for various application services are built using distroless images, which have significantly fewer packages and improve security by reducing attack surface.

All container images are scanned for vulnerability using Palo Alto Networks Prisma Cloud (Twistlock) Defender before being published to a repository or deployed to the SaaS platform.

<br />

## Hardened Kubernetes

Spectro Cloud has a fully automated Kubernetes verification system that adds the newest patch version of Kubernetes to its public repository. All Kubernetes packs are hardened according to CIS Benchmarks.

We assess major Kubernetes versions based on the extent of changes.

Kubernetes run-time security support is achieved through a variety of add-on packages, such as Sysdig Falco and Twistlock.

Kubernetes cluster authentication can be optionally integrated with Kubelogin using OpenID Connect (OIDC) authentication and authorization against an external Identity Provider (IDP).

You can set a schedule to start Kubernetes conformance and compliance tests using kube-bench, kube-hunter, and Sonobuoy. These tests ensure tenant clusters are secure, compliant, and up to date.

<br />

## Kubernetes Authentication & Authorization

Kubernetes cluster authentication can be optionally integrated with Kubelogin with OIDC-based authentication/authorization against external IDP. This enables group membership-based access control on different namespaces within the tenant Kubernetes cluster. Spectro Cloud’s Terraform provider also supports automatically set role binding on namespaces with users or groups.

<br />

## Compliance & Security Scans

Palette provides a way to run compliance, security, conformance, and software bill of materials (SBOM) scans on tenant clusters. These scans ensure clusters adhere to specific compliance and security standards. The scans also detect potential vulnerabilities by performing penetration tests.

Palette supports four types of scans. Each scan generates reports with details specific to the type of scan. You can initiate multiple scans of each type over time. In addition, Palette keeps a history of previous scans for comparison purposes.
