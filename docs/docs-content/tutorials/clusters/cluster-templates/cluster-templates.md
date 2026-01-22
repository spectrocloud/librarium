---
sidebar_position: 0
sidebar_label: "Operate a Fleet of Clusters (Cluster Templates)"
title: "Operate a Fleet of Clusters with Cluster Templates"
description:
  "A tutorial that walks you through importing a cluster profile, creating a cluster template, deploying a small fleet,
  performing a safe update, and managing templates with Terraform."
tags: ["cluster templates", "tutorial", "terraform", "profiles"]
---

# Operate a Fleet of Clusters with Cluster Templates

Managing multiple Kubernetes clusters can quickly become complex as your platform grows. To ensure reliability,
security, and rapid feature delivery, you need a way to coordinate updates and configuration across your fleet.

This tutorial introduces you to cluster templates, a Palette feature designed to help you operate and update many
clusters efficiently. You'll learn how to:

1. Import a pre-built cluster profile.
2. Create a cluster template that references the imported profile.
3. Define a maintenance policy for the clusters.
4. Deploy a small fleet of clusters for dev, stage, and prod environments.
5. Safely stage and roll out a fleet-wide update.
6. Manage the cluster template using Terraform.

To make these concepts concrete, we'll follow the journey of Spacetastic Ltd., a fictional company on a mission to bring
astronomy education to the world. As Spacetastic's user base grows, their engineering team faces new challenges scaling
their platform and managing clusters at scale. You'll see how they use cluster templates to streamline operations and
keep their environments consistent.

Cluster templates are supported on **Amazon Web Services (AWS), Azure, Google Cloud Platform (GCP), and VMware**. This
tutorial focuses on **AWS** for clarity, but the same principles apply to other environments.

---

## Prerequisites

- A Palette account with the following permissions in your target project or tenant:
  - permission 1
  - permission 2
  - permission 3
- Access to the provided cluster profile JSON (for import).
- For Terraform:
  - Terraform installed (v1.x recommended)
  - Palette API key exported as `SPECTROCLOUD_APIKEY`

---

## Template-First Fleet Management (UI Workflow)

This section covers the UI-based workflow for **AWS clusters**:

- Importing a profile
- Creating a cluster template
- Deploying clusters from the template
- Staging an update
- Rolling out an update

The same workflow applies to Azure, GCP, and VMware, with only minor differences in infrastructure profiles and
configuration.

### Import the Profile

**Scenario:**

> Spacetastic’s cluster count is growing rapidly. But there's a problem. Manual updates don’t scale. Cluster templates
> provide a single place to coordinate the software stack, governance, and lifecycle management across many clusters.

> As Spacetastic’s engineers, you’re ready to move beyond ad-hoc cluster management. The team has just received a new
> cluster profile from their platform architect, who’s eager to standardize the stack across all environments.

**Import a ready-made profile**

- Download JSON
- Import
- Confirm

✅ The profile is imported and ready to be referenced.

**Inspect the imported profile**

- Open the profile and review:

  - All
  - the
  - different
  - things

> A Spacetastic engineer reviews the imported profile to ensure it includes all the packs the team needs.

✅ You understand what the template will be built on.

**Create the template shell**

- Create template
- Give it a name

> Spacetastic's platform engineer names the template "dev".

✅ The template exists and is ready to be configured.

---

### Define and Apply a Maintenance Policy

**Create a Maintenance Policy**

- Define a new policy (e.g., weekly on Sunday at midnight).

> Spacetastic's cybersecurity lead insists on a maintenance window that minimizes risk.

✅ The template now controls _when_ updates happen.

**Link the Imported Profile**

- In the template, select the specific profile version to link.
- _Note:_ Linking a profile version locks it in. To update, create a new profile version and relink, preventing
  configuration drift.

> The Spacetastic team links the profile, ensuring all clusters in the fleet will run the same, trusted stack.

✅ The fleet references a stable, versioned software stack.

---

### Deploy Clusters and Perform Updates

**Deploy the First Cluster**

- Create a `dev` cluster using the **Cluster Template** setup type.
- Assign required profile variables.

> Spacetastic's platform engineer spins up the first dev cluster, testing the template in a safe environment.

✅ One cluster is running and managed by the template.

**Deploy two more clusters**

- Repeat the process for `stage` and `prod`.
- Use the same template, adjusting variables as needed.

> The Spacetastic team quickly brings up stage and prod clusters, confident that each environment is consistent and
> secure.

