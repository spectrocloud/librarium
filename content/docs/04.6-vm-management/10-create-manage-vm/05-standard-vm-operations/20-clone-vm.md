---
title: "Clone a VM"
metaTitle: "Clone a VM"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview


A VM clone is a copy of an existing, or parent, virtual machine (VM). The cloned VM has the same configuration settings and identifiers as the parent VM. After you clone a VM, it as a separate virtual machine.

Cloning is a quick way to create a new virtual machine that shares the same properties as the parent. You may want to clone a VM for the following reasons:

<br />

- Software testing - developers can clone a running VM to test new changes to their code. 


- Forensics - security administators can clone an infected machine and connect it to an air-gaped network to investigate the source of the infection while the parent VM can be destroyed or remediated.


# Prerequisites

- A parent VM from which to clone.

# Enablement

1. From the **three-dot Menu** or the **Actions drop-down Menu** when you select the VM, power off the parent VM. If you forget to power it off, the parent VM will automatically be powered off while cloning is in progress.


2. From the **three-dot Menu** or the **Actions drop-down Menu** when you select the VM, click **Clone**.


3. Give the clone a name, give an optional description, and select a namespace.  


4. Optionally, you can enable the checkbox to start the cloned VM automatically when cloning is complete.


# Validation

On the **Virtual Machines** tab, you should see the cloned VM listed with **Running** status. 






