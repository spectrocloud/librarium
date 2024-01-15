---
sidebar_label: "System Profiles"
title: "Understanding System Profiles"
description: "Understanding the System Profiles Concept and how they make Palette powerful"
hide_table_of_contents: false
sidebar_position: 50
sidebar_custom_props:
  icon: "bundles"
tags: ["system-profiles", "profiles"]
---

System profiles provide a way to bootstrap an edge appliance with an initial set of virtual and containerized applications. Similar to [cluster profiles](/cluster-profiles), system profiles are templates created using one or more layers that are based on packs or helm charts.

System profiles modeled on Palette UI should be downloaded and provided input to the edge system. Upon bootstrap, when the edge appliance registers back with the SaaS console, it links to the system profile. Any subsequent changes made to the profile after registration are propagated down to the edge appliance.
<br />

## Create a System Profile

Here are the steps to create a system profile:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Go to **Profiles**, open the **System Profile** tab, and click **Add System Profiles**.

3. Provide profile information such as system profile name, description (optional), and tags (optional) system profile.

4. Add one or more layers using one of the following methods:

- **Add New Pack** - Add a Palette Pack from a pack registry or a [Helm Chart](registries-and-packs/helm-charts.md) from a chart registry. The public Spectro Cloud Pack registry and a few popular helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.
- **Add Manifest** - Layers can be constructed using raw manifests to provide Kubernetes resources unavailable via Palette or Charts. In addition, pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack.

5. Click the `Confirm and Create` button to save the configuration.

6. Click the `Next` button to review the information and `Finish` to create and save the system profile.
   <br />

**Note:** Palette enables the [Export](cluster-profiles/cluster-profile-import-export.md#export-cluster-profile) and [Import](cluster-profiles/cluster-profile-import-export.md#import-cluster-profile) of System profiles across multiple environments, projects and tenants.

## Download System Profile

1. Login to Palette management console.

2. Go to ‘Profiles’ and open the ‘System Profile’.

3. Open an existing system profile.

4. Click the `Download System Profile` button at the bottom of the panel to download the profile definition as an archive (with extension `tgz`).
   <br />

## Sample Snapshots

### System Profile dashboard

![system-profile-1.png](/system-profile-1.png)

### Add a new pack while creating the system profile

![system-profile-2.png](/system-profile-2.png)

### Add a new manifest while creating the system profile

![system-profile-3.png](/system-profile-3.png)

### Download system profile

![system-profile-4.png](/system-profile-4.png)
