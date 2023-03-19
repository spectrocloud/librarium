---
title: "Migrate VM to a Different Node"
metaTitle: "Migrate VM to a Different Node"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Live migration is a process during which a running virtual machine (VM) moves to another cluster node while the guest workload continues to run. During this time, the VM remains accessible.

Successful live migrations rely on appropriately configured storage and networking and must be enabled as a feature gate. Enable live migration in the ``feature-gates`` field of the kubevirt configuration file in the Spectro VM Dashboard pack.

Consider the following when migrating a VM node:

<br />

- VMs that use a Persistent Volume Claim (PVC) must have a shared ReadWriteMany (RWX) access mode to be live migrated.


- VMs that do not use persistent storage, such as containerDisks, may be Live Migrateed.


- Live Migration is not allowed when the VM’s pod network uses a bridge interface. 

<br />



<br />

- Other interfaces, such as those that Multus grants, may use a bridge interface for the purposes of live migration.


# Prerequisites

- VMs that use a Persistent Volume Claim (PVC) must have a a shared ReadWriteMany (RWX) access mode. VMs that do not use persistent storage, such as containerDisks, may be Live Migrateed.


- A VM’s pod network cannot use a bridge interface. Disable the bridge interface on the pod network.


<WarningBox>

The default network interface type is a bridge interface.

</WarningBox>

- 

# Enablement

1. From the **three-dotMenu** or the **Actions drop-down Menu** for a selected VM, click **Migrate Node to Node**.


# Validation




