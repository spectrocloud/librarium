---
sidebar_label: "Install Launchpad for VMs"
title: "Install Launchpad for VMs"
description: "Learn how to install the Launchpad for VMs Appliance on bare metal or Edge devices."
icon: " "
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "Launchpad for VMs"]
---

The Launchpad for VMs Appliance is a bootable ISO that you install on bare metal or Edge devices to create a cluster
with Virtual Machine Orchestrator (VMO) preconfigured. Install the appliance on each device that serves as a node in
your VMO cluster, and link the nodes together to form your cluster. After you deploy your cluster, [create your first VM](./quick-start.md).

## Hardware Requirements

Each device where you install the Launchpad for VMs Appliance ISO must meet the following hardware requirements.

| **Component**        | **Minimum**                                   | **Recommended**                                    | **Additional Information**                                                                                            |
| -------------------- | --------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD64 CPU with 8 cores               | Intel or AMD64 CPU with 8 cores                    | -                                                                                                                     |
| **RAM**              | 24 GB                                         | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                                        |
| **Network Adapters** | 2 x 1 Gbps (data + management)                | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                                       |
| **Storage Adapters** | 2 x 16 Gbps FC                                | 2 x 16 Gbps FC                                     | Storage adapters must support the Fibre Channel (FC) protocol, a high-speed network protocol used for data transfer.  |
| **Disks**            | Local disk of at least 500 GB for the OS boot | Local disk of at least 500 GB for the OS boot      | Storage Area Network (SAN) boot is supported. Booting from SAN requires planning due to the multi-path configuration. |

## Prerequisites

- Configure the network with a bridge network set to `br0`. For more information about network considerations, review
  [VMO Network Configuration Considerations](./vmo-networking.md).

## Cluster Hardware Resources

The following table lists the hardware requirements for worker nodes and control plane nodes in a VMO cluster.

| **Component**        | **Minimum**                                                           | **Recommended**                                    | **Comments**                                                                                         |
| -------------------- | --------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD x64 CPU with 8 cores                                     | Intel or AMD x64 CPU with 8 cores                  |                                                                                                      |
| **RAM**              | 24 GB                                                                 | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                       |
| **Network Adapters** | 2 x 1 Gbps <br /> (data + management)                                 | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                      |
| **Storage Adapters** | 2 x 16 Gbps FC                                                        | 2 x 16 Gbps FC                                     | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk of at least 500 GB for the OS boot. SAN boot is supported. | Local disk of 500 GB for the OS boot               | Boot from SAN requires planning due to the multi-path configuration.                                 |

## Install Launchpad for VMs

1. Boot your Launchpad for VMs device from the Launchpad for VMs appliance ISO.

2. From the **Launchpad for VMs Interactive Installer** screen, select the disk to install the appliance on. Press
   **ENTER** to proceed to the next screen.

   :::danger

   Ensure you select the correct disk. The installation process erases all content on the target disk.

   :::

3. On the **Installation Options** screen, select whether the installer should do **nothing**, **reboot**, or
   **poweroff** after the installation is complete. After the installation is complete, disconnect the ISO.

4. When the Launchpad for VMs system boots up, press **F2** to open the TUI. Create an OS user with the necessary
   permissions to operate Launchpad for VMs by entering a username and password. Press **ENTER** to progress to the next
   screen.

5. The terminal displays a console where you provide hostname and network configuration for the Launchpad host.

   Review the existing hostname and, optionally, change it. Use the **TAB** key or the up and down arrow keys to switch
   between fields. Press **ENTER** to apply each change.

6. In **Network Adapter**, select a network adapter to configure. By default, network adapters request an IP address
   automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
   block of each adapter's possible IP address appears on the **Network Adapter** screen.

   On the configuration page for each adapter, you can switch the IP addressing scheme from DHCP to static IP. In static
   IP mode, provide a static external IP address, subnet mask, and the default gateway address. A static external IP
   address removes the existing DHCP settings.

7. (Optional) Specify a Virtual Local Area Network (VLAN) ID on the configuration page of each network adapter. A VLAN
   ID segments network traffic on the same physical network interface for network isolation. If you assign a VLAN ID,
   the Launchpad host tags all outgoing packets from that adapter with the specified VLAN identifier.

8. (Optional) Specify the MTU for your network adapter. The MTU defines the largest packet size, in bytes, that the
   interface can send without fragmentation. Press **ENTER** to apply the change.

9. In **DNS Configuration**, specify the IP addresses of the primary and secondary name servers. Optionally, specify a
   search domain. Press **ENTER** to apply the change.

10. In **NTP Configuration**, specify one or more NTP servers. For example, `0.pool.ntp.org` and `1.pool.ntp.org`.

