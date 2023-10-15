---
sidebar_label: "App Profiles"
title: "App Profiles"
description: "Use app profiles to ensure consistency across your Palette Virtual Clusters."
hide_table_of_contents: false
tags: ["profiles", "app profiles"]
---


App profiles are templates you create with preconfigured services that are required for Palette [Virtual Cluster](../../devx/palette-virtual-clusters/palette-virtual-clusters.md) deployment. App profiles provide a way to drive consistency across virtual clusters deployed in the Palette Dev Engine (PDE) environment. For more information about PDE, check out the [Palette Dev Engine](../../devx/devx.md) documentation.

You create app profiles to meet specific types of workloads on your virtual clusters. You can use containers, Helm charts, custom manifest, and out-of-the-box services such as databases, message queue systems, and object storage. Check out the Palette Dev Engine [Services](../../devx/services/services.md) documentation to learn more about the available services. 

You can also review all the Palette Dev Engine services that offer an out-of-the-box experience by reviewing the [Service Listings](../../devx/services/service-listings/service-listings.mdx).

:::caution

When adding a manifest-type layer to an app profile, make sure to specify a namespace. Otherwise the manifest deployment will get deployed to the `Default` namespace.

```yaml
namespace: yourNameHere
```
:::

<!-- You create app profiles using services that are required for Palette [Virtual Clusters](../../devx/palette-virtual-clusters/palette-virtual-clusters.md) deployed in Palette Dev Engine (PDE) in *App Mode*. Use app profiles to ensure consistency across virtual clusters. For more information about PDE, check out the [Palette Dev Engine](../../devx/devx.md) reference.  -->

<!-- App profile layers can be services, Helm Charts, or custom manifests. Palette provides several out-of-the-box services. Check out the Palette Dev Engine [Services](../../devx/services/services.md) documentation to learn more about available services.  -->

## Resources

- [Create App Profiles](../app-profiles/create-app-profiles/create-app-profiles.md)

- [Update an App Profile](../app-profiles/modify-app-profiles/update-app-profile.md)

- [Clone an App Profile](../app-profiles/clone-app-profile.md)

- [Version an App Profile](../app-profiles/modify-app-profiles/version-app-profile.md)

- [Delete an App Profile](../app-profiles/delete-app-profile.md)

- [Service Listing](../../devx/services/service-listings/service-listings.mdx)

- [Palette Dev Engine](../../devx/devx.md)

