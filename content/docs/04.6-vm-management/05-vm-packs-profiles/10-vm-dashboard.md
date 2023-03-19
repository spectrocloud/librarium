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

The Spectro VM Dashboard is a web console accessible from the **Virtual Machines** tab that appears on the cluster overview page when VM Management is enabled. 

The dashboard's default view displays a list of the virtual machines deployed in the selected namespace. The first time you see this view, it will appear blank. As you add virtual machines, they will be listed on the page. You can filter on VM status and search for VMs by their name or label.

At the top of the Spectro VM Dashboard, a drop-down menu allows you to select the a namespace. Although you can run virtual machines from the default namespace, we recommend creating at least one namespace dedicated to VMs. For information, you can review the [Create a Namespace for VMs](/vm-management/vm-packs-profiles/create-vm-namespace) guide.

The dashboard allows you to perform standard virtual machine actions from the **three-dot Menu** at the right of each listed VM.




COME BACK TO THIS:
<br />
When you select a virtual machine name, you enter a new set of tabs, specific to that VM:

<br />

- **Overview** tab has general information about ...
- **Details** tab provides detailed information about the VM and its running guest operating system (OS) (if the Guest Agent is installed).
- **YAML** tab where you can interact with the VM definition in the form of a YAML file.
- **Events** tab ...
- **Console** tab allows you to access and interact with the VM console.
- **Network Interfaces** tab to add and manage network interfaces.
- **Disks** tab to add and manage different types of disks such as disk, CD, and LUN. 
- **Snapshots** to create new and manage existing snapshots. 










