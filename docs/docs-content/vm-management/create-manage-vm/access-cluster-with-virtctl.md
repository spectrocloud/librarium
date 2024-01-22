---
sidebar_label: "Access VM Cluster with virtctl"
title: "Set up virtctl"
description: "Set up KubeVirt virtctl to facilitate VM operations in Palette Virtual Machine Orchestrator"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---

The virtctl command-line interface (CLI) tool facilitates some of the virtual machine (VM) operations you will perform
by providing convenient commands for copying and pasting into the virtual console, starting and stopping VMs, live
migrating VMs, and uploading VM disk images.

The virtctl CLI also provides a lightweight Secure Copy Protocol (SCP) client with the `virtctl scp` command, which you
can use to transfer files to and from a VM. Its usage is similar to the ssh command.

## Prerequisites

- An active virtual cluster with Palette Virtual Machine Orchestrator (VMO).

- Access to the virtual cluster.

## Download and Connect virtctl

1. Download the most recent virtctl artifact based on your machine type from the official
   [KubeVirt Assets](https://github.com/kubevirt/kubevirt/releases/tag/v0.60.0-alpha.0). Scroll down to the **Assets**
   section.

2. Assign the execute permission to the virtctl command.

<br />

```shell
chmod +x virtctl
```

<br />

3. Next, log in to [Palette](https://console.spectrocloud.com) to connect your host cluster with the virtctl CLI.

4. Navigate to the left **Main Menu** and select **Clusters**.

5. Select the cluster you want to connect to.

6. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes
   Config File** row.

7. Click on the kubeconfig link to download the file.

8. Open a terminal window and set the KUBECONFIG environment variable to the file path of the kubeconfig file.

   Example:

```shell
export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig
```

{" "}

<br />

9. Issue the `virtctl ssh <virtual_machinename>` or `virtctl vnc <virtual_machinename>` command to display the login
   screen.

   Example:

```shell
virtctl ssh ubuntu
```

{" "}

<br />

You can now issue virtctl commands against the VM in your Kubernetes cluster.

## Validate

Verify you have access to your virtual machine by issuing virtctl commands against it, as shown in the example below.

<br />

```bash
virtctl guestosinfo
```
