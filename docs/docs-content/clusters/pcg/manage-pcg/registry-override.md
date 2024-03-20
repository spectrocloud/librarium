---
sidebar_label: "Override Registry Configuration"
title: "Override Registry Configuration"
description: "Learn how to override the image registry configuration for a Private Cloud Gateway (PCG) in Palette."
hide_table_of_contents: false
sidebar_position: 60
tags: ["pcg"]
---

You can override the image registry configuration for a Private Cloud Gateway (PCG) to use a custom image registry for
the PCG cluster. This feature is useful when you want to use a custom image registry to store and manage the images used
by the PCG cluster. The image registry configuration is applied to the PCG cluster and is used to pull the required
images for the PCG cluster.

## Prerequisites

Before you override the image registry configuration for a PCG, ensure you have the following:

- An active PCG cluster. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) to learn how to deploy a PCG.

- Access to the kubeconfig file for the PCG cluster. You need the kubeconfig file to access the PCG cluster and apply
  the image registry configuration.

  :::tip

  You can download the kubeconfig file from the PCG cluster details page in Palette. Navigate to the PCG cluster details
  page. Click on the **Admin Kubeconfig** link to download the kubeconfig file. If you need help with configuring
  kubectl to access the PCG cluster, refer to the [Access Cluster with CLI](../../cluster-management/palette-webctl.md)
  guide.

  :::

- Access to a terminal session that has network access to the PCG cluster.

- The kubectl command-line tool installed on your local machine. Refer to the
  [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) guide to learn how to install kubectl.

## Override Image Registry Configuration

Use the following steps to override the image registry configuration.

1. Open a terminal session.

2. Create an empty YAML file with the name **registry-secret.yaml**. Use the following command to create the file.

   ```shell
   touch registry-secret.yaml
   ```

3. Open the **registry-secret.yaml** file and copy the placeholder configuration below. Check the table below for a
   description of each parameter.

   ```yaml
    ---
    apiVersion: v1
    stringData:
      DOMAIN: "REPLACE_WITH_CUSTOM_REGISTRY_DOMAIN"
      BASE_PATH: "REPLACE_WITH_CUSTOM_REGISTRY_BASE_PATH"
      USERNAME: "REPLACE_WITH_CUSTOM_REGISTRY_USERNAME"
      PASSWORD: "REPLACE_WITH_CUSTOM_REGISTRY_PASSWORD"
      INSECURE: "false"
      CA_CERT: "REPLACE_WITH_CUSTOM_REGISTRY_CA_CERT"
      MIRROR_REGISTRIES: REPLACE_WITH_CUSTOM_REGISTRY_MIRROR_REGISTRIES
    kind: Secret
    metadata:
      name: registry-info
      namespace: jet-system
    type: Opaque
    ---
   ```

   :::warning

   Do not change the `kind`, `metadata` and `type` fields in the YAML file. The values provided in the placeholder
   configuration are required to override the image registry configuration for the PCG cluster.

   :::

4. Replace the placeholder values with the actual values for your custom image registry. Refer to the table below for a
   description of each parameter.

   | Parameter           | Description                                                                                                                                                                                                                                                                                                   | Required |
   | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | `DOMAIN`            | The domain of the custom image registry.                                                                                                                                                                                                                                                                      | Yes      |
   | `BASE_PATH`         | The base path of the custom image registry.                                                                                                                                                                                                                                                                   | Yes      |
   | `USERNAME`          | The username to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                    | No       |
   | `PASSWORD`          | The password to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                    | No       |
   | `INSECURE`          | Set to `true` if the custom image registry uses an insecure connection or self-signed certificate. Set to `false` if the custom image registry uses a secure connection.                                                                                                                                      | Yes      |
   | `CA_CERT`           | The Certificate Authority of the custom image registry in PEM format. Required if the custom image registry uses a self-signed certificate.                                                                                                                                                                   | No       |
   | `MIRROR_REGISTRIES` | A comma-separated list of mirror registries in [image swap format](https://github.com/phenixblue/imageswap-webhook/blob/master/docs/configuration.md) to use for pulling images. For example: `docker.io::public.ecr.aws/1234567/airgap-images/docker.io,gcr.io::public.ecr.aws/1234567/airgap-images/gcr.io` | Yes      |

    <details>
    <!-- prettier-ignore -->
    <summary>Click here for a complete example configuration.</summary>

   ```yaml
   ---
   apiVersion: v1
   stringData:
     DOMAIN: "harbor.example.org"
     BASE_PATH: "airgap-images"
     USERNAME: ""
     PASSWORD: ""
     INSECURE: "false"
     CA_CERT: ""
     MIRROR_REGISTRIES: docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-east1-docker.pkg.dev::harbor.example.org/airgap-images
   kind: Secret
   metadata:
     name: registry-info
     namespace: jet-system
   type: Opaque
   ---
   ```

    </details>

5. Once you have created the YAML file and configured the parameter values. Issue the following command to create the
   Kubernetes secret containing the image registry configuration.

   ```shell
   kubectl create --filename registry-secret.yaml
   ```

## Validate

Use the following steps to validate the image registry configuration.

1. Open a terminal session that has network access to the PCG cluster.

2. Configure kubectl to use the kubeconfig file for the PCG cluster. Use the following command to configure kubectl.
   Refer to the [Access Cluster with CLI](../../cluster-management/palette-webctl.md) for guidance on configuring
   kubectl.

3. Issue the following command to verify that the secret containing the image registry configuration is created.

   ```shell
   kubectl get secret registry-info --namespace=jet-system  \
   --output jsonpath='{.data.MIRROR_REGISTRIES}' | base64 --decode
   ```

   The command returns the mirror registries that you configured in the `MIRROR_REGISTRIES` parameter.

   ```shell hideClipboard
   docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-east1-docker.pkg.dev::harbor.example.org/airgap-images
   ```
