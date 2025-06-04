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
allow you to provide profile-layer specific configurations. This capability
provides you the ability to reuse a profile version for many different deployments while using unique specifications.
 In many ways, this treats the cluster profile as a template that can be
uses and reused for Day-2 operations. It is important to consider the type of variable you create and use, and its context to the packs they are applied against. Some variables can be applied while a cluster is running; others may only be relevant when the cluster is built; and some may not be good candidates due to strict restrictions on the value. Refer to the [limitations](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/#limitations) section for further information.

Profile versions are commonly used to add or remove layers, specific pack configurations, and templating clusters through the use of profile variables. When we leverage Cluster
Profile Variables they are applied to a specific profile version and tied to whichever version of the profile the variable is
used in.

In this tutorial, you will learn how to leverage cluster profile variables directly in Palette or via Terraform
for cluster deployments. You will also learn how to leverage them as part of an initial cluster deployment and integrate them into existing cluster deployments.

## Prerequisites

- Spectro Cloud Account
- git
- Cloud credentials (AWS, Azure or Google Cloud)
- terminal
- Terraform (setup and configured)
- Palette API key

## Create Profile with Variables (Palette)

Cluster profiles can be viewed as a
template from which you can build clusters. When you add cluster profile variables, this allows you to create
clusters that are unique and can be customized for various use cases.

In Palette, navigate to Profiles and select **Add Cluster Profile**. The version number of a given profile must be unique
and use the semantic versioning format major.minor.patch. If you do not specify a version for your cluster profile, it
will default to **1.0.0.**. Start your profile with the following packs.

    | Pack | Version |
    | ----------------- | --------- |
    | Ubuntu | 22.x |
    | Palette eXtended Kubernetes | 1.30.x |
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
| Description | Enter a new namespace for the Wordpress Pack |
| Format | Select String from the drop-down |
| Default | set to enable and in the box enter "namespace" (the Wordpress pack normally uses wordpress for the
  namespace)  | 

Once your variable options have been set, click Create.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-create-variable.webp) 

With the variable created we can now add it to the profile. Click the Copy to Clipboard icon and close the Profile
variable tab.

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-variable-clipboard.webp)

We are going to add the variable to the pack manifest YAML file. To access this click on the wordpress-chart 6.4.3 to
open the editor. Paste the variable to replace the default namespace value.

![Image that shows adding variable and confirm update](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-add-variable-and-confirm-update.webp)

Once the variable has been set, click **Confirm Updates** and finally click **Save Changes**. This will make it part of
the profile. You can verify that the variable is in use by clicking on **{} Variables**. 

As shown in the following
image, you can see that the namespace variable is in use in one layer (one pack). Additionally, this profile has already
been used to create a cluster. Once a profile version is in use, you cannot modify any variables in use.

![Image that shows variables in use and warning that profile version in use](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-inuse.webp)

### Update a Cluster Profile Variables

Palette supports the creation of multiple cluster profile versions using the same profile name. This gives you better
change visibility and control over the layers in your host clusters. Profile versions are commonly used to add or remove
layers and pack configuration updates. When you update the Cluster Profile, you can apply this to an existing cluster or create a new cluster from that
version. The choice will depend on your use case. 

For the tutorial, we will create a new version 1.1.0 and add 2 new
variables for the Wordpress pack. Once you have created your new version add the following variables and their default
values. After each variable ensure you click **Create**.

#### Variable: replicaCount

| Variable Setting | Value                                        |
| ---------------- | -------------------------------------------- |
| Variable         | replicaCount                                 |
| Display name     | Wordpress: Replica Count                     |
| Description      | The number of replicas for the Wordpress app |
| Format           | Number                                       |
| Default          | 1                                            |

#### Variable: wordpress_port

| Variable Setting | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| variable         | wordpress_port                                            |
| Display name     | Wordpress: New HTTP Wordpress port                        |
| Description      | Set a new port for Wordpress HTTP                         |
| Format           | Number                                                    |
| Default value    | set to enable and enter "80"                      |

Once your variables are created you can then add them to the Wordpress manifest YAML. For each variable, copy it to the
clipboard and add it to the appropriate location.

| YAML line location            | Variable to add                         |
| ----------------------------- | --------------------------------------- |
| namespace: wordpress          | `'{{.spectro.var.wordpress_namespace}}'` |
| ports: http: 80               | `'{{.spectro.var.wordpress_port}}'`      |
| replicaCount: 1               | `'{{.spectro.var.replicaCount}}'`        |


### Deploy Clusters with Cluster Profile Variables

Our cluster profile now has two versions, one without variables and one with. We can either deploy two separate clusters (one for each version), or we can deploy one cluster, starting it with version 1.0.0 and then upgrade it. We will use the latter option.

Select your profile and ensure it is set to version 1.0.0. Click Deploy and go through the wizard to deploy the cluster, leaving all options to their default. The cluster will take a few minutes to build. 

Under **Workloads**, select **Deployments** and filter for **wordpress**. You should see 3 Pods. 

Go to **Profile** and select **1.1.0**. Choose **Review & Save**. On the **Changes Summary**, select **Review changes in Editor**.

