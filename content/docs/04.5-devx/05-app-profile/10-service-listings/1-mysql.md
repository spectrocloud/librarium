---
title: "MySQL"
metaTitle: "Palette Dev Engine MySQL Service"
metaDescription: "Palette Dev Engine MongoDB Service"
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

MySQL is a relational database management system based on the Structured Query Language. This popular open-source database under the GNU license, helps to access and manage the records with the following properties:

<br />

* Creates a database for storing and manipulating data, defining the relationship of each table.


* Clients can make requests by typing specific SQL statements on MySQL.


* The server application will respond with the requested information and appear on the client’s side.


# Prerequisite
A Spectro Cloud [account](https://www.spectrocloud.com/get-started/)

# Add DB Service to your App Profile

1. Log in to [Palette](console.spectrocloud.com)


2. On the right hand-side of the window, click on the **User Menu**. Once the user menu is expanded, click on **Switch to App Mode**.


3. Select **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information and click **Next**.

|    **Parameter**            | **Description** |
|-----------------------------|-----------------|
|Application Profile Name     | A custom name for the App Profile|
|Version (optional)           | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**|
|Description (optional)       | Description of the App Profile | 
|Tag (optional)               | Tags on a cluster group are propagated to the cloud/datacenter environments|
 

4. From the available services start configuring your App Profile. Refer to [App Profiles](/devx/app-profile) for a list of available services.


5. Click on **MySQL** from the DB services and start the configuration.
  

6. Provide the following information to the wizard:
  * **Name:** The DB name. You can have the default Palette generated name or create a custom name. 
  * **Root Password:** Security password for the DB service.

<InfoBox>

You can use the default system-generated password. If the default password is used, it can be retrieved from the MySQL secrets using the following command:

```
kubectl get secrets -A
```

For using a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add to the basic information wizard. 
</InfoBox>

  * Database Volume Size (GiB): Select the volume as per the storage volume available in the cluster group and virtual clusters. 

  * Select the version from the **Version** drop-down. The following are the Palette supported MySQL versions:

    * 5.7

6. Output Variables: The output variables of this tier that may be used in higher tiers, typically for connection purposes are:

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
|Root Password|The password for default MySQL user's access control|
|MYSQLMSTR_SVC|Represents the DNS seed list connection format. The SRV indicates to the client that the hostname that follows corresponds to a DNS SRV record|
|MYSQLMSTR_SVC_PORT|Represents the port on which the database service is listening to|
|MYSQLMSTR_NS|Represents the namespaces to which MySQL database is launched|

# Validation

* To validate your database service in App Profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click the **App Profile Name** to see the service layers.


* Validate the services from the App page after app deployment. First, navigate to the **App** page, where all your apps are listed. Then, click the **App Name** to see the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|






