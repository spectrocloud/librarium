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

The Kubernetes pack defines the properties that Spectro Cloud uses to deploy Kubernetes clusters. Most of the Kubernetes hardening standards that the Center for Internet Security (CIS) recommends are enabled by default.

<InfoBox>

Only Kubernetes versions 1.19 and above are supported.

</InfoBox>


## Versions Supported


<Tabs>

<Tabs.TabPane tab="1.26.x" key="k8s_v1.26">

</Tabs.TabPane>



<Tabs.TabPane tab="1.25.x" key="k8s_v1.25">


</Tabs.TabPane>



<Tabs.TabPane tab="1.24.x" key="k8s_v1.24">


</Tabs.TabPane>



<Tabs.TabPane tab="1.23.x" key="k8s_v1.23">


</Tabs.TabPane>


<Tabs.TabPane tab="1.22.x" key="k8s_v1.22">


</Tabs.TabPane>



<Tabs.TabPane tab="1.21.x" key="k8s_v1.21">


</Tabs.TabPane>


<Tabs.TabPane tab="1.20.x" key="k8s_v1.20">


</Tabs.TabPane>



<Tabs.TabPane tab="1.19.x" key="k8s_v1.19">



</Tabs.TabPane>








</Tabs>

# Prerequisites


## Parameters

| Parameter | Description | Required (Y/N) |
|-----------|-------------|---------|
| pack:k8sHardening  | Flag to decide if Kubernetes hardening should be applied. Default: ``True``. When set to ``True``, additional flags configured in `kubeadmconfig` will be honored and will be set to the corresponding components. | Y |
| pack:podCIDR | The CIDR range for Pods in cluster. This should match the networking layer property ``calicoNetworkCIDR``. Default: `192.168.0.0/16`  | Y |
| pack:serviceClusterIpRange | The CIDR range for services in the cluster. This should not overlap with any IP ranges assigned to nodes for pods. Default: `10.96.0.0/12` | Y |
| kubeadmconfig.apiServer.extraArgs | List of additional apiServer flags to be set. | list required one? |
| kubeadmconfig.apiServer.extraVolumes | A list of additional volumes to mount on apiServer. | N |
| kubeadmconfig.controllerManager.extraArgs | A list of additional ControllerManager flags to set. | N |
| kubeadmconfig.scheduler.extraArgs | A list of additional Kube scheduler flags to set. | N |
| kubeadmconfig.kubeletExtraArgs | A list of kubelet arguments to set and copy to the nodes. | N |
| kubeadmconfig.files | A list of additional files to copy to the nodes. | N |
| kubeadmconfig.preKubeadmCommands | A list of additional commands to invoke **before** running kubeadm commands. | N |
| kubeadmconfig.postKubeadmCommands | A list of additional commands to invoke **after** running kubeadm commands. | N |


## Usage

Spectro Cloud offers Cloud Native Computing Foundation (CNCF) Kubernetes as a core infrastructure pack in Palette. We release Kubernetes updates as follows:

- Major versions are assessed based on the extent of changes.
- Minor versions are provided within 8 weeks of release.
- Patch versions are provided within 4 weeks of release.
 

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
      tls-cipher-suites: "cipher_suite_here"
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
  preKubeadmCommands:
    - 'echo "====> Applying kernel parameters for Kubelet"'
    - 'sysctl -p /etc/sysctl.d/90-kubelet.conf'
  postKubeadmCommands:
    'echo "List of post kubeadm commands to be executed"'
```




original file below

```yaml
kubeadmconfig:
  apiServer:
    extraArgs:
      anonymous-auth: "true"
      insecure-port: "0"
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
      use-service-account-credentials: "true"
  scheduler:
    extraArgs:
      profiling: "false"
  kubeletExtraArgs:
    read-only-port: "0"
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

# Troubleshooting

If routing problems occur or some hosts cannot communicate outside their subnet, this indicates overlapping IP addresses or conflicting CIDR IPs.

Ensure you have provided a non-overlapping IP address for your pod network in Palette's Kubernetes manifest using the podCIDR parameter. The CIDR IP specified with the podCIDR parameter in the Kubernetes manifest always takes precedence.

- Ensure the ``podCIDR`` value does not overlap with any hosts or with the service network. 

- Ensure the ``serviceClusterIpRange``value does not overlap with the any IP ranges assigned to nodes for pods.


# Terraform

data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes"
  version = "1.26.1"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}

# Resources

- [Kubernetes](https://kubernetes.io/)

- [Kubernetes Documentation](https://kubernetes.io/docs/concepts/overview/)

