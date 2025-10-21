---
sidebar_label: "Migrate from Harbor Edge-Native Config Pack"
title: "Migrate from Harbor Edge-Native Config Pack"
description:
  "This page teaches you how to migrate from the Harbor Edge-Native Config Pack to the Registry Connect pack."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

Local Edge clusters without an internet connection are required to use an in-cluster primary registry to store images
needed for cluster deployment. Previously, this was implemented using the **Harbor Edge-Native Config** pack, which
installs the Harbor registry as well as handles image pull redirects.

The **Harbor Edge-Native Config** pack has been deprecated and will no longer be supported in a future release. If you
want to keep your cluster's registry infrastructure up-to-date, you need to migrate off the legacy pack and use the new
**Registry Connect** pack to implement the Harbor registry. This allows you to keep using the Harbor registry as the
primary registry and keep it up-to-date with the latest upstream updates.

## Limitations

- When you migrate off the **Harbor Edge-Native Config** pack, you cannot change the Harbor registry into another
  registry. You must select the Harbor registry to use as the primary registry for your cluster.

## Prerequisites

- An existing Edge cluster with the **Harbor Edge-Native Config** pack.

- (Local management mode only) A physical or virtual Linux machine with AMD64 (also known as x86_64) processor
  architecture. You can issue the following command in the terminal to check your processor architecture. You need this
  machine to build a content bundle needed to update the cluster.

  ```bash
  uname -m
  ```

- (Local management mode only) The latest version of the Palette Edge CLI. Refer to the
  [Downloads](../../../../downloads/cli-tools.md) page to download the CLI.

## Migrate from Harbor Edge-Native Config Pack to Registry Connect

1. [Log in to Local UI](../../local-ui/host-management/access-console.md) on your Edge host. On the home page, look to
   the upper-right corner in the **Palette** card to determine the agent version. If your agent version is 4.6.12 or
   earlier, you need to upgrade your agent version to 4.6.13 or later.

   The steps to upgrade can be performed in parallel with migrating from the **Harbor Edge-Native Config** pack. This
   guide will provide the applicable steps in parallel. If you want to upgrade first before performing the migration,
   refer to [Configure Palette Agent Version](../../cluster-management/agent-upgrade-airgap.md) for the upgrade steps.

2. Log in to [Palette](https:/console.spectrocloud.com).

3. From the left main menu, click **Profiles**.

4. Select the profile you want to use to deploy your cluster.

5. If your agent version is already 4.6.13 or later, you can skip this step.

   In the OS layer of the profile, include the following lines. Replace `versionNumber` with your target agent version
   number. This version must be 4.6.13 or later.

   ```yaml {10}
   pack:
     content:
       images:
         - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
         - image: "container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>"

   options:
     system.uri: spectrocloud/ubuntu:k3s-1.29.5-v4.5.8-palette-demo

   stylusPackage: container://us-docker.pkg.dev/palette-images/edge/stylus-linux-amd64:v<versionNumber>
   ```

6. Remove the **Harbor Edge-Native Config** pack from the profile.

7. Click **Add New Pack** and select the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack.

8. In the **values.yaml**, update `charts.harbor.harborAdminPassword` to the _same password_ as your existing Harbor
   registry.

9. If you have previously changed the serving port, PVC, or TLS certificates used by Harbor, you must modify the new
   Harbor pack parameters to match your previous configurations. Update node port, TLS certificates, and PVC
   configuration using the following parameters:

   - `charts.harbor.expose.nodePort`
   - `charts.harbor.expose.tls`
   - `charts.harbor.persistence.persistentVolumeClaim`

10. Click **Confirm & Create**.

<!-- prettier-ignore -->
11. Click **Add New Pack**. Select the <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> pack and select the **Harbor Internal Registry** preset.

12. Click **Confirm & Create**.

13. Save a new version of your cluster profile.

<Tabs group="deployment">

<TabItem value="Central">

14. Update your cluster to use the new profile. Refer to
    [Update a Cluster](../../../cluster-management/cluster-updates.md) for more information.

</TabItem>

<TabItem value="Local">

14. Use the following command to build a new content bundle and cluster definition. For more information, refer to
    [Export Cluster Definition](../../local-ui/cluster-management/export-cluster-definition.md) for more information.

    ```shell
     palette-edge build --api-key <API_KEY> \
     --project-id <PROJECT_ID> \
     --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
     --palette-endpoint <PALETTE_API_ENDPOINT> \
     --outfile <BUNDLE_NAME> \
     --cred-file-path <FILE_PATH> \
     --include-core-images-only \
     --cluster-definition-name <CLUSTER_DEFINITION_FILENAME> \
     --cluster-definition-profile-ids <CLUSTER_PROFILE_IDS>
    ```

    | Flag                         | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
    | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `--api-key`                  | Your Palette API key.                                                                                                                                                                                                                                                                                                                                                                                           |
    | `--cluster-profile-ids`      | Comma-separated list of cluster profile IDs to download content for.                                                                                                                                                                                                                                                                                                                                            |
    | `--cred-file-path`           | Path to the JSON file storing registry credentials if you are using a private registry.                                                                                                                                                                                                                                                                                                                         |
    | `--include-core-images-only` | Whether to include images for the Palette agent that are necessary for cluster creation only. By default, content bundles include images to support both cluster creation and cluster management. In the case of installations of locally managed Edge hosts, we recommend using this option to reduce the size of the content bundle, as Local UI currently does not offer native backup and support features. |
    | `--outfile`                  | Name of your content bundle. The final file name should have the following pattern: `core-<bundle-name>-random-string`.                                                                                                                                                                                                                                                                                         |
    | `--palette-endpoint`         | API endpoint for your Palette instance.                                                                                                                                                                                                                                                                                                                                                                         |
    | `--project-id`               | The ID of your Palette project.                                                                                                                                                                                                                                                                                                                                                                                 |
    | `--private-key`              | The path to the private key used to sign the content bundle and cluster definition if it is present. This is necessary if your Edge host has an embedded corresponding public key. For more information, refer to [Embed Public Key in Edge Artifacts](../../edgeforge-workflow/palette-canvos/signed-content.md).                                                                                              |

15. [Upload the new content bundle](../../local-ui/cluster-management/upload-content-bundle.md) to your Edge host.

16. Using the new cluster definition, update your cluster. Refer to
    [Update Local Cluster](../../local-ui/cluster-management/update-cluster.md) for more information.

</TabItem>

</Tabs>

## Validate

1. Access the registry from your browser at `https://NODE_IP:30003`. Replace `NODE_IP` with any IP address in your
   cluster. If you changed the port that the registry is served on, replace the port number as well.

2. Use the username `admin` and the password you configured to log in to Harbor.

3. Confirm that all cluster images are present in the Harbor registry.
