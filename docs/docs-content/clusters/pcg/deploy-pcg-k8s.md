---
sidebar_label: "Deploy a PCG to an Existing Kubernetes Cluster"
title: "Deploy a PCG to an Existing Kubernetes Cluster"
description: "Learn how to deploy a Private Cloud Gateway (PCG) to an existing Kubernetes cluster."
hide_table_of_contents: false
sidebar_position: 30
tags: ["pcg"]
---

For infrastructure environments that the [Palette CLI](./deploy-pcg/deploy-pcg.md) does not support, you can deploy a
Private Cloud Gateway (PCG) to an existing Kubernetes cluster. The PCG can be installed on any Kubernetes cluster that
meets the [prerequisites](#prerequisites), regardless of the underlying infrastructure. For example, you can host the
PCG on an EKS cluster, a self-managed cluster on EC2, or any other cluster that is not managed by Palette.

## Supported Cloud Types

During PCG creation, you select a **Cloud type** that determines which cloud environment you can deploy workload
clusters into through the PCG, including:

- AWS

- Azure

- <TpBadge /> Nutanix

  :::info

  To select **Nutanix** as the PCG cloud type, you must
  [Register Nutanix Cloud](../data-center/nutanix/register-nutanix-cloud.md) with Palette.

  :::

## PCG Sizing

The following table provides the recommended sizing for the PCG based on the number of nodes, CPU, memory, storage, and
the maximum concurrent cluster deployments. You can continue to deploy additional clusters once the current clusters
deployment batch is complete.

We recommend using a minimum of three nodes for production environments. Single node clusters are better suited for
development and testing environments.

### Single-Node Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 1         | 4       | 4 GB       | 60 GB       | 1-3                                        |
| Medium   | 1         | 8       | 8 GB       | 100 GB      | 4-6                                        |
| Large    | 1         | 16      | 16 GB      | 120 GB      | 7-10                                       |

### High-Availability (HA) Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 3         | 4       | 4 GB       | 60 GB       | 4-6                                        |
| Medium   | 3         | 8       | 8 GB       | 100 GB      | 7-10                                       |
| Large    | 3         | 16      | 16 GB      | 120 GB      | 10-15                                      |

## Prerequisites

- An existing Kubernetes cluster that has network connectivity with Palette. The Kubernetes cluster must be able to
  connect to the internet to download the required images and packages and connect with Palette on port 443. To learn
  more about PCG network requirements, refer to the [Network Communication](./architecture.md#network-communication)
  section.

  :::warning

  Do not install the PCG in a Kubernetes cluster managed by Palette. The installation will fail due to resource naming
  conflicts.

  :::

- Sufficient permissions to deploy the PCG services in the cluster. The
  [default Kubernetes cluster roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings)
  _cluster-admin_ and _admin_ have the necessary permissions to deploy the PCG services.

- The Kubernetes cluster must have at least the following resources:

  - 4 vCPUs
  - 4 GB of memory
  - 60 GB of disk space
  - One control plane node with worker capabilities or three nodes for production environments. Refer to the
    [PCG Sizing](#pcg-sizing) section for more information.
  - A Container Network Interface (CNI) plugin installed.
  - A Container Storage Interface (CSI) plugin installed.
  - A version of Kubernetes that is compatible to your Palette version. Refer to the
    [Kubernetes Requirements](./pcg.md#kubernetes-requirements) section to find the required Kubernetes version.

- PCG IP address requirements:

  - One IP address for a single-node PCG or three IP addresses for a three-node PCG. Refer to the
    [PCG Sizing](./deploy-pcg-k8s.md#pcg-sizing) section for more information on sizing.
  - One IP address reserved for cluster repave operations.
  - One IP address for the virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com` or the domain that you have configured for a self-hosted Palette
    installation.

- (Optional) If you want Palette to display cluster metrics, ensure that the
  [metrics server](https://github.com/kubernetes-sigs/metrics-server) is installed in the cluster. You can install the
  metrics server using the following command.

  ```shell {4}
  helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
  helm upgrade --install metrics-server metrics-server/metrics-server \
   --namespace kube-system \
   --set args='{--kubelet-insecure-tls}'
  ```

  Add the line `--set args='{--kubelet-insecure-tls}'` to the command if your cluster uses self-signed Kubelet
  certificates, which is common for self-managed clusters. If you do not use the `--kubelet-insecure-tls` argument and
  you have self-signed Kubelet certificates, the metrics API server will not respond.

## Install PCG

Use the following steps to install the PCG in your existing Kubernetes cluster.

1.  Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2.  From the left main menu, select **Tenant Settings**.

3.  From the **Tenant Settings** menu, select **Private Cloud Gateways** > **Add New Private Cloud Gateway**.

4.  On the **Private Cloud Gateway installation instructions** modal window, select **Self Hosted**.

5.  Enter a **Private cloud gateway** name and use the **Cloud type** drop-down menu to select the target infrastructure
    provider.

6.  **Create** your PCG when finished. A set of instructions with commands is displayed on the drawer.

    ![View of the cluster details page with the side drawer extended that contains the kubectl commands](/deploy-pcg-k8s_kubectl-cmds-view.webp)

7.  Select **Download manifest**.

    :::info

    Once you select **Download manifest**, the cluster status transitions to **Importing**. If you close the drawer and
    later discover the download was blocked or did not complete, the drawer will not reopen. In this case, you must
    fetch the manifests using the [Palette API](/api/introduction/) endpoints `/v1/pcg/<pcg-uid>/services/jet/manifest`
    and `/v1/pcg/<pcg-uid>/services/ally/manifest`.

    :::

    <details>

    <summary>Retrieve Manifests Manually</summary>

    Replace the placeholders with the appropriate values.

    | **Parameter**        | **Description**                                                                                                                                         |
    | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `<palette-endpoint>` | The endpoint of your Palette instance.                                                                                                                  |
    | `<cluster-uid>`      | The unique ID assigned to imported cluster being used as a PCG. Found at **Tenant Settings** > **Private Cloud Gateways** > **[PCG]** > **Cluster ID**. |
    | `<pcg-uid>`          | The unique ID assigned to the PCG. Must be retrieved using the cluster UID.                                                                             |
    | `<api-key>`          | Your [Palette API Key](/user-management/authentication/api-key/create-api-key/).                                                                        |
    | `<jwt-token>`        | Your Palette [Authorization Token](/user-management/authentication/authorization-token/).                                                               |

      <Tabs>

      <TabItem label="API Key" value="api">

        1. Fetch the `<pcg-uid>` associated with the `<cluster-uid>`.

            ```bash
            curl --silent --request GET \
              "https://<palette-endpoint>/v1/overlords" \
              --header "ApiKey: <api-key>" | \
              jq -r --arg cid "<cluster-uid>" \
              '.items[] | select(.spec.spectroClusterUid == $cid) | .metadata.uid'
            ```

        2. Retrieve the Jet manifest.

            ```bash
            curl --silent --show-error --request GET \
                "https://<palette-endpoint>/v1/pcg/<pcg-uid>/services/jet/manifest" \
                --header "ApiKey: <api-key>" \
                --output "cluster-<pcg-uid>-jet-manifest.yaml"
            ```

        3. Retrieve the Ally manifest.

            ```bash
            curl --silent --show-error --request GET \
              "https://<palette-endpoint>/v1/pcg/<pcg-uid>/services/ally/manifest" \
              --header "ApiKey: <api-key>" \
              --output "cluster-<pcg-uid>-ally-manifest.yaml"
            ```

      </TabItem>

      <TabItem label="JWT Token" value="JWT">

        1. Fetch the `<pcg-uid>` associated with the `<cluster-uid>`.

            ```bash
            curl --silent --request GET \
              "https://<palette-endpoint>/v1/overlords" \
              --header "Authorization: <jwt-token>" | \
              jq -r --arg cid "<cluster-uid>" \
              '.items[] | select(.spec.spectroClusterUid == $cid) | .metadata.uid'
            ```

        2. Retrieve the Jet manifest.

            ```bash
            curl --silent --show-error --request GET \
                "https://<palette-endpoint>/v1/pcg/<pcg-uid>/services/jet/manifest" \
                --header "Authorization: <jwt-token>" \
                --output "cluster-<pcg-uid>-jet-manifest.yaml"
            ```

        3. Retrieve the Ally manifest.

            ```bash
            curl --silent --show-error --request GET \
              "https://<palette-endpoint>/v1/pcg/<pcg-uid>/services/ally/manifest" \
              --header "Authorization: <jwt-token>" \
              --output "cluster-<pcg-uid>-ally-manifest.yaml"
            ```

      </TabItem>

      </Tabs>

    </details>

8.  Apply the downloaded manifests to your Kubernetes cluster using the appropriate download paths.

    ```shell
    kubectl apply --filename "<path-to-download>/cluster-*-jet-manifest.yaml"
    kubectl apply --filename "<path-to-download>/cluster-*-ally-manifest.yaml"
    ```

9.  When the agents initialize, the drawer disappears, and your **Cluster Status** transitions to **Running**. Within a
    few minutes, your cluster's **Health** status changes to **Healthy**.

    :::tip

    You can provide network proxy configurations to your Kubernetes clusters deployed through Palette. To provide
    network proxy configurations to your host clusters, update the PCG with the proxy server details. To learn more,
    check out the [Proxy Configuration](./manage-pcg/configure-proxy.md) guide.

    :::

## Validate

When deployed, the PCG registers itself with Palette. Use the steps below to verify if the PCG registration is
successful.

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings** menu, select **Private Cloud Gateways**, and choose your PCG.

4. On the Private Cloud Gateway **Overview** screen, verify the **Cluster Status** is **Running**.

## Next Steps

Once your PCG is in the **Running** state, you can add an [AWS](../public-cloud/aws/add-aws-accounts.md),
[Azure](../public-cloud/azure/azure-cloud.md), or [Nutanix](../data-center/nutanix/add-nutanix-cloud-account.md) cloud
account to Palette with the **Connect Private Cloud Gateway** option toggled and your self-hosted PCG selected. You can
then use the PCG to deploy and delete clusters in the cloud environment connected to the PCG.

If you need to configure a proxy server for your PCG, refer to
[Enable and Manage Proxy Configurations](./manage-pcg/configure-proxy.md). The proxy must be configured before deploying
workload clusters through the PCG in order for the workload clusters to inherit the PCG proxy configurations.
