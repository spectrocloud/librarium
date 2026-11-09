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
   Registry Connect credential does not reboot the Edge hosts, and you do not need to restart your workloads. Existing
   pods use the new credential the next time they pull an image, for example when a container restarts or a pod is
   rescheduled. This also applies when you add the Registry Connect pack to an existing cluster in step 3, because
   Registry Connect writes the new credential to the image pull secret that the pods already use.

8. Confirm that the image pull secret contains the new credential. Registry Connect creates the secret in every
   namespace and names it after the registry hostname, with each period replaced by a dash.

   ```shell
   kubectl get secret <registry-hostname-with-dashes>-pull-secret --namespace default \
     --output jsonpath='{.data.\.dockerconfigjson}' | base64 --decode
   ```

   Replace `<registry-hostname-with-dashes>` with the registry hostname, with each period replaced by a dash. For
   example, the secret for `registry.example.com` is `registry-example-com-pull-secret`.

   The output shows the new username. The audit log of your registry also shows pulls with the new credential, but only
   for images that are not on the Edge hosts yet. When an image is already on a host, the registry receives only a check
   request, which some registries do not log as a pull.

9. Revoke the previous credential in your registry.

## Validate

Validate the rotation after you revoke the previous credential. While the previous credential is still active, a
successful image pull does not show which credential the cluster used.

1. Start a test pod that pulls an image from the external registry. With the `Always` pull policy, the Edge host checks
   the image with the registry each time the pod starts, even if the image is already on the host. This check requires a
   valid credential.

   ```shell
   kubectl run registry-credential-test \
     --image=<registry-hostname>/<repository>/<image>:<tag> \
     --image-pull-policy=Always --restart=Never -- sleep 30
   ```

   Replace `<registry-hostname>`, `<repository>`, `<image>`, and `<tag>` with the full path of an image in your
   registry, as it is stored there. Do not use a short image name such as `busybox:1.36`. The image mapping rules
   rewrite a short name to a different path, and the pull fails if the image does not exist at that path.

2. Check the events of the test pod.

   ```shell
   kubectl describe pod registry-credential-test | grep --extended-regexp "Pulled|Failed"
   ```

   | **Event**                                       | **Meaning**                                                                                                           |
   | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
   | `Pulled`                                        | The cluster pulls images with the new credential.                                                                     |
   | `Failed` with `401 Unauthorized`                | The credential is wrong or has not reached the cluster yet. Check the image pull secret again.                        |
   | `Failed` with `not found` or `manifest unknown` | The image path does not exist in the registry, or a mapping rule points to a different path. The credential is valid. |

3. If you also rotated the containerd mirror credential in step 5 of
   [Rotate the Registry Credential](#rotate-the-registry-credential), restart CoreDNS and confirm that its pods return
   to the `Running` state. CoreDNS does not use the image pull secret, so it pulls through the containerd mirror. The
   restart briefly interrupts DNS lookups in the cluster.

   ```shell
   kubectl delete pod --namespace kube-system --selector k8s-app=kube-dns
   kubectl get pods --namespace kube-system --selector k8s-app=kube-dns
   ```

4. Delete the test pod.

   ```shell
   kubectl delete pod registry-credential-test
   ```
