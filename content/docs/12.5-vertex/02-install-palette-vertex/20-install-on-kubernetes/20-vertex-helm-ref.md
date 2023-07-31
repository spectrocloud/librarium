---
title: "Helm Configuration Reference"
metaTitle: "Helm Configuration Reference"
metaDescription: "Reference for Palette VerteX Helm Chart installation parameters."
icon: ""
hideToC: false
fullWidth: false
---

# Overview

You can use the Palette VerteX Helm Chart to install Palette VerteX in a multi-node Kubernetes cluster in your production environment. The Helm chart allows you to customize values in the **values.yaml** file. This reference page lists and describes parameters available in the **values.yaml** file from the Helm Chart for your installation.

To learn how to install Palette VerteX using the Helm Chart, refer to the Kubernetes [Instructions](/vertex/install-palette-vertex/install-on-kubernetes/install).

## Required Parameters

The following parameters are required for a successful installation of Palette VerteX.


| **Parameters** | **Description** | **Type** |
| --- | --- | --- |
| `mongo.databasePassword` | The base64 encoded MongoDB password. Refer to the [MongoDB](#mongodb) section for more information. | String |
| `config.env.rootDomain` | Used to configure the domain for the Palette installation. We recommend you create a CNAME DNS record that supports multiple subdomains. You can achieve this by using a wild card `*.vertex.abc.com`. Review the [Environment parameters](/vertex/install-palette-vertex/install-on-kubernetes/vertex-helm-ref#environment) to learn more. | String |
| `config.env.ociRegistry`/`config.env.ociEcrRegistry`|  Specifies the FIPS image registry for Palette VerteX. You can use an OCI registry or an OCI registry hosted in AWS ECR if you are using AWS. Refer to the [Registry and Palette Artifact Repository parameters](#registryandpaletteartifactrepository(par)) for more information. | Object |
| `scar`| The Spectro Cloud Artifactory Repository (SCAR) credentials for Palette VerteX FIPS images. These credentials are provided by our support team. Refer to the [Registry and Palette Artifact Repository parameters](#registryandpaletteartifactrepository(par)) for more information. | Object |


## MongoDB 

Palette VerteX uses MongoDB Enterprise as its internal database and supports two modes of deployment: <br /> <br />

-  MongoDB Enterprise deployed and active inside the cluster. 


-  MongoDB Enterprise is hosted on a software-as-a-service (SaaS) platform, such as MongoDB Atlas.

The table below lists the parameters used to configure a MongoDB deployment. 

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `internal` | Specifies the MongoDB deployment either in-cluster or using Mongo Atlas. | Boolean | `true` | 
| `opsManager`| The settings for the MongoDB Ops Manager. Refer to the [Ops Manager](#opsmanager) for more information. | Object | - |
| `database` | The settings for the MongoDB Enterprise database. Refer to the [Database](#database) section for more information. | Object | - |
| `databasePassword`| The base64 encoded MongoDB Enterprise password. You must provide this value for Palette VerteX to deploy successfully. | String | `""` |
| `databaseUrl`| The URL for MongoDB Enterprise. If using a remote MongoDB Enterprise instance, provide the remote URL. | String | `mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongo.hubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local` |


### Ops Manager

| **Parameters** | **Description** |  **Type** | **Default value** |
| --- | --- | --- | --- |
| `adminSecret.password`| The base64 encoded MongoDB Ops Manager password. This value is provided by the support team. | String | - |
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
      password: "Provided by support team"
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

The configuration file contains the following sections.

## SSO 

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

## Email

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

## Environment 

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

## Cluster 

The cluster parameter specifies how the Kubernetes cluster is deployed.


| **Parameters** | **Default value** | **Type** | **Description** | **Required/Optional** |
| --- | --- | --- | --- | --- |
| `stableEndpointAccess` | `false` | Boolean | False indicates the Kubernetes cluster is deployed in a private network through a stable private endpoint. True indicates the cluster is deployed through a public endpoint. | Optional|

```yaml
config:
    cluster:
    stableEndpointAccess: false
```

## Registry and Palette Artifact Repository (PAR) 

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

# Network Address Translation (NATS) 

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

# Ingress 

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

# Spectro Proxy

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

# UI System 

The table lists parameters for the Network Operations Center User Interface (NOC  UI). Palette's NOC UI enables easy location monitoring of multi-location clusters through an intuitive UI.

| **Parameters **          | **Default Value** | **Type**    | **Description**                                          | **Required/Optional** |
|---------------------|---------------|---------|------------------------------------------------------|--------------------|
| `enabled`           | `false`       | Boolean | Specifies if the NOC UI is enabled or not.          | Optional           |
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




