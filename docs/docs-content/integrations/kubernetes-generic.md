---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
tags: ["packs", "kubernetes"]
---

The Cloud Native Computing Foundation's (CNCF) Kubernetes pack supports several cloud and data center infrastructure
providers. This pack defines the default properties we use to deploy Kubernetes clusters and enables most of the
Kubernetes hardening standards that the Center for Internet Security (CIS) recommends.

We also support managed Kubernetes distributions for Elastic Kubernetes Service (EKS), Azure Kubernetes Service (AKS),
Google Kubernetes Engine (GKE), and Tencent Kubernetes Engine (TKE).

:::info Review the [Maintenance Policy](maintenance-policy.md) to learn about pack update and deprecation schedules. :::

<br />

### Support Lifecycle

We support CNCF Kubernetes for N-3 Kubernetes minor versions for a duration of 14 months. The duration exceeds the
official EOL by four months. Once we stop supporting the minor version, we initiate the deprecation process. Refer to
the [Kubernetes Support Lifecycle](kubernetes-support.md#palette-extended-kubernetes-support) guide to learn more.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.27.x" value="k8s_v1.27">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Users or groups mapped to a Kubernetes RBAC role.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.27.x |
| --------------- | ---------- | -------------------------- |
| CentOS          | 7.7        | ❌                         |
| Ubuntu          | 22.04      | ✅                         |
| Ubuntu          | 20.04      | ❌                         |
| Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.palette.config.oidcidentityProvider`  | OIDC identity provider configuration.                                                                                                                                                                                                                                                                                                                                                                                               |
| `pack.podCIDR`                              | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                                                      |
| `pack.serviceClusterIpRange`                | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                                           |
| `pack.serviceDomain`                        | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes-generic.md?platform=AKS&versions=k8s_v1.27#change-cluster-dns-service-domain) section. |
| `kubeadmconfig.apiServer.extraArgs`         | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.apiServer.extraVolumes`      | A list of additional volumes to mount on apiServer.                                                                                                                                                                                                                                                                                                                                                                                 |
| `kubeadmconfig.controllerManager.extraArgs` | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                                                |
| `kubeadmconfig.scheduler.extraArgs`         | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.kubeletExtraArgs`            | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                           |
| `kubeadmconfig.files`                       | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                                    |
| `kubeadmconfig.preKubeadmCommands`          | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.postKubeadmCommands`         | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                         |

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
  [Change Cluster DNS Service Domain](kubernetes-generic.md?platform=AKS&versions=k8s_v1.27#change-cluster-dns-service-domain).

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

The Kubeadm config is updated with hardening improvements that do the following:

- Meet CIS standards for operating systems (OS).

- Enable a Kubernetes audit policy in the pack. The audit policy is hidden, and you cannot customize the default audit
  policy. If you want to apply your custom audit policy, refer to the
  [Enable Audit Logging](../audit-logs/kube-api-audit-logging.md) guide to learn how to create your custom audit policy
  by adjusting API server flags.

- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security
  coverage:

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege
    escalations.

  - **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the
    example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the
    `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom
    Admission configuration and set the `admission-control-config-file` flag to the custom Admission.

    ```yaml
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
    ```

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn
    and audit and identifies Pods that require privileged access.

    You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged
    access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

    ```yaml
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.26
    ```

### Kubeadm Configuration File

The default pack YAML contains minimal configurations offered by the managed provider.

### Configure OIDC Identity Provider

You can configure an OpenID Connect (OIDC) identity provider to authenticate users and groups in your cluster. OIDC is
an authentication layer on top of OAuth 2.0, an authorization framework that allows users to authenticate to a cluster
without using a password.

OIDC requires a _RoleBinding_ for the users or groups you want to provide cluster access. You must create a RoleBinding
to a Kubernetes role that is available in the cluster. The Kubernetes role can be a custom role you created or a
[default Kubernetes role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles), such as the
`cluster-admin` role. To learn how to create a RoleBinding through Palette, refer to
[Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

#### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory).

<Tabs queryString="oidc-mode">

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory) to learn more. Click the **Amazon
EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile. Replace the
   `identityProvider` value with your OIDC provider name.

```yaml
pack:
  palette:
    config:
      oidc:
        identityProvider: yourIdentityProviderNameHere
```

2. Add the following `kubeadmconfig` parameters. Replace the values with your OIDC provider values.

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
```

3. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

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
  oidc-client-secret: yourSecretKeyHere
  oidc-extra-scope: profile,email
```

3. Provide third-party OIDC IDP details.

4. Refer to the [Access EKS Cluster](../clusters/public-cloud/aws/eks.md#access-eks-cluster) for guidance on how to
   access an EKS cluster.

</TabItem>
</Tabs>

</TabItem>

<TabItem label="1.26.x" value="k8s_v1.26">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Users or groups mapped to a Kubernetes RBAC role.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.26.x |
| --------------- | ---------- | -------------------------- |
| CentOS          | 7.7        | ✅                         |
| Ubuntu          | 22.04      | ✅                         |
| Ubuntu          | 20.04      | ❌                         |
| Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pack.palette.config.oidcidentityProvider`  | OIDC identity provider configuration.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pack.podCIDR`                              | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                                                        |
| `pack.serviceClusterIpRange`                | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                                             |
| `pack.serviceDomain`                        | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes-generic.md?platform=AKS&versions=k8s_v1.26#change-cluster-dns-service-domain-1) section. |
| `kubeadmconfig.apiServer.extraArgs`         | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                                                     |
| `kubeadmconfig.apiServer.extraVolumes`      | A list of additional volumes to mount on apiServer.                                                                                                                                                                                                                                                                                                                                                                                   |
| `kubeadmconfig.controllerManager.extraArgs` | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                                                  |
| `kubeadmconfig.scheduler.extraArgs`         | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                                                     |
| `kubeadmconfig.kubeletExtraArgs`            | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                             |
| `kubeadmconfig.files`                       | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                                      |
| `kubeadmconfig.preKubeadmCommands`          | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                          |
| `kubeadmconfig.postKubeadmCommands`         | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                                           |

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
  [Change Cluster DNS Service Domain](kubernetes-generic.md?platform=AKS&versions=k8s_v1.26#change-cluster-dns-service-domain-1).

- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more
  information, refer to the [Spectro Proxy](frp.md) guide.

### Change Cluster DNS Service Domain

The `pack.serviceDomain` parameter with default value `cluster.local` is not visible in the Kubernetes YAML file, and
its value can only be changed at cluster creation. To change the value, you must add `serviceDomain: "cluster.local"` to
the Kubernetes YAML file when you create a cluster, and specify the service domain you want to use.

```yaml
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

The Kubeadm config is updated with hardening improvements that do the following:

- Meet CIS standards for operating systems (OS).

- Enable a Kubernetes audit policy in the pack. The audit policy is hidden, and you cannot customize the default audit
  policy. If you want to apply your custom audit policy, refer to the
  [Enable Audit Logging](../audit-logs/kube-api-audit-logging.md) guide to learn how to create your custom audit policy
  by adjusting API server flags.

- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security
  coverage:

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege
    escalations.

  - **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the
    example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the
    `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom
    Admission configuration and set the `admission-control-config-file` flag to the custom Admission.

    ```yaml
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
    ```

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn
    and audit and identifies Pods that require privileged access.

    You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged
    access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

    ```yaml
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.26
    ```

### Kubeadm Configuration File

The default pack YAML contains minimal configurations offered by the managed provider.

### Configure OIDC Identity Provider

You can configure an OpenID Connect (OIDC) identity provider to authenticate users and groups in your cluster. OIDC is
an authentication layer on top of OAuth 2.0, an authorization framework that allows users to authenticate to a cluster
without using a password.

OIDC requires a _RoleBinding_ for the users or groups you want to provide cluster access. You must create a RoleBinding
to a Kubernetes role that is available in the cluster. The Kubernetes role can be a custom role you created or a
[default Kubernetes role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles), such as the
`cluster-admin` role. To learn how to create a RoleBinding through Palette, refer to
[Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

#### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory).

<Tabs queryString="oidc-mode">

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory) to learn more. Click the **Amazon
EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile. Replace the
   `identityProvider` value with your OIDC provider name.

{" "}

<br />

```yaml
pack:
  palette:
    config:
      oidc:
        identityProvider: yourIdentityProviderNameHere
```

2. Add the following `kubeadmconfig` parameters. Replace the values with your OIDC provider values.

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
```

3. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

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
  oidc-client-secret: yourSecretKeyHere
  oidc-extra-scope: profile,email
```

3. Provide third-party OIDC IDP details.

4. Refer to the [Access EKS Cluster](../clusters/public-cloud/aws/eks.md#access-eks-cluster) for guidance on how to
   access an EKS cluster.

</TabItem>
</Tabs>

</TabItem>

<TabItem label="1.25.x" value="k8s_v1.25">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.25.x |
| --------------- | ---------- | -------------------------- |
| CentOS          | 7.7        | ✅                         |
| Ubuntu          | 22.04      | ✅                         |
| Ubuntu          | 20.04      | ❌                         |
| Ubuntu          | 18.04      | ❌                         |

## Parameters

| Parameter                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pack.palette.config.oidcidentityProvider`  | OIDC identity provider configuration.                                                                                                                                                                                                                                                                                                                                                                                    |
| `pack.podCIDR`                              | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`                                                                                                                                                                                                                                                                                                           |
| `pack.serviceClusterIpRange`                | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`                                                                                                                                                                                                                                                                                |
| `pack.serviceDomain`                        | The cluster DNS service domain. Default: `cluster.local`. To change the default, you must add this parameter to the Kubernetes YAML file at cluster creation and specify the cluster DNS service domain to use. This value cannot be changed after cluster creation is complete. Refer to the [Change Cluster DNS Service Domain](kubernetes-generic.md?versions=k8s_v1.25#change-cluster-dns-service-domain-2) section. |
| `kubeadmconfig.apiServer.extraArgs`         | A list of additional apiServer flags you can set.                                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.apiServer.extraVolumes`      | A list of additional volumes to mount on apiServer.                                                                                                                                                                                                                                                                                                                                                                      |
| `kubeadmconfig.controllerManager.extraArgs` | A list of additional ControllerManager flags to set.                                                                                                                                                                                                                                                                                                                                                                     |
| `kubeadmconfig.scheduler.extraArgs`         | A list of additional Kube scheduler flags to set.                                                                                                                                                                                                                                                                                                                                                                        |
| `kubeadmconfig.kubeletExtraArgs`            | A list of kubelet arguments to set and copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                |
| `kubeadmconfig.files`                       | A list of additional files to copy to the nodes.                                                                                                                                                                                                                                                                                                                                                                         |
| `kubeadmconfig.preKubeadmCommands`          | A list of additional commands to invoke **before** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                             |
| `kubeadmconfig.postKubeadmCommands`         | A list of additional commands to invoke **after** running kubeadm commands.                                                                                                                                                                                                                                                                                                                                              |

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
  [Change Cluster DNS Service Domain](kubernetes-generic.md?versions=k8s_v1.25#change-cluster-dns-service-domain-2).

- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more
  information, refer to the [Spectro Proxy](frp.md) guide.

### Change Cluster DNS Service Domain

The `pack.serviceDomain` parameter with default value `cluster.local` is not visible in the Kubernetes YAML file, and
its value can only be changed at cluster creation. To change the value, you must add `serviceDomain: "cluster.local"` to
the Kubernetes YAML file when you create a cluster, and specify the service domain you want to use.

```yaml
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

The Kubeadm config is updated with hardening improvements that do the following:

- Meet CIS standards for operating systems (OS).

- Enable a Kubernetes audit policy in the pack that you can customize by adjusting API server flags.

- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security
  coverage:

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege
    escalations.

  - **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the
    example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the
    `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom
    Admission configuration and set the `admission-control-config-file` flag to the custom Admission.

    ```yaml
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
    ```

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn
    and audit and identifies Pods that require privileged access.

    You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged
    access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

  ```yaml
  pod-security.kubernetes.io/enforce: privileged
  pod-security.kubernetes.io/enforce-version: v1.25
  ```

### Kubeadm Configuration File

The default pack YAML contains minimal configurations offered by the managed provider.

### Configure OIDC Identity Provider

You can configure an OpenID Connect (OIDC) identity provider to authenticate users and groups in your cluster. OIDC is
an authentication layer on top of OAuth 2.0, an authorization framework that allows users to authenticate to a cluster
without using a password.

OIDC requires a _RoleBinding_ for the users or groups you want to provide cluster access. You must create a RoleBinding
to a Kubernetes role that is available in the cluster. The Kubernetes role can be a custom role you created or a
[default Kubernetes role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles), such as the
`cluster-admin` role. To learn how to create a RoleBinding through Palette, refer to
[Create Role Bindings](../clusters/cluster-management/cluster-rbac.md#create-role-bindings).

#### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon
Elastic Kubernetes Service (EKS) and
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory).

<Tabs queryString="oidc-mode">

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">

Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers
except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to
use Azure Active Directory (AAD) to enable OIDC integration. Refer to
[Azure-AKS](../clusters/public-cloud/azure/aks.md#configure-an-azure-active-directory) to learn more. Click the **Amazon
EKS** tab for steps to configure OIDC for EKS clusters.

1. Add the following parameters to your Kubernetes YAML file when creating a cluster profile. Replace the
   `identityProvider` value with your OIDC provider name.

```yaml
pack:
  palette:
    config:
      oidc:
        identityProvider: palette
```

2. Add the following `kubeadmconfig` parameters. Replace the values with your OIDC provider values.

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      oidc-issuer-url: "provider URL"
      oidc-client-id: "client-id"
      oidc-groups-claim: "groups"
      oidc-username-claim: "email"
```

3. Under the `clientConfig` parameter section of Kubernetes YAML file, uncomment the `oidc-` configuration lines.

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

{" "}

<br />

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

{" "}

<br />

```yaml
clientConfig:
  oidc-issuer-url: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.issuerUrl }}"
  oidc-client-id: "{{ .spectro.pack.kubernetes-eks.managedControlPlane.oidcIdentityProvider.clientId }}"
  oidc-client-secret: yourSecretKeyHere
  oidc-extra-scope: profile,email
```

3. Provide third-party OIDC IDP details.

4. Refer to the [Access EKS Cluster](../clusters/public-cloud/aws/eks.md#access-eks-cluster) for guidance on how to
   access an EKS cluster.

</TabItem>
</Tabs>

</TabItem>

<TabItem label="Deprecated" value="deprecated">

:::warning

All versions less than v1.25.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

<br />

</TabItem>
</Tabs>

## Terraform

You can reference Kubernetes in Terraform with the following code snippet.

<Tabs queryString="platform">

<TabItem label="AKS" value="AKS">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-aks"
  version = "1.26"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>

<TabItem label="EKS" value="EKS">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-eks"
  version = "1.24"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>

<TabItem label="GKE" value="GKE">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-gke"
  version = "1.25.8"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>

<TabItem label="TKE" value="TKE">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-tke"
  version = "1.24.4"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</TabItem>

</Tabs>

## Resources

- [Kubernetes](https://kubernetes.io/)

- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)

- [Image Swap with Palette](../clusters/cluster-management/image-swap.md)
