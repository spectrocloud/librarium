---
sidebar_label: "Annoucements"
title: "Annoucements"
description: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["breaking-changes", "deprecations"]
---

This page lists the upcoming breaking changes, deprecations, and removals in Palette and Palette VerteX. You can also
find previously implemented changes in the [Implemented Changes](#implemented-changes) section.

<!-- vale off -->

## Upcoming Breaking Changes

<!-- vale on -->

| Change                                                                                                                                                                                                                                                                                                                                                                             | Target Date    | Published Date   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------- |
| The _Beehive_ [cluster group](../clusters/cluster-groups/cluster-groups.md) is no longer available starting with this release. If you need to deploy virtual cluster, create a cluster group in your tenant or project. You can learn more about creating a new cluster group in the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide. | November, 2024 | October 13, 2024 |

<!-- vale off -->

## Upcoming Deprecations and Removals

<!-- vale on -->

| Change                                                                                                                                                                                                                       | Target Date   | Published Date    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------- |
| The Terraform resource, `spectrocloud_cluster_import` is deprecated. To import a cluster deployed outside of the context of Palette, refer to the [Import a Cluster](../clusters/imported-clusters/cluster-import.md) guide. | January, 2025 | November 15, 2024 |

## Implemented Changes

| Change                                                                                                                                                                                                                                                                                                                                                                                                      |     | Release | Date         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------- | ------------ |
| In this release, Palette aligns Google Cloud Platform GKE behavior with Azure AKS and AWS EKS and removes the ability to specify a patch version when creating a cluster profile for AKS, EKS, and GKE. Only the major and minor versions are available for selection. The underlying cloud provider will automatically select the latest patch version available for the selected major and minor version. |     | 4.4.6   | Jun 15, 2024 |
