---
title: "Add VM and Update the Configuration"
metaTitle: "Add VM and Update the Configuration"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Add a new Virtual Machine (VM) and update the VMs configuration to change the number of Virtual CPUs (vCPUs), memory, number of disks, network ports and more.

# Prerequisites

- Configured Spectro VM Dashboard applied to your MAAS cluster.

# Enablement

1. From the **Virtual Machines** tab that appears when the Spectro VM Dashboard is enabled, click **New Virtual Machine**.


2. Select one of the templates that displays.


3. You can enable the checkbox to start the VM automatically after creation if desired.


4. Click the **Next** button to display the YAML button. 


5. Review the YAML file and click the **Next** button when you are done. Tool tips display when you hover over lines in the file.


6. Click **Create Virtual Machine**. The VM shows **??** status while it is being created.


## UPpate the Configuration


KubeVirt allows hotplugging additional storage into a running virtual machine. Both block and file system volume types are supported.

To add a disk, navigate to the **Disks** tab in the virtual machine page and click the **Add disk** button.


Review the parametera and adapt accordingly, then click **Add**.

The interface type determines out-of-the-box support by the operating system and performances of the disk:

<br />

- **virtio**: optimized for best performance, but the operating may require additional drivers (Virtio).


- **sata**: supported by the most operating systems but offers lower performance


- **scsi**: paravirtualized iSCSI HDD driver offers similar functionality to the virtio-block device, with some additional enhancements. In particular, this driver supports adding hundreds of devices, and names devices using the standard SCSI device naming scheme.

<br />

Similar to adding disks to a virtual machine, you can add additional network interfaces.

By default, virtual machines use the native networking already configured in the pod. Typically, this means that the bridge option is selected, and your virtual machine has the IP address of the pod. This approach makes interoperability possible. The VM can integrate with different cases like sidecar containers and pod masquerading. When using pod masquerading, you choose a CIDR for which VMs are not assigned a private IP, and instead use Network Address Translation (NAT) behind the pod IP.

Multus is a secondary network that uses Multus-CNI. Multus allows a user to attach multiple network interfaces to pods in Kubernetes. If you use Multus as your network, ensure that Multus is installed across your cluster and that you have created a ``NetworkAttachmentDefinition`` CRD.

To interact with networking, navigate to the **Network Interfaces** tab in the virtual machine page and click the **Add network interface** button.

Note: hotplugging network interfaces is only supported for interfaces using the **virtio** model connected through bridge binding.


