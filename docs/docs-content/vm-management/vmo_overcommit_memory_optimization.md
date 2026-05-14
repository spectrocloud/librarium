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
| KSM | Cluster | VMO Pack |
| Headless mode | VM | UI |
| Guest memory tuning | VM | YAML |

## Memory Overcommit

Memory is typically the first resource that is constrained in VM-dense environments. By using overcommit strategies, you can increase VM density per host, reduce how much you spend on hardware, and improve overall resource utilization. There are trade-offs with memory overcommitment, including potential resource contention. However, this method requires workload awareness and regular monitoring. 

Memory overcommit allows allocating more virtual memory to VMs than physically exists on a host. For example, if you have a host with 64GB of memory, and allocate 96GB of memory to the VMs running on that host, you are overcommitting by 24GB. This works because most VMs do not use peak memory simultaneously, and most virtualization platforms have internal memory optimizations in place to minimize contention between the VMs.

### Memory Ballooning vs Memory Tiering

Virtualization platforms have multiple ways of addressing how memory is used by VMs. Memory ballooning is one technique that reactively allows a hypervisor to reclaim unused memory from VMs dynamically using a guest driver that tricks the guest OS into freeing up memory not in use. This causes the Guest OS to leverage its local swap file, and could potentially introduce latency.

Memory tiering, using NVMes, is a newer, proactive mechanism that migrates inactive data to faster storage to free up memory. This feature is transparent to the VMs, and can help improve VM density. This feature requires [vSphere 9](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/9-0/vsphere-resource-management/memory-tiering-over-nvme.html).

### KubeVirt Constraint

VMO is built on KubeVirt. This allows VMO to run VMs as Kubernetes pods. Memory for the VMs is controlled via Kubernetes through requests and limits. Currently, there is no native VM-level dynamic memory reclamation built into KubeVirt. 

:::warning

KubeVirt does not support [balloon drivers](https://kubevirt.io/user-guide/compute/node_overcommit/). This is an upstream limitation, not a VMO-specific constraint.

:::

### Cluster-Level Configuration (VMO Pack)

These settings apply to all VMs in a cluster.

| Setting | Description | Default | Impact |
|--|--|--|--|
| `cpuAllocationRatio` | Ratio of vCPUs to physical CPUs | 10:1 | Higher values increase density but may cause CPU contention |
| `memoryOvercommit` | Percentage of memory allocation | 100% | Values >100% enable overcommit |

### Example Configuration

```yaml
additionalDevConfig:
  cpuAllocationRatio: 12
  memoryOvercommit: 150
```

:::tip

- Predictable workloads  
- Non-latency-sensitive applications

:::

### Per-VM Optimization Settings

These settings are applied per VM or via VM templates.

| Setting | Description | UI Support |
|--|--|--|
| `overcommitGuestOverhead` | Excludes hypervisor overhead from memory request | No |
| `autoattachGraphicsDevice: false` | Enables headless mode (saves 16 MB per VM) | Yes |
| `memory.guest > requests.memory` | Guest sees more memory than reserved | Partial |

```yaml title=”Example VM Configuration”
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

To ensure that all VMs created consistently get optimization settings, apply the settings to a template and provision from the template. This ensures standardize configurations, avoids per-VM manual tuning, and ensures consistency across deployments.  

## Kernel Same-page Merging (KSM)

### What KSM Does

KSM is a Linux kernel feature that merges identical memory pages across VMs.

This is especially effective when multiple VMs run the same OS image.

### Benefits

- Reduces actual memory usage  
- Improves efficiency of overcommit  
- Enables higher VM density  

### Tradeoffs

- Additional CPU overhead from memory scanning  

## Configure KSM

### All Nodes

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector: {}
```

### Specific Nodes

```yaml
additionalConfig:
  ksmConfiguration:
    nodeLabelSelector:
      matchLabels:
        node-role.kubernetes.io/worker: ""
```
### What Happens After Enabling

- KubeVirt enables KSM via `virt-handler`  
- Nodes are labeled:
  - `kubevirt.io/ksm-enabled=true`  

- You can target these nodes:

```yaml
nodeSelector:
  kubevirt.io/ksm-enabled: "true"
```

## CPU Pinning (Performance Optimization)

### When to Use CPU Pinning

Use CPU pinning for:

- High-performance workloads  
- Latency-sensitive applications  

### How It Works

CPU pinning dedicates physical CPU cores to a VM, eliminating:

- Context switching  
- Cache misses  
- CPU contention  

:::info Requirement
CPU pinning requires **Guaranteed QoS** (requests = limits).
:::

## Configuration Overview

### 1. Kubelet Configuration

| Setting | Value |
|--||
| `cpu-manager-policy` | `static` |
| `topology-manager-policy` | `single-numa-node` |

### 2. Enable KubeVirt Feature Gates

- `NUMA`  
- `CPUManager`  

### 3. VM Specification

```yaml
resources:
  limits:
    cpu: 3
    memory: 8Gi
  requests:
    cpu: 3
    memory: 8Gi
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


