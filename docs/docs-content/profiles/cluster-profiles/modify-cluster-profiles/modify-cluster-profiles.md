---
sidebar_label: "Modify Cluster Profiles"
title: "Modify Cluster Profiles"
description: "Review ways you can modify cluster profiles in Palette."
hide_table_of_contents: false
sidebar_position: 5
tags: ["profiles", "cluster profiles"]
---

You can modify cluster profiles by updating the following:

- Profile name, version, description, and tags.

- Profile layers or pack versions.

  :::warning

  If you want to update cluster profiles that have been used to deploy clusters, we recommend creating a _new_ profile
  version, and then upgrade active clusters to the new version. To learn how to version profiles, review
  [Version a Cluster Profile](version-cluster-profile.md) guide.

  :::

In the event that more than one application in the profile needs the same pack, Palette allows you to deploy the same
pack to multiple layers. Check out
[Deploy Same Pack to Multiple Layers](../create-cluster-profiles/duplicate-pack-in-profile.md) for more information.

## Notifications

Palette will automatically display the **Update** button when a new version of a pack is available. For example, if you
have the Container Network Interface (CNI) Calico pack version 3.28.0 in your profile, and a new version 3.28.2 is
available, Palette will display the **Update** button when viewing the cluster profile's details page. If you click the
**Update** button, Palette will display the new versions available for each pack in the profile. You can then choose to
update the pack to the new version.

![A view of the cluster profile update widget displaying a new version of Calico is available.](/profiles_cluster-profiles_modify-cluster-profiles_new-version-notifcation.webp)

If the changes can be applied without any issues, then Palette will display the **Apply Changes** button. Otherwise, you
will see the **Review changes in Editor** button, which allows you to review the changes before applying them.

![A view of the cluster profile update widget displaying a new packs versions but changes that require the user's input.](/profiles_cluster-profiles_modify-cluster-profiles_new-version-notifcation-changes-required.webp)

The next sections guide you in updating and versioning a profile.

## Resources

- [Update a Cluster Profile](update-cluster-profile.md)

- [Version a Cluster Profile](version-cluster-profile.md)

- [Duplicate a Pack in a Profile](../create-cluster-profiles/duplicate-pack-in-profile.md)
