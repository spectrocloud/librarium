---
sidebar_label: "Enable Automatic TLS Rotation for Harbor Registry"
title: "Enable Automatic TLS Certificate Rotation on the Harbor Primary Registry"
description:
  "Upgrade an existing Edge cluster so that the in-cluster Harbor registry uses cert-manager to automatically rotate
  its TLS certificate."
hide_table_of_contents: false
sidebar_position: 95
tags: ["edge"]
---

<!-- prettier-ignore-start -->
Edge clusters that use the in-cluster Harbor registry as a primary registry serve a TLS certificate
that expires after 365 days. In earlier versions of the
<VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack, this certificate has
to be rotated manually before it expires.

Starting with the `harbor` pack version `1.19.0-rev1`, the certificate lifecycle for the in-cluster
Harbor registry is managed by
<VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" />. After the
upgrade, cert-manager issues the Harbor server certificate from a self-signed root Certificate
Authority (CA) and renews the server certificate automatically before it expires. The
<VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> pack watches the
Kubernetes Secret that stores the certificate and restarts the Harbor `nginx` Deployment when the
Secret changes, so the rotated certificate is picked up without manual intervention.

<!-- prettier-ignore-end -->

This page explains how to upgrade an existing cluster profile to use this rotation flow.

## Required Packs

The following table lists the pack versions used by the upgrade.

| Layer    | Pack               | Version to select                             |
| -------- | ------------------ | --------------------------------------------- |
| Registry | `harbor`           | `1.19.0-rev1`                                 |
| Registry | `registry-connect` | `0.2.1` or later                              |
| Add-on   | `reloader`         | Any `1.4.x` version, for example, `1.4.19`    |
| Add-on   | `cert-manager`     | Any version already supported by your profile |

The `harbor` pack version `1.19.0-rev1` declares `reloader` as a required pack dependency and
`registry-connect` version `0.2.1` or later as a recommended companion. You can use the
cert-manager version shipped with Palette or add the `cert-manager` pack to the profile if you want
to override its settings. The Harbor chart provisions the cert-manager `ClusterIssuer`, `Issuer`,
and `Certificate` resources during installation.

## Limitations

- The `reloader` pack is required. Without it, cert-manager rotates the Kubernetes Secret that
  stores the Harbor server certificate, but the Harbor `nginx` pods continue to serve the previous
  certificate from memory until they are restarted manually.

## Prerequisites

- An existing [Edge cluster](../../edge.md) that uses an Edge profile with the in-cluster Harbor registry pack
  (`harbor` version `1.19.0` or earlier) and the `registry-connect` pack.

- Permission to edit and version the cluster profile in Palette.

- cert-manager installed in the target cluster, either through the version shipped with Palette or
  through the `cert-manager` pack in the profile.

- Healthy persistent storage backing the existing Harbor Persistent Volume Claims (PVCs),
  `harbor-registry` and `harbor-jobservice` in the `harbor` namespace. The upgrade does not change
  the PVCs, so image data and job logs are preserved.

## Enable Automatic TLS Rotation on the Harbor Registry

Perform the following steps in the cluster profile, and then apply the new profile version to the
target clusters.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select the cluster profile that you want to upgrade.

<!-- prettier-ignore-start -->

4. Add or upgrade the <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> add-on pack.

   - If the `reloader` pack is not already in the profile, select **Add New Pack** and add the pack
     at a version in the `1.4.x` line, for example, `reloader 1.4.19`.

   - If the `reloader` pack is already in the profile at a version earlier than `1.4.x`, upgrade
     the pack to a `1.4.x` version.

   The Harbor chart writes the annotation `secret.reloader.stakater.com/reload: harbor-ingress-tls`
   on the Harbor `nginx` Deployment. The `reloader` pack watches for this annotation and triggers
   a pod restart when the `harbor-ingress-tls` Kubernetes Secret is updated by cert-manager.

5. Upgrade the <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" />
   pack to version `0.2.1` or later.

<!-- prettier-ignore-end -->

6. In the **Presets** panel of the **Registry Connect** pack, select **Harbor Internal Registry with Cert-Manager**.
   The preset name is `harbor-registry-preset-cert`.

   Selecting this preset switches the trust bundle reference in `charts.registry-connect.config.certificates` from the
   legacy `harbor-nginx` Secret and its `ca.crt` key to the cert-manager-managed `harbor-ingress-tls` Secret.

   ```yaml
   charts:
     registry-connect:
       config:
         certificates:
           - certificateRef:
               kind: Secret
               name: harbor-ingress-tls
               namespace: harbor
               key: ca.crt
   ```

   The remaining values in the preset, such as the sync configuration, in-cluster registry credentials, and storage
   check, remain equivalent to the standard **Harbor Internal Registry** preset.

7. Select **Confirm & Create** to finish customizing the **Registry Connect** pack.

<!-- prettier-ignore-start -->

8. Upgrade the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack to version `1.19.0-rev1`.

<!-- prettier-ignore-end -->

