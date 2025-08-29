---
sidebar_label: "Deploy Cluster with a Primary Registry"
title: "Deploy Cluster with a Primary Registry"
description: "This page teaches you how to deploy a cluster with a primary registry."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

A primary registry is an in-cluster registry that stores images required for cluster deployment. If your local cluster
does not have internet connectivity, you can store all images required for cluster functionality in the primary registry
so your cluster can operate in a local environment. In addition, both local and central clusters can benefit from using
a primary registry for increased reliability and reduced bandwidth usage.

When your Edge cluster is created for the first time, all images in the `pack.content.images` field in each profile
layer loaded from the content bundle or external registries are stored locally in the primary registry. Subsequent image
pulls from the cluster are made to the primary registry. This allows your Edge cluster to reboot containers or add new
nodes using the content cached in the in-cluster registry. If any image cannot be found in the primary registry, the
Palette agent will then attempt to pull the images from the internet.

![Diagram of how the primary registry works in a cluster](/clusters_edge_registries_primary-registry.webp)

Any Open Container Initiative (OCI) compliant registry service can be used as a primary registry. We validate both Zot
and Harbor as two out-of-the-box primary registries that can be deployed with minimal custom configuration.

If you already have a cluster with the deprecated **Harbor Edge-Native Config** pack and want to migrate to the new
Harbor registry using **Registry Connect**, refer to
[Migrate from Harbor Edge-Native Config Pack](./migrate-edge-native-config.md).

:::warning

A primary registry is required for locally managed multi-node clusters without internet connectivity.

:::

## Limitations

- The Harbor registry is not supported on VerteX. If your Edge cluster is managed by a VerteX instance, you cannot use
  Harbor as a primary registry.

- You cannot use the Palette Edge CLI to upload images to the primary registry. You must use the Palette CLI instead.
  Refer to [Upload Cluster Images to Registry with the CLI](./upload-images-to-registry.md) for more information.

## Prerequisites

- At least one Edge host registered with your Palette account with an AMD64 (x86_64) processor architecture.

- Each of your Edge hosts must have at least 4 CPUs and 8 GB of RAM.

  - For single-node clusters, where there is only one Edge host handling both control plane and worker capabilities,
    your Edge host must have at least 6 CPUs and 12 GB of RAM.

- At least 300 GB of persistent storage. The actual amount of storage required depends on the size of your images.

- An Edge cluster profile. For information about how to create a cluster profile for Edge, refer to
  [Model Edge Cluster Profile](../../site-deployment/model-profile.md).

- Your Palette agent version is 4.6.13 or later. For central clusters, your Palette instance version is 4.6.19 or later.

## Deploy with a Primary Registry

You may use one of our built-in registry packs or your own custom OCI registry.

<Tabs group="Registry type">

<TabItem value="Built-in Registry Packs">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the profile you want to use to deploy the cluster.

<!-- prettier-ignore-start -->

4. Click **Add New Pack** and choose from either the
   <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack or the
   <VersionedLink text="Zot" url="/integrations/packs/?pack=zot" /> pack.
<!-- prettier-ignore-end-->

5. Configure the credentials used to log in to the registry.

   - For Harbor, modify the `charts.harbor.harborAdminPassword` parameter.

   - For Zot, modify the `charts.zot.registry.password` parameter.

6. Click **Confirm & Create**.

7. In the **Add-on** layers, add the **Registry Connect** pack.

8. In the **value.yaml** file of the **Registry Connect** pack, select a preset from the following options.

   - **Zot**. Select this if you want to use the built **Zot Internal Registry** pack and use Zot as your in-cluster
     primary registry.

   - **Harbor**. Select this if you want to use the built **Harbor Internal Registry** pack and use Harbor as your
     in-cluster primary registry.

9. Under `inClusterRegistry.projects`, the default project name under which the images are stored is `spectro-images`.
   You may change this value as you see fit.

10. (Optional) If your cluster is locally managed, and you do not want the cluster to access external registries or sync
    content to the primary registry, modify the `charts.registry-connect.config.content.sync.enable` parameter and set
    it to `false`. The parameter defaults to `true`, which means that it will attempt to download content from the
    internet and external registries if any of the content expected by the cluster is missing.

    Setting the parameter to false means you need to ensure that all images needed by your cluster are uploaded to the
    in-cluster registry. Any missing content may lead to application or cluster deployment failure.

    ```yaml {6}
    charts:
      registry-connect:
        config:
          content:
            sync:
              enable: false
              projects:
                images: spectro-images # project in the registry where docker images will be stored
    ```

11. Click **Confirm & Create** to finish customizing the **Registry Connect** pack.

12. Save and publish the new version of your profile.

13. Follow [Create Cluster Definition](../cluster-deployment.md) to create a cluster using the new profile.

</TabItem>

<TabItem value="Custom Registry">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the profile you want to use to deploy the cluster.

4. Add a pack for your custom registry. If you have made a custom pack, you can add the custom pack. Alternatively, you
   can also add a manifest or Helm charts for your registry. To learn how to make a custom pack, refer to
   [Add a Custom Pack](../../../../registries-and-packs/add-custom-packs.md).

   You need to take note of the following configurations about your registry and provide it to the **Registry Connect**
   pack later.

   - The Persistent Volume Claim (PVC) used for storage for your registry.
   - The login credentials to pull from and push to your registry.
   - The certificates used to secure connections to your registry.

5. In the **Add-on** layers, add the **Registry Connect** pack.

6. In the **value.yaml** file of the **Registry Connect** pack, do not select any preset and make your edits on the
   default values of the file.

7. Modify the `charts.registry-connect.config.registry.inClusterRegistry.credentials` parameter to specify the
   credentials for your registry.

8. Modify the `charts.registry-connect.config.registry.inClusterRegistry.storageCheck` parameter to specify the
   namespace and the persistent volume claim used by the registry for storage.

9. Modify the `charts.registry-connect.config.certificates` parameter to specify the location of the TLS certificates.

10. (Optional) If your cluster is locally managed, and you do not want the cluster to access external registries or sync
    content to the primary registry, modify the `charts.registry-connect.config.content.sync.enable` parameter and set
    it to `false`. The parameter defaults to `true`, which means that it will attempt to download content from the
    internet and external registries if any of the content expected by the cluster is missing.

    Setting the parameter to false means you need to ensure that all images needed by your cluster are uploaded to the
    in-cluster registry. Any missing content may lead to application or cluster deployment failure.

    ```yaml {6}
    charts:
      registry-connect:
        config:
          content:
            sync:
              enable: false
              projects:
                images: spectro-images # project in the registry where docker images will be stored
    ```

11. Click **Confirm & Create** to finish customizing the **Registry Connect** pack.

</TabItem>

</Tabs>

## Validate

1. Access the registry on the web at `<node-ip>:30003`. Replace `<node-ip>` with the IP address of any of the nodes in
   your cluster. If you changed the port that the registry is served on, replace the port number as well.

2. Use the credentials you provided in the cluster profile to log in to the registry.

3. Confirm that the cluster images have been pushed to the registry in the corresponding projects.

## Next Steps

You can upload one or more content bundles to your primary registry using Local UI. Refer to
[Upload Content Bundle](../../local-ui/cluster-management/upload-content-bundle.md) for more information.
