---
title: "Prepare Edge Hosts for Installation"
metaTitle: "Stage common user-data and prepare edge host for installation"
metaDescription: "Learn how to prepare edge hosts for installation before shipping them out to site for site installation"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

In this step, you will prepare the Edge host for installation. You will copy the following items to the storage device of the Edge host.
- The Edge Installer image 


- The Edge Installer user-data 


- Content bundles 

You can ship your Edge hosts after you complete this step. Use the following steps to prepare your Edge host for installation.

<br />

# Prepare Edge Host

Pick the target environment for your Edge host.

<br />

<Tabs identifier="environment">

<Tabs.TabPane tab="Bare Metal" key="bare-metal">

## Prerequisites

- Edge Installer ISO file. Check out the [Create Installer Image](/clusters/edge/site-deployment/installer) to learn how to create an Edge Installer image or use the default Edge Installer image.

- A Bare Metal appliance with USB drives.


- The ability to modify the boot order settings to boot from a USB drive.


- A USB disk containing the installer ISO


The following items are optional and not required but may apply to your use case:

- USB disk that contains a user-data ISO. This is applicable in [multiple user-data](/clusters/edge/site-deployment/prepare-edge-configuration#multipleuser-datausecase) scenarios where you want to override or provide additional configurations after the Edge host is powered on at the physical site.


- USB disk containing the content bundle ISO. You can avoid this by creating a custom installer. Refer to the [Create Installer Image](/clusters/edge/site-deployment/stage).



## Installer Handoff

1. Insert the USB drive containing the Edge Installer ISO and potentially your user-data.


2. If you created a content bundle and created and loaded it to a USB disk, then go ahead and also insert that USB drive. 


3. Power on the Edge host.


4. Wait for the Edge Installer to complete copying content to the hard drive. The Edge host will reboot by default upon completion unless you specify a different option in the Edge Installer configuration user-data.

5. Repeat steps one through four for all Edge hosts.


6. Remove the USB disks and ship your Edge host devices to the site for installation.


## Validation

You can validate the Edge host is ready for the site installation by simulating a site deployment on one of the Edge hosts. The simulation process will require you to complete the installation process and reset the device after the validation.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

## Prerequisites

- Edge Installer ISO file

- vCenter environment with sufficeint resources and priviledges to upload files to a datasotre and create VMs

## OVF Template

For the VMware environment, we will create a VMDK from the installer ISO and upload it to a vCenter environment. In the vCenter environment, we will convert this VMDK to VM template, and export it out as an OVF tempalte for shipping to the edge sites.

Please note, that if you are generating an OVF template, and you want to preload a content bundle, then you will need to create a custom installer ISO.



## Instructions

1. Prepare Build Server

Launch an Ubuntu 20+ VM in your VMware environment and prepare it for builds as follows:-

- Run the following commands to prepare your server for VMDK creation.

```
# Install QEMU
apt update
apt install qemu qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils virt-manager
# install x11-apps if you want GUI, not necessary if headless
# apt install x11-apps
systemctl enable --now libvirtd systemctl enable --now virtlogd
# Install Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io
docker-compose-plugin
```

- Additional package installation for content creation, compression and preparing your workspace

```
#Install ZSTD for compression apt install zstd
#Install govc for interacting with vCenter
curl -L -o - "https://github.com/vmware/govmomi/releases/latest/download/govc_$( uname -s)_$(uname -m).tar.gz" | tar -C /usr/local/bin -xvzf - govc


#Create workspace & download builder code
mkdir -p ~/workspace/
cd workspace/ 
#Clone repositories
git clone https://github.com/spectrocloud/stylus-image-builder.git
```

2. Build VMDK
We will now build a VMDK file from our installer ISO to serve as a template for deploying edge host virtual machines.

Run the following commands on your build server.

```
#make a docker build
cd ~/workspace/stylus-image-builder/
## Copy or move your installer.ISO to the current location
##
chmod +x entrypoint.sh
export ISO_URL=[your-installer-name].iso
export PALETTE_ENDPOINT=[your tenant].spectrocloud.com
export REGISTRATION_URL=[QR Code registration app link]
export EDGE_HOST_TOKEN=[token generated on Palette Portal]
export DISK_SIZE=100000M
#Generate a docker file with all dependencies 
EMBED=false make docker-build
#Build VMDK
nohup make vmdk &
At the end of this process a VMDK file will be generated in the stylus-image-builder/images folder. Rename this VMDK to [your-installer-name].vmdk
```

3. Transfer VMDK to a datastore in your VMware environment

```
# Setup GOVC environment variables
export GOVC_URL=https://[IP address / DNS of vCenter] 
export GOVC_USERNAME=[vcenter username]
export GOVC_PASSWORD=[vcenter password]
# If using test or dev envs, you may need to enable the following option (not recommended for prod envs)
#export GOVC_INSECURE=1
#Upload VMDK to a datastore
govc datastore.upload -ds=[datastore name] images/[your-installer-name].vmdk [folder in datastore]]/[your-installer-name].vmdk
#Make a Copy within vCenter to expand the VMDK file into uncompressed format
govc datastore.cp -ds=[datastore name] [folder in datastore]]/[your-installer-name].vmdk [folder in datastore]]/[your-installer-name]-uncompressed.vmdk
```

4. Create a VM from the VMDK

Login to your vCenter console in the UI and perform the following steps:

- Under VMs and Templates , navigate to the Dataceter/Folder of your choice and invoke the New Virtual machine deployment wizard.

- Choose a cluster from where you can access the datastore used for storing the VMDK
- Choose the Datastore where VMDK is stored

  Please ensure you select “Ubuntu Linux (64) as your Guest OS Version. This is required for this step, even though you will be launching RHEL based clusters

- Select Hardware settings. Delete the hard drive displayed by default. Add a new device of the type “Existing Hard Disk”. For this device select the option ‘Datastore ISO file’. Navigate to the datastore folder with the Uncompressed VMDk and select the VMDK.

- Finish the creation wizard and save your Virtual machine.

5. Convert to VM Template

Navigate to VMs and Templates. Right-Click on the newly created VM, select template and then select 'Convert to Template'.

6. Export OVF Tempalte

Navigate to VMs and Templates. Right-Click on the newly created VM Template, and select 'Export to OVF Template'.

This OVF Template can be shipped out to the edge sites for installation.

</Tabs.TabPane>

</Tabs>
