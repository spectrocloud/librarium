---
title: "Kubernetes"
metaTitle: "Kubernetes with Spectro Cloud"
metaDescription: "Kubernetes pack in Spectro Cloud"
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

The Kubernetes pack defines the properties that Spectro Cloud uses to deploy Kubernetes clusters. It is considered a core infrastructure pack.  Most of the Kubernetes hardening standards that the Center for Internet Security (CIS) recommends are enabled by default. The Kubernetes pack supports most [cloud and data center infrastructure providers](/clusters).

Spectro Cloud offers Cloud Native Computing Foundation (CNCF) Kubernetes as a core infrastructure pack in Palette. We release Kubernetes updates as follows:

<br />

- Major versions are assessed based on the extent of changes.
- Minor versions are provided within eight weeks of a new Kubernetes release.
- Patch versions are provided within four weeks of a new Kubernetes release.

In the period of time following a Kubernetes release, the Kubernetes pack undergoes rigorous vulnerability scans and penetration testing. 

<br />

## Versions Supported


<Tabs>

<Tabs.TabPane tab="1.26.x" key="k8s_v1.26">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.


- Operating System (OS) dependencies as listed in the table.


| Operating System | Kubernetes 1.26.x |
|-----------|-------------|
| Centos 7.7 | x |
| Ubuntu 22.04 | 1.26.1 |
| Ubuntu 20.04 | x |
| Ubuntu 18.04 | x |


## Parameters

| Parameter | Description | Required (Y/N) |
|-----------|-------------|---------|
| pack:k8sHardening  | Flag to decide if Kubernetes hardening should be applied. Default: ``True``. When set to ``True``, additional flags configured in `kubeadmconfig` will be honored and will be set to the corresponding components. | Y |
| pack:podCIDR | The CIDR range for Pods in cluster. This should match the networking layer property ``calicoNetworkCIDR``. Default: `192.168.0.0/16`  | Y |
| pack:serviceClusterIpRange | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes for pods. Default: `10.96.0.0/12` | Y |
| kubeadmconfig.apiServer.extraArgs | A list of additional apiServer flags you can set. | N |
| kubeadmconfig.apiServer.extraVolumes | A list of additional volumes to mount on apiServer. | N |
| kubeadmconfig.controllerManager.extraArgs | A list of additional ControllerManager flags to set. | N |
| kubeadmconfig.scheduler.extraArgs | A list of additional Kube scheduler flags to set. | N |
| kubeadmconfig.kubeletExtraArgs | A list of kubelet arguments to set and copy to the nodes. | N |
| kubeadmconfig.files | A list of additional files to copy to the nodes. | N |
| kubeadmconfig.preKubeadmCommands | A list of additional commands to invoke **before** running kubeadm commands. | N |
| kubeadmconfig.postKubeadmCommands | A list of additional commands to invoke **after** running kubeadm commands. | N |


## Usage 

The following are a few of the main features that Kubernetes 1.26x introduces:

<br />

- This release of Kubernetes is the first that is exclusively published in the new ``registry.k8s.io`` container image registry. No container images tags for v1.26 will be published in the now legacy ``k8s.gcr.io`` image registry.


- Allows you to create a ***PersistentVolumeClaim*** from a ***VolumeSnapshot*** across namespaces. Previously, both objects had to be in the same namespace.


- Introduces better control over scheduling behavior with the addition of a ``.spec.schedulingGates`` field to the Pods API. This field indicates whether a pod is allowed to be scheduled or not.


- Support for kubelet credential provider plugins to dynamically fetch credentials for any container image registry.


- Added CPU Manager to kubelet for better workload placement.


