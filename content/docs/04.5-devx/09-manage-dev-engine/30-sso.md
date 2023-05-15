---
title: "Manage Single Sign-On (SSO)"
metaTitle: "Manage Single Sign-On (SSO)"
metaDescription: "Learn how to configure SSO for Palette Dev Engine."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette supports the ability to use Single Sign-On (SSO) and third-party Social Sign-In Providers such as Google and GitHub. You can choose to enable or disable this feature. Use the following steps to either enable or disable the feature. 

# Enable SSO

To enable SSO with third-party Social Sign-In Providers use the following steps.

<br />


<InfoBox>

To learn more about the Sign-In Flow, refer to the [User Authentication](/user-management/user-authentication#signinflow) documentation.

</InfoBox>


## Prerequisites

* Palette Tenant Administrator access.


## Enable SSO

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant Admin.


2. Navigate to the left **Main Menu**, select **Tenant Settings**, and select **SSO** from the left Settings **Main Menu**.


3. Next, click the **Auth Providers** tab and toggle the **Enable Provider Login** button.


  ![The Auth providers tenant settings page with an arrow toward the toggle button.](/devx_manage-dev-engine_sso_display-oidc-page.png)


4. Select one of the supported Social Sign-In providers.


5. Log out of Palette.


## Validation

You can validate SSO is enabled by attempting to log into your Palette tenant through SSO. Select the third-party provider you enabled for SSO.


![Palette's login view with the SSO providers highlighted.](/devx_manage-dev-engine_sso_palette-login-view.png)


# Disable SSO

Palette provides the flexibility to disable SSO  to restrict this capability. Use the following steps to disable SSO for Palette.


## Prerequisites

* Palette Tenant Administrator access.



## Disable Steps

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant Admin.


2. Navigate to the left **Main Menu**, select **Tenant Settings**, and select **SSO** from the left Settings **Main Menu**.


3. Next, click the **Auth Providers** tab and toggle the **Enable Provider Login** button.


4. Log out of Palette.


## Validation

You can validate SSO is disabled by attempting to log into your Palette tenant through SSO. Any SSO attempts will fail due to SSO being disabled at the tenant level.



