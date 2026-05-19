---
sidebar_label: "Overcommit & Memory Optimization"
title: "VM Overcommitment & Memory Optimization"
description: "Learn about Palette VMO pack and the architecture behind it."
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "architecture"]
---

Virtual Machine Orchestrator (VMO) enables higher VM density on existing infrastructure by leveraging memory overcommit
and CPU optimization techniques, per-VM optimizations, and kernel-level memory deduplication.

This ability allows operators to run more virtual machines per host while reducing physical infrastructure costs. To
help achieve higher density and resource optimization, there are five features you can use.

## Quick Reference

| Feature                                              | Scope                                            | Configuration Location |
| ---------------------------------------------------- | ------------------------------------------------ | ---------------------- |
| [Memory overcommit](#memory-overcommit)              | [Cluster](#cluster-level-configuration-vmo-pack) | VMO Pack               |
| [KSM](#kernel-same-page-merging-ksm)                 | [Cluster](#configure-ksm)                        | VMO Pack               |
| [CPU pinning](#cpu-pinning-performance-optimization) | [Cluster](#cluster-level-configuration-vmo-pack) | VMO Pack               |
| [Headless mode](#headless-mode)                      | VM                                               | UI                     |
| [Guest memory tuning](#per-vm-optimization-settings) | VM                                               | YAML                   |

### Memory Overcommit

Memory is typically the first resource constrained in VM-dense environments. Overcommit strategies can increase VM density per host, reduce hardware costs, and improve overall resource utilization. However, memory overcommitment introduces trade-offs, including potential resource contention, and requires workload awareness and regular monitoring.

Memory overcommit allows allocating more virtual memory to VMs than physically exists on a host. For example, if you
have a host with 64 GB of memory, and allocate 96 GB of memory to the VMs running on that host, you are overcommitting by
32 GB. This works because most VMs do not use peak memory simultaneously, and most virtualization platforms have internal
memory optimizations in place to minimize contention between the VMs.

### Memory Ballooning vs Memory Tiering

Virtualization platforms have multiple ways of addressing how memory is used by VMs. Memory ballooning is a technique that enables a hypervisor to dynamically reclaim unused memory from VMs by using a guest driver that causes the guest OS to release unneeded memory. This causes the Guest OS to leverage its local swap file, and could
potentially introduce latency.

Memory tiering, using NVMes, is a newer, proactive mechanism that migrates inactive data to faster storage to free up
memory. This feature is transparent to the VMs, and can help improve VM density. This feature requires
[vSphere 9](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/9-0/vsphere-resource-management/memory-tiering-over-nvme.html).

:::info

Memory tiering has different names, depending on the virtualization platform. This may be called memory overcommit
acceleration, swap-to-fast storage, or persistent/storage-class memory. Check with your virtualization vendor to
determine what features are available for proactive memory management.

:::

### KubeVirt Constraint

VMO is built on KubeVirt. This allows VMO to run VMs as Kubernetes pods. Memory for the VMs is controlled via Kubernetes
requests and limits. Currently, there is no native VM-level dynamic memory reclamation built into KubeVirt.

:::warning

KubeVirt does not support [balloon drivers](https://kubevirt.io/user-guide/compute/node_overcommit/). This is an
upstream limitation, not a VMO-specific constraint.

:::

### Cluster-Level Configuration (VMO Pack)

The following settings apply to every VM on the cluster and are configured through the VMO pack values.

| Setting              | Description                                           | Default                        | Impact                                                                         |
| -------------------- | ----------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `cpuAllocationRatio` | Controls ratio of vCPUs to physical CPUs              | 10:1 (default)                 | Higher ratios allow more VMs per host at the cost of potential CPU contention. |
| `memoryOvercommit`   | Sets the percentage of memory overcommit cluster-wide | 100% (default - no overcommit) | Values >100% enable overcommit percentage per host                             |

In the example below, the `cpuAllocationRatio` is set to 12 VMs to one PCPU, and `memoryOvercommit` is configured for
1.5x of the physical RAM per host.

```yaml
additionalDevConfig:
  cpuAllocationRatio: 12
  memoryOvercommit: 150
```

### Per-VM Optimization Settings

You can also do per-VM settings. These can be applied on individual VMs or, to ensure that all VMs created consistently
get optimization settings, applied to the settings of a template and provision VMs from the template. This ensures
standardize configurations, avoids per-VM manual tuning, and ensures consistency across deployments.

| Setting                           | Description                                                                                                                                                                                             | UI Support      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `overcommitGuestOverhead`         | Instructs KubeVirt not to charge the VM's memory request for hypervisor overhead (typically ~100–200 MB per VM). Allows tighter resource packing.                                                       | YAML only       |
| `autoattachGraphicsDevice: false` | Removes the virtual graphics/display device for VMs that don't need a console (headless mode servers). Saves exactly 16 MB per VM and also disables VNC access. This setting is appropriate for server workloads only. | Yes (UI toggle) |
| `memory.guest > requests.memory`  | The VM's guest OS "sees" more RAM than Kubernetes has reserved for the pod. Allows the guest to use more memory than formally requested, at the operator's discretion.                                  | Partial (YAML)  |

The following is an example of per-VM memory configuration.

```json title=”Example VM Configuration”
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

### Headless mode

Enabling **Headless mode** can save 16 MB by disabling the graphical device. However, this also disables VNC access to
the VM.

![Diagram from VMO CPU memory overcommitment doc](/vm-management_vmo_optimization_headless-mode-ui-4-9.webp)

## Kernel Same-page Merging (KSM)

[Kernel Same-page Merging (KSM)](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/virtualization_tuning_and_optimization_guide/chap-ksm)
is a Linux kernel feature allows de-duplication of infrequently updated memory pages across VMs, and merges those to
free memory. This is especially effective when multiple VMs run the same OS image with the same application behavior.
This feature can result in additional CPU overhead from memory scanning.

### Configure KSM

You can configure KSM to run on all nodes or specific nodes. When enabling this feature, `virt-handler` enables KSM. The
nodes are labelled `kubevirt.io/ksm-enabled=true` so they are discoverable, and can be scheduled on KSM-enabled nodes.

:::warning

The setting is for `additionalConfig` and not `additionalDevConfig`.

:::

Utilize the following to enable KSM on all nodes under `additionalConfig` in the VMO pack.

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector: {}
```

Utilize the following to enable KSM on specific nodes under `additionalConfig` in the VMO pack.

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector:
      matchLabels:
        node-role.kubernetes.io/worker: ""
```

## CPU Pinning (Performance Optimization)

CPU Pinning, or CPU affinity, is the technique of dedicating one or more host Physical CPU (PCPU) cores to a specific
workload, preventing the operating system scheduler from migrating that workload. This eliminates the
performance-degrading effects of context switching, cache misses, and resource contention.

In a virtualized KubeVirt environment, this is achieved by integrating the VMI specification with the underlying host
resource management provided by the Kubelet. The goal is to provide host-level performance characteristics to the VM. To implement CPU pinning, three main components need to be adjusted:

- the [kubelet](#adjust-the-kubelet)
- the [KubeVirt feature gates](#enable-kubevirt-feature-gates)
- the [VMI specification](#virtualmachineinstance-vmi-specification)

### Adjust the Kubelet

The Kubelet on the host node must be configured to enable static, exclusive resource allocation. This sets the
foundation for a Guaranteed Quality-of-Service (QoS) environment.

| Setting                      | Value                         | Impact                                                                                                                                                                                              |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cpu-manager-policy`         | `static`                      | Enables the CPU Manager to reserve exclusive CPU cores for Guaranteed QoS pods.                                                                                                                     |
| `cpu-manager-policy-options` | `full-pcpus-only=true`        | Ensures that only full physical cores (PCPUs) are allocated, preventing allocation of individual hyper-threads from the same core to different workloads, thereby maintaining cache isolation. |
| `memory-manager-policy`      | `static`                      | Enables memory alignment with the dedicated CPU resources (NUMA affinity).                                                                                                                          |
| `topology-manager-policy`    | `single-numa-node`            | CRITICAL: Forces all resources (CPU, memory, devices) required by a pod/VMI to be allocated from a single NUMA node to minimize inter-node latency.                                                 |
| `topology-manager-scope`     | `pod`                         | Applies the single-numa-node policy at the VMI (Pod) level.                                                                                                                                         |
| `reserved-memory`            | `0:memory=<reservedMemory>Mi` | Defines a configurable reserved memory region on a specific NUMA node (for example, node 0) for the operating system and Kubelet operations, protecting system stability.                                  |

### Enable KubeVirt Feature Gates

The KubeVirt operator configuration must explicitly enable features that allow the virtualization layer to interact with
the Kubelet's advanced resource managers. Specifically, enable `NUMA` and `CPUManager`.

### VirtualMachineInstance (VMI) Specification

The VMI manifest defines the exact CPU topology and resource requirements that trigger the CPU pinning mechanism. To
achieve Guaranteed QoS and subsequent pinning, the VMI requests must equal limits for both CPU and Memory. In addition, the host node must have sufficient free, unreserved CPU and memory resources on a single NUMA
node to satisfy the VMI's requirements.


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

:::tip

Requests and limits must be equal to achieve Guaranteed QoS.

:::

## Best Practices

Keep a few general best practices to keep in mind. It is best to start with conservative overcommit (120–150%) for
memory, and increase it gradually overtime. Enable headless mode for server workloads to meaningfully
reduce memory usage, and KSM for homogeneous workloads can further increase these benefits.

It is important to monitor the environment for memory pressure and Out-Of-Memory (OOM) events. Additionally, real-time
applications and memory-intensive databases may not benefit from these adjustments.
