---
title: "Kubernetes"
metaTitle: "Kubernetes"
metaDescription: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hiddenFromNav: true
type: "integration"
category: ["kubernetes"]
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image/png"
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Kubernetes

The Kubernetes pack supports several cloud and data center infrastructure providers. This pack defines the default properties we use to deploy Kubernetes clusters and enables most of the Kubernetes hardening standards that the Center for Internet Security (CIS) recommends.

We also support managed Kubernetes distributions for Elastic Kubernetes Service (EKS), Azure Kubernetes Service (AKS), Google Kubernetes Engine (GKE), and Tencent Kubernetes Engine (TKE). 

We offer Kubernetes as a core pack in Palette. 

Review the [Maintenance Policy](/integrations/maintenance-policy) to learn about pack update and deprecation schedules.

<br />

# Versions Supported


<Tabs>

<Tabs.TabPane tab="1.26.x" key="k8s_v1.26">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.


- Users or groups mapped to a Kubernetes RBAC role.


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
| ``pack.podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack.serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes.|
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack.serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|


## Usage 
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


- Add a certificate for the Spectro Proxy pack if you want to use a reverse proxy with a Kubernetes cluster. For more information, refer to the [Spectro Proxy](/integrations/frp) guide.


#### Configuration Changes

The Kubeadm config is updated with hardening improvements, and a pod security policy has been removed.

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
    #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
    #oidc-extra-scope: profile,email
```

</Tabs.TabPane>



<Tabs.TabPane tab="1.25.x" key="k8s_v1.25">

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
| ``pack.podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack.serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes.|
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack.serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|

## Usage 
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


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

    # Client configuration to add OIDC based authentication flags in kubeconfig
    #clientConfig:
    #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
    #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
    #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
    #oidc-extra-scope: profile,email
  ```

</Tabs.TabPane>



<Tabs.TabPane tab="1.24.x" key="k8s_v1.24">

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
| ``pack.podCIDR`` | The CIDR range for Pods in cluster. This should match the networking layer property. Default: `192.168.0.0/16`|
| ``pack.serviceClusterIpRange`` | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes or pods. Default: `10.96.0.0/12`|
| ``kubeadmconfig.apiServer.extraArgs`` | A list of additional apiServer flags you can set.|
| ``kubeadmconfig.apiServer.extraVolumes`` | A list of additional volumes to mount on apiServer.|
| ``kubeadmconfig.controllerManager.extraArgs`` | A list of additional ControllerManager flags to set.|
| ``kubeadmconfig.scheduler.extraArgs`` | A list of additional Kube scheduler flags to set.|
| ``kubeadmconfig.kubeletExtraArgs`` | A list of kubelet arguments to set and copy to the nodes.|
| ``kubeadmconfig.files`` | A list of additional files to copy to the nodes. |
| ``kubeadmconfig.preKubeadmCommands`` | A list of additional commands to invoke **before** running kubeadm commands.|
| ``kubeadmconfig.postKubeadmCommands`` | A list of additional commands to invoke **after** running kubeadm commands.|
| ``pack.serviceDomain`` | The DNS name for the service domain in the cluster. Default: ``cluster.local``.|


## Usage 
  
The Kubeadm configuration file is where you can do the following:

<br />

- Change the default ``podCIDR`` and ``serviceClusterIpRange`` values. CIDR IPs specified in the configuration file take precedence over other defined CIDR IPs in your environment.

  As you build your cluster, check that the ``podCIDR`` value does not overlap with any hosts or with the service network and the ``serviceClusterIpRange`` value does not overlap with any IP ranges assigned to nodes or pods. For more information, refer to the [Clusters](/clusters) guide and [Cluster Deployment Errors](https://docs.spectrocloud.com/troubleshooting/cluster-deployment). 


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
  # Client configuration to add OIDC based authentication flags in kubeconfig
  #clientConfig:
  #oidc-issuer-url: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-issuer-url }}"
  #oidc-client-id: "{{ .spectro.pack.kubernetes.kubeadmconfig.apiServer.extraArgs.oidc-client-id }}"
  #oidc-client-secret: 1gsranjjmdgahm10j8r6m47ejokm9kafvcbhi3d48jlc3rfpprhv
  #oidc-extra-scope: profile,email
  ```


</Tabs.TabPane>

<Tabs.TabPane tab="Deprecated" key="deprecated">

<WarningBox>

All versions less than v1.23.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

</WarningBox>

<br />

</Tabs.TabPane>
</Tabs>


# Terraform


You can reference Kubernetes in Terraform with the following code snippet.

<br />


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

# Resources

- [Kubernetes](https://kubernetes.io/)



- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)



- [Image Swap with Palette](/clusters/cluster-management/image-swap)

