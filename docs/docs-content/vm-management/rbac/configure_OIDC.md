---
sidebar_label: "Configure OIDC"
title: "Configure OIDC"
description: "Learn how to configure OIDC so Palette displays the Virtual Machine Dashboard."
icon: " "
hide_table_of_contents: false
sidebar_position: 15
tags: ["vmo", "oidc"]
---

Palette displays the Virtual Machine dashboard based on the OpenID Connect (OIDC) Identity Provider (IdP) option
selected in the Kubernetes layer of the infrastructure profile.

## Prerequisites

- A configured infrastructure cluster profile. For more information, review
  [Create a Cluster Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

- A configured VMO add-on cluster profile. Refer to [Create the VMO Profile](../create-vmo-profile.md) for guidance.

## Enable OIDC

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Profiles**.

3. Select your infrastructure cluster profile. Palette displays the profile details and its profile stack.

4. Select the Kubernetes layer in the profile stack, and choose an **OIDC Identity Provider** option. Refer to
   [Configure OIDC Identify Provider](../../integrations/kubernetes.md#configure-oidc-identity-provider) to learn more
   about OIDC options.

   - Selecting **None** or **Palette** will display the Virtual Machine dashboard in a tab.

     :::warning

     We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons
     that rely on OIDC.

     :::

   - Selecting **Inherit from Tenant** or **Custom** will display a link to the dashboard on the cluster overview page.

5. If you selected **Custom** as the OIDC IdP, follow the steps in <VersionedLink
     text="Configure Custom OIDC"
     url="/integrations/packs/?pack=kubernetes#configure-custom-oidc"
   /> to set up the OIDC IdP for your cluster.

6. Once you have made the necessary changes, click **Confirm Updates** and **Save Changes** to conclude the update.

7. Deploy a cluster using the updated infrastructure profile. Refer to the
   [Deploy a Cluster](../../tutorials/cluster-deployment/public-cloud/deploy-k8s-cluster.md) tutorial for instructions
   on how to deploy a cluster.

8. Once the cluster is listed as **Healthy**, attach the VMO add-on profile to your cluster. Refer to the
   [Attach an Add-on Profile](../../clusters/imported-clusters/attach-add-on-profile.md) guide for instructions.

The following steps apply exclusively to clusters configured with **Custom** third-party OIDC IdPs.

9. After the VMO profile deployment is completed, right-click the **Connect** button next to **Virtual Machine
   Dashboard** and copy the link. Save this link for later use.

10. Next, log in to the IdP console that is associated with the OIDC configuration used in your cluster.

11. Locate the OIDC application that was used in step **5** of this guide and enable the **Refresh Token** setting. For
    example, if you are using [Okta](https://www.okta.com) as the IdP, refer to the
    [Refresh access tokens and rotate refresh tokens](https://developer.okta.com/docs/guides/refresh-tokens/main/) guide
    for further instructions.

12. Update the **Sign-in redirect URIs** field in your IdP. Add the VMO link copied in step **9**, appending
    `/auth/callback` to its end. For example, if the link is
    `https://spectrocloud.com/v1/tenantApps/123456789101112131415162NWY2OGQ=`, update it to
    `https://spectrocloud.com/v1/tenantApps/123456789101112131415162NWY2OGQ=/auth/callback`. This is the URI to which
    the IdP will redirect users after successful authentication.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Clusters** and select your cluster.

3. Based on your OIDC IdP settings, the **Virtual Machines** tab may display on the **Cluster Overview** page.
   Alternatively, the **Connect** button may display next to **Virtual Machines Dashboard**.

4. If you used a **Custom** OIDC IdP, click the **Connect** button next to **Virtual Machines Dashboard** to verify that
   the dashboard loads properly after authentication.
