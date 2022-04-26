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

Palette supports placeholder variables as Macros in our Cluster Profile Layers. These Macros make regression and update of variables, across multiple running clusters, easier. We encourage creating these Macros and using them within any of our Cluster Profile Layers. Hence, changes to the existing Macros get updated to the corresponding cluster profile and the clusters with these profiles attached. 

# Scope of Palette Macros

Palette users can declare the Macros under three different scopes:

1. **Project Scope**: Create Macros from the Project dashboard with project privileges.


2. **Tenant Admin Scope**: Create Macros from the Tenant Admin dashboard with admin privileges.


3. **System Scope**: Includes the Default System Macros and User-created System Macros.

The Macros must have unique names within a given application, but Macros with a different scope can have a unique name. In such cases, the precedence followed is in decreasing order (the highest precedence being Project scope).


  **Project Scope** > **Tenant Scope** > **System Scope**


# Create your Macro

Palette users can use Macros in three different scopes. Following user preferences and privileges, log in as a Tenant Admin or Project Admin, to create Macros under Tenant Admin scope and Project Scope respectively. System Scope Macros can be created via API's. The steps to create a Macro are as below:

<Tabs>
<Tabs.TabPane tab="Tenant Scope Macro" key="Tenant Scope Macro">

1. Log in to the Palette Management Console as a **Tenant Admin**.


2. From the menu on the left-hand side, click on **Tenant Settings** and select the **Macros** tab.


3. Click on **+Add Macro**. 


4. Complete the following details for the same:
    - **Name**: A custom name for the Macro.
    - **Value**: The value to be assigned to the placeholder variable.


5. Click the **Save changes** button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="Project Scope Macro" key="Project Scope Macro">

1. Log in to the Palette Management Console as a **Project Admin**.


2. From the menu on the left-hand side, click on **Project Settings** and select the **Macros** tab.


3. Click on **+Add Macro**.


4. Complete the following details for the same:
    * **Name**: A custom name for the Macro
    * **Value**: The value to be assigned to the placeholder variable.


5. Click the **Save changes** button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="System Scope Macro" key="System Scope Macro">

Create and list your System Level macros via an API.

</Tabs.TabPane>

</Tabs>

## Example

```yaml
manifests:
  aws_ebs:
    #Storage type should be one of io1, gp2, sc1, st1 types          #Checkhttps://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html for more details
    storageType: "gp2"
    #Allowed reclaim policies are Delete, Retain
    reclaimPolicy: "Delete"
    #Toggle for Volume expansion
    allowVolumeExpansion: "true"
    #Toggle for Default class
    isDefaultClass: "true"
    #Supported binding modes are Immediate, WaitForFirstConsumer
    #Setting this to WaitForFirstConsumer for AWS, so that the volumes gets created in the same AZ as that of the pods
    volumeBindingMode: "{{.spectro.macro.volumeBindingMode}}"
```
# Use your Macros

The Macros are overridden into the Cluster Profile layers:
* During a Cluster Profile creation.
* For a Cluster Profile used by a running cluster or during cluster provisioning.

<Tabs>

<Tabs.TabPane tab="Add a Macro to a Cluster Profile Pack" key="Add a Macro to a Cluster Profile Pack">

## Add a Macro to a Cluster Profile Pack:

1. Log in to the Palette console and navigate to **Profiles**.


2. From the **Cluster Profiles** tab, select the **Cluster Profile** to which the Macro is to be added.

    **Note:** A macro can be attached to any infrastructure or add-on layers of a profile.


3. Add the macro name to the desired layer of the profile in the format:

 `{{.spectro. Macro.macro-name}}`, where the *macro-name* is the **Custom name**, created by the user.


4. Save the changes to the **Cluster Profile**. This Macro can be replaced or edited later.


</Tabs.TabPane>

<Tabs.TabPane tab="Replace or Add a Macro to a running Cluster" key="Replace or Add a Macro to a running Cluster">

## Replace or Add a Macro to a running Cluster:

1. ​​Log in to Palette Console and go to the **Clusters** tab.


2. Select the **Cluster Name** to which the Macro is to be updated and navigate to the **Cluster Details** page.


3. Go to the **Profiles** tab to select the layer to which the Macro is to be added.


4. In the desired existing pack, replace the value with the Macro name as:

 `{{.spectro. Macro.macroname}}`


5. Save the changes to the **Cluster Profile**.



</Tabs.TabPane>

</Tabs>

# Delete Macros
<Tabs>

<Tabs.TabPane tab="Tenant Scope Macro" key="Tenant Scope Macro">

1. Log in to Palette Management Console as **Tenant Admin**.


2. From the menu on the left-hand side, go to **Tenant Settings** and select the **Macros** tab. 


3. Click on the **Delete** button to remove the macro.


4. Click the **Save changes** button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="Project Scope Macro" key="Project Scope Macro">

1. Log in to Palette Management Console as **Project Admin**.


2. From the menu on the left-hand side, go to **Project Settings** and select the **Macros** tab.


4. Click on the **Delete** button to remove the macro.


5. Click the **Save changes** button to complete the wizard.

</Tabs.TabPane>

<Tabs.TabPane tab="System Scope Macro" key="System Scope Macro">

Delete your System Level Macros via an API.

</Tabs.TabPane>

</Tabs>
<WarningBox>
When a Macro is deleted from the UI, it needs to be  cleared from the Cluster Profile to avoid Macro deletion anomalies in the running cluster.
</WarningBox>





