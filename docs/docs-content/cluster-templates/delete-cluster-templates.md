---
sidebar_label: "Delete Cluster Templates"
title: "Delete Cluster Templates"
description: "Learn how to delete a cluster template."
hide_table_of_contents: false
sidebar_position: 30
tags: ["cluster templates"]
---

:::preview

:::

To delete a cluster template that is attached to a cluster, you must first delete the cluster and then delete the
template previously attached to the cluster. You cannot delete a cluster template that is linked to a cluster.

Since cluster templates reference existing cluster profiles and template policies rather than embed them, when you
delete a cluster template, the associated profiles and policies are _not_ deleted, allowing you to reuse the profiles
and policies in other clusters.

## Prerequisites

- The **ClusterTemplate** [feature flag](../enterprise-version/system-management/feature-flags.md) enabled.

- The `clusterTemplate.delete` permission to delete cluster templates. Refer to our
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#project) guide for more
  information.

- An existing [cluster template](cluster-templates.md) that is not attached to a cluster.

## Delete Cluster Templates

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  From the left main menu, select **Cluster Configurations**.

3.  Select the **Templates** tab.

4.  Locate and select the template you want to delete. You can delete templates only if the **In Use Templates** value
    is **Not Used**.

5.  In the top-right, select the **Settings** drop-down menu, and choose **Delete**.

6.  **Confirm** the deletion of your cluster template. The template is removed from the **Templates** tab.
