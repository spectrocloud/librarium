---
sidebar_label: "Redis"
title: "Redis"
description: "Palette Dev Engine Redis Database Service"
hide_table_of_contents: false
type: "appTier"
category: ["databases"]
hiddenFromNav: false
sidebar_position: 30
logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjxG5Qb38rX39m1M2p1W4t8H70OKpRY2breg&usqp=CAU"
tags: ["devx", "app mode", "pde", "databases"]
---

[Redis](https://redis.io/docs/latest/) is an open source (BSD licensed), in-memory data structure store used as a data
cache store or database service. Redis has built-in replication, Lua scripting, least recently used eviction,
transactions, and different levels of on-disk persistence capabilities. In addition, Redis provides high availability
via Redis Sentinel and automatic partitioning with Redis Cluster.

## Add Redis to an App Profile

Use the following steps to add Redis to an app profile.

### Prerequisite

- Access to Palette Dev Engine.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com)

2. On the right side of the window, click on the **User Menu** and select **Switch to App Mode**.

3. Navigate to the left **Main Menu** and click on **App Profiles** to create a new
   [app profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md). Provide the following basic
   information and click **Next**.

   | Parameter                | Description                                                                                                              |
   | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
   | Application Profile Name | A custom name for the app profile.                                                                                       |
   | Version (optional)       | The default value is 1.0.0. You can create multiple versions of an app profile using the format **`major.minor.patch`**. |
   | Description (optional)   | Description of the app profile.                                                                                          |
   | Tag (optional)           | Assign tags to the app profile.                                                                                          |

4. Select the **Redis DB** service and start the configuration.

5. Provide the following information to the wizard:

   - **Name:** The database name.
   - **Password:** The password for the database service.
   - **Database Volume Size (GiB):** Select the volume as per the storage volume available in the cluster group and
     virtual clusters.

6. Save your changes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Apps**.

3. Select the application that contains Redis.

4. Validate your application is displaying the green status. The color code in the app profile box shows the status of
   the service deployment.

   | **Color Code** | **Description**       |
   | -------------- | --------------------- |
   | Green          | Successfully Deployed |
   | Blue           | Under Deployment      |
   | Red            | Error State           |

## Output Variables

The exposed output variables. Use these variables when connecting higher-level services with the database:

| Parameter              | Output Variable                                                         | Description                                                 |
| ---------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| Database Username      | `{{.spectro.app.$appDeploymentName.<service-name>.USERNAME}}`           | The database user name.                                     |
| Database User Password | `{{.spectro.app.$appDeploymentName.<service-name>.PASSWORD}}`           | The password of the database user name.                     |
| Service Hostname       | `{{.spectro.app.$appDeploymentName.<service-name>.REDISMSTR_SVC}}`      | The Kubernetes service hostname for the database.           |
| Service Port           | `{{.spectro.app.$appDeploymentName.<service-name>.REDISMSTR_SVC_PORT}}` | The exposed port for the database service.                  |
| Namespace              | `{{.spectro.app.$appDeploymentName.<service-name>.REDISMSTR_NS}}`       | The Kubernetes namespace the Redis database is deployed to. |

## Database Password

You can get the database secret by reading the content of the Kubernetes secret created for the database user. To
retrieve the password for the Redis database, use the following command format.

```shell
kubectl get secret <app-name>-<service-name>-redis-auth \
 --namespace <app-name>-<service-name>-ns --output jsonpath='{.data.password}' | base64 --decode
```

Replace the values with the respective names.

- app-name: represents the name of the app provided during the app creation process.
- service-name: The name of the service layer in the app profile.

#### Example

- App Name: `app-tarfful`

- Service Name: `redis-4`

```shell
kubectl get secret  app-tarfful-redis-4-redis-auth \
 --namespace app-tarfful-redis-4-ns --output jsonpath='{.data.password}' | base64 --decode
```

#### Output

```shell hideClipboard
 .Hr1}%DrA2MFf
```

## Next Steps

You can add Redis to your application profile and start integrating Redis with your applications. To learn more about
integrating Redis with your applications, check out the [Using Redis](https://redis.io/docs/latest/) documentation from
Redis.

## Resources

- [Using Redis](https://redis.io/docs/latest/)
