---
sidebar_label: "Cluster Templates"
title: "Cluster Templates"
description:
  "Learn how Palette uses cluster templates to standardize and scale Kubernetes cluster lifecycle management."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "object-ungroup"
tags: ["cluster templates", "templates", "policies"]
---

:::preview

:::

Cluster templates are reusable blueprints that define and enforce the desired state and lifecycle of clusters deployed
with Palette or Palette VerteX. Unlike cluster profiles, which are infrastructure- and application-focused and define
the cluster's software stack (OS, Kubernetes distribution, network, storage, and add‑ons), cluster templates are a
higher level abstraction that focus on cluster operations and its lifecycle, creating a governance stack. They reference
existing cluster profiles and operational policies, such as maintenance policies, and leverage cluster profile
variables, allowing you to deploy and govern a fleet of clusters consistently while also offering the flexibility needed
to configure environment-specific values.

Cluster templates can be created at both the tenant and project level. Cluster templates do not embed cluster profile
and policy configurations into them but reference them as objects. Each cluster template must link to both of following:

- One full or infrastructure profile.
- One maintenance policy.

You can reference as many add-on profiles as desired. Only one policy of each type can be linked per cluster template
(for example, one maintenance policy).

Once a cluster profile is linked to a cluster template, that version of the cluster profile becomes immutable and
read-only. To make changes to a linked cluster profile, you must create a new version of the cluster profile and update
the version referenced in the cluster template. This ensures that all clusters using the cluster template have identical
software stacks and prevents configuration drift that can naturally occur with inline, on-the-fly updates or using a
variety of cluster profile versions.

Although cluster profile versions are immutable once linked to a cluster template, profile variables allow you to
templatize your cluster profile and configure environment-specific values per cluster, such as IPs, resource limits, and
more. Cluster-specific values are defined when deploying or updating a cluster. Variable values assigned from the
template are propagated to clusters during their next maintenance window.

Each cluster can only be attached to one cluster template, further guarding against drift.

## Cluster Profile vs. Cluster Template Deployment

You can deploy clusters using cluster profiles or cluster templates, which encapsulate cluster profiles.

| Operation                 | Cluster Profile Workflow                                               | Cluster Template Workflow                                                                                       |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Batch cluster updates     | :x: - Initiate updates on a per-cluster basis by selecting **Update**. | :white_check_mark: - All clusters are updated during the specified maintenance window in the maintenance policy |
| Cluster profile variables | :white_check_mark:                                                     | :white_check_mark:                                                                                              |

| Aspect            | Cluster Profile                        | Cluster Template                      |
| ----------------- | -------------------------------------- | ------------------------------------- |
| Primary Purpose   | Define software stack                  | Govern cluster lifecycle              |
| Contains          | Layers (packs, Helm charts, manifests) | References to profiles + policies     |
| Answers           | "What software runs on this cluster?"  | "How should this cluster be managed?" |
| Scope             | Technical configuration                | Operational governance                |
| Lifecycle Focus   | Day 0 (what to install)                | Day 1 + Day 2 (how to manage)         |
| Scaling Model     | 1:Many (profile → clusters)            | 1:Many (template → clusters)          |
| Change Management | Version-based                          | Policy-driven                         |
| User Persona      | Platform engineer                      | Platform administrator                |

Cluster profile stack example

```shell
Cluster Profile "hello-universe":
├── Ubuntu 22.04 (OS layer)
├── Kubernetes 1.28.x (platform layer)
├── Calico 3.26.x (networking layer)
├── AWS EBS CSI (storage layer)
├── Hello Universe 6.4.3 (application layer)
└── Variables: [db_password, admin_email, replica_count]
```

Cluster template example

```shell
Cluster Template "hello-universe-template":
├── References:
│   ├── Cluster Profile: "hello-universe"
│   └── Maintenance Policy: "weekend-updates"
└── Metadata:
    ├── Name: "Production Web Template"
    ├── Description: "Standard web app deployment"
    └── Tags: [production, web, lamp]

```

## Prerequisites

- X permissions (What Palette permissions are needed to create, edit, attach, and delete templates and policies? This is
  separate from general cluster access.)

- X feature flag enabled from the system console

## Limitations

- Cluster templates can only be used when deploying a cluster from Palette. Certain Day-2 operations, such as attaching
  a cluster template to an existing cluster, are not supported at this time.
- Rollbacks of upgrades are not supported.

## Next Steps

Before you can create a cluster template, you must create an infrastructure or full cluster profile, along with a
maintenance policy. Refer to X for more information.

---

Cluster Templates are reusable blueprints that define the desired state and lifecycle of a Kubernetes cluster in
Palette. They reference existing Cluster Profiles and operational policies (for example, maintenance/upgrade policies)
to provide consistent, governed cluster deployments at scale—across clouds, data centers, and edge.

At a glance:

- Standardize: Apply the same software stack and operational behaviors to many clusters.
- Govern: Enforce policy-driven operations (for example, when upgrades happen) with auditability.
- Scale: Manage hundreds or thousands of clusters with repeatable, low‑touch workflows.

## How Cluster Templates relate to Cluster Profiles

Cluster Profiles remain the foundation that define your cluster software stack (OS, Kubernetes, CNI, storage, add‑ons).
Cluster Templates sit one level above and reference those profile versions to add lifecycle governance via policies.

Key points:

- Templates do not embed configuration; they reference objects:
  - One full or infrastructure profile, plus zero or more add‑on profiles.
  - At most one policy per policy type (for example, one maintenance/upgrade policy).
- Once a profile version is linked in a template, that version becomes immutable. To change it, create a new profile
  version and update the template to point to the new version.
- A single cluster can only be attached to one template at a time.

See also: Cluster Profiles overview and Cluster Profile Variables.

