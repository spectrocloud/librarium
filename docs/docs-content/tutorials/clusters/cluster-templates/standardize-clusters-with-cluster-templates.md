---
sidebar_position: 0
sidebar_label: "Standardize Clusters with Cluster Templates"
title: "Standardize Cluster Provisioning and Maintenance with Cluster Templates"
description:
  "A tutorial that shows how to standardize cluster provisioning, apply maintenance windows, and roll out upgrades using
  cluster templates and Terraform."
tags: ["cluster templates", "tutorial", "terraform", "profiles", "aws", "azure"]
---

When you manage many Kubernetes clusters, configuring and upgrading them one by one does not scale. You need a way to
apply the same configuration and upgrade rules across multiple clusters.

Palette supports this workflow with cluster templates. Cluster templates let you reuse a cluster configuration, control
when upgrades happen, and apply changes to multiple clusters at once.

[Cluster templates](../../../cluster-templates/cluster-templates.md) combine a
[cluster profile](../../../../../profiles/cluster-profiles/create-cluster-profiles/) and one or more
[cluster template policies](../../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md).

- [Cluster profiles](../../../../../profiles/cluster-profiles/create-cluster-profiles/) define what a cluster runs. They
  contain the software stack and infrastructure configuration.
- [Cluster template policies](../../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md)
  define how clusters created from a template are managed throughout their lifecycle, including when upgrades can run.

Cluster profiles can include
[cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/),
which let you reuse the same profile while changing specific values per cluster, such as the worker node instance size
or the number of application replicas.

A [maintenance policy](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md) is one example
of a cluster template policy. Maintenance policies define a maintenance window that controls when upgrades can run.
Currently, maintenance policies are the only supported cluster template policy type in Palette.

![Diagram of cluster template architecture](/profiles-policies-templates.webp)

When you create clusters from the same template, they inherit the same base configuration and the same governance rules.
For example, you can create **dev** and **prod** clusters from a single template. Both clusters run the same software
stack and follow the same upgrade policy. You can assign different profile variable values to handle
environment-specific requirements.

In this tutorial, you will:

