---
title: "Create and Manage VMs"
metaTitle: "Create and Manage VMs"
metaDescription: "Learn methods to create VMs using Palette's Spectro VM Dashboard."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

With Palette’s VM Management feature, you can run and manage Virtual Machines (VMs) alongside containerized applications.

You can create a new VM three different ways:

<br />

- Deploy a VM from a template. Palette provides out-of-the-box templates, or your organization may provide templates. For the latter, refer to the [Create a VM Template](/vm-management/create-manage-vm/create-vm-template) guide.


- Create an empty VM and install the Operating System (OS) using a standard method, such as a Preboot Execution Environment (PXE) or optical disk image (ISO).


- Clone an existing VM.

Administrators can also import virtual machines from their existing VMware vSphere environment into Palette.

Although no additional components are required in VMs, the **QEMU Guest Agent** is an optional component that runs inside a VM and provides runtime information. 

Additionally, Virtio is a virtualization standard for network and disk device drivers where only the guest's device driver knows it is running in a virtual environment, and cooperates with the hypervisor. This enables guests to receive high performance network and disk operations and provides most of the performance benefits of paravirtualization.

<br />

<WarningBox>

We recommend installing ``qemu-guest-agent`` to improve manageability of virtual machines. We also recommend installing Virtio drivers to ensure you can use the paravirtualized hardware properly.

</WarningBox>

<br />

<br />


# Resources

- [Standard VM Operations](/vm-management/create-manage-vm/standard-vm-operations)


- [Create a VM Template](/vm-management/create-manage-vm/create-vm-template)


<br />


<br />

<br />


<br />

<br />


