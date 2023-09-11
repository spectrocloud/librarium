---
sidebar_label: "Helm Chart Install Reference"
title: "Helm Chart Install References"
description: "Reference for Palette Helm Chart installation parameters."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["self-hosted", "enterprise"]
---


You can use the Palette Helm Chart to install Palette in a multi-node Kubernetes cluster in your production environment. The Helm chart allows you to customize values in the **values.yaml** file. This reference lists and describes parameters available in the **values.yaml** file from the Helm Chart for your installation. To learn how to install Palette using the Helm Chart, refer to [Helm Chart Mode](/enterprise-version/deploying-palette-with-helm).


Depending on what version of Palette you are using, the available parameters will be different. Select the version below that corresponds to the version of Palette you are using.

- [4.0.0 or greater](#400-or-greater)

- [3.4.0 or earlier](#340-or-earlier)

<br />



## 4.0.0 or Greater

### Required Parameters

The following parameters are required for a successful installation of Palette.


| **Parameters** | **Description** | **Type** |
| --- | --- | --- |
| `config.env.rootDomain` | Used to configure the domain for the Palette installation. We recommend you create a CNAME DNS record that supports multiple subdomains. You can achieve this using a wild card prefix, `*.palette.abc.com`. Review the [Environment parameters](#environment) to learn more. | String |
| `config.env.ociRegistry` or `config.env.ociEcrRegistry`|  Specifies the FIPS image registry for Palette. You can use an a self-hosted OCI registry or a public OCI registry we maintain and support. For more information, refer to the [Registry](#registries) section. | Object |
| `scar`| The Spectro Cloud Artifact Repository (SCAR) credentials for Palette FIPS images.  Our support team provides these credentials. For more information, refer to the [Registry](#registries) section. | Object |


:::caution

If you are installing an air-gapped version of Palette, you must provide the image swap configuration. For more information, refer to the [Image Swap Configuration](#imageswapconfiguration) section.


:::


### MongoDB 

Palette uses MongoDB Enterprise as its internal database and supports two modes of deployment: <br /> <br />

-  MongoDB Enterprise deployed and active inside the cluster. 


-  MongoDB Enterprise is hosted on a software-as-a-service (SaaS) platform, such as MongoDB Atlas.

The table below lists the parameters used to configure a MongoDB deployment. 

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `internal` | Specifies the MongoDB deployment either in-cluster or using Mongo Atlas. | Boolean | `true` | 
| `databaseUrl`| The URL for MongoDB Enterprise. If using a remote MongoDB Enterprise instance, provide the remote URL. This parameter must be updated if `mongo.internal` is set to `false`. | String | `mongo-0.mongo,mongo-1.mongo,mongo-2.mongo` |
| `databasePassword`| The base64-encoded MongoDB Enterprise password. If you don't provide a value, a random password will be auto-generated. | String | `""` |
| `replicas`| The number of MongoDB replicas to start. | Integer | `3` |
| `memoryLimit`| Specifies the memory limit for each MongoDB Enterprise replica.| String | `4Gi` |
| `cpuLimit` | Specifies the CPU limit for each MongoDB Enterprise member.| String | `2000m` |
| `pvcSize`| The storage settings for the MongoDB Enterprise database. Use increments of `5Gi` when specifying the storage size. The storage size applies to each replica instance. The total storage size for the cluster is `replicas` * `pvcSize`. | string | `20Gi`|
| `storageClass`| The storage class for the MongoDB Enterprise database. | String | `""` |


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

### Config 

Review the following parameters to configure Palette for your environment. The `config` section contains the following subsections:


#### Install Mode

You can install Palette in connected or air-gapped mode. The table lists the parameters to configure the installation mode.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `installMode` | Specifies the installation mode. Allowed values are `connected` or `airgap`. Set the value to `airgap` when conducting an install in an air gap environment. | String | `connected` |

```yaml
config:
  installationMode: "connected"
```

#### SSO 

You can configure Palette to use Single Sign-On (SSO) for user authentication. Configure the SSO parameters to enable SSO for Palette. You can also configure different SSO providers for each tenant post-install, check out the [SAML & SSO Setup](/user-management/saml-sso) documentation for additional guidance.

To configure SSO, you must provide the following parameters.

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- | --- |
| `saml.enabled` | Specifies whether to enable SSO SAML configuration by setting it to true. | Boolean | `false` |
| `saml.acsUrlRoot` | The root URL of the Assertion Consumer Service (ACS).| String | `myfirstpalette.spectrocloud.com`|
| `saml.acsUrlScheme` | The URL scheme of the ACS: `http` or `https`. | String | `https` |
| `saml.audienceUrl` | The URL of the intended audience for the SAML response.| String| `https://www.spectrocloud.com` | 
| `saml.entityID` | The Entity ID of the Service Provider.| String | `https://www.spectrocloud.com`|
| `saml.apiVersion` | Specify the SSO SAML API version to use.| String | `v1` |

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

#### Email

Palette uses email to send notifications to users. The email notification is used when inviting new users to the platform, password resets, and when [webhook alerts](/clusters/cluster-management/health-alerts#overview) are triggered. Use the following parameters to configure email settings for Palette.

| **Parameters** |  **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled` | Specifies whether to enable email configuration. | Boolean| `false`|
| `emailID ` |  The email address for sending mail.| String| `noreply@spectrocloud.com` |
| `smtpServer` |  Simple Mail Transfer Protocol (SMTP) server used for sending mail. | String | `smtp.gmail.com` |
| `smtpPort` | SMTP port used for sending mail.| Integer | `587` |
| `insecureSkipVerifyTLS` | Specifies whether to skip Transport Layer Security (TLS) verification for the SMTP connection.| Boolean | `true` |
| `fromEmailID` | Email address of the ***From*** address.| String | `noreply@spectrocloud.com` |
| `password` | The base64-encoded SMTP password when sending emails.| String | `""` |

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

#### Environment 

The following parameters are used to configure the environment.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `env.rootDomain` | Specifies the URL name assigned to Palette Vertex. The value assigned should have a Domain Name System (DNS) CNAME record mapped to exposed IP address or the load balancer URL of the service *ingress-nginx-controller*. Optionally, if `ingress.ingressStaticIP` is provided with a value you can use same assigned static IP address as the value to this parameter.| String| `""` |
| `env.installerMode` | Specifies the installer mode. Do not modify the value.| String| `self-hosted` |
| `env.installerCloud` | Specifies the cloud provider. Leave this parameter empty if you are installing a self-hosted Palette.  | String | `""` |

```yaml
config:
  env:
    rootDomain: ""
```
<br />

:::caution

As you create tenants in Palette, the tenant name is prefixed to the domain name you assigned to Palette. For example, if you create a tenant named tenant1 and the domain name you assigned to Palette is `palette.example.com`, the tenant URL will be `tenant1.palette.example.com`. We recommend you create an additional wildcard DNS record to map all tenant URLs to the Palette load balancer. For example, `*.palette.example.com`.

:::

#### Cluster 

Use the following parameters to configure the Kubernetes cluster.


| **Parameters** | **Description** |  **Type** | **Default value** | 
| --- | --- | --- | --- |
| `stableEndpointAccess` | Set to `true` if the Kubernetes cluster is deployed in a public endpoint. If the cluster is deployed in a private network through a stable private endpoint, set to `false`.  | Boolean | `false` |

```yaml
config:
  cluster:
    stableEndpointAccess: false
```

### Registries

Palette requires credentials to access the required Palette images. You can configure different types of registries for Palette to download the required images. You must configure at least one Open Container Initiative (OCI) registry for Palette. You must also provide the credentials for the Spectro Cloud Artifact Repository (SCAR) to download the required FIPS images.

<br />

#### OCI Registry


Palette requires access to an OCI registry that contains all the required FIPS packs. You can host your own OCI registry and configure Palette to reference the registry. Alternatively, you can use the public OCI registry that we provide. Refer to the [`ociPackEcrRegistry`](#ociecrregistry) section to learn more about the publicly available OCI registry.



| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- | 
| `ociPackRegistry.endpoint` | The endpoint URL for the registry. | String| `""` |
| `ociPackRegistry.name` |  The name of the registry. | String| `""` |
| `ociPackRegistry.password` | The base64-encoded password for the registry.  | String| `""` |
| `ociPackRegistry.username` |  The username for the registry. | String| `""` |
| `ociPackRegistry.baseContentPath`| The base path for the registry. | String | `""` |
| `ociPackRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean | `false` |
| `ociPackRegistry.caCert` | The registry's base64-encoded certificate authority (CA) certificate. | String | `""` |


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

#### OCI ECR Registry

We expose a public OCI ECR registry that you can configure Palette to reference. If you want to host your own OCI registry, refer to the [OCI Registry](#oci-registry) section.
The OCI Elastic Container Registry (ECR) is hosted in an AWS ECR registry. Our support team provides the credentials for the OCI ECR registry.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `ociPackEcrRegistry.endpoint` | The endpoint URL for the registry. | String| `""` |
| `ociPackEcrRegistry.name` |  The name of the registry. | String| `""` |
| `ociPackEcrRegistry.accessKey` | The base64-encoded access key for the registry.  | String| `""` |
| `ociPackEcrRegistry.secretKey` |  The base64-encoded secret key for the registry. | String| `""` |
| `ociPackEcrRegistry.baseContentPath`| The base path for the registry. | String | `""` |
| `ociPackEcrRegistry.isPrivate` | Specifies whether the registry is private. | Boolean | `true` |
| `ociPackEcrRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean | `false` |
| `ociPackEcrRegistry.caCert` | The registry's base64-encoded certificate authority (CA) certificate. | String | `""` |

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

#### Spectro Cloud Artifact Repository (SCAR)

SCAR credentials are required to download the necessary FIPS manifests. Our support team provides the SCAR credentials.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- | 
| `scar.endpoint` | The endpoint URL of SCAR. | String| `""` |
| `scar.username` |The username for SCAR. | String| `""` |
| `scar.password` | The base64-encoded password for the SCAR. | String| `""` |
| `scar.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the SCAR connection. | Boolean | `false` |
| `scar.caCert` | The base64-encoded certificate authority (CA) certificate for SCAR. | String | `""` |

<br />

  ```yaml
  config:
    scar:
      endpoint: ""
      username: ""
      password: ""
      insecureSkipVerify: false
      caCert: ""
  ```

#### Image Swap Configuration

You can configure Palette to use image swap to download the required images. This is an advanced configuration option, and it is only required for air-gapped deployments. You must also install the Palette Image Swap Helm chart to use this option, otherwise, Palette will ignore the configuration.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imageSwapInitImage` | The image swap init image. | String | `gcr.io/spectro-images-public/thewebroot/imageswap-init:v1.5.2` |
| `imageSwapImage` | The image swap image. | String | `gcr.io/spectro-images-public/thewebroot/imageswap:v1.5.2` |
| `imageSwapConfig`| The image swap configuration for specific environments. | String | `""` |
| `imageSwapConfig.isEKSCluster` | Specifies whether the cluster is an Amazon EKS cluster. Set to `false` if the Kubernetes cluster is not an EKS cluster. | Boolean | `true` |

  <br />

  ```yaml
  config:
    imageSwapImages:
    imageSwapInitImage: "gcr.io/spectro-images-public/thewebroot/imageswap-init:v1.5.2"
    imageSwapImage: "gcr.io/spectro-images-public/thewebroot/imageswap:v1.5.2"

    imageSwapConfig:
      isEKSCluster: true
  ```

### NATS

Palette uses [NATS](https://nats.io) and gRPC for communication between Palette components. Dual support for NATS and gRPC is available. You can enable the deployment of an additional load balancer for NATS. Host clusters deployed by Palette use the load balancer to communicate with the Palette control plane. This is an advanced configuration option and is not required for most deployments. Speak with your support representative before enabling this option.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `nats.enabled`| Specifies whether to enable the deployment of a NATS load balancer. | Boolean | `true` |
| `nats.internal`| Specifies whether to deploy a load balancer or use the host network. If this value is set to `true`, then the remaining NATS parameters are ignored. | Boolean | `true` |
| `nats.natsUrl`| The NATS URL. This can be a comma separated list of <dns_name:port> mappings for the NATS load balancer service. For example, "message1.dev.spectrocloud.com:4222,message2.dev.spectrocloud.com:4222". This parameter is mandatory if `nats.internal` is set to `false`. If `nats.internal` is set to `true`, you can leave this parameter empty. | String | `""` |
| `nats.annotations`| A map of key-value pairs that specifies load balancer annotations for NATS. You can use annotations to change the behavior of the load balancer and the Nginx configuration. This is an advanced setting. We recommend you consult with your assigned support team representative prior to modification. | Object | `{}` |
| `nats.natsStaticIP`| Specify a static IP address for the NATS load balancer service. If empty, a dynamic IP address will be assigned to the load balancer. | String | `""` |


<br />

  ```yaml
  nats:
    enabled: true
    internal: true
    natsUrl: ""
    annotations: {}
    natsStaticIP: 
```


  

### gRPC

gRPC is used for communication between Palette components. You can enable the deployment of an additional load balancer for gRPC. Host clusters deployed by Palette use the load balancer to communicate with the Palette control plane. This is an advanced configuration option, and it is not required for most deployments. Speak with your support representative before enabling this option. Dual support for NATS and gRPC is available.

If you want to use an external gRPC endpoint, you must provide a domain name for the gRPC endpoint and a valid x509 certificate. Additionally, you must provide a custom domain name for the endpoint. A CNAME DNS record must point to the IP address of the gRPC load balancer. For example, if your Palette domain name is `palette.example.com`, you could create a CNAME DNS record for `grpc.palette.example.com` that points to the IP address of the load balancer dedicated to gRPC. 

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `external`| Specifies whether to use an external gRPC endpoint. | Boolean | `false` |
| `endpoint`| The gRPC endpoint. | String | `""` |
| `caCertificateBase64`| The base64-encoded certificate authority (CA) certificate for the gRPC endpoint. | String | `""` |
| `serverCrtBase64`| The base64-encoded server certificate for the gRPC endpoint. | String | `""` |
| `serverKeyBase64`| The base64-encoded server key for the gRPC endpoint. | String | `""` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the gRPC endpoint. | Boolean | `false` |




```yaml
grpc:
  external: false
  endpoint: "" 
  caCertificateBase64: "" 
  serverCrtBase64: ""
  serverKeyBase64: ""
  insecureSkipVerify: false
```

### Ingress 

Palette deploys an Nginx Ingress Controller. This controller is used to route traffic to the Palette control plane. You can change the default behavior and omit the deployment of an Nginx Ingress Controller. 

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled`| Specifies whether to deploy an Nginx controller. Set to `false` if you do not want an Nginx controller deployed.  | Boolean | `true` |
| `ingress.internal`| Specifies whether to deploy a load balancer or use the host network. | Boolean | `false` |
| `ingress.certificate`| Specify the base64-encoded x509 SSL certificate for the Nginx Ingress Controller. If left blank, the Nginx Ingress Controller will generate a self-signed certificate. | String | `""` |
| `ingress.key`| Specify the base64-encoded x509 SSL certificate key for the Nginx Ingress Controller. | String | `""` |
| `ingress.annotations`| A map of key-value pairs that specifies load balancer annotations for ingress. You can use annotations to change the behavior of the load balancer and the Nginx configuration. This is an advanced setting. We recommend you consult with your assigned support team representative prior to modification. | Object | `{}` |
| `ingress.ingressStaticIP`| Specify a static IP address for the ingress load balancer service. If empty, a dynamic IP address will be assigned to the load balancer. | String | `""` |
| `ingress.terminateHTTPSAtLoadBalancer`| Specifies whether to terminate HTTPS at the load balancer. | Boolean | `false` |


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

### Spectro Proxy

You can specify a reverse proxy server that clusters deployed through Palette can use to facilitate network connectivity to the cluster's Kubernetes API server. Host clusters deployed in private networks can use the [Spectro Proxy pack](/integrations/frp) to expose the cluster's Kubernetes API to downstream clients that are not in the same network. Check out the [Reverse Proxy](/enterprise-version/reverse-proxy) documentation to learn more about setting up a reverse proxy server for Palette.


| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `frps.enabled`| Specifies whether to enable the Spectro server-side proxy. | Boolean | `false` |
| `frps.frpHostURL`| The Spectro server-side proxy URL. | String | `""` |
| `frps.server.crt`| The base64-encoded server certificate for the Spectro server-side proxy. | String | `""` |
| `frps.server.key`| The base64-encoded server key for the Spectro server-side proxy. | String | `""` |
| `frps.ca.crt`| The base64-encoded certificate authority (CA) certificate for the Spectro server-side proxy. | String | `""` |

```yaml
frps:
  frps:
    enabled: false
    frpHostURL: ""
    server:
      crt: ""
      key: ""
    ca:
      crt : ""
```

### UI System 

The table lists parameters to configure the Palette User Interface (UI) behavior. You can disable the UI or the Network Operations Center (NOC) UI. You can also specify the MapBox access token and style layer ID for the NOC UI. MapBox is a third-party service that provides mapping and location services. To learn more about MapBox and how to obtain an access token, refer to the [MapBox Access tokens](https://docs.mapbox.com/help/getting-started/access-tokens) guide. 


| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled`| Specifies whether to enable the Palette UI. | Boolean | `true` |
| `ui.nocUI.enable`| Specifies whether to enable the Palette Network Operations Center (NOC) UI. Enabling this parameter requires the `ui.nocUI.mapBoxAccessToken`. Once enabled, all cluster locations will be reported to MapBox. This feature is not FIPS compliant.  | Boolean | `false` |
| `ui.nocUI.mapBoxAccessToken`| The MapBox access token for the Palette NOC UI. | String | `""` |
| `ui.nocUI.mapBoxStyledLayerID`| The MapBox style layer ID for the Palette NOC UI. | String | `""` |



```yaml
ui-system:
  enabled: true
  ui:
    nocUI:
      enable: false
      mapBoxAccessToken: ""
      mapBoxStyledLayerID: "" 
```




### Reach System

You can configure Palette to use a proxy server to access the internet. Set the parameter `reach-system.reachSystem.enabled` to `true` to enable the proxy server. Proxy settings are configured in the `reach-system.reachSystem.proxySettings` section.


| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `reachSystem.enabled`| Specifies whether to enable the usage of a proxy server for Palette. | Boolean | `false` |
| `reachSystem.proxySettings.http_proxy`| The HTTP proxy server URL. | String | `""` |
| `reachSystem.proxySettings.https_proxy`| The HTTPS proxy server URL. | String | `""` |
| `reachSystem.proxySettings.no_proxy`| A list of hostnames or IP addresses that should not be proxied. | String | `""` |


 ```yaml
 reach-system:
  reachSystem:
    enabled: false
    proxySettings:
      http_proxy: ""
      https_proxy: ""
      no_proxy:
 ``` 

---

<br />

## 3.4.0 or Earlier

### Required Parameters

The following parameters in the **values.yaml** file are required: <br /> <br />

- **env.rootDomain** - Used to configure the domain for the Palette installation. You should create a CNAME DNS record separately, and it should be a wildcard to account for Organization prefixes. Review the [Environment parameters](/enterprise-version/helm-chart-install-reference#environment) to learn more. <br /> <br />

- **natsUrl** - The URL format specifies how to configure NATS servers to the IP address and port. Review the [Network Address Translation (NATS) parameters](/enterprise-version/helm-chart-install-reference#networkaddresstranslation(nats)) to learn more. <br /> <br />

 
 
- **Registry and Palette Artifact Repository** - Specifies the Docker registry where chart images are stored and the Palette Artifact Repository (PAR). Refer to the [Registry and Palette Artifact Repository parameters](/enterprise-version/helm-chart-install-reference#registryandpaletteartifactrepository(par)).

### MongoDB 

Palette uses MongoDB as its database and supports two modes of deployment: <br /> <br />

-  MongoDB deployed and active inside the cluster. 


-  MongoDB hosted on a software as a service (SaaS) platform, such as Atlas.

The table lists the parameters used to configure a MongoDB deployment. 

| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `internal` | `n/a` | Boolean | Specifies the MongoDB deployment either in-cluster or using Mongo Atlas. | Required |
| `databaseUrl` | `mongo-0.mongo,mongo-1.mongo,mongo-2.mongo` | String | URL for MongoDB. Change the URL if you are using Mongo Atlas.| Required|
| `databasePassword` | `""` | String | The base64 encoded MongoDB password. | Optional |
| `replicas` | `3` | Integer | Specifies the number of MongoDB replicas to start.| Required |
| `cpuLimit` | `2000m` | String | Specifies the CPU limit for each MongoDB replica.| Optional |
| `memorylimit` | `4Gi` | String |Specifies the memory limit for each MongoDB replica.| Optional |
| `pvcSize` | `20Gi` | String | Specifies the Persistent Volume Claim (PVC) size for each MongoDB replica.|Optional |
| `storageClass` | `""` | String | Storage class for the PVC. Leave this empty to use the default storage class. |Optional |


```yaml
mongo:
  databaseUrl: "mongo-0.mongo,mongo-1.mongo,mongo-2.mongo"
  replicas: 3
  cpuLimit: "2000m"
  memoryLimit: "4Gi"
  pvcSize: "20Gi"
  storageClass: ""
```

### Config 

The configuration file contains the following sections.

#### SSO 

The table lists parameters to configure SSO SAML authentication in Palette.

| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `saml.enabled` | `false` | Boolean | Specifies whether to enable SSO SAML configuration by setting it to true. | Optional|
| `saml.acsUrlRoot` | `myfirstpalette.spectrocloud.com` | String | Root URL of the Assertion Consumer Service (ACS).| Optional|
| `saml.acsUrlScheme` | `https` | String | URL scheme of the ACS either http or https. | Optional |
| `saml.audienceUrl` | `https://www.spectrocloud.com` | String | URL of the intended audience for the SAML response.| Optional|
| `saml.entityID` | `https://www.spectrocloud.com` | String | Entity ID of the Service Provider.| Optional |
| `saml.apiVersion` | `v1` | String |SSO SAML API version to use.| Optional |

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

#### Email

The table lists the parameters to configure email settings in Palette's self-hosted mode. 

| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `enabled` | `false` | Boolean | Specifies whether to enable email configuration. | Optional|
| `emailID ` | `""` | String | Email address for sending mail.| Optional|
| `smtpServer` | `smtp.gmail.com` | String | Simple Mail Transfer Protocol (SMTP) server used for sending mail. | Optional |
| `smtpPort` | `587` | Integer | SMTP port used for sending mail.| Optional|
| `insecureSkipVerifyTIs` | `true` | Boolean | Specifies whether to skip Transport Layer Security (TLS) verification for the SMTP connection.| Optional |
| `fromEmailID` | `noreply@spectrocloud.com` | String |Email address of the ***From*** address.| Optional |
| `password` | `""` | String |The base64-encoded SMTP password when sending emails.| Optional |

```yaml
config:
  email:
    enabled: false
    emailId: "<username>@spectrocloud.com"
    smtpServer: "smtp.gmail.com"
    smtpPort: 587
    insecureSkipVerifyTls: true
    fromEmailId: "noreply@spectrocloud.com"
    password: ""
```

#### Environment 

The table lists environment variables required to deploy Palette.

| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `env.rootDomain` | `""` | String | Specifies the default Domain Name System (DNS) record mapped to the *ingress-nginx-controller* load balancer. It is required if false. Otherwise, leave it empty. | Required|
| `env.installerMode` | `self-hosted` | String | Specifies the installer mode. Do not modify the value.| Required|
| `env.installerCloud` | `""` | String | Specifies the cloud provider. It should be left empty. | Optional |

```yaml
config:
    env:
    rootDomain: ""
    installerMode: "self-hosted"
    installerCloud: ""
```

#### Cluster 

The cluster parameter specifies how the Kubernetes cluster is deployed.


| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `stableEndpointAccess` | `false` | Boolean | False indicates the Kubernetes cluster is deployed in a private network through a stable private endpoint. True indicates the cluster is deployed through a public endpoint. | Optional|

```yaml
config:
    cluster:
    stableEndpointAccess: false
```

#### Registry and Palette Artifact Repository (PAR) 

The table lists Registry and Palette Artifact Repository (PAR) parameters to install Palette using Helm Chart.

| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `registry.endpoint` | `""` | String | The endpoint URL for the registry. | Required|
| `registry.name` | `""` | String | The name of the registry. | Required|
| `registry.password` | `""` | String | The password for the registry.  | Required|
| `registry.username` | `""` | String | The username for the registry. | Required|
| `scar.endpoint` | `""` | String | The endpoint URL of the PAR. | Required|
| `scar.username` | `""` | String | The username for the PAR. | Required|
| `scar.password` | `""` | String | The password for the PAR.   | Required|

```yaml
config:
    registry:
    endpoint: "<Contact Spectro Cloud Sales for More info>"
    name: "<Contact Spectro Cloud Sales for More info>"
    password: "<Contact Spectro Cloud Sales for More info>"
    username: "<Contact Spectro Cloud Sales for More info>"

    scar:
    endpoint: "<Contact Spectro Cloud Sales for More info>"
    username: "<Contact Spectro Cloud Sales for More info>"
    password: "<Contact Spectro Cloud Sales for More info>"
```

Contact support@spectrocloud.com to gain access to the Helm Chart.

### Network Address Translation (NATS) 

The table lists Network Address Translation (NATS) parameters that Palette uses for communication between the tenant and management clusters. The internal flag determines whether NATS uses a new load balancer or the existing ingress service. To learn about NATS cluster configuration map properties, refer to [NATS clustering configuration.](https://docs.nats.io/running-a-nats-service/configuration/clustering/cluster_config)

| **Parameters **  | **Default Value** | **Type **   | **Description**                                                                                                               | **Required/Optional** |
| ------------ | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `internal`   | `true`        | Boolean | `true` means NATS shares the ingress load balancer or uses hostNetwork. `false` means a cloud load balancer is used.      | Optional           |
| `natsUrl`    |     `""`    | String  | Comma-separated list of <dns_name:port> mappings for NATS load balancer service. Required if `nats.internal` is false.     | Required           |
| `annotations`| `{}`          | Map     | A map of key-value pairs that specify the load balancer annotations for NATS. These annotations vary depending on the cloud provider.                                                                                           | Optional           |
| `routes`     | `[]`          | List    | List of server URLs for clustering (excluding self-routes) that can include authentication via token or username/password in the URL.                                               | Optional           |
| `natsStaticIP`| `""`         | String  | Static IP for the NATS load balancer service. If empty, a dynamic IP address will be generated.                                   | Optional           |

```yaml
nats:
  internal: true
  natsUrl: ""
  annotations: {}
  routes: []
  natsStaticIP: ""
```

### Ingress 

The table lists parameters used to configure the NGINX Ingress Controller, which provides an external HTTP load balancer for Kubernetes services. Refer to [Set Up Ingress](/clusters/cluster-groups/ingress-cluster-group) for more guidance.

| **Parameters**                     | **Default Value** | **Type**    | **Description**                                                                                                                                       | **Required/Optional** |
|--------------------------------|---------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `Internal`                     | `false`       | Boolean |Specify whether to use a cloud load balancer or host network.                   | Required           |
| `certificate`                  | `""`          | String  | Default SSL certificate for NGINX Ingress Controller. If left blank, the NGINX Ingress Controller will generate a self-signed certificate.                  | Optional           |
| `key`                          | `""`          | String  | Default SSL key for the NGINX Ingress Controller.                                                                                        | Optional           |
| `annotations`                  | `{}`          | Map     | A map of key-value pairs that specifies load balancer annotations for ingress.                                                                      | Optional           |
| `ingressStaticIP`              | `""`          | String  | Static IP for the ingress load balancer service. If empty, a dynamic IP address will be generated.                                                        | Optional           |
| `terminateHTTPSAtLoadBalancer` | `false`       | Boolean | Specify whether to terminate HTTPS at the load balancer.                 | Optional           |

```yaml
ingress:
  ingress:
    internal: false
    certificate: ""
    key: ""
    annotations: {}
    ingressStaticIP: ""
    terminateHTTPSAtLoadBalancer: false
```

### Spectro Proxy

The table lists parameters to configure the Spectro server-side proxy.

| **Parameters**          | **Default Value**                | **Type**    | **Description**                                                   | **Required/Optional** |
|---------------------|------------------------------|---------|---------------------------------------------------------------|--------------------|
| `enabled`      | `false`                      | Boolean | Specifies whether Spectro Proxy is enabled or not.                       | Optional           |
| `frpHostURL`   | `proxy.sample.spectrocloud.com` | String  | The URL of the Spectro proxy host.                                 | Optional           |
| `server.crt`   |   `"LS0..."`                            | String  | Specifies the certificate file for the Spectro Proxy server.             | Optional           |
| `server.key`   |    `"LS0..."`                           | String  | Specifies the private key file for the Spectro Proxy server.             | Optional           |
| `ca`           |      `"LS0..."`                         | String  | Specifies the Certificate Authority (CA) for the Spectro Proxy server.  | Optional           |
| `ca.crt`       |  `"LS0..."`                             | String  | Specifies the CA certificate file for the Spectro Proxy server.         | Optional           |

```yaml
frps:
  frps:
    enabled: false
    frpHostURL: proxy.sample.spectrocloud.com
    server:
      crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURqekNDQW5lZ0F3SUJBZ0lVZTVMdXBBZGljd0Z1SFJpWWMyWEgzNTFEUzJJd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk1qY3hNREV6TVRNeU5ERXlXakI3TVFzd0NRWURWUVFHRXdKVlV6RUxNQWtHCkExVUVDQk1DUTBFeEV6QVJCZ05WQkFjVENsTmhiblJoUTJ4aGNtRXhGVEFUQmdOVkJBb1RERk53WldOMGNtOUQKYkc5MVpERUxNQWtHQTFVRUN4TUNTVlF4SmpBa0JnTlZCQU1USFhCeWIzaDVMbk5oYlhCc1pTNXpjR1ZqZEhKdgpZMnh2ZFdRdVkyOXRNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQXd5bEt3MmlxClBXM2JrQU0wV3RhaEFLbEppcWFHd05LUDVRRTZ6ZW5NM2FURko3TjIwN0dWcUNGYzJHTDNodmNhTDFranZjeEkKK2lybHpkbm9hcVhUSmV3ZkJiTGs2SGVhZmdXUVp3NHNNeE5QRUVYYlNXYm54Mm03Y2FlbVJiUWZSQWhPWXRvWgpIWG1IMzQ1Q25mNjF0RnhMeEEzb0JRNm1yb0JMVXNOOUh2WWFzeGE5QUFmZUNNZm5sYWVBWE9CVmROalJTN1VzCkN5NmlSRXpEWFgvem1nOG5WWFUwemlrcXdoS3pqSlBJd2FQa2ViaXVSdUJYdEZ0VlQwQmFzS3VqbURzd0lsRFQKVmR4SHRRQUVyUmM4Q2Nhb20yUkpZbTd1aHNEYlo2WVFzS3JiMmhIbU5rNENVWUd5eUJPZnBwbzR2bFd1S2FEcgpsVFNYUXlPN0M0ejM1d0lEQVFBQm8xNHdYREJhQmdOVkhSRUVVekJSZ2dsc2IyTmhiR2h2YzNTSEJIOEFBQUdDCkhYQnliM2g1TG5OaGJYQnNaUzV6Y0dWamRISnZZMnh2ZFdRdVkyOXRnaDhxTG5CeWIzaDVMbk5oYlhCc1pTNXoKY0dWamRISnZZMnh2ZFdRdVkyOXRNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUEvRFJFVm54SWJRdi9uMDEvSQpJd1d0ekhKNGNHOUp6UlB6dmszNUcvRGJOVzZYZ0M3djBoWlFIVHg5bzMrckxoSUFiWTNmbjc1VEtlN3hMRWpiCkI3M3pGWURJSStkYzM5NkQzZU51M2NxRGIvY01kYmlFalhod2ttZk9NRm9qMnpOdHJIdzFsSjA0QlNFMWw1YWgKMDk0Vy9aaEQ2YTVLU3B0cDh1YUpKVmNrejRYMEdRWjVPYjZadGdxZVVxNytqWVZOZ0tLQzJCMW1SNjMyMDNsZwozVFZmZEkrdmI3b292dVdOOFRBVG9qdXNuS25WMmRMeTFBOWViWXYwMEM3WWZ6Q0NhODgrN2dzTGhJaUJjRHBPClJkWjU3QStKanJmSU5IYy9vNm5YWFhDZ2h2YkFwUVk1QnFnMWIzYUpUZERNWThUY0hoQVVaQzB5eU04bXcwMnQKWHRRQwotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
      key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBd3lsS3cyaXFQVzNia0FNMFd0YWhBS2xKaXFhR3dOS1A1UUU2emVuTTNhVEZKN04yCjA3R1ZxQ0ZjMkdMM2h2Y2FMMWtqdmN4SStpcmx6ZG5vYXFYVEpld2ZCYkxrNkhlYWZnV1FadzRzTXhOUEVFWGIKU1dibngybTdjYWVtUmJRZlJBaE9ZdG9aSFhtSDM0NUNuZjYxdEZ4THhBM29CUTZtcm9CTFVzTjlIdllhc3hhOQpBQWZlQ01mbmxhZUFYT0JWZE5qUlM3VXNDeTZpUkV6RFhYL3ptZzhuVlhVMHppa3F3aEt6akpQSXdhUGtlYml1ClJ1Qlh0RnRWVDBCYXNLdWptRHN3SWxEVFZkeEh0UUFFclJjOENjYW9tMlJKWW03dWhzRGJaNllRc0tyYjJoSG0KTms0Q1VZR3l5Qk9mcHBvNHZsV3VLYURybFRTWFF5TzdDNHozNXdJREFRQUJBb0lCQUFPVVZFeTFOTG9mczdFMgpmZFZVcm10R3I1U2RiVWRJRlYrTDREbzZtWWxQSmxhT0VoWGI0ZlROZDloNEtEWVBmaWwwSnhXcUU0U1RHTmZuCnNUMlRnUVhuQ01LZi8xYk1Lc2M0N3VjVStYYU9XaHJnVFI5UmhkckFjN0duODRLL3hQc0ljL2VZTEhHLzh1QUUKeWUvLzVmRkM2QmpXY0hUM1NkTlZnd3duamJudG5XTXIzTFJBVnJBamZBckxveWUwS0F2YytYdXJLTEVCcmMyVQpjaHlDbitZemJKN0VlSG44UXdQNGdBNXVSK0NCMFJPeFErYXIzS3M5YUhkZTQ1OEVNNEtLMnpUOXA4RWZRc1lFCkFtNUpxWjliR0JEVHV1dEkyNm9GK0pLQ1IzZzhXNERRcHVYRUZoVjlya0pMSm13RDhQb0JaclF6UzZvdmJhdkkKRk42QVM4RUNnWUVBOEcxQzFxZVh4dTQ4aEYxak5MTCswRmxkeWdFem9SMmFoRGJCai8weUZkQVVjU2pYTzk0NAozN1dORTBUUG10WG1Vc3NZTlBTR21XaWI2OUhicEFoMTY3SWVwNE9LaVlZdkozYm1oUC9WNzFvK3M0SWJlSHh1CkVJbWVVckFOZWRoQURVQnZ4c1lXRWxlVlVJSFFRcjY1VHM2ZjIrWkpTKzg4TU05bUorL3BmcmNDZ1lFQXo4MXgKR3JiSE5oak56RjhZMjhiK0hMNW5rdDR0SUdkU3hnbW9PMFFJeGkrQVNZTzB0WW42VFk0ZHI5ZXErMzE3b21ZawpMbDNtNENORDhudG1vYzRvWnM4SUpDQ0IrZjNqcTY4OHdoQU9vVHZ4dDhjZVJqOFRhRHl1SHZwS043OVNsVVd2CjBJd2ZRNDNIemd3SWJiSWhjcTRJVGswanI0VHdWbThia283VElGRUNnWUJoNnUzVXhHN0JHeGZVaE1BNW4waSsKREJkeGhPbkZEV3gzdW1FOHhrN1dxV2NaNnhzMWk3eTRCNVhNS2pNdkNUeURyYWxQTCtOOXFTZ1BjK216TmFybwo4aU1mOENmRStMeE5vMVFoQ0p6Vm5YaDUzVnhZeHJ5QXlidU1TNTFCYVh3MHFYQ2NrT0krV0NNOHBaSHZEUVFsCmYydUZ3SlZMY3NTZDBHbjNpL01ab3dLQmdBY1BzUjg2Uk15MnpROTd6OGx3R3FSNVorV2F2U2ZUdXdGVnhLeTIKNUNGdjdja1J1NnRMbEFEY3FtK1dRWTRvTm5KUFREMXpIV3hTWm5XdjhjM2Z4b212MFZRQThzbSs4ZVNjb05EcgpZTVBqMkpQcEpVTTMwMzRBU2Q1dG5PWUdEMVZaTjk4N1U3aWs4Ynd6dG5tYnl2MHRvc1NlWkc4TGNtdE5mVDllCnNSZnhBb0dCQUpTV1lDellyTlRMNnRUSnh5M2FqWm5jZkxrMEV0eWNCd05FRXZHVzVSVE9LOUFYTE96RzN0eHUKajZqWlRpaUFRU09aaVd0clJHU0U0bEkyQ1MvcjNjd3VuSGlnZlovd1dKZldkZ0JpRnZqOTVFbUVQWUZaRDRobQpkT3l5UHhRRXFTRmprQ21BS2plOFBpTDdpU01GbGhBZTZQWFljQlExdCtzd01UeXBnY3RrCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
    ca:
      crt : LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURNVENDQWhtZ0F3SUJBZ0lVSHhWK0ljVGZHUElzdW8yY3dqQ0Q0Z2RSTFFRd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0tERW1NQ1FHQTFVRUF3d2RjSEp2ZUhrdWMyRnRjR3hsTG5Od1pXTjBjbTlqYkc5MVpDNWpiMjB3SGhjTgpNakl4TURFME1UTXlOREV5V2hjTk16WXdOakl5TVRNeU5ERXlXakFvTVNZd0pBWURWUVFEREIxd2NtOTRlUzV6CllXMXdiR1V1YzNCbFkzUnliMk5zYjNWa0xtTnZiVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0MKQVFvQ2dnRUJBSy90WXBHVi9HRURUWnZzL25QQ2lOK0U3K1dOQ21GeU1NQjdkazVOT3JzQWZIaVVvZ1JRVUo0WQptSjhwVmYrSzhTRFBsdGNYcW40WVVTbmxiUERsVlBkWU5zOTEwT3RaS1EwNW96aUtGV2pNbS85NHlLSjVyVzNsCndDNEN0ayttUm9Ib0ZQQS81dmFVbVZHdlVadjlGY0JuL0pKN2F4WnRIQk1PRiticXQ0Zmd0ci9YMWdOeWhPVzUKZTVScGpESkozRjJTVnc5NUpBQSt4a3V3UitFSmVseEtnQVpxdDc0ejB4U2ROODZ0QzNtK0wxRGs2WVVlQWEzZApvM3Rsa3ZkeDV6dUJvSmI2QmpZWEV4UE1PbThRcHFNVWRLK3lDZUdrem9XQStDOUtFdGtVaERCWktENStNWXRZCktVMUh1RXJCbmw2Z3BuWTRlbzJjVTRxdkNwZzZ4S3NDQXdFQUFhTlRNRkV3SFFZRFZSME9CQllFRklKMkRkTjgKc2ZtVjRCT1ZFL0FjZ0VEejArNmlNQjhHQTFVZEl3UVlNQmFBRklKMkRkTjhzZm1WNEJPVkUvQWNnRUR6MCs2aQpNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQWhQVi9RMVl1YWVTOTZVCmhjVGQ4RWdJaHhpbHFiTWlTQm5WaVdrdlJzWk94UUIwNTFScWtwT3g0UTRsckdaOGVJWWc3T0trTTdzejhuTVQKL2pxS21sZDY0MzJCcURCMlNkNVp5ZFdReHAwU1laRTlnVWszYk9KRGtZVXQ4b1cvZDBWeG9uU05LQVN3QmZKaApWV1VZUUlpNm55K0ZZZmtuRFNvRnFlY2Z3SDBQQVUraXpnMkI3KzFkbko5YisyQ21IOUVCallOZ2hoNlFzVlFQCkh2SkdQQURtandPNkJOam5HK0Z3K0Z6cmFXUTNCTjAwb08zUjF6UmgxZERmTTQzR3oxRmZGRW5GSXI5aGFuUnQKWHJFZm8vZWU5bjBLWUFESEJnV1g4dlhuNHZrRmdWRjgwYW9MUUJSQTBxWXErcW1pVlp6YnREeE9ldFEyRWFyTQpyNmVWL0lZPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
```

### UI System 

The table lists parameters for the Network Operations Center User Interface (NOC  UI). Palette's NOC UI enables easy location monitoring of multi-location clusters through an intuitive UI.

| **Parameters **          | **Default Value** | **Type**    | **Description**                                          | **Required/Optional** |
|---------------------|---------------|---------|------------------------------------------------------|--------------------|
| `enabled`           | `false`       | Boolean | Specifies whether to enable the Palette Network Operations Center (NOC) UI. Enabling this parameter requires the `ui.nocUI.mapBoxAccessToken`. Once enabled, all cluster locations will be reported to MapBox.          | Optional           |
| `mapBoxAccessToken` | `""`          | String  | Access token for the MapBox API.                          | Optional           |
| `mapBoxStyledLayerID`| `""`          | String  | ID for the MapBox style layer.                            | Optional           |

```yaml
ui-system:
  ui:
    nocUI:
      enable: false
      mapBoxAccessToken: ""
      mapBoxStyledLayerID: ""  
```




