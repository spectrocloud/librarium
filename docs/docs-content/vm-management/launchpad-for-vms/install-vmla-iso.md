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
your VMO cluster, and link the nodes together to form your cluster. After you deploy your cluster, log into Launchpad to
do an [initial configuration](./getting-started-wiz.md), and [create your first VM](./quick-start.md).

## Hardware Requirements

Each device where you install the Launchpad for VMs Appliance ISO must meet the following hardware requirements.

| **Component**        | **Minimum**                                                            | **Recommended**                                    | **Additional Information**                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD64 CPU with 8 cores                                        | Intel or AMD64 CPU with 8 cores                    | -                                                                                                                                                 |
| **RAM**              | 24 GB                                                                  | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                                                                    |
| **Network Adapters** | 2 x 1 Gbps (data and management)                                       | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                                                                   |
| **Storage Adapters** | 2 x 16 Gbps FC or 2 x 10 Gbps ethernet shared with data and management | 2 x 16 Gbps FC or 2 x 10 Gbps ethernet dedicated   | Dedicated storage adapters, either Fiber Channel or ethernet (for example, iSCSI), provide reliable access to external or cluster shared storage. |
| **Disks**            | Local disk of at least 500 GB for the OS boot                          | Local disk of at least 500 GB for the OS boot      | Storage Area Network (SAN) boot is supported. Booting from SAN requires planning due to the multi-path configuration.                             |

## Prerequisites

