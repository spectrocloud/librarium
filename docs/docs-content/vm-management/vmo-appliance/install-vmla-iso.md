---
sidebar_label: "Install VM Launchpad"
title: "Install VM Launchpad"
description: "Learn how to install VM Launchpad"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad"]
---

The VM Launchpad appliance is downloadable as a bootable ISO file and is the recommended method for creating an Edge
cluster with Virtual Machine Orchestrator (VMO) preconfigured. After installing the appliance on each device that will
be used as a node in your VMO cluster, link the nodes and form your cluster. Once deployed, you can use the
[Quick Start](./quick-start.md) guide to deploy your first VM.

## Hardware Requirements

Each device that you are installing the VM Launchpad appliance ISO on must meet the following hardware requirements.

| Component            | Minimum                                       | Recommended                                        | Comments                                                                                                                                    |
| -------------------- | --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD64 CPU with 8 cores               | Intel or AMD64 CPU with 8 cores                    |                                                                                                                                             |
| **RAM**              | 24 GB                                         | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                                                              |
| **Network Adapters** | 2 x 1 Gbps (data + management)                | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                                                             |
| **Storage Adapters** | 2 x 16 Gbps FC                                | 2 x 16 Gbps FC                                     | Storage adapters must support the Fibre Channel (FC) protocol, a high-speed network protocol used for data transfer.                        |
| **Disks**            | Local disk of at least 500 GB for the OS boot | Local disk of at least 500 GB for the OS boot      | Storage Area Network (SAN) boot is supported. However, booting from SAN requires special consideration due to the multi-path configuration. |

## Prerequisites

- The network must be configured with a bridge network set to `br0`.

## Install VM Launchpad

1. Boot your Edge device from the VM Launchpad appliance ISO.

2. From the **VM Launchpad Interactive Installer** screen, select the disk to install the appliance on. Press **ENTER**
   to proceed to the next screen.

   :::danger

   Ensure you select the correct disk. The installation process will erase all content on the target disk.

   :::

3. On the **Installation Options** screen, choose whether the installer should do **nothing**, **reboot**, or
   **poweroff** after the installation is complete. Once installation is complete, remember to disconnect the ISO.

4. When VM Launchpad system boots up, press **F2** to open the TUI. This allows you to create an OS user with the
   necessary permissions to operate VM Launchpad. Enter a username and password to create a new user and press the
   **ENTER** key to progress to the next screen.

5. The terminal displays a console for you to provide hostname and network configurations to the Edge host.

   Check the existing hostname and, optionally, change it to a new one. Use the **TAB** key or the up and down arrow
   keys to switch between fields. When you make a change, press **ENTER** to apply the change.

6. In **Network Adapter**, select a network adapter to configure. By default, the network adapters request an IP
   automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
   block of an adapter's possible IP address is displayed in the **Network Adapter** screen without selecting an
   individual adapter.

   On the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you need to provide a static IP address, subnet mask, as well as the address
   of the default gateway. Specifying a static IP removes the existing DHCP settings.

7. On the configuration page of each network adapter, you can also specify the VLAN ID. A VLAN ID enables you to
   logically segment network traffic on the same physical network interface, providing network isolation and enhanced
   traffic management. If you assign a VLAN ID, the Edge host tags all outgoing packets from that adapter with the
   specified VLAN identifier.

8. Additionally, you can specify the Maximum Transmission Unit (MTU) for your network adapter. The MTU defines the
   largest size, in bytes, of a packet that can be sent over a network interface without needing to be fragmented. Press
   **ENTER** to apply the change.

9. In **DNS Configuration**, specify the IP address of the primary and secondary name servers. You can optionally also
   specify a search domain. Press **ENTER** to apply the change.

10. After you are satisfied with the configurations, navigate to **Logout** and press **ENTER** to complete the
    configuration. Shortly after you finish configuration, the terminal screen will display the hostname and network
    information of your Edge host. Verify that all displayed information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your VMO Appliance host. If
   you have access to the VMO Appliance host terminal, the address of Local UI console is displayed on the terminal
   screen. If you have changed the default port of the console, replace `5080` with Local UI port.

2. You will be prompted to log in. Enter your username and password to log in.

3. On the **Network interfaces** card, navigage to **Bonds** and click **Create**.

