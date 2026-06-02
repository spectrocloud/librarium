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
with Virtual Machine Orchestrator (VMO) preconfigured. Install the appliance on each device that will serve as a node in
your VMO cluster, link the nodes together to form your cluster. After deploying your cluster, follow the
[Create Your First VM](./quick-start.md) guide to deploy your first VM.

## Hardware Requirements

Each device that you install the Launchpad for VMs Appliance ISO on must meet the following hardware requirements.

| **Component**        | **Minimum**                                   | **Recommended**                                    | **Additional Information**                                                                                                                  |
| -------------------- | --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD64 CPU with 8 cores               | Intel or AMD64 CPU with 8 cores                    | -                                                                                                                                           |
| **RAM**              | 24 GB                                         | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                                                              |
| **Network Adapters** | 2 x 1 Gbps (data + management)                | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                                                             |
| **Storage Adapters** | 2 x 16 Gbps FC                                | 2 x 16 Gbps FC                                     | Storage adapters must support the Fibre Channel (FC) protocol, a high-speed network protocol used for data transfer.                        |
| **Disks**            | Local disk of at least 500 GB for the OS boot | Local disk of at least 500 GB for the OS boot      | Storage Area Network (SAN) boot is supported. However, booting from SAN requires special consideration due to the multi-path configuration. |

## Prerequisites

- The network must be configured with a bridge network set to `br0`. For more details on network considerations, refer
  to [VMO Network Configuration Considerations](./vmo-networking.md).

## Hardware Resources

The following sections list the hardware requirements for worker nodes and control plane nodes in a VMO cluster.

| Component            | Minimum                                                               | Recommended                                        | Comments                                                                                             |
| -------------------- | --------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD x64 CPU with 8 cores                                     | Intel or AMD x64 CPU with 8 cores                  |                                                                                                      |
| **RAM**              | 24 GB                                                                 | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                       |
| **Network Adapters** | 2 x 1 Gbps <br /> (data + management)                                 | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                      |
| **Storage Adapters** | 2 x 16 Gbps FC                                                        | 2 x 16 Gbps FC                                     | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk of at least 500 GB for the OS boot (SAN boot is supported) | Local disk of 500 GB for the OS boot               | Boot from SAN requires special consideration due to the multi-path configuration.                    |

## Limitations

## Install Launchpad for VMs

1. Boot your Launchpad for VMs device from the Launchpad for VMs appliance ISO.

2. From the **Launchpad for VMs Interactive Installer** screen, select the disk to install the appliance on. Press
   **ENTER** to proceed to the next screen.

   :::danger

   Ensure you select the correct disk. The installation process will erase all content on the target disk.

   :::

3. On the **Installation Options** screen, select whether the installer should do **nothing**, **reboot**, or
   **poweroff** after the installation is complete. After installation is complete, disconnect the ISO.

4. When the Launchpad for VMs system boots up, press **F2** to open the TUI. Create an OS user with the necessary
   permissions to operate Launchpad for VMs by entering a username and password. Press **ENTER** to progress to the next
   screen.

5. The terminal displays a console where you provide hostname and network configurations for the Edge host.

   Review the existing hostname and, optionally, change it. Use the **TAB** key or the up and down arrow keys to switch
   between fields. Press **ENTER** to apply each change.

6. In **Network Adapter**, select a network adapter to configure. By default, network adapters request an IP address
   automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
   block of each adapter's possible IP address is displayed on the **Network Adapter** screen.

   On the configuration page for each adapter, you can switch the IP addressing scheme from DHCP to static IP. In static
   IP mode, provide a static IP address, subnet mask, and the default gateway address. Specifying a static IP removes
   the existing DHCP settings.

7. (Optional) Specify a Virtual Local Area Network (VLAN) ID on the configuration page of each network adapter. A VLAN
   ID segments network traffic on the same physical network interface for network isolation. If you assign a VLAN ID,
   the Edge host tags all outgoing packets from that adapter with the specified VLAN identifier.

8. (Optional) Specify the Maximum Transmission Unit (MTU) for your network adapter. The MTU defines the largest packet
   size, in bytes, that the interface can send without fragmentation. Press **ENTER** to apply the change.

