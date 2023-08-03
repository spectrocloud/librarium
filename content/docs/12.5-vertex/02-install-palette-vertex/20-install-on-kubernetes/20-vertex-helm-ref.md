---
title: "Helm Configuration Reference"
metaTitle: "Helm Configuration Reference"
metaDescription: "Reference resource for the Palette VerteX Helm Chart installation parameters."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';

# Overview

You can use the Palette VerteX Helm Chart to install Palette VerteX in a multi-node Kubernetes cluster in your production environment. The Helm chart allows you to customize values in the **values.yaml** file. This reference page lists and describes parameters available in the **values.yaml** file from the Helm Chart for your installation.

To learn how to install Palette VerteX using the Helm Chart, refer to the Kubernetes [Instructions](/vertex/install-palette-vertex/install-on-kubernetes/install).

## Required Parameters

The following parameters are required for a successful installation of Palette VerteX.


| **Parameters** | **Description** | **Type** |
| --- | --- | --- |
| `mongo.databasePassword` | The base64-encoded MongoDB password. For more information, refer to the [MongoDB](#mongodb) section. | String |
| `config.env.rootDomain` | Used to configure the domain for the Palette installation. We recommend you create a CNAME DNS record that supports multiple subdomains. You can achieve this using a wild card prefix, `*.vertex.abc.com`. Review the [Environment parameters](/vertex/install-palette-vertex/install-on-kubernetes/vertex-helm-ref#environment) to learn more. | String |
| `config.env.ociRegistry`/`config.env.ociEcrRegistry`|  Specifies the FIPS image registry for Palette VerteX. You can use an OCI registry or an OCI registry hosted in AWS ECR if you are using AWS. For more information, refer to the [Registry](#registries) section. | Object |
| `scar`| The Spectro Cloud Artifact Repository (SCAR) credentials for Palette VerteX FIPS images.  Our support team provides these credentials. For more information, refer to the [Registry](#registries) section. | Object |


## MongoDB 

Palette VerteX uses MongoDB Enterprise as its internal database and supports two modes of deployment: <br /> <br />

-  MongoDB Enterprise deployed and active inside the cluster. 


-  MongoDB Enterprise is hosted on a software-as-a-service (SaaS) platform, such as MongoDB Atlas.

The table below lists the parameters used to configure a MongoDB deployment. 

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `internal` | Specifies the MongoDB deployment either in-cluster or using Mongo Atlas. | Boolean | `true` | 
| `opsManager`| The settings for the MongoDB Ops Manager. For more information, refer to the [Ops Manager](#opsmanager). | Object | - |
| `database` | The settings for the MongoDB Enterprise database. Refer to the [Database](#database) section for more information. | Object | - |
| `databasePassword`| The base64-encoded MongoDB Enterprise password. You must provide this value for Palette VerteX to deploy successfully. | String | `""` |
| `databaseUrl`| The URL for MongoDB Enterprise. If using a remote MongoDB Enterprise instance, provide the remote URL. | String | `mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongo.hubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local` |


### Ops Manager

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `adminSecret.password`| The base64-encoded MongoDB Ops Manager password. Our support team provides this value. | String | - |
| `opsma.podIpCIDR`| The CIDR block for the Ops Manager automation pod IP address range. | String | `192.168.0.0/16`

### Database

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `members`| The number of MongoDB replicas to start. | Integer | `3` |
| `storage`| The storage settings for the MongoDB Enterprise database. Use increments of `5Gi` when specifying the storage size. The storage size applies to each member instance. The total storage size for the cluster is `database.members` * `database.storage`. | Object | `20Gi`|
| `enableFips`| Specifies whether to enable FIPS mode for MongoDB Enterprise. | Boolean | `true` |
| `cpuLimit` | Specifies the CPU limit for each MongoDB Enterprise member.| String | `2000m` |
| `memorylimit`| Specifies the memory limit for each MongoDB Enterprise member.| String | `4Gi` | 


```yaml
mongo:
  internal: true
  opsManager:
    adminSecret:
      password: "Provided by the support team."
    opsma:
      podIpCIDR: 192.168.0.0/16
  database:
    members: 3  
    storage: 20Gi
    enableFips: true
    cpuLimit:  2000m
    memoryLimit: 4Gi

  databasePassword: ""
  databaseUrl: "mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongo.hubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local"
```

# Config 

Review the following parameters to configure Palette VerteX for your environment. The `config` section contains the following subsections:

## SSO 

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

## Email

Use the following parameters to configure email settings for Palette VerteX.

| **Parameters** |  **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled` | Specifies whether to enable email configuration. | Boolean| `false`|
| `emailID ` |  The email address for sending mail.| String| `""` |
| `smtpServer` |  Simple Mail Transfer Protocol (SMTP) server used for sending mail. | String | `smtp.gmail.com` |
| `smtpPort` | SMTP port used for sending mail.| Integer | `587` |
| `insecureSkipVerifyTLS` | Specifies whether to skip Transport Layer Security (TLS) verification for the SMTP connection.| Boolean | `true` |
| `fromEmailID` | Email address of the ***From*** address.| String | `noreply@spectrocloud.com` |
| `password` | The base64-encoded SMTP password when sending emails.| String | `""` |

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

## Environment 

The following parameters are used to configure the environment.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `env.rootDomain` | Specifies the domain name assigned to Palette Vertex. The value assigned should have a Domain Name System (DNS) CNAME record mapped to the *ingress-nginx-controller* load balancer IP address. | String| `""` |
| `env.installerMode` | Specifies the installer mode. Do not modify the value.| String| `self-hosted` |
| `env.installerCloud` | Specifies the cloud provider. Leave this parameter empty if you are installing a self-hosted Palette VerteX.  | String | `""` |

```yaml
config:
  env:
    rootDomain: ""
    installerMode: "self-hosted"
    installerCloud: ""
```
<br />

<WarningBox>

As you create tenants in Palette VerteX, the tenant name is prefixed to the domain name you assigned to Palette VerteX. For example, if you create a tenant named tenant1 and the domain name you assigned to Palette VerteX is `vertex.example.com`, the tenant URL will be `tenant1.vertex.example.com`. We recommend you create an additional wildcard DNS record to map all tenant URLs to the Palette VerteX load balancer. For example, `*.vertex.example.com`.

</WarningBox>

## Cluster 

Use the following parameters to configure the Kubernetes cluster.


| **Parameters** | **Description** |  **Type** | **Default value** | 
| --- | --- | --- | --- |
| `stableEndpointAccess` | Set to `true` if the Kubernetes cluster is deployed in a public endpoint. If the cluster is deployed in a private network through a stable private endpoint, set to `false`.  | Boolean | `false` |

```yaml
config:
    cluster:
    stableEndpointAccess: false
```

## Registries

Palette VerteX requires credentials to access the required Palette VerteX images. You can configure different types of registries for Palette VerteX to download the required images. Our support team provides the credentials for the registries.

<br />

<WarningBox>

To install Palette VerteX successfully, you must configure at least one Open Container Initiative (OCI) registry for Palette VerteX. You must also provide the credentials for the Spectro Cloud Artifact Repository (SCAR) to download the required FIPS images.

</WarningBox>

### Registry

This is a non-OCI registry. If you are installing a self-hosted Palette VerteX, you must configure the registry credentials for an OCI registry. Use [`ociRegistry`](#ociregistry) or [`ociEcrRegistry`](#ociecrregistry) to configure the OCI registry credentials.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- | 
| `registry.endpoint` | The endpoint URL for the registry. | String| `""` |
| `registry.name` |  The name of the registry. | String| `""` |
| `registry.password` | The base64-encoded password for the registry.  | String| `""` |
| `registry.username` |  The username for the registry. | String| `""` |
| `registry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean | `false` |
| `registry.caCert` | The base64-encoded certificate authority (CA) certificate for the registry. | String | `""` |


```yaml
config:
  registry:
    endpoint: ""
    name: ""
    password: ""
    username: ""
    insecureSkipVerify: false
    caCert: ""
```

### OCI Registry

OCI registry credentials are required to download the required Palette VerteX images. Our support team provides the credentials for the OCI registry. If you install Palette VerteX in Amazon Web Services (AWS), consider using `ociEcrRegistry` to consume the AWS Elastic Container Registry (ECR) images.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- | 
| `ociRegistry.endpoint` | The endpoint URL for the registry. | String| `""` |
| `ociRegistry.name` |  The name of the registry. | String| `""` |
| `ociRegistry.password` | The base64-encoded password for the registry.  | String| `""` |
| `ociRegistry.username` |  The username for the registry. | String| `""` |
| `ociRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean | `false` |
| `ociRegistry.caCert` | The registry's base64-encoded certificate authority (CA) certificate. | String | `""` |


```yaml
config:
  ociRegistry:
    endpoint: ""
    name: ""
    password: ""
    username: ""
    insecureSkipVerify: false
    caCert: ""
```


### OCI ECR Registry

The OCI Elastic Container Registry (ECR) is different from the [`ociRegistry`](#ociregistry) in that the FIPS-required images are hosted in an AWS ECR registry. Our support team provides the credentials for the OCI ECR registry.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `ociEcrRegistry.endpoint` | The endpoint URL for the registry. | String| `""` |
| `ociEcrRegistry.name` |  The name of the registry. | String| `""` |
| `ociEcrRegistry.password` | The base64-encoded password for the registry.  | String| `""` |
| `ociEcrRegistry.username` |  The username for the registry. | String| `""` |
| `ociEcrRegistry.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the registry connection. | Boolean | `false` |
| `ociEcrRegistry.caCert` | The registry's base64-encoded certificate authority (CA) certificate. | String | `""` |

```yaml
config:
  ociEcrRegistry:
    endpoint: ""
    name: ""
    password: ""
    username: ""
    insecureSkipVerify: false
    caCert: ""
```

### Spectro Cloud Artifact Repository (SCAR)

SCAR credentials are required to download the necessary FIPS images. Our support team provides the SCAR credentials.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- | 
| `scar.endpoint` | The endpoint URL of SCAR. | String| `""` |
| `scar.username` |The username for SCAR. | String| `""` |
| `scar.password` | The base64-encoded password for the SCAR. | String| `""` |
| `scar.insecureSkipVerify` | Specifies whether to skip Transport Layer Security (TLS) verification for the SCAR connection. | Boolean | `false` |
| `scar.caCert` | The base64-encoded certificate authority (CA) certificate for SCAR. | String | `""` |

```yaml
config:
  scar:
    endpoint: ""
    username: ""
    password: ""
    insecureSkipVerify: false
    caCert: ""
```


# Accounts

The account sections contain the registry endpoints for images required by Palette VerteX to support the deployment of FIPS-compliant clusters in non-public cloud environments. Do not modify the `config.accounts` section unless explicitly instructed by our support team or if you are installing Palette VerteX in an airgap environment.


## Devops

Palette VerteX conducts a series of automation tasks to support the deployment of FIPS-compliant clusters. Use the following parameters to configure the registry endpoints for images required by the DevOps automation tasks.


### OpenStack

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imagesHostEndpoint`| The registry endpoint for the OpenStack images. | String | `https://openstackgoldenimage.s3.amazonaws.com` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the OpenStack images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the OpenStack endpoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      openstack:
        imagesHostEndpoint: "https://openstackgoldenimage.s3.amazonaws.com"
        insecureSkipVerify: false
        caCert: ""
```


### Edge

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imagesHostEndpoint`| The registry endpoint for the Edge images. | String | `gcr.io/spectro-images-public/release/edge/node` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the Edge images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the Edge endoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      edge:
        imagesHostEndpoint: "gcr.io/spectro-images-public/release/edge/node"
        insecureSkipVerify: false
        caCert: ""
```

### Edge Native

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the Edge Native images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the Edge Native endpoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      edgeNative:
        insecureSkipVerify: false
        caCert: ""
```

### Libvirt

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imagesHostEndpoint`| The registry endpoint for the Libvirt images. | String | `https://edgegoldenimage.s3.amazonaws.com` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the Libvirt images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the Libvirt endpoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      libvirt:
        imagesHostEndpoint: "https://edgegoldenimage.s3.amazonaws.com"
        insecureSkipVerify: false
        caCert: ""
```

### MAAS

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imagesHostEndpoint`| The registry endpoint for the MAAS images. | String | `https://maasgoldenimage.s3.amazonaws.com` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the MAAS images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the MAAS endpoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      maas:
        imagesHostEndpoint: "https://maasgoldenimage.s3.amazonaws.com"
        insecureSkipVerify: false
        caCert: ""
```

### VMware vSphere

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `imagesHostEndpoint`| The registry endpoint for the VMware vSphere images. | String | `https://vmwaregoldenimage.s3.amazonaws.com` |
| `overlordOvaLocation`| The location of the overlord OVA file. Our support team provides this URL. | String | `""` |
| `insecureSkipVerify`| Specifies whether to skip Transport Layer Security (TLS) verification for the VMware vSphere images. | Boolean | `false` |
| `caCert`| The base64-encoded certificate authority (CA) certificate for the VMware vSphere endpoint. | String | `""` |

```yaml
config:
  accounts:
    devops:
      vsphere:
        imagesHostEndpoint: "https://vspheregoldenimage.s3.amazonaws.com"
        overlordOvaLocation: "Provided by the support team."
        insecureSkipVerify: false
        caCert: ""
```


# Network Address Translation (NATS) 

Palette VerteX does not use NATS. gRPC is used to communicate between the various Palette VerteX components. For more information, refer to the [gRPC](#grpc) section.

| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled`| Specifies whether to enable NATS. | Boolean | `false` |


# gRPC

gRPC is used for communication between Palette VerteX components. You can enable the deployment of an additional load balancer for gRPC. Host clusters deployed by Palette VerteX use the load balancer to communicate with the Palette VerteX control plane. This is an advanced configuration option, and it is not required for most deployments. Speak with your support representative before enabling this option.

If you want to use an external gRPC endpoint, you must provide a domain name for the gRPC endpoint and a valid x509 certificate. Additionally, you must provide a custom domain name for the endpoint. A CNAME DNS record must point to the IP address of the gRPC load balancer. For example, if your Palette VerteX domain name is `vertex.example.com`, you could create a CNAME DNS record for `grpc.vertex.example.com` that points to the IP address of the load balancer dedicated to gRPC. 


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

# Ingress 

Palette VerteX deploys an Nginx Ingress Controller. This controller is used to route traffic to the Palette VerteX control plane. You can change the default behavior and omit the deployment of an Nginx Ingress Controller. 

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

# Spectro Proxy

You can specify a reverse proxy server that clusters deployed through Palette VerteX can use to facilitate network connectivity to the cluster's Kubernetes API server. Host clusters deployed in private networks can use the [Spectro Proxy pack](/integrations/frp) to expose the cluster's Kubernetes API to downstream clients that are not in the same network. Check out the [Reverse Proxy](/vertex/system-management/reverse-proxy) documentation to learn more about setting up a reverse proxy server for Palette VerteX.


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

# UI System 

The table lists parameters to configure the Palette VerteX User Interface (UI) behavior.


| **Parameters** | **Description** | **Type** | **Default value** |
| --- | --- | --- | --- |
| `enabled`| Specifies whether to enable the Palette VerteX UI. | Boolean | `true` |
| `ui.nocUI.enable`| Specifies whether to enable the Palette VerteX Network Operations Center (NOC) UI. | Boolean | `false` |
| `ui.nocUI.mapBoxAccessToken`| The MapBox access token for the Palette VerteX NOC UI. | String | `""` |
| `ui.nocUI.mapBoxStyledLayerID`| The MapBox style layer ID for the Palette VerteX NOC UI. | String | `""` |



```yaml
ui-system:
  enabled: true
  ui:
    nocUI:
      enable: false
      mapBoxAccessToken: ""
      mapBoxStyledLayerID: "" 
```




