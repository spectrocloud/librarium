---
sidebar_label: "Register Nutanix Cloud"
title: "Register Nutanix Cloud"
description: "Learn how to register a Nutanix cloud in Palette."
hide_table_of_contents: false
sidebar_position: 5
tags: ["data center", "nutanix"]
---


A System Administrator registers the Nutanix cloud in Palette by invoking system-level APIs. These APIs provide specific cloud information, the cloud logo, and the key-value pairs required to add the cloud to Palette. They also enable uploading the YAML templates used to create the cluster, control plane, and worker nodes. This section provides instructions on how to use the APIs to register a Nutanix cloud to Palette.


## Prerequisites

- A Nutanix Prism Central account. <<< move to PCG?>>>

- A Nutanix subnet created in Nutanix Prism Central. <<< move to PCG?>>>

- A Palette account with system-level access.

- A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide.

- A Nutanix Cluster API (CAPI) OS image. For guidance on creating the image, refer to [Image](https://image-builder.sigs.k8s.io/capi/providers/nutanix.html#building-capi-images-for-nutanix-cloud-platform-ncp). <<< move to PCG?>>>

- The following applications installed: Docker, kind, kubectl, and clusterctl. <<< move to PCG?>>> EXport vars section goes to PCG setup.

<!-- - Downloaded infrastructure-components.yaml and cluster-template.yaml files from the [Nutanix Cluster API Provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) repository. These YAML files contain all the Custom Resource Definitions (CRDs) required for Nutanix cluster resources. -->


## Setup

Use the following steps to prepare for registering your cloud with Palette. 

### Create Bootstrap Cluster 

1. Log in to your Nutanix Prism account.

2. Create a local kind cluster that will be used to provision a target cluster. 

```bash
kind create cluster
```

3. 


### Export Variables and Deploy Workload Cluster

4. Copy the following required variables and export them to your terminal. Replace variables with your environment-specific information. For more information, visit the [Nutanix Getting Started](https://opendocs.nutanix.com/capx/v1.1.x/getting_started/) guide.

<!-- To initialize the Nutanix infrastructure, `clsuterctl` requires certain variables.  -->

<!-- ```bash
  NUTANIX_ENDPOINT: ""    # IP or FQDN of Prism Central
  NUTANIX_USER: ""        # Prism Central user
  NUTANIX_PASSWORD: ""    # Prism Central password
  NUTANIX_INSECURE: false # or true

  KUBERNETES_VERSION: "v1.22.9"
  WORKER_MACHINE_COUNT: 1
  NUTANIX_SSH_AUTHORIZED_KEY: ""

  NUTANIX_PRISM_ELEMENT_CLUSTER_NAME: ""
  NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME: ""
  NUTANIX_SUBNET_NAME: ""
```  -->

```bash
  export NUTANIX_ENDPOINT=""    # IP or FQDN of Prism Central
  export NUTANIX_USER=""        # Prism Central user
  export NUTANIX_PASSWORD=""    # Prism Central password
  export NUTANIX_INSECURE=false # or true

  export KUBERNETES_VERSION="v1.22.9"
  export WORKER_MACHINE_COUNT=1
  export NUTANIX_SSH_AUTHORIZED_KEY=""

  export NUTANIX_PRISM_ELEMENT_CLUSTER_NAME=""
  export NUTANIX_MACHINE_TEMPLATE_IMAGE_NAME=""
  export NUTANIX_SUBNET_NAME=""
```

7. Initantiate Nutanix Cluster API by issuing the following command:

```bash
  clusterctl init -i nutanix
```
8. Deploy a workload cluster on Nutanix cloud infrastructure by issuing the following command. Replace `mytestcluster` with your cluster name and `mytestnamespace` and with your namespace. Provide your control plane endpoint IP address. 

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

9. Deploy a Container Network Interface (CNI) pod network to enable pod-to-pod communication by issuing the following command:



### Customize YAML Configuration Files

10. Download the following YAML files from the Nutanix GitHub repository:
  - infrastructure-components.yaml
  - cluster-template.yaml

11. Create two copies of cluster-template.yaml and rename them so you have these three files in addition to the infrastructure-components.yaml:
  - cloudClusterTemplate.yaml
  - controlPlanePoolTemplate.yaml
  - workerPoolTemplate.yaml

12. Open the cloudClusterTemplate.yaml, controlPlanePoolTemplate.yaml, workerPoolTemplate.yaml files in the editor of your choice.

13. Modify the YAML files to remove sections so that only the sections listed in the table below remain in each file.

  :::tip

  When editing the YAMLs, it is helpful to collapse the `spec` section.

  :::

  <<< TABLE PLACEHOLDER >>>

14. Edit parameters in the `cloudClusterTemplate.yaml` YAML as follows:
  - Remove `namespace.${NAMESPACE} throughout the file. 
  - In `NutanixMachineTemplate`, change the `providerID` to `providerID.nutanix.//$CLUSTER_NAME}-m1-cp-0.`

15. Edit parameters in the `controlPlanePoolTemplate.yaml` YAML as follows:
  - Remove `namespace.${NAMESPACE} throughout the file.

16.  Edit parameters in the `workerPoolTemplate.yaml` YAML as follows:
  - Remove `namespace.${NAMESPACE} throughout the file. 
  - In `NutanixMachineTemplate`, change the `providerID` to `providerID.nutanix.//$CLUSTER_NAME}-m1-cp-0.`


## Validate

Use the following steps to validate your environment and ...

1. In the Nutanix web console navigate to **VM**. In the **Table** tab, verify there are two VMs listed. <<< We have to explain why there are two. >>> 

2. Echo variable name in terminal. echo $CLUSTER_NAME

3. 



## Register the Cloud

Use the following steps to register a Nutanix cloud.

1. Curl commands ->APIs....




## Validate
















1. Access the [Nutanix Cluster API infrastructure provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) page on GitHub.

  | **Template** | **Objects** |
  |-----------|-----------------|
  | **Control-plane**| KubeadmControlPlane (KCP)<br />NutanixdMachineTemplate |
  | **Worker**| MachineDeployment (MD)<br />KubeadmConfigTemplate<br />NutanixMachineTemplate |
  | **Cluster**|Cluster<br />CloudCluster<br />Secrets<br />ConfigMap<br />MachineHealthCheck |

 

 
 
 "divide into three files"

Some Cluster templates contain all of these objects, and others may not contain Secrets, configMap, and healthcheck 

Cluster template gets installed first. If any of the control-plane and worker objects are not 

1. Get the templates.

  :::caution
  When selecting templates, check to see if the cloud provider has a compatibility matrix, and ensure you download the latest CAPI version. 
  :::

2. Register four templates using APIs. 

3. 

## Register the Cloud Account (??)

Visit [Palette APIs](https://docs.spectrocloud.com/api/category/palette-api-v1). 
