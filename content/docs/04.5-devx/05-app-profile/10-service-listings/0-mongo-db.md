---
title: "MongoDB"
metaTitle: "Palette Dev Engine MongoDB Service"
metaDescription: "Palette Dev Engine MongoDB Service"
hideToC: false
type: "appTier"
category: ['databases']
fullWidth: false
logoUrl: "https://newrelic.com/sites/default/files/styles/800w/public/2021-10/mongo_logo.jpg?itok=Z1PabBZB"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Mongo DB

[MongoDB](https://www.mongodb.com/) is a developer data platform that quickly builds applications with optimal performance and scalability. It provides data distribution and mobility across multiple cloud environments. In addition, this multi-cloud database service provides you with resilience, data privacy, and security.

# Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

# Add MongoDB to App Profile

You can use the following steps to learn how to add MongoDB to your app profile.

1. Log in to [Palette](console.spectrocloud.com).


2. On the right side of the window, click the **User Menu** to expand it and select **Switch to App Mode**.


3. From the **Main Menu** click **App Profiles** to create a new profile. Check out the [Create an App Profile](/devx/app-profile/create-app-profile/) guide to learn how. Provide the following basic information and click **Next**.

|         **Parameter**   | **Description**  |
|-------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile.|
|Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)           | Assign tags to the app profile.|
 
 
4. Select **MongoDB** from the database services and start the configuration.
  

5. Provide the following information to the wizard:
  * **Name:** The DB name. You can have the default Palette generated name or create a custom name. 
  * **Username:** The user name for database access control
  * **Password:** The password for the username.

<InfoBox>
You can use the default system-generated password. If you use the default password, you can retrieve it from the MongoDB secrets using the following command:

```
kubectl get secrets -A
```

If you use a custom password, use the [base 64 encoder](https://www.base64encode.org/) to generate an encoded password and add it to the basic information wizard.
</InfoBox>

  * **Database Volume Size (GiB):** Select the volume size for the database. Ensure you stay within the storage amount available in the cluster group and virtual clusters.  

  * **Version: **Select the version from the **Version** drop-down. The following are the Palette supported MongoDB versions:

    * 4.4.14
    * 5.0.10

6. **Output Variables**: The exposed output variables of this service layer that may be used in other service layers. These output variables are typically used for connectivity purposes.
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

|**Output Variable**|**Description**|
|---------------|-----------|
|Username|Username for database access control.|
|Password|Password for database access control.|
|Mongo URI|Represents the Uniform Resource Identifier for connecting to mongodb instance from applications and clients.|
|Mongo URI SRV|Represents the DNS seed list connection format. The SRV indicates to the client that the host name that follows corresponds to a DNS SRV record.|

# Validation

* To validate your database service in App Profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click the **App Profile Name** to see the service layers.


* To validate that your database service is in the app profile, navigate to the **App Profiles** page, where all your app profiles are listed. Click on the app profile you wish to review the service layers. The following screen displays the different service layers that make up the app profile. Ensure MongoDB is an available service layer.


|**Color Code**| **Description**|
|--------------|--------------|
|Green|Successfully Deployed|
|Blue |Under Deployment|
|Red  |Error State|







