---
title: "Spectro VM Dashboard"
metaTitle: "Spectro VM Dashboard"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

The Spectro VM Dashboard is a web console accessible from the **Virtual Machines** tab that appears on the cluster overview page when VM Management is enabled. It allows for standard VM operations.

The default view consists of a list of the virtual machines deployed in the selected namespace. The first time you see this view, it will appear blank. As you add virtual machines, they will be listed on this page. You can filter on VM status and search for VMs by their name or label.


At the top of the VM dashboard, a drop-down menu allows you to select the relevant namespace. Although it is fine to run VMs from the ‘default’ namespace, we recommend that you create at least one namespace dedicated to VMs. Refer to the [Create a Namespace for VMs](/vm-management/vm-packs-profiles/create-vm-namespace) guide.

You will find virtual machines actions by clicking on the 3 dots icon at the right of each line.

When clicking on a virtual machine name, you enter a new set of tabs, specific to that VM:

<br />

- **Overview** tab has general information about ...
- **Details** tab provides detailed information about the VM and its running guest operating system (OS) (if the Guest Agent is installed).
- **YAML** tab where you can interact with the VM definition in the form of a YAML file.
- **Events** tab ...
- **Console** tab allows you to access and interact with the VM console.
- **Network Interfaces** tab to add and manage network interfaces.
- **Disks** tab to add and manage different types of disks such as disk, CD, and LUN. 
- **Snapshots** to create new and manage existing snapshots. 





