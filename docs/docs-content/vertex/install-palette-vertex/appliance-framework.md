---
title: "Appliance Framework for Palette VerteX"
sidebar_label: "Appliance Framework"
description: "Learn how to deploy Palette VerteX to your environment using the Appliance Framework"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["appliance framework", "self-hosted", "vertex"]
sidebar_position: 0
---

The Appliance Framework is downloadable as an ISO file and is a solution for installing Palette VerteX on your
infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is used
to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette VerteX has been installed, you can download pack bundles to create your cluster profiles. You will then be
able to deploy clusters in your environment.

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Federal
Information Processing Standards (FIPS) and Security Technical Implementation Guides (STIG). The following table
displays the infrastructure profile for the Palette VerteX appliance.

| **Layer**      | **Component**                                              |
| -------------- | ---------------------------------------------------------- |
| **OS**         | Ubuntu: Immutable Kairos, STIG-hardened and FIPS compiled. |
| **Kubernetes** | Palette Kubernetes (PXK): STIG-hardened and FIPS compiled. |
| **CNI**        | Calico: FIPS compiled.                                     |
| **CSI**        | Piraeus                                                    |
| **Registry**   | Zot: FIPS compiled.                                        |

## Supported Platforms

The Appliance Framework Palette VerteX ISO can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Installation Steps

Follow the instructions to install Palette VerteX using the Appliance Framework ISO on your infrastructure platform.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

### Install Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="installation-steps-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

## Upload Packs to Palette VerteX

Follow the instructions to upload packs to your Palette VerteX instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy clusters in your environment.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-packs-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-packs-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-packs-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
/>

## Next Steps

The following actions are recommended after installing Palette VerteX to ensure your environment is ready for use:

- Assign your SSL certificates to Palette VerteX. Palette VerteX is installed with a self-signed SSL certificate. To
  assign a different SSL certificate, upload the certificate, key, and certificate authority files to Palette VerteX.
  You can upload the files using the system console. Refer to the
  [Configure HTTPS Encryption](../system-management/ssl-certificate-management.md) page for instructions on how to
  upload the SSL certificate files to Palette VerteX.

- Create a tenant in Palette VerteX to host your users. Refer to the
  [Create a Tenant](../system-management/tenant-management.md) guide for instructions on how to create a tenant in
  Palette VerteX.

- Activate your Palette VerteX installation before the trial mode expires. Refer to the
  [Activate Palette VerteX](../activate-installation/activate-installation.md) guide for instructions on how to activate
  your installation.

- Create additional system administrator accounts and assign roles to users in the system console. Refer to the
  [Account Management](../system-management/account-management/account-management.md) guide for instructions on how to
  manage user accounts and roles in Palette VerteX.

- Configure SMTP settings to enable email notifications and password recovery. Refer to the
  [Configure SMTP Settings](../system-management/smtp.md) guide for instructions on how to configure SMTP settings in
  Palette VerteX.

For all system management options in Palette VerteX, refer to the
[System Management](../system-management/system-management.md) guide.
