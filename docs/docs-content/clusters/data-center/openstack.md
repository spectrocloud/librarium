---
sidebar_label: "OpenStack"
title: "OpenStack"
description: "The methods of creating clusters for a speedy deployment on any CSP"
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "openstack"]
---

The following are some highlights of OpenStack clusters provisioned by Palette:

1. Palette enables the ability to use OpenStack as an application platform for engineering team.

2. To facilitate communication between Palette and the OpenStack controllers installed in the private data center, a
   Private Cloud Gateway (PCG) must be set up within the environment.

3. Private Cloud Gateway (PCG) is Palette's self-hosted component to support isolated private cloud or data center
   environments. Once installed, the PCG registers itself with Palette's SaaS portal and enables secure communication
   between the SaaS portal and the private cloud environment. The PCG enables installation and end-to-end lifecycle
   management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.

![openstack_cluster_architecture.png](/openstack_cluster_architecture.png)

## Prerequisites

The following prerequisites must be met before deploying a Kubernetes clusters in OpenStack:

1. OpenStack Victoria (recommended).

2. NTP configured on all Hosts.

3. Shared Storage between OpenStack hosts.

4. You must have an active OpenStack account with access to all the projects that you would like to provision clusters
   into. The account should have all the permissions listed below in the "OpenStack Cloud Account Permissions" section.

5. You should have an Infrastructure cluster profile created in Palette for OpenStack.

6. Install a Private Cloud Gateway for OpenStack as described in the **Installing Private Cloud Gateway - OpenStack**
   section below. Installing the Private Cloud Gateway will automatically register a cloud account for OpenStack in
   Palette. You can register your additional OpenStack cloud accounts in Palette as described in the **Creating a
   OpenStack Cloud account** section below.

7. Egress access to the internet (direct or via proxy):

   - For proxy: HTTP_PROXY, HTTPS_PROXY (both required)
   - Outgoing internet connection on port 443 to api.spectrocloud.com

8. DNS to resolve public internet names (e.g.: api.spectrocloud.com).

9. Sufficient IPs for application workload services (e.g.: Load Balancer services).

10. Per workload cluster IP requirements:
    - One (1) per cluster node
    - One (1) Kubernetes control-plane VIP

## OpenStack Cloud Account Permissions

<Tabs queryString="permissions">

<TabItem label="Cinder Service" value="Cinder Service">

### Cinder Service

**Last Update**: June 28, 2021

