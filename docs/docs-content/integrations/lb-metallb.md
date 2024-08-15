---
sidebar_label: "MetalLB"
title: "MetalLB"
description: "MetalLB Load Balancer pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["load balancers", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image.webp"
tags: ["packs", "metallb", "network"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="0.13.x" value="0.13.x">

## Configure IP Address Range

The _lb-metallb_ manifest-based pack supports direct configuration of an L2 IP address set. You can set either a range
of addresses or use CIDR format, such as `192.168.250.48/29`. A more advanced MetalLB configuration, such as Border
Gateway Protocol (BGP) routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

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

## Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, you must add the following labels to the MetalLB namespace.
These labels allow the speaker pods to come up successfully. Otherwise, depending on the Kubernetes version, the speaker
pods may get blocked by security policies.

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

Refer to the [Profile Customization](../profiles/profile-customization.md) page to learn more about additional namespace
labels and annotations.

## Troubleshooting

### Scenario - Controller and Speaker Pods Are Not Assigning New IP Addresses

If controller and speaker pods are not assigning new IP addresses that you provided in the MetalLB pack, it is likely
pods in existing deployments do not have the latest configMap file.

IP addresses you specify in MetalLB pack values go into a configMap called `config` in the `metallb-system` namespace.
The MetalLB controller and speakers use the configMap as a volume mount.

Any changed IP addresses will get updated in the configMap. You can confirm this by issuing the following command.

```bash
kubectl describe cm config --namespace metallb-system
```

Since the controller and speaker pods are using a previous copy of the configMap, existing deployments are unaware of
the changes made to configMap.

To ensure updated addresses are reflected in the configMap, you need to restart the controller and speaker pods so they
fetch the new configMap and start assigning new addresses correctly. Issue the commands below to restart the controller
and speaker.

```bash
kubectl rollout restart deploy controller --namespace metallb-system
kubectl rollout restart ds speaker --namespace metallb-system
```

</TabItem>

<TabItem label="0.11.x" value="0.11.x">

## Configure IP Address Range

The _lb-metallb_ manifest-based pack supports direct configuration of an L2 IP address set. You can set either a range
of addresses or use CIDR format, such as `192.168.250.48/29`. A more advanced MetalLB configuration, such as Border
Gateway Protocol (BGP) routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

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

## Troubleshooting

### Scenario - Controller and Speaker Pods Are Not Assigning New IP Addresses

If controller and speaker pods are not assigning new IP addresses that you provided in the MetalLB pack, it is likely
pods in existing deployments do not have the latest configMap file.

IP addresses you specify in MetalLB pack values go into a configMap called `config` in the `metallb-system` namespace.
The MetalLB controller and speakers use the configMap as a volume mount.

Any changed IP addresses will get updated in the configMap. You can confirm this by issuing the following command.

```bash
kubectl describe cm config --namespace metallb-system
```

Since the controller and speaker pods are using a previous copy of the configMap, existing deployments are unaware of
the changes made to configMap.

To ensure updated addresses are reflected in the configMap, you need to restart the controller and speaker pods so they
fetch the new configMap and start assigning new addresses correctly. Issue the commands below to restart the controller
and speaker.

```bash
kubectl rollout restart deploy controller --namespace metallb-system
kubectl rollout restart ds speaker --namespace metallb-system
```

</TabItem>
</Tabs>

## Terraform

You can reference the MetalLB pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "MetalLB" {
  name    = "lb-metallb"
  version = "0.13.5"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
