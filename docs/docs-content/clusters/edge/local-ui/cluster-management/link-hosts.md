---
sidebar_label: "Link Hosts"
title: "Link Hosts"
description: "Instructions for linking hosts to prepare for multi-node cluster creation."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

To create a multi-node cluster with hosts provisioned in the airgap installation mode, the hosts must first be able to
identify and securely communicate with each other. By default, hosts that are provisioned in the airgap installation
mode are not aware of each other even if they are on the same network, and they do not have the credentials to
communicate with each other securely.

![A diagram of the order of operations for linking hosts.](/clusters_edge_localui_cluster-mgmt_link-hosts.webp)

Host linking provides the hosts with the necessary network and security infrastructure to form a cluster together. In a
group of linked hosts, hosts can broadcast information to all its peers.

## Leader Hosts

To link hosts together, you designate one host as the leader. The leader host has two obligations:

- Generate tokens with its IP address and One-Time Password (OTP) credentials, which you can use to link other hosts as
  followers.
- Sync content bundles uploaded to the host and configuration changes made to the host to the rest of the cluster.

A group of linked hosts that have not formed a cluster only has one leader, where you can upload content bundles and
create a cluster.

Once a cluster is formed, every control plane node will be generating the pairing tokens and can act as the leader. When
you perform an action on any control plane node, that node will act as the leader and propagate the action to the rest
of the cluster. For example, if you upload a content bundle to a control plane node, the content bundle will be synced
from that node to the rest of the cluster, even if the control plane node was not the leader before a cluster is formed.
This design removes the need to memorize which host was the leader before forming a cluster.

When you [delete a cluster](../cluster-management/delete-cluster.md), all hosts will return to the **Ready** state, but
will remain linked. Since the group of hosts no longer have a cluster, they will only have one leader, which is the host
where you performed the delete action from.

## Link Hosts

Linked hosts will sync their status and uploaded content, including images for the Palette agent and provider images,
with each other.

### Limitations

- All hosts must be deployed in the same deployment mode. For more information, refer to
  [Deployment Modes](../../../../deployment-modes/deployment-modes.md).

- For hosts that are deployed in [agent mode](../../../../deployment-modes/agent-mode/agent-mode.md), all hosts must
  share the same Operating System (OS).

- You cannot update the IP address of a linked host.

### Prerequisites

- Two or more hosts deployed in the same deployment mode on the same network. For more information, refer to
  [Appliance Mode Installation](../../site-deployment/stage.md) or
  [Agent Mode Installation](../../../../deployment-modes/agent-mode/install-agent-host.md).

- The `stylus.enableMultiNode` parameter is set to `true` in your user data configuration for all your hosts. For more
  information, refer to [Prepare User Data](../../edgeforge-workflow/prepare-user-data.md) and
  [Installer Reference](../../edge-configuration/installer-reference.md).

- The `stylus.installationMode` parameter is set to `airgap` in your user data configuration for all your hosts.

- No follower host has any current cluster workloads. Refer to [Delete a Cluster](./delete-cluster.md) and
  [Unlink Hosts](#unlink-hosts) to learn how to delete a cluster and unlink a host to free it up for linking.

### Procedure

1. Decide on host that you plan to use as the leader of the group. Log in to
   [Local UI](../host-management/access-console.md) of that host.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click **Generate token**. This will make the host start generating tokens you will use to link this host with other
   hosts. The base-64 encoded token contains the IP address of the host, as well as an OTP that will expire in two
   minutes. Once a token expires, the leader generates another token automatically.

   If you have already made the

4. Click the **Copy** button to copy the token.

5. Log in to [Local UI](../host-management/access-console.md) on the host that you want to link to the leader host.

6. From the left **Main Menu**, click **Linked Edge Hosts**.

7. Click **Link this device to another**.

8. In the pop-up box that appears, enter the token you copied from the leader host.

9. Click **Confirm**.

10. Repeat this process for every host you want to link to the leader host.

### Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader host.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that all hosts you linked together show up in the **Linked Edge Hosts** table.

## Unlink Hosts

You can unlink a host to either link it to another host or to use it for independent workloads. You can only unlink a
follower host. Once all follower hosts have been unlinked, you can
[remove its leader status](#remove-leader-node-status) and link it to another host.

You can unlink a follower host on the follower host itself or from the leader host.

### Prerequisites

- Two or more linked hosts.

- [Access to Local UI](../host-management/access-console.md) on the host you want to unlink or on the leader host.

- The host you want to unlink cannot be in-use by a cluster. If you want to remove a node from your cluster and then
  unlink it, you must first scale down the cluster. Once the host is in **Ready** state instead of **In-Use**, you can
  proceed to unlink it. For more information, refer to [Scale Down a Cluster](./scale-cluster.md#scale-down-a-cluster).

### Procedure

<Tabs>

<TabItem value="From Leader Host">

1. Log in to Local UI on the leader host.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. In the list of linked hosts, identify the host you want to unlink and click the **three-dot button** next to the IP
   address of the host.

4. Click **Unlink**.

5. Click **Confirm**

</TabItem>

<TabItem value="On Follower Host">

1. Log in to Local UI on the host you want to unlink.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click **Unlink** in the upper-right corner of the **Linked Edge Hosts** page.

4. Click **Confirm**

</TabItem>

</Tabs>

### Validate

1. Log in to Local UI on the host you unlinked.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that the host has been unlinked from the leader and is ready to be paired with another host.

## Remove Leader Node Status

Removing the leader host status of a host allows you to link the host to another group of linked hosts as a follower.
You can only do this when the host is not part of an active cluster.

### Prerequisites

- Access to Local UI on a host that generates pairing tokens.

- The host is not linked with any other host. If your host is still linked with other hosts, you must unlink all its
  follower hosts.

### Procedure

1. Log in to Local UI.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click the red **Stop token generation** button to stop the host from generating pairing tokens. This will make it
   ready to be paired with other hosts again as a follower.

### Validate

1. Log in to Local UI.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that the host is no longer generating pairing tokens and can be linked to another host as a follower.
