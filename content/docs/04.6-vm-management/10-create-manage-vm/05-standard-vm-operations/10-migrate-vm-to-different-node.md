---
title: "Migrate VM to a Different Node"
metaTitle: "Migrate VM to a Different Node"
metaDescription: "Learn how to migrate a VM from node to node using Palette."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Live migration is a process in which a running virtual machine (VM) moves to another cluster node while the guest workload continues to run. During live migration, the VM remains accessible.

Successful live migrations rely on appropriately configured storage and networking and must be enabled as a feature gate. Live migration is enabled by default in the ``feature-gates`` field of the kubevirt configuration file in the Spectro VM Dashboard pack. Refer to [Feature Gates](/vm-management#featuregates).

Consider the following when migrating a VM node:

<br />


- VMs that do not use persistent storage, such as containerDisks, may be live migrated.


- Other interfaces, such as those that Multus grants, may use a bridge interface for the purposes of live migration.


# Prerequisites

- VMs that use a Persistent Volume Claim (PVC) must have a shared ReadWriteMany (RWX) access mode. 


- A VM’s pod network cannot use a bridge interface. Disable the bridge interface on the pod network.


<InfoBox>

The default network interface type is a Bridge interface.

</InfoBox>


# Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, click **Clusters** and click on your cluster. 


3. Click the **Virtual Machines** tab.


4. From the **three-dotMenu** or the **Actions drop-down Menu** for a selected VM, click **Migrate Node to Node**.


# Validation

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, click **Clusters** and click on your cluster. 


3. Navigate to  the **Virtual Machines** tab, and click the VM that you migrated. 


4. Click the **Details** tab.


5. Verify the name and IP address of the new node is changed.





