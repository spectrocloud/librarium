---
sidebar_label: "Export Cluster Definition"
title: "Export Cluster Definition"
description: "Instructions for exporting cluster definition."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

You can export cluster definitions from a cluster in Palette and use the definition to provision or update a cluster in
an Edge host. A cluster definition contains one or more cluster profiles, including the profile variables used in the
profiles.

:::info

If you create a new cluster or update an existing one with a cluster definition and content bundle built on a Palette
instance, your Palette agent will be updated to match the version of that Palette instance. This may result in an
upgrade if the instance is newer than your Palette agent, or a downgrade if it is older.

:::

You can use either the Palette Edge CLI to export the cluster definition or use the Palette API. The CLI offers a more
user-friendly interface, but requires a machine with X86_64 architecture. If you are on an ARM64 machine such as Apple
Silicon, use the API approach instead.

:::preview

:::

## Export Cluster Definition with Palette Edge CLI

You can export cluster definitions with the Palette Edge CLI. This approach allows you to create a content bundle at the
same time in a single command.

### Prerequisites

- At least one [cluster profile](/docs/docs-content/profiles/cluster-profiles/cluster-profiles.md) in Palette.

- A Palette API key. For more information on how to create a Palette API key, refer to
  [Create API Key](/docs/docs-content/user-management/authentication/api-key/create-api-key.md).

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture. You can issue the
  following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

### Instructions

1. Download the Palette Edge CLI. Refer to the [Palette CLI Compatibility Matrix](../../../../downloads/cli-tools.md) to
   find a compatible CLI version and replace `<palette-edge-cli-version>` with the selected version.

   ```shell
   VERSION=<palette-edge-cli-version>
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Use the following command to move the palette-edge binary to the **/usr/local/bin** directory to make the binary
   available in your system $PATH. This will allow you to issue the `palette-edge` command from any directory in your
   development environment.

   ```bash
   mv palette-edge /usr/local/bin
   ```

3. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display a list of
   available commands and flags for the CLI.

   ```bash
   palette-edge --help
   ```

   ```hideClipboard bash
   Usage:
   palette-edge [command]

   Available Commands:
   build            Build the content
   build-from-local
   deploy
   help             Help about any command
   show             Display all the preset default values and supported OS and K8S flavors
   upload

   Flags:
         --config string    config file (default is $HOME/.palette-edge-cli.yaml)
         --debug            set to enable debug logging [default: false]
   -h, --help             help for palette-edge
         --logfile string   log file name
         --trace            set to enable trace logging [default: false]

   Use "palette-edge [command] --help" for more information about a command.
   ```

4. Log in to [Palette](https://console.spectrocloud.com).

5. Select the project you want to deploy the Edge host to and copy down the **Project ID**. You can find the project id
   at the top right side corner of the landing page below the **User drop-down Menu**.

6. Navigate to the left **Main Menu** and select **Profiles**.

7. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

8. Click on the cluster profile you want to include in the cluster definition.

9. You can find the cluster profile ID by reviewing the URL of the current page. The cluster profile ID is the last
   value in the URL. Repeat this step for all the cluster profiles you want to include in the cluster definition.

   ```text
   https://console.spectrocloud.com/projects/yourProjectId/profiles/cluster/<YourClusterProfileHere>
   ```

   Make sure the combination of profiles you choose to export can be used to provision a cluster together. This means
   that you cannot include more than one profile that has infrastructure layers and cannot have duplicate packs between
   the profiles.

10. Issue the following command to export the cluster definition.

    ```shell
    palette-edge build --api-key <apiKey> \
    --project-id <projectId> \
    --palette-endpoint <paletteEndpoint> \
    --cluster-definition-name <clusterDefinitionName> \
    --cluster-definition-profile-ids <clusterDefinitionProfileId1,clusterDefinitionProfileId2,...>
    ```

    | Flag                               | Description                                                                                                                                                                                                                                                                                                        |
    | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | `--api-key`                        | Your Palette API key.                                                                                                                                                                                                                                                                                              |
    | `--palette-endpoint`               | API endpoint for your Palette instance.                                                                                                                                                                                                                                                                            |
    | `--project-id`                     | The ID of your Palette project.                                                                                                                                                                                                                                                                                    |
    | `--cluster-definition-name`        | Filename of the cluster definition tgz file.                                                                                                                                                                                                                                                                       |
    | `--cluster-definition-profile-ids` | List of cluster profile IDs to be included in the cluster definition.                                                                                                                                                                                                                                              |
    | `--private-key`                    | The path to the private key used to sign the cluster definition and content bundle if it is present. This is necessary if your Edge host has an embedded corresponding public key. For more information, refer to [Embed Public Key in Edge Artifacts](../../edgeforge-workflow/palette-canvos/signed-content.md). |

11. (Optional) You can also build a content bundle together with your cluster definition in a single command by adding a
    few additional flags to the command. Content bundles are archives of all the required container images required for
    one or more cluster profiles. You can upload a content bundle to your Edge host through Local UI, and use the
    resources in the content bundle to provision clusters without a connection to external networks. For more
    information, refer to [Build Content Bundles](../../edgeforge-workflow/palette-canvos/build-content-bundle.md).

    ```shell
     palette-edge build --api-key <API_KEY> \
     --project-id <PROJECT_ID> \
     --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> \
     --palette-endpoint <PALETTE_API_ENDPOINT> \
     --outfile <BUNDLE_NAME> \
     --cred-file-path <FILE_PATH> \
     --include-palette-content \
     --cluster-definition-name <CLUSTER_DEFINITION_FILENAME> \
     --cluster-definition-profile-ids <CLUSTER_PROFILE_IDS>
    ```

    | Flag                         | Description                                                                                                                                                                                                                                                                                                                            |
    | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `--api-key`                  | Your Palette API key.                                                                                                                                                                                                                                                                                                                  |
    | `--cluster-profile-ids`      | Comma-separated list of cluster profile IDs to download content for.                                                                                                                                                                                                                                                                   |
    | `--cred-file-path`           | Path to the JSON file storing registry credentials if you are using a private registry.                                                                                                                                                                                                                                                |
    | `--include-palette-content`  | Whether to include images for the Palette agent itself, including images to support cluster creation and cluster management. For airgap installations, you must use either this option or the `--include-core-images-only` option. We recommend you use `--include-core-images-only` instead to reduce the size of the content bundle. |
    | `--include-core-images-only` | Whether to include images for the Palette agent that are necessary for cluster creation only. In airgap installations, we recommend using this option instead of `--include-palette-content` to reduce the size of the content bundle, as Local UI currently does not offer native backup and support features.                        |
    | `--outfile`                  | Name of your content bundle. The final file name should have the following pattern: `core-<bundle-name>-random-string`.                                                                                                                                                                                                                |
    | `--palette-endpoint`         | API endpoint for your Palette instance.                                                                                                                                                                                                                                                                                                |
    | `--project-id`               | The ID of your Palette project.                                                                                                                                                                                                                                                                                                        |
    | `--private-key`              | The path to the private key used to sign the content bundle and cluster definition if it is present. This is necessary if your Edge host has an embedded corresponding public key. For more information, refer to [Embed Public Key in Edge Artifacts](../../edgeforge-workflow/palette-canvos/signed-content.md).                     |

### Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, click on **Cluster**.

3. Try creating a cluster with the exported cluster definition. For more information, refer to
   [Create a Local Cluster](../cluster-management/create-cluster.md).

4. A successful cluster definition export will display the correct profile layers from the cluster creation view.

## Export Cluster Definition with Palette API

If you do not have an AMD64 machine, or you do not want to download and use the Palette Edge CLI, you can still export
cluster definitions using the Palette API.

### Prerequisites

- At least one [cluster profile](/docs/docs-content/profiles/cluster-profiles/cluster-profiles.md) in Palette.

- A Palette API key. For more information on how to create a Palette API key, refer to
  [Create API Key](/docs/docs-content/user-management/authentication/api-key/create-api-key.md).

- curl is installed on your machine. You can also use API management tools such as Postman. This document uses curl as
  an example.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, select **Profiles**.

3. Select a profile you want to include in the cluster definition.

4. Inspect the URL of the page. The URL has the following format:
   `https://console.spectrocloud.com/projects/[ProjectID]/profiles/cluster/[ProfileID]`.

