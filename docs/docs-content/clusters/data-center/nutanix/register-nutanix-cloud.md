---
sidebar_label: "Register Nutanix Cloud"
title: "Register Nutanix Cloud"
description: "Learn how to register a Nutanix cloud in Palette."
hide_table_of_contents: false
sidebar_position: 5
tags: ["data center", "nutanix"]
---

A [system administrator](../../../glossary-all.md#system-administrator) registers the Nutanix cloud in Palette by
invoking system-level APIs. These APIs provide specific cloud information, the cloud logo, and the key-value pairs
required to add the cloud to Palette. They also allow you to upload YAML templates used to create the cluster, control
plane, and worker nodes. This section provides instructions on how to download and modify YAML templates, upgrade the
default Cluster API (CAPI) version, and use APIs to register a Nutanix cloud to Palette.

## Prerequisites

- A Nutanix Cluster API (CAPX) version compatible with the desired CAPI version. The default CAPI version for Palette is
  `v1.5.3`. Refer to the Nutanix
  [CAPI Validated Integrations](https://opendocs.nutanix.com/capx/latest/validated_integrations/#cluster-api)
  compatibility matrix for more information.

- A Nutanix Prism Central version compatible with the desired CAPX version. Refer to the Nutanix
  [Prism Central Validated Integrations](https://opendocs.nutanix.com/capx/latest/validated_integrations/#prism-central)
  compatibility matrix for more information.

- A Palette account with system console access. The user with this privilege is the
  [system administrator](../../../glossary-all.md#system-administrator) of the self-hosted
  [Palette](../../../self-hosted-setup/palette/palette.md) or
  [Palette VerteX](../../../self-hosted-setup/vertex/vertex.md) instance.

- A Nutanix logo downloaded. Review logo requirements in [Register the Cloud](#register-the-cloud).

- [curl](https://curl.se/docs/install.html) command installed or the method of your choice to make API calls for Palette
  and VerteX.

<!-- - A valid Palette authentication token. To learn how to acquire an authentication token, review the [Authorization Token](https://docs.spectrocloud.com/user-management/authentication/authorization-token) guide. -->

## Customize YAML Configuration Files

Before you can register your Nutanix cloud with Palette, you must download the appropriate CAPX manifests and edit them
accordingly so that the APIs can communicate with Palette.

You need to configure certain components explicitly, while others are optional and will fall back to default settings if
not configured. By default, Palette uses CAPI version `v1.5.3`.

:::warning

If you upgrade any optional component, we strongly recommend upgrading the other optional components to the same version
to ensure compatibility.

:::

| **Component**               | **Requirement** |
| --------------------------- | --------------- |
| `cluster-template`          | Required        |
| `control-plane-template`    | Required        |
| `infrastructure-components` | Required        |
| `worker-template`           | Required        |
| `bootstrap-components`      | Optional        |
| `control-plane-components`  | Optional        |
| `core-component`            | Optional        |

### Required Components

The following components are required to register your Nutanix cloud with Palette. Use the following procedure to
download and format the manifests appropriately.

1.  Review the
    [Nutanix compatibility matrix](https://opendocs.nutanix.com/capx/latest/validated_integrations/#validated-versions)
    to ensure your desired CAPX version is compatible with your CAPI version. Once you have verified they are
    compatible, export your CAPX version as an environment variable. For example, if you want to download version
    `v1.5.0`, issue the following command.

    ```bash
    export CAPX_VERSION="v1.5.0"
    ```

2.  Issue the commands below to download the appropriate versions of `infrastructure-components.yaml` and
    `cluster-template.yaml`.

    ```bash
    curl --remote-name --location https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/download/$CAPX_VERSION/cluster-template.yaml
    curl --remote-name --location https://github.com/nutanix-cloud-native/cluster-api-provider-nutanix/releases/download/$CAPX_VERSION/infrastructure-components.yaml
    ```

3.  Create two copies of `cluster-template.yaml` and rename them.

    ```bash
    cp cluster-template.yaml cloudClusterTemplate.yaml
    cp cluster-template.yaml controlPlanePoolTemplate.yaml
    mv cluster-template.yaml workerPoolTemplate.yaml
    ```

4.  Verify that you have the following files downloaded using a command such as `ls -l`.

    - `infrastructure-components.yaml`
    - `cloudClusterTemplate.yaml`
    - `controlPlanePoolTemplate.yaml`
    - `workerPoolTemplate.yaml`

5.  Open the `cloudClusterTemplate.yaml`, `controlPlanePoolTemplate.yaml`, and `workerPoolTemplate.yaml` files in your
    editor of choice.

6.  Modify the YAML files so that only the top-level objects listed in the table below remain in each file.

    | **Template**                    | **Objects to Keep**                                                                      |
    | ------------------------------- | ---------------------------------------------------------------------------------------- |
    | `cloudClusterTemplate.yaml`     | `ConfigMap`<br />`Secret`<br />`Cluster`<br />`MachineHealthCheck`<br />`NutanixCluster` |
    | `controlPlanePoolTemplate.yaml` | `KubeadmControlPlane`<br />`NutanixMachineTemplate`                                      |
    | `workerPoolTemplate.yaml`       | `KubeadmConfigTemplate`<br />`MachineDeployment`<br />`NutanixMachineTemplate`           |

7.  In all three templates, remove all occurrences of `${NAMESPACE}`, as Palette provides its own namespace.

8.  In `controlPlanePoolTemplate.yaml`, make the following changes.

    1. In the `KubeadmControlPlane` object, rename `spec.machineTemplate.infrastructureRef.name:` to
       `${CLUSTER_NAME}-cp-0`.
    2. In the `KubeadmControlPlane` object, below the `spec.kubeadmConfigSpec.preKubeadmCommands:` line, add the line
       `- systemctl enable --now iscsid` to enable the `nutanix-csi` pack, keeping proper indentation as illustrated
       below.

       ```bash
       preKubeadmCommands:
        - systemctl enable --now iscsid
       ```

    3. In the `NutanixMachineTemplate` object, rename `metadata.name:` to `${CLUSTER_NAME}-cp-0`.
    4. In the `NutanixMachineTemplate` object, rename `spec.template.spec.providerID:` to
       `nutanix://${CLUSTER_NAME}-m1-cp-0`.

9.  In `workerPoolTemplate.yaml`, make the following changes.

    1. In the `NutanixMachineTemplate` object, rename `spec.template.spec.providerID:` to
       `nutanix://${CLUSTER_NAME}-m1-mt-0`.
    2. In the `KubeadmConfigTemplate` object, below the `spec.template.spec.preKubeadmCommands:` line, add the line
       `- systemctl enable --now iscsid` to enable the `nutanix-csi` pack, keeping proper indentation as illustrated
       below.

       ```bash
       preKubeadmCommands:
       - systemctl enable --now iscsid
       ```

10. (VerteX only) Make the following modifications for VerteX environments.

      <details>

    <summary>Additional VerteX Modifications</summary>

        1. In `controlPlanePoolTemplate.yaml`, edit the `KubeadmControlPlane` object. Below both `kubeletExtraArgs:` lines, add the line `rotate-server-certificates: "true"`, keeping proper indentation as illustrated below.

            ```bash
            kubeletExtraArgs:
              rotate-server-certificates: "true"
            ```

        2.  In `workerPoolTemplate.yaml`, edit the `KubeadmConfigTemplate` object. Below `kubeletExtraArgs:`, add the line `rotate-server-certificates: "true"`, keeping proper indentation as illustrated below.

            ```bash
            kubeletExtraArgs:
              rotate-server-certificates: "true"
            ```

      </details>

If you are not upgrading the core CAPI version or another optional component, proceed to the
[Register the Cloud](#register-the-cloud) section of this guide.

### Optional Components

To use a core, bootstrap, or control plane component other than `v1.5.3`, you must specify the desired version and
download additional CAPI manifests. If you upgrade one of these components, we _strongly_ recommend upgrading the others
to the same version to ensure compatibility.

The following example upgrades all three optional components.

1. Export your CAPI version as an environment variable. For example, if you want to download version `v1.8.6`, issue the
   following command.

   ```bash
   export CAPI_VERSION="v1.8.6"
   ```

2. Issue the commands below to download the optional components. If you do not wish to upgrade all three components,
   download only the ones you need.

   ```bash
   curl --remote-name --location https://github.com/kubernetes-sigs/cluster-api/releases/download/$CAPI_VERSION/bootstrap-components.yaml
   curl --remote-name --location https://github.com/kubernetes-sigs/cluster-api/releases/download/$CAPI_VERSION/control-plane-components.yaml
   curl --remote-name --location https://github.com/kubernetes-sigs/cluster-api/releases/download/$CAPI_VERSION/core-components.yaml
   ```

3. Verify that you have the applicable files downloaded using a command such as `ls -l`.

   - `bootstrap-components.yaml`
   - `control-plane-components.yaml`
   - `core-components.yaml`

Generally, these manifests do not require additional modifications and are designed to work as-is. If you need to
customize these files, do so now.

## Register the Cloud

Follow the steps below to set the necessary environment variables and invoke the APIs required to register a Nutanix
cloud to Palette. Alternatively, you can use an API platform such as [Postman](https://www.postman.com/).

### Prerequisites

- You have completed the steps in [Customize YAML Configuration Files](#customize-yaml-configuration-files).

- Only an
  [Operations Administrator](../../../self-hosted-setup/palette/system-management/account-management/account-management.md#operations-administrator)
  is allowed to register a Nutanix cloud.

- The logo file must not exceed 100 KB in size. To ensure image quality, ensure at least one dimension in either width
  or height is 40 pixels. It is preferable that the image be transparent.

### Enablement

1. Export the URL of your self-hosted Palette or VerteX instance and the cloud type as environment variables.
   Additionally, export the path to the YAML templates and logo file.

   ```bash
   export ENDPOINT="https://palette.example.com"
   export CLOUD_TYPE="nutanix"
   export cloudLogo="/path/to/the/file/cloud-logo.png"
   export infraComponents="/path/to/the/file/infrastructure-components.yaml"
   export cloudClusterTemplate="/path/to/the/file/cloudClusterTemplate.yaml"
   export controlPlanePoolTemplate="/path/to/the/file/controlPlanePoolTemplate.yaml"
   export workerPoolTemplate="/path/to/the/file/workerPoolTemplate.yaml"
   ```

   :::warning

   The `CLOUD_TYPE` variable must be set as `nutanix`, as this value will be used in the following steps.

   :::

2. To acquire system administrator credentials, use the `/v1/auth/syslogin` endpoint. Issue the `curl` command below and
   ensure you replace the credentials with your system console credentials.

   ```bash
   curl --location "${ENDPOINT}/v1/auth/syslogin" \
   --header 'Content-Type: application/json' \
   --data '{
   "password": "**********",
   "username": "**********"
   }'
   ```

   The output contains your authorization token. The token is valid for 15 minutes.

   ```bash hideClipBoard
   {
   "Authorization": "**********",
   "IsPasswordReset": true
   }
   ```

3. Copy the authorization token, assign it to the `TOKEN` variable, and export it. Replace the authorization value below
   with the value from the output.

   ```bash
   export TOKEN="**********"
   ```

4. Register the Nutanix cloud type in Palette using the `/v1/clouds/cloudTypes/register` endpoint.

   :::info

   You must set the cloud `name` as `nutanix` to automatically make the out-of-the-box `nutanix-csi` pack available to
   users when they create a cluster profile in Palette.

   :::

   ```bash
   curl --location --request POST "${ENDPOINT}/v1/clouds/cloudTypes/register" \
        --header "Content-Type: application/json" \
        --header "Authorization: ${TOKEN}" \
        --data '{
           "metadata": {
              "annotations": {},
              "labels": {},
              "name": "nutanix"
           },
           "spec": {
              "displayName": "Nutanix",
              "isControlPlaneManaged": false
           }
        }'
   ```

5. Upload the Nutanix cloud logo.

   ```bash
   curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/logo" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${cloudLogo}"
   ```

6. (Optional) If you configured any [optional components](#optional-components) to use a specific CAPI version, register
   them using the following API calls.

   <details>

   <summary>Modify CAPI Version</summary>

   1. Export the paths to the optional component YAML files.

      ```bash
      export coreComponentsTemplate="/path/to/the/file/core-components.yaml"
      export controlPlaneComponentsTemplate="/path/to/the/file/control-plane-components.yaml"
      export bootstrapComponentsTemplate="/path/to/the/file/bootstrap-components.yaml"
      ```

   2. Register the core component.

      ```bash
      curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/core" \
           --header "Content-Type: multipart/form-data" \
           --header "Cookie: Authorization=${TOKEN}" \
           --form "fileName=@${coreComponentsTemplate}"
      ```

   3. Register the control plane component.

      ```bash
      curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/controlPlane" \
           --header "Content-Type: multipart/form-data" \
           --header "Cookie: Authorization=${TOKEN}" \
           --form "fileName=@${controlPlaneComponentsTemplate}"
      ```

   4. Register the bootstrap component.

      ```bash
      curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/bootstrap" \
           --header "Content-Type: multipart/form-data" \
           --header "Cookie: Authorization=${TOKEN}" \
           --form "fileName=@${bootstrapComponentsTemplate}"
      ```

   </details>

7. Register the cloud provider.

   ```bash
   curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/cloudProvider" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${infraComponents}"
   ```

8. Register the cluster template.

   ```bash
   curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/clusterTemplate" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${cloudClusterTemplate}"
   ```

9. Register the control plane pool template.

   ```bash
   curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/controlPlanePoolTemplate" \
        --header "Content-Type: multipart/form-data" \
        --header "Authorization: ${TOKEN}" \
        --form "fileName=@${controlPlanePoolTemplate}"
   ```

10. Register the worker pool template.

    ```bash
    curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/content/templates/workerPoolTemplate" \
         --header "Content-Type: multipart/form-data" \
         --header "Authorization: ${TOKEN}" \
         --form "fileName=@${workerPoolTemplate}"
    ```

11. Register the cloud account keys.

    ```bash
    curl --location --request PUT "${ENDPOINT}/v1/clouds/cloudTypes/${CLOUD_TYPE}/cloudAccountKeys" \
         --header "Content-Type: application/json" \
         --header "Authorization: ${TOKEN}" \
         --data '{
            "keys": [
               "NUTANIX_USER",
               "NUTANIX_PASSWORD",
               "NUTANIX_ENDPOINT",
               "NUTANIX_PORT",
               "NUTANIX_INSECURE"
            ]
         }'
    ```

### Validate

Follow the steps below to confirm that the Nutanix cloud is successfully registered with Palette.

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. Under **Cloud Accounts**, verify that **Nutanix** is listed. You may need to scroll to view the account.

## Next Steps

Now that your cloud is successfully registered with Palette, you are ready to deploy a self-hosted Private Cloud Gateway
(PCG). For guidance, review [Install Private Cloud Gateway](./install-pcg/install-pcg.md).
