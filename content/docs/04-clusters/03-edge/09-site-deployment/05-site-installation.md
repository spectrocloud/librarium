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


The *Registration* phase has a unique set of instructions. Refer to the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for guidance. The same applies to the *Cluster Provisioning* phase. You can find the instructions in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) resource.

Ideally, all Edge hosts have completed the *Install Handoff* phase when they arrive at the installation site. 

# Site User Data

You can provide a site-specific Edge Installer configuration user-data if you need to apply new values or override default values from the Edge Installer user-data that was created in the Installer Handoff phase. 
Follow the steps outlined in the [Build User Data ISO](/clusters/edge/site-deployment/prepare-edge-configuration#builduserdataiso) resource to create a site-specific user-data. 

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

- Access to network information about the physical site, specifically the network virtual IP address (VIP).

- Physical access to the Edge host.


## Site Install

1. If you have a site-specific user-data ISO, then insert the USB stick into the Edge host.


2. Power on the Edge host. The Edge host will boot into registration mode where it will connect with the Palette endpoint that was specified in the user-data.


3. If you provided the Edge Installer user-data with an `EdgeHostToken` then the Edge host will automatically register with Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register the Edge host with Palette. Review the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for additional guidance.

    <br />

    <InfoBox>

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    </InfoBox>


4. The last step is to create a cluster definition if you don't have a host cluster for the Edge host to become a member of. Follow the steps in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) to complete the site installation. 


<!-- 4. Log in to [Palette](https://console.spectrocloud.com).


5. Navigate to the left **Main Menu** and select **Clusters**.


6. Click on **Add New Cluster**.


7. Choose **Edge Native** for the cluster type and click on **Start Edge Native Configuration**.


8. Provide the cluster with a name, description and tags. Click on **Next**.


9. Select a cluster profile. If you don't have a cluster profile for Edge Native, refer to the [Create Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile#createedgenativeclusterprofile) guide. Click on **Next** after you have selected a cluster profile.


10. Review your cluster profile values and make any changes as needed. Proceed to the next step by selecting **Next**.


11.  Provide the host cluster with the Virtual IP address used by the physical site. You can also select any SSH keys in case you need to remote into the host cluster. And you can provide a list of Network Time Protocol (NTP) servers. Click on **Next**.


12. The node configuration page is where you can specify what Edge hosts make up the host cluster. Go ahead and assign Edge hosts to the **master-pool** and the **worker-pool**. Click on **Next** once you have completed configuring the node pools.

13. The settings page is where you can configure a patching schedule, security scans, backup settings, and set up role-based access control (RBAC). Review the settings and make changes if needed. Click on **Validate**.


14. Review the settings summary and click on **Finish Configuration** to deploy the cluster. -->

Once the cluster is defined, the installation process will continue. The Palette agent in the Edge host will start downloading all the required artifacts and reboot Edge host. 

After the reboot, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile. 

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle) to learn more about content bundles. Any [cloud-init](/clusters/edge/edge-configuration/cloud-init) stages defined in the OS pack will also be invoked as the OS initializes.


## Validation

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. If the deployment was successful, the cluster status should be **Running**, which indicates a healthy cluster.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.


</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

Use the following steps to complete the Edge host installation in a VMware environment.

## Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network virtual IP address (VIP).

- Physical access to the Edge host.

- An Edge Installer OVF template. Check out the [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) for guidance on how to create an Edge Installer OVF template.

## Site Install

Perform the following steps to proceed with the installation at the site in your VMware environment.

1. Log in to vCenter Server by Using the vSphere Client.


2. Navigate to **VMs and Templates** and right-click on the desired folder and select the option to **Deploy VM(s) from this OVF template**.


3. Specify the location of the OVF template and start the deployment.


4. Proceed through the installation steps and deploy the virtual machine.


5. The VM will start up in the registration phase and wait for you to register the Edge host with Palette. If you provided the Edge Installer user-data with an `EdgeHostToken` then the Edge host will automatically register with Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register the Edge host with Palette. Review the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for additional guidance.

    <br />

    <InfoBox>

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    </InfoBox> 


6. The last step is to create a cluster definition if you don't have a host cluster for the Edge host to become a member of. Follow the steps in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) to complete the site installation. 



Once the cluster is defined, the installation process will continue. The Palette agent in the Edge host will start downloading all the required artifacts and reboot the Edge host. 

After the reboot, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile. 

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle) to learn more about content bundles. Any [cloud-init](/clusters/edge/edge-configuration/cloud-init) stages defined in the OS pack will also be invoked as the OS initializes.


## Validation

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. If the deployment was successful, the cluster status should be **Running**, which indicates a healthy cluster.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.

</Tabs.TabPane>

</Tabs>


# Next Steps

Your Edge host is now registered with Palette and is part of a host cluster. You can repeat the steps from [Prepare Edge Host for Installation](/clusters/edge/site-deployment/stage) to [Perform Site Install](/clusters/edge/site-deployment/site-installation) on any additional Edge host you want to add to the host cluster. The next step is for you to become more familiar with Day-2 responsibilities. Check out the [Manage Clusters](/clusters/cluster-management) to learn more about Day-2 responsibilities. 


