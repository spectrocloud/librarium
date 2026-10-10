---
sidebar_label: "Install VM Launchpad"
title: "Install VM Launchpad"
description: "Learn how to install the VM Launchpad on bare metal or Edge devices."
icon: " "
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "VM Launchpad"]
---

PaletteAI VM Launchpad is a bootable ISO that you install on bare metal or Edge devices to create a cluster with Virtual
Machine Orchestrator (VMO) preconfigured. Install the appliance on each device that serves as a node in your VMO
cluster, and link the nodes together to form your cluster. After you deploy your cluster, log into VM Launchpad to do an
[initial configuration](./getting-started-wiz.md), and [create your first VM](./quick-start.md).

## Hardware Requirements

Each device where you install the VM Launchpad ISO must meet the following hardware requirements.

| **Component**        | **Minimum**                                                       | **Recommended**                                                    | **Additional Information**                                                                                             |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **CPU**              | Intel or AMD64 CPU with 8 cores                                   | Intel or AMD64 CPU with 8 cores                                    | -                                                                                                                      |
| **RAM**              | 24 GB                                                             | 256 GB or more                                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                                         |
| **Network Adapters** | 4 x 1 Gbps <br /> (2 bonded for management, 2 bonded for VM data) | 4 x 10 Gbps <br /> (2 bonded for management, 2 bonded for VM data) | Cilium bridges VMs onto the data NICs. Review [Network Configuration Considerations](./vmo-networking.md) for details. |
| **Disks**            | Local disk of at least 750 GB for the OS boot                     | Local disk of at least 750 GB for the OS boot                      | Provision at least 750 GB before you install the appliance. The installer partitions this disk automatically.          |

:::info

**Advanced storage configuration.** If only two network adapters are available, you can deploy with two NICs bonded for
all traffic plus two 16 Gbps Fiber Channel (FC) adapters dedicated to storage. FC-attached storage can also serve as raw
disks for Piraeus consumption without a CSI driver, though this is not the typical configuration. Refer to
[Network Configuration Considerations](./vmo-networking.md) for supported layouts.

:::

## Prerequisites

:::warning

Plan your host network layout **before** you install the appliance. VM Launchpad supports specific bond, bridge, and
VLAN configurations, and network changes are difficult to make after installation. Review
[Network Configuration Considerations](./vmo-networking.md) to choose a supported layout and prepare your switch port
configuration.

:::

- Configure the host network with a `br0` bridge that matches one of the supported layouts described in
  [Network Configuration Considerations](./vmo-networking.md).

- Reserve a virtual IP address (VIP) for the VM Launchpad management cluster. The VM Launchpad installation process
  assigns the VIP and uses it for load balancing and high availability. Ensure all nodes in the VM Launchpad management
  cluster can access the VIP.

