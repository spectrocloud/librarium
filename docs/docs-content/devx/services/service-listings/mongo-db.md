---
sidebar_label: "MongoDB"
title: "MongoDB"
description: "Palette Dev Engine MongoDB Service"
hide_table_of_contents: false
type: "appTier"
category: ["databases"]
sidebar_position: 0
logoUrl: "https://newrelic.com/sites/default/files/styles/800w/public/2021-10/mongo_logo.jpg?itok=Z1PabBZB"
tags: ["devx", "app mode", "pde", "databases"]
---

[MongoDB](https://www.mongodb.com/) is a developer data platform that quickly builds applications with optimal
performance and scalability. It provides data distribution and mobility across multiple cloud environments. In addition,
this multi-cloud database service provides you with resilience, data privacy, and security.

## Add MongoDB to an App Profile

Use the following steps to add MongoDB to an app profile.

<br />

### Prerequisite

A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

<br />

### Enablement

You can use the following steps to learn how to add MongoDB to your app profile.

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the right side of the window, click the **User Menu** to expand it and select **Switch to App Mode**.

3. From the **Main Menu** click **App Profiles** to create a new profile. Check out the
   [Create an App Profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md) guide to learn
   about different app profile types and how to create them. Provide the following basic information and click **Next**.

| **Parameter**            | **Description**                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Application Profile Name | A custom name for the App Profile.                                                                                       |
| Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**. |
| Description (optional)   | Description of the App Profile.                                                                                          |
| Tag (optional)           | Assign tags to the app profile.                                                                                          |

4. Select **MongoDB** from the database services and start the configuration.

5. Provide the following information to the wizard:

- **Name:** The DB name. You can use the default Palette-generated name or create a custom name.
- **Username:** The user name for database access control.
- **Password:** The password for the username.
- **Database Volume Size:** Select the volume size for the database. Ensure you stay within the storage amount available
  in the cluster group and virtual clusters.

- **Version:** Select the version from the **Version** drop-down.

6. Click **Save Changes**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Apps**.

3. Select the application that contains MongoDB.

4. Validate your application is displaying the green status. The color code in the app profile box shows the status of
   the service deployment.

| **Color Code** | **Description**       |
| -------------- | --------------------- |
| Green          | Successfully Deployed |
| Blue           | Under Deployment      |
| Red            | Error State           |

## Output Variables

The exposed output variables of this service layer may be used in other service layers. These output variables are
typically used for connectivity purposes.

| Parameter              | Output Variable                                                    | Description                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Database Username      | `{{.spectro.app.$appDeploymentName.<service-name>.USERNAME}}`      | The database user name.                                                                                                                                                                    |
| Database User Password | `{{.spectro.app.$appDeploymentName.<service-name>.PASSWORD}}`      | The password of the database user name.                                                                                                                                                    |
| Connection String      | `{{.spectro.app.$appDeploymentName.<service-name>.MONGO_URI}}`     | The MongoDB connection string that contains the Kubernetes service hostname of the database. The connection string is prefixed with `mongodb://`                                           |
| DNS Seed               | `{{.spectro.app.$appDeploymentName.<service-name>.MONGO_URI_SRV}}` | Represents the MongoDB DNS seed list connection format. The SRV indicates to the client that the host name that follows corresponds to a DNS SRV record. Contains the prefix `mongodb+srv` |

## Database Password

You can get the database password by reading the content of the Kubernetes secret created for the database user. To
retrieve the password for the MongoDB database user, use the following command format.

```shell
kubectl get secret <app-name>-<service-name>-<user-name> \
 --namespace <app-name>-<service-name>-ns --output jsonpath='{.data.password}' | base64 --decode
```

Replace the values with the respective names.

- app-name: represents the name of the app provided during the Palette app creation process.
- service-name: The name of the service layer in the app profile.
- user-name: The name of the database user.

### Example:

- App Name: `app-tarfful`

- Service Name: `mongodb-1`

- Database User: `myuser`

```shell
kubectl get secret app-tarfful-mongodb-1-myuser  \
 --namespace app-tarfful-mongodb-1-ns --output jsonpath='{.data.password}' | base64 --decode
```

#### Output:

```shell hideClipboard
.Hr1}%DrA2MFf
```

## Next Steps

Palette Dev Engine removes the traditional challenges encountered when deploying a MongoDB instance. You can add MongoDB
to your application profile and get started with MongoDB today. Check out the
[MongoDB Tutorials](https://www.mongodb.com/docs/manual/tutorial/) to learn how to integrate MongoDB with your
applications.

## Resources

- [MongoDB Documentation](https://www.mongodb.com/docs/)

- [MongoDB Tutorials](https://www.mongodb.com/docs/manual/tutorial/)

- [MongoDB Libraries](https://www.mongodb.com/docs/drivers/)
