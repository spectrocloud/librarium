---
title: "Kubernetes"
metaTitle: "Kubernetes"
metaDescription: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hiddenFromNav: true
type: "integration"
category: ["kubernetes", 'amd64']
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

The Kubeadm config is updated with hardening improvements that do the following: 

<br />

- Meet CIS standards for operating systems (OS).


- Enable a Kubernetes audit policy in the pack. The audit policy is hidden, and you cannot customize the default audit policy. If you want to apply your custom audit policy, refer to the [Enable Audit Logging](/audit-logs/kube-api-audit-logging)  guide to learn how to create your custom audit policy by adjusting API server flags. 


- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security coverage:

  <br />

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege escalations.

  <br />

	- **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom Admission configuration and set the `admission-control-config-file` flag to the custom Admission. 

    <br />

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

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn and audit and identifies Pods that require privileged access.

    <br />

	  You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

    <br />

    ```yaml
	  pod-security.kubernetes.io/enforce: privileged	
    pod-security.kubernetes.io/enforce-version: v1.26
	  ``` 


<br />

#### Kubeadm Configuration File 

The default pack YAML contains minimal configurations offered by the managed provider.


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


The Kubeadm config is updated with hardening improvements that do the following: 

<br />

- Meet CIS standards for operating systems (OS).


- Enable a Kubernetes audit policy in the pack that you can customize by adjusting API server flags. 


- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security coverage:

  <br />

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege escalations.

  <br />

	- **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom Admission configuration and set the `admission-control-config-file` flag to the custom Admission. 

    <br />

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

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn and audit and identifies Pods that require privileged access.

    <br />

	  You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

    <br />

    ```yaml
	  pod-security.kubernetes.io/enforce: privileged	
    pod-security.kubernetes.io/enforce-version: v1.25
	  ``` 

<br />

<br />

#### Kubeadm Configuration File 

The default pack YAML contains minimal configurations offered by the managed provider.

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

The Kubeadm config is updated with hardening improvements that do the following: 

<br />

- Meet CIS standards for operating systems (OS).


- Enable a Kubernetes audit policy in the pack that you can customize by adjusting API server flags. 


- Replace a deprecated PodSecurityPolicy (PSP) with one that offers three built-in policy profiles for broad security coverage:

  <br />

  - **Privileged**: An unrestricted policy that provides wide permission levels and allows for known privilege escalations.

  <br />

	- **Baseline**: A policy that offers minimal restrictions and prevents known privilege escalations. As shown in the example below, you can override the default cluster-wide policy to set baseline enforcement by enabling the `PodSecurity` Admission plugin in the `enable-admission-plugins` section of the YAML file. You can then add a custom Admission configuration and set the `admission-control-config-file` flag to the custom Admission. 

    <br />

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

  - **Restricted**: A heavily restricted policy that follows Pod hardening best practices. This policy is set to warn and audit and identifies Pods that require privileged access.

    <br />

	  You can enforce these policies at the cluster level or the Namespace level. For workloads that require privileged access, you can relax `PodSecurity` enforcement by adding these labels in the Namespace:

    <br />

    ```yaml
	  pod-security.kubernetes.io/enforce: privileged	
    pod-security.kubernetes.io/enforce-version: v1.24
	  ``` 

<br />

<br />

#### Kubeadm Configuration File 

The default pack YAML contains minimal configurations offered by the managed provider.


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


<Tabs>

<Tabs.TabPane tab="AKS" key="AKS">

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

</Tabs.TabPane>




<Tabs.TabPane tab="EKS" key="EKS">

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

</Tabs.TabPane>




<Tabs.TabPane tab="GKE" key="GKE">

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

</Tabs.TabPane>




<Tabs.TabPane tab="TKE" key="TKE">

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-gke"
  version = "1.24.4"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

</Tabs.TabPane>

</Tabs>

<!-- ```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes"
  version = "1.26.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
``` -->

# Resources

- [Kubernetes](https://kubernetes.io/)



- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)



- [Image Swap with Palette](/clusters/cluster-management/image-swap)

