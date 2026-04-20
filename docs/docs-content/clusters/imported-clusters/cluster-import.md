---
sidebar_label: "Import a Cluster"
title: "Import a Cluster"
description: "Learn how to import clusters and which Palette operations you can use to manage them."
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "imported clusters"]
---

When importing a cluster into Palette, you can select the mode you want Palette to use when managing the cluster. You
can choose between **Read-only mode** or **Full Permissions mode**. Refer to
[Imported Clusters](imported-clusters.md#import-modes) to learn more about each mode.

## Full Permissions Mode

Full Permission mode grants the Palette agent broad Role-Based Access Control (RBAC) access to your cluster. This
enables Day-2 operations such as deploying add-on profiles, configuring RBAC bindings and namespaces, running compliance
scans, and scheduling backups. The agent also automatically installs a metrics server if one is not already present on
the cluster.

### Prerequisites

- Your imported cluster must meet the following requirements:

  - Use Kubernetes version 1.19.x or later.
  - Have network access to Palette SaaS or your self-hosted Palette instance.
  - Have `admin` or `cluster-admin` permissions.

- Your local workstation must have [kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured to access
  your imported cluster.

### Import a Cluster

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Choose **Import Cluster**.

4. On the **Import Cluster** page, complete the following information as applicable. The fields vary depending on the
   **Cloud Type** selected.

   | **Field**                           | **Description**                                                                                                                                                                                                                                                                                                    | **Cloud Type** |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
   | **Cluster Name**                    | Enter a unique display name for the cluster you want to import.                                                                                                                                                                                                                                                    | All            |
   | **Cloud Type**                      | Select the infrastructure environment your cluster resides in. Supported options include **AWS IaaS**, **Azure IaaS**, **GCP IaaS**, and **Generic**. Select **Generic** for all other environments. Refer to [Imported Clusters](./imported-clusters.md#supported-infrastructure-providers) for more information. | All            |
   | **Proxy (Optional)**                | Specify a network proxy address or DNS value.                                                                                                                                                                                                                                                                      | Generic        |
   | **No Proxy (Optional)**             | Specify a no proxy address or DNS value.                                                                                                                                                                                                                                                                           | Generic        |
   | **Host Path (Optional)**            | Specify the Certificate Authority (CA) file path on the physical host machine where the CA file is stored.                                                                                                                                                                                                         | All            |
   | **Container Mount Path (Optional)** | Specify the container path where the CA file is mounted in the container.                                                                                                                                                                                                                                          | All            |

5. Select **Full Permission mode**, then **Create & Open Cluster Instance** to start the import.

6. You are redirected to the imported cluster's **Overview** tab. A set of instructions with commands is displayed on
   the drawer. You must issue the following commands to complete the import process.

   ![A view of the cluster details page with the sidebar instructions box](/clusters_imported-clusters_full-permissions-instructions.webp)

7. To install the Palette agent, run the command displayed in the drawer against the Kubernetes cluster you want to
   import. The command is customized for your cluster, as it contains the assigned cluster ID.

   ```hideClipboard shell title="Example command"
   kubectl apply --filename https://api.spectrocloud.com/v1/spectroclusters/6491d4a94c39ad82d3cc30ae/import/manifest
   ```

   ```hideClipboard shell title="Example output"
   namespace/cluster-69e66411d312edbed1f9c00d created
   serviceaccount/cluster-management-agent created
   clusterrole.rbac.authorization.k8s.io/read-only-mode created
   clusterrolebinding.rbac.authorization.k8s.io/read-only-mode created
   configmap/log-parser-config created
   configmap/upgrade-info-5tgb8c4chb created
   configmap/version-info-5hkbtbgh44 created
   priorityclass.scheduling.k8s.io/spectro-cluster-critical created
   deployment.apps/cluster-management-agent-lite created
   configmap/cluster-info created
   configmap/hubble-info created
   secret/hubble-secrets created
   ```

   :::info

   The Palette agent requires a metrics server that implements the Kubernetes Metrics API (`metrics.k8s.io`) to display
   resource utilization data such as CPU and memory usage. In **Full Permission mode**, the agent automatically detects
   whether a metrics server is present and installs one if none is found. If your cluster already has a metrics server,
   such as one provided by a managed Kubernetes service like EKS, GKE, or AKS, the agent uses the existing one.

   To verify if your cluster has the Kubernetes Metrics API installed, run the following command.

   ```shell
   kubectl get apiservices | grep metrics
   ```

   ```shell title="Example output" hideClipboard
    v1beta1.metrics.k8s.io              kube-system/metrics-server   True        33m
   ```

   To verify the Kubernetes Metrics API is responding, run the following command.

   ```shell
   kubectl top nodes
   ```

   ```shell title="Example output" hideClipboard
   NAME                                   CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
   import-cluster-palette-control-plane   212m         2%       1607Mi          20%
   ```

   :::

8. When the Palette agent completes initializing, the drawer disappears, and your **Cluster Status** transitions to
   **Running**. Within a few minutes, your cluster's **Health** status changes to **Healthy**.

You now have imported a cluster into Palette with full permissions.

### Validate

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. From the **Clusters** table, select your imported cluster.

4. On the cluster **Overview** tab, verify your cluster has a **Cluster Status** of **Running** and a **Health** status
   of **Healthy**.

5. It may take several minutes for metrics data to be populated. WHEN IT DOES, SCREENSHOT??????

## Read-Only Mode

Read-Only mode imports your cluster with limited RBAC permissions. The Palette agent observes the cluster and reports
health, event logs, cost, and workload data, but does not modify workloads or infrastructure. You can
[migrate to Full Permission mode](migrate-full-permissions.md) at any time.

### Prerequisites

- Your imported cluster must meet the following requirements:

  - Use Kubernetes version 1.19.x or later.
  - Have network access to Palette SaaS or your self-hosted Palette instance.

- Your local workstation must have [kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured to access
  your imported cluster.

:::info

The cluster does not require a network proxy to communicate with Palette. Network proxy configurations are not supported
in read-only mode. Use **Full Permissions mode** if you need to configure a network proxy. Refer to
[Imported Clusters](imported-clusters.md#import-modes) to learn more about each mode.

:::

### Import a Cluster

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Choose **Import Cluster**.

4. On the **Import Cluster** page, complete the following information as applicable. The fields vary depending on the
   **Cloud Type** selected.

   | **Field**                           | **Description**                                                                                                                                                                                                                                                                                                    | **Cloud Type** |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
   | **Cluster Name**                    | Enter a unique display name for the cluster you want to import.                                                                                                                                                                                                                                                    | All            |
   | **Cloud Type**                      | Select the infrastructure environment your cluster resides in. Supported options include **AWS IaaS**, **Azure IaaS**, **GCP IaaS**, and **Generic**. Select **Generic** for all other environments. Refer to [Imported Clusters](./imported-clusters.md#supported-infrastructure-providers) for more information. | All            |
   | **Proxy (Optional)**                | Specify a network proxy address or DNS value.                                                                                                                                                                                                                                                                      | Generic        |
   | **No Proxy (Optional)**             | Specify a no proxy address or DNS value.                                                                                                                                                                                                                                                                           | Generic        |
   | **Host Path (Optional)**            | Specify the Certificate Authority (CA) file path on the physical host machine where the CA file is stored.                                                                                                                                                                                                         | All            |
   | **Container Mount Path (Optional)** | Specify the container path where the CA file is mounted in the container.                                                                                                                                                                                                                                          | All            |

5. Select **Read-only mode**, then **Create & Open Cluster Instance** to start the import.

6. You are redirected to the imported cluster's **Overview** tab. A set of instructions with commands is displayed on
   the drawer. You must issue the following commands to complete the import process.

   ![A view of the cluster details page with the sidebar instructions box](/clusters_imported-clusters_read-only-instructions.webp)

7. (Optional) Palette uses a metrics server that implements the Kubernetes Metrics API (`metrics.k8s.io`) to display
   resource utilization data such as CPU and memory usage. In **Read-only mode**, the agent does not have permission to
   install a metrics server automatically. If your cluster does not already have a metrics server, such as one provided
   by a managed Kubernetes service like EKS, GKE, or AKS, you can install one manually. Any implementation that serves
   the Kubernetes Metrics API is compatible.

   To verify if your cluster has the Kubernetes Metrics API installed, run the following command.

   ```shell
   kubectl get apiservices | grep metrics
   ```

   ```shell title="Example output" hideClipboard
    v1beta1.metrics.k8s.io              kube-system/metrics-server   True        33m
   ```

   To verify the Kubernetes Metrics API is responding, run the following command.

   ```shell
   kubectl top nodes
   ```

   ```shell title="Example output" hideClipboard
   NAME                                   CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
   import-cluster-palette-control-plane   212m         2%       1607Mi          20%
   ```

   If your cluster does not have a metrics server installed, you can copy the command from the drawer to install the
   Bitnami metrics-server chart or use the following command to install the Kubernetes metrics-server chart. The
   `--kubelet-insecure-tls` flag is required for clusters that use self-signed kubelet certificates, which is common for
   self-managed clusters. Managed Kubernetes services such as EKS, GKE, and AKS typically do not require this flag.

   ```shell
   helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
   helm install metrics-server metrics-server/metrics-server \
      --namespace kube-system \
      --set args='{--kubelet-insecure-tls}'
   ```

   :::warning

   Without a metrics server, Palette cannot display cluster resource metrics. Other functionality such as event logs,
   health checks, and cost data is not affected.

   :::

8. To install the Palette agent, run the command displayed in the drawer against the Kubernetes cluster you want to
   import. The command is customized for your cluster, as it contains the assigned cluster ID.

   ```hideClipboard shell
   kubectl apply --filename https://api.spectrocloud.com/v1/spectroclusters/6491d4a94c39ad82d3cc30ae/import/manifest
   ```

   ```hideClipboard shell title="Example output"
   namespace/cluster-69e680a5d312edd1d203acee created
   customresourcedefinition.apiextensions.k8s.io/awscloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/azurecloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/cloudstackcloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/clusterprofiles.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/customcloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/edgecloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/edgenativecloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/gcpcloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/maascloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/nestedcloudconfigs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/packs.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/spectroclusters.cluster.spectrocloud.com created
   customresourcedefinition.apiextensions.k8s.io/vspherecloudconfigs.cluster.spectrocloud.com created
   serviceaccount/palette-manager created
   clusterrolebinding.rbac.authorization.k8s.io/palette-lite-cluster-admin-binding created
   configmap/palette-version-info-g7bkcc8gf2 created
   priorityclass.scheduling.k8s.io/palette-spectro-cluster-critical created
   deployment.apps/palette-lite-controller-manager created
   job.batch/palette-import-presetup-job created
   serviceaccount/cluster-management-agent created
   clusterrole.rbac.authorization.k8s.io/cma-lite-cluster-least-privilege-role created
   clusterrolebinding.rbac.authorization.k8s.io/cma-lite-cluster-least-privilege-binding created
   configmap/log-parser-config created
   configmap/upgrade-info-5tgb8c4chb created
   configmap/version-info-5hkbtbgh44 created
   priorityclass.scheduling.k8s.io/spectro-cluster-critical created
   deployment.apps/cluster-management-agent-lite created
   configmap/cluster-info created
   configmap/hubble-info created
   secret/hubble-secrets created
   ```

9. When the Palette agent completes initializing, the drawer disappears, and your **Cluster Status** transitions to
   **Running**. Within a few minutes, your cluster's **Health** status changes to **Healthy**.

You now have imported a cluster into Palette in read-only mode. Keep in mind that a cluster imported in read-only mode
has limited capabilities, indicated by the disabled tabs. You can migrate to full permissions anytime by clicking
**Migrate To Full Permissions**. Refer to [Migrate to Full Permissions](migrate-full-permissions.md) for additional
guidance.

![Read-only imported cluster view](/cluster-import_read-only.webp)

### Validate

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. From the **Clusters** table, select your imported cluster.

4. On the cluster **Overview** tab, verify your cluster has a **Cluster Status** of **Running** and a **Health** status
   of **Healthy**.

## Next Steps

You can now monitor your imported cluster from the Palette UI. The cluster actions you can perform through Palette, such
as [attaching add-on profiles](attach-add-on-profile.md), depend on the [import mode](imported-clusters.md#import-modes)
selected. If you imported your cluster using read-only mode, you can increase the number of actions you can take by
[migrating to full permissions](migrate-full-permissions.md).
