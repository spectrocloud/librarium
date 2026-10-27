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
registry credentials remotely from Palette. You keep a bootstrap credential in the Edge installer user data and set the
credential that your clusters use in the **Registry Connect** pack. A rotation then becomes a cluster profile update,
with no repave and no access to the Edge host.

This guide applies to centrally managed Edge clusters.

## How Palette Selects the Registry Credential

The Palette agent merges the external registries from the user data with the registries from the Registry Connect pack.
When both define a credential for the same registry hostname, the Registry Connect credential takes precedence.

| **Operation**                                                    | **Credential Used** |
| ---------------------------------------------------------------- | ------------------- |
| Workload image pulls                                             | Registry Connect    |
| Day-2 OS and Kubernetes upgrades                                 | Registry Connect    |
| Palette agent upgrades on existing Edge hosts                    | Registry Connect    |
| Edge host registration, including the Palette agent upgrade then | User data           |
| Adding or replacing a node                                       | User data           |
| Edge host reset                                                  | User data           |

<!-- TODO(DOC-3369): Add the outcome of the lab validation in SUS 2097: whether a `registryMappingRules` entry for
`us-docker.pkg.dev` in the user data covers the Palette agent upgrade pull at registration and on Day 1, and whether
the agent upgrade uses `imageReplacementRules` from the Registry Connect pack. -->

## Limitations

- The Registry Connect credential overrides the user data credential only when the registry hostname is identical in
  both places.

- The bootstrap credential in the user data must stay valid for as long as you register Edge hosts, add or replace
  nodes, or reset Edge hosts.

- Set the Registry Connect credential inline in the pack values. If the credential references a Kubernetes Secret,
  Palette cannot read the Secret while it creates the cluster, so pods created before the Registry Connect layer deploys
  use the user data credential.

<!-- TODO(DOC-3369): Registry certificate (CA) rotation is not answered yet. The Registry Connect pack has a
`charts.registry-connect.config.certificates` list that references a Secret, which might be the mechanism. -->

## Prerequisites

- A centrally managed Edge cluster whose hosts pull images from a private external registry configured with
  `stylus.externalRegistries` in the user data. Refer to
  [Deploy Cluster with a Private External Registry](./deploy-external-registry.md).

- The new credential for the registry.

- If you add the Registry Connect pack to an existing cluster, `kubectl` access to the cluster. Refer to
  [Kubectl](../../../cluster-management/palette-webctl.md).

## Rotate the Registry Credential

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**, and then select the cluster profile that your Edge cluster uses.

3. If the profile does not include the **Registry Connect** pack, add it as an add-on layer.

4. In the values of the **Registry Connect** pack, set the new credential for the registry hostname under
   `charts.registry-connect.config.registry.credentials`.

   <!-- TODO(DOC-3369): Confirm the key for an inline password. Registry Connect 0.2.2 documents only `passwordRef`. -->

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

5. Save the changes as a new version of the cluster profile.

6. Update your Edge cluster to the new profile version. Refer to
   [Update a Cluster](../../../cluster-management/cluster-updates.md).

7. If you added the Registry Connect pack to an existing cluster in step 3, restart the workloads on the cluster so that
   their image pull secrets use the new credential.

   <!-- TODO(DOC-3369): Confirm the scope of the restart (all Deployments, DaemonSets, and StatefulSets, or only the
   workloads that pull from the external registry). -->

8. Revoke the previous credential in your registry.

## Validate

<!-- TODO(DOC-3369): Add a validation step, for example a test Pod that pulls from the external registry after the
previous credential is revoked. -->
