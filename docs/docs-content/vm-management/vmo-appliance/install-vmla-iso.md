---
sidebar_label: "Install VM Launchpad"
title: "Install VM Launchpad"
description: "Learn how to install VM Launchpad"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad"]
---

The VM Launchpad appliance is downloadable as a bootable ISO file and is a solution for installing Virtual Machine Orchestrator (VMO) as an Edge deployment. Once deployed, you can use the [Quick Start](./quick-start.md) guide to deploy your first VM. 

## Prerequisites

- The network must be configured with a bridge network set to `br0`. 

## Hardware Resources

The following sections list the hardware requirements for worker nodes and control plane nodes in a VMO cluster.

| Component            | Minimum             | Recommended                                        | Comments               |
| -------------------- | ------------------- | -------------------------------------------------- | ---------------------- | 
| **CPU**              | Intel or AMD x64 CPU with 8 cores  | Intel or AMD x64 CPU with 8 cores             |              |
| **RAM**              | 24 GB    | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.  |
| **Network Adapters** | 2 x 1 Gbps <br /> (data + management)                         | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.  |
| **Storage Adapters** | 2 x 16 Gbps FC  | 2 x 16 Gbps FC                              | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk of at least 500GB for the OS boot (SAN boot is supported)   | Local disk of 500 GB for the OS boot  | Boot from SAN requires special consideration due to the multi-path configuration.  |

## Limitations

## Installing VM Launchpad 

1. Boot your VM Launchpad system from the ISO. 

2. From the VM Launchpad Interactive Installer page, select the target disk for installation, and click **Enter** on your keyboard to go to the next screen.

:::danger

Ensure you are selecting the correct disk. The installation process will completely erase all content on the target disk. 

:::

3. On the **Installation Options** page, you can select whether the installer should do **nothing**, **reboot**, or **poweroff** after installation is complete. Once installation is complete, remember to disconnect the ISO.

4. When VM Launchpad system boots up, press **F2** to open the TUI. This allows you to create an OS user with the necessary permissions to operate VM Launchpad. Enter a username and password to create a new user and press the **ENTER** key to progress to the next screen.

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
    configuration. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host. Verify that all displayed information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://HOST_IP:5080`. Replace `HOST_IP` with the IP address of your VMO Appliance host. If you have
   access to the VMO Appliance host terminal, the address of Local UI console is displayed on the terminal screen. If you have
   changed the default port of the console, replace `5080` with Local UI port.

2. You will be prompted to log in. Enter your username and password to log in.

3. On the **Network interfaces** card, navigage to **Bridges** and click **Create**.

4. **MAGIC**

## Creating VM Launchpad cluster

