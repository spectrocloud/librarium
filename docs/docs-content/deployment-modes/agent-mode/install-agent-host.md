---
sidebar_label: "Install Palette Agent"
title: "Install Palette Agent"
description: "Learn how to install the Palette Agent on your host."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "agent mode"]
---

Agent Mode allows you to bring your own host, regardless of its architecture and Operating System (OS), to be managed by
Pallete and to operate as nodes in your Kubernetes clusters. For example, you can use an
[AWS EC2 instance](https://aws.amazon.com/ec2/), a
[Raspberry Pi](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.raspberrypi.com/&ved=2ahUKEwi-38Gt__SIAxU2CnkGHeU6Ha8QFnoECAkQAQ&usg=AOvVaw12ldjgQls5EV3KbUmJD0nz),
a
[VMware vSphere virtual machine](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-F559CE9C-2D8F-4F69-A846-56A1F4FC8529.html),
and more, as long as they meet the minimum hardware requirements.

This page guides you through the process of installing the Palette agent on your host. You will learn how to create the
user data file to configure your host, install the agent, and verify that your host was successfully registered with
Palette. You will then create a cluster profile and use the registered host to deploy a cluster.

## Prerequisites

- A physical or virtual host with SSH access, access to the Internet, and connection to Palette. This guide uses an
  **Ubuntu 22.04** virtual machine deployed in VMware vSphere as an example.

- The host must meet the following minimum hardware requirements:

  - 2 CPU
  - 8 GB memory
  - 100 GB storage

- A Palette tenant registration token. Refer to the
  [Create a Registration Token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md)
  guide for instructions on how to create a token.

- One IP address is required for the cluster's Virtual IP (VIP) address.

- Ensure the following software is installed and available:
  - A text editor, such as Vi or Nano. This guide uses Vi as an example.
  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [conntrack](https://conntrack-tools.netfilter.org/downloads.html)
  - [Rsync](https://github.com/RsyncProject/rsync)

## Install Palette Agent

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to
   your private SSH key and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> ubuntu@<host-ip-or-domain>
   ```

2. Export your Palette registration token. Replace `<your-palette-registration-token>` with your token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. Issue the command below to create the **user-data** file and configure your host declaratively.

   The following configuration includes the default Palette endpoint, a registration token, and sets up the `kairos`
   user. The host will not shut down and will reboot after the agent installation, with
   [kube-vip](../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and VMware vSphere
   deployments. If your environment does not require kube-vip, set `skipKubeVip:` to `true`. Refer to the
   [Prepare User Data](../../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide to learn more about user data
   configuration.

   ```shell
   cat << EOF > user-data
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     skipKubeVip: false
     site:
       edgeHostToken: $TOKEN
       paletteEndpoint: api.spectrocloud.com
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   EOF
   ```

   Confirm that the file was created correctly.

   ```shell
   cat user-data
   ```

   The output should contain the value of your Palette registration token assigned to the `edgeHostToken` parameter, as
   displayed in the example output below.

   ```text hideClipboard
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     skipKubeVip: false
     site:
       edgeHostToken: ****************
       paletteEndpoint: api.spectrocloud.com
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   ```

4. Export the path to your user data file.

   ```shell
   export USER_DATA=./user-data
   ```

5. Download the agent installation script.

   ```shell
   curl --output ./install.sh https://rishi-public-dnd.s3.amazonaws.com/latest-edge-standard/install.sh
   ```

6. Grant execution permissions to the `install.sh` script.

   ```shell
   chmod +x ./install.sh
   ```

7. Issue the following command to install the agent on your host.

   ```shell
   sudo ./install.sh
   ```

   The termination of the SSH connection, as shown in the example below, confirms that the script has completed its
   tasks.

   ```text hideClipboard
   Connection to 192.168.1.100 closed by remote host.
   Connection to 192.168.1.100 closed.
   ```

8. Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for
   automatic registration with Palette. The host will be registered in the same project where the registration token was
   created.

9. Log in to [Palette](https://console.spectrocloud.com/) and select **Clusters** from the left **Main Menu**.

10. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the Edge hosts list.

11. Once the host has been registered with Palette, proceed with the cluster profile creation. Select **Profiles** from
    the left **Main Menu**.

12. Click on **Add Cluster Profile**.

13. In the **Basic Information** section, assign the a profile name, a description, and tags. Select the type as
    **Full** and click **Next**.

14. Select **Edge Native** as the **Cloud Type** and click **Next**.

15. The **Profile Layers** section specifies the packs that compose the profile. Add the **BYOS Edge OS** pack version
    **1.0.0** to the OS layer.

16. Click **Values** under **Pack Details** to edit the pack's manifest.

    ![View of the cluster profile creation page with the BYOS pack.](/deployment-modes_agent-mode_byos-pack.webp)

17. Update the `system.uri` parameter with the desired Kubernetes image.

    Additionally, include the `stylusPackage` line following the example below.

    ```yaml {16,18}
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      #drain:
      #cordon: true
      #timeout: 60 # The length of time to wait before giving up, zero means infinite
      #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
      #ignoreDaemonSets: true
      #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
      #force: true # Continue even if there are pods that do not declare a controller
      #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
      #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri: "gcr.io/spectro-dev-public/stylus/k8s:k3s-1.29.2"

    stylusPackage: container://gcr.io/spectro-dev-public/stylus-edge-standard:v0.0.1
    ```

18. Click **Next Layer** to continue.

19. Complete the cluster profile creation process by filling out the remaining layers. Ensure that the Kubernetes layer
    matches the version and distribution specified in step **7** of this guide.

20. Follow the steps in the [Create Cluster Definition](../../clusters/edge/site-deployment/model-profile.md) guide to
    deploy a cluster using your registered host as a cluster node.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the host cluster you created to view its details page.

4. Verify that the cluster is listed as **Healthy** and has a **Running** status.
