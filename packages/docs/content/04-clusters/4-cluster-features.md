---
title: "Policies"
metaTitle: "Features of Spectro Cloud  Clusters"
metaDescription: "Spectro Cloud Features"
icon: "cogs"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Cluster Policies

Cluster policies are features of clusters which brings in lot of performance merits to the tenant clusters. Spectro Cloud brings in lots of policies to the workload clusters to maximize the availability, reliability, security, patching and updates. 

<Tabs identifier="Feature Name">

<Tabs. TabPane tab="OS Patching" key="OS">

## OS Patching

Spectro cloud  provides OS patching essentially as a preventative maintenance necessary to keep machines up-to-date, stable and safe by taking care of system security.

###  OS Patching Options
There are multiple options available for OS Patching. Users can make their choice to OS patch while creating a cluster and also for a running cluster. The options available are:

#### Patch OS on Boot
During the cluster creation, while configuring the cluster (Cluster Configuration) , the user can select “Patch OS on boot”. In this case patching will be applied  to the tenant cluster with the initial $

#### OS Patching Schedule
With this option the user can schedule OS patching while creating the cluster as well as when the cluster is in running state. OS Patching Schedule comes with several options like,

* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Never.
* Custom os patch for exact month,day and hour and minute of user’s choice.

#### Patch Now
This option is valid only for running tenant clusters. In this case the OS patching will  apply to the running cluster immediately.

### How to Schedule


* During Cluster Creation:
<InfoBox>
Cluster Configuration -> “OS Patching Schedule” or "Patch on Boot".
</InfoBox>

* For a Running Cluster:
<InfoBox>
Clusters -> Settings -> Machine Management -> "OS Patching Schedule" or "Patch Now".
</InfoBox>



</Tabs. TabPane>

</Tabs>
