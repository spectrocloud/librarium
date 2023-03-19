---
title: "Create Spectro VM Dashboard Profile"
metaTitle: "Create Spectro VM Dashboard Profile"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Create a cluster profile with the Spectro VM Dashboard add-on and apply it to your MAAS cluster. When the cluster updates, a **Virtual Machines** tab appears.

# Prerequisites

- Registered Spectro VM Dashboard pack.

# Enablement

1. In your tenant environment, select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.


2. Enter basic information for the profile: name, version if desired, and optional description.


3. Select type **Add-on**, and click **Next**.


4. In the next screen that displays, click **Add New Pack**.


5. Choose pack type **System App**. 


6. From the **Registry drop-down Menu**, select the registry you added.


7. From the **Pack Name drop-down Menu**, select **Spectro VM Dashboard**.


8. Select the pack version. 

    The dashboard’s Access and Identity Provider (IDP) configuration displays.
    <br /> 

9. Configure the dashboard.

## Configure the Dashboard

The default setting for **Access** is **Proxied**, which automatically adds the Spectro Proxy pack. Changing the default may require some additional configuration.

The default setting for **Identity Provider** is Palette. All IDP options require you to map a set of users or groups to a Kubernetes RBAC role.

<WarningBox>

We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default settings can introduce misconfigurations. Carefully review the changes you make to a pack. 

</WarningBox>

IDP options are as follows:

- **Palette**: This setting makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources can log into the Kubernetes dashboard.


- **Inherit from Tenant**: This setting requires you to configure OpenID Connect (OIDC) in Tenant Settings. In Tenant Admin scope, navigate to Tenant Settings > SSO, choose OIDC, and provide your third-party IDP details. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.


- **Specified on Kubernetes layer**: This setting requires you to configure OIDC manually in the Kubernetes pack. Refer to [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc).

# Validation

COME BACK TO THIS

# Next Steps

Now apply the profile to your MAAS cluster. 