## Policies: maintenance (upgrade) and more

Policies are modular, reusable definitions of cluster behavior. Phase 1 introduces the maintenance/upgrade policy, which
governs when and how upgrades are executed:

- Maintenance windows (per cluster local time) determine when upgrades run.
- Policy applies as clusters detect a new profile version via the template.
- The system prevents inconsistent states: if some clusters have upgraded to version N+1 but others have not, further
  template updates are blocked until all clusters complete the prior upgrade, or an operator intervenes (for example,
  "Upgrade now").

Future phases may add additional policy types (for example, proxy, registry, RBAC, backups, certificates).

## Day 1 and Day 2 behavior

- Day 1 (initial creation): With the Tech Preview, clusters can be created from a template during the cluster creation
  flow. The wizard auto‑selects linked profiles and policies, and prompts for any required profile variables.
- Day 2 (ongoing lifecycle): In the Tech Preview, Day 2 operations are intentionally limited. Profile changes are
  performed by creating a new profile version and updating the template reference; upgrades are executed according to
  the maintenance policy. Additional Day 2 capabilities (attach/detach existing clusters, bulk actions, canary rollouts,
  and more) are planned for later phases.

## Cluster Profile Variables: ownership and propagation

Template‑linked profile versions are immutable, so variable management is essential:

- Variable values assigned from the template are propagated to clusters during their next maintenance window (when the
  upgrade runs).
- Cluster‑level overrides remain the source of truth for that cluster and are not overwritten by template updates.
- If a new profile version introduces new or changed variables, clusters missing required values enter a "pending
  variable assignment" state and will not upgrade until values are provided.
- Cluster Templates facilitate variable propagation but are not a permanent variable management surface; the source of
  truth remains the profile and the cluster itself.

## Limitations (Tech Preview)

- Day 2 template operations (for example, attaching existing clusters) are not supported.
- Greenfield workflow only: select a template during cluster creation.
- One template per cluster; one policy per policy type in a template.
- Profile versions linked in a template are read‑only; change by creating a new version and updating the template.
- Rollbacks of upgrades, variable, or template changes are out of scope.
- Feature is opt‑in behind a system‑level feature flag.

## Prerequisites and scope

- Permissions: Creating, editing, attaching, and deleting templates and policies requires specific RBAC permissions
  separate from general cluster access (see your Palette administrator for roles and scopes at tenant and project
  levels).
- Scope: Templates can be created at both tenant and project levels. Each template and policy has a unique UID.

## Typical workflow (Tech Preview)

1. Create a maintenance/upgrade policy that defines when upgrades should run for clusters.
2. Create a Cluster Template that references:
   - One full or infrastructure Cluster Profile (plus optional add‑on profiles)
   - One maintenance/upgrade policy
3. Create a cluster from the template. Provide required profile variable values during the wizard.
4. To evolve the stack later, create a new profile version and update the template to point to it. The policy will
   orchestrate upgrades during the next maintenance windows.

## FAQs

- Can I attach an existing cluster to a template?
  - Not in the Tech Preview. This is planned for a later phase (individual and bulk attachment).
- Do template maintenance windows use UTC or local time?
  - Upgrades follow the cluster's local time for maintenance windows.

---

## DRAFTING

We will likely need a tabbed flow on each cluster deployment page as well that discusses how to do it with a cluster
template. The main change is that we have a new page: one before you select your cluster profile that asks if you want
to use a profile or you want to use a template. From there, you select your template instead of a profile. Not sure
where the flow diverges from that point onward... But this will affect a LOT of pages. Should probably have a mention on
one of the first cluster template pages how this changes typical deployment. UPDATE: There are literally only two steps
that differ: They choose between a cluster profiles or templates, and on the cluster profile overview, where they can
usually select a cluster profile version, add/remove profiles, and override configurations, everything is locked/grayed
out. So we can probably get away with a tab for the cluster profile overview tab based on whether you choose to use
profiles or templates. PHEW.

Will need to add whatever the final definition is to our glossary

Will likely need to update the cluster profile variables page as well to explain a bit about how they interact with
cluster templates (or, at least, point them to the cluster template page).

When you deploy a cluster from a cluster template, the cluster's **Profile** tab will be locked/read-only. There will
also be a new **Cluster Templates** tab. You can detach a cluster template from the cluster here (though I can't say I
know what that does... Does it keep the cluster in its current state and with the applicable cluster profile? What
happens to the policies? Are they just removed all together?)

Each cluster template has a UID, as does each policy.

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

Cluster Templates is the official term. UI, which is currently cluster definitions, will be changed soon.

## Limitations

- Day-2 cluster template operations are not supported at this time.

- Greenfield clusters only. Template is selected during cluster creation. This workflow is still being developed.

- Once a cluster profile is linked to a cluster template, the cluster profile cannot be modified.

  - You must create a new version to make changes, and then you must update the cluster template to reference the new
    version. (Would updating the version of a cluster profile attached to a cluster template be considered a day-2 op?)
    If a cluster has a cluster template applied, inline changes cannot be made to the cluster/cluster profile AND
    additional profiles cannot be added; likewise, profiles cannot be removed. This prevents drift.

    - A cluster template can only link to unused profile versions. That means that if a profile version is currently in
      use by clusters that are NOT part of a template cannot be linked. However, another cluster template can link to a
      profile version that is already linked to a cluster template.

---

## CURRENT QUESTIONS

- What Palette permissions are needed to create, edit, attach, and delete templates and policies? (This is separate from
  general cluster access.)

- How does detachment work? Is it allowed for phase 1?

- What is the official name of the feature flag?

- We say that maintenance policies and upgrades are triggered based on local time, but the tooltip while creating a
  maintenance policy specifies UTC?
