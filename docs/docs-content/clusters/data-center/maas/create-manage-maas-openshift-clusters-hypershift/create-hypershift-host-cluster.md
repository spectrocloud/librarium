---
sidebar_label: "Create HyperShift Host Cluster"
title: "Create HyperShift Host Cluster"
description:
  "Learn how to create a HyperShift host cluster on MAAS in Palette to host OpenShift control plane components."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
sidebar_position: 20
---

:::preview

:::

The HyperShift host cluster is a MAAS cluster with the HyperShift Operator installed as a system app. It runs the
OpenShift control plane components as pods for all downstream OpenShift workload clusters. You must deploy this host
cluster in Palette before creating any OpenShift workload clusters.

## Limitations

- The HyperShift host cluster cannot be deleted if there are any workload clusters using it as a host. You must delete
  all associated workload clusters before deleting the host cluster.

## Prerequisites

- A [MAAS account registered in Palette](../register-manage-maas-cloud-accounts.md). All MAAS-registered Palette
  accounts must use either a System Private Gateway or Private Cloud Gateway (PCG) to connect to the MAAS environment.
  For more information on which to use, refer to the MAAS [Architecture](../architecture.md) guide.

  - If your Palette instance does not have a direct connection to the MAAS environment, you must
    [deploy a PCG](../../../pcg/deploy-pcg/maas.md) to your MAAS environment.
  - If you are using a self-hosted Palette or Palette VerteX instance with a direct connection to your MAAS environment,
    you can use Palette's [System Private Gateway](../../../pcg/architecture.md#system-private-gateway).

- The **HypershiftOpenshiftCluster** feature flag enabled in the Palette
  [system console](../../../../enterprise-version/system-management/feature-flags.md).

- The [Cluster Admin](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role in
  Palette.

  - You may also need the
    [Cluster Profile Admin](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
    role if you have not yet created a cluster profile for the HyperShift host cluster.

- A cluster profile for the HyperShift host cluster configured with the following packs:

  - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> for
    the **Kubernetes** layer.
  - <VersionedLink text="HyperShift Operator" url="/integrations/packs/?pack=spectro-hypershift-operator&tab=main" />
    added as a **System App** layer.

  Refer to [Cluster Profiles](../../../../profiles/cluster-profiles/cluster-profiles.md) for guidance on creating
  cluster profiles.

- Sufficient bare-metal resources in MAAS for the host cluster nodes. The host cluster must have enough capacity to run
  the OpenShift control plane pods for all intended workload clusters. A minimum of three control plane nodes spread
  across different availability zones is recommended for high availability.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**, and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**, then click **Start MAAS Configuration**.

5. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**.

   From the **Cloud Account** drop-down menu, select your MAAS cloud account.

   Click **Next** when done.

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. On the **Cluster Config** step, select a domain from the **Domains** drop-down menu. You can also specify **NTP
   Servers**.

   :::warning

   Although optional, we recommend specifying Network Time Protocol (NTP) servers to ensure that the cluster nodes have
   the correct time. If no NTP servers are specified, it could lead to time drift issues.

   :::

9. Click the **Host HyperShift-based control planes** toggle to enable this cluster to deploy HyperShift control planes
   for OpenShift workload clusters. Click **Next** when done.

10. On the **Nodes Config** step, configure the control plane and, optionally, worker node pools.

    The following input fields apply to MAAS node pools. For a description of input fields common across target
    platforms, refer to [Node Pools](../../../cluster-management/node-pool.md). Click **Next** when done.

    ### Cloud Configuration

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                      |
    | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource pool**      | The [MAAS resource pool](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-resource-pools) from which to select available servers for deployment. Filter available servers to only those that have at least the amount of **Minimum CPU** and **Minimum Memory** selected. |
    | **Minimum CPU**        | The minimum number of CPU cores required for servers in this node pool.                                                                                                                                                                                                                              |
    | **Minimum Memory**     | The minimum amount of memory required for servers in this node pool.                                                                                                                                                                                                                                 |
    | **Availability zones** | Specify the [Availability Zones (AZs)](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-availability-zones) for the node pool.                                                                                                                                            |
    | **Tags**               | Specify the MAAS machine tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags-flexible-labels) documentation.                        |

11. <PartialsComponent category="clusters" name="cluster-settings" />

12. Select **Validate** to review your cluster configuration and settings.

13. If no changes are needed, select **Finish Configuration** to deploy the host cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the HyperShift host cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

5. In the **Cluster Profiles** section, confirm the **HyperShift Operator** system app is installed and in a healthy
   state (green icon).

## Next Steps

Now that the HyperShift host cluster is running, you can create OpenShift workload clusters that use it to host their
control plane components.

- [Create OpenShift Workload Cluster with HyperShift Control Plane](./create-openshift-workload-cluster.md)
