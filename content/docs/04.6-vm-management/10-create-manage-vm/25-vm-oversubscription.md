---
title: "VM Oversubscription"
metaTitle: "VM Oversubscription"
metaDescription: "Learn about oversubscribing virtual machine CPU and Memory in Palette to maximize resource allocation."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Palette Virtual Machine Management utilizes oversubscription, also called overcommitment, to tune performance in your virtual environment. This allows administrators to oversubscribe the physical resources on a host in order to maximize the number of workloads that can run on a host. 

VM workloads typically have varying resource demands and peak utilization patterns. By oversubscribing resources, it is possible to allocate them flexibly and take advantage of the fact that not all VMs will require their maximum allocation simultaneously. 

The hypervisor automatically overcommits CPU and memory. This means that more virtualized CPU and memory can be allocated to VMs than there are physical resources on the system. 

<br />

## CPU Overcommit

Kubevirt offers the `cpuAllocationRatio` in its Custom Resource Definitions (CRD). This ratio is used to normalize the amount of CPU time the pod will request based on the number of virtual CPUs (vCPUs). 

Using the following algorithm, when `cpuAllocationRatio` is set to 1, the full amount of vCPUs are requested for the pod: `pod CPU request = number of vCPUs * 1/cpuAllocationRatio`.

The `cpuAllocationRatio` is global, so setting it to greater than 1 has the effect of requesting less CPU from Kubernetes for each VM.

Consider the following before overcommitting CPU:

<br />

- Certain workloads that require a predictable latency and enhanced performance would benefit from obtaining dedicated CPU resources. KubeVirt relies on the Kubernetes CPU manager to pin vCPUs to the physical host’s CPUs. To learn more, refer to [Dedicated CPU Resources](https://kubevirt.io/user-guide/virtual_machines/dedicated_cpu_resources/) and [Resources Requests and Limits](https://kubevirt.io/user-guide/virtual_machines/virtual_hardware/#resources-requests-and-limits) Kubevirt documentation.


- Virtualized CPUs (vCPUs) are best overcommitted when a single host physical machine has multiple guest VMs that do not share the same vCPU. A Kernel-based Virtual Machine (KVM) should safely support guest VMs with loads under 100 percent at a ratio of five VCPUs on five VMs to one physical CPU on a single host physical machine.

<br />

<WarningBox>

- It is not advisable to overcommit CPUs in a production environment without extensive testing. Applications that use 100 percent of processing resources may become unstable in overcommitted environments.


- Take care not to overcommit guest VMs on more than the physical number of processing cores. For example, a guest VM with four vCPUs should only be run on a host physical machine with a quad-core processor, as opposed to a dual-core processor. 

    We recommend no more than 10 total allocated vCPUs per physical processor core.
    
</WarningBox>

<br />

## Memory Overcommit

KubeVirt allows you to assign more or less memory to a VM than a VM requests to Kubernetes. You may want to overcommit VM memory if you have a cluster or a few nodes that are dedicated to running VMs. In this case, overcommitting memory makes use of all the memory in the nodes regardless of reserved or requested memory from the system.

To learn about options for memory overcommitment, refer to [Node Overcommit](https://kubevirt.io/user-guide/operations/node_overcommit/) KubeVirt resource.

When overcommitting memory, set the following parameters as shown. 

- Disable the graphic device by setting `spec.domain.devices.autoattachGraphicsDevice` to false.


- Enable guest overhead overcommit by setting `spec.domain.resources.overcommitGuestOverhead` to true.


- Enable guest memory by setting `spec.domain.memory.guest` to a value higher than `spec.domain.resources.requests.memory`, as shown in the example.

```
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

<br />

- Enable implicit memory overcommit by setting `spec.configuration.developerConfiguration.memoryOvercommit` in the KubeVirt CRD to a percentage of the desired memory overcommit.

# Resources

- [Dedicated CPU Resources](https://kubevirt.io/user-guide/virtual_machines/dedicated_cpu_resources/)


- [Resources Requests and Limits](https://kubevirt.io/user-guide/virtual_machines/virtual_hardware/#resources-requests-and-limits)


- [Node Overcommit](https://kubevirt.io/user-guide/operations/node_overcommit/)