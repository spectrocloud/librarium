---
sidebar_position: 0
sidebar_label: "Standardize Cluster Provisioning"
title: "Standardize Cluster Provisioning and Maintenance with Cluster Templates"
description:
  "A tutorial that shows how to standardize cluster provisioning, apply maintenance windows, and roll out upgrades using
  cluster templates and Terraform."
tags: ["cluster templates", "tutorial", "terraform", "profiles", "aws", "azure"]
---

# Standardize Cluster Provisioning and Maintenance with Cluster Templates

As your Kubernetes footprint grows, managing clusters individually becomes error prone and difficult to scale. You need
a way to standardize cluster provisioning, control when upgrades occur, and apply changes consistently across
environments.

This tutorial introduces cluster templates, a Palette feature that helps you define a repeatable cluster configuration,
enforce maintenance windows, and upgrade clusters as a group.

In this tutorial, you will:

- Import or create a cluster profile
- Create a maintenance policy
- Create a cluster template that references the profile and policy
- Deploy two clusters from the template
- Assign a cluster profile variable value per cluster
- Update the template and upgrade both clusters

You can complete this tutorial using one of the following workflows:

- Palette UI for AWS
- Terraform for AWS or Azure

Choose the workflow that best fits your operational model.

Warning: This tutorial provisions two clusters. You will incur cloud costs until you complete the Cleanup section.

## Prerequisites

Before you begin, ensure you have:

- A Palette account with permission to:
  - Create cluster profiles
  - Create maintenance policies
  - Create cluster templates
  - Create clusters
- Access to an AWS account that is registered in Palette if you use the Palette UI workflow
- Access to an AWS or Azure account that is registered in Palette if you use the Terraform workflow

If you use Terraform, ensure you have:

- Terraform version 1.x installed
- A Palette API key exported as an environment variable

```bash
export SPECTROCLOUD_APIKEY=<your-api-key>
```

## Clone GitHub Repository

If you plan to use Terraform, clone the repository that contains the examples used in this tutorial.

```bash
git clone https://github.com/spectrocloud/tutorials.git
cd tutorials/terraform/cluster-templates-tf
```

## Choose Your Workflow

Select one of the following sections to complete:

- Provision and upgrade clusters using the Palette UI for AWS
- Provision and upgrade clusters using Terraform for AWS or Azure

## Provision and Upgrade Clusters Using the Palette UI for AWS

Use this workflow if you prefer a visual and guided experience in the Palette console.

### Import a Cluster Profile

This workflow imports a cluster profile that already includes a **cluster profile variable** named `hello_replicas`. You
will assign a different value for `dev` and `prod` at deployment time.

1. In the Palette UI, navigate to **Profiles**.

2. Select **Import Cluster Profile**.

