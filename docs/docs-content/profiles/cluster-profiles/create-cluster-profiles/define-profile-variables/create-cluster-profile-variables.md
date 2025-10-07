---
sidebar_label: "Create Cluster Profile Variables"
title: "Create Cluster Profile Variables"
description: "Learn how to create cluster profile variables and how to use them."
sidebar_position: 50
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

[Cluster profile variables](./define-profile-variables.md) allow you to define and manage reusable configuration
parameters within a cluster profile, helping standardize deployments, reduce manual configuration errors, and simplify
updates by allowing values to be dynamically set during cluster provisioning. This guide takes you through the process
of creating cluster profile variables, adding them to profile layers, and deploying clusters with them.

## Create a Cluster Profile Variable

### Prerequisites

- The `clusterProfile.create` and `clusterProfile.update` permissions to create and update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- An existing [cluster profile](../../cluster-profiles.md).

### Enablement

You can define profile variables when creating or updating cluster profiles. This guide assumes you have already created
a cluster profile. Refer to the [Create Cluster Profiles](../../create-cluster-profiles/create-cluster-profiles.md)
guide to learn how to create a cluster profile.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  On the left main menu, select **Profiles** and choose the cluster profile for which you want to define profile
    variables.

3.  In the upper-right corner, select **Variables > Create variable**.

    ![Palette with the Variables button highlighted.](/profiles_create-cluster-profiles_define-profile-variables_open-profile-variables.webp)

    :::tip

    Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
    **Variables > Create variable**.

    :::

4.  Enter the **Variable** name. This name is automatically preceded by `.spectro.var.`, which cannot be changed. The
    full cluster profile variable, `{{.spectro.var.variable_name}}`, is used when adding variables to layer
    configurations. The **Variable** name must be unique within the scope of the cluster profile.

5.  Enter the variable **Display name** that Palette will display during cluster deployment. The **Display name** must
    be unique within the scope of the cluster profile.

6.  Optionally, enter a variable **Description**.

7.  Select the **Input type** of the variable. You can choose between **Text** and **Dropdown**. The default input type
    is **Text**.

    :::info

    The dropdown input type is currently not supported in [Local UI](../../../../clusters/edge/local-ui/local-ui.md).

    :::

8.  Select the data format for the variable. The following table describes available data formats.

    | **Format** | **Description**                                                                                        |
    | ---------- | ------------------------------------------------------------------------------------------------------ |
    | String     | Custom text input.                                                                                     |
    | Number     | Any numeric type, such as integers and floating point numbers.                                         |
    | Boolean    | `true` or `false`. Values that evaluate to `true` or `false`, such as 1 and 0, are not accepted.       |
    | Version    | Version value that follows the [Semantic Versioning](https://semver.org/) convention, such as `x.y.z`. |
    | IPv4       | Valid representation of an IPv4 address.                                                               |
    | IPv4 CIDR  | A CIDR block of IP addresses that follow the IPv4 standard.                                            |
    | IPv6       | Valid representation of an IPv6 address.                                                               |

9.  If you selected **Dropdown** for the **Input type** in step 7, select **Add dropdown option**.
    The following table describes the available configuration fields. You
    must provide at least one dropdown option.

    | **Field**       | **Description**                                                                                                |
    | --------------- | -------------------------------------------------------------------------------------------------------------- |
    | **Value**       | Value of the dropdown option. This field is required.                                                   |
    | **Label**       | Display name for the dropdown option. If no label is provided, the **Value** is used as the display name. |
    | **Description** | Long form description of the dropdown option.                                                                  |

    Repeat this step for every dropdown option you want to add.

10. Optionally, configure additional data validation. The following table describes the available parameters.

    | **Parameter**               | **Description**                                                                                                                                                                                                                                 |
    | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Custom input validation** | Validate the cluster profile variable definition against a regular expression based on the [regexp](https://pkg.go.dev/regexp) engine.                                                                                                          |
    | **Required**                | Require a value for the cluster profile variable.                                                                                                                                                                                               |
    | **Default value**           | Set a default value for the cluster profile variable. If the input type is **Dropdown**, then a default value must be specified using one of the configured dropdown options.                                                                   |
    | **Mask value**              | Mask the cluster profile variable with asterisks in the layer YAML configuration. When you export a profile with masked variables, they will be masked in the exported profile. Upon import, you will be required to provide the masked values. |
    | **Hidden**                  | Hide the cluster profile variable during cluster deployment. If the variable is both hidden and required, it must have a default value set.                                                                                                     |
    | **Read-only**               | Prevent the cluster profile variable from being edited during cluster deployment. Read-only variables must have a default value set.                                                                                                            |

11. As you make changes in the **Create variable** pane, the **Preview** field is updated, mirroring how the field will
    look and behave when deploying and updating clusters. When you are satisfied, **Create** the variable.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_variable-preview.webp)

12. Navigate to the YAML configuration of the profile layer to which you want to add the variable. In the upper-right
    corner of its YAML configuration editor, select **Variables**.

13. Next to the variable you want to add, select the **Copy to clipboard** icon to copy its name.

14. Paste the variable in the `parameter: '{{.spectro.var.variable_name}}'` format. You _must_ wrap each profile
    variable in single quotes (`'`) to properly validate the schema. Select **Confirm Updates** when finished.

    Alternatively, you can start typing `{{.spectro.var.}}` in the YAML configuration editor, and Palette will list the
    profile variables you have created. Continue typing to filter the list, or use the **UP ARROW** and **DOWN ARROW**
    keys to select the appropriate profile variable. Press **TAB** to accept the suggestion and add the variable. You
    must still wrap the profile variable in single quotes (`'`).

    :::warning

    If you plan to populate your variables with values that contain single quotes (`'`), wrap
    `{{.spectro.var.variable_name}}` in double quotes (`"`); otherwise, the YAML file will be invalid when the variable
    is resolved.

    :::

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_add-vars-to-yaml.webp)

    :::tip

    By default, profile variables are listed in the order they are created. This order is also used when deploying or
    modifying clusters. To change the display order of variables, select the **Variables** three-dot menu, choose
    **Reorder variables**, and drag and drop variables to change their display order. Finally, select **Confirm order**.

    :::

