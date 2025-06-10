---
sidebar_position: 10
sidebar_label: "Deploy Cluster with Profile Variables"
title: "Deploy Cluster with Profile Variables"
description:
  "Learn how to leverage Cluster Profiles Variables using the Palette UI and Palette Terraform deployments. This
  tutorial teaches you how to use cluster profile variables to template and reuse cluster profiles. Get started with the
  basics of adding additional variable options in Palette and Terraform through the use of cluster profile versioning."
tags: ["cluster profiles", "cluster profile variables", "tutorial"]
category: ["tutorial"]
---

[Cluster profile variables](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
allow you to provide profile-layer specific configurations. This capability provides you the ability to reuse a profile
version for many different deployments while using unique specifications.

In many ways, this treats the cluster profile as a template that can be used and reused for Day-2 operations. It is
important to consider the type of variable you create and use, and its context in the packs it is applied against. Some
variables can be applied while a cluster is running; others may only be relevant when the cluster is deployed; and some
may not be good candidates due to strict restrictions on the value. Refer to the
[limitations](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/#limitations)
section for further information on cluster profile variable definition.

In this tutorial, you will learn how to apply cluster profile variables using
[Palette's UI ](#create-profile-with-variables-ui-workflow) and
[Terraform](#create-profile-with-variables-terraform-workflow) workflows. While the tutorial demonstrates the workflow
using Amazon Web Services (AWS), you can also use the same steps to deploy to Microsoft Azure or Google Cloud Platform
(GCP).

## Prerequisites

- A Palette account.
- Any public cloud credential.
- An SSH key available in the region where you plan to deploy the cluster.
- Basic knowledge of containers and Kubernetes manifest file attributes. Refer to the
  [Docker Get Started](https://docs.docker.com/get-started/) guide and the
  [Learn Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) tutorial to start learning.

## Create Profile with Variables (UI Workflow)

Log into [Palette](https://console.spectrocloud.com/). Navigate to **Profiles** and select **Add Cluster Profile**.
Leave the default value for the version and configure your profile with the following packs.

<!-- prettier-ignore-start -->

<Tabs groupId="tutorial-packs">

<TabItem label="AWS" value="AWS Packs">

    | Pack | Version |
    | --------- | --------- |
    | <VersionedLink text="Ubuntu" url="/integrations/packs/?pack=ubuntu-aws" /> | 22.x |
    | <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> | 1.30.x |
    | <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico" />| 3.29.2 |
    | <VersionedLink text="Amazon EBS CSI" url="/integrations/packs/?pack=csi-aws-ebs" />| 1.41.x |
    | <VersionedLink text="WordPress" url="/integrations/packs/?pack=wordpress-chart" /> | 6.4.3 |

</TabItem>

<TabItem label="Azure" value="Azure Packs">

    | Pack | Version |
    | --------- | --------- |
    | <VersionedLink text="Ubuntu" url="/integrations/packs/?pack=ubuntu-azure" /> | 22.x |
    | <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> | 1.30.x |
    | <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico-azure" />| 3.29.2 |
    | <VersionedLink text="Azure Disk" url="/integrations/packs/?pack=csi-azure" />| 1.41.x |
    | <VersionedLink text="WordPress" url="/integrations/packs/?pack=wordpress-chart" /> | 6.4.3 |

</TabItem>

<TabItem label="GCP" value="GCP Packs">

    | Pack | Version |
    | --------- | --------- |
    | <VersionedLink text="Ubuntu" url="/integrations/packs/?pack=ubuntu-gcp" /> | 22.x |
    | <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> | 1.30.x |
    | <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico" />| 3.29.2 |
    | <VersionedLink text="GCE Persistent Disk CSI" url="/integrations/packs/?pack=csi-gcp-driver" />| 1.41.x |
    | <VersionedLink text="WordPress" url="/integrations/packs/?pack=wordpress-chart" /> | 6.4.3 |

</TabItem>

</Tabs>

<!-- prettier-ignore-end -->

Select **{} Variables**. Next, select **{} Create variable**.

On the **Create variable** page, fill in the following information.

| Variable Setting | Value                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| **Variable**     | namespace (this is case-sensitive and should use lower-case and underscores)                                  |
| **Display**      | WordPress: Namespace                                                                                          |
| **Description**  | Enter a new namespace for the WordPress pack.                                                                 |
| **Format**       | Select String from the drop-down                                                                              |
| **Default**      | set to enable and in the box enter "namespace" (the WordPress pack normally uses wordpress for the namespace) |

Click **Create** to save your cluster profile variable options.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-create-variable.webp)

You can now add the created cluster profile variable to the cluster profile. Click the **Copy to Clipboard** icon and
close the **Profile variables** tab.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-variable-clipboard.webp)

You must add the variable to the pack manifest YAML file in order to use it. Click on the `wordpress-chart 6.4.3` to
open the editor. Paste the variable to replace the default namespace value.

![Image that shows adding variable and confirm update](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-add-variable-and-confirm-update.webp)

Click **Confirm Updates** and finally click **Save Changes**. This will make it part of the cluster profile. You can
verify that the variable is in use by clicking on **{} Variables**.

As shown in the following image, the namespace variable is displayed as in use in one layer, corresponding to the
WordPress pack. Additionally, this profile has already been used to create a cluster. Once a profile version is in use,
you cannot modify any of its variables.

![Image that shows variables in use and warning that profile version in use](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-inuse.webp)

### Update Cluster Profile Variables

Cluster profile versioning provides better change visibility and control over the layers in your host clusters. Learn
more about
[cluster profile versions](https://docs.spectrocloud.com/profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile/).

Click on **Profiles** in the left **Main Menu**. Select your cluster profile.

From the **drop-down Menu** next to the cluster profile name, select **Create new version**.

Provide the version number `1.1.0` and click **Confirm**. A versioning successful message displays.

Add the following variables and their default values. After each variable, ensure you click **Create**.

#### Variable: wordpress_replica

| Variable Setting | Value                                        |
| ---------------- | -------------------------------------------- |
| **Variable**     | `wordpress_replica`                          |
| **Display name** | WordPress: Replica Count                     |
| **Description**  | The number of replicas for the WordPress app |
| **Format**       | Number                                       |
| **Default**      | 1                                            |

#### Variable: wordpress_port

| Variable Setting  | Value                              |
| ----------------- | ---------------------------------- |
| **Variable**      | `wordpress_port`                   |
| **Display name**  | WordPress: New HTTP WordPress port |
| **Description**   | Set a new port for WordPress HTTP  |
| **Format**        | Number                             |
| **Default value** | set to enable and enter "80"       |

Now that your variables are created you can then add them to the WordPress manifest YAML. For each variable, copy it to
the clipboard and add it to the appropriate location.

| YAML line location     | Line number | Variable to add                          |
| ---------------------- | ----------- | ---------------------------------------- |
| `namespace: wordpress` | Line 13     | `'{{.spectro.var.wordpress_namespace}}'` |
| `ports: http: 80`      | Line 205    | `'{{.spectro.var.wordpress_port}}'`      |
| `replicaCount: 1`      | Line 502    | `'{{.spectro.var.wordpress_replica}}'`   |

### Deploy Cluster with Cluster Profile Variables

Your cluster profile now has two versions, one with a single variable and one with two variables. You could either
deploy two separate clusters, one for each version, or deploy one cluster using version 1.0.0 and then upgrade it to
version 1.1.0. This tutorial demonstrates the latter option.

In [Palette](https://console.spectrocloud.com/), select your profile and use the **drop-down Menu** is set to version
1.0.0 . Click **Deploy** and go through the wizard to deploy the cluster, leaving all options to their default. The
cluster will take a few minutes to deploy.

Select the **Workloads** tab. Then, select **Deployments** and filter for **wordpress**. Three pods are displayed
similar to the following screenshot: one for MariaDB, one for WordPress database memory cache and one for the WordPress
web server. This is the default deployment behavior for the WordPress pack.

<!-- image here -->

In [Palette](https://console.spectrocloud.com/), select your profile and use the **drop-down Menu** to set the profile
version to **1.1.0**. Choose **Review & Save**. On the **Changes Summary** page, select **Review changes in Editor**.

Select **{} Profile variables changes** and open the **Review Update Changes**. Select your profile and enter in new
values for each variable.

| Variable Name                | New Value          |
| ---------------------------- | ------------------ |
| **WordPress: Replica Count** | `3`                |
| **WordPress: HTTP Port**     | `9090`             |
| **WordPress: Namespace**     | `new-wordpress-ns` |

<!--  -->
<!-- Redo image -->

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-update-variables.webp)

Click **Apply Changes**. This process will cause part of the cluster to repave or, essentially, rebuild. Wait until the
cluster completes the **Addon deployment** step.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-addon-deployment-update.webp)

Select the **Overview** tab. Click on the `:9090` port to launch the default Wordpress application.

![Image that shows new port available for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Select the **Workloads** tab. Then, select **Namespaces**. Refresh the page.

![Image that shows new namespace available for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Select the **Workloads** tab. Then, select **Pods**. Refresh the page and then filter for **new-WordPress-ns**
namespace. Three additional WordPress web server pods appear in the new WordPress namespace, `new-wordpress-ns`.

![Image that shows new replicas in new namespace for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-replica.webp)

### Palette UI Cleanup

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

When you create cluster profiles in Terraform, the cluster profile variables must be defined in all versions of the
profile.

Clone the [Tutorials](https://github.com/spectrocloud/tutorials) repository locally or follow along by downloading a
container image that includes the tutorial code and all dependencies. Once you have the Terraform tutorial repository in
place, navigate to the `cluster-profile-variables-tf` folder.

```shell
cd terraform/cluster-profile-variables-tf
```

Open the **cluster_profiles.tf** file. You can review variables that were placed at the end of the **AWS Cluster Profile
v1.0.0** code block.

```hcl
profile_variables {
    variable {
      name          = "wordpress_replica"
      display_name  = "Number of replicas"
      format        = "number"
      description   = "This is the number of replicas to deploy for WordPress"
      default_value = var.wordpress_replica
      required      = true
    }
    variable {
      name          = "wordpress_namespace"
      display_name  = "WordPress: Namespace"
      format        = "string"
      description   = "Enter a new namespace for the WordPress pack"
      default_value = var.wordpress_namespace
      required      = true
    }
    variable {
      name          = "wordpress_port"
      display_name  = "WordPress: Port"
      format        = "number"
      description   = "Set a new port for WordPress HTTP"
      default_value = var.wordpress_port
      is_sensitive  = true
      required      = true
    }
  }
```

Review the two files in the manifests folder. `wordpress-chart-default.yaml` contains the default configuration for the
WordPress Chart application and `wordpress-chart-variables.yaml` has the following three variables defined in it.

| Manifests file                            | YAML line location     | Variable to add                            |
| ----------------------------------------- | ---------------------- | ------------------------------------------ |
| `manifest/wordpress-chart-variables.yaml` | `namespace: wordpress` | `'{{ .spectro.var.wordpress_namespace }}'` |
| `manifest/wordpress-chart-variables.yaml` | `ports: http: 80`      | `'{{ .spectro.var.wordpress_port }}'`      |
| `manifest/wordpress-chart-variables.yaml` | `replicaCount: 1`      | `'{{ .spectro.var.wordpress_replica }}'`   |

Note that the syntax of the variable to add, particularly the spaces and . at the start of the variable.

With the variables in place in the YAML file, you can then modify their values in **terraform.tfvars**.

```hcl
##############################
# Application Configuration
##############################
wordpress_replica   = "REPLACE ME"           # The number of pods to be created for WordPress.
wordpress_namespace = "REPLACE ME"           # The namespace to be created for WordPress.
wordpress_port      = "REPLACE ME"           # The port to be created for HTTP for WordPress.
```

Additionally, you will need to fill in the cloud-specific configurations. If you are using either Microsoft Azure or
Google Cloud Platform (GCP), find the relevant provider section. For the tutorial, the steps will use AWS.

Locate the AWS provider section and change `deploy-aws = false` to `deploy-aws = true`. Additionally, replace all
occurrences of `REPLACE_ME` with their corresponding values, such as those for the `aws-cloud-account-name`,
`aws-region`, `aws-key-pair-name`, and `availability_zones` variables. You can also update the values for the nodes in
the control plane or worker node pools as needed.

```hcl {4,7-9,16,24}
###########################
# AWS Deployment Settings
############################
deploy-aws     = false # Set to true to deploy to AWS.
deploy-aws-var = false # Set to true to deploy to AWS with cluster profile variables.

aws-cloud-account-name = "REPLACE ME"
aws-region             = "REPLACE ME"
aws-key-pair-name      = "REPLACE ME"

aws_control_plane_nodes = {
  count              = "1"
  control_plane      = true
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}

aws_worker_nodes = {
  count              = "1"
  control_plane      = false
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}
```

Save the file after you have finished providing your configurations.

### Deploy Clusters with Cluster Profile Variables

Export your **Palette API key** as an environment variable. This step allows the Terraform CLI to authenticate with the
Palette API.

```bash
export SPECTROCLOUD_APIKEY=<Your-Spectro-Cloud-API-key>
```

:::warning

Before deploying the resources, ensure that there are no active clusters named `aws-profile-var-cluster-tf` or cluster
profiles named `aws-profile-variables-tf` in your Palette project.

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

The cluster deployment will take a few minutes.

Log in to [Palette](https://console.spectrocloud.com), and click **Profiles** from the left main menu. Locate the
cluster profile named `aws-profile-variables-tf`. Click on the cluster profile to review its layers and versions.

Use the **drop-down Menu** to set the profile to version **1.1.0**. Choose **Review & Save**. On the **Changes
Summary**, select **Review changes in Editor**.

Select **{} Profile variables changes** and open the Running/New configuration. Enter in new values for each variable.

| Variable Name                | New Value          |
| ---------------------------- | ------------------ |
| **WordPress: Replica Count** | `3`                |
| **WordPress: HTTP Port**     | `9090`             |
| **WordPress: Namespace**     | `new-wordpress-ns` |

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-update-variables.webp)

Click **Apply Changes**. This process will cause part of the cluster to repave. Wait until the cluster completes the
**Addon deployment** step.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-addon-deployment-update.webp)

Select the **Overview** tab. Click on the `:9090` port to launch the default WordPress application.

![Image that shows new port available for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Select the **Workloads** tab. Then, select **Namespaces**. Refresh the page

![Image that shows new namespace available for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Select the **Workloads** tab. Then, select **Pods**. Refresh the page and then filter for **new-wordpress-ns**
namespace. Three additional WordPress web server pods appear in the new WordPress namespace, `new-wordpress-ns`.

![Image that shows new replicas in new namespace for WordPress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-replica.webp)

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

In this tutorial, you created two cluster profile versions, one with cluster profile variables and one without. You
deployed a cluster and updated it to apply the cluster profile variables. Cluster profile variables provide the ability
to leverage cluster profiles as a templating function.

We encourage you to check out the following reference resources to learn more about Palette.

- [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../../../clusters/clusters.md)

- [Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md)

- [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

- [Spectro Cloud Terraform Documentation on Cluster Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_profile)
