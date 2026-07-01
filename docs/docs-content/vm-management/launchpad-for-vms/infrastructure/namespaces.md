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

<!-- vale off -->

Launchpad for VMs appliance UI allows you to create, manage, and edit Kubernetes namespaces. You can also apply Resource
Quotas and Limit Ranges to those namespaces.

## Managed Namespaces

A namespace is managed when it has the label `app.kubernetes.io/managed-by=vmo-manager`. For managed namespaces,
Launchpad for VMs:

- Lists them in dropdowns and filters.
- Lets you edit labels, annotations, Resource Quotas, and Limit Ranges from a single modal.
- Allows quick-create from various pages, such as VM creation and networking.

Resource lists default to **All Namespaces**, showing resources across all namespaces you can access. For OIDC users
with namespace scoped RoleBindings (granted through **Settings** > **Access Management**), only their permitted namespaces
appear in dropdowns and filters. Users with cluster-wide access view all managed namespaces. You can filter by a
specific namespace using the namespace dropdown.

:::info

When creating VMs or other resources, choose a managed namespace. Namespaces without the `vmo-manager` label may not
appear in dropdowns.

:::

A second label, `vmo-manager.spectrocloud.com/origin=created`, distinguishes namespaces created by a user (deletable
from the UI) from namespaces that were **adopted** (only removable from appliance management; the underlying namespace
remains in the cluster).

## Create Namespaces

### Quick-Create Links

You can quick-create namespaces from several pages without leaving the page:

- **VM creation**: the Namespace dropdown offers **Create namespace** when the desired namespace does not exist.
- **Networking**: when creating a NAD, you can create the target namespace first.
- **Access policies**: when scoping access to a namespace, you can create it inline.

Namespaces created through quick-create modal applies the `app.kubernetes.io/managed-by=vmo-manager` label so the
namespace is immediately managed.

### Create from the Namespaces Page

1. Navigate to **Infrastructure > Namespaces**.

2. Click **Create Namespace**. A modal opens with three tabs described in the table below.

   | Tab             | Description                                               |
   | --------------- | --------------------------------------------------------- |
   | **General**     | The namespace name, plus optional labels and annotations. |
   | **Quotas**      | Optional namespace-wide Resource Quota caps.              |
   | **Limit Range** | Optional per-container default requests and limits.       |

