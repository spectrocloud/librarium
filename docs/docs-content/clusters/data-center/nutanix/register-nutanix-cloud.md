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



- A Palette account with system-level access.

<!-- - A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide. -->


## Setup

Use the following steps to prepare to register your cloud with Palette. 

### Customize YAML Configuration Files

1.  Download the following YAML files from the [Nutanix Cluster API (CAPI) Provider](https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix) GitHub repository:
    - `infrastructure-components.yaml`
    - `cluster-template.yaml`

  :::caution
  Check the [Nutanix](https://opendocs.nutanix.com/capx/v1.2.x/validated_integrations/#validated-versions) compatibility matrix to ensure you download the latest CAPI version of the files. 
  :::

  Issue the commands below to download the files.

```bash
  wget https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/latest/download/cluster-template.yaml

  wget https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/latest/download/infrastructure-components.yaml
```

2. Create two copies of `cluster-template.yaml` and rename them so you have the following files in addition to the `infrastructure-components.yaml`:
    - `cloudClusterTemplate.yaml`
    - `controlPlanePoolTemplate.yaml`
    - `workerPoolTemplate.yaml`

  Use the following commands to copy and rename the files.

```bash
  cp cluster-template.yaml cloudClusterTemplate.yaml 
  cp cluster-template.yaml controlPlanePoolTemplate.yaml
  mv cluster-template.yaml workerPoolTemplate.yaml
```

3. Open the `cloudClusterTemplate.yaml`, `controlPlanePoolTemplate.yaml`, and `workerPoolTemplate.yaml` files in the editor of your choice.

4. Modify the YAML files to remove sections so that only the sections listed in the table below remain in each file.

  :::tip

  When editing the YAMLs, it is helpful to collapse the `spec` section to help you identify the sections to remove.  

  :::

  | **Templates**                   | **Objects**           |
  |--------------------------------|------------------------|
  | `cloudClusterTemplate.yaml`    | ConfigMap<br />Secret<br />Cluster<br />NutanixCluster<br />MachineHealthCheck | 
  | `controlPlanePoolTemplate.yaml`| KubeadmControlPlane<br />NutanixMachineTemplate |
  | `workerPoolTemplate.yaml`      | KubeadmConfigTemplate<br />MachineDeployment<br />NutanixMachineTemplate |


5. In `cloudClusterTemplate.yaml` expand `spec` in each section and remove all occurrences of `metadata.namespace.${NAMESPACE}`.

6. In `controlPlanePoolTemplate.yaml` expand `spec` in both sections of the template and edit the template as follows:
  
    - In the KubeadmControlPlane object:
      - Remove `metadata.namespace.${NAMESPACE}`.
      - Rename `spec.machineTemplate.name: ${CLUSTER_NAME}-mt-0` as `${CLUSTER_NAME}-cp-0`.  

    - In the NutanixMachineTemplate object:
      - Remove `metadata.namespace.${NAMESPACE}`.
      - Rename `metadata.name: ${CLUSTER_NAME}-mt-0` as `${CLUSTER_NAME}-cp-0`.
      - Rename `spec.template.providerID: nutanix://${CLUSTER_NAME}-m1`as `nutanix://${CLUSTER_NAME}-m1-cp-0`. 

      :::caution
      The `${CLUSTER_NAME}-cp-0` parameters for the KubeadmControlPlane and NutanixMachineTemplate objects must have the same name.
      :::

7. In `workerPoolTemplate.yaml` expand `spec` in each section and edit the template as follows:
    - Remove all occurrences of `metadata.namespace.${NAMESPACE}`. 
    - In the `NutanixMachineTemplate` object, change the `providerID` to `providerID: nutanix://$CLUSTER_NAME}-m1-mt-0`. 
    

## Validate

<<< Not sure with a mushy brain how to validate this. But we need this section. >>> 

## Register the Cloud

Follow the steps below from your terminal to set the environment variables and invoke the APIs required to register a Nutanix cloud to Palette. Alternatively, you can use an API platform such as [Postman](https://www.postman.com/).

:::caution
During the registration process, the template files and logo file must be located in the same directory where you execute the curl commands in the steps below. The logo file must not exceed 100KB in size.

:::

1. Export your Palette URL and the cloud type you want to register as environment variables.

```bash
export ENDPOINT="https://palette.example.com"
export CLOUD_TYPE="nutanix-custom"
```

2. To acquire a system administrator authentication token, log in to the Palette API by using the `/v1/auth/syslogin` endpoint. Use the `curl` command below and replace the URL with the custom domain URL assigned to Palette. Ensure you replace the credentials with your system console credentials.

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

4. Register the Nutanix cloud type to Palette by using the `/v1/clouds/cloudTypes/register` endpoint.

```bash
curl --location --request POST "${ENDPOINT}/v1/clouds/cloudTypes/register" \
--header "Content-Type: application/json" \
--header "Cookie: Authorization=${TOKEN}" \
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

5. Upload the Nutanix cloud logo by using the `curl` command displayed below. 

```bash
curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/logo" \
--header "Cookie: Authorization=${TOKEN}" \
--form "fileName=@${cloud-logo.png}"
```

6. Register the cloud provider by using the `curl` command below. 

```bash
curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/cloudProvider" \
       --header "Content-Type: multipart/form-data" \
       --header "Cookie: Authorization=${TOKEN}" \
       --form "fileName=@${infrastructure-components.yaml}"
```

7. Register the cluster template using the `curl` command below. 

```bash
curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/clusterTemplate" \
       --header "Content-Type: multipart/form-data" \
       --header "Cookie: Authorization=${TOKEN}" \
       --form "fileName=@${cloudClusterTemplate.yaml}"
```

8. Register the control plane pool template using the `curl` command below. 

```bash
curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/controlPlanePoolTemplate" \
       --header "Content-Type: multipart/form-data" \
       --header "Cookie: Authorization=${TOKEN}" \
       --form "fileName=@${controlPlanePoolTemplate.yaml}"
```

9. Register the worker pool template using the `curl` command below. 

```bash
curl --location --request PUT "${ENDPOINT}v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/workerPoolTemplate" \
       --header "Content-Type: multipart/form-data" \
       --header "Cookie: Authorization=${TOKEN}" \
       --form "fileName=@${workerPoolTemplate.yaml}"
```

## Validate

Use the steps below to confirm that the Nutanix cloud is successfully registered to Palette.

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. Navigate to the **left Main Menu** and select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Verify that the added Nutanix account section is listed. You may need to scroll to view the account.











