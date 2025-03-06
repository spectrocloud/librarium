---
sidebar_label: Deploy with a Primary Registry"
title: Deploy with a Primary Registry"
description: "This page teaches you how to deploy a cluster with a primary registry."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

A primary registry is an in-cluster registry that stores images required for cluster deployment. Every disconnected Edge
cluster requires a primary registry.

When your Edge cluster is created for the first time, all images from add-on packs downloaded from external registries
are stored locally in the primary registry. Subsequent image pulls from the cluster are made to the primary registry.
This allows your Edge cluster to reboot containers or add new nodes without being connected to the external network and
reduce bandwidth usage.

Any Open Container Initiative (OCI) compliant registry service and be used as a primary registry. We validate both Zot
and Harbor as two out-of-the-box primary registries that can be deployed with minimal custom configuration.

If you already have a cluster with the **Harbor Edge-Native Config** pack, and want to migrate

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

4. In the **Add-on** layers, add the **Registry Connect** pack.

5. In the **value.yaml** file of the **Registry Connect** pack, select a preset from the following options.

   - **Zot**. Select this if you want to use the built **Zot Internal Registry** pack and use Zot as your in-cluster
     primary registry.

   - **Harbor**. Select this if you want to use the built **Harbor Internal Registry** pack and use Harbor as your
     in-cluster primary registry

6. Modify the `charts.registry-connect.config.registry.inClusterRegistry.credentials` parameter to specify the
   credentials for your registry. You may change the `passwordRef` parameter to refer to a secret or config map value
   that you define.

   You may also change the parameter name to `password` and provide a string password instead of an object reference. If
   you choose to do so, we recommend you use a [macro](../../../cluster-management/macros.md) or
   [profile variable](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/create-cluster-profile-variables.md)
   to avoid exposing sensitive information in your cluster profile.

7. Under `inClusterRegistry.projects`, the default project name under which the images are stored is `spectro-images`,
   and packs are stored under `spectro-packs`. You may change these values as you see fit.

8. Click **Confirm & Create** to finish customizing the **Registry Connect** pack.

9. Depending on which preset you chose, select the corresponding registry pack to add to your cluster profile.

10. Save and publish the new version of your profile.

11. Follow [Create Local Cluster](../../local-ui/cluster-management/create-cluster.md) to create a cluster using the new
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

<Tabs>

## Validate

1. Access the registry on the web at `SERVICE-IP:30003`. Replace `SERVICE-IP` with the IP address of the registry
   service.

2. Use the credentials you provided in the cluster profile to log in to the registry.

3. Confirm that the cluster images have been pushed to the registry in the corresponding projects.
