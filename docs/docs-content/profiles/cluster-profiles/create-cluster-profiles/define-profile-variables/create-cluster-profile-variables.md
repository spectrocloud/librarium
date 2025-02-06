---
sidebar_label: "Create Cluster Profile Variables"
title: "Create Cluster Profile Variables"
description: "Learn how to create cluster profile variables and how to use them."
sidebar_position: 50
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

[Cluster profile variables](./define-profile-variables.md) allow you to define and manage reusable configuration parameters within a cluster profile, helping standardize deployments, reduce manual configuration errors, and simplify updates by allowing values to be dynamically set during cluster provisioning. This guide takes you through the process of creating cluster profile variables, adding them to profile layers, and deploying clusters with them. 

## Create a Cluster Profile Variable

### Prerequisites

- The `clusterProfile.create` and `clusterProfile.update` permissions to create and update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for
  more information.

- An in-progress or existing [cluster profile](../../cluster-profiles.md).

### Enablement

You can define profile variables when creating cluster profiles and for existing cluster profiles. To define profile
variables [while creating a cluster profile](../../create-cluster-profiles/create-cluster-profiles.md), you need to be at
the **Profile Layers** stage of the cluster profile creation process and start following this guide from step three.

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  On the left **Main Menu**, select **Profiles** and choose the cluster profile for which you want to define profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, click **Create variable**.

    ![Palette with the Variables button highlighted.](/profiles_create-cluster-profiles_define-profile-variables_open-profile-variables.webp)

    :::tip

    Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
    **Variables**, and then **Create variable**.

    :::

4.  Enter the variable name using the format `{{.spectro.var.<variable_name>}}`. You will use this name when adding
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
    | Custom input validation | Validate the cluster profile variable definition against a regular expression based on the [regexp](https://pkg.go.dev/regexp) engine.                                                                                                                     |
    | Required                | Require a value for the cluster profile variable.                                                                                                                                                                                                            |
    | Default value           | Set a default value for the cluster profile variable.                                                                                                                                                                                                 |
    | Mask value              | Mask the cluster profile variable with asterisks in the layer YAML configuration. When you export a profile with masked variables, they will be masked in the exported profile. Upon import, you will be required to provide the masked values. |
    | Hidden                  | Hide the cluster profile variable during cluster deployment. If the variable is both hidden and required, it must have a default value set.                                                                                                                                                                                |
    | Read-only               | Prevent the cluster profile variable from being edited during cluster deployment. Read-only variables must have a default value set.                                                                                                                                                                              |

9.  **Preview** the variable definition and behavior in the **Create variable** pane. When you are satisfied, **Create** the variable.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_variable-preview.webp)

10. Navigate to the YAML configuration of the profile layer to which you want to add the variable. In the upper-right
    corner of its YAML configuration editor, select **Variables**.

11. Next to the variable you want to add, click the **Copy to clipboard** icon to copy its name.

12. Paste the variable in the `parameter: "{{.spectro.var.variable_name}}"` format and click **Confirm Updates**.

    Alternatively, you can start typing the profile variable name with `{{.spectro.var.}}`, and Palette will suggest
    profile variables that you can autocomplete.

    ![Palette YAML editor with the added profile variables.](/profiles_create-cluster-profiles_define-profile-variables_add-vars-to-yaml.webp)

    :::tip

    To improve navigation, you can change the display order of variables. Select the **Variables three-dot Menu**,
    choose **Reorder variables**, and drag and drop variables to change their display order. Finally, select **Confirm
    order**. The display order is also used when deploying a cluster and populating its values.

    :::

13. Repeat the steps described in this guide to define more variables and add them to the necessary cluster profile
    layers. Remember to choose **Confirm Updates** when you are finished with each layer, and select **Save Changes** when you are finished modifying your profile.

    :::warning

    Some packs may not support certain cluster profile variable data formats. If there is an existing schema constraint defined in the pack, the variable must satisfy the schema; otherwise, the variable cannot be used, and the updated cluster profile cannot be saved.   
     
    :::

### Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have defined
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that the necessary
   variables are defined.

4. Hover over the **[Count] layers** pill next to the variables to review the profile layers where they are used.

5. Open the necessary profile layers and check that their YAML configuration contains the expected variables.

## Deploy a Cluster with Cluster Profile Variables

