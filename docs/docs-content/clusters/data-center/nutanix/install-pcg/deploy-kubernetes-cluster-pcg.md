---
sidebar_label: "Deploy a Kubernetes Cluster to Host the PCG"
title: "Deploy a Kubernetes Cluster to Host the PCG"
description: "Learn how to deploy a Kubernetes cluster to host the PCG"
hide_table_of_contents: false
sidebar_position: 15
tags: ["data center", "nutanix"]
---

This section describes one possible method for creating a Kubernetes cluster that will be used to deploy your PCG
following the process described in the
[Nutanix Getting Started](https://opendocs.nutanix.com/capx/v1.1.x/getting_started/) resource and the
[Common Prerequisites](https://cluster-api.sigs.k8s.io/user/quick-start#common-prerequisites) specified in the guide.

## Prerequisites

- A Nutanix Prism Central account with _Prism Admin_ role.

- A Nutanix Prism Element cluster created.

- A Nutanix subnet created in Nutanix Prism Central that will be assigned to the virtual machines (VMs) deployed in the
  Kubernetes cluster.

- A Nutanix Cluster API (CAPI) OS image. For guidance on creating the image, refer to
  [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

- The following software installed on the machine that will be used to create the clusters:

  - [Docker](https://docs.docker.com/engine/install/)
  - [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - [clusterctl](https://cluster-api.sigs.k8s.io/user/quick-start#install-clusterctl)

## Create Bootstrap Cluster

1. Log in to your Nutanix Prism account.

2. Create a local kind cluster. This cluster will bootstrap Cluster API and provision the target workload cluster in the
   Nutanix account. The workload cluster is then used to deploy the PCG.

   ```bash
   kind create cluster --name pcg-pilot
   ```

## Deploy Workload Cluster

3.  Copy the required variables shown in the examples below to your terminal, add your environment-specific information,
    and export the variables. The table describes the environment variables. For more information, review the
    [Nutanix Getting Started](https://opendocs.nutanix.com/capx/v1.1.x/getting_started/) guide.

    | **Variable**                          | **Description**                                                                                     |
    | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
    | `NUTANIX_ENDPOINT`                    | The Prism Central IP address or FQDN.                                                               |
    | `NUTANIX_USER`                        | The Prism Central user name.                                                                        |
    | `NUTANIX_PASSWORD`                    | The Prism Central user password.                                                                    |
    | `NUTANIX_INSECURE`                    | The SSL behavior you used in the `cloudClusterTemplate.yaml` file. The default behavior is `false`. |
    | `NUTANIX_SSH_AUTHORIZED_KEY`          | Provide your public SSH key.                                                                        |
    | `NUTANIX_PRISM_ELEMENT_CLUSTER_NAME`  | The Nutanix Prism Element cluster name.                                                             |
    | `NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME` | The Nutanix CAPI OS Image                                                                           |
    | `NUTANIX_SUBNET_NAME`                 | The subnet of the Nutanix workload cluster.                                                         |
    | `KUBERNETES_VERSION`                  | The Kubernetes version the workload cluster uses. Precede the version with `v`.                     |
    | `WORKER_MACHINE_COUNT`                | The number of nodes in the workload cluster.                                                        |

    Copy the following Nutanix environment variables to your terminal, provide values, and export the variables.

    ```bash
    export NUTANIX_ENDPOINT=""
    export NUTANIX_USER=""
    export NUTANIX_PASSWORD=""
    export NUTANIX_INSECURE=false
    export NUTANIX_SSH_AUTHORIZED_KEY=""
    export NUTANIX_PRISM_ELEMENT_CLUSTER_NAME=""
    export NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME=""
    export NUTANIX_SUBNET_NAME=""
    ```

    You can ensure the Nutanix variables were successfully exported by issuing the following command in your terminal.

    ```bash
    env | grep "NUTANIX"
    ```

    Copy the following environment variables to your terminal, provide values, and export the variables.

    ```bash
    export KUBERNETES_VERSION="v1.22.9"
    export WORKER_MACHINE_COUNT=1
    ```

    To verify the KUBERNETES_VERSION and WORKER_MACHINE_COUNT variables were successfully exported, you can issue the
    following command for each variable.

    ```bash
    echo $variable_name
    ```

4.  Instantiate Nutanix Cluster API.

    ```bash
    clusterctl init --infrastructure nutanix
    ```

5.  Deploy a workload cluster in Nutanix by issuing the following command. Replace `mytestcluster` with the cluster name
    that you assigned to your workload cluster and `mytestnamespace` and with your namespace name. Provide the Nutanix
    Prism Central IP address for CONTROL_PLANE_ENDPOINT_IP.

    ```bash
    export TEST_CLUSTER_NAME=mytestcluster
    export TEST_NAMESPACE=mytestnamespace
    CONTROL_PLANE_ENDPOINT_IP=x.x.x.x clusterctl generate cluster ${TEST_CLUSTER_NAME} \
      -i nutanix \
      --target-namespace ${TEST_NAMESPACE}  \
      > ./cluster.yaml
    kubectl create namespace ${TEST_NAMESPACE}
    kubectl apply --filename ./cluster.yaml --namespace ${TEST_NAMESPACE}
    ```

    The snippet below displays the output of the command.

    ```bash hideClipBoard
    namespace/mytestnamespace created
    configmap/user-ca-bundle created
    secret/mytestcluster created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/mytestcluster-kcfg-0 created
    cluster.cluster.x-k8s.io/mytestcluster created
    machinedeployment.cluster.x-k8s.io/mytestcluster-wmd created
    machinehealthcheck.cluster.x-k8s.io/mytestcluster-mhc created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/mytestcluster-kcp created
    nutanixcluster.infrastructure.cluster.x-k8s.io/mytestcluster created
    nutanixmachinetemplate.infrastructure.cluster.x-k8s.io/mytestcluster-mt-0 created
    ```

## Install CNI on Workload Cluster

6. After your Nutanix workload cluster is deployed, retrieve its kubeconfig file with the command described below.

   ```bash
   clusterctl get kubeconfig $TEST_CLUSTER_NAME > $TEST_CLUSTER_NAME.kubeconfig -namespace $TEST_NAMESPACE
   ```

7. Deploy a Container Network Interface (CNI) pod in the workload cluster to enable pod-to-pod communication. For more
   information, refer to
   [Deploy a CNI solution](https://cluster-api.sigs.k8s.io/user/quick-start.html#deploy-a-cni-solution) in the
   [Nutanix Quick Start](https://cluster-api.sigs.k8s.io/user/quick-start.htm) reference.
   [Calico](https://docs.tigera.io/calico/latest/about/) is used as the CNI solution in this example.

   ```bash
   kubectl apply --filename https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml
   ```

8. To verify that the CNI was deployed successfully, issue the following command.

   ```bash
   kubectl --kubeconfig=./$TEST_CLUSTER_NAME.kubeconfig get nodes
   ```

   The output should display your nodes with a **Ready** status.

   ```bash hideClipBoard
   NAME                           STATUS   ROLES           AGE   VERSION
   test-cluster-kcp-qhb5h         Ready    control-plane   26h   v1.26.7
   test-cluster-wmd-gdjps-gx267   Ready    <none>          26h   v1.26.7
   ```

## Validate

Use the steps below to verify your virtual machines (VMs) are created.

1. In the Nutanix Prism Element web console, navigate to **VM**.

2. Next, in the **Table** tab, verify the VMs you created are listed.

## Cleanup

With the PCG successfully installed in your Kubernetes workload cluster, you can delete the kind cluster that was used
to bootstrap the workload cluster.

```bash
kind delete cluster --name pcg-pilot
```
