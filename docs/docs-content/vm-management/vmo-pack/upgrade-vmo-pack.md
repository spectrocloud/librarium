---
sidebar_label: "Upgrade the VMO Pack"
title: "Upgrade the VMO Pack"
description:
  "Learn what changes in the Virtual Machine Orchestrator pack at version 4.10.0, and how to upgrade an existing
  cluster."
icon: " "
hide_table_of_contents: false
sidebar_position: 50
tags: ["vmo", "vmo pack", "oidc"]
---

The Virtual Machine Orchestrator (VMO) pack changed its management component at pack version 4.10.0.

- **Pack versions 4.9.x and earlier** build the VM management experience on the `spectro-vm-dashboard` component, known
  as the VM Dashboard, which is derived from the OpenShift console bridge.

- **Pack versions 4.10.0 and later** replace that component with the purpose-built VMO Manager service. VMO Manager is
  the same service that powers the [PaletteAI VM Launchpad](../vm-launchpad/vm-launchpad.md).

<!-- prettier-ignore-start -->

All versions ship under the same <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack name,
so you upgrade by changing the pack version in your add-on cluster profile.

<!-- prettier-ignore-end -->

This page describes what changes at pack version 4.10.0, what you must configure that has no equivalent in earlier
versions, and how to perform the upgrade.

## Limitations

- There is no in-place upgrade path from the VMO pack to the [PaletteAI VM Launchpad](../vm-launchpad/vm-launchpad.md).
  This applies to all VMO pack versions. The VM Launchpad is installed from a bootable ISO and manages its own cluster
  lifecycle, so moving to it requires a new cluster.

- Upgrading from 4.9.x does not migrate local user accounts, because the VM Dashboard has no local authentication.

## What Changes

| **Area**                | **Pack 4.9.x and Earlier**                                        | **Pack 4.10.0 and Later**                                                                                 |
| ----------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Management service      | `spectro-vm-dashboard`                                            | `vmo-manager`                                                                                             |
| Values layout           | Settings sit directly under `charts.virtual-machine-orchestrator` | Manager settings move to the `charts.virtual-machine-orchestrator.vmo-manager` sub-chart                  |
| OIDC configuration path | `appConfig.auth.oidc.*`                                           | `oidc.*` on the `vmo-manager` sub-chart                                                                   |
| Client secret storage   | Rendered into a ConfigMap                                         | Rendered into a Kubernetes Secret                                                                         |
| Scopes requested        | A fixed set of `openid`, `email`, `profile`, and `offline_access` | `openid`, `profile`, `email`, and `groups` by default. The `groups` scope is always requested.            |
| Callback URL            | Always `<consoleBaseAddress>/oidc/callback`                       | `<baseUrl>/oidc/callback` by default, with `oidc.callbackUrl` available as an override                    |
| Groups claim            | Not forwarded to Kubernetes, because the scope was not requested  | Requested by default and forwarded to Kubernetes, which enables group-based RBAC                          |
| Local admin fallback    | Not available                                                     | Available as a Day 0 bootstrap path, turned off by default                                                |
| IdP choice              | Palette-managed OIDC, configured per cluster                      | Palette-managed OIDC by default, with Local Auth, Keycloak, and External OIDC available as preset options |

The two changes with the largest operational impact are the following.

- **Group-based RBAC works without extra configuration.** In 4.9.x and earlier, IdP groups did not reach the Kubernetes
  API server because the `groups` scope was not requested. VMO Manager requests it by default, so bindings that use a
  `Group` subject take effect as soon as your IdP emits the `groups` claim.

- **The OIDC client secret moves out of a ConfigMap.** In 4.9.x and earlier, anyone with `get configmap` permission on
  the `vm-dashboard` namespace could read the client secret. Treat an existing client secret as exposed and rotate it as
  part of the upgrade.

## What You Must Configure After the Upgrade

The following items have no equivalent in 4.9.x and earlier. Plan for them before you upgrade.

| **Item**                         | **What You Need to Do**                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication selection         | Decide whether to keep Palette-managed OIDC or select an option from the **Alternative Authentication** preset group. Refer to [Authentication Options](./authentication-options.md).                                                                                                                                                                                                                                               |
| `LOCAL_ADMIN_PASSWORD` variable  | Add this profile variable, because the **Local Auth** and **External OIDC** options both reference it. To seed a Day 0 local admin account, set a strong password and set `features.localAuth.enabled` to `true`. Local authentication is off in every option except **Local Auth**.                                                                                                                                                |
| `platform.baseUrl`               | Set this to the URL that users reach the UI at. It replaces `appConfig.clusterInfo.consoleBaseAddress`. Required in **Direct** mode with a third-party IdP.                                                                                                                                                                                                                                                                         |
| IdP prefixes                     | If the Kubernetes API server uses `--oidc-username-prefix` or `--oidc-groups-prefix`, mirror those values in `oidc.k8sUsernamePrefix` and `oidc.k8sGroupPrefix` so that API key impersonation matches.                                                                                                                                                                                                                              |
| Keycloak Group Membership mapper | If your IdP is Keycloak, configure the **Group Membership** mapper on the realm's `profile` client scope, with the four token-inclusion toggles enabled. The mapper is not needed on VMO 4.9.x and earlier because the pack did not consume the `groups` claim. Refer to [Sync Keycloak Groups and Palette Teams](../../user-management/saml-sso/palette-sso-with-keycloak.md#sync-keycloak-groups-and-palette-teams) for guidance. |
| Group bindings                   | Replace the per-user role bindings that 4.9.x and earlier required with group bindings once you confirm that the groups claim reaches the API server.                                                                                                                                                                                                                                                                               |

