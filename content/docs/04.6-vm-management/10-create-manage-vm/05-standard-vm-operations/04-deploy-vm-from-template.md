---
title: "Deploy VM From a Template"
metaTitle: "Deploy VM From a Template"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You can deploy a VM using Palette's out-of-the-box templates or templates that your organization's administrator provides.

# Prerequisites

- Configured Spectro VM Dashboard applied to your MAAS cluster.

# Enablement

These steps will guide you to deploy a Virtual Machine (VM) from an out-of-the-box VM template.

1. From the left **Main Menu**, click **Clusters** and select the MAAS cluster you used to enable the Spectro VM Dashboard.


2. Click the **Virtual Machines** tab.


3. Select the appropriate namespace from the **drop-down Menu**.


4. From the **Virtual Machines** tab that appears when the Spectro VM Dashboard is enabled, click **New Virtual Machine**.**


5. Click the **New Virtual Machine** button. Available templates are displayed based on supported operating systems (OS).


6. You can deploy from a template or create an empty VM as follows: 

    <br />

    - To deploy from a template, select one of the VM templates. These can be Palette's out-of-the-box templates or templates that you or your administrator created.

    - To create an empty VM, close the templates choice page and install the OS using a different method.

    <br />

7. Give the VM a name and specify memory and CPUs.


6. Optionally, you can enable the checkbox to start the VM automatically after creation.


7. Click the **Next** button, which display the YAML file. Tool tip help is available when you hover over lines in the file. 


8. Review the YAML file and click the **Next** button when you are done. 


9. Click **Create Virtual Machine**.

    <br />

    VM status will display as **Starting** for several minutes while the required resources are built and the image is pulled from the registry. If you did not enable the checkbox to start the VM automatically, VM status displays as **Stopped** until the VM is fully deployed. 

<WarningBox>

VMs do not self heal. If a VM is running on a node that fails, the VM is re-scheduled to a different node. 

Similar to live migration, to provide high availability, the disks should be ``ReadWriteMany`` so that they can be mounted on other nodes when the VM is restarting.

</WarningBox>


# Validation

On the **Virtual Machines** tab that displays after you click **Create Virtual Machines**, you should see the new VM listed with **Running** status. 


# Next Steps

Click the **Console** tab in the VM, and validate the operating system is running and configured correctly. 

Try installing your applications. If the Guest Agent was not installed as part of the VM deployment, you can install the Guest Agent now. The Guest Agent displays additional details in the **Virtual Machines > Details** tab. 

You can also update the VM configuration from the VM console if desired. 

<br />

<br />
