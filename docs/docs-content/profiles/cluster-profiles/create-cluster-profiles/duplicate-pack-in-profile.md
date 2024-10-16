---
sidebar_label: "Deploy the Same Pack to Multiple Layers"
title: "Deploy the Same Pack to Multiple Layers"
description: "Learn how to deploy the same pack to multiple layers in a Palette cluster profile."
hide_table_of_contents: false
sidebar_position: 30
tags: ["profiles", "cluster profiles", "packs"]
---

Palette allows you to add a pack multiple times to the same cluster profile, which may be required in certain scenarios
where an integration needs to be installed more than once with different configurations. For example, you may need to
deploy two instances of the same microservice or application, but with different configurations.

This page guides you through the process of creating a cluster profile with repeated packs using either the Palette UI
or the API. This guide uses the [Hello Universe](https://github.com/spectrocloud/hello-universe) pack as an example.

:::warning

Depending on the application, you might need to place the repeated pack in a different namespace, as resource conflicts
could arise if the original pack has Kubernetes resources with the same names as those the second pack would create.

:::

## Prerequisites

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Cluster Profile Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  page for more information about roles and permissions.

</TabItem>
<TabItem label="API" value="api">

- Your Palette account role must have the `clusterProfile.Create` and `clusterProfile.Publish` permissions to create and
  publish a profile. Refer to the
  [Cluster Profile Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  page for more information about roles and permissions.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for instructions on creating an API key.

</TabItem>
</Tabs>

## Create a Cluster Profile with Repeated Packs

<Tabs groupId="manual">

<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Profiles**.

3. Click on **Add Cluster Profile** to create a cluster profile.

4. In the **Basic Information** section, enter a name for the profile, select the type as **Add-on**, and click
   **Next**.

5. Select **Add New Pack**. In the window that appears, choose **Palette Community Registry** from the **Registry**
   dropdown and select the **Hello Universe** pack **v1.2.0**.

6. After selecting the pack, Palette will display its README. Click on **Values** under **Pack Details** to edit the
   pack values.

7. To allow the Hello Universe pack to be added multiple times to the profile, include the following lines in the pack
   values within the YAML editor:

   - **Display Name**: Add the `spectrocloud.com/display-name: <custom_name>` key. The `<custom_name>` key must be a
     unique name across the cluster profile. For this example, use `spectrocloud.com/display-name: hellouni-1`.

   - **Release Name Override**: It associates the pack's release name with the display name you created. Include the
     line `releaseNameOverride:  hello-universe: hellouni-1` according to the snippet below, where `hello-universe` is
     the pack's release name and `hellouni-1` is the display name.

   - **Namespace**: Include the line `namespace: hello-universe-1`. Note that in this example, the packs are deployed to
     different namespaces to avoid resource conflicts.

   ```yaml {5-8,15}
   pack:
     content:
       images:
         - image: ghcr.io/spectrocloud/hello-universe:1.2.0
     spectrocloud.com/display-name: hellouni-1
     releaseNameOverride:
       hello-universe: hellouni-1
     namespace: hello-universe-1

   manifests:
     hello-universe:
       images:
         hellouniverse: ghcr.io/spectrocloud/hello-universe:1.2.0
       apiEnabled: false
       namespace: hello-universe-1
       port: 8080
       replicas: 1
   ```

   Click **Confirm and Create** to create the profile layer.

8. Repeat steps **5** through **7** to add a second Hello Universe layer to the profile. This time, use `hellouni-2` as
   the display name and `hello-universe-2` as the namespace.

   ```yaml {5-8,15}
   pack:
     content:
       images:
         - image: ghcr.io/spectrocloud/hello-universe:1.2.0
     spectrocloud.com/display-name: hellouni-2
     releaseNameOverride:
       hello-universe: hellouni-2
     namespace: hello-universe-2

   manifests:
     hello-universe:
       images:
         hellouniverse: ghcr.io/spectrocloud/hello-universe:1.2.0
       apiEnabled: false
       namespace: hello-universe-2
       port: 8080
       replicas: 1
   ```

   Once you finish making the alterations, click **Next** to proceed.

9. Click **Finish Configuration** to create the cluster profile.

</TabItem>
<TabItem label="API" value="api">

1. Open a terminal window and export your Palette API key as an environment variable. Replace `<your-api-key>` with your
   API key.

   ```shell
   export API_KEY=<your-api-key>
   ```

2. Use the Palette API endpoint
   [`https://api.spectrocloud.com/v1/clusterprofiles`](https://docs.spectrocloud.com/api/v1/v-1-cluster-profiles-create/)
   to create a cluster profile with repeated packs.

   The snippet below creates an
   [add-on cluster profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md) named
   `profile-with-repeated-packs` with two layers of the Hello Universe pack.

   The pack's `name` must be unique and follow the pattern `<display-name>--<manifest-name>` for manifest-based packs,
   and `<display-name>--<chart-name>` for Helm-based packs.

   In this example, the first layer of the profile is named `hellouni-1--hello-universe`, while the second layer is
   named `hellouni-2--hello-universe`, where `hello-universe` is the pack's manifest name, and `hellouni-1` and
   `hellouni-2` are the display names for each layer.

   The pack's `values` field must include three key elements:

   - **Display Name**: Defined by the `spectrocloud.com/display-name: \"hello-uni-1\"` line for the first layer of the
     profile and `spectrocloud.com/display-name: \"hello-uni-2\"` for the second layer.

   - **Release Name Override**: It associates the pack's release name with the display name you created. In this
     example, the `releaseNameOverride` is defined by the `releaseNameOverride:\n    hello-universe: hellouni-1` line
     for the first layer of the profile and `releaseNameOverride:\n    hello-universe: hellouni-2` for the second layer.

   - **Namespace**: Specified by the `namespace: hello-universe-1` line for the first layer of the profile and
     `namespace: hello-universe-2` for the second layer. Note that in this example, the packs are deployed to different
     namespaces to avoid resource conflicts.

     ```shell {7,18,23,36,41}
       curl --location 'https://api.spectrocloud.com/v1/clusterprofiles' \
       --header 'Content-Type: application/json' \
       --header 'Accept: application/json' \
       --header "ApiKey: $API_KEY" \
       --data '{
           "metadata": {
               "name": "profile-with-repeated-packs",
               "description": "",
               "labels": {}
           },
           "spec": {
               "version": "1.0.0",
               "template": {
                   "type": "add-on",
                   "cloudType": "all",
                   "packs": [
                       {
                           "name": "hellouni-1--hello-universe",
                           "type": "oci",
                           "layer": "addon",
                           "version": "1.2.0",
                           "tag": "1.2.0",
                           "values": "# spectrocloud.com/enabled-presets: Backend:disable-api\npack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.2.0\n  spectrocloud.com/display-name: hellouni-1\n  releaseNameOverride:\n    hello-universe: hellouni-1\n  namespace: hello-universe-1\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.2.0\n    apiEnabled: false\n    namespace: hello-universe-1\n    port: 8080\n    replicas: 1",
                           "uid": "66f2014fb6f389d01ddeb015",
                           "registry": {
                               "metadata": {
                                   "uid": "64eaff5630402973c4e1856a",
                                   "name": "Palette Community Registry",
                                   "kind": "oci",
                                   "isPrivate": true,
                                   "providerType": "pack"
                               }
                           }
                       },
                       {
                           "name": "hellouni-2--hello-universe",
                           "type": "oci",
                           "layer": "addon",
                           "version": "1.2.0",
                           "tag": "1.2.0",
                           "values": "# spectrocloud.com/enabled-presets: Backend:disable-api\npack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.2.0\n  spectrocloud.com/display-name: hellouni-2\n  releaseNameOverride:\n    hello-universe: hellouni-2\n  namespace: hello-universe-2\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.2.0\n    apiEnabled: false\n    namespace: hello-universe-2\n    port: 8080\n    replicas: 1",
                           "uid": "66f2014fb6f389d01ddeb015",
                           "registry": {
                               "metadata": {
                                   "uid": "64eaff5630402973c4e1856a",
                                   "name": "Palette Community Registry",
                                   "kind": "oci",
                                   "isPrivate": true,
                                   "providerType": "pack"
                               }
                           }
                       }
                   ]
               },
               "variables": []
           }
       }'
     ```

     The example output below displays the Unique Identifier (UID) of the created cluster profile.

     ```text hideClipboard
       {"uid":"66f6ca527392b7a5d3d43122"}
     ```

3. Use the Palette API endpoint
   [`https://api.spectrocloud.com/v1/clusterprofiles/:uid/publish`](https://docs.spectrocloud.com/api/v1/v-1-cluster-profiles-publish/)
   to publish the cluster profile and make it available in Palette. Replace `:uid` with the UID of your cluster profile.

   ```bash
    curl --location --request PATCH 'https://api.spectrocloud.com/v1/clusterprofiles/:uid/publish' \
    --header "ApiKey: $API_KEY"
   ```

</TabItem>
</Tabs>

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile you have created.

3. Verify that the cluster profile contains two layers with the same pack, and that these layers have different names.
