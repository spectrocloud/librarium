---
sidebar_label: "Cluster Templates"
title: "Cluster Templates"
description:
  "Learn how Palette uses cluster templates to bring consistency to clusters and manage the cluster lifecycle."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "object-ungroup"
tags: ["cluster templates", "templates", "policies"]
---

:::preview

:::

Cluster templates are reusable blueprints that define and enforce the desired state and lifecycle of clusters deployed
with Palette or [Palette VerteX](../vertex/vertex.md).

Unlike [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md), which define the cluster's software stack
(including OS, Kubernetes distribution, network, storage, and add‑ons), cluster templates are a higher level abstraction
that define the governance stack. They reference existing cluster profiles and operational
[policies](./create-cluster-template-policies/create-cluster-template-policies.md), such as
[maintenance policies](./create-cluster-template-policies/maintenance-policy.md), and leverage
[cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
and [macros](../clusters/cluster-management/macros.md), allowing you to deploy, manage, and scale a synchronized fleet
of clusters with minimal effort while configuring environment-specific values where needed.

Cluster templates can be created at both the tenant and project scope. Cluster templates do not embed cluster profile
and policy configurations but reference them as objects, allowing you to edit and replace them as needed.

Cluster templates can be managed using [Terraform](../automation/terraform/terraform.md),
[Crossplane](../automation/crossplane/crossplane.md), the [Palette Go SDK](../automation/palette-sdk/palette-sdk.md),
and [APIs](/api/introduction).

![Diagram of cluster template architecture](/cluster-templates_diagram.webp)

## Cluster Profile Behavior

Cluster templates link to [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md), which remain the
foundation of deploying clusters in Palette. Each cluster template must link to one
[full](../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
[infrastructure profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) and one
[maintenance policy](./create-cluster-template-policies/maintenance-policy.md). You can reference as many
[add-on profiles](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md) as
desired. Only one policy of each type can be linked per cluster template (for example, one maintenance policy per
template).

Once a cluster profile is linked to a cluster template, that version of the cluster profile becomes immutable.

![Linked cluster profile version locked](/cluster-templates_locked-cluster-profile.webp)

To make changes to a linked cluster profile, you must
[create a new version](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) of the cluster
profile and update the version referenced in the cluster template. This ensures that all clusters using the cluster
template have identical software stacks, preventing configuration drift that can naturally occur with inline, on-the-fly
updates, or by using varied cluster profile versions. Each cluster can be attached to only one cluster template at a
time, further guarding against drift.

A cluster profile version cannot be linked to a cluster template if that profile version is already being used by a
cluster that is not attached to a cluster template.

### Cluster Profile Variables

Since cluster profile versions are immutable once linked to a cluster template,
[cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
remain the recommended way to configure environment-specific values per cluster, such as IPs, resource limits, and more.

Much like deploying clusters with individual cluster profiles, variable values are assigned and propagated when you
deploy a cluster using a cluster template. Once the cluster is deployed, the variables appear on the **Variable values**
tab of your cluster template with an **Assignment** status of **Assigned**.

![Variables with a status of Assigned](/cluster-templates_variables-assigned.webp)

Cluster templates help with the initial propagation of new variable values, but they are not the source of truth for
ongoing variable management across clusters. The source of truth remains the cluster profile, which defines the schema,
and the cluster itself, where values are updated in real time.

To add or remove cluster profile variables, or to modify the existing schema, create a new version of your cluster
profile, make the necessary changes, and update the version attached to the cluster template.

For information on modifying cluster profile variables post-cluster deployment, refer to our
[Modify Cluster Templates](./modify-cluster-templates.md#variable-values-tab) guide.

### Cluster Profile vs. Cluster Template Deployment

You can deploy clusters using cluster profiles or cluster templates, which encapsulate cluster profiles. If you plan on
deploying a large number of clusters that you want to use the same software stack with environment-specific values and
ensure the clusters update together, consider using cluster templates.

The following table compares two common cluster scenarios.

| **Update Type**              | **Cluster Profile Workflow**                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Cluster Template Workflow**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cluster profile**          | - Initiate updates on a per-cluster basis by selecting a new cluster profile version for each cluster or making on-the-fly changes to a cluster. <br / > - Routine, automatic updates are not supported.                                                                                                                                                                                                                                                              | - Update the cluster profile version in the cluster template. All clusters deployed with the template are updated during the next update window specified by the [maintenance policy](./create-cluster-template-policies/maintenance-policy.md) or by manually triggering the update for all clusters. <br /> - Updating the cluster profile version for a single cluster or making on-the-fly changes to a cluster is not supported.                                                                                                                                                                                                                                                                                                       |
| **Cluster profile variable** | - Specify initial values during cluster deployment. <br /> - Edit variable values for _individual clusters_ within cluster settings. Values are updated in real time. <br /> - To add or remove variables, or update the schema, create a new version of the cluster profile, and manually update the version on each cluster. Values are modified and confirmed at this step. <br /> - Batch updates for multiple clusters using the same profile are not supported. | - Specify initial values during cluster deployment. <br /> - Edit variable values for _individual clusters_ within cluster settings. Values are updated in real time. <br /> - To add or remove variables, update a schema, or update a value across _multiple clusters_, create a new version of the cluster profile, and update the version referenced in the cluster template. Next, update the **Variable values** for all applicable clusters. Once all values have a status of **Assigned**, all clusters deployed with the template are updated during the next update window specified by the [maintenance policy](./create-cluster-template-policies/maintenance-policy.md) or by manually triggering the update for all clusters. |

## Policy Behavior

Policies are an integral part of cluster templates. While cluster profiles define the infrastructure and software stack
for your clusters, cluster template policies are modular, reusable definitions that define how the cluster operates as
well as its lifecycle. Policies are linked rather than embedded within cluster templates, allowing you to manage
policies independently; this includes updating and swapping them as needed to create a comprehensive governance stack
for your clusters.

Currently, Palette supports [maintenance policies](./create-cluster-template-policies/maintenance-policy.md). Each
cluster template can be linked only to one policy of each type. For example, while you can create multiple maintenance
policies that you can update or swap as needed, only one can be attached to the cluster template at any time. However,
the same policy can be attached to multiple cluster templates.

For more information, refer to our
[Create and Manage Cluster Template Policies](./create-cluster-template-policies/create-cluster-template-policies.md)
guide.

## Limitations

- Cluster templates can be used to deploy new clusters only. Certain Day-2 operations, such as attaching a cluster
  template to an existing cluster and detaching clusters from cluster templates, are not supported at this time.

- Rollbacks are not supported at this time.

## Next Steps

Before you can use cluster templates to deploy clusters, you must first create a cluster template. To create a cluster
template, you must have the following resources created in Palette:

- A [full](../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or
  [infrastructure cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md).
  Refer to our [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md) guide for a general overview of
  cluster profiles.

- A cluster template [maintenance policy](./create-cluster-template-policies/maintenance-policy.md). Refer to our
  [Cluster Template Policies](./create-cluster-template-policies/create-cluster-template-policies.md) guide for a
  general overview of cluster template policies.

Once you have the following resources, refer to our [Create Cluster Templates](./create-cluster-templates.md) guide to
learn how to create a cluster template and deploy clusters using cluster templates.
