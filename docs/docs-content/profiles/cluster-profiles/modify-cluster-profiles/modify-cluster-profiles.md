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

  If you want to update cluster profiles that have been used to deploy clusters, we recommend creating a *new* profile version, and then upgrade active clusters to the new version. To learn how to version profiles, review [Version a Cluster Profile](version-cluster-profile.md) guide.

  :::


In the event that more than one application in the profile needs the same pack, Palette allows you to deploy the same pack to multiple layers. Check out [Deploy Same Pack to Multiple Layers](../create-cluster-profiles/duplicate-pack-in-profile.md) for more information.

The next sections guide you in updating and versioning a profile.

## Resources

- [Update a Cluster Profile](update-cluster-profile.md)

- [Version a Cluster Profile](version-cluster-profile.md)

- [Duplicate a Pack in a Profile](../create-cluster-profiles/duplicate-pack-in-profile.md)
