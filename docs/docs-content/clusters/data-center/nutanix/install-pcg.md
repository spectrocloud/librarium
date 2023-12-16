---
sidebar_label: "Install Private Cloud Gateway"
title: "Install Private Cloud Gateway"
description: "Learn how to install a Nutanix Private Cloud Gateway in Palette."
hide_table_of_contents: false
sidebar_position: 10
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["data center", "nutanix"]
---


A Private Cloud Gateway (PCG) is required to connect your Nutanix cloud with Palette. The PCG enables Palette to securely monitor Nutanix clusters in the cloud. This section guides you on installing the PCG.

## Prerequisites

- A Kubernetes cluster in Nutanix with version 1.19.x or higher, outbound internet connectivity, and
DNS configured to resolve public internet domain names.

- A Nutanix Prism Central account with *Prism Admin* role. 

- A Nutanix subnet created in Nutanix Prism Central.

- A Nutanix cloud registered with Palette.

- A Nutanix Cluster API (CAPI) OS image. For guidance on creating the image, refer to [Building CAPI Images for Nutanix Cloud Platform](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp).

- The following applications installed: Docker, kind, kubectl, and clusterctl.


## Setup

Use the following steps to prepare for installing the PCG.

### Create Bootstrap Cluster 

1. Log in to your Nutanix Prism account.

2. Create a local kind cluster, which will be used to bootstrap the workload cluster in the Nutanix account. The workload cluster is then used to deploy the PCG. 

```bash
  kind create cluster
```


### Export Variables and Deploy Workload Cluster

3. Copy the following required variables to your terminal, add your environment-specific information, and press *Enter* to export them. For more information, review the [Nutanix Getting Started](https://opendocs.nutanix.com/capx/v1.1.x/getting_started/) guide.

```bash
  export NUTANIX_ENDPOINT=""    # IP or FQDN of Prism Central
  export NUTANIX_USER=""        # Prism Central user
  export NUTANIX_PASSWORD=""    # Prism Central password
  export NUTANIX_INSECURE=false # or true

  export KUBERNETES_VERSION="v1.22.9"  # Precede version with 'v'.
  export WORKER_MACHINE_COUNT=1
  export NUTANIX_SSH_AUTHORIZED_KEY=""

  export NUTANIX_PRISM_ELEMENT_CLUSTER_NAME=""
  export NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME=""
  export NUTANIX_SUBNET_NAME=""
```

4. Initantiate Nutanix Cluster API by issuing the following command:

```bash
  clusterctl init -i nutanix
```

5. Deploy a workload cluster in Nutanix by issuing the following command. Replace `mytestcluster` with your cluster name and `mytestnamespace` and with your namespace name. Provide your control plane endpoint IP address. 

```bash
  export TEST_CLUSTER_NAME=mytestcluster
  export TEST_NAMESPACE=mytestnamespace
  CONTROL_PLANE_ENDPOINT_IP=x.x.x.x clusterctl generate cluster ${TEST_CLUSTER_NAME} \
    -i nutanix \
    --target-namespace ${TEST_NAMESPACE}  \
    > ./cluster.yaml
  kubectl create ns ${TEST_NAMESPACE}
  kubectl apply -f ./cluster.yaml -n ${TEST_NAMESPACE}
```

### Install CNI on Workload Cluster

6. Deploy a Container Network Interface (CNI) pod network <<< in the workload cluster? >>> to enable pod-to-pod communication. For guidance, refer to [Deploy a CNI solution](https://cluster-api.sigs.k8s.io/user/quick-start.html#deploy-a-cni-solution) in the Nutanix [Quick Start](https://cluster-api.sigs.k8s.io/user/quick-start.htm) reference.

 by issuing the following command: 

```bash
  clusterctl get kubeconfig carolina-cluster > carolina-cluster.kubeconfig -n carolina-namespace
```

## Validate

Use the following steps to validate your environment.

1. In the Nutanix web console, verify there are two VMs in your cluster. <<< Why are there two? >>>

<!-- In the Nutanix web console navigate to **VM**. In the **Table** tab, verify there are two VMs listed. <<< We have to explain why there are two. >>>  -->

2. In your terminal, ensure variables are exported. 

```bash
  echo $variable_name
```

3. Verify the CNI pod network by issuing the following command. 

```bash
  kubectl --kubeconfig=./<cluster_name>-cluster.kubeconfig get nodes
```

  Output

```bash
NAME                           STATUS   ROLES           AGE   VERSION
test-cluster-kcp-qhb5h         Ready    control-plane   26h   v1.26.7
test-cluster-wmd-gdjps-gx267   Ready    <none>          26h   v1.26.7
```


## Install PCG

Use the following steps to install the PCG in your Kubernetes cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways** and click on **+ Add New Private Cloud Gateway**.

4. Select **Self Hosted** in the next window that Palette displays.

5. Provide a name for the PCG and use the **drop-down Menu** to select Nutanix as the cloud type. Click **Confirm** to continue. Palette displays the Private Cloud Gateway Overview page. 

6. To install the Palette agent, copy the kubectl commands from the slide-out panel and execute them against your Kubernetes cluster.

7. Close the slide-out panel when you have copied both the commands. The **Cluster Status** field on the PCG Overview page displays **Pending** while the PCG is installing. Installation is complete when the **Cluster Status** field displays **Running**.  


## Validate

When deployed, the PCG registers itself with Palette. Use the steps below to verify if the PCG is registered.

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **left Main Menu** and select **Tenant Settings**.


3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.


4. Locate the PCG and verify it is installed and in the **Running** state. 


## Next Steps

When the PCG is in the **Running** state, you can create the Nutanix cloud account. 
