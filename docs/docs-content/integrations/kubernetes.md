---
sidebar_label: "Palette eXtended Kubernetes"
title: "Palette eXtended Kubernetes"
description: "Learn about the Palette eXtended Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
tags: ["packs", "kubernetes", "pxk"]
---

The Palette eXtended Kubernetes (PXK) pack supports several [cloud and data center infrastructure providers](/clusters). This pack defines the default properties we use to deploy Kubernetes clusters and enables most of the Kubernetes hardening standards that the Center for Internet Security (CIS) recommends. 

Spectro Cloud offers Cloud Native Computing Foundation (CNCF) Kubernetes as a core infrastructure pack in Palette. We release Kubernetes updates as follows:

<br />

- Major versions are assessed based on the extent of changes.
- Minor versions are provided within eight weeks of a new Kubernetes release.
- Patch versions are provided within four weeks of a new Kubernetes release.

In the period of time following a Kubernetes release, the Kubernetes pack undergoes rigorous vulnerability scans and penetration testing. 

A minor Kubernetes version will be deprecated in Palette when the Kubernetes community announces the version is entering End of Life (EOL). The deprecated version will remain in that state for three months and will be disabled after a quarter and deleted from Palette in the following quarter.

Below are the stages of deprecation:

<br />

- **Deprecate**: When a pack is deprecated, Palette displays a warning. You will still be able to create new cluster profiles using the pack and launch clusters using existing profiles that contain the pack.


- **Disable**: When a pack is disabled, you will no longer be allowed to create new cluster profiles using the pack. Palette displays a message informing you to cut over to the newer version of the pack. However, you can still deploy new clusters using existing profiles that contain the deprecated pack.


- **Delete**: When a pack is deleted, you will not be able to create new cluster profiles using the pack or launch new clusters using the existing profiles that contain the pack. Palette displays a message informing you to cut over to the newer version of the pack. There is no disruption to existing cluster workloads and will continue to be functional.

<br />

:::info

