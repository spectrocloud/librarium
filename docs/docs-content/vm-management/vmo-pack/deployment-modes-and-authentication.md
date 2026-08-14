---
sidebar_label: "Deployment Modes and Authentication"
title: "Deployment Modes and Authentication"
description:
  "Learn how the Deployment Mode and Alternative Authentication selections control network access and identity for the
  Virtual Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
sidebar_position: 22
tags: ["vmo", "vmo pack", "oidc"]
---

<!-- prettier-ignore-start -->

The Virtual Machine Orchestrator (VMO) pack is configured along two independent dimensions. Refer to the <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
documentation for the full list of parameters that the pack exposes.

<!-- prettier-ignore-end -->

- **Deployment Mode** controls the network and access topology. It determines how the VM management UI is reached,
  whether TLS is provisioned by the pack, and whether the Spectro Proxy pack is required. Deployment Mode is a pack
  parameter and appears as a radio button group at the top of the pack settings.

- **Alternative Authentication** controls the identity provider that users authenticate against. Alternative
  Authentication is a preset group and appears in the **Presets** panel of the pack editor.

You can combine any Deployment Mode with any authentication option. No combination is blocked.

Selections seed values, they do not lock them. Every value remains editable in the pack YAML after you make a selection.

:::warning

We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default
settings can introduce misconfigurations. Carefully review the changes you make to a pack.

:::

## Values Paths

Unless stated otherwise, the parameters on this page are relative to the following values root.

```yaml
charts:
  virtual-machine-orchestrator:
    vmo-manager:
```

For example, `oidc.issuerUrl` refers to `charts.virtual-machine-orchestrator.vmo-manager.oidc.issuerUrl`. Parameters
that sit outside this root, such as `charts.virtual-machine-orchestrator.directAccess.enabled`, are listed with their
full path.

## Deployment Mode

Deployment Mode controls network topology only. It never changes authentication.

### Proxied

Use **Proxied** when the cluster is behind a firewall or NAT and Palette cannot reach it directly. The Spectro Proxy
pack provides remote access to the UI. This is the default selection.

| **Setting**                                                | **Value Applied**                                                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Pack dependency                                            | Adds the `spectro-proxy` pack with `manifests.spectro-proxy.vmDashboardIntegration.enabled` set to `true` |
| `pack.spectrocloud.com/install-priority`                   | `90`, so that VMO installs before the Spectro Proxy pack                                                  |
| `palette.enabled`                                          | `true`                                                                                                    |
| `palette.managedIngress`                                   | `true`                                                                                                    |
| `palette.serviceName`                                      | `vm-dashboard`, which Palette requires                                                                    |
| `service.type`                                             | `ClusterIP`, because the Spectro Proxy pack tunnels to the service inside the cluster                     |
| `tls.enabled`                                              | `true`                                                                                                    |
| `tls.certManager.enabled`                                  | `true`                                                                                                    |
| `tls.certManager.selfSigned`                               | `true`                                                                                                    |
| `caCert.enabled`                                           | `true`                                                                                                    |
| `caCert.configMapName`                                     | `platform-ca-cert`                                                                                        |
| `ingressRoute.enabled`                                     | `false`, because the UI is reached through the Spectro Proxy pack rather than Traefik                     |
| `charts.virtual-machine-orchestrator.directAccess.enabled` | `true`, which provides a Traefik route for CDI uploads and VM export                                      |

The serving certificate in this mode is only consumed by the in-cluster proxy. The pack therefore uses a chart-managed
self-signed `ClusterIssuer` rather than depending on an external `platform-ca-issuer` that might not exist on every
cluster.

### Direct

Use **Direct** when the cluster is directly reachable from Palette, with no firewall or NAT between Palette and the
cluster network. No proxy is required.

| **Setting**                                                | **Value Applied**                                                                      |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `palette.enabled`                                          | `true`                                                                                 |
| `palette.managedIngress`                                   | `false`                                                                                |
| `palette.serviceName`                                      | `vm-dashboard`                                                                         |
| `service.type`                                             | `LoadBalancer`. Use `NodePort` instead on bare metal clusters without a load balancer. |
| `tls.enabled`                                              | `true`                                                                                 |
| `tls.certManager.enabled`                                  | `true`                                                                                 |
| `tls.certManager.selfSigned`                               | `true`                                                                                 |
| `caCert.enabled`                                           | `true`                                                                                 |
| `caCert.configMapName`                                     | `platform-ca-cert`                                                                     |
| `ingressRoute.enabled`                                     | `false`, because `directAccess` owns the route                                         |
| `charts.virtual-machine-orchestrator.directAccess.enabled` | `true`                                                                                 |

