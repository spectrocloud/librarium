---
sidebar_label: "Prepare Edge Hosts for Installation"
title: "Prepare Edge Hosts for Installation"
description: "Learn how to prepare edge hosts for installation before shipping them out to site for site installation"
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

In this step, you will prepare the Edge host for installation. You will copy the following items to the storage device
of the Edge host.

- The Edge Installer image.

- The Edge Installer user data.

- Content bundles.

:::info

If you need to create any of the items mentioned above, review the
[EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) to learn how to create your own Edge artifacts.

:::

You can ship your Edge hosts after you complete this step. Use the following steps to prepare your Edge host for
installation.

## Prepare Edge Host

Pick the target environment for your Edge host.

- [Bare Metal](#bare-metal)

- [VMware](#vmware)

## Bare Metal

### Prerequisites

- Edge Installer ISO file. Check out the [EdgeForge Workflow](/clusters/edge/edgeforge-workflow/palette-canvos/) to
  learn how to create an Edge Installer image or use the default Edge Installer image.

- A Bare Metal appliance with USB drives.

- The ability to modify the boot order settings to boot from a USB drive.

- A USB disk containing the installer ISO

The following items are optional and not required but may apply to your use case:

<br />

- USB disk that contains a user data ISO. This is applicable in
  [multiple user data](../edgeforge-workflow/prepare-user-data.md) scenarios where you want to override or provide
  additional configurations after the Edge host is powered on at the physical site.

- USB disk containing the content bundle ISO. You can avoid this by creating a custom installer. Refer to the
  [Build Edge Artifacts](../edgeforge-workflow/palette-canvos.md) guide.

### Installer Handoff

1. Insert the USB drive containing the Edge Installer ISO and potentially your user data.

2. If you created a content bundle and loaded it to a USB disk, then insert the content bundle USB drive.

3. Power on the Edge host.

4. Wait for the Edge Installer to complete copying content to the hard drive. The Edge host will reboot by default upon
   completion unless you specify a different option in the Edge Installer configuration user data.

5. Repeat steps 1 through 4 for all Edge hosts.

6. Remove the USB disks and ship your Edge host devices to the site for installation.

### Validate

You can validate that the Edge host is ready for the site installation by simulating a site deployment on one of the
Edge hosts. The simulation process will require you to complete the installation process and reset the device after the
validation.

## VMware

You will create a Virtual Machine Disk (VMDK) from the Edge Installer ISO and upload it to a vCenter environment. In the
vCenter environment, you will convert the VMDK to a VM template, and export it out as an OVF template.

<br />

### Prerequisites

- Edge Installer ISO file. Check out the [build images](../edgeforge-workflow/palette-canvos.md) guide to learn how to
  create an Edge Installer image or use the default Edge Installer image.

- vCenter environment with sufficient resources and access privileges to complete the following actions:
  - Upload files to a datastore.
  - Ability to create VMs.

### Installer Handoff

1. Log in to vCenter Server by Using the vSphere Client.

2. Prepare a build server by launching a VM with Ubuntu version 20.04 or greater in your VMware environment.

3. Issue the following commands to prepare your server for VMDK creation.

{" "}

<br />

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

If you need a graphical user interface (GUI), add `x11-apps` to the `apt install` command.

{" "}

<br />

```shell
apt install x11-apps
```

4. You can add additional packages for content creation, compression, and preparing your workspace.

{" "}

<br />

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

    If you are using a *Tenant Registration Token* for auto-registration, you can omit the environment variable `REGISTRATION_URL`.

    :::

    A VMDK file was generated in the **stylus-image-builder/images** folder. Rename this VMDK to a preferred installer name. Ensure the VMDK file retains the `.vmdk` extension.

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

{" "}

<br />

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

### Validate

You can validate that the Edge host is ready for the site installation by simulating a site deployment on one of the
Edge hosts. The simulation process will require you to complete the installation process and reset the device after the
validation.

## Next Steps

Now that you have completed the staging process, you can ship the Edge hosts to the destination site. Proceed to the
[Perform Site Install](site-installation/site-installation.md) step.
