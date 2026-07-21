---
sidebar_label: "Access Mapping"
title: "Access Mapping"
description: "Learn how to view resolved user and group access in Launchpad for VMs."
icon: " "
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo", "vm launchpad", "access management", "rbac"]
---

The **Access Mapping** page is a read-only view of every Kubernetes binding and VMO IAM mapping Launchpad for VMs
manages on your behalf. Use it to answer questions such as _"who has access to namespace X?"_ or _"which Kubernetes
ClusterRole is bound to the `vmo-editors` group?"_ without opening a `kubectl` shell.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](../install-vmla-iso.md) for
  guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## Access Mapping Page

From the left main menu, select **Settings** > **Access Management** > **Access Mapping** to view the resolved bindings.

Each row represents one binding. The columns describe who the binding applies to and what it grants.

| **Column**       | **Description**                                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Subject**      | The user or group the binding applies to.                                                                                                                                               |
| **Type**         | The subject kind: **User** or **Group**.                                                                                                                                                |
| **K8s Role**     | The Kubernetes ClusterRole the binding references. Launchpad marks built-in roles with a **ClusterRole** or **Role** pill.                                                              |
| **Binding Type** | The Kubernetes binding kind. Common values are **ClusterRoleBinding** and **RoleBinding**.                                                                                              |
| **VMO Role**     | The VMO IAM role the binding resolves to (Platform Admin, Editor, Operator, or Viewer). An empty cell means the row represents a Kubernetes-only binding with no VMO IAM role attached. |
| **Namespace**    | The namespace the binding is scoped to. Rows with cluster-wide access show **All Namespaces**.                                                                                          |

Select a column header to sort. Use the **Filter rows** search box to filter by any field, or use the **Filters** button
to filter by subject type, namespace, Kubernetes role, or VMO role.

## Show or Hide Columns

Select the gear icon in the top right of the table to open the **Show / Hide Columns** panel. Toggle any column to show
or hide it, or select **Reset to defaults** to restore the default column set.

## How to Read a Row

The **Access Mapping** table surfaces the two planes of access management in the same view.

- **Kubernetes bindings.** A row with a value in **K8s Role** and **Binding Type** represents a real ClusterRoleBinding
  or RoleBinding in the cluster. This grants direct Kubernetes access (`kubectl` and KubeVirt API calls) to the subject.

- **VMO IAM mappings.** A row with a value in **VMO Role** represents a mapping from the subject to a VMO platform role.
  This controls what the subject can view and do in the Launchpad UI.

- **Dual-plane grants.** Rows with values in both **K8s Role** and **VMO Role** are grants Launchpad created through the
  [Users](./users.md) or [Groups](./groups.md) pages, where a single action creates both the Kubernetes binding and the
  VMO IAM mapping.

:::info

Local users bypass the OIDC access chain and use the pod's ServiceAccount token to reach the Kubernetes API. They carry
full cluster access and do not appear as bindings in the **Access Mapping** table. Refer to [Auth Modes](#auth-modes)
for details.

:::

## Auth Modes

The access chain that produces the bindings on this page depends on how Launchpad for VMs is deployed.

| **Mode**                    | **Description**                                                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keycloak**                | Direct OIDC with the appliance's built-in Keycloak. The browser redirects to Keycloak, receives tokens, and Launchpad creates a session.                       |
| **Palette or VerteX proxy** | The Palette or VerteX proxy sits between the browser and the identity provider. Tokens flow through the proxy before reaching Launchpad.                       |
| **Local**                   | No external identity provider. The browser sends credentials directly to Launchpad, and the session uses the pod's ServiceAccount token for Kubernetes access. |

## Next Steps

- Grant a user access. Refer to [Users](./users.md).

- Grant a group access. Refer to [Groups](./groups.md).

- Review the built-in VMO roles and their permissions. Refer to [VMO Roles](./vmo-roles.md).
