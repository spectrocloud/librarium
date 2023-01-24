---
title: "PostgreSQL"
metaTitle: "Palette Dev Engine PostgreSQL Service"
metaDescription: "Palette Dev Engine PostgreSQL Service"
hideToC: false
type: "appTier"
category: ['databases']
fullWidth: false
logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# PostgreSQL

Palette supports PostgreSQL database service, a powerful open-source object-relational database system with over 35 years of active deployment with a strong reputation for reliability, feature robustness, and performance. PostgreSQL uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads.

<br />

## Palette Postgres Requirements

The following are requirements for using Palette Postgres:


* Do not use the Postgres user names, `postgres` and `admin`. These user names are reserved for internal system operations and will cause internal conflicts if used.

# Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/)

# Add DB Service to your App Profile

1. Log in to [Palette](console.spectrocloud.com)


2. On the right hand-side of the window, click on the **User Menu**. Once the user menu is expanded, click on **Switch to App Mode**.


3. Select **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information for your App Profile and click **Next**.

|         **Parameter**     | **Description**  |
|---------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)           | Tags on a cluster group are propagated to the cloud/datacenter environments.|
 

4. From the available services start configuring your App Profile. Refer to [App Profiles](/devx/app-profile) for a list of available services.


5. Click on **PostgreSQL** from the DB services and start the configuration.
  

6. Provide the following information to the wizard:

  * **Name:** The database *service name*. You can have the default Palette generated name or create a custom name.


  * **Username:** The user name for DB access control. 


  * **Password:** Security password for the DB service.

<InfoBox>
You can use the default system-generated password. If the default password is used, it can be retrieved from the MongoDB secrets using the following command:

```
kubectl get secrets -A
```

For using a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add to the basic information wizard. 
</InfoBox>

  * **Database Volume Size (GiB):** Select the volume as per the storage volume available in the cluster group and virtual clusters. 

  * **Version:**Select the version from the **Version** drop-down. The following are the Palette supported MongoDB versions:

    * 14
   

6. **Output Variables**: The output variables of this service layer that may be used in higher service layers, typically for connection purposes are:

**Note:**
The database service name must be passed on to the output variables for database connectivity to other app services.


```
{{.spectro.app.$appDeploymentName.database-<service-name>.USERNAME}}
```
```
{{.spectro.app.$appDeploymentName.database-<service-name>.PASSWORD}}
```
```
{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC}}
```
```
{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC_PORT}}
```

|**Output Variable**|**Description**|
|---------------|-----------|
|Username|Username for database access control|
|Password|Password for database access control|
|POSTGRESMSTR_SVC|Provides the Postgres service fully qualified domain name (FQDN) which can be consumed by App Services for database connectivity|
|POSTGRESMSTR_SVC_PORT|Represents the port on which the database service is listening to|


# Validation

* To validate your database service in App Profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click the **App Profile Name** to see the service layers.


* Validate the services from the App page after app deployment. First, navigate to the **App** page, where all your apps are listed. Then, click the **App Name** to see the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|







