---
sidebar_label: "Publish Cluster Services with Kube-vip"
title: "Publish Cluster Services with Kube-vip"
description: "Guide to publishing cluster services with kube-vip."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

You can use kube-vip to provide a virtual IP address for your cluster and use it to expose a Service of type `LoadBalancer` on the external network.

Kube-vip supports DHCP environments and can request additional IP address from the DHCP server automatically. Using kube-vip, you can expose services inside your cluster externally with a virtual IP address even if you do not have control over your host's network. Kube-vip can also act as a load balancer for both your control plane and Kubernetes services of type `LoadBalancer`.

## Prerequisites

- At least one Edge device with x86_64/AMD64 processor architecture registered in your Palette account 

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Clusters > Add a New Cluster**.

4. Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

5. Give the cluster a name, description, and tags. Click on **Next**.

6. Select the cluster profile that you plan to use to deploy your cluster and publish services with and click **Next**.  

7. In the **Parameters** step, click on the Kubernetes layer of your profile. In the YAML file for the Kubernetes layer of your cluster profile, add the following parameters:
   ```
   cluster:
    kubevipArgs:
      vip_interface: "ens32"
      svc_enable: true
      vip_servicesinterface: "eno1"
   ```
   These are kube-vip environment variables that enable kube-vip to provide load balancing services for Kubernetes services and specify which network interface will be used by kube-vip for handling traffic to the Kubernetes API server and Kubernetes services.    

8. Next, in layer of your cluster profile that has the service you want to expose, add two parameters `loadBalancerIP: 0.0.0.0` and `loadBalancerClass: kube-vip.io/kube-vip-class` to the service spec:
   ```
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: hello-universe-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: hello-universe
      template:
        metadata:
          labels:
            app: hello-universe
        spec:
          loadBalancerIP: 0.0.0.0
          loadBalancerClass: kube-vip.io/kube-vip-class
          containers:
          - name: hello-universe  
            image: ghcr.io/spectrocloud/hello-universe:1.0.12 
            imagePullPolicy: IfNotPresent
            ports:
            - containerPort: 8080
   ```

9. Click **Next** and finish the rest of the configurations. For more information, refer to [Create Cluster Definition](./site-installation/cluster-deployment.md).


When the cluster finished deploying, KubeVIP adds an annotation named `kube-vip.io/requestedIP` to the Service resource to document which IP address it has received from the external network. Whenever kube-vip restarts, it will attempt to re-request the same IP address for that service. You can remove the annotation to make kube-vip request a fresh address.

## Validation

To validate that kube-vip has been set up correctly and is performing load balancing services for your cluster:

1. Access the cluster via kubectl CLI. For more information, refer to [Access Cluster with CLI](../../cluster-management/palette-webctl.md). 
2. Issue the command `kubectl get service SERVICE_NAME` and replace `SERVICE_NAME` with the name of the service you configure with kube-vip. The output of the command displays the external IP address that kube-vip has received from the external network.

## Limitations

Kube-vip has many environment variables you can use to customize its behavior. You can specify values for the environment variables with the `cluster.kubeArgs` parameter. For a complete list of environment variables in kube-vip, refer to [kube-vip documentation](https://kube-vip.io/docs/installation/flags/?query=vip_interface#environment-variables).
However, Palette has configured values for the following parameters and they cannot be changed:

| Environment Variable | Description | Example Value |
|----------------------|-------------|---------------|
| `vip_arp`            | Enables ARP broadcasts from leader. | `"true"` |
| `port`               | Specifies the port number that `kube-vip` will use.| `"6443"` |
| `vip_cidr`           | Sets the CIDR notation for the Virtual IP. A value of `32` denotes a single IP address in IPv4. | `"32"` |
| `cp_enable`          | Enables kube-vip control plane functionality. | `"true"` |
| `cp_namespace`       | The namespace where the lease will reside. | `"kube-system"` |
| `vip_ddns`           | Enables Dynamic DNS support. | `"{{ .DDNS}}"` |
| `vip_leaderelection` | Enables Kubernetes LeaderElection. | `"true"` |
| `vip_leaseduration`  | Sets the lease duration in seconds. | `"30"` |
| `vip_renewdeadline`  | Specifies the deadline in seconds for renewing the lease. | `"20"` |
| `vip_retryperiod`    | Number of times the leader will hold the lease for. | `"4"` |
| `address`            | Template placeholder for the virtual IP address.  | `"{{ .VIP}}"` |


