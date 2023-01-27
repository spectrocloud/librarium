---
title: "MySQL"
metaTitle: "Palette Dev Engine MySQL Service"
metaDescription: "Palette Dev Engine MySQL Service"
hideToC: false
type: "appTier"
category: ['databases']
fullWidth: false
logoUrl: "https://registry.dev.spectrocloud.com/v1/mysql-operator/blobs/sha256:2d59bc428916752528280eac03330d712164163e2f3c476409f5c25d8a7c2778?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# MySQL

[MySQL](https://www.mysql.com/) is an open-source relational database management system commonly used in web applications and other software that requires a database. It is known for its reliability, ease of use, and flexibility. MySQL is covered under the GNU license and uses structured query language (SQL) to manage data with the following properties:

<br />

* Creates a database for storing and manipulating data and defining the relationship of each table.


* Clients can retrieve and manipulate data by creating SQL queries and submitting them to the MySQL instance.

# Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

# Add MySQL to App Profile

1. Log in to [Palette](console.spectrocloud.com).


2. On the right side of the window, click on the **User Menu**. Once the user menu is expanded, click on **Switch to App Mode**.


3. Navigate to the left **Main Menu** and click on **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information and click **Next**.

|    **Parameter**            | **Description** |
|-----------------------------|-----------------|
|Application Profile Name     | A custom name for the app profile.|
|Version (optional)           | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.|
|Description (optional)       | Description of the app profile.| 
|Tag (optional)               | Assign tags to the app profile.|
 

4. Select **MySQL** from the database services and start the configuration.
  

5. Provide the following information to the wizard:
  * **Name:** The database name. You can use the auto generated name or create a custom name.
  * **Root Password:** The root password for the database service.

<InfoBox>

You can use the default system-generated password. If the default password is used, it can be retrieved from the MySQL secrets using the following command:

```
kubectl get secrets -A
```

For using a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add to the basic information wizard. 
</InfoBox>

  * Database Volume Size (GiB): Select the volume size for the database. Ensure you stay within the storage amount available in the cluster group and virtual clusters.

  * Select the version from the **Version** drop-down. The following are the Palette supported MySQL versions:

    * 5.7

6. Output Variables: The exposed output variables of this service layer that may be used in other service layers. These output variables are typically used for connectivity purposes:

```
{{.spectro.app.$appDeploymentName.mysql-1.ROOT_PASSWORD}}
```
```
{{.spectro.app.$appDeploymentName.mysql-1.MYSQLMSTR_SVC}}
```
```
{{.spectro.app.$appDeploymentName.mysql-1.MYSQLMSTR_SVC_PORT}}
```
```
{{.spectro.app.$appDeploymentName.mysql-1.MYSQLMSTR_NS}}
```

|**Output Variable**|**Description**|
|---------------|-----------|
|Root Password|The root password for the  MySQL instance|
|MYSQLMSTR_SVC|Represents the DNS seed list connection format. The SRV indicates to the client that the host name that follows corresponds to a DNS SRV record.|
|MYSQLMSTR_SVC_PORT|Represents the port on which the database service is listening to.|
|MYSQLMSTR_NS|Represents the namespaces to which MySQL database is launched.|

# Validation

* To validate your database service in App Profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click the **App Profile Name** to see the service layers.


* * To validate that your database service is in the app profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click on the app profile you wish to review the service layers. The following screen displays the different service layers that make up the app profile. Ensure MySQL is an available service layer.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|






