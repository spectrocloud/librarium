---
title: "Register Edge Host"
metaTitle: "Register your edge hosts with the Palette Management Console"
metaDescription: "Learn how to register your edge hosts with the Palette Management Console"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

To use an Edge host with a host cluster, you must first register it with Palette. You have three options for how to go about registering the Edge host with Palette.

| Method | Description | Set up Effort |
|---|---|---|
| Auto Registration | Edge hosts can automatically register with Palette by using a *Registration Token*. This method requires you to specify the registration token in the user data.  | Low |
| Manual Registration | A unique Edge host ID is manually entered into the Palette Management Console. | Low |
| QR Code |  Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry.| High |


Select the registration method that best fits your organizational needs and review the steps of the option to get started.

# Auto Registration

You can automate the registration process by using registration tokens. This method requires providing the registration token in the user data. The default project, if any selected for the registration token determines the exact project within your tenant that the Edge host is registered under. You can override the default project by providing a project id in the user data.


<br />

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: yourEdgeRegistrationTokenHere
```

## Prerequisites

- Teant admin access

## Create Registration Token

To create a registration token, use the following steps.

<br />

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Settings**.


4. Select **Registration Tokens** in the **Tenant Settings Menu**.



5. Click **Add New Registration Token**.



6. Fill out the input fields and **Confirm** your changes. 


7. Save the **Token** value.


Your next step is to decide how you want to provide the registration token. You can include the registration token in the user data added to the device before shipping. Or you can create a user data ISO and have the registration token in the secondary user data. Check out the [Build User Data ISO](/clusters/edge/site-deployment/prepare-edge-configuration#builduserdataiso) to learn more about creating secondary user data.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the **Edge Hosts** tab.


Your Edge host will automatically register with Palette and display in the list.

# Manual Registration

In this mode, the edge host needs to be registered manually by providing the host's unique identifier. Navigate to the clusers page and click on the 'Edge Hosts' tab. Create 'Add New' option to bring up the edge host addition screen. Provide the unique ID and optinally one or more tags as name, value pairs.

The unique ID for the edge host can be auto-generated from the serial number. Alternately, it can be provided in the user data or generated using a specialized macro.

# QR Code Registration


# Next Steps

The next step in the installation process is to add the Edge host to a cluster or to create an Edge Native host cluster. Check out the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) to complete the last step of the installation process.