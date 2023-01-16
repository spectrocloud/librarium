---
title: "MongoDB Service"
metaTitle: "Palette Dev Engine MongoDB Service"
metaDescription: "Palette Dev Engine MongoDB Service"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Mongo DB

MongoDB is a developer data platform that quickly builds applications with optimal performance and scalability. It provides data distribution and mobility across multiple cloud environments. In addition, this multi-cloud database service provides you with resilience, data privacy, and security.

# Prerequisite
A Spectro Cloud [account](https://www.spectrocloud.com/get-started/)

# Add DB Service to your App Profile

1. Log in to [Palette](console.spectrocloud.com)


2. On the right hand-side of the window, click on the **User Menu**. Once the user menu is expanded, click on **Switch to App Mode**.


3. Select **App Profiles** to create a [new App Profile](/devx/app-profile/create-app-profile/). Provide the following basic information for your App Profile and click **Next**.

|         Parameter           | Description  |
|-----------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)           | Tags on a cluster group are propagated to the cloud/datacenter environments.|
 

4. From the available services start configuring your App Profile. Refer to [App Profiles](/devx/app-profile) for a list of available services.


5. Click on **Mongo DB** from the DB services and start the configuration.
  

6. Provide the following information to the wizard:
  * **Name:** The DB name. You can have the default Palette generated name or create a custom name. 
  * **Username:** The user name for DB access control
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

    * 4.4.14
    * 5.0.10

6. **Output Variables**: The output variables of this tier that may be used in higher tiers, typically for connection purposes are:

```
{{.spectro.app.$appDeploymentName.mongodb-1.USERNAME}}
```
```
{{.spectro.app.$appDeploymentName.mongodb-1.PASSWORD}}
```
```
{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI}}
```
```
{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI_SRV}}
```
|Output Variable|Description|
|---------------|-----------|
|Username|
|Password|
|Mongo URI|
|Mongo URI SRV|

# Validation

* To validate your database service in App Profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click the **App Profile Name** to see the service layers.


* Validate the services from the App page after app deployment. First, navigate to the **App** page, where all your apps are listed. Then, click the **App Name** to see the service layers. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|







