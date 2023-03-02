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

| Parameter | Description | Default |
|-----------|-------------|---------|
| namespace | The Kubernetes namespace to install the dashboard. | `kubernetes-dashboard` |
| ClusterRole | The ClusterRole to assign to the Kubernetes Dashboard. | `read-only` |
| certDuration | Self-signed certificate duration in hours. | 8760h (365d) |
| certRenewal | Self-signed certificate renewal in hours | 720h (30d) |
| enableInsecureLogin | RBAC ensures secure login. | `false` |
| serviceType | The service type for the dashboard. Supported values are ClusterIP, LoadBalancer, and NodePort. | `ClusterIP` |
| skipLogin | Enables or disables the skip login option on the dashboard. | `false` |
| enableInsecureLogin | Enables non-Secure Sockets Layer (SSL) login. Dashboard login is always restricted to HTTP(S) + localhost or HTTPS and external domain. | `false` |
| ingress.enabled | Ingress configuration to access the ClusterIP, loadBalancer, or nodePort. | `false` |



| Name                                      | Supported values | Default value                                                                                           | Description                                                                                                                       |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| pack.k8sHardening                         | True, False      | True                                                                                                    | Flag to decide if Kubernetes hardening should be applied.                                                                         |
|                                           |                  |                                                                                                         | When set to True, additional flags configured in `kubeadmconfig` will be honored and will be set to the corresponding components. |
|                                           |                  |                                                                                                         | When set to True, additional flags configured in kubeadmconfig will be honored and will be set to the corresponding components.   |
| pack.podCIDR                              | `192.168.0.0/16` | CIDR range for the pod networking. This should match the networking layer property `calicoNetworkCIDR`. | CIDR range for Pods in cluster                                                                                                    |
| pack.serviceClusterIpRange                | `10.96.0.0/12`   | CIDR range for the services. This should not overlap with any IP ranges assigned to nodes for pods.     | CIDR range for Services in the Cluster                                                                                            |
| kubeadmconfig.apiServer.extraArgs         |                  |                                                                                                         | List of additional apiServer flags to be set                                                                                      |
| kubeadmconfig.apiServer.extraVolumes      |                  |                                                                                                         | List of additional volumes to be mounted on apiServer                                                                             |
| kubeadmconfig.controllerManager.extraArgs |                  |                                                                                                         | List of additional ControllerManager flags to be set                                                                              |
| kubeadmconfig.scheduler.extraArgs         |                  |                                                                                                         | List of additional Kube Scheduler flags to be set                                                                                 |
| kubeadmconfig.files                       |                  |                                                                                                         | List of additional files to be copied over to the nodes                                                                           |
| kubeadmconfig.preKubeadmCommands          |                  |                                                                                                         | List of additional commands to be executed **before** kubeadm commands are run                                                    |
| kubeadmconfig.postKubeadmCommands         |                  |                                                                                                         | List of additional commands to be executed **after** kubeadm commands are run                                                     |

## Example Kubeadm config

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
