---
sidebar_label: "Tenant Cluster Security"
title: "Tenant Cluster Security"
description: "Lorem ipsum dolor"
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["security"]
---

Tenant clusters are Kubernetes clusters that Palette deploys for customers. Tenant clusters can be launched in the
customer's choice of public or private cloud or bare metal environment. Palette offers complete flexibility and control
in designing these tenant clusters through a construct called [Cluster Profiles](../../glossary-all.md#cluster-profile).

[Cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) are cluster construction templates. Palette
deploys a Kubernetes cluster based on what the profile specifies.

A cluster profile consists of core layers that consist of an Operating System (OS), a Kubernetes distribution,
networking, and storage, and any add-on layers such as monitoring, logging, and more. Palette offers several
out-of-the-box choices for each profile layer in the form of packs and the flexibility for you to bring your own pack
for use in Palette cluster profiles.

Palette's flexibility and extensibility make the security of tenant clusters a shared responsibility, as listed in the
table.

| Layer            | Out of the box Pack                     | Custom Pack             |
| :--------------- | :-------------------------------------- | :---------------------- |
| Operating System | Spectro Cloud Responsibility            | Customer Responsibility |
| Kubernetes       | Spectro Cloud Responsibility            | Customer Responsibility |
| Storage          | Spectro Cloud Responsibility            | Customer Responsibility |
| Networking       | Spectro Cloud Responsibility            | Customer Responsibility |
| Add-Ons          | Spectro Cloud & Customer Responsibility | Customer Responsibility |

We ensure our out-of-the-box core layer packs are secure. You ensure security for custom packs and add-on packs you
bring to Palette. Palette provides defaults for its out-of-the-box add-on layers based on third-party best practices.
You have the flexibility to tune the configuration to fit your needs, making security a shared responsibility.

<br />

## Cloud Infrastructure Security

In a public cloud, Kubernetes nodes in tenant clusters are deployed within a logically isolated virtual network that has
private and public subnets. The control plane and worker nodes for the Kubernetes cluster are launched in a private
network. All ports on the nodes are protected from external access.

Each tenant cluster has a management agent that is deployed as a pod. This agent has an outbound internet connection to
Palette using static Network Address Translation (NAT) with Transport Layer Security (TLS) protocol v1.2 or higher and a
hardened cipher suite. The agent periodically reports health, heartbeat, and statistics and connects to Palette's public
repository over HTTPS for any out-of-the-box integration packs.

In a self-hosted environment, where Palette is typically deployed on-prem behind a firewall, you must ensure security
controls in your environment. Palette automatically generates security keys at installation and stores them in the
management cluster. You can import an optional certificate and private key to match the management cluster Fully
Qualified Domain Name (FQDN). Palette supports enabling disk encryption policies for management cluster Virtual Machines
(VMs) if required.

<br />

## Hardened Operating System

Palette provides Ubuntu or CentOS images for supported cloud environments. Images that are hardened according to Center
for Internet Security (CIS) Benchmarks are used to launch control planes and worker nodes for the Kubernetes cluster.

Palette's OS hardening utility performs the following tasks:

<br />

- Applies the latest available security updates.

- Hardens SSH server parameters, network parameters (sysctl), and system files by ensuring proper file permissions are
  set.

- Removes legacy services and Graphical User Interface (GUI) packages.

Palette allows you to set up OS patching policies. You can patch the base OS when you deploy the cluster. Refer to
[OS Patching](/clusters/cluster-management/os-patching) to learn more.

<br />

## Hardened Containers

Container images for various application services are built using distroless images, which have significantly fewer
packages and improve security by reducing attack surface.

All container images are scanned for vulnerability using Palo Alto Networks Prisma Cloud (Twistlock) Defender before
being published to a repository or deployed to the SaaS platform.

<br />

## Hardened Kubernetes

Spectro Cloud has a fully automated Kubernetes verification system that adds the newest patch version of Kubernetes to
its public repository. All Kubernetes packs are hardened according to CIS Benchmarks.

We assess major Kubernetes versions based on the extent of changes.

Kubernetes run-time security support is achieved through a variety of add-on packages, such as Sysdig Falco and
Twistlock.

You can set a schedule to start Kubernetes conformance and compliance tests using kube-bench, kube-hunter, and Sonobuoy.
These tests ensure tenant clusters are secure, compliant, and up to date.

<br />

## Kubernetes Authentication & Authorization

Kubernetes cluster authentication can be optionally integrated with Kubelogin with OpenID Connect (OIDC)-based
authentication/authorization against an external Identify Provider (IDP). This enables group membership-based access
control on different namespaces within the tenant Kubernetes cluster. Our Terraform provider also supports automatically
setting role binding on namespaces by user or group.

<br />

## Compliance & Security Scans

You can initiate multiple scans on tenant clusters. These scans ensure clusters adhere to specific compliance and
security standards. The scans also perform penetration tests to detect potential vulnerabilities.

Palette supports four types of scans: compliance, security, conformance, and Software Bill of Materials (SBOM). Each
scan generates reports with scan-specific details. You can initiate multiple scans of each type over time. In addition,
Palette keeps a history of previous scans for comparison purposes.
