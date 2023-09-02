---
sidebar_label: 'MetalLB'
title: 'MetalLB'
description: 'MetalLB Load Balancer pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['load balancers', 'amd64', 'arm64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image/png'
tags: ['packs', 'metallb', 'network']
---

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters, using standard routing protocols. This integration is recommended for the on-prem cloud(s) and will help external service(s) get an IP address when the service type is set as LoadBalancer.

## MetalLB Pack Working Details:

* The address set in pack values goes into a configMap **`config`** in **`metallb-system`** namespace. This configMap is used by the MetalLB controller and speakers as volume mounts.

* Any changes to the address will get updated in the configMap. Our users may confirm this with this command:

		kubectl describe cm config -n metallb-system.

* However, the controller and speaker pods are already running with a previous copy of the configMap and these deployments are not aware of the new changes made to configMap. To ensure the address change are reflected, we need to restart the controller and speaker pods so that they will fetch the new configMap and start assigning new addresses correctly.

* Run the following commands, which will help restart the controller and speaker:

		  kubectl rollout restart deploy controller -n metallb-system
		  kubectl rollout restart ds speaker -n metallb-system

## Versions Supported

<Tabs queryString="versions">

<TabItem label="0.13.x" value="0.13.x">

* **0.13.5**

</TabItem>

<TabItem label="0.11.x" value="0.11.x">

* **0.11.0**

</TabItem>

<TabItem label="0.9.x" value="0.9.x">

* **0.9.5**

</TabItem>
<TabItem label="0.8.x" value="0.8.x">

  * **0.8.3**

</TabItem>
</Tabs>

## Components

* MetalLB controller.
* Speaker (runs on all nodes, deployed as DaemonSet).

## References

- [MetalLB Home](https://metallb.universe.tf)

- [MetalLB GitHub](https://github.com/metallb/metallb)
