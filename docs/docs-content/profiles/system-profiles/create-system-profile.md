---
sidebar_label: "System Profiles"
title: "System Profiles"
description: "Learn how to create a system profile."
hide_table_of_contents: false
sidebar_position: 5
tags: ["profiles", "system profiles"]
---




1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, click on **Profiles** and open the **System Profile** tab

3. Click on the **Add System Profiles** button.

3. Provide profile information such as system profile name, description (optional), and tags (optional) system profile.


4. Add one or more layers using one of the following methods:

  * **Add New Pack** - Add a Palette Pack from a pack registry or a [Helm Chart](/registries-and-packs/helm-charts/) from a chart registry. The public Spectro Cloud Pack registry and a few popular helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.
  * **Add Manifest** - Layers can be constructed using raw manifests to provide Kubernetes resources unavailable via Palette or Charts. In addition, pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack.


5. Click the `Confirm and Create` button to save the configuration.


6. Click the `Next` button to review the information and `Finish` to create and save the system profile.
<br />

**Note:** Palette enables the [Export](/cluster-profiles/cluster-profile-import-export#exportclusterprofile) and [Import](/cluster-profiles/cluster-profile-import-export#importclusterprofile) of System profiles across multiple environments, projects and tenants.

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