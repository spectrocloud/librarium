---
sidebar_label: "Namespaces and Pods"
title: "Palette Specific Namespaces and Pods"
description: "Palette specific namespaces and pods mapping"
icon: ""
hide_table_of_contents: false
sidebar_position: 50
---

The page encompasses the set of Palette specific namespaces and pods belonging to each of these individual namespaces.
The information is organised as follows:

- Namespace-Pod mapping for Palette Tenant Cluster
- Namespace-Pod mapping for Palette Gateways (PCG)
- Namespace-Pod mapping for Palette On-Prem Enterprise Cluster

## Palette Tenant Cluster NameSpaces with Pods

The following table gives the namespace to pod mapping for Palette Tenant Cluster.

| Palette Namespaces  | Pods                                                        |
| ------------------- | ----------------------------------------------------------- |
| capi-webhook-system | capi-controller-manager-<random-hash>                       |
|                     | capi-kubeadm-bootstrap-controller-manager-<random-hash>     |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash> |
| cert-manager        | cert-manager-<random-hash>                                  |
|                     | cert-manager-cainjector-<random-hash>                       |
|                     | cert-manager-webhook-<random-hash>                          |
| cluster-< UUID >    | capi-controller-manager-<random-hash>                       |
|                     | capi-kubeadm-bootstrap-controller-manager-<random-hash>     |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash> |
|                     | capv-controller-manager-<random-hash>                       |
|                     | cluster-management-agent-<random-hash>
|                     | cluster-management-agent-lite-<random-hash>
|                     | metrics-server-<random-hash>                                |
|                     | palette-controller-manager-<random-hash>                    |
|                     | palette-lite-controller-manager-<random-hash>               |
| kube-system         | calico-kube-controllers-<random-hash>                       |
|                     | calico-node-<random-hash>                                   |
|                     | coredns-<random-hash>                                       |
|                     | etcd-vmdynamictest-cp-<random-hash>                         |
|                     | kube-apiserver-vmdynamictest-cp-<random-hash>               |
|                     | kube-controller-manager-vmdynamictest-cp-<random-hash>      |
|                     | kube-proxy-<random-hash>                                    |
|                     | kube-scheduler-vmdynamictest-cp-<random-hash>               |
|                     | kube-vip-vmdynamictest-cp-<random-hash>                     |
| reach-system        | reach-controller-manager-<random-hash>                      |

## Palette PCG NameSpaces with Pods

The following table gives the namespace to pod mapping for Palette vSphere Gateway.

| Palette Namespaces  | Pods                                                        |
| ------------------- | ----------------------------------------------------------- |
| capi-webhook-system | capi-controller-manager-<random-hash>                       |
|                     | capi-kubeadm-bootstrap-controller-manager-<random-hash>     |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash> |
|                     | capv-controller-manager-<random-hash>                       |
| cert-manager        | cert-manager-<random-hash>                                  |
|                     | cert-manager-cainjector-<random-hash>                       |
|                     | cert-manager-webhook-<random-hash>                          |
| cluster-< UUID >    | capi-controller-manager-<random-hash>                       |
|                     | capi-kubeadm-bootstrap-controller-manager-<random-hash>     |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash> |
|                     | capv-controller-manager-<random-hash>                       |
|                     | capv-static-ip-controller-manager-<random-hash>             |
|                     | cluster-management-agent-<random-hash>                      |
|                     | cluster-management-agent-lite-<random-hash>                 |
|                     | ipam-controller-manager-<random-hash>                       |
|                     | palette-controller-manager-<random-hash>                    |
|                     | palette-lite-controller-manager-<random-hash>               |
| jet-system          | jet-<random-hash>                                           |
|                     | spectro-cloud-driver-<random-hash>                          |
| kube-system         | calico-kube-controllers-<random-hash>                       |
|                     | calico-node-<random-hash>                                   |
|                     | etcd-gateway1-cp-<random-hash>                              |
|                     | kube-apiserver-gateway1-cp-<random-hash>                    |
|                     | kube-controller-manager-gateway1-cp-<random-hash>           |
|                     | kube-proxy-<random-hash>                                    |
|                     | kube-scheduler-gateway1-cp-<random-hash>                    |
|                     | kube-vip-gateway1-cp-<random-hash>                          |
|                     | vsphere-cloud-controller-manager-<random-hash>              |
|                     | vsphere-csi-controller-<random-hash>                        |
|                     | vsphere-csi-node-<random-hash>                              |
| reach-system        | reach-controller-manager-<random-hash>                      |

