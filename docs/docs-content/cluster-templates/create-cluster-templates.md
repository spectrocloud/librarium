---
sidebar_label: "Create Cluster Templates"
title: "Create Cluster Templates"
description: "Learn how to create a cluster template using cluster profiles and cluster template policies."
hide_table_of_contents: false
sidebar_position: 10
tags: ["cluster templates"]
---

:::preview

:::

[Cluster templates](./cluster-templates.md) allow you to define and enforce the software and governance stack for a
fleet of clusters. By referencing [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) and operational
[policies](./create-cluster-template-policies/create-cluster-template-policies.md), all while leveraging
[cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
and [macros](../clusters/cluster-management/macros.md), clusters attached to cluster templates remain consistent and
allow environment overrides where necessary.

## Limitations

- Cluster templates can be used to deploy new clusters only. Certain Day-2 operations, such as attaching a cluster
  template to an existing cluster and detaching clusters from cluster templates, are not supported at this time.

## Prerequisites

- The **ClusterTemplate** [feature flag](../enterprise-version/system-management/feature-flags.md) enabled.

- The `clusterTemplate.create` permission to create cluster templates. Refer to our
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

- An existing [infrastructure](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) or
  [full cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md).

- An existing cluster template [maintenance policy](./create-cluster-template-policies/maintenance-policy.md).

## Create a Cluster Template

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  Select the **Templates** tab. In the top-right, select **Create Template**.

4.  Choose the appropriate public cloud, data center, or Edge environment where your cluster will be hosted, and select
    **Start Configuration**.

5.  Enter a unique **Name** for your cluster template. If desired, enter a **Description** and assign **Tags**. Select
    **Next Step** to open the **Template configuration** window.

6.  Use either of the following methods to add a maintenance policy to your cluster template:

    - Select the plus icon beside **Maintenance Policy** on the left menu.

    - Expand the **Maintenance policy** panel and **Select a maintenance policy**.

    ![Adding a maintenance policy to a cluster template](/cluster-templates_create-cluster-templates_add-maintenance-policy.webp)

7.  The **Select a policy** drawer displays a list of maintenance policies. In the menu bar, locate your policy by name,
    **Type**, or **Tags**, select it, and **Confirm** your selection.

        :::tip

        - If you do not have a maintenance policy that fits your needs, choose **Create a maintenance policy**. Refer to our [Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md) guide for more information on creating maintenance policies.

        - The **In Use Templates** column indicates if the maintenance policy is currently referenced by another cluster template. Refer to our [Create and Manage Cluster Template Policies](./create-cluster-template-policies/create-cluster-template-policies.md#policies-tab) guide for details on modifying the default display for policies.

        :::

<!--prettier-ignore-start -->

8.  The selected maintenance policy is displayed on the left menu and in the expanded **Maintenance policy** panel,
    which provides an overview of the selected policy. Use either of the following methods to add a cluster profile to
    your cluster template:

    - Select the plus icon beside **Linked Profiles** on the left menu.
  
    - Expand the **Linked profiles** panel and select **Add Cluster Profile**.

        :::info

        Once you select a maintenance policy, the option to add a maintenance policy is removed, as only one maintenance
        policy can be linked to a cluster template at a time. To link a different policy, select either the three-dot menu
        beside the maintenance policy in the left menu and choose **Replace**, or select **Replace** in the expanded
        **Maintenance policy** panel.

        :::

<!--prettier-ignore-end -->

9.  The **Select a profile** drawer displays a list of infrastructure and full cluster profiles compatible with the
    infrastructure selected in step 4. Choose the desired cluster profile and **Confirm** your selection.

10. The selected cluster profile is displayed on the left menu and in the expanded **Linked profiles** panel, which
    provides an overview of the selected profile.

11. Use the version drop-down menu to select the appropriate cluster profile version. A cluster profile version cannot
    be linked to a cluster template if that profile version is already being used by a cluster that is not attached to a
    cluster template.

            ![Configuring a cluster template](/cluster-templates_create-cluster-templates_template-configuration.webp)

        To link a different cluster profile, select the three-dot menu beside the cluster profile in the left menu and
        choose **Replace**, or select the three-dot menu beside the cluster profile version in the expanded **Linked
        profiles** panel and choose **Replace**. Infrastructure and full cluster profiles cannot be removed once linked,
        only replaced by another profile.

                :::warning

                Once a cluster profile is linked to a cluster template, that version of the cluster profile becomes immutable.
                To make changes to a linked cluster profile, you must
                [create a new version](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) of the
                cluster profile and update the version referenced in the cluster template. This protects your cluster fleet from
                configuration drift.

                :::

12. Use the **Add Addon Profile** button to link
    [add-on profiles](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
    to your cluster template. **Confirm** each addition, and ensure the correct profile version is selected. A cluster
    profile version cannot be linked to a cluster template if that profile version is already being used by a cluster
    that is not attached to a cluster template.

    To replace or delete an add-on profile, select either the three-dot menu beside the add-on profile in the left menu
    and choose **Replace** or **Remove**; alternatively, select the three-dot menu beside the add-on profile version in
    the expanded **Linked profiles** panel and choose **Replace** or **Remove**.

13. Once you have added all applicable cluster profiles, select **Next Step**.

14. Review your cluster template. To view the individual layers of your cluster profile stack, expand each cluster
    profile panel. If any changes are needed, return to the **Previous** screen and make the required modifications;
    otherwise, **Finalize** your cluster template.

15. When finished, your cluster template appears on the **Templates** list.

## Next Steps

Once you have created your cluster template, you are ready to deploy a new cluster using your template. The process to
deploy a cluster using a cluster template instead of individual cluster profiles is similar; however, there are
exceptions:

- On the **Cluster setup type** window, you must specify **Cluster Template** instead of **Cluster Profiles**.
- You cannot make any adjustments to individual profile layers during the deployment workflow.
- When viewing the cluster attached to the cluster template, an additional **Templates** tab is available.

Cluster profile variable values are assigned during the cluster deployment flow. Note that cluster templates can only be
used to deploy new clusters. Certain Day-2 operations, such as attaching a cluster template to an existing cluster, are
not supported at this time. Additionally, once a cluster template is attached to a cluster, it cannot be detached. For
additional information, refer to the cluster deployment guide for your applicable infrastructure environment.

| **Public Cloud (IaaS)**                                              | **Public Cloud (Managed)**                                    | **Data Center**                                                                   | **Edge**                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [AWS IaaS](../clusters/public-cloud/aws/create-cluster.md)           | [EKS](../clusters/public-cloud/aws/eks.md)                    | [MAAS](../clusters/data-center/maas/create-manage-maas-clusters.md)               | [Edge Native](../clusters/edge/site-deployment/cluster-deployment.md) |
| [Azure IaaS](../clusters/public-cloud/azure/create-azure-cluster.md) | [AKS](../clusters/public-cloud/azure/aks.md)                  | [MAAS LXD](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md)       | -                                                                     |
| [GCP IaaS](../clusters/public-cloud/gcp/create-gcp-iaas-cluster.md)  | [GKE](../clusters/public-cloud/gcp/create-gcp-gke-cluster.md) | [Nutanix](../clusters/data-center/nutanix/create-manage-nutanix-cluster.md)       | -                                                                     |
| -                                                                    | -                                                             | [OpenStack](../clusters/data-center/openstack.md)                                 | -                                                                     |
| -                                                                    | -                                                             | [VMware vSphere](../clusters/data-center/vmware/create-manage-vmware-clusters.md) | -                                                                     |

When a cluster is deployed using a cluster template, the cluster template is referenced above the cluster profiles on
the cluster **Overview** tab, and the tab **Templates** appears. To view the cluster template attached to the cluster,
select either the link or the **Template** tab.

    ![Cluster deployed with cluster template](/cluster-templates_create-cluster-templates_deployed-cluster.webp)

To make additional changes to your cluster template, refer to our
[Modify Cluster Templates](./modify-cluster-templates.md) guide. If you no longer need your cluster template, you can
[delete your cluster template](./delete-cluster-templates.md) as long as it is not attached to a cluster.
