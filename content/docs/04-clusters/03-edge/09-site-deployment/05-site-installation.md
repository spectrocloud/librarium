---
title: "Perform Site Install"
metaTitle: "Run the Palette edge installer on all your edge hosts "
metaDescription: "Learn how to run the Palette Edge installer on your edge hosts "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Site installation is performed by booting your edge host into the Palette Edge Installer.The installation procedure will vary based on your environment and edge host type.

# Edge Host Installation Phases

Installtion on the edge hosts, consists of the followig 3 phases. The install hand-off phase described below, is typically performed in the preparation step.

- Phase 1 - Install Hand-off: Installer is copied over from a portable storage device to the hard disk
- Phase 2 - Registration: Edge host waits for registration with Palette Management Console and cluster definition
- Phase 3 - Cluster Provisioning: Edge host boots into the desired provider OS and proceeds with cluster deployment.

At the site, we are provided an edge host which has already undergone install hand off. The edge host boots directly into the registration phase.

# Site User Data

To provide additional site specific installer configruation, create a user-data yaml file and generate an ISO file by running the following command:

```
touch meta-data
mkisofs -output $USER_DATA_ISO_NAME -volid cidata -joliet -rock user-data meta-data
```

Transfer your site user-data ISO file to a USB drive to be used during installation.

# Installation

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

Insert the site USB disk containing your user-data ISO , into the  edge host will boot into the registration mode where it will connect to the Palette Management Console that was specified in the user-data. If auto-registration was setup, the node will automatically registed with Palette Management Console, otherwise it will wait for edge host information to manually entered in the Palette Management Console through the Edge Host Management UI.  One registered, the system will wait for a cluster to be defined in the Palette Management Console. Once the cluster is defined, installation will proceeed, with the host agent downloading required artifacts and rebooting itself.

In this phase, the system boots into the OS defined in the cluster profile and cluster configuration begins. K8s components are initialized and configured based on the specifications in the cluster profile. If content bundles were provided (via USB or embedded in a custom installer), they are extracted and loaded into the container runtime process.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

At the site, we will be recieve an OVF template which has undergone install-hand off. Perform the following steps to proceed with installation at the site in your VMware environment.

1. Navigate to VMs and Templates. Right-Click on the desired folder and selecth the option to Deploy VM(s) from this OVF template .

2. Provide the location of the OVF template and start deployment

3. Proceed through the installation steps and deploy the VM(s)

The VMs will start up into the registration phase and wait for registration and cluster definition to be performed in the Palette Management Console. Once those steps are complete on the Palette Management Console, the VM(s) will reboot.

In this phase, the system boots into the OS defined in the cluster profile and cluster configuration begins. K8s components are initialized and configured based on the specifications in the cluster profile. If content bundles were provided (via USB or embedded in a custom installer), they are extracted and loaded into the container runtime process.

</Tabs.TabPane>

</Tabs>