```json
"volume:attachment_update": "rule:admin_or_owner"
"volume:attachment_delete": "rule:admin_or_owner"
"volume:attachment_complete": "rule:admin_or_owner"
"volume:multiattach_bootable_volume": "rule:admin_or_owner"
"message:get_all": "rule:admin_or_owner"
"message:get": "rule:admin_or_owner"
"message:delete": "rule:admin_or_owner"
"volume:get_snapshot_metadata": "rule:admin_or_owner"
"volume:update_snapshot_metadata": "rule:admin_or_owner"
"volume:delete_snapshot_metadata": "rule:admin_or_owner"
"volume:get_all_snapshots": "rule:admin_or_owner"
"volume_extension:extended_snapshot_attributes": "rule:admin_or_owner"
"volume:create_snapshot": "rule:admin_or_owner"
"volume:get_snapshot": "rule:admin_or_owner"
"volume:update_snapshot": "rule:admin_or_owner"
"volume:delete_snapshot": "rule:admin_or_owner"
"backup:get_all": "rule:admin_or_owner"
"backup:get": "rule:admin_or_owner"
"backup:update": "rule:admin_or_owner"
"backup:delete": "rule:admin_or_owner"
"backup:restore": "rule:admin_or_owner"
"group:get_all": "rule:admin_or_owner"
"group:get": "rule:admin_or_owner"
"group:update": "rule:admin_or_owner"
"group:get_all_group_snapshots": "rule:admin_or_owner"
"group:get_group_snapshot": "rule:admin_or_owner"
"group:delete_group_snapshot": "rule:admin_or_owner"
"group:update_group_snapshot": "rule:admin_or_owner"
"group:reset_group_snapshot_status": "rule:admin_or_owner"
"group:delete": "rule:admin_or_owner"
"group:enable_replication": "rule:admin_or_owner"
"group:disable_replication": "rule:admin_or_owner"
"group:failover_replication": "rule:admin_or_owner"
"group:list_replication_targets": "rule:admin_or_owner"
"volume_extension:quotas:show": "rule:admin_or_owner"
"limits_extension:used_limits": "rule:admin_or_owner"
"volume_extension:volume_type_access": "rule:admin_or_owner"
"volume:extend": "rule:admin_or_owner"
"volume:extend_attached_volume": "rule:admin_or_owner"
"volume:revert_to_snapshot": "rule:admin_or_owner"
"volume:retype": "rule:admin_or_owner"
"volume:update_readonly_flag": "rule:admin_or_owner"
"volume_extension:volume_actions:upload_image": "rule:admin_or_owner"
"volume_extension:volume_actions:initialize_connection": "rule:admin_or_owner"
"volume_extension:volume_actions:terminate_connection": "rule:admin_or_owner"
"volume_extension:volume_actions:roll_detaching": "rule:admin_or_owner"
"volume_extension:volume_actions:reserve": "rule:admin_or_owner"
"volume_extension:volume_actions:unreserve": "rule:admin_or_owner"
"volume_extension:volume_actions:begin_detaching": "rule:admin_or_owner"
"volume_extension:volume_actions:attach": "rule:admin_or_owner"
"volume_extension:volume_actions:detach": "rule:admin_or_owner"
"volume:get_all_transfers": "rule:admin_or_owner"
"volume:create_transfer": "rule:admin_or_owner"
"volume:get_transfer": "rule:admin_or_owner"
"volume:delete_transfer": "rule:admin_or_owner"
"volume:get_volume_metadata": "rule:admin_or_owner"
"volume:create_volume_metadata": "rule:admin_or_owner"
"volume:update_volume_metadata": "rule:admin_or_owner"
"volume:delete_volume_metadata": "rule:admin_or_owner"
"volume_extension:volume_image_metadata": "rule:admin_or_owner"
"volume:get": "rule:admin_or_owner"
"volume:get_all": "rule:admin_or_owner"
"volume:update": "rule:admin_or_owner"
"volume:delete": "rule:admin_or_owner"
"volume_extension:volume_tenant_attribute": "rule:admin_or_owner"
"volume_extension:volume_encryption_metadata": "rule:admin_or_owner"
"volume:multiattach": "rule:admin_or_owner"

```

</TabItem>

<TabItem label="Neutron Service" value="Neutron Service">

### Neutron Service

**Last Update**: June 28, 2021

