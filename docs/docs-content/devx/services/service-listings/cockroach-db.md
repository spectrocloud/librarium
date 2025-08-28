---
sidebar_label: "CockroachDB"
title: "CockroachDB"
description: "Learn how to use CockroachDB with Palette Dev Engine."
hide_table_of_contents: false
type: "appTier"
category: ["databases"]
hiddenFromNav: false
sidebar_position: 50
logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Cockroach_Labs_Logo.png/220px-Cockroach_Labs_Logo.png"
tags: ["devx", "app mode", "pde", "databases"]
---

CockroachDB is a [distributed SQL database](https://www.cockroachlabs.com/blog/what-is-distributed-sql/) designed for
cloud-native environments. CockroachDB provides a reliable and scalable solution for managing data across multiple nodes
and regions. Its architecture automates data replication, sharding, and rebalancing, By simplifying operational tasks,
Cockroach enables developers to concentrate on building their applications.

With a focus on strong consistency and horizontal scalability, CockroachDB supports fast transactions and real-time data
insights. Its fault-tolerant and self-healing capabilities help reduce downtime and ensure data accuracy. As a result,
CockroachDB offers a stable and efficient database solution for developers looking to build robust applications in
today's demanding digital landscape.

## Deploy CockroachDB

Palette users can deploy CockroachDB to a virtual cluster by using the following steps.

### Prerequisite

- A Virtual Cluster with the following minimum resources.
  - 8 CPU
  - 8 GB of Memory
  - 8 GB of Storage.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the right side of the window, click on the **User Menu** and select **Switch to App Mode**.

3. Navigate to the left **Main Menu** and click on **App Profiles** to create a new app profile. Review
   [Create an App Profile](../../../profiles/app-profiles/create-app-profiles/create-app-profiles.md). Provide the
   following basic information and click **Next**.

| Parameter                | Description                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Application Profile Name | A custom name for the app profile.                                                                                       |
| Version (optional)       | The default value is 1.0.0. You can create multiple versions of an app profile using the format **`major.minor.patch`**. |
| Description (optional)   | Description of the app profile.                                                                                          |
| Tag (optional)           | Assign tags to the app profile.                                                                                          |

4. Select the **CockroachDB** service and start the configuration.

5. Provide the following information to the wizard:

- **Name**: The application name.

- **Username**: The user name for database access control.

- **dbPassword**: Security password for the DB service.

- **Database Name**: The name of the database to target.

- **PersistentVolumeClaim Size (GiB)**: Select the volume according to the storage volume available in the cluster group
  and virtual clusters. Ensure you do not exceed the maximum storage size for your virtual cluster.

6. Save your changes.

7. Deploy the app profile to a Palette Virtual Cluster. Use the
   [Deploy a Virtual Cluster](../../../clusters/palette-virtual-clusters/deploy-virtual-cluster.md#deploy-a-virtual-cluster)
   guide for additional guidance or check out the
   [Deploy an Application using Palette Dev Engine](../../../tutorials/pde/deploy-app.md) tutorial.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and select **Apps**.

3. Select the application that contains CockroachDB.

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

| Parameter              | Output Variable                                                                             | Description                                       |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Database Username      | `{{.spectro.app.$appDeploymentName.database-<service-name>.COCKROACHDBMSTR_USERNAME}}`      | The database user name.                           |
| Database User Password | `{{.spectro.app.$appDeploymentName.database-<service-name>.COCKROACHDBMSTR_PASSWORD}}`      | The password of the database user name.           |
| Database Name          | `{{.spectro.app.$appDeploymentName.<service-name>.COCKROACHDBMSTR_DB_NAME}}`                | The name of the database.                         |
| Service Hostname       | `{{.spectro.app.$appDeploymentName.database-<service-name>.COCKROACHDBMSTR_SVC}}`           | The Kubernetes service hostname for the database. |
| Service Port           | `{{.spectro.app.$appDeploymentName.database-<service-name>.COCKROACHDBMSTR_SVC_PORT}}`      | The exposed ports for the database service.       |
| Service Namespace      | `{{.spectro.app.$appDeploymentName.database-<service-name>.COCKROACHDBMSTR_SVC_NAMESPACE}}` | The namespace of the service.                     |

## Database Password

You can get the database secret by reading the content of the Kubernetes secret created for the database user. To
retrieve the password for the Redis database, use the following command format.

<br />

```shell
kubectl get secret <app-name>-<service-name>-user \
 --namespace <app-name>-<service-name>-ns --output jsonpath='{.data.password}' | base64 --decode
```

Replace the values with the respective names.

- app-name: represents the name of the app provided during the app creation process.
- service-name: The name of the service layer in the app profile.

### Example

- App Name: `app-tion-medon`

- Service Name: `cockroachdb-1`

```shell
kubectl get secret  app-tion-medon-cockroachdb-1-user \
 --namespace app-tion-medon-cockroachdb-1-ns --output jsonpath='{.data.password}' | base64 --decode
```

Output:

```shell
.Hr1}%DrA2MFf
```

## Next Steps

To learn more about developing with CockroachDB, check out the
[CockroachDB Developer Guide](https://www.cockroachlabs.com/docs/stable/developer-guide-overview.html). The developer
guide is a great resource for understanding how to get started with CockroachDB and build applications that are
scalable, resilient, and secure.

## Resources

- [CockroachDB Official Documentation](https://www.cockroachlabs.com/docs/)

- [Developer Guide](https://www.cockroachlabs.com/docs/stable/developer-guide-overview.html)
