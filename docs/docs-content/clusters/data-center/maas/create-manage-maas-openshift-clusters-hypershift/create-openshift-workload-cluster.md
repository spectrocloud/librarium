---
sidebar_label: "Create OpenShift Workload Cluster"
title: "Create OpenShift Workload Cluster with HyperShift Control Plane"
description:
  "Learn how to create OpenShift workload clusters on MAAS using a HyperShift hosted control plane in Palette."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
sidebar_position: 30
---

:::preview

:::

OpenShift workload clusters use a hosted control plane model where their Kubernetes control plane components run as pods
in the HyperShift host cluster. Worker nodes are then provisioned as bare-metal MAAS hosts.

## Limitations

- It is not possible to install additional add-on layers on OpenShift workload clusters through Palette. If you need to
  install add-ons such as MetalLB and Piraeus, we recommend using the [OperatorHub](https://operatorhub.io/). The
  OperatorHub is accessed through the OpenShift console of your workload cluster. Add-ons installed through the
  OperatorHub are managed directly through the OpenShift console and are not visible in Palette.

- Only the Bring Your Own OS (BYOOS) pack is supported for the OS layer. The RHCOS image must be built specifically for
  MAAS using the process described in [Build and Import MAAS-Compatible RHCOS Image](./build-import-rhcos-image.md).
  Standard MAAS OS images are not compatible with OpenShift.

- Open Virtual Networking (OVN)-Kubernetes is configured automatically by the OpenShift pack. A dedicated OVN-Kubernetes
  Container Network Interface (CNI) pack is not supported. The CNI layer of the workload cluster profile must use the
  OVN-Kubernetes CNI pack as a passthrough as mentioned in the
  [prerequisites](./create-openshift-workload-cluster.md#prerequisites) for creating OpenShift workload clusters.

- Some Day 1 operations are not available through Palette, such as configuring an external OpenID Connect (OIDC)
  provider or Network Time Protocol (NTP) servers.

- Some Day 2 operations are not available through Palette, such as OS patching, security and compliance scans, backup
  and restore, and maintenance mode.

## Prerequisites

- The MAAS-compatible RHCOS image imported in
  [Build and Import MAAS-Compatible RHCOS Image](./build-import-rhcos-image.md) must be available in your MAAS
  environment.

- The HyperShift host cluster created in [Create HyperShift Host Cluster](./create-hypershift-host-cluster.md) must be
  in the **Running** state with the HyperShift Operator healthy.

- The [Cluster Admin](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role in
  Palette.

  - - If you have not yet created a cluster profile for the HyperShift host cluster, you also need the
      [Cluster Profile Admin](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
      role.

- A cluster profile for your OpenShift workload clusters configured with the following packs:

  - <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi" /> pack for the OS
    layer. Set the following parameters in the pack values.

    | Parameter              | Description                                                                                                                                                                                                                                | Example value               |
    | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
    | `pack.osImageOverride` | The name of the MAAS image imported when following the [Build and Import MAAS-Compatible RHCOS Image](./build-import-rhcos-image.md) guide. This should match the `<image-name>` parameter specified in the `import-maas-image.sh` script. | `rhcos-4.20.13-with-ubuntu` |
    | `pack.osName`          | The value of the `<operating-system>` parameter specified during import.                                                                                                                                                                   | `openshift`                 |
    | `pack.osVersion`       | The value of the `<release-version>` parameter specified during import.                                                                                                                                                                    | `4.20.13`                   |

  - <VersionedLink text="OpenShift" url="/integrations/packs/?pack=openshift&tab=main" /> pack for the Kubernetes layer.
    Ensure the OpenShift version is compatible with the HyperShift Operator version installed on the host cluster. Refer
    to the [HyperShift Operator (HO) Versioning
    Support](https://hypershift-docs.netlify.app/reference/versioning-support/#ho) documentation for guidance.

    - Ensure to set the Red Hat OpenShift pull secret in the `cluster.pullSecret` parameter of the OpenShift pack
      values. This is required for the OpenShift installer to pull necessary images from Red Hat's container registry.
      Obtain your pull secret from the
      [Red Hat OpenShift Cluster Manager](https://console.redhat.com/openshift/install/pull-secret). The pull secret
      must be Base64-encoded.

      <details>

      <summary> Example command to encode the pull secret in Base64 </summary>

      In this example, the pull secret is stored in a file named `pull-secret.txt`. The command reads the pull secret
      from the file, encodes it in Base64 format, and sets it as the `OPENSHIFT_PULL_SECRET` environment variable. The
      `--wrap 0` option for `base64` ensures that the output is a single line, which is necessary for proper formatting
      in the OpenShift pack values.

      ```bash title="Base64 encode pull secret"
      export OPENSHIFT_PULL_SECRET=$(cat pull-secret.txt | base64 --wrap 0)
      echo $OPENSHIFT_PULL_SECRET
      ```

      </details>

    - We recommend to add the `cluster.controlPlaneHighAvailability` parameter to the OpenShift pack values and set it
      to `true`. This parameter is not present by default and must be added manually.

      ```yaml hideClipboard title="Example OpenShift pack values with control plane HA enabled" {4}
      pack:
      ...
      cluster:
        controlPlaneHighAvailability: true
        ...
      ```

      - When `cluster.controlPlaneHighAvailability` is `true`, the hosted control plane runs in HA mode with multiple
        replicas of API server, etcd, and other components. This allows PodDisruptionBudgets (PDBs) to maintain
        availability during node repave, and drain operations can proceed without issues.
      - When `cluster.controlPlaneHighAvailability` is `false` or not set, the hosted control plane runs with a single
        replica (non-HA). In this configuration, a node repave or any other operation that drains the node hosting that
        control plane replica can remain blocked because the PDB prevents eviction of the control plane pod. The typical
        symptom is that the repaving node remains in the `Deleting` or `Draining` state until the drain completes.

  - <VersionedLink text="OVN-Kubernetes CNI" url="/integrations/packs/?pack=ovn-kubernetes" /> pack for the Network
    layer. This is used as a passthrough CNI pack since the CNI is configured automatically by the **OpenShift** pack
    and a dedicated CNI pack is not supported for OpenShift workload clusters hosted on HyperShift.

  - The <VersionedLink text="Local Path Provisioner" url="/integrations/packs/?pack=csi-local-path-provisioner" /> pack
    is the only validated pack for the Storage layer. As mentioned in the [Limitations](#limitations) section, if you
    wish to use a different Container Storage Interface (CSI), you can install it through the OperatorHub in the
    OpenShift console after cluster deployment.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters** and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**, then click **Start MAAS Configuration**.

5. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**.

   From the **Cloud Account** drop-down menu, select your MAAS cloud account.

   Click **Next** when done.

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. On the **Cluster Config** step, select a domain from the **Domains** drop-down menu. You can also specify **NTP
   Servers**.

   :::warning

   Although optional, we recommend specifying Network Time Protocol (NTP) servers to ensure the cluster nodes maintain
   accurate time. If no NTP servers are specified, it can lead to time drift.

   :::

9. Select a **HyperShift host cluster** from the drop-down menu. This should match the name of the HyperShift host
   cluster you created when following the [Create HyperShift Host Cluster](./create-hypershift-host-cluster.md) guide.
   This associates the workload cluster with the selected host cluster.

10. On the **Nodes Config** step, configure the worker node pools. As the OpenShift control plane is hosted in the
    HyperShift host cluster, you only configure worker nodes here.

    The following input fields apply to MAAS worker node pools. For a description of input fields common across target
    platforms, refer to [Node Pools](../../../cluster-management/node-pool.md). Click **Next** when done.

    ### Cloud Configuration

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                      |
    | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource pool**      | The [MAAS resource pool](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-resource-pools) from which to select available servers for deployment. Filter available servers to only those that have at least the amount of **Minimum CPU** and **Minimum Memory** selected. |
    | **Minimum CPU**        | The minimum number of CPU cores required for servers in this node pool.                                                                                                                                                                                                                              |
    | **Minimum Memory**     | The minimum amount of memory required for servers in this node pool.                                                                                                                                                                                                                                 |
    | **Availability zones** | Specify the [Availability Zones (AZs)](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-availability-zones) for the node pool.                                                                                                                                            |
    | **Tags**               | Specify the MAAS machine tags so Palette can deploy nodes to the MAAS machines that match them. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags-flexible-labels) documentation.                                            |

11. On the **Cluster Settings** page, configure additional options as needed. If you are deploying your workload cluster
    using [cluster templates](../../../../cluster-templates/cluster-templates.md), a **Cluster Timezone** is required.

    | **Left Menu Item**   | **Additional Information**                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Cluster Timezone** | Specify the time zone where you deploy your cluster. The time zone is used in [maintenance policies](../../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md) to determine when updates are rolled out to clusters deployed with [cluster templates](../../../../cluster-templates/cluster-templates.md).                                                                                                           |
    | **RBAC**             | Map a set of users or groups to a Kubernetes Role-Based Access Control (RBAC) role. This is required when custom OpenID Connect (OIDC) is configured. Refer to the following guides for more information: <br />- [Create Role Bindings](../../../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> |
    | **Location**         | Specify the location of your cluster by entering the address in the search bar and selecting one of the options in the drop-down. For example, **London, Greater London, England, United Kingdom**. This is used for display purposes and does not impact cluster functionality.                                                                                                                                                                 |

12. Select **Validate** to review your cluster configuration and settings.

13. If no changes are needed, **Finish Configuration** to deploy the workload cluster.

Palette communicates the cluster configuration to the HyperShift Operator on the host cluster, which provisions the
OpenShift hosted control plane. Worker nodes are simultaneously provisioned on MAAS bare-metal hosts and joined to the
workload cluster. Provisioning may take several minutes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the OpenShift workload cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

## Next Steps

Now that you have deployed a HyperShift host cluster and an OpenShift workload cluster, you can start deploying
applications to your OpenShift cluster. Consider the following next steps:

- You can create multiple OpenShift workload clusters on the same HyperShift host cluster. Repeat the steps in this
  guide for each additional cluster, ensuring that the host cluster has sufficient capacity to run the additional
  control plane pods.

- Refer to [Manage Clusters](../../../cluster-management/cluster-management.md) for Day-2 cluster management tasks, but
  ensure that you have reviewed the [Limitations](#limitations) as some management tasks are not supported for
  HyperShift-hosted OpenShift clusters.
