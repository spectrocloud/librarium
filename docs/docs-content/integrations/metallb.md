---
sidebar_label: "MetalLB"
title: "MetalLB"
description: "MetalLB Load Balancer pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["load balancers", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image/png"
tags: ["packs", "metallb", "network"]
---

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters that uses
standard routing protocols. This integration is recommended for self-hosted clouds and helps external services obtain an
IP address when the service type is set to LoadBalancer.

MetalLB deploys a controller and a speaker. The speaker is deployed as a DaemonSet on all nodes.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="0.13.x" value="0.13.x">

## Prerequisites

- A Kubernetes cluster with Kubernetes version 1.13.0 or later that does not already have network load-balancing
  functionality.

- A cluster network configuration that does not conflict with MetalLB. For more information, refer to the official
  Kubernetes [Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking) documentation

- Ensure sufficient IPv4 addresses for MetalLB are available for the number of services in each cluster.

- When using the Border Gateway Protocol (BGP), one or more BGP-capable routers are required.

- When using the Layer 2 (L2) operating mode, Transmission Control Protocol (TCP) and User Datagram Protocol (UDP)
  traffic on port 7946 must be allowed between nodes, as required by the
  [HashiCorp memberlist](https://github.com/hashicorp/memberlist). You can configure other port as needed.

## Parameters

The `addresses` parameter applies to the manifest-based MetalLB pack. You can provide multiple entries, but usually only
one is needed.

| **Parameter** | **Description**                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `addresses`   | This can be a range of addresses or a CIDR address. Examples:<br />192.168.250.48-192.168.250.55<br />192.168.250.0/24 |

## Usage

The _lb-metallb_ manifest-based pack supports direct configuration of an L2 IP address set. The _lb-metallb-helm_
Helm-based pack provides an L2 address pool.

<br />

### Manifest

Manifest-based MetalLB supports direct configuration of an L2 IP address set. You can set either a range of addresses or
use CIDR format, such as `192.168.250.48/29`. A more advanced MetalLB configuration, such as Border Gateway Protocol
(BGP) routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

<br />

```yaml
manifests:
  metallb:
    images:
      controller: ""
      speaker: ""
    namespace: "metallb-system"
    avoidBuggyIps: true
    addresses:
      - 192.168.250.48-192.168.250.55
```

<br />

### Helm Chart

Helm-based MetalLB default gives you an L2 address pool by default. It has two sections,
`charts:metallb-full:configuration` and `charts:metallb-full:metallb`, as shown in the following examples.

Use the `charts:metallb-full:configuration` parameter section to set resource types that MetalLB supports. The pack
default gives you an L2 address pool. To set up a more advanced scenario, you can use the other resource types provided
in the pack. The pack includes a commented-out example for each resource.

<br />

```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0/24
            avoidBuggyIPs: true
            autoAssign: true

      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool

      bgpadvertisements: {}
      bgppeers: {}
      communities: {}
      bfdprofiles: {}
```

<br />

The `charts:metallb-full:metallb` parameter section provides access to all the options of the base chart that installs
MetalLB. You don’t need to change anything unless you want to install MetalLB in Free Range Routing (FRR) mode. To use
FRR mode, set the option to `true`, as the example shows.

<br />

```yaml
charts:
  metallb-full:
    metallb:
      speaker:
        frr:
          enabled: true
```

### Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, the following labels must be added to the MetalLB namespace.
These labels allow the speaker pods come up successfully. Otherwise, depending on the Kubernetes version, the speaker
pods may get blocked by securty policies.

- `pod-security.kubernetes.io/enforce: privileged`
- `pod-security.kubernetes.io/audit: privileged`
- `pod-security.kubernetes.io/warn: privileged`

The following example shows how to update the pack YAML with the required labels.

```yaml {13-15}
pack:
  content:
    images:
      - image: gcr.io/spectro-images-public/packs/metallb/0.13.11/controller:v0.13.11
      - image: gcr.io/spectro-images-public/packs/metallb/0.13.11/speaker:v0.13.11
      - image: gcr.io/spectro-images-public/packs/metallb/0.13.11/frr:8.5.2
    charts:
      - repo: https://metallb.github.io/metallb
        name: metallb
        version: 0.13.11
  namespace: metallb-system
  namespaceLabels:
    "metallb-system":
      "pod-security.kubernetes.io/warn=privileged,pod-security.kubernetes.io/audit=privileged,pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v{{
      .spectro.system.kubernetes.version | substr 0 4 }}"
```

Refer to the [Profile Customization](../profiles/profile-customization.md) page to learn more about additonal namespace
labels and annotations.

</TabItem>

<TabItem label="0.11.x" value="0.11.x">

## Prerequisites

- A Kubernetes cluster with Kubernetes version 1.13.0 or later that does not already have network load-balancing
  functionality.

- A cluster network configuration that does not conflict with MetalLB. For more information, refer to the official
  Kubernetes [Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking) documentation.

- Ensure sufficient IPv4 addresses for MetalLB are available for the number of services in each cluster.

- When using the Border Gateway Protocol (BGP), one or more BGP-capable routers are required.

- When using the L2 operating mode, Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) traffic on port
  7946 must be allowed between nodes, as required by the
  [HashiCorp memberlist](https://github.com/hashicorp/memberlist). You can configure other port as needed.

## Parameters

The `addresses` parameter applies to the manifest-based MetalLB pack. You can provide multiple entries but only one is
typically needed.

| **Parameter** | **Description**                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `addresses`   | This can be a range of addresses or a CIDR address. Examples:<br />192.168.250.48-192.168.250.55<br />192.168.250.0/24 |

## Usage

The _lb-metallb_ manifest-based pack supports direct configuration of an L2 IP address set. You can set either a range
of addresses or use CIDR format, such as `192.168.250.48/29`. A more advanced MetalLB configuration, such as Border
Gateway Protocol (BGP) routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

<br />

```yaml
manifests:
  metallb:
    images:
      controller: ""
      speaker: ""
    namespace: "metallb-system"
    avoidBuggyIps: true
    addresses:
      - 192.168.250.48-192.168.250.55
```

</TabItem>

<TabItem label="Deprecated" value="Deprecated">

:::warning

All versions of the manifest-based pack less than v0.9.x are considered deprecated. Upgrade to a newer version to take
advantage of new features.

:::

</TabItem>
</Tabs>

<br />

## Troubleshooting

If controller and speaker pods are not assigning new IP addresses that you provided in the MetalLB pack, it is likely
pods in existing deployments do not have the latest configMap file.

IP addresses you specify in MetalLB pack values go into a configMap called `config` in the `metallb-system` namespace.
The MetalLB controller and speakers use the configMap as a volume mount.

Any changed IP addresses will get updated in the configMap. You can confirm this by issuing the following command.

<br />

```bash
kubectl describe cm config --namespace metallb-system
```

<br />
Since the controller and speaker pods are using a previous copy of the configMap, existing deployments are unaware of the
changes made to configMap.

<br />
<br />

To ensure updated addresses are reflected in the configMap, you need to restart the controller and speaker pods so they
fetch the new configMap and start assigning new addresses correctly. Issue the commands below to restart the controller
and speaker.

<br />

```bash
kubectl rollout restart deploy controller --namespace metallb-system
kubectl rollout restart ds speaker --namespace metallb-system
```

<br />

## Terraform

```hcl
data "spectrocloud_pack" "MetalLB" {
     name    = "lb-metallb"
     version = "0.13.5"
}
data "spectrocloud_pack" "MetalLB-Helm" {
     name    = "lb-metallb-helm"
     version = "0.13.7"
}
```

<br />

## References

- [MetalLB](https://metallb.universe.tf/)

- [MetalLB GitHub ](https://github.com/metallb/metallb)