✅ A small fleet is running from a single template.

**Stage a Profile Change**

- Create a new version of the cluster profile (e.g., `1.1.0`) with a safe change.
- Save the new version.

> The platform architect prepares a new profile version with updated observability tools, staging it for the next
> maintenance window.

✅ The change is staged without affecting running clusters.

**Update the Template to the New Version**

- Open the template.
- Update the referenced profile version to `1.1.0`.

> An engineer updates the template, scheduling the fleet to receive the improvements.

✅ The fleet is scheduled to move to the new version.

**Resolve Pending Variables**

- Assign values for any variables in **Pending** state.

> An engineer double-checks all variables, ensuring the upgrade will proceed smoothly.

✅ The upgrade gate is open.

**Roll Out the Update**

- Wait for the next maintenance window, or select **Upgrade now** to force the update.

> The Spacetastic team watches as all clusters update together, minimizing downtime and user impact.

✅ All clusters update together under controlled conditions.

**Verify**

- Confirm each cluster’s **Profile** tab shows the new version.

> An engineer verifies that every cluster is running the latest, most secure stack.

✅ The template enforced the intended change.

---

## Managing Cluster Templates with Terraform

This section shows how to manage the same **AWS-based** cluster template declaratively using Terraform. The workflow and
resource model are the same for Azure, GCP, and VMware. Only the infrastructure profiles and cloud-specific values
differ.

### Infrastructure as Code with Palette

With Terraform, you define your desired cluster template state as code. Terraform communicates this intent to Palette,
which enforces configuration and maintenance policies across your fleet.

> The Spacetastic team adopts Terraform to automate their workflows, ensuring every change is tracked and repeatable. No
> more manual drift to worry about.

✅ Terraform automates the same workflows as the UI, but in a repeatable, version-controlled way.

**Provider Configuration**

- Set up your Palette API key.
- Write and review the Terraform provider configuration.

> An Spacetastic engineer configures the provider, connecting Spacetastic’s automation pipeline to Palette.

✅ Terraform can communicate with Palette.

---

### Create and Manage Templates with Terraform

**Create a Cluster Template**

```hcl
# Example Terraform code to create a cluster template
```

> A Spacetastic engineer commits the template definition to Git, making Spacetastic’s fleet management fully auditable.

✅ The template now exists as code.

**Update Profile Versions Safely**

- Create a new profile version in the Palette UI.
- Update the cluster profile version referenced by the template in Terraform.

```hcl
# Example Terraform code to update the profile version
```

> The Spacetastic platform architect's latest improvements are rolled out to the fleet with a single pull request.

✅ The template advances using versioned changes.

**Trigger an Upgrade from Terraform**

```hcl
upgrade_now = ...
```

Setting this value triggers an immediate fleet upgrade.

> Spacetastic's platform engineer triggers an upgrade from the CI pipeline, ensuring all clusters are patched quickly in
> response to a security alert.

✅ You triggered a fleet update from code.

**Validate in the UI**

- Confirm cluster state matches the template.

> A Spacetastic engineer checks the Palette UI to confirm all clusters are healthy and compliant.

✅ Terraform’s intent is visible in Palette.

**Deciding between UI vs Terraform**

| Goal                              |  UI | Terraform |
| --------------------------------- | --: | --------: |
| Explore packs or experiment       |  ✅ |        ❌ |
| Create one-off clusters           |  ✅ |       ❌️ |
| Enforce org-wide templates in Git |  ❌ |        ✅ |
| CI / GitOps updates               |  ❌ |        ✅ |
| Trigger immediate fleet upgrade   |  ✅ |        ✅ |
| Manual verification               |  ✅ |        ❌ |

---

## Cleanup

1. Delete tutorial clusters.
2. Delete the template.
3. Delete the imported cluster profile and all versions.
4. Run `terraform destroy --auto-approve`.

> The Spacetastic team cleans up their test environments, reducing clutter and cloud costs.

✅ Your environment is clean.

---

## Wrap-Up

You imported a reusable cluster profile, created and operated a cluster template with a maintenance policy, deployed and
updated a small fleet on **AWS**, and managed cluster templates using both the Palette UI and Terraform.

Just like Spacetastic, you can now confidently operate and update clusters at scale, keeping your platform reliable and
your users happy.

The same workflows apply to **Azure, GCP, and VMware**, making templates a consistent way to operate cluster fleets
across providers using Palette.
