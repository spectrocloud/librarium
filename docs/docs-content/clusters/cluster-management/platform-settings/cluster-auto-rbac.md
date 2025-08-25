---
sidebar_label: "Automatic Cluster Role Bindings"
title: "Automatic Cluster Role Bindings"
description: "Learn about Palette's Automatic Cluster Role Bindings platform setting."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---

**Automatic Cluster Role Bindings** is a feature in Palette that automatically applies the appropriate Kubernetes
cluster role bindings to clusters based on user roles. This ensures that Role-Based Access Control (RBAC) permissions
are consistently applied without requiring manual configuration.

When **Automatic Cluster Role Bindings** is enabled, any clusters created with Palette Identity Provider (IDP)
integration will automatically receive the correct RBAC bindings. These are applied based on the user's role in Palette
and correspond to the standard Kubernetes cluster roles `cluster-admin`, `cluster-edit`, and `cluster-view`.

**Automatic Cluster Role Bindings** is disabled by default and can be enabled at the tenant level. Once enabled, cluster
role bindings are automatically applied to all newly created clusters, whether they are provisioned at the tenant or
project level. Clusters created before enabling **Automatic Cluster Role Bindings** are updated via a system scheduler
job that runs every 15 minutes. The scheduler also will update RBAC bindings if user permissions are changed, a new user is
added, or a user is removed.

For more information about user roles, refer to
[Roles and Permissions](../../../user-management/palette-rbac/palette-rbac.md). For more information about using Palette
as an IDP, refer to [SAML and OIDC SSO](../../../user-management/saml-sso/saml-sso.md).

## Prerequisites

- Tenant admin access to Palette.

- An existing cluster profile with Palette eXtended Kubernetes with Palette set as the OIDC Identity Provider. For steps
  on creating a cluster profile, refer to our
  [Create Cluster Profiles](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
  guide.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, below **Platform**, select **Platform Settings**.

4. Toggle the **Automatic Cluster Role Bindings** button to activate the feature.

5. A pop-up box prompts you to confirm the action. Click **OK**.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, below **Platform**, select **Platform Settings**.

4. Ensure the **Automatic Cluster Role Bindings** toggle is set to active.

5. Deploy a cluster with Palette IDP enabled and no RBAC cluster bindings set.

6. From to the left main menu, select **Audit Logs**.

7. Set the filter **Log Type** to **Update** and **Resource Type** to **Cluster**. Look for entries that indicate RBAC
   has been updated.

![A view of the audit logs showing automatic binding applying to clusters](/clusters_management-platform_settings-autorbac_binding_audit_logs.webp)
