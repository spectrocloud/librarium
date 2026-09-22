---
sidebar_label: "Attach a Cluster to a Cluster Template"
title: "Attach an Existing Cluster to a Cluster Template"
description:
  "Learn how to attach a running Palette-provisioned cluster to a cluster template so it comes under template
  governance."
hide_table_of_contents: false
sidebar_position: 15
tags: ["cluster templates"]
---

<!--
  Author notes — remove before merge.

  Sources: Jira PEM-11993 (Doc-task) and its parent Epic PEM-10589. The epic marks several
  details "ambiguous - needs confirmation":

    - Eligibility rules for the running cluster (profile compatibility with the template,
      required cluster state, whether imported clusters are excluded).
    - The specific permission slug that gates attachment.
    - The UI walkthrough — a 3-minute recording is attached to PEM-10589 but is not readable
      from this drafting environment; the numbered steps below are placeholders.
    - The profile-mismatch review UX (screenshots referenced on PEM-10589).

  Confirmed from PEM-10589 comments (Romain Decker, PM):

    - The template's profile swap happens during the next maintenance window, not at attach
      time.
    - Between attach and swap: source cluster profile edits allowed, cluster profile and
      variable edits blocked, machine pool changes allowed. This aligns with existing
      template-governed cluster behavior.

  Paired ticket: the Terraform provider equivalent is tracked against PLT-2410. Keep the two
  descriptions consistent when the Terraform docs land.
-->

You can bring a running, Palette-provisioned cluster under a [cluster template](./cluster-templates.md) after the
cluster is deployed by attaching it to the template. Once attached, the template governs the cluster's future upgrades
and policy enforcement in the same way as clusters originally deployed from the template.

## How Attachment Works

The template's cluster profile replaces the cluster's current profile during the next upgrade window defined by the
[maintenance policy](./create-cluster-template-policies/maintenance-policy.md) linked to the template. The swap does not
happen at attach time. Until it runs, the cluster continues to operate with its original profile.

While the cluster is attached and waiting for or undergoing reconciliation, the following restrictions apply, matching
the behavior of clusters originally deployed from the template:

- You cannot edit the cluster profiles or variable values on the cluster.

- You can continue to create, update, and delete machine pools on the cluster.

## Prerequisites

- A [cluster template](./create-cluster-templates.md).

- A running cluster that was originally deployed with Palette.
  <!-- Confirm eligibility rules: profile compatibility with the template, required cluster state, and whether imported clusters are excluded. -->

- The permission to attach a cluster to a cluster template. Refer to
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#project).
  <!-- Confirm the exact permission slug. -->

## Attach the Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, then select the cluster you want to attach.

3. Select the **Profile** tab.

4. From the top right of the page, select **Settings** > **Attach to Cluster Template**.

5. Choose the cluster template and select **Confirm Selection**

6. Review any differences between the cluster's current configuration and the template. You must review all differences
   before proceeding.

7. Select **Attach to Template**.
   <!-- Confirm what the review step shows and what actions it offers when the running cluster's profile does not match the template's profile. -->

By default, the profile swap runs at the next upgrade window defined by the linked
[maintenance policy](./create-cluster-template-policies/maintenance-policy.md). To trigger it immediately instead, use
**Actions > Upgrade now** on the template's **Overview** tab. Refer to
[Modify Cluster Templates](./modify-cluster-templates.md#overview-tab) for details.

## Next Steps

- To change the template that governs the cluster, refer to [Modify Cluster Templates](./modify-cluster-templates.md).

- To adjust when the profile swap runs, refer to
  [Maintenance Policies](./create-cluster-template-policies/maintenance-policy.md).