9. In **DNS Configuration**, specify the IP addresses of the primary and secondary name servers. Optionally, specify a
   search domain. Press **ENTER** to apply the change.

10. After you confirm the configurations, navigate to **Logout** and press **ENTER** to complete the configuration. The
    terminal screen displays the hostname and network information of your Edge host. Verify that all displayed
    information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VMO Appliance host.
   If you have access to the VMO Appliance host terminal, the Local UI address is displayed on the terminal screen. If
   you have changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. On the **Network interfaces** card, navigate to **Bonds** and select **Create**.

4. Fill out the necessary fields on the **Create Bond** screen and **Confirm** your changes.

   | **Parameter**                | **Description**                                                                                  |
   | ---------------------------- | ------------------------------------------------------------------------------------------------ |
   | **Name**                     | Enter a name for the bond. For example, `bond0`.                                                 |
   | **Bond type**                | Select **Static** or **DHCP** for IP address settings.                                           |
   | **Member interfaces**        | Select one or more Network Interface Cards (NICs) for the bond.                                  |
   | **Bonding mode**             | Select the bonding mode for the bond. This should match your physical switch port configuration. |
   | **Link monitoring interval** | Select time in milliseconds.                                                                     |
   | **MTU**                      | Leave the default value or adjust to 9000 for jumbo frames.                                      |
   | **DNS**                      | Enter one or more DNS server IP addresses.                                                       |
   | **IP Address**               | (Static bond only) Enter the IP address for the bond.                                            |
   | **Subnet mask**              | (Static bond only) Enter the subnet mask for the bond.                                           |
   | **Gateway**                  | (Static bond only) Enter the gateway IP address for the bond.                                    |

   :::warning

   This change may result in losing connectivity to Local UI.

   :::

5. On the **Network interfaces** screen, navigate to **Bridges** and select **Create**.

6. Fill out the necessary fields on the **Create Bridge** screen and **Confirm** your changes.

   | **Parameter**         | **Description**                                                   |
   | --------------------- | ----------------------------------------------------------------- |
   | **Name**              | Enter a name for the bridge. For example, `br0`.                  |
   | **Member interfaces** | Select one or more bonds for the bridge.                          |
   | **Config type**       | Select **Static** or **DHCP** for IP address settings.            |
   | **MTU**               | Leave the default value or adjust to 9000 for jumbo frames.       |
   | **DNS**               | Enter one or more DNS server IP addresses.                        |
   | **IP Address**        | (Static bridge only) Enter the IP address for the bridge.         |
   | **Subnet mask**       | (Static bridge only) Enter the subnet mask for the bridge.        |
   | **Gateway**           | (Static bridge only) Enter the gateway IP address for the bridge. |

   :::warning

   This change may result in losing connectivity to Local UI.

   :::

## Create Launchpad for VMs Cluster