Check out [Kubernetes v1.26](https://kubernetes.io/blog/2022/12/09/kubernetes-v1-26-release/) for more information.

<br />

#### Example Kubeadm config

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
    extraVolumes:
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
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port : "0"
    event-qps: "0"
    protect-kernel-defaults: "true"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
  preKubeadmCommands:
    - 'echo "Executing preKubeadmCmds"'
  postKubeadmCommands:
    - 'echo "Executing postKubeadmCmds"'
```


</Tabs.TabPane>

<Tabs.TabPane tab="1.25.x" key="k8s_v1.25">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.


- Operating System (OS) dependencies as listed in the table.


| Operating System | Kubernetes 1.25.x |
|-----------|-------------|
| Centos 7.7 | x |
| Ubuntu 22.04 | 1.25.4 and higher |
| Ubuntu 20.04 | x |
| Ubuntu 18.04 | x |



## Parameters

| Parameter | Description | Required (Y/N) |
|-----------|-------------|---------|
| pack:k8sHardening  | Flag to decide if Kubernetes hardening should be applied. Default: ``True``. When set to ``True``, additional flags configured in `kubeadmconfig` will be honored and will be set to the corresponding components. | Y |
| pack:podCIDR | The CIDR range for Pods in cluster. This should match the networking layer property ``calicoNetworkCIDR``. Default: `192.168.0.0/16`  | Y |
| pack:serviceClusterIpRange | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes for pods. Default: `10.96.0.0/12` | Y |
| kubeadmconfig.apiServer.extraArgs | A list of additional apiServer flags you can set. | N |
| kubeadmconfig.apiServer.extraVolumes | A list of additional volumes to mount on apiServer. | N |
| kubeadmconfig.controllerManager.extraArgs | A list of additional ControllerManager flags to set. | N |
| kubeadmconfig.scheduler.extraArgs | A list of additional Kube scheduler flags to set. | N |
| kubeadmconfig.kubeletExtraArgs | A list of kubelet arguments to set and copy to the nodes. | N |
| kubeadmconfig.files | A list of additional files to copy to the nodes. | N |
| kubeadmconfig.preKubeadmCommands | A list of additional commands to invoke **before** running kubeadm commands. | N |
| kubeadmconfig.postKubeadmCommands | A list of additional commands to invoke **after** running kubeadm commands. | N |


## Usage


#### Example Kubeadm config

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
    extraVolumes:
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
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port : "0"
    event-qps: "0"
    protect-kernel-defaults: "true"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
  preKubeadmCommands:
    - 'echo "Executing preKubeadmCmds"'
  postKubeadmCommands:
    - 'echo "Executing postKubeadmCmds"'
```

</Tabs.TabPane>



<Tabs.TabPane tab="1.24.x" key="k8s_v1.24">

## Prerequisites

- A minimum of 4 CPU and 4GB Memory.


- Operating System (OS) dependencies as listed in the table.


| Operating System | Kubernetes 1.24.x |
|-----------|-------------|
| Centos 7.7 | x |
| Ubuntu 22.04 | x |
| Ubuntu 20.04 | 1.24.3 and higher |
| Ubuntu 18.04 | x |

## Parameters

| Parameter | Description | Required (Y/N) |
|-----------|-------------|---------|
| pack:k8sHardening  | Flag to decide if Kubernetes hardening should be applied. Default: ``True``. When set to ``True``, additional flags configured in `kubeadmconfig` will be honored and will be set to the corresponding components. | Y |
| pack:podCIDR | The CIDR range for Pods in cluster. This should match the networking layer property ``calicoNetworkCIDR``. Default: `192.168.0.0/16`  | Y |
| pack:serviceClusterIpRange | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes for pods. Default: `10.96.0.0/12` | Y |
| kubeadmconfig.apiServer.extraArgs | A list of additional apiServer flags you can set. | N |
| kubeadmconfig.apiServer.extraVolumes | A list of additional volumes to mount on apiServer. | N |
| kubeadmconfig.controllerManager.extraArgs | A list of additional ControllerManager flags to set. | N |
| kubeadmconfig.scheduler.extraArgs | A list of additional Kube scheduler flags to set. | N |
| kubeadmconfig.kubeletExtraArgs | A list of kubelet arguments to set and copy to the nodes. | N |
| kubeadmconfig.files | A list of additional files to copy to the nodes. | N |
| kubeadmconfig.preKubeadmCommands | A list of additional commands to invoke **before** running kubeadm commands. | N |
| kubeadmconfig.postKubeadmCommands | A list of additional commands to invoke **after** running kubeadm commands. | N |


## Usage


#### Example Kubeadm config

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
    extraVolumes:
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
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port : "0"
    event-qps: "0"
    protect-kernel-defaults: "true"
  files:
    - path: hardening/audit-policy.yaml
      targetPath: /etc/kubernetes/audit-policy.yaml
      targetOwner: "root:root"
      targetPermissions: "0600"
  preKubeadmCommands:
    - 'echo "Executing preKubeadmCmds"'
  postKubeadmCommands:
    - 'echo "Executing postKubeadmCmds"'
```

</Tabs.TabPane>



<Tabs.TabPane tab="Deprecated" key="deprecated">

<WarningBox>

All versions less than v1.23.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

</WarningBox>

<br />

</Tabs.TabPane>
</Tabs>


# Troubleshooting

If routing problems occur or some hosts cannot communicate outside their subnet, this indicates overlapping IP addresses or conflicting CIDR IPs.

Ensure you have provided a non-overlapping IP address for your pod network in Palette's Kubernetes manifest using the podCIDR parameter. The CIDR IP specified with the podCIDR parameter in the Kubernetes manifest always takes precedence.

<br />

- Ensure the ``podCIDR`` value does not overlap with any hosts or with the service network. 


- Ensure the ``serviceClusterIpRange``value does not overlap with the any IP ranges assigned to nodes for pods.


# Terraform

```
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes"
  version = "1.26.1"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# Resources

- [Kubernetes](https://kubernetes.io/)

- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)

