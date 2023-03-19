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

You perform a site installation by powering on the Edge host. The Edge Installer will start and begin the installation process, which may vary depending on your environment and Edge host type.  

# Installation Phases

The Edge host installation has three phases, as described in the table.

| Phase| Description|
| ---| ---|
| Install Handoff | The Edge Installer is copied over from a portable storage device to the Edge host's hard disk. This step is typically performed in the preparation step. Refer to [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) to learn more.|
| Registration |  The Edge host is registered with Palette. The Edge host will remain in this phase until the registration process is complete.|
|Cluster Provisioning | The Edge host boots into the specified provider OS and proceeds with the cluster deployment.|

The *Registration* phase has a unique set of instructions. Refer to [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for guidance. The same applies to the *Cluster Provisioning* phase. You can find the instructions in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) resource.

Ideally, all Edge hosts have completed the *Install Handoff* phase when they arrive at the installation site.

# Site User Data

You can provide a site-specific Edge Installer configuration user data if you need to apply new values or override default values from the Edge Installer user data that was created in the *Installer Handoff* phase.

Use the following steps to create an ISO file containing the additional user data. You will load the newly created ISO to a bootable device, such as a USB stick.

## Prerequisites

- A bootable device, such as a USB drive, or a PXE server.

- mkisofs, or genisoimage, or similar ISO management software.

- cdrtools or wodim for Windows.

## Create ISO

1. Create a file called **user-data** that contains the additional configurations you want to override or inject.

  ```shell
  touch user data
  ```

2. Create an empty **meta-data** file:

  ```shell
  touch meta-data
  ```

3. Create an ISO using the following command.

  MacOS/Linux:

  ```shell
  mkisofs -output site-user data.iso -volid cidata -joliet -rock user data meta-data
  ```

  Windows:

  ```shell
  genisoimage -output site-user data.iso -volid cidata -joliet -rock user data meta-data
  ```

  This generates an ISO file called site-user data.iso in the current directory.

Copy the ISO to a bootable device, such as a USB stick. Load the USB stick to the Edge host before powering it on once it arrives at the physical site. The Edge Installer will apply the new user data during the installation process.

<br />

<InfoBox>

You can use several software tools to create a bootable USB drive, such as [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open-source projects such as [Fog](https://fogproject.org/download) or [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

</InfoBox>

## Validation

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that creates a bootable device will validate the ISO image before the flash process.

# Installation

Use the following steps to complete the Edge host installation.

<br />

<InfoBox>

The community resource, [Painting with Palette](https://www.paintingwithpalette.com/tutorials/) has a great Edge Native tutorial.

</InfoBox>

<br />

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

## Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network Virtual IP Address (VIP).

- Physical access to the Edge host.

## Site Install

1. If you have a site-specific user data ISO, then insert the USB stick into the Edge host.

2. Power on the Edge host. The Edge host will boot into registration mode where it will connect with the Palette endpoint that was specified in the user data.

3. The Edge host will remain in a wait mode until you register the device in Palette. Review the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) documentation to learn more about each registration method.

    <br />

    <InfoBox>

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    </InfoBox>

4. The last step is to create a cluster definition if you don't have a host cluster that the Edge host can join. Follow the steps in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) to complete the site installation.

When the cluster is created, the installation process will continue. The Palette Edge Host agent will download all required artifacts and reboot the Edge host.

After the reboot, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile.

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle) to learn more about content bundles. Any [cloud-init](/clusters/edge/edge-configuration/cloud-init) stages defined in the OS pack will also be invoked as the OS initializes.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

Use the following steps to complete the Edge host installation in a VMware environment.

## Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network Virtual IP (VIP) address .

- Physical access to the Edge host.

- An Edge Installer OVF template. Check out the [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) for guidance on how to create an Edge Installer OVF template.

## Site Install

Perform the following steps to proceed with the installation at the site in your VMware environment.

<br / >

<br / >

1. Log in to vCenter Server using the vSphere Client.

2. Navigate to **VMs and Templates** and right-click on the desired folder, then select the option **Deploy VM(s) from this OVF template**.

3. Specify the location of the OVF template and start the deployment.

4. Proceed through the installation steps and deploy the virtual machine.

5. The VM will start up in the registration phase and wait for you to register the Edge host with Palette. If you provided the Edge Installer user data with an `EdgeHostToken` then the Edge host will automatically register with Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register the Edge host with Palette. Review the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for additional guidance.

    <br />

    <InfoBox>

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    </InfoBox>

6. The last step is to create a cluster if you don't have a host cluster that the Edge host can join. Follow the steps in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) to complete the site installation.

Once the cluster is created, the installation process will continue. The Palette Edge Host agent will download all required artifacts and reboot the Edge host.

After the reboot, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile.

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle) to learn more about content bundles. Any [cloud-init](/clusters/edge/edge-configuration/cloud-init) stages defined in the OS pack will also be invoked as the OS initializes.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.

</Tabs.TabPane>

</Tabs>

# Next Steps

Your Edge host is now registered with Palette and is part of a host cluster. You can repeat the steps from [Prepare Edge Host for Installation](/clusters/edge/site-deployment/stage) and [Perform Site Install](/clusters/edge/site-deployment/site-installation) for any additional Edge host you want to add to the host cluster. The next step is for you to become more familiar with Day-2 responsibilities. Check out the [Manage Clusters](/clusters/cluster-management) guide to learn more about Day-2 responsibilities.
