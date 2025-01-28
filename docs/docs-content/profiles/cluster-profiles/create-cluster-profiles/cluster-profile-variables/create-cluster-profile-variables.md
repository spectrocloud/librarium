---
sidebar_label: "Create Cluster Profile Variables"
title: "Create Cluster Profile Variables"
description: "Learn how to create cluster profile variables and how to use them."
sidebar_position: 50
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

## Define Profile Variables

### Prerequisites

- The `clusterProfile.create` and `clusterProfile.update` permissions to create and update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for
  more information.

- An in-progress or existing cluster profile.

### Enablement

You can define profile variables when creating cluster profiles and for existing cluster profiles. To define profile
variables [while creating a cluster profile](../../create-cluster-profiles/create-cluster-profiles.md), you need to be at
the **Profile Layers** stage of cluster profile creation and start following this guide from step three.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the cluster profile for which you want to define profile variables.

3.  In the upper-right corner, click **Variables** and, on the **Profile variables** pane, click **Create variable**.

    ![Palette with the Variables button highlighted.](/profiles_create-cluster-profiles_define-profile-variables_open-profile-variables.webp)

    :::tip

    Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
    **Variables**, and then **Create variable**.

    :::

4.  Enter the variable name in the `{{.spectro.var.<variable_name>}}` format. You will use this name when adding
    variables to layer configurations. The name must be unique within the parent cluster.

5.  Enter a variable display name that Palette will display during cluster deployment. The display name must be unique
    within the parent cluster.

6.  Optionally, enter a variable description.

7.  Select the data format for the variable. The following table describes available data formats.

    | **Format** | **Description**                                                                                        |
    | ---------- | ------------------------------------------------------------------------------------------------------ |
    | String     | Custom text input.                                                                                     |
    | Number     | Any numeric type, such as integers and floating point numbers.                                         |
    | Boolean    | `true` or `false`. Values that evaluate to `true` or `false`, such as 1 and 0, are not accepted.       |
    | Version    | Version value that follows the [Semantic Versioning](https://semver.org/) convention, such as `x.y.z`. |
    | IPv4       | Valid representation of an IPv4 address.                                                               |
    | IPv4 CIDR  | A CIDR block of IP addresses that follow the IPv4 standard.                                            |
    | IPv6       | Valid representation of an IPv6 address.                                                               |

8.  Optionally, configure additional data validation. The following table describes the available parameters.

    | **Parameter**           | **Description**                                                                                                                                                                                                                           |
    | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Custom input validation | Whether the input is validated against a regular expression. Based on the [regexp](https://pkg.go.dev/regexp) engine.                                                                                                                     |
    | Required                | Whether the input is required.                                                                                                                                                                                                            |
    | Default value           | Whether the variable has a default value.                                                                                                                                                                                                 |
    | Mask value              | Whether the input is masked with asterisks in the layer YAML configuration. When you export a profile with masked variables, they will be masked in the exported profile. Upon import, you will be required to provide the masked values. |
    | Hidden                  | Whether the variable is hidden during cluster deployment.                                                                                                                                                                                 |
    | Read-only               | Whether the variable is editable during cluster deployment.                                                                                                                                                                               |

    :::info

    If a variable is required and hidden, it must contain a default value.

    :::

9.  **Preview** the variable definition and behavior, and **Create** the variable.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_variable-preview.webp)

10. Navigate to the YAML configuration of the profile layer for which you want to add the variable. In the upper-right
    corner of its YAML configuration editor, select **Variables**.

11. Next to the variable you want to add, click the **Copy to clipboard** icon to copy its name.

12. Paste the variable in the `parameter: "{{.spectro.var.variable_name}}"` format and click **Confirm Updates**.

    Alternatively, you can start typing the profile variable name with `{{.spectro.var.}}`, and Palette will suggest
    profile variables that you can autocomplete.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_add-vars-to-yaml.webp)

    :::tip

    To improve navigation, you can change the display order of variables. Select the **Variables three-dot Menu**,
    choose **Reorder variables**, and drag and drop variables to change their display order. Finally, select **Confirm
    order**.

    :::

13. Repeat the steps described in this guide to define more variables and add them to the necessary cluster profile
    layers.

### Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have defined
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that the necessary
   variables are defined.

4. Hover over the **[Count] layers** pill next to the variables to review the profile layers where they are used.

5. Open the necessary profile layers and check that their YAML configuration contains the expected variables.

## Manage Profile Variables

:::info

Once you deploy a cluster from a profile with variables, you can neither edit nor delete the profile variables. To edit
or delete them, [version the cluster profile](../../modify-cluster-profiles/version-cluster-profile.md) and update the
variables in the new version.

:::

### Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for
  more information.

- A cluster profile with profile variables created in Palette.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the cluster profile for which you want to update profile variables and, in the upper-right corner, click
   **Variables**.

   :::tip

   Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
   **Variables**.

   :::

3. To edit a profile variable, in the **three-dot Menu** of the necessary variable, select **Edit** and make the
   necessary changes.

4. To delete a profile variable, navigate to the profile layers that implement this variable and remove it from their
   YAML configuration. Then, in the **three-dot Menu** of the necessary variable, select **Delete**.

### Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.

## Cluster Deployment

When you deploy a cluster using a cluster profile that contains a cluster profile variable, an additional window is displayed during the **Cluster Config** step, where you can enter the desired values to use in your cluster. If you have custom validation active and the entered value does not meet the schema requirements, you receive an error and are unable to deploy your cluster until variable is corrected. To learn more about deploying clusters, visit our [Getting Started](../../../../../docs-content/getting-started/getting-started.md) series.




### Validation

Once your cluster is deployed, verify that any parameters containing cluster profile variables were populated with the expected values.
