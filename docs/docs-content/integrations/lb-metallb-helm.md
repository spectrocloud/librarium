---
sidebar_label: "MetalLB Helm"
title: "MetalLB Helm"
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

Helm-based MetalLB default gives you an L2 address pool by default. It has two sections,
`charts:metallb-full:configuration` and `charts:metallb-full:metallb`, as shown in the following examples.

Use the `charts:metallb-full:configuration` parameter section to set resource types that MetalLB supports. The pack
default gives you an L2 address pool. To set up a more advanced scenario, you can use the other resource types provided
in the pack. The pack includes a commented-out example for each resource.

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

The `charts:metallb-full:metallb` parameter section provides access to all the options of the base chart that installs
MetalLB. You don’t need to change anything unless you want to install MetalLB in Free Range Routing (FRR) mode. To use
FRR mode, set the option to `true`, as the example shows.

```yaml
charts:
  metallb-full:
    metallb:
      speaker:
        frr:
          enabled: true
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
</Tabs>

## Terraform

You can reference the MetalLB pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "MetalLB-Helm" {
  name    = "lb-metallb-helm"
  version = "0.13.7"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
