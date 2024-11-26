---
sidebar_label: "Link Hosts"
title: "Link Hosts"
description: "Instructions for linking hosts to prepare for multi-node cluster creation."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

To create a multi-node cluster with hosts provisioned in `airgap` installation mode, the hosts must first be able
identify and securely communicate with each other. By default, hosts that are provisioned in `airgap` installation mode
are not aware of each other even if they are on the same network, and they do not have the credentials to communicate
with each other securely.

Host linking provides the hosts with the necessary network and security infrastructure to form a cluster together. In a
group of linked hosts, hosts can broadcast information to all its peers. Every group has a leader node, which provides
tokens with its IP and a One-Time Password (OTP) credentials encrypted that you can use to link other nodes.

![A diagram of the order of operations for linking hosts.](/clusters_edge_localui_cluster-mgmt_link-hosts.webp)

Linked hosts will sync uploaded content, including images for the Palette agent, provider images, and host status, with
each other. In a group of linked hosts that have not formed a cluster, only the leader node has access to functionality
such as change host settings, upload content, and create clusters. Once a cluster is created, only the control plane
nodes have access to features such as cluster management and can change host settings. Once a cluster is formed, all
control plane nodes will be considered leader nodes.

## Link Hosts

### Limitations

- All hosts must be deployed in the same deployment mode. For more information, refer to
  [Deployment Modes](../../../../deployment-modes/deployment-modes.md).

- For hosts that are deployed in agent mode, all hosts must share the same Operating System (OS).

- You cannot update the IP address of a linked node.

### Prerequisites

- Two or more hosts deployed in the same deployment mode on the same network. For more information, refer to
  [Appliance Mode Installation](../../site-deployment/stage.md) or
  [Agent Mode Installation](../../../../deployment-modes/agent-mode/install-agent-host.md).

- All hosts must be idle. They cannot have any current cluster workloads, or are linked to another node. Refer to
  [Delete a Cluster](./delete-cluster.md) and [Unlink Hosts](#unlink-hosts) to learn how to delete a cluster and unlink
  a host to free it up for linking.

### Procedure

1. Decide on a node that you plan to use as the leader of the group. Log in to
   [Local UI](../host-management/access-console.md) of that node.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click **Generate token**. This will generate a token you will use to link this host with other hosts. The base-64
   encoded token contains the IP address of the node, as well as an OTP that will expire in two minutes.

4. Click the **Copy** button to copy the token.

5. Log in to [Local UI](../host-management/access-console.md) on the node that you want to link to the leader node.

6. From the left **Main Menu**, click **Linked Edge Hosts**.

7. Click **Link this device to another**.

8. In the pop-up box that appears, enter the token you coped from the leader node.

9. Click confirm.

10. Repeat this process for every node you want to link to the leader node.

### Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader node.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that all nodes you linked together show up in the **Linked Edge Hosts** table.

## Unlink Hosts

You can unlink a host to either link it to another host or to use it for independent workloads. You can only unlink a
follower host. Once all follower hosts have been unlinked, the leader host is automatically unlinked as long as it is
not already in use by an existing cluster.

You can unlink a follower host on the follower host itself or from the leader node.

### Prerequisites

- Two or more linked hosts.

- [Access to Local UI](../host-management/access-console.md) on the host you want to unlink or on the leader host.

- The host you want to unlink cannot be in-use by a cluster. If you want to remove a node from your cluster and then
  unlink it, you must first scale down the cluster. Once the host is in **Ready** state instead of **In-Use**, you can
  proceed to unlink it. For more information, refer to [Scale Down a Cluster](./scale-cluster.md#scale-down-a-cluster).

### Procedure

<Tabs>

<TabItem value="From Leader Node">

1. Log in to Local UI on the leader node to which the node you want to unlink is paired.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. In the list of linked nodes, identify the node you want to unlink and click the **three-dot button** next to the IP
   address of the node.

4. Click **Unlink**.

5. Click **Confirm**

</TabItem>

<TabItem value="On Follower Node">

1. Log in to Local UI on the node you want to unlink.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click **Unlink** in the upper-right corner of the **Linked Edge Hosts** page.

4. Click **Confirm**

</TabItem>

</Tabs>

### Validate

1. Log in to Local UI on the node you unlinked.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that the node has been unlinked from the leader and is ready to be paired with another node.

## Remove Leader Node Status

If you have made a host the leader of a group of linked hosts, but later want to link it to another leader node, you
must first remove its leader node status.

### Prerequisite

- Access to Local UI on a host that generates pairing tokens.

- The host is not linked with any other host. If your host is still linked with other hosts, you must unlink all its
  follower nodes.

### Procedure

1. Log in to Local UI.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click the red **Stop token generation** button to stop the host from generating pairing tokens. This will make it
   ready to be paired with other nodes again as a follower.

### Validate

1. Log in to Local UI.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that the host is no longer generating pairing tokens and can be linked to another host as a follower.
