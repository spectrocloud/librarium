---
sidebar_label: "Palette Macros"
title: "Macros Support"
description: "Apply Palette Macros to Cluster Profiles."
hide_table_of_contents: false
sidebar_position: 130
tags: ["clusters", "cluster management"]
---

Palette supports placeholder variables as Macros in our cluster profile layers. These macros make regression and update of variables, across multiple-running clusters, easier. We encourage creating these macros and using them within any of our cluster profile layers. Hence, changes to the existing Macros get updated to the corresponding cluster profile and the clusters with these profiles attached. 

## Scope of Palette Macros

Palette users can declare the Macros under three different scopes:

1. **Project Scope**: Create `Macros` from the project dashboard with project privileges.


2. **Tenant Admin Scope**: Create macros from the `Tenant Admin Dashboard` with administrative privileges.


3. **System Scope**: Includes the default system macros and user-created system macros.

The Macros must have unique names within a given application, but Macros with a different Scope can have a unique name. In such cases, the precedence followed is in decreasing order (the highest precedence being Project Scope).


  **Project Scope** > **Tenant Scope** > **System Scope**


## Create your Macro

Palette users can use Macros in three different Scopes. Following the user preferences and privileges, log in as a Tenant Admin or Project Admin, to create macros under Tenant Admin scope and Project Scope, respectively. System Scope Macros can be created via API's. The steps to create a macro are as below:

<Tabs>
<TabItem label="Tenant Scope Macro" value="Tenant Scope Macro">


1. Log in to the Palette Management Console as a **Tenant Admin**.


2. From the menu on the left-hand side, click on **Tenant Settings** and select the **Macros** tab.


3. Click on **+Add Macro**. 


4. Complete the following details for the same:
    - **Name**: A custom name for the Macro.
    - **Value**: The value to be assigned to the placeholder variable.


5. Click the **Save changes** button to complete the wizard.

</TabItem>

<TabItem label="Project Scope Macro" value="Project Scope Macro">

1. Log in to the Palette Management Console as a **Project Admin**.


2. From the menu on the left-hand side, click on **Project Settings** and select the **Macros** tab.


3. Click on **+Add Macro**.


4. Complete the following details for the same:
    * **Name**: A custom name for the Macro
    * **Value**: The value to be assigned to the placeholder variable.


5. Click the **Save changes** button to complete the wizard.

</TabItem>

<TabItem label="System Scope Macro" value="System Scope Macro">

Create and list your System Level macros via an API.

</TabItem>

</Tabs>



```yaml
manifests:
  aws_ebs:
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
## Use your Macros

The Macros are overridden into the Cluster Profile layers:
* During a Cluster Profile creation.


* For a Cluster Profile used by a running cluster or during cluster provisioning.




### Add a Macro to a Cluster Profile Pack:

1. Log in to the Palette console and navigate to **Profiles**.


2. From the **Cluster Profiles** tab, select the **Cluster Profile** to which the Macro is to be added.

    **Note:** A macro can be attached to any Infrastructure or Add-on layers of a Profile.


3. Add the macro name to the desired layer of the profile in the format:

 `{{.spectro.macro.macro-name}}`, where the *macro-name* is the **Custom name**, created by the user.


4. Save the changes to the **Cluster Profile**. This Macro can be replaced or edited later.

### Replace or Add a Macro to a running Cluster:

1. ​​Log in to Palette Console and go to the **Clusters** tab.


2. Select the **Cluster Name** to which the Macro is to be updated and navigate to the **Cluster Details** page.


3. Go to the **Profiles** tab to select the layer to which the Macro is to be added.


4. In the desired existing pack, replace the value with the Macro name as:

 `{{.spectro.macro.macro-name}}`


5. Save the changes to the **Cluster Profile**.

## Delete Macros
<Tabs queryString="delete-scope">

<TabItem label="Tenant Scope Macro" value="Tenant Scope Macro">

1. Log in to Palette Management Console as **Tenant Admin**.


2. From the menu on the left-hand side, go to **Tenant Settings** and select the **Macros** tab. 


3. Click the **Delete** button to remove the macro.


4. Click the **Save changes** button to complete the wizard.

</TabItem>

<TabItem label="Project Scope Macro" value="Project Scope Macro">

1. Log in to Palette Management Console as **Project Admin**.


2. From the menu on the left-hand side, go to **Project Settings** and select the **Macros** tab.


3. Click on the **Delete** button to remove the macro.


4. Click the **Save changes** button to complete the wizard.

</TabItem>

<TabItem label="System Scope Macro" value="System Scope Macro">

<br />
Delete your system level macros via an API.

</TabItem>

</Tabs>

:::warning
When a Macro is deleted from the UI, it needs to be cleared from the cluster profile to avoid Macro deletion anomalies in the running cluster.
:::





