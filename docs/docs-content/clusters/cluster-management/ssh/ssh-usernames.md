---
sidebar_label: "SSH Usernames"
title: "SSH Usernames"
description:
  "A list of the Secure Shell (SSH) usernames created on Kubernetes nodes for each provider and operating system (OS)
  pack available in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
---

This page lists the Secure Shell (SSH) user names created on Kubernetes nodes, which vary by provider and Operating
System (OS).

These user names are relevant when using [SSH key pairs](./ssh-keys.md) with your Palette host clusters.

## Public Cloud

Public Cloud includes both Infrastructure as a Service (IaaS) and Managed Kubernetes.

### Infrastructure Provider

| Provider       | OS Pack    | SSH Username |
| -------------- | ---------- | ------------ |
| **AWS IaaS**   | **Ubuntu** | `ubuntu`     |
| **AWS IaaS**   | **CentOS** | `centos`     |
| **Azure IaaS** | **Ubuntu** | `ubuntu`     |
| **Azure IaaS** | **CentOS** | `centos`     |
| **GCP IaaS**   | **Ubuntu** | `ubuntu`     |
| **GCP IaaS**   | **CentOS** | `centos`     |

### Managed Kubernetes

| Provider      | OS Pack                        | SSH Username                                                                        |
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

| Provider           | OS Pack    | SSH Username |
| ------------------ | ---------- | ------------ |
| **MAAS**           | **Ubuntu** | `ubuntu`     |
| **OpenStack**      | **Ubuntu** | `ubuntu`     |
| **VMware vSphere** | **Ubuntu** | `spectro`    |
| **VMware vSphere** | **CentOS** | `spectro`    |

## Edge

This is dependent on the OS you provide for your edge hosts using
[EdgeForge](../../../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md).

If using EdgeForge, you can also create custom users and assign SSH keys to them using cloud-init stages. Refer to
[Cloud Init Stages](../../edge/edge-configuration/cloud-init.md#assign-an-ssh-key) for an example.

## Bring Your Own OS

You can select **Bring Your Own OS (BYOOS)** as the OS pack for your cluster in Palette. The default SSH username will
depend on the OS image that you have built. Refer to [Bring Your Own OS (BYOOS)](../../../byoos/byoos.md) for further
guidance on building custom images.

- For images built using the [Kubernetes Image Builder](../../../byoos/image-builder.md), the SSH username is defined as
  the value for `ssh_username` in the corresponding OS JSON file. For example, the
  [Amazon Linux 2 JSON](https://github.com/kubernetes-sigs/image-builder/blob/main/images/capi/packer/ami/amazon-2.json#L11)
  sets the `ssh_username` value as `ec2-user`.

  If `ssh_username` is not defined in the OS JSON, then `root` is set by the **Bring Your Own OS (BYOOS)** pack.

- For images built for VMware vSphere, the SSH username is set to `spectro` by Palette.

## Resources

- [SSH Keys](./ssh-keys.md)
- [Getting Started](/getting-started/)
- [Data Center Clusters](../../data-center/data-center.md)
- [Create Cluster Definition (Edge)](../../edge/site-deployment/cluster-deployment.md)
