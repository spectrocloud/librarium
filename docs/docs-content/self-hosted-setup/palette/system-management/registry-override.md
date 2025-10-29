---
sidebar_label: "Image Registry Override"
title: "Image Registry Override"
description: "Learn how to override the default image registry for self-hosted Palette."
hide_table_of_contents: false
sidebar_position: 70
tags: ["self-hosted", "registry"]
keywords: ["self-hosted", "registry"]
---

You can override the image registry configuration for Palette to reference a different image registry. This feature is
useful when you want to use a custom image registry to store and manage the images Palette uses.

## Prerequisites

Before overriding the image registry configuration for Palette, ensure you have the following:

- A deployed and healthy self-hosted [Palette cluster](../palette.md).

- Access to the kubeconfig file for the Palette cluster. You need the kubeconfig file to access the Palette cluster and
  apply the image registry configuration.

  :::tip

  If you deployed Palette through the Palette CLI, then you can download the kubeconfig file from the Palette cluster
  details page in the system console. Navigate to the **Enterprise Cluster Migration** page. Click on the **Admin
  Kubeconfig** link to download the kubeconfig file. If you need help with configuring kubectl to access the Palette
  cluster, refer to the [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) guide. If you
  deployed Palette onto an existing Kubernetes cluster, reach out to your cluster administrator for the kubeconfig file.

  :::

- Access to a terminal session that has network access to the Palette cluster.

- The kubectl command-line tool installed on your local machine. Refer to the
  [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) guide to learn how to install kubectl.

- If you are in an airgap environment, ensure [Helm](https://helm.sh/docs/intro/install/) is installed on your local
  machine.

- If you are in an airgap environment, you must have the image-swap Helm chart available there. You can get access to
  the image-swap Helm chart by contacting the support team at
  [support@spectrocloud.com](mailto:support@spectrocloud.com)

## Override Image Registry Configuration

Select the appropriate tab below based on the environment in which your VertX cluster is deployed.

<Tabs>
<TabItem label="Airgap" value="airgap">

1. Open a terminal session.

2. Configure kubectl to use the kubeconfig file for the Palette cluster. Refer to the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) for guidance on configuring
   kubectl.

3. Navigate to the folder where you have the image-swap Helm chart available. You may have to extract the Helm chart if
   it is in a compressed format to access the **values.yaml** file.

4. Open the file **values.yaml** in a text editor and append the URL to your OCI registry that also includes the
   namespace or project that is hosting the Spectro Cloud images. The URL should be in the format
   `<registry-url>/<namespace>`. In the example configuration below, the value `my-oci-registry.com/spectro-images` is
   prefixed to each URL. Save the file after you have appended the URL.

   ```yaml hideClipboard
   image:
     cainjectorImage: "my-oci-registry.com/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-cainjector:v1.17.0-spectro-4.6.1"
     controllerImage: "my-oci-registry.com/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-controller:v1.17.0-spectro-4.6.1"
     webhookImage: "my-oci-registry.com/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-webhook:v1.17.0-spectro-4.6.1"
     amceResolverImage: "my-oci-registry.com/spectro-images/us-docker.pkg.dev/palette-images-fips/palette/spectro-cert-manager/cert-manager-acmesolver:v1.17.0-spectro-4.6.1"
   ```

