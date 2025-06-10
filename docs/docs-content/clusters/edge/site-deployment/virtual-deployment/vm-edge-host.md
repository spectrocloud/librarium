---
sidebar_label: "Provision an Edge Host VM"
title: "Provision an Edge Host VM"
description: "Learn how to provision a VM as an Edge host using an OVF template. "
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge", "tutorial"]
---

Use the following steps to provision a VM as an Edge host using an Open Virtualization Format (OVF) template.

## Prerequisites

- Access to Palette and the ability to register an Edge host.

- Access to network information about the physical site, specifically the network Virtual IP (VIP) address.

- Physical access to the Edge host.

- An Edge Installer OVF template. Check out the [Installation](../stage.md) for guidance on how to create an Edge
  Installer OVF template.

## Instructions

Perform the following steps to proceed with the installation at the site in your VMware environment.

1. Log in to the vCenter Server using the vSphere Client.

2. Navigate to **VMs and Templates** and right-click on the desired folder, then select the option **Deploy VM(s) from
   this OVF template**.

3. Specify the location of the OVF template and start the deployment.

4. Proceed through the installation steps and deploy the virtual machine.

5. The VM will start up in the registration phase and wait for you to register the Edge host with Palette. If you
   provided the Edge Installer user data with an `EdgeHostToken` then the Edge host will automatically register with
   Palette. Otherwise, the Edge host will wait until you manually register the device in Palette. Go ahead and register
   the Edge host with Palette. Review the [Register Edge Host](../site-installation/edge-host-registration.md) for
   additional guidance.

When the cluster is created, the installation process continues. The Palette Edge Host agent will download all required
artifacts and reboot the Edge host.

After the reboot, the _Cluster Provisioning_ phase begins. In this phase, the system boots into the OS defined in the
cluster profile, and cluster configuration begins. Kubernetes components are initialized and configured based on the
specifications in the cluster profile.

Any content bundles you provided are extracted and loaded into the container runtime process. Refer to the
[EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) to learn more about content bundles. Any
[cloud-init](../../edge-configuration/cloud-init.md) stages defined in the OS pack will also be invoked as the OS
initializes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use `kubectl` to issue commands against the cluster. Check out the
[Access Cluster with CLI](../../../cluster-management/palette-webctl.md) to learn how to use `kubectl` with a host
cluster.

## Next Steps

Your Edge host is now registered with Palette. The next step is to provision create a cluster with this Edge host or add
it to an existing cluster. The steps for creating a cluster with a virtual Edge host is identical to creating a cluster
with a physical Edge host. To learn how to create a cluster or add the Edge host to an existing cluster, refer to
[Create Cluster Definition](../cluster-deployment.md).
