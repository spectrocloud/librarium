---
sidebar_label: "Palette eXtended Kubernetes"
title: "Palette eXtended Kubernetes"
description: "Learn about the Palette eXtended Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image.webp"
tags: ["packs", "kubernetes", "pxk"]
---

The Palette eXtended Kubernetes (PXK) pack supports several [cloud and data center infrastructure providers](/clusters).
This pack defines the default properties we use to deploy Kubernetes clusters and enables most of the Kubernetes
hardening standards that the Center for Internet Security (CIS) recommends.

We also support managed Kubernetes distributions for Elastic Kubernetes Service (EKS), Azure Kubernetes Service (AKS),
Google Kubernetes Engine (GKE), and Tencent Kubernetes Engine (TKE).

We offer PXK as a core pack in Palette.

:::warning

Once you upgrade your cluster to a new Kubernetes version, you will not be able to downgrade. We recommend that, before
upgrading, you review the information provided in the [Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades)
section.

Review our [Maintenance Policy](maintenance-policy.md) to learn about pack update and deprecation schedules.

:::

## What is PXK?

Palette eXtended Kubernetes (PXK) is a customized version of the open-source Cloud Native Computing Foundation (CNCF)
distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure
providers, public cloud providers, and private data center providers. This is the default distribution when deploying a
Kubernetes cluster through Palette. You have the option to choose other Kubernetes distributions, such as MicroK8s,
Konvoy, and more, should you want to consume a different Kubernetes distribution.

PXK is different from the upstream open-source Kubernetes version primarily because of the carefully reviewed and
applied hardening of the operating system (OS) and Kubernetes. The hardening ranges from removing unused kernel modules
to using an OS configuration that follows industry best practices. Our custom Kubernetes configuration addresses common
Kubernetes deployment security pitfalls and implements industry best practices.

A benefit of Palette when used with PXK is the ability to apply different flavors of container storage interface (CSI)
plugins and container network interface (CNI) plugins. Other open-source Kubernetes distributions, such as MicroK8s,
RKE2, and K3s, come with a default CSI and CNI. Additional complexity and overhead are required from you to enable
different interfaces. PXK supports the ability to select other interface plugins out of the box without any additional
overhead or complexity needed from your side.

There are no changes to the Kubernetes source code and we also follow the same versioning schema as the upstream
open-source Kubernetes distribution.

:::info

