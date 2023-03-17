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

 

CREATE NAMESPACE 
At the top of the VM dashboard, a drop-down menu allows you to select the relevant namespace.

Although it is fine to run VMs from the ‘default’ namespace, we recommend that you create at least one namespace dedicated to VMs. 

There are multiple benefits of deploying VMs in different namespaces:

- Namespaces provide a way to isolate groups of resources within a single cluster.


- RBAC can be configured based on namespaces, for example:

    - Clark Kent has permissions to manage VMs in alpha namespace only.
    - Bruce Wayne can see VMs from all namespaces.


- Names of resources need to be unique within a namespace, but not across namespaces.


- Namespaces are a way to divide cluster resources between multiple users (via resource quota).

The default view consists of a list of the virtual machines deployed in the selected namespace. You can filter between VM status and also search for specific VM names or by labels.

You will find virtual machines actions by clicking on the 3 dots icon at the right of each line.

When clicking on a virtual machine name, you enter a new set of tabs, specific to that VM:


- **Overview** with general information
- Details which provides all detailed information about the VM and its running guest OS (if the Guest Agent is installed)
- YAML where you can interact with the VM definition in the form of a YAML file
- Events
- Console to access and interact with the VM console
- Network Interfaces to add and manage network interfaces
- Disks to add and manage all types of disks (disk, CD, LUN)
- Snapshots to create new and manage existing snapshots