3. Paste this JSON into the Import Cluster Profile window.

   ```json
   {
     "metadata": {
       "name": "brent-aws-profile-for-cluster-template",
       "description": "AWS cluster profile created with Terraform",
       "labels": {
         "created-by": "terraform",
         "env": "aws"
       }
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
             "manifests": [],
             "registry": {
               "metadata": {
                 "name": "Public Repo",
                 "kind": "pack",
                 "isPrivate": false,
                 "isSyncSupported": true
               }
             },
             "values": "# Ubuntu 22.04 OS configuration\n# Additional kubeadm customization can be added here if required"
           },
           {
             "name": "kubernetes",
             "type": "spectro",
             "layer": "k8s",
             "version": "1.32.3",
             "tag": "1.32.3",
             "manifests": [],
             "registry": {
               "metadata": {
                 "name": "Public Repo",
                 "kind": "pack",
                 "isPrivate": false,
                 "isSyncSupported": true
               }
             },
             "values": "pack:\n  content:\n    images:\n      - image: registry.k8s.io/coredns/coredns:v1.11.3\n      - image: registry.k8s.io/etcd:3.5.16-0\n      - image: registry.k8s.io/kube-apiserver:v1.32.3\n      - image: registry.k8s.io/kube-controller-manager:v1.32.3\n      - image: registry.k8s.io/kube-proxy:v1.32.3\n      - image: registry.k8s.io/kube-scheduler:v1.32.3\n\nkubeadmconfig:\n  apiServer:\n    extraArgs:\n      secure-port: \"6443\"\n      profiling: \"false\"\n      authorization-mode: RBAC,Node\n  controllerManager:\n    extraArgs:\n      profiling: \"false\"\n  scheduler:\n    extraArgs:\n      profiling: \"false\"\n  kubeletExtraArgs:\n    protect-kernel-defaults: \"true\"\n    rotate-server-certificates: \"true\""
           },
           {
             "name": "cni-calico",
             "type": "spectro",
             "layer": "cni",
             "version": "3.29.3",
             "tag": "3.29.3",
             "manifests": [],
             "registry": {
               "metadata": {
                 "name": "Public Repo",
                 "kind": "pack",
                 "isPrivate": false,
                 "isSyncSupported": true
               }
             },
             "values": "pack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.29.3/cni:v3.29.3\n      - image: us-docker.pkg.dev/palette-images/packs/calico/3.29.3/node:v3.29.3"
           },
           {
             "name": "csi-aws-ebs",
             "type": "spectro",
             "layer": "csi",
             "version": "1.41.0",
             "tag": "1.41.0",
             "manifests": [],
             "registry": {
               "metadata": {
                 "name": "Public Repo",
                 "kind": "pack",
                 "isPrivate": false,
                 "isSyncSupported": true
               }
             },
             "values": "pack:\n  content:\n    images:\n      - image: us-docker.pkg.dev/palette-images/packs/csi-aws-ebs/1.41.0/aws-ebs-csi-driver:v1.41.0\n  namespace: kube-system"
           },
           {
             "name": "hello-universe",
             "type": "oci",
             "layer": "addon",
             "version": "1.2.0",
             "tag": "1.2.0",
             "manifests": [],
             "registry": {
               "metadata": {
                 "name": "Palette Community Registry",
                 "kind": "oci",
                 "isPrivate": true,
                 "providerType": "pack",
                 "isSyncSupported": true
               }
             }
           }
         ]
       },
       "variables": [
         {
           "name": "hello_replicas",
           "displayName": "Hello Universe Replicas",
           "format": "number",
           "required": true,
           "defaultValue": "1",
           "immutable": false,
           "hidden": false,
           "isSensitive": false,
           "inputType": "text"
         }
       ]
     }
   }
   ```

4. Select **Validate**.

5. Select **Confirm**.

6. Open the cluster profile named `brent-aws-profile-for-cluster-template` and review the layers.

7. Select the **Variables** tab and confirm a variable named `hello_replicas` exists.

The cluster profile exists and is ready to use in a cluster template.

### Create a Maintenance Policy

1. In the Palette UI, navigate to **Policies** > **Cluster Config Policies**.
2. Select **Add Policy**.
3. Enter a policy name.
4. Set the schedule to a weekly maintenance window, such as Sunday at 02:00.
5. Save the policy.

The maintenance policy controls when upgrades can start for clusters that use the policy.

### Create a Cluster Template

1. In the Palette UI, navigate to **Cluster Templates**.
2. Select **Add Cluster Template**.
3. Enter a template name and select **AWS** as the cloud type.
4. In the cluster profile section, attach the imported cluster profile and select version `1.0.0`.
5. In the policy section, attach the maintenance policy.
6. Save the cluster template.

The cluster template exists and references the cluster profile and maintenance policy.

### Deploy a Dev Cluster from the Template

1. In the Palette UI, navigate to **Clusters**.
2. Select **Create Cluster**.
3. For the setup type, select **Cluster Template**.
4. Select the cluster template you created.
5. Name the cluster `dev`.
6. Select the AWS cloud account, region, and other required cluster settings.
7. In **Cluster Profile Variables**, set:

   - `hello_replicas = 1`

8. Select **Create**.

Wait for the cluster status to report **Running**.

### Deploy a Prod Cluster from the Template

Repeat the same process to create a second cluster.

1. In the Palette UI, navigate to **Clusters**.
2. Select **Create Cluster**.
3. For the setup type, select **Cluster Template**.
4. Select the cluster template you created.
5. Name the cluster `prod`.
6. Select the AWS cloud account, region, and other required cluster settings.
7. In **Cluster Profile Variables**, set:

   - `hello_replicas = 2`

8. Select **Create**.

Wait for the cluster status to report **Running**.

### Validate the Deployments

Validate both clusters from the Palette UI.

