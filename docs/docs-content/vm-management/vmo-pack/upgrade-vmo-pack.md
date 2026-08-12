---
sidebar_label: "Upgrade the VMO Pack"
title: "Upgrade the VMO Pack"
description:
  "Learn what changes between VMO 1.0 and VMO 2.0 in the Virtual Machine Orchestrator pack, and how to upgrade an
  existing cluster."
icon: " "
hide_table_of_contents: false
sidebar_position: 50
tags: ["vmo", "vmo pack", "oidc"]
---

The Virtual Machine Orchestrator (VMO) pack has two generations.

- **VMO 1.0** builds the VM management experience on the `spectro-vm-dashboard` component, which is derived from the
  OpenShift console bridge.

- **VMO 2.0** replaces that component with the purpose-built VMO Manager service. VMO Manager is the same service that
  powers the [PaletteAI VM Launchpad](../vm-launchpad/vm-launchpad.md).

<!-- prettier-ignore-start -->

Both generations ship under the same <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack name,
so you upgrade by changing the pack version in your add-on cluster profile.

<!-- prettier-ignore-end -->

This page describes what changes between the two generations, what you must configure in VMO 2.0 that had no equivalent
in VMO 1.0, and how to perform the upgrade.

## What Changes

| **Area**                 | **VMO 1.0**                                                       | **VMO 2.0**                                                                                               |
| ------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Management service       | `spectro-vm-dashboard`                                            | `vmo-manager`                                                                                             |
| Values layout            | Settings sit directly under `charts.virtual-machine-orchestrator` | Manager settings move to the `charts.virtual-machine-orchestrator.vmo-manager` sub-chart                  |
| OIDC configuration path  | `appConfig.auth.oidc.*`                                           | `oidc.*` on the `vmo-manager` sub-chart                                                                   |
| Client secret storage    | Rendered into a ConfigMap                                         | Rendered into a Kubernetes Secret                                                                         |
| Scopes requested         | A fixed set of `openid`, `email`, `profile`, and `offline_access` | `openid`, `profile`, `email`, and `groups` by default. The `groups` scope is always requested.            |
| Callback URL             | Always `<consoleBaseAddress>/auth/callback`                       | `<baseUrl>/auth/callback` by default, with `oidc.callbackUrl` available as an override                    |
| Groups claim             | Not forwarded to Kubernetes, because the scope was not requested  | Requested by default and forwarded to Kubernetes, which enables group-based RBAC                          |
| Local admin fallback     | Not available                                                     | Available alongside OIDC as a Day 0 bootstrap path                                                        |
| Identity provider choice | Palette-managed OIDC, configured per cluster                      | Palette-managed OIDC by default, with Local Auth, Keycloak, and External OIDC available as preset options |

The two changes with the largest operational impact are the following.

- **Group-based RBAC works without extra configuration.** In VMO 1.0, identity provider groups did not reach the
  Kubernetes API server because the `groups` scope was not requested. VMO 2.0 requests it by default, so bindings that
  use a `Group` subject take effect as soon as your identity provider emits the `groups` claim.

- **The OIDC client secret moves out of a ConfigMap.** In VMO 1.0, anyone with `get configmap` permission on the
  `vm-dashboard` namespace could read the client secret. Treat an existing VMO 1.0 client secret as exposed and rotate
  it as part of the upgrade.

## What You Must Configure in VMO 2.0

The following items have no VMO 1.0 equivalent. Plan for them before you upgrade.

| **Item**                        | **What You Need to Do**                                                                                                                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication selection        | Decide whether to keep Palette-managed OIDC or select an option from the **Alternative Authentication** preset group. Refer to [Deployment Modes and Authentication](./deployment-modes-and-authentication.md). |
| `LOCAL_ADMIN_PASSWORD` variable | Add this profile variable and set a strong password to seed the Day 0 local admin account. Leave it empty if you want a cluster with no local sign-in.                                                          |
| `platform.baseUrl`              | Set this to the URL that users reach the UI at. It replaces `appConfig.clusterInfo.consoleBaseAddress`. Required in **Direct** mode with an external identity provider.                                         |
| Identity provider prefixes      | If the Kubernetes API server uses `--oidc-username-prefix` or `--oidc-groups-prefix`, mirror those values in `oidc.k8sUsernamePrefix` and `oidc.k8sGroupPrefix` so that API key impersonation matches.          |
| Group bindings                  | Replace the per-user role bindings that VMO 1.0 required with group bindings once you confirm that the groups claim reaches the API server.                                                                     |

### Parameter Mapping

Use the following table to move an existing configuration by hand. All VMO 2.0 paths are relative to
`charts.virtual-machine-orchestrator`.

