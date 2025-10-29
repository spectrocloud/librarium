---
sidebar_label: "Palette VerteX"
title: "Self-Hosted Palette VerteX"
description: "Learn how Palette VerteX enables regulated industries to meet stringent security requirements."
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "vertex"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX offers regulated industries, such as government and public sector organizations that handle sensitive and
classified information simplicity, security, and scale in production Kubernetes. VerteX is available as a self-hosted
platform offering that you can install in your data centers or public cloud providers to manage Kubernetes clusters.

## FIPS-Compliant

Palette VerteX integrates validated Federal Information Processing Standards (FIPS) 140-3 cryptographic modules in
Kubernetes clusters it deploys to ensure robust data protection for your organization’s infrastructure and applications.

To learn more about our FIPS 140-3 certification, review
[Spectro Cloud Cryptographic Module](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/5061).
FIPS modules, which are accessible in our private artifact repository, extend Palette’s existing security features that
include security scans, powerful RBAC, and tamper-proof edge device images. Palette VerteX protects sensitive data in
clusters across edge, bare metal, on-prem data centers, air-gapped environments, and cloud.

To learn more about FIPS in Palette VerteX, check out the [FIPS](./fips.md) section.

## Supported Platforms

:::danger

The [following section](#content-to-be-refactored) contains the content from the former VerteX
[Supported Platforms](https://docs.spectrocloud.com/vertex/supported-platforms/) page. Refactor this content to be a
partial and use a table similar to the following to compare and contrast support between the platforms.

:::

| **Azure Cloud**                                                                                | **Palette Support** | **Palette VerteX Support** |
| ---------------------------------------------------------------------------------------------- | :-----------------: | :------------------------: |
| Azure Commercial (Public Cloud)                                                                | :white_check_mark:  |     :white_check_mark:     |
| [Azure Government](https://azure.microsoft.com/en-us/explore/global-infrastructure/government) | :white_check_mark:  |     :white_check_mark:     |

### Content to be Refactored

Palette VerteX supports the following infrastructure platforms for deploying Kubernetes clusters:

| **Platform**       | **Additional Information**                                                |
| ------------------ | ------------------------------------------------------------------------- |
| **AWS**            | Refer to the [AWS](#aws) section for additional guidance.                 |
| **AWS Gov**        | Refer to the [AWS](#aws) section for additional guidance.                 |
| **AWS Secret**     | Refer to the [AWS](#aws) section for additional guidance.                 |
| **Azure**          | Refer to the [Azure](#azure) section for additional guidance.             |
| **Azure Gov**      | Refer to the [Azure](#azure) section for additional guidance.             |
| **Dev Engine**     | Refer to the VerteX Engine section for additional guidance.               |
| **MAAS**           | Canonical Metal-As-A-Service (MAAS) is available and supported in VerteX. |
| **Edge**           | Edge deployments are supported in VerteX.                                 |
| **VMware vSphere** | VMware vSphere is supported in VerteX.                                    |

Review the following tables for additional information about the supported platforms.

:::info

For guidance on how to deploy a Kubernetes cluster on a supported platform, refer to the
[Cluster](../../clusters/clusters.md) documentation.

:::

The term _IaaS_ refers to Palette using compute nodes that are not managed by a cloud provider, such as bare metal
servers or virtual machines.

#### AWS

VerteX supports the following AWS services.

| **Service** | **AWS Gov Support?** |
| ----------- | -------------------- |
| **IaaS**    | ✅                   |
| **EKS**     | ✅                   |

#### Azure

VerteX supports the following Azure services.

| **Service** | **Azure Gov Support?** |
| ----------- | ---------------------- |
| **IaaS**    | ✅                     |
| **AKS**     | ✅                     |

All Azure Government regions are supported with the exception of Department of Defense regions. Refer to the
[official Azure Government documentation](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-overview-dod)
to learn more about the available regions.

#### Dev Engine

VerteX supports the [Dev Engine](../../devx/devx.md) platform for deploying virtual clusters. However, the Dev Engine
platform is not FIPS compliant and requires you to enable the [non-FIPS setting](./fips.md#enable-non-fips-components).
Additionally, container deployment based workflows are not supported for airgap environments.

#### VMware vSphere

The following versions of VMware vSphere are supported in VerteX.

| **Version**       | **Supported?** |
| ----------------- | -------------- |
| **vSphere 6.7U3** | ✅             |
| **vSphere 7.0**   | ✅             |
| **vSphere 8.0**   | ✅             |

## Access Palette VerteX

To set up a Palette VerteX account, contact our support team by sending an email to support@spectrocloud.com. Include
the following information in your email:

- Your full name
- Organization name (if applicable)
- Email address
- Phone number (optional)
- Target Platform (VMware or Kubernetes)
- A brief description of your intended use of VerteX

Our dedicated support team will promptly get in touch with you to provide the necessary assistance and share the
installer image, credentials, and an endpoint URL to access the FIPS registry.
