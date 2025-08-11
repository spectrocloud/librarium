---
sidebar_label: "Publish Cluster Services with Kube-vip"
title: "Publish Cluster Services with Kube-vip"
description: "Guide to publishing cluster services with kube-vip."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

You can use kube-vip to provide a virtual IP address for your cluster and use it to expose a service of type
`LoadBalancer` on the external network. You can have kube-vip dynamically request IP addresses or use a static IP
address.

Kube-vip supports DHCP environments and can request additional IP address from the DHCP server automatically. Using
kube-vip, you can expose services inside your cluster externally with a virtual IP address even if you do not have
control over your host's network. Kube-vip can also act as a load balancer for both your control plane and Kubernetes
services of type `LoadBalancer`.

## Default Values

Kube-vip has many environment variables you can use to customize its behavior. To set values for kube-vip, use the
`cluster.kubevipArgs` parameter. For a complete list of environment variables, refer to the
[kube-vip documentation](https://kube-vip.io/docs/installation/flags/?query=vip_interface#environment-variables).

By default, Palette uses the following `cluster.kubevipArgs` values during initial cluster deployment. You can change
these values when deploying a cluster or performing Day-2 cluster operations.

| Environment Variable | Description                                                                                     | Default Value |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| `vip_arp`            | Enables ARP broadcasts from leader.                                                             | `true`        |
| `port`               | Specifies the port number that `kube-vip` will use.                                             | `6443`        |
| `vip_cidr`           | Sets the CIDR notation for the Virtual IP. A value of `32` denotes a single IP address in IPv4. | `32`          |
| `cp_enable`          | Enables kube-vip control plane functionality.                                                   | `true`        |
| `cp_namespace`       | The namespace where the lease will reside.                                                      | `kube-system` |
| `vip_ddns`           | Enables Dynamic DNS support.                                                                    | `{{ .DDNS}}`  |
| `vip_leaderelection` | Enables Kubernetes LeaderElection.                                                              | `true`        |
| `vip_leaseduration`  | Sets the lease duration in seconds.                                                             | `5`           |
| `vip_renewdeadline`  | Specifies the deadline in seconds for renewing the lease.                                       | `3`           |
| `vip_retryperiod`    | Number of times the leader holds the lease for.                                                 | `1`           |
| `address`            | Template placeholder for the virtual IP address.                                                | `{{ .VIP}}`   |

:::warning

Do not modify the default `address` value. Changing this value makes the cluster inaccessible. If no value is provided
for the `vip_ddns` variable, it defaults to `false` if the `address` is a valid IP address and `true` if it is a domain
name.

:::

## Prerequisites

- At least one Edge device with x86_64 or AMD64 processor architecture registered in your Palette account

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Clusters** and select **Add a New Cluster**.

3. Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

4. Give the cluster a name, description, and tags. Click on **Next**.

5. Select the cluster profile that you plan to use to deploy your cluster with. Click **Next**.

6. In the **Parameters** step, click on the Kubernetes layer of your profile. In the YAML file for the Kubernetes layer
   of your cluster profile, add the following parameters.

   ```yaml
   cluster:
     kubevipArgs:
       vip_interface: "INTERFACE_NAME"
       svc_enable: true
       vip_servicesinterface: "INTERFACE_NAME"
   ```

   These are kube-vip environment variables that enable kube-vip to provide load balancing services for Kubernetes
   services and specify which network interface will be used by kube-vip for handling traffic to the Kubernetes API
   server and Kubernetes services. The following table provides you guidance on how to choose the values for each
   parameter:

| **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vip_interface`        | Specifies the Network Interface Controller (NIC) that kube-vip will use for handling traffic to the Kubernetes API. If you do not specify `vip_serviceinterface`, kube-vip will also use this interface for handling traffic to LoadBalancer-type services.                                                                                                                                                                                                                                                                     |
| `svc_enable`           | Enables kube-vip to handle traffic for services of type LoadBalancer.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `vip_serviceinterface` | Specifies the NIC that kube-vip will use for handling traffic to LoadBalancer-type services. If your cluster has network overlay enabled, or if your host has multiple NICs and you want to publish services on a different NIC than the one used by Kubernetes, you should specify the name of the NIC as the value of this parameter. If this parameter is not specified and you have set `svc_enable` to `true`, kube-vip will use the NIC you specified in `vip_interface` to handle traffic to LoadBalancer-type services. |

8. Next, in layer of your cluster profile that has the service you want to expose, add two parameters
   `loadBalancerIP: IP_ADDRESS` and `loadBalancerClass: kube-vip.io/kube-vip-class` to the service spec. The following
   example manifest displays the usage of these two parameters.

If you are deploying in a DHCP environment, use `0.0.0.0` as the value for the `loadBalancerIP` parameter. If you want
kube-vip to use a static IP, specify the IP address and make sure it's unused by other hosts in the network. The
following example manifest displays the usage of these two parameters.

```yaml {7-8}
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

9. Click **Next** and finish the rest of the configurations. For more information, refer to
   [Create Cluster Definition](../site-deployment/cluster-deployment.md).

When the cluster finishes deploying, kube-vip adds an annotation named `kube-vip.io/requestedIP` to the Service resource
to document which IP address it has received from the external network. Whenever kube-vip restarts, it will attempt to
re-request the same IP address for that service. You can remove the annotation to make kube-vip request a fresh address
with the following command. Replace `SERVICE_NAME` with the name of your service, and make sure to include the minus
symbol`-` at the end of the annotation.

```shell
kubectl annotate service SERVICE_NAME kube-vip.io/requestedIP-
```

## Validation

Use the following steps to validate that kube-vip has been set up correctly and is performing load balancing services
for your cluster.

1. Access the cluster via kubectl CLI. For more information, refer to
   [Access Cluster with CLI](../../cluster-management/palette-webctl.md).
2. Issue the command `kubectl get service SERVICE_NAME` and replace `SERVICE_NAME` with the name of the service you
   configure with kube-vip. The output of the command displays the external IP address that kube-vip has received from
   the external network or the IP address you specified in the `loadBalancerIP` parameter.

```shell
kubectl get service http-app-svc
```

```hideClipboard
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
http-app-svc   LoadBalancer   10.100.200.10   10.10.1.100   80:30720/TCP   5m
```

In the above example, the external IP `10.10.1.100` is the IP address that kube-vip received from the DHCP server or the
IP address you specified in the `loadBalancerIP` parameter.
