---
sidebar_label: "Amazon EKS Distro"
title: "Kubernetes with Spectro Cloud"
description: "EKS-D packs in Spectro Cloud"
hiddenFromNav: true
type: "integration"
category: ["kubernetes"]
logoUrl: "https://registry.spectrocloud.com/v1/kubernetes-eksd/blobs/sha256:5790ca7040999e2f9371163a319cda652ed1e32139bcb9c6fb32a0152d9f48fb?type=image/png"
---

# Amazon EKS Distro

Amazon EKS-D allows for the manual deployment of secure and reliable workload clusters, free from constant testing and
tracking for dependencies, security patches, and updates of Kubernetes. EKS-D provisions clusters with consistent
versions of Kubernetes and dependencies of Amazon EKS. The deployment of EKS-D is standardized enough to build your
Kubernetes cluster on any public, private or on-prem platform. Once the community support for Kubernetes versions
expires, Amazon takes care of the version control including the latest security patches. With EKS-D, users enjoy
benefits such as secure Docker images, back-ported security fixes, and a single upstream vendor.

## Provision and Manage Amazon EKS Distro (EKS-D) with Spectro Cloud

Spectro Cloud leverages EKS-D services to customers as a platform of their choice. We support easy provisioning and
management of EKS-D services for on-premises as well as for public cloud platforms such as:

- vSphere Cloud Provider (vSphere)
- Amazon Web Services (AWS)
- Microsoft Azure (Azure)
- Google Cloud Platform (GCP)
- Metal as a Service (MaaS)
- OpenStack Cloud

We have made the usage of EKS-D easy by incorporating it as integration within the Spectro Cloud pack. At the click of a
button, EKS-D is brought to use while creating a Spectro Cloud-specific cluster profile. Once the cluster profile is
created, users can deploy EKS-D based Kubernetes clusters through the Spectro Cloud console.

![eksd-cluster-profile](/eksd-cluster-profile.png)

![eksd-cluster](/eksd-cluster.png)

## Why EKS-D with Spectro Cloud

Spectro Cloud fosters the tenant EKS-D clusters with add-on features such as authorization, monitoring, logging, load
balancing, and more. The extensive platform support that Spectro Cloud provides to its customers makes EKS-D with
Spectro Cloud highly flexible. We provide isolation to the EKS-D tenant clusters by virtue of projects and RBAC.

|                      | Spectro Add-On Packs |
| -------------------- | -------------------- |
| Deployment specifics | Logging              |
|                      | Monitoring           |
|                      | Security             |
|                      | Authentication       |
|                      | Service Mesh         |
|                      | Load Balancer        |
|                      | Ingress              |
|                      | Service Mesh         |
|                      | Helm Charts          |
|                      | Registries           |

|              | Spectro EKS-D Platform Support   |
| ------------ | -------------------------------- |
| Public Cloud | Amazon Web Services (AWS)        |
|              | Microsoft Azure (Azure)          |
|              | Google Cloud Platform (GCP)      |
| On-Premises  | vSphere Cloud Provider (vSphere) |
|              | OpenStack Cloud                  |
|              | Metal-as-a-Service Cloud (MaaS)  |

|         | Resource Isolation                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| Project | Users and teams with specific roles can be associated with the project.                                                     |
|         | The project helps to organize the cluster resources in a logical grouping                                                   |
| RBAC    | Role-Based Access Control.                                                                                                  |
|         | This is a method that allows the same user to have a different type of access control based on the resource being accessed. |

## Supported EKS-Distro Versions

<Tabs>
<TabItem label="1.21.x" value="EKS-D_v1.21">

- **v1-21-eks-4 **

</TabItem>
<TabItem label="1.20.x" value="EKS-D_v1.20">

- **v1-20-eks-6 **

</TabItem>

<TabItem label="1.18.x" value="EKS-D_v1.18">

- **1.18.9-eks-1-18-1**

</TabItem>

</Tabs>

## Reference

https://aws.amazon.com/eks/eks-distro
