---
sidebar_label: "Cluster Templates"
title: "Cluster Templates"
description: "Learn how Palette uses cluster templates to provide consistency and flexibility across Kubernetes
  clusters." # UPDATE
hide_table_of_contents: false
sidebar_custom_props:
  icon: "object-ungroup"
tags: ["cluster templates"]
---

A cluster template is a "wrapper" that encapsulates a cluster profile and cluster management/operational policies to
make the configurations applied to clusters consistent. These templates define not just the software stack, but also the
entire desired state and lifecyle of a cluster.

Cluster Templates introduce a higher-level abstraction — acting as the structural and operational blueprint for
clusters. They define not just the software stack, but the full desired state and lifecycle of a cluster, including
linked profiles and operational policies.

A cluster template is an abstracted, reusable object designed to be attached to multiple clusters — providing a
repeatable way to deploy and govern a fleet consistently. It acts as a blueprint for repeatable deployments and
consistent Day 2 operations

<!-- Will need to add whatever the final definition is to our glossary -->

Each cluster template has a UID, as does each policy.

Each cluster can only be attached to one cluster template.

Cluster templates can be created at both the tenant and project level.

Cluster templates, beyond their metadata, do not store any configurations, like cluster profiles or policies. Such
components are linked to the template rather than embedded.

One infrastructure profile/full profile per cluster template. As many add-ons as desired. Together this makes the
profile policy.

Policies are modular, reusable objects that define specific aspects of cluster behavior.

- Need to really understand how this works with cluster profile variables. Seems complicated, and refers to ownership?
  The big idea is that since cluster profile versions are immutable once they are linked to a cluster template, you will
  need to heavily lean on cluster profile variables and macros to personalize your cluster.

  - "Cluster templates may help with initial propagation of new variable values, but they do not become the source of
    truth for ongoing variable management across clusters." The source of truth remains the cluster profile.

  - Since a cluster profile version becomes immutable once it is linked to a template, it is essential for Palette users
    to use cluster profile variables and macros to manage configuration — whether at the individual cluster level or
    across groups of clusters.

    - When variables are defined in a cluster profile, they are not defined until a CLUSTER is attached to the cluster
      profile (aka, during cluster deployment). This means you can attach a cluster profile to a template but you will
      not provide the values until the cluster is deployed with the template.

"Cluster templates and policies do not control or interact directly with resources inside a cluster’s runtime
environment (e.g., workloads, services)." - Get clarification on what this means.

Feature is it opt-in at launch and is behind a feature flag.

Cluster Templates is the official term. UI, which is currently cluster definitions, will be changed soon.

Maintenance policy = upgrade policy. Maintenance is the official term.

:::preview

:::

## Limitations

- Day-2 cluster template operations are not supported at this time.

- Greenfield clusters only (not imported). Template is selected during cluster creation. This workflow is still being
  developed.

- One policy type per cluster

- Once a cluster profile is linked to a cluster template, the cluster profile cannot be modified.

  - You must create a new version to make changes, and then you must update the cluster template to reference the new
    version. (Would updating the version of a cluster profile attached to a cluster template be considered a day-2 op?)
    If a cluster has a cluster template applied, inline changes cannot be made to the cluster/cluster profile AND
    additional profiles cannot be added; likewise, profiles cannot be removed. This prevents drift.

    - A cluster template can only link to unused profile versions. That means that if a profile version is currently in
      use by clusters that are NOT part of a template cannot be linked. However, another cluster template can link to a
      profile version that is already linked to a cluster template.

- Rollbacks of upgrades, variable, or template changes are out of scope.

## Prerequisites

- What Palette permissions are needed to create, edit, attach, and delete templates and policies? This is separate from
  general cluster access.

---

Policies currently supported:

- Profile (should this be considered a policy?)
- Maintenance/Upgrade? - MANDATORY. Schedule pertains to the local time of the cluster, not UTC.

Policies TBD?

- Proxy
- RBAC
- Certificate
- Secret
- Node
- Upgrade (for things like approving upgrades, because upgrading a cluster profile (whether the existing version or
  creating a new version), and then either updating the version on each cluster OR clicking upgrade on each cluster does
  not scale well). Maintenance policy = Update policy?
- Registry

Policies can only be deleted when they are not referenced in any cluster template.

Policies can be updated regardless of whether they are currently part of a cluster template.

We will likely need a TP banner of sorts on all of our deploy cluster pages that mention deploying a cluster with a
cluster template. This should absolutely be a partial.

EVENTUALLY, once the feature is GA, we will probably want a tutorial. Cluster templates are also compatible with other
automation, such as TF, crossplane, APIs, and SDK. So a Terraform tutorial will likely need to be forthcoming.

---

## CURRENT QUESTIONS

- What Palette permissions are needed to create, edit, attach, and delete templates and policies? (This is separate from
  general cluster access.)

- How does detachment work? Is it allowed for phase 1?

- What is the official name of the feature flag?
