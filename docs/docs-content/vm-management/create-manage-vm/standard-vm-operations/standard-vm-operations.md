---
sidebar_label: "Standard VM Operations"
title: "Standard VM Operations"
description: "Learn about standard VM operations that you can perform using Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
tags: ["vmo"]
---



Palette Virtual Machine Orchestrator (VMO) supports standard VM power operations: 

<br />

- **Start**


- **Stop** 


- **Pause** 


- **Restart** 
 

From the **Virtual Machines** tab, you can select a VM to view its details and perform standard VM operations, such as live migration (vMotion), snapshots, and cloning. VM operations are accessible from the **three-dot Menu** at the right of each listed VM.

When you select a VM from the **Clusters** > **Virtual Machines** tab, the following tabs display. Tabs are specific to the selected VM.

<br />

- **Overview**: Provides general information about the VM, such as its IP address, operating system, creation date and time zone, status, active users, whether the guest agent is installed or not, the quantity of Network Interface Cards (NIC) and disks, and any recent events. 


- **Details**: Provides additional VM details such as labels associated with the VM, pod information, scheduling and resource requirements, and CPU and memory. If the QEMU Guest Agent is not installed, **Not Available** displays in place of details that would otherwise be available to you.


- **YAML**: You can review and change the VM configuration from here.


- **Events**: Displays streaming events in the VM. Any standard operations you perform on the VM are captured here.  


- **Console**: Allows you to access and interact with the VM through its console. If you are not using a template, you can configure the VM using the console.


- **Network Interfaces**: Allows you to add and manage network interfaces. By default, the Pod Networking interface is a masquerade type interface, or in simple terms, it's a one-to-many IP address translation. You can change this to be a Bridge or other interface type.


- **Disks**: Allows you to add and manage disks. You can update the disk size, specify type `Disk`, `CD-ROM`, or `LUN`, and specify the interface `virtuo`, `sata`, or `scsi`.  By default, `spectro-storage-class` is applied to the disk.


- **Snapshots**: Allows you to take a new snapshot of a VM's disk file at a given point in time and manage existing snapshots. 



 
## Resources

- [Deploy VM From a Template](deploy-vm-from-template.md)


- [Update VM Configuration](update-vm-configuration.md)


- [Migrate VM to a Different Node](migrate-vm-to-different-node.md)


- [Take a VM Snapshot](take-snapshot-of-vm.md)


- [Clone a VM](clone-vm.md)