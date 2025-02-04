---
sidebar_label: "Modify Cluster Profile Variables"
title: "Modify Cluster Profile Variables"
description: "Learn how to edit and delete cluster profile variables."
sidebar_position: 60
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

There are two ways to modify your cluster profile variables:

- Modify the _schema_ of your profile variables from the associated cluster profile, including default values.
  
- Modify the _values_ of your profile variables in an active cluster.

## Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for
  more information.

- A [cluster profile](../../../cluster-profiles/cluster-profiles.md) with [cluster profile variables](./create-cluster-profile-variables.md).

## Modify Profile Variable Schemas

If you need to modify the _schema_ of an existing profile variable or any of its properties, including default values, you must modify the cluster profile that contains the profile variable.

If your cluster profile is _not_ being used in an active cluster, you can modify your profile variables in the current version of your cluster profile and later deploy a cluster with the profile or add the profile to an active cluster. However, if your cluster profile is currently being used in a cluster, you must [create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) before you can modify the variables.

For guidance on creating profile variables, refer to the [Create Cluster Profile Variables](./create-cluster-profile-variables.md) page.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left **Main Menu**, select **Profiles** and choose the cluster profile for which you want to update the profile variables.
   
3. In the upper-right corner, click **Variables**.

   :::tip

   Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
   **Variables**.

   :::

4. To edit a profile variable, select the **three-dot Menu** of the necessary variable, and **Edit** the
   cluster profile variable.
   
5. Repeat the above step until all necessary variables have been updated. Remember to select **Save Changes** when you are finished modifying your profile. 

   :::warning

   Certain packs do not fully support cluster profile variables. If there is an existing schema constraint defined in the pack, the variable must satisfy the schema; otherwise, the variable cannot be used, and the updated cluster profile cannot be saved.
    
   :::

### Validation

Take the following steps to confirm that your cluster profile schema and properties have been updated. 

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.

Once your cluster profile has the latest profile variable configurations, you can [deploy a new cluster](./create-cluster-profile-variables.md#deploy-a-cluster-with-cluster-profile-variables) using the cluster profile, [update your cluster profile version](../../../../clusters/cluster-management/cluster-updates.md) on an active cluster to get the latest changes, or add an add-on profile to an active cluster.

## Modify an Active Cluster using Profile Variables

Cluster profile variables make it easy to modify values on active clusters. If you need to add additional profile variables or modify the schema of existing variables, you must first [modify the cluster profile](#modify-profile-variable-schemas) the variable is a part of. Values that do not follow the defined variable schema are not supported.

1. Log in to [Palette](https://console.spectrocloud.com).
      
2. From the left **Main Menu**, select **Clusters**. Choose the cluster for which you are updating the cluster profile variable.
   
3. Navigate to the **Profile** tab of the cluster, where you can quickly view how many profile variables are being used in your cluster.

4. If you are adding an add-on profile that contains profile variables to the cluster, follow the procedure below; otherwise, skip this step.

   <details>
      <summary>Add an Add-On Profile</summary>
 
      1. Select the **Add add-on profile** icon. Choose the profile to add, and **Confirm** your changes.

      2. Select **Review & Save**. The **Changes Summary** dialog appears. Select **Review changes in Editor**.
   
      3. Use the **Profile variable changes** tab to view the profiles that were changed. Expand each profile to compare the **Running configuration** and **New configuration**, making any necessary changes to your cluster profile variables. Each profile must be **Reviewed**, indicated by a green check mark, before you can apply your changes.  
   
      4. When you are finished, select **Apply Changes**. 
   
      5. If you need to update any cluster profile variables in preexisting layers, proceed with the following steps; otherwise, you can navigate to the cluster **Events** tab to monitor your cluster's progress and [validate](#validation-1) your changes.
    
   </details>

5. If you need to update the cluster profile version, such as in the case of newly added profile variables or updated profile variable schemas, expand the semantic version **drop-down Menu** and choose the appropriate version. 

6. Select **Configure Values** to view your **Profile Variables Configuration**. 

7. Modify the values of your cluster profile variables. The updated value must match the schema defined in the cluster profile variable. If you are overwriting the default value, you can revert to the original value by selecting **Use Default**. In the example below, we are changing the `imagePullPolicy` of `kubecostFrontend` from `Always` to `IfNotPresent`.

   ![Overwriting existing cluster profile variables without modifying cluster profile](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_modify-cluster-profile-variable-override.webp)

8. When you are finished, choose **Save Changes**.
   
9. Your cluster begins the update process. Close the **Settings** window and monitor its progress using the **Events** tab.

### Validation

Once your cluster is finished updating, verify that any parameters containing cluster profile variables were populated with the expected values.

The following validation process uses the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/) and the cluster's [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. For more information on how to use kubectl and kubeconfig with your Palette-hosted clusters, refer to the Spectro Cloud [Kubectl](../../../../clusters/cluster-management/palette-webctl.md) and [Kubeconfig](../../../../clusters/cluster-management/kubeconfig.md) guides.

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you want to access.

4. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes
   Config File** row.

5. Click the kubeconfig link to download the file.

    ![Arrow pointing to the kubeconfig file.](/clusters_cluster-management_palette-webctl_cluster-details-overview.webp)

6. Open a terminal window and set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file.

   Example:

    ```shell
    export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig
    ```

7. Issue the appropriate `kubectl` command to verify that your parameter was populated correctly. The following example searches the `cost-analyzer-cost-analyzer` deployment file in the `kubecost` namespace for the text `IfNotPresent`, verifying that the `imagePullPolicy` for `kubecostFrontend` was updated from `Always` to `IfNotPresent`.

    ```shell
    kubectl get deployment cost-analyzer-cost-analyzer --namespace kubecost --output yaml | grep -C 5 "IfNotPresent"
    ```

    ```shell hideClipboard {6}
              name: persistent-configs
      - env:
        - name: GET_HOSTS_FROM
          value: dns
        image: gcr.io/kubecost1/frontend:prod-1.103.3
        imagePullPolicy: IfNotPresent
        livenessProbe:
          failureThreshold: 200
          httpGet:
            path: /healthz
            port: 9003
    ```