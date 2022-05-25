---
title: "Helm Registry"
metaTitle: "Spectro Helm Registry"
metaDescription: "Description of Helm registries and charts and their usages within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Palette Helm Registry
Helm Charts are a collection of Kubernetes resource files capable of deploying services ranging in varying complexities. Palette provides a few stable public Helm registries out of the box. Tenants can also add any public or private Helm registries to leverage charts. Palette makes deploying typical Kubernetes applications easier with native support for Helm charts. We also allow the addition of any public or private Helm chart registry to the system. Charts from these system registries or any additional ones added by tenant administrators are modeled into cluster profiles for cluster deployment.

Palette mandates the use of Helm OCI version 3.7.0 and above for the best security experiences.

#  Deploying Helm Charts
Palette allows the deployment of Helm charts in two modes, one using the default Public Repo and another leveraging user's custom Helm registry.

# Default System Helm Registry
Palette provides users with a stable repo of Helm Charts accessible to all the tenants. This repository syncs all the Helm charts to the Palette system resources, enabling the tenants to model cluster profiles using out-of-the-box charts from the stable repo. It also improves ease of use of charts to the users.

# Setting up Helm Registry with Tenant Scope

Palette also provides an exclusive Helm Registry for tenants to add their private Helm charts. To create your private repo from the Palette console follow these steps:


1. Login as a Tenant administrator, navigate to **Admin > Settings > Registries**.


2. Click on **Add New Helm Registry** and provide the registry name, endpoint, and user credentials.


3. **Protected Mode**: Enable **Protected** mode if the user's Helm registry is deployed within a private network. Palette's orchestrator running in the tenant clusters deployed in private networks downloads and deploys charts from these protected chart registries.
   * The user credential validation is disabled in protected mode.
   * In protected mode, the charts are not synchronized into the management console.
   * The users can manually input the Helm chart names and versions during Cluster Profile creation in protected mode. 


4. **Unprotected Mode**: Disable **Protected** mode if the user's Helm registry is deployed within a public network. 
   * The charts need to be synchronized into the management console in unprotected mode. 
   * Charts are selected from the dropdown menu during the cluster profile creation.


5. Enable "**No authentication**" if the tenant choice is not to set up credentials for the registry.
   * If the user wants to create the registry without authentication, only a custom registry name and endpoint are required for the validation to complete. 


6. Disabling the **No authentication** requires a specific username and password set up along with the custom registry name and endpoint. Upon successful registration, users can build and deploy custom charts onto the custom Helm registry and use these packs while creating Cluster Profiles.


7. Click **Confirm** to complete the registry creation process.


# Use Your Helm Registry
Charts from the Helm registries can be used in your cluster profiles as follows:

1. From the **Repository** menu, select the desired **Helm registry**.


2. For Protected Helm Registries:
    * Key in the required chart name and version. 
    * The name and version should match the chart name and version hosted in the Helm registry.


3. For Unprotected Helm Registries:
    * The synchronized charts will be available within the Palette Management console. 
    * Select the required charts from the dropdown menu.


4. Click **Done** to get your Helm layer added to the cluster profile.

# Helm Chart Discovery for Brownfield Clusters

Palette discovers the Helm charts already installed within the imported brownfield clusters. These charts are synchronized into the Palette Management Console.

1. While creating a new Cluster Profile, at step 3, **Profile Layer** creation, select **Import from Cluster**.


2. Select the name of the Brownfield cluster and select the existing charts from the dropdown menu.


3. Complete the wizard to add the chart as an Add-on layer to the newly, created Cluster Profile.