## Enterprise NameSpaces with Pods

The following table gives the namespace to pod mapping for Palette On-Prem Enterprise Clusters.

| Palette Namespaces  | Pods                                                          |
| ------------------- | ------------------------------------------------------------- |
| capi-webhook-system | capi-controller-manager-<random-hash>                         |
|                     | capi-kubeadm-bootstrap-controller-manager-<random-hash>       |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash>   |
|                     | capv-controller-manager-<random-hash>                         |
|                     | ipam-controller-manager-<random-hash>                         |
| cert-manager        | cert-manager-<random-hash>                                    |
|                     | cert-manager-cainjector-<random-hash>                         |
|                     | cert-manager-webhook-<random-hash>                            |
| cluster-< UUID >    | capi-kubeadm-bootstrap-controller-manager-<random-hash>       |
|                     | capi-kubeadm-control-plane-controller-manager-<random-hash>   |
|                     | capv-controller-manager-<random-hash>                         |
|                     | capv-static-ip-controller-manager-<random-hash>               |
|                     | cluster-management-agent-<random-hash>                        |
|                     | cluster-management-agent-lite-<random-hash>                   |
|                     | ipam-controller-manager-<random-hash>                         |
|                     | metrics-server-<random-hash>                                  |
|                     | palette-controller-manager-<random-hash>                      |
|                     | palette-lite-controller-manager-<random-hash>                 |
| cp-system           | spectro-cp-ui-<random-hash>                                   |
| hubble-system       | auth-<random-hash>                                            |
|                     | cloud-<random-hash>                                           |
|                     | configserver-<random-hash>                                    |
|                     | event-<random-hash>                                           |
|                     | hashboard-<random-hash>                                       |
|                     | hutil-<random-hash>                                           |
|                     | mgmt-<random-hash>                                            |
|                     | mongo-0                                                       |
|                     | mongo-1                                                       |
|                     | mongo-2                                                       |
|                     | packsync-1                                                    |
|                     | spectrocluster-<random-hash>                                  |
|                     | system-<random-hash>                                          |
|                     | timeseries-<random-hash>                                      |
|                     | user-<random-hash>                                            |
| ingress-nginx       | ingress-nginx-admission-create-spwch-<random-hash>            |
|                     | ingress-nginx-admission-patch-<random-hash>                   |
|                     | ingress-nginx-controller-<random-hash>                        |
| jet-system          | jet-<random-hash>                                             |
| kube-system         | calico-kube-controllers-<random-hash>                         |
|                     | calico-node-<random-hash>                                     |
|                     | calico-node-<random-hash>                                     |
|                     | coredns-<random-hash>                                         |
|                     | etcd-vsphere-spectro-mgmt-cp-<random-hash>                    |
|                     | kube-apiserver-vsphere-spectro-mgmt-cp-<random-hash>          |
|                     | kube-controller-manager-vsphere-spectro-mgmt-cp-<random-hash> |
|                     | kube-proxy-bl-<random-hash>                                   |
|                     | kube-proxy-l-<random-hash>                                    |
|                     | kube-scheduler-vsphere-spectro-mgmt-cp-<random-hash>          |
|                     | kube-vip-vsphere-spectro-mgmt-cp-<random-hash>                |
|                     | vsphere-cloud-controller-manager-<random-hash>                |
|                     | vsphere-csi-controller-df-<random-hash>                       |
|                     | vsphere-csi-node-<random-hash>                                |
|                     | vsphere-csi-node-rhm-<random-hash>                            |
| ui-system           | spectro-ui-<random-hash>                                      |