4. Fill out **Create Bond**, and click **Confirm**.

   | Parameter                           | Description                                                                                      |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
   | Name                                | Enter name for the bond.                                                                         |
   | Bond type                           | Select **Static** or **DHCP** for IP address settings. For example, `bond0`.                     |
   | Member interfaces                   | Select one or more NICs for the bond.                                                            |
   | Bonding mode                        | Select the bonding mode for the bond. This should match your physical switch port configuration. |
   | Link monitoring interval            | Select time in milliseconds.                                                                     |
   | MTU                                 | Leave default value or adjust to 9000 for jumbo frames                                           |
   | DNS                                 | Enter one or more DNS server IP addresses                                                        |
   | IP Address (only with Static bond)  | Enter the IP address for the bond                                                                |
   | Subnet mask (only with Static bond) | Enter the subnet mask for the bond                                                               |
   | Gateway (only with Static bond)     | Enter the gateway IP address for the bond                                                        |

   This change may result in losing connectivity to the Local UI.

5. On the **Network interfaces** card, navigage to **Bridges** and click **Create**.

6. Fill out **Create Bond**, and click **Confirm**.

   | Parameter                             | Description                                                                |
   | ------------------------------------- | -------------------------------------------------------------------------- |
   | Name                                  | Enter name for the bridge.                                                 |
   | Member interfaces                     | Select one or more bonds for the bridge.                                   |
   | Config type                           | Select **Static** or **DHCP** for IP address settings. For example, `br0`. |
   | MTU                                   | Leave default value or adjust to 9000 for jumbo frames                     |
   | DNS                                   | Enter one or more DNS server IP addresses                                  |
   | IP Address (only with Static bridge)  | Enter the IP address for the bridge                                        |
   | Subnet mask (only with Static bridge) | Enter the subnet mask for the bridge                                       |
   | Gateway (only with Static bridge)     | Enter the gateway IP address for the bridge                                |

   This change may result in losing connectivity to the Local UI.

## Creating VM Launchpad cluster

