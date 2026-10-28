---
sidebar_label: "Headlamp"
title: "Headlamp"
description: "How to Setup Headlamp"
hiddenFromNav: false
sidebar_position: 215
tags: ["clusters", "cluster management", "headlamp"]
---

[Headlamp](https://headlamp.dev/) is an open source, web-based interface for Kubernetes that provides a clear and
intuitive way to interact with cluster resources without relying solely on command-line tools. It allows you to explore
workloads, inspect configurations, and monitor the state of their applications through an intuitive dashboard.

## Supported Cluster Types

- Public Cloud
  - IaaS:
    - AWS
    - Azure
    - GCP
  - Managed Kubernetes:
    - AWS EKS
- Edge
- Imported clusters
- Palette Virtual Clusters, except virtual clusters that use K3s. Refer to [Virtual Clusters](#virtual-clusters).

## Access Modes

When you add the Headlamp pack to a cluster profile, use the **Access** option to select how Palette connects to
Headlamp.

| **Access Mode**       | **Description**                                                                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proxied** (default) | Palette connects to Headlamp through the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack. When you select this mode, Palette adds the Spectro Proxy pack to the cluster profile. |
| **Direct**            | Palette exposes Headlamp through a Kubernetes `LoadBalancer` service. Palette does not add Spectro Proxy.                                                                                                                  |

## Prerequisites

- An active Palette cluster.
- An OIDC (OpenID Connect) Identity Provider. For more information about using a custom OIDC, visit the page on
  [Security Assertion Markup Language (SAML) and OIDC Single Sign-On (SSO)](../../user-management/saml-sso/saml-sso.md#palette-oidc-and-pxk).

## Enablement

1.  Log in to [Palette](https://console.spectrocloud.com/).

2.  From the left main menu, select **Profiles** > **Add Cluster Profile**. Fill in a name for the profile and select
    **Add-on** for the profile **Type**. Optionally, you can provide a description and tags. Select **Next**.

3.  Select **Add New Pack**. The search field appears.

4.  Search for and select the **Headlamp** pack.

    ![Image of the pack search screen with Headlamp shown](/headlamp_select-headlamp-pack.webp)

    Leave the default configuration and select **Confirm & Create**. Select **Next** and **Finish Configuration** to
    create your add-on cluster profile.

5.  From the left main menu, select **Clusters**. Select the cluster you want to provision Headlamp on.

6.  Select the **Profile** tab and select the **+** button in the **Addon Layers** section. The list of add-on cluster
    profile versions appears.

7.  Select the add-on cluster profile you created in Step 4. Then, select **Confirm** and **Save** to apply the profile
    to your cluster. Review any cluster profile changes that may appear.

8.  Select the **Overview** tab. Palette marks the add-on layer containing Headlamp with a green circle once it
    completes the deployment process.

    ![Image of the cluster with Headlamp deployed](/headlamp_pack-deployed.webp)

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Select the cluster where you deployed the Headlamp pack.

4. Select the **Connect** button from the **Headlamp Dashboard** row.

   ![Image showing the Headlamp Connect button in the cluster overview screen](/headlamp-dashboard_connect.webp)

5. The Headlamp Dashboard is displayed.

   ![Image showing a connected k8s dashboard](/headlamp-dashboard_success.webp)

## Virtual Clusters

You can deploy Headlamp to [Palette Virtual Clusters](../palette-virtual-clusters/palette-virtual-clusters.md) that use
the Kubernetes distribution. Virtual clusters that use K3s are not supported.

Headlamp on a virtual cluster differs from Headlamp on a host cluster in the following ways:

- In **Proxied** mode, Palette deploys the Spectro Proxy pack in the `default` namespace of the virtual cluster.

- Palette uses the first OIDC identity provider that it finds, in the following order. You do not need to configure an
  identity provider in the virtual cluster or cluster group settings for Headlamp.

  1. The OIDC configuration of the virtual cluster. Refer to
     [Configure OIDC for a Virtual Cluster](../palette-virtual-clusters/configure-oidc-virtual-cluster.md).

  2. The OIDC configuration of the host cluster.

  3. Palette OIDC, if neither is configured.

### Prerequisites

- A Palette Virtual Cluster that uses the Kubernetes distribution.

- cert-manager installed in the virtual cluster. Headlamp requires cert-manager. Palette installs cert-manager in new
  virtual clusters by default. If an existing virtual cluster does not have cert-manager, add the Cert Manager pack to
  the virtual cluster through an add-on cluster profile before you deploy Headlamp. Refer to
  [Cert Manager Add-On](./cert-manager-addon.md).

- The Headlamp pack version 0.44.0.

- If Palette resolves the identity provider to **Custom**, an OIDC app in your identity provider and the OIDC values
  configured in the Kubernetes layer of the host cluster. Refer to [Configure Custom OIDC](#configure-custom-oidc).

### Configure Custom OIDC

When Palette resolves the identity provider to **Palette** or **Inherit from Tenant**, it configures the Headlamp OIDC
values for you. When it resolves to **Custom**, Palette does not configure them, and you must enter the OIDC values in
the Headlamp pack. The steps are the same for **Proxied** and **Direct** access.

1. In the OIDC app of your identity provider, add the following URL as a redirect URI. Replace `<palette-host>` with the
   hostname of your Palette instance.

   ```text
   https://<palette-host>/v1/tenantApps/spectroclusters/dashboard/idp/callback
   ```

   This URL is different from the callback URL that you use for [SSO](../../user-management/saml-sso/saml-sso.md) in
   your tenant settings.

2. When you add the Headlamp pack to your add-on cluster profile, set the following OIDC values in the pack YAML.
   Replace the placeholders with the values of your OIDC app.

   ```yaml
   charts:
     headlamp:
       config:
         oidc:
           clientID: "<oidc-client-id>"
           clientSecret: "<oidc-client-secret>"
           issuerURL: "<oidc-issuer-url>"
           scopes: "openid,profile,email"
           callbackURL: "https://<palette-host>/v1/tenantApps/spectroclusters/dashboard/idp/callback"
   ```

### Deploy Headlamp on a Virtual Cluster

1. Follow steps 1 - 4 of [Enablement](#enablement) to create an add-on cluster profile with the Headlamp pack. In the
   Headlamp pack, select the **Access** mode for the virtual cluster. If Palette resolves the identity provider to
   **Custom**, set the OIDC values from [Configure Custom OIDC](#configure-custom-oidc).

2. Create role bindings for the users who access Headlamp. The roles that you bind determine what users can view in
   Headlamp. For example, to view the entire virtual cluster, bind the `cluster-admin` role. Refer to
   [Create Role Bindings](../cluster-management/cluster-rbac.md#create-role-bindings).

3. From the left main menu, select **Clusters**. Select the **Virtual Clusters** tab, and then select your virtual
   cluster.

4. Follow steps 6 - 8 of [Enablement](#enablement) to add the Headlamp add-on cluster profile to the virtual cluster.

### Change the Headlamp Configuration

Some configuration changes take effect only after you reattach Headlamp or restart the Headlamp deployment. To reattach
Headlamp, remove the Headlamp add-on cluster profile from the virtual cluster, and then add it back. Wait a few minutes
for Headlamp to redeploy before you select **Connect**.

| **Change**                                                                           | **Action**                                                                   |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| You change the OIDC identity provider of the host cluster.                           | Reattach Headlamp.                                                           |
| You change the **Access** mode.                                                      | Reattach Headlamp to recreate the Headlamp service and the **Connect** link. |
| You change the OIDC values in the Headlamp pack, such as the callback URL or secret. | Restart the Headlamp deployment, or reattach Headlamp.                       |

### Validate the Virtual Cluster Deployment

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**. Select the **Virtual Clusters** tab, and then select your virtual
   cluster.

3. Select **Connect** in the **Headlamp Dashboard** row. The Headlamp dashboard opens.
