---
sidebar_label: "Automatic Cluster Role Bindings"
title: "Automatic Cluster Role Bindings"
description: "Learn about Palette's Automatic Cluster Role Bindings platform setting."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---

Palette provides Automatic Cluster Role Bindings as a way to automatically add appropriate cluster role bindings. When Automatic Cluster Role Bindings is enabled, newly created clusters that have Palette IDP enabled will have RBAC bindings set. This feature is set at the Tenant level but enables role binding at both Tenant and Project levels. The binding applied will be equivalent to the Kubernetes cluster role of `cluster-admin`, `cluster-edit`, or `cluster-view`. This will be based on the Palette user roles assigned. For more information about user roles, refer to [Roles and Permissions](../../../user-management/palette-rbac/palette-rbac.md). 

The automatic role binding cannot be edited as this is created by the Palette system.

Turning off this feature will disable automatic role binding. 

:::info

If clusters exist before enabling Automatic Cluster Role Binding, they will get the role bindings as part of a system scheduler job that runs every 15 minutes. The scheduler also will update RBACs if user permissions have changed, a new user is added, or a user is removed.

:::

## Prerequisites

- Tenant admin access to Palette.

- An existing profile with Palette eXtended Kubernetes with Palette set as the OIDC Identity Provider. For steps on creating a cluster profile, refer to [Cluster Profile](../../../profiles/cluster-profiles/cluster-profiles.md) to get started.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant administrator.

2. From the left **Main Menu**, select **Platform Settings**.

3. Toggle the **Automatic Cluster Role Binding** button.

4. A pop-up box will ask you to confirm the action. Click **OK**.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Project Settings**.

3. Select **Platform Settings**.

4. The **Cluster Auto Remediation** toggle button is checked.

5. Deploy a cluster with Palette IDP enabled and no RBAC cluster bindings set.

6. Navigate to the left **Main Menu**, select **Audit Logs**.

7. Set the filter **Log Type** to **Update** and **Resource Type** to **Cluster**. 

![A view of the audit logs showing automatic binding applying to clusters](/clusters_management-platform_settings-autorbac_binding_audit_logs.webp)