9. In the **values.yaml** file of the **Harbor** pack, confirm the following two parameters are set to `true`. Both are
   enabled by default in the new pack and do not require edits in most cases.

   ```yaml
   charts:
     harbor:
       expose:
         tls:
           certManager:
             enabled: true # turns on cert-manager-issued certificates
             reloader:
               enabled: true # adds the reloader annotation to the Harbor nginx pod
   ```

   The remaining defaults under `expose.tls.certManager` describe the cert-manager plumbing that the chart provisions.
   Do not change them unless you have a specific reason to do so.

   | Parameter                                                            | Default value        | Description                                                                                                                                                                              |
   | -------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `expose.tls.certSource`                                              | `secret`             | Instructs the Harbor chart to read the server certificate from the Kubernetes Secret that cert-manager writes.                                                                           |
   | `expose.tls.secret.secretName`                                       | `harbor-ingress-tls` | Names the Kubernetes Secret that stores the served Harbor server certificate.                                                                                                            |
   | `expose.tls.certManager.issuerRef.kind`                              | `Issuer`             | Sets the kind of cert-manager issuer that signs the Harbor server certificate.                                                                                                           |
   | `expose.tls.certManager.issuerRef.name`                              | `internal-ca`        | Names the namespace-scoped issuer that the chart creates.                                                                                                                                |
   | `expose.tls.certManager.certificate.duration`                        | `8760h0m0s`          | Sets a 1-year duration for the Harbor server certificate.                                                                                                                                |
   | `expose.tls.certManager.certificate.renewBefore`                     | `360h0m0s`           | Instructs cert-manager to renew the Harbor server certificate 15 days before it expires.                                                                                                 |
   | `expose.tls.certManager.bootstrapCA.enabled`                         | `true`               | Creates a self-signed `ClusterIssuer` named `harbor-edge-ca`, a namespace-scoped `Issuer` named `internal-ca`, and a root CA `Certificate` named `root-ca` in the `harbor` namespace.    |
   | `expose.tls.certManager.bootstrapCA.rootCA.duration`                 | `87600h0m0s`         | Sets a 10-year duration for the root CA.                                                                                                                                                 |
   | `expose.tls.certManager.bootstrapCA.rootCA.privateKeyRotationPolicy` | `Never`              | Preserves the root CA private key across renewals so that downstream trust bundles remain valid.                                                                                         |

10. Select **Confirm & Create**.

11. Save and publish the new version of the cluster profile.

12. Apply the new profile version to the target cluster or clusters. Refer to
    [Update a Cluster](../../../cluster-management/cluster-updates.md) for more information.

    :::info

    When the profile is applied, Palette rolls out the changes in the standard order. cert-manager reconciles the new
    `ClusterIssuer`, `Issuer`, root CA `Certificate`, and Harbor server `Certificate` resources in the `harbor`
    namespace, and writes the root CA into the `root-ca-secret` Secret and the Harbor server certificate into the
    `harbor-ingress-tls` Secret. The Harbor `nginx` Deployment is then upgraded so that its pod template mounts the
    `harbor-ingress-tls` Secret and carries the annotation `secret.reloader.stakater.com/reload: harbor-ingress-tls`.
    The `registry-connect` pack, using the new preset, reads `harbor/harbor-ingress-tls` and distributes `ca.crt` into
    the cluster trust bundle so that workloads pulling from the Harbor registry trust the new CA. On future rotations,
    cert-manager rewrites `harbor-ingress-tls`, and the `reloader` pack restarts the Harbor `nginx` pods so that they
    pick up the new certificate.

    :::

## Validate

Use the following commands against the target cluster to confirm that the automatic rotation is in place.

1. Confirm that cert-manager has issued both certificates and marked them as ready.

   ```shell
   kubectl --namespace harbor get certificates
   ```

   The output lists the `root-ca` certificate and the Harbor server certificate. Both must show `READY=True`.

2. Confirm that the new Kubernetes Secrets exist.

   ```shell
   kubectl --namespace harbor get secret root-ca-secret harbor-ingress-tls
   ```

3. Inspect the served certificate. The expiry date must be approximately one year from the current date.

   ```shell
   kubectl --namespace harbor get secret harbor-ingress-tls --output jsonpath='{.data.tls\.crt}' \
     | base64 --decode \
     | openssl x509 -noout -subject -issuer -dates
   ```

4. Confirm that the Harbor `nginx` Deployment carries the `reloader` annotation and mounts the `harbor-ingress-tls`
   Secret.

   ```shell
   kubectl --namespace harbor get deployment harbor-nginx --output yaml \
     | grep --extended-regexp 'reloader.stakater.com/reload|harbor-ingress-tls'
   ```

5. Confirm that the `registry-connect` pack references the new CA certificate through the `harbor-ingress-tls` Secret
   and its `ca.crt` key. Replace `<cluster-uid>` with the unique identifier of your cluster.

   ```shell
   kubectl --namespace cluster-<cluster-uid> get configmap \
     --selector app.kubernetes.io/name=registry-connect --output yaml \
     | grep --after-context=2 certificates
   ```

The registry endpoint at `https://<node-ip>:30003` continues to serve traffic throughout the upgrade. The Harbor
`nginx` pods present the new certificate after the `reloader`-driven restart completes.

## Roll Back the Upgrade

If you need to revert the upgrade, follow these steps.

1. Revert the cluster profile to the previous version. This version uses `harbor` version `1.19.0`, `registry-connect`
   version `0.2.0`, and the **Harbor Internal Registry** preset.

2. Re-apply the previous profile version to the cluster.

3. Because the earlier `harbor-nginx` Secret and its `ca.crt` key are still populated with the pre-upgrade CA,
   workloads that were trusting it continue to work until the certificate would have naturally expired.

:::warning

Do not delete the `root-ca-secret` or `harbor-ingress-tls` Kubernetes Secrets during the rollback. Leaving them in
place allows a forward re-upgrade later without cert-manager having to reissue the CA.

:::

The `harbor-registry` and `harbor-jobservice` PVCs are unchanged by both the upgrade and the rollback, so no image
data is lost.

## Next Steps

After the upgrade completes, cert-manager renews the Harbor server certificate automatically. To change how images
are pulled from the registry, or to review the primary registry configuration, refer to the following pages.

- [Deploy Cluster with a Primary Registry](./deploy-primary-registry.md)

- [Disable Webhook to Customize Image Pull Behavior](./webhook-disable.md)