5. Extract the project ID and the profile ID from the URL.

6. If you want to include another profile in the cluster definition, repeat step 3 - 4 and extract the profile ID for
   each profile you want to export. All profiles must be in the same project.

   Make sure the combination of profiles you choose to export can be used to provision a cluster together. This means
   that you cannot include more than one profile that has infrastructure layers and cannot have duplicate packs between
   the profiles.

7. Use the Palette Download Cluster Definition API to download the cluster definition. The endpoint location is
   `POST https://api.spectrocloud.com/v1/spectroclusters/spc/download`. If you are using a self-hosted Palette instance,
   replace the base URL `api.spectrocloud.com` with API endpoint address of your Palette instance.

   The endpoint takes a few header arguments and a request body.

   | Header Parameter | Description                                                                                                      |
   | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
   | `ProjectUid`     | The unique ID of the project where the profiles are located.                                                     |
   | `Content-Type`   | You must set the value of this header to `application/json` to indicate that your payload is in the JSON format. |
   | `ApiKey`         | The value of your Palette API key.                                                                               |

   In the request body, you must provide the ID of the cluster profiles to include in the cluster definition.

   | Parameter        | Description                                                                                                                                                                                                                           |
   | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `metadata`       | You must set the value of this field to `{"name":"cluster-profiles"}`.                                                                                                                                                                |
   | `spec.cloudType` | You must set the value of this field to `edge-native`.                                                                                                                                                                                |
   | `spec.profiles`  | Provide the exact list of cluster profiles to include in the cluster definition. Inside the list are objects representing the cluster profiles. Each object must have the required key `uid`, which is the ID of the cluster profile. |

   The following curl command is an example.

   ```shell
   curl --location 'https://api.spectrocloud.com/v1/spectroclusters/spc/download' \
   --header 'ProjectUid: 5fbbf0XXXXX' \
   --header 'Content-Type: application/json' \
   --header 'ApiKey: XXXXXXXX' \
   --output ~/Downloads/demo/cluster-definition.tgz \
   --data-raw '{
   "metadata": { "name": "cluster-profiles" },
   "spec":
       {
           "cloudType": "edge-native",
           "profiles":
               [
                   {
                       "uid": "65c90XXXXX770dae35"
                   },
                   {
                       "uid": "65c91XXXXa9fe4f51c"
                   }
               ]
       }
   }'
   ```

### Validate

1. Log in to [Local UI](../host-management/access-console.md).

2. From the left **Main Menu**, click on **Cluster**.

3. Try creating a cluster with the exported cluster definition. For more information, refer to
   [Create a Local Cluster](../cluster-management/create-cluster.md).

4. A successful cluster definition export will display the correct profile layers from the cluster creation view.

## Next Steps

You can build the cluster definition into the Edge Installer ISO, or upload the cluster definition to an existing Edge
deployment using Local UI during cluster creation.

- [Build Edge Installer ISO](../../edgeforge-workflow/palette-canvos/build-installer-iso.md)

- [Create Local Cluster](../cluster-management/create-cluster.md)
