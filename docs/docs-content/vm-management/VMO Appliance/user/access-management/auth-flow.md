# Auth Flow Overview

This document describes the authentication flow in VMO Manager and the interactive Auth Flow Diagram in Settings.

## Interactive Auth Flow Diagram

In **Settings > Access Management**, an interactive React/SVG diagram visualizes the authentication chain. The diagram adapts to your deployment mode and current user.

### The Access Chain

The diagram shows the flow:

**Browser -> Identity Provider -> VMO Manager -> K8s API**

| Step | Description |
|------|-------------|
| **Browser** | User initiates login. Displays your username or email. |
| **Identity Provider** | Keycloak (or Palette/VerteX proxy in managed environments). Handles OIDC login and token issuance. |
| **VMO Manager** | Receives tokens, creates session, enforces IAM permissions. |
| **K8s API** | VMO Manager forwards requests using the user's OIDC token (or pod SA token for local auth). |

### Auth Modes

The diagram reflects the current auth mode:

- **Keycloak** — Direct OIDC with Keycloak. Browser redirects to Keycloak, receives tokens, VMO creates session.
- **Palette/VerteX proxy** — When deployed via Palette, the proxy sits between browser and IdP. Tokens flow through the proxy.
- **Local** — No IdP. Browser sends credentials directly to VMO Manager. Session uses SA token for K8s access.

## Access Mapping Visualization

Below the auth flow, the **Access Mapping** section shows how your access is derived:

**Group -> VMO Role -> K8s ClusterRole -> Namespace**

| Column | Description |
|--------|-------------|
| **Groups** | OIDC groups you belong to. Your groups are highlighted. Unmapped groups have no VMO role. |
| **Roles** | VMO IAM roles (Platform Admin, Editor, Operator, Viewer). Mapped from groups. |
| **ClusterRoles** | Kubernetes ClusterRoles (spectro-vmo-admin, spectro-vmo-power-user, spectro-vmo-user, spectro-vmo-viewer). Mapped from VMO roles. |
| **Namespaces** | Namespaces where you have access. Cluster-wide (All Namespaces) or scoped per namespace. |

### Click-to-Highlight Traversal

Click a card in any column to highlight the connected path:

- Click a group to see which role(s) it maps to; which ClusterRole(s); which namespace(s).
- Click a role to see which groups map to it; which ClusterRole; which namespaces.
- Click a ClusterRole to see which roles map to it; which groups; which namespaces.
- Click a namespace to see which ClusterRoles grant access; which groups; which roles.

### Subject-Aware Filtering

The diagram is **subject-aware**: it shows only the groups, roles, and policies relevant to the current user. Your groups are marked with a visual indicator. Unmapped groups (no VMO role mapping) are shown so you can identify gaps.

### Local Auth

When logged in as a local user, the diagram shows:

- **Local Admin** group
- **Platform Admin** VMO role
- **spectro-vmo-admin** ClusterRole
- **All Namespaces** scope

Local users bypass OIDC and use the pod's service account token for Kubernetes API calls.

## Last Login Banner

After a successful login (OIDC or local auth), a dismissible info banner appears at the top of the page. It shows the **last login time** and **last login IP address** from your previous session. This helps you detect unauthorized access: if the displayed time or IP does not match your own activity, someone else may have used your account.

You can dismiss the banner with the X button. Dismissal persists for the current browser session only; the banner reappears on each new login or when you open a new tab. On first-ever login, the banner does not appear because no previous login data exists. Dates and times use locale-aware formatting based on your language preference.
