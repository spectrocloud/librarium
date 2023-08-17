---
title: "Create a VMO Profile"
metaTitle: "Create a VMO Profile"
metaDescription: "Learn how to create a cluster profile to utilize Palette Virtual Machine Orchestrator capabilities."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The **Virtual Machine Orchestrator** pack that you use to create a VMO cluster profile conveniently includes several components and automatically installs the Spectro Proxy pack when you use the default profile configuration. To learn about pack components, refer to [Virtual Machine Orchestrator Pack](/vm-management/vm-packs-profiles).

Create a cluster profile with the **Virtual Machine Orchestrator** add-on pack and apply it to your cluster. When the cluster updates, a **Virtual Machines** tab appears. 

<<< IS THE STATEMENT TRUE ABOUT WHEN VMS TAB APPEARS? OR IS IT ALWAYS VISIBLE? >>>


# Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


- Users or groups must be mapped to a Virtual Machine RBAC role. You can create a custom role through a manifest and use Palette's RoleBinding feature to associate users and groups with the role. Refer to the [Create Role Bindings](/clusters/cluster-management/cluster-rbac#createrolebindings) guide to learn more.


- A namespace for VMs. Although you can deploy VMs from the default namespace, we recommend creating at least one namespace dedicated to VMs as a way to organize and manage them. To learn how to create a namespace, check out [Create a Namespace](/clusters/cluster-management/namespace-management#createanamespace). 


# Create the Profile

1. Log in to [Palette](https://console.spectrocloud.com).


2. Select **Profiles** in the left **Main Menu** and click the **Add Cluster Profile** button.


3. Enter basic information for the profile: name, version if desired, and optional description.


4. Select type **Add-on**, and click **Next**.


5. In the following screen, click **Add New Pack**. 


6. Use the information below to find the **Virtual Machine Orchestrator** pack:

    <br />
    
    - **Pack Type**: System App
    - **Registry**: Public Repo
    - **Pack Name**: Virtual Machine Orchestrator
    - **Pack Version**: 4.1 or newer  
    
    <br />
    
    <<< IS VERSION CORRECT? >>>


7. Review the **Access** configuration panel at right. The default setting is **Proxied**, which automatically adds the **Spectro Proxy** pack when you create the MAAS cluster. Check out the [Spectro Proxy](/integrations/frp) guide to learn more. Changing the default may require some additional configuration. 

    <br />

    <<< WHAT ADDITIONAL CONFIGURATION WOULD BE NEEDED IF USER SPECIFIES DIRECT? >>>

    <br />

    The **Direct** option is meant for a private configuration where a proxy is not implemented or not desired.


<WarningBox>

We recommend using the pack defaults. Default settings provide best practices for your clusters. Changing the default settings can introduce misconfigurations. Carefully review the changes you make to a pack. 

</WarningBox> 

8. Click **Confirm & Create**. 


9. In the following screen, click **Next**. 


10. Review the profile and click **Finish Configuration**. 

<!-- IDP options are as follows:

<br />

- **Palette**: This setting makes Palette the IDP, so any user with a Palette account in the tenant and the proper permissions to view and access the project's resources can log into the Kubernetes dashboard.


- **Inherit from Tenant**: This setting requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.


- **Specified on Kubernetes layer**: This setting requires you to configure OIDC manually in the Kubernetes pack. Refer to [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) for more information. -->

# Validate

You can validate the profile is created. 

<br />

1. Navigate to **Profiles** from the left **Main Menu**. 


2. Locate the newly created profile in the list.

# Next Steps

You can now apply the profile to your MAAS cluster. You must configure roles and role bindings so that users can access virtual clusters.


# Resources

- [Add Roles and Role Bindings](/vm-management/vm-packs-profiles/add-roles-and-role-bindings)
