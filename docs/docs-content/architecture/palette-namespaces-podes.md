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

| PALETTE NAMESPACES  | PODS                                                   |
| ------------------- | ------------------------------------------------------ |
| capi-webhook-system | capi-controller-manager-< UUID>                        |
|                     | capi-kubeadm-bootstrap-controller-manager-< UUID >     |
|                     | capi-kubeadm-control-plane-controller-manager-< UUID > |
| cert-manager        | cert-manager-< UUID >                                  |
|                     | cert-manager-cainjector-< UUID>                        |
|                     | cert-manager-webhook-< UUID >                          |
| cluster-< UUID >    | capi-controller-manager-< UUID >                       |
|                     | capi-kubeadm-bootstrap-controller-manager-< UUID >     |
|                     | capi-kubeadm-control-plane-controller-manager-< UUID > |
|                     | capv-controller-manager-< UUID >                       |
|                     | cluster-management-agent-< UUID >                      |
| cluster-< UUID >    | metrics-server-< UUID >                                |
|                     | palette-controller-manager-< UUID >                    |
| kube-system         | calico-kube-controllers-< UUID >                       |
|                     | calico-node-< UUID >                                   |
|                     | coredns-< UUID >                                       |
|                     | etcd-vmdynamictest-cp-< UUID >                         |
|                     | kube-apiserver-vmdynamictest-cp-< UUID >               |
|                     | kube-controller-manager-vmdynamictest-cp-< UUID >      |
|                     | kube-proxy-< UUID >                                    |
|                     | kube-scheduler-vmdynamictest-cp-< UUID >               |
|                     | kube-vip-vmdynamictest-cp-< UUID >                     |
| reach-system        | reach-controller-manager-< UUID >                      |

## Palette PCG NameSpaces with Pods

The following table gives the namespace to pod mapping for Palette vSphere Gateway.

| PALETTE NAMESPACES  | PODS                                                   |
| ------------------- | ------------------------------------------------------ | ----------------------- | ---------------- | --- | --- | --- | --- | ---------------- |
| capi-webhook-system | capi-controller-manager-< UUID >                       |
|                     | capi-kubeadm-bootstrap-controller-manager-< UUID >     |
|                     | capi-kubeadm-control-plane-controller-manager-< UUID > |
|                     | capv-controller-manager-< UUID >                       |
| cert-manager        | cert-manager-< UUID >                                  |
|                     | cert-manager-cainjector-< UUID >                       |
|                     | cert-manager-webhook-< UUID >                          |                         |
| cluster-< UUID >    | capi-controller-manager-< UUID >                       |
|                     | capi-kubeadm-bootstrap-controller-manager-< UUID >     |
|                     | capi-kubeadm-control-plane-controller-manager-< UUID > |
|                     | capv-controller-manager-< UUID >                       |
|                     | capv-static-ip-controller-manager-< UUID >             |
|                     | cluster-management-agent-< UUID >                      |
|                     | ipam-controller-manager-< UUID >                       | metrics-server-< UUID > |
|                     | palette-controller-manager-< UUID >                    |
| jet-system          | jet-< UUID >                                           |
|                     | spectro-cloud-driver-< UUID >                          |
| kube-system         | calico-kube-controllers-< UUID >                       |
|                     | calico-node-< UUID >                                   |                         | coredns-< UUID > |     |     |     |     | coredns-< UUID > |
|                     | etcd-gateway1-cp-< UUID >                              |
|                     | kube-apiserver-gateway1-cp-< UUID >                    |
|                     | kube-controller-manager-gateway1-cp-< UUID >           |                         |
|                     | kube-proxy-< UUID >                                    |                         |
|                     | kube-scheduler-gateway1-cp-< UUID >                    |                         |
|                     | kube-vip-gateway1-cp-< UUID                            | >                       |
|                     | vsphere-cloud-controller-manager-< UUID >              |                         |
|                     | vsphere-csi-controller-< UUID >                        |                         |
|                     | vsphere-csi-node-< UUID >                              |                         |
| reach-system        | reach-controller-manager-< UUID >                      |

## Enterprise NameSpaces with Pods

The following table gives the namespace to pod mapping for Palette On-Prem Enterprise Clusters.

| PALETTE NAMESPACES    | PODES                                                    |
| --------------------- | -------------------------------------------------------- | ------------- |
| capi-webhook-system   | capi-controller-manager-< UUID >                         |
|                       | capi-kubeadm-bootstrap-controller-manager-< UUID >       |
|                       | capi-kubeadm-control-plane-controller-manager-< UUID >   |
|                       | capv-controller-manager-< UUID >                         |
|                       | ipam-controller-manager-< UUID >                         |
| cert-manager          | cert-manager-< UUID >                                    |
|                       | cert-manager-cainjector-< UUID >                         |
|                       | cert-manager-webhook-< UUID >                            |
| cluster-mgmt-< UUID > | capi-kubeadm-bootstrap-controller-manager-< UUID >       |
|                       | capi-kubeadm-control-plane-controller-manager-< UUID >   |
|                       | capv-controller-manager-< UUID >                         |
|                       | capv-static-ip-controller-manager-9< UUID >              |
|                       | cluster-management-agent-< UUID >                        |
|                       | ipam-controller-manager-< UUID >                         |
|                       | metrics-server-< UUID >                                  |
|                       | palette-controller-manager-< UUID >                      |
| cp-system             | spectro-cp-ui-< UUID >                                   |
| hubble-system         | auth-< UUID >                                            | auth-< UUID > |
|                       | cloud-fb8< UUID >                                        |
|                       | configserver-< UUID >                                    |
|                       | event-< UUID >                                           |
|                       | hashboard-< UUID >                                       |
|                       | hutil-< UUID >                                           |
|                       | mgmt-< UUID >                                            |
|                       | mongo-0                                                  |
|                       | mongo-1                                                  |
|                       | mongo-2                                                  |
|                       | packsync-1< UUID >                                       |
|                       | spectrocluster-< UUID >                                  |
|                       | system-< UUID >                                          |
|                       | timeseries-< UUID >                                      |
|                       | user-< UUID >                                            |
| ingress-nginx         | ingress-nginx-admission-create-spwch                     |
|                       | ingress-nginx-admission-patch-< UUID >                   |
|                       | ingress-nginx-controller-< UUID >                        |
| jet-system            | jet-< UUID >                                             |
| kube-system           | calico-kube-controllers-< UUID >                         |
|                       | calico-node-< UUID >                                     |
|                       | calico-node-w< UUID >                                    |
|                       | coredns-< UUID >                                         |
|                       | etcd-vsphere-spectro-mgmt-cp-< UUID >                    |
|                       | kube-apiserver-vsphere-spectro-mgmt-cp-< UUID >          |
|                       | kube-controller-manager-vsphere-spectro-mgmt-cp-< UUID > |
|                       | kube-proxy-bl< UUID >                                    |
|                       | kube-proxy-l< UUID >                                     |
|                       | kube-scheduler-vsphere-spectro-mgmt-cp-< UUID >          |
|                       | kube-vip-vsphere-spectro-mgmt-cp-< UUID >                |
|                       | vsphere-cloud-controller-manager-< UUID >                |
|                       | vsphere-csi-controller-df< UUID >                        |
|                       | vsphere-csi-node-< UUID >                                |
|                       | vsphere-csi-node-rhm< UUID >                             |
| nats-system           | nas-< UUID >                                             |
| ui-system             | spectro-ui-< UUID >                                      |