### Parameter Mapping

Use the following table to move an existing configuration by hand. All paths in the second column are relative to
`charts.virtual-machine-orchestrator`.

| **4.9.x and Earlier**                      | **4.10.0 and Later**                                                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `appConfig.auth.oidc.clientID`             | `vmo-manager.oidc.clientId`                                                                                                             |
| `appConfig.auth.oidc.clientSecret`         | `vmo-manager.oidc.clientSecret`, rendered into a Secret                                                                                 |
| `appConfig.auth.oidc.issuerURL`            | `vmo-manager.oidc.issuerUrl`                                                                                                            |
| `appConfig.auth.oidcExtraScopes`           | `vmo-manager.oidc.scopes`, as a comma-separated string                                                                                  |
| `appConfig.clusterInfo.consoleBaseAddress` | `vmo-manager.platform.baseUrl`                                                                                                          |
| `snapshotController.installCRDs`           | Removed. Set `snapshot-controller.enabled` to `false` when your Container Storage Interface (CSI) supplies its own snapshot components. |
| `pack.cdi.privateRegistry.*`               | `cdi.privateRegistry.*`                                                                                                                 |

The `appConfig.auth.oidc.callbackUrl` and `appConfig.auth.oidc.scopes` parameters have no equivalent in 4.10.0 and
later. Remove them. Earlier versions ignored both.

## Prerequisites

- An existing cluster deployed with a VMO add-on cluster profile that runs VMO pack version 4.9.9 or later. If the
  cluster runs an earlier version, upgrade the pack to 4.9.9 or a later 4.9.x version first. Refer to
  [Update a Cluster Profile](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) for
  guidance, and confirm that the cluster reports a **Healthy** status before you continue.

- A Palette permission key `update` for the resource `clusterProfile`.

- Cluster admin access through a [kubeconfig](../../clusters/cluster-management/kubeconfig.md) file, so that you can
  inspect and change role bindings.

- Administrator access to your identity provider (IdP), if the cluster uses a third-party OIDC IdP.

## Upgrade the Pack

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**, and select your VMO add-on cluster profile.

3. Select the **Virtual Machine Orchestrator** layer, select **Values**, and copy the current values to a local file.
   Keep this file as a rollback reference.

4. Record the existing role bindings so that you can recreate them if needed. In 4.9.x and earlier, group-based RBAC did
   not work end to end, so bindings are typically mapped to individual user identities.

   ```shell
   kubectl get clusterrolebinding \
     --output custom-columns=NAME:.metadata.name,ROLE:.roleRef.name,SUBJECTS:.subjects[*].name \
     | grep --extended-regexp 'spectro-vm|kubevirt'
   ```

5. _(Third-party OIDC only)_ Rotate the OIDC client secret in your IdP and generate a new one on the same application.
   Do not revoke the old secret yet.

6. In the profile layer, change the pack version to 4.10.0 or later.

7. Update the values to match the new layout. Refer to [Parameter Mapping](#parameter-mapping),
   [Authentication Options](./authentication-options.md), and [VMO Pack Parameters](./vmo-pack-parameters.md) for the
   full parameter reference.

8. Add the `LOCAL_ADMIN_PASSWORD` profile variable and set a strong password. Refer to
   [Define Cluster Profile Variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
   for guidance.

9. Select **Confirm Updates**, and then **Save Changes**.

10. Apply the profile update to your cluster and wait for the cluster to report a **Healthy** status.

    Palette removes the VM Dashboard workload and its ConfigMap, and creates the VMO Manager workload in the same
    namespace.

:::info

Running VMs are not interrupted by this upgrade. KubeVirt manages the VMs, and they are unaffected while the management
pod restarts.

:::

## Post-Upgrade Tasks

1. _(Local authentication only)_ Sign in with the local admin account and confirm that the UI is reachable. This step
   applies if you selected the **Local Auth** option, or if you set `features.localAuth.enabled` to `true` yourself.

2. _(Third-party OIDC only)_ Sign in through your IdP and confirm that authentication succeeds.

3. Confirm that group memberships reach the Kubernetes API server. Refer to
   [Validate the Groups Claim](./configure-external-oidc.md#validate-the-groups-claim) for guidance.

4. Replace the per-user role bindings that you recorded earlier with group bindings, and then delete the per-user
   bindings. Refer to [Grant Access to Groups](./configure-external-oidc.md#grant-access-to-groups) for guidance.

5. _(Third-party OIDC only)_ Revoke the old OIDC client secret in your IdP after the cluster operates normally for 24 to
   48 hours.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and select your cluster.

3. Confirm that the cluster reports a **Healthy** status and that the **Virtual Machine Orchestrator** layer reports the
   new pack version.

4. Open the VM management UI and confirm that your existing VMs are listed and report their expected power state.

5. Confirm that a user in a bound group can perform the operations that the bound role grants.

## Next Steps

Review [Deployment Modes](./deployment-modes.md) and [Authentication Options](./authentication-options.md) to learn how
the two selections interact, and which parameters each one applies.

If your cluster authenticates against a third-party IdP, refer to
[Configure External OIDC](./configure-external-oidc.md) for the full IdP-side and pack-side configuration.
