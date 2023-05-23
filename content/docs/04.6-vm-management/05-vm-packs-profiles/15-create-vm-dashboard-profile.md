---
title: "Create Spectro VM Dashboard Profile"
metaTitle: "Create Spectro VM Dashboard Profile"
metaDescription: "Learn how to create a Palette profile for the Spectro VM Dashboard."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The Spectro VM Dashboard is a web-based UI for virtual machines (VMs) that uses secure ports and conveniently includes Spectro Proxy. When used with the default settings for access control and Identity Provider (IDP), there is nothing to configure.

Create a cluster profile with the **Spectro VM Dashboard** add-on pack and apply it to your cluster. When the cluster updates, a **Virtual Machines** tab appears.


# Prerequisites

- Registered Spectro VM Dashboard pack registry.


- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


- Users or groups must be mapped to a Virtual Machine RBAC role. You can create a custom role through a manifest and use Palette's RoleBinding feature to associate the users or groups with the role. Refer to the [Create Role Bindings](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more.


- A namespace for VMs. Although you can deploy VMs from the default namespace, we recommend creating at least one namespace dedicated to VMs as a way to organize and manage them. To learn how to create a namespace, check out [Create a Namespace](/clusters/cluster-management/namespace-management#createanamespace). 

# Create the VM Dashboard

1. Log in to [Palette](https://console.spectrocloud.com).


2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.


3. Enter basic information for the profile: name, version if desired, and optional description.


4. Select type **Add-on**, and click **Next**.


5. In the next screen that displays, click **Add New Pack**, and use the following information to find the VM Dashboard pack:

    <br />
    
    - **Pack Type**: System App
    - **Registry**: Select the registry you added.
    - **Pack Name**: Spectro VM Dashboard
    - **Pack Version**: 3.1.x or newer

    <br /> 

    A configuration panel displays Access and Identity Provider (IDP) parameters with pre-defined default settings.

    <br /> 

10. Configure the dashboard.

<br />

## Configure the Dashboard

The default setting for **Access** is **Proxied**, which automatically adds the Spectro Proxy pack. Changing the default may require some additional configuration.

The default setting for **Identity Provider** is Palette. All IDP options require you to map a set of users or groups to a Kubernetes RBAC role.

<br />

<WarningBox>

We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default settings can introduce misconfigurations. Carefully review the changes you make to a pack. 

</WarningBox>

IDP options are as follows:

<br />

- **Palette**: This setting makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources can log into the Kubernetes dashboard.


- **Inherit from Tenant**: This setting requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.


- **Specified on Kubernetes layer**: This setting requires you to configure OIDC manually in the Kubernetes pack. Refer to [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) for more information.

# Validate

You can validate the profile is created. 

<br />

1. Navigate to **Profiles** from the left **Main Menu**. 


2. Locate the newly created profile in the list.

# Next Steps

You can now apply the profile to your cluster. [Enable Spectro VM Dashboard](/vm-management/vm-packs-profiles/enable-vm-dashboard) guides you in applying the profile so you can access the dashboard.
