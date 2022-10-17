---
title: "Dev Engine Registries"
metaTitle: "Palette Dev Engine for Enterprise Developers"
metaDescription: "Palette Dev Engine Registries"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Palette Helm Registry
Helm Charts are a collection of Kubernetes resource files capable of deploying services ranging in varying complexities. Palette provides a few stable public Helm registries out of the box. Tenants can also add any public or private Helm registries to leverage charts. Palette makes deploying typical Kubernetes applications easier with native support for Helm charts. We also allow the addition of any public or private Helm chart registry to the system. Charts from these system registries or any additional ones added by tenant administrators are modelled into cluster profiles for cluster deployment.

Palette mandates using Helm OCI version 3.7.0 and above for the best security experience.

#  Deploying Helm Charts
Palette allows the deployment of Helm charts in two modes, one using the default Public Repo and another leveraging developers's custom Helm registry.

# Default System Helm Registry
Palette provides developers with a stable repo of Helm Charts accessible to all the tenants. This repository syncs all the Helm charts to the Palette system resources, enabling the tenants to model cluster profiles using out-of-the-box charts from the stable repo. It also improves the ease of use of charts for the developers.

# Setting up Helm Registry with Tenant Scope

Palette also provides an exclusive Helm Registry for tenants to add their private Helm charts. To create your private repo from the Palette console, follow these steps:


1. Log in as a Tenant administrator, and navigate to **Admin > Settings > Registries**.


2. Click on **Add New Helm Registry** and provide the registry name, endpoint, and developer credentials.


3. **Protected Mode**: Enable **Protected** mode if the developer's Helm registry is deployed within a private network. Palette's orchestrator running in the tenant clusters deployed in private networks downloads and deploys charts from these protected chart registries.
   * The developer credential validation is disabled in protected mode.
   * The charts are not synchronized into the management console in protected mode.
   * The developers can manually input the Helm chart names and versions during Cluster Profile creation in protected mode. 


4. **Unprotected Mode**: Disable **Protected** mode if the developer's Helm registry is deployed within a public network. 
   * The charts must be synchronized into the management console in unprotected mode. 
   * Charts are selected from the dropdown menu during the cluster profile creation.


5. Enable "**No authentication**" if the tenant chooses not to set up credentials for the registry.
   * If the developer wants to create the registry without authentication, only a custom registry name and endpoint are required for the validation to complete. 


6. Disabling the **No authentication** requires a specific username and password, along with the custom registry name and endpoint. Upon successful registration, developers can build and deploy custom charts onto the custom Helm registry and use these packs while creating Cluster Profiles.


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


2. Select the Brownfield cluster's name and the existing charts from the dropdown menu.


3. Complete the wizard to add the chart as an Add-on layer to the newly created Cluster Profile.


# Resource Quota

Palette allocates quota to developers using the Palette cluster group(s) to try out our free tier offering. They may launch (vanilla) nested clusters or deploy apps to new nested clusters or existing ones. Developers will end up using their quota defined at the system level while exploring the capabilities offered by Palette (SaaS). 


At the same time, our Enterprise developers might offer the above capabilities to their internal developers, i.e., enterprise developers. These enterprise developers (in theory) could use the system-level quota offered to every other developer. Still, in all likelihood, the tenant admin will set up different cluster groups(s) and quotas for enterprise developers. You may view this as the enterprise developer's quota offered at the tenant level.
Enterprise developers may not exceed their system-level quota while launching nested clusters in system-level cluster group(s). In addition, they may not exceed their tenant-level quota while launching nested clusters in their tenant-level cluster groups.

## Manage the User Quota

The user quota can be managed through the Palette Platform as below:

1. Login to the Palette console as Tenant Admin, go to Tenant Settings and select `Developer Settings.


2. In the wizard to Manage Developer Settings, there is an option to `Hide system-level cluster groups from tenant developers` using the toggle button. You will have to create your cluster groups by hiding the system-level cluster groups.


3. Set the `User Quota,` where default values are as follows:

|Resource|Default Quota|
|--------|-------------|
|Number of nested clusters| 2|
|CPU|12|
|Memory| 16 GiB|
|Storage| 20 GiB|

<InfoBox>
The Quota allocation can be interpreted as - Each developer in this tenant may create up to 2 nested clusters and has a cumulative CPU/Memory/Storage quota across all their nested clusters. Each nested cluster may consume up to 2.5 vCPU and 2.5 GiB memory from the allocated quota.
</InfoBox>

<br />