If you combine **Direct** with the **External OIDC** authentication option, you must also set `platform.baseUrl` to the
URL that users reach the UI at, so that VMO can build the OIDC redirect URI.

```yaml
charts:
  virtual-machine-orchestrator:
    vmo-manager:
      platform:
        baseUrl: "https://<lb-ip-or-dns>"
```

Palette-managed OIDC in **Direct** mode uses `appConfig.clusterInfo.consoleBaseAddress` automatically and requires no
additional configuration. Refer to [Configure Direct Access to VM Dashboard](./configure-console-base-address.md) for
guidance on setting that address.

### Custom

**Custom** applies no Deployment Mode values. The pack base values are used as-is, and nothing is overwritten when you
save the profile. Configure `palette.*`, `service.*`, `tls.*`, `ingressRoute.*`, and `caCert.*` directly in the YAML.

Use **Custom** for environments that Palette does not manage, or when you supply your own Traefik configuration. You can
still select an authentication option from the **Presets** panel in this mode.

## Authentication

Authentication is optional to configure. If you select nothing in the **Alternative Authentication** preset group, the
pack uses Palette-managed OIDC.

### Palette-Managed OIDC

Palette-managed OIDC is the default and is the recommended option for Palette-managed clusters where the Kubernetes
layer of the cluster profile has **Palette** selected as the OIDC Identity Provider. Refer to
[Configure OIDC](../rbac/configure_OIDC.md) for guidance on that setting.

| **Setting**                      | **Effective Value**                                                       |
| -------------------------------- | ------------------------------------------------------------------------- |
| `oidc.enabled`                   | `true`                                                                    |
| `palette.enabled`                | `true`                                                                    |
| `palette.managedOidc`            | `true`                                                                    |
| Issuer, client, callback, scopes | Injected by Palette into `appConfig.auth.oidc.*` when the cluster deploys |

Because Palette injects the OIDC configuration at deploy time, the values match the OIDC flags that the cluster's
Kubernetes API server was started with. You do not need to select a preset or enter any values for this to work.

:::info

Local authentication remains available as a Day 0 fallback in this mode. When `palette.enabled` is `true`, the pack
enables local authentication at runtime regardless of the `features.localAuth.enabled` value in the YAML. If you supply
the `LOCAL_ADMIN_PASSWORD` profile variable, VMO seeds a local admin account so that an operator can sign in before OIDC
users are mapped to roles. Leave `LOCAL_ADMIN_PASSWORD` empty if you want a cluster with no local sign-in.

:::

### Local Auth

Select **Local Auth** to use built-in local admin accounts with no external identity provider. OIDC is turned off, and
provider configuration left behind by other options is reset to an empty string.

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

The default local admin username is `admin`, set by `features.localAuth.adminUsername`.

### Keycloak

Select **Keycloak** to authenticate against an in-cluster Keycloak instance. In addition to OIDC sign-in, this option
enables user and group management through the Keycloak Admin API.

The VMO pack does not deploy or manage Keycloak. You must add the Keycloak pack to your cluster profile and configure a
realm before you select this option. Access to the Keycloak admin console is managed separately from VMO.

| **Parameter**                        | **Value Applied**                                       |
| ------------------------------------ | ------------------------------------------------------- |
| `oidc.enabled`                       | `true`                                                  |
| `oidc.issuerUrl`                     | `https://{{ .spectro.var.PLATFORM_IP }}/iam/realms/vmo` |
| `oidc.clientSecret`                  | `{{ .spectro.var.OIDC_CLIENT_SECRET }}`                 |
| `oidc.callbackUrl`                   | `https://{{ .spectro.var.PLATFORM_IP }}/auth/callback`  |
| `palette.managedOidc`                | `false`                                                 |
| `identity.keycloakAdminClientSecret` | `{{ .spectro.var.KEYCLOAK_ADMIN_CLIENT_SECRET }}`       |
| `platform.baseUrl`                   | `https://{{ .spectro.var.PLATFORM_IP }}`                |
| `features.localAuth.enabled`         | `true`, as a Day 0 fallback                             |
| `features.localAuth.adminPassword`   | `{{ .spectro.var.KEYCLOAK_ADMIN_PASSWORD }}`            |

