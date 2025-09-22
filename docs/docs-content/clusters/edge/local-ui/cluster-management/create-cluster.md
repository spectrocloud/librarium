---
sidebar_label: "Create Local Cluster"
title: "Create Local Cluster"
description: "Instructions for creating a locally managed cluster in Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

You can create and manage single-node as well as multi-node clusters on airgapped hosts locally from Local UI. This page
teaches you how to create a cluster using Local UI.

Unlike clusters that are managed by Palette, a local cluster is managed locally through Local UI. You can use Local UI
to create, update, scale, and delete the cluster. If your situation changes and you need central management of the
cluster, you can choose to [pair your local cluster to a Palette instance](./local-to-central.md) for centralized
management.

:::preview

:::

## Limitations

- For multi-node clusters, all hosts must be deployed in the same deployment mode. For more information, refer to
  [Deployment Modes](../../../../deployment-modes/deployment-modes.md).

- For hosts that are deployed in agent mode, all hosts must share the same Operating System (OS).

<!-- prettier-ignore -->
- For multi-node clusters, do not use the
  <VersionedLink text="Local Path Provisioner Pack" url="/integrations/packs/?pack=csi-local-path-provisioner" />. This
  is because whenever a node is drained during an upgrade or for any other reason, the volumes will not dynamically move
  with the local path provisioner.

## Prerequisites

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- The `stylus.enableMultiNode` parameter is set to `true` in your user data configuration. For more information, refer
  to [Prepare User Data](../../edgeforge-workflow/prepare-user-data.md).

- The `stylus.installationMode` parameter is set to `airgap` in your user data configuration for all your hosts.

- Credentials to log into Local UI. Any OS user can be used to log in to Local UI.

- You have uploaded the necessary software artifacts to the Edge host or included the artifacts in the Edge Installer
  ISO during EdgeForge. For more information, refer to [Upload Content Bundle](./upload-content-bundle.md) and
  [Build Content Bundle](../../edgeforge-workflow/palette-canvos/build-content-bundle.md).

  :::warning

  Content bundles must be built with a Palette Edge CLI version that is later than `4.5.7`. Visit the
  [Downloads](../../../../downloads/cli-tools.md#palette-edge-cli) page to download the appropriate version of the
  Palette Edge CLI to build the content bundle.

  :::

- You must ensure your hosts have stable IP addresses. You have the following options to achieve a stable IP address:

  - Use a static IP address. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.
  - Enable network overlay on your Edge cluster. Network overlay can only be enabled during cluster creation. For more
    information about network overlay, refer to [Enable Overlay Network](../../networking/vxlan-overlay.md).

- To create multi-node clusters, all nodes to be included in the cluster must be linked. For more information, refer to
  [Link Hosts](./link-hosts.md).
- If you configure a local [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) cluster to use Network
  Time Protocol (NTP) servers, you must have
  [`systemd-timesyncd`](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html)
  installed and enabled on your host.

## Create Local Cluster

1. Log in to Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more information,
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
   specify an NTP server and an SSH public key.

   | Parameter                   | Description                                                                              |
   | --------------------------- | ---------------------------------------------------------------------------------------- |
   | Virtual IP Address (VIP)    | Provide the virtual IP address to be used by the cluster.                                |
   | Network Time Protocol (NTP) | Specify the IP address for any NTP servers the cluster can reference.                    |
   | SSH Keys                    | Provide the public key of an SSH key pair that you will use to connect to the Edge host. |

   Optionally, you can also enable network overlay, especially if your cluster will operate in an DHCP environment. For
   more information, refer to [Enable Overlay Network](../../networking/vxlan-overlay.md). If you enable the overlay
   network, you need to specify a CIDR range to be used by the overlay network.

8. In the **Node Config** step, you can specify configurations for worker pools and control plane pools. To assign a
   host to a node pool, click **Add Edge Hosts** in the corresponding node pool and select the host to add to the pool.
   For multi-node clusters, the leader node is a mandatory control plane node and cannot be unassigned. Additionally,
   you must ensure that you have an odd number of nodes in the control plane. Once a cluster is formed, every node in
   the control plane will be considered a leader node.

   For more information about node pool configurations, refer to [Node pools](../../../cluster-management/node-pool.md).
   After you finish configuration, click **Next**.

9. Review your configurations and deploy the cluster. As your cluster begins to deploy, the status and details of the
   deployment are displayed in the **Cluster** page. Use this page to track the deployment progress.

## Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. Click **Cluster**. Verify that your cluster has entered the running status.
