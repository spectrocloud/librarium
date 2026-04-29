---
sidebar_label: "Headlamp"
title: "Headlamp"
description: "How to Setup Headlamp"
hiddenFromNav: false
sidebar_position: 215
tags: ["clusters", "cluster management", "headlamp"]
---

:::preview

:::

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

## Prerequisites

- An active Palette cluster.
- An OIDC Identity Provider. For more information about using a custom OIDC, visit the page on
  [SAML and OIDC SSO](../../user-management/saml-sso/saml-sso.md#palette-oidc-and-pxk).

<!-- prettier-ignore-start -->

:::warning

Due to an [active known issue](../../release-notes/known-issues.md#active-known-issues), Headlamp currently supports only the **Palette** OIDC Identity Provider option configured in the <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> pack of your cluster profile.

:::

<!-- prettier-ignore-end -->

## Enablement

1.  Log in to [Palette](https://console.spectrocloud.com/).

2.  From the left main menu, select **Profiles** > **Add Cluster Profile**. Fill in a name for the profile and select
    **Add-on** for the profile type. Optionally, you can provide a description and tags. Select **Next**.

3.  Select **Add New Pack**. The search field appears.

4.  Search for and select the **Headlamp** pack. Leave the default configuration and select **Confirm & Create**. Select
    **Next** and **Finish Configuration** to create your add-on cluster profile.

    ![Image of the pack search screen with Headlamp shown](/headlamp_select-headlamp-pack.webp)

5.  From the left main menu, select **Clusters**. Select the cluster you want to provision Headlamp on.

6.  Select the **Profile** tab and select the **+** icon in the **ADDON LAYERS** section. The list of add-on cluster
    profile versions appears.

7.  Select the add-on cluster profile you created in **Step 4**. Then, select **Confirm** and **Save** to apply the
    profile to your cluster. Review any cluster profile changes that may appear.

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
