---
sidebar_label: "Create Local Cluster"
title: "Create Local Cluster"
description: "Instructions for creating a locally manageg cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

You can create and manage a single-node cluster locally from the Edge Management Console (EMC). This page guides you
through how to create a cluster using Edge Management Console.

:::preview

:::

## Limitations

- You can only create single node clusters consisting solely of the Edge host you create the cluster from. You cannot
  include other Edge hosts in the same local or remote network.

## Prerequisites

- Network access to the Edge device's port where EMC is exposed. The default port is 5080.

- Credentials to log into EMC. Any OS user can be used to log in to EMC.

- You have uploaded the necessary software artifacts to the Edge host or included the artifacts in the Edge Installer
  ISO during EdgeForge. For more information, refer to [Upload Content Bundle](./upload-content-bundle.md) and
  [Build Edge Artifacts with Content Bundle](../../edgeforge-workflow/palette-canvos/build-artifacts.md).

## Create Local Cluster

1. Log into the Edge Management Console by visiting the 5080 port of your Edge device's IP address or domain name. For
   more information, refer to [Access Edge Management Console](../host-management/access-console.md).

2. From the left **Main Menu**, click **Clusters**.

3. Click **Create cluster**.

4. Fill out **Basic Information** such as cluster name and tag. Click **Next**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | Cluster bane | Name of the cluster.                                    |
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
   you defined the variable. Enter the values for the profile variables and click **Next**.

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

8. In the **Node Config** step, you can specify configurations for the control plane pool of your single-node cluster.
   For more information about node pool configurations, refer to [Node pools](../../../cluster-management/node-pool.md).
   After you finish configuration, click **Next**.

9. Review your configurations and deploy the cluster.

## Validate

1. Log in to the Edge Management Console.

2. Click **Clusters**. Verify that you cluster has entered the running status.
