---
sidebar_label: "Helm Chart Configuration Reference"
title: "Helm Chart Configuration Reference"
description: "Reference for Palette Helm Chart installation parameters."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "helm"]
keywords: ["self-hosted", "helm"]
---

:::danger

Turn this page into partials for reuse across other self-hosted helm chart reference pages.

:::

You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment.
The Helm chart allows you to customize values in the **values.yaml** file. This reference lists and describes parameters
available in the **values.yaml** file from the Helm Chart for your installation. To learn how to install Palette using
the Helm Chart, refer to the [Palette Helm install](../../install/non-airgap.md) guide.

### Required Parameters

The following parameters are required for a successful installation of Palette.

| **Parameters**                                          | **Description**                                                                                                                                                                                                                                                               | **Type** |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `config.env.rootDomain`                                 | Used to configure the domain for the Palette installation. We recommend you create a CNAME DNS record that supports multiple subdomains. You can achieve this using a wild card prefix, `*.palette.abc.com`. Review the [Environment parameters](#environment) to learn more. | String   |
| `config.env.ociRegistry` or `config.env.ociEcrRegistry` | Specifies the FIPS image registry for Palette. You can use an a self-hosted OCI registry or a public OCI registry we maintain and support. For more information, refer to the [Registry](#registries) section.                                                                | Object   |

:::warning

If you are installing an air-gapped version of Palette, you must provide the image swap configuration. For more
information, refer to the [Image Swap Configuration](#image-swap-configuration) section.

:::

## Global

The global block allows you to provide configurations that apply globally to the installation process.

### Image Pull Secret

The `imagePullSecret` block allows you to provide image pull secrets that will be used to authenticate with private
registries to obtain the images required for Palette installation. This is relevant if you have your own mirror
registries you use for Palette installation.

| **Parameters**     | **Description**                                                                                                                                                                                                                                                                                             | **Type** | **Default value** |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `create`           | Specifies whether to create a secret containing credentials to your own private image registry.                                                                                                                                                                                                             | Boolean  | `false`           |
| `dockerConfigJson` | The **config.json** file value containing the registry URL and credentials for your image registry in base64 encoded format on a single line. For more information about the **config.json** file, refer to [Kubernetes Documentation](https://kubernetes.io/docs/concepts/containers/images/#config-json). | String   | None              |

:::info

To obtain the base-64 encoded version of the credential `config.json` file, you can issue the following command. Replace
`<path/to/.docker/config.json>` with the path to your `config.json` file. The `tr -d '\n'` removes new line characters
and produce the output on a single line.

```shell
cat <path/to/.docker/config.json> | base64 | tr -d '\n'
```

:::

```yaml
global:
  imagePullSecret:
    create: true
    dockerConfigJson: ewoJImF1dGhzHsKCQkiaG9va3......MiOiAidHJ1ZSIKCX0KfQ # Base64 encoded config.json
```

## MongoDB

Palette uses MongoDB Enterprise as its internal database and supports two modes of deployment:

- MongoDB Enterprise deployed and active inside the cluster.

- MongoDB Enterprise is hosted on a Software-as-a-Service (SaaS) platform, such as MongoDB Atlas. If you choose to use
  MongoDB Atlas, ensure the MongoDB database has a user named `hubble` with the permission `readWriteAnyDatabase`. Refer
  to the [Add a Database User](https://www.mongodb.com/docs/guides/atlas/db-user/) guide for guidance on how to create a
  database user in Atlas.

The table below lists the parameters used to configure a MongoDB deployment.

| **Parameters**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Type** | **Default value**                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- |
| `internal`         | Specifies the MongoDB deployment either in-cluster or using Mongo Atlas.                                                                                                                                                                                                                                                                                                                                                                             | Boolean  | `true`                                      |
| `databaseUrl`      | The URL for MongoDB Enterprise. If using a remote MongoDB Enterprise instance, provide the remote URL. This parameter must be updated if `mongo.internal` is set to `false`. You also need to ensure the MongoDB database has a user named `hubble` with the permission `readWriteAnyDatabase`. Refer to the [Add a Database User](https://www.mongodb.com/docs/guides/atlas/db-user/) guide for guidance on how to create a database user in Atlas. | String   | `mongo-0.mongo,mongo-1.mongo,mongo-2.mongo` |
| `databasePassword` | The base64-encoded MongoDB Enterprise password. If you don't provide a value, a random password will be auto-generated.                                                                                                                                                                                                                                                                                                                              | String   | `""`                                        |
| `replicas`         | The number of MongoDB replicas to start.                                                                                                                                                                                                                                                                                                                                                                                                             | Integer  | `3`                                         |
| `memoryLimit`      | Specifies the memory limit for each MongoDB Enterprise replica.                                                                                                                                                                                                                                                                                                                                                                                      | String   | `4Gi`                                       |
| `cpuLimit`         | Specifies the CPU limit for each MongoDB Enterprise member.                                                                                                                                                                                                                                                                                                                                                                                          | String   | `2000m`                                     |
| `pvcSize`          | The storage settings for the MongoDB Enterprise database. Use increments of `5Gi` when specifying the storage size. The storage size applies to each replica instance. The total storage size for the cluster is `replicas` \* `pvcSize`.                                                                                                                                                                                                            | string   | `20Gi`                                      |
| `storageClass`     | The storage class for the MongoDB Enterprise database.                                                                                                                                                                                                                                                                                                                                                                                               | String   | `""`                                        |

```yaml
mongo:
  internal: true
  databaseUrl: "mongo-0.mongo,mongo-1.mongo,mongo-2.mongo"
  databasePassword: ""
  replicas: 3
  cpuLimit: "2000m"
  memoryLimit: "4Gi"
  pvcSize: "20Gi"
  storageClass: ""
```

## Config

Review the following parameters to configure Palette for your environment. The `config` section contains the following
subsections:

### Install Mode

You can install Palette in connected or air-gapped mode. The table lists the parameters to configure the installation
mode.

| **Parameters** | **Description**                                                                                                                                      | **Type** | **Default value** |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `installMode`  | Specifies the installation mode. Allowed values are `connected` or `airgap`. Set the value to `airgap` when installing in an air-gapped environment. | String   | `connected`       |

```yaml
config:
  managementMode: "central"
```

### SSO

You can configure Palette to use Single Sign-On (SSO) for user authentication. Configure the SSO parameters to enable
SSO for Palette. You can also configure different SSO providers for each tenant post-install, check out the
[SAML & SSO Setup](../../../../../../user-management/saml-sso/saml-sso.md) documentation for additional guidance.

To configure SSO, you must provide the following parameters.

| **Parameters**      | **Description**                                                           | **Type** | **Default value**                 |
| ------------------- | ------------------------------------------------------------------------- | -------- | --------------------------------- |
| `saml.enabled`      | Specifies whether to enable SSO SAML configuration by setting it to true. | Boolean  | `false`                           |
| `saml.acsUrlRoot`   | The root URL of the Assertion Consumer Service (ACS).                     | String   | `myfirstpalette.spectrocloud.com` |
| `saml.acsUrlScheme` | The URL scheme of the ACS: `http` or `https`.                             | String   | `https`                           |
| `saml.audienceUrl`  | The URL of the intended audience for the SAML response.                   | String   | `https://www.spectrocloud.com`    |
| `saml.entityID`     | The Entity ID of the Service Provider.                                    | String   | `https://www.spectrocloud.com`    |
| `saml.apiVersion`   | Specify the SSO SAML API version to use.                                  | String   | `v1`                              |

```yaml
config:
  sso:
    saml:
      enabled: false
      acsUrlRoot: "myfirstpalette.spectrocloud.com"
      acsUrlScheme: "https"
      audienceUrl: "https://www.spectrocloud.com"
      entityId: "https://www.spectrocloud.com"
      apiVersion: "v1"
```

### Email

Palette uses email to send notifications to users. The email notification is used when inviting new users to the
platform, password resets, and when [webhook alerts](../../../../../../clusters/cluster-management/health-alerts.md) are
triggered. Use the following parameters to configure email settings for Palette.

| **Parameters**          | **Description**                                                                                | **Type** | **Default value**          |
| ----------------------- | ---------------------------------------------------------------------------------------------- | -------- | -------------------------- |
| `enabled`               | Specifies whether to enable email configuration.                                               | Boolean  | `false`                    |
| `emailID `              | The email address for sending mail.                                                            | String   | `noreply@spectrocloud.com` |
| `smtpServer`            | Simple Mail Transfer Protocol (SMTP) server used for sending mail.                             | String   | `smtp.gmail.com`           |
| `smtpPort`              | SMTP port used for sending mail.                                                               | Integer  | `587`                      |
| `insecureSkipVerifyTLS` | Specifies whether to skip Transport Layer Security (TLS) verification for the SMTP connection. | Boolean  | `true`                     |
| `fromEmailID`           | Email address of the **_From_** address.                                                       | String   | `noreply@spectrocloud.com` |
| `password`              | The base64-encoded SMTP password when sending emails.                                          | String   | `""`                       |

```yaml
config:
  email:
    enabled: false
    emailId: "noreply@spectrocloud.com"
    smtpServer: "smtp.gmail.com"
    smtpPort: 587
    insecureSkipVerifyTls: true
    fromEmailId: "noreply@spectrocloud.com"
    password: ""
```

### Environment

The following parameters are used to configure the environment.

| **Parameters**       | **Description**                                                                                                                                                                                                                                                                                                                                                   | **Type** | **Default value** |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `env.rootDomain`     | Specifies the URL name assigned to Palette. The value assigned should have a Domain Name System (DNS) CNAME record mapped to exposed IP address or the load balancer URL of the service _ingress-nginx-controller_. Optionally, if `ingress.ingressStaticIP` is provided with a value you can use same assigned static IP address as the value to this parameter. | String   | `""`              |
| `env.installerMode`  | Specifies the installer mode. Do not modify the value.                                                                                                                                                                                                                                                                                                            | String   | `self-hosted`     |
| `env.installerCloud` | Specifies the cloud provider. Leave this parameter empty if you are installing a self-hosted Palette.                                                                                                                                                                                                                                                             | String   | `""`              |

```yaml
config:
  env:
    rootDomain: ""
```

:::warning

If Palette has only one tenant and you use local accounts with Single Sign-On (SSO) disabled, you can access Palette
using the IP address or any domain name that resolves to that IP. However, once you enable SSO, users must log in using
the tenant-specific subdomain. For example, if you create a tenant named `tenant1` and the domain name you assigned to
Palette is `palette.example.com`, the tenant URL will be `tenant1.palette.example.com`. We recommend you create an
additional wildcard DNS record to map all tenant URLs to the Palette load balancer. For example,
`*.palette.example.com`.

:::

### Cluster

Use the following parameters to configure the Kubernetes cluster.

| **Parameters**         | **Description**                                                                                                                                                              | **Type** | **Default value** |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `stableEndpointAccess` | Set to `true` if the Kubernetes cluster is deployed in a public endpoint. If the cluster is deployed in a private network through a stable private endpoint, set to `false`. | Boolean  | `false`           |

```yaml
config:
  cluster:
    stableEndpointAccess: false
```

## Registries

Palette requires credentials to access the required Palette images. You can configure different types of registries for
Palette to download the required images. You must configure at least one Open Container Initiative (OCI) registry for
Palette.

### OCI Registry

Palette requires access to an OCI registry that contains all the required FIPS packs. You can host your own OCI registry
and configure Palette to reference the registry. Alternatively, you can use the public OCI registry that we provide.
Refer to the [`ociPackEcrRegistry`](#oci-ecr-registry) section to learn more about the publicly available OCI registry.

| **Parameters**                       | **Description**                                                                                    | **Type** | **Default value** |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `ociPackRegistry.endpoint`           | The endpoint URL for the registry.                                                                 | String   | `""`              |
| `ociPackRegistry.name`               | The name of the registry.                                                                          | String   | `""`              |
| `ociPackRegistry.password`           | The base64-encoded password for the registry.                                                      | String   | `""`              |
| `ociPackRegistry.username`           | The username for the registry.                                                                     | String   | `""`              |
| `ociPackRegistry.baseContentPath`    | The base path for the registry.                                                                    | String   | `""`              |
| `ociPackRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean  | `false`           |
| `ociPackRegistry.caCert`             | The registry's base64-encoded certificate authority (CA) certificate.                              | String   | `""`              |

```yaml
config:
  ociPackRegistry:
    endpoint: ""
    name: ""
    password: ""
    username: ""
    baseContentPath: ""
    insecureSkipVerify: false
    caCert: ""
```

### OCI ECR Registry

We expose a public OCI ECR registry that you can configure Palette to reference. If you want to host your own OCI
registry, refer to the [OCI Registry](#oci-registry) section. The OCI Elastic Container Registry (ECR) is hosted in an
AWS ECR registry. Our support team provides the credentials for the OCI ECR registry.

| **Parameters**                          | **Description**                                                                                    | **Type** | **Default value** |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `ociPackEcrRegistry.endpoint`           | The endpoint URL for the registry.                                                                 | String   | `""`              |
| `ociPackEcrRegistry.name`               | The name of the registry.                                                                          | String   | `""`              |
| `ociPackEcrRegistry.accessKey`          | The base64-encoded access key for the registry.                                                    | String   | `""`              |
| `ociPackEcrRegistry.secretKey`          | The base64-encoded secret key for the registry.                                                    | String   | `""`              |
| `ociPackEcrRegistry.baseContentPath`    | The base path for the registry.                                                                    | String   | `""`              |
| `ociPackEcrRegistry.isPrivate`          | Specifies whether the registry is private.                                                         | Boolean  | `true`            |
| `ociPackEcrRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean  | `false`           |
| `ociPackEcrRegistry.caCert`             | The registry's base64-encoded certificate authority (CA) certificate.                              | String   | `""`              |

```yaml
config:
  ociPackEcrRegistry:
    endpoint: ""
    name: ""
    accessKey: ""
    secretKey: ""
    baseContentPath: ""
    isPrivate: true
    insecureSkipVerify: false
    caCert: ""
```

### OCI Image Registry

You can specify an OCI registry for the images used by Palette.

| **Parameters**                        | **Description**                                                                                    | **Type** | **Default value** |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `ociImageRegistry.endpoint`           | The endpoint URL for the registry.                                                                 | String   | `""`              |
| `ociImageRegistry.name`               | The name of the registry.                                                                          | String   | `""`              |
| `ociImageRegistry.password`           | The password for the registry.                                                                     | String   | `""`              |
| `ociImageRegistry.username`           | The username for the registry.                                                                     | String   | `""`              |
| `ociImageRegistry.baseContentPath`    | The base path for the registry.                                                                    | String   | `""`              |
| `ociImageRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean  | `false`           |
| `ociImageRegistry.caCert`             | The registry's base64-encoded certificate authority (CA) certificate.                              | String   | `""`              |
| `ociImageRegistry.mirrorRegistries`   | A comma-separated list of mirror registries.                                                       | String   | `""`              |

```yaml
config:
  ociImageRegistry:
    endpoint: ""
    name: ""
    password: ""
    username: ""
    baseContentPath: ""
    insecureSkipVerify: false
    caCert: ""
    mirrorRegistries: ""
```

### Image Swap Configuration

You can configure Palette to use image swap to download the required images. This is an advanced configuration option,
and it is only required for air-gapped deployments. You must also install the Palette Image Swap Helm chart to use this
option, otherwise, Palette will ignore the configuration.

| **Parameters**                 | **Description**                                                                                                         | **Type** | **Default value**                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| `imageSwapInitImage`           | The image swap init image.                                                                                              | String   | `gcr.io/spectro-images-public/release/thewebroot/imageswap-init:v1.5.3-spectro-4.5.1` |
| `imageSwapImage`               | The image swap image.                                                                                                   | String   | `gcr.io/spectro-images-public/release/thewebroot/imageswap:v1.5.3-spectro-4.5.1`      |
| `imageSwapConfig`              | The image swap configuration for specific environments.                                                                 | String   | `""`                                                                                  |
| `imageSwapConfig.isEKSCluster` | Specifies whether the cluster is an Amazon EKS cluster. Set to `false` if the Kubernetes cluster is not an EKS cluster. | Boolean  | `true`                                                                                |

```yaml
config:
  imageSwapImages:
    imageSwapInitImage: "gcr.io/spectro-images-public/release/thewebroot/imageswap-init:v1.5.3-spectro-4.5.1"
    imageSwapImage: "gcr.io/spectro-images-public/release/thewebroot/imageswap:v1.5.3-spectro-4.5.1"

  imageSwapConfig:
    isEKSCluster: true
```

## gRPC

gRPC is used for communication between Palette components. You can enable the deployment of an additional load balancer
for gRPC. Host clusters deployed by Palette use the load balancer to communicate with the Palette control plane. This is
an advanced configuration option, and it is not required for most deployments. Speak with your support representative
before enabling this option.

If you want to use an external gRPC endpoint, you must provide a domain name for the gRPC endpoint and a valid x509
certificate. Additionally, you must provide a custom domain name for the endpoint. A CNAME DNS record must point to the
IP address of the gRPC load balancer. For example, if your Palette domain name is `palette.example.com`, you could
create a CNAME DNS record for `grpc.palette.example.com` that points to the IP address of the load balancer dedicated to
gRPC.

| **Parameters**        | **Description**                                                                                                                                                                                                                                                                                                          | **Type** | **Default value** |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------- |
| `external`            | Specifies whether to use an external gRPC endpoint.                                                                                                                                                                                                                                                                      | Boolean  | `false`           |
| `endpoint`            | The gRPC endpoint.                                                                                                                                                                                                                                                                                                       | String   | `""`              |
| `annotations`         | A map of key-value pairs that specifies load balancer annotations for gRPC. You can use annotations to change the behavior of the load balancer and the gRPC configuration. This field is considered an advanced setting. We recommend you consult with your assigned support team representative before making changes. | Object   | `{}`              |
| `grpcStaticIP`        | Specify a static IP address for the gRPC load balancer service. If the field is empty, a dynamic IP address will be assigned to the load balancer.                                                                                                                                                                       | String   | `""`              |
| `caCertificateBase64` | The base64-encoded Certificate Authority (CA) certificate for the gRPC endpoint.                                                                                                                                                                                                                                         | String   | `""`              |
| `serverCrtBase64`     | The base64-encoded server certificate for the gRPC endpoint.                                                                                                                                                                                                                                                             | String   | `""`              |
| `serverKeyBase64`     | The base64-encoded server key for the gRPC endpoint.                                                                                                                                                                                                                                                                     | String   | `""`              |
| `insecureSkipVerify`  | Specifies whether to skip Transport Layer Security (TLS) verification for the gRPC endpoint.                                                                                                                                                                                                                             | Boolean  | `false`           |

```yaml
grpc:
  external: false
  endpoint: ""
  annotations: {}
  grpcStaticIP: ""
  caCertificateBase64: ""
  serverCrtBase64: ""
  serverKeyBase64: ""
  insecureSkipVerify: false
```

## Ingress

Palette deploys an Nginx Ingress Controller. This controller is used to route traffic to the Palette control plane. You
can change the default behavior and omit the deployment of an Nginx Ingress Controller.

| **Parameters**                         | **Description**                                                                                                                                                                                                                                                                                             | **Type** | **Default value** |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `enabled`                              | Specifies whether to deploy an Nginx controller. Set to `false` if you do not want an Nginx controller deployed.                                                                                                                                                                                            | Boolean  | `true`            |
| `ingress.internal`                     | Specifies whether to deploy a load balancer or use the host network.                                                                                                                                                                                                                                        | Boolean  | `false`           |
| `ingress.certificate`                  | Specify the base64-encoded x509 SSL certificate for the Nginx Ingress Controller. If left blank, the Nginx Ingress Controller will generate a self-signed certificate.                                                                                                                                      | String   | `""`              |
| `ingress.key`                          | Specify the base64-encoded x509 SSL certificate key for the Nginx Ingress Controller.                                                                                                                                                                                                                       | String   | `""`              |
| `ingress.annotations`                  | A map of key-value pairs that specifies load balancer annotations for ingress. You can use annotations to change the behavior of the load balancer and the Nginx configuration. This is an advanced setting. We recommend you consult with your assigned support team representative prior to modification. | Object   | `{}`              |
| `ingress.ingressStaticIP`              | Specify a static IP address for the ingress load balancer service. If empty, a dynamic IP address will be assigned to the load balancer.                                                                                                                                                                    | String   | `""`              |
| `ingress.terminateHTTPSAtLoadBalancer` | Specifies whether to terminate HTTPS at the load balancer.                                                                                                                                                                                                                                                  | Boolean  | `false`           |

```yaml
ingress:
  enabled: true
  ingress:
    internal: false
    certificate: ""
    key: ""
    annotations: {}
    ingressStaticIP: ""
    terminateHTTPSAtLoadBalancer: false
```

## Spectro Proxy

<!-- prettier-ignore -->
You can specify a reverse proxy server that clusters deployed through Palette can use to facilitate network connectivity
to the cluster's Kubernetes API server. Host clusters deployed in private networks can use the <VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack to expose the cluster's Kubernetes API to downstream clients that are not in the same network. Check out the [Reverse
Proxy](../../../../system-management/reverse-proxy.md) documentation to learn more about setting up a reverse proxy server for
Palette.

| **Parameters**    | **Description**                                                                              | **Type** | **Default value** |
| ----------------- | -------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `frps.enabled`    | Specifies whether to enable the Spectro server-side proxy.                                   | Boolean  | `false`           |
| `frps.frpHostURL` | The Spectro server-side proxy URL.                                                           | String   | `""`              |
| `frps.server.crt` | The base64-encoded server certificate for the Spectro server-side proxy.                     | String   | `""`              |
| `frps.server.key` | The base64-encoded server key for the Spectro server-side proxy.                             | String   | `""`              |
| `frps.ca.crt`     | The base64-encoded certificate authority (CA) certificate for the Spectro server-side proxy. | String   | `""`              |

```yaml
frps:
  frps:
    enabled: false
    frpHostURL: ""
    server:
      crt: ""
      key: ""
    ca:
      crt: ""
```

## UI System

The table lists parameters to configure the Palette User Interface (UI) behavior. You can disable the UI or the Network
Operations Center (NOC) UI. You can also specify the MapBox access token and style layer ID for the NOC UI. MapBox is a
third-party service that provides mapping and location services. To learn more about MapBox and how to obtain an access
token, refer to the [MapBox Access tokens](https://docs.mapbox.com/help/getting-started/access-tokens) guide.

| **Parameters**                 | **Description**                                                                                                                                                                                                                                    | **Type** | **Default value** |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `enabled`                      | Specifies whether to enable the Palette UI.                                                                                                                                                                                                        | Boolean  | `true`            |
| `ui.nocUI.enable`              | Specifies whether to enable the Palette Network Operations Center (NOC) UI. Enabling this parameter requires the `ui.nocUI.mapBoxAccessToken`. Once enabled, all cluster locations will be reported to MapBox. This feature is not FIPS compliant. | Boolean  | `false`           |
| `ui.nocUI.mapBoxAccessToken`   | The MapBox access token for the Palette NOC UI.                                                                                                                                                                                                    | String   | `""`              |
| `ui.nocUI.mapBoxStyledLayerID` | The MapBox style layer ID for the Palette NOC UI.                                                                                                                                                                                                  | String   | `""`              |

```yaml
ui-system:
  enabled: true
  ui:
    nocUI:
      enable: false
      mapBoxAccessToken: ""
      mapBoxStyledLayerID: ""
```

## Reach System

You can configure Palette to use a proxy server to access the internet. Set the parameter `reach-system.enabled` to
`true` to enable the proxy server. Proxy settings are configured in the `reach-system.proxySettings` section.

| **Parameters**                          | **Description**                                                                     | **Type** | **Default value** |
| --------------------------------------- | ----------------------------------------------------------------------------------- | -------- | ----------------- |
| `reachSystem.enabled`                   | Specifies whether to enable the usage of a proxy server for Palette.                | Boolean  | `false`           |
| `reachSystem.proxySettings.http_proxy`  | The HTTP proxy server URL.                                                          | String   | `""`              |
| `reachSystem.proxySettings.https_proxy` | The HTTPS proxy server URL.                                                         | String   | `""`              |
| `reachSystem.proxySettings.no_proxy`    | A list of hostnames or IP addresses that should not be go through the proxy server. | String   | `""`              |
| `reachSystem.proxySettings.ca_crt_path` | The base64-encoded certificate authority (CA) of the proxy server.                  | String   | `""`              |
| `reachSystem.scheduleOnControlPlane`    | Specifies whether to schedule the reach system on the control plane.                | Boolean  | `true`            |

```yaml
reach-system:
  enabled: false
  proxySettings:
    http_proxy: ""
    https_proxy: ""
    no_proxy:
    ca_crt_path: ""
  scheduleOnControlPlane: true
```

:::info

Due to node affinity configurations, you must set `scheduleOnControlPlane: false` for managed clusters deployed to
[Azure AKS](../../../../../../clusters/public-cloud/azure/aks.md),
[AWS EKS](../../../../../../clusters/public-cloud/aws/eks.md), and
[GCP GKE](../../../../../../clusters/public-cloud/gcp/create-gcp-gke-cluster.md).

:::
