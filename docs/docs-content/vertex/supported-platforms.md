---
sidebar_label: "Supported Platforms"
title: "Supported Platforms"
description: "Review the supported platforms for deploying Kubernetes clusters with Palette VerteX."
hide_table_of_contents: false
sidebar_position: 20
tags: ["vertex"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX supports the following infrastructure platforms for deploying Kubernetes clusters:

| **Platform**       | **Additional Information**                                                |
| ------------------ | ------------------------------------------------------------------------- |
| **AWS**            | Refer to the [AWS](#aws) section for additional guidance.                 |
| **AWS Gov**        | Refer to the [AWS](#aws) section for additional guidance.                 |
| **Azure**          | Refer to the [Azure](#azure) section for additional guidance.             |
| **Azure Gov**      | Refer to the [Azure](#azure) section for additional guidance.             |
| **MAAS**           | Canonical Metal-As-A-Service (MAAS) is available and supported in VerteX. |
| **Edge**           | Edge deployments are supported in VerteX.                                 |
| **VMware vSphere** | VMware vSphere is supported in VerteX.                                    |

Review the following tables for additional information about the supported platforms.

:::info For guidance on how to deploy a Kubernetes cluster on a supported platform, refer to the
[Cluster](../clusters/clusters.md) documentation.

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

All Azure Government regions are supported with the exception of Department of Defense regions. Refer to the
[official Azure Government documentation](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-overview-dod)
to learn more about the available regions.

#### VMware vSphere

The following versions of VMware vSphere are supported in VerteX.

| **Version**     | **Supported?** |
| --------------- | -------------- |
| **vSphere 6.7** | ✅             |
| **vSphere 7.0** | ✅             |
| **vSphere 8.0** | ✅             |
