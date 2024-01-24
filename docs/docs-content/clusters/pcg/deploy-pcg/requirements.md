---
sidebar_label: "Requirements"
title: "Requirements"
description: "Learn about the requirements for deploying a Private Cloud Gateway (PCG)."
hide_table_of_contents: false
tags: ["pcg"]
---

Depending on your deployment environment, different requirements mut be met before deploying a Private Cloud Gateway
(PCG). To learn more about the prerequisites for deploying a PCG, refer to the following sections for your deployment
environment.

## MAAS

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  :::

- Download the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page and install the CLI.
  Refer to the [Palette CLI Install](../../../palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements must be met to install a PCG in MAAS:

- Private cloud gateway IP requirements:

  - 1 IP address for a single node PCG or 3 three IP addresses for a 3 node PCG
  - 1 IP address for the Kubernetes control-plane
  - DNS can resolve the domain `api.spectrocloud.com`.

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette CLI
  installation must be invoked on an up-to-date Linux system with an x86-64 architecture.

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP
    addresses for a three-node gateway.

  - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a
    three-node gateway.

- Sufficient available IPs within the configured MAAS subnets.

  :::warning

  By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure
  that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
  the bare metal machines that MAAS manages.

  :::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60
  GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time.

- An active MAAS API key. Refer to the
  [Authenticating to the MAAS API](https://maas.io/docs/api-authentication-reference) guide to learn more about how to
  create an API key.

- The DNS server that the PCG installer will use, must be able to resolve the DNS names of machines that MAAS deploys so
  it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that
  it deploys. The default MAAS DNS zone is `.maas`. You can use `.maas` or you can use the MAAS web console to create a
  new DNS zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records
  should be created.

  In the MAAS subnets configuration, you can specify which DNS servers those servers in the MAAS subnet should use.

  :::warning

  If you configure a different DNS server than the MAAS DNS server, you must be sure to create a DNS delegation in the
  other DNS server, so that it can forward DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

  :::

The installation process first requests machines from MAAS and then must connect to them. To connect, the install
process attempts to use the fully qualified domain name (FQDN) of the server. If you used `.maas` as the default DNS
zone, the FQDN would be `machine-hostname.maas`.

The diagram below shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)

## OpenStack

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  :::

- Download the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page and install the CLI.
  Refer to the [Palette CLI Install](../../../palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements must be met to install a PCG in OpenStack:

- Private cloud gateway IP requirements:

  - 1 IP address for a single node PCG or 3 three IP addresses for a 3 node PCG
  - 1 IP address for the Kubernetes control-plane
  - DNS can resolve the domain `api.spectrocloud.com`.

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette CLI
  installation must be invoked on an up-to-date Linux system with an x86-64 architecture.

- One additional Kubernetes control plane IP address for rolling upgrades.
- A Linux x86-64 host with the Docker daemon installed.

- An Open Stack SSH Key Pair. Refer to the
  [Configure access and security for instances](https://docs.openstack.org/horizon/latest/user/configure-access-and-security-for-instances.html)
  guide to learn how to create an SSH key pair.

- OpenStack user account with the required permissions to deploy the PCG. Review the
  [OpenStack Cloud Account Permissions](#openstack-cloud-account-permissions) section to learn more about the required
  permissions.

### OpenStack Cloud Account Permissions

<Tabs queryString="permissions">

<TabItem label="Cinder Service" value="Cinder Service">

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

## VMware

:::info

If you are using a self-hosted Palette instance, or Palette VerteX, and you deployed the instance to a VMware vSphere
environment, then you already have all the required permissions and roles. Proceed to the installation steps in the
[Deploy PCG](./deploy-pcg.md) guide.

:::

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  :::

- Download the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page and install the CLI.
  Refer to the [Palette CLI Install](../../../palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements must be met to install a PCG in VMware vSphere:

- Private cloud gateway IP requirements:

  - One IP address for a single node PCG or three three IP addresses for a three node PCG
  - One IP address for the Kubernetes control-plane
  - DNS can resolve the domain `api.spectrocloud.com`.
  - NTP server is reachable from the PCG.

- A PCG requires the following minimum resources:

  - CPU: 4
  - Memory: 4 GiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 8 CPU, 8 GiB of Memory, and 100 GiB of storage.
  Nodes can exhaust the 60 GiB storage with prolonged use. If you initially set up the gateway with one node, you can
  resize it at a later time.

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette CLI
  installation must be invoked on an up-to-date Linux system with an x86-64 architecture.

- One additional Kubernetes control plane IP address for rolling upgrades.
- A Linux x86-64 host with the Docker daemon installed.

Before installing PCG on VMware, review the following system requirements and permissions. The vSphere user account used
to deploy the PCG must have the required permissions to access the proper roles and objects in vSphere.

Start by reviewing the required action items below:

1. Create the two custom vSphere roles. Check out the [Create Required Roles](#create-required-roles) section to create
   the required roles in vSphere.

2. Review the [vSphere Permissions](#vsphere-permissions) section to ensure the created roles have the required vSphere
   privileges and permissions.

3. Create node zones and regions for your Kubernetes clusters. Refer to the [Zone Tagging](#zone-tagging) section to
   ensure that the required tags are created in vSphere to ensure proper resource allocation across fault domains.

### Create Required Roles

Palette requires two custom roles to be created in vSphere before the installation. Refer to the
[Create a Custom Role](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html?hWord=N4IghgNiBcIE4HsIFMDOIC+Q)
guide if you need help creating a custom role in vSphere. The required custom roles are:

- A root-level role with access to higher-level vSphere objects. This role is referred to as the _spectro root role_.
  Check out the [Root-Level Role Privileges](#root-level-role-privileges) table for the list of privileges required for
  the root-level role.

- A role with the required privileges for deploying VMs. This role is referred to as the _Spectro role_. Review the
  [Spectro Role Privileges](#spectro-role-privileges) table for the list of privileges required for the Spectro role.

The user account you use to deploy the PCG must have access to both roles. Each vSphere object required by Palette must
have a
[Permission](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-4B47F690-72E7-4861-A299-9195B9C52E71.html)
entry for the respective Spectro role. The following tables list the privileges required for the each custom role.

:::info

For an in-depth explanation of vSphere authorization and permissions, check out the
[Understanding Authorization in vSphere](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-74F53189-EF41-4AC1-A78E-D25621855800.html)
resource.

:::

### vSphere Permissions

The vSphere user account that deploys Palette require access to the following vSphere objects and permissions listed in
the following table. Review the vSphere objects and privileges required to ensure each role is assigned the required
privileges.

#### Spectro Root Role Privileges

The spectro root role privileges are only applied to root objects and data center objects. Select the tab for the
vSphere version you are using to view the required privileges for the spectro root role.

<Tabs  groupId="vsphere-version">

<TabItem label="8.0.x" value="8.0.x">

| **vSphere Object**      | **Privilege**                                      |
| ----------------------- | -------------------------------------------------- |
| **CNS**                 | Searchable                                         |
| **Datastore**           | Browse datastore                                   |
| **Host**                | Configuration<br />Storage partition configuration |
| **vSphere Tagging**     | Create and edit vSphere tags                       |
| **Network**             | Assign network                                     |
| **Sessions**            | Validate session                                   |
| **VM Storage Policies** | View VM storage policies                           |
| **Storage views**       | View                                               |

</TabItem>

<TabItem label="7.0.x" value="7.0.x">

| **vSphere Object**         | **Privileges**                                     |
| -------------------------- | -------------------------------------------------- |
| **CNS**                    | Searchable                                         |
| **Datastore**              | Browse datastore                                   |
| **Host**                   | Configuration<br />Storage partition configuration |
| **vSphere tagging**        | Create vSphere Tag<br />Edit vSphere Tag           |
| **Network**                | Assign network                                     |
| **Profile-driven storage** | View                                               |
| **Sessions**               | Validate session                                   |
| **Storage views**          | View                                               |

</TabItem>

<TabItem label="6.0.x" value="6.0.x">

| **vSphere Object**         | **Privileges**                                     |
| -------------------------- | -------------------------------------------------- |
| **CNS**                    | Searchable                                         |
| **Datastore**              | Browse datastore                                   |
| **Host**                   | Configuration<br />Storage partition configuration |
| **vSphere tagging**        | Create vSphere Tag<br />Edit vSphere Tag           |
| **Network**                | Assign network                                     |
| **Profile-driven storage** | Profile-driven storage view                        |
| **Sessions**               | Validate session                                   |
| **Storage views**          | View                                               |

</TabItem>

</Tabs>

:::warning

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), _ReadOnly_ access to the VDS
without “Propagate to children” is required.

:::

#### Spectro Role Privileges

As listed in the table, apply spectro role privileges to vSphere objects you intend to use for the PCG installation. A
separate table lists Spectro role privileges for VMs by category.

During the installation, images and Open Virtual Appliance (OVA) files are downloaded to the folder you selected. These
images are cloned from the folder and applied VMs that deployed during the installation.

Select the tab for the vSphere version you are using to view the required privileges for the spectro role.

<Tabs groupId="vsphere-version">

<TabItem label="8.0.x" value="8.0.x">

| **vSphere Object**    | **Privileges**                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**               | Searchable                                                                                                                        |
| **Datastore**         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**            | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**              | Local operations: Reconfigure VM                                                                                                  |
| **Network**           | Assign network                                                                                                                    |
| **Resource**          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Sessions**          | Validate sessions                                                                                                                 |
| **Storage policies**  | View access for VM storage policies is required.<br />Ensure `StorageProfile.View` is available.                                  |
| **spectro-templates** | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**     | View                                                                                                                              |
| **Tasks**             | Create task<br />Update task                                                                                                      |
| **vApp**              | Import<br />View OVF environment<br />Configure vAPP application<br />Configure vApp instance                                     |
| **vSphere tagging**   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change settings<br />Change swapfile placement<br />Change resource<br />Change host USB device<br />Configure raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Queries                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM files upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Mark as VM<br />Modify customization specification<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                        |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Sphere Replication    | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster: ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

</TabItem>

<TabItem label="7.0.x" value="7.0.x">

| **vSphere Object**         | **Privileges**                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**                    | Searchable                                                                                                                        |
| **Datastore**              | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**                 | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**                   | Local operations: Reconfigure VM                                                                                                  |
| **Network**                | Assign network                                                                                                                    |
| **Resource**               | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Profile-driven storage** | Profile-driven storage view                                                                                                       |
| **Sessions**               | Validate session                                                                                                                  |
| **spectro-templates**      | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**          | Configure service<br />View                                                                                                       |
| **Tasks**                  | Create task<br />Update task                                                                                                      |
| **vApp**                   | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances                                   |
| **vSphere tagging**        | Assign or unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                                             |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| vSphere Replication   | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster<br />ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

</TabItem>

<TabItem label="6.0.x" value="6.0.x">

| **vSphere Object**         | **Privileges**                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**                    | Searchable                                                                                                                        |
| **Datastore**              | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**                 | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**                   | Local operations: Reconfigure VM                                                                                                  |
| **Network**                | Assign network                                                                                                                    |
| **Profile-driven storage** | Profile-driven storage view                                                                                                       |
| **Resource**               | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Sessions**               | Validate session                                                                                                                  |
| **spectro-templates**      | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**          | View                                                                                                                              |
| **Tasks**                  | Create task<br />Update task                                                                                                      |
| **vApp**                   | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances                                   |
| **vSphere tagging**        | Assign or unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                                             |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| vSphere Replication   | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster<br />ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

</TabItem>

</Tabs>

### Zone Tagging

You can use tags to create node zones and regions for your Kubernetes clusters. The node zones and regions can be used
to dynamically place Kubernetes workloads and achieve higher availability. Kubernetes nodes inherit the zone and region
tags as [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Kubernetes workloads can
use the node labels to ensure that the workloads are deployed to the correct zone and region.

The following is an example of node labels that are discovered and inherited from vSphere tags. The tag values are
applied to Kubernetes nodes in vSphere.

| **Label**                                  | **Value** |
| ------------------------------------------ | --------- |
| `topology.kubernetes.io/region`            | `usdc`    |
| `topology.kubernetes.io/zone`              | `zone3`   |
| `failure-domain.beta.kubernetes.io/region` | `usdc`    |
| `failure-domain.beta.kubernetes.io/zone`   | `zone3`   |

:::info

To learn more about node zones and regions, refer to the
[Node Zones/Regions Topology](https://cloud-provider-vsphere.sigs.k8s.io/cloud_provider_interface.html) section of the
Cloud Provider Interface documentation.

:::

Zone tagging is required to install Palette and is helpful for Kubernetes workloads deployed in vSphere clusters through
Palette if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a datacenter and clusters are applied to the Kubernetes nodes
you deploy through Palette into your vSphere environment. Kubernetes clusters deployed to other infrastructure
providers, such as public cloud may have other native mechanisms for auto discovery of zones.

For example, assume a vCenter environment contains three compute clusters, cluster-1, cluster-2, and cluster-3. To
support this environment you create the tag categories `k8s-region` and `k8s-zone`. The `k8s-region` is assigned to the
datacenter, and the `k8s-zone` tag is assigned to the compute clusters.

The following table lists the tag values for the data center and compute clusters.

| **vSphere Object** | **Assigned Name** | **Tag Category** | **Tag Value** |
| ------------------ | ----------------- | ---------------- | ------------- |
| **Datacenter**     | dc-1              | k8s-region       | region1       |
| **Cluster**        | cluster-1         | k8s-zone         | az1           |
| **Cluster**        | cluster-2         | k8s-zone         | az2           |
| **Cluster**        | cluster-3         | k8s-zone         | az3           |

Create a tag category and tag values for each datacenter and cluster in your environment. Use the tag categories to
create zones. Use a name that is meaningful and that complies with the tag requirements listed in the following section.

#### Tag Requirements

The following requirements apply to tags:

- A valid tag must consist of alphanumeric characters.

- The tag must start and end with an alphanumeric characters.

- The regex used for tag validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`
