---
sidebar_label: "Deployment Modes"
title: "Deployment Modes"
description:
  "Learn how the Deployment Mode selection controls the network topology, TLS, and proxy requirements of the Virtual
  Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
sidebar_position: 22
tags: ["vmo", "vmo pack"]
---

<!-- prettier-ignore-start -->

The Virtual Machine Orchestrator (VMO) pack is configured along two independent dimensions. Refer to the <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
documentation for the full list of parameters that the pack exposes.

<!-- prettier-ignore-end -->

- **Deployment Mode** controls the network and access topology. It determines how the VM management UI is reached,
  whether TLS is provisioned by the pack, and whether the Spectro Proxy pack is required. Deployment Mode is a pack
  parameter and appears as a radio button group at the top of the pack settings. This page describes each mode.

- **Alternative Authentication** controls the identity provider (IdP) that users authenticate against. Alternative
  Authentication is a preset group and appears in the **Presets** panel of the pack editor. Refer to
  [Authentication Options](./authentication-options.md) for guidance.

You can combine any Deployment Mode with any authentication option. No combination is blocked. Deployment Mode controls
network topology only. It never changes authentication.

Selections seed values. They do not lock them. Every value remains editable in the pack YAML after you make a selection.

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

For example, `tls.enabled` refers to `charts.virtual-machine-orchestrator.vmo-manager.tls.enabled`. Parameters that sit
outside this root, such as `charts.virtual-machine-orchestrator.directAccess.enabled`, are listed with their full path.

Two notations appear in the parameter tables in this section of the documentation.

- `<angle-brackets>` marks a placeholder. Replace it, and the brackets, with a value of your own.

- `{{ .spectro.var.NAME }}` is Palette cluster profile variable syntax. Enter it in the YAML exactly as shown and leave
  it in place. Palette substitutes the value of the profile variable when the cluster deploys. Refer to
  [Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  for guidance.

## Proxied

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

## Direct

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

If you combine **Direct** with the [External OIDC](./authentication-options.md#external-oidc) authentication option, you
must also set `platform.baseUrl` to the URL that users reach the UI at, so that VMO can build the OIDC redirect URI.

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

## Custom

**Custom** applies no Deployment Mode values. The pack base values are used as-is, and nothing is overwritten when you
save the profile. Configure `palette.*`, `service.*`, `tls.*`, `ingressRoute.*`, and `caCert.*` directly in the YAML.

Use **Custom** for environments that Palette does not manage, or when you supply your own Traefik configuration. You can
still select an authentication option from the **Presets** panel in this mode.

## Troubleshooting

### Scenario - Keys Move or Comments Disappear After a Save

When you make a Deployment Mode or authentication selection, Palette merges the change into your values and rewrites the
YAML. A key that the selection touches, such as `oidc.enabled` or `features.localAuth.enabled`, can move within its map,
and a comment next to it can be left behind.

This behavior is cosmetic and applies to every pack that uses presets. The resulting values are correct.

### Scenario - The Service Is Not Reachable in Direct Mode

Ensure that `service.type` is `NodePort` or `LoadBalancer` rather than `ClusterIP`, unless an ingress controller routes
traffic to the service. Verify that the cluster network allows inbound connections from both Palette and end users.

### Scenario - TLS Certificate Errors

The **Proxied** and **Direct** modes set `tls.certManager.selfSigned` to `true`, which avoids a dependency on a
`platform-ca-issuer` that might be missing. If you set `tls.certManager.selfSigned` to `false`, ensure that both the
`platform-ca-issuer` ClusterIssuer and the `platform-ca-cert` ConfigMap exist in the cluster. Palette provisions these
when the cluster is created with the platform CA components enabled.

In **Custom** mode, either configure your own issuer or set `tls.existingSecret` to the name of a Secret that holds your
certificate.

### Scenario - The Spectro Proxy Does Not Connect

Confirm that the `spectro-proxy` pack is present in the cluster profile and that `vmDashboardIntegration.enabled` is
`true` in its configuration. The VMO Manager service must be named `vm-dashboard`, and its pods must carry the
`spectrocloud.com/connection: proxy` label. Both are set automatically when `palette.enabled` is `true`.

## Next Steps

Review [Authentication Options](./authentication-options.md) to decide which IdP users authenticate against, and which
parameters each option applies.

Once you decide on a Deployment Mode and an authentication option, apply them when you build your add-on profile. Refer
to [Create a VMO Profile](./create-vmo-profile.md) for the profile creation steps.
