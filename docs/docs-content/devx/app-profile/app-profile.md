---
sidebar_label: "App Profiles"
title: "App Profiles"
description: "Learn how to create and manage App Profiles in Palette Dev Engine."
hide_table_of_contents: false
tags: ["devx", "app mode", "pde"]
---

App Profiles are templates created with pre-configured services required for Palette Virtual Cluster deployment. App Profiles provide a way to drive consistency across virtual clusters. 

You create App Profiles to meet specific types of workloads on your Palette [virtual clusters](../palette-virtual-clusters/palette-virtual-clusters.md). You can use containers, Helm Charts, custom manifest, containers, and other out-of-the-box services such as databases, message queue systems, and object storage. Check out the Palette Dev Engine [Services](services/services.md) documentation to learn more about the available services.  

You can also review all the Palette Dev Engine services that offer an out-of-the-box experience by reviewing the [Service Listings](../app-profile/services/services.md).


:::caution

When adding a manifest-type layer to an App profile, make sure to specify a namespace. Otherwise the manifest deployment will get deployed to the `Default` namespace.

```yaml
namespace: yourNameHere
```
:::

<br />

## Get Started

Get started today by learning how to create your [App Profile](create-app-profile.md).

## Resources
- [Create an App Profile](create-app-profile.md)
- [Container Deployment](container-deployment.md)
- [App Profile Macros](app-profile-macros.md)
- [App Profile Cloning](app-profile-cloning.md)
- [App Profile Versioning](versioning-app-profile.md)

