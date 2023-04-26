---
title: "Spectro VM Dashboard"
metaTitle: "Spectro VM Dashboard"
metaDescription: "Learn about the Spectro VM Dashboard web interface to manage VMs."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The Spectro VM Dashboard offers a web console accessible from the **Virtual Machines** tab that appears on the cluster overview page when VM Management is enabled. 

The first time you enable the dashboard, the default view will appear blank. Although you can deploy Virtual Machines (VMs) from the default namespace, we recommend creating at least one namespace dedicated to VMs. To learn how, refer to [Create a Namespace](). Namespaces will be listed in the **Namespace drop-down Menu** at the top of the dashboard. As you deploy VMs within a namespace, the VMs within the selected Namespace will be listed on the dashboard. 

You can select a VM from the list to view its details and perform actions on it. You can access standard VM operations from the **three-dot Menu** at the right of each listed VM, or from the **Actions drop-down Menu** that displays when you view VM details.

<br />

<InfoBox>

Below are benefits of deploying VMs in different namespaces:

* Namespaces provide a way to isolate groups of resources within a single cluster.
* RBAC can be configured based on namespaces, for example:
  * User A has permission to manage VMs only in the alpha namespace.
  * User B can see VMs in all namespaces.
* Resource names need to be unique within a namespace but not across namespaces.
* Namespaces are a way to divide cluster resources among multiple users via resource quota.

</InfoBox>

The dashboard allows you to perform standard VM actions from the **three-dot Menu** at the right of each listed VM. You can select a VM from the list to view details about the machine. An **Actions drop-down menu** lists the same standard VM actions. 

When you click on a VM in the list, the following tabs display. Tabs are specific to the selected VM.

<br />

- **Overview**: This tab has general information about the VM, such as its IP address, operating system, creation date and time zone, running status, active users, whether the guest agent is installed or not, the quantity of Network Interface Cards (NIC) and disks, and any recent events. 


- **Details**: Provides additional VM details such as labels associated with the VM, pod information, scheduling and resource requirements, and CPU and memory. If the QEMU Guest Agent is not installed, **Not Available** displays in place of details that would otherwise be available to you.


- **YAML**: From here you can view and change the VM configuration.


- **Events**: Displays streaming events in the VM. Any standard operations you perform on the VM are captured here.  


- **Console**: Allows you to access and interact with the VM through its console. If you are not using a template, you can configure the VM using the console.


- **Network Interfaces**: Allows you to add and manage network interfaces. By default, the Pod Networking interface is a masquerade type interface, or in simple terms, it's a one-to-many IP address translation. You can change this to be a Bridge or other type interface.


- **Disks**: Allows you to add and manage disks. You can update the disk size, specify type `Disk`, `CD-ROM`, or `LUN`, and specify the interface `virtuo`, `sata`, or `scsi`.  By default, `spectro-storage-class` is applied to the disk.


- **Snapshots**: Allows you to take a new snapshot and manage existing ones. 