1.  Log in to Local UI at `https://<host-ip>:5080`. For more information, refer to
    [Configure Network Settings](#configure-network-settings).

2.  From the left main menu, select **Cluster**.

3.  Select **Create cluster**.

4.  Fill out the **Basic Information** fields and select **Next**.

    | **Parameter**    | **Description**                                         |
    | ---------------- | ------------------------------------------------------- |
    | **Cluster name** | Name of the cluster.                                    |
    | **Tags**         | Key-value pairs to provide metadata about your cluster. |

5.  The default **VMO Appliance full stack** profile loads. The following table describes each pack in the profile.
    After reviewing the cluster profile, select **Next**.

    | **Component**              | **Pack Name**                             | **Purpose**                                                                                                                           |
    | -------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
    | **Edge Native BYOI**       | `edge-native-byoi <version>`              | Native Ubuntu OS.                                                                                                                     |
    | **Kubernetes**             | `edge-k8s <version>`                      | Kubernetes platform.                                                                                                                  |
    | **Cilium**                 | `cni-cilium-fips <version>`               | CNI and network policy. Multus support for VM networking.                                                                             |
    | **Piraeus/LINSTOR**        | `piraeus-operator <version>`              | Storage backend. Provides StorageClass for VM disks (when used).                                                                      |
    | **Zot**                    | `zot-registry-fips <version>`             | OCI registry. Stores container images for airgapped deployments.                                                                      |
    | **Registry Connect**       | `registry-connect <version>`              | Enables seamless integration with OCI-compliant registries.                                                                           |
    | **Required config**        | `required-config-1 <version>`             | Initial configuration before continuing.                                                                                              |
    | **MetalLB**                | `lb-metallb-helm <version>`               | LoadBalancer implementation for bare-metal. Assigns the platform IP.                                                                  |
    | **Traefik**                | `traefik <version>`                       | Single ingress controller. TLS termination, path-based routing, LoadBalancer IP.                                                      |
    | **Required config**        | `required-config-2 <version>`             | Second configuration before continuing.                                                                                               |
    | **Keycloak**               | `keycloak <version>`                      | OIDC identity provider. Handles login, user/group management, and token issuance. Shared `k8s-oidc` client with K8s API and Headlamp. |
    | **Headlamp**               | `headlamp <version>`                      | Kubernetes cluster explorer. Alternative UI for raw K8s resources.                                                                    |
    | **Victoria Metrics**       | `victoria-metrics-cluster <version>`      | Optional long-term metrics storage. PromQL queries when `EXTERNAL_METRICS_URL` is configured.                                         |
    | **OTel Collector**         | `opentelemetry <version>`                 | Metrics pipeline. Receives OTLP from node-agent, forwards to VMO Manager or Victoria Metrics.                                         |
    | **VMO Manager**            | `virtual-machine-orchestrator-v<version>` | Primary UI and API gateway. Manages VMs, templates, golden images, access policies, configuration, and dashboards.                    |
    | **VM Migration Assistant** | `vm-migration-assistant <version>`        | Provides the ability to migrate VMs from VMware vSphere to VMO.                                                                       |

    Additionally, the **VMO Manager** pack bundles the following services.

    | **Component**    | **Pack Name**                             | **Purpose**                                                                                        |
    | ---------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
    | **cert-manager** | `virtual-machine-orchestrator-v<version>` | Issues and renews TLS certificates. Single platform CA for all components.                         |
    | **KubeVirt**     | `virtual-machine-orchestrator-v<version>` | Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
    | **CDI**          | `virtual-machine-orchestrator-v<version>` | Containerized Data Importer. Handles disk image uploads, imports, and clones.                      |

6.  Fill out the **Profile Config** page and select **Next**.

<!-- vale off -->

      | **Parameter**                              | **Description**                                                                                                                         |
      | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
      | **Pod CIDR**                               | CIDR range for Kubernetes Pods network.                                                                                                 |
      | **Service CIDR**                           | CIDR range for Kubernetes Services network.                                                                                             |
      | **Ubuntu Pro Token**                       | (Optional) Leave blank or enter an Ubuntu Pro token value.                                                                              |
      | **Reserved CPUs for kubelet and system**   | CPUs to reserve for kubelet and OS use.                                                                                                 |
      | **CSI Placement Count**                    | (Optional) Number of replicas to be created for CSI volumes across nodes.                                                               |
      | **L2 Pod Announcement Interface**          | Interface to send ARP pod announcements on. For example, `br0`.                                                                         |
      | **OCI Pack Registry Username**             | Username for the OCI Pack Registry.                                                                                                     |
      | **Platform CA Certificate**                | Base64 encoded value for your CA certificate.                                                                                           |
      | **Platform CA Private Key**                | Base64 encoded value for your private key.                                                                                              |
      | **OIDC Login Username**                    | Username for the cluster admin OIDC login.                                                                                              |
      | **OIDC Login Email**                       | Email address to use for OIDC login.                                                                                                    |
      | **Local Admin User Name**                  | Username to use for the local admin account.                                                                                            |
      | **VLAN range for VMs**                     | VLANs to use for VMs. VLAN 1 is designated as default native VLAN.                                                                      |
      | **Cluster runs on br0**                    | (Optional) Allow the cluster to run on `br0`.                                                                                           |
      | **VLANs on top of br0**                    | VLANs to use on `br0`. VLAN 1 is designated as default native VLAN and must always be included.                                         |
      | **Victoria Metrics Data Retention Period** | Value in (h)ours, (d)days, (w)eeks, months (no character value) or (y)ears. Minimum value is `24h`.                                     |
      | **Victoria Metrics Volume Storage Size**   | (Optional) Size in gigabytes (`Gi`).                                                                                                    |
      | **MetalLB interface**                      | NIC that uses L2 advertisements.                                                                                                        |
      | **MetalLB IP Address**                     | IP address for MetalLB to use.                                                                                                          |
      | **Default Keycloak Admin Password**        | Initial password for Keycloak admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.    |
      | **Local Admin Password**                   | Initial password for local admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.       |
      | **OIDC Login Password**                    | Initial password for OIDC account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.              |
      | **OCI Pack Registry Password**             | Initial password for OCI Pack Registry account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character. |
      | **Default Keycloak Admin Username**        | (Optional) Username for the Keycloak admin login.                                                                                       |
      | **LINSTOR Node Interface**                 | Node network interface to use for storage replication.                                                                                  |
      | **Storage Pool Drive**                     | Storage path to use.                                                                                                                    |

    <details>

    <summary>Generate Your Own Self-Signed Certificates</summary>

    If you do not have a certificate server, you can generate your own self-signed certificates.

    <Tabs>

    <TabItem value="mac" label="Mac">

    1. Open a terminal window and use the following command to generate a private key.

       ```bash
       openssl genrsa -out ca.key 4096
       ```

       This generates the file `ca.key`. Store this private key in a secure location.

    2. Generate a self-signed CA certificate.

       ```bash
       openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
       ```

       This generates the file `ca.crt`, the CA certificate in PEM format.

    3. Generate the base64 values using the following commands.

       ```bash
       base64 --ignore-garbage ca.crt -o ca.crt.b64
       base64 --ignore-garbage ca.key -o ca.key.b64
       ```

       Alternatively, to print the base64 output to the screen, use the following commands.

       ```bash
       base64 < ca.crt
       base64 < ca.key
       ```

    </TabItem>

    <TabItem value="linux" label="Linux">

    1. Open a terminal window and use the following command to generate a private key.

       ```bash
       openssl genrsa -out ca.key 4096
       ```

       This generates the file `ca.key`. Store this private key in a secure location.

    2. Generate a self-signed CA certificate.

       ```bash
       openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
       ```

       This generates the file `ca.crt`, the CA certificate in PEM format.

    3. Generate the base64 values using the following commands. The `-w 0` flag disables line wrapping.

       ```bash
       base64 --wrap 0 ca.crt > ca.crt.b64
       base64 --wrap 0 ca.key > ca.key.b64
       ```

       Alternatively, to print the base64 output to the screen, use the following commands. The `-w 0` flag disables
       line wrapping.

       ```bash
       base64 --wrap 0 < ca.crt
       base64 --wrap 0 < ca.key
       ```

    </TabItem>

    <TabItem value="windows" label="Windows">

    1. Open a terminal window and use the following command to generate a private key.

       ```cmd
       openssl genrsa -out ca.key 4096
       ```

       This generates the file `ca.key`. Store this private key in a secure location.

    2. Generate a self-signed CA certificate.

       ```cmd
       openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
       ```

       This generates the file `ca.crt`, the CA certificate in PEM format.

    3. Generate the base64 values using the following commands.

       ```powershell
       [Convert]::ToBase64String([IO.File]::ReadAllBytes("ca.crt"))
       [Convert]::ToBase64String([IO.File]::ReadAllBytes("ca.key"))
       ```

    </TabItem>

    </Tabs>

    </details>

<!-- vale on -->

7.  On the **Cluster Config** step, enter a virtual IP (VIP) address for your cluster. Optionally, specify an NTP server
    and an SSH public key.

    | **Parameter**                   | **Description**                                                                 |
    | ------------------------------- | ------------------------------------------------------------------------------- |
    | **Virtual IP Address (VIP)**    | Enter the virtual IP address for the cluster.                                   |
    | **Network Time Protocol (NTP)** | Enter the IP address of an NTP server the cluster can reference.                |
    | **SSH Keys**                    | Enter the public key of an SSH key pair to use for connecting to the Edge host. |

    Optionally, enable network overlay if your cluster operates in a DHCP environment. If you enable the overlay
    network, specify a CIDR range for the overlay network to use.

8.  On the **Node Config** step, configure worker pools and control plane pools. To assign a host to a node pool, select
    **Add Item** in the corresponding node pool and select the host to add. For multi-node clusters, the leader node is
    a mandatory control plane node and cannot be unassigned. Ensure that you have an odd number of nodes in the control
    plane. After the cluster is formed, every node in the control plane is considered a leader node.

    For more information about node pool configurations, refer to
    [Node Pools](../../clusters/cluster-management/node-pool.md). After you finish the configuration, select **Next**.

9.  Review your configurations and deploy the cluster. The status and details of the deployment are displayed on the
    **Cluster** page. Use this page to track deployment progress. The Launchpad for VMs host reboots as part of the
    build process.

10. After the cluster deployment is complete, additional options appear in the left sidebar.

    ![screenshot of appliance](/vmo/vm-management_vmo_appliance-install-4-9.webp)

## Validate

1. From left-side menu in the Launchpad for VMs appliance, click **VM Orchestrator**. Alternatively, in your browser,
   you can navigate to the address you provided for MetalLB.

2. Log in to VMO Manager.

   <Tabs>

   <TabItem value="local-auth" label="Local Auth (Day-0)">

   Before Keycloak is configured, use local admin accounts.

   1. Navigate to `https://<vmo-address>/local-login`.
   2. Enter the local admin username (default: `admin`) and the password you configured during cluster creation.
   3. Enter a new password and confirm the new password.
   4. Select **Set New Password**.

   </TabItem>

   <TabItem value="keycloak" label="OIDC using Keycloak">

   When Keycloak is configured, VMO Manager uses OIDC for authentication.

   1. Select **Login** or navigate to the platform URL.
   2. The browser redirects you to the Keycloak login page.
   3. Enter your username and password.
   4. After successful authentication, the browser redirects you back to VMO Manager.

   </TabItem>

   </Tabs>
   <!-- vale off -->

3. After logging in, the **Dashboard** is the default landing page.

   ![screenshot of VMO dashboard](/vmo/vm-management_vmo_appliance-default-dashboard-4-9.webp)

   The **Dashboard** contains a set of adjustable, drag-to-reorder widgets.

   | **Widget**                   | **Description**                                                                                                         |
   | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
   | **Overview**                 | KPI cards showing Total VMs, Running, Stopped, Issues, Transitional, and Namespace counts. Select a card to filter VMs. |
   | **Resource Summary**         | CPU and memory cluster utilization plus quick links to Data Volumes and Networks.                                       |
   | **VM CPU USAGE (TOP 10)**    | Defaults to last 1 hour CPU usage by VMs.                                                                               |
   | **VM MEMORY USAGE (TOP 10)** | Defaults to last 1 hour memory usage by VMs.                                                                            |
   | **VM NETWORK I/O**           | Defaults to last 1 hour network usage by VMs.                                                                           |
   | **VM STATUS DISTRIBUTION**   | Breakdown of healthy and unhealthy VMs.                                                                                 |
   | **VMS BY NAMESPACE**         | Breakdown of VMs by running, stopped, and other statuses.                                                               |
   | **VM NEEDING ATTENTION**     | List of unhealthy VMs.                                                                                                  |

### Auto-Refresh and Pause

The dashboard polls the API and metrics backend on a configurable interval (5 seconds, 15 seconds, or 30 seconds). Use
the **interval selector** in the toolbar to change the cadence. Select **Pause** to stop all background polling, which
is useful when inspecting data or troubleshooting. Select **Resume** to restart polling.

### Customize the Layout

You can customize the interface by dragging widget headers to reorder widgets within the grid, resizing widgets from
their bottom-right corner handle, and adding or removing widgets with the **+** button in the toolbar. Select **Reset
Layout** to return all widgets to the default arrangement. Layout changes save automatically and persist across
sessions.

<!-- vale on -->

## Next Steps

After you deploy your VMO cluster, follow the [Create Your First VM](./quick-start.md) guide to deploy your first VM.
