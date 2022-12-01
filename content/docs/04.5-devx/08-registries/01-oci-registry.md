---
title: "OCI Registry"
metaTitle: "Spectro Cloud OCI Registry"
metaDescription: "creation and usages of OCI Registry within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Palette OCI Registry
Palette supports OCI registries to serve the “filesystem bundle” unpacked on disk as helm registries. Helm charts hosted in OCI registries can be added to cluster profiles and deployed to Kubernetes clusters. We support all OCI complaint registries.


## Pre-requisite

In Azure portal:

 * Create Azure Container Registry.


 * Go to Azure Container Registry, select AccessKeys and enable AdminUser to generate the password.
 

# Setup OCI Registry:

* Login to ** Palette Dev Engine Console**.


* Click **Registries** from the *left main menu*.


* Select the **OCI Registries** tab and click **Add New OCI Registry** button.


* Create OCI Registry by providing the following details:

    * EndPoint : Azure Container Registry Details - Login server End Point
    * Username : Azure Container Registry UserName
    * Password : Azure Container Registry Password

* Review the informations and click **Confirm**

# Use Your OCI Registry

Charts from the OCI registry can be used in your App Profiles as follows:

* From the Repository menu, select the desired OCI registry.


* Key in the required chart name and version. The name and version should exactly match the chart name and version hosted in the OCI registry.


* Click done to get your OCI-helm layer added to the cluster profile.
