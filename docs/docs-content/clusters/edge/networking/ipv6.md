---
sidebar_label: "Deploy an IPv6 Edge Cluster"
title: "Deploy an IPv6 Edge Cluster"
description: "Learn how to deploy a Palette Edge cluster that uses IPv6-only or dual-stack networking."
hide_table_of_contents: false
sidebar_position: 40
tags: ["edge", "ipv6"]
---

<!--
PE-10279. This page assumes that the engineering work for Edge IPv6 support (PEM-12742) ships before the page is
published. Resolve each item, and then remove this comment.

VERIFY 1. OVN-Kubernetes: add it to the supported CNIs once the Edge team finishes verifying it.
VERIFY 2. Dual-stack CIDR order: the instruction to list first the range that matches the IP family of the VIP is
          inferred from the PEM-12742 test notes. Confirm it.
VERIFY 3. Hardened images: the PEM-12742 test notes say that the CIS hardening profile disables router advertisements,
          so SLAAC does not work under it. The Edge team is reviewing whether this belongs in the limitations.
-->

Palette Edge supports IPv6-only clusters and dual-stack clusters. In an IPv6-only cluster, the nodes, pods, and services
use IPv6 addresses. In a dual-stack cluster, they use both IPv4 and IPv6 addresses. In both cases, the cluster has a
single Virtual IP (VIP) address.

This guide explains how to configure a cluster profile for IPv6, check your Edge hosts, and create and validate the
cluster.

## Limitations

- IPv6 is supported for centrally managed Edge clusters only. Locally managed clusters that you
  [create with Local UI](../local-ui/cluster-management/create-cluster.md) are not supported.

- IPv6 is not supported for Edge hosts in [agent mode](../../../deployment-modes/agent-mode/agent-mode.md) or for
  airgapped Edge hosts.

- IPv6 is supported with Palette eXtended Kubernetes Edge (PXK-E) only. Canonical Kubernetes, K3s, and RKE2 are not
  supported.

- IPv6 is supported with the Cilium Container Network Interface (CNI) only.

- All Edge hosts in a cluster must use the same IP address families. You cannot combine Edge hosts that use only IPv4
  addresses with Edge hosts that use IPv6 addresses in one cluster.

- A cluster has one VIP, which is an IPv4 address, an IPv6 address, or a Fully Qualified Domain Name (FQDN). You cannot
  assign both an IPv4 VIP and an IPv6 VIP to the same cluster, including a dual-stack cluster.

- Edge hosts must receive their IPv6 addresses through Dynamic Host Configuration Protocol (DHCP) or Stateless Address
  Autoconfiguration (SLAAC). Static IPv6 addresses on Edge hosts are not supported.

- Overlay networks are not supported with IPv6. Refer to [Enable Overlay Network](./vxlan-overlay.md) for more
  information about overlay networks.

- IPv6 is not validated with single-node Edge clusters. Use a multi-node cluster.

- [Two-node](../architecture/two-node.md) high availability clusters are not supported with IPv6.

- IPv6 is not validated with [Trusted Boot](../trusted-boot/trusted-boot.md).

## Prerequisites