For important guidelines on updating pack versions, review [Update the Pack Version](/cluster-profiles/task-update-profile#updatethepackversion).


:::


# Versions Supported


<Tabs queryString="versions">

<TabItem label="1.27.x" value="k8s_v1.27">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.27.x |
|---------------|------------|----------------------------|
| CentOS        | 7.7        | ❌                         |
| Ubuntu        | 22.04      | ✅                         |
| Ubuntu        | 20.04      | ❌                         |
| Ubuntu        | 18.04      | ❌                         |


## Parameters

| Parameter | Description |
|-----------|-------------|
| `pack.palette.config.dashboard.identityProvider`| OIDC identity provider configuration. |
| `pack.podCIDR` | The CIDR range for Pods in the cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| `pack.serviceClusterIpRange` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``pack.palette.config.dashboard.identityProvider`` | Dynamically enabled OpenID Connect (OIDC) Identity Provider (IDP) setting based on your UI selection when you add the PXK pack to your profile. This parameter appears in the YAML file after you make a selection. Refer to [Configure OIDC Identity Provider](/integrations/kubernetes#configureoidcidentityprovider). |
| `kubeadmconfig.apiServer.extraArgs` | A list of additional apiServer flags you can set.|
| `kubeadmconfig.apiServer.extraVolumes` | A list of additional volumes to mount on the apiServer.|
| `kubeadmconfig.controllerManager.extraArgs` | A list of additional ControllerManager flags to set.|
| `kubeadmconfig.scheduler.extraArgs` | A list of additional Kube scheduler flags to set.|
| `kubeadmconfig.kubeletExtraArgs` | A list of kubelet arguments to set and copy to the nodes.|
| `kubeadmconfig.files` | A list of additional files to copy to the nodes.|
| `kubeadmconfig.preKubeadmCommands` | A list of additional commands to invoke **before** running kubeadm commands.|
| `kubeadmconfig.postKubeadmCommands` | A list of additional commands to invoke **after** running kubeadm commands.|
| `kubeadmconfig.clientConfig` | Settings to manually configure OIDC-based authentication when you choose a third-party (Custom) IDP. Refer to [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc). |
| `pack.serviceDomain` | The DNS name for the service domain in the cluster. Default: `cluster.local`.|


## Usage 
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


- Manually configure a third-party OIDC IDP. For more information, check out [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc).


- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.


#### Configuration Changes

The PXK Kubeadm configuration is updated to dynamically enable OIDC based on your IDP selection by adding the ``identityProvider`` parameter. 

<br />

```yaml
palette:
   config:
     dashboard:
       identityProvider: <your_idp_selection>
```

<br />

#### Example Kubeadm Configuration File 

```yaml
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

<br />

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below. 

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings). 


<br />

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

  <br />

  :::caution

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that rely on OIDC.

  :::

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc). This setting displays in the YAML file as `none`.


- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting displays in the YAML file as `palette`.


- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.

:::info

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::


### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon Elastic Kubernetes Service (EKS) and [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory).

<br />

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">


Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to use Azure Active Directory (AAD) to enable OIDC integration. Refer to [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory) to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

<br />

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

<br />

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack, and enter your third-party provider details.

```yaml
oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'
    issuerUrl: 'issuer-url'
    clientId: 'user-client-id-from-Palette'
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
  oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
  oidc-extra-scope: profile,email
```

3. Provide third-party OIDC IDP details.

</TabItem>

</Tabs>


### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To learn more, review [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group. 

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.png)


</TabItem>

<TabItem label="1.26.x" value="k8s_v1.26">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.26.x |
|---------------|------------|----------------------------|
| CentOS        | 7.7        | ✅                         |
| Ubuntu        | 22.04      | ✅                         |
| Ubuntu        | 20.04      | ❌                         |
| Ubuntu        | 18.04      | ❌                         |


## Parameters

| Parameter | Description |
|-----------|-------------|
| ``pack:podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack:serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes.|
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack:serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|


## Usage 
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


- Configure OpenID Connect (OIDC) parameters to specify a third-party Identify Provider (IDP). For more information, refer to the [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) guide.


- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.

#### Configuration Changes

The Kubeadm config has been updated with improved hardening. 

<br />

#### Example Kubeadm Configuration File 


```yaml
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"

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
    read-only-port : "0"
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
              usernames: []
              runtimeClasses: []
              namespaces: [kube-system]
  preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
  postKubeadmCommands:
    - 'echo "List of post kubeadm commands to be executed"'
#clientConfig:
  #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
  #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
  #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
  #oidc-extra-scope: profile,email
```

<br />

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below. 

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings). 


<br />

- **None**: This setting does not require OIDC configuration for the cluster. It displays in the YAML file as `noauth`. 

  <br />

  :::caution

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that rely on OIDC.

  :::

- **Custom**: This is the default setting and does not require OIDC configuration. However, if desired, it allows you to specify a third-party OIDC provider by configuring OIDC statements in the YAML file as described in [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc). This setting displays in the YAML file as `none`.


- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting displays in the YAML file as `palette`.


- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.

:::info

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::


### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon Elastic Kubernetes Service (EKS) and [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory).

<br />

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">


Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to use Azure Active Directory (AAD) to enable OIDC integration. Refer to [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory) to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

<br />

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

<br />

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack, and enter your third-party provider details.

```yaml
oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'
    issuerUrl: 'issuer-url'
    clientId: 'user-client-id-from-Palette'
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
  oidc-client-secret: yourSecretClientSecretGoesHere
  oidc-extra-scope: profile,email
```

3. Provide third-party OIDC IDP details.

</TabItem>

</Tabs>


### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To learn more, review [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group. 

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.png)


</TabItem>



<TabItem label="1.25.x" value="k8s_v1.25">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.25.x |
|---------------|------------|----------------------------|
| CentOS        | 7.7        | ✅                         |
| Ubuntu        | 22.04      | ✅                         |
| Ubuntu        | 20.04      | ❌                         |
| Ubuntu        | 18.04      | ❌                         |


## Parameters

| Parameter | Description |
|-----------|-------------|
| ``pack:podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack:serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes.|
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack:serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|

## Usage
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment).  


- Configure OpenID Connect (OIDC) parameters to specify a third-party Identify Provider (IDP). For more information, refer to the [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) guide.


- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.

#### Configuration Changes

The Kubeadm config is updated with hardening improvements, as a pod security policy has been removed.

<br />

#### Example Kubeadm Configuration File 

```yaml
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"

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
    read-only-port : "0"
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
              enforce-version: "v1.25"
              audit: "baseline"
              audit-version: "v1.25"
              warn: "restricted"
              warn-version: "v1.25"
              audit: "restricted"
              audit-version: "v1.25"
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
  #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
  #oidc-extra-scope: profile,email
  ```

  <br />

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below. 

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings). 


<br />

- **None**: This is the default setting and there is nothing to configure. This setting displays in the YAML file as `noauth`. 

  <br />

  :::caution

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that rely on OIDC.

  :::

- **Custom**: This setting allows you to specify a third-party OIDC provider by configuring OIDC statements in the Kubeadm configuration file as described in [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc). This setting displays in the YAML file as `none`.


- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting displays in the YAML file as `palette`.


- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.

:::info

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::

### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon Elastic Kubernetes Service (EKS) and [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory).

<br />

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">


Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to use Azure Active Directory (AAD) to enable OIDC integration. Refer to [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory) to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

<br />

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

3. Provide third-party OIDC IDP details. Refer to the [SAML & SSO Setup](/user-management/saml-sso) for guidance on configuring a third party IDP with Palette.

</TabItem>

<TabItem label="Amazon EKS" value="Amazon EKS Setup">


Follow these steps to configure OIDC for managed EKS clusters.

<br />

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack, and enter your third-party provider details.

```yaml
oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'
    issuerUrl: 'issuer-url'
    clientId: 'user-client-id-from-Palette'
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
  oidc-client-secret: yourSecretClientSecretGoesHere
  oidc-extra-scope: profile,email
```

</TabItem>

</Tabs>

### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To learn more, review [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group. 

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.png)


</TabItem>



<TabItem label="1.24.x" value="k8s_v1.24">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.

- Operating System (OS) dependencies as listed in the table.

| OS Distribution | OS Version | Supports Kubernetes 1.24.x |
|---------------|------------|----------------------------|
| CentOS        | 7.7        | ✅                           |
| Ubuntu        | 22.04      | ❌                         |
| Ubuntu        | 20.04      | ✅                         |
| Ubuntu        | 18.04      | ❌                         |


## Parameters

| Parameter | Description |
|-----------|-------------|
| ``pack:podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack:serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes. |
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack:serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|


## Usage

The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


- Configure OpenID Connect (OIDC) parameters to specify a third-party Identify Provider (IDP). For more information, refer to the [Use RBAC With OIDC](/clusters/cluster-management/cluster-rbac/#userbacwithoidc) guide.


- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.

#### Configuration Changes

The Kubeadm configuration is changed to include a pod security policy, and an unsecured port is removed.  

<br />

#### Example Kubeadm Configuration File 

```yaml
pack:
  k8sHardening: True
  podCIDR: "192.168.0.0/16"
  serviceClusterIpRange: "10.96.0.0/12"

kubeadmconfig:
  apiServer:
    extraArgs:
      secure-port: "6443"
      anonymous-auth: "true"
      profiling: "false"
      disable-admission-plugins: "AlwaysAdmit"
      default-not-ready-toleration-seconds: "60"
      default-unreachable-toleration-seconds: "60"
      enable-admission-plugins: "AlwaysPullImages,NamespaceLifecycle,ServiceAccount,NodeRestriction,PodSecurityPolicy"
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
    read-only-port : "0"
    event-qps: "0"
    feature-gates: "RotateKubeletServerCertificate=true"
    protect-kernel-defaults: "true"
    tls-cipher-suites: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/privileged-psp.yaml
      targetPath: /etc/kubernetes/hardening/privileged-psp.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
    - path: hardening/90-kubelet.conf
      targetPath: /etc/sysctl.d/90-kubelet.conf
      targetOwner: "root:root"
      targetPermissions: "0600"
  preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
  postKubeadmCommands:
    - 'export KUBECONFIG=/etc/kubernetes/admin.conf && [ -f "$KUBECONFIG" ] && { echo " ====> Applying PodSecurityPolicy" ; until $(kubectl apply -f /etc/kubernetes/hardening/privileged-psp.yaml > /dev/null ); do echo "Failed to apply PodSecurityPolicies, will retry in 5s" ; sleep 5 ; done ; } || echo "Skipping PodSecurityPolicy for worker nodes"'

#clientConfig:
  #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
  #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
  #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
  #oidc-extra-scope: profile,email
  ```
<br />

### Configure OIDC Identity Provider

Platforms that use PXK can use the OIDC IDP feature, which offers the convenience of managing OIDC at the Kubernetes layer. The OIDC IDP feature is particularly useful for environments that do not have their own IDP configured. In this scenario, you can leverage Palette as an IDP without having to configure a third-party IDP. We also support the ability to take advantage of other OIDC providers by making it possible for you to configure OIDC at the tenant level. For additional flexibility, if you wish to use a different IDP than the one configured at the tenant level, you can select a different IDP by adding the OIDC configuration to your cluster profile.

When you add the PXK pack to a cluster profile, Palette displays the OIDC IDP options listed below. 

All the options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings). 

<br />

- **None**: This is the default setting and there is nothing to configure. This setting displays in the YAML file as `noauth`. 

  <br />

  :::caution

  We do not recommend choosing **None** in a production environment, as it may disable authentication for add-ons that rely on OIDC.

  :::

- **Custom**: This setting allows you to specify a third-party OIDC provider by configuring OIDC statements in the Kubeadm configuration file as described in [Configure Custom OIDC](/integrations/kubernetes#configurecustomoidc). This setting displays in the YAML file as `none`.


- **Palette**: This setting makes Palette the IDP. Any user with a Palette account in the tenant and the proper permissions to view and access the project's resources is able to log into the Kubernetes dashboard. This setting displays in the YAML file as `palette`.


- **Inherit from Tenant**: This setting allows you to apply RBAC to multiple clusters and requires you to configure OpenID Connect (OIDC) in **Tenant Settings**. In Tenant Admin scope, navigate to **Tenant Settings** > **SSO**, choose **OIDC**, and provide your third-party IDP details. This setting displays in the YAML file as `tenant`. For more information, check out the [SSO Setup](/user-management/saml-sso) guide.

:::info

If your IDP uses Security Assertion Markup Language (SAML) authentication, then the **Inherit from Tenant** option will not work, and you will need to use the **Custom** option instead. This is because Kubernetes supports only OIDC authentication and not SAML authentication.

:::


### Configure Custom OIDC

The custom method to configure OIDC and apply RBAC for an OIDC provider can be used for all cloud services except Amazon Elastic Kubernetes Service (EKS) and [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory).

<br />

<Tabs>

<TabItem label="Custom OIDC Setup" value="Custom OIDC Setup">


Follow these steps to configure a third-party OIDC IDP. You can apply these steps to all the public cloud providers except Azure AKS and Amazon EKS clusters. Azure AKS and Amazon EKS require different configurations. AKS requires you to use Azure Active Directory (AAD) to enable OIDC integration. Refer to [Azure-AKS](/clusters/public-cloud/azure/aks/#configureanazureactivedirectory) to learn more. Click the **Amazon EKS** tab for steps to configure OIDC for EKS clusters.

<br />

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

3. Provide third-party OIDC IDP details.

</TabItem>

<TabItem label="Amazon EKS" value="Amazon EKS Setup">


Follow these steps to configure OIDC for managed EKS clusters.

<br />

1. In the Kubernetes pack, uncomment the lines in the `oidcIdentityProvider` parameter section of the Kubernetes pack, and enter your third-party provider details.

```yaml
oidcIdentityProvider:
    identityProviderConfigName: 'Spectro-docs'
    issuerUrl: 'issuer-url'
    clientId: 'user-client-id-from-Palette'
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
  oidc-client-secret: yourSecretClientSecretGoesHere
  oidc-extra-scope: profile,email
```

</TabItem>

</Tabs>

### Use RBAC with OIDC

You can create a role binding that uses individual users as the subject or specify a group name as the subject to map many users to a role. The group name is the group assigned in the OIDC provider's configuration. Below is an example. To learn more, review [Create Role Bindings](/clusters/cluster-management/cluster-rbac/#createrolebindings).

Assume you created a group named `dev-east-2` within an OIDC provider. If you configure the host cluster's Kubernetes pack with all the correct OIDC settings, you could then create a role binding for the `dev-east-2` group. 

In this example, Palette is used as the IDP, and all users in the `dev-east-2` would inherit the `cluster-admin` role.

![A subject of the type group is assigned as the subject in a RoleBinding](/clusters_cluster-management_cluster-rbac_cluster-subject-group.png)


</TabItem>



<TabItem label="Deprecated" value="deprecated">

:::caution

All versions less than v1.23.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

<br />

</TabItem>
</Tabs>


## Terraform

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes"
  version = "1.26.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## Resources

- [Kubernetes](https://kubernetes.io/)



- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)



- [Image Swap with Palette](/clusters/cluster-management/image-swap)