Select **{} Profile variables changes** and open the Running/New configuration. Enter in new values for each variable:
- new-wordpress-ns
- 9090
- 3

Select **Apply Changes**. This process will cause part of the cluster to repave or, essentially, rebuild. Wait until the cluster completes the **Addon deployment** step. 

![Image that shows how to copy and paste variable, then save it in the YAML file](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-addon-deployment-update.webp)


### Validation

Navigate to **Clusters** and select to your cluster. The **Overview** page appears. Click on the `:9090` port to launch the default Wordpress application.

![Image that shows new port available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Go to **Workloads** and select **Namespaces**. Refresh the page.

![Image that shows new namespace available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Select to **Workloads** tab. Then, select **Pods**. Refresh the screen using the circular arrows and then filter for **wordpress** namespace. You will see 3 new Pods added to the Wordpress namespace.

![Image that shows new replicas in new namespace for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-replica.webp)

### Cleanup

Use the following steps to clean up the resources you created for the tutorial.

Navigate to the left main menu and select **Clusters**. Select the cluster you created in this tutorial.

Select **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete.

Once the cluster is deleted, navigate to the left main menu and select **Profiles**.

Select the cluster profile you created in this tutorial. Select the three-dot menu to display the
**Delete** button.

Select **Delete** and confirm the selection to remove the cluster profile. Make sure you delete both versions of this
profile.


## Create Profile with Variables (Terraform)

When we create cluster profiles in Terraform, we do it as part of the cluster creation rather than as a separate process. If you have more than profile version, the variables must appear in all versions. However, you can have different pack manifest files where one has no variables assigned and the other does. 

To start you can clone the [Tutorials](https://github.com/spectrocloud/tutorials) repository locally or follow along by
downloading a container image that includes the tutorial code and all dependencies. Once you have the Terraform tutorial repository in place, navigate to the folder that contains
the cluster profile variable tutorial code.

```shell
cd terraform/cluster-profile-variables-tf
```

When creating cluster profile variables in Terraform, we add them to the cluster profile section. and they get added when you create the cluster itself. 

We will start with the **cluster_profiles.tf** file. We will add all our variables at the end of the **AWS Cluster Profile v1.0.0** code block.

```hcl
profile_variables {
    variable {
      name = "replicaCount"
      display_name = "Number of replicas"
      format = "number"
      description = "This is the number of replicas to deploy for Wordpress"
      default_value = var.replicaCount
      required = true
    } 
    variable {
      name = "wordpress_namespace"
      display_name = "Wordpress: Namespace"
      format = "string"
      description = "Enter a new namespace for the Wordpress pack"
      default_value = var.wordpress_namespace
      required = true
    }   
      variable {
      name = "wordpress_port"
      display_name = "Wordpress: Port"
      format = "number"
      description = "Set a new port for Wordpress HTTP"
      default_value = var.wordpress_port
      is_sensitive = true
      required = true
    }
  }
```

Next, we will modify each of the YAML files found in the manifests folder.

| Manifests file |YAML line location            | Variable to add                         |
| ----------------------------- | ----------------------------- | --------------------------------------- |
| manifest/wordpress-chart-variables.yaml | namespace: wordpress      | `'{{ .spectro.var.wordpress_namespace }}'` |
| manifest/wordpress-chart-variables.yaml |  ports: http: 80 | `'{{ .spectro.var.wordpress_port }}'`  |
| manifest/wordpress-chart-variables.yaml | replicaCount: 1               | `'{{ .spectro.var.replicaCount }}'`       |

It is important to note that the syntax of the variable to add, particularly the spaces and . at the start of the variable. 

Once the variables are in place, we can then modify the values in **terraform.tfvars**. 

```hcl {4-7}
##############################
# Application Configuration
##############################
replicaCount      = 3                                                # The number of pods to be created for Wordpress.
profile_namespace = "REPLACE ME"                                     # The namespace in which the application will be deployed.
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

We can easily validate that the profile variables have been applied. Go to Palette and go to your cluster **Overview** page. Click on the 9090 port to launch the default Wordpress application.

![Image that shows new port available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-overview.webp)

Go to **Workloads** and select **Namespaces**. Refresh the page

![Image that shows new namespace available for Wordpress](/tutorials/deploy-cluster-profile-variables/clusters_cluster-management_deploy-cluster-profile-variables-validate-namespace.webp)

Go to **Workloads** and select **Pods**. Refresh the screen using the circular arrows and then filter for **wordpress** namespace. You will see 3 new Pods added to the Wordpress namespace.

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

In this tutorial, you created two cluster profiles, one with cluster profile variables and one without. You deployed a cluster and updated it with cluster profile variables.
Cluster profile variables provide the ability to leverage cluster profiles as a templating function. Cluster profiles with cluster profile variables can be
versioned to store previously working cluster states, giving you visibility when updating or rolling back workloads
across your environments.

We encourage you to check out the reference resources below to learn more about Palette.

- [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md)

- [Palette Clusters](../../../clusters/clusters.md)

- [Backup and Restore](../../../clusters/cluster-management/backup-restore/backup-restore.md)

- [Deploy a Custom Pack](../../../tutorials/profiles/deploy-pack.md)

- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

- [Spectro Cloud Terraform Documentation on Cluster Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_profile)