- Palette version 4.10.47 or later. Every Edge host must use the Palette agent version that corresponds to Palette
  4.10.47, or a later version. Refer to the
  [Edge Compatibility Matrix](../edge-compatibility-matrix.md#compatibility-matrix) to identify the Palette agent
  version, which the matrix lists as the Edge host version.

<!-- prettier-ignore-start -->

- A cluster profile for Edge that contains the following packs. Refer to
  [Model Edge Native Cluster Profile](../site-deployment/model-profile.md) for guidance.

  - <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" />

  - <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss" />

<!-- prettier-ignore-end -->

- Two or more Edge hosts that are deployed in
  [appliance mode](../../../deployment-modes/appliance-mode/appliance-mode.md) and registered with Palette. Refer to
  [Register Edge Host](../site-deployment/site-installation/edge-host-registration.md) for guidance.

- An IPv6 address on each Edge host that the host received through DHCP or SLAAC. For a dual-stack cluster, each Edge
  host also needs an IPv4 address.

- IPv6 forwarding enabled on every Edge host. Appliance mode enables IPv6 forwarding. A Security Technical
  Implementation Guide (STIG) remediation can disable it. If you use a STIG-hardened image, enable IPv6 forwarding after
  the remediation.

- If your Edge hosts connect through a proxy server, use bracketed IPv6 addresses in the proxy settings, for example,
  `http://[fd00::1]:3128`, and add your IPv6 CIDR ranges to `stylus.site.network.noProxy`. Refer to
  [Edge Installer Configuration Reference](../edge-configuration/installer-reference.md) for guidance.

- One unused IP address in the network of your Edge hosts for the VIP of the cluster. An IPv6-only cluster requires an
  IPv6 address.

- Two IPv6 Classless Inter-Domain Routing (CIDR) ranges that do not overlap with your network, one for pods and one for
  services. A dual-stack cluster also needs two IPv4 CIDR ranges.

- Access to a terminal session on each Edge host.

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed to validate the cluster.

## Configure the Cluster Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**, and then select your Edge cluster profile.

3. Select the **Kubernetes** layer of the cluster profile.

4. Use the YAML editor to set the pod CIDR and the service CIDR under `cluster.config.clusterConfiguration.networking`.

   <Tabs groupId="ip-family">

   <TabItem label="IPv6-Only" value="ipv6-only">

   ```yaml
   cluster:
     config: |
       clusterConfiguration:
         networking:
           podSubnet: <ipv6-pod-cidr>
           serviceSubnet: <ipv6-service-cidr>
   ```

   Replace `<ipv6-pod-cidr>` with the IPv6 CIDR range for pods, such as `fd00:10:244::/56`, and `<ipv6-service-cidr>`
   with the IPv6 CIDR range for services, such as `fd00:10:96::/112`.

   </TabItem>

   <TabItem label="Dual-Stack" value="dual-stack">

   In each pair, list first the CIDR range that matches the IP family of the VIP. The following example is for an IPv4
   VIP. For an IPv6 VIP, reverse the order of each pair.

   ```yaml
   cluster:
     config: |
       clusterConfiguration:
         networking:
           podSubnet: <ipv4-pod-cidr>,<ipv6-pod-cidr>
           serviceSubnet: <ipv4-service-cidr>,<ipv6-service-cidr>
   ```

   Replace `<ipv4-pod-cidr>` and `<ipv6-pod-cidr>` with the CIDR ranges for pods, such as `10.244.0.0/16` and
   `fd00:10:244::/56`. Replace `<ipv4-service-cidr>` and `<ipv6-service-cidr>` with the CIDR ranges for services, such
   as `10.96.0.0/16` and `fd00:10:96::/112`.

   </TabItem>

   </Tabs>

5. Under `cluster.kubevipArgs`, set `vip_arp` to `true`.

   ```yaml
   cluster:
     kubevipArgs:
       vip_arp: true
   ```

6. Select **Confirm Updates**.

7. Select the **Network** layer of the cluster profile, and confirm that it contains the Cilium pack. Keep the default
   values of the pack.

<!-- prettier-ignore-start -->

8. _(Optional)_ If your cluster profile contains the
   <VersionedLink text="MetalLB" url="/integrations/packs/?pack=lb-metallb-helm" /> pack, add an IPv6 address pool to
   the pack values.

<!-- prettier-ignore-end -->

9. Select **Save Changes**.

## Check the Edge Hosts

Complete the following steps on each Edge host that you plan to add to the cluster.

1. Open a terminal session on the Edge host.

2. List the IPv6 addresses of the host, and confirm that the Network Interface Card (NIC) that the cluster uses has an
   IPv6 address from DHCP or SLAAC.

   ```shell
   ip -family inet6 address show
   ```

3. Confirm that IPv6 forwarding is enabled. Both values must be `1`.

   ```shell
   sysctl net.ipv6.conf.all.forwarding net.ipv6.conf.default.forwarding
   ```

   ```shell hideClipboard title="Example Output"
   net.ipv6.conf.all.forwarding = 1
   net.ipv6.conf.default.forwarding = 1
   ```

## Create the Cluster

1. Follow the steps in
   [Create an Edge Native Host Cluster](../site-deployment/cluster-deployment.md#create-an-edge-native-host-cluster),
   and use the following settings for IPv6.

   | **Setting**        | **Value**                                                                                                                                         |
   | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Cluster profile    | The cluster profile that you configured in [Configure the Cluster Profile](#configure-the-cluster-profile).                                       |
   | **VIP**            | One IP address. An IPv6-only cluster requires an IPv6 address. Enter an IPv6 address without brackets, for example, `fd00:150::100`.              |
   | **Enable overlay** | Leave this setting disabled.                                                                                                                      |
   | Edge hosts         | Add only Edge hosts whose IP address families match the cluster. If an Edge host has more than one NIC, select the NIC that has the IPv6 address. |

2. Wait until the **Cluster Status** field displays **Running**.

## Validate

Use the following steps to confirm that the cluster uses IPv6. The `kubectl` steps require access to the cluster. Refer
to [Kubectl](../../cluster-management/palette-webctl.md) to obtain the kubeconfig file, and then set the `KUBECONFIG`
environment variable.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file of the cluster.

1. List the nodes. In an IPv6-only cluster, the `INTERNAL-IP` column displays an IPv6 address for each node. In a
   dual-stack cluster, the column displays one address for each node.

   ```shell
   kubectl get nodes --output wide
   ```

2. _(Dual-stack clusters only)_ List all addresses of each node, and confirm that each node has an IPv4 address and an
   IPv6 address.

   ```shell
   kubectl get nodes --output jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.addresses[?(@.type=="InternalIP")].address}{"\n"}{end}'
   ```

3. Review the `kubernetes` service. In an IPv6-only cluster, the `CLUSTER-IP` column displays an IPv6 address. In a
   dual-stack cluster, the column displays an address from the first service CIDR range.

   ```shell
   kubectl get service kubernetes
   ```

4. List the pods. In an IPv6-only cluster, the `IP` column displays IPv6 addresses. In a dual-stack cluster, the column
   displays the address from the first pod CIDR range only.

   ```shell
   kubectl get pods --all-namespaces --output wide
   ```

5. Confirm that the kube-vip pods and the Cilium pods are in the **Running** state.

   ```shell
   kubectl get pods --namespace kube-system
   ```

6. Confirm that the Kubernetes API server answers on the VIP. The command returns `ok`.

   ```shell
   curl --insecure "https://[<vip-address>]:6443/healthz"
   ```

   Replace `<vip-address>` with the VIP of the cluster. Keep the brackets around an IPv6 address, and remove them for an
   IPv4 address.

7. Check the status of Cilium.

   ```shell
   cilium status
   ```

## Next Steps

To expose cluster services of type `LoadBalancer` through kube-vip, refer to
[Publish Cluster Services with Kube-vip](./kubevip.md).
