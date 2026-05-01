---
sidebar_position: 0
sidebar_label: "Standardize Clusters using Terraform"
title: "Standardize Cluster Provisioning and Maintenance with Cluster Templates using Terraform"
description:
  "A tutorial that shows how to standardize cluster provisioning, apply maintenance windows, and roll out upgrades using
  cluster templates and Terraform."
tags: ["cluster templates", "tutorial", "terraform", "profiles", "aws", "azure"]
---

<PartialsComponent category="cluster-templates" name="intro" />

You will complete this tutorial using Terraform. You will define a cluster profile, create a cluster template with a
maintenance policy, and deploy clusters from it.

## Prerequisites

- A Palette account with permissions to create cluster profiles, cluster template policies, cluster templates, and
  clusters.
- A cloud account registered in Palette. Refer to [AWS](../../../tutorials/getting-started/palette/aws/setup.md),
  [Azure](../../../tutorials/getting-started/palette/azure/setup.md),
  [GCP](../../../tutorials/getting-started/palette/gcp/setup.md), or
  [VMware](../../../tutorials/getting-started/palette/vmware/setup.md) to get started.
- Ensure that the
  [Palette Community Registry](../../../registries-and-packs/registries/registries.md#default-registries) is available
  in your Palette environment.
- kubectl installed locally. Use the Kubernetes [Install Tools](https://kubernetes.io/docs/tasks/tools/) page for
  further guidance.
- Terraform version 1.x installed.
- A [Palette API key](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) set as an environment
  variable.

<PartialsComponent category="cluster-templates" name="aws-example-note" />

<PartialsComponent category="getting-started" name="setup-local-environment" />

Navigate to the **terraform/cluster-templates-tf** directory.

```shell
cd terraform/cluster-templates-tf
```

Confirm you are in the correct directory.

```bash
pwd
```

```bash hideClipboard title="Expected output"
/workspace/terraform/cluster-templates-tf
```

## Configure the Terraform Provider

The directory contains files that configure the Spectro Cloud provider and point it at your Palette project. Review each
file before running any commands.

| **File**             | **Description**                                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **provider.tf**      | Configures the Spectro Cloud Terraform provider and sets the target Palette project.                                                                                                                       |
| **inputs.tf**        | Declares the input variables the configuration expects: the Palette project and cloud provider.                                                                                                            |
| **terraform.tfvars** | Supplies values for the variables declared in `inputs.tf`. Update `palette-project` if your project is not named `Default`, and set `deploy-aws` or `deploy-azure` to `true` to match your cloud provider. |
| **data.tf**          | Resolves the Palette project, registries, and pack configuration referenced by `cluster_profiles.tf`.                                                                                                      |

`inputs.tf` declares all variables used across the configuration. `palette-project` sets the Palette project where all
resources will be created. `app_port` is set at apply time and shared across every cluster the template manages.
`deploy-aws` and `deploy-azure` specify the cloud provider for the cluster template and all clusters it manages.

```hcl title="inputs.tf" hideClipboard
#########
# Palette
#########

variable "palette-project" {
  description = "Palette project name"
  type        = string
}

#####################
# Hello Universe
#####################

variable "app_port" {
  type        = number
  description = "The cluster port number on which the service will listen for incoming traffic."
}

#######
# AWS
#######

variable "deploy-aws" {
  type        = bool
  description = "A flag for enabling a deployment on AWS."
}

#########
# Azure
#########

variable "deploy-azure" {
  type        = bool
  description = "A flag for enabling a deployment on Azure."
}
```

Terraform loads `terraform.tfvars` automatically at runtime. If your project is not named `Default`, update
`palette-project`. Set either `deploy-aws` or `deploy-azure` to `true` to match your cloud provider. Only one should be
`true` at a time.

```hcl title="terraform.tfvars" hideClipboard
#####################
# Palette Settings
#####################
palette-project = "Default" # The name of your project in Palette.

##############################
# Hello Universe Configuration
##############################
app_port = 8080 # The cluster port number on which the service will listen for incoming traffic.

###########################
# AWS Deployment Settings
############################
deploy-aws = false # Set to true to deploy to AWS.

###########################
# Azure Deployment Settings
############################
deploy-azure = false # Set to true to deploy to Azure.
```

`provider.tf` pins the Spectro Cloud provider to its registry source and sets a minimum version requirement. The
`provider` block reads `var.palette-project` to target the correct Palette project.

`data.tf` resolves the Palette project, registries, and packs that `cluster_profiles.tf` references. The project lookup
runs first, so if authentication fails or the project does not exist, Terraform stops before creating any resources.

### Set API Key Environment Variable

Terraform authenticates to Palette using your API key. Export it as an environment variable so the provider picks it up
automatically.

```bash
export SPECTROCLOUD_APIKEY=<your-api-key>
```

Confirm the variable is set correctly.

```bash
echo $SPECTROCLOUD_APIKEY
```

```bash hideClipboard title="Expected output"
abcd1234efgh5678...
```

### Check Terraform Version

Confirm that Terraform 1.x is installed.

```bash
terraform version
```

```bash hideClipboard title="Expected output"
Terraform v1.x.x
on darwin_arm64
```

### Initialize the Working Directory

Initialize the working directory to download the Spectro Cloud provider.

```bash
terraform init
```

```bash hideClipboard title="Expected output"
Terraform has been successfully initialized!
```

Successful initialization confirms the provider plugin was downloaded and the working directory is ready.

## Create a Cluster Profile

`cluster_profiles.tf` declares two cluster profiles: one for AWS and one for Azure. The `count` meta-argument on each
resource reads `var.deploy-aws` or `var.deploy-azure` and resolves to either `1` or `0`, so only the matching resource
is created when you run `terraform apply`.

Pack versions are defined in `data.tf`. To use a different version, update the `version` field in the corresponding
`spectrocloud_pack` data source before running `terraform apply`.

<PartialsComponent category="cluster-templates" name="cluster-profile-pack-versions" />

`cluster_profiles.tf` loads the hello-universe pack values from `manifests/values-hello-universe.yaml`. This file sets
`replicas` to `{{.spectro.var.app_replicas}}`, a
[cluster profile variable](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
declared in the `profile_variables` block with `required = true`. Each cluster template that uses this profile must
supply a value for `app_replicas`, which is what allows development and production clusters to run different replica
counts while sharing the same profile.

## Create a Maintenance Policy

`maintenance_policy.tf` defines a
[maintenance policy](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md) that controls
when Palette schedules upgrades for clusters managed by the cluster template. For the tutorial, the policy is set to run
every Sunday at midnight UTC with a four hour upgrade window.

```hcl title="maintenance_policy.tf"
resource "spectrocloud_cluster_config_policy" "maintenance" {
  name    = "tf-maintenance-policy"
  context = "project"

  schedules {
    name         = "weekly-sunday"
    start_cron   = "0 0 * * SUN"
    duration_hrs = 4
  }
}
```

## Create a Cluster Template

`cluster_templates.tf` defines a [cluster template](../../../cluster-templates/create-cluster-templates.md) that links
the cluster profile and maintenance policy. `context = "project"` scopes the template to the current Palette project
rather than `"tenant"`, which would make it available across all projects in the organization. `kind = "maintenance"`
tells Palette how to apply the attached policy. Cluster templates are designed to support multiple kinds of policies,
and `kind` is how Palette distinguishes between them.

```hcl title="cluster_templates.tf"
resource "spectrocloud_cluster_config_template" "aws_template" {
  count = var.deploy-aws ? 1 : 0

  name       = "tf-cluster-template-aws"
  cloud_type = "aws"
  context    = "project"

  cluster_profile {
    id = spectrocloud_cluster_profile.aws_profile[0].id
  }

  policy {
    id   = spectrocloud_cluster_config_policy.maintenance.id
    kind = "maintenance"
  }
}
```

## Deploy Clusters from the Template

Deploy a development cluster and a production cluster from `tf-cluster-template-aws`, using profile variables to apply
environment-specific replica counts.

### Deploy a Development Cluster from the Template

`clusters.tf` defines a development cluster that uses the AWS cluster template. The `cluster_template` block links the
cluster to the template. The nested `cluster_profile` block is needed to override the variable value for the profile
within that template, scoped to just this cluster. `app_replicas` is set to `"1"`, without changing the shared template
or profile.

```hcl title="clusters.tf" hideClipboard
resource "spectrocloud_cluster_aws" "dev_cluster" {
  count = var.deploy-aws ? 1 : 0

  name             = "tf-dev-cluster"
  cluster_timezone = "UTC"
  cloud_account_id = data.spectrocloud_cloudaccount_aws.account[0].id

  cloud_config {
    region       = var.aws-region
    ssh_key_name = var.aws-key-pair-name
  }

  cluster_template {
    id = spectrocloud_cluster_config_template.aws_template[0].id

    cluster_profile {
      id = spectrocloud_cluster_profile.aws_profile[0].id
      variables = {
        "app_replicas" = "1"
      }
    }
  }
}
```

### Deploy a Production Cluster from the Template

`clusters.tf` also defines a production cluster using the same template. The only difference is `app_replicas` is set to
`"2"`, giving the production environment more replicas without changing the shared template or profile.

```hcl title="clusters.tf" hideClipboard
resource "spectrocloud_cluster_aws" "prod_cluster" {
  count = var.deploy-aws ? 1 : 0

  name             = "tf-prod-cluster"
  cluster_timezone = "UTC"
  cloud_account_id = data.spectrocloud_cloudaccount_aws.account[0].id

  cloud_config {
    region       = var.aws-region
    ssh_key_name = var.aws-key-pair-name
  }

  cluster_template {
    id = spectrocloud_cluster_config_template.aws_template[0].id

    cluster_profile {
      id = spectrocloud_cluster_profile.aws_profile[0].id
      variables = {
        "app_replicas" = "2"
      }
    }
  }
}
```

Run `terraform test` to verify the full configuration. The tests use a mock provider, so no credentials are required.

```bash
terraform test
```

```bash hideClipboard title="Expected output"
  run "verify_aws"... pass
tests/aws-replace.tftest.hcl... pass
  run "verify_aws"... pass
tests/aws.tftest.hcl... pass
  run "verify_azure"... pass
tests/azure-replace.tftest.hcl... pass
  run "verify_azure"... pass
tests/azure.tftest.hcl... pass

Success! 4 passed, 0 failed.
```

Open `terraform.tfvars`. Set `deploy-aws` to `true` and replace each `REPLACE ME` placeholder with the correct value for
your environment.

Ensure that `aws-cloud-account-name` matches the name of the AWS cloud account registered in Palette. The SSH key pair
specified in `aws-key-pair-name` must exist in the same region as `aws-region`.

```hcl {4,6,7,8,15,23} title="terraform.tfvars"
###########################
# AWS Deployment Settings
###########################
deploy-aws = true # Set to true to deploy to AWS.

aws-cloud-account-name = "REPLACE ME"
aws-region             = "REPLACE ME"
aws-key-pair-name      = "REPLACE ME"

aws_control_plane_nodes = {
  count              = "1"
  control_plane      = true
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"]
}

aws_worker_nodes = {
  count              = "1"
  control_plane      = false
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE ME"]
}
```

Issue the `plan` command to preview all resources. This also confirms that Terraform can authenticate to Palette and
that your project exists.

```bash
terraform plan
```

```bash hideClipboard title="Expected output"
data.spectrocloud_project.current: Reading...
data.spectrocloud_project.current: Read complete after 0s [id=<project-id>]
...

  # spectrocloud_cluster_aws.dev_cluster[0] will be created
  + resource "spectrocloud_cluster_aws" "dev_cluster" { ... }

  # spectrocloud_cluster_aws.prod_cluster[0] will be created
  + resource "spectrocloud_cluster_aws" "prod_cluster" { ... }

  # spectrocloud_cluster_config_policy.maintenance will be created
  + resource "spectrocloud_cluster_config_policy" "maintenance" { ... }

  # spectrocloud_cluster_config_template.aws_template[0] will be created
  + resource "spectrocloud_cluster_config_template" "aws_template" { ... }

  # spectrocloud_cluster_profile.aws_profile[0] will be created
  + resource "spectrocloud_cluster_profile" "aws_profile" { ... }

Plan: 5 to add, 0 to change, 0 to destroy.
```

If `Read complete` appears in the output, Terraform successfully authenticated and found your Palette project. A plan of
`5 to add` confirms all resources are ready to be created.

Issue the `apply` command to create all resources in Palette.

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Expected output"
spectrocloud_cluster_config_policy.maintenance: Creating...
spectrocloud_cluster_profile.aws_profile[0]: Creating...
spectrocloud_cluster_config_policy.maintenance: Creation complete after 0s [id=<policy-id>]
spectrocloud_cluster_profile.aws_profile[0]: Creation complete after 2s [id=<profile-id>]
spectrocloud_cluster_config_template.aws_template[0]: Creating...
spectrocloud_cluster_config_template.aws_template[0]: Creation complete after 1s [id=<template-id>]
spectrocloud_cluster_aws.dev_cluster[0]: Creating...
spectrocloud_cluster_aws.prod_cluster[0]: Creating...
spectrocloud_cluster_aws.dev_cluster[0]: Still creating... [10s elapsed]
spectrocloud_cluster_aws.prod_cluster[0]: Still creating... [10s elapsed]
...
spectrocloud_cluster_aws.dev_cluster[0]: Creation complete after Xm Ys [id=<cluster-id>]
spectrocloud_cluster_aws.prod_cluster[0]: Creation complete after Xm Ys [id=<cluster-id>]

Apply complete! Resources: 5 added, 0 changed, 0 destroyed.
```

The cluster deployments may take 15 to 30 minutes each. Navigate to [Palette](https://console.spectrocloud.com) and from
the left main menu, select **Clusters** to monitor progress. Once `tf-dev-cluster` has a **Running** status, select it
and go to the **Profile** tab. Confirm it is using `tf-cluster-template-profile-aws`. Select the **Hello Universe**
pack, then select **Configure Values** and confirm that `app_replicas` is set to `1`.

Once `tf-prod-cluster` has a **Running** status, select it and go to the **Profile** tab. Confirm it is using
`tf-cluster-template-profile-aws`. Select the **Hello Universe** pack, then select **Configure Values** and confirm that
`app_replicas` is set to `2`.

### Validate the Deployments

From the left main menu, select **Clusters**, and then select **tf-dev-cluster**.

When the application is deployed and ready for network traffic, indicated in the **Services** field, Palette exposes the
service URL. Open the URL for port **:8080** to launch the Hello Universe application.

![Screenshot showing how to find the Hello Universe service URL](/hello-universe-service-url.webp)

:::warning

It can take up to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few
moments before opening the service URL to prevent the browser from caching an unresolved DNS request.

:::

![Hello Universe application](/hello-universe-1-3-0.webp)

The `tf-dev-cluster` cluster is serving the Hello Universe application.

Repeat these steps for `tf-prod-cluster` to confirm you can launch its Hello Universe application.

## Create a New Cluster Profile Version

In this section, you will create a new cluster profile version that adds the Kubecost pack for real-time cost
visibility. The configuration adds a new `spectrocloud_cluster_profile` resource with `version = "1.1.0"` and the same
`name` as the existing profile.

The Spectro Cloud Terraform provider models each `spectrocloud_cluster_profile` resource as one profile version.
Creating a new resource with the same `name` but a different `version` registers it as a new version of the same profile
in Palette.

`tf-dev-cluster` and `tf-prod-cluster` remain on `1.0.0` until you explicitly upgrade them.

Set `create_new_profile_version` to `true` in `terraform.tfvars` after the initial clusters are deployed.

```hcl title="terraform.tfvars" hideClipboard {6}
##############################
# Hello Universe Configuration
##############################
app_port = 8080 # The cluster port number on which the service will listen for incoming traffic.

create_new_profile_version = true # Set to true to create cluster profile version 1.1.0 with Kubecost.
```

### Review the New Profile Version Code

`data.tf` includes a new data source for the Kubecost pack (`cost-analyzer`) that Terraform fetches only when
`create_new_profile_version` is `true`.

```hcl hideClipboard
data "spectrocloud_pack" "kubecost" {
  count        = var.create_new_profile_version ? 1 : 0
  name         = "cost-analyzer"
  version      = "1.103.3"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```

The `cluster_profiles.tf` file includes a new v1.1.0 profile resource that is only created when both `deploy-aws` and
`create_new_profile_version` are `true`. Version 1.1.0 includes the same five packs as v1.0.0 and adds Kubecost as a
sixth.

<Tabs>

<TabItem label="AWS" value="aws">

```hcl hideClipboard
resource "spectrocloud_cluster_profile" "aws_profile_v110" {
  count = (var.deploy-aws && var.create_new_profile_version) ? 1 : 0

  name        = "tf-cluster-template-profile-aws"
  description = "Cluster profile for the cluster templates tutorial"
  cloud       = "aws"
  type        = "cluster"
  version     = "1.1.0"

  pack {
    name   = data.spectrocloud_pack.aws_ubuntu.name
    tag    = data.spectrocloud_pack.aws_ubuntu.version
    uid    = data.spectrocloud_pack.aws_ubuntu.id
    values = data.spectrocloud_pack.aws_ubuntu.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.aws_k8s.name
    tag    = data.spectrocloud_pack.aws_k8s.version
    uid    = data.spectrocloud_pack.aws_k8s.id
    values = data.spectrocloud_pack.aws_k8s.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.aws_cni.name
    tag    = data.spectrocloud_pack.aws_cni.version
    uid    = data.spectrocloud_pack.aws_cni.id
    values = data.spectrocloud_pack.aws_cni.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.aws_csi.name
    tag    = data.spectrocloud_pack.aws_csi.version
    uid    = data.spectrocloud_pack.aws_csi.id
    values = data.spectrocloud_pack.aws_csi.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.hellouniverse.name
    tag    = data.spectrocloud_pack.hellouniverse.version
    uid    = data.spectrocloud_pack.hellouniverse.id
    values = templatefile("manifests/values-hello-universe.yaml", {
      port = var.app_port
    })
    type   = "oci"
  }

  pack {
    name = data.spectrocloud_pack.kubecost[0].name
    tag  = data.spectrocloud_pack.kubecost[0].version
    uid  = data.spectrocloud_pack.kubecost[0].id
    type = "oci"
  }

  profile_variables {
    variable {
      name          = "app_replicas"
      display_name  = "Hello Universe Replicas"
      format        = "number"
      description   = "Number of replicas for the hello-universe workload"
      default_value = "1"
      required      = true
    }
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```hcl hideClipboard
resource "spectrocloud_cluster_profile" "azure_profile_v110" {
  count = (var.deploy-azure && var.create_new_profile_version) ? 1 : 0

  name        = "tf-cluster-template-profile-azure"
  description = "Cluster profile for the cluster templates tutorial"
  cloud       = "azure"
  type        = "cluster"
  version     = "1.1.0"

  pack {
    name   = data.spectrocloud_pack.azure_ubuntu.name
    tag    = data.spectrocloud_pack.azure_ubuntu.version
    uid    = data.spectrocloud_pack.azure_ubuntu.id
    values = data.spectrocloud_pack.azure_ubuntu.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.azure_k8s.name
    tag    = data.spectrocloud_pack.azure_k8s.version
    uid    = data.spectrocloud_pack.azure_k8s.id
    values = data.spectrocloud_pack.azure_k8s.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.azure_cni.name
    tag    = data.spectrocloud_pack.azure_cni.version
    uid    = data.spectrocloud_pack.azure_cni.id
    values = data.spectrocloud_pack.azure_cni.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.azure_csi.name
    tag    = data.spectrocloud_pack.azure_csi.version
    uid    = data.spectrocloud_pack.azure_csi.id
    values = data.spectrocloud_pack.azure_csi.values
    type   = "spectro"
  }

  pack {
    name   = data.spectrocloud_pack.hellouniverse.name
    tag    = data.spectrocloud_pack.hellouniverse.version
    uid    = data.spectrocloud_pack.hellouniverse.id
    values = templatefile("manifests/values-hello-universe.yaml", {
      port = var.app_port
    })
    type   = "oci"
  }

  pack {
    name = data.spectrocloud_pack.kubecost[0].name
    tag  = data.spectrocloud_pack.kubecost[0].version
    uid  = data.spectrocloud_pack.kubecost[0].id
    type = "oci"
  }

  profile_variables {
    variable {
      name          = "app_replicas"
      display_name  = "Hello Universe Replicas"
      format        = "number"
      description   = "Number of replicas for the hello-universe workload"
      default_value = "1"
      required      = true
    }
  }
}
```

</TabItem>

</Tabs>

Issue the `terraform plan` command to preview the changes. Terraform reports one new resource to add.

```shell
terraform plan
```

```text hideClipboard title="Expected output"
Plan: 1 to add, 0 to change, 0 to destroy.
```

Apply the changes to create the new profile version in Palette.

```shell
terraform apply -auto-approve
```

```bash hideClipboard title="Expected output"
spectrocloud_cluster_profile.aws_profile_v110[0]: Creating...
spectrocloud_cluster_profile.aws_profile_v110[0]: Creation complete after 2s [id=<profile-id>]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

### Validate

In Palette, navigate to the left main menu and select **Profiles**. Select `tf-cluster-template-profile-aws` from the
profile list. Select the version drop-down beside the profile name and confirm that version `1.1.0` now appears
alongside `1.0.0`.

Select `1.1.0` and confirm the Kubecost (cost-analyzer) pack appears in the pack list.

![Pack layers with Kubecost](/pack-layers-with-kubecost.webp)

The `tf-dev-cluster` and `tf-prod-cluster` clusters are still referencing profile version `1.0.0` and are unaffected by
this change.

## Update the Cluster Template to the New Profile Version

## Upgrade Clusters from the Template

### Validate the Upgrades

## Cleanup

## Wrap-Up
