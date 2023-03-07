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

A content bundle can be built to package all the artifacts required for installation. This is mandatory in certain scenarios and optional (however optimial) in some other scenarios.

The following table lists various scenarios which require you to build your own content bundle.

| **Scenario**  | **Description** | **Content Bundle** |
|-|-|
| Detached Air gapped Cluster |  You are deploying edge clusters in a completely air gapped environment with no internet access. The clusters are not managed by a Palette Management System|Mandatory|
| Connected Cluster |  You are deploying edge clusters in an environment that has connectivity to the internet and the clusters are managed by the Palette Management System. You may choose to build and pre-load the core package for bandwidth optimization purposes, but it is optional|Optional|
| Managed Air Gapped Cluster |  You are deploying edge clusters in an environment that has no connectivity to the internet. However you have an air gapped version of Palette Management system installed in the environment, which will manage your edge clusters|Mandatory|
| Cluster with Custom OS |  You are deploying edge clusters in any environment using a customized MIEC. In this scenario, you will need to build the core package consisting minimally of the customized MIEC. You may need to build the full Core Package if the  scenarios listed above apply. |Mandatory|

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
