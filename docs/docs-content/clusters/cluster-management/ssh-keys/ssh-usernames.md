---
sidebar_label: "SSH Usernames"
title: "SSH Usernames"
description:
  "A list of the Secure Shell (SSH) usernames created on Kubernetes nodes for each provider and operating system pack
  available in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 11
---

This page lists the Secure Shell (SSH) user names created on Kubernetes nodes, which vary by provider and operating
system.

These user names are relevant when using [SSH key pairs](./ssh-keys.md) with your Palette host clusters.

## Public Cloud

### Infrastructure Provider

| Provider       | Operating System Pack          | SSH Username |
| -------------- | ------------------------------ | ------------ |
| **AWS IaaS**   | **Ubuntu**                     | `ubuntu`     |
| **AWS IaaS**   | **CentOS**                     | `centos`     |
| **AWS IaaS**   | **Bring Your Own OS (BYO-OS)** | `root`       |
| **Azure IaaS** | **Ubuntu**                     | `ubuntu`     |
| **Azure IaaS** | **CentOS**                     | `centos`     |
| **Azure IaaS** | **Bring Your Own OS (BYO-OS)** | `root`       |
| **GCP IaaS**   | **Ubuntu**                     | `ubuntu`     |
| **GCP IaaS**   | **CentOS**                     | `centos`     |
| **GCP IaaS**   | **Bring Your Own OS (BYO-OS)** | `root`       |

### Managed Kubernetes

| Provider      | Operating System Pack          | SSH Username                                                                        |
| ------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| **AWS EKS**   | **Amazon EKS optimized Linux** | `ec2-user`                                                                          |
| **Azure AKS** | **Linux**                      | `azureuser`                                                                         |
| **GCP GKE**   | **Container-Optimized OS**     | Refer to the [SSH Configuration on GCP GKE](#ssh-configuration-on-gcp-gke) section. |

#### SSH Configuration on GCP GKE

It is not possible to configure GCP GKE clusters with an SSH key during cluster creation. If SSH access to your GCP GKE
nodes is critical, consider one of the following options:

- Configure project or node-level metadata to include your SSH key. Refer to
  [Predefined and custom metadata keys](https://cloud.google.com/compute/docs/metadata/overview#predefined-and-custom-metadata-keys)
  for guidance.

- Enable OS Login and associate your SSH key with your IAM identity. Refer to
  [How OS Login works](https://cloud.google.com/compute/docs/oslogin#how_os_login_works) for guidance.

## Data Center

| Provider           | Operating System Pack          | SSH Username |
| ------------------ | ------------------------------ | ------------ |
| **MAAS**           | **Ubuntu**                     | `ubuntu`     |
| **MAAS**           | **Bring Your Own OS (BYO-OS)** | `root`       |
| **Openstack**      | **Ubuntu**                     | `ubuntu`     |
| **Openstack**      | **Bring Your Own OS (BYO-OS)** | `root`       |
| **VMware vSphere** | **Ubuntu**                     | `ubuntu`     |
| **VMware vSphere** | **CentOS**                     | `centos`     |
| **VMware vSphere** | **Bring Your Own OS (BYO-OS)** | `root`       |

## Edge

This is dependent on the operating system you provide for your edge hosts using either
[Agent Mode](../../../deployment-modes/agent-mode/agent-mode.md) or
[EdgeForge](../../../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md).

## Resources

- [SSH Keys](./ssh-keys.md)
- [Deploy a Cluster (Public Cloud)](../../public-cloud/deploy-k8s-cluster.md)
- [Data Center Clusters](../../data-center/data-center.md)
- [Create Cluster Definition (Edge)](../../edge/site-deployment/cluster-deployment.md)
