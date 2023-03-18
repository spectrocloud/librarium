---
title: "Update the VM Configuration"
metaTitle: "Update VM Configuration"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


* Overview

Virtual machines support a wide variety of attributes: you can for example change the number of vCPU, the amount ot memory, disks, network ports, etc.

KubeVirt allows hotplugging additional storage into a running VM. Both block and file system volume types are supported.

To add a disk, navigate to the Disks tab in the virtual machine page and click the “Add disk” button.


Review the parameter and adapt accordingly and click **Add**.

The interface type will determine out of the box supportability by the operating system and performances of the disk:
virtio: optimized for best performance, but the operating may require additional drivers (Virtio).
sata: supported by the most operating systems but offers lower performance
scsi: paravirtualized iSCSI HDD driver offers similar functionality to the virtio-block device, with some additional enhancements. In particular, this driver supports adding hundreds of devices, and names devices using the standard SCSI device naming scheme.

Just like disks, you can add additional network interfaces to a virtual machine.

By default, the VMs use the native networking already configured in the pod. Typically, this means that the bridge option is selected, and your VM has the IP address of the pod. This approach makes interoperability possible. The VM can integrate with different cases like sidecar containers and pod masquerading. When using pod masquerading, there is a defined CIDR chosen by yourself for which VMs are not assigned a private IP, and instead use NAT behind the pod IP.

Multus is a secondary network that uses Multus-CNI. Multus allows a user to attach multiple network interfaces to pods in Kubernetes. If you use Multus as your network, you need to ensure that you have installed Multus across your cluster and that you have created a NetworkAttachmentDefinition CRD.

To interact with networking, navigate to the Network Interfaces tab in the virtual machine page and click the “Add network interface” button.
Note: hotplugging network interfacesis only supported for interfaces using the virtio model connected through bridge binding.


