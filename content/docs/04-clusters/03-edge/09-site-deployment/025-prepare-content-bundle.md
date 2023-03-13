---
title: "Prepare Content Bundle"
metaTitle: "Prepare content bundle consisting of packages required for installation"
metaDescription: "Learn how prepare your content bundle for installation"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

You can create a content bundle that contains all the required packages and artifacts the Edge host need for a successful installation. You only need to create a content bundle for some installation scenarios.

The following table lists the various installation scenarios. Use the table to identify if you need to create a content bundle.

| **Scenario**  | **Description** | **Content Bundle** |
|-|-|-|
| Detached Air gapped Cluster |  You are deploying Edge clusters in a completely air-gapped environment without internet access. The clusters are not managed by the Palette Management System.|Mandatory|
| Connected Cluster |  You are deploying Edge clusters in an environment with internet connectivity, and the Palette Management System manages the clusters. You may build a content bundle for bandwidth optimization, but it is not required.|Optional|
| Managed Air Gapped Cluster |  You are deploying Edge clusters in an environment that is without internet access. However, you have an air-gapped version of the Palette Management system installed in the environment, which will manage your Edge clusters.|Mandatory|
| Cluster with Custom OS |  You are deploying Edge clusters in any environment using a customized Minimal Installation Environment for Containers (MIEC). In this scenario, you will need to build the core package consisting minimally of the customized MIEC. You may need to build the full Core Package if the  scenarios listed above apply. |Mandatory|

<!-- You are deploying Edge clusters to an environment using customized Minimal Installation Environment for Containers(MIEC). In this scenario, you must build the core bundle that also contains minimalized of the customized MIEC. If the above scenarios apply, you may need to build the complete Core Package. -->

# Prepare Content Bundle

Download the Spectro Cloud command line interface tool from [here].

Run the following command to generate a custom content bundle based on the cluster profile you modeled for your edge clusters

```
./spectro-cli-linux-amd64 build --api-key <TENANT_API_KEY> --project-id <PROJECT_ID> --cluster-profile-ids <CLUSTER_PROFILE_ID1,CLUSTER_PROFILE_ID2...> --palette-endpoint <Palette API Endpoint> --export-for-connected -o <bundle-name>.tar --iso
```

- api-key - Your Palette API key that you can copy over from the Palette Manamgement Console under your account settings
- project-id - The UID of the project where the profile(s) are created in Palette
- palette-endpoint - API Endpoint to the Palette Management Console (Example api.console.spectrocloud.com)
- bundle-name - a name for your content bundle.
- iso - Optional for scenarios where content bundle wouuld be provided as secondary input during installation.

The content bundle archive generated will be used in the next step if you are customizing your image. If you are not customizing your installer, you can trasnfer the content ISO file to a USB drive.