```json
    "create_subnet": "rule:admin_or_network_owner",
    "get_subnet": "rule:admin_or_owner or rule:shared",
    "update_subnet": "rule:admin_or_network_owner",
    "delete_subnet": "rule:admin_or_network_owner",
    "get_subnetpool": "rule:admin_or_owner or rule:shared_subnetpools",
    "update_subnetpool": "rule:admin_or_owner",
    "delete_subnetpool": "rule:admin_or_owner",
    "get_address_scope": "rule:admin_or_owner or rule:shared_address_scopes",
    "update_address_scope": "rule:admin_or_owner",
    "delete_address_scope": "rule:admin_or_owner",
    "get_network": "rule:admin_or_owner or rule:shared or rule:external or rule:context_is_advsvc",
    "update_network": "rule:admin_or_owner",
    "delete_network": "rule:admin_or_owner",
    "network_device": "field:port:device_owner=~^network:",
    "create_port:device_owner": "not rule:network_device or rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:mac_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:fixed_ips": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "create_port:fixed_ips:ip_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:fixed_ips:subnet_id": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "create_port:port_security_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:mac_learning_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:allowed_address_pairs": "rule:admin_or_network_owner",
    "create_port:allowed_address_pairs:mac_address": "rule:admin_or_network_owner",
    "create_port:allowed_address_pairs:ip_address": "rule:admin_or_network_owner",
    "get_port": "rule:context_is_advsvc or rule:admin_owner_or_network_owner",
    "update_port": "rule:admin_or_owner or rule:context_is_advsvc",
    "update_port:device_owner": "not rule:network_device or rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:fixed_ips": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "update_port:fixed_ips:ip_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:fixed_ips:subnet_id": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "update_port:port_security_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:mac_learning_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:allowed_address_pairs": "rule:admin_or_network_owner",
    "update_port:allowed_address_pairs:mac_address": "rule:admin_or_network_owner",
    "update_port:allowed_address_pairs:ip_address": "rule:admin_or_network_owner",
    "delete_port": "rule:context_is_advsvc or rule:admin_owner_or_network_owner",
    "create_router:external_gateway_info": "rule:admin_or_owner",
    "create_router:external_gateway_info:network_id": "rule:admin_or_owner",
    "get_router": "rule:admin_or_owner",
    "update_router": "rule:admin_or_owner",
    "update_router:external_gateway_info": "rule:admin_or_owner",
    "update_router:external_gateway_info:network_id": "rule:admin_or_owner",
    "delete_router": "rule:admin_or_owner",
    "add_router_interface": "rule:admin_or_owner",
    "remove_router_interface": "rule:admin_or_owner",
    "update_floatingip": "rule:admin_or_owner",
    "delete_floatingip": "rule:admin_or_owner",
    "get_floatingip": "rule:admin_or_owner",
    "update_rbac_policy": "rule:admin_or_owner",
    "update_rbac_policy:target_tenant": "rule:restrict_wildcard and rule:admin_or_owner",
    "get_rbac_policy": "rule:admin_or_owner",
    "delete_rbac_policy": "rule:admin_or_owner",
    "get_auto_allocated_topology": "rule:admin_or_owner",
    "get_trunk": "rule:admin_or_owner",
    "delete_trunk": "rule:admin_or_owner",
    "add_subports": "rule:admin_or_owner",
    "remove_subports": "rule:admin_or_owner",
    "get_security_groups": "rule:admin_or_owner",
    "get_security_group": "rule:admin_or_owner",
    "create_security_group": "rule:admin_or_owner",
    "update_security_group": "rule:admin_or_owner",
    "delete_security_group": "rule:admin_or_owner",
    "get_security_group_rules": "rule:admin_or_owner",
    "get_security_group_rule": "rule:admin_owner_or_sg_owner",
    "create_security_group_rule": "rule:admin_or_owner",
    "delete_security_group_rule": "rule:admin_or_owner",

```

</TabItem>

<TabItem label="Glance Service" value="Glance Service">

### Glance Service

**Last Update**: June 28, 2021

```json
    "add_image": "role:admin or role:member",
    "delete_image": "role:admin or role:member",
    "get_image": "role:admin or role:member",
    "get_images": "role:admin or role:member",
    "publicize_image": "role:admin or role:member",
    "download_image": "role:admin or role:member",
    "upload_image": "role:admin or role:member",
    "get_image_location": "role:admin or role:member",
    "set_image_location": "role:admin or role:member",
```

</TabItem>

<TabItem label="Nova Compute Service" value="Nova Compute Service">

### Nova Compute Service

**Last Update**: June 28, 2021

