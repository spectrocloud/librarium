---
sidebar_label: "SSH Usernames"
title: "SSH Usernames"
description: "A list of the Secure Shell (SSH) usernames created for each provider type on Kubernetes nodes."
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

| Provider       | Operating System | SSH Username |
| -------------- | ---------------- | ------------ |
| **AWS IaaS**   | TBC              | TBC          |
| **Azure IaaS** | TBC              | TBC          |
| **GCP IaaS**   | TBC              | TBC          |

### Managed Kubernetes

| Provider          | Operating System                     | SSH Username |
| ----------------- | ------------------------------------ | ------------ |
| **AWS EKS**       | **Amazon EKS optimized Linux 1.0.0** | `ec2-user`   |
| **Azure AKS**     | **Linux 22.04**                      | `azureuser`  |
| **GCP GKE**       | **Container-Optimized OS**           | N/A          |
| **TKE** (Tencent) | TBC                                  | TBC          |

:::info

It is not possible to configure GCP GKE clusters with an SSH key during cluster creation. If SSH access to your GCP GKE nodes is critical, consider one of the following options:

- Configure project or node-level metadata to include your SSH key. Refer to [Predefined and custom metadata keys](https://cloud.google.com/compute/docs/metadata/overview#predefined-and-custom-metadata-keys) for guidance.

- Enable OS Login and associate your SSH key with your IAM identity. Refer to [How OS Login works](https://cloud.google.com/compute/docs/oslogin#how_os_login_works) for guidance.

- Customize startup scripts or metadata to add your SSH key during node creation in a managed instance group. Refer to [Using startup scripts on Linux VMs](https://cloud.google.com/compute/docs/instances/startup-scripts/linux) for guidance.

:::

## Data Center

| Provider       | Operating System | SSH Username |
| -------------- | ---------------- | ------------ |
| MAAS           | TBC              | TBC          |
| Openstack      | TBC              | TBC          |
| VMware vSphere | TBC              | `spectro`    |

## Edge

| Provider    | SSH Username |
| ----------- | ------------ | --- |
| Edge Native | TBC          | TBC |

## Resources

- [SSH key pairs](../clusters/cluster-management/ssh-keys.md)
- [Deploy a Cluster (Public Cloud)](../clusters/public-cloud/deploy-k8s-cluster.md)
- [Data Center Clusters](../clusters/data-center/data-center.md)
- [Create Cluster Definition (Edge)](../clusters/edge/site-deployment/cluster-deployment.md)
