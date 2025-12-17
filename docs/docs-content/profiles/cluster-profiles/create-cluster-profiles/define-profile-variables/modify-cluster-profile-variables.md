---
sidebar_label: "Modify Cluster Profile Variables"
title: "Modify Cluster Profile Variables"
description: "Learn how to edit and delete cluster profile variables."
sidebar_position: 60
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

There are two ways to modify your cluster profile variables:

<!-- prettier-ignore-start -->

- Modify the _schema_ of your profile variables from the associated cluster profile, including default values.
  
- Modify the _values_ of your profile variables in an active cluster.
  
<!-- prettier-ignore-end -->

If you need to modify the schema of an existing profile variable or any of its properties, you must modify the cluster
profile that contains the profile variable before you can update the profile variable in a cluster. If no schema updates
are needed and you are only updating the values of profile variables in an already deployed cluster, proceed to the
[Modify Profile Variable Values in an Active Cluster](#modify-profile-variable-values-in-an-active-cluster) portion of
this guide.

## Modify Profile Variable Schemas

If your cluster profile is not being used in an active cluster, you can modify your profile variables in the current
version of your cluster profile. However, if your cluster profile is currently being used in a cluster, you must
[create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
before you can modify the variables.

For guidance on creating profile variables, refer to the
[Create Cluster Profile Variables](./create-cluster-profile-variables.md) page.

### Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- A [cluster profile](../../../cluster-profiles/cluster-profiles.md) with
  [cluster profile variables](./create-cluster-profile-variables.md).

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left main menu, select **Profiles** and choose the cluster profile for which you want to update the profile
   variables. We recommend
   [creating a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
   before proceeding.

3. In the upper-right corner, select **Variables**.

   :::tip

   Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
   **Variables**.

   :::

4. To edit a profile variable, select the three-dot menu of the applicable variable and **Edit** the cluster profile
   variable as necessary.

5. Repeat the previous step until all applicable variables have been updated. Remember to select **Save Changes** when
   you are finished modifying your profile.

   :::warning

   Some packs may not support certain cluster profile variable data formats. If there is an existing schema constraint
   defined in the pack, the variable must satisfy the schema; otherwise, the variable cannot be used, and the updated
   cluster profile cannot be saved. Refer to the
   [Pack Constraints](../../../../registries-and-packs/pack-constraints.md) page for more information.

   :::

### Validate

Use the following guide to confirm that your cluster profile schema and properties have been updated.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, select **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.

Once your cluster profile has the latest profile variable configurations, you can
[deploy a new cluster](./create-cluster-profile-variables.md#cluster-deployment) using the cluster profile,
[update your cluster profile version](../../../../clusters/cluster-management/cluster-updates.md) on an active cluster
to get the latest changes, or add an add-on profile to an active cluster.

## Modify Profile Variable Values in an Active Cluster

Cluster profile variables make it easier to modify values on active clusters. If you need to add additional profile
variables or modify the schema of existing variables, you must first
[modify the cluster profile](#modify-profile-variable-schemas) that the variables are part of. Values that do not follow
the defined variable schema are not supported.

### Prerequisites

- The `clusterProfile.update` and `cluster.update` permissions. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- An active Palette cluster using a [cluster profile](../../../cluster-profiles/cluster-profiles.md) with
  [cluster profile variables](./create-cluster-profile-variables.md).

### Enablement

There are two ways to modify your cluster profile variables in an active cluster. You are automatically taken through
the appropriate workflow based on the changes you make to your cluster.

- **Review changes in Editor** - Used if you are updating your cluster profile version to one that changes the YAML
  configuration of a pack or adds or removes cluster profile variables (regardless of whether the variable is included
  in the pack configuration). This flow is also used if you add or remove a cluster profile from your cluster.

- **Profile Variables Configuration** - Used if you are updating your cluster profile version to one that does _not_
  change the YAML configuration of a pack but _does_ modify the schema or properties of existing variables. This flow is
  also used if you change the values of your cluster profile variables without updating the cluster profile version.

<Tabs>

<TabItem value="editor" label="Review Changes in Editor">

1. Log in to [Palette](https://console.spectrocloud.com).
2. From the left main menu, select **Clusters**. Choose the cluster for which you are updating the cluster profile
   variable.

3. Navigate to the **Profile** tab of the cluster, where you can quickly view how many profile variables are being used
   in the current version of your cluster profile. An information icon is displayed if any of the variables are hidden.

4. If you need to update a cluster profile version, such as in the case of newly added or removed profile variables,
   expand the semantic version drop-down menu and choose the appropriate version.

5. If you need to add a profile, select the **Add add-on profile** icon. Choose the profile to add, and **Confirm** your
   changes.

6. If you need to replace or remove a profile, select the three-dot menu beside the profile, and choose the applicable
   action.

7. **Review & Save** your changes. The **Changes Summary** dialog appears. Select **Review changes in Editor**.

8. Use the **Profile variable changes** tab to view the profiles that were changed. Expand each profile to compare the
   **Running configuration** and **New configuration**, making any necessary changes to your cluster profile variables.
   If you are overwriting the default value, you can revert to the original value by selecting **Use Default**. Updated
   profile variable values must match the schema defined in the cluster profile variable.

   Each profile must have a **Reviewed** status, indicated by a green check mark, before you can apply your changes.
   Hovering over each icon between **Running configuration** and **New configuration** explains what is being done for
   each variable. The below example includes the following changes:

   - Changed the Kubecost frontend `imagePullPolicy` from `Always` to `IfNotPresent`.

   - Changed the default value of the Hello Universe `namespace` variable. The value assigned for profile version 1.1.0
     is the same as the value for version 1.0.0 and is not overwritten unless you select **Use new default**.

   - Added a new profile variable for Grafana.

   ![Reviewing profile variable changes using the Change Summary Process](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_modify-cluster-profile-variable-review-update-changes-updated.webp)

   :::tip

   The order of the fields is determined by the order of the variables in the cluster profile. To change the order,
   return to the cluster profile, select **Variables**, and from the three-dot menu, choose **Reorder variables**. Drag
   and drop the variables to rearrange them.

   :::

9. When you are finished, select **Apply Changes**.

10. Your cluster begins the update process. Navigate to the cluster **Events** tab to monitor your cluster's progress.
    When your cluster is finished updating, [validate](#validate-1) your changes.

</TabItem>

<TabItem value="configuration" label="Profile Variables Configuration">

1. Log in to [Palette](https://console.spectrocloud.com).
2. From the left main menu, select **Clusters**. Choose the cluster for which you are updating the cluster profile
   variable.

   :::tip

   If you are not updating the cluster profile version and are only updating existing cluster profile variables, you can
   expand the **Settings** drop-down menu, choose **Cluster Settings**, and use the **Profile Variables Configuration**
   tab to update your profile variables. Proceed to step 6 to learn more.

   :::

3. Navigate to the **Profile** tab of the cluster, where you can quickly view how many profile variables are being used
   in the current version of your cluster profile. An information icon is displayed if any of the variables are hidden.

4. If you need to update a cluster profile version, such as in the case of updated profile variable schemas, expand the
   semantic version drop-down menu and choose the appropriate version.

5. Select **Configure Values** to view your **Profile Variables Configuration**.

6. Modify the values of your profile variables. The updated value must match the schema defined in the cluster profile
   variable. If you are overwriting the default value, you can revert to the original value by selecting **Use
   Default**. In the example below, the Kubecost frontend `imagePullPolicy` changed from `Always` to `IfNotPresent`.

   ![Overwriting existing cluster profile variables without modifying cluster profile](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_modify-cluster-profile-variable-override-updated.webp)

   :::tip

   The order of the fields is determined by the order of the variables in the cluster profile. To change the order,
   return to the cluster profile, select **Variables**, and from the three-dot menu, choose **Reorder variables**. Drag
   and drop the variables to rearrange them.

   :::

7. When you are finished, choose **Save Changes**.
8. Your cluster begins the update process. Close the **Settings** window and monitor its progress using the **Events**
   tab. When your cluster is finished updating, [validate](#validate-1) your changes.

</TabItem>

</Tabs>

### Validate

Once your cluster is finished updating, verify that any parameters containing cluster profile variables were populated
with the expected values.

The following validation process uses the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/) and the cluster's
[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. For more
information on how to use `kubectl` and `kubeconfig` with your Palette clusters, refer to the Spectro Cloud
[Kubectl](../../../../clusters/cluster-management/palette-webctl.md) and
[Kubeconfig](../../../../clusters/cluster-management/kubeconfig.md) guides.

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select the host cluster you want to access.

4. Follow the [Kubectl](../../../../clusters/cluster-management/palette-webctl.md) guide to download your cluster's
   `kubeconfig` file and access your cluster using `kubectl`.

5. Issue the appropriate `kubectl` command to verify that your parameter was populated correctly.

   The following example searches the `cost-analyzer-cost-analyzer` deployment file in the `kubecost` namespace for the
   text `imagePullPolicy`, verifying that the `imagePullPolicy` for the Kubecost frontend was updated from `Always` to
   `IfNotPresent`.

   ```shell
   kubectl get deployment cost-analyzer-cost-analyzer --namespace kubecost --output yaml | grep -C 2 "imagePullPolicy"
   ```

   ```shell hideClipboard {9} title="Example Output"
             name: cost-analyzer-cost-analyzer
       image: gcr.io/kubecost1/cost-model:prod-1.103.3
       imagePullPolicy: Always
       livenessProbe:
         failureThreshold: 200
     --
         value: dns
       image: gcr.io/kubecost1/frontend:prod-1.103.3
       imagePullPolicy: IfNotPresent
       livenessProbe:
         failureThreshold: 200
   ```

## Next Steps

If you no longer need a profile variable, you can delete it from your cluster profile and your active cluster. Refer to
the [Delete Cluster Profile Variables](./delete-cluster-profile-variables.md) guide to learn more.
