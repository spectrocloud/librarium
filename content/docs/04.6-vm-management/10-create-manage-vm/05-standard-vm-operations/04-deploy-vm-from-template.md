---
title: "Deploy VM From a Template"
metaTitle: "Deploy VM From a Template"
metaDescription: "Learn how to deploy a VM from a template using Spectro VM Dashboard."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You can deploy a virtual machine (VM) using Palette's out-of-the-box templates or templates that your organization's administrator provides.

# Prerequisites

- Configured Spectro VM Dashboard profile applied to your cluster. 

    Review [Create Spectro VM Dashboard Profile](/vm-management/vm-packs-profiles/create-vm-dashboard-profile) to configure the dashboard. To learn how to access the dashboard, refer to [Enable Spectro VM Dashboard](/vm-management/vm-packs-profiles/enable-vm-dashboard).

# Deploy VM from a Template

These steps will help guide you to deploy a VM from an out-of-the-box VM template.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, click **Clusters** and select the cluster you used to enable the Spectro VM Dashboard.


3. Click the **Virtual Machines** tab.


4. Select the appropriate namespace from the **drop-down Menu**.


5. From the **Virtual Machines** tab that appears when the Spectro VM Dashboard is enabled, click **New Virtual Machine**.


6. Click the **New Virtual Machine** button. Available templates are displayed based on supported Operating Systems (OS).


7. You can deploy from a template or create an empty VM as follows: 

    <br />

    - To deploy from a template, select one of the VM templates. These can be Palette's out-of-the-box templates or templates that you or your administrator created.

    - To create an empty VM, close the templates choice page and install the OS using a different method.

    <br />

8. Give the VM a name and specify memory and CPUs.


9. Optionally, you can enable the checkbox to start the VM automatically after creation.


10. Click the **Next** button, which displays the YAML file. Tooltip help is available when you hover over lines in the file. 


11. Review the YAML file and click the **Next** button when you are done. 


12. Click **Create Virtual Machine**.

    <br />

VM status will display as **Starting** for several minutes while the required resources are built and the image is pulled from the registry. If you did not enable the checkbox to start the VM automatically, VM status displays as **Stopped** until the VM is fully deployed. 

<br />

<WarningBox>

VMs do not self-heal. If a VM is running on a node that fails, the VM is re-scheduled to a different node. Similar to live migration, to provide high availability, the disks should be ``ReadWriteMany`` so that they can be mounted on other nodes when the VM is restarting.

</WarningBox>


# Validate

1. Log in to [Palette](https://console.spectroloud.com)


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster that contains your VMs to view its details page.


4. Click on the **Virtual Machines** tab. 


5. Review the list of VMs and ensure the new VM is displayed and has the status **Running**. 


# Next Steps

Try installing your applications. If the Guest Agent was not installed as part of the VM deployment, you can install the Guest Agent now. The Guest Agent displays additional details in the **Virtual Machines > Details** tab. 

You can update the VM configuration from the VM console or from tabs when you click on the VM. Learn about updates you can make in the [Update VM Configuration](/vm-management/create-manage-vm/standard-vm-operations/update-vm-configuration) guide.

<br />

<br />
