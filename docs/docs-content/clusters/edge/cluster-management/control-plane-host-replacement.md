---
sidebar_label: "Replace a Control Plane Edge Host"
title: "Replace a Control Plane Edge Host"
description:
  "Learn how to safely replace a control plane Edge host in a centrally managed cluster by adding the replacement before
  you remove the original, so the cluster stays above etcd quorum."
hide_table_of_contents: false
sidebar_position: 39
tags: ["edge", "cluster management", "etcd"]
---

When you replace a control plane Edge host in a centrally managed cluster, add the replacement host before you remove
the original. This approach keeps the cluster above the etcd quorum threshold throughout the operation. Palette allows a
temporary fourth control plane host in the node pool editor, so you can move from three hosts to four and then back to
three without dropping to two hosts and sitting at the etcd quorum limit.

etcd requires a strict majority of its members, called a quorum, to remain available. The quorum for a cluster is
`(N / 2) + 1`, rounded down, where `N` is the number of control plane members.

- A three-node control plane has a quorum of two and tolerates one unavailable member.
- A four-node control plane has a quorum of three and tolerates one unavailable member.
- A five-node control plane has a quorum of three and tolerates two unavailable members.

A four-node control plane is an unbalanced intermediate state that adds no fault tolerance over a three-node control
plane, so use it only temporarily while you swap a host.

:::warning

This procedure applies to connected, centrally managed Edge clusters with a three-node or five-node control plane pool.
Replacing the control plane of a single-node cluster by scaling to two nodes is not supported. For locally managed
clusters, refer to [Scale down a Cluster](../local-ui/cluster-management/scale-cluster.md).

:::

## Prerequisites

- An active, connected Edge cluster that is centrally managed from Palette, with a three-node or five-node control plane
  pool.

- A new Edge host registered with Palette. The host must be on the same network as the existing control plane hosts and
  use stable IP addressing.

- Access to a remote shell on a control plane host to verify etcd membership health. Refer to
  [Remote Shell into Edge Hosts](remote-shell.md).

## Add the Replacement Control Plane Host

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Clusters**.

3. Select the cluster whose control plane host you want to replace.

4. Click the **Nodes** tab in the cluster view.

5. Click **Edit** on the control plane pool.

6. Click **Add Edge Hosts**.

7. Select the new registered Edge host to add to the cluster.

8. Click **Confirm**.

   Palette adds the host as a fourth control plane node. A popup warning and a persistent warning on the cluster
   overview indicate that the cluster is in a temporary intermediate state. It might take 10 to 20 minutes for the new
   node to reach a **Healthy** status.

:::warning

Do not remove the original host until you confirm etcd membership health, as described in the next section. A
**Healthy** node status in Palette does not on its own confirm that the new host has joined the etcd cluster as a
member.

:::

## Verify etcd Membership Health

Before you remove the original host, confirm that the replacement host has joined the etcd cluster and that all members
are healthy. Node status in Palette does not reflect etcd membership, so you must verify membership directly with
`etcdctl`.

1. Open a remote shell to one of the control plane Edge hosts. Refer to [Remote Shell into Edge Hosts](remote-shell.md).

2. Set the etcd API version and the certificate paths for your cluster's Kubernetes distribution. The `etcdctl` binary
   is located at `/opt/spectrocloud/bin/etcdctl` on the host.

   ```shell
   export ETCDCTL_API=3
   export ETCDCTL_CACERT=<ca-cert-path>
   export ETCDCTL_CERT=<client-cert-path>
   export ETCDCTL_KEY=<client-key-path>
   ```

   Use the certificate paths that match your Kubernetes distribution.

   | Kubernetes distribution                  | CA certificate                                        | Client certificate                                        | Client key                                                |
   | ---------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
   | Palette eXtended Kubernetes Edge (PXK-E) | `/etc/kubernetes/pki/etcd/ca.crt`                     | `/etc/kubernetes/pki/etcd/server.crt`                     | `/etc/kubernetes/pki/etcd/server.key`                     |
   | RKE2                                     | `/var/lib/rancher/rke2/server/tls/etcd/server-ca.crt` | `/var/lib/rancher/rke2/server/tls/etcd/server-client.crt` | `/var/lib/rancher/rke2/server/tls/etcd/server-client.key` |
   | K3s                                      | `/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt`  | `/var/lib/rancher/k3s/server/tls/etcd/client.crt`         | `/var/lib/rancher/k3s/server/tls/etcd/client.key`         |

3. List the etcd members.

   ```shell
   /opt/spectrocloud/bin/etcdctl member list --write-out=table
   ```

   Confirm that four members are listed and that every member is started. No member should be in the learner state.

4. Check the health and status of every member across the cluster.

   ```shell
   /opt/spectrocloud/bin/etcdctl endpoint status --cluster --write-out=table
   /opt/spectrocloud/bin/etcdctl endpoint health --cluster
   ```

   Confirm that every endpoint reports as healthy and that exactly one member is the leader.

Proceed to remove the original host only after all four members are healthy. If a member is missing, unhealthy, or in
the learner state, wait for it to recover before you continue.

## Remove the Original Control Plane Host

1. From the left main menu in Palette, click **Clusters**, and then select the same cluster.

2. Click the **Nodes** tab in the cluster view.

3. Click **Edit** on the control plane pool.

4. Click the **delete** button on the original host.

5. Click **Confirm**.

   Palette removes the host and returns the pool to three control plane nodes. The intermediate-state warning clears
   once the pool returns to three healthy control plane hosts.

:::warning

Remove only one control plane host at a time. Do not start another removal while one is still in progress, because
removing multiple control plane hosts at once can take the cluster below etcd quorum.

:::

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, click **Clusters**.

3. Select the cluster whose control plane host you replaced.

4. Click the **Nodes** tab in the cluster view.

5. Confirm that the control plane pool has three nodes, that all nodes are in **Healthy** status, and that the temporary
   intermediate-state warning has cleared.

6. To confirm etcd membership, open a remote shell to a control plane host and run
   `/opt/spectrocloud/bin/etcdctl member list --write-out=table` again. Confirm that three members are listed and that
   all are healthy.
