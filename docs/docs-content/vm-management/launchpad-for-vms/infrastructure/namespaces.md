---
sidebar_label: "Namespaces"
title: "Namespaces"
description:
  "Create, adopt, and edit managed namespaces, and apply resource quotas and limit ranges on the Launchpad for VMs
  appliance."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad appliance", "infrastructure", "namespaces"]
---

Virtual Machine Orchestrator (VMO) allows you to create, manage, and edit Kubernetes namespaces. You can also apply
[Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) and
[Limit Ranges](https://kubernetes.io/docs/concepts/policy/limit-range/) to those namespaces.

## Managed Namespaces

A namespace is managed when it has the label `app.kubernetes.io/managed-by=vmo-manager`. For managed namespaces,
Launchpad for VMs:

- Lists them in dropdowns and filters.
- Lets you edit labels, annotations, Resource Quotas, and Limit Ranges from a single modal. Namespaces managed by VMO
  are denoted with the following labels:

| Label                                         | Description                                                                                                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.kubernetes.io/managed-by=vmo-manager`    | Applied to all labels managed by VMO, including those created in the UI                                                                            |
| `vmo-manager.spectrocloud.com/origin=created` | Distinguishes namespaces created by a user in VMO (deletable from the UI) from namespaces created automatically by the Launchpad for VMs appliance |

Managed namespaces:

- Are listed in relevant drop-downs and filters.
- Can be edited from a single modal.
- Can be created on-the-fly from various pages (for example, **Workloads** > **Virtual Machines** > **Create VM**)

Resource lists default to **All Namespaces**, showing resources across all namespaces you can access. For OIDC users
with namespace scoped RoleBindings (granted through **Settings** > **Access Management**), only their permitted
namespaces appear in drop-downs and filters. Users with cluster-wide access can view all managed namespaces. You can
filter by a specific namespace using the namespace drop-down.

VMO manages the following namespaces by default.

| Namespace           | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `default`           | Default Kubernetes namespace.                           |
| `vm-dashboard`      | The appliance's own namespace, or the configured value. |
| `vmo-golden-images` | Dedicated namespace for golden image DataVolumes.       |

## Create Namespaces

### Quick-Create Links

You can quick-create namespaces from several pages without leaving the page:

- **VM creation**: the Namespace dropdown offers **Create namespace** when the desired namespace does not exist.
- **Access Management** > **Users**: when scoping access to a namespace, you can create it inline.

Namespaces created through quick-create modal applies the `app.kubernetes.io/managed-by=vmo-manager` label so the
namespace is immediately managed.

1. From the VMO left main menu, select **Infrastructure** > **Namespaces**.

2. Select **Create Namespace**. The **Create Namespace** modal window contains the following tabs.

   | Tab             | Description                                               |
   | --------------- | --------------------------------------------------------- |
   | **General**     | The namespace name, plus optional labels and annotations. |
   | **Quotas**      | Optional namespace-wide Resource Quota caps.              |
   | **Limit Range** | Optional per-container default requests and limits.       |

3. On the **General** tab, enter a
   [DNS-1123 compliant](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
   **Namespace name** (lowercase letters, digits, and hyphens; up to 63 characters; must start and end with an
   alphanumeric character). Validation runs as you type.

4. _(Optional)_ Enter key-value pairs for **Labels** and **Annotations** as necessary.

### Reserved Key-Values

Certain keys and values are reserved for VMO and Kubernetes operations. The modal window hides these keys to prevent
accidental edits. If you need to set a `kubernetes.io/` key, use `kubectl edit namespace` directly.

| Label              | Annotation         | Key                                           | Value         |
| ------------------ | ------------------ | --------------------------------------------- | ------------- |
| :white_check_mark: | :x:                | `app.kubernetes.io/managed-by`                | `vmo-manager` |
| :white_check_mark: | :x:                | `vmo-manager.spectrocloud.com/origin`         | `created`     |
| :white_check_mark: | :white_check_mark: | `kubernetes.io/...` and `*.kubernetes.io/...` | -             |
| :white_check_mark: | :white_check_mark: | `k8s.io/...` and `*.k8s.io/...`               | -             |
| :white_check_mark: | :white_check_mark: | `pod-security.kubernetes.io/...`              | -             |

5. _(Optional)_ Enter **Quotas** and **Limit Range** values as necessary.

- Use [Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) to set resource constraints on all
  pods in the namespace, keeping resource-hungry namespaces from starving other workloads on the cluster.
- Use [Limit Ranges](https://kubernetes.io/docs/concepts/policy/limit-range/) to automatically set resource constraints
  for each container within the namespace that does not specify requests or limits for CPU or memory.

### Quota Fields

On the **Quotas** tab, all fields are optional.

| Field                 | What it caps                                                                           |
| --------------------- | -------------------------------------------------------------------------------------- |
| Total CPU Requests    | Sum of `requests.cpu` across all pods in the namespace.                                |
| Total CPU Limits      | Sum of `limits.cpu` across all pods.                                                   |
| Total Memory Requests | Sum of `requests.memory`.                                                              |
| Total Memory Limits   | Sum of `limits.memory`.                                                                |
| Total Storage         | Sum of `requests.storage` across all Persistent Volume Claims (PVCs) in the namespace. |
| Max Pods              | Maximum number of pods in the namespace.                                               |

CPU values use Kubernetes CPU units (`1`, `500m`, `1.5`). Memory and storage use binary suffixes (`128Mi`, `4Gi`).

### Limit Range Fields

On the **Limit Range** tab, all fields are optional.

| Field                                | What it sets                                                    |
| ------------------------------------ | --------------------------------------------------------------- |
| Default CPU Request per container    | `requests.cpu` for containers that do not specify their own.    |
| Default CPU Limit per container      | `limits.cpu` for containers that do not specify their own.      |
| Default Memory Request per container | `requests.memory` for containers that do not specify their own. |
| Default Memory Limit per container   | `limits.memory` for containers that do not specify their own.   |

If a workload already declares its own `resources.requests` or `resources.limits`, the Limit Range does not override it;
it only fills in defaults.

6. **Create** the namespace.

The namespace is created with the appropriate labels set. Any provided **Quotas** and **Limit Range** values are applied
as a follow-up step. If those follow-up calls fail, the namespace is still created, and you can edit the namespace to
adjust values as needed.

### Adopt Existing Namespaces

You can adopt a namespace that already exists in the cluster so that it can be managed by VMO.

1. From the VMO left main menu, select **Infrastructure** > **Namespaces**.
2. Select **Add Existing**.
3. Select one or more unmanaged namespaces from the list and click **Adopt Namespace**.

Adopted namespaces are labeled `app.kubernetes.io/managed-by=vmo-manager` but **not** marked with
`vmo-manager.spectrocloud.com/origin=created`.

### Unadopt Existing Namespaces

You can remove them from appliance management (unadopt), but you cannot delete them from the appliance UI. Delete the
underlying namespace with `kubectl` or another tool when needed.

1. From the VMO left main menu, select **Infrastructure** > **Namespaces**.
2. Right-click the namespace you want to unadopt and select **Remove from VMO**. This can only be done for namespaces
   with a **VMO STATUS** of Adopted.
3. Type the namespace to confirm and select **Remove from VMO**

## Edit Namespaces

Editing an existing namespace uses a similar process as [creating a namespace](#create-namespaces). From the VMO left
main menu, select **Infrastructure** > **Namespaces**, and select the **Edit** icon beside the namespace. Add, remove,
and edit fields as necessary, selecting **Save changes** when finished.

:::info

Namespace names are immutable. Kubernetes does not allow renaming a namespace, so the name field is shown but disabled
in edit mode. To use a different name, create a new namespace, move resources over, and delete the old namespace.

:::

## Delete or Unadopt Namespaces

### Delete Namespaces

You can remove them from appliance management (unadopt), but you cannot delete them from the appliance UI. Delete the
underlying namespace with `kubectl` or another tool when needed.

1. From the VMO left main menu, select **Infrastructure** > **Namespaces**.
2. Right-click the namespace you want to delete and select **Delete Namespace**. This can only be done for namespaces
   with a **VMO STATUS** of Created.
3. Type the namespace to confirm and select **Delete**

### Unadopt Existing Namespaces

You can remove them from appliance management (unadopt), but you cannot delete them from the appliance UI. Delete the
underlying namespace with `kubectl` or another tool when needed.

1. From the VMO left main menu, select **Infrastructure** > **Namespaces**.
2. Right-click the namespace you want to unadopt and select **Remove from VMO**. This can only be done for namespaces
   with a **VMO STATUS** of Adopted.
3. Type the namespace to confirm and select **Remove from VMO**

:::info

Adopted namespaces show a confirmation dialog listing existing VMs, DataVolumes, snapshots, services, and PVCs in the
namespace before unadopting. The resources remain after the namespace is removed from appliance management; they are no
longer surfaced in the UI.

:::