11. After you confirm the configurations, navigate to **Logout** and press **ENTER** to complete the configuration. The
    terminal screen displays the hostname and network information of your Launchpad host. Verify that all displayed
    information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VMO Appliance host.
   If you have access to the VMO Appliance host terminal, the Local UI address is displayed on the terminal screen. If
   you have changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. On the **Network interfaces** card, navigate to **Bonds** and select **Create**.

4. Fill out the necessary fields on the **Create Bond** screen and select **Confirm**.

   | **Parameter**                | **Description**                                                                                |
   | ---------------------------- | ---------------------------------------------------------------------------------------------- |
   | **Name**                     | Enter a name for the bond. For example, `bond0`.                                               |
   | **Bond type**                | Select **Static** or **DHCP** for IP address settings.                                         |
   | **Member interfaces**        | Select one or more Network Interface Cards (NICs) for the bond.                                |
   | **Bonding mode**             | Select the bonding mode for the bond. This must match your physical switch port configuration. |
   | **Link monitoring interval** | Select time in milliseconds.                                                                   |
   | **MTU**                      | Leave the default value or adjust to 9000 for jumbo frames.                                    |
   | **DNS**                      | Enter one or more DNS server IP addresses.                                                     |
   | **IP Address**               | For static bonds only, enter the IP address for the bond.                                      |
   | **Subnet mask**              | For static bonds only, enter the subnet mask for the bond.                                     |
   | **Gateway**                  | For static bonds only, enter the gateway IP address for the bond.                              |

   :::warning

   This change may cause Local UI connectivity loss.

   :::

5. On the **Network interfaces** screen, navigate to **Bridges** and select **Create**.

6. Fill out the necessary fields on the **Create Bridge** screen and select **Confirm**.

   | **Parameter**         | **Description**                                                |
   | --------------------- | -------------------------------------------------------------- |
   | **Name**              | Enter a name for the bridge. For example, `br0`.               |
   | **Member interfaces** | Select one or more bonds for the bridge.                       |
   | **Config type**       | Select **Static** or **DHCP** for IP address settings.         |
   | **MTU**               | Leave the default value or adjust to 9000 for jumbo frames.    |
   | **DNS**               | Enter one or more DNS server IP addresses.                     |
   | **IP Address**        | For static bridges only, enter the IP address for the bridge.  |
   | **Subnet mask**       | For static bridges only, enter the subnet mask for the bridge. |
   | **Gateway**           | For static bridges only, enter the gateway IP address.         |

   :::warning

   This change may cause Local UI connectivity loss.

   :::

## Create Launchpad for VMs Cluster

