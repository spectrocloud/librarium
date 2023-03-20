---
title: "Spectro VM Dashboard"
metaTitle: "Spectro VM Dashboard"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The Spectro VM Dashboard offers a web console accessible from the **Virtual Machines** tab that appears on the cluster overview page when VM Management is enabled. 

When the dashboard is enabled, the default view displays a list of the Virtual Machines (VMs) deployed in the selected namespace. The first time you see this view, it will appear blank. As you add VMs, they will be listed on the page. You can filter on VM status and search for VMs by their name or label.

At the top of the Spectro VM Dashboard, the **Name drop-down Menu** allows you to select a namespace. Although you can deploy virtual machines from the default namespace, we recommend creating at least one namespace dedicated to VMs.

<WarningBox>

There are multiple benefits of deploying VMs in different namespaces:

* Namespaces provide a way to isolate groups of resources within a single cluster.
* RBAC can be configured based on namespaces, for example:
  * Clark Kent has permissions to manage VMs in alpha namespace only.
  * Bruce Wayne can see VMs from all namespaces.
* Names of resources need to be unique within a namespace, but not across namespaces.
* Namespaces are a way to divide cluster resources between multiple users (via resource quota).

</WarningBox>

The dashboard allows you to perform standard VM actions from the **three-dot Menu** at the right of each listed VM. You can select a VM from the list to view details about the machine. An **Actions drop-down menu** lists the same standard VM actions. 

When you click on a VM in the list, the following tabs display, which are specific to the selected VM:

<br />

- **Overview**: The **Overview** tab has general information about the VM such as its IP address, operating system, creation date and time zone, running status, active users, whether the guest agent is installed or not, quantity of Network Interface Cards (NIC) and disks, and any recent events. 


- **Details**: Provides additonal VM details such as labels associated with the VM, pod information, scheduling and resource requirements, and CPU and memory. If the QEMU Guest Agent is not installed, *Not Available* displays in place of details that would otherwise be available to you.


- **YAML**: From here you can change the VM configuration.


- **Events**: Displays streaming events in the VM. Any standard operations you perform on the VM are captured here.  


- **Console**: Allows you to access and interact with the VM through its console. If you are not using a template, you can configure the VM using the console.


- **Network Interfaces**: Allows you to add and manage network interfaces. By default, the Pod Networking interface is a masquerade type interface. You can change this to be a Bridge or other type interface.


- **Disks**: Allows you to add and manage disks. You can update the disk size, specify type (`Disk`, `CD-ROM`, or `LUN`), and specify the interface (`virtuo`, `sata`, or `scsi`).  By default, `spectro-storage-class` is applied to the disk.


- **Snapshots**: Allows you to take a new snapshot and manage existing ones. 

