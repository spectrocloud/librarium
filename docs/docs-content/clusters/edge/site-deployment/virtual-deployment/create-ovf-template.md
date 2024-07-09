---
sidebar_label: "Create an Edge OVF Template"
title: "Create an Edge OVF Template"
description: "Learn how to create an OVF template using the USO you created during EdgeForge. "
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge", "tutorial"]
---

In this guide, you will create a Virtual Machine Disk (VMDK) from the Edge Installer ISO and upload it to a vCenter
environment. In the vCenter environment, you will convert the VMDK to a VM template, and export it out as an OVF
template.

### Prerequisites

- Edge Installer ISO file. Check out the [build images](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide
  to learn how to create an Edge Installer image or use the default Edge Installer image.

- vCenter environment with sufficient resources and access privileges to complete the following actions:
  - Upload files to a datastore.
  - Ability to create VMs.

### Instructions

1. Log in to the vCenter Server by using the vSphere Client.

2. Prepare a build server by launching a VM with Ubuntu version 20.04 or greater in your VMware environment.

3. Issue the following commands to prepare your server for VMDK creation.

   ```shell
   apt update
   apt install qemu qemu-kvm \
   libvirt-clients libvirt-daemon-system bridge-utils virt-manager
   systemctl enable --now libvirtd systemctl enable --now virtlogd
   mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   apt update
   apt install docker-ce docker-ce-cli containerd.io
   docker-compose-plugin
   ```

   If you need a Graphical User Interface (GUI), add `x11-apps` to the `apt install` command.

   ```shell
   apt install x11-apps
   ```

4. You can add additional packages for content creation, compression, and preparing your workspace.

   ```shell
   curl -L -o - "https://github.com/vmware/govmomi/releases/latest/download/govc_$( uname -s)_$(uname -m).tar.gz" | tar -C /usr/local/bin -xvzf - govc
   mkdir -p ~/workspace/
   cd workspace/
   git clone https://github.com/spectrocloud/stylus-image-builder.git
   ```

   If you need ZSTD for compression or `govc` for interacting with vCenter, use the following command.

   ```shell
   apt install zstd govc
   ```

5. Build the VMDK from the Edge Installer ISO to serve as a template for deploying Edge hosts to virtual machines. Issue
   the following commands on your build server.

   ```shell
   cd ~/workspace/stylus-image-builder/
   chmod +x entrypoint.sh
   export ISO_URL=[your-installer-name].iso
   export PALETTE_ENDPOINT=[your tenant].spectrocloud.com
   export REGISTRATION_URL=[QR Code registration app link]
   export EDGE_HOST_TOKEN=[token generated on Palette Portal]
   export DISK_SIZE=100000M
   EMBED=false make docker-build
   nohup make vmdk &
   ```

   :::info

   If you are using a _Tenant Registration Token_ for auto-registration, you can omit the environment variable
   `REGISTRATION_URL`.

   :::

   A VMDK file was generated in the **stylus-image-builder/images** folder. Rename this VMDK to a preferred installer
   name. Ensure the VMDK file retains the `.vmdk` extension.

6. Transfer the VMDK to a datastore in your VMware environment. Review the commands below and ensure you replace the
   placeholders with the respective values from your environment.

   ```shell
   export GOVC_URL=https://[IP address OR the DNS of vCenter]
   export GOVC_USERNAME=[vcenter username]
   export GOVC_PASSWORD=[vcenter password]
   govc datastore.upload -ds=[datastore name] images/[your-installer-name].vmdk [folder in datastore]]/[your-installer-name].vmdk
   govc datastore.cp -ds=[datastore name] [folder in datastore]]/[your-installer-name].vmdk [folder in datastore]]/[your-installer-name]-uncompressed.vmdk
   ```

   If you are using test or development environments, you may need to enable the following option. This environment
   variable is not recommended for production environments.

   ```shell
   export GOVC_INSECURE=1
   ```

7. Create a VM from the VMDK by logging into your vCenter console in the UI.

8. Navigate to the **Dataceter/Folder**, under the **VMs and Templates** section.

9. Start the **New Virtual** machine deployment wizard.

10. Choose a cluster that has access to the datastore used for storing the VMDK. Choose the datastore where VMDK is
    stored.

11. Select **Ubuntu Linux (64)** as your guest OS version. This is required even though you will be launching an RHEL
    based clusters

12. Select the Hardware settings.

13. Delete the hard drive displayed by default. Add a new device of the type **Existing Hard Disk**. For this device
    select the option **Datastore ISO file**.

14. Navigate to the datastore folder with the uncompressed VMDK and select the VMDK.

15. Finish the creation wizard and save your virtual machine.

16. Navigate to **VMs and Templates** and right-click on the newly created VM. Select **Template** and **Convert to
    Template**.

17. Navigate to **VMs and Templates** and right-click on the newly created VM Template. Select **Export to OVF
    Template**.

You can ship this OVF template along with the Edge host to the physical site. Use the OVM template for the site
installation.

## Validate

You can validate that the Edge host is ready for the on-site deployment by simulating an on-site deployment on one of
the Edge hosts. The simulation process will require you to complete the installation process and reset the device after
the validation.

## Next Steps

Now that you have completed the staging process, you can ship the Edge hosts to the destination site. Proceed to the
[Perform Site Install](../site-installation/site-installation.md) step.
