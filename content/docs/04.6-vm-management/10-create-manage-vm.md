---
title: "Create and Manage VMs"
metaTitle: "Create and Manage VMs"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

With Palette’s VM Management feature, you can run and manage Virtual Machines (VMs) managed alongside containerized applications.

You can create a new VM three ways:

<br />

- Deploy a VM from template. Palette provides templates, or your organization may provide templates.


- Create an empty VM and install the operating system using a standard method, such as a Preboot Execution Environment (PXE) or optical disk image (ISO).


- Clone an existing VM. Refer to the [Create a VM Template](/vm-management/create-manage-vm/create-vm-template) guide.



Although no additional components are required in virtual machines, the Guest Agent (GA) is an optional component that can run inside a virtual machine and provide additional runtime information. 

Additionally, Virtio is a virtualization standard for network and disk device drivers where only the guest's device driver knows it is running in a virtual environment, and cooperates with the hypervisor. This enables guests to receive high performance network and disk operations and provides most of the performance benefits of paravirtualization.

<br />

<InfoBox>

We recommend installing ‘qemu-guest-agent’ to improve manageability of virtual machines, and Virtio drivers to ensure you can use the paravirtualized hardware properly.

</InfoBox>

<br />

<br />