| **VMO 1.0 Parameter**                      | **VMO 2.0 Parameter**                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `appConfig.auth.oidc.clientID`             | `vmo-manager.oidc.clientId`                                                                                                             |
| `appConfig.auth.oidc.clientSecret`         | `vmo-manager.oidc.clientSecret`, rendered into a Secret                                                                                 |
| `appConfig.auth.oidc.issuerURL`            | `vmo-manager.oidc.issuerUrl`                                                                                                            |
| `appConfig.auth.oidcExtraScopes`           | `vmo-manager.oidc.scopes`, as a comma-separated string                                                                                  |
| `appConfig.clusterInfo.consoleBaseAddress` | `vmo-manager.platform.baseUrl`                                                                                                          |
| `snapshotController.installCRDs`           | Removed. Set `snapshot-controller.enabled` to `false` when your Container Storage Interface (CSI) supplies its own snapshot components. |
| `pack.cdi.privateRegistry.*`               | `cdi.privateRegistry.*`                                                                                                                 |

The `appConfig.auth.oidc.callbackUrl` and `appConfig.auth.oidc.scopes` parameters have no VMO 2.0 equivalent. Remove
them. VMO 1.0 ignored both.

## Prerequisites

- An existing cluster deployed with a VMO 1.0 add-on cluster profile that runs VMO pack version 4.9.9 or later. If the
  cluster runs an earlier version, upgrade the pack on the VMO 1.0 line first. Refer to
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) for
  guidance, and confirm that the cluster reports a **Healthy** status before you continue.

- A Palette permission key `update` for the resource `clusterProfile`.

- Cluster admin access through a [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file, so that you can
  inspect and change role bindings.

- Administrator access to your identity provider, if the cluster uses a third-party OIDC provider.

## Upgrade the Pack

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**, and select your VMO add-on cluster profile.

3. Select the **Virtual Machine Orchestrator** layer, select **Values**, and copy the current values to a local file.
   Keep this file as a rollback reference.

4. Record the existing role bindings so that you can recreate them if needed. In VMO 1.0, group-based RBAC did not work
   end to end, so bindings are typically mapped to individual user identities.

   ```shell
   kubectl get clusterrolebinding \
     --output custom-columns=NAME:.metadata.name,ROLE:.roleRef.name,SUBJECTS:.subjects[*].name \
     | grep --extended-regexp 'spectro-vm|kubevirt'
   ```

5. _(Third-party OIDC only)_ Rotate the OIDC client secret in your identity provider and generate a new one on the same
   application. Do not revoke the old secret yet.

6. In the profile layer, change the pack version to a VMO 2.0 version.

7. Update the values to match the VMO 2.0 layout. Refer to [Parameter Mapping](#parameter-mapping) and to
   [Deployment Modes and Authentication](./deployment-modes-and-authentication.md) for the full parameter reference.

8. Add the `LOCAL_ADMIN_PASSWORD` profile variable and set a strong password. Refer to
   [Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
   for guidance.

9. Select **Confirm Updates**, and then **Save Changes**.

10. Apply the profile update to your cluster and wait for the cluster to report a **Healthy** status.

    Palette removes the VMO 1.0 workload and its ConfigMap, and creates the VMO 2.0 workload in the same namespace.

:::info

Running VMs are not interrupted by this upgrade. KubeVirt manages the VMs, and they are unaffected while the management
pod restarts.

:::

## Post-Upgrade Tasks

1. Sign in with the local admin account and confirm that the UI is reachable.

2. Sign in through your identity provider and confirm that authentication succeeds.

3. Confirm that group memberships reach the Kubernetes API server. Refer to
   [Validate the Groups Claim](./configure-external-oidc.md#validate-the-groups-claim) for guidance.

4. Replace the per-user role bindings that you recorded earlier with group bindings, and then delete the per-user
   bindings. Refer to [Grant Access to Groups](./configure-external-oidc.md#grant-access-to-groups) for guidance.

5. _(Third-party OIDC only)_ Revoke the old OIDC client secret in your identity provider after the cluster operates
   normally for 24 to 48 hours.

## Limitations

- There is no in-place upgrade path from the VMO pack to the [PaletteAI VM Launchpad](../vm-launchpad/vm-launchpad.md).
  This applies to both VMO 1.0 and VMO 2.0 clusters. The VM Launchpad is installed from a bootable ISO and manages its
  own cluster lifecycle, so moving to it requires a new cluster.

- Upgrading from VMO 1.0 to VMO 2.0 does not migrate local user accounts, because VMO 1.0 has no local authentication.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and select your cluster.

3. Confirm that the cluster reports a **Healthy** status and that the **Virtual Machine Orchestrator** layer reports the
   new pack version.

4. Open the VM management UI and confirm that your existing VMs are listed and report their expected power state.

5. Confirm that a user in a bound group can perform the operations that the bound role grants.

## Next Steps

Review [Deployment Modes and Authentication](./deployment-modes-and-authentication.md) to learn how the Deployment Mode
and authentication selections interact, and which parameters each one applies.

If your cluster authenticates against a third-party identity provider, refer to
[Configure External OIDC](./configure-external-oidc.md) for the full provider-side and pack-side configuration.
