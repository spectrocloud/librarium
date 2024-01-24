---
sidebar_label: "Postgres"
title: "Postgres"
description: "Palette Dev Engine Postgres Service"
hide_table_of_contents: false
type: "appTier"
category: ["databases"]
sidebar_position: 20
logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg"
tags: ["devx", "app mode", "pde", "databases"]
---

Palette supports [Postgres](https://www.postgresql.org/) as a database service. Postgres is a powerful open-source
object-relational database system with over 35 years of active deployment with a strong reputation for reliability,
feature robustness, and performance. Postgres uses and extends the SQL language combined with many features that safely
store and scale the most complicated data workloads.

<br />

## Prerequisites

The following are the requirements for using Postgres in Palette:

- Do not use the Postgres user names `postgres` and `admin`. These user names are reserved for internal system
  operations and will cause internal conflicts.

- The user name format does not support the special character hyphen(-). For example, `name-1` is not supported.

- Clients must set `sslMode=require` or a stricter setting, as the server instance requires encryption for all
  connections. Review the [Postgres SSL documentation](https://www.postgresql.org/docs/current/libpq-ssl.html) to learn
  more about the SSL modes.

## Add Postgres to an App Profile

You can use the following steps to learn how to add Postgres to your app profile.

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the right side of the window, click the **User Menu** to expand it and select **Switch to App Mode**.

3. Navigate to the left **Main Menu** and click on **App Profiles** to create a new
   [app profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md). Provide the following basic
   information and click **Next**.

| **Parameter**            | **Description**                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Application Profile Name | A custom name for the App Profile.                                                                                       |
| Version (optional)       | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**. |
| Description (optional)   | Description of the app profile.                                                                                          |
| Tag (optional)           | Assign tags to the app profile.                                                                                          |

4. Select **Postgres** from the database services and start the configuration.

5. Provide the following information to the wizard:

- **Name:** The database service name. You can use the auto-generated name or create a custom name.

- **Username:** The user name for database access control.

- **Password:** Security password for the DB service.

:::info

You can use the default system-generated password. If the default password is used, it can be retrieved from the
Postgres secret that is created for the password. Review the
[Database Password](../../services/service-listings/postgresql-db.md#database-password) section for guidance.

:::

- **Database Volume Size (GiB):** Select the volume size for the database. Ensure you stay within the storage amount
  available in the cluster group and virtual clusters.

- **Version: **Select the version from the **Version** **drop-down Menu**.

6. Save your changes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Apps**.

3. Select the application that contains Postgres.

4. Validate your application is displaying the green status. The color code in the app profile box shows the status of
   the service deployment.

| **Color Code** | **Description**       |
| -------------- | --------------------- |
| Green          | Successfully Deployed |
| Blue           | Under Deployment      |
| Red            | Error State           |

## Output Variables

The exposed output variables of this service layer may be used in other service layers. These output variables are
typically used for connectivity purposes:

| Parameter              | Output Variable                                                                     | Description                                       |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| Database Username      | `{{.spectro.app.$appDeploymentName.database-<service-name>.USERNAME}}`              | The database user name.                           |
| Database User Password | `{{.spectro.app.$appDeploymentName.database-<service-name>.PASSWORD}}`              | The password of the database user name.           |
| Service Hostname       | `{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC}}`      | The Kubernetes service hostname for the database. |
| Service Port           | `{{.spectro.app.$appDeploymentName.database-<service-name>.POSTGRESMSTR_SVC_PORT}}` | The exposed ports for the database service.       |

## Database Password

You can get the database password by reading the content of the Kubernetes secret created for the database user. To
retrieve the password for the Postgres database user, use the following command format.

```shell
kubectl get secret <app-name>-<service-name>-postgres-<user-name>-credentials \
 --namespace <app-name>-<service-name>-ns --output jsonpath='{.data.password}' | base64 --decode
```

Replace the values with the respective names.

- app-name: represents the name of the app provided during the app creation process.
- service-name: The name of the service layer in the app profile.
- user-name: The name of the database user.

#### Example

- App Name: `app-tarfful`

- Service Name: `postgresql-3`

- Database User: `pguser`

```shell
kubectl get secret app-tarfful-postgresql-3-postgres-pguser-credentials \
 --namespace app-tarfful-postgresql-3-ns --output jsonpath='{.data.password}' | base64 --decode
```

#### Output

```shell hideClipnoard
zFniawyxEVdFtSF9uPfDsjFlOnAeDcrpndi3ReaUbqSGTMSnZ1gawSWkJCLabZR9
```

## Next Steps

Add Postgres to your application profile and explore all the capabilities Postgres has to offer. The official Postgres
documentation has several [tutorials](https://www.postgresql.org/docs/online-resources/) to help you learn more about
Postgres and how to leverage Postgres with your applications.

## Resources

- [Postgres Documentation](https://www.postgresql.org/docs/)

- [Community Postgres Tutorials](https://www.postgresqltutorial.com/)

- [Postgres Tutorials](https://www.postgresql.org/docs/online-resources/)

- [Postgres SSL documentation](https://www.postgresql.org/docs/current/libpq-ssl.html)
