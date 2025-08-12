---
sidebar_label: "Deploy to OpenStack"
title: "Deploy to OpenStack"
description: "Steps to deploy a PCG cluster to OpenStack"
hide_table_of_contents: false
sidebar_position: 30
tags: ["pcg"]
---

This guide provides you with the steps to deploy a PCG cluster to an OpenStack environment. Before you begin the
installation, carefully review the [Prerequisites](#prerequisites) section.

## Prerequisites

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../downloads/cli-tools.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

- You will need to provide the Palette CLI an encryption passphrase to secure sensitive data. The passphrase must be
  between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character.
  Refer to the [Palette CLI Encryption](../../../automation/palette-cli/palette-cli.md#encryption) section for more
  information.

The following system requirements must be met to install a PCG in OpenStack:

- PCG IP address requirements:

  - One IP address for a single-node PCG or three IP addresses for a three-node PCG. Refer to the
    [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.

- An x86 Linux environment with a Docker daemon installed and a connection to Palette and the OpenStack endpoint. The
  Palette CLI installation must be invoked on an up-to-date Linux system with the x86-64 architecture.

- An Open Stack SSH Key Pair. Refer to the
  [Configure access and security for instances](https://docs.openstack.org/horizon/latest/user/configure-access-and-security-for-instances.html)
  guide to learn how to create an SSH key pair.

- An OpenStack user account with the required permissions to deploy the PCG. Review the
  [OpenStack Cloud Account Permissions](#openstack-cloud-account-permissions) section to learn more about the required
  permissions.

### OpenStack Cloud Account Permissions

The following permissions are required to deploy a PCG to OpenStack and for Palette to register an OpenStack account.

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

## Deploy PCG

<PartialsComponent category="pcg" name="pcg-initial-installation" edition="OpenStack" />

8.  Next, provide the OpenStack environment configurations.

    | **Parameter**                   | **Description**                                                                                                                                                                           |
    | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **OpenStack Identity Endpoint** | Enter the OpenStack Identity endpoint. Domain or IP address. Example: `https://openstack.mycompany.com/identity`.                                                                         |
    | **OpenStack Account Username**  | Enter your OpenStack account username.                                                                                                                                                    |
    | **OpenStack Account Password**  | Enter your OpenStack account password.                                                                                                                                                    |
    | **Allow Insecure Connection**   | Bypass x509 verification. Enter `y` if you are using an OpenStack instance with self-signed TLS certificates. Otherwise, enter `n`.                                                       |
    | **CA certificate Filepath**     | (Optional) Enter the CA certificate for the OpenStack environment. Provide the file path of the CA certificate on the installer host. Example: `/usr/local/share/ca-certificates/ca.crt`. |
    | **Default Domain**              | Enter the default domain for the OpenStack environment.                                                                                                                                   |
    | **Default Region**              | Enter the default region for the OpenStack environment.                                                                                                                                   |
    | **Default Project**             | Enter the default project for the OpenStack environment.                                                                                                                                  |

    After providing the OpenStack environment configurations and credentials, the Palette CLI will query the OpenStack
    environment to validate the credentials. If the credentials are valid, the installation process continues;
    otherwise, you are prompted to re-enter the credentials.

9.  After the OpenStack environment configurations are validated, you are prompted to enter additional OpenStack
    configuration values.

    | **Parameter**                             | **Description**                                                                                                                                                                                                                                              |
    | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Domain**                                | Select the domain you want to target for the PCG deployment. Example: `Default`.                                                                                                                                                                             |
    | **Region**                                | Select a region for the PCG deployment.                                                                                                                                                                                                                      |
    | **Project**                               | Specify an OpenStack project to place the PCG cluster in.                                                                                                                                                                                                    |
    | **Placement Type**                        | Select a **Static** or **Dynamic** placement type. For static placement, cluster nodes are placed into existing networks. For dynamic placement, a new network is created.                                                                                   |
    | **Network**                               | (Static placement only) Select an existing network.                                                                                                                                                                                                          |
    | **Subnet**                                | (Static placement only) Select an existing subnet.                                                                                                                                                                                                           |
    | **DNS Server(s)**                         | (Dynamic placement only) Enter a comma-separated list of DNS server IPs.                                                                                                                                                                                     |
    | **Node CIDR**                             | (Dynamic placement only) Enter a node CIDR. Example: `10.55.0.0/24`.                                                                                                                                                                                         |
    | **SSH Public Key**                        | Provide the public OpenSSH key for the PCG cluster. Use this key when establishing an SSH connection with the PCG cluster. Your system default text editor, such as Vi, will open and prompt you to enter the SSH key. Save and exit the file when finished. |
    | **Patch OS on boot**                      | Indicate whether to patch the OS of the PCG hosts on the first boot.                                                                                                                                                                                         |
    | **Reboot nodes once OS patch is applied** | Indicate whether to reboot PCG nodes after OS patches are complete. This applies only if **Patch OS on boot** is enabled.                                                                                                                                    |
    | **AZs**                                   | Select the availability zones for the PCG cluster.                                                                                                                                                                                                           |
    | **Flavor**                                | Specify the OpenStack Flavor for the PCG nodes.                                                                                                                                                                                                              |
    | **Number of Nodes**                       | Specify the number of nodes for the PCG cluster. Available options are **1** or **3**. We recommend three nodes for a High Availability (HA) cluster in a production environment.                                                                            |
    | **Node Affinity**                         | Enter `y` to schedule all Palette pods on the control plane node.                                                                                                                                                                                            |

10. <PartialsComponent category="pcg" name="pcg-cluster-provisioning" edition="OpenStack" />

11. <PartialsComponent category="pcg" name="pcg-kind-cleanup" />

## Validate

<PartialsComponent category="pcg" name="pcg-validate" edition="OpenStack" />

## Next Steps

After you have successfully deployed the PCG into your OpenStack environment, you can deploy Kubernetes clusters in your
OpenStack environment through Palette. Check out the [Deploying an OpenStack Cluster](../../data-center/openstack.md)
guide to learn how to deploy a Kubernetes cluster in OpenStack that is managed by Palette.
