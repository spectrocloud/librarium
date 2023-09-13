---
sidebar_label: "Configure OIDC"
title: "Configure OIDC"
description: "Learn how to configure OIDC so Palette displays the Spectro VM Dashboard."
icon: " "
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "oidc"]
---


Palette displays the VM dashboard based on OpenID Connect (OIDC) Identity Provider options you enable in the Kubernetes layer of the cluster profile you will use for your Virtual Machine Orchestrator (VMO) cluster.


## Prerequisites

- A configured cluster profile. For more information, review [Create a Cluster Profile](/cluster-profiles/task-define-profile).


## Configure OIDC Options

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Select the cluster profile to update. Palette displays profile details and the profile stack.

4. Select the Kubernetes layer in the profile stack, and choose **None** or **Palette** as the OIDC Identity Provider.

5. Click **Confirm Updates**. 

6. Save your changes.


## Validate

1. From the left **Main Menu** click **Profiles**.

2. Select the cluster profile you updated. Palette displays profile details and the profile stack.

3. Select the Kubernetes layer. Palette displays the OIDC Identity Provider you selected - either **None** or **Palette**.


## Next Steps

Now you are ready to create the VMO profile. Refer to [Create the VMO Profile](/vm-management/vm-packs-profiles/create-vmo-profile) for guidance.


