---
sidebar_label: "Enable Automatic TLS Rotation for Zot Registry"
title: "Enable Automatic TLS Certificate Rotation on the Zot Primary Registry"
description:
  "Upgrade an existing Edge cluster so that the in-cluster Zot registry uses cert-manager to automatically rotate its
  TLS certificate."
hide_table_of_contents: false
sidebar_position: 90
tags: ["edge"]
---

<!-- prettier-ignore-start -->
Edge clusters that use the in-cluster Zot registry as a primary registry serve a TLS certificate
that expires after 365 days. In earlier versions of the
<VersionedLink text="Zot" url="/integrations/packs/?pack=zot-registry" /> pack, this certificate
has to be rotated manually before it expires.

Starting with the `zot` pack version `0.1.89-rev2`, the certificate lifecycle for the in-cluster
Zot registry is managed by
<VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" />. After the
upgrade, cert-manager issues the Zot server certificate from a self-signed root Certificate
Authority (CA) and renews the server certificate automatically before it expires. The
<VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> pack watches the Kubernetes Secret that stores
the certificate and restarts the Zot pods when the Secret changes, so the rotated certificate is
picked up without manual intervention.

<!-- prettier-ignore-start -->

This page explains how to upgrade an existing cluster profile to use this rotation flow.

## Required Packs

The following table lists the pack versions used by the upgrade.

| Layer    | Pack               | Version to select                                   |
| -------- | ------------------ | --------------------------------------------------- |
| Registry | `zot`              | `0.1.89-rev2`                                       |
| Registry | `registry-connect` | `0.2.1` or later                                    |
| Add-on   | `reloader`         | Any `1.4.x` version, for example, `1.4.19`          |
| Add-on   | `cert-manager`     | Any version already supported by your profile       |

The `zot` pack version `0.1.89-rev2` declares `reloader` as a required pack dependency and
`registry-connect` version `0.2.1` or later as a recommended companion. You can use the
cert-manager version shipped with Palette or add the `cert-manager` pack to the profile if you
want to override its settings. The Zot chart provisions the cert-manager `ClusterIssuer`,
`Issuer`, and `Certificate` resources during installation.

## Limitations

- The `reloader` pack is required. Without it, cert-manager rotates the Kubernetes Secret that
  stores the Zot server certificate, but the Zot pods continue to serve the previous certificate
  from memory until they are restarted manually.

- cert-manager must be installed before the profile is applied. The Zot chart fails to reconcile
  if the cert-manager Custom Resource Definitions (CRDs) `Certificate`, `Issuer`, and
  `ClusterIssuer` are missing.

## Prerequisites

- An existing [Edge cluster](../../edge.md) that uses an Edge profile with the in-cluster Zot registry pack
  (`zot` version `0.1.89` or earlier) and the `registry-connect` pack.

- Permission to edit and version the cluster profile in Palette.

- cert-manager installed in the target cluster, either through the version shipped with Palette
  or through the `cert-manager` pack in the profile.

- Healthy persistent storage backing the existing Zot Persistent Volume Claim (PVC), `zot-pvc` in
  the `zot-system` namespace. The upgrade does not change the PVC, so image data is preserved.

## Enable Automatic TLS Rotation on the Zot Registry

Perform the following steps in the cluster profile, and then apply the new profile version to the
target clusters.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select the cluster profile that you want to upgrade.

<!-- prettier-ignore-start -->

4. Add or upgrade the <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> add-on pack.

   - If the `reloader` pack is not already in the profile, select **Add New Pack** and add the
     pack at a version in the `1.4.x` line, for example, `reloader 1.4.19`.

   - If the `reloader` pack is already in the profile at a version earlier than `1.4.x`, upgrade
     the pack to a `1.4.x` version.

   The Zot chart writes the annotation `secret.reloader.stakater.com/reload: zot-tls` on the Zot
   StatefulSet. The `reloader` pack watches for this annotation and triggers a pod restart when
   the `zot-tls` Kubernetes Secret is updated by cert-manager.

5. Upgrade the <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" />
   pack to version `0.2.1` or later.

<!-- prettier-ignore-end -->

6. In the **Presets** panel of the **Registry Connect** pack, select **Zot Internal Registry with Cert-Manager**. The
   preset name is `zot-registry-preset-cert`.

   Selecting this preset switches the trust bundle reference in `charts.registry-connect.config.certificates` from the
   legacy `zot-secret` Secret and its `caCrt` key to the cert-manager-managed `zot-tls` Secret.

   ```yaml
   charts:
     registry-connect:
       config:
         certificates:
           - certificateRef:
               kind: Secret
               name: zot-tls
               namespace: zot-system
               key: ca.crt
   ```

   The remaining values in the preset, such as the sync configuration, in-cluster registry credentials, and storage
   check, remain equivalent to the standard **Zot Internal Registry** preset.

7. Select **Confirm & Create** to finish customizing the **Registry Connect** pack.

<!-- prettier-ignore-start -->

8. Upgrade the <VersionedLink text="Zot" url="/integrations/packs/?pack=zot-registry" /> pack to version `0.1.89-rev2`.

<!-- prettier-ignore-end -->

