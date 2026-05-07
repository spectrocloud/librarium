# Platform Configuration

VMO Manager uses a layered configuration system that combines environment variables, admin overrides, and built-in defaults. This page describes how configuration is resolved, how to view and change values, and how to export or import configuration bundles. For the complete list of all configuration keys with current live values, see [Configuration Reference](configuration).

## Config Layering

Configuration values are resolved in the following order (highest priority first):

1. **Environment variable** — Values set by the Helm chart, deployment manifest, or Makefile. These take precedence so that deployment-specific settings (e.g., per-environment URLs) are not silently overridden by stored values when switching clusters or environments.
2. **Admin override** — Values set via the Settings > Configuration page. Stored in the VmoConfig CRD.
3. **Default** — Hardcoded fallback in the application binary.

> **Note:** When an environment variable is set for a config key, it takes precedence over any admin override. This ensures Helm deployments can reliably control environment-specific values without admin UI changes conflicting.

## Config Sections

Configuration keys are grouped into sections for easier navigation:

| Section | Description |
|---------|-------------|
| `oidc` | OpenID Connect issuer URL, client ID, client secret, session encryption key |
| `platform` | Base URL, platform URL, VMO dashboard URL, CDI upload proxy URL |
| `monitoring` | External metrics URL, metrics retention days |
| `identity` | Keycloak Admin API client ID and secret |
| `general` | Log level, default VM password |
| `branding` | Product name, logo, favicon, colors, copyright, STIG consent banner |
| `infrastructure` | Guest agent auto-install, listen port, K8s API server, CA file path, data directory |

## Settings > Configuration Page

Navigate to **Settings > Configuration** to view and manage the current configuration. You must have the `vmo:config:write` permission to change values.

### Viewing Current Values and Sources

Each configuration key displays:

- **Value** — The effective value in use (sensitive values are masked for non-admin users).
- **Source** — Indicates where the value comes from:
  - `env` — Set by environment variable (Helm/deployment)
  - `override` — Set by admin via the Settings page
  - `default` — Using the built-in default

### Changing Values (Admin Override)

To override a value:

1. Go to Settings > Configuration.
2. Filter by section if desired (optional).
3. Edit the value in the input field.
4. Save the change.

> **Warning:** Values that require a restart will show a banner. After changing such values, the VMO Manager pod must be restarted for the new value to take effect. Environment variables set by Helm will still take precedence over your override after restart.

### Restart-Required Values

Some configuration keys require a pod restart to take effect:

- OIDC settings (issuer URL, client ID, client secret, session key)
- Platform URLs (base URL, platform URL, CDI proxy URL)
- Identity provider settings (Keycloak admin client)
- Log level

When any restart-required value is changed via the admin override, a banner is displayed at the top of the Configuration page indicating that a restart is pending.

### Environment-Only (Read-Only) Values

Some keys are set only by environment variables and cannot be changed via the UI:

- `infra.port` — HTTP listen port
- `infra.k8s_api_server` — Kubernetes API server URL
- `infra.ca_file` — Platform CA certificate path
- `infra.data_dir` — Data directory

These are marked as read-only in the Configuration page and reflect the values from the deployment environment.

## Config Export and Import Bundles

Configuration can be exported as a portable JSON bundle and imported into another VMO Manager instance or included in a Palette pack for fleet-wide deployment.

### Export

1. Go to Settings > Configuration (or Export).
2. Click **Export** or use the export action.
3. Download the JSON bundle. It includes:
   - Config overrides (admin-set values)
   - Feature flag changes
   - Custom dashboard manifests
   - Trusted CA certificates

### Import

1. Go to Settings > Configuration (or Import).
2. Click **Import** and select a previously exported JSON bundle.
3. Review the summary of what will be applied (config values, feature flags, dashboards, certificates).
4. Confirm the import.

> **Tip:** Importing a bundle overwrites existing admin overrides for keys present in the bundle. Environment variables are not affected by import.

## Configuration Reference

For a complete list of all config keys with environment variables, defaults, and flags (restart, sensitive, read-only), see the [Configuration Reference](configuration.md).
