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

<ReleaseNotesVersions />

## October 12, 2024 - Release 4.5.0 - 4.5.X

### Security Notices

### Palette Enterprise

#### Breaking Changes

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we are adding a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. If you have network restrictions in place, ensure that the new registry is allowed. The new
  registry is available for use starting with this release. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/install-palette.md#proxy-requirements) for a complete list
  of domains that must be allowed.

#### Features

#### Improvements

#### Bug Fixes

#### Deprecations and Removals

- The [cluster group](../clusters/cluster-groups/cluster-groups.md), Beehive, will be sunset November 9, 2024. If you
  are using Palette SaaS and have virtual clusters in the Beehive cluster group, migrate the workload to new virtual
  clusters hosted in a self-managed cluster group before November 9, 2024. You can learn more about creating a new
  cluster group in the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide.

#### Known Issues

### Edge

#### Features

#### Improvements

### Palette Dev Engine (PDE)

#### Known Issues

### Virtual Machine Orchestrator (VMO)

#### Improvements

### Automation

### Docs and Education

### Packs

#### Pack Notes

#### Kubernetes

#### CNI

#### CSI

#### Add-on Packs

#### FIPS Packs

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