We also offer Palette eXtended Kubernetes Edge (PXK-E) for Edge deployments. Refer to the
[PXK-E glossary definition](../glossary-all.md#palette-extended-kubernetes-edge-pxk-e) to learn more about PXK-E.

:::

### PXK and Palette VerteX

The PXK used in [Palette VerteX](../vertex/vertex.md) is compiled and linked with our
[NIST-certified FIPS crypto module](../legal-licenses/compliance.md#fips-140-2) PXK is by default enabled with
[Ubuntu Pro](https://ubuntu.com/pro) with FIPS mode enabled. Additionally, the Operating System (OS) is hardened based
on the NIST-800 standard. However, if you use a different OS through the [BYOOS](./byoos.md) pack, then you are
responsible for ensuring FIPS compliance and hardening of the OS.

The combined usage of PXK and Palette VerteX provides a secure and FIPS-compliant experience as the Kubernetes
distribution, OS, and management platform VerteX is FIPS-compliant.

### Support Lifecycle

We support PXK for N-3 Kubernetes minor versions for a duration of 14 months. The duration exceeds the official EOL by
four months. Once we stop supporting the minor version, we initiate the deprecation process. Refer to the
[Kubernetes Support Lifecycle](kubernetes-support.md#palette-extended-kubernetes-support) guide to learn more.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.29.x" value="k8s_v1.29">

## Prerequisites

- A minimum of 4 CPU and 4 GB Memory.

- Operating System (OS) dependencies as listed in the table.

  | OS Distribution | OS Version | Supports Kubernetes 1.27.x |
  | --------------- | ---------- | -------------------------- |
  | CentOS          | 7.7        | ✅                         |
  | Ubuntu          | 22.04      | ✅                         |
  | Ubuntu          | 20.04      | ❌                         |
  | Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.podCIDR`                                   | The CIDR range for Pods in the cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                             |
| `pack.serviceClusterIpRange`                     | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                      |
| `pack.serviceDomain`                             | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain) section. |
| `pack.palette.config.dashboard.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the PXK pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](kubernetes.md#configure-oidc-identity-provider).                                                                                               |
| `kubeadmconfig.apiServer.extraArgs`              | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.apiServer.extraVolumes`           | A list of additional volumes to mount on the apiServer.                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.controllerManager.extraArgs`      | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                           |
| `kubeadmconfig.scheduler.extraArgs`              | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.kubeletExtraArgs`                 | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                      |
| `kubeadmconfig.files`                            | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                               |
| `kubeadmconfig.preKubeadmCommands`               | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.postKubeadmCommands`              | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                    |
| `kubeadmconfig.clientConfig`                     | Settings to manually configure OIDC-based authentication when you choose a third-party (Custom) IDP. Refer to [Configure Custom OIDC](#configure-custom-oidc).                                                                                                                                                                                                                                                 |
| `cloud.maas.customEndpoint`                      | The custom MAAS API or DNS endpoint URL to use for the PXK cluster. This parameter is only available for MAAS.                                                                                                                                                                                                                                                                                                 |
| `cloud.maas.customEndpointPort`                  | The custom MAAS API or DNS endpoint port to use for the PXK cluster. This parameter is only available for MAAS. Default value is `6443`.                                                                                                                                                                                                                                                                       |

## Usage

The Kubeadm configuration file is where you can do the following:

- Change the default `podCIDR` and `serviceClusterIpRange` values. CIDR IPs specified in the configuration file take
  precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the `podCIDR` value does not overlap with any hosts or with the service network
  and the `serviceClusterIpRange` value does not overlap with any IP ranges assigned to nodes or pods. For more
  information, refer to the [Clusters](../clusters/clusters.md) guide and
  [Cluster Deployment Errors](../troubleshooting/cluster-deployment.md).

- Change the default cluster DNS service domain from `cluster.local` to a DNS domain that you specify. You can only
  change the DNS domain during cluster creation. For more information, refer to
  [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain).

- Manually configure a third-party OpenID Connect (OIDC) Identity Provider (IDP). For more information, check out
  [Configure Custom OIDC](#configure-custom-oidc).

- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more
  information, refer to the [Spectro Proxy](frp.md) guide.

### Change Cluster DNS Service Domain

The `pack.serviceDomain` parameter with default value `cluster.local` is not visible in the Kubernetes YAML file, and
its value can only be changed at cluster creation. To change the value, you must add `serviceDomain: "cluster.local"` to
the Kubernetes YAML file when you create a cluster, and specify the service domain you want to use.

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "172.16.0.0/16"
  serviceClusterIPRange: "10.96.0.0/12"
  serviceDomain: "<your_cluster_DNS_service_domain>"
```

:::warning

You can only specify the service domain at cluster creation. After cluster creation completes, you cannot update the
value. Attempting to update it results in the error `serviceDomain update is forbidden for existing cluster`.

:::

For more information about networking configuration with DNS domains, refer to the Kubernetes
[Networking](https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-Networking)
API documentation.

### Configuration Changes

The PXK Kubeadm configuration is updated to dynamically enable OIDC based on your IDP selection by adding the
`identityProvider` parameter.

```yaml
palette:
  config:
    dashboard:
      identityProvider: <your_idp_selection>
```

### Example Kubeadm Configuration File

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"
  palette:
    config:
      dashboard:
        identityProvider: palette
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      default-not-ready-toleration-seconds: "60"
      default-unreachable-toleration-seconds: "60"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity"
      admission-control-config-file: "/etc/kubernetes/pod-security-standard.yaml"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
      - name: pod-security-standard
        hostPath: /etc/kubernetes/pod-security-standard.yaml
        mountPath: /etc/kubernetes/pod-security-standard.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      pod-eviction-timeout: "1m0s"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port: "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"
    - targetPath: /etc/kubernetes/pod-security-standard.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
      content: |
        apiVersion: apiserver.config.k8s.io/v1
        kind: AdmissionConfiguration
        plugins:
        - name: PodSecurity
          configuration:
            apiVersion: pod-security.admission.config.k8s.io/v1
            kind: PodSecurityConfiguration
            defaults:
              enforce: "baseline"
              enforce-version: "v1.26"
              audit: "baseline"
              audit-version: "v1.26"
              warn: "restricted"
              warn-version: "v1.26"
              audit: "restricted"
              audit-version: "v1.26"
            exemptions:
              # Array of authenticated usernames to exempt.
              usernames: []
              # Array of runtime class names to exempt.
              runtimeClasses: []
              # Array of namespaces to exempt.
              namespaces: [kube-system]

    preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
    postKubeadmCommands:
    - 'echo "List of post kubeadm commands to be executed"'

    # Client configuration to add OIDC based authentication flags in kubeconfig
    #clientConfig:
    #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
    #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
    #oidc-client-secret: yourSecretClientSecretGoesHere
    #oidc-extra-scope: profile,email
```

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes
layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this
scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability
to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For
additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a
different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes
role to users and groups, refer to
[Create Role Bindings](/clusters/cluster-management/cluster-rbac#create-role-bindings). You can also configure OIDC for
virtual clusters. For guidance, refer to
[Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md).

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`.

  :::warning

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that
  rely on OIDC.

  :::

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to
  specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in
  [Configure Custom OIDC](#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper
  permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting
  displays in the YAML file as `palette`.

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure
  OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose
  **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more
  information, check out the [SSO Setup](../user-management/saml-sso/saml-sso.md) guide.

  :::info

  If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option
  will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC
  authentication and not SAML authentication.

  :::

### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and [Azure-AKS](../clusters/public-cloud/azure/aks.md).

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Enable OIDC in Kubernetes Clusters With Entra ID](../user-management/saml-sso/palette-sso-with-entra-id.md#enable-oidc-in-kubernetes-clusters-with-entra-id)
to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile.

   ```yaml
   kubeadmconfig:
     apiServer:
       extraArgs:
       oidc-issuer-url: "provider URL"
       oidc-client-id: "client-id"
       oidc-groups-claim: "groups"
       oidc-username-claim: "email"
   ```

2. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

   ```yaml
   kubeadmconfig:
     clientConfig:
       oidc-issuer-url: "<OIDC-ISSUER-URL>"
       oidc-client-id: "<OIDC-CLIENT-ID>"
       oidc-client-secret: "<OIDC-CLIENT-SECRET>"
       oidc-extra-scope: profile,email,openid
   ```

</TabItem>

<TabItem label="Amazon EKS" value="Amazon EKS Setup">

Follow these steps to configure OIDC for managed EKS clusters.

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack,
   and enter your third-party provider details.

   ```yaml
   oidcIdentityProvider:
     identityProviderConfigName: "Spectro-docs"
     issuerUrl: "issuer-url"
     clientId: "user-client-id-from-Palette"
     usernameClaim: "email"
     usernamePrefix: "-"
     groupsClaim: "groups"
     groupsPrefix: ""
     requiredClaims:
   ```

2. Under the `clientConfig` parameter section of Kubernetes pack, uncomment the `oidc-` configuration lines.

   ```yaml
   clientConfig:
     oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
     oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
     oidc-client-secret: **************************************************
     oidc-extra-scope: profile,email
   ```

3. Provide third-party OIDC IDP details.

</TabItem>

</Tabs>

### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map
many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To
learn more, review [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes
pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group.

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.webp)

### Custom MAAS Endpoint

You can specify a custom MAAS endpoint and port that instructs Palette to direct all MAAS API requests to the provided
endpoint URL. Use the `cloud.maas.customEndpoint` and `cloud.maas.customEndpointPort` parameters to specify the custom
MAAS API URL and port. This is useful in scenarios where the MAAS API endpoint is not resolvable outside of the MAAS
network.

The following example shows how to specify a custom MAAS endpoint and port in the Kubernetes YAML file. Make sure the
`cloud.maas` section is at the same level as the `pack` section.

```yaml hideClipboard {10-14}
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"
  palette:
    config:
      dashboard:
        identityProvider: palette

cloud:
  maas:
    customEndpoint: "maas-api.example.maas.org"
    customEndpointPort: "6443"
```

</TabItem>

<TabItem label="1.28.x" value="k8s_v1.28">

## Prerequisites

- A minimum of 4 CPU and 4 GB Memory.

- Operating System (OS) dependencies as listed in the table.

  | OS Distribution | OS Version | Supports Kubernetes 1.27.x |
  | --------------- | ---------- | -------------------------- |
  | CentOS          | 7.7        | ✅                         |
  | Ubuntu          | 22.04      | ✅                         |
  | Ubuntu          | 20.04      | ❌                         |
  | Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.podCIDR`                                   | The CIDR range for Pods in the cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                             |
| `pack.serviceClusterIpRange`                     | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                      |
| `pack.serviceDomain`                             | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain) section. |
| `pack.palette.config.dashboard.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the PXK pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](kubernetes.md#configure-oidc-identity-provider).                                                                                               |
| `kubeadmconfig.apiServer.extraArgs`              | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.apiServer.extraVolumes`           | A list of additional volumes to mount on the apiServer.                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.controllerManager.extraArgs`      | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                           |
| `kubeadmconfig.scheduler.extraArgs`              | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.kubeletExtraArgs`                 | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                      |
| `kubeadmconfig.files`                            | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                               |
| `kubeadmconfig.preKubeadmCommands`               | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.postKubeadmCommands`              | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                    |
| `kubeadmconfig.clientConfig`                     | Settings to manually configure OIDC-based authentication when you choose a third-party (Custom) IDP. Refer to [Configure Custom OIDC](#configure-custom-oidc).                                                                                                                                                                                                                                                 |
| `cloud.maas.customEndpoint`                      | The custom MAAS API or DNS endpoint URL to use for the PXK cluster. This parameter is only available for MAAS.                                                                                                                                                                                                                                                                                                 |
| `cloud.maas.customEndpointPort`                  | The custom MAAS API or DNS endpoint port to use for the PXK cluster. This parameter is only available for MAAS. Default value is `6443`.                                                                                                                                                                                                                                                                       |

## Usage

The Kubeadm configuration file is where you can do the following:

- Change the default `podCIDR` and `serviceClusterIpRange` values. CIDR IPs specified in the configuration file take
  precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the `podCIDR` value does not overlap with any hosts or with the service network
  and the `serviceClusterIpRange` value does not overlap with any IP ranges assigned to nodes or pods. For more
  information, refer to the [Clusters](../clusters/clusters.md) guide and
  [Cluster Deployment Errors](../troubleshooting/cluster-deployment.md).

- Change the default cluster DNS service domain from `cluster.local` to a DNS domain that you specify. You can only
  change the DNS domain during cluster creation. For more information, refer to
  [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain).

- Manually configure a third-party OpenID Connect (OIDC) Identity Provider (IDP). For more information, check out
  [Configure Custom OIDC](#configure-custom-oidc).

- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more
  information, refer to the [Spectro Proxy](frp.md) guide.

### Change Cluster DNS Service Domain

The `pack.serviceDomain` parameter with default value `cluster.local` is not visible in the Kubernetes YAML file, and
its value can only be changed at cluster creation. To change the value, you must add `serviceDomain: "cluster.local"` to
the Kubernetes YAML file when you create a cluster, and specify the service domain you want to use.

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "172.16.0.0/16"
  serviceClusterIPRange: "10.96.0.0/12"
  serviceDomain: "<your_cluster_DNS_service_domain>"
```

:::warning

You can only specify the service domain at cluster creation. After cluster creation completes, you cannot update the
value. Attempting to update it results in the error `serviceDomain update is forbidden for existing cluster`.

:::

For more information about networking configuration with DNS domains, refer to the Kubernetes
[Networking](https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-Networking)
API documentation.

### Configuration Changes

The PXK Kubeadm configuration is updated to dynamically enable OIDC based on your IDP selection by adding the
`identityProvider` parameter.

```yaml
palette:
  config:
    dashboard:
      identityProvider: <your_idp_selection>
```

### Example Kubeadm Configuration File

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"
  palette:
    config:
      dashboard:
        identityProvider: palette
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      default-not-ready-toleration-seconds: "60"
      default-unreachable-toleration-seconds: "60"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity"
      admission-control-config-file: "/etc/kubernetes/pod-security-standard.yaml"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
      - name: pod-security-standard
        hostPath: /etc/kubernetes/pod-security-standard.yaml
        mountPath: /etc/kubernetes/pod-security-standard.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      pod-eviction-timeout: "1m0s"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port: "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"
    - targetPath: /etc/kubernetes/pod-security-standard.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
      content: |
        apiVersion: apiserver.config.k8s.io/v1
        kind: AdmissionConfiguration
        plugins:
        - name: PodSecurity
          configuration:
            apiVersion: pod-security.admission.config.k8s.io/v1
            kind: PodSecurityConfiguration
            defaults:
              enforce: "baseline"
              enforce-version: "v1.26"
              audit: "baseline"
              audit-version: "v1.26"
              warn: "restricted"
              warn-version: "v1.26"
              audit: "restricted"
              audit-version: "v1.26"
            exemptions:
              # Array of authenticated usernames to exempt.
              usernames: []
              # Array of runtime class names to exempt.
              runtimeClasses: []
              # Array of namespaces to exempt.
              namespaces: [kube-system]

    preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
    postKubeadmCommands:
    - 'echo "List of post kubeadm commands to be executed"'

    # Client configuration to add OIDC based authentication flags in kubeconfig
    #clientConfig:
    #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
    #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
    #oidc-client-secret: yourSecretClientSecretGoesHere
    #oidc-extra-scope: profile,email
```

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes
layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this
scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability
to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For
additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a
different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes
role to users and groups, refer to
[Create Role Bindings](/clusters/cluster-management/cluster-rbac#create-role-bindings). You can also configure OIDC for
virtual clusters. For guidance, refer to
[Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md).

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`.

  :::warning

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that
  rely on OIDC.

  :::

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to
  specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in
  [Configure Custom OIDC](#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper
  permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting
  displays in the YAML file as `palette`.

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure
  OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose
  **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more
  information, check out the [SSO Setup](../user-management/saml-sso/saml-sso.md) guide.

  :::info

  If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option
  will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC
  authentication and not SAML authentication.

  :::

### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and [Azure-AKS](../clusters/public-cloud/azure/aks.md).

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Enable OIDC in Kubernetes Clusters With Entra ID](../user-management/saml-sso/palette-sso-with-entra-id.md#enable-oidc-in-kubernetes-clusters-with-entra-id)
to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile.

   ```yaml
   kubeadmconfig:
     apiServer:
       extraArgs:
       oidc-issuer-url: "provider URL"
       oidc-client-id: "client-id"
       oidc-groups-claim: "groups"
       oidc-username-claim: "email"
   ```

2. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

   ```yaml
   kubeadmconfig:
     clientConfig:
       oidc-issuer-url: "<OIDC-ISSUER-URL>"
       oidc-client-id: "<OIDC-CLIENT-ID>"
       oidc-client-secret: "<OIDC-CLIENT-SECRET>"
       oidc-extra-scope: profile,email,openid
   ```

</TabItem>

<TabItem label="Amazon EKS" value="Amazon EKS Setup">

Follow these steps to configure OIDC for managed EKS clusters.

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack,
   and enter your third-party provider details.

   ```yaml
   oidcIdentityProvider:
     identityProviderConfigName: "Spectro-docs"
     issuerUrl: "issuer-url"
     clientId: "user-client-id-from-Palette"
     usernameClaim: "email"
     usernamePrefix: "-"
     groupsClaim: "groups"
     groupsPrefix: ""
     requiredClaims:
   ```

2. Under the `clientConfig` parameter section of Kubernetes pack, uncomment the `oidc-` configuration lines.

   ```yaml
   clientConfig:
     oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
     oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
     oidc-client-secret: **************************************************
     oidc-extra-scope: profile,email
   ```

3. Provide third-party OIDC IDP details.

</TabItem>

</Tabs>

### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map
many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To
learn more, review [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes
pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group.

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.webp)

### Custom MAAS Endpoint

You can specify a custom MAAS endpoint and port that instructs Palette to direct all MAAS API requests to the provided
endpoint URL. Use the `cloud.maas.customEndpoint` and `cloud.maas.customEndpointPort` parameters to specify the custom
MAAS API URL and port. This is useful in scenarios where the MAAS API endpoint is not resolvable outside of the MAAS
network.

The following example shows how to specify a custom MAAS endpoint and port in the Kubernetes YAML file. Make sure the
`cloud.maas` section is at the same level as the `pack` section.

```yaml hideClipboard {10-14}
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"
  palette:
    config:
      dashboard:
        identityProvider: palette

cloud:
  maas:
    customEndpoint: "maas-api.example.maas.org"
    customEndpointPort: "6443"
```

</TabItem>

<TabItem label="1.27.x" value="k8s_v1.27">

## Prerequisites

- A minimum of 4 CPU and 4 GB Memory.

- Operating System (OS) dependencies as listed in the table.

  | OS Distribution | OS Version | Supports Kubernetes 1.27.x |
  | --------------- | ---------- | -------------------------- |
  | CentOS          | 7.7        | ✅                         |
  | Ubuntu          | 22.04      | ✅                         |
  | Ubuntu          | 20.04      | ❌                         |
  | Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.podCIDR`                                   | The CIDR range for Pods in the cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                             |
| `pack.serviceClusterIpRange`                     | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                      |
| `pack.serviceDomain`                             | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain) section. |
| `pack.palette.config.dashboard.identityProvider` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the PXK pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](kubernetes.md#configure-oidc-identity-provider).                                                                                               |
| `kubeadmconfig.apiServer.extraArgs`              | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.apiServer.extraVolumes`           | A list of additional volumes to mount on the apiServer.                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.controllerManager.extraArgs`      | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                           |
| `kubeadmconfig.scheduler.extraArgs`              | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                              |
| `kubeadmconfig.kubeletExtraArgs`                 | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                      |
| `kubeadmconfig.files`                            | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                               |
| `kubeadmconfig.preKubeadmCommands`               | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.postKubeadmCommands`              | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                    |
| `kubeadmconfig.clientConfig`                     | Settings to manually configure OIDC-based authentication when you choose a third-party (Custom) IDP. Refer to [Configure Custom OIDC](#configure-custom-oidc).                                                                                                                                                                                                                                                 |

## Usage

The Kubeadm configuration file is where you can do the following:

- Change the default `podCIDR` and `serviceClusterIpRange` values. CIDR IPs specified in the configuration file take
  precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the `podCIDR` value does not overlap with any hosts or with the service network
  and the `serviceClusterIpRange` value does not overlap with any IP ranges assigned to nodes or pods. For more
  information, refer to the [Clusters](../clusters/clusters.md) guide and
  [Cluster Deployment Errors](../troubleshooting/cluster-deployment.md).

- Change the default cluster DNS service domain from `cluster.local` to a DNS domain that you specify. You can only
  change the DNS domain during cluster creation. For more information, refer to
  [Change Cluster DNS Service Domain](kubernetes.md?versions=k8s_v1.27#change-cluster-dns-service-domain).

- Manually configure a third-party OpenID Connect (OIDC) Identity Provider (IDP). For more information, check out
  [Configure Custom OIDC](#configure-custom-oidc).

- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more
  information, refer to the [Spectro Proxy](frp.md) guide.

### Change Cluster DNS Service Domain

The `pack.serviceDomain` parameter with default value `cluster.local` is not visible in the Kubernetes YAML file, and
its value can only be changed at cluster creation. To change the value, you must add `serviceDomain: "cluster.local"` to
the Kubernetes YAML file when you create a cluster, and specify the service domain you want to use.

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "172.16.0.0/16"
  serviceClusterIPRange: "10.96.0.0/12"
  serviceDomain: "<your_cluster_DNS_service_domain>"
```

:::warning

You can only specify the service domain at cluster creation. After cluster creation completes, you cannot update the
value. Attempting to update it results in the error `serviceDomain update is forbidden for existing cluster`.

:::

For more information about networking configuration with DNS domains, refer to the Kubernetes
[Networking](https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-Networking)
API documentation.

### Configuration Changes

The PXK Kubeadm configuration is updated to dynamically enable OIDC based on your IDP selection by adding the
`identityProvider` parameter.

```yaml
palette:
  config:
    dashboard:
      identityProvider: <your_idp_selection>
```

### Example Kubeadm Configuration File

```yaml hideClipboard
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"
  palette:
    config:
      dashboard:
        identityProvider: palette
kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      default-not-ready-toleration-seconds: "60"
      default-unreachable-toleration-seconds: "60"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurity"
      admission-control-config-file: "/etc/kubernetes/pod-security-standard.yaml"
      audit-log-path: /var/log/apiserver/audit.log
      audit-policy-file: /etc/kubernetes/audit-policy.yaml
      audit-log-maxage: "30"
      audit-log-maxbackup: "10"
      audit-log-maxsize: "100"
      authorization-mode: RBAC,Node
      tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
    extraVolumes:
      - name: audit-log
        hostPath: /var/log/apiserver
        mountPath: /var/log/apiserver
        pathType: DirectoryOrCreate
      - name: audit-policy
        hostPath: /etc/kubernetes/audit-policy.yaml
        mountPath: /etc/kubernetes/audit-policy.yaml
        readOnly: true
        pathType: File
      - name: pod-security-standard
        hostPath: /etc/kubernetes/pod-security-standard.yaml
        mountPath: /etc/kubernetes/pod-security-standard.yaml
        readOnly: true
        pathType: File
  controllerManager:
    extraArgs:
      profiling: "false"
      terminated-pod-gc-threshold: "25"
      pod-eviction-timeout: "1m0s"
      use-service-account-credentials: "true"
      feature-gates: "RotateKubeletServerCertificate=true"
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port: "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"
    - targetPath: /etc/kubernetes/pod-security-standard.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
      content: |
        apiVersion: apiserver.config.k8s.io/v1
        kind: AdmissionConfiguration
        plugins:
        - name: PodSecurity
          configuration:
            apiVersion: pod-security.admission.config.k8s.io/v1
            kind: PodSecurityConfiguration
            defaults:
              enforce: "baseline"
              enforce-version: "v1.26"
              audit: "baseline"
              audit-version: "v1.26"
              warn: "restricted"
              warn-version: "v1.26"
              audit: "restricted"
              audit-version: "v1.26"
            exemptions:
              # Array of authenticated usernames to exempt.
              usernames: []
              # Array of runtime class names to exempt.
              runtimeClasses: []
              # Array of namespaces to exempt.
              namespaces: [kube-system]

    preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
    postKubeadmCommands:
    - 'echo "List of post kubeadm commands to be executed"'

    # Client configuration to add OIDC based authentication flags in kubeconfig
    #clientConfig:
    #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
    #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
    #oidc-client-secret: yourSecretClientSecretGoesHere
    #oidc-extra-scope: profile,email
```

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes
layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this
scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability
to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For
additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a
different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below.

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes
role to users and groups, refer to
[Create Role Bindings](/clusters/cluster-management/cluster-rbac#create-role-bindings). You can also configure OIDC for
virtual clusters. For guidance, refer to
[Configure OIDC for a Virtual Cluster](../clusters/palette-virtual-clusters/configure-oidc-virtual-cluster.md).

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`.

  :::warning

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that
  rely on OIDC.

  :::

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to
  specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in
  [Configure Custom OIDC](#configure-custom-oidc). This setting displays in the YAML file as `none`.

- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper
  permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting
  displays in the YAML file as `palette`.

- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure
  OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose
  **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more
  information, check out the [SSO Setup](../user-management/saml-sso/saml-sso.md) guide.

  :::info

  If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option
  will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC
  authentication and not SAML authentication.

  :::

### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and [Azure-AKS](../clusters/public-cloud/azure/aks.md).

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Enable OIDC in Kubernetes Clusters With Entra ID](../user-management/saml-sso/palette-sso-with-entra-id.md#enable-oidc-in-kubernetes-clusters-with-entra-id)
to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile.

   ```yaml
   kubeadmconfig:
     apiServer:
       extraArgs:
       oidc-issuer-url: "provider URL"
       oidc-client-id: "client-id"
       oidc-groups-claim: "groups"
       oidc-username-claim: "email"
   ```

2. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

   ```yaml
   kubeadmconfig:
     clientConfig:
       oidc-issuer-url: "<OIDC-ISSUER-URL>"
       oidc-client-id: "<OIDC-CLIENT-ID>"
       oidc-client-secret: "<OIDC-CLIENT-SECRET>"
       oidc-extra-scope: profile,email,openid
   ```

</TabItem>

<TabItem label="Amazon EKS" value="Amazon EKS Setup">

Follow these steps to configure OIDC for managed EKS clusters.

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack,
   and enter your third-party provider details.

   ```yaml
   oidcIdentityProvider:
     identityProviderConfigName: "Spectro-docs"
     issuerUrl: "issuer-url"
     clientId: "user-client-id-from-Palette"
     usernameClaim: "email"
     usernamePrefix: "-"
     groupsClaim: "groups"
     groupsPrefix: ""
     requiredClaims:
   ```

2. Under the `clientConfig` parameter section of Kubernetes pack, uncomment the `oidc-` configuration lines.

   ```yaml
   clientConfig:
     oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
     oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
     oidc-client-secret: **************************************************
     oidc-extra-scope: profile,email
   ```

3. Provide third-party OIDC IDP details.

</TabItem>

</Tabs>

### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map
many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To
learn more, review [Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes
pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group.

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.webp)

</TabItem>

<TabItem label="Deprecated" value="deprecated">

:::warning

All versions less than v1.27.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

</TabItem>
</Tabs>

## Terraform

You can reference Kubernetes in Terraform with the following code snippet.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes"
  version = "1.26.4"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## Resources

- [Kubernetes](https://kubernetes.io/)

- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)

- [Image Swap with Palette](../clusters/cluster-management/image-swap.md)
