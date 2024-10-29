---
sidebar_label: "Link Hosts"
title: "Link Hosts"
description: "Instructions for linking hosts to prepare for multi-node cluster creation."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

To provision a multi-node cluster with hosts are provisioned in `airgap` installation mode, the hosts must first be able
identify and securely communicate with each other. By default, hosts that are provisioned in `airgap` installation mode
are not aware of each other even if they are on the same network, and they do not have the credentials to communicate
with each other securely.

Host linking provides the hosts with the necessary network and security infrastructure to form a cluster together. In a
group of linked hosts, hosts can broadcast information to all its peers. Every group has a leader node, which provides
tokens with its IP and a One-Time Password (OTP) credentials encrypted that you can use to link other nodes.

Linked hosts will sync images for the Palette agent, provider images, cluster definitions, as well as host status with
each other. In a group of linked hosts that have not formed a cluster, only the leader node has access to functionality
such as change host settings, upload content, and create clusters. Once a cluster is created, only the control plane
nodes have access to features such as cluster management and can change host settings.

## Prerequisites

- Two or more hosts deployed in the same deployment mode on the same network. For more information, refer to
  [Appliance Mode Installation](../../site-deployment/stage.md) or
  [Agent Mode Installation](../../../../deployment-modes/agent-mode/install-agent-host.md).

## Procedure

1. Decide on a node that you plan to use as the leader of the group. Log in to
   [Local UI](../host-management/access-console.md) of that node. The leader node may or may not already be in a
   cluster, but the follower nodes must be idle and cannot be in a cluster.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Click **Generate token**. This will generate a token you will use to link this host with other hosts. The token
   contains the encrypted IP address of the node, as well as an OTP that will expire in two minutes.

4. Click the **Copy** button to copy the token.

5. Log in to [Local UI](../host-management/access-console.md) on the node that you want to link to the leader node.

6. From the left **Main Menu**, click **Linked Edge Hosts**.

7. Click **Link this device to another**.

8. In the pop-up box that appears, enter the token you coped from the leader node.

9. Click confirm.

10. Repeat this process for every node you want to link to the leader node.

## Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader node.

2. From the left **Main Menu**, click **Linked Edge Hosts**.

3. Confirm that all nodes you linked together show up in the **Linked Edge Hosts** table.
