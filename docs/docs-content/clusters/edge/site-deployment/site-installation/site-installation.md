---
sidebar_label: "Perform Site Install"
title: "Perform Site Install"
description: "Learn how to deploy the Palette Edge installer on your edge hosts "
hide_table_of_contents: false
tags: ["edge"]
---

You perform a site installation by powering on the Edge host. The Edge Installer will start and begin the installation process, which may vary depending on your environment and Edge host type.  



The Edge host site installation has three stages, as described in the table.

| Phase| Description| Required |
| ---| ---| --- |
| Apply Site User Data |  As described in the [Multiple User Data Use Case](../../edgeforge-workflow/prepare-user-data.md#multiple-user-data-use-case), you can apply a secondary Edge Installer configuration user date to apply additional settings or override global values. This is optional but may be required for certain use cases. Refer to the [Apply Site User Data](site-user-data.md) guide to learn more. | No |
| Registration |  The Edge host is registered with Palette. The Edge host will remain in this phase until the registration process is complete. The *Registration* phase has a unique set of instructions. Refer to [Register Edge Host](edge-host-registration.md) for guidance.| Yes|
|Cluster Provisioning | The Edge host boots into the specified provider Operating System and proceeds with the cluster deployment. You can find the instructions in the [Create Cluster Definition](cluster-deployment.md) resource | Yes |


## Installation

Use the following steps to complete the Edge host installation.


:::info

The community resource, [Painting with Palette](https://www.paintingwithpalette.com/tutorials/) has a great Edge Native tutorial.

:::


Select the target environment for your Edge host.

- [Bare Metal](#bare-metal)

- [VMware](#vmware)



### Bare Metal

#### Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network Virtual IP Address (VIP).

- Physical access to the Edge host.

#### Site Install

1. If you have a site-specific user data ISO, then insert the USB stick into the Edge host.


2. Power on the Edge host. The Edge host will boot into registration mode where it will connect with the Palette endpoint that was specified in the user data.


3. The Edge host will remain in a wait mode until you register the device in Palette. Review the [Register Edge Host](edge-host-registration.md) documentation to learn more about each registration method.

    <br />

    :::info

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    :::

4. The last step is to create a cluster definition if you don't have a host cluster that the Edge host can join. Follow the steps in the [Create Cluster Definition](cluster-deployment.md) to complete the site installation.

When the cluster is created, the installation process will continue. The Palette Edge Host agent will download all required artifacts and reboot the Edge host.

When the Edge host finishes rebooting, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile.

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the [EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) to learn more about content bundles. Any [cloud-init](../../edge-configuration/cloud-init.md) stages defined in the OS pack will also be invoked as the OS initializes.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](../../../cluster-management/palette-webctl.md#access-cluster-with-cli) to learn how to use `kubectl` with a host cluster.

### VMware

Use the following steps to complete the Edge host installation in a VMware environment.

#### Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network Virtual IP (VIP) address .

- Physical access to the Edge host.

- An Edge Installer OVF template. Check out the [Prepare Edge Hosts for Installation](../stage.md) for guidance on how to create an Edge Installer OVF template.

#### Site Install

Perform the following steps to proceed with the installation at the site in your VMware environment.

<br />

1. Log in to vCenter Server using the vSphere Client.


2. Navigate to **VMs and Templates** and right-click on the desired folder, then select the option **Deploy VM(s) from this OVF template**.


3. Specify the location of the OVF template and start the deployment.


4. Proceed through the installation steps and deploy the virtual machine.


5. The VM will start up in the registration phase and wait for you to register the Edge host with Palette. If you provided the Edge Installer user data with an `EdgeHostToken` then the Edge host will automatically register with Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register the Edge host with Palette. Review the [Register Edge Host](edge-host-registration.md) for additional guidance.

    <br />

    :::info

    Once the Edge host is registered, Palette will wait for you to create a host cluster and assign the  Edge host to the cluster.

    :::

6. The last step is to create a cluster if you don't have a host cluster that the Edge host can join. Follow the steps in the [Create Cluster Definition](cluster-deployment.md) to complete the site installation.

When the cluster is created, the installation process continues. The Palette Edge Host agent will download all required artifacts and reboot the Edge host.

After the reboot, the *Cluster Provisioning* phase begins. In this phase, the system boots into the OS defined in the cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the specifications in the cluster profile.

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the [EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) to learn more about content bundles. Any [cloud-init](../../edge-configuration/cloud-init.md) stages defined in the OS pack will also be invoked as the OS initializes.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use `kubectl` to issue commands against the cluster. Check out the [Access Cluster with CLI](../../../cluster-management/palette-webctl.md) to learn how to use `kubectl` with a host cluster.


## Next Steps

Your Edge host is now registered with Palette and is part of a host cluster. You can repeat the steps from [Prepare Edge Host for Installation](../stage.md) and [Perform Site Install](./site-installation.md) for any additional Edge host you want to add to the host cluster. The next step is for you to become more familiar with Day-2 responsibilities. Check out the [Manage Clusters](../../../cluster-management/cluster-management.md) guide to learn more about Day-2 responsibilities.
