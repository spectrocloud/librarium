---
sidebar_label: "Delete Cluster Profile Variables"
title: "Delete Cluster Profile Variables"
description: "Learn how to delete cluster profile variables."
sidebar_position: 70
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

If your cluster profile is not being used in an active cluster, you can delete your profile variables in the current
version of your cluster profile. However, if your cluster profile is currently being used in a cluster, you must first
[create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
before you can delete the variables.

## Delete Profile Variables from a Cluster Profile

### Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- A [cluster profile](../../../cluster-profiles/cluster-profiles.md) with
  [cluster profile variables](./create-cluster-profile-variables.md).

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left **Main Menu**, select **Profiles** and choose the cluster profile for which you want to delete the
   profile variables. We recommend
   [creating a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
   before proceeding.
3. In the upper-right corner, click **Variables**.
4. Any variables present in a profile layer are indicated by a darkened pill and the text **[#] layers**. Hover over
   the pill to review the profile layers that the variable is used in. You must remove the profile variable definition
   from all layers before you can delete it.

5. Close the **Profile variables** pane and open the profile layer containing the variable you want to remove.

6. Navigate to the pack's YAML configuration. Locate the profile variable, and remove
   `"{{.spectro.var.variable_name}}"`. Enter the appropriate value in its place.

   In the below example, we removed `"{{.spectro.var.kubecost-frontend-image-pull-policy}}"` and set
   `kubecostFrontend.imagePullPolicy` to `Always`.

   ![Removing a cluster profile variable from YAML configuration](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_delete-cluster-profile-variables_remove-from-YAML.webp)

7. Remove all references to the profile variable from the layer. When you are finished, select **Confirm
   Updates**.

8. Repeat steps five through seven as necessary until the profile variable is removed from all layers and the pill
   beside the variable changes to **unused**.

9. Close the **Profile variables** pane, and on the main cluster profile window, select **Save Changes**.

10. Once your changes have been saved, in the upper-right corner, click **Variables**.
11. Select the **three-dot Menu** beside the **unused** cluster profile variable. **Delete** the variable.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you had previously
   defined the profile variable.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that the applicable
   variables are no longer present.

Once you have deleted your profile variables from your cluster profile, you can remove them from an active cluster.

## Delete Profile Variables from an Active Cluster

There are several ways to remove cluster profile variables from an active cluster:

- Update your cluster profile version to one that does not have the applicable profile variables.

- Remove a profile from your cluster that contains the applicable profile variables.

- Remove cluster profile variables inline _without_ updating your cluster profile (not recommended).

### Prerequisites

- The `clusterProfile.update` and `cluster.update` permissions. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- An active Palette cluster using a [cluster profile](../../../cluster-profiles/cluster-profiles.md) with
  [cluster profile variables](./create-cluster-profile-variables.md).

### Enablement

<Tabs>
   
<TabItem value="cluster-profile" label="Remove Variables Using Cluster Profiles">

This is the recommended process from removing cluster profile variables from active clusters.

1.  Log in to [Palette](https://console.spectrocloud.com).
2.  From the left **Main Menu**, select **Clusters**. Choose the cluster from which you are removing the cluster profile
    variable.

3.  Navigate to the **Profile** tab of the cluster, where you can quickly view how many profile variables are being used
    in the current version of your cluster profile.

4.  If you need to update a cluster profile version to one without the profile variable, expand the semantic version
    **drop-down Menu** and choose the appropriate version.

5.  If you need to replace or remove a profile, select the **three-dot Menu** beside the profile, and choose the
    applicable action.

6.  Select **Review & Save**. The **Changes Summary** dialog appears. Select **Review changes in Editor**.

7.  Use the **Profile variable changes** tab to view the profiles that were changed. Expand each profile to compare the
    **Running configuration** and **New configuration**, making any necessary changes to your cluster profile variables.
    Updated profile variable values must match the schema defined in the cluster profile variable.

    Each profile must have a **Reviewed** status, indicated by a green check mark, before you can apply your changes. In the
    example below, we deleted the profile variable for the Kubecost frontend `imagePullPolicy`.

    ![Deleting a profile variable from a cluster using cluster profile versioning](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_delete-cluster-profile-variables.webp)

8.  When you are finished, select **Apply Changes**.

9.  Your cluster begins the update process. Navigate to the cluster **Events** tab to monitor your cluster's progress.

</TabItem>
   
<TabItem value="overrides" label="Remove Variables Using Overrides">

You can remove cluster profile variables from an active cluster's YAML configuration files. Using this method will not
remove profile variables from the cluster profile they belong to and will not flow to other clusters using the same
profile.

:::warning

We do not recommend updating a currently deployed cluster profile version to remove profile variables. Instead, we
recommend creating a new profile version,
[removing them from the profile](#delete-profile-variables-from-a-cluster-profile), and then upgrading active clusters
to the new version. For information on versioning profiles, check out
[Version a Cluster Profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

:::

1. Log in to [Palette](https://console.spectrocloud.com).
2. From the left **Main Menu**, select **Clusters**. Choose the cluster from which you are removing the cluster profile
   variable.

3. Navigate to the **Profile** tab of the cluster.

4. Navigate to the pack's YAML configuration. Locate the profile variable, and remove
   `"{{.spectro.var.variable_name}}"`. Enter the appropriate value in its place.

5. Repeat the previous step until you have removed all applicable profile variables.

6. **Save** your changes.

7. Your cluster begins the update process. Navigate to the cluster **Events** tab to monitor your cluster's progress.

</TabItem>

</Tabs>

### Validate

Once your cluster is finished updating, verify that any parameters previously containing cluster profile variables were
populated with the expected values.

The following validation process uses the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/) and the cluster's
[kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. For more
information on how to use `kubectl` and **kubeconfig** with your Palette clusters, refer to the Spectro Cloud
[Kubectl](../../../../clusters/cluster-management/palette-webctl.md) and
[Kubeconfig](../../../../clusters/cluster-management/kubeconfig.md) guides.

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you want to access.

4. Follow the [Kubectl](../../../../clusters/cluster-management/palette-webctl.md) guide to download your cluster's kubeconfig file and access your cluster using `kubectl`.

5. Issue the appropriate `kubectl` command to verify that your parameter was populated correctly.

   The following example searches the `cost-analyzer-cost-analyzer` deployment file in the `kubecost` namespace for the
   text `imagePullPolicy`, verifying that the `imagePullPolicy` for the Kubecost frontend was updated from
   `IfNotPresent` to `Always`.

   ```shell
   kubectl get deployment cost-analyzer-cost-analyzer --namespace kubecost --output yaml | grep -C 2 "imagePullPolicy"
   ```

   ```shell hideClipboard {9}
             name: cost-analyzer-cost-analyzer
       image: gcr.io/kubecost1/cost-model:prod-1.103.3
       imagePullPolicy: Always
       livenessProbe:
         failureThreshold: 200
     --
         value: dns
       image: gcr.io/kubecost1/frontend:prod-1.103.3
       imagePullPolicy: Always
       livenessProbe:
         failureThreshold: 200
   ```
