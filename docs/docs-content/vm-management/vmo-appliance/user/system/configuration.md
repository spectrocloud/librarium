# Configuration Reference

All configuration is driven by environment variables with optional runtime overrides via the System page.
Resolution order: **Admin override** (System page) > **Environment variable** (Helm/deployment) > **Default**.

## OIDC / Authentication

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `oidc.enabled` | `OIDC_ENABLED` | false | Enable OpenID Connect authentication. When disabled, only local auth is available regardless of issuer URL. | restart |
| `oidc.issuer_url` | `OIDC_ISSUER_URL` | https://REPLACE_ME_PLATFORM_IP/iam/realms/vmo | OpenID Connect provider issuer URL (Keycloak realm) | restart |
| `oidc.client_id` | `OIDC_CLIENT_ID` | k8s-oidc | OIDC client identifier shared with K8s API and Headlamp | restart |
| `oidc.client_secret` | `OIDC_CLIENT_SECRET` | \*\*\* | OIDC client secret for token exchange | restart, sensitive |
| `oidc.session_key` | `SESSION_KEY` | \*\*\* | AES-256-GCM key for session cookie encryption (32+ characters) | restart, sensitive |
| `oidc.k8s_username_claim` | `VMO_K8S_USERNAME_CLAIM` | -- | For API-key sessions, selects the session field used as Impersonate-User when calling the K8s API. Must match the apiserver's --oidc-username-claim flag. Allowed: '' or 'username' (preferred_username), 'email', 'sub'. | restart |
| `oidc.k8s_username_prefix` | `VMO_K8S_USERNAME_PREFIX` | -- | Matches the apiserver's --oidc-username-prefix flag (e.g. 'oidc:'). Prepended to the impersonated username for API-key sessions. | restart |
| `oidc.k8s_group_prefix` | `VMO_K8S_GROUP_PREFIX` | -- | Matches the apiserver's --oidc-groups-prefix flag (e.g. 'oidc:'). Prepended to each Impersonate-Group header for API-key sessions. | restart |

## Platform

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `platform.base_url` | `BASE_URL` | https://REPLACE_ME_PLATFORM_IP | External URL where VMO Manager is accessible | restart |
| `platform.platform_url` | `PLATFORM_URL` | https://REPLACE_ME_PLATFORM_IP | Platform ingress URL for health checks and service links | restart |
| `platform.vmo_dashboard_url` | `VMO_DASHBOARD_URL` | https://REPLACE_ME_VMO_AUTH_IP/v1 | VMO dashboard API endpoint | -- |
| `platform.cdi_proxy_url` | `CDI_PROXY_URL` | https://cdi-uploadproxy.cdi.svc.cluster.local | CDI upload proxy endpoint for disk image uploads | restart |

## Monitoring

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `monitoring.external_metrics_enabled` | `EXTERNAL_METRICS_ENABLED` | false | Enable external metrics backend probing and query routing | -- |
| `monitoring.victoria_metrics_enabled` | `VICTORIA_METRICS_ENABLED` | false | Enable VictoriaMetrics component health reporting in system components | -- |
| `monitoring.otel_metrics_enabled` | `OTEL_METRICS_ENABLED` | false | Enable OpenTelemetry collector component health reporting in system components | -- |
| `monitoring.external_metrics_url` | `EXTERNAL_METRICS_URL` | -- | Optional external metrics endpoint for advanced queries | -- |
| `monitoring.metrics_retention_days` | `METRICS_RETENTION_DAYS` | 30 | Number of days to retain downsampled metrics | -- |

## Identity Provider

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `identity.keycloak_admin_id` | `KEYCLOAK_ADMIN_CLIENT_ID` | vmo-admin | Service account client ID for Keycloak Admin API | restart |
| `identity.keycloak_admin_secret` | `KEYCLOAK_ADMIN_CLIENT_SECRET` | \*\*\* | Service account secret for Keycloak Admin API | restart, sensitive |

## General

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `general.log_level` | `LOG_LEVEL` | warn | Log verbosity: debug, info, warn (default), error. DEBUG=true is shorthand for debug. | restart |
| `general.default_vm_password` | `DEFAULT_VM_PASSWORD` | \*\*\* | Default cloud-init password for new VMs | sensitive |

## Branding

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `branding.productName` | `--` | VMO Manager | Platform product name displayed in header and page title | -- |
| `branding.logoURL` | `--` | /spectrocloud-logo.png | Path or URL to platform logo image | -- |
| `branding.faviconURL` | `--` | /spectrocloud-logo.png | Path or URL to browser tab favicon | -- |
| `branding.copyrightText` | `--` | © Spectro Cloud 2026 | Copyright notice in sidebar footer | -- |
| `branding.pageTitleSuffix` | `--` |  | VMO Manager | Suffix appended to browser tab title | -- |
| `branding.loginWelcomeText` | `--` | -- | Optional welcome message shown on login redirect | -- |
| `branding.primaryColor` | `--` | #1F7A78 | Primary brand color for buttons, links, and active states | -- |
| `branding.accentColor` | `--` | #9EB277 | Accent color for sidebar highlights and secondary elements | -- |
| `branding.sidebarColor` | `--` | #043736 | Sidebar background color | -- |
| `branding.sidebarHoverColor` | `--` | #0a4c48 | Sidebar item hover/active background color | -- |
| `branding.sidebarBorderColor` | `--` | #0a4c48 | Sidebar divider line color | -- |
| `branding.headingColor` | `--` | #1F7A78 | Product name heading color in header | -- |
| `branding.pageColor` | `--` | -- | Main content area background color (empty = theme default) | -- |
| `branding.loginBannerEnabled` | `--` | false | Enable STIG-compliant consent banner before login | -- |
| `branding.loginBannerTitle` | `--` | Privacy and Consent Notice | Title text for the login consent banner | -- |
| `branding.loginBannerText` | `--` | -- | Body text for the login consent banner (plain text) | -- |
| `branding.loginBannerButtonText` | `--` | Acknowledge | Acknowledge button text on the login banner | -- |

## Infrastructure

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `infra.guest_agent_auto_install` | `GUEST_AGENT_AUTO_INSTALL` | true | Automatically inject QEMU guest agent installation into cloud-init for new VMs | -- |
| `infra.port` | `PORT` | 8080 | HTTP server listen port | read-only |
| `infra.k8s_api_server` | `K8S_API_SERVER` | https://kubernetes.default.svc.cluster.local | Kubernetes API server URL | read-only |
| `infra.ca_file` | `CA_FILE` | /etc/ssl/custom/ca.crt | Platform CA certificate path | read-only |
| `infra.data_dir` | `DATA_DIR` | /data | Directory for ephemeral runtime data (certs, branding assets) | read-only |

## Networking

| Key | Env Var | Default | Description | Flags |
|-----|---------|---------|-------------|-------|
| `network.namespace_isolation` | `VMO_NAMESPACE_ISOLATION` | true | When enabled, VMs can only use NADs from their own namespace and globally configured namespaces. When disabled, VMs can reference NADs from any namespace. | -- |
| `network.global_namespaces` | `VMO_GLOBAL_NETWORK_NAMESPACES` | default | Comma-separated list of namespaces whose NADs are available to VMs in any namespace. Only applies when namespace isolation is enabled. The 'default' namespace is always included. | -- |

