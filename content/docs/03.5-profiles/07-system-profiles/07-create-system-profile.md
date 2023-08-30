---
title: "Create a System Profile"
metaTitle: "Create a System Profile"
metaDescription: "Learn how to create Palette system profiles and apply them to your clusters."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



System profiles modeled on the Palette UI should be downloaded and provided input to the edge system. Upon bootstrap, when the edge appliance registers back with the SaaS console, it links to the system profile. Any subsequent changes made to the profile after registration are propagated down to the edge appliance.
<br />

## Prerequisites

- Tenant admin privileges.


## Create a System Profile

Follow the steps below to create a system profile.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, click **Profiles**.


3. Select the **System Profile** tab, and click **Add System Profiles**.

  <br />
  
  ![system-profile-1.png](/system-profile-1.png)


4. Provide profile information such as system profile name, description (optional), and tags (optional) system profile.


5. Add one or more layers using one of the following methods:
    <br />
  
    * **Add New Pack** - Add a Palette Pack from a pack registry or a [Helm Chart](/registries-and-packs/helm-charts/) from a chart registry. The public Spectro Cloud Pack registry and a few popular helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.

    <br />
    
    ![system-profile-2.png](/system-profile-2.png)

    <br />

    * **Add Manifest** - Layers can be constructed using raw manifests to provide Kubernetes resources unavailable via Palette or Charts. In addition, pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack.

    <br />

    ![system-profile-3.png](/system-profile-3.png)



6. Click the `Confirm and Create` button to save the configuration.


7. Click the `Next` button to review the information and `Finish` to create and save the system profile.
<br />

  <InfoBox>
  
  Palette enables the [Export](/cluster-profiles/cluster-profile-import-export#exportclusterprofile) and [Import](/cluster-profiles/cluster-profile-import-export#importclusterprofile) of System profiles across multiple environments, projects, and tenants.

  </InfoBox>

<br />

<br />