Required profile variables: `PLATFORM_IP`, `OIDC_CLIENT_SECRET`, `KEYCLOAK_ADMIN_CLIENT_SECRET`, and
`KEYCLOAK_ADMIN_PASSWORD`.

### External OIDC

Select **External OIDC** to authenticate against a third-party identity provider such as Okta, Microsoft Entra ID, or
Google. This option sets the authentication mode flags only. You supply the provider-specific values yourself. Local
authentication remains on as a fallback.

| **Parameter**                      | **Value Applied**                         |
| ---------------------------------- | ----------------------------------------- |
| `oidc.enabled`                     | `true`                                    |
| `palette.managedOidc`              | `false`                                   |
| `features.localAuth.enabled`       | `true`, as a fallback                     |
| `features.localAuth.adminPassword` | `{{ .spectro.var.LOCAL_ADMIN_PASSWORD }}` |

Required profile variable: `LOCAL_ADMIN_PASSWORD`.

You must set the following parameters in the pack YAML yourself, because they are specific to your provider.

| **Parameter**       | **Description**                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `oidc.issuerUrl`    | The issuer URL of your IdP. For example, `https://login.microsoftonline.com/<tenant>/v2.0`.                          |
| `oidc.clientId`     | The client ID registered with your provider. The pack default is `k8s-oidc`.                                              |
| `oidc.clientSecret` | The client secret issued by your provider. The pack renders this value into a Kubernetes Secret.                          |
| `oidc.callbackUrl`  | The callback URL. Set this only when the UI is behind a proxy and the default `<baseUrl>/auth/callback` is not reachable. |
| `platform.baseUrl`  | The URL that users reach the UI at. Required in **Direct** mode.                                                          |

Refer to [Configure External OIDC](./configure-external-oidc.md) for a complete procedure that uses Okta as the example
provider.

:::info

User and group management is only available with the **Keycloak** option, which uses the Keycloak Admin API. With
**External OIDC**, sign-in works but you manage users and groups in your provider and map them to roles with Kubernetes
role bindings.

:::

## Switch Between Authentication Options

The pack decides which OIDC values to use based on `palette.managedOidc`, not on `palette.enabled`. The value of
`palette.enabled` stays `true` in every authentication option, so Palette integration, service naming, and RBAC continue
to work. Only `palette.managedOidc` changes.

| **Option Selected**        | **`palette.enabled`** | **`palette.managedOidc`** | **OIDC Values Used**                                   |
| -------------------------- | --------------------- | ------------------------- | ------------------------------------------------------ |
| None, Palette-managed OIDC | `true`                | `true`                    | The `appConfig.auth.oidc.*` values injected by Palette |
| Local Auth                 | `true`                | `false`                   | None. OIDC is turned off.                              |
| Keycloak                   | `true`                | `false`                   | The `oidc.*` values, populated from profile variables  |
| External OIDC              | `true`                | `false`                   | The `oidc.*` values that you enter in the YAML         |

To return to Palette-managed OIDC after you select an alternative option, clear the preset selection. Clearing it sets
`palette.managedOidc` back to `true`, and the Palette-injected `appConfig.auth.oidc.*` values take precedence again. You
do not need to manually blank out the `oidc.*` values.

Selecting an option never deletes keys from the YAML. Provider-specific fields that the selected option does not use are
reset to an empty string so that the key stays visible. An empty string is equivalent to unset.

**External OIDC** is the only option that does not reset provider keys. Switching from **External OIDC** to **Local
Auth** resets them for you, and switching to **Keycloak** overwrites them with the Keycloak values.

## Profile Variables

