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

Use this workflow if you prefer to manage cluster templates, cluster profiles, and clusters as code.

This workflow mirrors the Palette UI workflow. You will:

* Create a cluster profile that defines a cluster profile variable
* Reference that variable in an add-on pack
* Deploy two clusters from the same cluster template
* Assign different variable values to each cluster

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

variable "cloud_account_id" {
  description = "Cloud account ID registered in Palette"
  type        = string
}
```

Create `terraform.tfvars`.

```hcl
palette_project = "Default"
cloud_account_id = "REPLACE_ME"
```

Initialize Terraform.

```bash
terraform init
```

```bash hideClipboard title="Example Output"
Terraform has been successfully initialized!
```

### Create a Cluster Profile

In this step, you create a cluster profile that includes a cluster profile variable named `hello_replicas`. This variable
controls the replica count of the `hello-universe` add-on.

```hcl
resource "spectrocloud_cluster_profile" "profile" {
  name        = "tf-cluster-template-profile"
  description = "Cluster profile with profile variables"
  cloud       = "aws"
  type        = "cluster"
  version     = "1.0.0"

  pack {
    name    = "ubuntu-aws"
    tag     = "22.04"
    uid     = "ubuntu-aws"
    layer   = "os"
  }

  pack {
    name    = "kubernetes"
    tag     = "1.32.3"
    uid     = "kubernetes"
    layer   = "k8s"
  }

  pack {
    name    = "cni-calico"
    tag     = "3.29.3"
    uid     = "cni-calico"
    layer   = "cni"
  }

  pack {
    name    = "csi-aws-ebs"
    tag     = "1.41.0"
    uid     = "csi-aws-ebs"
    layer   = "csi"
  }

  pack {
    name    = "hello-universe"
    tag     = "1.2.0"
    uid     = "hello-universe"
    layer   = "addon"

    values = <<-EOT
pack:
  content:
    images:
      - image: ghcr.io/spectrocloud/hello-universe:1.2.0

manifests:
  hello-universe:
    apiEnabled: false
    namespace: hello-universe
    port: 8080
    replicas: '{{ .spectro.var.hello_replicas }}'
EOT
  }

  profile_variables {
    variable {
      name          = "hello_replicas"
      display_name  = "Hello Universe Replicas"
      description   = "Number of replicas for the hello-universe workload"
      format        = "number"
      default_value = 1
      required      = true
    }
  }
}
```

Plan and apply.

```bash
terraform plan
terraform apply -auto-approve
```

Validate in the Palette UI:

1. Navigate to **Profiles**
2. Select `tf-cluster-template-profile`
3. Confirm the **Variables** tab lists `hello_replicas`

Validate the cluster profile in the Palette UI.

1. On the left main menu, select **Profiles**.
2. Confirm the Terraform created profile exists.

### Create a Maintenance Policy

```hcl
resource "spectrocloud_cluster_config_policy" "maintenance" {
  name    = "tf-weekly-maintenance"
  context = "project"

  schedules {
    name         = "weekly-window"
    start_cron   = "0 2 * * SUN"
    duration_hrs = 4
  }
}
```

Apply the changes.

```bash
terraform apply -auto-approve
```

---

### Create a Cluster Template

```hcl
resource "spectrocloud_cluster_config_template" "template" {
  name       = "tf-cluster-template"
  cloud_type = "aws"
  context    = "project"

  cluster_profile {
    id = spectrocloud_cluster_profile.profile.id
  }

  policy {
    id   = spectrocloud_cluster_config_policy.maintenance.id
    kind = "maintenance"
  }
}
```

Apply the changes.

```bash
terraform apply -auto-approve
```

Validate in the Palette UI:

* The template references the cluster profile and maintenance policy

---

### Deploy Dev and Prod Clusters with Different Variable Values

Use the same cluster template, but assign different values to the `hello_replicas` variable.

```hcl
resource "spectrocloud_cluster_aws" "dev" {
  name             = "tf-dev"
  cloud_account_id = var.cloud_account_id

  cluster_template {
    id = spectrocloud_cluster_config_template.template.id
  }

  cluster_profile {
    variable {
      name  = "hello_replicas"
      value = 1
    }
  }
}

resource "spectrocloud_cluster_aws" "prod" {
  name             = "tf-prod"
  cloud_account_id = var.cloud_account_id

  cluster_template {
    id = spectrocloud_cluster_config_template.template.id
  }

  cluster_profile {
    variable {
      name  = "hello_replicas"
      value = 2
    }
  }
}
```

Apply the changes.

```bash
terraform plan
terraform apply -auto-approve
```

---

### Validate the Deployments

In the Palette UI:

1. Navigate to **Clusters**
2. Select `tf-dev`
3. Confirm the `hello-universe` workload has **1 replica**
4. Select `tf-prod`
5. Confirm the `hello-universe` workload has **2 replicas**

This confirms that the same cluster profile and template were reused, while the cluster profile variable allowed
environment-specific behavior.

---

### Cleanup

Destroy all Terraform-managed resources.

```bash
terraform destroy --auto-approve
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
