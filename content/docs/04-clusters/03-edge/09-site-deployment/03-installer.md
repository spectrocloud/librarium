---
title: "Create Installer Image"
metaTitle: "Create Edge Installer Image"
metaDescription: "Learn how to create an installer image for Edge devices."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

We provide you with an [OpenSUSE](https://www.opensuse.org/) based Edge Installer that is available in the form of an ISO. You can use this installer as is and provide your user-data through a bootable device when deploying the device at the physical site. However, some scenarios require you to build a custom installer image. Review the following scenarios to identify if you need to create a custom Edge Installer image.

- You created a content bundle that you want to include with the installation.


- You need to apply multiple user-data configurations. Review the [Multiple User-Data Usecase](/clusters/edge/site-deployment/prepare-edge-configuration#multipleuser-datausecase) resource to learn more.


- You are using a custom operating system (OS).


- You are using VMware and need to provide an OVA file.

# Create an Install Image

Palette supports two installation methods for edge devices: bare metal or VMware. Choose the preferred installation method and follow the related instructions set to get started.

<br />

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

## Bare Metal

For bare metal Edge hosts, creating the Palette edge installer variant involves generating an optical installer image (ISO) which is derived by customizing the default Palette Edge Installer. Site-specific settings, such as the configuration file are included in this image. Customization is performed using the Palette Edge Installer container.

## Prerequisites

- [git](https://git-scm.com/downloads) 2.32.2+ or greater.

- [Docker](https://www.docker.com/products/docker-desktop/) or similar container build tool.

- A bootable device, such as a USB drive, or a PXE server.

## Create ISO Image

1. Download the following git [repository](https://github.com/spectrocloud/pxke-samples).

   ```shell
    git clone https://github.com/spectrocloud/pxke-samples
   ```


2. A file called **.installer.env.template** serves as a template for settings you can customize. Make a copy of this file to **.installer.env.**

   ```shell
    cp .installer.env.template .installer.env
   ```

3. Create an Edge Install configuration file titled **user-data.yaml**, and add the configuration settings for the Edge host. Refer to the [Prepare User Data](/clusters/edge/site-deployment/prepare-edge-configuration) for guidance on how to create a user-data file.


4. Update the content of the file **.installer.env** to customize the following attributes:

- Name of the ISO image to be generated - (Optional - this defaults to pxe-installer if not specified)

  ```shell
  ISO_IMAGE="pxe-installer-custom"
  ```

- The version of the Palette Edge Installer agent. Review the [list](/component#stylusedgeinstallerimageversion) of available Edge Installer versions.

  ```shell
  INSTALLER_VERSION="3.2.0"
  ```

- Target Docker image for the installer to generate - (Optional)

  ```shell
  IMAGE_NAME="gcr.io/my-repo/palette-edge-installer"
  ```

- Path to the configuration file that contains site settings.

  ```shell
  USER_DATA_FILE="user-data.yaml”
  ```

5. Build the custom ISO. The creation process will take a few minutes depending on your system capabilities.

  ```shell
  ./build-installer.sh
  ```

  Output:
    ```text
    ./build-installer.sh
    + source .installer.env
    + ISO=p6os-custom
    + INSTALLER_VERSION=v3.2.0
    + BASE_IMAGE=gcr.io/spectro-dev-public/stylus-installer:v3.2.0
    + IMAGE_NAME=gcr.io/spectro-dev-public/stylus-custom
    + IMAGE=gcr.io/spectro-dev-public/stylus-custom:v3.2.0
    + USER_DATA_FILE=user-data
    + BUILD_PLATFORM=linux/amd64
    + echo 'Building custom gcr.io/spectro-dev-public/stylus-custom:v3.2.0 from gcr.io/spectro-dev-public/stylus-installer:v3.2.0'
    Building custom gcr.io/spectro-dev-public/stylus-custom:v3.2.0 from gcr.io/spectro-dev-public/stylus-installer:v3.2.0
    + '[' -f user-data ']'
    + docker build --build-arg BASE_IMAGE=gcr.io/spectro-dev-public/stylus-installer:v3.2.0 -t gcr.io/spectro-dev-public/stylus-custom:v3.2.0 --platform linux/amd64 -f images/Dockerfile.installer ./
    [+] Building 7.9s (7/7) FINISHED
    => [internal] load build definition from Dockerfile.installer                                                                                                     0.0s
    ...
    ...
    INFO[2023-02-15T22:08:06Z] Creating squashfs...
    DEBU[2023-02-15T22:08:06Z] Running cmd: 'mksquashfs /tmp/elemental-iso972415663/rootfs /tmp/elemental-iso972415663/iso/rootfs.squashfs -b 1024k -comp xz -Xbcj x86'
    ISO image produced: 161394 sectors
    Written to medium : 161424 sectors at LBA 48
    Writing to '/cOS/p6os-custom.iso' completed successfully
  ```

6. Locate the ISO file in the root directory. Using a bootable USB drive, PXE server, or other means, mount the ISO to the primary drive of the bare metal appliance. The installer flashes to the edge host's hard disk, and the host will shut down. The bare metal edge host appliance is ready to be shipped to the edge location.

<InfoBox>

You can use several software tools to create a bootable USB drive, such as [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open-source projects such as [Fog](https://fogproject.org/download) or [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

</InfoBox>

To deploy the device and register it with Palette, refer to the [Register and Manage Edge Native Clusters](/clusters/edge/deployment/native) guide.

## Validation

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that creates a bootable device will validate the ISO image before the flash process.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

## VMware

Create an Open Virtual Appliance (OVA) file from the base Palette Edge Installer ISO for VMware environments by injecting customized settings (user data) through a secondary drive.

## Prerequisites

- mkisofs, or genisoimage, or similar ISO management software.

- cdrtools or [wodim](https://cygwin.com/packages/summary/wodim.html) for Windows

- Access to VMWare vSphere.

## Create OVA Image

1. Create an Edge Install configuration file. Name the file **user-data**. Refer to the [Prepare User Data](/clusters/edge/site-deployment/prepare-edge-configuration) for guidance on how to create a user-data file.

  ```shell
  touch user-data
  ```

2. Use the content from the template in the [Set up Device section](/clusters/edge/deployment/native#setupdevice) to add your site configuration. Make the necessary changes for your environment.


3. Create an empty **meta-data** file:

  ```shell
  touch meta-data
  ```

3. Create a cloud init ISO using the following command.

  MacOS/Linux:

  ```shell
  mkisofs -output ci.iso -volid cidata -joliet -rock user-data meta-data
  ```

  Windows:

  ```shell
  genisoimage -output ci.iso -volid cidata -joliet -rock user-data meta-data
  ```

  This generates an ISO file called **ci.iso** in the current directory.

4. Upload the **ci.iso** file generated in the previous step to a datastore in vSphere using the vCenter console.


5. Log in to [Palette](https://console.spectrocloud.com).


6. Navigate to the left **Main Menu** and select **Clusters**.


7. Click on the **Edge Hosts** tab. In the **Edge Hosts** tab, select **Download Palette Edge Installer**. This downloads the default Palette Edge Installer image (ISO).


8. Upload the Palette Edge Installer ISO to a datastore in vSphere using the vCenter console.


9. Create a new VM using the vCenter console. Add two CD drives to this VM and select the Palette Edge installer ISO for one of them and the **ci.iso** file for the other.


10. Select other settings, such as Network, Datastore, or Folder as appropriate for your environment.


11. Power on the VM and monitor the VM console for log messages. The installer and user data will be copied to the hard disk, and the VM will shut down.


13. Power off the VM.


14. Edit the VM settings and delete the two CD drives that were previously attached.


15. Export the VM as an OVF template.


The export step will generate an OVA file. You will use this OVA file to load the Edge hosts will all the required dependencies, such as the Edge Installer, user-data, and any content bundles you have.

## Validation

You can validate the OVA file by using the [ovftool](https://developer.vmware.com/web/tool/4.4.0/ovf) tool provided by VMware. To validate an OVA file using ovftool, follow these steps:

1. Open a terminal window.


2. Run the following command. Replace the path with the path to your OVA file.

  ```
  ovftool path/to/ova/file.ova
  ```


3. Wait for the tool to validate the OVA file. If there are any errors or warnings, they will be displayed in the terminal.

</Tabs.TabPane>

</Tabs>

# Next Steps

The next phase of the deployment lifecycle is to prepare the Edge host for the installation. You can think of the next step as the staging phase. Use the [Prepare the Edge Host for Installation](/clusters/edge/site-deployment/stage) guide to get started on the next step.