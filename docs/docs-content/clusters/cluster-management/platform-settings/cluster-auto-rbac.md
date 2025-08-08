---
sidebar_label: "Automatic Cluster Role Bindings"
title: "Automatic Cluster Role Bindings"
description: "Learn about Palette's Automatic Cluster Role Bindings platform setting."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---

Palette uses Automatic Cluster Role Bindings as a way to automatically apply appropriate cluster role bindings to new clusters. When Automatic Cluster Role Bindings is enabled, any newly created clusters with Palette Identity Provider (IDP) enabled will automatically receive Role-Based Access Control (RBAC) bindings. This feature is disabled by default and activated at the tenant level. When configured, cluster role bindings are automatically applied to all clusters created at the tenant and project levels.

Automatic Cluster Role Bindings correspond to the standard Kubernetes cluster roles `cluster-admin`, `cluster-edit`, and `cluster-view` and are assigned based on the user's roles in Palette. For more information about user roles, refer to [Roles and Permissions](../../../user-management/palette-rbac/palette-rbac.md). 

The automatic role binding cannot be edited as this is created by the Palette system.

Turning off this feature will disable automatic role binding. 

:::info

Any clusters that exist prior to enabling **Automatic Cluster Role Bindings** will receive the applicable role bindings as part of a system scheduler job that runs every 15 minutes. The scheduler also will update RBACs if user permissions have changed, a new user is added, or a user is removed.

:::

## Prerequisites

- Tenant admin access to Palette.

- An existing cluster profile with Palette eXtended Kubernetes with Palette set as the OIDC Identity Provider. For steps on creating a cluster profile, refer to our [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, below **Platform**, select **Platform Settings**. 

4. Toggle the **Automatic Cluster Role Bindings** button.

5. A pop-up box prompts you to confirm the action. Click **OK**.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, below **Platform**, select **Platform Settings**. 

4. Ensure the **Automatic Cluster Role Bindings** toggle is set to active.

5. Deploy a cluster with Palette IDP enabled and no RBAC cluster bindings set.

6. From the left main menu, select **Audit Logs**.

7. Set the filter **Log Type** to **Update** and **Resource Type** to **Cluster**. 

![A view of the audit logs showing automatic binding applying to clusters](/clusters_management-platform_settings-autorbac_binding_audit_logs.webp)