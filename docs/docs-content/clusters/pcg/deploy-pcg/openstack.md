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

- Palette version 4.0.X or greater.

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

1.  In an x86 Linux host with the Palette CLI installed, open up a terminal session.

2.  Set your Palette CLI encryption passphrase value in an environment variable. Use the following command to set the
    passphrase. Replace `*************` with your passphrase.

    ```shell
    export PALETTE_ENCRYPTION_PASSWORD=*************
    ```

3.  Issue the following command to authenticate with Palette. When prompted, enter the required information. Refer to
    the table below for information about each parameter.

    ```shell
    palette login
    ```

    | **Parameter**                  | **Description**                                                                                                                                                                                                                                                    |
    | :----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance.                                                                      |
    | **Allow Insecure Connection**  | Enabling this option bypasses x509 server Certificate Authority (CA) verification. Enter `y` if you are using a self-hosted Palette or VerteX instance with self-signed TLS certificates and need to provide a file path to the instance CA. Otherwise, enter `n`. |
    | **Spectro Cloud API Key**      | Enter your Palette API Key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md) guide to create an API key.                                                                                                           |
    | **Spectro Cloud Organization** | Select your Palette Organization name.                                                                                                                                                                                                                             |
    | **Spectro Cloud Project**      | Select the project you want to register the OpenStack account in.                                                                                                                                                                                                  |
    | **Acknowledge**                | Accept the login banner message. Login banner messages are only displayed if the tenant admin enabled a login banner.                                                                                                                                              |

    :::info

    The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the **pcg.yaml** file are encrypted and cannot be manually
    updated. To change these values, use the `palette pcg install --update-passwords` command. Refer to the
    [PCG command](../../../automation/palette-cli/commands/pcg.md#update-passwords) reference page for more information.

    :::

4.  Once you have authenticated successfully, start the PCG installer by issuing the following command. Refer to the
    table below for information about each parameter.

    ```bash
    palette pcg install
    ```

    | **Parameter**                                        | **Description**                                                                                                                                                                                                                                                                    |
    | :--------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Management Plane Type**                            | Select Palette or VerteX.                                                                                                                                                                                                                                                          |
    | **Enable Ubuntu Pro (required for production)**      | Enter `y` if you want to use Ubuntu Pro and provide an Ubuntu Pro token. Otherwise press `n`.                                                                                                                                                                                      |
    | **Select an image registry type**                    | For a non-airgap installation, choose `Default` to pull images from public image registries. This requires an internet connection. For an airgap installation, select `Custom` and point to our airgap support VM or a custom internal registry that contains the required images. |
    | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope.                                                                |
    | **Cloud Type**                                       | Select OpenStack.                                                                                                                                                                                                                                                                  |
    | **Private Cloud Gateway Name**                       | Enter a custom name for the PCG. Example: `openstack-pcg-1`.                                                                                                                                                                                                                       |
    | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope.                                                                |

5.  Next, provide environment configurations for the cluster. Refer to the following table for information about each
    option.

    <PartialsComponent category="pcg" name="proxy-certificate-propagation" />

6.  If you selected `Custom` for the image registry type, you will be prompted to provide the following information.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                                                    |
    | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Registry Name**                                        | Assign a name to the custom registry.                                                                                                                                                                                                                              |
    | **Registry Endpoint**                                    | The endpoint or IP address for the custom registry. Example: `https://palette.example.com` or `https://10.10.1.0`.                                                                                                                                                 |
    | **Registry Base Content Path**                           | The base content path for the custom registry. Example: `spectro-images`.                                                                                                                                                                                          |
    | **Configure Registry Mirror**                            | Your system default text editor, such as Vi, will open up and allow you to customize the default mirror registry settings. Add any additional registry mirrors you want to add. Otherwise, press `Esc` and then `:wq` to save and exit the file.                   |
    | **Allow Insecure Connection (Bypass x509 Verification)** | Enabling this option bypasses x509 CA verification. Enter `n` if using a custom registry with self-signed SSL certificates. Otherwise, enter `y`. If you enter `y`, you will receive a follow-up prompt asking you to provide the file path to the CA certificate. |
    | **Registry CA certificate Filepath**                     | The CA certificate for the custom registry. This is optional. Provide the file path of the CA certificate on the installer host. Example: `/usr/local/share/ca-certificates/ca.crt`.                                                                               |
    | **Registry Username**                                    | The username for the custom registry.                                                                                                                                                                                                                              |
    | **Password**                                             | The password for the custom registry.                                                                                                                                                                                                                              |

7.  Next, provide the OpenStack environment configurations. Refer to the following table for information about each
    option.

    | **Parameter**                   | **Description**                                                                                                                                                                            |
    | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **OpenStack Identity Endpoint** | OpenStack Identity endpoint. Domain or IP address. Example: `https://openstack.mycompany.com/identity`.                                                                                    |
    | **OpenStack Account Username**  | OpenStack account username.                                                                                                                                                                |
    | **OpenStack Account Password**  | OpenStack account password.                                                                                                                                                                |
    | **Allow Insecure Connection**   | Enabling this option bypasses x509 verification. Enter `y` if you are using an OpenStack instance with self-signed TLS certificates. Otherwise, enter `n`.                                 |
    | **CA certificate Filepath**     | The CA certificate for the OpenStack environment. This is optional. Provide the file path of the CA certificate on the installer host. Example: `/usr/local/share/ca-certificates/ca.crt`. |
    | **Default Domain**              | The default domain for the OpenStack environment.                                                                                                                                          |
    | **Default Region**              | The default region for the OpenStack environment.                                                                                                                                          |
    | **Default Project**             | The default project for the OpenStack environment.                                                                                                                                         |

    After providing the OpenStack environment configurations and credentials, the Palette CLI will query the OpenStack
    environment to validate the credentials. If the credentials are valid, the installation process will continue. If
    the credentials are invalid, you will be prompted to re-enter the credentials.

8.  After the OpenStack environment configurations are validated, you will be prompted for additional OpenStack
    configuration values. Use the following table to learn more about each option.

    | **Parameter**                             | **Description**                                                                                                                                                                                                                                                               |
    | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Domain**                                | Select the domain you want to target for the PCG deployment. Example: `Default`.                                                                                                                                                                                              |
    | **Region**                                | Select a region for the PCG deployment.                                                                                                                                                                                                                                       |
    | **Project**                               | Specify an OpenStack project to place the PCG cluster in.                                                                                                                                                                                                                     |
    | **Placement Type**                        | Placement can be static or dynamic. For static placement, cluster nodes are placed into existing networks. For dynamic placement, a new network is created.                                                                                                                   |
    | **Network**                               | Select an existing network. This is only required for static placement.                                                                                                                                                                                                       |
    | **Subnet**                                | Select an existing subnet. This is only required for static placement.                                                                                                                                                                                                        |
    | **DNS Server(s)**                         | Enter a comma-separated list of DNS server IPs. This is only required for dynamic placement.                                                                                                                                                                                  |
    | **Node CIDR**                             | Enter a node CIDR. This is only required for dynamic placement. Example: `10.55.0.0/24`.                                                                                                                                                                                      |
    | **SSH Public Key**                        | Provide the public OpenSSH key for the PCG cluster. Use this key when establishing an SSH connection with the PCG cluster. This prompt will result in the default text editor for the Operating System to open. Vi is the more common text editor used in Linux environments. |
    | **Patch OS on boot**                      | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.                                                                                                                                                                                   |
    | **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are complete. This only applies if the **Patch OS on boot** parameter is enabled.                                                                                                                |
    | **AZs**                                   | Select the availability zones for the PCG cluster.                                                                                                                                                                                                                            |
    | **Flavor**                                | Specify the OpenStack Flavor for the PCG nodes.                                                                                                                                                                                                                               |
    | **Number of Nodes**                       | Specify the number of nodes for the PCG cluster. We recommend three-node clusters for production workloads.                                                                                                                                                                   |
    | **Node Affinity**                         | Enter `y` to schedule all Palette pods on the control plane node.                                                                                                                                                                                                             |

9.  A new PCG configuration file is generated, and its location is displayed on the console. You will receive an output
    similar to the following.

    ```bash hideClipboard
    ==== PCG config saved ====
    Location: :/home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
    ```

    The Palette CLI will now provision a PCG cluster in your OpenStack environment. You can monitor the progress of the
    PCG cluster by navigating to Palette and selecting **Tenant Settings** from the left **Main Menu**. Next, click on
    **Private Cloud Gateways** from the left **Tenant Settings Menu** and select the PCG cluster you just deployed to
    access its details page. From the details page, select the **Events** tab to view the progress of the PCG cluster
    deployment.

    If you encounter issues during the installation, refer to the [PCG Troubleshooting](../../../troubleshooting/pcg.md)
    guide for debugging assistance. If you need additional help, reach out to our
    [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) team.

    :::warning

    You cannot modify a deployed PCG cluster. If you need to make changes to the PCG cluster, you must first delete the
    cluster and redeploy it. We recommend you save your PCG configuration file for future use. Use the `--config-only`
    flag to save the configuration file without deploying the PCG cluster. Refer to the
    [Generate a Configuration File](../../../automation/palette-cli/commands/pcg.md#generate-a-configuration-file)
    section to learn more. For additional assistance, visit our
    [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

    :::

10. To avoid potential vulnerabilities, once the installation is complete, remove the `kind` images that were installed
    in the environment where you initiated the installation.

    Issue the following command to list all instances of `kind` that exist in the environment.

    ```shell
    docker images
    ```

    ```shell
    REPOSITORY     TAG        IMAGE ID       CREATED        SIZE
    kindest/node   v1.26.13   131ad18222cc   5 months ago   910MB
    ```

    Then, use the following command template to remove all instances of `kind`.

    ```shell
    docker image rm kindest/node:<version>
    ```

    Consider the following example for reference.

    ```shell
    docker image rm kindest/node:v1.26.13
    ```

    ```shell
    Untagged: kindest/node:v1.26.13
    Untagged: kindest/node@sha256:15ae92d507b7d4aec6e8920d358fc63d3b980493db191d7327541fbaaed1f789
    Deleted: sha256:131ad18222ccb05561b73e86bb09ac3cd6475bb6c36a7f14501067cba2eec785
    Deleted: sha256:85a1a4dfc468cfeca99e359b74231e47aedb007a206d0e2cae2f8290e7290cfd
    ```

## Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, click on **Private Cloud Gateways**. Verify your PCG cluster is available from the
   list of PCG clusters displayed and that its **Status** is healthy.

4. Navigate to the left **Tenant Settings Menu** and select **Cloud Accounts**.

5. Verify a new OpenStack cloud account is available from the list of cloud accounts displayed.

## Next Steps

After you have successfully deployed the PCG into your OpenStack environment, you can now deploy Kubernetes clusters in
your OpenStack environment through Palette. Check out the
[Deploying an OpenStack Cluster](../../data-center/openstack.md) guide to learn how to deploy a Kubernetes cluster in
OpenStack that is managed by Palette.