1. On the left main menu, select **Clusters**.
2. Select `dev`.
3. Confirm the cluster status is **Running**.
4. Select the **Profile** tab.
5. Confirm the cluster template and profile version match your template configuration.
6. Repeat the same validation for `prod`.
7. Confirm the `hello-universe` workload replica count differs:

   - `dev` has **1** replica.
   - `prod` has **2** replicas.

### Create a New Cluster Profile Version with Kubecost

1. On the left main menu, select **Profiles**.
2. Select your imported cluster profile `brent-aws-profile-for-cluster-template`.
3. Create a new version, such as `1.1.0`.
4. Add the Kubecost pack to the new version.
5. Save the new version.

The cluster profile now has a new version that includes Kubecost.

### Update the Cluster Template to the New Profile Version

1. On the left main menu, select **Cluster Templates**.
2. Select your cluster template.
3. Edit the template and update the linked cluster profile version to `1.1.0`.
4. Save the template.

The cluster template now references the updated profile version.

### Trigger an Immediate Upgrade

This tutorial uses an immediate upgrade to reduce wait time.

1. In the cluster template, locate the upgrade controls.
2. Select **Upgrade Now**.

Palette triggers upgrades for clusters attached to the template, including `dev` and `prod`.

### Validate the Upgrades

1. On the left main menu, select **Clusters**.
2. Select `dev`.
3. Confirm the cluster status is **Running**.
4. Select the **Profile** tab and confirm the cluster is using the updated profile version.
5. Confirm the Kubecost layer appears and reports a healthy status.
6. Repeat the same validation for `prod`.

### Cleanup

1. On the left main menu, select **Clusters**.
2. Delete the `dev` cluster, and then delete the `prod` cluster.
3. On the left main menu, select **Cluster Templates**, and delete the cluster template.
4. On the left main menu, select **Profiles**, and delete the cluster profile and all versions.
5. On the left main menu, select **Policies** > **Cluster Config Policies**, and delete the maintenance policy.

## Provision and Upgrade Clusters Using Terraform

Use this workflow if you prefer to manage cluster templates and clusters as code.

This workflow starts from scratch and does not reuse resources created through the UI workflow.

Note: This workflow focuses on cluster templates, policies, and upgrades as code. The UI workflow demonstrates a simple
cluster profile variable (`hello_replicas`) assigned per cluster.

### Configure the Terraform Provider

Create a `provider.tf` file.

```hcl
terraform {
  required_providers {
    spectrocloud = {
      source  = "spectrocloud/spectrocloud"
      version = ">= 0.20.6"
    }
  }

  required_version = ">= 1.9"
}

provider "spectrocloud" {
  project_name = var.palette_project
}
```

Create `inputs.tf`.

```hcl
variable "palette_project" {
  description = "Palette project name"
  type        = string
}
```

Create `terraform.tfvars`.

```hcl
palette_project = "Default"
```

Initialize Terraform.

```bash
terraform init
```

```bash hideClipboard title="Example Output"
Terraform has been successfully initialized!
```

### Create a Cluster Profile

Use the tabs to select the cloud provider.

<Tabs>

<TabItem label="AWS" value="aws">

