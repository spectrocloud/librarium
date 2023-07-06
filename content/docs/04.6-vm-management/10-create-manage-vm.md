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

Palette’s VM Management solution allows you to deploy and manage Virtual Machines (VMs) alongside containerized applications.


There are three ways you can create a new VM:


<br />

- Deploy a VM from a template. Palette provides out-of-the-box templates, or your organization may provide templates. For the latter, refer to the [Create a VM Template](/vm-management/create-manage-vm/create-vm-template) guide.


- Create an empty VM and install the Operating System (OS) using a standard method, such as a Preboot Execution Environment (PXE) or optical disk image (ISO).


- Clone an existing VM.

Administrators can also import VMs from their existing VMware vSphere environment into Palette.

Although no additional components are required in VMs, the **QEMU Guest Agent** is an optional component that runs inside a VM and provides runtime information. 

Additionally, Virtio is a virtualization standard for network and disk device drivers where only the guest's device driver knows it is deployed in a virtual environment, and cooperates with the hypervisor. This enables guests to receive high performance network and disk operations and provides most of the performance benefits of paravirtualization.

<br />

<WarningBox>

We recommend installing ``qemu-guest-agent`` to improve VM management. We also recommend installing Virtio drivers to ensure you can use the paravirtualized hardware properly.

</WarningBox>



# Resources

- [Standard VM Operations](/vm-management/create-manage-vm/standard-vm-operations)


- [Create a VM Template](/vm-management/create-manage-vm/create-vm-template)


<br />


<br />

<br />


<br />

<br />


