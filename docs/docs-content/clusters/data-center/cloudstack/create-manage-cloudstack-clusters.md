---
sidebar_label: "Create and Manage CloudStack Clusters"
title: "Create and Manage CloudStack Clusters"
description: "Learn how to create and manage CloudStack clusters in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "cloudstack"]
---

:::preview

This is a Tech Preview feature and is subject to change. Do not use this feature in production workloads. This feature
is supported in self-hosted Palette only.

:::

You can deploy Kubernetes clusters on Apache CloudStack using Palette. Use the following steps to create and manage
CloudStack clusters in Palette.

## Limitations

:::warning

Creating and building clusters was done with KVM Hypervisor. These steps should be the same for other hypervisors but
there may be variations. You may need to build your own images based on hypervisor type and image type that is supported
by the hypervisor. Refer to the [CAPI Image Builder](../../../byoos/byoos.md) for guidance.

:::

## Prerequisites

- The **ApacheCloudStack** [feature flag](../../../enterprise-version/system-management/feature-flags.md) is enabled.

- A CloudStack account registered in Palette. Refer to the
  [Add CloudStack Accounts to Palette](./add-cloudstack-accounts.md) guide to learn how to add CloudStack accounts.

- A cluster profile for the CloudStack environment. You can learn how to create a cluster profile by following the steps
  in the
  [Create a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
  guide.

- An imported CloudStack template used to map to the Ubuntu or BYOOS image, and Kubernetes version defined in the
  cluster profile.

      <details>

      <summary> Importing a template </summary>

            In CloudStack console, navigate to **Images**.

            Select **Templates** and click on **Register Template from URL**.

            Provide values for the fields below.

            | **Field** | **Description** |
            | --------- | --------------- |
            | **URL** | Provide the following [Ubuntu template URL](https://cloudstackgoldenimage.s3.us-east-1.amazonaws.com/u-2404-0-k-13210-0.qcow2) or the URL to your BYOOS. The URL must end with `qcow2` when using KVM as the hypervisor. |
            | **Name** | Must follow the format `u-2404-0-k-13210-0`. |
            | **Description** | Optional. |
            | **Zone** | Specify the zone from the dropdown. |
            | **Domain** | Specify the domain from the dropdown. |
            | **Hypervisor** | Select **KVM** from the dropdown. |
            | **Format** | Select **QCOW2** from the dropdown. |
            | **OS type** | Select **Ubuntu 24.04 (64-bit)** from the dropdown. |
            | **Template type** | Select **USER** from the dropdown. |
            | **Extractable** | Leave default. |
            | **Dynamically scalable** | Leave default.|
            | **Public** | Select the checkbox. |
            | **Password enabled** | Leave default. |
            | **HVM** | Leave default. |

            Click **OK**.

            **Note:**
            Image name must follow the required format, must be set **Public**, and only one template with that name may exist per user. Duplicate names can cause CloudStack functional issues and deployment failures.

            For example, user A imports an image named `u-2404-0-k-13210-0` and sets it to **Public** availability. User B creates another template with the same name but does not mark it **Public**. User A will have one template named `u-2404-0-k-13210-0` and user B will have two templates named `u-2404-0-k-13210-0`. When user B deploys a cluster using `u-2404-0-k-13210-0`, the deployment will fail with a duplicate template error: `Reconciler error: expected 1 Template with name u-2404-0-k-13210-0, but got 2`.

      </details>

- If configuring the **Cert Manager** pack , ensure that you use version 1.19.1 or later. It is also important to
  ensure:
  - `crds.enabled` is set to `false`.
  - `cainjector.enabled` is set to `false` or `cainjector.replicas` is set to `0`.
  - `nodeSelector` or `nodeAffinity` is set to prevent scheduling of Cert Manager on control pane nodes.

## Create a CloudStack Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click **Add New Cluster** on the Create a New Cluster page.

4. Select **Apache CloudStack** and click the **Start Apache CloudStack Configuration** button.

5. Fill out the input fields. Use the table below to learn more about each input fields. Click on the **Next** button
   when you are done.

   | Field Name        | Description                                                                                                                                                                           | Required |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Cluster name**  | The name of the cluster.                                                                                                                                                              | Yes      |
   | **Description**   | A brief description of the cluster.                                                                                                                                                   | No       |
   | **Tags**          | Tags to help you identify the cluster.                                                                                                                                                | No       |
   | **Cloud Account** | The Apache CloudStack account to use for the cluster. If no account is available, ensure you [deployed a PCG](../../pcg/deploy-pcg/vmware.md) into the Apache CloudStack environment. | Yes      |

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

<Tabs groupId="cluster-configuration-pcg">

<TabItem label="PCG with Dynamic Network" value="pcg-dynamic">

8. Fill out the Apache CloudStack configuration details for the cluster. Refer to the table below to learn more about
   each option. Click **Next** to proceed.

   | Field Name                                                | Description                                                                                                                                                                                                 | Required |
   | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Zone**                                                  | The Apache CloudStack physical environment the cluster will be created in.                                                                                                                                  | Yes      |
   | **Project Name**                                          | The Project name within the Domain that the cluster will be created in.                                                                                                                                     | Yes      |
   | **SSH Key**                                               | The SSH key to use for the cluster. Check out the [Create and Upload an SSH Key](../../cluster-management/ssh/ssh-keys.md#create-and-upload-an-ssh-key) guide to learn how to upload an SSH key to Palette. | No       |
   | **Static placement**                                      | The network type to use for the cluster. Select **Static IP** if you want to use static IP addresses. Select **DHCP** if you want to use Dynamic Host Configuration Protocol (DHCP).                        | Yes      |
   | **Sync cluster with CloudStack Kubernetes Service (CKS)** | To use this, the CloudStack Kubernetes Service must be enabled on the CloudStack management server in a Global Setting.                                                                                     | No       |
   | **Update worker pools in parallel**                       | Palette can more efficiently manage workloads by updating multiple worker pools simultaneously.                                                                                                             | No       |

</TabItem>

<TabItem label="PCG with Static Networking" value="pcg-static">

8. Fill out the Apache CloudStack configuration details for the cluster. Refer to the table below to learn more about
   each option. Click **Next** to proceed.

   | Field Name                                                | Description                                                                                                                                                                                                 | Required |
   | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Zone**                                                  | The Apache CloudStack physical environment the cluster will be created in.                                                                                                                                  | Yes      |
   | **Project Name**                                          | The Project name within the Domain that the cluster will be created in.                                                                                                                                     | Yes      |
   | **SSH Key**                                               | The SSH key to use for the cluster. Check out the [Create and Upload an SSH Key](../../cluster-management/ssh/ssh-keys.md#create-and-upload-an-ssh-key) guide to learn how to upload an SSH key to Palette. | No       |
   | **Static placement**                                      | The network type to use for the cluster. Select **Static IP** if you want to use static IP addresses. Select **DHCP** if you want to use Dynamic Host Configuration Protocol (DHCP).                        | Yes      |
   | **VPC**                                                   | The VPC to use for the cluster.                                                                                                                                                                             | Yes      |
   | **Network**                                               | The Network to use for the cluster.                                                                                                                                                                         | Yes      |
   | **Control plane endpoint**                                | The IP address for the Control plane.                                                                                                                                                                       | Yes      |
   | **Sync cluster with CloudStack Kubernetes Service (CKS)** | To use this, the CloudStack Kubernetes Service must be enabled on the CloudStack management server in a Global Setting.                                                                                     | No       |

</TabItem>

</Tabs>

9. Configure the control plane and worker node pool configurations. Click **Next** to proceed.

   ### Control Plane Pool Configuration

   :::tip

   To apply the same configuration to the worker node pool as the control plane node pool, click the **Copy from the
   Control Plane Pool** button. This will copy the control plane pool configuration to the worker node pool.

   :::

   | Field Name                      | Description                                                                                                                                                                                                                    |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Node Pool Name**              | The name of the control plane node pool.                                                                                                                                                                                       |
   | **Number of nodes in the pool** | The number of control plane nodes. Allowed values are 1, 3, and 5.                                                                                                                                                             |
   | **Allow Worker Capability**     | Enable this option to workloads to be deployed on control plane nodes.                                                                                                                                                         |
   | **Additional Labels**           | Additional labels to apply to the control plane nodes.                                                                                                                                                                         |
   | **Additional Annotations**      | Additional Kubernetes [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) to assign to each control plane node.                                                                      |
   | **Taints**                      | Taints to apply to the control plane nodes. If enabled, an input field is displayed to specify the taint key, value and effect. Check out the [Node Labels and Taints](../../cluster-management/taints.md) page to learn more. |

   #### Cloud Configuration

   | Field Name              | Description                                                        |
   | ----------------------- | ------------------------------------------------------------------ |
   | **Compute offering**    | Select the compute offering to use for all nodes in the node pool. |
   | **Networks (optional)** | Select the guest network to use.                                   |

   ### Worker Plane Pool Configuration

   | Field Name                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
   | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Node Pool Name**                 | The name of the control plane node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | **Enable Autoscaler**              | Scale the pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. Setting both parameters to the same value results in a static node count. Refer to the Cluster API [autoscaler documentation](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md) for more information on autoscaling.                                                                                                                                                                                              |
   | **Node Repave Interval**           | The interval at which the worker nodes are repaved in seconds. Refer to the [Repave Behavior and Configuration](../../cluster-management/node-pool.md#repave-behavior-and-configuration) for additional information about repave behaviors.                                                                                                                                                                                                                                                                                                                                                                                                                             |
   | **Number of Nodes in the Pool**    | Number of nodes to be provisioned for the node pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | **Rolling Update**                 | Select **Expand First**, **Contract First**, or **Custom** to determine the order in which nodes are added to or removed from the worker node pool. <br /> - **Expand First** - Adds new nodes before removing old nodes. <br /> - **Contract First** - Removes old nodes before adding new nodes. <br /> - **Custom** - Set either an explicit numerical value or a percentage for [**Max Surge**](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-surge) and [**Max Unavailable**](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-unavailable). **Max Surge** and **Max Unavailable** cannot both be set to `0`. |
   | **Additional Labels**              | Additional labels to apply to the control plane nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | **Override Kubeadm Configuration** | Adjust [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) settings for specific operational or environmental requirements. Disabled by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | **Additional Annotations**         | Additional Kubernetes [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) to assign to each worker node.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | **Taints**                         | Taints to apply to the control plane nodes. If enabled, an input field is displayed to specify the taint key, value and effect. Check out the [Node Labels and Taints](../../cluster-management/taints.md) page to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                                          |

   #### Cloud Configuration

   | Field Name                   | Description                                                        |
   | ---------------------------- | ------------------------------------------------------------------ |
   | **Compute offering**         | Select the compute offering to use for all nodes in the node pool. |
   | **Networks (optional)**      | Select the guest network to use.                                   |
   | **Template Name (optional)** | Copy and paste the template name from CloudStack dashboard.        |

   You can click **Copy from Control Plane Pool** if you want to re-use the Control Plane Pool's **Compute offering**
   and **Networks**.

   Click on the **Next** button when you are done.

<!-- prettier-ignore-start -->

10. On the **Optional cluster settings** page, select from among the items on the left menu to configure additional
    options. Refer to the applicable guide for additional information.

    | **Left Menu Item** | **Additional Information** |
    | --- | --- |
    | **Cluster Timezone** | (Optional) Set the timezone to be used for the cluster |
    | **Manage machines** | [OS Patching](../../cluster-management/os-patching.md) |
    | **Schedule scans** | [Compliance Scan](../../cluster-management/compliance-scan.md#configuration-security) |
    | **Schedule backups** | [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) |
    | **RBAC** | - [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> | 

<!-- prettier-ignore-end -->

11. Click on the **Validate** button and review the cluster configuration and settings summary.

12. Click **Finish Configuration** to deploy the cluster.

The cluster deployment process is initiated. You can monitor the cluster deployment progress by navigating to the left
**Main Menu** and selecting **Clusters**. Click on the cluster you just created to view the cluster details page. The
**Cluster Status** field displays the current status of the cluster.

## Validate

Use the following steps to validate that the cluster is available and healthy.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click **Clusters**.

3. The **Clusters** page lists all available clusters that Palette manages. Select the cluster you deployed to review
   its details page.

4. Ensure the **Cluster Status** field contains the value **Running**.

:::tip

You can download the cluster's kubeconfig file to access the cluster using the Kubernetes command-line tool, kubectl.
Check out the [Access a Cluster](../../cluster-management/palette-webctl.md) guide to learn how to download the
kubeconfig file.

:::

## Next Steps

Now that you have a Kubernetes cluster deployed, you can deploy applications to CloudStack. We recommend you review the
Day-2 responsibilities and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
