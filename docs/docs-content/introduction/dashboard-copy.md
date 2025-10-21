---
sidebar_label: "Palette Dashboard Copy"
title: "Palette Dashboard Copy"
description: "Explore the Spectro Cloud Palette Dashboard."
icon: ""
hide_table_of_contents: false
sidebar_position: 11
tags: ["getting-started"]
---

This section is a tour of Palette's two main dashboards - the **Project** dashboard and the **Tenant Admin** dashboard.
The **Project** dashboard is for non-admin users to perform operations related to setting up Kubernetes clusters,
creating cluster profiles, creating cloud accounts, and deploying clusters. The **Tenant Admin** dashboard is used to
perform administrative tasks such as setting up Single Sign On (SSO), creating users and teams, setting up Role-Based
Access Control (RBAC), and setting up additional package registries.

The **Tenant Admin** dashboard is only available to users who have the Tenant Admin role. Tenant admin users can toggle
between the **Project** dashboard and **Tenant Admin** dashboard. Users without the tenant admin role can only view the
**Project** dashboard.

## Project Dashboard

The **Project** dashboard shows available views for non-admin users. Numbered items in the screenshot are described in
the list below.

<!-- Numbered items in the screenshot are described in the list below.  -->

<!-- ![project-dashboard](/project-dashboard.webp) -->

![A screenshot of the Project dashboard with numbered UI elements described in this document.](/getting-started/getting-started_dashboard_project-dashboard.webp)

1. Projects are used to organize the cluster resources within a logical group. Use the **drop-down Menu** to shift
   between projects.

2. The [Project Overview](../tenant-settings/projects/projects.md) shows the resource and cost consumption of the
   selected project.

3. [Cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) are instantiated templates that are created with
   pre-configured layers needed for cluster deployments.

4. Kubernetes [clusters](../clusters/clusters.md) in Palette are instantiated from cluster profiles.

5. [Cluster groups](../clusters/cluster-groups/cluster-groups.md) are a collection of one or more host clusters that
   together form a computing platform for users to deploy Palette Virtual Clusters. Downstream consumers can use the
   cluster group when using Palette in [App Mode](../introduction/palette-modes.md#what-is-app-mode).

6. [Workspaces](../workspace/workspace.md) enable the coupling of relevant namespaces across multiple clusters to manage
   access, obtain cost, and workload visibility by applications or teams.

7. [Audit logs](../audit-logs/audit-logs.md) display the log of activities within a certain time frame.

8. **Project Settings** allow users to configure settings for cloud accounts, backup locations, and alerts. It also
   allows users to upload SSH keys. Keys can be recalled when deploying a cluster. Platform settings are also available
   for controlling auto upgrades and auto remediation of unhealthy nodes in Palette-provisioned clusters.

## Tenant Admin Dashboard

The **Tenant Admin** dashboard shows available views for tenant administrators. Numbered items in the screenshot are
described in the list below.

<!-- ![admin-dashboard](/admin-dashboard.webp) -->

![A screenshot of the Tenant Admin dashboard with numbered UI elements described in this document.](/getting-started/getting-started_dashboard_admin-dashboard.webp)

1. Tenant admins use the **drop-down Menu** to switch to the **Tenant Admin** dashboard.

2. The **Tenant Admin** dashboard contains a **Projects** menu option, which the **Project** dashboard does not have.
   The **Projects** menu option allows tenant admins to create, modify, and delete projects.

3. The **Cluster Profiles** menu option allows tenant admins to create and manage global cluster profiles that can be
   used for cluster creation across all projects within a tenant.

4. Clusters created under the tenant admin scope are not visible under the project scope.

5. [Cluster groups](../clusters/cluster-groups/cluster-groups.md) are a collection of one or more host clusters that
   together form a computing platform for deploying virtual clusters.

6. Tenant admins can assign [Roles and Permissions](../user-management/palette-rbac/palette-rbac.md).

7. Tenant admins can create [Users and Teams](../user-management/users-and-teams/users-and-teams.md).

8. [Audit logs](../audit-logs/audit-logs.md) in the **Tenant Admin** dashboard allow tracking user interaction with
   application resources for all projects and users. For admin users, the **Audit Log** button is visible for each
   project to view the logs of the resources specific to the project.

9. **Tenant Settings** give tenant admins access to the
   [pack registries](../registries-and-packs/registries-and-packs.md),
   [private cloud gateways](../glossary-all.md#private-cloud-gateway), and
   [SAML and SSO](../user-management/saml-sso/saml-sso.md) setup.
