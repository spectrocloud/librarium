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

- At least one [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) in Palette.

- A Palette API key. For more information on how to create a Palette API key, refer to
  [Create API Key](../../../user-management/authentication/api-key/create-api-key.md).

- curl is installed on your machine. You can also use API management tools such as Postman. This document uses curl as
  an example.

## Export Cluster Definition

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, select **Profiles**.

3. Select a profile you want to include in the cluster definition.

4. Inspect the URL of the page. The URL has the following format:
   `https://console.spectrocloud.com/projects/[ProjectID]/profiles/cluster/[ProfileID]`.

5. Extract the project ID and the profile ID from the URL.

6. Use the [Download Cluster Definition API] to download the cluster definition. The following curl command is an
   example.

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
                       "uid": "65c90XXXXX770dae35",
                       "packs": []
                   },
                   {
                       "uid": "65c91XXXXa9fe4f51c",
                       "packs":[]
                   }
               ]
       }

   }
   ```

## Validate

1. Log in to [Edge Management Console](./access-console.md).

2. From the left **Main Menu**, click on **Cluster**.

3. Try creating a cluster with the exported cluster definition. For more information, refer to
   [Create a Local Cluster](./create-cluster.md).

4. A successful cluster definition export will display the correct profile layers from the cluster creation view.

## Next Steps

You can build the cluster definition into the Edge Installer ISO, or upload the cluster definition to an existing Edge
deployment using Edge Management Console during cluster creation.

- [Build Edge Installer ISO](../edgeforge-workflow/build-installer-iso.md)

- [Create Local Cluster](./create-cluster.md)
