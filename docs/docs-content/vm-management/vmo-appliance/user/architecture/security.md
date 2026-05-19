# Security Model

VMO Manager is designed for air-gapped, FIPS-compliant environments. This document describes the security controls: FIPS 140-3 compliance, airgap enforcement, TLS, container security, session management, and the STIG consent banner.

## FIPS 140-3 Compliance

The Go binary is compiled with FIPS-approved cryptographic modules:

- **BoringCrypto:** `GOEXPERIMENT=boringcrypto CGO_ENABLED=1` uses BoringSSL instead of Go's standard crypto.
- **TLS cipher suites:** `NewFIPSTLSConfig()` restricts TLS to FIPS-approved cipher suites only.
- **Session cookies:** Session data is encrypted with **AES-256-GCM** before being stored in the `vmo-sid` cookie.

> **Note:** FIPS mode is indicated in the UI when the build is FIPS-compliant. The sidebar displays a FIPS badge when `fipsMode` is true in the config.

## Airgap Enforcement

The platform operates without external network access at runtime:

- **No external CDN:** All JavaScript, CSS, and fonts are bundled in the binary or served from the application.
- **No external fonts:** Typography uses fontsource (Plus Jakarta Sans, Fira Code) bundled at build time.
- **No external API calls:** The application does not call external APIs at runtime. All data comes from the cluster, Keycloak, or embedded assets.

> **Warning:** Do not configure external URLs for fonts, scripts, or APIs. The application is designed to run fully offline.

## TLS

- **Single platform CA:** All TLS certificates are signed by one platform CA via cert-manager. Components trust this CA.
- **No InsecureSkipVerify:** Production code paths do not disable TLS verification. `InsecureSkipVerify` is not used in production.
- **TLS termination:** Traefik terminates TLS at the ingress. Backend services (VMO Manager, Keycloak, Headlamp) receive plain HTTP from Traefik.

> **Tip:** Use `CA_FILE` to configure the path to the platform CA certificate for outbound TLS (e.g., to Keycloak or the K8s API).

## Container Security

VMO Manager runs with security best practices:

- **Non-root:** The container runs as a non-root user (distroless nonroot image).
- **Read-only root filesystem:** The root filesystem is mounted read-only. Writable paths (e.g., `/data`) are explicitly mounted.
- **Least-privilege RBAC:** The pod's ServiceAccount has minimal permissions. Privileged operations use explicit ClusterRole bindings.
- **No privilege escalation:** The container does not request `securityContext.allowPrivilegeEscalation`.

## Session Management

- **Encrypted cookies:** Session data is encrypted with AES-256-GCM using a 32+ character `SESSION_KEY`. The cookie contains no plaintext credentials.
- **TTL enforcement:** Sessions expire after a configured TTL. Expired sessions are rejected and the user is redirected to login.
- **1MB request body limit:** HTTP request bodies are limited to 1MB to mitigate resource exhaustion and large payload attacks.

> **Warning:** `SESSION_KEY` must be set in production. Use a cryptographically random value of at least 32 characters.

## Last Login Banner

After login, a dismissible banner displays the user's previous login time and IP address. This passive security feature helps users detect unauthorized account access. The banner appears for both OIDC and local auth users, does not show on first-ever login, and reappears on each new session.

## STIG Consent Banner

When configured, VMO Manager can display a STIG-compliant consent banner before allowing access. The banner is configured via branding settings and appears on first load. Users must acknowledge the banner before proceeding.

The consent banner text and behavior are configurable. See **Settings > Branding** for configuration options.