- If you have an [Ubuntu Pro](https://ubuntu.com/pro) subscription, you can provide the Ubuntu Pro token during the
  Launchpad for VMs installation process. This is optional but recommended for security and compliance purposes.

- (Optional) Depending on your network infrastructure, configure the network with a bridge network set to `br0`. For
  more information about network considerations, review
  [VMO Network Configuration Considerations](/vm-management/launchpad-for-vms/vmo-networking/).

- Reserve a virtual IP address (VIP) for the Launchpad for VMs management cluster. The Launchpad for VMs installation
  process assigns the VIP and uses it for load balancing and high availability. Ensure all nodes in the Launchpad for
  VMs management cluster can access the VIP.

- <PartialsComponent category="self-hosted" name="installation-steps-secure-boot" edition="Launchpad for VMs" />

## Install Launchpad for VMs {#install}

1. Sign in to [Artifact Studio](https://artifact-studio.spectrocloud.com/) to download the **Launchpad for VMs** ISO.

2. In the **Launchpad for VMs** section, use the drop-down to select the appropriate version, and select **Show
   Artifacts**.

3. The following table describes the installer options to download for installation.

   | **Artifact**                          | **Description**                                 |
   | ------------------------------------- | ----------------------------------------------- |
   | **Content bundle (including Ubuntu)** | Content bundle to use with **Appliance ISO**.   |
   | **Appliance ISO**                     | Smaller ISO without embedded content bundle.    |
   | **Appliance ISO with Content**        | Full ISO with embedded content bundle.          |
   | **MOK Key for Secure Boot**           | MOK key to use for secure boot with MokManager. |

4. Download the **Appliance ISO with Content**. Or, download both **Appliance ISO** and **Content bundle (including
   Ubuntu)**. Download **MOK Key for Secure Boot** if you use secure boot on your host.

   If you have downloaded the **Content bundle (including Ubuntu)**,
   [upload it using Local UI](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md#upload-bundle) or
   [Palette CLI](../../automation/palette-cli/commands/content.md#upload).

   :::info

   Use the slim **Appliance ISO** and **Content bundle (including Ubuntu)** when you have limited network capacity for
   mounting ISOs and when you have greater network capacity to upload the content bundle after the initial install.

   :::

![Screenshot of download screen from artifact studio](/vmo/vm-management_launchpad-for-vms_iso-download-4-9.webp)

5. Boot your device using the Launchpad for VMs Appliance ISO.

6. <PartialsComponent category="self-hosted" name="secure-boot-mokmanager" />

7. From the **Launchpad for VMs Interactive Installer** screen, select the disk to install the appliance on. Press
   **ENTER** to proceed to the next screen.

   :::danger

   Ensure you select the correct disk. The installation process erases all content on the target disk.

   :::

8. On the **Installation Options** screen, select what the installer does after the installation completes. Press
   **ENTER** to begin the installation process. After the installation completes, disconnect the ISO. The following
   table describes the available options.

   | **Option**   | **Description**                                 |
   | ------------ | ----------------------------------------------- |
   | **nothing**  | Keeps the system powered on after installation. |
   | **reboot**   | Automatically reboots the system.               |
   | **poweroff** | Powers off the system.                          |

9. On the **GNU GRUB** screen, select **Palette eXtended Kubernetes Edge Registration**.

10. On the **Palette TUI** screen, press **F2** to begin configuring your Edge host.

11. In the Palette TUI, provide credentials for the initial account. Use this account to log in to Local UI and access
    the node through SSH.

    | **Field**               | **Description**                                   |
    | ----------------------- | ------------------------------------------------- |
    | **Username**            | Provide a username to use for the account.        |
    | **Password**            | Enter a password for the account.                 |
    | **Confirm Password**    | Re-enter the password for confirmation.           |
    | **Password Expiration** | (Optional) Set a date for the password to expire. |

    Press **ENTER** to continue.

12. In the Palette TUI, the available configuration options appear. Use the **TAB** key or the up and down arrow keys to
    switch between fields. When you make a change, press **ENTER** to apply the change. Use **ESC** to go back.

13. In **Hostname**, check the existing hostname and, optionally, change it to a new one.

14. In **Network Adapter**, select a network adapter to configure. By default, network adapters request an IP address
    automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
    block of each adapter's possible IP address appears on the **Network Adapter** screen.

    On the configuration page for each adapter, you can switch the IP addressing scheme from DHCP to static IP. In
    static IP mode, provide a static external IP address, subnet mask, and the default gateway address. A static
    external IP address removes the existing DHCP settings.

15. (Optional) Specify a Virtual Local Area Network (VLAN) ID on the configuration page of each network adapter. A VLAN
    ID segments network traffic on the same physical network interface for network isolation. If you assign a VLAN ID,
    the Launchpad host tags all outgoing packets from that adapter with the specified VLAN identifier.

16. (Optional) Specify the MTU for your network adapter. The MTU defines the largest packet size, in bytes, that the
    interface can send without fragmentation. Press **ENTER** to apply the change.

17. In **DNS Configuration**, specify the IP addresses of the primary and secondary name servers. Optionally, specify a
    search domain. Press **ENTER** to apply the change.

18. In **NTP Configuration**, specify one or more NTP servers. For example, `0.pool.ntp.org` and `1.pool.ntp.org`.

19. After you confirm the configurations, navigate to **Logout** and press **ENTER** to complete the configuration. The
    terminal screen displays the hostname and network information of your Launchpad host. Verify that all displayed
    information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your Launchpad for VMs
   Appliance host. If you have access to the Launchpad for VMs Appliance host terminal, the Local UI address appears on
   the terminal screen. If you have changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. In the **Network interfaces** section, beside **Bonds**, select **Create**.

4. Complete the fields on the **Create Bond** screen and select **Confirm**.

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

5. In the **Network interfaces** section, beside **Bridges**, select **Create**.

6. Complete the fields on the **Create Bridge** screen and select **Confirm**.

   | **Parameter**         | **Description**                                                                                                                                       |
   | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**              | Enter a name for the bridge. For example, `br0`.                                                                                                      |
   | **Member interfaces** | Select one or more bonds for the bridge.                                                                                                              |
   | **Enable STP**        | Enable Spanning Tree Protocol (STP) to prevent network loops when the bridge has more than one member interface. Leave off for single-member bridges. |
   | **Config type**       | Select **Static** or **DHCP** for IP address settings.                                                                                                |
   | **MTU**               | Leave the default value or adjust to 9000 for jumbo frames.                                                                                           |
   | **DNS**               | Enter one or more DNS server IP addresses.                                                                                                            |
   | **IP Address**        | For static bridges only, enter the IP address for the bridge.                                                                                         |
   | **Subnet mask**       | For static bridges only, enter the subnet mask for the bridge.                                                                                        |
   | **Gateway**           | For static bridges only, enter the gateway IP address.                                                                                                |

   :::warning

   This change may cause Local UI connectivity loss.

   :::

## Create Launchpad for VMs Cluster {#create-cluster}

1. From the left main menu, select **Cluster**.

2. Select **Create cluster**.

3. Complete the **Basic Information** fields and select **Next**.

   | **Parameter**    | **Description**                                         |
   | ---------------- | ------------------------------------------------------- |
   | **Cluster name** | Name of the cluster.                                    |
   | **Tags**         | Key-value pairs to provide metadata about your cluster. |

4. The default **VMO Appliance full stack** profile loads. The following table describes each pack in the profile. After
   you review the cluster profile, select **Next**.

   :::info

   If your installation is using the [**Appliance ISO**](#install),
   [upload the content bundle using Local UI](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md#upload-bundle)
   or [Palette CLI](../../automation/palette-cli/commands/content.md#upload). Then continue with Step 4.

   :::

   | **Component**              | **Pack Name**                  | **Purpose**                                                                                                                                      |
   | -------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Edge Native BYOI**       | `edge-native-byoi`             | Native Ubuntu OS.                                                                                                                                |
   | **Kubernetes**             | `edge-k8s`                     | Kubernetes platform.                                                                                                                             |
   | **Cilium**                 | `cni-cilium-fips`              | CNI and network policy. Multus support for VM networking.                                                                                        |
   | **Piraeus**                | `piraeus-operator`             | Storage backend. Provides StorageClass for VM disks.                                                                                             |
   | **Piraeus Netiface**       | `piraeus-netface-builder`      | Storage replication network helper. Sets up the network interface for storage replication communication.                                         |
   | **Zot**                    | `zot-registry-fips`            | OCI registry. Stores container images for air-gapped deployments.                                                                                |
   | **Registry Connect**       | `registry-connect`             | Enables integration with OCI-compliant registries.                                                                                               |
   | **Required config**        | `required-config-1`            | Initial configuration before continuing.                                                                                                         |
   | **MetalLB**                | `lb-metallb-helm`              | Load balancer implementation for bare metal. Assigns the platform IP address.                                                                    |
   | **Traefik**                | `traefik`                      | Single ingress controller. Provides TLS termination, path-based routing, and the load balancer IP address.                                       |
   | **Required config**        | `required-config-2`            | Second configuration before continuing.                                                                                                          |
   | **Keycloak**               | `keycloak`                     | OIDC identity provider. Handles login, user and group management, and token issuance. Shared `k8s-oidc` client with Kubernetes API and Headlamp. |
   | **Headlamp**               | `headlamp`                     | Kubernetes cluster explorer. Alternative UI for raw Kubernetes resources.                                                                        |
   | **Victoria Metrics**       | `victoria-metrics-cluster`     | Optional long-term metrics storage. Supports PromQL queries when `EXTERNAL_METRICS_URL` is configured.                                           |
   | **OTel Collector**         | `opentelemetry`                | Metrics pipeline. Receives OTLP from node-agent, and forwards metrics to VMO Manager or Victoria Metrics.                                        |
   | **VMO**                    | `virtual-machine-orchestrator` | Primary UI and API gateway. Manages VMs, templates, golden images, access policies, configuration, and dashboards.                               |
   | **VM Migration Assistant** | `vm-migration-assistant`       | Migrates VMs from VMware vSphere to VMO.                                                                                                         |

   Additionally, the **VMO Manager** pack bundles the following services.

   | **Component**    | **Pack Name**                  | **Purpose**                                                                                        |
   | ---------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
   | **cert-manager** | `virtual-machine-orchestrator` | Issues and renews TLS certificates. Single platform CA for all components.                         |
   | **KubeVirt**     | `virtual-machine-orchestrator` | Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
   | **CDI**          | `virtual-machine-orchestrator` | Containerized Data Importer. Handles disk image uploads, imports, and clones.                      |

5. On the **Profile Config** wizard step, complete the following fields for each section. Select **Next** when finished.

   ### Network Settings

   | **Parameter**                              | **Description**                                                                                                                           |
   | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Pod Network Range**                      | IP address range assigned to internal Kubernetes pod networking. Change only if this conflicts with your existing network.                |
   | **Service Network Range**                  | IP address range reserved for Kubernetes services, such as internal load balancers and DNS. Must not overlap with Pod Network Range.      |
   | **Platform IP IP Address**                 | A single unused IP address on your network that exposes cluster services externally.                                                      |
   | **Cluster Network Interface**              | The physical network interface, bond, or bridge on each node used for cluster traffic and external service announcements.                 |
   | **Restrict Allowed VLANs (Optional)**      | When enabled, the bridge interface permits only VLANs listed in **VLAN range for VMs**. Disable unless you need strict VLAN isolation.    |
   | **VM VLAN Range**                          | VLAN IDs that tenant VMs can use. Accepts individual IDs, such as `12` and `13`, or ranges, such as `15-20`.                              |
   | **VM Bridge Interface**                    | The Linux bridge interface on cluster nodes that connects tenant VMs to the physical network.                                             |
   | **Use br0 for Cluster Traffic (Optional)** | Enable if your Kubernetes cluster nodes communicate via the `br0` bridge interface or a VLAN sub-interface of br0.                        |
   | **Br0 VLAN Sub-Interface**                 | List all VLAN IDs configured as sub-interfaces or dynamically attached on `br0`. Include VLAN 1 and all VM VLANs. For example, `1,10,20`. |

   ### OS and Metrics

   | **Parameter**                                       | **Description**                                                                                                                           |
   | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Ubuntu Pro Token (Optional)**                     | Your Ubuntu Pro subscription token for Extended Security Maintenance (ESM) and compliance features. Leave blank without a subscription.   |
   | **Reserved CPUs for Kubelet and system**            | CPU core IDs reserved for the OS and Kubernetes node agent (Kubelet). The system excludes these cores from workloads. For example, `0-3`. |
   | **Victoria Metrics Data Retention Period**          | How long to store monitoring metrics before deletion. Use formats such as `30d` for days or `6w` for weeks.                               |
   | **Victoria Metrics Volume Storage Size (Optional)** | Disk space allocated for storing monitoring metrics. Increase if you expect high cardinality or long retention. For example, `20Gi`.      |

   ### Container and Registry

   | **Parameter**                  | **Description**                                                                                                |
   | ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
   | **OCI Pack Registry Username** | Username to authenticate with the automatically deployed, local container image registry used by the platform. |
   | **OCI Pack Registry Password** | Password for the automatically deployed, local container image registry. This value is stored securely.        |

   :::warning

   Passwords must contain 6 to 64 characters and include at least one uppercase letter, one lowercase letter, one
   number, and one special character.

   :::

   ### OIDC Settings

   | **Parameter**               | **Description**                                                                                                                                                                                                                                              |
   | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Platform CA Certificate** | The root Certificate Authority certificate for your platform, encoded in Base64. Used to establish trust for OIDC and internal TLS. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**.           |
   | **Platform CA Private Key** | The private key corresponding to the Platform CA Certificate, encoded in Base64. Keep this secret because it signs all platform certificates. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**. |
   | **VMO OIDC Login Username** | Username for the initial VMO administrator account created in the OIDC provider (Keycloak).                                                                                                                                                                  |
   | **VMO OIDC Login Email**    | Address associated with the VMO administrator OIDC account.                                                                                                                                                                                                  |
   | **VMO Login Password**      | Password for the VMO administrator's OIDC login. This value is stored securely.                                                                                                                                                                              |

   :::warning

   Passwords must contain 6 to 64 characters and include at least one uppercase letter, one lowercase letter, one
   number, and one special character.

   :::

   ### Keycloak Admin

   | **Parameter**                                  | **Description**                                                                                                                           |
   | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Default Keycloak Admin Username (Optional)** | Username for the built-in Keycloak administrator account. Use this account to manage the identity provider directly. Defaults to `admin`. |
   | **Default Keycloak Admin Password**            | Password for the Keycloak administrator account. This value is stored securely.                                                           |

   :::warning

   Passwords must contain 6 to 64 characters and include at least one uppercase letter, one lowercase letter, one
   number, and one special character.

   :::

   ### Local Admin

   | **Parameter**                 | **Description**                                                                                     |
   | ----------------------------- | --------------------------------------------------------------------------------------------------- |
   | **VMO Local Admin User Name** | Username for the local fallback administrator account used when OIDC authentication is unavailable. |
   | **VMO Local Admin Password**  | Password for the local fallback administrator account. This value is stored securely.               |

   :::warning

   Passwords must contain 6 to 64 characters and include at least one uppercase letter, one lowercase letter, one
   number, and one special character.

   :::

   ### Storage

   | **Parameter**                                 | **Description**                                                                                                                                            |
   | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Storage Node Interface**                    | The network interface on each node dedicated to storage replication traffic between nodes. Choose a high-bandwidth interface or bond when possible.        |
   | **Storage Volume Placement Count (Optional)** | Number of copies of each storage volume maintained across different nodes for redundancy. Set to `3` for high availability, or `1` for single-node setups. |

6. On the **Cluster Config** step, enter a virtual IP (VIP) address for your cluster. Optionally, specify an NTP server
   and an SSH public key.

   | **Parameter**                   | **Description**                                                                      |
   | ------------------------------- | ------------------------------------------------------------------------------------ |
   | **Virtual IP Address (VIP)**    | Enter the virtual IP address for the cluster.                                        |
   | **Network Time Protocol (NTP)** | Enter the IP address of an NTP server the cluster can reference.                     |
   | **SSH Keys**                    | Enter the public key of an SSH key pair to use for connecting to the Launchpad host. |

   Optionally, enable network overlay if your cluster operates in a DHCP environment. If you enable the overlay network,
   specify a CIDR range for the overlay network to use.

7. On the **Node Config** step, configure worker pools and control plane pools. To assign a host to a node pool, select
   **Add Item** in the corresponding node pool, and select the host to add. For multi-node clusters, keep the leader
   node assigned to the control plane node pool. Ensure that you have an odd number of nodes in the control plane. After
   the cluster forms, every node in the control plane is considered a leader node.

   For more information about node pool configurations, review
   [Node Pools](../../clusters/cluster-management/node-pool.md). After you finish the configuration, select **Next**.

8. Review your configurations and deploy the cluster. The **Cluster** page displays the deployment status and details.
   Use this page to track deployment progress. The Launchpad for VMs host reboots as part of the build process.
   Depending on your infrastructure environment, the deployment might take up to 45 minutes.

9. After the cluster deployment is complete, more options appear in the left main menu.

   ![Screenshot of appliance](/vmo/vm-management_launchpad-for-vms_install-4-9.webp)

## Validate

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

   <TabItem value="keycloak" label="OIDC Using Keycloak">

   When Keycloak is configured, VMO Manager uses OIDC for authentication.

   1. Select **Login** or go to the platform URL.
   2. The browser redirects you to the Keycloak login page.
   3. Enter your username and password.
   4. After authentication succeeds, the browser redirects you back to VMO Manager.

   </TabItem>

   </Tabs>

3. After you log in, the **Dashboard** is the default landing page.

   ![Screenshot of VMO dashboard](/vmo/vm-management_launchpad-for-vms_default-dashboard-4-9.webp)

   The **Dashboard** contains a set of adjustable, drag-to-reorder widgets.

   | **Widget**                   | **Description**                                                                                                           |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
   | **Overview**                 | KPI cards that show Total VMs, Running, Stopped, Issues, Transitional, and Namespace counts. Select a card to filter VMs. |
   | **Resource Summary**         | CPU and memory cluster usage plus quick links to Data Volumes and Networks.                                               |
   | **VM CPU Usage (Top 10)**    | Defaults to last 1 hour CPU usage by VMs.                                                                                 |
   | **VM Memory Usage (Top 10)** | Defaults to last 1 hour memory usage by VMs.                                                                              |
   | **VM Network I/O**           | Defaults to last 1 hour network usage by VMs.                                                                             |
   | **VM Status Distribution**   | Breakdown of healthy and unhealthy VMs.                                                                                   |
   | **VMs by Namespace**         | Breakdown of VMs by running, stopped, and other statuses.                                                                 |
   | **VM Needing Attention**     | List of unhealthy VMs.                                                                                                    |

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

After you deploy your VMO cluster, [complete the initial configuration of Launchpad for VMs](./getting-started-wiz.md),
and then [create your first VM](./quick-start.md).
