---
sidebar_label: "Authentication Options"
title: "Authentication Options"
description:
  "Learn how the Alternative Authentication presets control which identity provider users authenticate against in the
  Virtual Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
sidebar_position: 23
tags: ["vmo", "vmo pack", "oidc"]
---

The Virtual Machine Orchestrator (VMO) pack authenticates users against an identity provider (IdP) that you choose with
the **Alternative Authentication** preset group in the **Presets** panel of the pack editor.

Authentication is optional to configure. If you select nothing in the **Alternative Authentication** preset group, the
pack uses Palette-managed OIDC.

Authentication is independent of the [Deployment Mode](./deployment-modes.md) selection. You can combine any
authentication option with any Deployment Mode, and selecting an authentication option never changes the network
topology.

## Available Options

The following table summarizes the authentication options. Each option has a section later on this page with the
complete list of parameters that it applies.

| **Option**                                                        | **Description**                                                                                             | **Requires**                                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| No preset selected, [Palette-Managed OIDC](#palette-managed-oidc) | The default. Palette injects the OIDC configuration from the cluster profile's Kubernetes layer.            | Nothing. Palette supplies the values.                                                      |
| [Local Auth](#local-auth)                                         | Built-in local admin accounts with no external IdP. Turns OIDC sign-in off entirely.                        | The `LOCAL_ADMIN_PASSWORD` profile variable.                                               |
| [Keycloak](#keycloak)                                             | An in-cluster Keycloak realm, which also enables user and group management through the Keycloak Admin API.  | The Keycloak pack, a configured realm, and four profile variables.                         |
| [External OIDC](#external-oidc)                                   | A third-party IdP such as Okta, Microsoft Entra ID, or Google. You supply the IdP-specific values yourself. | The `LOCAL_ADMIN_PASSWORD` profile variable and the IdP values that you enter in the YAML. |

## Values Paths

Unless stated otherwise, the parameters on this page are relative to the following values root.

```yaml
charts:
  virtual-machine-orchestrator:
    vmo-manager:
```

For example, `oidc.issuerUrl` refers to `charts.virtual-machine-orchestrator.vmo-manager.oidc.issuerUrl`.

The `{{ .spectro.var.NAME }}` notation in the tables that follow is Palette cluster profile variable syntax. Enter it in
the YAML exactly as shown and leave it in place. Palette substitutes the value of the profile variable when the cluster
deploys. Text in `<angle-brackets>` is a placeholder that you replace with a value of your own.

## Palette-Managed OIDC

Palette-managed OIDC is the default and is the recommended option for Palette-managed clusters where the Kubernetes
layer of the cluster profile has **Palette** selected as the OIDC identity provider. Refer to
[Configure OIDC](../rbac/configure_OIDC.md) for guidance on that setting.

| **Setting**                      | **Effective Value**                                                       |
| -------------------------------- | ------------------------------------------------------------------------- |
| `oidc.enabled`                   | `true`                                                                    |
| `palette.enabled`                | `true`                                                                    |
| `palette.managedOidc`            | `true`                                                                    |
| Issuer, client, callback, scopes | Injected by Palette into `appConfig.auth.oidc.*` when the cluster deploys |

Because Palette injects the OIDC configuration at deploy time, the values match the OIDC flags that the cluster's
Kubernetes API server was started with. You do not need to select a preset, and you do not need to set `oidc.issuerUrl`,
`oidc.clientId`, `oidc.clientSecret`, `oidc.callbackUrl`, or `oidc.scopes` yourself. A profile with no Alternative
Authentication preset selected deploys with Palette-managed OIDC out of the box.

:::info

Local authentication is turned off in the pack base values, so Palette-managed OIDC is the only sign-in path in this
option unless you turn local authentication on yourself. To seed a Day 0 local admin account alongside Palette-managed
OIDC, set `features.localAuth.enabled` to `true` in the pack YAML and supply the `LOCAL_ADMIN_PASSWORD` profile
variable. Refer to [Local Auth](#local-auth) for how local accounts behave.

:::

## Local Auth

Select **Local Auth** to use built-in local admin accounts with no external IdP.

This option turns Palette-managed OIDC off. It sets `palette.managedOidc` to `false`, so the values that Palette injects
into `appConfig.auth.oidc.*` are ignored, and it sets `oidc.enabled` to `false`, so OIDC sign-in is turned off entirely.
Users can no longer sign in with their Palette identity. IdP configuration left behind by other options is reset to an
empty string.

`palette.enabled` stays `true`, so Palette integration, service naming, and the Spectro Proxy route continue to work.

| **Parameter**                        | **Value Applied**                         |
| ------------------------------------ | ----------------------------------------- |
| `oidc.enabled`                       | `false`                                   |
| `oidc.issuerUrl`                     | `""`                                      |
| `oidc.clientSecret`                  | `""`                                      |
| `oidc.callbackUrl`                   | `""`                                      |
| `palette.managedOidc`                | `false`                                   |
| `identity.keycloakAdminClientSecret` | `""`                                      |
| `platform.baseUrl`                   | `""`                                      |
| `features.localAuth.enabled`         | `true`                                    |
| `features.localAuth.adminPassword`   | `{{ .spectro.var.LOCAL_ADMIN_PASSWORD }}` |

Required profile variable: `LOCAL_ADMIN_PASSWORD`.

The default local admin username is `admin`, set by `features.localAuth.adminUsername`. Local accounts sign in at the
`/local-login` path, and VMO requires a password change on first sign-in.

:::warning

Local sessions authenticate to the Kubernetes API with the VMO Manager service account token rather than with a
user-scoped token, so per-user Kubernetes RBAC does not apply to a local admin. Use local accounts for Day 0 bootstrap
and for recovery, not as the routine sign-in path.

:::

## Keycloak

Select **Keycloak** to authenticate against an in-cluster Keycloak instance. In addition to OIDC sign-in, this option
enables user and group management through the Keycloak Admin API.

The VMO pack does not deploy or manage Keycloak. You must add the Keycloak pack to your cluster profile and configure a
realm before you select this option. Access to the Keycloak admin console is managed separately from VMO.

| **Parameter**                        | **Value Applied**                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `oidc.enabled`                       | `true`                                                                       |
| `oidc.issuerUrl`                     | `https://{{ .spectro.var.PLATFORM_IP }}/iam/realms/vmo`                      |
| `oidc.clientSecret`                  | `{{ .spectro.var.OIDC_CLIENT_SECRET }}`                                      |
| `oidc.callbackUrl`                   | `https://{{ .spectro.var.PLATFORM_IP }}/auth/callback`                       |
| `palette.managedOidc`                | `false`                                                                      |
| `identity.keycloakAdminClientSecret` | `{{ .spectro.var.KEYCLOAK_ADMIN_CLIENT_SECRET }}`                            |
| `platform.baseUrl`                   | `https://{{ .spectro.var.PLATFORM_IP }}`                                     |
| `features.localAuth.enabled`         | `false`. Keycloak becomes the only sign-in path.                             |
| `features.localAuth.adminPassword`   | `{{ .spectro.var.KEYCLOAK_ADMIN_PASSWORD }}`, unused while local auth is off |

Required profile variables: `PLATFORM_IP`, `OIDC_CLIENT_SECRET`, `KEYCLOAK_ADMIN_CLIENT_SECRET`, and
`KEYCLOAK_ADMIN_PASSWORD`. Define all four in the profile even though the password is unused, because the preset
references it and the profile does not render with an undefined variable.

To keep a Day 0 local admin account as a fallback, set `features.localAuth.enabled` back to `true` in the pack YAML
after you select this option.

## External OIDC

Select **External OIDC** to authenticate against a third-party IdP such as Okta, Microsoft Entra ID, or Google. This
option sets the authentication mode flags only. You supply the IdP-specific values yourself.

| **Parameter**                      | **Value Applied**                                |
| ---------------------------------- | ------------------------------------------------ |
| `oidc.enabled`                     | `true`                                           |
| `palette.managedOidc`              | `false`                                          |
| `features.localAuth.enabled`       | `false`. Your IdP becomes the only sign-in path. |
| `features.localAuth.adminPassword` | `{{ .spectro.var.LOCAL_ADMIN_PASSWORD }}`        |

Required profile variable: `LOCAL_ADMIN_PASSWORD`. Define it in the profile even if you do not intend to use a local
admin account, because the preset references it.

:::warning

This option turns local authentication off, so an IdP outage locks every user out of the VM management UI. To keep a Day
0 local admin account as a fallback, set `features.localAuth.enabled` back to `true` in the pack YAML after you select
this option, and set `LOCAL_ADMIN_PASSWORD` to a strong password. Refer to
[Bootstrap Order](./configure-external-oidc.md#bootstrap-order) for the recommended sequence.

:::

You must set the following parameters in the pack YAML yourself, because they are specific to your IdP.

| **Parameter**       | **Description**                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `oidc.issuerUrl`    | The issuer URL of your IdP. For example, `https://login.microsoftonline.com/<tenant>/v2.0`.                               |
| `oidc.clientId`     | The client ID registered with your IdP. The pack default is `k8s-oidc`.                                                   |
| `oidc.clientSecret` | The client secret issued by your IdP. The pack renders this value into a Kubernetes Secret.                               |
| `oidc.callbackUrl`  | The callback URL. Set this only when the UI is behind a proxy and the default `<baseUrl>/auth/callback` is not reachable. |
| `platform.baseUrl`  | The URL that users reach the UI at. Required in **Direct** mode.                                                          |

The following parameter is optional and applies to specific deployment scenarios.

| **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oidc.k8sNotFederated` | Defaults to `false`. Set to `true` when the Kubernetes API server is not federated with the same OIDC issuer as VMO. Refer to [Configure Non-Federated Kubernetes API Servers](./configure-external-oidc.md#configure-non-federated-kubernetes-api-servers) for the behavior it changes and the security trade-off. |

Refer to [Configure External OIDC](./configure-external-oidc.md) for a complete procedure that uses Okta as the example
IdP.

:::info

User and group management is only available with the **Keycloak** option, which uses the Keycloak Admin API. With
**External OIDC**, sign-in works but you manage users and groups in your IdP and map them to roles with Kubernetes role
bindings.

:::

## Switch Between Authentication Options

The pack decides which OIDC values to use based on `palette.managedOidc`, not on `palette.enabled`. The value of
`palette.enabled` stays `true` in every authentication option, so Palette integration, service naming, and RBAC continue
to work. Only `palette.managedOidc` changes.

| **Option Selected**                      | **`palette.enabled`** | **`palette.managedOidc`** | **OIDC Values Used**                                   |
| ---------------------------------------- | --------------------- | ------------------------- | ------------------------------------------------------ |
| No preset selected, Palette-managed OIDC | `true`                | `true`                    | The `appConfig.auth.oidc.*` values injected by Palette |
| Local Auth                               | `true`                | `false`                   | None. OIDC is turned off.                              |
| Keycloak                                 | `true`                | `false`                   | The `oidc.*` values, populated from profile variables  |
| External OIDC                            | `true`                | `false`                   | The `oidc.*` values that you enter in the YAML         |

To return to Palette-managed OIDC after you select an alternative option, clear the preset selection. Clearing it sets
`palette.managedOidc` back to `true`, and the Palette-injected `appConfig.auth.oidc.*` values take precedence again. You
do not need to manually blank out the `oidc.*` values.

Selecting an option never deletes keys from the YAML. IdP-specific fields that the selected option does not use are
reset to an empty string so that the key stays visible. An empty string is equivalent to unset.

**External OIDC** is the only option that does not reset IdP keys. Switching from **External OIDC** to **Local Auth**
resets them for you, and switching to **Keycloak** overwrites them with the Keycloak values.

## Profile Variables

Set the following variables in the **Variables** panel of the cluster profile. Refer to
[Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
for guidance on defining variables.

| **Variable**                   | **Used By**                  | **Purpose**                                                                                                                                                                                                       |
| ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOCAL_ADMIN_PASSWORD`         | Local Auth and External OIDC | The Day 0 local admin password. The **Local Auth** option applies it directly. The **External OIDC** option references it, but local authentication is off in that option unless you turn it back on in the YAML. |
| `PLATFORM_IP`                  | Keycloak                     | The hostname or IP address used to build the Keycloak issuer URL, the callback URL, and `platform.baseUrl`.                                                                                                       |
| `OIDC_CLIENT_SECRET`           | Keycloak                     | The OIDC client secret registered with the Keycloak realm.                                                                                                                                                        |
| `KEYCLOAK_ADMIN_CLIENT_SECRET` | Keycloak                     | The client secret for the `vmo-admin` service account, which enables user and group management and API keys.                                                                                                      |
| `KEYCLOAK_ADMIN_PASSWORD`      | Keycloak                     | The local admin password that the **Keycloak** option templates into the values. It has no effect while local authentication is off.                                                                              |

## Supported Combinations

All combinations of Deployment Mode and authentication are supported. The following table describes the most common
ones.

| **Deployment Mode** | **Authentication**                       | **UI Access**                                                 | **Sign-in Source**                             | **Notes**                                                          |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| Proxied             | No preset selected, Palette-managed OIDC | Palette through the Spectro Proxy                             | Palette-managed OIDC from the Kubernetes layer | Recommended default for clusters behind a firewall.                |
| Proxied             | Local Auth                               | Palette through the Spectro Proxy                             | `admin` and `LOCAL_ADMIN_PASSWORD`             | Airgapped environments, or environments with no IdP.               |
| Proxied             | Keycloak                                 | Palette through the Spectro Proxy                             | Keycloak realm                                 | Requires the Keycloak pack, a realm, and the profile variables.    |
| Direct              | No preset selected, Palette-managed OIDC | Load balancer, node port, or the Traefik `directAccess` route | Palette-managed OIDC                           | The callback root uses `appConfig.clusterInfo.consoleBaseAddress`. |
| Direct              | External OIDC                            | Load balancer or node port                                    | Your IdP                                       | Set `platform.baseUrl` so that the redirect URI can be built.      |
| Custom              | Any                                      | Whatever you configure                                        | Whatever you configure                         | No values are applied for you.                                     |

## Troubleshooting

### Scenario - Preset Save Fails with Undefined Variables

Selecting the **Keycloak** or **External OIDC** preset in the **Alternative Authentication** group can fail to save with
an error similar to the following.

```text hideClipboard title="Example error"
An error occurred while trying to update the profiles. Pack 'virtual-machine-orchestrator' has variables 'spectro.var.PLATFORM_IP,spectro.var.KEYCLOAK_ADMIN_PASSWORD,spectro.var.KEYCLOAK_ADMIN_CLIENT_SECRET,spectro.var.OIDC_CLIENT_SECRET' undefined
```

Each preset templates `spectro.var.*` references into the pack YAML that expect matching profile variables on the
cluster profile. If the profile does not define one of them, the preset fails to render. Define every profile variable
named in the error before selecting the preset again. Refer to [Profile Variables](#profile-variables) for the full list
each preset requires. Set the variable to any non-empty string even when you do not intend to use it (for example,
`KEYCLOAK_ADMIN_PASSWORD` when local authentication stays off).

### Scenario - OIDC Sign-in Fails

Verify that `oidc.issuerUrl`, `oidc.clientId`, `oidc.clientSecret`, and `oidc.callbackUrl` are all populated. The
callback URL must match the redirect URI registered with your IdP and must be reachable from the user's browser. Confirm
that `platform.baseUrl` matches the URL that users enter in the browser.

If the UI reads **Authentication service unavailable** rather than redirecting to the IdP, the OIDC provider failed to
initialize because the pack has no issuer URL. Refer to
[Authentication Service Unavailable at Sign-in](./configure-external-oidc.md#scenario---authentication-service-unavailable-at-sign-in)
for the fix, which typically involves setting `palette.managedOidc: false` and populating the `oidc.*` values explicitly
when the IdP is external.

### Scenario - No One Can Sign In After Selecting an Option

The **Keycloak** and **External OIDC** options turn local authentication off, so an IdP outage or a misconfigured issuer
URL leaves no way to reach the UI. Set `features.localAuth.enabled` to `true` in the pack YAML, supply the matching
password variable, and save the profile to restore local sign-in at the `/local-login` path.

## Next Steps

If you selected **External OIDC**, refer to [Configure External OIDC](./configure-external-oidc.md) to register the
application with your IdP and map groups to roles.

For the parameters that no authentication option changes, refer to [VMO Pack Parameters](./vmo-pack-parameters.md). To
apply your selections, refer to [Create a VMO Profile](./create-vmo-profile.md).
