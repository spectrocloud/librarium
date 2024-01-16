---
sidebar_label: "Namespace Management"
title: "Namespace Management"
description: "Learn how to create and delete a namespace and assign resource quotas."
hide_table_of_contents: false
sidebar_position: 120
tags: ["clusters", "cluster management"]
---

In Kubernetes, namespaces provide a way to isolate groups of resources within a single cluster. Some of the benefits of namespaces are:

<br />

- They can be used to partition resources among multiple users via resource quota – where each namespace has its own set of resources – without having to set up multiple physical clusters.

- You can configure Role-Based Access Control (RBAC) based on namespaces. For information about configuring namespaces and RBAC, check out [RBAC and NS Support](cluster-rbac).

- Namespaces can be used for different purposes such as testing, development, and production.

- You can use namespaces to help prevent resource naming conflicts. Resource names must be unique within a namespace but not across namespaces.

- In environments that have hybrid containerized and virtualized applications, a separate namespace can be used to isolate virtual machines (VMs). For information about a VM environment in Palette, check out [Virtual Machine Management](../../vm-management/vm-management.md).

## Create a Namespace

The following steps will guide you on how to create a namespace.

### Prerequisites

- An active cluster.

- Permission to create a namespace.

- A unique namespace name.

### Create a Namespace in a Cluster

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the cluster in which you want to create a namespace.

4. Navigate to the **Workloads** > **Namespaces** tab, and click the **Manage Namespaces** button.

   <br />

   The **Settings** pane displays with **RBAC** preselected and the **Namespaces** tab opened by default.

   ![Cluster Settings pane with three arrows that point respectively to Namespace Name field, Add to List button, and the location where the namespace is listed](/clusters_cluster-management_namespace-create.png)

5. Type a unique namespace name in the **Namespace name or Regex** field and click **Add to List** at right.

6. You can assign resource quotas now or at a later time. To learn how, check out [Assign Resource Quotas](namespace-management.md#assign-resource-quotas).

   <br />

   For details on how to configure RBAC for namespaces, check out the [RBAC and NS Support](cluster-rbac.md#palette-roles-and-kubernetes-roles) guide.

### Validate

Validate that the namespace was successfully created.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the cluster that contains the namespace you created and view its details.

4. In the **Settings** pane, click **RBAC** > **Namespaces** tab.

   <br />

   The namespace you created will be listed under **Workspace Quota**.

## Assign Resource Quotas

You can assign resource quotas for resource sharing among multiple users who have access to a namespace.

### Prerequisites

- A running cluster with at least one namespace.

### Assign Resource Quotas to a Namespace

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the cluster with the namespace to which you will assign workspace quotas.

4. Navigate to the **Workloads** > **Namespaces** tab, and click the **Manage Namespaces** button.

5. The **Settings** pane displays with **RBAC** > **Namespaces** preselected.

6. Select the namespace listed in the **Workspace Quota** section.

![Cluster Settings pane displaying Workspace Quota section of Namespaces tab](/clusters_cluster-management_ns-resource-quota.png)

<br />

7. Type the number of CPU and Memory to allocate to the namespace, and save your changes.

## Delete a Namespace

When you delete a namespace, all the resources that were created within the namespace will also be deleted, such as pods, services and endpoints, config maps, and more.

### Prerequisites

- Ensure that no other resources depend on the namespace being deleted.

### Delete a Namespace from a Cluster

1. Navigate to the left **Main Menu** and click on **Clusters**.

2. Select the cluster in which you want to create a namespace.

3. Navigate to the **Workloads** > **Namespaces** tab, and click the **Manage Namespaces** button. The **Settings** pane displays with **RBAC** preselected and the **Namespaces** tab opened by default.

4. Select the namespace you want to delete, which is listed in the **Workspace Quota** section, and click the trash can icon.

### Validate

Validate that the namespace was successfully deleted.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the cluster that contains the namespace you want to delete and view its details.

4. In the **Settings** pane, click **RBAC** > **Namespaces** tab.

The namespace you created is no longer listed under **Workspace Quota**.