1. 1. Log in to Local UI by visiting the 5080 port of your Edge device's IP address or domain name. For more information,
   refer to [Configure Network Settings](#configure-network-settings).

2. From the left main menu, click **Cluster**.

3. Click **Create cluster**.

4. Fill out **Basic Information** such as cluster name and tag. Click **Next**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | Cluster name | Name of the cluster.                                    |
   | Tags         | Key-value pairs to provide metadata about your cluster. |

5. The default **VMO Appliance full stack** profile will load. The following table explains what each pack in the profile is for. 

   | Component |   Pack Name    | Purpose |
   |-----------|---------|---------|
   | **Edge Native BYOI** | `edge-native-byoi <version>`   | Native Ubuntu OS. |
   | **Kubernetes** | `edge-k8s <version>`   | Kubernetes platform |
   | **Cilium** | `cni-cilium-fips <version>`   |CNI and network policy. Multus support for VM networking. |
   | **Piraeus/LINSTOR** | `piraeus-operator <version>`   | Storage backend. Provides StorageClass for VM disks (when used). |
   | **Zot** | `zot-registry-fips <version>`   |OCI registry. Stores container images for air-gapped deployments. |
   | **Registry Connect** | `registry-connect <version>`   | Enables seamless integration with OCI-compliant registries. |
   | **Required config** | `required-config-1 <version>`   | Initial configuration before continuing |
   | **MetalLB** | `lb-metallb-helm <version>`   |LoadBalancer implementation for bare-metal. Assigns the platform IP. |
   | **Traefik** | `traefik <version>`   |Single ingress controller. TLS termination, path-based routing, LoadBalancer IP. |
   | **Required config** | `required-config-2 <version>`   | Second configuration before continuing |
   | **Keycloak** |`keycloak <version>`   | OIDC identity provider. Handles login, user/group management, and token issuance. Shared `k8s-oidc` client with K8s API and Headlamp. |
   | **Headlamp** | `headlamp <version>`   |Kubernetes cluster explorer. Alternative UI for raw K8s resources. |
   | **Victoria Metrics** | `victoria-metrics-cluster <version>`   |Optional long-term metrics storage. PromQL queries when `EXTERNAL_METRICS_URL` is configured. |
   | **OTel Collector** | `opentelemetry <version>`   |Metrics pipeline. Receives OTLP from node-agent, forwards to VMO Manager or Victoria Metrics. |
   | **VMO Manager** | `virtual-machine-orchestrator-v<version>`   | Primary UI and API gateway. Go backend + React frontend. Manages VMs, templates, golden images, access policies, config, and dashboards. |
   | **VM Migration Assistant** | `vm-migration-assistant <version>`   | Provides the ability to migrate VMs from VMware vSphere to VMO. |

   Additionally, within the **VMO Manager** the following services exist. 

   | Component |       | Purpose |
   |-----------|---------|---------|
   | **cert-manager** |`virtual-machine-orchestrator-v<version>`   | Issues and renews TLS certificates. Single platform CA for all components. |
   | **KubeVirt** | `virtual-machine-orchestrator-v<version>`   |Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
   | **CDI** | `virtual-machine-orchestrator-v<version>`   |Containerized Data Importer. Handles disk image uploads, imports, and clones. |
   
   After you finish configuring the cluster profile, click **Next**.

6. If your selected cluster profile has Cluster Profile Variables,
   you are prompted to enter the values for those profile variables. Variables with default values are auto-populated.

   Enter the values for the profile variables and click **Next**.

7. In the **Cluster Config** step, enter a virtual IP address to be used by your cluster. Optionally, you can also
   specify an NTP server and an SSH public key.

   | Parameter                   | Description                                                                              |
   | --------------------------- | ---------------------------------------------------------------------------------------- |
   | Virtual IP Address (VIP)    | Provide the virtual IP address to be used by the cluster.                                |
   | Network Time Protocol (NTP) | Specify the IP address for any NTP servers the cluster can reference.                    |
   | SSH Keys                    | Provide the public key of an SSH key pair that you will use to connect to the Edge host. |

   Optionally, you can also enable network overlay, especially if your cluster will operate in an DHCP environment. For
   more information, refer to [Enable Overlay Network]. If you enable the overlay
   network, you need to specify a CIDR range to be used by the overlay network.

8. In the **Node Config** step, you can specify configurations for worker pools and control plane pools. To assign a
   host to a node pool, click **Add Edge Hosts** in the corresponding node pool and select the host to add to the pool.
   For multi-node clusters, the leader node is a mandatory control plane node and cannot be unassigned. Additionally,
   you must ensure that you have an odd number of nodes in the control plane. Once a cluster is formed, every node in
   the control plane will be considered a leader node.

   For more information about node pool configurations, refer to [Node pools].
   After you finish configuration, click **Next**.

9. Review your configurations and deploy the cluster. As your cluster begins to deploy, the status and details of the
   deployment are displayed in the **Cluster** page. Use this page to track the deployment progress.


## Validate

1. 

## Next Steps

Once you have built your VMO cluster, you can start deploying VMs by following the [Quick Start](quick-start.md) steps. 