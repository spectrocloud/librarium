---
title: "Update VM Configuration"
metaTitle: "Update VM Configuration"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview


You can add storage and additional network interfaces to your virtual machines.

<br />

# Add Disk Storage

You can add storage to a virtual machine. KubeVirt allows hotplugging additional storage into a running virtual machine. Both block and file system volume types are supported.

To add a disk, navigate to the **Disks** tab in the virtual machine page and click the **Add disk** button.


Review the parameters and adapt accordingly, then click **Add**.

The interface type determines out-of-the-box support by the operating system (OS) and performances of the disk:
<br />

- **virtio**: Optimized for best performance, but the operating system may require additional Virtio drivers.


- **sata**: Most operating systems support Serial ATA (SATA). However it offers lower performance.


- **scsi**: A paravirtualized Internet Small Computer System Interface (iSCSI) HDD driver that offers similar functionality to the virtio-block device but with some additional enhancements. In particular, this driver supports adding hundreds of devices, and names devices using the standard SCSI device naming scheme.


# Add Network Interfaces

Similar to adding disks to a virtual machine, you can add additional network interfaces. 

By default, virtual machines use the native networking already configured in the pod. Typically, this means using the bridge option and your virtual machine has the same IP address as the pod. This approach makes interoperability possible. The VM can integrate with different cases like sidecar containers and pod masquerading. When using pod masquerading, you choose a CIDR for which VMs are not assigned a private IP, and instead use Network Address Translation (NAT) behind the pod IP.

Multus is a secondary network that uses Multus-CNI. Multus allows you to attach multiple network interfaces to pods in Kubernetes. If you use Multus as your network, ensure that Multus is installed across your cluster and that you have created a ``NetworkAttachmentDefinition`` CRD. For more information, refer to the [Multus CNI](/integrations/multus-cni) guide.

To interact with networking, navigate to the **Network Interfaces** tab on the virtual machine page and click the **Add network interface** button.

<br />

<WarningBox>

Multus allows hotplugging network interfaces only when interfaces use the **virtio** model connected through bridge binding.

</WarningBox>


