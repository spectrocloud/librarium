---
sidebar_position: 10
sidebar_label: "Deploy Cluster with Profile Variables"
title: "Deploy Cluster with Profile Variables"
description:
  "Learn how to leverage Cluster Profiles Variables using the Palette UI and Palette Terraform deployments. This tutorial teaches you how to use cluster profile variables to template and reuse cluster profiles. Get started with the basics of adding additional variable options in Palette and Terraform through the use of cluster profile versioning. 
"
tags: ["cluster profiles", "cluster profile variables", "tutorial"]
category: ["tutorial"]
---

[Cluster profile variables](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
allow you to provide profile-layer specific configurations. This capability provides you the ability to reuse a profile
version for many different deployments while using unique specifications.

In many ways, this treats the cluster profile as a template that can be used and reused for Day-2 operations. It is
important to consider the type of variable you create and use, and its context to the packs they are applied against.
Some variables can be applied while a cluster is running; others may only be relevant when the cluster is built; and
some may not be good candidates due to strict restrictions on the value. Refer to the
[limitations](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/#limitations)
section for further information.

In this tutorial, you will learn how to apply cluster profile variables directly in Palette. Alternatively, you can
choose to follow along with the tutorial using Terraform.

## Prerequisites

- A Palette account.
- Tenant admin access to Palette for the purpose of creating cluster profiles and clusters
- An Amazon Web Services (AWS) account added to your Palette project settings. Refer to the
  [Add an AWS Account to Palette](https://docs.spectrocloud.com/clusters/public-cloud/aws/add-aws-accounts) guide for
  instructions.
- An SSH key available in the region where you plan to deploy the cluster.
- Basic knowledge of containers and Kubernetes manifest file attributes. Refer to the
  [Docker Get Started](https://docs.docker.com/get-started/) guide and the
  [Learn Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) tutorial to start learning.
- Terraform (setup and configured)

## Create Profile with Variables (UI Workflow)

Log into Palette. Navigate to **Profiles** and select **Add Cluster Profile**. The version number of a given profile
must be unique and use the semantic versioning format major.minor.patch. If you do not specify a version for your
cluster profile, it will default to **1.0.0.**. Configure your profile with the following packs.

    | Pack | Version |
    | ----------------- | --------- |
    | Ubuntu | 22.x |
    | Palette eXtended Kubernetes | 1.30.x |
    | Calico | 3.29.2 |
    | Amazon EBS CSI | 1.41.x |
    | Wordpress Chart | 6.4.3 |

You can add cluster profile variables to your cluster profile. You should create your variables first and then add them
to the YAML file through the editor after. Variables are available to all versions of the cluster profile. Creating
unique variable names for specific packs can help ensure that reused placeholders can be uniquely specified. For
example, `namespace` is a common variable to use across multiple packs.

In Palette, go to your profile and select **{} Variables**. Next select **{} Create variable**.

On the **Create variable** page, fill in the following information.

| Variable Setting | Value                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Variable         | namespace (this is case-sensitive and should use lower-case and underscores)                       |
| Display          | Wordpress: Namespace                                                                               |
| Description      | Enter a new namespace for the Wordpress Pack                                                       |
| Format           | Select String from the drop-down                                                                   |
| Default          | set to enable and in the box enter "namespace" (the Wordpress pack normally uses wordpress for the |
| namespace)       |

Click **Create** to save your cluster profile variable options.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-create-variable.webp)

You can now add the created cluster profile variable it to the cluster profile. Click the **Copy to Clipboard** icon and
close the Profile variable tab.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-variable-clipboard.webp)

You are going to add the variable to the pack manifest YAML file. To access this click on the `wordpress-chart 6.4.3` to
open the editor. Paste the variable to replace the default namespace value.

![Image that shows adding variable and confirm update](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-add-variable-and-confirm-update.webp)

Once the variable has been set, click **Confirm Updates** and finally click **Save Changes**. This will make it part of
the cluster profile. You can verify that the variable is in use by clicking on **{} Variables**.

As shown in the following image, the namespace variable is displayed as in use in one layer (one pack). Additionally,
this profile has already been used to create a cluster. Once a profile version is in use, you cannot modify any of its
variables.

![Image that shows variables in use and warning that profile version in use](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-inuse.webp)

### Update a Cluster Profile Variables

Cluster profile versioning provides you better change visibility and control over the layers in your host clusters.
Learn more about
[cluster profiles](https://docs.spectrocloud.com/profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile/).

For the tutorial, we will create a new version 1.1.0 and add 2 new variables for the Wordpress pack.

Log in to Palette and click on **Profiles** in the left **Main Menu**. Select your cluster profile.

From the **drop-down Menu** next to the cluster profile name, select **Create new version**.

Provide the version number `1.1.0` and click **Confirm**. There should be versioning successful message displayed.

Once you have created your new version add the following variables and their default values. After each variable ensure
you click **Create**.

#### Variable: wordpress_replica

| Variable Setting | Value                                        |
| ---------------- | -------------------------------------------- |
| Variable         | wordpress_replica                            |
| Display name     | Wordpress: Replica Count                     |
| Description      | The number of replicas for the Wordpress app |
| Format           | Number                                       |
| Default          | 1                                            |

#### Variable: wordpress_port

| Variable Setting | Value                              |
| ---------------- | ---------------------------------- |
| variable         | wordpress_port                     |
| Display name     | Wordpress: New HTTP Wordpress port |
| Description      | Set a new port for Wordpress HTTP  |
| Format           | Number                             |
| Default value    | set to enable and enter "80"       |

Once your variables are created you can then add them to the Wordpress manifest YAML. For each variable, copy it to the
clipboard and add it to the appropriate location.

| YAML line location   | Variable to add                          |
| -------------------- | ---------------------------------------- |
| namespace: wordpress | `'{{.spectro.var.wordpress_namespace}}'` |
| ports: http: 80      | `'{{.spectro.var.wordpress_port}}'`      |
| replicaCount: 1      | `'{{.spectro.var.wordpress_replica}}'`   |

### Deploy Clusters with Cluster Profile Variables

Your cluster profile now has two versions, one without variables and one with. We can either deploy two separate
clusters (one for each version), or we can deploy one cluster using version 1.0.0 and then upgrade it to version 1.1.0.
This tutorial demonstrates the latter option.

In Palette, select your profile and use the **drop-down Menu** is set to version 1.0.0 . Click Deploy and go through the
wizard to deploy the cluster, leaving all options to their default. The cluster will take a few minutes to build.

Under **Workloads**, select **Deployments** and filter for **wordpress**. There should be three pods displayed.

Go to **Profile** and from the **drop-down Menu** select cluster profile version **1.1.0**. Choose **Review & Save**. On
the **Changes Summary**, select **Review changes in Editor**.

Select **{} Profile variables changes** and open the Running/New configuration. Enter in new values for each variable:

| Variable Name            | New Value        |
| ------------------------ | ---------------- |
| Wordpress: Replica Count | 3                |
| Wordpress: HTTP Port     | 9090             |
| Wordpress: Namespace     | new-wordpress-ns |

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-update-variables.webp)

Select **Apply Changes**. This process will cause part of the cluster to repave or, essentially, rebuild. Wait until the
cluster completes the **Addon deployment** step.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-addon-deployment-update.webp)

### Validation

Navigate to **Clusters** and select to your cluster. The **Overview** page appears. Click on the `:9090` port to launch
the default Wordpress application.

![Image that shows new port available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Go to **Workloads** and select **Namespaces**. Refresh the page.

![Image that shows new namespace available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Select to **Workloads** tab. Then, select **Pods**. Refresh the screen using the circular arrows and then filter for
**wordpress** namespace. There should be three pods displayed in the Wordpress namespace.

![Image that shows new replicas in new namespace for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-replica.webp)

### Cleanup

Use the following steps to clean up the resources you created for the tutorial.

Navigate to the left main menu and select **Clusters**. Select the cluster you created in this tutorial.

Select **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete.

Once the cluster is deleted, navigate to the left main menu and select **Profiles**.

Select the cluster profile you created in this tutorial. Select the three-dot menu to display the **Delete** button.

Select **Delete** and confirm the selection to remove the cluster profile. Make sure you delete both versions of this
profile.

## Create Profile with Variables (Terraform Workflow)

When you create cluster profiles in Terraform, you will do it as part of the cluster creation rather than as a separate
process. If you need to have more than one profile version, the variables must appear in all versions.

You do not have to have the variables assigned to the pack. You can use different pack manifest files within the
different cluster profile versions.

To start you can clone the [Tutorials](https://github.com/spectrocloud/tutorials) repository locally or follow along by
downloading a container image that includes the tutorial code and all dependencies. Once you have the Terraform tutorial
repository in place, navigate to the folder that contains the cluster profile variable tutorial code.

```shell
cd terraform/cluster-profile-variables-tf
```

When creating cluster profile variables in Terraform, they are added to the cluster profile section. They will get added
when you create the cluster itself.

You will start with the **cluster_profiles.tf** file. You can review variables that were placed at the end of the **AWS
Cluster Profile v1.0.0** code block.

```hcl
profile_variables {
    variable {
      name          = "wordpress_replica"
      display_name  = "Number of replicas"
      format        = "number"
      description   = "This is the number of replicas to deploy for Wordpress"
      default_value = var.wordpress_replica
      required      = true
    }
    variable {
      name          = "wordpress_namespace"
      display_name  = "Wordpress: Namespace"
      format        = "string"
      description   = "Enter a new namespace for the Wordpress pack"
      default_value = var.wordpress_namespace
      required      = true
    }
    variable {
      name          = "wordpress_port"
      display_name  = "Wordpress: Port"
      format        = "number"
      description   = "Set a new port for Wordpress HTTP"
      default_value = var.wordpress_port
      is_sensitive  = true
      required      = true
    }
  }
```

Review the two files in the manifests folder. `wordpress-chart-default.yaml` contains the default configuration for the
Wordpress Chart application and `wordpress-chart-variables.yaml` has the 3 variables defined in it.

| Manifests file                          | YAML line location   | Variable to add                            |
| --------------------------------------- | -------------------- | ------------------------------------------ |
| manifest/wordpress-chart-variables.yaml | namespace: wordpress | `'{{ .spectro.var.wordpress_namespace }}'` |
| manifest/wordpress-chart-variables.yaml | ports: http: 80      | `'{{ .spectro.var.wordpress_port }}'`      |
| manifest/wordpress-chart-variables.yaml | replicaCount: 1      | `'{{ .spectro.var.wordpress_replica }}'`   |

It is important to note that the syntax of the variable to add, particularly the spaces and . at the start of the
variable.

With the variables in place in the YAML file, you can then modify the values in **terraform.tfvars**.

```hcl
##############################
# Application Configuration
##############################
wordpress_replica   = "REPLACE ME"           # The number of pods to be created for Wordpress.
wordpress_namespace = "REPLACE ME"           # The namespace to be created for Wordpress.
wordpress_port      = "REPLACE ME"           # The port to be created for HTTP for Wordpress.
```

Additionally, you will need to put in the cloud specific info. For this tutorial, you will use AWS. Locate the AWS
provider section and change `deploy-aws = false` to `deploy-aws = true`. Additionally, replace all occurrences of
`REPLACE_ME` with their corresponding values, such as those for the `aws-cloud-account-name`, `aws-region`,
`aws-key-pair-name`, and `availability_zones` variables. You can also update the values for the nodes in the control
plane or worker node pools as needed.

:::warning

Note that `aws-cloud-account-name` must be replaced with the name of the AWS cloud account registered in Palette.
Additionally, ensure that the SSH key pair specified in `aws-key-pair-name` is available in the same region specified by
`aws-region`. For example, if `aws-region` is set to `us-east-1`, use the name of a key pair that exists in the
`us-east-1` region.

:::

```hcl {4,7-9,16,24}
###########################
# AWS Deployment Settings
############################
deploy-aws = false  # Set to true to deploy to AWS.
deploy-aws-var   = false # Set to true to deploy to AWS and include Kubecost to your cluster profile.

aws-cloud-account-name = "REPLACE ME"
aws-region             = "REPLACE ME"
aws-key-pair-name      = "REPLACE ME"

aws_control_plane_nodes = {
  count              = "1"
  control_plane      = true
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["us-east-2a"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}

aws_worker_nodes = {
  count              = "1"
  control_plane      = false
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["us-east-2a"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}
```

When you are done making the required changes, save the file.

### Deploy Clusters with Cluster Profile Variables

Before starting the cluster provisioning, export your **Palette API key** as an environment variable. This step allows
the Terraform code to authenticate with the Palette API.

```bash
export SPECTROCLOUD_APIKEY=<Your-Spectro-Cloud-API-key>
```

:::warning

Before deploying the resources, ensure that there are no active clusters named `aws-cluster` or cluster profiles named
`aws-profile-variables-tf` in your Palette project.

:::

Issue the `plan` command to preview the resources that Terraform will create.

```shell
terraform plan
```

The output indicates that three new resources will be created: two versions of the AWS cluster profile and the host
cluster. The host cluster will use version `1.0.0` of the cluster profile.

```shell
Plan: 3 to add, 0 to change, 0 to destroy.
```

To deploy the resources, use the `apply` command.

```shell
terraform apply -auto-approve
```

To check that the cluster profile was created correctly, log in to [Palette](https://console.spectrocloud.com), and
click **Profiles** from the left **Main Menu**. Locate the cluster profile named `aws-profile-variables-tf`. Click on
the cluster profile to review its layers and versions.

### Validation

You can validate that the profile variables have been applied. Go to Palette and go to your cluster **Overview** page.
Click on the 9090 port to launch the default Wordpress application.

![Image that shows new port available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Go to **Workloads** and select **Namespaces**. Refresh the page

![Image that shows new namespace available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Go to **Workloads** and select **Pods**. Refresh the screen using the circular arrows and then filter for **wordpress**
namespace. There should be three pods displayed in the Wordpress namespace.

![Image that shows new replicas in new namespace for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-replica.webp)

### Terraform Cleanup

Use the following steps to clean up the resources you created for the tutorial. Use the `destroy` command to remove all
the resources you created through Terraform.

```shell
terraform destroy --auto-approve
```

A successful execution of `terraform destroy` will output the following.

```shell
Destroy complete! Resources: 3 destroyed.
```

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for force delete. To trigger a force
delete action, navigate to the cluster’s details page and click on **Settings**. Click on **Force Delete Cluster** to
delete the cluster. Palette automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

:::

## Wrap-Up

In this tutorial, you created two cluster profiles versions, one with cluster profile variables and one without. You
deployed a cluster and updated it to apply the cluster profile variables. Cluster profile variables provide the ability
to leverage cluster profiles as a templating function.

We encourage you to check out the reference resources below to learn more about Palette.

- [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../../../clusters/clusters.md)

- [Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md)

- [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

- [Spectro Cloud Terraform Documentation on Cluster Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_profile)