```hcl
resource "spectrocloud_cluster_profile" "profile" {
  name        = "tf-aws-profile"
  description = "AWS cluster profile created with Terraform"
  cloud       = "aws"
  type        = "cluster"
  version     = "1.0.0"
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```hcl
resource "spectrocloud_cluster_profile" "profile" {
  name        = "tf-azure-profile"
  description = "Azure cluster profile created with Terraform"
  cloud       = "azure"
  type        = "cluster"
  version     = "1.0.0"
}
```

</TabItem>

</Tabs>

Plan and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to add, 0 to change, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_profile.profile: Creation complete

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

Validate the cluster profile in the Palette UI.

1. On the left main menu, select **Profiles**.
2. Confirm the Terraform created profile exists.

### Create a Maintenance Policy

```hcl
resource "spectrocloud_cluster_config_policy" "weekly_maintenance" {
  name    = "tf-weekly-maintenance-policy"
  context = "project"

  schedules {
    name         = "sunday-maintenance"
    start_cron   = "0 2 * * SUN"
    duration_hrs = 4
  }
}
```

Plan and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to add, 0 to change, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_config_policy.weekly_maintenance: Creation complete

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

Validate the policy in the Palette UI.

1. On the left main menu, select **Policies** > **Cluster Config Policies**.
2. Confirm the policy exists.

### Create a Cluster Template

Use the tabs to select the cloud provider.

<Tabs>

<TabItem label="AWS" value="aws-template">

```hcl
resource "spectrocloud_cluster_config_template" "template" {
  name       = "tf-aws-template"
  cloud_type = "aws"
  context    = "project"

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }

  policy {
    id   = spectrocloud_cluster_config_policy.weekly_maintenance.id
    kind = "maintenance"
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure-template">

```hcl
resource "spectrocloud_cluster_config_template" "template" {
  name       = "tf-azure-template"
  cloud_type = "azure"
  context    = "project"

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }

  policy {
    id   = spectrocloud_cluster_config_policy.weekly_maintenance.id
    kind = "maintenance"
  }
}
```

</TabItem>

</Tabs>

Plan and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to add, 0 to change, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_config_template.template: Creation complete

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

Validate the template in the Palette UI.

1. On the left main menu, select **Cluster Templates**.
2. Confirm the cluster template exists and references the profile and policy.

### Deploy Dev and Prod Clusters from the Template

This tutorial provisions two clusters. Use the tabs to select the cloud provider and cluster resource.

<Tabs>

<TabItem label="AWS" value="aws-clusters">

```hcl
resource "spectrocloud_cluster_aws" "dev" {
  name             = "tf-dev"
  cloud_account_id = var.cloud_account_id
  tags             = ["env:dev"]

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }
}

resource "spectrocloud_cluster_aws" "prod" {
  name             = "tf-prod"
  cloud_account_id = var.cloud_account_id
  tags             = ["env:prod"]

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure-clusters">

```hcl
resource "spectrocloud_cluster_azure" "dev" {
  name             = "tf-dev"
  cloud_account_id = var.cloud_account_id
  tags             = ["env:dev"]

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }
}

resource "spectrocloud_cluster_azure" "prod" {
  name             = "tf-prod"
  cloud_account_id = var.cloud_account_id
  tags             = ["env:prod"]

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }
}
```

</TabItem>

</Tabs>

Plan and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 2 to add, 0 to change, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_*.dev: Creation complete
spectrocloud_cluster_*.prod: Creation complete

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

Validate both clusters in the Palette UI.

1. On the left main menu, select **Clusters**.
2. Select `tf-dev` and confirm the status is **Running**.
3. Select `tf-prod` and confirm the status is **Running**.

### Upgrade Clusters Using an Updated Profile Version

This tutorial uses a profile version update to drive the upgrade workflow.

1. Create a new cluster profile version, such as `1.1.0`.
2. Add Kubecost to the new version.

Update the cluster profile resource to the new version and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to change, 0 to add, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_profile.profile: Modifications complete

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

Update the cluster template to reference the updated profile and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to change, 0 to add, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_config_template.template: Modifications complete

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

Trigger an immediate upgrade by setting `upgrade_now` to a new timestamp, and apply.

```bash
terraform plan
```

```bash hideClipboard title="Example Output"
Plan: 1 to change, 0 to add, 0 to destroy.
```

```bash
terraform apply -auto-approve
```

```bash hideClipboard title="Example Output"
spectrocloud_cluster_config_template.template: Modifications complete

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

Validate the upgrade in the Palette UI.

1. On the left main menu, select **Clusters**.
2. Select `tf-dev` and confirm the cluster profile version updated.
3. Confirm the Kubecost layer appears and reports a healthy status.
4. Repeat the same validation for `tf-prod`.

### Cleanup

Destroy Terraform managed resources when you are done.

```bash
terraform destroy --auto-approve
```

```bash hideClipboard title="Example Output"
Destroy complete! Resources: <number> destroyed.
```

Confirm in the Palette UI that the clusters, cluster template, cluster profile, and maintenance policy have been
removed.

## Wrap-Up

In this tutorial, you standardized cluster provisioning and upgrades by creating a cluster profile, maintenance policy,
and cluster template. You then used the cluster template to provision dev and prod clusters and roll out an upgrade that
added Kubecost.

## Next Steps

- Review the cluster template reference documentation in the Spectro Cloud documentation site.
- Explore a staged upgrade workflow that relies on maintenance windows rather than immediate upgrades.
- Expand this workflow to additional environments by adding more clusters that reference the same cluster template.
