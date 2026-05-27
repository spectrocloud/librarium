---
sidebar_label: "Overcommit and Memory Optimization"
title: "VM Overcommitment and Memory Optimization"
description: "Learn about VMO Memory and CPU Overcommit and Optimization"
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "architecture"]
---

Virtual Machine Orchestrator (VMO) enables higher VM density on existing infrastructure by leveraging memory overcommit
and CPU optimization techniques, per-VM optimizations, and kernel-level memory deduplication. These methods allow
operators to run more VMs per host while reducing physical infrastructure costs. For more information on memory and
overcommit in VMO, refer to the
[Over-Commit Resources to Enhance VM Performance](./create-manage-vm/advanced-topics/vm-oversubscription.md) page.

To help achieve higher density and resource optimization, there are several features you can use.

## Optimization Features

VMO provides memory optimization at two levels:

- **Cluster level** - Memory overcommit, Kernel Same-Page Merging (KSM), and CPU pinning control how physical resources
  are shared across all VMs.
- **Individual VM level** - Guest memory tuning and headless mode reduce per-VM overhead.

| Feature                                                         | Scope                                     | Advantages                                                                  | Disadvantages                                                      |
| --------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Memory overcommit](#memory-overcommit)                         | [Cluster](#cluster-level-memory-settings) | Increases VM density by reclaiming unused reserved memory.                  | Risks resource contention under peak load.                         |
| [Kernel Same-Page Merging (KSM)](#kernel-same-page-merging-ksm) | [Cluster](#configure-ksm)                 | Reduces memory consumption by merging duplicate pages across similar VMs.   | Adds CPU overhead from continuous page scanning.                   |
| [CPU pinning](#cpu-pinning-performance-optimization)            | [Cluster](#cluster-level-memory-settings) | Eliminates unpredictable latency by dedicating cores to specific workloads. | Removes pinned cores from the shared scheduling pool.              |
| [Headless mode](#ui-configuration-headless-mode)                | VM                                        | Frees up wasted memory on unused graphical devices.                         | Disables Virtual Network Computing (VNC) console access to the VM. |
| [Guest memory tuning](#per-vm-guest-memory-settings)            | VM                                        | Allows guests to use more memory than formally reserved by Kubernetes.      | Exposes the guest to memory pressure under contention.             |

### Memory Overcommit

Memory is typically the first resource constrained in VM-dense environments. Memory overcommit allows allocating more
virtual memory to VMs than physically exists on a host. For example, if you have a host with 64 GB of memory and you
allocate 96 GB of memory to the VMs running on that host, you are overcommitting by 32 GB. This works because most VMs
do not use peak memory simultaneously, and most virtualization platforms have internal memory optimizations in place to
minimize contention between the VMs.

Overcommit strategies can increase VM density per host, reduce hardware costs, and improve overall resource utilization.
However, memory overcommitment introduces trade-offs, including potential resource contention, and requires workload
awareness and regular monitoring.

### Traditional Memory Handling

Virtualization platforms use different techniques to manage memory pressure:

- **Memory ballooning** - Enables a hypervisor to dynamically reclaim unused memory from VMs through a guest driver. The
  guest OS releases unneeded memory and leverages its local swap file, which can introduce latency.

- **Memory tiering (NVMe storage)** - Migrates inactive data to faster storage to free memory. This is transparent to
  VMs and requires platforms such as
  [vSphere 9](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/9-0/vsphere-resource-management/memory-tiering-over-nvme.html).

:::info

Memory tiering has different names depending on the virtualization platform. It may be called memory overcommit
acceleration, swap-to-fast storage, or persistent/storage-class memory.

:::

### VMO Memory Handling

VMO is built on [KubeVirt](https://kubevirt.io/), which runs VMs as Kubernetes pods. Memory for VMs is controlled
through
[Kubernetes requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
Because of this architecture, there is no native VM-level dynamic memory reclamation. Additionally, KubeVirt does not
support [balloon drivers](https://kubevirt.io/user-guide/compute/node_overcommit/).

Instead, VMO provides memory optimization through cluster-wide overcommit ratios, per-VM guest memory tuning, and KSM.

### Cluster-Level Memory Settings

The following settings apply to every VM on the cluster and are configured through the VMO pack values.

| Setting              | Description                                            | Default | Impact                                                                         |
| -------------------- | ------------------------------------------------------ | ------- | ------------------------------------------------------------------------------ |
| `cpuAllocationRatio` | Controls ratio of vCPUs to physical CPUs.              | 10:1    | Higher ratios allow more VMs per host at the cost of potential CPU contention. |
| `memoryOvercommit`   | Sets the percentage of memory overcommit cluster-wide. | 100%    | Values >100% enable overcommit percentage per host.                            |

In the example below, the `cpuAllocationRatio` is set to 12 VMs per physical CPU, and `memoryOvercommit` is configured
for 1.5x of the physical RAM per host.

```yaml
additionalDevConfig:
  cpuAllocationRatio: 12
  memoryOvercommit: 150
```

### Per-VM Guest Memory Settings

You can apply per-VM memory settings to individual VMs or to a VM template so that all VMs provisioned from the template
inherit consistent optimization settings.

spec: terminationGracePeriodSeconds: 30 domain: resources: overcommitGuestOverhead: true requests: memory: 1024M

```

#### YAML Configuration

| Setting                              | Description                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overcommitGuestOverhead`            | Instructs KubeVirt not to charge the VM's memory request for hypervisor overhead (typically ~100–200 MB per VM). Allows tighter resource packing. |
| `memory.guest` and `requests.memory` | The VM's guest OS can use more RAM than Kubernetes has reserved for the pod, at the operator's discretion.                                        |

The following is an example of per-VM memory configuration. In this example, Kubernetes reserves 4 Gi for the pod, but
the guest OS sees 6 Gi of available memory.

spec:
  domain:
    resources:
      requests:
        memory: 4Gi
      limits:
        memory: 4Gi
    memory:
      guest: 6Gi
```

#### UI Configuration (Headless Mode)

Enabling headless mode removes the virtual graphics device from a VM, saving 16 MB of memory per VM. This also disables
VNC console access, so it is appropriate only for server workloads that do not require a graphical console.

You can enable headless mode through the VMO UI when creating or editing a VM.

![Diagram from VMO CPU memory overcommitment doc](/vm-management_vmo_optimization_headless-mode-ui-4-9.webp)

## Kernel Same-Page Merging (KSM)

[KSM](https://docs.kernel.org/admin-guide/mm/ksm.html) is a Linux kernel feature that allows deduplication of
infrequently updated memory pages across VMs and merges those to free memory. This is especially effective when multiple
VMs run the same OS image with the same application behavior. However, this feature can result in additional CPU
overhead from memory scanning.

### Configure KSM

You can configure KSM to run on all nodes or on specific nodes. When you enable this feature, `virt-handler` enables KSM
and labels the nodes with `kubevirt.io/ksm-enabled=true` so workloads can discover and schedule onto KSM-enabled nodes.

:::warning

The setting is for `additionalConfig` and not `additionalDevConfig`.

:::

Use the following YAML in your VMO pack to enable KSM on _all nodes_.

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector: {}
```

Use the following YAML in your VMO pack to enable KSM on _specific nodes_.

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector:
      matchLabels:
        node-role.kubernetes.io/worker: ""
```

:::warning

Removing `ksmConfiguration` from the VMO pack disables KSM only on nodes managed by KubeVirt. Nodes where KSM was
enabled externally remain unchanged and must be managed manually.

:::

## CPU Pinning (Performance Optimization)

CPU pinning (also known as CPU affinity) is the technique of dedicating one or more host physical CPU cores to a
specific workload, preventing the OS scheduler from migrating that workload. This eliminates the performance-degrading
effects of context switching, cache misses, and resource contention.

In a virtualized KubeVirt environment, this is achieved by integrating the Virtual Machine Instance (VMI) specification
with the underlying host resource management provided by the Kubelet. The goal is to provide host-level performance
characteristics to the VM. To implement CPU pinning, you must adjust the following components:

- [Kubelet](#adjust-the-kubelet)
- [KubeVirt Feature Gates](#enable-kubevirt-feature-gates)
- [VMI Specification](#virtual-machine-instance-vmi-specification)

### Adjust the Kubelet

The Kubelet on the host node must be configured to enable static, exclusive resource allocation. This sets the
foundation for a Guaranteed Quality-of-Service (QoS) environment.

| Setting                      | Value                         | Impact                                                                                                                                                                                 |
| ---------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cpu-manager-policy`         | `static`                      | Enables the CPU Manager to reserve exclusive CPU cores for [Guaranteed QoS pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/).                       |
| `cpu-manager-policy-options` | `full-pcpus-only=true`        | Ensures that only full physical cores are allocated, preventing allocation of individual hyper-threads from the same core to different workloads, thereby maintaining cache isolation. |
| `memory-manager-policy`      | `static`                      | Enables memory alignment with the dedicated CPU resources (NUMA affinity).                                                                                                             |
| `topology-manager-policy`    | `single-numa-node`            | Forces all resources (CPU, memory, devices) required by a pod/VMI to be allocated from a single NUMA node to minimize inter-node latency.                                              |
| `topology-manager-scope`     | `pod`                         | Applies the `single-numa-node` policy at the VMI (pod) level.                                                                                                                          |
| `reserved-memory`            | `0:memory=<reservedMemory>Mi` | Defines a configurable reserved memory region on a specific NUMA node (for example, node 0) for the OS and Kubelet operations, protecting system stability.                            |

### Enable KubeVirt Feature Gates

The KubeVirt operator configuration must explicitly enable
[feature gates](https://kubevirt.io/user-guide/cluster_admin/activating_feature_gates/) that allow the virtualization
layer to interact with the Kubelet's advanced resource managers. Specifically, enable `NUMA` and `CPUManager`.

### Virtual Machine Instance (VMI) Specification

The `VirtualMachineInstance` manifest defines the exact CPU topology and resource requirements that trigger the CPU
pinning mechanism. To achieve Guaranteed QoS and enable pinning, the VMI `resources.requests` values for CPU and memory
must be the same as the CPU and memory values listed in `resources.limits`. In addition, the host node must have
sufficient free, unreserved CPU and memory resources on a single NUMA node to satisfy the VMI requirements.

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachineInstance
spec:
  domain:
    cpu:
      dedicatedCpuPlacement: true
      numa:
        guestMappingPassthrough: {}
      model: host-passthrough
      cores: 2
      sockets: 1
      threads: 1
    memory:
      hugepages:
        pageSize: 2Mi
    resources:
      limits:
        cpu: 3
        memory: 8Gi
      requests:
        cpu: 3
        memory: 8Gi
.....

```

## Best Practices

Consider the following guidance when planning overcommit and optimization strategies:

- **Start conservatively** - Begin with memory overcommit at 120–150% and increase gradually based on observed behavior.

- **Monitor for memory pressure** - Watch for Out-Of-Memory (OOM) events and pod evictions. Overcommit without
  monitoring can cause cascading failures.

- **Use headless mode for server workloads** - Saving 16 MB per VM compounds meaningfully at scale, and server workloads
  rarely need VNC access.

- **Enable KSM for homogeneous environments** - KSM provides the highest benefit when many VMs share the same OS image
  and application stack.

- **Reserve CPU pinning for latency-sensitive workloads** - Pinned CPUs are unavailable to other VMs, so use this only
  where predictable performance is a requirement.

- **Avoid overcommitting memory for real-time or database workloads** - Applications with consistent high memory
  utilization do not benefit from overcommit and may experience instability.