5. Next, update the`ociImageRegistry` section with your OCI registry values. Refer to the table below for a description
   of each parameter.

   ```yaml
   ociImageRegistry:
     endpoint: "REPLACE_WITH_CUSTOM_REGISTRY_DOMAIN"
     name: "REPLACE_WITH_CUSTOM_REGISTRY_NAME"
     password: "REPLACE_WITH_CUSTOM_REGISTRY_PASSWORD"
     username: "REPLACE_WITH_CUSTOM_REGISTRY_USERNAME"
     baseContentPath: "REPLACE_WITH_CUSTOM_REGISTRY_BASE_PATH"
     insecureSkipVerify: false
     caCert: "REPLACE_WITH_CUSTOM_REGISTRY_CA_CERT"
     mirrorRegistries: "REPLACE_WITH_CUSTOM_REGISTRY_MIRROR_REGISTRIES"
   ```

   | Parameter            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Required |
   | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | `endpoint`           | The URL of the custom image registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Yes      |
   | `name`               | The name of the custom image registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Yes      |
   | `password`           | The password to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                                                                                                                                                                                                                           | No       |
   | `username`           | The username to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                                                                                                                                                                                                                           | No       |
   | `baseContentPath`    | The base path of the custom image registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Yes      |
   | `insecureSkipVerify` | Set to `true` if the custom image registry uses an insecure connection or a self-signed certificate. Set to `false` if the custom image registry uses a secure connection.                                                                                                                                                                                                                                                                                                                                           | Yes      |
   | `caCert`             | The Certificate Authority of the custom image registry in the PEM format. Required if the custom image registry uses a self-signed certificate.                                                                                                                                                                                                                                                                                                                                                                      | No       |
   | `mirrorRegistries`   | [image swap format](https://github.com/phenixblue/imageswap-webhook/blob/master/docs/configuration.md) for pulling images. For example: `docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images` | Yes      |

    <details>
    <!-- prettier-ignore -->
    <summary>Click here for a complete example configuration.</summary>

   ```yaml
   config:
     imageSwapImages:
       imageSwapInitImage: "harbor.example.org/airgap-images/gcr.io/spectro-images-public/release/thewebroot/imageswap-init:v1.5.2-spectro-4.1.1"
       imageSwapImage: "harbor.example.org/airgap-images/gcr.io/spectro-images-public/release/thewebroot/imageswap:v1.5.2-spectro-4.1.1"

     imageSwapConfig:
       isEKSCluster: true #If the Cluster you are trying to install is EKS cluster set value to true else set to false

     ociImageRegistry:
       endpoint: "harbor.example.org" #<Contact Spectro Cloud Sales for More info>
       name: "Internal Registry" #<Contact Spectro Cloud Sales for More info>
       password: "" #<Contact Spectro Cloud Sales for More info>
       username: "" #<Contact Spectro Cloud Sales for More info>
       baseContentPath: "airgap-images" #<Contact Spectro Cloud Sales for More info>
       insecureSkipVerify: false
       caCert: ""
       mirrorRegistries: "docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images"
   ```

    </details>

6. Once you have configured the `ociImageRegistry` section, issue the following command from the folder where you have
   the image-swap Helm chart available to deploy the image-swap Helm chart. You may have to modify the command below
   based on the location of **values.yaml** file and the compressed Helm chart file.

   ```shell
   helm upgrade --values values.yaml image-swap image-swap-*.tgz --install
   ```

   ```shell hideClipboard
   Release "image-swap" does not exist. Installing it now.
   NAME: image-swap
   LAST DEPLOYED: Mon March 20 17:04:23 2024
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   ```

7. Create an empty YAML file with the name **registry-secret.yaml**. Use the following command to create the file.

   ```shell
   touch registry-secret.yaml
   ```

8. Open the **registry-secret.yaml** file and copy the placeholder configuration below.

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
   configuration are required to override the image registry configuration for the Palette cluster.

   :::

9. Replace the placeholder values with the actual values for your custom image registry. Use the same values that you
   used in the `ociImageRegistry` section of the **values.yaml** file for the image-swap Helm chart. Refer to the table
   below for a description of each parameter.

   | Parameter           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Required |
   | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
   | `DOMAIN`            | The domain of the custom image registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Yes      |
   | `BASE_PATH`         | The base path to the custom image registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Yes      |
   | `USERNAME`          | The username to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                                                                                                                                                                                                                                                                                     | No       |
   | `PASSWORD`          | The password to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                                                                                                                                                                                                                                                                                     | No       |
   | `INSECURE`          | Set to `true` if the custom image registry uses an insecure connection or a self-signed certificate. Set to `false` if the custom image registry uses a secure connection.                                                                                                                                                                                                                                                                                                                                                                                                     | Yes      |
   | `CA_CERT`           | The Certificate Authority of the custom image registry in the PEM format. Required if the custom image registry uses a self-signed certificate.                                                                                                                                                                                                                                                                                                                                                                                                                                | No       |
   | `MIRROR_REGISTRIES` | A comma-separated list of mirror registries in the [image swap format](https://github.com/phenixblue/imageswap-webhook/blob/master/docs/configuration.md) to use for pulling images. For example: `docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images` | Yes      |

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
     MIRROR_REGISTRIES: docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images
   kind: Secret
   metadata:
     name: registry-info
     namespace: jet-system
   type: Opaque
   ---
   ```

      </details>

10. Once you have created the YAML file and configured the parameter values, issue the following command to create the
    Kubernetes secret containing the image registry configuration.

    ```shell
    kubectl create --filename registry-secret.yaml
    ```

</TabItem>
<TabItem label="Non-Airgap" value="non-airgap">

Use the following steps to override the image registry configuration.

1. Open a terminal session.

2. Configure kubectl to use the kubeconfig file for the Palette cluster. Refer to the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) for guidance on configuring
   kubectl.

3. Create an empty YAML file with the name **registry-secret.yaml**. Use the following command to create the file.

   ```shell
   touch registry-secret.yaml
   ```

4. Open the **registry-secret.yaml** file and copy the placeholder configuration below.

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
   configuration are required to override the image registry configuration for the Palette cluster.

   :::

5. Replace the placeholder values with the actual values for your custom image registry. Refer to the table below for a
   description of each parameter.

   | Parameter           | Description                                                                                                                                                                                                                                                                                                       | Required |
   | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | `DOMAIN`            | The domain of the custom image registry.                                                                                                                                                                                                                                                                          | Yes      |
   | `BASE_PATH`         | The base path to the custom image registry.                                                                                                                                                                                                                                                                       | Yes      |
   | `USERNAME`          | The username to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                        | No       |
   | `PASSWORD`          | The password to authenticate with the custom image registry. If the custom image registry does not require authentication, you can leave this field empty.                                                                                                                                                        | No       |
   | `INSECURE`          | Set to `true` if the custom image registry uses an insecure connection or a self-signed certificate. Set to `false` if the custom image registry uses a secure connection.                                                                                                                                        | Yes      |
   | `CA_CERT`           | The Certificate Authority of the custom image registry in the PEM format. Required if the custom image registry uses a self-signed certificate.                                                                                                                                                                   | No       |
   | `MIRROR_REGISTRIES` | A comma-separated list of mirror registries in the [image swap format](https://github.com/phenixblue/imageswap-webhook/blob/master/docs/configuration.md) to use for pulling images. For example: `docker.io::public.ecr.aws/1234567/airgap-images/docker.io,gcr.io::public.ecr.aws/1234567/airgap-images/gcr.io` | Yes      |

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
     MIRROR_REGISTRIES: docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images
   kind: Secret
   metadata:
     name: registry-info
     namespace: jet-system
   type: Opaque
   ---
   ```

    </details>

6. Once you have created the YAML file and configured the parameter values, issue the following command to create the
   Kubernetes secret containing the image registry configuration.

   ```shell
   kubectl create --filename registry-secret.yaml
   ```

</TabItem>
</Tabs>

## Validate

1. Open a terminal session with a network access to the VeteX cluster.

2. Configure kubectl to use the kubeconfig file for the Palette cluster. Refer to the
   [Access Cluster with CLI](../../../clusters/cluster-management/palette-webctl.md) for guidance on configuring
   kubectl.

3. Issue the following command to verify that the secret containing the image registry configuration is created.

   ```shell
   kubectl get secret registry-info --namespace=jet-system  \
   --output jsonpath='{.data.MIRROR_REGISTRIES}' | base64 --decode
   ```

   The command returns the mirror registries that you configured in the `MIRROR_REGISTRIES` parameter.

   ```shell hideClipboard
   docker.io::harbor.example.org/airgap-images/docker.io,gcr.io::harbor.example.org/airgap-images/gcr.io,ghcr.io::harbor.example.org/airgap-images/ghcr.io,k8s.gcr.io::harbor.example.org/airgap-images/gcr.io,registry.k8s.io::harbor.example.org/airgap-images/k8s.io,quay.io::harbor.example.org/airgap-images/quay.io,us-docker.pkg.dev::harbor.example.org/airgap-images
   ```

4. Deploy a cluster through Palette. Palette will propagate the image registry configuration to the workload cluster,
   and the cluster will use the custom image registry to pull images if specified in the mirror registry configuration.

5. SSH into one of the workload cluster nodes. You can verify the image registry configuration on the workload cluster
   by checking the containerd configuration file. Use the following command to check the containerd configuration file.

   ```shell
   cat /etc/containerd/config.toml
   ```

   Each mirror registry specified in the `MIRROR_REGISTRIES` parameter is added to the
   `plugins."io.containerd.grpc.v1.cri".registry.mirrors.` section. Based on the example configuration we provided in
   step four, the configuration file should contain the following details.

   ```yaml {19-33}
   ## template: jinja

   # Use config version 2 to enable new configuration fields.
   # Config file is parsed as version 1 by default.
   version = 2

   imports = ["/etc/containerd/conf.d/*.toml"]

   [plugins]
     [plugins."io.containerd.grpc.v1.cri"]
     [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
       runtime_type = "io.containerd.runc.v2"
     [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
       SystemdCgroup = true


     # contains spectro changes
     [plugins."io.containerd.grpc.v1.cri".registry]
       [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
           endpoint = ["harbor.example.org/airgap-images/docker.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."gcr.io"]
           endpoint = ["harbor.example.org/airgap-images/gcr.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."ghcr.io"]
           endpoint = ["harbor.example.org/airgap-images/ghcr.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."k8s.gcr.io"]
           endpoint = ["harbor.example.org/airgap-images/gcr.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."registry.k8s.io"]
           endpoint = ["harbor.example.org/airgap-images/k8s.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."quay.io"]
           endpoint = ["harbor.example.org/airgap-images/quay.io"]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."us-docker.pkg.dev"]
           endpoint = ["harbor.example.org/airgap-images"]
   ```
