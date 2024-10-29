---
sidebar_label: "Create Local Cluster"
title: "Create Local Cluster"
description: "Instructions for creating a locally managed cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

You can create and manage single-node as well as multi-node clusters on airgapped hosts locally from Local UI. This page
guides you through how to create a cluster using Local UI.

:::preview

:::

## Limitations

- For multi-node clusters, all hosts must be deployed in the same deployment mode. For more information, refer to
  [Deployment Modes](../../../../deployment-modes/deployment-modes.md).

- For multi-node clusters composed of hosts deployed in agent mode, all hosts must share the same Operating System (OS).

## Prerequisites

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log into Local UI. Any OS user can be used to log in to Local UI.

- You have uploaded the necessary software artifacts to the Edge host or included the artifacts in the Edge Installer
  ISO during EdgeForge. For more information, refer to [Upload Content Bundle](./upload-content-bundle.md) and
  [Build Content Bundle](../../edgeforge-workflow/palette-canvos/build-content-bundle.md).

- You must ensure your hosts have stable IP addresses. You have the following options to achieve a stable IP address:

  - Use a static IP address. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.
  - Enable network overlay on your Edge cluster. Network overlay can only be enabled during cluster creation. For more
    information about network overlay, refer to [Enable Overlay Network](../../networking/vxlan-overlay.md).

- To create multi-node clusters, all nodes to be included in the cluster must be linked. For more information, refer to
  [Link Hosts](./link-hosts.md).

## Create Local Cluster

1. Log into Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more information,
   refer to [Access Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, click **Cluster**.

3. Click **Create cluster**.

4. Fill out **Basic Information** such as cluster name and tag. Click **Next**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | Cluster name | Name of the cluster.                                    |
   | Tags         | Key-value pairs to provide metadata about your cluster. |

5. If you built a cluster definition into your Edge installer ISO, you can either choose to use the embedded config or
   import a cluster definition file. The embedded config uses a cluster definition you included during the creation of
   the ISO image you used to install Palette Edge on your Edge host. Ensure that the final profile for your deployed
   cluster contains the pack **Harbor Edge-Native Config**. This pack is required for all disconnected Edge clusters.

   To learn more about how to export a cluster configuration and import it during this step, refer to
   [Export Cluster Definition](./export-cluster-definition.md).

   After you finish configuring the cluster profile, click **Next**.

6. If your selected cluster profile has profile variables, you will now be prompted to enter the values for those
   profile variables. The variables with default values will be auto-populated unless the variable value is masked when
   you defined the variable. For more information on cluster profile variables, refer to
   [Define and Manage Profile Variables](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md).

   Enter the values for the profile variables and click **Next**.

7. In the **Cluster Config** step, enter a virtual IP address to be used by your cluster. Optionally, you can also
   specify a Network Time Protocol server and an SSH public key.

   | Parameter                   | Description                                                                                   |
   | --------------------------- | --------------------------------------------------------------------------------------------- |
   | Network Time Protocol (NTP) | Specify the IP address for any Network Time Protocol (NTP) servers the cluster can reference. |
   | SSH keys                    | Provide the public key of an SSH key pair that you will use to connect to the Edge host.      |
   | Virtual IP address          | Provide the virtual IP address to be used by the cluster.                                     |

   Optionally, you can also enable network overlay, especially if your cluster will operate in an DHCP environment. For
   more information, refer to [Enable Overlay Network](../../networking/vxlan-overlay.md). If you enable the overlay
   network, you need to specify a CIDR range to be used by the overlay network.

8. In the **Node Config** step, you can specify configurations for worker pools and control plane pools. To assign a
   host to a node pool, click **Add Edge Hosts** in the corresponding node pool and select the host to add to the pool.
   For multi-node clusters, the leader node is a mandatory control plane node and cannot be unassigned. Additionally,
   you must ensure that you have an odd number of nodes in the control plane.

   For more information about node pool configurations, refer to [Node pools](../../../cluster-management/node-pool.md).
   After you finish configuration, click **Next**.

9. Review your configurations and deploy the cluster. As your cluster begins to deploy, the status and details of the
   deployment are displayed in the **Cluster** page. Use this page to track the deployment progress.

## Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. Click **Cluster**. Verify that your cluster has entered the running status.
