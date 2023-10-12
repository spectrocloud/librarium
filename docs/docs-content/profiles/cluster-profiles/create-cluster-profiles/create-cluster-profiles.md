---
sidebar_label: "Create Cluster Profiles"
title: "Create Cluster Profiles"
description: "Review types of cluster profiles you can create in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles"]
---


Create cluster profiles by configuring layers that contain configuration information. You can create as many profiles as needed for your workload cluster deployments, and you can create multiple versions of a cluster profile using the same profile name but with a different pack configuration. For guidance on creating profile versions, review [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md).

Palette provides three types of cluster profiles, which are described in detail in [Cluster Profiles](../cluster-profiles.md): 

- *Infrastructure* - Operating System (OS), Kubernetes, Network, and Storage.

- *Add-on* - service mesh, monitoring, and more.

- *Full* - contains both Infrastructure and Add-on layers.

The next sections guide you in creating each type of profile.


## Resources

- [Create an Infrastructure Profile](create-infrastructure-profile.md)

- [Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [Create a Full Profile](create-full-profile.md)

- [Add a Pack Multiple Times in a Profile](add-pack-multiple-times-in-profile.md)