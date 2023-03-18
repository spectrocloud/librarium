---
title: "Migrate a VM to a Different Node"
metaTitle: "Migrate VM to a Different Node"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Live migration is a process during which a running VM moves to another cluster node while the guest workload continues to run and remain accessible.

Successful live migrations are relying on appropriately configured storage and networking. Live Migration must be first enabled in the feature-gates to be supported. The feature-gates field resides in the kubevirt config in the Spectro VM Dashboard pack.

Considerations:

Virtual machines using a PersistentVolumeClaim (PVC) must have a shared ReadWriteMany (RWX) access mode to be live migrated.
VMs not using persistent storage, such as containerDisks may be Live Migrated.
Live Migration is not allowed when the VM’s pod network uses a bridge interface. Note: The default network interface type is a bridge interface.
Other interfaces, such as those granted by Multus may use a bridge interface for the purposes of live migration.

From the drop-down Actions menu, select ‘Migrate Node to Node’.


