---
sidebar_label: "rook-ceph"
title: "Rook Ceph"
description: "Rook Ceph storage pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl:
  " https://registry.dev.spectrocloud.com/v1/csi-rook-ceph/blobs/sha256:2817270f4eecbc2eea0740c55c7611d1a538a3e17da610a3487bb11b067076d1?type=image.webp"
tags: ["packs", "rook-ceph", "storage"]
---

Rook is an open-source cloud-native storage orchestrator that provides the platform, framework, and support for Ceph
storage to natively integrate with cloud-native environments. Ceph is a distributed storage system that provides file,
block, and object storage and is deployed in large-scale production clusters.

Rook turns storage software into self-managing, self-scaling, and self-healing storage services. It automates
deployment, bootstrapping, configuration, provisioning, scaling, upgrading, migration, disaster recovery, monitoring,
and resource management. Rook uses the facilities provided by the underlying cloud-native container management,
scheduling, and orchestration platform to perform its duties.

The pack has two presets that provide the following two configurations:

- A multi-node Ceph cluster.
- A single-node Ceph cluster.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.12.x" value="1.12.x">

## Prerequisites

- Kubernetes v1.21 or higher.

- If you are using Rook on Edge, the Edge host needs to be created with at least two hard disks.

## Parameters

| Parameter                                   | Description                                                                                                     | Default      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ |
| cluster.contents.spec.storage.useAllDevices | Allows the cluster to use all available devices on the nodes for storage.                                       | true         |
| cluster.contents.spec.storage.deviceFilter  | A regex filter that filters storage devices. Only device names that match the filter are used by Ceph clusters. | Empty String |
| cluster.contents.spec.dashboard.enabled     | Whether to enable the Ceph dashboard.                                                                           | true         |
| cluster.operator.contents.data.LOG_LEVEL    | The log level of Rook Operator. Accepted values are `DEBUG`, `INFO`. `WARNING`, and `ERROR`.                    | `INFO`       |

## Usage

### Rook on Edge Clusters

To use Rook-Ceph on Edge clusters, you need to make a few changes to the cluster profile depending on your cluster
configuration.

1. In the YAML file for BYO-OS pack, add the following blocks to the `stages` configuration in the OS pack of the
   cluster profile.

   ```yaml
   stages:
     initramfs:
       - files:
           - path: /etc/modules-load.d/ceph.conf
             permissions: 644
             owner: 0
             group: 0
             content: |
               rbd
               ceph
             encoding: ""
             ownerstring: ""
     after-upgrade:
       - name: "Erase Old Partitions on Boot Disk"
         commands:
           - wipefs -a /dev/sdb
   ```

2. Click on the Rook-Ceph layer. In the upper-right corner of the Rook-Ceph layer's YAML editing interface, click
   **Presets**. Set the preset to either single-node or multi-node depending on your cluster configuration.

3. If you chose the **Single Node Cluster** preset, skip this step.

   If you chose the **Multi Node Cluster with Replicas** preset, set the value of
   `manifests.storageClass.volumeBindingMode` to `Immediate`.

### Access Ceph Dashboard

The Ceph dashboard gives you an overview of the status of your Ceph cluster, including overall health, and the status of
all Ceph daemons. By default, the Dashboard is exposed as a ClusterIP-type service on the port 7000 on single node
clusters.

1. Issue the following command to view the service and find its cluster IP and port.

   ```shell
   kukubectl --namespace rook-ceph get svc | grep dashboard
   ```

   ```hideClipboard
   rook-ceph-mgr-dashboard   ClusterIP   192.169.32.142   <none>        7000/TCP            15m
   ```

2. If you are on a node of the cluster, you can visit the dashboard by visiting the cluster IP and the exposed port.

   If you are remotely accessing the cluster, you can issue the following command to enable port forwarding from your
   local machine to the dashboard service.

   ```shell
   kukubectl port-forward svc/rook-ceph-mgr-dashboard -n rook-ceph 8443:7000 &
   ```

   If your dashboard service is exposed on a different port, replace 7000 with the port that the dashboard service is
   exposed on.

