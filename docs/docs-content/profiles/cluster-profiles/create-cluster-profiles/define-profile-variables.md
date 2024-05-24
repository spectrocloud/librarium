---
sidebar_label: "Define and Manage Profile Variables"
title: "Define and Manage Profile Variables"
description: "Learn what cluster profile variables are and how to use them."
sidebar_position: 40
tags: ["profiles", "cluster profiles"]
---

Cluster profile variables enable you to create placeholders for parameters in profile layer configurations, which you
can then populate for individual clusters during deployment. Meaning you can use a single cluster profile to deploy
multiple clusters with unique requirements for security, networking, resource allocation, and so on.

When defining a cluster profile variable, you can set specific constraints on the expected values, such as format,
optionality, masking, and so on, to ensure scalable, error-free cluster deployments.

:::preview

This is a Tech Preview feature currently available in the [local UI](../../../clusters/edge/local-ui/local-ui.md). Do
not use this feature in production workloads, as it is subject to change.

:::

You can use profile variables with any number of packs, manifests, and Helm charts, but only in the scope of their
parent cluster profile. If you want to create placeholders to use across different cluster profiles, consider using
[Palette Macros](../../../clusters/cluster-management/macros.md).

The following table describes the difference between profile variables and macros.

| **Capability**                                                            | **Profile Variable** | **Macro** |
| ------------------------------------------------------------------------- | :------------------: | :-------: |
| Belongs to the cluster profile scope                                      |          ✅          |    ❌     |
| Belongs to the project scope                                              |          ❌          |    ✅     |
| Belongs to the tenant scope                                               |          ❌          |    ✅     |
| Supports data format restrictions                                         |          ✅          |    ❌     |
| Supports optionality restrictions                                         |          ✅          |    ❌     |
| Supports [sprig template functions](https://masterminds.github.io/sprig/) |          ✅          |    ✅     |

This guide explains how you can define and manage cluster profile variables.

## Limitations

- Cluster profile variables are currently available only in the [local UI](../../../clusters/edge/local-ui/local-ui.md).

- Palette does not support nesting profile variables within macros or other profile variables.

- You cannot define profile variables for the `pack.content` and `system.uri` parameters because the
  [Palette CLI](../../../automation/palette-cli/palette-cli.md) populates them automatically.

- Once you deploy a cluster from a profile with variables, you can neither edit nor delete the profile variables. To
  edit or delete them, [version the cluster profile](../modify-cluster-profiles/version-cluster-profile.md) and update
  the variables in the new version.

  When you version a cluster profile with variables, the variables are propagated to the new version. However, upon
  versioning, the variables in each version are independent.

## Define Profile Variables

### Prerequisites

- The `clusterProfile.create` and `clusterProfile.update` permissions to create and update cluster profiles. Refer to
  [Roles and Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  for more information.

- An in-progress or already created cluster profile. The cluster profile must either have the **Edge Native**
  infrastructure or be an edge-based add-on profile.

### Enablement

You can define profile variables both while creating and for the already created cluster profiles. To define profile
variables [while creating a cluster profile](../create-cluster-profiles/create-cluster-profiles.md), you need to be at
the **Profile Layers** stage of cluster profile creation and start following this guide from step three.

1.  Log in to Palette.

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

6.  Optionally, enter the variable description.

7.  Select a data format that the variable will expect. The following table describes the available data formats.

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

9.  Review the variable definition and behavior under **Preview**, and then select **Create**.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_variable-preview.webp)

10. Navigate to the YAML configuration of the profile layer for which you want to add the variable. In the upper-right
    corner of its YAML configuration editor, select **Variables**.

11. Next to the variable you want to add, click the **Copy to clipboard** icon to copy its name.

12. Paste the variable in the `parameter: "{{.spectro.var.variable_name}}"` format and click **Confirm Updates**.

    Alternatively, you can start typing the profile variable name with `{{.spectro.var.}}`, and Palette will suggest
    profile variables that you can autocomplete.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_add-vars-to-yaml.webp)

    :::tip

    To improve navigation, you can change the display order of variables. Select the **Variables three-dot menu**, then
    select **Reorder variables**, and drag and drop variables to change their display order. Finally, select **Confirm
    order**.

    :::

13. Repeat the steps described in this guide to define more variables and add them to the necessary cluster profile
    layers.

### Validation

1. Log in to Palette.

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have defined
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that the necessary
   variables are defined.

4. Hover over the **[Count] layers** pill next to the variables to review the profile layers where they are used.

5. Open the necessary profile layers and check that their YAML configuration contains the expected variables.

## Manage Profile Variables

:::info

Once you deploy a cluster from a profile with variables, you can neither edit nor delete the profile variables. To edit
or delete them, [version the cluster profile](../modify-cluster-profiles/version-cluster-profile.md) and update the
variables in the new version.

:::

### Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  for more information.

- A cluster profile with profile variables created in Palette.

### Enablement

1. Log in to Palette.

2. Navigate to the cluster profile for which you want to update profile variables and, in the upper-right corner, click
   **Variables**.

   :::tip

   Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
   **Variables**.

   :::

3. To edit a profile variable, in the **three-dot menu** of the necessary variable, select **Edit** and make the
   necessary changes.

4. To delete a profile variable, navigate to the profile layers that implement this variable and remove it from their
   YAML configuration. Then, in the **three-dot menu** of the necessary variable, select **Delete**.

### Validation

1. Log in to Palette.

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.
