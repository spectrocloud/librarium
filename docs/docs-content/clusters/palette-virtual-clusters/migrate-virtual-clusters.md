---
sidebar_label: "Migrate Virtual Cluster Workloads"
title: "Migrate Virtual Cluster Workloads"
description: "Learn how to migrate workloads from one virtual cluster to another and delete legacy clusters."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster groups", "virtual clusters"]
---

It is sometimes necessary to migrate workloads from one virtual cluster to another. For instance, if a virtual cluster
cannot be upgraded, migrating its workloads becomes the only option. This guide provides high-level steps to help you
migrate workloads between virtual clusters and delete legacy virtual clusters. The steps in Palette need to be performed
in [cluster mode](../../introduction/palette-modes.md).

## Migrate Workloads to New Virtual Cluster

### Prerequisites

- Access to your legacy and new virtual clusters through [kubectl](https://kubernetes.io/docs/reference/kubectl/).

- The [**Virtual Cluster Admin**](../../user-management/palette-rbac/project-scope-roles-permissions.md#virtual-cluster)
  role in Palette.

- The necessary prerequisites to create a new cluster group to host the virtual clusters. Refer to
  [Create and Manage Cluster Groups - Prerequisites](../cluster-groups/create-cluster-group.md#prerequisites) for
  guidance.

### Migrate Workloads

This guide covers a common method of migrating workloads between clusters, which is a manual export and import of YAML
manifests.

:::warning

The following steps may not cover all use-cases. Ensure you adjust them to your environment and needs.

:::

1. Identify all resources on your virtual clusters that need to be migrated. Typical resources include the following:

   - Deployments, StatefulSets, DaemonSets, or other workload controllers
   - Services
   - ConfigMaps
   - Secrets
   - Ingress objects
   - PersistentVolumeClaims and associated PersistentVolumes, if needed
   - Role-Based Access Control (RBAC) resources, such as Roles, RoleBindings, ClusterRoles, and ClusterRoleBindings
   - Custom Resource Definitions (CRDs) and their instances

2. Export the resources from legacy virtual clusters using `kubectl`.

   ```shell hideClipboard title="Service export example"
   kubectl get service my-app-service \
     --namespace my-namespace \
     --output yaml > my-app-service.yaml
   ```

3. Remove any cluster-specific fields from the exported YAML files, such as `resourceVersion`, `uid`,
   `creationTimestamp`, or `managedFields`. Also ensure to remove any `status` fields or
   [finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) in the exported YAML
   files, if they appear. This will prevent conflicts in the new cluster.

4. In the exported YAML files, update references to external resources, such as a specific PersistentVolume name or
   private registry secrets. For example, if your YAML references a PersistentVolume named `pv-old-cluster` in the old
   namespace, rename it to `pv-new-cluster` in the new namespace before deployment.

   Also ensure that `metadata.namespace` points to the expected target namespace in the new virtual cluster.

5. Log in to [Palette](https://console.spectrocloud.com).

6. [Create a new cluster group](../cluster-groups/create-cluster-group.md) for the new virtual clusters. You can use the
   same host clusters that are used for your legacy virtual clusters or select different ones.

   :::warning

   If using the same host clusters for your new cluster group, ensure there are enough resources for both the legacy and
   new virtual clusters to claim.

   :::

7. [Deploy new virtual clusters](./deploy-virtual-cluster.md) to your new cluster group. These will replace your legacy
   clusters so it is advisable to set the same amount of maximum resources to each new virtual cluster.

8. Apply your YAML manifests to each new virtual cluster using `kubectl`.

   For example, create the namespace for the resource on the new cluster if it does not exist.

   ```shell hideClipboard title="Example namespace creation"
   kubectl create namespace my-namespace
   ```

   ```shell hideClipboard title="Example output"
   namespace/my-namespace created
   ```

   Then, import the YAML manifest to the new cluster.

   ```shell hideClipboard title="Service import example"
   kubectl apply --filename my-app-service.yaml
   ```

   ```shell hideClipboard title="Example output"
   service/my-app-service created
   ```

9. Migrate any persistent data to the storage accessible to the new virtual clusters, if required.

   For example, you can use a tool like `rsync` to copy data from your old storage path to your new storage path.

   ```shell hideClipboard title="Rsync copy example"
   rsync \
     --archive \                  # Ensures that symbolic links, file permissions, user & group ownerships, and timestamps are preserved
     --verbose \                  # Prints detailed information about the transfer
     --compress \                 # Compress file data during the transfer to reduce network usage
     --human-readable \           # Outputs file sizes in a more readable format (e.g., 1K, 24M, 2G)
     --progress \                 # Shows progress during file transfer (percentages, estimated time, etc.)
     --rsh="ssh -i /path/to/key"  # Optional: Use a custom SSH key for authentication; remove if not required
     /path/on/oldserver/ \
     user@newserver.example.com:/path/on/newserver/
   ```

10. If needed, adjust your DNS records to point at the new ingress or load balancer IPs of the new virtual clusters.

    For example, if using a `CNAME` record for a load balancer, log in to your DNS management console and update the
    target for the `CNAME` record.

11. Modify any application and CI/CD pipelines to point at the new virtual clusters.

### Validate

1. Check that your deployments and pods are active on new virtual clusters using `kubectl`.

   ```bash hideClipboard title="Example command to check status of Deployments in a namespace"
   kubectl get deployments --namespace my-namespace
   ```

   ```bash hideClipboard title="Example command to check status of Pods in a namespace"
   kubectl get pods --namespace my-namespace
   ```

2. Verify that the outputs are satisfactory, for example:

   - Pods should display a `Running` or `Ready` state.

   - Services should display a `ClusterIP`, `ExternalIP`, `LoadBalancer`, or `Ingress`, depending on the type of
     Service.

3. If you’re using an Ingress, verify that the Ingress Controller is correctly routing traffic. For example, use the
   following command to check that the Ingress controller has assigned an external IP or hostname and is processing the
   rules you configured.

   Replace `<appIngress>` with your Ingress name and `<namespace>` with the namespace for your Ingress on the cluster.

   ```bash
   kubectl describe ingress <appIngress> --namespace <namespace>
   ```

   ```shell hideClipboard title="Example output"
   Name:             my-app-ingress
   Namespace:        my-namespace
   Address:          203.0.113.10
   Default backend:  <default>
   Rules:
     Host                 Path  Backends
     ----                 ----  --------
     example.com
                          /     my-app-service:80 (10.44.0.2:8080,10.44.0.3:8080)
   Annotations:
     kubernetes.io/ingress.class: nginx
     nginx.ingress.kubernetes.io/rewrite-target: /
   Events:
     Type    Reason             Age               From                      Message
     ----    ------             ----              ----                      -------
     Normal  CreateCertificate  1m                cert-manager-controller   Successfully created Certificate "my-app-tls"
     Normal  IPAllocated        1m                nginx-ingress-controller  Assigned IP or LB address
     Normal  UpdateIngress      50s (x2 over 1m)  nginx-ingress-controller  Ingress my-app-ingress configuration updated
   ```

## Delete Legacy Virtual Clusters

If all workloads have been fully migrated to a new virtual cluster, or your virtual cluster is no longer required, use
the steps in this section to delete your legacy clusters.

### Prerequisites

- The [**Virtual Cluster Admin**](../../user-management/palette-rbac/project-scope-roles-permissions.md#virtual-cluster)
  role in Palette.

### Delete Clusters

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left main menu, select **Clusters** and click on the **Virtual Clusters** tab.

3. Locate and click on the virtual cluster that you want to delete.

4. Click on the **Settings** drop-down menu and select **Delete Cluster**.

5. Enter the cluster name and click **OK**. The cluster status will change to **Deleting**.

   Wait for the virtual cluster resources to be deleted. This may take up to 10 minutes.

6. If you have deleted all virtual clusters in a cluster group, you can then
   [delete your cluster group](../cluster-groups/create-cluster-group.md#delete-your-cluster-group).

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left main menu, select **Clusters** and click on the **Virtual Clusters** tab.

3. Check that your virtual clusters are no longer displayed. You can also click the **Show Deleted** checkbox to show
   deleted virtual clusters.

4. If you deleted your cluster group, navigate to the left main menu and select **Cluster Groups**.

   Your legacy cluster group is no longer displayed.
