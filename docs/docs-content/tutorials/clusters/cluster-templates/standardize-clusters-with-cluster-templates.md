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

When you manage many Kubernetes clusters, configuring and upgrading them one by one does not scale. You need a way to
apply the same configuration and upgrade rules across multiple clusters.

In this tutorial, you will use **cluster templates** in Palette to create and manage clusters in a consistent way.
Cluster templates let you reuse a cluster configuration, control when upgrades happen, and apply changes to multiple
clusters at once.

Cluster templates use two building blocks:

- **Cluster profiles**, which define the software and infrastructure configuration of a cluster.
- **Cluster template policies**, which control how clusters created from a template are operated, such as when upgrades
  can run.

A **maintenance policy** is one type of cluster template policy. Currently, maintenance policies are the only cluster
template policy type available in Palette. When additional policy types are added, you will use the same workflow:
create the policy, then link it to the cluster template.

In this tutorial, you create two clusters named **dev** and **prod**. Both clusters are created from the same cluster
template, but use different
[cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/).
This shows how you can reuse a single template while applying environment-specific settings per cluster.

## What You Will Build

In this tutorial, you will:

- Create a cluster profile
- Create a cluster template policy
- Create a cluster template that uses the profile and policy
- Deploy two clusters (**dev** and **prod**) from the same template
- Set different profile variable values for each cluster
- Update the template and upgrade both clusters together

## Choose Your Workflow

You can complete this tutorial using [Palette's UI on AWS](#provision-and-upgrade-clusters-using-the-palette-ui-for-aws)
or [Terraform on AWS or Azure](#provision-and-upgrade-clusters-using-terraform) workflows. Choose the workflow that
matches how you manage your infrastructure.

:::warning

This tutorial creates cloud resources. You will incur cloud costs until you complete the cleanup steps at the end of the
tutorial.

:::

## Prerequisites

Before you begin, make sure you have:

- A Palette account with permission to:
  - Create cluster profiles
  - Create cluster template policies
  - Create cluster templates
  - Create clusters
  - Access the [Palette Community Registry](../../../registries-and-packs/registries/registries.md#default-registries)
- A cloud account registered in Palette:
  - [AWS](../../../clusters/public-cloud/aws/add-aws-accounts.md) for the Palette UI workflow
  - [AWS](../../../clusters/public-cloud/aws/add-aws-accounts.md) or
    [Azure](../../../clusters/public-cloud/azure/azure-cloud.md) for the Terraform workflow
- Basic knowledge of [cluster profiles](../../../../../profiles/cluster-profiles/create-cluster-profiles/) and
  [cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)

If you plan to use Terraform, you also need:

- Terraform version 1.x installed
- A [Palette API key](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) set as an environment
  variable

```bash
export SPECTROCLOUD_APIKEY=<your-api-key>
```

## Provision and Upgrade Clusters Using the Palette UI for AWS

### Import a Cluster Profile

### Create a Cluster Template Policy (Maintenance)

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

### Configure the Terraform Provider

### Create a Cluster Profile

### Create a Cluster Template Policy (Maintenance)

### Create a Cluster Template

### Deploy Dev and Prod Clusters with Different Variable Values

### Validate the Deployments

### Create a New Cluster Profile Version

### Update the Cluster Template to the New Profile Version

### Upgrade Clusters

### Validate the Upgrades

### Cleanup
