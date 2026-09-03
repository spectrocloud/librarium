---
sidebar_label: "VMO Pack Parameters"
title: "VMO Pack Parameters"
description:
  "Reference for the Virtual Machine Orchestrator pack parameters that no Deployment Mode or authentication selection
  changes."
icon: " "
hide_table_of_contents: false
sidebar_position: 26
tags: ["vmo", "vmo pack"]
---

<!-- prettier-ignore-start -->

The parameters on this page come from the Virtual Machine Orchestrator (VMO) pack base values and are not changed by any
[Deployment Mode](./deployment-modes.md) or [authentication](./authentication-options.md) selection. Override them
directly in the pack YAML when needed. Refer to the <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
documentation for the full list of parameters that the pack exposes.

<!-- prettier-ignore-end -->

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

For example, `logging.level` refers to `charts.virtual-machine-orchestrator.vmo-manager.logging.level`.

## Deployment

| **Parameter**                    | **Default**                                           | **Description**                                                                                                                                                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deployment.replicaCount`        | `1`                                                   | Set to `3` for high availability on multi-node control planes. Anti-affinity and the pod disruption budget turn on automatically when the count is greater than 1.                                                                                                                             |
| `service.port`                   | `8080`                                                |                                                                                                                                                                                                                                                                                                |
| `oidc.clientId`                  | `k8s-oidc`                                            |                                                                                                                                                                                                                                                                                                |
| `oidc.scopes`                    | `""`, which resolves to `openid,profile,email,groups` | The `groups` scope is always requested, even if you omit it from this list.                                                                                                                                                                                                                    |
| `oidc.k8sUsernameClaim`          | `email`                                               | Must match the Kubernetes API server `--oidc-username-claim` flag. Palette clusters use `email`.                                                                                                                                                                                               |
| `oidc.k8sNotFederated`           | `false`                                               | Set to `true` when the Kubernetes API server is not federated with the same OIDC issuer as VMO. Refer to [Configure Non-Federated Kubernetes API Servers](./configure-external-oidc.md#configure-non-federated-kubernetes-api-servers) for the behavior it changes and the security trade-off. |
| `platform.cdiProxyUrl`           | `https://cdi-uploadproxy.cdi.svc.cluster.local`       |                                                                                                                                                                                                                                                                                                |
| `platform.caFile`                | `/etc/ssl/custom/ca.crt`                              |                                                                                                                                                                                                                                                                                                |
| `identity.keycloakAdminClientId` | `vmo-admin`                                           |                                                                                                                                                                                                                                                                                                |
| `logging.level`                  | `info`                                                | Set to `debug` to troubleshoot bootstrap, leader election, and identity seeding.                                                                                                                                                                                                               |
| `secrets.create`                 | `true`                                                | Generates the session key on first install and preserves it across upgrades.                                                                                                                                                                                                                   |
| `features.guestAgentAutoInstall` | `true`                                                | Injects the QEMU guest agent through cloud-init.                                                                                                                                                                                                                                               |
| `goldenImagesNamespace`          | `vmo-golden-images`                                   |                                                                                                                                                                                                                                                                                                |

## TLS and Ingress

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

## Audit and Metrics

| **Parameter**                    | **Default** | **Description**                                                                                  |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `audit.retentionDays`            | `30`        | Set to `0` to disable the cleanup CronJob. Audit events then accumulate without limit.           |
| `audit.cleanupSchedule`          | `0 0 * * *` | Runs daily at midnight UTC. Ignored when `audit.retentionDays` is `0`.                           |
| `metrics.externalMetricsEnabled` | `false`     | Enable to query an external PromQL backend, such as Victoria Metrics or Thanos, for long ranges. |
| `metrics.retentionDays`          | `30`        | Internal metric retention.                                                                       |
| `metrics.ringBufferRetention`    | `30m`       | In-memory buffer used when the external backend is unavailable.                                  |

## Components

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

## Next Steps

Refer to [Create a VMO Profile](./create-vmo-profile.md) to apply these parameters in an add-on cluster profile.
