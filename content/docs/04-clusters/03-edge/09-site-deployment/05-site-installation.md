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

You perform a  site installation by powering on the Edge host. The Edge Installer will start and begin the installation process, which may vary depending on your environment and Edge host type.  

# Installation Phases

The Edge host installation is made up of the following three phases.

| Phase| Description|
| ---| ---|
| Install Handoff | The Edge Installer is copied over from a portable storage device to the Edhe host's hard disk. This step is typically performed in the preparation step. Refer to [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) to learn more.|
| Registration |  The Edge host is registered with Palette. The Edge host will remain in this phase until the registration process is complete.|
|Cluster Provisioning | The Edge host boots into the specified provider OS and proceeds with the cluster deployment.|

Ideally, all Edge hosts have completed the *Install Handoff* phase when they arrive at the installation site.

# Site User Data

You can provide a site-specific Edge Installer configuration user-data if you need to apply new values or override default values from the Edge Installer user-data that was created in the Installer Handoff phase. 
Follow the steps outlined in the [Build User Data ISO](/clusters/edge/site-deployment/prepare-edge-configuration#builduserdataiso) resource to create a site-specific user-data. 

# Installation

Use the following steps to complete the Edge host installation.

<br />

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

1. If you have a site-specific user-data ISO, then insert the USB stick into the Edge host.


2. Power on the Edge host. The Edge host will boot into registration mode where it will connect with the Palette endpoint that was specified in the user-data.


3. If you provided the Edge Installer user-data with an `EdgeHostToken` then the Edge host will automatically register with Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register the Edge host with Palette. Review the [Register Edge Host](/clusters/edge/site-deployment/edge-host-registration) for additional guidance.

    <br />

    <InfoBox>

    Once the Edge host is registered, the Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    </InfoBox>

4. Log in to [Palette](https://console.spectrocloud.com).


5. Navigate to the left **Main Menu** and select **Clusters**.


6. Click on **Add New Cluster**.


7.


4. . Once the cluster is defined, installation will proceeed, with the host agent downloading required artifacts and rebooting itself.

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
