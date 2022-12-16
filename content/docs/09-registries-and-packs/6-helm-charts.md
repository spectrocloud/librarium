---
title: "Helm Registries"
metaTitle: "Helm Registries"
metaDescription: "Learn how to add your own Helm Registries to Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Palette Helm Registry
Helm Charts are a collection of Kubernetes resource files capable of deploying services of varying complexity. Palette provides some stable default Helm charts in its public Helm Chart Registry. 

Palette also supports creating custom Helm registries. You can add your own public or private Helm registries to Palette's Helm registry.

The Helm Chart registry synchronizes charts with Palette, so you can use them when you create cluster profiles.

# Prerequisite
For security, Palette requires Helm OCI version 3.7.0 and higher.

# Add a Helm Chart Registry to Palette

To add your private Helm Chart Registry to Palette:

1. Log in to Palette as a Tenant administrator. 

2. From the **Main Menu** navigate to **Tenant Settings > Registries**.

3. From the **Helm Registries** tab, click **Add New Helm Registry** and type the registry name and endpoint. If the registries list is long, you may need to scroll down to see the Add link.

4. Type the name of your registry and its endpoint.

5. Choose **Protected** mode based on whether your network is private or public:


   * Toggle **Protected** mode to *on* if your Helm registry is deployed in a private network. Palette downloads and deploys charts from protected chart registries instead of scanning a private network for them.

      When your registry is protected:

      * Charts are not synchronized with Palette, and you must type Helm chart names and versions when you create Cluster Profiles.
      * The **Last Synced** column in the **Helm Registries** tab displays *n/a*. 
   <br />
   <br />

    * Leave **Protected** mode toggled *off* if your Helm registry is deployed in a public network. We refer to Helm registries with this option disabled as being unprotected.  
    
      When your registry is unprotected: 

      * Palette synchronizes Helm charts with the console so you can select charts and versions from drop-down menus. 
      * The **Last Synced** column in the **Helm Registries** tab displays the date that charts were last synchronized in Palette.
   <br />
   <br />

6. If you haven’t set up credentials for your registry, leave **No Authentication** toggled *on*.

   If your registry has credentials, toggle **No Authentication** to *off* and type the registry **Username** and **Password**.
<br />

7. Confirm your changes. 

Your chart is now deployed in Palette's Helm Chart Registry and is ready to model in cluster profiles.

## Validation

You can find your Helm Registry listed in the **Helm Registries** tab in **Tenant Settings > Registries**. Use charts from Helm registries in your cluster profiles.

The following applies when adding Helm charts to cluster profiles.

* When using charts from protected registries, you must type the chart name and version you want to use. These must match the name and version hosted in the Helm registry.
* For unprotected Helm registries, charts are synchronized in Palette, which allows you to select them from lists and dropdowns.

# Resources

[Create Cluster Profiles](https://docs.spectrocloud.com/cluster-profiles/task-define-profile)

<br />

