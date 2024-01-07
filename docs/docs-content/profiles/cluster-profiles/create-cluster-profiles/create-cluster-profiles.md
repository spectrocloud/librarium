---
sidebar_label: "Create Cluster Profiles"
title: "Create Cluster Profiles"
description: "Review types of cluster profiles you can create in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles"]
---


Create cluster profiles by configuring layers that contain configuration information. You can create as many profiles as needed for your workload cluster deployments, and you can create multiple versions of a cluster profile using the same profile name but with a different pack configuration. For guidance on creating profile versions, review [Version a Cluster Profile](../modify-cluster-profiles/version-cluster-profile.md).


## Cluster Profile Scope

Cluster profiles can apply to a [tenant](../../../glossary-all.md#tenant) or a project. The scope you are in when you create the profile determines the profile's scope. A profile created in tenant scope applies to the tenant. A profile created in project scope applies to the project. 

## Cluster Profile Types

Palette provides three types of cluster profiles: 

- *Infrastructure* - Contains the Operating System (OS), Kubernetes, Network, and Storage.

- *Add-on* - Choose from various applications such as service mesh, monitoring, and more.

- *Full* - contains both infrastructure and add-on layers.


For a detailed description of each profile type and the layers they contain, review [Cluster Profiles](../cluster-profiles.md). 

The next sections provide guidance in creating each type of profile.


## Resources

- [Create an Infrastructure Profile](create-infrastructure-profile.md)

- [Create an Add-on Profile](../create-cluster-profiles/create-addon-profile/create-addon-profile.md)

- [Create a Full Profile](create-full-profile.md)

- [Duplicate a Pack in a Profile](duplicate-pack-in-profile.md)