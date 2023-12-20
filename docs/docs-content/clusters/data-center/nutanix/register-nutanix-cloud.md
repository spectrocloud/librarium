---
sidebar_label: "Register Nutanix Cloud"
title: "Register Nutanix Cloud"
description: "Learn how to register a Nutanix cloud in Palette."
hide_table_of_contents: false
sidebar_position: 5
tags: ["data center", "nutanix"]
---


A system administrator registers the Nutanix cloud in Palette by invoking system-level APIs. These APIs provide specific cloud information, the cloud logo, and the key-value pairs required to add the cloud to Palette. They also enable uploading the YAML templates used to create the cluster, control plane, and worker nodes. This section provides instructions on how to download and modify the YAML templates, as well as how to use the APIs to register a Nutanix cloud to Palette.


## Prerequisites


- A Palette account with system console access. The user with this privilege is the *admin user* of the self-hosted instance of [Palette](https://docs.spectrocloud.com/enterprise-version/system-management/#system-console) or [VerteX](https://docs.spectrocloud.com/vertex/system-management/#system-console).

- [`curl`](https://curl.se/docs/install.html) command installed.

<!-- - A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide. -->


## Setup

Use the following steps to prepare to register your cloud with Palette. 

### Customize YAML Configuration Files

1.  Download the following YAML files from the [Nutanix Cluster API (CAPI) Provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) GitHub repository:
    - **infrastructure-components.yaml**
    - **cluster-template.yaml**
  
  <br />

  :::caution
  Review the [Nutanix](https://opendocs.nutanix.com/capx/v1.2.x/validated_integrations/#validated-versions) compatibility matrix to ensure you download the latest CAPI version of the files. 
  :::

  Issue the commands below to download the files.

    ```bash
    curl -LO https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/latest/download/cluster-template.yaml
    curl -LO https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/latest/download/infrastructure-components.yaml
    ```

2. Create two copies of `cluster-template.yaml` and rename them so you have the following files in addition to the `infrastructure-components.yaml`:
    - **cloudClusterTemplate.yaml**
    - **controlPlanePoolTemplate.yaml**
    - **workerPoolTemplate.yaml**

  Use the following commands to copy and rename the files.

    ```bash
    cp cluster-template.yaml cloudClusterTemplate.yaml 
    cp cluster-template.yaml controlPlanePoolTemplate.yaml
    mv cluster-template.yaml workerPoolTemplate.yaml
    ```

3. Open the **cloudClusterTemplate.yaml**, **controlPlanePoolTemplate.yaml**, and **workerPoolTemplate.yaml** files in the editor of your choice.

4. Modify the YAML files to remove sections so that only those sections listed in the table below remain in each file.

  :::tip

  When editing the YAMLs, it is helpful to collapse the `spec` section to help you identify the sections to remove.  

  :::

  | **Templates**                   | **Objects**           |
  |--------------------------------|------------------------|
  | **cloudClusterTemplate.yaml**   | ConfigMap<br />Secret<br />Cluster<br />NutanixCluster<br />MachineHealthCheck | 
  | **controlPlanePoolTemplate.yaml**| KubeadmControlPlane<br />NutanixMachineTemplate |
  | **workerPoolTemplate.yaml**      | KubeadmConfigTemplate<br />MachineDeployment<br />NutanixMachineTemplate |


5. In all three templates, remove all occurrences of `${NAMESPACE}`, as Palette provides its own namespace.

6. In **controlPlanePoolTemplate.yaml**, edit the KubeadmControlPlane object. Rename `machineTemplate.name: ${CLUSTER_NAME}-mt-0` as `${CLUSTER_NAME}-cp-0`.

7. In **controlPlanePoolTemplate.yaml**, edit the NutanixMachineTemplate object. Rename `name: ${CLUSTER_NAME}-mt-0` as `${CLUSTER_NAME}-cp-0`, and change `providerID` to `nutanix://${CLUSTER_NAME}-m1-cp-0`. 

  :::caution
  The `${CLUSTER_NAME}-cp-0` parameters for the KubeadmControlPlane and NutanixMachineTemplate objects must have the same name.
  :::

8. In **workerPoolTemplate.yaml**, change `providerID` to `providerID: nutanix://${CLUSTER_NAME}-m1-mt-0` within the `NutanixMachineTemplate` object. 
    

## Validate

Use the steps below to confirm you have the required files and verify the required sections are removed and modified. 

1. From your terminal, issue a command such as `ls -l` to list the files and confirm you have the following YAML templates:

    - infrastructure-components.yaml
    - cloudClusterTemplate.yaml    
    - controlPlanePoolTemplate.yaml
    - workerPoolTemplate.yaml


2. Ensure each template contains objects as listed in the table.

  | **Templates**                  | **Objects**           |
  |--------------------------------|------------------------|
  | **cloudClusterTemplate.yaml**    | ConfigMap<br />Secret<br />Cluster<br />NutanixCluster<br />MachineHealthCheck | 
  | **controlPlanePoolTemplate.yaml**| KubeadmControlPlane<br />NutanixMachineTemplate |
  | **workerPoolTemplate.yaml**     | KubeadmConfigTemplate<br />MachineDeployment<br />NutanixMachineTemplate |

3. Open each file and verify that all occurrences of `${NAMESPACE}` are removed. 

4. In the **controlPlanePoolTemplate.yaml** file, ensure `${CLUSTER_NAME}-cp-0` for the KubeadmControlPlane and NutanixMachineTemplate objects have the same name.

5. Verify parameters are modifed as described for each template in steps 6 and 7 of [Customize YAML Configuration Files](#customize-yaml-configuration-files).

## Register the Cloud

Follow the steps below from your terminal to set the environment variables and invoke the APIs required to register a Nutanix cloud to Palette. Alternatively, you can use an API platform such as [Postman](https://www.postman.com/).

:::caution

The Nutanix logo file must not exceed 100KB in size.

:::

1. Export the URL of your self-hosted Palette or VerteX instance and the cloud type as environment variables. Additionally, export the path to the YAML templates and to the logo file.

  ```bash
  export ENDPOINT="https://palette.example.com"
  export CLOUD_TYPE="nutanix"
  export cloudLogo="/path/to/the/file/cloud-logo.png"
  export infraComponents="/path/to/the/file/infrastructure-components.yaml"
  export cloudClusterTemplate="/path/to/the/file/cloudClusterTemplate.yaml"
  export  controlPlanePoolTemplate="/path/to/the/file/controlPlanePoolTemplate.yaml"
  export workerPoolTemplate="/path/to/the/file/workerPoolTemplate.yaml"
  ```

  :::caution
  The CLOUD_TYPE variable value must be set as `nutanix`, as this value will be used for the `name` value in the `/v1/clouds/cloudTypes/register` cloud registration API in step 4 below. Setting `name` as `nutanix` will make the out-of-the-box Nutanix CSI pack available when you create your cluster in Palette. 
  :::

2. To acquire system administrator credentials, use the `/v1/auth/syslogin` endpoint. Issue the `curl` command below and ensure you replace the credentials with your system console credentials.

  ```bash
  curl --insecure --location "$ENDPOINT/v1/auth/syslogin" \
  --header 'Content-Type: application/json' \
  --data "{
    "password": "**********",
    "username": "**********"
  }"
  ```

  The output contains your authorization token.

  ```bash hideClipBoard
  {
    "Authorization": "**********",
    "IsPasswordReset": true
  }
  ```

3. Copy the authorization token, assign it to a `TOKEN` shell variable, and export it. Replace the authorization value below with the value from the output.

  ```bash
  export TOKEN="**********"
  ```

4. Register the Nutanix cloud type in Palette using the `/v1/clouds/cloudTypes/register` endpoint.

  ```bash
  curl --location --request POST "${ENDPOINT}/v1/clouds/cloudTypes/register" \
  --header "Content-Type: application/json" \
  --header "Authorization: ${TOKEN}" \
  --data "{
      "metadata": {
          "annotations": {},
          "labels": {},
          "name": "${CLOUD_TYPE}"
      },
      "spec": {
          "displayName": "Nutanix",
          "isControlPlaneManaged": false
      }
  }"
  ```

5. Upload the Nutanix cloud logo. 

  ```bash
  curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/logo" \
  --header "Authorization: ${TOKEN}" \
  --form "fileName=@${cloudLogo}"
  ```

6. Register the cloud provider. 

  ```bash
  curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/cloudProvider" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${infraComponents}"
  ```

7. Register the cluster template. 

  ```bash
  curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/clusterTemplate" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${cloudClusterTemplate}"
  ```

8. Register the control plane pool template. 

  ```bash
  curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/controlPlanePoolTemplate" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${controlPlanePoolTemplate}"
  ```

9. Register the worker pool template. 

  ```bash
    curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/workerPoolTemplate" \
          --header "Content-Type: multipart/form-data" \
          --header "Authorization: ${TOKEN}" \
          --form "fileName=@${workerPoolTemplate}"
    ```

## Validate

Use the steps below to confirm that the Nutanix cloud is successfully registered in Palette.

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. Navigate to the **left Main Menu** and select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Verify that the added Nutanix account section is listed. You may need to scroll to view the account.


## Next Steps

Now that your cloud is successfully registered with Palette, the Private Cloud Gateway (PCG) must be deployed. For guidance, review the [Install Private Cloud Gateway](install-pcg.md) guide.








