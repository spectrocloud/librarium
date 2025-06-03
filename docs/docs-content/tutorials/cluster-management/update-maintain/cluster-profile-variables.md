---
sidebar_position: 0
sidebar_label: "Deploy Cluster with Profile Variables"
title: "Deploy Cluster with Profile Variables"
description:
  "Learn how to leverage Cluster Profiles Variables directly in Palette and within Terraform deployments to Palette to ease Day-2 operations. This tutorial teaches you how to use Cluster Profile Variables as a templating function when it comes to cluster creation. Get started with the basics of adding additional variable options in Palette and Terraform through the use of versioning. 
"
tags: ["cluster profiles", "cluster profile variables", "tutorial"]
category: ["tutorial"]
---

[Cluster profile variables](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
were recently introduced in Palette. You can leverage variables to allow for profile-layer specific configurations. This
allows you to reuse a profile version for many different deployments while using unique specifications, particularly for
layers that focus on networking, security, etc. In many ways, this treats the profile as a template that App Users can
use and reuse for Day-2 operations and unique use case deployments.

Profile versions are commonly used to add or remove layers, pack configuration updates and leverage profile variables. Cluster
Profile Variables are applied to a specific profile version and tied to whichever version of the profile the variable is
used in.

In this tutorial, you will learn how to leverage cluster profile variables directly in Palette or via Terraform
deployments.

## Prerequisites

- Spectro Cloud Account
- git
- Cloud credentials (AWS, Azure or Google Cloud)
- terminal
- Terraform (setup and configured)
- Palette API key

## Create Profile with Variables (Palette)

Before we build any clusters, we will start with the cluster profile creation. The cluster profile can be viewed as a
template from which we can build the same cluster. When we add cluster profile variables, this allows us to create
clusters that are unique and can be customized for various use cases.

In Palette, navigate to Profiles and select **Add Cluster Profile**. The version number of a given profile must be unique
and use the semantic versioning format major.minor.patch. If you do not specify a version for your cluster profile, it
will default to **1.0.0.**. Start your profile with the following packs.

    | Pack | Version |
    | ----------------- | --------- |
    | Ubuntu | 22.x |
    | Palette eXtended Kubernetes | 1.32.x |
    | Calico | 3.29.2 |
    | Amazon EBS CSI | 1.41.x |
    | Wordpress Chart | 6.4.3 |

Now that you have a newly created Profile you can add variables to be used. You should create your variables first and
then add them to the YAML file through the editor after. Variables go across the whole profile. Creating unique variable
names for specific packs can help ensure that re-used placeholders can be uniquely specified. For example, namespace is
a common variable to use across multiple packs.

Start by going to your profile and select **{} Variables**. Here you can click **{} Create variable**.

On the Create variable page, fill in the following information:

| Variable Setting | Value                                        |
| ---------------- | -------------------------------------------- |
| Variable | namespace (this is case-sensitive and should use lower-case and underscores) | 
| Display |  Wordpress: Namespace |
| Description | Namespace for the Wordpress Pack |
| Format | Select String from the drop-down |
| Default | set to enable and in the box enter "namespace" (the Wordpress pack normally uses wordpress for the
  namespace)  | 

Once your variable options have been set, click Create.

<!-- ![Image that shows how to copy and paste variable, then save it in the YAML file](tutorials/deploy-cluster-variables/clusters_cluster-management_deploy-cluster-profile-variables-create-variable.webp) -->

With the variable created we can now add it to the profile. Click the Copy to Clipboard icon and close the Profile
variable tab.

<!-- ![Image that shows how to copy and paste variable, then save it in the YAML file](tutorials/deploy-cluster-variables/clusters_cluster-management_deploy-cluster-profile-variables-variable-clipboard.webp) -->

We are going to add the variable to the pack manifest YAML file. To access this click on the wordpress-chart 6.4.3 to
open the editor. Paste the variable to replace the default namespace value.

<!-- ![Image that shows adding variable and confirm update](tutorials/deploy-cluster-variables/clusters_cluster-management_deploy-cluster-profile-variables-add-variable-and-confirm-update.webp) -->

Once the variable has been set, click **Confirm Updates** and finally click **Save Changes**. This will make it part of
the profile. You can verify that the variable is in use by clicking on **{} Variables**. As shown in the following
image, you can see that the namespace variable is in use in one layer (one pack). Additionally, this profile has already
been used to create a cluster. Once a profile version is in use, you cannot modify any variables in use.

<!-- ![Image that shows variables in use and warning that profile version in use](tutorials/clusters_cluster-management_deploy-cluster-profile-variables-inuse.webp) -->

### Update a Cluster Profile Variables

When you update the Cluster Profile, you can apply this to an existing cluster or create a new cluster from that
version. The choice will depend on your use case. 

For the tutorial, we will create a new version 1.1.0 and add 3 new
variables for the Wordpress pack. Once you have created your new version add the following variables and their default
values. After each variable ensure you click **Create**.

#### Variable: replicaCount

| Variable Setting | Value                                        |
| ---------------- | -------------------------------------------- |
| Variable         | replicaCount                                 |
| Display name     | Wordpress: Replica Count                     |
| Description      | The number of replicas for the Wordpress app |
| Format           | number                                       |
| Default          | 1                                            |

#### Variable: wordpress_username

| Variable Setting | Value                                      |
| ---------------- | ------------------------------------------ |
| variable         | wordpress_username                         |
| Display name     | Wordpress: Administrator Username          |
| Description:     | Set the username for the Wordpress account |
| Format           | String                                     |
| Default value    | set to enable and enter "admin"            |

#### Variable: wordpress_password

| Variable Setting | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| variable         | wordpress_password                                        |
| Display name     | Wordpress: Administrator password                         |
| Description      | Set the password for the Wordpress administrator password |
| Format           | String                                                    |
| Default value    | set to enable and enter "welcome123"                      |

Once your variables are created you can then add them to the Wordpress manifest YAML. For each variable, copy it to the
clipboard and add it to the appropriate location.

| YAML line location            | Variable to add                         |
| ----------------------------- | --------------------------------------- |
| wordpressUsername: admin      | `'{{.spectro.var.wordpress_username}}'` |
| wordpressPassword: welcome123 | `'{{.spectro.var.wordpress_password}'`  |
| replicaCount: 1               | `'{{.spectro.var.replicaCount}}'`       |


================

Palette supports the creation of multiple cluster profile versions using the same profile name. This gives you better
change visibility and control over the layers in your host clusters. Profile versions are commonly used to add or remove
layers and pack configuration updates.

================


### Deploy Clusters with Cluster Profile Variables

Now that we have two profile versions with variables in them we can deploy clusters using each version. We will start with our cluster profile version 1.0.0. 

Select your profile and ensure it is set to version 1.0.0. Click Deploy and go through the wizard to deploy the cluster, leaving all options to their default. The cluster will take a few minutes to build. 

Under **Workloads**, select **Deployments** and filter for **wordpress**. You should see 3 Pods. 

Go to **Profile** and select **1.1.0**. Choose **Review & Save**. On the **Changes Summary**, select **Review changes in Editor**.

Select **{} Profile variables changes** and open the Running/New configuration. Enter in new values for each variable:
- 3
- newadmin
- welcome1234

Select **Apply Changes**

### Validation

Go to **Workloads** and select **Pods**. Refresh the screen using the circular arrows and then filter for **wordpress** namespace. You will see 3 new Pods added to the Wordpress namespace.

### Cleanup

Use the following steps to clean up the resources you created for the tutorials.

Navigate to the left main menu and select **Clusters**. Select the cluster you created in the Getting Started tutorials.

Select **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete.

Once the cluster is deleted, navigate to the left main menu and select **Profiles**.

Select the cluster profile you created in the Getting Started tutorials. Select the three-dot menu to display the
**Delete** button.

Select **Delete** and confirm the selection to remove the cluster profile. Make sure you delete both versions of this
profile.


## Create Profile with Variables (Terraform)

When we cluster profiles in Terraform, we do it as part of the cluster creation rather than as a separate process. 

To start you can clone the [Tutorials](https://github.com/spectrocloud/tutorials) repository locally or follow along by
downloading a container image that includes the tutorial code and all dependencies. Once you have the Terraform tutorial repository in place, navigate to the folder that contains
the cluster profile variable tutorial code.

```shell
cd terraform/cluster-profile-variables-tf
```

To create our variables, we will edit four files: 
- **cluster_profiles.tf** 
- **terraform.tfvars**
- **manifests/values-3tier.yaml**
- **manifests/wordpress-chart.yaml** 

We will start with the **cluster_profiles.tf** file. We will add all our variables at the end of the **AWS Cluster Profile v1.0.0** code block.

```hcl
profile_variables {
    variable {
      name = "replicaCount"
      display_name = "Number of replicas"
      format = "number"
      description = "This is the number of replicas to deploy for Apache"
      default_value = var.replicaCount
      required = true
    } 
    variable {
      name = "wordpress_username"
      display_name = "Wordpress Username to login with"
      format = "string"
      description = "This is the user you would log into Wordpress with"
      default_value = var.wordpressUsername
      required = true
    }   
      variable {
      name = "wordpress_password"
      display_name = "Wordpress Password"
      format = "string"
      description = "This is the password you would use to log into Wordpress with"
      default_value = var.wordpressPassword
      is_sensitive = true
      required = true
    }
  }
```

Next, we will modify each of the YAML files found in the manifests folder.

| Manifests file |YAML line location            | Variable to add                         |
| ----------------------------- | ----------------------------- | --------------------------------------- |
| manifest/wordpress-chart-variables.yaml | wordpressUsername: admin      | `'{{ .spectro.var.wordpress_username }}'` |
| manifest/wordpress-chart-variables.yaml |  wordpressPassword: welcome123 | `'{{ .spectro.var.wordpress_password }}'`  |
| manifest/wordpress-chart-variables.yaml | replicaCount: 1               | `'{{ .spectro.var.replicaCount }}'`       |

It is important to note that the syntax of the variable to add, particularly the spaces and . at the start of the variable. 

Once the variables are in place, we can then modify the values in **terraform.tfvars**. 

```hcl {7-11}
##############################
# Application Configuration
##############################
app_port          = 8080                                             # The cluster port number on which the service will listen for incoming traffic.
replicas_number   = 1                                                # The number of pods to be created for Hello Universe.
replicaCount      = 3                                                # The number of pods to be created for Wordpress.
profile_namespace = "REPLACE ME"                                     # The namespace in which the application will be deployed.
db_password       = "REPLACE ME"                                     # The database password to connect to the API database.
auth_token        = "REPLACE ME"                                     # The auth token for the API connection.
wordpressUsername = "REPLACE ME"                                     # The Wordpress admin username
wordpressPassword = "REPLACE ME"                                     # The Wordpress admin password
```
Additionally, we will need to put in the cloud specific info. For this tutorial, we will use AWS. Locate the AWS provider section and change `deploy-aws = false` to `deploy-aws = true`. Additionally, replace all
occurrences of `REPLACE_ME` with their corresponding values, such as those for the `aws-cloud-account-name`,
`aws-region`, `aws-key-pair-name`, and `availability_zones` variables. You can also update the values for the nodes in
the control plane or worker node pools as needed.

:::warning

Note that `aws-cloud-account-name` must be replaced with the name of the AWS cloud account registered in Palette.
Additionally, ensure that the SSH key pair specified in `aws-key-pair-name` is available in the same region specified by
`aws-region`. For example, if `aws-region` is set to `us-east-1`, use the name of a key pair that exists in the
`us-east-1` region.

:::

```hcl {4,7-9,16,24}
###########################
# AWS Deployment Settings
###########################
deploy-aws          = false # Set to true to deploy to AWS.
deploy-aws-kubecost = false # Set to true to deploy to AWS and include Kubecost to your cluster profile.

aws-cloud-account-name = "REPLACE ME"
aws-region             = "REPLACE ME"
aws-key-pair-name      = "REPLACE ME"

aws_control_plane_nodes = {
  count              = "1"
  control_plane      = true
  instance_type      = "m4.xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}

aws_worker_nodes = {
  count              = "1"
  control_plane      = false
  instance_type      = "m4.xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"] # If you want to deploy to multiple AZs, add them here. Example: ["us-east-1a", "us-east-1b"].
}
```

When you are done making the required changes, save the file.


### Deploy Clusters with Cluster Profile Variables

Before starting the cluster provisioning, export your **Palette API key** as an
environment variable. This step allows the Terraform code to authenticate with the Palette API.

```bash
export SPECTROCLOUD_APIKEY=<Your-Spectro-Cloud-API-key>
```

:::warning

Before deploying the resources, ensure that there are no active clusters named `aws-cluster` or cluster profiles named
`tf-aws-profile` in your Palette project.

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
click **Profiles** from the left **Main Menu**. Locate the cluster profile named `tf-aws-profile`. Click on the cluster
profile to review its layers and versions.


### Validation

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

In this tutorial, you updated a cluster profile using three different methods: create a new cluster profile version,
cluster profile override, and update a cluster profile in place. You deployed and rolled back the Kubecost application
and modified the configuration of the **_hello-universe_** deployment using cluster profile updates.

Cluster profiles provide consistency during the cluster creation process and when maintaining your clusters. They can be
versioned to store previously working cluster states, giving you visibility when updating or rolling back workloads
across your environments.

We encourage you to check out the reference resources below to learn more about Palette.

- [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../../../clusters/clusters.md)

- [Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md)

- [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

:::tip

This workflow can also be completed using Terraform by following the tutorials linked below.

- [Deploy and Manage K8s Cluster with Terraform - Azure](/getting-started/azure/deploy-manage-k8s-cluster-tf.md)

- [Deploy and Manage K8s Cluster with Terraform - GCP](/getting-started/gcp/deploy-manage-k8s-cluster-tf.md)

- [Deploy and Manage K8s with Terraform - AWS](/getting-started/aws/deploy-manage-k8s-cluster-tf.md)

- [Deploy and Manage K8s with Terraform - VMWare](/getting-started/vmware/deploy-manage-k8s-cluster-tf.md)

:::