- If you have an [Ubuntu Pro](https://ubuntu.com/pro) subscription, you can provide the Ubuntu Pro token during the VM
  Launchpad installation process. This is optional but recommended for security and compliance purposes.

- <PartialsComponent category="self-hosted" name="installation-steps-secure-boot" edition="VM Launchpad" />

## Install VM Launchpad {#install}

1. Navigate to [Artifact Studio](https://artifact-studio.spectrocloud.com/) to download the **VM Launchpad** ISO.

2. In the **VM Launchpad** section, use the drop-down menu to select the version and appliance variant, and select
   **Show Artifacts**.

   The VM Launchpad appliance is available in the following variants, which differ by FIPS compliance and storage
   backend. In the drop-down menu, each version lists its storage backend in parentheses, such as `(piraeus)` or
   `(portworx)`, and FIPS builds carry a **FIPS** label. A FIPS and a non-FIPS build of the same backend are otherwise
   identical in the list, so use the **FIPS** label to tell them apart. Choose the variant that matches your compliance
   and storage requirements.

   | **Variant**       | **FIPS Compliance** | **Appliance Storage Backend**            | **Choose This Variant When**                                                                  |
   | ----------------- | ------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
   | FIPS Piraeus      | FIPS-compliant      | Piraeus/LINSTOR replicated block storage | You require a FIPS-compliant appliance.                                                       |
   | Non-FIPS Piraeus  | Not FIPS-compliant  | Piraeus/LINSTOR replicated block storage | You want open source replicated block storage and do not require FIPS.                        |
   | Non-FIPS Portworx | Not FIPS-compliant  | Portworx enterprise distributed storage  | Your organization is standardized on Portworx or Everpure (formerly Pure Storage) FlashArray. |

   :::info

   The Slim ISO and the content bundle must match on FIPS mode. A FIPS content bundle pairs only with the Piraeus
   backend. A non-FIPS content bundle pairs with either the Portworx or the Piraeus backend.

   :::

3. The following table describes the artifacts available for VM Launchpad.

   | **Artifact**                          | **Description**                                                                                         |
   | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
   | **Content bundle (including Ubuntu)** | Content bundle to pair with the slim **Appliance ISO**. Includes the OS content and VM Launchpad packs. |
   | **Appliance ISO**                     | Slim ISO without an embedded content bundle. Upload the content bundle separately after installation.   |
   | **MOK Key for Secure Boot**           | Machine Owner Key (MOK) to use for secure boot with MokManager.                                         |

4. Download both the **Appliance ISO** and the **Content bundle (including Ubuntu)**. Download the **MOK Key for Secure
   Boot** if you use secure boot on your host.

5. Boot your device using the VM Launchpad ISO. On the Grand Unified Bootloader (GRUB) menu, allow the VM Launchpad to
   select the **Palette Edge Interactive Installer** boot option automatically

   :::danger

   During the bootstrap process, the TUI performs a pre-installation check that checks all disks for partitions left
   behind by previous Kairos installations. This helps prevent stale partitions from causing unpredictable installation
   behavior.

   If any disks are affected, they are pre-selected for wiping; you can select additional disks as well. Wiping disks is
   optional and must be confirmed on the following screen. Carefully verify the selected disks before proceeding.

   :::

6. <PartialsComponent category="self-hosted" name="secure-boot-mokmanager" />

7. From the **VM Launchpad Interactive Installer** screen, select the disk to install the appliance on. Press **ENTER**
   to proceed to the next screen.

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
    the VM Launchpad host tags all outgoing packets from that adapter with the specified VLAN identifier.

16. (Optional) Specify the MTU for your network adapter. The MTU defines the largest packet size, in bytes, that the
    interface can send without fragmentation. Press **ENTER** to apply the change.

17. In **DNS Configuration**, specify the IP addresses of the primary and secondary name servers. Optionally, specify a
    search domain. Press **ENTER** to apply the change.

18. In **NTP Configuration**, specify one or more NTP servers. For example, `0.pool.ntp.org` and `1.pool.ntp.org`.

19. After you confirm the configurations, navigate to **Logout** and press **ENTER** to complete the configuration. The
    terminal screen displays the hostname and network information of your VM Launchpad host. Verify that all displayed
    information is consistent with your configurations.

## Configure Network Settings

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VM Launchpad host.
   If you have access to the VM Launchpad host terminal, the Local UI address appears on the terminal screen. If you
   have changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. If you need to change the interface used for management traffic, locate the **Management Interface** field and select
   the interface to use. Local UI can override the management interface selected during TUI configuration. Valid
   candidates include physical NICs, bonds (when not enslaved to another bond or a bridge), VLAN child interfaces, and
   bridges (with or without an IP address). A NIC or bond that is enslaved to a bond or bridge, or that has VLAN
   children, is not a valid candidate.

   :::warning

   Changing the management interface may cause Local UI connectivity loss.

   :::

4. In the **Network interfaces** section, beside **Bonds**, select **Create**.

5. Complete the fields on the **Create Bond** screen and select **Confirm**.

   | **Parameter**                | **Description**                                                                                                                                                             |
   | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                     | Enter a name for the bond. For example, `bond0`.                                                                                                                            |
   | **Bond type**                | Select **Static**, **DHCP**, or **None** for IP address settings. Use **None** for an L2-only bond with no IP configuration, such as when the bond is enslaved to a bridge. |
   | **Member interfaces**        | Select one or more Network Interface Cards (NICs) for the bond.                                                                                                             |
   | **Bonding mode**             | Select the bonding mode for the bond. This must match your physical switch port configuration.                                                                              |
   | **Link monitoring interval** | Select time in milliseconds.                                                                                                                                                |
   | **MTU**                      | Leave the default value or adjust to 9000 for jumbo frames.                                                                                                                 |
   | **DNS**                      | Enter one or more DNS server IP addresses.                                                                                                                                  |
   | **IP Address**               | For static bonds only, enter the IP address for the bond.                                                                                                                   |
   | **Subnet mask**              | For static bonds only, enter the subnet mask for the bond.                                                                                                                  |
   | **Gateway**                  | For static bonds only, enter the gateway IP address for the bond.                                                                                                           |

   :::warning

   This change may cause Local UI connectivity loss.

   :::

6. In the **Network interfaces** section, beside **Bridges**, select **Create**.

7. Complete the fields on the **Create Bridge** screen and select **Confirm**.

   | **Parameter**         | **Description**                                                                                                                                                                             |
   | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**              | Enter a name for the bridge. For example, `br0`.                                                                                                                                            |
   | **Member interfaces** | Select one or more bonds for the bridge.                                                                                                                                                    |
   | **Enable STP**        | Enable Spanning Tree Protocol (STP) to prevent network loops when the bridge has more than one member interface. Leave off for single-member bridges.                                       |
   | **Config type**       | Select **Static**, **DHCP**, or **None** for IP address settings. Use **None** for an L2-only bridge with no IP configuration, such as when the bridge carries only VM tenant VLAN traffic. |
   | **MTU**               | Leave the default value or adjust to 9000 for jumbo frames.                                                                                                                                 |
   | **DNS**               | Enter one or more DNS server IP addresses.                                                                                                                                                  |
   | **IP Address**        | For static bridges only, enter the IP address for the bridge.                                                                                                                               |
   | **Subnet mask**       | For static bridges only, enter the subnet mask for the bridge.                                                                                                                              |
   | **Gateway**           | For static bridges only, enter the gateway IP address.                                                                                                                                      |

   :::warning

   This change may cause Local UI connectivity loss.

   :::

## Link Edge Hosts

For a multi-node cluster, link the hosts together after you configure their network settings and before you upload the
content bundle. Linking gives the hosts the network and security infrastructure to identify each other and communicate
securely. If you deploy a single-node cluster, skip this section and continue to
[Upload the Content Bundle](#upload-content-bundle).

You designate one host as the leader and link the remaining hosts to it as followers. You upload the content bundle to
the leader, which syncs it to the followers, and you create the cluster from the leader.

The VM Launchpad appliance enables multi-node support by default, so you don't need to edit user data to link hosts.
Skip the user-data prerequisites on the Link Hosts page and start at the procedure: from the leader's Local UI, select
**Linked Edge Hosts**, generate a token, and enter that token on each follower host to link it. For the full steps,
refer to [Link Hosts](../../clusters/edge/local-ui/cluster-management/link-hosts.md#link-hosts).

After every host appears in the **Linked Edge Hosts** table on the leader, continue to
[Upload the Content Bundle](#upload-content-bundle).

## Upload the Content Bundle {#upload-content-bundle}

Before you create a cluster, upload the content bundle. The content bundle provides the OS content and VM Launchpad
packs that the cluster profile requires. For a multi-node cluster, upload the bundle to the leader host, which syncs it
to the linked follower hosts.

The recommended method is to upload the bundle from the **Content** tab in the appliance's Local UI.

1. Log in to the appliance's
   [Local UI](../../clusters/edge/local-ui/host-management/access-console.md#log-in-to-local-ui).

2. From the left main menu, select **Content**.

3. In the upper right, select **Actions** > **Upload Content**.

   ![Screenshot of the Content tab with the Actions menu open and Upload Content selected](/vmo/vm-management_vm-launchpad_content-upload-4-10.webp)

4. Select the content bundle file, such as `launchpad-for-vms-<version>.tar.zst`, and upload it. The upload might take
   several minutes because the bundle is large.

5. Confirm the upload. The **Content** page displays the latest upload file, upload time, size, and checksum, and
   updates the **Disk Usage** and syncing status. The registry content appears on this page only after the cluster is up
   and the content has loaded into the local registry.

After the upload finishes, continue to [Create VM Launchpad Cluster](#create-cluster).

### Alternative Upload Methods

- **Palette CLI (scripted).** For automated or repeatable uploads, use the
  [`content upload`](../../automation/palette-cli/commands/content.md#upload) command of the Palette CLI.

- **Local UI reference.** For the full Local UI upload reference, including prerequisites and the Local UI port, refer
  to
  [Upload Content Bundle with Local UI](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md#upload-bundle).

## Create VM Launchpad Cluster {#create-cluster}

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

   If you installed the appliance from the slim [**Appliance ISO**](#install), upload the content bundle before this
   step. Refer to [Upload the Content Bundle](#upload-content-bundle).

   :::

   <details>

   <summary>Components list of a VM Launchpad cluster</summary>

   <!-- vale off -->

   | **Component**              | **Pack Name**                  | **Purpose**                                                                                                                                       |
   | -------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Edge Native BYOI**       | `edge-native-byoi`             | Native Ubuntu OS.                                                                                                                                 |
   | **Kubernetes**             | `edge-k8s`                     | Kubernetes platform.                                                                                                                              |
   | **Cilium**                 | `cni-cilium-fips`              | CNI and network policy. Multus support for VM networking.                                                                                         |
   | **Piraeus**                | `piraeus-operator`             | Storage backend. Provides StorageClass for VM disks.                                                                                              |
   | **Zot**                    | `zot-registry-fips`            | OCI registry. Stores container images for air-gapped deployments.                                                                                 |
   | **Registry Connect**       | `registry-connect`             | Enables integration with OCI-compliant registries.                                                                                                |
   | **Required config**        | `required-config-1`            | Initial configuration before continuing.                                                                                                          |
   | **MetalLB**                | `lb-metallb-helm`              | Load balancer implementation for bare metal. Assigns the platform IP address.                                                                     |
   | **Traefik**                | `traefik`                      | Single ingress controller. Provides TLS termination, path-based routing, and the load balancer IP address.                                        |
   | **Required config**        | `required-config-2`            | Second configuration before continuing.                                                                                                           |
   | **Keycloak**               | `keycloak`                     | OIDC identity provider. Handles login, user, and group management, and token issuance. Shared `k8s-oidc` client with Kubernetes API and Headlamp. |
   | **Headlamp**               | `headlamp`                     | Kubernetes cluster explorer. Alternative UI for raw Kubernetes resources.                                                                         |
   | **Victoria Metrics**       | `victoria-metrics-cluster`     | Optional long-term metrics storage. Supports PromQL queries when `EXTERNAL_METRICS_URL` is configured.                                            |
   | **OTel Collector**         | `opentelemetry`                | Metrics pipeline. Receives OTLP from node-agent and forwards metrics to VMO Manager, or Victoria Metrics.                                         |
   | **VMO**                    | `virtual-machine-orchestrator` | Primary UI and API gateway. Manages VMs, templates, golden images, access policies, configuration, and dashboards.                                |
   | **VM Migration Assistant** | `vm-migration-assistant`       | Migrates VMs from VMware vSphere to VMO.                                                                                                          |

   <!-- vale on -->

   </details>

   Additionally, the **VMO Manager** pack bundles the following services.

   | **Component**    | **Pack Name**                  | **Purpose**                                                                                        |
   | ---------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
   | **cert-manager** | `virtual-machine-orchestrator` | Issues and renews TLS certificates. Single platform CA for all components.                         |
   | **KubeVirt**     | `virtual-machine-orchestrator` | Virtual machine runtime. Manages VirtualMachine, VirtualMachineInstance, and DataVolume resources. |
   | **CDI**          | `virtual-machine-orchestrator` | Containerized Data Importer. Handles disk image uploads, imports, and clones.                      |

5. On the **Profile Config** wizard step, complete the following fields for each section. Select **Next** when finished.

   <!-- Section names match the exact wizard labels in the VM Launchpad UI. -->

   <!-- vale spectrocloud-docs-internal.headings-title = NO -->

   ### Networking

   <!-- vale spectrocloud-docs-internal.headings-title = YES -->

   | **Parameter**                              | **Description**                                                                                                                           |
   | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Pod Network Range**                      | IP address range assigned to internal Kubernetes pod networking. Change only if this conflicts with your existing network.                |
   | **Service Network Range**                  | IP address range reserved for Kubernetes services, such as internal load balancers and DNS. Must not overlap with Pod Network Range.      |
   | **Platform IP Address**                    | A single unused IP address on your network that exposes cluster services externally.                                                      |
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

   ### Container Registry

   | **Parameter**                | **Description**                                                                             |
   | ---------------------------- | ------------------------------------------------------------------------------------------- |
   | **Registry Username**        | Username to authenticate with the platform's container image registry. Defaults to `admin`. |
   | **Registry Password**        | Password for the container image registry. This value is stored securely.                   |
   | **Verify Registry Password** | Re-enter the registry password to confirm it.                                               |

   On the non-FIPS Piraeus and Portworx variants, this section also includes a **Replica Count** field, which sets the
   number of replicas for the Zot registry and the SeaweedFS object store that backs it. Select `1` for a single-node
   cluster or `3` for high availability. The FIPS Piraeus variant has no SeaweedFS object store, so this field does not
   appear here. On the FIPS Piraeus variant, set replication with **Storage Replica Count** in the [Storage](#storage)
   section instead.

   <!-- vale spectrocloud-docs-internal.heading-all-caps = NO -->

   ### OIDC

   <!-- vale spectrocloud-docs-internal.heading-all-caps = YES -->

   | **Parameter**                  | **Description**                                                                                                                                                                                                                                              |
   | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Platform CA Certificate**    | The root Certificate Authority certificate for your platform, encoded in Base64. Used to establish trust for OIDC and internal TLS. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**.           |
   | **Platform CA Private Key**    | The private key corresponding to the Platform CA Certificate, encoded in Base64. Keep this secret because it signs all platform certificates. You can also select **Generate** to populate both **Platform CA Certificate** and **Platform CA Private Key**. |
   | **Admin OIDC Username**        | Username for the initial VMO administrator account created in the OIDC provider (Keycloak).                                                                                                                                                                  |
   | **Admin OIDC Email**           | Email address associated with the VMO administrator OIDC account.                                                                                                                                                                                            |
   | **Admin OIDC Password**        | Password for the VMO administrator's OIDC login. This value is stored securely.                                                                                                                                                                              |
   | **Verify Admin OIDC Password** | Re-enter the password to confirm it.                                                                                                                                                                                                                         |

   ### Keycloak Admin

   | **Parameter**                          | **Description**                                                                                                                           |
   | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
   | **Keycloak Admin Username (Optional)** | Username for the built-in Keycloak administrator account. Use this account to manage the identity provider directly. Defaults to `admin`. |
   | **Keycloak Admin Password**            | Password for the Keycloak administrator account. This value is stored securely.                                                           |
   | **Verify Keycloak Admin Password**     | Re-enter the password to confirm it.                                                                                                      |

   :::info

   Use the Keycloak administrator account to federate users from an existing LDAP directory after the cluster is
   deployed. Federated users must present a verified email address before VM Launchpad can grant them access. Refer to
   [Federate LDAP Users with Keycloak](./access-management/ldap-federation.md).

   :::

   ### Local Admin

   | **Parameter**                   | **Description**                                                                                     |
   | ------------------------------- | --------------------------------------------------------------------------------------------------- |
   | **Local Admin Username**        | Username for the local fallback administrator account used when OIDC authentication is unavailable. |
   | **Local Admin Password**        | Password for the local fallback administrator account. This value is stored securely.               |
   | **Verify Local Admin Password** | Re-enter the password to confirm it.                                                                |

   ### Storage

   The fields in this section depend on the appliance variant.

   On the Piraeus/LINSTOR variants, configure the storage replication network.

   | **Parameter**                     | **Description**                                                                                                                             |
   | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Storage Replication Interface** | The network interface on each node dedicated to storage replication traffic between nodes. Choose a high-bandwidth interface when possible. |

   On the FIPS Piraeus variant, this section also includes a **Storage Replica Count** field, which sets the Piraeus
   DRBD storage class placement count. Select `1` for a single-node cluster or `3` for high availability. The FIPS Zot
   registry is pinned to `1` because it has no shared backend.

   On the Portworx variant, this section configures only the Portworx license. The storage replication network for
   Portworx is configured later, in the Portworx Storage Cluster wizard. Refer to
   [Storage](./infrastructure/storage.md#storage-clusters).

   | **Parameter**                         | **Description**                                                                                                         |
   | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
   | **Portworx Activation ID (Optional)** | Activation ID used to activate the Portworx Enterprise license at install time. Leave blank to skip license activation. |

6. On the **Cluster Config** step, enter a virtual IP (VIP) address for your cluster. Optionally, specify an NTP server
   and an SSH public key.

   | **Parameter**                   | **Description**                                                                         |
   | ------------------------------- | --------------------------------------------------------------------------------------- |
   | **Virtual IP Address (VIP)**    | Enter the virtual IP address for the cluster.                                           |
   | **Network Time Protocol (NTP)** | Enter the IP address of an NTP server the cluster can reference.                        |
   | **SSH Keys**                    | Enter the public key of an SSH key pair to use for connecting to the VM Launchpad host. |

   Optionally, enable network overlay if your cluster operates in a DHCP environment. If you enable the overlay network,
   specify a CIDR range for the overlay network to use.

7. On the **Node Config** step, configure worker pools and control plane pools. To assign a host to a node pool, select
   **Add Item** in the corresponding node pool, and select the host to add. For multi-node clusters, keep the leader
   node assigned to the control plane node pool. Ensure that you have an odd number of nodes in the control plane. After
   the cluster forms, every node in the control plane is considered a leader node.

   For more information about node pool configurations, review
   [Node Pools](../../clusters/cluster-management/node-pool.md). After you finish the configuration, select **Next**.

8. Review your configurations and deploy the cluster. The **Cluster** page displays the deployment status and details.
   Use this page to track deployment progress. The VM Launchpad host reboots as part of the build process. Depending on
   your infrastructure environment, the deployment might take up to 45 minutes.

9. After the cluster deployment is complete, more options appear in the left main menu.

   ![Screenshot of appliance](/vmo/vm-management_vm-launchpad_install-4-9.webp)

## Verify

1. From the left main menu in VM Launchpad, select **VM Orchestrator**. You can also go to the address you provided for
   MetalLB in your browser.

2. Log in to VMO Manager.

   <Tabs>

   <TabItem value="local-auth" label="Local Auth (Day-0)">

   Before you configure Keycloak, use local admin accounts.

   1. Go to `https://<vmo-address>/local-login`.
   2. Enter the local admin username (default: `admin`) and the password you configured during cluster creation.
   3. Enter a new password and confirm the new password.
   4. Select **Set New Password**.

   </TabItem>

   <TabItem value="oidc-auth" label="OIDC Using Keycloak">

   When Keycloak is configured, VMO Manager uses OIDC for authentication.

   1. Select **Login** or go to the platform URL.
   2. The browser redirects you to the Keycloak login page.
   3. Enter your username and password.
   4. After authentication succeeds, the browser redirects you back to VMO Manager.

   </TabItem>

   </Tabs>

3. After you log in, the **Dashboard** is the default landing page.

   ![Screenshot of VMO dashboard](/vmo/vm-management_vm-launchpad_default-dashboard-4-9.webp)

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

After you deploy your VMO cluster, [complete the initial configuration of VM Launchpad](./getting-started-wiz.md), and
then [create your first VM](./quick-start.md).
