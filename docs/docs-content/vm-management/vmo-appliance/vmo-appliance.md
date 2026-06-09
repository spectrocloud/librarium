---
sidebar_label: "Launchpad for VMs Appliance"
title: "Launchpad for VMs Appliance"
description: "Learn about the Launchpad for VMs Appliance, a standalone VMO deployment for bare metal and edge devices."
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "Launchpad for VMs appliance", "quick start"]
---

The Launchpad for VMs Appliance is a standalone deployment of Palette Virtual Machine Orchestrator (VMO) designed for
bare metal and Edge environments. It provides a bootable ISO that you install directly on physical devices, which you
link together to form a cluster to create and managing VMs through a dedicated management UI.

Unlike [VMO Pack](../legacy-vmo/legacy-vmo.md), the Launchpad for VMs Appliance does not require a connection Palette.
It operates independently with its own identity management, storage configuration, and observability stack.

## Use Cases

The Launchpad for VMs Appliance addresses common challenges that organizations encounter when adopting VM orchestration
on Kubernetes:

- **No external control plane required** - The appliance is self-contained. You do not need to set up or connect to
  Palette before you can deploy and manage VMs. This is particularly useful for distributed sites, Edge locations,
  airgapped environments, and regulated environments.

- **Purpose-built VM management experience** - The appliance includes a dedicated UI designed specifically for VM
  lifecycle management, rather than embedding VM controls inside a general-purpose Kubernetes console. Networking,
  storage, and access management are first-class features in the interface.

- **Standalone authentication and access control** - The appliance provides its own identity management through
  Keycloak, generic OIDC providers, or local admin accounts. You do not need an external identity provider (IdP) to get
  started, and you can configure fine-grained role-based access control directly in the appliance.

- **Built-in operational tooling** - Golden image building, snapshot policies, airgapped package management, and
  observability dashboards are included out of the box. These capabilities reduce the need to assemble and maintain
  separate tools for common VM operations.

## Key Capabilities

The Launchpad for VMs Appliance includes the following capabilities beyond what is available in VMO Pack.

### Dedicated Management UI

The appliance includes a purpose-built web interface for VM lifecycle management. From the UI, you can create VMs from
templates or ISOs, manage storage and networking, configure access policies, and monitor cluster health. The UI is
accessible directly from the cluster rather than Palette.

### Golden Image Builder

Build reusable VM disk images from ISOs directly in the UI. The golden image workflow lets you upload an ISO, install an
OS in a builder VM, apply seal scripts to generalize the image, and finalize it as a reusable golden image. VMs created
from golden images start faster and ensure consistent guest configurations across your environment.

### Snapshot Policies

Define declarative snapshot policies with configurable schedules, retention limits, and time windows. Attach policies to
individual VMs or to templates so that every VM created from a template inherits the policy automatically. A built-in
scheduler creates and prunes snapshots based on your policy configuration.

### Airgapped Package Management

Upload DEB, RPM, MSI, and ISO packages to the appliance and serve them to VMs through a built-in package repository. In
airgapped environments where VMs cannot reach external package sources, the appliance generates APT and YUM repository
metadata and serves packages over HTTP within the cluster.

### Identity and Access Management

The appliance provides its own Role-Based Access Control (RBAC) with four built-in roles: Platform Admin, Editor,
Operator, and Viewer. Access policies map OIDC groups and users to roles. The appliance supports Keycloak, generic OIDC
providers, and local admin accounts for Day-0 bootstrap before an IdP is available.

### Observability

A tiered metrics pipeline collects cluster and VM performance data. An OpenTelemetry Collector gathers node-level
metrics and forwards them to the appliance for dashboard display. You can optionally connect an external
PromQL-compatible backend such as Prometheus for long-term historical data.

### Infrastructure Management

The appliance bundles KubeVirt, Containerized Data Importer (CDI), Multus CNI, a snapshot controller, and a descheduler
into a single deployment. You can manage storage classes, storage pools, network attachment definitions, and namespace
policies directly from the UI. A DaemonSet discovers block devices and hardware on each node for GPU and PCI
passthrough.

## Next Steps

1. Review the hardware requirements and follow the [Install Launchpad for VMs](./install-vmla-iso.md) guide to install
   the appliance on your devices and create your cluster.

2. Use the [Create Your First VM](./quick-start.md) guide to deploy your first VM from the management UI.
