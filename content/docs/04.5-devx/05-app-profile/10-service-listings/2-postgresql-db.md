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

Palette supports [PostgreSQL](https://www.postgresql.org/) as a database service. Postgres is a powerful open-source object-relational database system with over 35 years of active deployment with a strong reputation for reliability, feature robustness, and performance. Postgres uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads.

<br />

## Palette Postgres Requirement

The following are requirements for using Palette Postgres:

* Do not use the Postgres user names, `postgres` and `admin`. These user names are reserved for internal system operations and will cause internal conflicts.


* Clients must set `sslMode=require` or greater as the server instance requires encryption for all connections. Review the [Postgres SSL documentation](https://www.postgresql.org/docs/current/libpq-ssl.html) to learn more about the SSL modes.

# Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/)

# Add Postgres to App Profile

You can use the following steps to learn how to add Postgres to your app profile.

1. Log in to [Palette](console.spectrocloud.com).


2. On the right side of the window, click the **User Menu** to expand it and select **Switch to App Mode**.


3. Navigate to the left **Main Menu** and click on **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information and click **Next**.

|         **Parameter**   | **Description**  |
|-------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile.|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)           | Assign tags to the app profile.|


4. Select **PostgrSQL** from the database services and start the configuration.
  

5. Provide the following information to the wizard:

  * **Name:** The database service name. You can use the auto-generated name or create a custom name.


  * **Username:** The user name for database access control. 


  * **Password:** Security password for the DB service.

You can use the default system-generated password. If the default password is used, it can be retrieved from the PostgreSQL secrets using the following command:

<br />

```
kubectl get secrets -A
```
<br />

For using a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add to the basic information wizard. 

  * **Database Volume Size (GiB):** Select the volume size for the database. Ensure you stay within the storage amount available in the cluster group and virtual clusters. 

  * **Version: **Select the version from the **Version** **drop-down Menu**. The following are the Palette supported PostgreSQL versions:

    * 14
   

6. **Output Variables**:  **Output Variables**: The exposed output variables of this service layer that may be used in other service layers. These output variables are typically used for connectivity purposes:

  * The database service name must be passed on to the output variables for database connectivity to other app services. 

  * Set `sslMode` to `require` to [establish database connectivity](https://www.postgresql.org/docs/current/libpq-ssl.html).


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
|Username|Username for database access control.|
|Password|Password for database access control.|
|POSTGRESMSTR_SVC|Provides the Postgres service fully qualified domain name (FQDN) which can be consumed by App Services for database connectivity.|
|POSTGRESMSTR_SVC_PORT|Represents the port on which the database service is listening on.|


# Validation

* To validate that your database service is in the app profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click on the app profile you wish to review the service layers. The following screen displays the different service layers that make up the app profile. Ensure MySQL is an available service layer.


* Validate the services from the App page after app deployment. First, navigate to the **App** page, where all your apps are listed. Then, click the **App Name** to see the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|







