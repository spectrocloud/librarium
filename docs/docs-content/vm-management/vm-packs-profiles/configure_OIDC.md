---
sidebar_label: "Configure OIDC"
title: "Configure OIDC"
description: "Learn how to configure OIDC so Palette displays the Virtual Machine Dashboard."
icon: " "
hide_table_of_contents: false
sidebar_position: 15
tags: ["vmo", "oidc"]
---




Palette displays the Virtual Machine dashboard based on the OpenID Connect (OIDC) Identity Provider option that you select in the Kubernetes layer of the infrastructure profile.


## Prerequisites

- A configured infrastructure profile. For more information, review [Create a Cluster Profile](../../cluster-profiles/task-define-profile.md).


## Enable OIDC

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Select the cluster profile to update. Palette displays profile details and the profile stack.

4. Select the Kubernetes layer in the profile stack, and choose an OIDC Identity Provider option. Refer to [Configure OIDC Identify Provider](../../integrations/kubernetes.md#configure-oidc-identity-provider) to learn more about OIDC options.

  Selecting **None** or **Palette** will display the Virtual Machine dashboard in a tab.

  Selecting **Inherit from Tenant** or **Custom** will display a link to the dashboard on the cluster overview page.

  :::caution

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that rely on OIDC.

  :::

5. Click **Confirm Updates**. 

6. Save your changes.


## Validate

1. From the left **Main Menu** click **Profiles**.

2. Select the cluster profile you updated. Palette displays profile details and the profile stack.

3. Select the Kubernetes layer. Palette displays the OIDC Identity Provider you selected - either **None**, **Palette**, **Inherit from Tenant**, or **Custom**.


## Next Steps

You are now ready to create the VMO profile. Refer to [Create the VMO Profile](../vm-packs-profiles/create-vmo-profile.md) for guidance.


