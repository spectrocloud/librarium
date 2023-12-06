---
sidebar_label: "Enable Local Harbor Image Registry"
title: "Enable Local Harbor Image Registry"
description: "Guide to enabling a local harbor registry on an Edge deployment."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge allows you provision a local Harbor image registry as part of your Edge deployment. When your Edge cluster is created for the first time, all images downloaded from external registries are stored locally in the Harbor registry. Subsequent image pulls from the cluster are made to the local Harbor registry. This allows your Edge cluster to reboot containers or add new nodes without being connected to the external network. 


![Local Harbor Registry Architecture](/clusters_edge_networking_local_harbor_architecture.png)

## Prerequisites
- At least one Edge host with an x86_64 or AMD64 processor architecture. 

- Each of your Edge hosts must have at least 2 CPUs (4 CPUs recommended), 8 GB of RAM, and your cluster needs at least 160 GB of persistent storage.

- An Edge cluster profile. For information about how to create a cluster profile for Edge, refer to [Model Edge Cluster Profile](../site-deployment/model-profile.md).

## Enable Local Harbor Registry

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Select the profile you plan to use for deployment and create a new version of the profile.

4. If the profile does not already have a storage layer, click **Add New Pack** to add a storage pack. You can choose any storage pack for your storage layer. 

5. Click **Add New Pack** and search for the **Harbor Edge Native Config** pack. Add the pack to your cluster profile. To learn about the pack and its parameters, refer to [Harbor Edge Native Config pack documentation](../../../integrations/harbor-edge.md).

6. Click **Save Changes**.

7. Deploy a new Edge cluster with your updated profile. Or if you have an active cluster, update the cluster to use the new version of the cluster profile. The initial download of the images still requires a connection to the external network, but subsequent images pulls will be from the local harbor registry. 

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**. 

3. Select the cluster that's configured with a local Harbor registry.

4. Add a new Edge host to the cluster. For more information about adding Edge hosts, refer to [Add an Edge Host to a Host Cluster](../site-deployment/site-installation/cluster-deployment.md#add-an-edge-host-to-a-host-cluster). 

5. Navigate to the **Events** tab, and search for the logs for image pulls. Confirm that images are being pulling from the local Harbor registry.