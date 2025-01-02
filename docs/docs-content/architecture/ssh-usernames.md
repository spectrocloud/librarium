---
sidebar_label: "SSH Usernames"
title: "SSH Usernames"
description:
  "A list of the Secure Shell (SSH) usernames created on Kubernetes nodes for each provider and operating system pack
  available in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
---

This page lists the Secure Shell (SSH) user names created on Kubernetes nodes, which vary by provider and operating
system.

These user names are relevant when deploying [SSH key pairs](../clusters/cluster-management/ssh-keys.md) to your
Kubernetes cluster through Palette.

## Public Clouds

### Infrastructure Provider

| Provider       | Operating System Pack | SSH Username |
| -------------- | --------------------- | ------------ |
| **AWS IaaS**   | **Ubuntu**            | `ubuntu`     |
| **AWS IaaS**   | **CentOS**            | `centos`     |
| **Azure IaaS** | **Ubuntu**            | `ubuntu`     |
| **Azure IaaS** | **CentOS**            | `centos`     |
| **GCP IaaS**   | **Ubuntu**            | `ubuntu`     |
| **GCP IaaS**   | **CentOS**            | `centos`     |

### Managed Kubernetes

| Provider      | Operating System Pack          | SSH Username |
| ------------- | ------------------------------ | ------------ |
| **AWS EKS**   | **Amazon EKS optimized Linux** | `ec2-user`   |
| **Azure AKS** | **Linux**                      | `azureuser`  |
| **GCP GKE**   | **Container-Optimized OS**     | N/A          |

#### SSH Configuration on GCP GKE

It is not possible to configure GCP GKE clusters with an SSH key during cluster creation. If SSH access to your GCP GKE
nodes is critical, consider one of the following options:

- Configure project or node-level metadata to include your SSH key. Refer to
  [Predefined and custom metadata keys](https://cloud.google.com/compute/docs/metadata/overview#predefined-and-custom-metadata-keys)
  for guidance.

- Enable OS Login and associate your SSH key with your IAM identity. Refer to
  [How OS Login works](https://cloud.google.com/compute/docs/oslogin#how_os_login_works) for guidance.

- Customize startup scripts or metadata to add your SSH key during node creation in a managed instance group. Refer to
  [Using startup scripts on Linux VMs](https://cloud.google.com/compute/docs/instances/startup-scripts/linux) for
  guidance.

## Data Center

| Provider       | Operating System Pack | SSH Username |
| -------------- | --------------------- | ------------ |
| MAAS           | **Ubuntu**            | `ubuntu`     |
| Openstack      | **Ubuntu**            | `ubuntu`     |
| VMware vSphere | **Ubuntu**            | `ubuntu`     |
| VMware vSphere | **CentOS**            | `centos`     |

## Edge

This is dependent on the operating system you provide for your edge hosts and cannot be predetermined.

Your edge hosts are built by using one of the following methods:

- [Agent Mode](../deployment-modes/agent-mode/agent-mode.md)
- [Provider images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md)

## Resources

- [SSH key pairs](../clusters/cluster-management/ssh-keys.md)
- [Deploy a Cluster (Public Cloud)](../clusters/public-cloud/deploy-k8s-cluster.md)
- [Data Center Clusters](../clusters/data-center/data-center.md)
- [Create Cluster Definition (Edge)](../clusters/edge/site-deployment/cluster-deployment.md)
