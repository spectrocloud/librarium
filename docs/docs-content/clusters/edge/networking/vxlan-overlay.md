---
sidebar_label: "Enable Overlay Network"
title: "Enable Overlay Network"
description: "Learn how to enable a virtual overlay network you can control on top of an often unpredictable physical network."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Edge clusters are often deployed in locations where network environments are not managed by teams that maintain the edge deployments. However, a Kubernetes cluster, specifically several control plane components, require stable IP addresses. In the case of an extended network outage, it's possible that your cluster components would lose their original IP addresses when the cluster expects them to remain stable, causing the cluster to experience degraded performance or become non-operational.

Palette allows you to create a virtual overlay network on top of the physical network, and the virtual IP addresses of all cluster components are managed by Palette. Inside the cluster, the different components use the virtual IP addresses to communicate with each other instead of the underlying IP addresses that could change due to external factors. If the cluster experiences an outage with the overlay network enabled, components inside the cluster retain their virtual IP addresses in the overlay network, even if their IP addresses in the underlying physical network has changed, protecting the cluster from an outage. 

<br />

![VxLAN Overlay Architecture](/clusters_edge_site-installation_vxlan-overlay_architecture.png)

<br />

## When Should You Consider Enabling Overlay Network?
If your Edge clusters are deployed in network environments that fit the following descriptions, you should consider enabling an overlay network for your cluster:

- Network environments with dynamic IP address management, such as a DHCP network.
- Instable network environments or environments that are out of your control. For example, you are deploying an Edge host in a restaurant located in a commercial building, and the network 
- Environments where you expect your edge hosts to move from one physical location to another. 

### Example Scenario

The Analytics team of a manufacturing company is deploying an Edge host to their assembly line to collect metrics from the manufacturing process. The building in which the Edge host is deployed has a network that is managed by a DHCP server. The region experiences a bad weather event that causes a sustained outage. 

|Without Overlay Network |With Overlay Network|
|---------------------|-----------------------|
| Upon recovery, each Kubernetes component inside in the Edge host requests an IP address from the DHCP server, and receives a different IP address than their original IP address before the outage happened. Since Kubernetes expects several components in the control plane to have stable IP addresses, the cluster becomes non-operational and assembly line is unable to resume operations | Each Kubernetes component inside in the Edge host has a virtual IP address in the overlay network. Upon recovery, their IP addresses in the overlay network remain the same despite their IP addresses changing in the underlying DHCP network. The Edge host is able to assume its workload and the assembly line resumes operations | 

## Prerequisites

* At least one Edge host with AMD64/X86_64 processor architecture registered with your Palette account.
* All Edge hosts must be on the same network. You may provision your own virtual network to connect Edge hosts that are on different physical networks, but all Edge hosts to be included in the cluster must be on the same network before cluster creation.

## Enable Overlay Network

You can enable an overlay network for your cluster during cluster creation. You will not be able to change the network overlay configurations after the cluster has already been created.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on **Add New Cluster**.

4. Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

5. Give the cluster a name, description, and tags. Click on **Next**.

6. Select a cluster profile. If you don't have a cluster profile for Edge Native, refer to the [Create Edge Native Cluster Profile](../site-deployment/model-profile.md) guide. Click on **Next** after you have selected a cluster profile.

7. Review your cluster profile values and make changes as needed. Click on **Next**.

8. In the **Cluster Config** stage, toggle on **Enable Overlay Network**. This will prompt you to provide additional configuration for your virtual overlay network. 

9. In the **Internal CIDR Range** field, provide a private IP range for your cluster to use. Ensure that this range is not used by others in the same network environment. When you toggle on **Enable Overlay Network**, Palette provides with a default commonly unused range. We suggest you keep the default range unless you have a specific IP range you want to use. 

10. In **VIP** field near the top of the page, provide a virtual IP (VIP) address. This address must be within the same internal CIDR range that you provide for the cluster. 

    :::caution
    Neither the internal CIDR range nor the VIP address can be changed after the cluster creation. 
    :::

11. Finish the rest of the cluster configurations and click **Finish Configuration** to deploy the cluster. For more information, refer to [Create Cluster Definition](../site-deployment/site-installation/cluster-deployment.md). 

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Select the **Nodes** tab, in the **Overlay IP Address** column, each host has an overlay IP address within the CIDR range you provided during cluster configuration. 

:::tip
To view the external IP addresses of the edge hosts, from the **Main Menu**, go to **Clusters**, and click the **Edge Hosts** tab. The IP address displayed in the table is the external IP address.
:::

## Access Cluster with Overlay Network Enabled

You can access a cluster with overlay network enabled in the following ways:

- Access the cluster with kubectl CLI. For more information, refer to [Access Cluster with CLI](../../cluster-management/palette-webctl.md).
- Access LoadBalancer services. You can provision LoadBalancer services in your Kubernetes cluster and expose them to external traffic. 
- Access a node by IP address. You can use the node's external IP address to access the node directly. The overlay IP addresses are internal to the cluster itself and cannot be accessed from outside the cluster.