1. Log in to Local UI at `https://<host-ip>:5080`. For more information, review
   [Configure Network Settings](#configure-network-settings).

2. From the left main menu, select **Cluster**.

3. Select **Create cluster**.

4. Fill out the **Basic Information** fields and select **Next**.

   | **Parameter**    | **Description**                                         |
   | ---------------- | ------------------------------------------------------- |
   | **Cluster name** | Name of the cluster.                                    |
   | **Tags**         | Key-value pairs to provide metadata about your cluster. |

5. The default **VMO Appliance full stack** profile loads. The following table describes each pack in the profile. After
   you review the cluster profile, select **Next**.

   | **Component**              | **Pack Name**                             | **Purpose**                                                                                                                               |
   | -------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Edge Native BYOI**       | `edge-native-byoi <version>`              | Native Ubuntu OS.                                                                                                                         |
   | **Kubernetes**             | `edge-k8s <version>`                      | Kubernetes platform.                                                                                                                      |
   | **Cilium**                 | `cni-cilium-fips <version>`               | CNI and network policy. Multus support for VM networking.                                                                                 |
   | **Piraeus**                | `piraeus-operator <version>`              | Storage backend. Provides StorageClass for VM disks.                                                                                      |
   | **Zot**                    | `zot-registry-fips <version>`             | OCI registry. Stores container images for air-gapped deployments.                                                                         |
   | **Registry Connect**       | `registry-connect <version>`              | Enables integration with OCI-compliant registries.                                                                                        |
   | **Required config**        | `required-config-1 <version>`             | Initial configuration before continuing.                                                                                                  |
   | **MetalLB**                | `lb-metallb-helm <version>`               | Loadbalancer implementation for bare metal. Assigns the platform IP address.                                                              |
   | **Traefik**                | `traefik <version>`                       | Single ingress controller. Provides TLS termination, path-based routing, and the Loadbalancer IP address.                                 |
   | **Required config**        | `required-config-2 <version>`             | Second configuration before continuing.                                                                                                   |
   | **Keycloak**               | `keycloak <version>`                      | OIDC identity provider. Handles login, user and group management, and token issuance. Shared `k8s-oidc` client with K8s API and Headlamp. |
   | **Headlamp**               | `headlamp <version>`                      | Kubernetes cluster explorer. Alternative UI for raw K8s resources.                                                                        |
   | **Victoria Metrics**       | `victoria-metrics-cluster <version>`      | Optional long-term metrics storage. Supports PromQL queries when `EXTERNAL_METRICS_URL` is configured.                                    |
   | **OTel Collector**         | `opentelemetry <version>`                 | Metrics pipeline. Receives OTLP from node-agent, and forwards metrics to VMO Manager or Victoria Metrics.                                 |
   | **VMO**                    | `virtual-machine-orchestrator-v<version>` | Primary UI and API gateway. Manages VMs, templates, golden images, access policies, configuration, and dashboards.                        |
   | **VM Migration Assistant** | `vm-migration-assistant <version>`        | Migrates VMs from VMware vSphere to VMO.                                                                                                  |

   Additionally, the **VMO Manager** pack bundles the following services.

   | **Component**    | **Pack Name**                             | **Purpose**                                                                                        |
   | ---------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
   | **cert-manager** | `virtual-machine-orchestrator-v<version>` | Issues and renews TLS certificates. Single platform CA for all components.                         |
   | **KubeVirt**     | `virtual-machine-orchestrator-v<version>` | Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
   | **CDI**          | `virtual-machine-orchestrator-v<version>` | Containerized Data Importer. Handles disk image uploads, imports, and clones.                      |

6. Fill out the **Profile Config** page and select **Next**.

   a. In the **Networking** section, fill out the following fields.

   | **Parameter**                        | **Description**                                                                   |
   | ------------------------------------ | --------------------------------------------------------------------------------- |
   | **Pod CIDR**                         | CIDR range for Kubernetes Pods network.                                           |
   | **Service CIDR**                     | CIDR range for Kubernetes Services network.                                       |
   | **MetalLB IP Address**               | IP address for MetalLB to use.                                                    |
   | **Cilium and MetalLB interface**     | NIC that Cilium and MetalLB use for L2 advertisements.                            |
   | **Enable VLAN Filtering (Optional)** | Enabled by default. VLAN filtering on the bridge interface restricts VLAN access. |
   | **VLAN range for VMs**               | VLANs to use for VMs. VLAN 1 is designated as default native VLAN.                |
   | **Bridge Interface**                 | Bridge interface that VMs use for cluster node connectivity.                      |
   | **Cluster runs on br0**              | Optional. Allow the cluster to run on `br0`.                                      |
   | **VLANs on top of br0**              | VLANs to use on `br0`. Include VLAN 1, the default native VLAN.                   |

   b. In the **OS & Metrics** section, fill out the following fields.

   | **Parameter**                              | **Description**                                                      |
   | ------------------------------------------ | -------------------------------------------------------------------- |
   | **Ubuntu Pro Token**                       | Optional. Leave blank or enter an Ubuntu Pro token value.            |
   | **Reserved CPUs for Kubelet and system**   | CPUs to reserve for Kubelet and OS use.                              |
   | **Victoria Metrics Data Retention Period** | Value in hours, days, weeks, months, or years. Use `24h` or greater. |
   | **Victoria Metrics Volume Storage Size**   | Optional. Size in gigabytes (`Gi`).                                  |

   c. In the **Container & Registry** section, fill out the following fields.

   | **Parameter**                  | **Description**                                                                                                              |
   | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
   | **OCI Pack Registry Username** | Username for the OCI Pack Registry.                                                                                          |
   | **OCI Pack Registry Password** | Initial password for OCI Pack Registry account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol. |

   d. In the **OIDC** section, fill out the following fields.

   | **Parameter**               | **Description**                                                                                                                                              |
   | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Platform CA Certificate** | Base64-encoded value for your CA certificate. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**. |
   | **Platform CA Private Key** | Base64-encoded value for your private key. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**.    |
   | **VMO OIDC Login Username** | Username for the cluster admin OIDC login.                                                                                                                   |
   | **VMO OIDC Login email**    | Address to use for OIDC login.                                                                                                                               |
   | **VMO Login Password**      | Initial password for OIDC account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.                                              |

   e. In the **Keycloak Admin** section, fill out the following fields.

   | **Parameter**                       | **Description**                                                                                                           |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
   | **Default Keycloak Admin Username** | Optional. Username for the Keycloak admin login.                                                                          |
   | **Default Keycloak Admin Password** | Initial password for Keycloak admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol. |

   f. In the **Local Admin** section, fill out the following fields.

   | **Parameter**                 | **Description**                                                                                                        |
   | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
   | **VMO Local Admin User Name** | Username to use for the local admin account.                                                                           |
   | **VMO Local Admin Password**  | Initial password for local admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol. |

   g. In the **Storage** section, fill out the following fields.

   | **Parameter**                      | **Description**                                                                           |
   | ---------------------------------- | ----------------------------------------------------------------------------------------- |
   | **Storage Node Interface**         | Node network interface to use for storage replication.                                    |
   | **Storage Volume Placement Count** | Optional. Number of replicas to create for storage volumes. Use values from one to three. |

7. On the **Cluster Config** step, enter a virtual IP (VIP) address for your cluster. Optionally, specify an NTP server
   and an SSH public key.

   | **Parameter**                   | **Description**                                                                 |
   | ------------------------------- | ------------------------------------------------------------------------------- |
   | **Virtual IP Address (VIP)**    | Enter the virtual IP address for the cluster.                                   |
   | **Network Time Protocol (NTP)** | Enter the IP address of an NTP server the cluster can reference.                |
   | **SSH Keys**                    | Enter the public key of an SSH key pair to use for connecting to the Launchpad host. |

   Optionally, enable network overlay if your cluster operates in a DHCP environment. If you enable the overlay network,
   specify a CIDR range for the overlay network to use.

8. On the **Node Config** step, configure worker pools and control plane pools. To assign a host to a node pool, select
   **Add Item** in the corresponding node pool, and select the host to add. For multi-node clusters, keep the leader
   node assigned to the control plane node pool. Ensure that you have an odd number of nodes in the control plane. After
   the cluster is formed, every node in the control plane is considered a leader node.

   For more information about node pool configurations, review
   [Node Pools](../../clusters/cluster-management/node-pool.md). After you finish the configuration, select **Next**.

9. Review your configurations and deploy the cluster. The **Cluster** page displays the deployment status and details.
   Use this page to track deployment progress. The Launchpad for VMs host reboots as part of the build process.

10. After the cluster deployment is complete, more options appear in the left sidebar.

    ![Screenshot of appliance](/vmo/vm-management_vmo_appliance-install-4-9.webp)

## Verify

1. From the left main menu in the Launchpad for VMs appliance, select **VM Orchestrator**. You can also go to the
   address you provided for MetalLB in your browser.

2. Log in to VMO Manager.

   <Tabs>

   <TabItem value="local-auth" label="Local Auth (Day-0)">

   Before you configure Keycloak, use local admin accounts.

   1. Go to `https://<vmo-address>/local-login`.
   2. Enter the local admin username (default: `admin`) and the password you configured during cluster creation.
   3. Enter a new password and confirm the new password.
   4. Select **Set New Password**.

   </TabItem>

   <TabItem value="keycloak" label="OIDC using Keycloak">

   When Keycloak is configured, VMO Manager uses OIDC for authentication.

   1. Select **Login** or go to the platform URL.
   2. The browser redirects you to the Keycloak login page.
   3. Enter your username and password.
   4. After successful authentication, the browser redirects you back to VMO Manager.

   </TabItem>

   </Tabs>

3. After you log in, the **Dashboard** is the default landing page.

   ![Screenshot of VMO dashboard](/vmo/vm-management_vmo_appliance-default-dashboard-4-9.webp)

   The **Dashboard** contains a set of adjustable, drag-to-reorder widgets.

   | **Widget**                   | **Description**                                                                                                           |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
   | **Overview**                 | KPI cards that show Total VMs, Running, Stopped, Issues, Transitional, and Namespace counts. Select a card to filter VMs. |
   | **Resource Summary**         | CPU and memory cluster usage plus quick links to Data Volumes and Networks.                                               |
   | **VM CPU USAGE (TOP 10)**    | Defaults to last 1 hour CPU usage by VMs.                                                                                 |
   | **VM MEMORY USAGE (TOP 10)** | Defaults to last 1 hour memory usage by VMs.                                                                              |
   | **VM NETWORK I/O**           | Defaults to last 1 hour network usage by VMs.                                                                             |
   | **VM STATUS DISTRIBUTION**   | Breakdown of healthy and unhealthy VMs.                                                                                   |
   | **VMS BY NAMESPACE**         | Breakdown of VMs by running, stopped, and other statuses.                                                                 |
   | **VM NEEDING ATTENTION**     | List of unhealthy VMs.                                                                                                    |

### Auto-Refresh and Pause

The dashboard polls the API and metrics backend on a configurable interval (5 seconds, 15 seconds, or 30 seconds). Use
the **interval selector** in the toolbar to change the cadence. Select **Pause** to stop all background polling, which
is useful when inspecting data or troubleshooting. Select **Resume** to restart polling.

### Customize the Layout

You can customize the interface by dragging widget headers to reorder widgets within the grid, resizing widgets from
their bottom-right corner handle, and adding or removing widgets with the **+** button in the toolbar. Select **Reset
Layout** to return all widgets to the default arrangement. Layout changes save automatically and persist across
sessions.

## Next Steps

After you deploy your VMO cluster, use the following guide to [create your first VM](./quick-start.md).
