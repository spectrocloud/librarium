---
sidebar_label: "Build Edge Artifacts using a Content Bundle"
title: "Build Edge Artifacts using a Content Bundle"
description: "Learn how to build an Edge installer ISO using the Palette Edge CLI and the CanvOS utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette's Edge solution supports creating Edge artifacts for edge devices deployed in a low internet bandwidth
environment or an _air-gapped_ environment. An air-gapped environment is a deployment site with no direct internet
access. Using a content bundle, you can build Edge artifacts for installation in such environments.

A content bundle is an archive that includes the Operating System (OS) image, the Kubernetes distribution, the Network
Container Interface (CNI), and all other dependencies specified in the cluster profiles you want to deploy to the Edge
cluster. A content bundle provides several benefits, such as:

- Software dependencies are pre-loaded into the installer image.

- Optimizes the deployment process for bandwidth-constrained environments or air-gapped environments.

- The ability to more granularly manage the software dependencies available to Edge clusters.

This how-to guide provides instructions for creating and using a content bundle to build the Edge artifacts. You will
begin with installing a necessary tool, the Palette Edge CLI, on your development machine. The Palette Edge CLI is a
command-line utility to interact with Palette and perform specific tasks in your development environment, such as
creating a content bundle. Next, you will download all the software dependencies mentioned in your cluster profile using
the Palette Edge CLI and create a content bundle. Lastly, when your content bundle is ready, you will use the CanvOS
utility to embed the content bundle and user data into the Edge installer ISO image.

The diagram below displays the overarching steps to build the Edge installer ISO using a content bundle. The diagram
also highlights the primary prerequisites to create a content bundle.

![An overarching diagram displaying the workflow in the current guide.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_overarching.webp)

## Prerequisites

:::warning

This how-to guide extends the [Build Edge Artifacts](palette-canvos.md) workflow. Therefore, you must complete it before
proceeding with the current guide.

:::

To complete this guide, you will need the following items:

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  installer ISO image. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- The Linux machine should have the following minimum hardware configuration:

  - 4 CPU
  - 8 GB memory
  - 100 GB storage. The actual storage will depend on the size of the content bundle you will use to build the Edge
    installer ISO image.

- You must have completed the [Build Edge Artifacts](palette-canvos.md) guide to build the provider images and create a
  cluster profile referencing one of the provider images.

- A Spectro Cloud API key. Later in this guide, you will use this API key to authenticate the Palette Edge CLI utility
  and allow it to interact with Palette. Refer to the
  [User Authentication](../../../user-management/authentication/api-key/create-api-key.md) guide to create a new API
  key.

## Instructions

Use the following instructions on your Linux machine, which this guide refers to as the development environment.

