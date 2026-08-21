---
sidebar_label: "Audit Trail"
title: "Audit Trail"
description:
  "Review authentication attempts, VM operations, and configuration changes recorded in the audit trail on PaletteAI VM
  Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad", "system", "audit"]
---

Virtual Machine Orchestrator (VMO) records security-relevant actions in an audit trail. Each event captures who
performed an action, what the action targeted, and when it happened, which gives you one place to answer compliance and
troubleshooting questions about activity in the appliance.

VMO stores audit events as `VmoAuditEvent` custom resources in the `virtualization.spectrocloud.com/v1beta1` API group.

## Audited Actions

VMO records the following actions.

| **Category**       | **Actions**                                          |
| ------------------ | ---------------------------------------------------- |
| Authentication     | `login`, `login-failed`, `logout`, `password-change` |
| Resource lifecycle | `create`, `update`, `delete`                         |
| VM operations      | `start`, `stop`, `restart`, `migrate`, `restore`     |
| Access control     | `grant`, `revoke`                                    |
| Log forwarding     | `logging.forwarding.toggled`                         |

Authentication events cover both OIDC and local user accounts. VMO records a `login-failed` event when the credentials
are incorrect and when the OIDC provider is unavailable.

## View the Audit Trail

1. Log in to VMO.

2. From the VMO left main menu, select **System** > **Audit**.

3. Review the events on the **Audit Trail** page. VMO lists the newest event first and displays the total number of
   events below the page title.

The events table contains the following columns.

| **Column**    | **Description**                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| **Time**      | Date and time the event occurred.                                                                     |
| **User**      | Identity that performed the action. Failed logins display `unknown` when VMO cannot resolve the user. |
| **Action**    | Operation performed, such as `create` or `login`.                                                     |
| **Resource**  | Resource type that the action targeted, such as **Vm** or **Oidc-User**.                              |
| **Name**      | Name of the affected resource.                                                                        |
| **Namespace** | Namespace of the affected resource. Cluster-level actions display a dash.                             |
| **Detail**    | Additional context, such as `VM tmp-nad-test patched`.                                                |

Select a column heading to sort the table by that column. Select **Refresh** to load the events that VMO has recorded
since you opened the page.

### Customize the Columns

Hide the columns you do not need so that the columns you care about have more room. Column changes apply to the **Audit
Trail** page only.

1. On the **Audit Trail** page, select the gear icon.

2. In the **Show / Hide Columns** menu, clear the checkbox for each column you want to hide. Select a cleared checkbox
   to display that column again. The table updates as you make each change.

3. _(Optional)_ Select **Reset to defaults** to display all columns again.

### Filter Audit Events

The **Audit Trail** page provides the following controls for narrowing the events table.

| **Control**       | **Description**                                                               |
| ----------------- | ----------------------------------------------------------------------------- |
| **Filter rows**   | Search box that matches text in the displayed columns.                        |
| **All Actions**   | Drop-down menu that limits the table to a single action, such as `delete`.    |
| **All Resources** | Drop-down menu that limits the table to a single resource type, such as `vm`. |

The **All Resources** drop-down menu lists every resource type that VMO audits. The following table groups those
resource types by area to help you find the one you need.

| **Area**                | **Resource Types**                                                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Virtual machines        | `vm`, `datavolume`, `snapshot`, `snapshot-policy`, `snapshot-schedule`, `instancetype`, `preference`                                                                                               |
| Templates and images    | `template`, `vmtemplate`, `image-template`, `cloud-init-template`, `auto-install-script`, `builder`                                                                                                |
| Infrastructure          | `namespace`, `namespacepolicy`, `network`, `kubevirt`                                                                                                                                              |
| Identity and access     | `user`, `group`, `usergroup`, `oidc-user`, `local-user`, `apikey`, `accesspolicy`, `iam-role`, `role`, `clusterrole`, `rolebinding`, `clusterrolebinding`, `rbac`, `group-mapping`, `user-mapping` |
| Appliance configuration | `config`, `config-bundle`, `config-seed`, `settings`, `feature-flag`, `dashboard-manifest`, `certificate`, `tls-certificate`                                                                       |

:::info

The events table includes a **User** column, but the page does not provide a matching filter. Use the **Filter rows**
search box to narrow the table to a specific user.

:::

## Audit Event Visibility

The events that appear on the **Audit Trail** page depend on your access. VMO scopes the list along two axes.

- **Namespace** - The page displays events that targeted a namespace you can access. Users with cluster-wide access can
  review events from every namespace.

- **Resource type** - The page displays events for a resource type only when your role grants read access to that
  resource type. For example, a role that can read VMs but not identity resources displays VM events and hides role and
  user events.

The page always displays the events for actions that you performed, including cluster-level actions and actions that
targeted namespaces you no longer have access to. This preserves individual accountability when a role or namespace
scope is narrowed later.

To review the permissions that each built-in role holds, refer to
[VM User Roles and Permissions](../../rbac/vm-roles-permissions.md).

## Audit Event Retention

VMO deletes audit events that are older than 30 days and runs the cleanup once per day. This keeps the volume of stored
audit data bounded without any action on your part.

If you need to keep audit records beyond the retention window, forward them to an external Security Information and
Event Management (SIEM) system or log aggregator before they expire. Refer to [Log Forwarding](../log-forwarding.md) for
how to collect the appliance logs, which carry the audit records, with a cluster log-forwarding agent.
