---
sidebar_label: "MySQL"
title: "MySQL"
description: "Palette Dev Engine MySQL Service"
hide_table_of_contents: false
type: "appTier"
category: ['databases']
sidebar_position: 10
logoUrl: "https://registry.dev.spectrocloud.com/v1/mysql-operator/blobs/sha256:2d59bc428916752528280eac03330d712164163e2f3c476409f5c25d8a7c2778?type=image/png"
tags: ["devx", "app mode", "pde", "databases"]
---


[MySQL](https://www.mysql.com/) is an open-source relational database management system commonly used in web applications and other software that requires a database. It is known for its reliability, ease of use, and flexibility. MySQL is covered under the GNU license and uses structured query language (SQL) to manage data with the following properties:

* Creates a database for storing and manipulating data and defining the relationship of each table.


* Clients can retrieve and manipulate data by creating SQL queries and submitting them to the MySQL instance.


# Add MySQL to App Profile

Use the following steps to add MySQL to an app profile.

<br />

## Prerequisite

- Access to Palette Dev Engine.

<br />

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).


2. On the right side of the window, click on the **User Menu**, then select **Switch to App Mode**.


3. Navigate to the left **Main Menu** and click **App Profiles** to create a new [app profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md). Provide the following basic information and click **Next**.

|    **Parameter**            | **Description** |
|-----------------------------|-----------------|
|Application Profile Name     | A custom name for the app profile.|
|Version (optional)           | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.|
|Description (optional)       | Description of the app profile.| 
|Tag (optional)               | Assign tags to the app profile.|
 

4. Select **MySQL** from the database services and start the configuration.
  

5. Provide the following information to the wizard:
  * **Name:** The database name. You can use the auto-generated name or create a custom name.
  * **Root Password:** The root password for the database service.

  * Database Volume Size (GiB): Select the volume size for the database. Ensure you stay within the storage amount available in the cluster group and virtual clusters.

  * Select the version from the **Version** drop-down menu.

6. Click on **Save Changes**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.


2. Navigate to the left **Main Menu** and select **Apps**.



3. Select the application that contains MySQL.



4. Validate your application is displaying the green status. The color code in the app profile box shows the status of the service deployment.

|**Color Code**| **Description**|
|--------------|--------------|
|Green| Successfully Deployed|
|Blue | Under Deployment|
|Red  | Error State|


## Output Variables

The exposed output variables of this service layer may be used in other service layers. These output variables are typically used for connectivity purposes:

| Parameter              | Output Variable                                                                     | Description                                     |
|------------------------|-------------------------------------------------------------------------------------|-------------------------------------------------|
| Database Root Password | `{{.spectro.app.$appDeploymentName.<service-name>.ROOT_PASSWORD}}`              | The root password of the MySQL database. |
| Service Hostname       | `{{.spectro.app.$appDeploymentName.<service-name>.MYSQLMSTR_SVC}}`      | The Kubernetes service hostname for the database.                |
| Service Port           | `{{.spectro.app.$appDeploymentName.<service-name>.MYSQLMSTR_SVC_PORT}}` | The exposed ports for the database service.              |
| Namespace           | `{{.spectro.app.$appDeploymentName.<service-name>.MYSQLMSTR_SVC_NAMESPACE}}` | The Kubernetes namespace the MySQL database is deployed to.              |



## Database Password

You can get the database password by reading the content of the Kubernetes secret created for the database. To retrieve the password for the MySQL database root user, use the following command format. 

```shell
kubectl get secret <app-name>-<service-name>-user \
 --namespace <app name>-<service name>-ns --output jsonpath='{.data.ROOT_PASSWORD}' | base64 --decode
```

Replace the values with the respective names.

  * app-name: represents the name of the app provided during the app creation process.
  * service-name: The name of the service layer in the app profile.

#### Example 

- App Name: `app-tarfful`

- Service Name: `mysql-2`


```shell
kubectl get secret app-tarfful-mysql-2-user \
 --namespace app-tarfful-mysql-2-ns --output jsonpath='{.data.ROOT_PASSWORD}' | base64 --decode
```
#### Output
```shell hideClipboard
,U31nQ@T2tN4uM
```

## Next Steps

You can add MySQL to your application profile and start integrating MySQL with your applications. To learn more about integrating MySQL with your applications, check out the [MySQL](https://redis.io/docs/manual/) documentation from Oracle.



## Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)


- [MySQL Tutorial](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html)