1.  Visit the [Downloads](../../../spectro-downloads.md#palette-cli) page and download the latest Palette Edge CLI. You
    can download the Palette Edge CLI by clicking on the available URL or using the download URL in the following
    command. Replace the `[PALETTE-EDGE-BINARY-URL]` placeholder with the download URL.

```bash
curl [PALETTE-EDGE-BINARY-URL] --output palette-edge
```

2. Open a terminal session and navigate to the folder where you have downloaded the palette-edge binary. Set the
   executable permissions for the palette-edge binary by issuing the following command.
   <br />

```bash
chmod 755 palette-edge
```

3. Use the following command to move the palette-edge binary to the **/usr/local/bin** directory to make the binary
   available in your system $PATH. This will allow you to issue the `palette-edge` command from any directory in your
   development environment.
   <br />

```bash
mv palette-edge /usr/local/bin
```

4. Verify the installation of the Palette Edge CLI by issuing the following command. The output will display information
   about the currently supported OS and Kubernetes distributions.
   <br />

```bash
palette-edge show
```

```hideClipboard bash
# Sample output
┌────────────────────────────────────────────────────────────────────────┐
| OS Flavor     | Description        | Base Image URI                    |
| opensuse-leap | Opensuse Leap 15.4 | quay.io/kairos/core-opensuse-leap |
| ubuntu-20     | Ubuntu 20.4 LTS    | quay.io/kairos/core-ubuntu-20-lts |
| ubuntu-22     | Ubuntu 22.4 LTS    | quay.io/kairos/core-ubuntu-22-lts |
└────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
| K8S Flavor | Description        | Supported Versions                                        |
| k3s        | Rancher K3s        | 1.25.2-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1         |
| kubeadm    | Kubernetes kubeadm | 1.25.2,1.24.6,1.23.12,1.22.15                             |
| rke2       | Rancher RK2        | 1.25.2-rke2r1,1.24.6-rke2r1,1.23.12-rke2r1,1.22.15-rke2r1 |
└─────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────┐
| Component             | Version |
| Spectro Agent Version | v3.4.3  |
| Kairos Version        | v2.0.3  |
└─────────────────────────────────┘
```

<br />

5. Set the Spectro Cloud API key as an environment variable by issuing the following command. Replace the
   `[USE-YOUR-API-KEY_HERE]` placeholder with your API key. The Palette Edge CLI will use this API key to authenticate
   with Palette. Once authenticated, the Palette Edge CLI can interact with your Palette account.
   <br />

```bash
export API_KEY=[USE-YOUR-API-KEY_HERE]
```

6. Log in to [Palette](https://console.spectrocloud.com).

7. Copy your Palette project ID. You will use this ID in a later step. The project ID is on the top-right corner of your
   Palette project overview page. Use the following screenshot to help you find your project ID.

![A screenshot highlighting the project ID in Palette project overview page](/clusters_edge_edge-forge-workflow_build-images_build-project_id.webp)

8. Navigate to the left **Main Menu** and select **Profiles**.

9. Select the cluster profile you want to include in the content bundle. Click on the target cluster profile to access
   its details page.

10. Examine the cluster details page URL. The cluster details page URL follows the
    `[Palette-URL]/projects/[PROJECT-ID]/profiles/cluster/[CLUSTER-PROFILE-ID]` syntax. The cluster details page URL has
    your project ID and the cluster profile ID. For example, the screenshot below highlights the project ID and the
    cluster profile ID in a cluster details page URL.

![A screenshot highlighting the cluster profile ID and project ID in the URL of the cluster details page.](/clusters_edge_edge-forge-workflow_build-images_build-artifacts_url.webp)

11. Copy the cluster profile ID from the cluster details page URL for the next step.

12. Switch back to your development environment, and set the project ID as an environment variable by issuing the
    following command. Replace the `[USE-YOUR-PROJECT-ID_HERE]` placeholder with your project ID.
    <br />

```bash
export PROJECT_ID=[USE-YOUR-PROJECT-ID_HERE]
```

13. Set the cluster profile ID as an environment variable using the following command. Replace the
    `[USE-YOUR-PROFILE-ID_HERE]` placeholder with your cluster profile ID. The Palette Edge CLI uses the cluster profile
    ID to reference the correct cluster profile and download all its software dependencies.
    <br />

```bash
export PROFILE_ID=[USE-YOUR-PROFILE-ID_HERE]
```

14. Issue the command below to create the content bundle. The `build` command uses the following flags:

| **Command Flag**        | **Value**                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--api-key`             | Spectro Cloud API key                                                                                                                               |
| `--project-id`          | Palette project ID                                                                                                                                  |
| `--cluster-profile-ids` | Cluster profile IDs. If you want to include multiple cluster profiles in the content bundle, add multiple cluster profile IDs separated by a comma. |
| `--palette-endpoint`    | Palette API endpoint. The default Palette API endpoint is `api.spectrocloud.com`                                                                    |
| `--outfile`             | Path to write the final content bundle.                                                                                                             |

You can issue `palette-edge build --help` to know about other available flags.

<br />

```bash
palette-edge build --api-key $API_KEY \
  --project-id $PROJECT_ID \
  --cluster-profile-ids $PROFILE_ID \
  --palette-endpoint api.spectrocloud.com \
  --outfile content
```

15. Use the command below to list all files in the current directory to verify that you created the content bundle
    successfully. The content bundle will have the following naming convention, `content-[random-string]`, for example,
    **content-8e61a9e5**.
    <br />

```bash
ls -al
```

16. List the files in the content bundle folder using the following command. The output will display the compressed core
    and app content files.
    <br />

```bash
ls -al content-*/
```

```hideClipboard bash
# Sample output
total 3981104
-rw-rw-r-- 1 jb jb 1598552722 Jul 26 18:20 app-content-8e61a9e5.zst
-rw-rw-r-- 1 jb jb 2478086360 Jul 26 18:20 core-content-8e61a9e5.zst
```

17. Issue the following command to build the Edge artifacts with your content bundle. The `+iso` option specifies the
    build target. This command will generate an ISO image from the content bundle and other configurations you have
    specified in the **.arg** and **user-data** files.
    <br />

```bash
sudo ./earthly.sh +iso
```

This command may take up to 15-20 minutes to finish depending on the resources of the host machine.

## Validate

List the Edge installer ISO and checksum by issuing the following command from the **CanvOS/** directory.

<br />

```shell
ls build/
```

```hideClipboard shell
palette-edge-installer.iso
palette-edge-installer.iso.sha256
```

<br />

To validate, you can prepare an edge device using the Edge installer ISO. You can follow the
[Prepare Edge Host for Installation](../site-deployment/stage.md) guide if you prepare a bare metal machine or a VMware
VM as a host. Below are the high-level steps for your reference:

<br />

1. Create a bootable USB flash drive using any third-party software. Most software that creates a bootable USB drive
   will validate the ISO image.

2. Select a physical or virtual host machine to emulate as an edge device. Enable (Dynamic Host Configuration Protocol)
   DHCP on the host before proceeding with the installation process. Enabling DHCP is necessary for the device to obtain
   an IP address automatically from the network.

3. Flash the edge device with a bootable USB drive.

4. The last step is to power on the edge device and start the installation process. For more information, refer to the
   [Perform Site Install](../site-deployment/site-installation/site-installation.md) documentation.
   <br />

## Next Steps

Palette's Edge solution allows you to create Edge artifacts using a content bundle for edge devices deployed in low
internet bandwidth or air-gapped environments. You created a content bundle using the Palette Edge CLI in this guide.
Next, you used the CanvOS utility to embed the content bundle and user data into an Edge installer ISO.

As the next step, we recommend you check out the end-to-end tutorial,
[Deploy an Edge Cluster on VMware](../../../tutorials/clusters/edge/deploy-cluster.md). The tutorial provides a detailed
walkthrough on deploying an Edge cluster in a VMware environment.

Check out the reference resources below to learn more about preparing an Edge host.

- [Prepare Edge Host for Installation](../site-deployment/stage.md)

- [Perform Site Install](../site-deployment/site-installation/site-installation.md)