15. Repeat the steps described in this guide to define more variables and add them to the necessary cluster profile
    layers. Remember to choose **Confirm Updates** when you are finished with each layer, and select **Save Changes**
    when you are finished modifying your profile.

    :::warning

    Some packs may not support certain cluster profile variable data formats. If there is an existing schema constraint
    defined in the pack, the variable must satisfy the schema; otherwise, the variable cannot be used, and the updated
    cluster profile cannot be saved. Refer to the
    [Pack Constraints](../../../../registries-and-packs/pack-constraints.md) page for more information.

    :::

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles** and navigate to the cluster profile for which you have created profile
   variables.

3. In the upper-right corner, select **Variables** and, on the **Profile variables** pane, check that the necessary
   variables are properly defined.

4. Hover over the **[#] layers** pill next to the variables to review the profile layers where they are used.

5. Open the necessary profile layers and check that their YAML configuration contains the expected variables.

## Cluster Deployment

You can now use your cluster profile to deploy or update a cluster. The steps involved in deploying a cluster depend on
the infrastructure provider; however, when cluster profile variables are configured in the cluster profile, there will
always be an additional **Profile Config** window displayed prior to deploying the cluster. To learn more about
deploying clusters, visit our [Getting Started](../../../../getting-started/getting-started.md) series.

Note that in the below example, `amazing-hello-universe-namespace` is the namespace of the Hello Universe application.
The `Calico: Network CIDR` and `Kubecost: Frontend ImagePullPolicy` variables have the dropdown input type. You can
select any configured dropdown option for the cluster.

![Deploying a cluster and configuring cluster profile variables on the Profile Config window.](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_create-cluster-profile-variable-profile-config.webp)

Once you deploy a cluster using profile variables, verify that any parameters containing cluster profile variables were
populated with the expected values. The following validation process uses the
[kubectl CLI](https://kubernetes.io/docs/reference/kubectl/) and the cluster's
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

   The following example verifies that the Hello Universe namespace entered on the **Profile Config** window during
   cluster deployment was created.

   ```shell
   kubectl get namespaces
   ```

   ```shell hideClipboard {2} title="Example Output"
   NAME                               STATUS   AGE
   amazing-hello-universe-namespace   Active   5m49s
   capi-webhook-system                Active   14m
   cert-manager                       Active   14m
   cluster-67a235d83902eab79410087b   Active   14m
   default                            Active   15m
   kube-node-lease                    Active   15m
   kube-public                        Active   15m
   kube-system                        Active   15m
   kubecost                           Active   5m55s
   os-patch                           Active   11m
   palette-system                     Active   12m
   ```

## Next Steps

Cluster profile variables were created not just to make deploying clusters easier but also updating their configuration
values. Refer to the [Modify Cluster Profile Variables](./modify-cluster-profile-variables.md) guide to learn more.