3. Once you can connect to the dashboard, you need to provide the login credentials to access the dashboard. Rook
   creates a default user named `admin` and generates a secret called `rook-ceph-dashboard-password` in the namespace of
   the Rook-Ceph cluster. To retrieve the generated password, issue the following command:

   ```shell
   kubectl -n rook-ceph get secret rook-ceph-dashboard-password -o jsonpath="{['data']['password']}" | base64 --decode && echo
   ```

4. Use the password you receive in the output with the username `admin` to log in to the Ceph Dashboard.

### Known Issues

- If a cluster experiences network issues, it's possible for the file mount to become unavailable and remain unavailable
  even after the network is restored. This a known issue disclosed in the
  [Rook GitHub repository](https://github.com/rook/rook/issues/13818). Refer to the
  [Troubleshooting section](#file-mount-becomes-unavailable-after-cluster-experiences-network-issues) for a workaround
  if you observe this issue in your cluster.

</TabItem>

<TabItem label="1.11.x" value="1.11.x">

## Prerequisites

- Kubernetes v1.21 or higher.

- If you are using Rook on Edge, the Edge host needs to be created with at least two hard disks. The actual required
  number of disks depend on your cluster configuration.

## Parameters

| Parameter                                   | Description                                                                                                     | Default      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ |
| cluster.contents.spec.storage.useAllDevices | Allows the cluster to use all available devices on the nodes for storage.                                       | true         |
| cluster.contents.spec.storage.deviceFilter  | A regex filter that filters storage devices. Only device names that match the filter are used by Ceph clusters. | Empty String |
| cluster.contents.spec.dashboard.enabled     | Whether to enable the Ceph dashboard.                                                                           | true         |
| cluster.operator.contents.data.LOG_LEVEL    | The log level of Rook Operator. Accepted values are `DEBUG`, `INFO`. `WARNING`, and `ERROR`.                    | `INFO`       |

## Usage

### Rook on Edge Clusters

To use Rook-Ceph on Edge clusters, you need to make a few changes to the cluster profile depending on your cluster
configuration.

1. In the YAML file for BYO-OS pack, add the following blocks to the `stages` configuration in the OS pack of the
   cluster profile.

   ```yaml
   stages:
     initramfs:
       - files:
           - path: /etc/modules-load.d/ceph.conf
             permissions: 644
             owner: 0
             group: 0
             content: |
               rbd
               ceph
             encoding: ""
             ownerstring: ""
     after-upgrade:
       - name: "Erase Old Partitions on Boot Disk"
         commands:
           - wipefs -a /dev/sdb
   ```

2. Click on the Rook-Ceph layer. In the upper-right corner of the Rook-Ceph layer's YAML editing interface, click
   **Presets**. Set the preset to either single-node or multi-node depending on your cluster configuration.

3. If you chose the **Single Node Cluster** preset, skip this step.

   If you chose the **Multi Node Cluster with Replicas** preset, set the value of
   `manifests.storageClass.volumeBindingMode` to `Immediate`.

### Access Ceph Dashboard

The Ceph dashboard gives you an overview of the status of your Ceph cluster, including overall health, and the status of
all Ceph daemons. By default, the Dashboard is exposed as a ClusterIP-type service on the port 7000 on single node
clusters.

1. Issue the following command to view the service and find its cluster IP and port.

   ```shell
   kukubectl --namespace rook-ceph get svc | grep dashboard
   ```

   ```hideClipboard
   rook-ceph-mgr-dashboard   ClusterIP   192.169.32.142   <none>        7000/TCP            15m
   ```

2. If you are on a node of the cluster, you can visit the dashboard by visiting the cluster IP and the exposed port.

   If you are remotely accessing the cluster, you can issue the following command to enable port forwarding from your
   local machine to the dashboard service.

   ```shell
   kukubectl port-forward svc/rook-ceph-mgr-dashboard -n rook-ceph 8443:7000 &
   ```

   If your dashboard service is exposed on a different port, replace 7000 with the port that the dashboard service is
   exposed on.

3. Once you can connect to the dashboard, you need to provide the login credentials to access the dashboard. Rook
   creates a default user named `admin` and generates a secret called `rook-ceph-dashboard-password` in the namespace of
   the Rook-Ceph cluster. To retrieve the generated password, issue the following command:

   ```shell
   kubectl -n rook-ceph get secret rook-ceph-dashboard-password -o jsonpath="{['data']['password']}" | base64 --decode && echo
   ```

4. Use the password you receive in the output with the username `admin` to log in to the Ceph Dashboard.

### Known Issues

- If a cluster experiences network issues, it's possible for the file mount to become unavailable and remain unavailable
  even after the network is restored. This a known issue disclosed in the
  [Rook GitHub repository](https://github.com/rook/rook/issues/13818). Refer to the
  [Troubleshooting section](#file-mount-becomes-unavailable-after-cluster-experiences-network-issues) for a workaround
  if you observe this issue in your cluster.

</TabItem>

<TabItem label="1.10.x" value="1.10.x">

## Prerequisites

- Kubernetes v1.21 or higher.

- If you are using Rook on Edge, the Edge host needs to be created with at least two hard disks. The actual required
  number of disks depend on your cluster configuration.

## Parameters

| Parameter                                   | Description                                                                                                     | Default      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ |
| cluster.contents.spec.storage.useAllDevices | Allows the cluster to use all available devices on the nodes for storage.                                       | true         |
| cluster.contents.spec.storage.deviceFilter  | A regex filter that filters storage devices. Only device names that match the filter are used by Ceph clusters. | Empty String |
| cluster.contents.spec.dashboard.enabled     | Whether to enable the Ceph dashboard.                                                                           | true         |
| cluster.operator.contents.data.LOG_LEVEL    | The log level of Rook Operator. Accepted values are `DEBUG`, `INFO`. `WARNING`, and `ERROR`.                    | `INFO`       |

## Usage

### Rook on Edge Clusters

To use Rook-Ceph on Edge clusters, you need to make a few changes to the cluster profile depending on your cluster
configuration.

1. In the YAML file for BYO-OS pack, add the following blocks to the `stages` configuration in the OS pack of the
   cluster profile.

   ```yaml
   stages:
     initramfs:
       - files:
           - path: /etc/modules-load.d/ceph.conf
             permissions: 644
             owner: 0
             group: 0
             content: |
               rbd
               ceph
             encoding: ""
             ownerstring: ""
     after-upgrade:
       - name: "Erase Old Partitions on Boot Disk"
         commands:
           - wipefs -a /dev/sdb
   ```

2. Click on the Rook-Ceph layer. In the upper-right corner of the Rook-Ceph layer's YAML editing interface, click
   **Presets**. Set the preset to either single-node or multi-node depending on your cluster configuration.

3. If you chose the **Single Node Cluster** preset, skip this step.

   If you chose the **Multi Node Cluster with Replicas** preset, set the value of
   `manifests.storageClass.volumeBindingMode` to `Immediate`.

### Access Ceph Dashboard

The Ceph dashboard gives you an overview of the status of your Ceph cluster, including overall health, and the status of
all Ceph daemons. By default, the Dashboard is exposed as a ClusterIP-type service on the port 7000 on single node
clusters.

1. Issue the following command to view the service and find its cluster IP and port.

   ```shell
   kukubectl --namespace rook-ceph get svc | grep dashboard
   ```

   ```hideClipboard
   rook-ceph-mgr-dashboard   ClusterIP   192.169.32.142   <none>        7000/TCP            15m
   ```

2. If you are on a node of the cluster, you can visit the dashboard by visiting the cluster IP and the exposed port.

   If you are remotely accessing the cluster, you can issue the following command to enable port forwarding from your
   local machine to the dashboard service.

   ```shell
   kukubectl port-forward svc/rook-ceph-mgr-dashboard -n rook-ceph 8443:7000 &
   ```

   If your dashboard service is exposed on a different port, replace 7000 with the port that the dashboard service is
   exposed on.

3. Once you can connect to the dashboard, you need to provide the login credentials to access the dashboard. Rook
   creates a default user named `admin` and generates a secret called `rook-ceph-dashboard-password` in the namespace of
   the Rook-Ceph cluster. To retrieve the generated password, issue the following command:

   ```shell
   kubectl -n rook-ceph get secret rook-ceph-dashboard-password -o jsonpath="{['data']['password']}" | base64 --decode && echo
   ```

4. Use the password you receive in the output with the username `admin` to log in to the Ceph Dashboard.

### Known Issues

- If a cluster experiences network issues, it's possible for the file mount to become unavailable and remain unavailable
  even after the network is restored. This a known issue disclosed in the
  [Rook GitHub repository](https://github.com/rook/rook/issues/13818). Refer to the
  [Troubleshooting section](#file-mount-becomes-unavailable-after-cluster-experiences-network-issues) for a workaround
  if you observe this issue in your cluster.

</TabItem>

<TabItem label="Deprecated" value="Deprecated">

The older versions of this pack are deprecated. Please use the later versions to take advantage of new features and
improvements.

</TabItem>

</Tabs>

## Troubleshooting

### File Mount Becomes Unavailable after Cluster Experiences Network Issues

A known issue exists with Rook-Ceph where file mounts become unavailable and remain unavailable even after network
issues are resolved.

#### Debug Steps

1. One way to debug is to reboot the node that is experiencing the issues. If you are unable to reboot the node, or if
   rebooting the node does not fix the issue, continue to the following steps.

2. Connect to your cluster via the command-line. For more information, refer to
   [Access Cluster with CLI](/docs/docs-content/clusters/cluster-management/palette-webctl.md).

3. Issue the following command to identify Persistent Volume Claims (PVC) from Ceph File System (FS).

   ```shell
   kubectl get pvc --all | grep "cephFS"
   ```

4. Scale down all workloads, including pods, deployments, and StatefulSets using the PVC to zero.

   To scale down a deployment, use the following command. Replace `deployment-name` with the name of the deployment.

   ```shell
   kubectl scale deployment deployment-name --replicas=0
   ```

   To scale down a StatefulSet, use the following command. Replace `statefulset-name` with the name of the StatefulSet.

   ```shell
   kubectl scale statefulset statefulset-name --replicas=0
   ```

   To scale down a pod, delete it. Make sure you delete the deployments and StatefulSets first. If a pod belongs to a
   StatefulSet or a deployment, it will simply be recreated.

   ```shell
   kubectl delete pods pod-name
   ```

   :::tip

   If you do not know which workloads use the PVC, you can start by getting a list of all pods that are using PVCs and
   their PVC names with the following command.

   ```shell
   kubectl get pods --all-namespaces --output=json | jq '.items[] | {name: .metadata.name, namespace: .metadata.namespace, claimName: .spec |  select( has ("volumes") ).volumes[] | select( has ("persistentVolumeClaim") ).persistentVolumeClaim.claimName }'
   ```

   You can then find workloads that are associated with the pods and scale them down to zero.

   :::

5. Once all the workloads are scaled down, all existing volume mounts will be unmounted, followed by fresh new mounts of
   cephFS volumes. Ensure that all workloads are scaled down to zero. Even if one pod remains that uses the PVC, the
   unmount will not happen and the issue will not be resolved.

6. Scale the workloads back to their original state.

## Terraform

```tf
data "spectrocloud_registry" "registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "pack" {
  name    = "csi-rook-ceph-addon"
  version = "1.12.7"
  type = "helm"
  registry_uid = data.spectrocloud_registry.registry.id
}
```

## References

- [Rook Ceph Documentation](https://rook.io/docs/rook/v1.10/Getting-Started/intro/)

- [Ceph Dashboard](https://rook.io/docs/rook/latest-release/Storage-Configuration/Monitoring/ceph-dashboard/)
