---
sidebar_label: "Migrate from Harbor Edge-Native Config Pack"
title: "Migrate from Harbor Edge-Native Config Pack"
description:
  "This page teaches you how to migrate from the Harbor Edge-Native Config Pack to the Registry Connect pack. "
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

Disconnected Edge clusters are required to use a in-cluster primary registry to store images needed for cluster
deployment. Previously, this was implemented using the **Harbor Edge-Native Config** pack, which installs the Harbor
registry as well as handles image pull redirects.

The **Harbor Edge-Native Config** has been deprecated and will no longer be supported in a future release. If you want
to keep your cluster's registry infrastructure up-to-date, you need migrate off of the legacy pack and use the new
**Registry Connect** pack to implement the Harbor registry. This allows you to keep using the Harbor registry as the
primary registry and keep it up-to-date with the latest upstream updates.

## Limitations

- When you migrate off of the **Harbor Edge-Native Config** pack, you cannot change the Harbor registry into another
  registry. You must select the Harbor registry to use as the primary registry for your cluster.

## Prerequisite

- An existing Edge cluster with the **Harbor Edge-Native Config** pack.

## Migrate from Harbor Edge-Native Config Pack to Registry Connect

1. Log in to [Palette](https:/console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles**.

3. Select the profile you use to deploy your cluster.

4. Remove the **Harbor Edge-Native Config** pack from the profile.

5. Click **Add New Pack** and select the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack.

6. In the **values.yaml**, update `charts.harbor.harborAdminPassword` to the same password as your existing Harbor
   registry. Click **Confirm & Create**.

7. Click **Add New Pack** and select the

   <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> pack and select the
   **Harbor Internal Registry** preset.

8. Click **Confirm & Create**.

9. Save a new version of your cluster profile.

10. Update your cluster to use the new profile. Refer to
    [Update a Cluster](../../../cluster-management/cluster-updates.md) for updating connected clusters and
    [Update Local Cluster](../../local-ui/cluster-management/update-cluster.md) for updating disconnected clusters.

## Validate

1. Access the registry from your browser at `https://NODE_IP:30003`. Replace `NODE_IP` with any IP address in your
   cluster.

2. Use the username `admin` and the password you configured to log in to Harbor.

3. Confirm that all cluster images are present in the Harbor registry.