9. In the **values.yaml** file of the **Zot** pack, confirm the following two parameters are set to `true`. Both are
   enabled by default in the new pack and do not require edits in most cases.

   ```yaml
   charts:
     zot:
       tls:
         certManager:
           enabled: true # turns on cert-manager-issued certificates
           reloader:
             enabled: true # adds the reloader annotation to Zot pods
   ```

   The remaining defaults under `tls.certManager` describe the cert-manager plumbing that the chart provisions. Do not
   change them unless you have a specific reason to do so.

   | Parameter                                                     | Default value | Description                                                                                                                                                                                 |
   | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `tls.certManager.bootstrapCA.enabled`                         | `true`        | Creates a self-signed `ClusterIssuer` named `edge-registry-ca`, a namespace-scoped `Issuer` named `internal-ca`, and a root CA `Certificate` named `root-ca` in the `zot-system` namespace. |
   | `tls.certManager.bootstrapCA.rootCA.duration`                 | `87600h0m0s`  | Sets a 10-year duration for the root CA.                                                                                                                                                    |
   | `tls.certManager.bootstrapCA.rootCA.privateKeyRotationPolicy` | `Never`       | Preserves the root CA private key across renewals so that downstream trust bundles remain valid.                                                                                            |
   | `tls.certManager.certificate.duration`                        | `8760h0m0s`   | Sets a 1-year duration for the Zot server certificate.                                                                                                                                      |
   | `tls.certManager.certificate.renewBefore`                     | `360h0m0s`    | Instructs cert-manager to renew the Zot server certificate 15 days before it expires.                                                                                                       |

10. Select **Confirm & Create**.

11. Save and publish the new version of the cluster profile.

12. Apply the new profile version to the target cluster or clusters. Refer to
    [Update a Cluster](../../../cluster-management/cluster-updates.md) for more information.

    :::info

    When the profile is applied, Palette rolls out the changes in the standard order. cert-manager reconciles the new
    `ClusterIssuer`, `Issuer`, root CA `Certificate`, and Zot server `Certificate` resources in the `zot-system`
    namespace, and writes the root CA into the `root-ca-secret` Secret and the Zot server certificate into the `zot-tls`
    Secret. The Zot StatefulSet is then upgraded so that its pod template mounts the `zot-tls` Secret at `/certs` and
    carries the annotation `secret.reloader.stakater.com/reload: zot-tls`. The `registry-connect` pack, using the new
    preset, reads `zot-system/zot-tls` and distributes `ca.crt` into the cluster trust bundle so that workloads pulling
    from the Zot registry trust the new CA. On future rotations, cert-manager rewrites `zot-tls`, and the `reloader`
    pack restarts the Zot pods so that they pick up the new certificate.

    :::

## Validate

Use the following commands against the target cluster to confirm that the automatic rotation is in place.

1. Confirm that cert-manager has issued both certificates and marked them as ready.

   ```shell
   kubectl --namespace zot-system get certificates
   ```

   The output lists the `root-ca` certificate and the Zot server certificate. Both must show `READY=True`.

2. Confirm that the new Kubernetes Secrets exist.

   ```shell
   kubectl --namespace zot-system get secret root-ca-secret zot-tls
   ```

3. Inspect the served certificate. The expiry date must be approximately one year from the current date.

   ```shell
   kubectl --namespace zot-system get secret zot-tls --output jsonpath='{.data.tls\.crt}' \
     | base64 --decode \
     | openssl x509 -noout -subject -issuer -dates
   ```

4. Confirm that the Zot pods carry the `reloader` annotation and mount the `zot-tls` Secret.

   ```shell
   kubectl --namespace zot-system get statefulset zot --output yaml \
     | grep --extended-regexp 'reloader.stakater.com/reload|zot-tls'
   ```

5. Confirm that the `registry-connect` pack references the new CA certificate through the `zot-tls` Secret and its
   `ca.crt` key. Replace `<cluster-uid>` with the unique identifier of your cluster.

   ```shell
   kubectl --namespace cluster-<cluster-uid> get configmap \
     --selector app.kubernetes.io/name=registry-connect --output yaml \
     | grep --after-context=2 certificates
   ```

The registry endpoint at `https://<node-ip>:30003` continues to serve traffic throughout the upgrade. The Zot pods
present the new certificate after the `reloader`-driven restart completes.

## Roll Back the Upgrade

If you need to revert the upgrade, follow these steps.

1. Revert the cluster profile to the previous version. This version uses `zot` version `0.1.89`, `registry-connect`
   version `0.2.0`, and the **Zot Internal Registry** preset.

2. Re-apply the previous profile version to the cluster.

3. Because the earlier `zot-secret` Secret and its `caCrt` key are still populated with the pre-upgrade CA, workloads
   that were trusting it continue to work until the certificate would have naturally expired.

:::warning

Do not delete the `root-ca-secret` or `zot-tls` Kubernetes Secrets during the rollback. Leaving them in place allows a
forward re-upgrade later without cert-manager having to reissue the CA.

:::

The `zot-pvc` PVC is unchanged by both the upgrade and the rollback, so no image data is lost.

## Next Steps

After the upgrade completes, cert-manager renews the Zot server certificate automatically. To change how images are
pulled from the registry, or to review the primary registry configuration, refer to the following pages.

- [Deploy Cluster with a Primary Registry](./deploy-primary-registry.md)

- [Disable Webhook to Customize Image Pull Behavior](./webhook-disable.md)
