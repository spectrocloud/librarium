# Feature Flags

Feature flags control the availability of experimental and stable features.
Flags can be toggled by administrators on the **System > Feature Flags** page.

Stable features are enabled by default and have been fully tested.
Experimental features are disabled by default and may change in future releases.

| Flag | Label | Category | Default | Description |
|------|-------|----------|---------|-------------|
| `role-management` | Role Management | stable | On | Create and edit RBAC roles |
| `dashboard-manifests` | Custom Dashboards | experimental | Off | Upload custom dashboard manifests via System tab |
| `i18n` | Internationalization | experimental | Off | Language selection UI |
| `group-management` | Group Management | stable | On | Manage groups via identity provider |
| `api-keys` | API Keys | experimental | On | Manage programmatic API keys |
| `access-policies` | Access Policies | stable | On | Manage access policies and RBAC matrix |
| `crd-catalog` | CRD Catalog | experimental | Off | Discover and manage arbitrary CRDs |
| `local-auth` | Local Auth | stable | On | Local admin accounts for Day 0 access without OIDC |
| `getting-started` | Getting Started Guide | stable | On | Interactive onboarding guide for new platform administrators |

