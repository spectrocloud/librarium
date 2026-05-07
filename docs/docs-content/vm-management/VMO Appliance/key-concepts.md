# Key Concepts

This document introduces core concepts used throughout VMO Manager: namespaces, templates, golden images, feature flags, IAM roles versus Kubernetes RBAC, CRD-based persistence, and capabilities.

## Namespaces

VMO Manager manages a subset of Kubernetes namespaces. A namespace is considered **managed** when it has the label `app.kubernetes.io/managed-by=vmo-manager`. On bootstrap, VMO Manager automatically labels:

- `default`
- The VMO namespace (e.g., `vm-dashboard`)
- The golden images namespace (e.g., `vmo-golden-images`)

Resource lists default to **All Namespaces**, showing resources across all managed namespaces. You can filter by a specific namespace using the namespace dropdown. Per-namespace counts help you understand resource distribution. See [Namespaces](../infrastructure/namespaces) for managing and creating namespaces.

> **Tip:** When creating VMs or other resources, choose a managed namespace. Namespaces without the VMO label may not appear in dropdowns.

## Templates

A **VmTemplate** is a Kubernetes Custom Resource (CRD) that defines a reusable VM specification. Templates include:

- Source (golden image, ISO, or blank disk)
- CPU and memory
- Network interfaces
- Storage configuration
- Firmware and device settings

Templates let you standardize VM configurations and create multiple VMs from the same base. When creating a VM, you can select a template in the Source step; the wizard pre-fills settings from the template.

Templates are stored as CRDs under `kubevirt.io` and managed by VMO Manager. They appear in **Workloads > Templates**. See [Templates](../virtual-machines/templates) for details on creating and managing templates.

## Golden Images

A **golden image** is a sealed, reusable base disk image. Unlike a one-off DataVolume, a golden image is designed to be cloned many times. Typical workflow:

1. Upload an ISO or create a blank disk.
2. Build a VM, install the OS, apply patches, and seal the image.
3. Create a VmTemplate that references the golden image DataVolume.
4. Create VMs from the template; each VM gets a clone of the golden image.

Golden images live in a dedicated namespace (e.g., `vmo-golden-images`) and are listed under **Image Catalog > Golden Images**. See [Golden Images](../image-catalog/golden-images) for the full lifecycle walkthrough.

## Feature Flags

Feature flags control the availability of experimental and stable features. Administrators toggle flags on **Settings > Feature Flags**.

- **Fail-closed:** When a flag is unknown or the API is unreachable, the feature is treated as **disabled**. This prevents unexpected behavior in degraded environments.
- **Admin-toggleable:** Only users with `vmo:features:write` can change feature flags.
- **Stable vs experimental:** Stable features are enabled by default; experimental features are disabled by default.

Feature-gated UI elements (tabs, buttons, wizards) are hidden when the corresponding flag is disabled. The backend also checks flags for feature-gated API endpoints. See [Feature Flags](../system/feature-flags) for the complete list of available flags.

## IAM Roles vs Kubernetes RBAC Roles

VMO Manager uses two distinct role systems:

### IAM Roles (VMO-Level)

IAM roles are **application-level** roles that define what users can do in VMO Manager. They are stored in CRDs (`VmoRole`) and mapped from OIDC groups.

| IAM Role | Intent | Key Permissions |
|----------|--------|-----------------|
| **Platform Admin** | Full control | All permissions |
| **Editor** | VM workflow builder | packages, templates, dashboards (r+w), networks, namespaces, CRD catalog (r), system health (r) |
| **Operator** | Day-to-day ops | templates, dashboards (r+w), packages (r), audit, system, monitoring, storage (r) |
| **Viewer** | Read-only | templates, packages (r), dashboards (r+w own), system health (r), networks, namespaces (r) |

Group-to-role mappings (e.g., `cluster-admins` to Platform Admin) are configured in **Settings > IAM Roles**. See [IAM Roles & Permissions](../access-management/iam-roles) for details.

### Kubernetes RBAC ClusterRoles (K8s-Level)

Kubernetes ClusterRoles define what users can do against the Kubernetes API. VMO Manager bootstraps four ClusterRoles:

| ClusterRole | Purpose |
|-------------|---------|
| `spectro-vmo-admin` | Full access including RBAC, Cilium, quotas, audit |
| `spectro-vmo-power-user` | Full VM/DV/network access, read-only templates/namespaces |
| `spectro-vmo-user` | Operate VMs (start/stop/console) but not create/delete |
| `spectro-vmo-viewer` | Read-only all VMO resources |

Access policies map IAM roles to these ClusterRoles and optionally scope them to specific namespaces. The flow is: **OIDC Group -> IAM Role -> K8s ClusterRole -> Namespace**. See [Access Policies](../access-management/access-policies) for how to configure this mapping.

## CRD-Based Persistence

All persistent state in VMO Manager is stored in **Kubernetes Custom Resource Definitions (CRDs)** under the `spectrocloud.com/v1beta1` API group. There is no embedded database.

- **Config, feature flags, IAM roles, dashboards, templates, packages, certificates, local users** — Stored as CRDs
- **Sensitive data** (e.g., password hashes) — Stored in companion Kubernetes Secrets
- **Branding assets** — Stored in ConfigMaps
- **Sessions, uploads, serve tokens** — Held in-memory per replica (HA uses sticky sessions)

CRDs are managed by a dedicated Helm chart (`vmo-manager-crds`) with an independent upgrade lifecycle. See [Data Flow & Persistence](../architecture/data-flow) for the full architecture. This design ensures:

- No external database dependency
- Native Kubernetes backup and restore
- Consistency with the rest of the platform

## Capabilities

VMO Manager **detects platform capabilities at runtime**. A capability is a feature or component that may or may not be present in the cluster.

Examples:

- **KubeVirt features** — Live migration, snapshots, hot-plug, SR-IOV, GPU passthrough, CPU/memory overcommit
- **Cilium** — CNI and CiliumNetworkPolicy support
- **Kyverno** — Policy engine
- **Prometheus** — Metrics backend

Capabilities are cached (e.g., 60-second TTL) and exposed via the `/api/v1/capabilities` endpoint. The frontend uses `useCapabilities()` to show or hide UI elements based on what the cluster supports. For example, the snapshot UI is only shown when KubeVirt snapshots are available.

Platform Health (**System > Platform Health**) displays detected components and their feature gates.
