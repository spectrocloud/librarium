---
sidebar_label: "Create and Manage Nutanix Cluster"
title: "Create and Manage Nutanix Cluster"
description: "Learn how to create and manage Nutanix clusters in Palette."
hide_table_of_contents: false
sidebar_position: 25
tags: ["data center", "nutanix"]
---

Palette supports creating and managing Kubernetes clusters deployed to a Nutanix infrastructure environment. This
section guides you in creating and updating a Kubernetes cluster in a Nutanix cloud managed by Palette.

## Deploy a Nutanix Cluster

### Prerequisites

- A Nutanix cloud account added to Palette. Refer to [Add Nutanix Cloud Account](add-nutanix-cloud-account.md).

<!-- A Nutanix Prism Central cloud account. For more information, review [Add Nutanix Cloud Account](add-nutanix-cloud-account.md).  -->

- A Nutanix Private Cloud Gateway (PCG) deployed. For guidance, review
  [Install Private Cloud Gateway](./install-pcg/install-pcg.md).

- An infrastructure cluster profile created for the Nutanix cloud. For guidance on creating a profile, refer to
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md).
  At the **Cloud Type** step of profile creation, select **Nutanix** listed under the **Tech Preview**. Select the
  custom packs provided at the OS and Kubernetes layers. Palette provides out-of-the-box packs for the network and
  storage profile layers, including the <VersionedLink text="Nutanix CSI" url="/integrations/packs/?pack=nutanix-csi"/>
  storage pack.

- A Nutanix Prism Central account with _Prism Admin_ role.

- A Nutanix Prism Element cluster created.

- A Nutanix subnet created in Nutanix Prism Central that will be assigned to the Virtual Machines (VMs) that will make
  up the Kubernetes cluster.