3. On the **General** tab, enter a
   [DNS-1123 compliant name](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
   (lowercase letters, digits, and hyphens; up to 63 characters; must start and end with an alphanumeric character).
   Validation runs as you type.

4. (Optional) Enter in values for **Labels** and **Annotations**. Each is a key/value pair, and you can add multiple.
   Refer to [Reserved Keys](#reserved-keys) for keys Launchpad for VMs controls automatically.

5. (Optional) Enter in values for **Quotas** and **Limit Range**. Refer to
   [Resource Quotas vs Limit Range](#resource-quotas-vs-limit-range). Empty fields are skipped, and the namespace is
   created without that constraint.

6. Click **Create**.

The namespace is created with the appliance labels set, and then any provided **Quotas** and **Limit Range** are applied
as a follow-up step. If those follow-up calls fail, the namespace is still created, and you can retry from **Edit
Namespace**.

### Adopt Existing Namespaces

You can adopt a namespace that already exists in the cluster so that it falls under appliance management.

1. Go to **Infrastructure** > **Namespaces**.
2. Click **Add Existing**.
3. Select one or more unmanaged namespaces from the list and click **Adopt Namespace**.

Adopted namespaces are labeled `app.kubernetes.io/managed-by=vmo-manager` but **not** marked with
`vmo-manager.spectrocloud.com/origin=created`. You can remove them from appliance management (unadopt), but you cannot
delete them from the appliance UI. Delete the underlying namespace with `kubectl` or another tool when needed.

## Edit Namespaces

Click Edit (pencil icon) in the row's actions column to open the unified modal in edit mode. The following table
displays the fields that can be modified.

| Field               | Tab         | Details                                                                                                                 |
| ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Labels**          | General     | Appliance-reserved and Kubernetes system keys are filtered out automatically. Refer to [Reserved Keys](#reserved-keys). |
| **Annotations**     | General     | Kubernetes system annotations are filtered out automatically.                                                           |
| **Resource Quotas** | Quotas      | Clear a field to remove that cap.                                                                                       |
| **Limit Range**     | Limit Range | Clear a field to remove that default.                                                                                   |

:::warning

Namespace names are immutable. Kubernetes does not allow renaming a namespace, so the name field is shown but disabled
in edit mode. To use a different name, create a new namespace, move resources over, and delete the old one.

:::

Editing only writes labels and annotations you can control. Reserved keys, such as the appliance management labels and
Kubernetes-owned keys like `kubernetes.io/metadata.name`, are preserved server-side regardless of what is sent.

## Actions Column and Context Menu

The actions column on the Namespaces table is icon-only and matches the VM list pattern.

| Icon       | Action                                   | When shown                                                                                              |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Pencil** | Edit Namespace (opens the unified modal) | Any managed namespace, when you have `vmo:namespace:update`.                                            |
| **Trash**  | Delete Namespace                         | Only for namespaces Launchpad for VMs created (`origin=created`), when you have `vmo:namespace:delete`. |

For adopted namespaces, **Remove from VMO** (unadopt) is available through the right-click context menu on the row.
Unadopt strips the management label so the namespace is hidden from appliance dropdowns but leaves the namespace and its
resources in the cluster.

:::info

Adopted namespaces show a confirmation dialog listing existing VMs, DataVolumes, snapshots, services, and PVCs in the
namespace before unadopting. The resources remain after the namespace is removed from appliance management; they are no
longer surfaced in the UI.

:::

## Resource Quotas vs Limit Range

Quotas and Limit Ranges are commonly confused. They control different scopes.

|                  | Resource Quota                                                | Limit Range                                                             |
| ---------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Scope**        | The whole namespace                                           | Each individual container                                               |
| **Effect**       | Hard cap on the **sum** across all pods                       | **Default** request/limit for containers that did not specify their own |
| **Applied via**  | A `ResourceQuota` object                                      | A `LimitRange` object                                                   |
| **What you set** | Total CPU/Memory requests and limits, total storage, max pods | Per-container default CPU/Memory request and limit                      |

Use a **Resource Quota** to keep a resource-hungry namespace from starving other workloads on the cluster. Use a **Limit
Range** to give containers reasonable defaults so that VMs and pods cannot accidentally schedule with no resources
reserved.

### Quota Fields

On the **Quotas** tab, all fields are optional.

| Field                 | What it caps                                                |
| --------------------- | ----------------------------------------------------------- |
| Total CPU Requests    | Sum of `requests.cpu` across all pods in the namespace.     |
| Total CPU Limits      | Sum of `limits.cpu` across all pods.                        |
| Total Memory Requests | Sum of `requests.memory`.                                   |
| Total Memory Limits   | Sum of `limits.memory`.                                     |
| Total Storage         | Sum of `requests.storage` across all PVCs in the namespace. |
| Max Pods              | Maximum number of pods in the namespace.                    |

CPU values use Kubernetes CPU units (`1`, `500m`, `1.5`). Memory and storage use binary suffixes (`128Mi`, `4Gi`).

### Limit Range Fields

On the **Limit Range** tab, all fields are optional.

| Field                                | What it sets                                                     |
| ------------------------------------ | ---------------------------------------------------------------- |
| Default CPU Request per container    | `requests.cpu` for containers that did not specify their own.    |
| Default CPU Limit per container      | `limits.cpu` for containers that did not specify their own.      |
| Default Memory Request per container | `requests.memory` for containers that did not specify their own. |
| Default Memory Limit per container   | `limits.memory` for containers that did not specify their own.   |

If a workload already declares its own `resources.requests` or `resources.limits`, the Limit Range does not override it;
it only fills in defaults.

## Reserved Keys

A small set of label and annotation keys is owned by either Launchpad for VMs or Kubernetes itself. These are
server-controlled: the appliance silently strips them from any client-supplied input and preserves the canonical values.

**Appliance-controlled labels** (always present on managed namespaces, never user-editable):

- `app.kubernetes.io/managed-by`: always set to `vmo-manager`.
- `vmo-manager.spectrocloud.com/origin`: `created` for namespaces the appliance created; absent for adopted namespaces.

**Kubernetes-controlled keys** (any key matching these patterns, in either labels or annotations):

- `kubernetes.io/...` and `*.kubernetes.io/...`
- `k8s.io/...` and `*.k8s.io/...`
- `pod-security.kubernetes.io/...` (pod security admission labels)

The Edit modal hides these keys. If you need to set a `kubernetes.io/` key, use `kubectl edit namespace` directly.

## Default Namespaces

On bootstrap, Launchpad for VMs automatically labels the following namespaces as managed.

| Namespace           | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `default`           | Default Kubernetes namespace.                           |
| `vm-dashboard`      | The appliance's own namespace, or the configured value. |
| `vmo-golden-images` | Dedicated namespace for golden image DataVolumes.       |

These namespaces are labeled if they exist. If they do not exist, the bootstrap process may create them, or they are
created by the Helm chart.

:::info

The exact namespace names depend on Helm values (`VMO_NAMESPACE`, `VMO_GOLDEN_IMAGES_NAMESPACE`). Refer to the platform
configuration for your deployment.

:::
