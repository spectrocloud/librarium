---
sidebar_label: "Export Cluster Definition"
title: "Export Cluster Definition"
description: "Instructions for exporting cluster definition."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

You can export cluster definitions from a cluster in Palette and use the definition to provision a cluster in an Edge
host. A cluster definition contains one or more cluster profiles, including the profile variables used in the profiles.

:::preview

:::

## Prerequisites

- At least one [cluster profile](/docs/docs-content/profiles/cluster-profiles/cluster-profiles.md) in Palette.

- A Palette API key. For more information on how to create a Palette API key, refer to
  [Create API Key](/docs/docs-content/user-management/authentication/api-key/create-api-key.md).

- curl is installed on your machine. You can also use API management tools such as Postman. This document uses curl as
  an example.

## Export Cluster Definition

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
   }
   ```

## Validate

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
