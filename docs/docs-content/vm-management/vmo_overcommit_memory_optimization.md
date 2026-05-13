
sidebar_label: "Overcommit & Memory Optimization"
title: "VM Overcommitment & Memory Optimization"
description: "Learn about Palette VMO pack and the architecture behind it."
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "architecture"]


## Overview

VMO enables higher VM density on existing infrastructure by leveraging memory and CPU overcommit techniques, per-VM optimizations, and kernel-level memory deduplication.

This allows operators to run more virtual machines per host while reducing infrastructure costs.

:::tip 

VMO supports multiple memory optimization techniques today. Full memory ballooning support is not yet available, but is on the KubeVirt roadmap.

:::

## NewTitle

Memory is typically the first resource constraint in VM-dense environments.

Using overcommit strategies, you can:

- Increase VM density per host  
- Reduce hardware spend  
- Improve overall resource utilization  

:::caution Tradeoffs
- Potential resource contention  
- Requires workload awareness and monitoring  
:::

### Memory Overcommit

Memory overcommit allows allocating more virtual memory to VMs than physically exists on a host.

**Example:**
- Host: 64 GB RAM  
- Allocated: 96 GB across VMs (150%)

This works because most VMs do not use peak memory simultaneously.



### Memory Ballooning (Roadmap)

Memory ballooning allows a hypervisor to reclaim unused memory from VMs dynamically using a guest driver.

:::warn

KubeVirt does not yet support balloon drivers. This is an upstream limitation, not a VMO-specific constraint.

:::

### KubeVirt Constraint

VMO is built on KubeVirt, where:

- VMs run as Kubernetes pods  
- Memory is controlled via Kubernetes **requests and limits**  
- No native VM-level dynamic memory reclaim exists today  

## What VMO Supports Today

### Cluster-Level Configuration (VMO Pack)

These settings apply to all VMs in a cluster.

| Setting | Description | Default | Impact |
|--|-|--|--|
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
|--|-|--|
| `overcommitGuestOverhead` | Excludes hypervisor overhead from memory request | No |
| `autoattachGraphicsDevice: false` | Enables headless mode (saves 16 MB per VM) | Yes |
| `memory.guest > requests.memory` | Guest sees more memory than reserved | Partial |

### Example VM Configuration

```yaml
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
### VM Templates

You can embed overcommit settings into VM Templates to:

- Standardize configurations  
- Avoid per-VM manual tuning  
- Ensure consistency across deployments  

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

## Quick Reference

| Feature | Scope | Configuration Location |
|--|||
| CPU overcommit | Cluster | VMO Pack |
| Memory overcommit | Cluster | VMO Pack |
| KSM | Cluster | VMO Pack |
| Headless mode | VM | UI |
| Guest memory tuning | VM | YAML |