```json
 "os_compute_api:os-admin-password": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces:create": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces:delete": "rule:admin_or_owner",
    "os_compute_api:os-availability-zone:list": "rule:admin_or_owner",
    "os_compute_api:os-config-drive": "rule:admin_or_owner",
    "os_compute_api:os-console-output": "rule:admin_or_owner",
    "os_compute_api:os-consoles:create": "rule:admin_or_owner",
    "os_compute_api:os-consoles:show": "rule:admin_or_owner",
    "os_compute_api:os-consoles:delete": "rule:admin_or_owner",
    "os_compute_api:os-consoles:index": "rule:admin_or_owner",
    "os_compute_api:os-create-backup": "rule:admin_or_owner",
    "os_compute_api:os-deferred-delete": "rule:admin_or_owner",
    "os_compute_api:os-extended-availability-zone": "rule:admin_or_owner",
    "os_compute_api:os-extended-status": "rule:admin_or_owner",
    "os_compute_api:os-extended-volumes": "rule:admin_or_owner",
    "os_compute_api:extensions": "rule:admin_or_owner",
    "os_compute_api:os-flavor-access": "rule:admin_or_owner",
    "os_compute_api:os-flavor-extra-specs:show": "rule:admin_or_owner",
    "os_compute_api:os-flavor-extra-specs:index": "rule:admin_or_owner",
    "os_compute_api:os-flavor-rxtx": "rule:admin_or_owner",
    "os_compute_api:flavors": "rule:admin_or_owner",
    "os_compute_api:os-floating-ip-dns": "rule:admin_or_owner",
    "os_compute_api:os-floating-ip-pools": "rule:admin_or_owner",
    "os_compute_api:os-floating-ips": "rule:admin_or_owner",
    "os_compute_api:os-fping": "rule:admin_or_owner",
    "os_compute_api:image-size": "rule:admin_or_owner",
    "os_compute_api:os-instance-actions": "rule:admin_or_owner",
    "os_compute_api:ips:show": "rule:admin_or_owner",
    "os_compute_api:ips:index": "rule:admin_or_owner",
    "os_compute_api:os-keypairs": "rule:admin_or_owner",
    "os_compute_api:limits": "rule:admin_or_owner",
    "os_compute_api:os-lock-server:lock": "rule:admin_or_owner",
    "os_compute_api:os-lock-server:unlock": "rule:admin_or_owner",
    "os_compute_api:os-multinic": "rule:admin_or_owner",
    "os_compute_api:os-networks:view": "rule:admin_or_owner",
    "os_compute_api:os-pause-server:pause": "rule:admin_or_owner",
    "os_compute_api:os-pause-server:unpause": "rule:admin_or_owner",
    "os_compute_api:os-quota-sets:show": "rule:admin_or_owner",
    "os_compute_api:os-quota-sets:detail": "rule:admin_or_owner",
    "os_compute_api:os-remote-consoles": "rule:admin_or_owner",
    "os_compute_api:os-rescue": "rule:admin_or_owner",
    "os_compute_api:os-security-groups": "rule:admin_or_owner",
    "os_compute_api:os-server-groups": "rule:admin_or_owner",
    "os_compute_api:server-metadata:index": "rule:admin_or_owner",
    "os_compute_api:server-metadata:show": "rule:admin_or_owner",
    "os_compute_api:server-metadata:create": "rule:admin_or_owner",
    "os_compute_api:server-metadata:update_all": "rule:admin_or_owner",
    "os_compute_api:server-metadata:update": "rule:admin_or_owner",
    "os_compute_api:server-metadata:delete": "rule:admin_or_owner",
    "os_compute_api:os-server-password": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:delete_all": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:index": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:update_all": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:delete": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:update": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:show": "rule:admin_or_owner",
    "os_compute_api:os-server-usage": "rule:admin_or_owner",
    "os_compute_api:servers:index": "rule:admin_or_owner",
    "os_compute_api:servers:detail": "rule:admin_or_owner",
    "os_compute_api:servers:show": "rule:admin_or_owner",
    "os_compute_api:servers:create": "rule:admin_or_owner",
    "os_compute_api:servers:create:attach_volume": "rule:admin_or_owner",
    "os_compute_api:servers:create:attach_network": "rule:admin_or_owner",
    "os_compute_api:servers:delete": "rule:admin_or_owner",
    "os_compute_api:servers:update": "rule:admin_or_owner",
    "os_compute_api:servers:confirm_resize": "rule:admin_or_owner",
    "os_compute_api:servers:revert_resize": "rule:admin_or_owner",
    "os_compute_api:servers:reboot": "rule:admin_or_owner",
    "os_compute_api:servers:resize": "rule:admin_or_owner",
    "os_compute_api:servers:rebuild": "rule:admin_or_owner",
    "os_compute_api:servers:create_image": "rule:admin_or_owner",
    "os_compute_api:servers:create_image:allow_volume_backed": "rule:admin_or_owner",
    "os_compute_api:servers:start": "rule:admin_or_owner",
    "os_compute_api:servers:stop": "rule:admin_or_owner",
    "os_compute_api:servers:trigger_crash_dump": "rule:admin_or_owner",
    "os_compute_api:os-shelve:shelve": "rule:admin_or_owner",
    "os_compute_api:os-shelve:unshelve": "rule:admin_or_owner",
    "os_compute_api:os-simple-tenant-usage:show": "rule:admin_or_owner",
    "os_compute_api:os-suspend-server:resume": "rule:admin_or_owner",
    "os_compute_api:os-suspend-server:suspend": "rule:admin_or_owner",
    "os_compute_api:os-tenant-networks": "rule:admin_or_owner",
    "os_compute_api:os-virtual-interfaces": "rule:admin_or_owner",
    "os_compute_api:os-volumes": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:index": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:create": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:show": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:delete": "rule:admin_or_owner"


```

