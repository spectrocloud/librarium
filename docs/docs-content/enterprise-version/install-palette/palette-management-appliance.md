---
title: "Palette Management Appliance"
sidebar_label: "Palette Management Appliance"
description: "Learn how to deploy self-hosted Palette to your environment using the Palette Management Appliance"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["palette management appliance", "self-hosted", "enterprise"]
sidebar_position: 20
---

:::preview

:::

The Palette Management Appliance is downloadable as an ISO file and is a solution for installing self-hosted Palette on
your infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is
used to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed, you can download pack bundles to create your cluster profiles. You will then be able to
deploy clusters in your environment.

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Security Technical
Implementation Guides (STIG). The following table displays the infrastructure profile for the self-hosted Palette
appliance.

| **Layer**      | **Component**                                                   |
| -------------- | --------------------------------------------------------------- |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) and STIG-hardened |
| **Kubernetes** | Palette Kubernetes (PXK): STIG-hardened                         |
| **CNI**        | Calico                                                          |
| **CSI**        | Piraeus                                                         |
| **Registry**   | Zot                                                             |

## Supported Platforms

The Palette Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Installation Steps

Follow the instructions to install Palette using the Palette Management Appliance on your infrastructure platform.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Install Palette

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="installation-steps-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Upload Packs to Palette

Follow the instructions to upload packs to your Palette instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy workload clusters in your
environment.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-packs-prereqs"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-packs-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-packs-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Next Steps

The following actions are recommended after installing Palette to ensure your environment is ready for use:

- Assign your SSL certificates to Palette. Palette is installed with a self-signed SSL certificate. To assign a
  different SSL certificate, upload the certificate, key, and certificate authority files to Palette. You can upload the
  files using the system console. Refer to the
  [Configure HTTPS Encryption](../system-management/ssl-certificate-management.md) page for instructions on how to
  upload the SSL certificate files to Palette.

- Create a tenant in Palette to host your users. Refer to the
  [Create a Tenant](../system-management/tenant-management.md) guide for instructions on how to create a tenant in
  Palette.

- Activate your Palette installation before the trial mode expires. Refer to the
  [Activate Palette](../activate-installation/activate-installation.md) guide for instructions on how to activate your
  installation.

- Create additional system administrator accounts and assign roles to users in the system console. Refer to the
  [Account Management](../system-management/account-management/account-management.md) guide for instructions on how to
  manage user accounts and roles in Palette.

- Configure SMTP settings to enable email notifications and password recovery. Refer to the
  [Configure SMTP Settings](../system-management/smtp.md) guide for instructions on how to configure SMTP settings in
  Palette.

For all system management options in Palette, refer to the
[System Management](../system-management/system-management.md) guide.
