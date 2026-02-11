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

Cluster templates are built from two related concepts:

- [Cluster profiles](../../../../../profiles/cluster-profiles/create-cluster-profiles/), which define the software stack
  and infrastructure configuration of a cluster.
- [Cluster template policies](../../../cluster-templates/create-cluster-template-policies/create-cluster-template-policies.md),
  which define how clusters created from a template are managed and maintained throughout their lifecycle, such as when
  upgrades are allowed to run.

A [maintenance policy](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md) is one type of
cluster template policy. Maintenance policies define a maintenance window that controls when upgrades can run.
Currently, maintenance policies are the only cluster template policy type available in Palette.

Cluster templates link cluster profiles and policies. When you create clusters from the same template, those clusters
share the same base configuration and follow the same operational rules.

In this tutorial, you will:

- Create a cluster profile, a cluster template policy, and a cluster template that uses them together
- Deploy two clusters (**dev** and **prod**) from the same template
- Use
  [cluster profile variables](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/)
  to apply environment-specific settings
- Update the template and upgrade both clusters

Cluster templates can be used across all supported public clouds and data centers in Palette. This tutorial demonstrates
two workflows: [Palette UI on AWS](#provision-and-upgrade-clusters-using-the-palette-ui-for-aws) and
[Terraform on AWS or Azure](#provision-and-upgrade-clusters-using-terraform). Choose the workflow that fits your
preferred way of working.

## Prerequisites

- A Palette account with permissions to create cluster profiles, cluster template policies, cluster templates, and
  clusters.
- A cloud account registered in Palette. Refer to [AWS](../../../clusters/public-cloud/aws/add-aws-accounts.md) for the
  Palette UI workflow, or [AWS](../../../tutorials/getting-started/palette/aws/deploy-manage-k8s-cluster-tf.md),
  [Azure](../../../tutorials/getting-started/palette/azure/deploy-manage-k8s-cluster-tf.md),
  [GCP](../../../tutorials/getting-started/palette/gcp/deploy-manage-k8s-cluster-tf.md), or
  [VMware](../../../tutorials/getting-started/palette/vmware/deploy-manage-k8s-cluster-tf.md) for the Terraform
  workflow.
- Ensure that the
  [Palette Community Registry](../../../registries-and-packs/registries/registries.md#default-registries) is available
  in your Palette environment.
- Terraform version 1.x installed.
- A [Palette API key](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) set as an environment
  variable.

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
