---
sidebar_label: "MicroK8s"
title: "MicroK8s"
description: "MicroK8s pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kubernetes-microk8s/blobs/sha256:b971b64f62e2e67b0a166316f96e6f4211aacea6e28459bb89275e8882ade985?type=image.webp"
tags: ["packs", "microk8s", "kubernetes"]
---

## Support Lifecycle

We support different Kubernetes distributions, such as MicroK8s, K3s, and RKE2, until their official End-of-Life (EOL).
The EOL is set by the respective owner. Once we stop supporting the minor version, we initiate the deprecation process.
Refer to the [Kubernetes Support Lifecycle](kubernetes-support.md#other-kubernetes-distributions) guide to learn more.

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.28.x" value="1.28.x">

### Usage

To use MicroK8s, select it as the Kubernetes distribution when choosing the Kubernetes layer during the cluster profile
creation. Remember that the cloud type must be either AWS or MAAS, and the OS layer must be Ubuntu 22.04.

![A view of the cluster profile Kubernetes selection screen](/integrations_microk8s_cluster-profile-view.webp)

:::info

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

:::

#### Upgrade Strategy

The upgrade strategy describes how to replace existing control plane nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

:::warning

Before upgrading your cluster, review the [Known Issues](../release-notes/known-issues.md) and the
[Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades) pages to learn about the limitations associated with
MicroK8s upgrades.

:::

The MicroK8s pack supports three types of upgrade strategies:

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server. This is the default upgrade strategy.

- `RollingUpgrade` - This upgrade strategy deletes the current control plane node before creating a new one.

- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

#### Using MicroK8s with the AWS EBS Pack

<!-- prettier-ignore -->
When using the <VersionedLink text="AWS EBS pack" url="/integrations/packs/?pack=kubernetes-microk8s" /> with MicroK8s,
you need to change the EBS CSI pack `node.kubelet` parameter from `/var/lib/kubelet` to
`/var/snap/microk8s/common/var/lib/kubelet`.

```yaml {3}
node:
  env: []
  kubeletPath: /var/lib/kubelet
```

```yaml {3}
node:
  env: []
  kubeletPath: /var/snap/microk8s/common/var/lib/kubelet
```

## Troubleshoot

### Scenario - Backup and Restore Fails with Restic

If you encounter errors backing up or restoring a MicroK8s cluster with [restic](https://github.com/restic/restic), it
may be related to the Velero issue [4035](https://github.com/vmware-tanzu/velero/issues/4035). You can resolve this
issue by using the following workaround.

1. Issue the command below to get the `restic` daemonset pod and its namespace.

   ```shell
   kubectl get pods --selector name=restic --all-namespaces
   ```

   ```shell hideClipboard
   NAMESPACE                          NAME           READY   STATUS        RESTARTS   AGE
   cluster-66f0f593841168d5eec8962e   restic-4lj7p    0/1    Terminating       3        2m
   ```

2. Issue the following command to patch the `restic` daemonset pod. Replace `cluster-xxxxxxxxx` with the namespace of
   your `restic` daemonset pod.

   ```shell
   kubectl ---namespace cluster-xxxxxxxxx patch daemonset restic --patch '{"spec":{"template":{"spec":{"volumes":[{"name":"host-pods","hostPath":{"path":"/var/snap/microk8s/common/var/lib/kubelet/pods"}}]}}}}'
   ```

3. Verify that the `restic` daemonset pod is patched. Replace `cluster-xxxxxxxxx` with the namespace of your `restic`
   daemonset pod.

   ```shell
   kubectl --namespace cluster-xxxxxxxxx get daemonset restic -o jsonpath='{.spec.template.spec.volumes}'
   ```

   ```shell {9-15} hideClipboard
    [
      {
        "name": "cloud-credentials",
        "secret": {
          "defaultMode": 420,
          "secretName": "velero"
        }
      },
      {
        "hostPath": {
          "path": "/var/snap/microk8s/common/var/lib/kubelet/pods",
          "type": ""
        },
        "name": "host-pods"
      }
   ]
   ```

4. Backup and restore operations will now work as expected.

</TabItem>

<TabItem label="1.27.x" value="1.27.x">

## Container Network Interface (CNI)

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

## Upgrade Strategy

The upgrade strategy describes how to replace existing control plane nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

:::warning

Before upgrading your cluster, review the [Known Issues](../release-notes/known-issues.md) and the
[Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades) pages to learn about the limitations associated with
MicroK8s upgrades.

:::

The MicroK8s pack supports three types of upgrade strategies:

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

## Troubleshoot

### Scenario - Backup and Restore Fails with Restic

If you encounter errors backing up or restoring a MicroK8s cluster with [restic](https://github.com/restic/restic), it
may be related to the Velero issue [4035](https://github.com/vmware-tanzu/velero/issues/4035). You can resolve this
issue by using the following workaround.

1. Issue the command below to get the `restic` daemonset pod and its namespace.

   ```shell
   kubectl get pods --selector name=restic --all-namespaces
   ```

   ```shell hideClipboard
   NAMESPACE                          NAME           READY   STATUS        RESTARTS   AGE
   cluster-66f0f593841168d5eec8962e   restic-4lj7p    0/1    Terminating       3        2m
   ```

2. Issue the following command to patch the `restic` daemonset pod. Replace `cluster-xxxxxxxxx` with the namespace of
   your `restic` daemonset pod.

   ```shell
   kubectl ---namespace cluster-xxxxxxxxx patch daemonset restic --patch '{"spec":{"template":{"spec":{"volumes":[{"name":"host-pods","hostPath":{"path":"/var/snap/microk8s/common/var/lib/kubelet/pods"}}]}}}}'
   ```

3. Verify that the `restic` daemonset pod is patched. Replace `cluster-xxxxxxxxx` with the namespace of your `restic`
   daemonset pod.

   ```shell
   kubectl --namespace cluster-xxxxxxxxx get daemonset restic -o jsonpath='{.spec.template.spec.volumes}'
   ```

   ```shell {9-15} hideClipboard
    [
      {
        "name": "cloud-credentials",
        "secret": {
          "defaultMode": 420,
          "secretName": "velero"
        }
      },
      {
        "hostPath": {
          "path": "/var/snap/microk8s/common/var/lib/kubelet/pods",
          "type": ""
        },
        "name": "host-pods"
      }
   ]
   ```

4. Backup and restore operations will now work as expected.

</TabItem>

<TabItem label="1.26.x" value="1.26.x">

## Container Network Interface (CNI)

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

## Upgrade Strategy

The upgrade strategy describes how to replace existing control plane nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

:::warning

Before upgrading your cluster, review the [Known Issues](../release-notes/known-issues.md) and the
[Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades) pages to learn about the limitations associated with
MicroK8s upgrades.

:::

The MicroK8s pack supports three types of upgrade strategies:

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

</TabItem>
</Tabs>

## Terraform

You can reference the MicroK8s pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "k8s" {
  name    = "kubernetes-microk8s"
  version = "1.27"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
