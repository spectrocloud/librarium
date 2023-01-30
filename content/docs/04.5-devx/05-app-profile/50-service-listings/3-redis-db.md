---
title: "Redis"
metaTitle: "Palette Dev Engine Redis Database Service"
metaDescription: "Palette Dev Engine Redis Database Service"
hideToC: false
type: "appTier"
category: ['databases']
hiddenFromNav: false
fullWidth: false
logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjxG5Qb38rX39m1M2p1W4t8H70OKpRY2breg&usqp=CAU"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Redis DB

[Redis](https://redis.io/docs/about/) is an open-source (BSD licensed), in-memory data structure store used as a data cache store or database service. Redis has built-in replication, Lua scripting, least recently used eviction, transactions, and different levels of on-disk persistence capabilities. In addition, Redis provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.

# Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

# Add DB Service to your App Profile

1. Log in to [Palette](console.spectrocloud.com)


2. On the right hand-side of the window, click on the **User Menu**. Once the user menu is expanded, click on **Switch to App Mode**.


3. Navigate to the left **Main Menu** and click on **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information and click **Next**.

|         Parameter           | Description  |
|-----------------------------|-----------------|
|Application Profile Name | A custom name for the app profile.|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an app profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the app profile. | 
|Tag (optional)           |  Assign tags to the app profile.|
 

4. Click on **Redis DB** from the DB services and start the configuration.
  

5. Provide the following information to the wizard:
  * **Name:** The database name. You can have the default Palette generated name or create a custom name. 
  * **Password:** Security password for the database service.

<InfoBox>
You can use the default system-generated password. If you use the default password, you can retrieve it from the Redis DB secrets using the following command:

```
kubectl get secrets -A
```

For using a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add to the basic information wizard. 
</InfoBox>

  * **Database Volume Size (GiB):** Select the volume as per the storage volume available in the cluster group and virtual clusters. 

6. **Output Variables**: The output variables of this tier that may be used in higher tiers, typically for connection purposes are:

```
{{.spectro.app.$appDeploymentName.redis-1.USERNAME}}
```
```
{{.spectro.app.$appDeploymentName.redis-1.PASSWORD}}
```
```
{{.spectro.app.$appDeploymentName.redis-1.REDISMSTR_SVC}}
```
```
{{.spectro.app.$appDeploymentName.redis-1.REDISMSTR_SVC_PORT}}
```
```
{{.spectro.app.$appDeploymentName.redis-1.REDISMSTR_NS}}
```


|**Output Variable**|**Description**|
|---------------|-----------|
|Username|Username for database access control|
|Password|Password for database access control|
|REDISMSTR_SVC|Provides the Redis service fully qualified domain name (FQDN) which can be consumed by App Services for database connectivity|
|REDISMSTR_SVC_PORT|Represents the port on which the database service is listening to|
|REDISMSTR_SVC_NAMESPACE|Represents the namespaces to which Redis database is launched|


# Validation

* To validate that your database service is in the app profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click on the app profile you wish to review the service layers. The following screen displays the different service layers that make up the app profile. Ensure Redis is an available service layer.


* Validate the services from the App page after app deployment. First, navigate to the **App** page, where all your apps are listed. Then, click the **App Name** to see the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|







