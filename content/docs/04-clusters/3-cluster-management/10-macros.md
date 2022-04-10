---
title: "Palette Macros"
metaTitle: "Palette Macros Support"
metaDescription: "Apply Palette Macros to Cluster Profiles."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette supports placeholder variables as Macros in our cluster profile layers. These Macros aid regression and update of variables across multiple running clusters easier. We encourage creating these Macros and using them within any of our Cluster Profile layers. Hence, changes to the existing Macros get updated to the corresponding cluster profile and the clusters with these profiles attached. 

# Scope of Palette Macros

Palette users can declare the Macros under three different scopes:

* **Project Scope**: Create macros from the project dashboard with project privileges.
* **Tenant Admin Scope**: Create Macros from the tenant admin dashboard with admin privileges.
* **System Scope**: Includes the default system macros and user-created system macros.

The Macros must have unique names within a given application, but Macros with a different scope can have a unique name. In such cases, the precedence followed is: 

`Project Scope ->Tenant Scope ->System Scope`, in decreasing order (highest precedence being Project scope). 
# Create your Macro

Palette users can use Macros in three different scopes. Following user preferences and privileges, login as Tenant Admin or Project Admin, to create Macros under Tenant Admin scope and Project Scope respectively. System Scope Macros can be created via API’s . The steps to create a Macro are as below:

<Tabs>
<Tabs.TabPane tab="Tenant Scope Macro" key="Tenant Scope Macro">

* Login to Palette Management Console as `Tenant Admin`.
* Go to `Tenant settings` from the leftmost ribbon menu
* Select the `Macros` tab from the Tenant Settings menu
* Click on `+Add Macro`. 
* Fill up the following details for the same:
* **Name**: A custom name for the Macro.
* **Value**: The value to be assigned to the placeholder variable.
* Click the `Save changes` button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="Project Scope Macro" key="Project Scope Macro">

* Login to Palette Management Console as `Project Admin.`
* Go to `Project settings` from the leftmost ribbon menu
* Select the `Macros` tab from the Project Settings menu
* Click on `+Add Macro.` 
* Fill up the following details for the same:
* **Name:** A custom name for the Macro
* **Value:** The value to be assigned to the placeholder variable.
* Click the `Save changes` button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="System Scope Macro" key="System Scope Macro">

Create and list your System Level macros via API.

</Tabs.TabPane>

</Tabs>

# Example

```yaml
manifests:
  aws_ebs:
    #Storage type should be one of io1, gp2, sc1, st1 types          #Checkhttps://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html for more details
    storageType: “gp2”
    #Allowed reclaim policies are Delete, Retain
    reclaimPolicy: “Delete”
    #Toggle for Volume expansion
    allowVolumeExpansion: “true”
    #Toggle for Default class
    isDefaultClass: “true”
    #Supported binding modes are Immediate, WaitForFirstConsumer
    #Setting this to WaitForFirstConsumer for AWS, so that the volumes gets created in the same AZ as that of the pods
    volumeBindingMode: “{{.spectro.macro.volumeBindingMode}}”
```
# Use your Macros

* The Macros are overridden into the cluster profile layers:
  * During Cluster Profile creation.
  * For a cluster profile used by a running cluster or during cluster provisioning.

## To add a Macro to a cluster profile pack:

* Login to the Palette console and navigate to `Profiles.`
* From the `Cluster Profiles` tab, select the cluster profile to which the Macro to be added.

**Note:** Macro can be attached to any infrastructure or add-on layers of a profile.
* Add the macro name to the desired layer of the profile in the format:
`{{.spectro. Macro.macro-name}}`, where macro-name is the custom name created by the user.
* Save the changes to the cluster profile.
* This Macro can be replaced or edited later.

## To replace or add a Macro to a running cluster:

* ​​Login to Palette Console and go to the `Clusters` tab.
* Navigate to the Cluster details page by clicking the cluster name to which the Macro is to be updated.
* Go to the `profile tab` to select the layer to which the Macro is to be added
* In the desired existing pack, replace the value with the Macro name as: "{{.spectro. Macro.macroname}}"
* Save the changes to the cluster profile.
# Delete Macros
<Tabs>

<Tabs.TabPane tab="Tenant Scope Macro" key="Tenant Scope Macro">

* Login to Palette Management Console as `Tenant Admin`.
* Go to `Tenant settings` from the left-most ribbon menu
* Select the ‘Macros’  tab from the Tenant Settings menu
* Click on the `Delete` button.
* Click the `Save changes` button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="Project Scope Macro" key="Project Scope Macro">

* Login to Palette Management Console as `Project Admin`.
* Go to `Project settings` from the left most ribbon menu
* Select `Macros` tab from the Project Settings menu
* Click on `Delete` button
* Click `Save changes` button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="System Scope Macro" key="System Scope Macro">

Delete your System Level Macros via API.

</Tabs.TabPane>

</Tabs>
<WarningBox>
When a Macro is deleted from the UI, it needs to be  cleared from the Cluster Profile to avoid Macro deletion anomalies in the running cluster.
</WarningBox>





