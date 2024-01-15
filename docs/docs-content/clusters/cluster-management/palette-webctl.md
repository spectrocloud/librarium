---
sidebar_label: "Kubectl"
title: "Kubectl"
description: "Learn how to access your Kubernetes cluster with the kubectl CLI."
hide_table_of_contents: false
sidebar_position: 160
tags: ["clusters", "cluster management", "kubectl"]
---

You can access your Kubernetes cluster by using the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/). Palette automatically generates a **kubeconfig** file for your cluster that you can download and use to connect with your host cluster.

## Access Cluster with CLI

Use the following steps to connect to your host cluster with the kubectl CLI.

:::info

If you are using Palette Virtual Machine (VM) Management, you can find steps on how to connect to your virtual machines with the [virtctl CLI](https://kubevirt.io/user-guide/operations/virtctl_client_tool/) in the [Access VM Cluster with virtctl](../../vm-management/create-manage-vm/access-cluster-with-virtctl.md) guide. The virtctl CLI facilitates some of the VM operations you will perform, such as copying, pasting, or transferring files to and from a virtual machine using Secure Copy Protocol (SCP).

:::

### Prerequisites

- Kubectl installed locally. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) for additional guidance.

- A host cluster that is either publicly accessible OR a private host cluster that has the [Spectro Proxy](../../integrations/frp.md) installed.

:::caution

If you are using [OIDC](/clusters/cluster-management/cluster-rbac#userbacwithoidc) with your host cluster, you will need the kubelogin plugin. Refer to the kubelogin GitHub repository [README](https://github.com/int128/kubelogin#setup) for installation guidance.

:::

### Set up Kubectl

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you want to access.

4. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes Config File** row.

5. Click on the kubeconfig link to download the file.

![Arrow pointing to the kubeconfig file](/clusters_cluster-management_palette-webctl_cluster-details-overview.png)

6. Open a terminal window and set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file.

Example:

```shell
export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig
```

You can now issue kubectl commands against your host cluster.

### Validate

Verify you have access to your host cluster by issuing kubectl commands against it.

<!-- # Overview

Palette leverages Kubectl through an in-built command line interface for the users to communicate with their workload clusters. This enables our users to deploy applications, inspect and manage cluster resources, and view logs using the Palette terminal without an external terminal.

# Usage Scenarios

* Cluster Access
* Cluster access with OIDC Authentication enabled
* Cluster access with Spectro Proxy
* CLI-Based Cluster Access

## Cluster Access

For general scenario, a user can connect to the cluster directly as below:

<br/>

1. Launch a cluster from the `Project Admin` Console.


2. Go the the `Cluster Details` page


3. Click the `Connect` button available at the `Kubernetes Config File.`


4. Wait for the terminal to be launched and start communicating to the cluster using the `kubectl` commands.


## Cluster Access with OIDC Authentication Enabled

Cluster access with OIDC authentication enables the clients to verify the end user's identity before establishing cluster connectivity. The user needs to establish an OIDC-based authentication to the cluster through an identity provider of their choice. To establish cluster access with OIDC authentication, follow the steps below:

<br/>

1. Connfigure the OIDC provider callback or redirect url to use the following URL: `https://console.spectrocloud.com/v1/shelly/oidc/callback`


2. Launch a cluster from the **Project** scope and enable cluster OIDC.

	**Note:** To enable OIDC, the user can use the Spectro RBAC Add-on or the Kubernetes YAML file.


3. Go the the **Cluster Details** page.


4. Click the **Connect** button by the **Kubernetes Config File**


5. Wait for the terminal to be launched.


6. Once the terminal is launched, give a kubectl command to obtain the console endpoint.


7. Copy the endpoint on the terminal, open a browser window, and provide your OIDC credentials.


8. After successful login to the page, get back to the terminal and start communicating to the cluster using the `kubectl` commands.

## Cluster Access with Spectro Proxy

Palette users can attach [Spectro Proxy](/integrations/frp/) pack to the cluster profile while profile creation. This installs the FRP client to the workload clusters and configures it with an FRP server to establish external connectivity for private clusters. To establish cluster access with Spectro Proxy (Forward Reverse Proxy), follow the steps below:

<br/>

1. Launch a cluster from the ‘Project Admin’ Console.
**Note:** The cluster profile must have an attached Spectro Proxy add-on pack.


2. Go the the `Cluster Details` page.


3. Click the ‘Connect’ button at the ‘Kubernetes Config File.’


4. Wait for the terminal to be launched.


5. Once the terminal launch, give the following command:

```
kubectl config set-cluster <CLUSTER_NAME> --insecure-skip-tls-verify=true
```


6. This establishes the connectivity between the workload cluster and external API. Now the user can start communicating to the cluster using the ‘kubectl’ commands.

:::info

While creating EKS clusters with a **Private** endpoint, adding a proxy pack is mandatory for establishing Palette Web kubectl connectivity.

:::


## CLI-Based Cluster Access

The users can establish connectivity for public clusters via the public cloud CLI. To establish the CLI-based cluster access, follow the steps below:

<br />

1. Launch a cluster from the `Project Administrator` Console.


2. Go the the `Cluster Details` page.


3. Click the `Connect` button available at the `Kubernetes Config File.`


4. Wait for the terminal to be launched. Once the terminal is launched, configure the `Public Cloud CLI`.

 **Example:**
For AWS clusters, the CLI can be configured using the below command and authenticate using the AWS console credentials like Access key and Secret key.

<br />

  ```
  		aws configure
  ```


5. Once the configuration is done, start communicating to the cluster using the ‘kubectl’ commands.



 -->