</TabItem>

</Tabs>

## Installing Private Cloud Gateway - OpenStack

Use the following steps to install a PCG cluster in your OpenStack environment. The
[Palette CLI](../../palette-cli/palette-cli.md) will facilitate the deployment of a PCG cluster.

:::warning

Use the latest version of the Palette CLI that matches the version of your Palette or Palette VerteX instance. You can
find the newest version of the Palette CLI on the [Downloads](../../spectro-downloads.md#palette-cli) page.

:::

### Prerequisites

The following system prerequisites are required to install an OpenStack PCG.

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../user-management/authentication//api-key/create-api-key.md) page
  for guidance.

- Download the Palette CLI from the [Downloads](../../spectro-downloads.md#palette-cli) page and install the CLI. Refer
  to the [Palette CLI Install](../../palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements should be met in order to install a private cloud gateway for OpenStack:

- Private cloud gateway IP requirements:
  - 1 IP for a 1 node PCG or 3 IPs for a 3 node PCG
  - 1 IP for Kubernetes control-plane

Palette provides an installer in the form of a docker container. This installer can be run on any system that has docker
daemon installed and has connectivity to the Palette Management console as well as OpenStack controller.

- One additional Kubernetes control plane IP address for rolling upgrades.
- A Linux x86-64 host with the Docker daemon installed.

### Install PCG

1. In an x86 Linux host, open up a terminal session.

2. Use the Palette CLI `login` command to authenticate the CLI with Palette. When prompted, enter the information listed
   in the following table.

   <br />

   ```shell
   palette login
   ```

   <br />

   | **Parameter**                  | **Description**                                                                                                                                                                               |
   | :----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance. |
   | **Allow Insecure Connection**  | Enabling this option bypasses x509 verification. Enter `y` if you are using a self-hosted Palette instance with self-signed TLS certificates. Otherwise, enter `n`.                           |
   | **Spectro Cloud API Key**      | Enter your Palette API Key.                                                                                                                                                                   |
   | **Spectro Cloud Organization** | Enter your Palette Organization name.                                                                                                                                                         |
   | **Spectro Cloud Project**      | Enter your desired project name within the selected Organization.                                                                                                                             |

3. Once you have authenticated successfully, invoke the PCG installer by issuing the following command. When prompted,
   enter the information listed in each of the following tables.

   <br />

   ```bash
   palette pcg install
   ```

   <br />

   | **Parameter**                                        | **Description**                                                                                                                                                                                                     |
   | :--------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cloud Type**                                       | Choose OpenStack.                                                                                                                                                                                                   |
   | **Private Cloud Gateway Name**                       | Enter a custom name for the PCG. Example: `openstack-pcg-1`.                                                                                                                                                        |
   | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope. |

4. Next, provide environment configurations for the cluster. Refer to the following table for information about each
   option.

<br />

| **Parameter**                     | **Description**                                                                                                                                                                                                                                                                                                |
| :-------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTTPS Proxy**                   | Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                   |
| **HTTP Proxy**                    | Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                     |
| **No Proxy**                      | You will be prompted to provide a list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: `my.company.com,10.10.0.0/16`.     |
| **Proxy CA Certificate Filepath** | The default is blank. You can provide the file path of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`. |
| **Pod CIDR**                      | Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                                        |
| **Service IP Range**              | Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                         |

5. After the environment options, the next set of prompts is for configuring the PCG cluster for the OpenStack
   environment. The following table contains information about each prompt.

<br />

| **Parameter**                   | **Description**                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OpenStack Identity Endpoint** | OpenStack Identity endpoint. Domain or IP address. <br />Example: `https://openstack.mycompany.com/identity`.                                              |
| **OpenStack Account Username**  | OpenStack account username.                                                                                                                                |
| **OpenStack Account Password**  | OpenStack account password.                                                                                                                                |
| **Allow Insecure Connection**   | Enabling this option bypasses x509 verification. Enter `y` if you are using an OpenStack instance with self-signed TLS certificates. Otherwise, enter `n`. |
| **CA Certificate**              | This is only required when using TLS, in which case you would provide a base64-encoded CA certificate for your OpenStack instance.                         |

6. Next, fill out additional OpenStack configurations.

<br />

| **Parameter**                             | **Description**                                                                                                                                                                                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Default Domain**                        | OpenStack Domain. Example: `Default`.                                                                                                                                                                                                                                         |
| **Default Region**                        | OpenStack Region. Example: `RegionOne`.                                                                                                                                                                                                                                       |
| **Default Project**                       | OpenStack Project. Example: `dev`.                                                                                                                                                                                                                                            |
| **Placement Type**                        | Placement can be static or dynamic. For static placement, VMs are placed into existing networks. For dynamic placement, a new network is created.                                                                                                                             |
| **Network**                               | Select an existing network. This is only required for static placement.                                                                                                                                                                                                       |
| **Subnet**                                | Select an existing subnet. This is only required for static placement.                                                                                                                                                                                                        |
| **DNS Server(s)**                         | Enter a comma-separated list of DNS server IPs . This is only required for dynamic placement.                                                                                                                                                                                 |
| **Node CIDR**                             | Enter a node CIDR. This is only required for dynamic placement. Example: `10.55.0.0/24`.                                                                                                                                                                                      |
| **SSH Public Key**                        | Provide the public OpenSSH key for the PCG cluster. Use this key when establishing an SSH connection with the PCG cluster. This prompt will result in the default text editor for the Operating System to open. Vi is the more common text editor used in Linux environments. |
| **Patch OS on boot**                      | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.                                                                                                                                                                                   |
| **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are complete. This only applies if the **Patch OS on boot** parameter is enabled.                                                                                                                |

7. Configure the OpenStack PCG Machine by answering the following prompts.

<br />

| **Parameter**         | **Description**                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Availability Zone** | Select the availability zone.                                                                                         |
| **PCG Cluster Size**  | Select the node size of the PCG cluster. You can choose between **1** node or **3** nodes for High Availability (HA). |

8. A new PCG configuration file is generated and its location is displayed on the console. You will receive an output
   similar to the following.

<br />

```bash hideClipboard
==== PCG config saved ====
Location: :/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
```

:::info

The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the **pcg.yaml** are encrypted and cannot be manually updated. To
change these values, use the `palette pcg install --update-passwords` command. Refer to the
[PCG command](../../palette-cli/commands/pcg.md#update-passwords) reference page for more information.

:::

<br />

The Palette CLI will now provision a PCG cluster in your OpenStack environment.

:::warning

You cannot modify a deployed PCG cluster. If you need to make changes to the PCG cluster, you must first delete the
cluster and redeploy it. We recommend you save your PCG configuration file for future use. Use the `--config-only` flag
to save the configuration file without deploying the PCG cluster. Refer to the
[Generate a Configuration File](../../palette-cli/commands/pcg.md#generate-a-configuration-file) section to learn more.
For additional assistance, visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals)
portal.

:::

### Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**

3. From the **Tenant Settings Menu** click on **Private Cloud Gateways**. Verify your PCG cluster is available from the
   list of PCG clusters displayed.

4. When you install the PCG, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant
   Settings > Cloud Accounts** and locate **OpenStack** in the table. Verify your OpenStack account is listed.

## Upgrade PCG

Palette maintains the OS image and all configurations for the PCG. Periodically, the OS images, configurations, or other
components need to be upgraded to resolve security or functionality issues. Palette releases such upgrades when required
and in an upgrade notification on the PCG.

Administrators should review the changes and apply them at a suitable time. Upgrading a PCG does not result in any
downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily
unavailable. New cluster requests are queued while the PCG is being upgraded and are processed as soon as the PCG
upgrade is complete.

## Delete the PCG

The following steps need to be performed to delete a PCG:

1. As a tenant admin, navigate to the Private Cloud Gateway page under settings.

2. Invoke the **Delete** action on the cloud gateway instance that needs to be deleted.

3. The system performs a validation to ensure that there are no running tenant clusters associated with the gateway
   instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant
   clusters and retry the deletion of the cloud gateway.

4. Delete the gateway.

:::info

The delete gateway operation deletes the gateway instance registered in the management console, however the gateway
infrastructure such as Load Balancers, VMs, Networks (if dynamic provision was chosen), etc. need to be deleted on the
OpenStack console.

:::

## Resize the PCG

You can set up the PCG as a single-node or three-node cluster for high availability (HA). For production environments,
we recommend three nodes. A PCG can be initially set up with one node and resized to three nodes later. Use the
following steps to resize a single-node PCG cluster to a three-node PCG cluster.

1. As a tenant administrator, navigate to the Private Cloud Gateway page under settings.

2. Invoke the resize action for the relevant cloud gateway instance.

3. Update the size from 1 to 3.

4. The gateway upgrade begins shortly after the update. Two new nodes are created, and the gateway is upgraded to a
   3-node cluster.

# Creating an OpenStack Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be
used to create tenant clusters. Additional cloud accounts may be created if desired within the same gateway.

1. To create an OpenStack cloud account, proceed to project settings and select 'create cloud account' under OpenStack.

2. Fill the following values to the cloud account creation wizard.

   | **Property**              | **Description**                      |
   | :------------------------ | :----------------------------------- |
   | **Account Name**          | Custom name for the cloud account    |
   | **Private cloud gateway** | Reference to a running cloud gateway |
   | **Username**              | OpenStack Username                   |
   | **Password**              | OpenStack Password                   |
   | **Identity Endpoint**     | Identity Endpoint of the gateway     |
   | **CA Certificate**        | Digital certificate of authority     |
   | **Parent Region**         | OpenStack Region to be used          |
   | **Default Domain**        | Default OpenStack domain             |
   | **Default Project**       | Default OpenStack project            |

# Deploying an OpenStack Cluster

<Video
  title="openstack-cluster-creation"
  src="/videos/clusters/data-center/cluster-creation-videos/openstack.mp4"
></Video>

The following steps need to be performed to provision a new OpenStack cluster:

1. Provide basic cluster information like Name, Description, and Tags. Tags are currently not propagated to the VMs
   deployed on the cloud/data center environments.

2. Select a Cluster Profile created for the OpenStack environment. The profile definition will be used as the cluster
   construction template.

3. Review and override Pack Parameters as desired. By default, Parameters for all packs are set with values defined in
   the Cluster Profile.

4. Provide an OpenStack Cloud account and placement information.

   - **Cloud Account** - Select the desired cloud account. OpenStack cloud accounts with credentials need to be
     preconfigured in project settings. An account is auto-created as part of the cloud gateway setup and is available
     for provisioning of tenant clusters if permitted by the administrator.
     - Domain
     - Region
     - Project
     - SSH Key
     - Placement
       - If the user choice of placement is Static then:
         - Network
         - Subnet
       - If the user choice of placement is NOT Static then:
         - Subnet CIDR
         - DNS Name Server

5. Configure the control plane and worker node pools. Fill out the input fields in the **Add node pool** page. The
   following table contains an explanation of the available input parameters.

### Control Plane Pool

| **Parameter**                                        | **Description**                                                                                                                                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                             | A descriptive name for the node pool.                                                                                                                                                                               |
| **Size**                                             | Number of VMs to be provisioned for the node pool. For the control plane pool, this number can be 1, 3, or 5.                                                                                                       |
| **Allow worker capability**                          | Select this option for allowing workloads to be provisioned on control plane nodes.                                                                                                                                 |
| **[Labels](../cluster-management/taints.md#labels)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                            |
| **[Taints](../cluster-management/taints.md#taints)** | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                      |
| **Instance type**                                    | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                         |
| **Availability Zones**                               | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected. |
| **Disk Size**                                        | Give the required storage size                                                                                                                                                                                      |

### Worker Pool

| **Parameter**                                        | **Description**                                                                                                                                                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                             | A descriptive name for the node pool.                                                                                                                                                                                                       |
| **Enable Autoscaler**                                | You can enable the autoscaler, by toggling the **Enable Autoscaler** button. Autoscaler scales up and down resources between the defined minimum and the maximum number of nodes to optimize resource utilization.                          |
|                                                      | Set the scaling limit by setting the **Minimum Size** and **Maximum Size**, as per the workload the number of nods will scale up from minimum set value to maximum set value and the scale down from maximum set value to minimum set value |
| **Size**                                             | Number of VMs to be provisioned for the node pool.                                                                                                                                                                                          |
| **Rolling Update**                                   | Rolling update has two available options. The expand option launches a new node first, then shuts down old one. The contract option shuts down a old one first, then launches new one.                                                      |
| **[Labels](../cluster-management/taints.md#labels)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                                                    |
| **[Taints](../cluster-management/taints.md#taints)** | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                                              |
| **Instance type**                                    | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                                                 |
| **Availability Zones**                               | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.                         |
| **Disk Size**                                        | Provide the required storage size                                                                                                                                                                                                           |

6. Configure the cluster policies/features.

   - Manage Machines
   - Scan Policies
   - Backup Policies

7. Click to get details on [cluster management feature](../cluster-management/cluster-management.md).

8. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available
   to track progress.

## Deleting an OpenStack Cluster

The deletion of an OpenStack cluster results in the removal of all Virtual machines and associated storage disks created
for the cluster. The following tasks need to be performed to delete an OpenStack cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.

2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete**
   **Cluster**.

3. Click **Confirm** to delete.

The Cluster Status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated
with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status
changes to **Deleted** and is removed from the list of clusters.

:::info

Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of
being provisioned, the 'Abort' action is available to stop provisioning and delete all resources.

:::

# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go
for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette
enables cluster force delete from the Tenant Admin and Project Admin scope.

1. Log in to the Palette Management Console.

2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

   - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings**
     dropdown.

   - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the
     estimated time for the auto-enabling of the **Force Delete** button.

:::warning

If there are any cloud resources still on the cloud, the user should cleanup those resources before going for the force
deletion.

:::
