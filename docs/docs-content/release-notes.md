---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Spectro Cloud release notes for Palette and its sub-components."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "audits"
tags: ["release-notes"]
---

## March 16, 2024 - Release 4.3.0

### Palette

#### Features

- Cluster Profile variables, a new feature that allows you to define variables in a cluster profile. This feature is in
  Tech Preview and is available only for Edge clusters. Profile variables allow you to define variable types, apply
  validation, and more. Refer to the Cluster Profile Variables documentation to learn more about profile variables.

#### Improvements

- Nutanix cluster deployments now display YAML variables and exposes them as input fields on the User Interface (UI)
  during the cluster deployment process. Previously, the UI did not display the YAML variables for Nutanix clusters and
  users had to manually update the machine template YAML. Check out the
  [Create and Manage Nutanix Cluster](./clusters/data-center/nutanix/create-manage-nutanix-cluster.md) guide for more
  details.

#### Known Issues

- Conducting cluster node scaling operations on a cluster undergoing a backup can lead to issues and potential
  unresponsiveness. To avoid this, ensure that no backup operations are in progress before scaling nodes or performing
  other cluster operations that change the cluster state.

### Edge

#### Breaking Changes

#### Features

#### Improvements

#### Known Issues

### Palette Dev Engine (PDE)

#### Improvements

### Virtual Machine Orchestrator (VMO)

#### Features

### VerteX

#### Features

#### Improvements

### Terraform

#### Features

- Version 0.18.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

-

### Packs

#### Kubernetes

#### CNI

#### CSI

#### Add-on Packs

#### FIPS Packs

#### Pack Notes

#### Deprecations and Removals

- Check out the [Deprecated Packs](integrations/deprecated-packs.md) page for a list of deprecated packs.