1.  1. Log in to Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more
       information, refer to [Configure Network Settings](#configure-network-settings).

2.  From the left main menu, click **Cluster**.

3.  Click **Create cluster**.

4.  Fill out **Basic Information** such as cluster name and tag. Click **Next**.

    | Parameter    | Description                                             |
    | ------------ | ------------------------------------------------------- |
    | Cluster name | Name of the cluster.                                    |
    | Tags         | Key-value pairs to provide metadata about your cluster. |

5.  The default **VMO Appliance full stack** profile will load. The following table explains what each pack in the
    profile is for. After reviewing the cluster profile, click **Next**.

    | Component                  | Pack Name                                 | Purpose                                                                                                                                  |
    | -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
    | **Edge Native BYOI**       | `edge-native-byoi <version>`              | Native Ubuntu OS.                                                                                                                        |
    | **Kubernetes**             | `edge-k8s <version>`                      | Kubernetes platform                                                                                                                      |
    | **Cilium**                 | `cni-cilium-fips <version>`               | CNI and network policy. Multus support for VM networking.                                                                                |
    | **Piraeus/LINSTOR**        | `piraeus-operator <version>`              | Storage backend. Provides StorageClass for VM disks (when used).                                                                         |
    | **Zot**                    | `zot-registry-fips <version>`             | OCI registry. Stores container images for air-gapped deployments.                                                                        |
    | **Registry Connect**       | `registry-connect <version>`              | Enables seamless integration with OCI-compliant registries.                                                                              |
    | **Required config**        | `required-config-1 <version>`             | Initial configuration before continuing                                                                                                  |
    | **MetalLB**                | `lb-metallb-helm <version>`               | LoadBalancer implementation for bare-metal. Assigns the platform IP.                                                                     |
    | **Traefik**                | `traefik <version>`                       | Single ingress controller. TLS termination, path-based routing, LoadBalancer IP.                                                         |
    | **Required config**        | `required-config-2 <version>`             | Second configuration before continuing                                                                                                   |
    | **Keycloak**               | `keycloak <version>`                      | OIDC identity provider. Handles login, user/group management, and token issuance. Shared `k8s-oidc` client with K8s API and Headlamp.    |
    | **Headlamp**               | `headlamp <version>`                      | Kubernetes cluster explorer. Alternative UI for raw K8s resources.                                                                       |
    | **Victoria Metrics**       | `victoria-metrics-cluster <version>`      | Optional long-term metrics storage. PromQL queries when `EXTERNAL_METRICS_URL` is configured.                                            |
    | **OTel Collector**         | `opentelemetry <version>`                 | Metrics pipeline. Receives OTLP from node-agent, forwards to VMO Manager or Victoria Metrics.                                            |
    | **VMO Manager**            | `virtual-machine-orchestrator-v<version>` | Primary UI and API gateway. Go backend + React frontend. Manages VMs, templates, golden images, access policies, config, and dashboards. |
    | **VM Migration Assistant** | `vm-migration-assistant <version>`        | Provides the ability to migrate VMs from VMware vSphere to VMO.                                                                          |

    Additionally, within the **VMO Manager** the following services exist.

    | Component        |                                           | Purpose                                                                                            |
    | ---------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
    | **cert-manager** | `virtual-machine-orchestrator-v<version>` | Issues and renews TLS certificates. Single platform CA for all components.                         |
    | **KubeVirt**     | `virtual-machine-orchestrator-v<version>` | Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
    | **CDI**          | `virtual-machine-orchestrator-v<version>` | Containerized Data Importer. Handles disk image uploads, imports, and clones.                      |

6.  Fill out the **Profile Config** page, and click **Next**.

        | Parameter                                       | Description                                                                                                                                            |
        | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
        | Pod CIDR                                        | Leave the default value or enter a CIDR range for Kubernetes Pods network.                                                                             |
        | Service CIDR                                    | Leave the default value or enter a CIDR range for Kubernetes Services network.                                                                         |
        | Ubuntu Pro Token (Optional)                     | Leave blank or enter an Ubuntu Pro token value                                                                                                         |
        | Reserved CPUS for kubelet and system            | Leave the default value or to set which CPUs should be reserved for kubelet and OS use.                                                                |
        | CSI Placement Count (Optional)                  | Leave the default or enter the number of replicas to be created for CSI volumes across nodes.                                                          |
        | L2 Pod Announcement Interface                   | Enter the interface to send ARP pod Announcements on. For exmaple, `br0`.                                                                              |
        | OCI Pack Registry Username                      | Leave the default value or enter the username for the OCI Pack Registry.                                                                               |
        | Platform CA Certificate                         | Enter the base64 encoded value for your CA certificate.                                                                                                |
        | Platform CA Private Key                         | Enter the base64 encoded value for your private key.                                                                                                   |
        | OIDC Login Username                             | Leave the default value or enter a username for the cluster admin OIDC login.                                                                          |
        | OIDC Login Email                                | Leave the default value or enter the email address to use for OIDC login.                                                                              |
        | Local Admin User Name                           | Leave the default value or enter the username to use for the local admin account.                                                                      |
        | VLAN range for VMs                              | Leave the default value or enter the VLANs that will be used. VLAN 1 is designated as default native VLAN.                                             |
        | Cluster runs on br0 (Optional)                  | Leave default or toggle to allow the cluster to run on `br0`.                                                                                          |
        | VLANs on top of br0                             | Leave the default value or enter the VLANs that will be used. VLAN 1 is designated as default native VLAN, and must always be included.                |
        | Victoria Metrics Data Retention Period          | Leave the default or enter an appropriate value in (h)ours, (d)days, (w)eeks, months (there is no character value) or (y)ears. Minimum value is `24h`. |
        | Victoria Metrics Volume Storage Size (Optional) | Leave the default value or enter the size in gigabytes (`Gi`).                                                                                         |
        | MetalLB interface                               | Leave the default value or enter the NIC that uses L2 advertisements.                                                                                  |
        | MetalLB IP Address                              | Enter the IP address that the MetalLB will use.                                                                                                        |
        | Default Keycloak Admin Password                 | Initial password for Keycloak admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.                    |
        | Local Admin Password                            | Initial password for local admin account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.                       |
        | OIDC Login Password                             | Initial password for OIDC account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.                              |
        | OCI Pack Registry Password                      | Initial password for OCI Pack Registry account. Must have 6-64 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.                 |
        | Default Keycloak Admin Username (Optional)      | Leave the default value or enter a username for the Keycloak admin login.                                                                              |
        | listorNodeInterface                             | Leave the default value or enter the NIC which node network interface to use for replication.                                                          |
        | Storage Pool Drive                              | Leave the default value or enter the storage path to use.                                                                                              |

      <details>

    <summary>Generate Your own Self-Signed Certificates</summary>

        If you do not have a certificate server you can generate your own self-signed certificates.

              <Tabs>

              <TabItem label="Mac" value="mac">

                  1.  Open a terminal window and use the following command to generate a private key.

                        ```bash
                        openssl genrsa -out ca.key 4096
                        ```

                        This generates the file `ca.key`. This will be the private key and should be kept in a secure location.

                  2.  Generate a self-signed CA certificate.

                        ```bash
                        openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
                        ```

                        This generates the file `ca.crt`. This will be the CA certificate in PEM format.

                  3.  You can generate the Base64 values by using the following commands.

                        ```bash
                        base64 -i ca.crt -o ca.crt.b64
                        base64 -i ca.key -o ca.key.b64
                        ```

                        Alternatively, if you want to print the base64 output to screen use the following commands.

                        ```bash
                        base64 < ca.crt
                        base64 < ca.key
                        ```

               </TabItem>

               <TabItem label="Linux" value="linux">

                  4.  Open a terminal window and use the following command to generate a private key.

                        ```bash
                        openssl genrsa -out ca.key 4096
                        ```

                        This generates the file `ca.key`. This will be the private key and should be kept in a secure location.

                  5.  Generate a self-signed CA certificate.

                        ```bash
                        openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
                        ```

                        This generates the file `ca.crt`. This will be the CA certificate in PEM format.

                  6.  You can generate the Base64 values by using the following commands. The `-w 0` flag disables line wrapping.

                        ```bash
                        base64 -w 0 ca.crt > ca.crt.b64
                        base64 -w 0 ca.key -o ca.key.b64
                        ```

                        Alternatively, if you want to print the base64 output to screen use the following commands. The `-w 0` flag
                        disables line wrapping.

                        ```bash
                        base64 -w 0 < ca.crt
                        base64 -w 0 < ca.key
                        ```

               </TabItem>

               <TabItem label="Windows" value="windows">

                  7.  Open a terminal window and use the following command to generate a private key.

                        ```cmd
                        openssl genrsa -out ca.key 4096
                        ```

                        This generates the file `ca.key`. This will be the private key and should be kept in a secure location.

                  8.  Generate a self-signed CA certificate.

                        ```cmd
                        openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
                        ```

                        This generates the file `ca.crt`. This will be the CA certificate in PEM format.

                  9.  You can generate the Base64 values by using the following commands.

                              ```PowerShell
                              [Convert]::ToBase64String([IO.File]::ReadAllBytes("ca.crt"))
                              [Convert]::ToBase64String([IO.File]::ReadAllBytes("ca.key"))
                              ```

             </TabItem>

            </Tabs>

      </details>

7.  In the **Cluster Config** step, enter a virtual IP address to be used by your cluster. Optionally, you can also
    specify an NTP server and an SSH public key.

    | Parameter                   | Description                                                                              |
    | --------------------------- | ---------------------------------------------------------------------------------------- |
    | Virtual IP Address (VIP)    | Provide the virtual IP address to be used by the cluster.                                |
    | Network Time Protocol (NTP) | Specify the IP address for any NTP servers the cluster can reference.                    |
    | SSH Keys                    | Provide the public key of an SSH key pair that you will use to connect to the Edge host. |

    Optionally, you can also enable network overlay, especially if your cluster will operate in an DHCP environment. For
    more information, refer to [Enable Overlay Network]. If you enable the overlay network, you need to specify a CIDR
    range to be used by the overlay network.

8.  In the **Node Config** step, you can specify configurations for worker pools and control plane pools. To assign a
    host to a node pool, click **Add Item** in the corresponding node pool and select the host to add to the pool. For
    multi-node clusters, the leader node is a mandatory control plane node and cannot be unassigned. Additionally, you
    must ensure that you have an odd number of nodes in the control plane. Once a cluster is formed, every node in the
    control plane will be considered a leader node.

    For more information about node pool configurations, refer to
    [Node pools](../../clusters/cluster-management/node-pool.md). After you finish configuration, click **Next**.

9.  Review your configurations and deploy the cluster. As your cluster begins to deploy, the status and details of the
    deployment are displayed in the **Cluster** page. Use this page to track the deployment progress. The VM Launchpad
    host will reboot as part of the build process.

10.

## Validate

1.

## Next Steps

Once you have built your VMO cluster, you can start deploying VMs by following the [Quick Start](quick-start.md) steps.
