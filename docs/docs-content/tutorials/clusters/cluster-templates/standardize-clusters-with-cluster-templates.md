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
  contains the software stack and infrastructure configuration.
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
two workflows: [Palette UI on AWS](#provision-and-upgrade-clusters-using-the-palette-ui-for-aws) and
[Terraform on AWS or Azure](#provision-and-upgrade-clusters-using-terraform).

Both workflows use the same core components and follow the same architecture. In the UI workflow, you will import a
provided JSON cluster profile definition into the Palette UI. In the Terraform workflow, you will define and create the
cluster profile as code. In both cases, you create a cluster template, deploy clusters from it, and manage upgrades
through profile version updates.

Choose the workflow that fits your preferred way of working.

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
