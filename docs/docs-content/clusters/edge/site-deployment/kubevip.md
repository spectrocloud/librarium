---
sidebar_label: "Publish Cluster Services with Kube-vip"
title: "Publish Cluster Services with Kube-vip"
description: "Guide to publishing cluster services with kube-vip."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

You can use kube-vip to provide a virtual IP address for your cluster and use it to expose a Service of type `LoadBalancer` on the external network.

kube-vip supports DHCP environments and can request additional IP address from the DHCP server automatically. Using kube-vip, you can expose services inside your cluster externally with a virtual IP address even if you do not have control over your host's network. kube-vip can also act as a load balancer for both your control plane and Kubernetes services of type `LoadBalancer`.

## Enablement

To leverage KubeVIP to expose a Service of type `LoadBalancer` on the external network, follow these steps:

1. In the YAML file for the Kubernetes layer of your cluster profile, add the following parameters:
   ```
   cluster:
    kubevipArgs:
      vip_interface: "ens32"
      svc_enable: true
      vip_servicesinterface: "eno1"
   ```
2. In the manifest for your load balancer service, add two parameters `loadBalancerIP: 0.0.0.0` and `loadBalancerClass: kube-vip.io/kube-vip-class` to the service spec:
   ```
   apiVersion: v1
   kind: Service
   metadata:
     name: http-app-svc
     namespace: myapp
   spec:
     loadBalancerIP: 0.0.0.0
     loadBalancerClass: kube-vip.io/kube-vip-class
     ports:
     - port: 80
       protocol: TCP
       targetPort: http
     selector:
       app.kubernetes.io/name: http-app
     type: LoadBalancer
   ```
This causes KubeVIP to create a `macvlan` interface on top of the interface defined by `vip_servicesinterface` and request a DHCP address for that new interface. It can then listen for traffic on that IP and forward it to the pod defined by the Service.

KubeVIP adds an annotation named `kube-vip.io/requestedIP` to the Service resource to document which IP address it has received from the DHCP server. Whenever KubeVIP restarts, it will attempt to re-request the same IP address for that Service from the DHCP server. You can remove the annotation to make KubeVIP request a fresh address.

## Validation

To validate that your 