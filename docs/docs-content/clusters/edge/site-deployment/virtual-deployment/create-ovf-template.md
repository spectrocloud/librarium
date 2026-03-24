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
environment. In the vCenter environment, you will convert the VMDK to a VM template and export it as an OVF template.

### Prerequisites

- A VM with Ubuntu version 20.04 or later in your VMware environment. You will use this VM as the build server.
  Nested virtualization must be enabled on this VM. Use the following command to check if it is enabled.

  ```shell
  egrep --count '(vmx|svm)' /proc/cpuinfo
  ```

  If the command returns `0`, the nested virtualization is not enabled. In this case, shut down the VM and open its
  **Edit Settings** page. On the **Virtual Hardware** tab, expand the **CPU settings** section and enable the **Expose
  hardware-assisted virtualization to the guest OS** option. Then, power on the VM.

- Edge Installer ISO file. Check out the [build images](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide
  to learn how to create an Edge Installer image or use the default Edge Installer image.

- vCenter environment with sufficient resources and access privileges to complete the following actions:

  - Upload files to a datastore, including OVF and VMDK.
  - Create VMs.

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create a Registration Token](../site-installation/create-registration-token.md) guide.

### Instructions

1. Prepare the build server for VMDK creation.

   ```shell
   # Update package index
   sudo apt update

   # Install virtualization stack
   sudo apt install --yes qemu-system-x86 qemu-kvm \
     libvirt-clients libvirt-daemon-system bridge-utils virt-manager \
     ca-certificates curl

   # Enable and start virtualization services (persist across reboots)
   sudo systemctl enable --now libvirtd
   sudo systemctl enable --now virtlogd

   # Create directory for trusted Advanced Package Tool (APT) keyrings
   sudo mkdir --parents /etc/apt/keyrings

   # Download Docker's official GNU Privacy Guard (GPG) key
   sudo curl --fail --silent --show-error --location https://download.docker.com/linux/ubuntu/gpg \
     --output /etc/apt/keyrings/docker.asc

   # Ensure the key is readable by APT
   sudo chmod a+r /etc/apt/keyrings/docker.asc

   # Add Docker's official repository to APT sources
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Refresh package index to include Docker repository
   sudo apt update

   # Install Docker engine, CLI, container runtime, and plugins
   sudo apt install --yes docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. Issue the following commands to set up the `docker` alias and run Docker without `sudo`. Refer to
   [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/) for more
   information.

   ```shell
   # Create docker group if it does not exist
   sudo groupadd docker || true

   # Add current user to docker group
   sudo usermod --append --groups docker $USER

   # Apply new group membership
   newgrp docker
   ```

   Verify your Docker installation and the ability to run commands without `sudo`.

   ```shell
   docker run hello-world
   ```

   If you need a GUI, execute the following command.

   ```shell
   sudo apt install x11-apps
   ```

3. Prepare your workspace and install optional helper tools.

   Install `govc` (vCenter CLI).

   ```shell
   curl --location "https://github.com/vmware/govmomi/releases/latest/download/govc_$(uname --kernel-name)_$(uname --machine).tar.gz" \
     | sudo tar --extract --verbose --gzip --file - --directory /usr/local/bin govc
   ```

 6.  (Optional) Install Zstandard (`zstd`) for compression support.

   ```shell
   sudo apt install zstd
   ```

   Create a workspace directory and clone the image builder repository.

   ```shell
   mkdir --parents ~/workspace
   cd ~/workspace
   git clone https://github.com/spectrocloud/stylus-image-builder.git
   ```

4. Copy your Edge Installer ISO file to the `~/workspace/stylus-image-builder/` directory.

   ```shell
   cp <path-to-edge-installer-file>/<edge-installer-file-name>.iso ~/workspace/stylus-image-builder/
   ```

5. Build a VMDK from the Edge Installer ISO to serve as a template for deploying Edge hosts to VMs.

   ```shell
   cd ~/workspace/stylus-image-builder/
   chmod +x entrypoint.sh
   export ISO_URL=<edge-installer-file-name>.iso
   export PALETTE_ENDPOINT=<tenant>.spectrocloud.com
   export EDGE_HOST_TOKEN=<palette-registration-token>
   export DISK_SIZE=100000M
   EMBED=false make docker-build
   nohup make vmdk &
   ```

   The command generates a VMDK file in the `stylus-image-builder/images` folder. Rename the file to a preferred
   installer name. Ensure it retains the VMDK format.

6. Transfer the VMDK to a datastore in your VMware environment.

   ```shell
   export GOVC_URL=https://<vcenter-address>
   export GOVC_USERNAME=<vcenter-username>
   export GOVC_PASSWORD=<vcenter-password>
   govc datastore.upload -ds=<datastore-name> images/<installer-name>.vmdk <datastore-folder>/<installer-name>.vmdk

   # Create an uncompressed copy of the VMDK
   govc datastore.cp -ds=<datastore-name> <datastore-folder>/<installer-name>.vmdk <datastore-folder>/<installer-name>-uncompressed.vmdk
   ```

   If you are using test or development environments, you may need to enable the following option. However, we do not
   recommend using it for production environments.

   ```shell
   export GOVC_INSECURE=1
   ```

7. Log in to the vSphere Client.

8. Navigate to **VMs and Templates**, then right-click on the desired folder under the datacenter where you want to
   create the VM.

9. Start the **New Virtual Machine** deployment wizard and choose the **Create a new virtual machine** option. Then
   choose **Next**.

10. Name the VM and select a location for it, then choose **Next**.

11. In the **Select a compute resource** window, choose a cluster that has access to the datastore containing the VMDK,
    then choose **Next**.

12. Select the storage where the VMDK is stored, then choose **Next**.

13. Keep the selected compatibility value **ESXi 7.0 U2 and later**, then choose **Next**.

14. Select the **Guest OS Family** and **Guest OS Version** that correspond to the values in the `user-data` file used
    to build the Edge Installer ISO file. Choose **Next**.

15. In the **Customize hardware** window, change the **SCSI controller** value to **LSI Logic SAS**.

16. Delete the **New Hard disk** displayed by default. Then expand the **Add New Device** drop-down menu and choose
    **Existing Hard Disk**. Navigate to the datastore folder that contains the uncompressed VMDK and select this VMDK.

17. Finish the creation wizard and save the VM.

18. Navigate to **VMs and Templates** and right-click on the newly created VM. Select **Template > Export OVF
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
