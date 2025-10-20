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
   environments. Once installed, the PCG registers itself with Palette and enables secure communication between the SaaS
   portal and the private cloud environment. The PCG enables installation and end-to-end lifecycle management of
   Kubernetes clusters in private cloud environments from Palette.

   ![openstack_cluster_architecture.webp](/openstack_cluster_architecture.webp)

   Refer to the [PCG Architecture](../pcg/architecture.md) section to learn more about the PCG architecture.

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

## Create an OpenStack Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be
used to create tenant clusters. Additional cloud accounts may be created if desired within the same gateway.

### Prerequisites

- A PCG is installed and available in the OpenStack. Refer to the [Deploy to OpenStack](../pcg/deploy-pcg/openstack.md)
  guide to learn how to deploy a PCG.

### Create Cloud Account

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

## Deploy an OpenStack Cluster

<Video
  title="openstack-cluster-creation"
  src="/videos/clusters/data-center/cluster-creation-videos/openstack.mp4"
></Video>

### Prerequisites

- A PCG is installed and available in the OpenStack. Refer to the [Deploy to OpenStack](../pcg/deploy-pcg/openstack.md)
  guide to learn how to deploy a PCG.

<!-- prettier-ignore-start -->

:::caution

OpenStack support is limited to the Kubernetes distribution <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> for version 1.24.x.

:::

<!-- prettier-ignore-end -->

### Deploy Cluster

The following steps need to be performed to provision a new OpenStack cluster:

1. Provide basic cluster information like Name, Description, and Tags. Tags are currently not propagated to the VMs
   deployed on the cloud/data center environments.

2. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

3. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

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

| **Parameter**                                      | **Description**                                                                                                                                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                           | A descriptive name for the node pool.                                                                                                                                                                               |
| **Size**                                           | Number of VMs to be provisioned for the node pool. For the control plane pool, this number can be 1, 3, or 5.                                                                                                       |
| **Allow worker capability**                        | Select this option for allowing workloads to be provisioned on control plane nodes.                                                                                                                                 |
| **[Labels](../cluster-management/node-labels.md)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                            |
| **[Taints](../cluster-management/taints.md)**      | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                      |
| **Instance type**                                  | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                         |
| **Availability Zones**                             | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected. |
| **Disk Size**                                      | Give the required storage size                                                                                                                                                                                      |

### Worker Pool

| **Parameter**                                      | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                           | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Enable Autoscaler**                              | Scale the pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. Setting both parameters to the same value results in a static node count. Refer to the Cluster API [autoscaler documentation](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md) for more information on autoscaling. |
| **Size**                                           | Number of VMs to be provisioned for the node pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                            |
| **Rolling Update**                                 | Rolling update has two available options. The expand option launches a new node first, then shuts down old one. The contract option shuts down a old one first, then launches new one.                                                                                                                                                                                                                                                                                     |
| **[Labels](../cluster-management/node-labels.md)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                                                                                                                                                                                                                                                                                   |
| **[Taints](../cluster-management/taints.md)**      | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                                                                                                                                                                                                                                                                             |
| **Instance type**                                  | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                                                |
| **Availability Zones**                             | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.                                                                                                                                                                                                                                                        |
| **Disk Size**                                      | Provide the required storage size                                                                                                                                                                                                                                                                                                                                                                                                                                          |

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

## Force Delete a Cluster

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
