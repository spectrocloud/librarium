---
title: "Postgres"
metaTitle: "Palette Dev Engine Postgres Service"
metaDescription: "Palette Dev Engine Postgres Service"
hideToC: false
type: "appTier"
category: ['databases']
fullWidth: false
logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Postgres

Palette supports [Postgres](https://www.postgresql.org/) as a database service. Postgres is a powerful open-source object-relational database system with over 35 years of active deployment with a strong reputation for reliability, feature robustness, and performance. Postgres uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads.

<br />

## Palette Postgres Requirement

The following are requirements for using Palette Postgres:

* Do not use the Postgres user names `postgres` and `admin`. These user names are reserved for internal system operations and will cause internal conflicts.


* The user name format does not support the special character hyphen(-). For example, `name-1` is not supported. 


* Clients must set `sslMode=require` or greater, as the server instance requires encryption for all connections. Review the [Postgres SSL documentation](https://www.postgresql.org/docs/current/libpq-ssl.html) to learn more about the SSL modes.


# Add Postgres to an App Profile


## Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/)

## Enablement

You can use the following steps to learn how to add Postgres to your app profile.

1. Log in to [Palette](console.spectrocloud.com).


2. On the right side of the window, click the **User Menu** to expand it and select **Switch to App Mode**.


3. Navigate to the left **Main Menu** and click on **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information and click **Next**.

|         **Parameter**   | **Description**  |
|-------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile.|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the app profile. | 
|Tag (optional)           | Assign tags to the app profile.|


4. Select **Postgres** from the database services and start the configuration.
  

5. Provide the following information to the wizard:

  * **Name:** The database service name. You can use the auto-generated name or create a custom name.


  * **Username:** The user name for database access control. 


  * **Password:** Security password for the DB service.

<InfoBox>


You can use the default system-generated password. If the default password is used, it can be retrieved from the Postgres secret that is created for the password. Review the [Database Password](/devx/app-profile/services/service-listings/postgresql-db/#database-password) section for guidance.

</InfoBox>


  * **Database Volume Size (GiB):** Select the volume size for the database. Ensure you stay within the storage amount available in the cluster group and virtual clusters. 

  * **Version: **Select the version from the **Version** **drop-down Menu**. Palette supports the following PostgreSQL versions:

    * 14
   
6. Save your changes.

## Validation

* To verify your database service is in the app profile, navigate to the **App Profiles** page, where all your app profiles are listed. Select the app profile to review the service layers. The following screen displays the different service layers that make up the app profile. Ensure MySQL is an available service layer.


* Validate the services from the App page after app deployment. First, navigate to the **Apps** page, where all your apps are listed. Then, select the app to display the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|



# Output Variables

The exposed output variables of this service layer that may be used in other service layers. These output variables are typically used for connectivity purposes:

| Parameter              | Output Variable                                                                     | Description                                     |
|------------------------|-------------------------------------------------------------------------------------|-------------------------------------------------|
| Database Username      | `{{.spectro.app.$appDeploymentName.database-<service-name>.USERNAME}}`              | The database user name.                         |
| Database User Password | `{{.spectro.app.$appDeploymentName.database-<service-name>.PASSWORD}}`              | The password of the database user name. |
| Service Hostname       | `{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC}}`      | The Kubernetes service hostname for the database.                |
| Service Port           | `{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC_PORT}}` | The exposed ports for the database service.              |


# Database Password

You can get the database password by reading the content of the Kubernetes secret created for the database user. To retrieve the password for the Postgres database user, use the following command format. 

```
kubectl get secret <app-name>-<service-name>-postgres-<user-name>-credentials \
 -n <app-name>-<service-name>-ns -o jsonpath='{.data.password}' | base64 --decode
```

Replace the values with the respective names.

  * app-name: represents the name of the app provided during the app creation process.
  * service-name: The name of the service layer in the app profile.
  * user-name: The name of the database user.


Example: 

- App Name: `app-tarfful`

- Service Name: `postgresql-3`

- Database User: `pguser`

```
kubectl get secret app-tarfful-postgresql-3-postgres-pguser-credentials \
 -n app-tarfful-postgresql-3-ns -o jsonpath='{.data.password}' | base64 --decode
zFniawyxEVdFtSF9uPfDsjFlOnAeDcrpndi3ReaUbqSGTMSnZ1gawSWkJCLabZR9
```