Set the following variables in the **Variables** panel of the cluster profile. Refer to
[Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
for guidance on defining variables.

| **Variable**                   | **Used By**                                 | **Purpose**                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOCAL_ADMIN_PASSWORD`         | Pack default, Local Auth, and External OIDC | Day 0 local admin password. Supplying it seeds a local admin under every authentication option, including Palette-managed OIDC. Leave it empty for a cluster with no local sign-in. |
| `PLATFORM_IP`                  | Keycloak                                    | The hostname or IP address used to build the Keycloak issuer URL, the callback URL, and `platform.baseUrl`.                                                                         |
| `OIDC_CLIENT_SECRET`           | Keycloak                                    | The OIDC client secret registered with the Keycloak realm.                                                                                                                          |
| `KEYCLOAK_ADMIN_CLIENT_SECRET` | Keycloak                                    | The client secret for the `vmo-admin` service account, which enables user and group management and API keys.                                                                        |
| `KEYCLOAK_ADMIN_PASSWORD`      | Keycloak                                    | The password for the Day 0 local admin when you use the Keycloak option.                                                                                                            |

## Supported Combinations

All combinations of Deployment Mode and authentication are supported. The following table describes the most common
ones.

| **Deployment Mode** | **Authentication**         | **UI Access**                                                 | **Sign-in Source**                                 | **Notes**                                                          |
| ------------------- | -------------------------- | ------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| Proxied             | None, Palette-managed OIDC | Palette through the Spectro Proxy                             | Palette-managed OIDC from the Kubernetes layer     | Recommended default for clusters behind a firewall.                |
| Proxied             | Local Auth                 | Palette through the Spectro Proxy                             | `admin` and `LOCAL_ADMIN_PASSWORD`                 | Airgapped environments, or environments with no identity provider. |
| Proxied             | Keycloak                   | Palette through the Spectro Proxy                             | Keycloak realm, with the local admin as a fallback | Requires the Keycloak pack, a realm, and the profile variables.    |
| Direct              | None, Palette-managed OIDC | Load balancer, node port, or the Traefik `directAccess` route | Palette-managed OIDC                               | The callback root uses `appConfig.clusterInfo.consoleBaseAddress`. |
| Direct              | External OIDC              | Load balancer or node port                                    | Your identity provider                             | Set `platform.baseUrl` so that the redirect URI can be built.      |
| Custom              | Any                        | Whatever you configure                                        | Whatever you configure                             | No values are applied for you.                                     |

## Pack Defaults

The following parameters come from the pack base values and are not changed by any Deployment Mode or authentication
selection. Override them directly in the pack YAML when needed.

### Deployment

| **Parameter**                    | **Default**                                           | **Description**                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `deployment.replicaCount`        | `1`                                                   | Set to `3` for high availability on multi-node control planes. Anti-affinity and the pod disruption budget turn on automatically when the count is greater than 1. |
| `service.port`                   | `8080`                                                |                                                                                                                                                                    |
| `oidc.clientId`                  | `k8s-oidc`                                            |                                                                                                                                                                    |
| `oidc.scopes`                    | `""`, which resolves to `openid,profile,email,groups` | The `groups` scope is always requested, even if you omit it from this list.                                                                                        |
| `oidc.k8sUsernameClaim`          | `email`                                               | Must match the Kubernetes API server `--oidc-username-claim` flag. Palette clusters use `email`.                                                                   |
| `platform.cdiProxyUrl`           | `https://cdi-uploadproxy.cdi.svc.cluster.local`       |                                                                                                                                                                    |
| `platform.caFile`                | `/etc/ssl/custom/ca.crt`                              |                                                                                                                                                                    |
| `identity.keycloakAdminClientId` | `vmo-admin`                                           |                                                                                                                                                                    |
| `logging.level`                  | `info`                                                | Set to `debug` to troubleshoot bootstrap, leader election, and identity seeding.                                                                                   |
| `secrets.create`                 | `true`                                                | Generates the session key on first install and preserves it across upgrades.                                                                                       |
| `features.guestAgentAutoInstall` | `true`                                                | Injects the QEMU guest agent through cloud-init.                                                                                                                   |
| `goldenImagesNamespace`          | `vmo-golden-images`                                   |                                                                                                                                                                    |

### TLS and Ingress

| **Parameter**                 | **Base Default**     | **After Proxied or Direct**         |
| ----------------------------- | -------------------- | ----------------------------------- |
| `tls.enabled`                 | `false`              | `true`                              |
| `tls.certManager.enabled`     | `false`              | `true`                              |
| `tls.certManager.selfSigned`  | `false`              | `true`                              |
| `tls.certManager.issuerName`  | `platform-ca-issuer` | Ignored when `selfSigned` is `true` |
| `tls.certManager.duration`    | `8760h`, or one year | Unchanged                           |
| `tls.certManager.renewBefore` | `720h`, or 30 days   | Unchanged                           |
| `ingressRoute.enabled`        | `true`               | `false`                             |
| `ingress.enabled`             | `false`              | Unchanged                           |

### Audit and Metrics

| **Parameter**                    | **Default** | **Description**                                                                                  |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `audit.retentionDays`            | `30`        | Set to `0` to disable the cleanup CronJob. Audit events then accumulate without limit.           |
| `audit.cleanupSchedule`          | `0 0 * * *` | Runs daily at midnight UTC. Ignored when `audit.retentionDays` is `0`.                           |
| `metrics.externalMetricsEnabled` | `false`     | Enable to query an external PromQL backend, such as Victoria Metrics or Thanos, for long ranges. |
| `metrics.retentionDays`          | `30`        | Internal metric retention.                                                                       |
| `metrics.ringBufferRetention`    | `30m`       | In-memory buffer used when the external backend is unavailable.                                  |

### Components

Every component in the pack can be turned on or off independently. This is useful when a component is already installed
on the cluster or is managed by another team.

| **Component**               | **Parameter**                       | **Default** |
| --------------------------- | ----------------------------------- | ----------- |
| VMO Manager                 | `vmo-manager.enabled`               | `true`      |
| VMO Manager CRDs            | `vmo-manager-crds.enabled`          | `true`      |
| KubeVirt                    | `kubevirt.enabled`                  | `true`      |
| Containerized Data Importer | `cdi.enabled`                       | `true`      |
| Multus                      | `multus.enabled`                    | `true`      |
| Snapshot controller         | `snapshot-controller.enabled`       | `true`      |
| Descheduler                 | `descheduler.enabled`               | `true`      |
| Node agent DaemonSet        | `vmo-manager.nodeAgent.enabled`     | `true`      |
| Cilium NetworkPolicy        | `vmo-manager.networkPolicy.enabled` | `false`     |
| VLAN filtering DaemonSet    | `vlanFiltering.enabled`             | `false`     |
| Post-delete cleanup job     | `cleanup.enabled`                   | `true`      |

The parameters in this table are relative to `charts.virtual-machine-orchestrator`, not to the `vmo-manager` sub-chart.

Enable `vmo-manager.networkPolicy.enabled` only on clusters that use Cilium as the CNI.

## Troubleshooting

### Scenario - Keys Move or Comments Disappear After a Save

When you make a Deployment Mode or authentication selection, Palette merges the change into your values and rewrites the
YAML. A key that the selection touches, such as `oidc.enabled` or `features.localAuth.enabled`, can move within its map,
and a comment next to it can be left behind.

This behavior is cosmetic and applies to every pack that uses presets. The resulting values are correct.

### Scenario - OIDC Sign-in Fails

Verify that `oidc.issuerUrl`, `oidc.clientId`, `oidc.clientSecret`, and `oidc.callbackUrl` are all populated. The
callback URL must match the redirect URI registered with your identity provider and must be reachable from the user's
browser. Confirm that `platform.baseUrl` matches the URL that users enter in the browser.

### Scenario - The Service Is Not Reachable in Direct Mode

Ensure that `service.type` is `NodePort` or `LoadBalancer` rather than `ClusterIP`, unless an ingress controller routes
traffic to the service. Verify that the cluster network allows inbound connections from both Palette and end users.

### Scenario - TLS Certificate Errors

The **Proxied** and **Direct** modes set `tls.certManager.selfSigned` to `true`, which avoids a dependency on a
`platform-ca-issuer` that may be missing. If you set `tls.certManager.selfSigned` to `false`, ensure that both the
`platform-ca-issuer` ClusterIssuer and the `platform-ca-cert` ConfigMap exist in the cluster. Palette provisions these
when the cluster is created with the platform CA components enabled.

In **Custom** mode, either configure your own issuer or set `tls.existingSecret` to the name of a Secret that holds your
certificate.

### Scenario - The Spectro Proxy Does Not Connect

Confirm that the `spectro-proxy` pack is present in the cluster profile and that `vmDashboardIntegration.enabled` is
`true` in its configuration. The VMO Manager service must be named `vm-dashboard`, and its pods must carry the
`spectrocloud.com/connection: proxy` label. Both are set automatically when `palette.enabled` is `true`.

## Next Steps

Once you decide on a Deployment Mode and an authentication option, apply them when you build your add-on profile. Refer
to [Create a VMO Profile](./create-vmo-profile.md) for the profile creation steps.

If you selected **External OIDC**, refer to [Configure External OIDC](./configure-external-oidc.md) to register the
application with your identity provider and map groups to roles.
