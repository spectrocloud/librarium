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

- Palette deploys both a Traefik ingress controller and an Nginx ingress controller. Traefik is the default ingress
  controller starting with Palette 4.8.47. Ingress Nginx acts as a fallback and does not actively serve traffic. If you
  already have an ingress controller deployed in the cluster, you must set the `ingress.enabled` parameter to `false` in
  the `values.yaml` file.

  :::warning

  Ingress Nginx is a
  [deprecated Kubernetes project](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) and is also
  [deprecated in Palette](../../../release-notes/announcements.md#deprecations). It will be removed in a future release.
  If you are deploying an ingress controller as part of your Palette installation, set `ingress.type` to `traefik` to
  avoid service disruptions. Refer to [Helm Configuration Reference](../install-on-kubernetes/palette-helm-ref.md) for
  more information.

  :::

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
    our support. Unzip the file to a directory named **palette-install**.

    ```shell
    unzip charts.zip -d palette-install
    ```

2.  Navigate to the **palette-install** directory.

    ```shell
    cd palette-install
    ```

3.  Install Cert Manager using the following command. Replace the actual file name of the Cert Manager Helm Chart with
    the one you downloaded, as the version number may be different.

    ```shell
    helm upgrade --values extras/cert-manager/values.yaml \
    cert-manager extras/cert-manager/cert-manager-*.tgz --install
    ```

    ```shell hideClipboard
    Release "cert-manager" does not exist. Installing it now.
    NAME: cert-manager
    LAST DEPLOYED: Fri Jan 30 18:40:57 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    DESCRIPTION: Install complete
    TEST SUITE: None
    ```

4.  Install the Spectro Management CRDs chart. This chart contains Custom Resource Definitions (CRDs) required by
    Palette, including Traefik CRDs, and must be installed _before_ the main Palette Helm chart. When the chart is
    installed, the custom resource types are registered with the Kubernetes API server; no pods are deployed.

    ```shell
    helm upgrade --install spectro-mgmt-crds extras/spectro-mgmt-crds/spectro-mgmt-crds-*.tgz
    ```

    ```shell hideClipboard title="Example output"
    Release "spectro-mgmt-crds" does not exist. Installing it now.
    NAME: spectro-mgmt-crds
    LAST DEPLOYED: Fri Jan 30 18:42:30 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    DESCRIPTION: Install complete
    TEST SUITE: None
    ```

5.  Open the **values.yaml** in the **palette/spectro-mgmt-plane** folder with a text editor of your choice. The
    **values.yaml** contains the default values for the Palette installation parameters, however, you must populate the
    following parameters before installing Palette. You can learn more about the parameters in the **values.yaml** file
    in the [Helm Configuration Reference](palette-helm-ref.md) page.

    | **Parameter**                             | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | **Type** |
    | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
    | `env.rootDomain`                          | The URL name or IP address you will use for the Palette installation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string   |
    | `ociPackRegistry` or `ociPackEcrRegistry` | The OCI registry credentials for Palette FIPS packs. These credentials are provided by our support team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | object   |
    | `ingress.enabled`                         | Whether to install the Traefik or Nginx ingress controller (determined by `type: "traefik"` or `type: "nginx"`). Set to `false` if you already have an ingress controller deployed in the cluster. <br /><br /> **WARNING:** Ingress Nginx is a [deprecated Kubernetes project](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) and is also [deprecated in Palette](../../../release-notes/announcements.md#deprecations). It will be removed in a future release. If you are deploying an ingress controller as part of your Palette installation, set `ingress.type` to `traefik` to avoid service disruptions. Refer to [Helm Configuration Reference](../install-on-kubernetes/palette-helm-ref.md) for more information. | boolean  |
    | `reachSystem`                             | Set `reach-system.enabled` to `true` and configure the `reach-system.proxySettings` parameters to configure Palette to use a network proxy in your environment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | object   |

    :::info

    If you are installing Palette by pulling required images from a private mirror registry, you will need to provide
    the credentials to your registry in the **values.yaml** file. For more information, refer to
    [Helm Configuration Reference](palette-helm-ref.md#image-pull-secret).

    :::

    Save the **values.yaml** file after you have populated the required parameters mentioned in the table. Expand the
    following sections to review an example of the **values.yaml** file with the required parameters highlighted.

    <!-- prettier-ignore -->
    <Tabs>

    <TabItem label="AWS ECR Registry" value="ecr">

    ```yaml {60,84-92}
    #########################
    # Spectro Cloud Palette #
    #########################

    global:
      imagePullSecret:
        create: false
        # Provide your own base64 encoded dockerconfigjson value below if using ImagePullSecret for Private registry Authentication
      dockerConfigJson: ""

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
      installationMode: "central" #values can be connected or airgap.

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
        # rootDomain is a DNS record which will be mapped to the ingress-nginx-controller load balancer
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
        imageSwapInitImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.8.a-v2"
        imageSwapImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.8.a-v2"

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
      # When enabled nginx ingress controller would be installed
      enabled: true

      ingress:
        # Whether to front NGINX Ingress Controller with a cloud
        # load balancer (internal == false) or use host network
        internal: false

        # Default SSL certificate and key for NGINX Ingress Controller (Optional)
        # A wildcard cert for config.env.rootDomain, e.g., *.myfirstpalette.spectrocloud.com
        # If left blank, the NGINX ingress controller will generate a self-signed cert (when terminating TLS upstream of ingress-nginx-controller)
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

    ```yaml {61,76-83,95-103}
    #########################
    # Spectro Cloud Palette #
    #########################

    global:
      imagePullSecret:
        create: false
        # Provide your own base64 encoded dockerconfigjson value below if using ImagePullSecret for Private registry Authentication
        dockerConfigJson: ""

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
        # rootDomain is a DNS record which will be mapped to the ingress-nginx-controller load balancer
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
        imageSwapInitImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap-init:v1.5.3-spectro-4.8.a-v2"
        imageSwapImage: "us-docker.pkg.dev/palette-images/third-party/thewebroot/imageswap:v1.5.3-spectro-4.8.a-v2"

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
      # When enabled nginx ingress controller would be installed
      enabled: true

      ingress:
        # Whether to front NGINX Ingress Controller with a cloud
        # load balancer (internal == false) or use host network
        internal: false

        # Default SSL certificate and key for NGINX Ingress Controller (Optional)
        # A wildcard cert for config.env.rootDomain, e.g., *.myfirstpalette.spectrocloud.com
        # If left blank, the NGINX ingress controller will generate a self-signed cert (when terminating TLS upstream of ingress-nginx-controller)
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

    :::warning

    Ensure you have configured the **values.yaml** file with the required parameters before proceeding to the next
    steps.

    :::

6.  This step is only required if you are installing Palette in an environment where a network proxy must be configured
    for Palette to access the internet. If you are not using a network proxy, skip to the next step.

    Install the reach-system chart using the following command. Point to the **values.yaml** file you configured in
    step 5. Make sure you configure the `reach-system.enable` section in the **values.yaml** file.

    ```shell
    helm upgrade --values palette/values.yaml \
    reach-system extras/reach-system/reach-system-*.tgz --install
    ```

    ```shell hideClipboard
    Release "reach-system" does not exist. Installing it now.
    NAME: reach-system
    LAST DEPLOYED: Fri Jan 30 18:40:57 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

    <!-- prettier-ignore -->
    <details>
    <summary>How to update containerd to use proxy configurations</summary>

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

7.  Install the Palette Helm Chart using the following command.

    ```shell
     helm upgrade --values palette/values.yaml \
     hubble palette/spectro-mgmt-plane-*.tgz --install
    ```

    ```shell hideClipboard
    Release "hubble" does not exist. Installing it now.
    NAME: hubble
    LAST DEPLOYED: Fri Jan 30 18:46:53 2026
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    DESCRIPTION: Install complete
    TEST SUITE: None
    ```

8.  Track the installation process using the command below. Palette is ready when the deployments in the namespaces
    `cp-system`, `hubble-system`, `ingress-traefik`, `ingress-nginx`, `jet-system` , and `ui-system` reach the _Ready_
    state. The installation takes between two to three minutes to complete.

    <PartialsComponent category="self-hosted" name="install-on-kubernetes-al2" edition="Palette" />

    ```shell
    kubectl get pods --all-namespaces --watch
    ```

    :::tip

    For a more user-friendly experience, use the open source tool [k9s](https://k9scli.io/) to monitor the installation
    process.

    :::

9.  Create a DNS CNAME record that is mapped to the Palette `traefik-ingress-controller` load balancer. You can use the
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

10. Use the custom domain name or the IP address of the load balancer to visit the Palette system console. system
    console, open a web browser and paste the custom domain URL in the address bar and append the value `/system`.
    Replace the domain name in the URL with your custom domain name or the IP address of the load balancer.
    Alternatively, you can use the load balancer IP address with the appended value `/system` to access the system
    console.

    The first time you visit the Palette system console, a warning message about a not trusted SSL certificate may
    appear. This is expected, as you have not yet uploaded your SSL certificate to Palette. You can ignore this warning
    message and proceed.

    ![Screenshot of the Palette system console showing Username and Password fields.](/palette_installation_install-on-vmware_palette-system-console.webp)

11. Log in to the system console using the following default credentials. Refer to the
    [password requirements](../../system-management/account-management/credentials.md#password-requirements-and-security)
    documentation page to learn more about password requirements

    | **Parameter** | **Value** |
    | ------------- | --------- |
    | Username      | `admin`   |
    | Password      | `admin`   |

    After login, you will be prompted to create a new password. Enter a new password and save your changes. You will be
    redirected to the Palette system console. Use the username `admin` and your new password to log in to the system
    console. You can create additional system administrator accounts and assign roles to users in the system console.
    Refer to the [Account Management](../../system-management/account-management/account-management.md) documentation
    page for more information.

12. After login, a summary page is displayed. Palette is installed with a self-signed SSL certificate. To assign a
    different SSL certificate you must upload the SSL certificate, SSL certificate key, and SSL certificate authority
    files to Palette. You can upload the files using the Palette system console. Refer to the
    [Configure HTTPS Encryption](../../system-management/ssl-certificate-management.md) page for instructions on how to
    upload the SSL certificate files to Palette.

    :::warning

    If you plan to deploy host clusters into different networks, you may require a reverse proxy. Check out the
    [Configure Reverse Proxy](../../system-management/reverse-proxy.md) guide for instructions on how to configure a
    reverse proxy for Palette.

    :::

You now have a self-hosted instance of Palette installed in a Kubernetes cluster. Make sure you retain the
**values.yaml** file as you may need it for future upgrades.

## Validate

Use the following steps to validate the Palette installation.

1. Open up a web browser and navigate to the Palette system console. To access the system console, open a web browser
   and paste the `env.rootDomain` value you provided in the address bar and append the value `/system`. You can also use
   the IP address of the load balancer.

2. Log in using the credentials you received from our support team. After login, you will be prompted to create a new
   password. Enter a new password and save your changes. You will be redirected to the Palette system console.

3. Open a terminal session and issue the following command to verify the Palette installation. The command should return
   a list of deployments in the `cp-system`, `hubble-system`, `ingress-nginx`, `ingress-traefik`, `jet-system` , and
   `ui-system` namespaces.

   ```shell
   kubectl get pods --all-namespaces --output custom-columns="NAMESPACE:metadata.namespace,NAME:metadata.name,STATUS:status.phase" \
   | grep --extended-regexp '^(cp-system|hubble-system|ingress-nginx|ingress-traefik|jet-system|ui-system)\s'
   ```

   Your output should look similar to the following.

   ```shell hideClipboard
    cp-system            spectro-cp-ui-78c9b7dcc5-q8ln4                             Running
    hubble-system        auth-58bc56bc79-68lbg                                      Running
    hubble-system        auth-58bc56bc79-r2md8                                      Running
    hubble-system        cloud-8475845cff-dnq27                                     Running
    hubble-system        cloud-8475845cff-v2cww                                     Running
    hubble-system        configserver-74dd648bf5-6tvmv                              Running
    hubble-system        event-68cfb57f6d-9dx5b                                     Running
    hubble-system        event-68cfb57f6d-g5zrl                                     Running
    hubble-system        event-68cfb57f6d-rz4sz                                     Running
    hubble-system        foreq-6c75b84554-x4f7h                                     Running
    hubble-system        hashboard-7b69cc685f-d8mmw                                 Running
    hubble-system        hashboard-7b69cc685f-mbb57                                 Running
    hubble-system        hutil-5456dfbdd7-68p4m                                     Running
    hubble-system        hutil-5456dfbdd7-dllfj                                     Running
    hubble-system        memstore-8654b49cfd-npqbv                                  Running
    hubble-system        mgmt-55985b7ccb-gpvnr                                      Running
    hubble-system        mongo-0                                                    Running
    hubble-system        mongo-1                                                    Running
    hubble-system        mongo-2                                                    Pending
    hubble-system        mongodb-key-manager-helm-4z2mw                             Running
    hubble-system        msgbroker-0                                                Running
    hubble-system        msgbroker-1                                                Running
    hubble-system        oci-proxy-787fd499d4-f772t                                 Running
    hubble-system        specman-0                                                  Running
    hubble-system        spectro-tunnel-69448888-qn7kk                              Running
    hubble-system        spectrocluster-54fb864b48-8fhkr                            Running
    hubble-system        spectrocluster-54fb864b48-9hkgg                            Running
    hubble-system        spectrocluster-54fb864b48-w5dwr                            Running
    hubble-system        spectrocluster-jobs-6ddfbddcd6-j9xb8                       Running
    hubble-system        spectrocluster-reconciler-d448fc8cf-qr6bp                  Running
    hubble-system        spectroclusterop-89968785d-6n48l                           Running
    hubble-system        spectroclusterop-89968785d-gzd5w                           Running
    hubble-system        spectrossh-d5fd6b49-wfcgc                                  Running
    hubble-system        system-6f7767845d-lm5zn                                    Running
    hubble-system        system-6f7767845d-xf2hl                                    Running
    hubble-system        timeseries-6f5bf98c5c-fcqnh                                Running
    hubble-system        timeseries-6f5bf98c5c-vmb5h                                Running
    hubble-system        timeseries-6f5bf98c5c-xm8s6                                Running
    hubble-system        user-796c877b57-6rcdp                                      Running
    hubble-system        user-796c877b57-ptbg4                                      Running
    ingress-nginx        ingress-nginx-controller-m5z54                             Running
    ingress-nginx        ingress-nginx-controller-qsf6m                             Running
    ingress-nginx        ingress-nginx-controller-w64pz                             Running
    ingress-traefik      traefik-ingress-controller-9dmzq                           Running
    ingress-traefik      traefik-ingress-controller-tpwtf                           Running
    ingress-traefik      traefik-ingress-controller-xz4jf                           Running
    jet-system           jet-555cdf78f5-4l2s2                                       Running
    ui-system            spectro-ui-8658f85c85-9lkhs                                Running
   ```

## Next Steps

<PartialsComponent category="self-hosted" name="install-next-steps" edition="Palette" version="Palette" />
