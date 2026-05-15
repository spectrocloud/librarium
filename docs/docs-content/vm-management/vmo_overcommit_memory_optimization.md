---
sidebar_label: "Overcommit & Memory Optimization"
title: "VM Overcommitment & Memory Optimization"
description: "Learn about Palette VMO pack and the architecture behind it."
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "architecture"]
---

VMO enables higher VM density on existing infrastructure by leveraging memory overcommit and CPU optimization techniques, per-VM optimizations, and kernel-level memory deduplication.

These functions allow operators to run more virtual machines per host while reducing infrastructure costs.

## Quick Reference

| Feature | Scope | Configuration Location |
|--|--|--|
| [CPU pinning](#cpu-pinning-performance-optimization) | [Cluster](#cluster-level-configuration-vmo-pack) | VMO Pack |
| [Memory overcommit](#memory-overcommit) | [Cluster](#cluster-level-configuration-vmo-pack) | VMO Pack |
| [KSM](#kernel-same-page-merging-ksm) | [Cluster](#configure-ksm) | VMO Pack |
| Headless mode | VM | UI |
| Guest memory tuning | VM | YAML |

### Memory Overcommit

Memory is typically the first resource that is constrained in VM-dense environments. By using overcommit strategies, you can increase VM density per host, reduce how much you spend on hardware, and improve overall resource utilization. There are trade-offs with memory overcommitment, including potential resource contention. However, this method requires workload awareness and regular monitoring. 

Memory overcommit allows allocating more virtual memory to VMs than physically exists on a host. For example, if you have a host with 64GB of memory, and allocate 96GB of memory to the VMs running on that host, you are overcommitting by 32GB. This works because most VMs do not use peak memory simultaneously, and most virtualization platforms have internal memory optimizations in place to minimize contention between the VMs.

### Memory Ballooning vs Memory Tiering

Virtualization platforms have multiple ways of addressing how memory is used by VMs. Memory ballooning is one technique that reactively allows a hypervisor to reclaim unused memory from VMs dynamically using a guest driver that tricks the guest OS into freeing up memory not in use. This causes the Guest OS to leverage its local swap file, and could potentially introduce latency.

Memory tiering, using NVMes, is a newer, proactive mechanism that migrates inactive data to faster storage to free up memory. This feature is transparent to the VMs, and can help improve VM density. This feature requires [vSphere 9](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/9-0/vsphere-resource-management/memory-tiering-over-nvme.html).

### KubeVirt Constraint

VMO is built on KubeVirt. This allows VMO to run VMs as Kubernetes pods. Memory for the VMs is controlled via Kubernetes requests and limits. Currently, there is no native VM-level dynamic memory reclamation built into KubeVirt. 

:::warning

KubeVirt does not support [balloon drivers](https://kubevirt.io/user-guide/compute/node_overcommit/). This is an upstream limitation, not a VMO-specific constraint.

:::

### Cluster-Level Configuration (VMO Pack)

The following settings apply to every VM on the cluster and are configured through the VMO pack values. 

| Setting | Description | Default | Impact |
|--|--|--|--|
| `cpuAllocationRatio` | Controls ratio of vCPUs to physical CPUs | 10:1 (default) | Higher ratios allow more VMs per host at the cost of potential CPU contention. |
| `memoryOvercommit` | Sets the percentage of memory overcommit cluster-wide | 100% (default - no overcommit) | Values >100% enable overcommit percentage per host |

In the example below, the `cpuAllocationRatio` is set to 12 VMs to one PCPU, and `memoryOvercommit` is configured for 1.5x of the physical RAM per host.

```yaml
additionalDevConfig:
  cpuAllocationRatio: 12
  memoryOvercommit: 150
```

### Per-VM Optimization Settings

You can also do per-VM settings. These can be applied on individual VMs or, to ensure that all VMs created consistently get optimization settings, applied to the settings of a template and provision VMs from the template. This ensures standardize configurations, avoids per-VM manual tuning, and ensures consistency across deployments.  

| Setting | Description | UI Support |
|--|--|--|
| `overcommitGuestOverhead` | Instructs KubeVirt not to charge the VM's memory request for hypervisor overhead (typically ~100–200 MB per VM). Allows tighter resource packing. | YAML only |
| `autoattachGraphicsDevice: false` | Removes the virtual graphics/display device for VMs that don't need a console (headless servers). Saves exactly 16 MB per VM and also disables VNC access — appropriate for server workloads only. | Yes (UI toggle) |
| `memory.guest > requests.memory` | The VM's guest OS "sees" more RAM than Kubernetes has reserved for the pod. Allows the guest to use more memory than formally requested, at the operator's discretion. | Partial (YAML) |

# GET IMAGE OF autoattachGraphic


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

## Kernel Same-page Merging (KSM)

[Kernel Same-page Merging (KSM)](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/virtualization_tuning_and_optimization_guide/chap-ksm) is a Linux kernel feature allows de-duplication of infrequently updated memory pages across VMs, and merges those to free memory. This is especially effective when multiple VMs run the same OS image with the same application behavior. This feature can result in additional CPU overhead from memory scanning.

### Configure KSM

You can configure KSM to run on all nodes or specific nodes. When enabling this feature, `virt-handler` enables KSM. The nodes are labelled `kubevirt.io/ksm-enabled=true` so they are discoverable, and schedulable on KSM-enabled nodes.

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

CPU Pinning, or CPU affinity, is the technique of dedicating one or more host Physical CPU (PCPU) cores to a specific workload, preventing the operating system scheduler from migrating that workload. This eliminates the performance-degrading effects of context switching, cache misses, and resource contention.

In a virtualized KubeVirt environment, this is achieved by integrating the VMI specification with the underlying host resource management provided by the Kubelet. The goal is to provide host-level performance characteristics to the guest Virtual Machine (VM).

| Setting | Value | Impact |
|---------|-------|--------|
| `cpu-manager-policy` | `static` | Enables the CPU Manager to reserve exclusive CPU cores for Guaranteed QoS pods. |
| `cpu-manager-policy-options` | `full-pcpus-only=true` | Ensures that only full physical cores (PCPUs) are allocated, preventing allocation of individual hyper-threads (HT) from the same core to different workloads, thereby maintaining cache isolation. |
| `memory-manager-policy` | `static` | Enables memory alignment with the dedicated CPU resources (NUMA affinity). |
| `topology-manager-policy` |  `single-numa-node` | CRITICAL: Forces all resources (CPU, memory, devices) required by a pod/VMI to be allocated from a single NUMA node to minimize inter-node latency. |
| `topology-manager-scope` | `pod` | Applies the single-numa-node policy at the VMI (Pod) level. |
| `reserved-memory` | `0:memory=<reservedMemory>Mi` | Defines a configurable reserved memory region on a specific NUMA node (e.g., node 0) for the operating system and Kubelet operations, protecting system stability. |


### Enable KubeVirt Feature Gates

The KubeVirt operator configuration must explicitly enable features that allow the virtualization layer to interact with the Kubelet's advanced resource managers. Specifically, enable `NUMA` and `CPUManager`. 


### VirtualMachineInstance (VMI) Specification

Kubernetes QoS: The VMI must have a Guaranteed QoS class (i.e., requests == limits for both CPU and Memory) to be eligible for static CPU management.

Resource Availability: The host node must have sufficient free, unreserved CPU and memory resources on a single NUMA node to satisfy the VMI's requirements.

The VMI manifest defines the exact CPU topology and resource requirements that trigger the CPU pinning mechanism. To achieve Guaranteed QoS and subsequent pinning, the VMI must specify requests and limits for CPU and memory that are equal and integral.


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

- Start with conservative overcommit (120–150%)  
- Use KSM for homogeneous workloads  
- Enable headless mode for server workloads  

### Monitor

- Memory pressure  
- OOM (Out-of-Memory) events  

### Avoid Overcommit For

- Real-time applications  
- Memory-intensive databases  

## Limitations & Roadmap

- No support for memory ballooning today  
- Dependent on KubeVirt roadmap  

Future improvements may include:

- Dynamic memory reclaim  
- Enhanced observability  

## Summary

VMO provides meaningful memory optimization today through:

- Cluster-level overcommit  
- Per-VM tuning  
- Kernel Same-page Merging (KSM)  

These features enable higher VM density and reduced infrastructure costs.


