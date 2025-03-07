---
sidebar_label: "Deploy with a Primary Registry"
title: "Deploy with a Primary Registry"
description: "This page teaches you how to deploy a cluster with a primary registry."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

A primary registry is an in-cluster registry that stores images required for cluster deployment. Every disconnected Edge
cluster must have a primary registry.

When your Edge cluster is created for the first time, all images from add-on packs loaded from the content bundle or
external registries are stored locally in the primary registry. Subsequent image pulls from the cluster are made to the
primary registry. This allows your Edge cluster to reboot containers or add new nodes without being connected to the
external network and reduce bandwidth usage.

![Diagram of how the primary registry works in a cluster](/clusters_edge_registries_primary-registry.webp)

Any Open Container Initiative (OCI) compliant registry service and be used as a primary registry. We validate both Zot
and Harbor as two out-of-the-box primary registries that can be deployed with minimal custom configuration.

If you already have a cluster with the deprecated **Harbor Edge-Native Config** pack, and want t

## Prerequisite

- At least one Edge host registered with your Palette account with an AMD64 or x86_64 processor architecture.

- Each of your Edge hosts must have at least 4 CPUs and 8 GB of RAM.

  - For single-node clusters, where there is only one Edge host handling both control plane and worker capabilities,
    your Edge host must have at least 6 CPUs and 12 GB of RAM.

- At least 300 GB of persistent storage. The actual amount of storage required depends on the size of your images.

- An Edge cluster profile. For information about how to create a cluster profile for Edge, refer to
  [Model Edge Cluster Profile](../../site-deployment/model-profile.md).

## Deploy with a Primary Registry

<Tabs group="Registry type">

<TabItem value="Built-in Registry Packs">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the profile you use to deploy the cluster.

<!-- prettier-ignore -->
4. Click **Add New Pack** and choose from either the
   <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack or the
   <VersionedLink text="Zot" url="/integrations/packs/?pack=zot" /> pack.

5. Configure the credentials used to log in to the registry.

   - For Harbor, modify the `charts.harbor.harborAdminPassword` parameter.

   - For Zot, modify the `charts.zot.registryPassword` parameter.

6. Click **Confirm & Create**.

7. In the **Add-on** layers, add the **Registry Connect** pack.

8. In the **value.yaml** file of the **Registry Connect** pack, select a preset from the following options.

   - **Zot**. Select this if you want to use the built **Zot Internal Registry** pack and use Zot as your in-cluster
     primary registry.

   - **Harbor**. Select this if you want to use the built **Harbor Internal Registry** pack and use Harbor as your
     in-cluster primary registry.

9. Under `inClusterRegistry.projects`, the default project name under which the images are stored is `spectro-images`,
   and packs are stored under `spectro-packs`. You may change these values as you see fit.

10. Click **Confirm & Create** to finish customizing the **Registry Connect** pack.

11. Save and publish the new version of your profile.

12. Follow [Create Local Cluster](../../local-ui/cluster-management/create-cluster.md) to create a cluster using the new
    profile.

<TabItem>

<TabItem value="Custom Registry">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the profile you use to deploy the cluster.

4. In the **Add-on** layers, add the **Registry Connect** pack.

5. In the **value.yaml** file of the **Registry Connect** pack, do not select any preset and make your edits on the
   default values of the file.

6. Modify the `charts.registry-connect.config.registry.inClusterRegistry.credentials` parameter to specify the
   credentials for your registry.

7. Click **Confirm & Create** to finish customizing the **Registry Connect** pack.

</TabItem>

</Tabs>

## Validate

1. Access the registry on the web at `SERVICE-IP:30003`. Replace `SERVICE-IP` with the IP address of the registry
   service.

2. Use the credentials you provided in the cluster profile to log in to the registry.

3. Confirm that the cluster images have been pushed to the registry in the corresponding projects.
