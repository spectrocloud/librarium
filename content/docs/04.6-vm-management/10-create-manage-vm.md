---
title: "Create and Manage VMs"
metaTitle: "Create and Manage VMs"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

With Palette’s VM Management feature, virtual machines can run and be managed alongside containerized applications.

Within the new Virtual Machine in cluster enabled for VM Management, organizations can onboard, deploy, manage, and scale VMs.

Multiple solutions are available to create new VMs:


- Deploy a VM from a pre-existing template (template either provided by Spectro Cloud or created by your organization)


- Create an empty VM and install the operating system using a standard mechanism (PXE, ISO, etc.)


- Clone an existing VM (link to the relevant section)

<br />

Although no additional components are required within virtual machines, the Guest Agent (GA) is an optional component that can run inside of VMs and which provides additional runtime information about the running operating system (such as but not limited to, guest info, interfaces info, etc.).

Additionally, Virtio is a virtualization standard for network and disk device drivers where just the guest's device driver "knows" it is running in a virtual environment, and cooperates with the hypervisor. This enables guests to get high performance network and disk operations, and gives most of the performance benefits of paravirtualization.

Note: We recommend installing ‘qemu-guest-agent’ to improve manageability of virtual machines, and Virtio drivers to ensure you can use the paravirtualized hardware properly.







