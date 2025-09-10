---
sidebar_label: "Over-Commit Resources to Enhance VM Performance"
title: "Over-Commit Resources to Enhance VM Performance"
description: "Learn how to improve VM performance by maximizing virtual machine CPU and memory using Palette."
icon: " "
hide_table_of_contents: false
sidebar_position: 30
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) allows administrators to oversubscribe the physical resources on a host to
maximize the number of active workloads.

VM workloads typically have varying resource demands and peak utilization patterns. By oversubscribing resources, it is
possible to allocate them flexibly and take advantage of the fact that not all VMs will require their maximum allocation
simultaneously.

The hypervisor automatically over-commits CPU and memory. This means that more virtualized CPU and memory can be
allocated to VMs than there are physical resources on the system.

## Over-Commit CPUs

KubeVirt offers the `cpuAllocationRatio` in its Custom Resource Definitions (CRD). This ratio is used to normalize the
amount of CPU time the pod will request based on the number of virtual CPUs (vCPUs).

### Prerequisites

- An active VMO cluster in Palette.

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the cluster profile you used to create your VMO cluster.

4. Select the VMO add-on layer of the cluster profile.

5. Using the following algorithm, when `cpuAllocationRatio` is set to 1, the full amount of vCPUs are requested for the
   pod: `pod CPU request = number of vCPUs * 1/cpuAllocationRatio`. The `cpuAllocationRatio` is global, so setting it to
   greater than 1 has the effect of requesting less CPU from Kubernetes for each VM.

   Certain workloads that require a predictable latency and enhanced performance would benefit from obtaining dedicated
   CPU resources. KubeVirt relies on the Kubernetes CPU manager to pin vCPUs to the physical host’s CPUs. To learn more,
   refer to [Dedicated CPU Resources](https://kubevirt.io/user-guide/compute/dedicated_cpu_resources/) and
   [Resources Requests and Limits](https://kubevirt.io/user-guide/compute/virtual_hardware/#resources-requests-and-limits)
   Kubevirt documentation.

:::warning

- We do not recommend over-committing CPUs in a production environment without extensive testing. Applications that use
  100 percent of processing resources may become unstable in over-committed environments.

- Ensure you don't over-commit guest VMs on more than the physical number of processing cores. For example, a guest VM
  with four vCPUs should only be deployed on a host physical machine with a quad-core processor instead of a dual-core
  processor.

  We recommend no more than 10 total allocated vCPUs per physical processor core.

:::

## Over-Commit Memory

KubeVirt allows you to assign more or less memory to a VM than a VM requests to Kubernetes. You may want to overcommit
VM memory if you have a cluster or a few nodes that are dedicated to running VMs. In this case, overcommitting memory
makes use of all the memory in the nodes regardless of reserved or requested memory from the system.

To learn about options for memory overcommitment, refer to
[Node Overcommit](https://kubevirt.io/user-guide/compute/node_overcommit/) KubeVirt resource.

### Prerequisites

- An active VMO cluster in Palette.

### Procedure

KubeVirt provides several configurations to help you reduce the memory footprint and over-commit the
per-VirtualMachineInstance (VMI) memory overhead.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. Select the cluster profile you used to create your VMO cluster.

4. Select the VMO add-on layer of the cluster profile.

5. You have several options to select from:

- Enable guest overhead over-commit by setting `spec.domain.resources.overcommitGuestOverhead` to true.
- Enable guest memory by setting `spec.domain.memory.guest` to a value higher than
  `spec.domain.resources.requests.memory`, as shown in the example.

  ```yaml
  apiVersion: kubevirt.io/v1alpha3
  kind: VirtualMachineInstance
  metadata:
    name: testvmi-nocloud
  spec:
    terminationGracePeriodSeconds: 30
    domain:
      resources:
        overcommitGuestOverhead: true
        requests:
          memory: 1024M
      memory:
        guest: 2048M
  ```

- Enable implicit memory overcommit by setting `spec.configuration.developerConfiguration.memoryOvercommit` in the
  KubeVirt CRD to a percentage of the desired memory overcommit. This will set the memory overcommitment for all VMs in
  a VMO cluster.

  Within the VMO Pack, the path will be `charts.kubevirt.kubevirtResource.config.additionalDevConfig.memoryOvercommit`.

  :::info

  When setting `memoryOvercommit: "150"`, the memory request is not explicitly set. As a result, it will be implicitly
  set to reach memory overcommit of 150%. For example, when `spec.domain.memory.guest: 3072M`, the memory request is set
  to 2048M, if not otherwise set. Note that the actual memory request depends on additional configuration options such
  as `OvercommitGuestOverhead`.

  :::

## Resources

- [Dedicated CPU Resources](https://kubevirt.io/user-guide/compute/dedicated_cpu_resources/)

- [Resources Requests and Limits](https://kubevirt.io/user-guide/compute/virtual_hardware/#resources-requests-and-limits)

- [Node Overcommit](https://kubevirt.io/user-guide/compute/node_overcommit/)
