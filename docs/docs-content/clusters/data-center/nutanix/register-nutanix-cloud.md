---
sidebar_label: "Register Nutanix Cloud"
title: "Register Nutanix Cloud"
description: "Learn how to register a Nutanix cloud in Palette."
hide_table_of_contents: false
tags: ["data center", "nutanix"]
---


A System Administrator registers the Nutanix cloud in Palette by invoking system-level APIs. These APIs provide specific cloud information, the cloud logo, and the key-value pairs required to add the cloud to Palette. They also enable uploading the YAML templates used to create the cluster, control plane, and worker nodes. This section provides instructions on how to use the APIs to register a Nutanix cloud to Palette.


## Prerequisites

- A Nutanix Prism Central account.

- A Palette account with system-level access.

- A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide.


## Register the Cloud

Use the following steps to register a Nutanix cloud.

1. Visit [Palette APIs](https://docs.spectrocloud.com/api/category/palette-api-v1). 

2. 

Access the [Nutanix Cluster API infrastructure provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) page on GitHub
