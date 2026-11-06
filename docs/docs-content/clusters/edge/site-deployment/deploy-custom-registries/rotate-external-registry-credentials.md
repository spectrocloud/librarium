---
sidebar_label: "Rotate External Registry Credentials"
title: "Rotate External Registry Credentials"
description:
  "Rotate the credentials of a private external registry on centrally managed Edge clusters without a repave by using
  the Registry Connect pack."
hide_table_of_contents: false
sidebar_position: 25
tags: ["edge"]
---

<!-- TODO(DOC-3369): Draft. Open points are marked with TODO comments. Answers are tracked in SUS 2097. -->

If your Edge hosts pull images from a [private external registry](./deploy-external-registry.md), you can rotate the
registry credentials remotely from Palette. You set the credential that your clusters use in the **Registry Connect**
pack, and optionally keep a bootstrap credential in the Edge installer user data. A rotation then becomes a cluster
profile update, with no repave and no access to the Edge host.

This guide applies to centrally managed Edge clusters.

## How Palette Selects the Registry Credential

The Palette agent merges the external registries from the user data with the registries from the Registry Connect pack.
For each operation, the Edge host takes both the registry credential and the image mapping rules from the same source.
When both sources define the same registry hostname, the user data takes precedence until the Edge host joins a cluster,
and the Registry Connect pack takes precedence afterward.

| **Operation**                                              | **Credential and Mapping Rules Used**                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Edge host registration, including after an Edge host reset | User data                                                           |
| Cluster creation, and adding or replacing a node           | User data, if it defines the registry. Otherwise, Registry Connect. |
| Workload image pulls                                       | Registry Connect                                                    |
| Day-2 OS and Kubernetes upgrades                           | Registry Connect                                                    |
| Palette agent upgrades after cluster creation              | Registry Connect                                                    |

The credential in the user data is optional. If the user data does not define the registry, cluster creation uses the
Registry Connect credential and mapping rules from the cluster profile. In that case, an Edge host cannot pull a Palette
agent upgrade before it joins a cluster, so
[pause agent upgrades](../../../cluster-management/platform-settings/pause-platform-upgrades.md) before you register the
Edge hosts.

## Limitations

- The Registry Connect credential overrides the user data credential only when the registry hostname is identical in
  both places. For example, do not include `https://` or a port such as `:443` in only one of them.

- If the user data contains a credential for the registry, that credential must stay valid for as long as you register
  Edge hosts, add or replace nodes, or reset Edge hosts. If it is no longer valid, these operations fail, even when the
  Registry Connect credential is valid.

- Set the Registry Connect credential inline in the pack values. If the credential references a Kubernetes Secret,
  Palette cannot read the Secret while it creates the cluster, so pods created before the Registry Connect layer deploys
  use the user data credential.

- This guide does not apply to a registry credential set with `providerCredentials` in the OS pack. Palette does not
  apply changes to `providerCredentials` on existing Edge hosts. Refer to
  [Edge Cluster Upgrade Behavior](../../cluster-management/upgrade-behavior.md#os-layer).

<!-- TODO(DOC-3369): Registry certificate (CA) rotation is not answered yet. The Registry Connect pack has a
`charts.registry-connect.config.certificates` list that references a Secret, which might be the mechanism. -->

## Prerequisites

- A centrally managed Edge cluster whose hosts pull images from a private external registry configured with
  `stylus.externalRegistries` in the user data. Refer to
  [Deploy Cluster with a Private External Registry](./deploy-external-registry.md).

- The new credential for the registry. Keep the previous credential active until the Edge hosts use the new one.

- `kubectl` access to the cluster. Refer to [Kubectl](../../../cluster-management/palette-webctl.md).

## Rotate the Registry Credential

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**, and then select the cluster profile that your Edge cluster uses.

3. If the profile does not include the **Registry Connect** pack, add it as an add-on layer.

4. In the values of the **Registry Connect** pack, set the new credential for the registry hostname under
   `charts.registry-connect.config.registry.credentials`.

   ```yaml
   charts:
     registry-connect:
       config:
         registry:
           credentials:
             - domain: <registry-hostname>
               username: <username>
               password: <password>
   ```

   Replace `<registry-hostname>` with the hostname of the registry, exactly as it appears in `stylus.externalRegistries`
   in the user data. Replace `<username>` and `<password>` with the new credential.

5. If the Kubernetes layer of the profile configures a containerd registry mirror with a credential for the same
   registry, for example in `/etc/rancher/k3s/registries.yaml` for K3s, update that credential too. Registry Connect
   does not update the mirror credential. A change to the `stages` of the Kubernetes layer reboots each Edge host once.
   Refer to [Edge Cluster Upgrade Behavior](../../cluster-management/upgrade-behavior.md#kubernetes-layer).

6. Save the changes as a new version of the cluster profile.

7. Update your Edge cluster to the new profile version. Refer to
   [Update a Cluster](../../../cluster-management/cluster-updates.md).

   Palette updates the image pull secrets in every namespace and the registry login on each Edge host in place. The new
   Registry Connect credential does not reboot the Edge hosts or restart your pods.

8. If you added the Registry Connect pack to an existing cluster in step 3, restart the workloads on the cluster so that
   their image pull secrets use the new credential.

   <!-- TODO(DOC-3369): Confirm the scope of the restart (all Deployments, DaemonSets, and StatefulSets, or only the
   workloads that pull from the external registry). -->

9. In the audit log of your registry, confirm that the Edge hosts pull images with the new credential.

10. Revoke the previous credential in your registry.

## Validate

1. Start a test pod that pulls an image from the external registry. The `Always` pull policy forces a pull, even if the
   image is already on the Edge host. Replace `<registry-hostname>/<image>:<tag>` with an image in your registry.

   ```shell
   kubectl run registry-credential-test --image=<registry-hostname>/<image>:<tag> --image-pull-policy=Always --restart=Never
   ```

2. Check the events of the test pod.

   ```shell
   kubectl describe pod registry-credential-test
   ```

   The **Events** section shows a `Pulled` event. An `ErrImagePull` or `ImagePullBackOff` event means that the cluster
   still uses the previous credential.

3. Delete the test pod.

   ```shell
   kubectl delete pod registry-credential-test
   ```