The following guide uses Amazon Web Services (AWS) Internet-as-a-Service (IaaS) as a deployment environment. The steps involved in deploying a cluster vary depending on the environment chosen; however, when cluster profile variables are configured, there will always be an additional **Profile Config** window displayed prior to deploying the cluster. To learn more about deploying clusters, visit our [Getting Started](../../../../../docs-content/getting-started/getting-started.md) series.

![Deploying a cluster and configuring cluster profile variables on the Profile Config window.](/profiles_cluster-profiles_create-cluster-profiles_define-profile-variables_create-cluster-profile-variable-profile-config.webp)

### Prerequisites

- An infrastructure account registered in **Tenant Settings** for the infrastructure on which you will deploy the cluster. For guidance, refer to the appropriate page:

    - [AWS](../../../../clusters/public-cloud/aws/add-aws-accounts.md)

    - [Azure](../../../../clusters/public-cloud/azure/azure-cloud.md) 

    - [Google Cloud Platform (GCP)](../../../../clusters/public-cloud/gcp/add-gcp-accounts.md)

    - [Edge](../../../../clusters/edge/edge.md)

    - [MAAS](../../../../clusters/data-center/maas/register-manage-maas-cloud-accounts.md)

    - [Nutanix](../../.././../clusters/data-center/nutanix/register-nutanix-cloud.md)

    - [OpenStack](../../../../clusters/pcg/deploy-pcg/openstack.md)

    - [VMware](../../../../clusters/pcg/deploy-pcg/vmware.md)

- An existing [cluster profile](../../cluster-profiles.md) with at least one [cluster profile variable](#create-a-cluster-profile-variable).

- The following Palette permissions. Refer to [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for more information. 
  
  - `clusterProfile.create`

  - `clusterProfile.update`
  
  - `cluster.create`

### Deployment

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left **Main Menu**, select **Clusters** and either **Create Cluster** or **Add New Cluster**.
   
3. Select the environment you are deploying the cluster on and choose **Start [Environment] Configuration**. This example uses **AWS IaaS**.

4. Enter the **Basic Information** for the cluster, including the **Cluster name**, **Description**, and **Tags**. Select a registered [AWS **Cloud Account**](../../../../clusters/public-cloud/aws/add-aws-accounts.md), and choose **Next**.
   
5. Click **Add Cluster Profile**. Select the cluster profile that contains the cluster profile variables, and **Confirm** your selection.  

6. Review the cluster profile layers, making changes if needed, and click **Next**.

7. The **Profile Config** window is displayed. Enter the values of your cluster profile variables as needed. Variables with a default value are automatically populated but can be overwritten unless a **Read-only** parameter was set. Click **Next** when finished. 

    :::tip

    The order of the fields is determined by the order of the variables in the cluster profile. To change the order, return to the cluster profile, select **Variables**, and from the **three-dot Menu**, choose **Reorder variables**. Drag and drop the variables to rearrange them.

8. Select a **Region** and **SSH Key Pair Name** associated with your AWS account. Click **Next**.
   
9.  Configure your control plane and worker pools, choosing an **Instant Type** and **Availability zones**. Click **Next**.

10. Configure additional cluster settings as desired. When finished, **Validate** your cluster. 

11. Select **Finish Configuration** to begin deploying your cluster. 

### Validation

Once your cluster is deployed, verify that any parameters containing cluster profile variables were populated with the expected values.

The following validation process uses the [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/) and the cluster's [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. For more information on how to use `kubectl` and **kubeconfig** with your Palette clusters, refer to the Spectro Cloud [Kubectl](../../../../clusters/cluster-management/palette-webctl.md) and [Kubeconfig](../../../../clusters/cluster-management/kubeconfig.md) guides.

1. Log in to [Palette](https://spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you want to access.

4. From the cluster overview page, navigate to the middle column containing cluster details and locate the **Kubernetes
   Config File** row.

5. Click the **kubeconfig** link to download the file.

    ![Arrow pointing to the kubeconfig file.](/clusters_cluster-management_palette-webctl_cluster-details-overview.webp)

6. Open a terminal window and set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file. Below is an example.

    ```shell
    export KUBECONFIG=~/Downloads/dev-cluster.kubeconfig
    ```

7. Issue the appropriate `kubectl` command to verify that your parameter was populated correctly. 

    The following example verifies that the expected Hello Universe namespace was used.

    ```shell
    kubectl get namespaces
    ```

    ```shell hideClipboard {2}
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

Cluster profile variables were created not just to make deploying clusters easier but also updating their configuration values. Refer to the [Modify Cluster Profile Variables](./modify-cluster-profile-variables.md) guide to learn more. 