- A Nutanix Cluster API (CAPI) OS image. For guidance on creating the image, refer to
  [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

### Enablement

Follow the steps below to deploy a Nutanix cluster.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Ensure you are in the correct project scope.

3.  From the left **Main Menu**, select **Clusters** and click **Add New Cluster**.

4.  In **Tech Preview**, select **Nutanix**.

5.  In the bottom-right corner, click **Start Nutanix Configuration**.

6.  Fill out the following basic information, and click **Next** to continue.

    | **Field**         | **Description**                                           |
    | ----------------- | --------------------------------------------------------- |
    | **Cluster Name**  | A custom name for your cluster.                           |
    | **Description**   | Use the description to provide context about the cluster. |
    | **Tags**          | Assign any desired cluster tags.                          |
    | **Cloud Account** | Select your Nutanix account from the **drop-down Menu**.  |

7.  <PartialsComponent
      category="cluster-templates"
      name="profile-vs-template"
      additional_info="Ensure the OS and Kubernetes packs remain empty."
    />

8.  <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

9.  In the **Cluster Configuration Macros** pane, enter values that apply to your Nutanix cloud environment and, if
    necessary, adjust the **Cluster configuration** YAML file to configure your cluster. Click **Next** when you are
    ready to proceed.

    :::info

    The inactive fields are auto-populated from your Nutanix cloud account configuration. When entering other macros,
    make sure to verify the default values.

    :::

    | **Field**                           | **Description**                                                                                                                                                                                                                                                                                                 |
    | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **NUTANIX_ADDITIONAL_TRUST_BUNDLE** | An optional environment variable that allows CAPX to verify certificates that are not issued by a publicly trusted certificate authority. For more information, refer to the [Nutanix Certificate Trust](https://opendocs.nutanix.com/capx/v1.2.x/pc_certificates/#configure-an-additional-trust-bundle) guide. |
    | **CONTROL_PLANE_ENDPOINT_IP**       | The host IP of the CAPX Kubernetes cluster.                                                                                                                                                                                                                                                                     |
    | **CONTROL_PLANE_ENDPOINT_PORT**     | Port of the CAPX Kubernetes cluster that you assigned in `cloudClusterTemplate.yaml`. Defaults to `6443`.                                                                                                                                                                                                       |

10. In the **Node Pool Configuration Macros** panes for the control plane and worker pools, enter the values that apply
    to your Nutanix cloud environment and, if necessary, adjust their **Node pool configuration** YAML files.

    You can configure scaling in the Palette UI by specifying the number of nodes in the pool. This corresponds to
    `replicas` in the YAML file.

    :::info

    The inactive fields are auto-populated from the cluster configuration specified in the previous step. When entering
    other macros, make sure to verify the default values.

    :::

    #### Control Plane Pool

    | **Field**                               | **Description**                                                                                                                                                                                                                                                              |
    | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **TLS_CIPHER_SUITES**                   | Cryptographic algorithms for securing network communications. Refer to [Nutanix Cryptographic Module for OpenSSL](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/security-policies/140sp3460.pdf) for more options and details. |
    | **KUBEVIP_SVC_ENABLE**                  | This setting enables a service of type `LoadBalancer`. Refer to the [Kubernetes Service Load Balancing docs](https://kube-vip.io/docs/about/architecture/#kubernetes-service-load-balancing) for details.                                                                    |
    | **KUBEVIP_LB_ENABLE**                   | This setting allows control plane load balancing using IPVS. Refer to the [Control Plane Load-Balancing docs](https://kube-vip.io/docs/about/architecture/#control-plane-load-balancing) for details.                                                                        |
    | **KUBEVIP_SVC_ELECTION**                | This setting enables watching services of type `LoadBalancer`.                                                                                                                                                                                                               |
    | **NUTANIX_SSH_AUTHORIZED_KEY**          | Your public SSH key.                                                                                                                                                                                                                                                         |
    | **KUBERNETES_VERSION**                  | Your cluster Kubernetes version preceded with `v`, for example, `v1.26.3`.                                                                                                                                                                                                   |
    | **NUTANIX_MACHINE_BOOT_TYPE**           | The VM boot type. Depends on the OS image you're using. Allowed values: `legacy`, `uefi`. Defaults to `legacy`.                                                                                                                                                              |
    | **NUTANIX_PRISM_ELEMENT_CLUSTER_NAME**  | The name of your Nutanix AHV cluster as defined in Prism.                                                                                                                                                                                                                    |
    | **NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME** | The name of your OS image as defined in Prism Central. To locate images, in the Nutanix Prism dashboard, navigate to **Compute & Storage** and select **Images**.                                                                                                            |
    | **NUTANIX_MACHINE_MEMORY_SIZE**         | Amount of memory. Defaults to `4Gi`.                                                                                                                                                                                                                                         |
    | **NUTANIX_SUBNET_NAME**                 | The name of the subnet defined in Prism Central, which will be assigned to the VMs deployed in this cluster.                                                                                                                                                                 |
    | **NUTANIX_SYSTEMDISK_SIZE**             | Amount of storage assigned to the system disk. Defaults to `40Gi`.                                                                                                                                                                                                           |
    | **NUTANIX_MACHINE_VCPU_SOCKET**         | Number of vCPU sockets. Defaults to `2`.                                                                                                                                                                                                                                     |
    | **NUTANIX_MACHINE_VCPU_PER_SOCKET**     | Number of vCPUs per socket. Defaults to `1`.                                                                                                                                                                                                                                 |

    #### Worker Pool

    | **Field**                               | **Description**                                                                                                                                                                                                                                                              |
    | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **KUBERNETES_VERSION**                  | Your cluster Kubernetes version preceded with `v`, for example, `v1.26.3`.                                                                                                                                                                                                   |
    | **NUTANIX_MACHINE_BOOT_TYPE**           | The VM boot type. Depends on the OS image you're using. Allowed values: `legacy`, `uefi`. Defaults to `legacy`.                                                                                                                                                              |
    | **NUTANIX_PRISM_ELEMENT_CLUSTER_NAME**  | The name of your Nutanix AHV cluster as defined in Prism.                                                                                                                                                                                                                    |
    | **NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME** | The name of your OS image as defined in Prism Central. To locate images, in the Nutanix Prism dashboard, navigate to **Compute & Storage** and select **Images**.                                                                                                            |
    | **NUTANIX_MACHINE_MEMORY_SIZE**         | Amount of memory. Defaults to `4Gi`.                                                                                                                                                                                                                                         |
    | **NUTANIX_SUBNET_NAME**                 | The name of the subnet defined in Prism Central, which will be assigned to the VMs deployed in this cluster.                                                                                                                                                                 |
    | **NUTANIX_SYSTEMDISK_SIZE**             | Amount of storage assigned to the system disk. Defaults to `40Gi`.                                                                                                                                                                                                           |
    | **NUTANIX_MACHINE_VCPU_SOCKET**         | Number of vCPU sockets. Defaults to `2`.                                                                                                                                                                                                                                     |
    | **NUTANIX_MACHINE_VCPU_PER_SOCKET**     | Number of vCPUs per socket. Defaults to `1`.                                                                                                                                                                                                                                 |
    | **TLS_CIPHER_SUITES**                   | Cryptographic algorithms for securing network communications. Refer to [Nutanix Cryptographic Module for OpenSSL](https://csrc.nist.gov/CSRC/media/projects/cryptographic-module-validation-program/documents/security-policies/140sp3460.pdf) for more options and details. |
    | **NUTANIX_SSH_AUTHORIZED_KEY**          | Your public SSH key.                                                                                                                                                                                                                                                         |

11. Click **Next** when you are done.

12. Review the options for OS patching schedule, scanning, backups, and RBAC.

13. Click **Validate** and review the cluster configuration and settings summary.

14. Click **Finish Configuration** to deploy the cluster. The cluster details page contains the status and details of
    the deployment. Use this page to track deployment progress. Provisioning clusters can take several minutes to
    complete.

### Validate

1.  Log in to [Palette](https://console.spectrocloud.com/).

2.  Navigate to the left **Main Menu** and select **Clusters**. The Clusters page displays a list of all available
    clusters that Palette manages.

3.  Click on the Nutanix cluster you created to view its details page.

4.  Ensure the **Cluster Status** field displays **Running**.

## Update a Deployed Cluster

Palette supports editing the settings of a deployed Nutanix cluster, including the control plane and worker node pool
configurations. You can change the memory, CPU, or storage of your node pools. Follow the steps described below to
update your cluster.

### Prerequisites

- An active Nutanix cluster in Palette.
- The `cluster.update` permission to update clusters. Refer to
  [Roles and Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) for more
  information.

### Enablement

1.  Log in to [Palette](https://console.spectrocloud.com/).

2.  From the left **Main Menu**, select **Clusters**.

3.  Click on the Nutanix cluster you created.

4.  To edit the cluster settings, from the cluster details page, click **Settings** and select **Cluster
    Configuration**. Edit the YAML file that Palette displays.

#### Update Control Plane Node Pool

5. Navigate to the cluster details page and click the **Nodes** tab.

6. In the control plane node pool you want to edit, click **Edit** to open its YAML configuration file.

7. Edit the `NutanixMachineTemplate` object. You can update the memory (`memorySize`), CPU (`vcpuSockets` and
   `vcpuPerSocket`), and storage (`systemDiskSize`). Once you are finished changing the node pool configurations, update
   the `name` parameter under the `metadata` line. For example, if the previous name was
   **control-plane-pool-resource-3**, rename it to **control-plane-pool-resource-4**.

   :::warning

   You must update the node pool name for the configuration updates to take effect.

   :::

8. Edit the `KubeadmControlPlane` object. Change the `name` parameter under the `kind: NutanixMachineTemplate` line to
   match the new name you used in the `NutanixMachineTemplate` object.

9. When you are done updating the control plane node pool configuration, click **Confirm** and **Continue** to confirm
   the changes.

#### Update Worker Node Pool

10. Navigate to the cluster details page and click the **Nodes** tab.

11. In the worker node pool you want to edit, click **Edit** to open its YAML configuration file.

12. Edit the `NutanixMachineTemplate` object. You can update the memory (`memorySize`), CPU (`vcpuSockets` and
    `vcpuPerSocket`), and storage (`systemDiskSize`). Once you are finished editing the node pool configurations, update
    the `name` parameter under the `metadata` line. For example, if the previous name was **worker-pool-resource-3**,
    rename it to **worker-pool-resource-4**.

    :::warning

    You must update the node pool name for the configuration updates to take effect.

    :::

13. Edit the `MachineDeployment` object. Change the `name` parameter under the `kind: NutanixMachineTemplate` line to
    match the new name you used in the `NutanixMachineTemplate` object.

14. When you are done updating the worker node pool configuration, click **Confirm** and **Continue** to confirm the
    changes.

15. The node pool alterations will trigger a
    [cluster repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration). Follow the
    [Approve Cluster Repave](../../cluster-management/node-pool.md#approve-cluster-repave) guide to incorporate the
    updates to your cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**.

3. Click on the Nutanix cluster you deployed, and then click on the **Nodes** tab.

4. Verify that all nodes are in the **Running** and **Healthy** status, and reflect the applied repave changes.
