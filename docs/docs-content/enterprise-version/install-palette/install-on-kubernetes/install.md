---
sidebar_label: "Non-Airgap Installation"
title: "Install Non-Airgap Self-Hosted Palette"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "enterprise"]
keywords: ["self-hosted", "enterprise"]
---

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment.

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) is installed and available.

- [Helm](https://helm.sh/docs/intro/install/) is installed and available.

- Access to the target Kubernetes cluster's kubeconfig file. You must be able to interact with the cluster using
  `kubectl` commands and have sufficient permissions to install Palette. We recommend using a role with cluster-admin
  permissions to install Palette.

- Ensure `unzip` or a similar extraction utility is installed on your system.

- The Kubernetes cluster must be set up on a supported version of Kubernetes. Refer to the
  [Kubernetes Requirements](../install-palette.md#kubernetes-requirements) section to find the version required for your
  Palette installation.

- Ensure the Kubernetes cluster does not have Cert Manager installed. Palette requires a unique Cert Manager
  configuration to be installed as part of the installation process. If Cert Manager is already installed, you must
  uninstall it before installing Palette.

- Palette requires a Container Storage Interface (CSI) to create Persistent Volumes, which are used to store persistent
  data. You may install any CSI that is compatible with your Kubernetes cluster.

- If you are using a _self-hosted MongoDB_ instance, such as MongoDB Atlas, ensure the MongoDB database has a user named
  `hubble` with the permission `readWriteAnyDatabase`. Refer to the
  [Add a Database User](https://www.mongodb.com/docs/guides/atlas/db-user/) guide for guidance on how to create a
  database user in Atlas.

- We recommended the following resources for Palette. Refer to the
  [Palette size guidelines](../install-palette.md#size-guidelines) for additional sizing information.

  - 8 CPUs per node.

  - 16 GB Memory per node.

  - 110 GB Disk Space per node.

  - A minimum of three worker nodes or three untainted control plane nodes.

  - AMD64 (also known as x86_64) architecture. ARM-based nodes are not supported.

- The following network ports must be accessible for Palette to operate successfully.

  - TCP/443: Inbound and outbound to and from the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed clusters' Kubernetes API server.

- Ensure you have an SSL certificate that matches the domain name you will assign to Palette. You will need this to
  enable HTTPS encryption for Palette. Reach out to your network administrator or security team to obtain the SSL
  certificate. You need the following files:

  - x509 SSL certificate file in base64 format.

  - x509 SSL certificate key file in base64 format.

  - x509 SSL certificate authority file in base64 format.

- A [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) to manage persistent storage, with the
  annotation `storageclass.kubernetes.io/is-default-class` set to `true`. To override the default StorageClass for a
  workload, modify the `storageClass` parameter. Check out the
  [Change the default StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)
  page to learn more about modifying StorageClasses.

- Palette uses Traefik as the ingress controller. If you already have an ingress controller deployed in the cluster, set
  the `ingress.enabled` parameter to `false` in the `values.yaml` file.

- A custom domain and the ability to update Domain Name System (DNS) records. You will need this to enable HTTPS
  encryption for Palette.

- If you are installing Palette behind a network proxy server, ensure you have the Certificate Authority (CA)
  certificate file in the base64 format. You will need this to enable Palette to communicate with the network proxy
  server.

- Ensure Palette has access to the required domains and ports. Refer to the
  [Required Domains](../install-palette.md#proxy-requirements) section for more information.

- Access to the Palette Helm Charts. Refer to the [Access Palette](../../enterprise-version.md#access-palette) for
  instructions on how to request access to the Helm Chart

:::warning

Do not use a Palette-managed Kubernetes cluster when installing Palette. Palette-managed clusters contain the Palette
agent and Palette-created Kubernetes resources that will interfere with the installation of Palette.

:::

## Install Palette

The following instructions are written agnostic to the Kubernetes distribution you are using. Depending on the
underlying infrastructure provider and your Kubernetes distribution, you may need to modify the instructions to match
your environment. Reach out to our support team if you need assistance.

1.  Open a terminal session and navigate to the directory where you downloaded the Palette install zip file provided by
    our support team. Unzip the file to a directory named `palette-install`.

    ```shell
    unzip charts.zip -d palette-install
    ```

2.  Navigate to the `palette-install` directory.

    ```shell
    cd palette-install
    ```

    ### Cert-Manager Helm Chart

3.  Open the file `extras/cert-manager/values.yaml` using a text editor of your choice. This example uses Vim.

    ```shell
    vim extras/cert-manager/values.yaml
    ```

4.  If you plan to pull images from Spectro Cloud OCI registries, paste the image pull secret received from your
    customer support representative into the `imagePullSecret.dockerConfigJson` field. It is not required if you plan to
    use mirror registries or image swap.

    Alternately, if you plan to pull images from a private registry that requires authentication, use the base64-encoded
    contents of your `config.json` containing the registry credentials. Refer to
    [Helm Configuration Reference](./palette-helm-ref.md#image-pull-secret) for more information.

    :::info

    If you omit the image pull secret during installation, you must provide it through the system console. Refer to
    [Configure Image Pull Secret for Security-Hardened Images](../../configure-image-pull-secret/configure-image-pull-secret.md)
    for more information.

    :::

    ```yaml title="Example configuration" hideClipboard {5}
    imagePullSecret:
      # When true, render Secret spectro-image-pull-secret in the cert-manager namespace.
      # Pods automatically reference that pull secret when create is true or the secret already exists (PEM-10596).
      create: false
      dockerConfigJson: "abcdEFGhiJKlmnOPQrSTUVwX..." # Used when create is true: base64-encoded dockerconfigjson
    ```

5.  Install the Cert-Manager Helm chart.

    ```shell
    helm upgrade --install cert-manager \
      ./extras/cert-manager/cert-manager-*.tgz \
      --namespace cert-manager \
      --create-namespace \
      --values ./extras/cert-manager/values.yaml
    ```

    ```shell hideClipboard title="Example output"
    Release "cert-manager" does not exist. Installing it now.
    NAME: cert-manager
    LAST DEPLOYED: Wed Jun 17 12:54:27 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

    ### Spectro Management CRDs Helm Chart

6.  Install the Spectro Management CRDs chart. This chart contains Custom Resource Definitions (CRDs) required by
    Palette, including Traefik CRDs, and must be installed before the main Palette Helm chart. When the chart is
    installed, the custom resource types are registered with the Kubernetes API server; no pods are deployed.

    ```shell
    helm upgrade --install spectro-mgmt-crds \
      extras/spectro-mgmt-crds/spectro-mgmt-crds-*.tgz \
      --values extras/spectro-mgmt-crds/values.yaml
    ```

    ```shell hideClipboard title="Example output"
    Release "spectro-mgmt-crds" does not exist. Installing it now.
    NAME: spectro-mgmt-crds
    LAST DEPLOYED: Wed Jun 17 21:17:39 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

    ### Palette Helm Chart

7.  Open the file `palette/values.yaml` using a text editor of your choice. This example uses Vim.

    ```shell
    vim palette/values.yaml
    ```

8.  The file `palette/values.yaml` contains the default values for the Palette installation parameters. You must
    populate the following parameters before installing Palette. For a complete list of fields and additional
    information, refer to [Helm Configuration Reference](./palette-helm-ref.md).

    | **Parameter**                             | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **Type** |
    | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
    | `global.imagePullSecret.dockerConfigJson` | If you plan to pull images from Spectro Cloud OCI registries (without mirror registries or image swap configured) or images from private registries that require authentication, paste your image pull secret here. This must match the image pull secret configured for [Cert-Manager](#cert-manager-helm-chart). If you omit the image pull secret during installation, you must provide it through the system console. Refer to [Configure Image Pull Secret for Security-Hardened Images](../../configure-image-pull-secret/configure-image-pull-secret.md) for more information. | string   |
    | `env.rootDomain`                          | The URL name or IP address you will use for the Palette installation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | string   |
    | `ociPackRegistry` or `ociPackEcrRegistry` | The OCI registry credentials for Palette FIPS packs. These credentials are provided by our support team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | object   |
    | `ingress.enabled`                         | Whether to install the Traefik ingress controller. Set to `false` if you already have an ingress controller deployed in the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                  | boolean  |
    | `reachSystem`                             | Set `reach-system.enabled` to `true` and configure the `reach-system.proxySettings` parameters to configure Palette to use a network proxy in your environment                                                                                                                                                                                                                                                                                                                                                                                                                        | object   |
    | `mongo.storageClass`                      | If you do not have a default storage class in your cluster (the annotation `"storageclass.kubernetes.io/is-default-class":"true"`), enter the name of the storage class to use for your Palette installation.                                                                                                                                                                                                                                                                                                                                                                         | string   |

    #### Self-Hosted OCI Registries

    The following parameters are required if you pull Palette images from a self-hosted OCI registry instead of a
    Spectro Cloud OCI registry or AWS ECR.

    :::tip

    If you would prefer to keep your image swap values in a separate location, you can use the following table to
    complete the `extras/image-swap/values.yaml` file instead.

    ```shell
    tar --extract --verbose --gzip --file extras/image-swap/image-swap-*.tgz --directory extras/
    vim extras/image-swap/values.yaml
    ```

    :::

    | **Parameter**                       | **Description**                                                                                                                                                                                                                     | **Type** |
    | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
    | `ociImageRegistry`                  | Configure the registry endpoint, credentials, and `mirrorRegistries` values. Refer to the [Helm Configuration Reference](./palette-helm-ref.md#oci-image-registry) page for parameter descriptions.                                 | object   |
    | `ociImageRegistry.mirrorRegistries` | A comma-separated list of mirror registries in image swap format that maps public registry paths to your private registry. Refer to the [Helm Configuration Reference](./palette-helm-ref.md#oci-image-registry) page for examples. | string   |
    | `imageSwapImages`                   | The Image Swap init and webhook images. If you host these images in your OCI registry, replace the image paths with your registry URL and namespace or project.                                                                     | object   |
    | `imageSwapConfig.isEKSCluster`      | Set to `true` if you are installing Palette on an Amazon EKS cluster. Set to `false` for all other Kubernetes distributions.                                                                                                        | boolean  |

    :::info

    Include `/v2` in your mirror registry endpoints if you are using a
    [Harbor registry with a proxy cache](https://goharbor.io/docs/2.1.0/administration/configure-proxy-cache/) project.
    Harbor proxy cache projects use `/v2` as part of their internal URL routing for cached images. For all other
    registries, omit `/v2`, as the container runtime automatically appends `/v2` when making API calls. Including `/v2`
    for non-proxy-cache registries results in a doubled `/v2/v2/` path, which causes image pull failures. For example:
    `docker.io::harbor.example.org/v2/proxy-cache-project/docker.io`.

    :::

9.  Save the completed `palette/values.yaml` file. Expand the following sections to review an example of the
    `palette/values.yaml` file with the required parameters highlighted.

    <!-- prettier-ignore -->
    <Tabs>

    <TabItem label="AWS ECR Registry" value="ecr">

    ```yaml hideClipboard title="Example values.yaml" {60,84-92}
    #########################
    # Spectro Cloud Palette #
    #########################

    global:
      imagePullSecret:
        # Provide your own base64 encoded dockerconfigjson value below if using ImagePullSecret for Private registry Authentication
        dockerConfigJson: "abcdEFGhiJKlmnOPQrSTUVwX..."

    # MongoDB Configuration
    mongo:
      # Whether to deploy MongoDB in-cluster (internal == true) or use Mongo Atlas
      internal: true

      # Mongodb URL. Only change if using Mongo Atlas.
      databaseUrl: "mongo-0.mongo,mongo-1.mongo,mongo-2.mongo"
      # Mongo Atlas password, base64 encoded. Only enter if using Mongo Atlas.
      databasePassword: ""

      #No. of mongo replicas to run, default is 3
      replicas: 3
      # The following only apply if mongo.internal == true
      cpuLimit: "2000m"
      memoryLimit: "4Gi"
      pvcSize: "20Gi"
      storageClass: "" # leave empty to use the default storage class

    config:
      installationMode: "connected" #values can be connected or airgap.

      # SSO SAML Configuration (Optional for self-hosted type)
      sso:
        saml:
          enabled: false
          acsUrlRoot: "myfirstpalette.spectrocloud.com"
          acsUrlScheme: "https"
          audienceUrl: "https://www.spectrocloud.com"
          entityId: "https://www.spectrocloud.com"
          apiVersion: "v1"

      # Email Configurations. (Optional for self-hosted type)
      email:
        enabled: false
        emailId: "noreply@spectrocloud.com"
        smtpServer: "smtp.gmail.com"
        smtpPort: 587
        insecureSkipVerifyTls: true
        fromEmailId: "noreply@spectrocloud.com"
        password: "" # base64 encoded SMTP password

      env:
        # rootDomain is a DNS record which will be mapped to the traefik-ingress-controller load balancer
        # E.g., myfirstpalette.spectrocloud.com
        # - Mandatory if ingress.internal == false
        # - Optional if ingress.internal == true (leave empty)
        #
        # IMPORTANT: a DNS record must be created separately and it must be a wildcard to account for Organization prefixes
        # E.g., *.myfirstpalette.spectrocloud.com
        rootDomain: "palette.example.com"

      # stableEndpointAccess is used when deploying EKS clusters in Private network type.
      # When your Saas installed instance have connectivity to the private VPC where you want to launch the cluster set the stableEndpointAccess to true
      cluster:
        stableEndpointAccess: false

      #  registry:
      #    endpoint: "" #<Contact Spectro Cloud Sales for More info>
      #    name: "" #<Contact Spectro Cloud Sales for More info>
      #    password: "" #<Contact Spectro Cloud Sales for More info>
      #    username: "" #<Contact Spectro Cloud Sales for More info>
      #    insecureSkipVerify: false
      #    caCert: ""

      #  ociPackRegistry:
      #    endpoint: "" #<Contact Spectro Cloud Sales for More info>
      #    name: "" #<Contact Spectro Cloud Sales for More info>
      #    password: "" #<Contact Spectro Cloud Sales for More info>
      #    username: "" #<Contact Spectro Cloud Sales for More info>
      #    baseContentPath: "" #<Contact Spectro Cloud Sales for More info>
      #    insecureSkipVerify: false
      #    caCert: ""

      ociPackEcrRegistry:
        endpoint: "15789037893.dkr.ecr.us-east-1.amazonaws.com" #<Contact Spectro Cloud Sales for More info>
        name: "Palette Packs OCI" #<Contact Spectro Cloud Sales for More info>
        accessKey: "**************" #<Contact Spectro Cloud Sales for More info>
        secretKey: "**************" #<Contact Spectro Cloud Sales for More info>
        baseContentPath: "production" #<Contact Spectro Cloud Sales for More info>
        isPrivate: true
        insecureSkipVerify: false
        caCert: ""

      #  ociImageRegistry:
      #    endpoint: "" #<Contact Spectro Cloud Sales for More info>
      #    name: "" #<Contact Spectro Cloud Sales for More info>
      #    password: "" #<Contact Spectro Cloud Sales for More info>
      #    username: "" #<Contact Spectro Cloud Sales for More info>
      #    baseContentPath: "" #<Contact Spectro Cloud Sales for More info>
      #    insecureSkipVerify: false
      #    caCert: ""
      #    mirrorRegistries: ""  # See instructions below.

      # Instruction for mirrorRegistries.
      # ----------------------------------
      # Please provide the registry endpoint for the following registries, separated by double colons (::):
      # docker.io
      # gcr.io
      # ghcr.io
      # k8s.gcr.io
      # registry.k8s.io
      # quay.io
      # For each registry, follow this example format:
      # docker.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<DOCKER_IO_ENDPOINT>,gcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<GCR_IO_ENDPOINT>,ghcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<GHCR_IO_ENDPOINT>,k8s.gcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<K8S_IO_ENDPOINT>,registry.k8s.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<REGISTRY_K8S_IO_ENDPOINT>,quay.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<QUAY_IO_ENDPOINT>,us-docker.pkg.dev::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<US_DOCKER_ENDPOINT>
      # Replace <PLACE_HOLDER_FOR_ENDPOINT> with your actual registry endpoint and <DOCKER_IO_ENDPOINT>, <GCR_IO_ENDPOINT>, <GHCR_IO_ENDPOINT>, <K8S_IO_ENDPOINT>, <REGISTRY_K8S_IO_ENDPOINT>, and <QUAY_IO_ENDPOINT> with the specific endpoint details for each registry.

      imageSwapImages:
        imageSwapInitImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.9.0"
        imageSwapImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.9.0"

      imageSwapConfig:
        isEKSCluster: true #If the Cluster you are trying to install is EKS cluster set value to true else set to false

    grpc:
      external: false
      endpoint: "" #Please provide DNS endpoint with the port eg: msg.spectrocloud.com:443
      annotations: {}
      # AWS example
      # service.beta.kubernetes.io/aws-load-balancer-internal: "true"
      # service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
      # service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"

      # Azure example
      # service.beta.kubernetes.io/azure-load-balancer-internal: "true"
      # service.beta.kubernetes.io/azure-dns-label-name: myserviceuniquelabel

      # Static IP for the GRPC load balancer service. If empty, a dynamic IP will be generated.
      grpcStaticIP: ""
      caCertificateBase64: "" #Please provide caCertificate for the grpc server Cert
      serverCrtBase64: ""
      serverKeyBase64: ""
      insecureSkipVerify: false
    tunnel:
      preferredServer:
        endpoint: ""
      servers:
        - endpoint: ""
    ingress:
      msgbroker:
        proxyBodySize: "15m" # Default proxy body size for msgbroker ingress
      # When enabled, the Traefik ingress controller is installed.
      enabled: true

      ingress:
        # Default SSL certificate and key for the ingress controller (Optional)
        # A wildcard cert for config.env.rootDomain, e.g., *.myfirstpalette.spectrocloud.com
        # If left blank, a self-signed cert is generated.
        certificate: ""
        key: ""

        #If ACM is enabled please use grpc as a non internal and bring grpc on different LB. Provide certificate and dns for it.
        annotations: {}
        # AWS example
        # service.beta.kubernetes.io/aws-load-balancer-internal: "true"
        # service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
        # service.beta.kubernetes.io/aws-load-balancer-ssl-cert: <ACM_ARN>
        # service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
        # service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: '*'

        # Azure example
        # service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        # service.beta.kubernetes.io/azure-dns-label-name: myserviceuniquelabel

        # Static IP for the Ingress load balancer service. If empty, a dynamic IP will be generated.
        ingressStaticIP: ""

        # For Service like AWS Load Balancer using https we would want to terminate the HTTPS at Load Balancer.
        terminateHTTPSAtLoadBalancer: false

    frps:
      frps:
        enabled: false
        frpHostURL: proxy.sample.spectrocloud.com
        server:
          crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURqekNDQW5lZ0F3SUJBZ0lVZTVMdXBBZGljd0Z1SFJpWWMyWEgzNTFEUzJJd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk1qY3hNREV6TVRNeU5ERXlXakI3TVFzd0NRWURWUVFHRXdKVlV6RUxNQWtHCkExVUVDQk1DUTBFeEV6QVJCZ05WQkFjVENsTmhiblJoUTJ4aGNtRXhGVEFUQmdOVkJBb1RERk53WldOMGNtOUQKYkc5MVpERUxNQWtHQTFVRUN4TUNTVlF4SmpBa0JnTlZCQU1USFhCeWIzaDVMbk5oYlhCc1pTNXpjR1ZqZEhKdgpZMnh2ZFdRdVkyOXRNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXd5bEt3MmlxClBXM2JrQU0wV3RhaEFLbEppcWFHd05LUDVRRTZ6ZW5NM2FURko3TjIwN0dWcUNGYzJHTDNodmNhTDFranZjeEkKK2lybHpkbm9hcVhUSmV3ZkJiTGs2SGVhZmdXUVp3NHNNeE5QRUVYYlNXYm54Mm03Y2FlbVJiUWZSQWhPWXRvWgpIWG1IMzQ1Q25mNjF0RnhMeEEzb0JRNm1yb0JMVXNOOUh2WWFzeGE5QUFmZUNNZm5sYWVBWE9CVmROalJTN1VzCkN5NmlSRXpEWFgvem1nOG5WWFUwemlrcXdoS3pqSlBJd2FQa2ViaXVSdUJYdEZ0VlQwQmFzS3VqbURzd0lsRFQKVmR4SHRRQUVyUmM4Q2Nhb20yUkpZbTd1aHNEYlo2WVFzS3JiMmhIbU5rNENVWUd5eUJPZnBwbzR2bFd1S2FEcgpsVFNYUXlPN0M0ejM1d0lEQVFBQm8xNHdYREJhQmdOVkhSRUVVekJSZ2dsc2IyTmhiR2h2YzNTSEJIOEFBQUdDCkhYQnliM2g1TG5OaGJYQnNaUzV6Y0dWamRISnZZMnh2ZFdRdVkyOXRnaDhxTG5CeWIzaDVMbk5oYlhCc1pTNXoKY0dWamRISnZZMnh2ZFdRdVkyOXRNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUEvRFJFVm54SWJRdi9uMDEvSQpJd1d0ekhKNGNHOUp6UlB6dmszNUcvRGJOVzZYZ0M3djBoWlFIVHg5bzMrckxoSUFiWTNmbjc1VEtlN3hMRWpiCkI3M3pGWURJSStkYzM5NkQzZU51M2NxRGIvY01kYmlFalhod2ttZk9NRm9qMnpOdHJIdzFsSjA0QlNFMWw1YWgKMDk0Vy9aaEQ2YTVLU3B0cDh1YUpKVmNrejRYMEdRWjVPYjZadGdxZVVxNytqWVZOZ0tLQzJCMW1SNjMyMDNsZwozVFZmZEkrdmI3b292dVdOOFRBVG9qdXNuS25WMmRMeTFBOWViWXYwMEM3WWZ6Q0NhODgrN2dzTGhJaUJjRHBPClJkWjU3QStKanJmSU5IYy9vNm5YWFhDZ2h2YkFwUVk1QnFnMWIzYUpUZERNWThUY0hoQVVaQzB5eU04bXcwMnQKWHRRQwotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
          key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBd3lsS3cyaXFQVzNia0FNMFd0YWhBS2xKaXFhR3dOS1A1UUU2emVuTTNhVEZKN04yCjA3R1ZxQ0ZjMkdMM2h2Y2FMMWtqdmN4SStpcmx6ZG5vYXFYVEpld2ZCYkxrNkhlYWZnV1FadzRzTXhOUEVFWGIKU1dibngybTdjYWVtUmJRZlJBaE9ZdG9aSFhtSDM0NUNuZjYxdEZ4THhBM29CUTZtcm9CTFVzTjlIdllhc3hhOQpBQWZlQ01mbmxhZUFYT0JWZE5qUlM3VXNDeTZpUkV6RFhYL3ptZzhuVlhVMHppa3F3aEt6akpQSXdhUGtlYml1ClJ1Qlh0RnRWVDBCYXNLdWptRHN3SWxEVFZkeEh0UUFFclJjOENjYW9tMlJKWW03dWhzRGJaNllRc0tyYjJoSG0KTms0Q1VZR3l5Qk9mcHBvNHZsV3VLYURybFRTWFF5TzdDNHozNXdJREFRQUJBb0lCQUFPVVZFeTFOTG9mczdFMgpmZFZVcm10R3I1U2RiVWRJRlYrTDREbzZtWWxQSmxhT0VoWGI0ZlROZDloNEtEWVBmaWwwSnhXcUU0U1RHTmZuCnNUMlRnUVhuQ01LZi8xYk1Lc2M0N3VjVStYYU9XaHJnVFI5UmhkckFjN0duODRLL3hQc0ljL2VZTEhHLzh1QUUKeWUvLzVmRkM2QmpXY0hUM1NkTlZnd3duamJudG5XTXIzTFJBVnJBamZBckxveWUwS0F2YytYdXJLTEVCcmMyVQpjaHlDbitZemJKN0VlSG44UXdQNGdBNXVSK0NCMFJPeFErYXIzS3M5YUhkZTQ1OEVNNEtLMnpUOXA4RWZRc1lFCkFtNUpxWjliR0JEVHV1dEkyNm9GK0pLQ1IzZzhXNERRcHVYRUZoVjlya0pMSm13RDhQb0JaclF6UzZvdmJhdkkKRk42QVM4RUNnWUVBOEcxQzFxZVh4dTQ4aEYxak5MTCswRmxkeWdFem9SMmFoRGJCai8weUZkQVVjU2pYTzk0NAozN1dORTBUUG10WG1Vc3NZTlBTR21XaWI2OUhicEFoMTY3SWVwNE9LaVlZdkozYm1oUC9WNzFvK3M0SWJlSHh1CkVJbWVVckFOZWRoQURVQnZ4c1lXRWxlVlVJSFFRcjY1VHM2ZjIrWkpTKzg4TU05bUorL3BmcmNDZ1lFQXo4MXgKR3JiSE5oak56RjhZMjhiK0hMNW5rdDR0SUdkU3hnbW9PMFFJeGkrQVNZTzB0WW42VFk0ZHI5ZXErMzE3b21ZawpMbDNtNENORDhudG1vYzRvWnM4SUpDQ0IrZjNqcTY4OHdoQU9vVHZ4dDhjZVJqOFRhRHl1SHZwS043OVNsVVd2CjBJd2ZRNDNIemd3SWJiSWhjcTRJVGswanI0VHdWbThia283VElGRUNnWUJoNnUzVXhHN0JHeGZVaE1BNW4waSsKREJkeGhPbkZEV3gzdW1FOHhrN1dxV2NaNnhzMWk3eTRCNVhNS2pNdkNUeURyYWxQTCtOOXFTZ1BjK216TmFybwo4aU1mOENmRStMeE5vMVFoQ0p6Vm5YaDUzVnhZeHJ5QXlidU1TNTFCYVh3MHFYQ2NrT0krV0NNOHBaSHZEUVFsCmYydUZ3SlZMY3NTZDBHbjNpL01ab3dLQmdBY1BzUjg2Uk15MnpROTd6OGx3R3FSNVorV2F2U2ZUdXdGVnhLeTIKNUNGdjdja1J1NnRMbEFEY3FtK1dRWTRvTm5KUFREMXpIV3hTWm5XdjhjM2Z4b212MFZRQThzbSs4ZVNjb05EcgpZTVBqMkpQcEpVTTMwMzRBU2Q1dG5PWUdEMVZaTjk4N1U3aWs4Ynd6dG5tYnl2MHRvc1NlWkc4TGNtdE5mVDllCnNSZnhBb0dCQUpTV1lDellyTlRMNnRUSnh5M2FqWm5jZkxrMEV0eWNCd05FRXZHVzVSVE9LOUFYTE96RzN0eHUKajZqWlRpaUFRU09aaVd0clJHU0U0bEkyQ1MvcjNjd3VuSGlnZlovd1dKZldkZ0JpRnZqOTVFbUVQWUZaRDRobQpkT3l5UHhRRXFTRmprQ21BS2plOFBpTDdpU01GbGhBZTZQWFljQlExdCtzd01UeXBnY3RrCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
        ca:
          crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURNVENDQWhtZ0F3SUJBZ0lVSHhWK0ljVGZHUElzdW8yY3dqQ0Q0Z2RSTFFRd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk16WXdOakl5TVRNeU5ERXlXakFvTVNZd0pBWURWUVFEREIxd2NtOTRlUzV6CllXMXdiR1V1YzNCbFkzUnliMk5zYjNWa0xtTnZiVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0MKQVFvQ2dnRUJBSy90WXBHVi9HRURUWnZzL25QQ2lOK0U3K1dOQ21GeU1NQjdkazVOT3JzQWZIaVVvZ1JRVUo0WQptSjhwVmYrSzhTRFBsdGNYcW40WVVTbmxiUERsVlBkWU5zOTEwT3RaS1EwNW96aUtGV2pNbS85NHlLSjVyVzNsCndDNEN0ayttUm9Ib0ZQQS81dmFVbVZHdlVadjlGY0JuL0pKN2F4WnRIQk1PRiticXQ0Zmd0ci9YMWdOeWhPVzUKZTVScGpESkozRjJTVnc5NUpBQSt4a3V3UitFSmVseEtnQVpxdDc0ejB4U2ROODZ0QzNtK0wxRGs2WVVlQWEzZApvM3Rsa3ZkeDV6dUJvSmI2QmpZWEV4UE1PbThRcHFNVWRLK3lDZUdrem9XQStDOUtFdGtVaERCWktENStNWXRZCktVMUh1RXJCbmw2Z3BuWTRlbzJjVTRxdkNwZzZ4S3NDQXdFQUFhTlRNRkV3SFFZRFZSME9CQllFRklKMkRkTjgKc2ZtVjRCT1ZFL0FjZ0VEejArNmlNQjhHQTFVZEl3UVlNQmFBRklKMkRkTjhzZm1WNEJPVkUvQWNnRUR6MCs2aQpNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQWhQVi9RMVl1YWVTOTZVCmhjVGQ4RWdJaHhpbHFiTWlTQm5WaVdrdlJzWk94UUIwNTFScWtwT3g0UTRsckdaOGVJWWc3T0trTTdzejhuTVQKL2pxS21sZDY0MzJCcURCMlNkNVp5ZFdReHAwU1laRTlnVWszYk9KRGtZVXQ4b1cvZDBWeG9uU05LQVN3QmZKaApWV1VZUUlpNm55K0ZZZmtuRFNvRnFlY2Z3SDBQQVUraXpnMkI3KzFkbko5YisyQ21IOUVCallOZ2hoNlFzVlFQCkh2SkdQQURtandPNkJOam5HK0Z3K0Z6cmFXUTNCTjAwb08zUjF6UmgxZERmTTQzR3oxRmZGRW5GSXI5aGFuUnQKWHJFZm8vZWU5bjBLWUFESEJnV1g4dlhuNHZrRmdWRjgwYW9MUUJSQTBxWXErcW1pVlp6YnREeE9ldFEyRWFyTQpyNmVWL0lZPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
        service:
          annotations: {}

    ui-system:
      enabled: true
      ui:
        nocUI:
          enable: true
          mapBoxAccessToken: "" # Leave Empty to use Default Access Token from Palette
          mapBoxStyledLayerID: "" # Leave Empty to use Default Style Layer ID

    reachSystem:
      enabled: false
      proxySettings:
        http_proxy: ""
        https_proxy: ""
        no_proxy: ""
        ca_crt_path: "" # Set the 'ca_crt_path' parameter to the location of the certificate file on each node. This file should contain the Proxy CA Certificate, in case the Proxy being used requires a certificate.
      scheduleOnControlPlane: true
    ```

    </TabItem>

    <TabItem label="OCI Registry" value="oci">

    ```yaml hideClipboard title="Example values.yaml" {61,76-83,95-103}
    #########################
    # Spectro Cloud Palette #
    #########################

    global:
      imagePullSecret:
        # Provide your own base64 encoded dockerconfigjson value below if using ImagePullSecret for Private registry Authentication
        dockerConfigJson: "abcdEFGhiJKlmnOPQrSTUVwX..."

    # MongoDB Configuration
    mongo:
      # Whether to deploy MongoDB in-cluster (internal == true) or use Mongo Atlas
      internal: true

      # Mongodb URL. Only change if using Mongo Atlas.
      databaseUrl: "mongo-0.mongo,mongo-1.mongo,mongo-2.mongo"
      # Mongo Atlas password, base64 encoded. Only enter if using Mongo Atlas.
      databasePassword: ""

      #No. of mongo replicas to run, default is 3
      replicas: 3
      # The following only apply if mongo.internal == true
      cpuLimit: "2000m"
      memoryLimit: "4Gi"
      pvcSize: "20Gi"
      storageClass: "" # leave empty to use the default storage class

    config:
      installationMode: "connected" #values can be connected or airgap.
      isPaletteBaseCluster: false

      # SSO SAML Configuration (Optional for self-hosted type)
      sso:
        saml:
          enabled: false
          acsUrlRoot: "myfirstpalette.spectrocloud.com"
          acsUrlScheme: "https"
          audienceUrl: "https://www.spectrocloud.com"
          entityId: "https://www.spectrocloud.com"
          apiVersion: "v1"

      # Email Configurations. (Optional for self-hosted type)
      email:
        enabled: false
        emailId: "noreply@spectrocloud.com"
        smtpServer: "smtp.gmail.com"
        smtpPort: 587
        insecureSkipVerifyTls: true
        fromEmailId: "noreply@spectrocloud.com"
        password: "" # base64 encoded SMTP password

      env:
        # rootDomain is a DNS record which will be mapped to the traefik-ingress-controller load balancer
        # E.g., myfirstpalette.spectrocloud.com
        # - Mandatory if ingress.internal == false
        # - Optional if ingress.internal == true (leave empty)
        #
        # IMPORTANT: a DNS record must be created separately and it must be a wildcard to account for Organization prefixes
        # E.g., *.myfirstpalette.spectrocloud.com
        rootDomain: "palette.example.com"

      # stableEndpointAccess is used when deploying EKS clusters in Private network type.
      # When your Saas installed instance have connectivity to the private VPC where you want to launch the cluster set the stableEndpointAccess to true
      cluster:
        stableEndpointAccess: false

        #  registry:
        #    endpoint: "" #<Contact Spectro Cloud Sales for More info>
        #    name: "" #<Contact Spectro Cloud Sales for More info>
        #    password: "" #<Contact Spectro Cloud Sales for More info>
        #    username: "" #<Contact Spectro Cloud Sales for More info>
        #    insecureSkipVerify: false
        #    caCert: ""

        ociPackRegistry:
          endpoint: "example.harbor.org" #<Contact Spectro Cloud Sales for More info>
          name: "Palette Packs OCI" #<Contact Spectro Cloud Sales for More info>
          password: "**************" #<Contact Spectro Cloud Sales for More info>
          username: "**************" #<Contact Spectro Cloud Sales for More info>
          baseContentPath: "spectro-packs" #<Contact Spectro Cloud Sales for More info>
          insecureSkipVerify: false
          caCert: ""

        # ociPackEcrRegistry:
        #  endpoint: "" #<Contact Spectro Cloud Sales for More info>
        #  name: "" #<Contact Spectro Cloud Sales for More info>
        #  accessKey: "" #<Contact Spectro Cloud Sales for More info>
        #  secretKey: "" #<Contact Spectro Cloud Sales for More info>
        #  baseContentPath: "" #<Contact Spectro Cloud Sales for More info>
        #  isPrivate: true
        #  insecureSkipVerify: false
        #  caCert: ""

        ociImageRegistry:
          endpoint: "" #<Contact Spectro Cloud Sales for More info>
          name: "" #<Contact Spectro Cloud Sales for More info>
          password: "" #<Contact Spectro Cloud Sales for More info>
          username: "" #<Contact Spectro Cloud Sales for More info>
          baseContentPath: "" #<Contact Spectro Cloud Sales for More info>
          insecureSkipVerify: false
          caCert: ""
          mirrorRegistries: "" # See instructions below.

      # Instruction for mirrorRegistries.
      # ----------------------------------
      # Please provide the registry endpoint for the following registries, separated by double colons (::):
      # docker.io
      # gcr.io
      # ghcr.io
      # k8s.gcr.io
      # registry.k8s.io
      # quay.io
      # For each registry, follow this example format:
      # docker.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<DOCKER_IO_ENDPOINT>,gcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<GCR_IO_ENDPOINT>,ghcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<GHCR_IO_ENDPOINT>,k8s.gcr.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<K8S_IO_ENDPOINT>,registry.k8s.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<REGISTRY_K8S_IO_ENDPOINT>,quay.io::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<QUAY_IO_ENDPOINT>,us-docker.pkg.dev::<PLACE_HOLDER_FOR_ENDPOINT>/v2/<US_DOCKER_ENDPOINT>
      # Replace <PLACE_HOLDER_FOR_ENDPOINT> with your actual registry endpoint and <DOCKER_IO_ENDPOINT>, <GCR_IO_ENDPOINT>, <GHCR_IO_ENDPOINT>, <K8S_IO_ENDPOINT>, <REGISTRY_K8S_IO_ENDPOINT>, and <QUAY_IO_ENDPOINT> with the specific endpoint details for each registry.

      imageSwapImages:
        imageSwapInitImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.9.0"
        imageSwapImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.9.0"

      imageSwapConfig:
        isEKSCluster: true #If the Cluster you are trying to install is EKS cluster set value to true else set to false

    grpc:
      external: false
      endpoint: "" #Please provide DNS endpoint with the port eg: msg.spectrocloud.com:443
      annotations: {}
      # AWS example
      # service.beta.kubernetes.io/aws-load-balancer-internal: "true"
      # service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
      # service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"

      # Azure example
      # service.beta.kubernetes.io/azure-load-balancer-internal: "true"
      # service.beta.kubernetes.io/azure-dns-label-name: myserviceuniquelabel

      # Static IP for the GRPC load balancer service. If empty, a dynamic IP will be generated.
      grpcStaticIP: ""
      caCertificateBase64: "" #Please provide caCertificate for the grpc server Cert
      serverCrtBase64: ""
      serverKeyBase64: ""
      insecureSkipVerify: false
    tunnel:
      preferredServer:
        endpoint: ""
      servers:
        - endpoint: ""
    ingress:
      msgbroker:
        proxyBodySize: "15m" # Default proxy body size for msgbroker ingress
      # When enabled, the Traefik ingress controller is installed.
      enabled: true

      ingress:
        # Default SSL certificate and key for the ingress controller (Optional)
        # A wildcard cert for config.env.rootDomain, e.g., *.myfirstpalette.spectrocloud.com
        # If left blank, a self-signed cert is generated.
        certificate: ""
        key: ""

        #If ACM is enabled please use grpc as a non internal and bring grpc on different LB. Provide certificate and dns for it.
        annotations: {}
        # AWS example
        # service.beta.kubernetes.io/aws-load-balancer-internal: "true"
        # service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
        # service.beta.kubernetes.io/aws-load-balancer-ssl-cert: <ACM_ARN>
        # service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
        # service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: '*'

        # Azure example
        # service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        # service.beta.kubernetes.io/azure-dns-label-name: myserviceuniquelabel

        # Static IP for the Ingress load balancer service. If empty, a dynamic IP will be generated.
        ingressStaticIP: ""

        # For Service like AWS Load Balancer using https we would want to terminate the HTTPS at Load Balancer.
        terminateHTTPSAtLoadBalancer: false

    frps:
      frps:
        enabled: false
        frpHostURL: proxy.sample.spectrocloud.com
        server:
          crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURqekNDQW5lZ0F3SUJBZ0lVZTVMdXBBZGljd0Z1SFJpWWMyWEgzNTFEUzJJd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk1qY3hNREV6TVRNeU5ERXlXakI3TVFzd0NRWURWUVFHRXdKVlV6RUxNQWtHCkExVUVDQk1DUTBFeEV6QVJCZ05WQkFjVENsTmhiblJoUTJ4aGNtRXhGVEFUQmdOVkJBb1RERk53WldOMGNtOUQKYkc5MVpERUxNQWtHQTFVRUN4TUNTVlF4SmpBa0JnTlZCQU1USFhCeWIzaDVMbk5oYlhCc1pTNXpjR1ZqZEhKdgpZMnh2ZFdRdVkyOXRNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXd5bEt3MmlxClBXM2JrQU0wV3RhaEFLbEppcWFHd05LUDVRRTZ6ZW5NM2FURko3TjIwN0dWcUNGYzJHTDNodmNhTDFranZjeEkKK2lybHpkbm9hcVhUSmV3ZkJiTGs2SGVhZmdXUVp3NHNNeE5QRUVYYlNXYm54Mm03Y2FlbVJiUWZSQWhPWXRvWgpIWG1IMzQ1Q25mNjF0RnhMeEEzb0JRNm1yb0JMVXNOOUh2WWFzeGE5QUFmZUNNZm5sYWVBWE9CVmROalJTN1VzCkN5NmlSRXpEWFgvem1nOG5WWFUwemlrcXdoS3pqSlBJd2FQa2ViaXVSdUJYdEZ0VlQwQmFzS3VqbURzd0lsRFQKVmR4SHRRQUVyUmM4Q2Nhb20yUkpZbTd1aHNEYlo2WVFzS3JiMmhIbU5rNENVWUd5eUJPZnBwbzR2bFd1S2FEcgpsVFNYUXlPN0M0ejM1d0lEQVFBQm8xNHdYREJhQmdOVkhSRUVVekJSZ2dsc2IyTmhiR2h2YzNTSEJIOEFBQUdDCkhYQnliM2g1TG5OaGJYQnNaUzV6Y0dWamRISnZZMnh2ZFdRdVkyOXRnaDhxTG5CeWIzaDVMbk5oYlhCc1pTNXoKY0dWamRISnZZMnh2ZFdRdVkyOXRNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUEvRFJFVm54SWJRdi9uMDEvSQpJd1d0ekhKNGNHOUp6UlB6dmszNUcvRGJOVzZYZ0M3djBoWlFIVHg5bzMrckxoSUFiWTNmbjc1VEtlN3hMRWpiCkI3M3pGWURJSStkYzM5NkQzZU51M2NxRGIvY01kYmlFalhod2ttZk9NRm9qMnpOdHJIdzFsSjA0QlNFMWw1YWgKMDk0Vy9aaEQ2YTVLU3B0cDh1YUpKVmNrejRYMEdRWjVPYjZadGdxZVVxNytqWVZOZ0tLQzJCMW1SNjMyMDNsZwozVFZmZEkrdmI3b292dVdOOFRBVG9qdXNuS25WMmRMeTFBOWViWXYwMEM3WWZ6Q0NhODgrN2dzTGhJaUJjRHBPClJkWjU3QStKanJmSU5IYy9vNm5YWFhDZ2h2YkFwUVk1QnFnMWIzYUpUZERNWThUY0hoQVVaQzB5eU04bXcwMnQKWHRRQwotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
          key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBd3lsS3cyaXFQVzNia0FNMFd0YWhBS2xKaXFhR3dOS1A1UUU2emVuTTNhVEZKN04yCjA3R1ZxQ0ZjMkdMM2h2Y2FMMWtqdmN4SStpcmx6ZG5vYXFYVEpld2ZCYkxrNkhlYWZnV1FadzRzTXhOUEVFWGIKU1dibngybTdjYWVtUmJRZlJBaE9ZdG9aSFhtSDM0NUNuZjYxdEZ4THhBM29CUTZtcm9CTFVzTjlIdllhc3hhOQpBQWZlQ01mbmxhZUFYT0JWZE5qUlM3VXNDeTZpUkV6RFhYL3ptZzhuVlhVMHppa3F3aEt6akpQSXdhUGtlYml1ClJ1Qlh0RnRWVDBCYXNLdWptRHN3SWxEVFZkeEh0UUFFclJjOENjYW9tMlJKWW03dWhzRGJaNllRc0tyYjJoSG0KTms0Q1VZR3l5Qk9mcHBvNHZsV3VLYURybFRTWFF5TzdDNHozNXdJREFRQUJBb0lCQUFPVVZFeTFOTG9mczdFMgpmZFZVcm10R3I1U2RiVWRJRlYrTDREbzZtWWxQSmxhT0VoWGI0ZlROZDloNEtEWVBmaWwwSnhXcUU0U1RHTmZuCnNUMlRnUVhuQ01LZi8xYk1Lc2M0N3VjVStYYU9XaHJnVFI5UmhkckFjN0duODRLL3hQc0ljL2VZTEhHLzh1QUUKeWUvLzVmRkM2QmpXY0hUM1NkTlZnd3duamJudG5XTXIzTFJBVnJBamZBckxveWUwS0F2YytYdXJLTEVCcmMyVQpjaHlDbitZemJKN0VlSG44UXdQNGdBNXVSK0NCMFJPeFErYXIzS3M5YUhkZTQ1OEVNNEtLMnpUOXA4RWZRc1lFCkFtNUpxWjliR0JEVHV1dEkyNm9GK0pLQ1IzZzhXNERRcHVYRUZoVjlya0pMSm13RDhQb0JaclF6UzZvdmJhdkkKRk42QVM4RUNnWUVBOEcxQzFxZVh4dTQ4aEYxak5MTCswRmxkeWdFem9SMmFoRGJCai8weUZkQVVjU2pYTzk0NAozN1dORTBUUG10WG1Vc3NZTlBTR21XaWI2OUhicEFoMTY3SWVwNE9LaVlZdkozYm1oUC9WNzFvK3M0SWJlSHh1CkVJbWVVckFOZWRoQURVQnZ4c1lXRWxlVlVJSFFRcjY1VHM2ZjIrWkpTKzg4TU05bUorL3BmcmNDZ1lFQXo4MXgKR3JiSE5oak56RjhZMjhiK0hMNW5rdDR0SUdkU3hnbW9PMFFJeGkrQVNZTzB0WW42VFk0ZHI5ZXErMzE3b21ZawpMbDNtNENORDhudG1vYzRvWnM4SUpDQ0IrZjNqcTY4OHdoQU9vVHZ4dDhjZVJqOFRhRHl1SHZwS043OVNsVVd2CjBJd2ZRNDNIemd3SWJiSWhjcTRJVGswanI0VHdWbThia283VElGRUNnWUJoNnUzVXhHN0JHeGZVaE1BNW4waSsKREJkeGhPbkZEV3gzdW1FOHhrN1dxV2NaNnhzMWk3eTRCNVhNS2pNdkNUeURyYWxQTCtOOXFTZ1BjK216TmFybwo4aU1mOENmRStMeE5vMVFoQ0p6Vm5YaDUzVnhZeHJ5QXlidU1TNTFCYVh3MHFYQ2NrT0krV0NNOHBaSHZEUVFsCmYydUZ3SlZMY3NTZDBHbjNpL01ab3dLQmdBY1BzUjg2Uk15MnpROTd6OGx3R3FSNVorV2F2U2ZUdXdGVnhLeTIKNUNGdjdja1J1NnRMbEFEY3FtK1dRWTRvTm5KUFREMXpIV3hTWm5XdjhjM2Z4b212MFZRQThzbSs4ZVNjb05EcgpZTVBqMkpQcEpVTTMwMzRBU2Q1dG5PWUdEMVZaTjk4N1U3aWs4Ynd6dG5tYnl2MHRvc1NlWkc4TGNtdE5mVDllCnNSZnhBb0dCQUpTV1lDellyTlRMNnRUSnh5M2FqWm5jZkxrMEV0eWNCd05FRXZHVzVSVE9LOUFYTE96RzN0eHUKajZqWlRpaUFRU09aaVd0clJHU0U0bEkyQ1MvcjNjd3VuSGlnZlovd1dKZldkZ0JpRnZqOTVFbUVQWUZaRDRobQpkT3l5UHhRRXFTRmprQ21BS2plOFBpTDdpU01GbGhBZTZQWFljQlExdCtzd01UeXBnY3RrCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
        ca:
          crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURNVENDQWhtZ0F3SUJBZ0lVSHhWK0ljVGZHUElzdW8yY3dqQ0Q0Z2RSTFFRd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk16WXdOakl5TVRNeU5ERXlXakFvTVNZd0pBWURWUVFEREIxd2NtOTRlUzV6CllXMXdiR1V1YzNCbFkzUnliMk5zYjNWa0xtTnZiVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0MKQVFvQ2dnRUJBSy90WXBHVi9HRURUWnZzL25QQ2lOK0U3K1dOQ21GeU1NQjdkazVOT3JzQWZIaVVvZ1JRVUo0WQptSjhwVmYrSzhTRFBsdGNYcW40WVVTbmxiUERsVlBkWU5zOTEwT3RaS1EwNW96aUtGV2pNbS85NHlLSjVyVzNsCndDNEN0ayttUm9Ib0ZQQS81dmFVbVZHdlVadjlGY0JuL0pKN2F4WnRIQk1PRiticXQ0Zmd0ci9YMWdOeWhPVzUKZTVScGpESkozRjJTVnc5NUpBQSt4a3V3UitFSmVseEtnQVpxdDc0ejB4U2ROODZ0QzNtK0wxRGs2WVVlQWEzZApvM3Rsa3ZkeDV6dUJvSmI2QmpZWEV4UE1PbThRcHFNVWRLK3lDZUdrem9XQStDOUtFdGtVaERCWktENStNWXRZCktVMUh1RXJCbmw2Z3BuWTRlbzJjVTRxdkNwZzZ4S3NDQXdFQUFhTlRNRkV3SFFZRFZSME9CQllFRklKMkRkTjgKc2ZtVjRCT1ZFL0FjZ0VEejArNmlNQjhHQTFVZEl3UVlNQmFBRklKMkRkTjhzZm1WNEJPVkUvQWNnRUR6MCs2aQpNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQWhQVi9RMVl1YWVTOTZVCmhjVGQ4RWdJaHhpbHFiTWlTQm5WaVdrdlJzWk94UUIwNTFScWtwT3g0UTRsckdaOGVJWWc3T0trTTdzejhuTVQKL2pxS21sZDY0MzJCcURCMlNkNVp5ZFdReHAwU1laRTlnVWszYk9KRGtZVXQ4b1cvZDBWeG9uU05LQVN3QmZKaApWV1VZUUlpNm55K0ZZZmtuRFNvRnFlY2Z3SDBQQVUraXpnMkI3KzFkbko5YisyQ21IOUVCallOZ2hoNlFzVlFQCkh2SkdQQURtandPNkJOam5HK0Z3K0Z6cmFXUTNCTjAwb08zUjF6UmgxZERmTTQzR3oxRmZGRW5GSXI5aGFuUnQKWHJFZm8vZWU5bjBLWUFESEJnV1g4dlhuNHZrRmdWRjgwYW9MUUJSQTBxWXErcW1pVlp6YnREeE9ldFEyRWFyTQpyNmVWL0lZPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
        service:
          annotations: {}

    ui-system:
      enabled: true
      ui:
        nocUI:
          enable: true
          mapBoxAccessToken: "" # Leave Empty to use Default Access Token from Palette
          mapBoxStyledLayerID: "" # Leave Empty to use Default Style Layer ID

    reachSystem:
      enabled: false
      proxySettings:
        http_proxy: ""
        https_proxy: ""
        no_proxy: ""
        ca_crt_path: "" # Set the 'ca_crt_path' parameter to the location of the certificate file on each node. This file should contain the Proxy CA Certificate, in case the Proxy being used requires a certificate.
      scheduleOnControlPlane: true
    ```

    </TabItem>

    </Tabs>

    ### Image Swap Helm Chart

10. (Self-hosted OCI registry only) If you plan to use image swap for self-hosted OCI registries, install the Image Swap
    Helm chart. Image Swap rewrites pod image references to pull from your mirror registry. Palette ignores the
    `mirrorRegistries` configuration unless the Image Swap chart is installed. Choose the correct command based on
    whether you added your image swap values to `palette/values.yaml` or `extras/image-swap/values.yaml`.

    <Tabs>

    <TabItem value="palette" label="palette/values.yaml">

    ```shell
    helm upgrade --values palette/values.yaml \
      image-swap extras/image-swap/image-swap-*.tgz --install
    ```

    </TabItem>

    <TabItem value="image-swap" label="image-swap/values.yaml" >

    ```shell
    helm upgrade --values extras/image-swap/values.yaml \
      image-swap extras/image-swap/image-swap-*.tgz --install
    ```

    </TabItem>

    </Tabs>

    ```shell hideClipboard title="Example output"
    Release "image-swap" does not exist. Installing it now.
    NAME: image-swap
    LAST DEPLOYED: Wed Jun 17 14:44:13 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

    ### Reach System Helm Chart

11. (Proxy environments only) If you are installing Palette VerteX in an environment where a network proxy must be
    configured for VerteX to access the internet, install the Reach System chart using the following command. Ensure you
    set `reach-system.enabled` to `true` and configure `reach-system.proxySettings` in `vertex/values.yaml`.

    ```shell
    helm upgrade --values vertex/values.yaml \
      reach-system extras/reach-system/reach-system-*.tgz --install
    ```

    ```shell hideClipboard title="Example output"
    Release "reach-system" does not exist. Installing it now.
    NAME: reach-system
    LAST DEPLOYED: Fri Jan 30 18:40:57 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

    <!-- prettier-ignore-start -->

    <details>

        <summary>Update containerd to use proxy configurations</summary>

        If your Kubernetes cluster is behind a network proxy, ensure the containerd service is configured to use proxy
        settings. You can do this by updating the containerd configuration file on each node in the cluster. The
        configuration file is typically located at ` /etc/systemd/system/containerd.service.d/http-proxy.conf`. Below is an
        example of the configuration file. Replace the values with your proxy settings. Ask your network administrator for
        guidance.

        ```
        [Service]
        Environment="HTTP_PROXY=http://example.com:9090"
        Environment="HTTPS_PROXY=http://example.com:9090"
        Environment="NO_PROXY=127.0.0.1,localhost,100.64.0.0/17,192.168.0.0/16,172.16.0.0/12,10.0.0.0/8,,.cluster.local"
        ```

    </details>

    <!-- prettier-ignore-end -->

    ### Installation

12. Install the Palette Helm Chart using the following command.

    ```shell
    helm upgrade --values palette/values.yaml \
      hubble palette/spectro-mgmt-plane-*.tgz --install
    ```

    ```shell hideClipboard title="Example output"
    Release "hubble" does not exist. Installing it now.
    NAME: hubble
    LAST DEPLOYED: Wed Jun 17 21:41:31 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

13. Track the installation process using the command below. Palette is ready when the deployments in the namespaces
    `cp-system`, `hubble-system`, `ingress-traefik`, `jet-system`, and `ui-system` reach the _Ready_ state. The
    installation takes between two to three minutes to complete.

    <PartialsComponent category="self-hosted" name="install-on-kubernetes-al2" edition="Palette" />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

    :::tip

    For a more user-friendly experience, use the open source tool [k9s](https://k9scli.io/) to monitor the installation
    process.

    :::

14. Create a DNS CNAME record that is mapped to the Palette `traefik-ingress-controller` load balancer. You can use the
    following command to retrieve the load balancer IP address. You may require the assistance of your network
    administrator to create the DNS record.

    ```shell
    kubectl get service traefik-ingress-controller --namespace ingress-traefik \
     --output jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    ```

    :::warning

    If Palette has only one tenant and you use local accounts with Single Sign-On (SSO) disabled, you can access Palette
    using the IP address or any domain name that resolves to that IP. However, once you enable SSO, users must log in
    using the tenant-specific subdomain. For example, if you create a tenant named `tenant1` and the domain name you
    assigned to Palette is `palette.example.com`, the tenant URL will be `tenant1.palette.example.com`. We recommend you
    create an additional wildcard DNS record to map all tenant URLs to the Palette load balancer. For example,
    `*.palette.example.com`.

    :::

15. Use the custom domain name or the IP address of the load balancer to visit the Palette system console. Open a web
    browser and paste the custom domain URL in the address bar and append the value `/system`. Replace the domain name
    in the URL with your custom domain name or the IP address of the load balancer. Alternatively, you can use the load
    balancer IP address with the appended value `/system` to access the system console.

    The first time you visit the Palette system console, a warning message about a not trusted SSL certificate may
    appear. This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning
    message and proceed.

    ![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.webp)

16. Log in to the system console using the default credentials. Refer to the
    [password requirements](../../system-management/account-management/credentials.md#password-requirements-and-security)
    documentation page to learn more about password requirements

    | **Parameter** | **Value** |
    | ------------- | --------- |
    | Username      | `admin`   |
    | Password      | `admin`   |

    After logging in, you are prompted to create a new password. Enter a new password and save your changes. You will be
    redirected to the Palette system console. Use the username `admin` and your new password to log in to the system
    console. You can create additional system administrator accounts and assign roles to users in the system console.
    Refer to the [Account Management](../../system-management/account-management/account-management.md) documentation
    page for more information.

17. After logging in, a summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a
    different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority
    files to Palette. You can upload the files using the Palette system console. Refer to the
    [Configure HTTPS Encryption](../../system-management/ssl-certificate-management.md) page for instructions on how to
    upload the SSL certificate files to Palette.

    :::warning

    If you plan to deploy host clusters into different networks, you may require a reverse proxy. Check out the
    [Configure Reverse Proxy](../../system-management/reverse-proxy.md) guide for instructions on how to configure a
    reverse proxy for Palette.

    :::

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the `values.yaml`
file, as you can refer to it for future upgrades.

## Validate

Use the following steps to validate your Palette installation.

<Tabs>

<TabItem value="ui" label="UI">

1. Open up a web browser and navigate to the Palette system console. To access the system console, open a web browser
   and paste the `env.rootDomain` value you provided in the address bar and append the value `/system`. You can also use
   the IP address of the load balancer.

2. Log in using the default credentials. After logging in, you are prompted to create a new password. Enter a new
   password and save your changes. You are redirected to the Palette system console.

</TabItem>

<TabItem value="terminal" label="Terminal">

1. Open a terminal session with access to the cluster you installed Palette on.

2. Verify all pods in all namespaces are running.

   ```shell
   kubectl get pods --all-namespaces
   ```

   ```shell hideClipboard title="Example output"
   NAMESPACE         NAME                                        READY   STATUS      RESTARTS       AGE
   cert-manager      cert-manager-5fb779d887-mz2vb               1/1     Running     0              8m46s
   cert-manager      cert-manager-cainjector-764f9646d4-7nhpq    1/1     Running     0              8m46s
   cert-manager      cert-manager-webhook-85b8dbdddd-fkn6z       1/1     Running     0              8m46s
   cp-system         spectro-cp-ui-5dffbcdc78-gk8st              1/1     Running     0              7m14s
   hubble-system     auth-7f4c7ff9c-2clwp                        1/1     Running     0              6m8s
   hubble-system     auth-7f4c7ff9c-j84bt                        1/1     Running     0              6m7s
   hubble-system     cloud-8f8467c95-9r8bp                       1/1     Running     0              6m7s
   hubble-system     cloud-8f8467c95-pvcv4                       1/1     Running     0              6m8s
   hubble-system     configserver-5bc8f9fdcb-mbt66               1/1     Running     0              6m8s
   hubble-system     event-5fbf6b7f44-bmzdk                      1/1     Running     0              6m8s
   hubble-system     event-5fbf6b7f44-cxc58                      1/1     Running     0              6m7s
   hubble-system     event-5fbf6b7f44-zhr9h                      1/1     Running     0              6m7s
   hubble-system     foreq-8487bf9bbf-847vj                      1/1     Running     0              6m7s
   hubble-system     hashboard-66f957cfdf-k48wn                  1/1     Running     0              6m7s
   hubble-system     hashboard-66f957cfdf-pddx7                  1/1     Running     0              6m6s
   hubble-system     hutil-7cc6975bb5-5mhjp                      1/1     Running     0              6m6s
   hubble-system     hutil-7cc6975bb5-jwzr5                      1/1     Running     0              6m7s
   hubble-system     memstore-7d59d65f67-j8lls                   1/1     Running     0              6m6s
   hubble-system     mgmt-54fb5f487d-dj2tz                       1/1     Running     0              7m14s
   hubble-system     mongo-0                                     2/2     Running     0              6m33s
   hubble-system     mongo-1                                     2/2     Running     0              5m47s
   hubble-system     mongo-2                                     2/2     Running     0              4m57s
   hubble-system     mongodb-key-manager-helm-k6294              0/1     Completed   0              7m15s
   hubble-system     msgbroker-0                                 1/1     Running     0              7m15s
   hubble-system     msgbroker-1                                 1/1     Running     0              6m43s
   hubble-system     oci-proxy-78cd749dc9-jfs86                  1/1     Running     0              6m6s
   hubble-system     reloader-reloader-55d78d877b-7tnkq          1/1     Running     0              6m6s
   hubble-system     specman-0                                   1/1     Running     0              6m2s
   hubble-system     spectro-tunnel-74d559dd65-hlwch             1/1     Running     0              6m5s
   hubble-system     spectrocluster-6885954988-knrfq             1/1     Running     0              6m5s
   hubble-system     spectrocluster-6885954988-pb6pr             1/1     Running     0              6m5s
   hubble-system     spectrocluster-6885954988-xcvk9             1/1     Running     0              6m5s
   hubble-system     spectrocluster-jobs-7dc76bf6c7-pjc7l        1/1     Running     0              6m5s
   hubble-system     spectrocluster-reconciler-dcfd55ff5-gnfjg   1/1     Running     0              6m4s
   hubble-system     spectroclusterop-58966f7f54-grznt           1/1     Running     0              6m4s
   hubble-system     spectroclusterop-58966f7f54-jj9m6           1/1     Running     0              6m4s
   hubble-system     spectrossh-589d975d4d-82vm2                 1/1     Running     0              6m4s
   hubble-system     system-d48fdbc9-ffzq9                       1/1     Running     0              6m8s
   hubble-system     system-d48fdbc9-sztrr                       1/1     Running     0              6m8s
   hubble-system     timeseries-f465b4c99-8h8c7                  1/1     Running     0              6m4s
   hubble-system     timeseries-f465b4c99-jlzlj                  1/1     Running     0              6m3s
   hubble-system     timeseries-f465b4c99-z27d8                  1/1     Running     0              6m3s
   hubble-system     user-697c6f8bf-fgwtp                        1/1     Running     0              6m3s
   hubble-system     user-697c6f8bf-wcqxk                        1/1     Running     0              6m3s
   ingress-traefik   traefik-ingress-controller-5dctd            1/1     Running     0              7m15s
   ingress-traefik   traefik-ingress-controller-tx6st            1/1     Running     0              7m16s
   ingress-traefik   traefik-ingress-controller-zf25w            1/1     Running     0              7m16s
   jet-system        jet-796fc87c5d-vpvtz                        1/1     Running     0              4m1s
   kube-system       aws-node-8xqnx                              2/2     Running     0              121m
   kube-system       aws-node-gtr64                              2/2     Running     0              121m
   kube-system       aws-node-h7pdv                              2/2     Running     0              121m
   kube-system       coredns-566b9b9d-hck47                      1/1     Running     0              129m
   kube-system       coredns-566b9b9d-jpnrs                      1/1     Running     0              129m
   kube-system       ebs-csi-controller-7dfbb6bd58-nwcjl         6/6     Running     0              113m
   kube-system       ebs-csi-controller-7dfbb6bd58-w8kxz         6/6     Running     0              113m
   kube-system       ebs-csi-node-9r6fk                          3/3     Running     0              113m
   kube-system       ebs-csi-node-vp744                          3/3     Running     0              113m
   kube-system       ebs-csi-node-xb69v                          3/3     Running     0              113m
   kube-system       kube-proxy-59qgr                            1/1     Running     0              121m
   kube-system       kube-proxy-krrzd                            1/1     Running     0              121m
   kube-system       kube-proxy-lbsgp                            1/1     Running     0              121m
   ui-system         spectro-ui-56749c5f84-98m89                 1/1     Running     0              7m15s
   ```

3. Verify the `hubble` release is deployed.

   ```shell
   helm status hubble
   ```

   ```shell title="Example output" hideClipboard
   NAME: hubble
   LAST DEPLOYED: Thu Jun 18 18:33:18 2026
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   ```

</TabItem>

</Tabs>

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="Palette" version="Palette" />
