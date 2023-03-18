---
title: "Deploy a Virtual Machine"
metaTitle: "Deploy a Virtual Machine"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You can deploy a VM using templates that Palette provides out-of-the-box (or with other templates created by an organization administrator).

<WarningBox>

For legal reasons, Spectro Cloud cannot provide Windows templates. Instead, we provide sample templates you can use. 

<WarningBox>

# Prerequisites

- 
- 

# Enablement

These steps will guide you to deploy a virtual machine from a VM template.

1. From the relevant cluster, navigate to the Virtual Machines tab.
2. From the drop-down menu, select the appropriate namespace.
3. Click on New Virtual Machine
4. If you desire to deploy from a template, select one of the template listed. If you want to create an empty VM and install the OS with a different method, close the template windows.
5. Define a name for the VM and its characteristics (CPU, memory,
6. Select if the VM should be started automatically after the deployment.
7. Click Next.
8. (optional) The next screen allows you to interact directly with the definition of the VM in a YAML format. When finished, click Next.

Note: if you hover over a field name with the mouse, interactive help is available for that specific field.


9. In the review screen, click Create Virtual Machine.

The state will be “Starting” for some moment (while the required resources are built and the image pulled from the registry).

## High Availability

Virtual machines do not, by themselves, self-heal. If a virtual machine is running on a node that fails, the virtual machine is re-scheduled to a different node. 

Just like live migration, the disks should be ReadWriteMany so that they can be mounted on other nodes when the VM is restarting.


# Validation

This tells how they can verify VM was successfully created.

VM has a “Running” status


# Next Steps

Navigate to the Console tab in the virtual machine, and validate that the operating system is running and configured correctly.

Install the guest agent (if it was not already installed as part of the VM deployment). 

Install your applications and enjoy.