- Create a cluster profile, a cluster template policy, and a cluster template that uses them together
- Deploy two clusters (**dev** and **prod**) from the same template
- Use
  [cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
  to apply environment-specific settings
- Update the template and upgrade both clusters

Cluster templates can be used across all supported public clouds and data centers in Palette. This tutorial demonstrates
two workflows: [Palette UI](#provision-and-upgrade-clusters-using-the-palette-ui) and
[Terraform on AWS or Azure](#provision-and-upgrade-clusters-using-terraform).

Both workflows use the same core components and follow the same architecture. In the UI workflow, you will import a
provided JSON cluster profile definition into the Palette UI. In the Terraform workflow, you will define and create the
cluster profile as code. In both cases, you create a cluster template, deploy clusters from it, and manage upgrades
through profile version updates.

Choose the workflow that best fits your use case.

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
- Terraform version 1.x installed.
- A [Palette API key](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) set as an environment
  variable.

## Provision and Upgrade Clusters Using the Palette UI

In this section, you will use the Palette UI to import a cluster profile, create a cluster template with a maintenance
policy, and deploy two clusters from the same template. You will then release a new cluster profile version, update the
template to reference it, and apply upgrades across both clusters.

<PartialsComponent category="cluster-templates" name="aws-example-note" />

### Import a Cluster Profile

In this section, you will import a cluster profile into Palette composed of the following packs.

<PartialsComponent category="cluster-templates" name="cluster-profile-pack-versions" />

The `hello-universe` pack declares an `app_replicas`
[cluster profile variable](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/).
This variable has no value in the profile itself. A cluster template will assign a value for each cluster it manages,
allowing dev and prod clusters to run different replica counts from the same profile. The variable is marked `required`,
so no cluster can be deployed without a value.

Log in to [Palette](https://console.spectrocloud.com). From the left **Main Menu**, select **Profiles** and click
**Import Cluster Profile**.

In the slide panel that opens, copy the JSON for your cloud provider and paste it into the text area.

<Tabs>

<TabItem label="AWS" value="aws">

```json
{
  "metadata": {
    "name": "cluster-template-profile-aws",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "aws",
      "packs": [
        {
          "name": "ubuntu-aws",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-aws-ebs",
          "type": "spectro",
          "layer": "csi",
          "version": "1.46.0",
          "tag": "1.46.0",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```json
{
  "metadata": {
    "name": "cluster-template-profile-azure",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "azure",
      "packs": [
        {
          "name": "ubuntu-azure",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico-azure",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-azure",
          "type": "spectro",
          "layer": "csi",
          "version": "1.31.2-rev2",
          "tag": "1.31.2-rev2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

</Tabs>

Click **Validate**. A _Validated successfully_ message should appear, indicating the profile is ready to import. Click
**Confirm**.

#### Verify the Import

To verify the import, navigate to **Profiles** from the left **Main Menu** and select `cluster-template-profile-aws`.
Review its pack layers to confirm they match the table above. Select the **Variables** tab and verify that
`app_replicas` is listed, which is what a cluster template will assign a value to at deploy time.

### Create a Maintenance Policy

A
[cluster template policy](../../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md)
governs how Palette manages the lifecycle of clusters attached to a template. You will use a
[maintenance policy](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md), which defines a
recurring upgrade window.

Create a maintenance policy with a weekly Sunday midnight schedule and a four-hour upgrade window.

1. From the left **Main Menu**, select **Cluster Configurations**.
2. From the top-right of the **Policies** tab, select **Create Policy > Maintenance Policy**.
3. In the **Name** field, enter `cluster-template-policy`.
4. Select **Add Schedule** to open the schedule drawer.
5. In the **Name** field, enter `weekly-sunday`.
6. From the **Schedule** drop-down menu, select **Every week on Sunday at midnight**.
7. Set the **Upgrade window** to **4** hours.
8. Select **Confirm**, then **Next**, then **Finalize**.

The policy appears in the **Policies** list and is ready to attach to a cluster template.

### Create a Cluster Template

### Deploy a Dev Cluster from the Template

### Deploy a Prod Cluster from the Template

### Validate the Deployments

### Create a New Cluster Profile Version

### Update the Cluster Template to the New Profile Version

### Upgrade Clusters

### Validate the Upgrades

### Cleanup

## Provision and Upgrade Clusters Using Terraform

In this section, you will define and manage your cluster infrastructure as code using Terraform. You will configure the
Terraform provider, create a cluster profile, configure a cluster template with a maintenance policy, and deploy two
clusters from the same template. You will then release a new cluster profile version, update the template to reference
it, and apply upgrades across both clusters.

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

### Configure the Terraform Provider

The directory contains files that configure the Spectro Cloud provider and point it at your Palette project. Review each
file before running any commands.

| **File**             | **Description**                                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **provider.tf**      | Configures the Spectro Cloud Terraform provider and sets the target Palette project.                                                                                                                       |
| **inputs.tf**        | Declares the input variables the configuration expects: the Palette project and cloud provider.                                                                                                            |
| **terraform.tfvars** | Supplies values for the variables declared in `inputs.tf`. Update `palette-project` if your project is not named `Default`, and set `deploy-aws` or `deploy-azure` to `true` to match your cloud provider. |
| **data.tf**          | Resolves the Palette project, registries, and pack configuration referenced by `cluster_profiles.tf`.                                                                                                      |

`inputs.tf` declares four variables. `palette-project` sets the Palette project where the cluster template and all
clusters it manages will be created. `app_port` is set at apply time and shared across every cluster the template
manages. `deploy-aws` and `deploy-azure` determine the cloud provider for the cluster template and all clusters it
manages.

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

#### Set API Key Environment Variable

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

#### Check Terraform Version

Confirm that Terraform 1.x is installed.

```bash
terraform version
```

```bash hideClipboard title="Expected output"
Terraform v1.x.x
on darwin_arm64
```

#### Initialize the Working Directory

Initialize the working directory to download the Spectro Cloud provider.

```bash
terraform init
```

```bash hideClipboard title="Expected output"
Terraform has been successfully initialized!
```

Successful initialization confirms the provider plugin was downloaded and the working directory is ready.

### Create a Cluster Profile

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
supply a value for `app_replicas`, which is what allows dev and prod clusters to run different replica counts while
sharing the same profile.

Run `terraform test` to verify the profile configuration.

```bash
terraform test
```

```bash hideClipboard title="Expected output"
tests/aws.tftest.hcl... pass
  run "verify_aws_profile"... pass
tests/azure.tftest.hcl... pass
  run "verify_azure_profile"... pass

Success! 2 passed, 0 failed.
```

### Create a Maintenance Policy

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

With both the cluster profile and maintenance policy defined, run `terraform plan` to preview the changes Terraform will
make. This also confirms that Terraform can authenticate to Palette and that your project exists.

```bash
terraform plan
```

```bash hideClipboard title="Expected output"
data.spectrocloud_project.current: Reading...
data.spectrocloud_project.current: Read complete after 0s [id=<project-id>]
...

  # spectrocloud_cluster_config_policy.maintenance will be created
  + resource "spectrocloud_cluster_config_policy" "maintenance" { ... }

  # spectrocloud_cluster_profile.aws_profile[0] will be created
  + resource "spectrocloud_cluster_profile" "aws_profile" { ... }

Plan: 2 to add, 0 to change, 0 to destroy.
```

If `Read complete` appears in the output, Terraform successfully authenticated and found your Palette project. A plan of
`2 to add` confirms both resources are ready to be created.

Apply the configuration to create the cluster profile and maintenance policy in Palette.

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Expected output"
spectrocloud_cluster_profile.aws_profile[0]: Creating...
spectrocloud_cluster_profile.aws_profile[0]: Creation complete after Xs [id=<profile-id>]
spectrocloud_cluster_config_policy.maintenance: Creating...
spectrocloud_cluster_config_policy.maintenance: Creation complete after Xs [id=<policy-id>]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

Confirm the cluster profile was created correctly in Palette.

1. Log in to [Palette](https://console.spectrocloud.com)
2. Click **Profiles** from the left **Main Menu**.
3. Locate and select the cluster profile named `tf-cluster-template-profile`.
4. Review its pack layers to confirm they match the configuration.
5. Select the **Variables** tab and confirm that a variable named `app_replicas` is listed.

Confirm the maintenance policy was created correctly in Palette.

1. From the left **Main Menu**, select **Cluster Configurations**.
2. On the **Policies** tab, locate the policy named `tf-maintenance-policy`.
3. Select it and confirm the schedule shows a weekly window starting every Sunday at midnight UTC with a four hour
   duration.

### Create a Cluster Template

### Deploy Dev and Prod Clusters with Different Variable Values

### Validate the Deployments

### Create a New Cluster Profile Version

### Update the Cluster Template to the New Profile Version

### Upgrade Clusters

### Validate the Upgrades

### Cleanup
