---
sidebar_label: "Kubectl"
title: "Kubectl"
description: "Learn how to access your Kubernetes cluster with the kubectl CLI."
hide_table_of_contents: false
sidebar_position: 160
tags: ["clusters", "cluster management", "kubectl"]
---

You can access your Kubernetes cluster by using the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/).
Palette automatically generates a **kubeconfig** file for your cluster that you can download and use to connect with
your host cluster.

## Access Cluster with CLI

Use the following steps to connect to your host cluster with the kubectl CLI.

:::info

If you are using Palette Virtual Machine (VM) Management, you can find steps on how to connect to your virtual machines
with the [virtctl CLI](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) in the
[Access VM Cluster with virtctl](../../vm-management/create-manage-vm/access-cluster-with-virtctl.md) guide. The virtctl
CLI facilitates some of the VM operations you will perform, such as copying, pasting, or transferring files to and from
a virtual machine using Secure Copy Protocol (SCP).

:::

### Prerequisites

- Kubectl installed locally. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) for additional
  guidance.

- A host cluster that is either publicly accessible OR a private host cluster that has the
  <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> installed.

:::warning

If you are using [OIDC](./cluster-rbac.md) with your host cluster, you will need the kubelogin plugin. Refer to the
kubelogin GitHub repository [README](https://github.com/int128/kubelogin#setup) for installation guidance.

:::

### Set up Kubectl

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you want to access.

4. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes
   Config File** row.

5. Click on the kubeconfig link to download the file.

![Arrow pointing to the kubeconfig file](/clusters_cluster-management_palette-webctl_cluster-details-overview.webp)

6. Open a terminal window and set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file.

Example:

```shell
export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig
```

You can now issue kubectl commands against your host cluster.

### Validate

Verify you have access to your host cluster by issuing kubectl commands against it.
