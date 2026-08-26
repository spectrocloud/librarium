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

:::info

This page covers the OIDC IdP selection at the Kubernetes layer. To configure a third-party IdP directly on the Virtual
Machine Orchestrator pack instead of using Palette-managed OIDC, refer to
[Configure External OIDC](../vmo-pack/configure-external-oidc.md).

:::

## Prerequisites

- A configured infrastructure cluster profile. For more information, review
  [Create a Cluster Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

- A configured VMO add-on cluster profile. Refer to [Create the VMO Profile](../vmo-pack/create-vmo-profile.md) for
  guidance.

## Enable OIDC

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Profiles**.

3. Select your infrastructure cluster profile. Palette displays the profile details and its profile stack.

<!-- prettier-ignore-start -->

4. Select the Kubernetes layer in the profile stack, and choose an **OIDC Identity Provider** option. Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional guidance for more information.

<!-- prettier-ignore-end -->

- Selecting **None** or **Palette** will display the Virtual Machine dashboard in a tab.

  :::warning

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that
  rely on OIDC.

  :::

- Selecting **Inherit from Tenant** or **Custom** will display a link to the dashboard on the cluster overview page.

5. If you selected **Custom** as the OIDC IdP, follow the steps in <VersionedLink
     text="Configure Custom OIDC"
     url="/integrations/packs/?pack=kubernetes#configure-custom-oidc"
   /> to set up the OIDC IdP for your cluster.

6. Once you have made the necessary changes, click **Confirm Updates** and **Save Changes** to conclude the update.

7. Deploy a cluster using the updated infrastructure profile. Refer to the [Getting Started](/getting-started/)
   tutorials for instructions on how to deploy a cluster.

8. Once the cluster is listed as **Healthy**, attach the VMO add-on profile to your cluster. Refer to the
   [Attach an Add-on Profile](../../clusters/imported-clusters/attach-add-on-profile.md) guide for instructions.

9. After the VMO profile deployment is completed, locate the OIDC callback URL for the cluster.

   The callback URL follows the form `<baseUrl>/auth/callback`, where `<baseUrl>` depends on how OIDC is configured for
   your cluster:

   - **OIDC for VMO (direct)**: The VMO pack consumes the IdP directly through the External OIDC preset. The callback
     URL is the `oidc.callbackUrl` value in the deployed pack. Refer to
     [Configure External OIDC](../vmo-pack/configure-external-oidc.md) for guidance.

   - **OIDC for VMO through Palette (proxied)**: Palette proxies the OIDC flow. `<baseUrl>` is the tenant apps proxy URL
     that appears in the browser address bar when you open the Virtual Machine dashboard, such as
     `https://console.spectrocloud.com/v1/tenantApps/<base64-tenant-id>`.

   Save this URL for the sign-in redirect step.

10. Log in to the IdP console that is associated with the OIDC configuration used in your cluster.

11. Locate the OIDC application that was used in step 5 and enable the **Refresh Token** setting. For example, if you
    are using [Okta](https://www.okta.com) as the IdP, refer to the
    [Refresh access tokens and rotate refresh tokens](https://developer.okta.com/docs/guides/refresh-tokens/main/) guide
    for further instructions.

12. Update the **Sign-in redirect URIs** field in your IdP. Add the callback URL from step 9. For example,
    `https://console.spectrocloud.com/v1/tenantApps/123456789101112131415162NWY2OGQ=/auth/callback`. This is the URI to
    which the IdP redirects users after successful authentication.

## Configure Custom OIDC for VM Migration Assistant

The VM Migration Assistant service console supports authentication with **Custom** third-party OIDC Identity Providers
(IdPs), such as Okta or Azure Active Directory, in addition to Palette OIDC. If you configured **Custom** OIDC at the
Kubernetes layer of your VMO cluster and enabled OIDC on the Migration Assistant service console, follow the steps in
this section to authorize sign-ins through your third-party IdP.

### Prerequisites for VM Migration Assistant OIDC

- A VMO cluster with **Custom** OIDC configured at the Kubernetes layer. Refer to [Enable OIDC](#enable-oidc) for
  guidance.

- A deployed VM Migration Assistant add-on profile that sets `vm-migration-assistant-ui.console.deployment.env.userAuth`
  to `oidc`. Refer to
  [Create a VM Migration Assistant Profile](../vm-migration-assistant/create-vm-migration-assistant-profile.md) for
  guidance.

- Access to the third-party IdP console associated with the OIDC configuration in your cluster's Kubernetes layer.

### Configure the IdP Redirect URI and Refresh Token

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters** and select your VMO cluster.

3. On the **Overview** tab, locate the **vm-migration** entry in the **Services** list, and copy the VM Migration
   Assistant service console URL.

4. Log in to the third-party IdP console associated with the OIDC configuration used in your cluster.

5. Locate the OIDC application used by the cluster.

6. Enable the **Refresh Token** setting. For example, if you use [Okta](https://www.okta.com), refer to the
   [Refresh access tokens and rotate refresh tokens](https://developer.okta.com/docs/guides/refresh-tokens/main/) guide.

7. Update the **Sign-in redirect URIs** field. Append `/auth/callback` to the service console URL copied in step 3, and
   add the resulting URL. For example, if the service console URL is `https://vm-migration.mycompany.dev`, add
   `https://vm-migration.mycompany.dev/auth/callback`. This is the URI to which the IdP redirects users after successful
   authentication.

8. Save the IdP application configuration.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, click **Clusters** and select your cluster.

3. Based on your OIDC IdP settings, the **Virtual Machines** tab may display on the **Cluster Overview** page.
   Alternatively, the **Connect** button may display next to **Virtual Machines Dashboard**.

4. If you used a **Custom** OIDC IdP, click the **Connect** button next to **Virtual Machines Dashboard** to verify that
   the dashboard loads properly after authentication.
