---
sidebar_label: "Build Edge Artifacts"
title: "Build Edge Artifacts"
description:
  "Get started with Kubernetes at the edge. Learn how to build the artifacts required for your Edge deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started", "tutorial", "edge"]
---

One of the first steps in deploying an Edge cluster is preparing your Edge host with all the required artifacts. The
process of building these artifacts is called
[EdgeForge](../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md), and it is responsible for generating the
installer ISO and provider image artifacts.

- Installer ISO: An ISO image that installs the Palette Edge agent on the host.
- Provider Images: [Kairos-based](https://kairos.io/) images that include the Operating System (OS) and the desired
  Kubernetes versions. These images install an immutable OS and the software dependencies compatible with the selected
  Kubernetes version during cluster deployment.

This tutorial teaches you how to build the artifacts required for your Edge deployment. Once built, you will be ready to
learn how to reference them in Edge [cluster profiles](../../../profiles/profiles.md) and how they are used to install
the Palette agent on hosts.

![Palette Edge architecture diagram](/getting-started/getting-started_introduction-edge_edge-diagram-edgeforge.webp)

## Prerequisites

To complete this tutorial, ensure the following prerequisites are in place.

- You have completed the steps in the [Prepare User Data for Edge Installation](./prepare-user-data.md) tutorial,
  including cloning the CanvOS repository and creating and validating a user data file.
- A physical or virtual Linux machine with an AMD64 (also known as `x86_64`) processor architecture and the following
  minimum hardware configuration:
  - 4 CPUs
  - 8 GB memory
  - 150 GB storage
- Access to an image registry. This tutorial uses [Docker Hub](https://www.docker.com/products/docker-hub/) as an
  example.
- The following software installed on the Linux machine:
  - [Docker Engine](https://docs.docker.com/engine/install/) with
    [`sudo`](https://docs.docker.com/engine/install/linux-postinstall/) privileges. Alternatively, you can install
    [Earthly](https://earthly.dev/), in which case you do not need `sudo` privileges.
  - [jq](https://jqlang.org/download/), if you build the artifacts using the [script](#automate-edgeforge).
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Define Arguments

Open a terminal window on your Linux machine and navigate to the `CanvOS` repository that you cloned in the
[Prepare User Data for Edge Installation](./prepare-user-data.md) tutorial. This repository contains the utilities
required to build the artifacts.

```shell
cd CanvOS
```

Check the available Git tags.

```shell
git tag
```

Check out the desired tag. We recommend using a CanvOS major version that is the same as, or older than, Palette's major
version. This tutorial uses the tag `v4.6.24` as an example.

```
git checkout v4.6.24
```

EdgeForge leverages [Earthly](https://earthly.dev/) to build the installer ISO and provider images artifacts. A `.arg`
file is used to pass the values of a few arguments, such as the provider image tag and registry name, to Earthly for the
build process.

:::info

While both the `.arg` file and [user-data](./prepare-user-data.md) file are configuration files used during the
EdgeForge process, they serve different purposes. The `.arg` file is used to customize the Edge artifact build process.
For example, you can specify the name of the installer ISO to be built, the Kubernetes distribution and version for the
provider images, the registry to push the images to, and more. The
[Edge Artifact Build Configurations](../../../clusters/edge/edgeforge-workflow/palette-canvos/arg.md) page contains a
list of all the configurable parameters. In contrast, the `user-data` file focuses on customizing the installer ISO.
When the Edge host boots from the installer ISO, it applies the user data configuration to the host.

:::

Set a custom tag for the provider images. The tag must be an alphanumeric lowercase string. This tutorial uses
`gs-tutorial` as an example. Additionally, replace `spectrocloud` with the name of your registry.

```bash
export CUSTOM_TAG=gs-tutorial
export IMAGE_REGISTRY=spectrocloud
```

Next, issue the following command to create the `.arg` file using the custom tag and registry. The remaining arguments
use predefined values. For example, this tutorial uses [K3s](https://k3s.io/) version `1.32.3` as the Kubernetes
distribution and Ubuntu as the OS distribution. Review the `k8s_version.json` file in the CanvOS repository for all
supported Kubernetes versions.

:::warning

If you are using a CanvOS tag that is earlier than v4.4.12, the `k8s_version.json` file does not exist in those tags. In
that case, review the `Earthfile` file in the CanvOS repository for all supported Kubernetes versions.

:::

```bash
cat << EOF > .arg
CUSTOM_TAG=$CUSTOM_TAG
IMAGE_REGISTRY=$IMAGE_REGISTRY
OS_DISTRIBUTION=ubuntu
IMAGE_REPO=ubuntu
OS_VERSION=22.04
K8S_DISTRIBUTION=k3s
K8S_VERSION=1.32.3
ISO_NAME=palette-edge-installer
ARCH=amd64
UPDATE_KERNEL=false
EOF
```

Verify that the file was created correctly using the `cat` command.

```
cat .arg
```

:::tip

You can also use the [Appliance Studio](../../../deployment-modes/appliance-mode/appliance-studio.md) configuration
Graphic User Interface (GUI) to help you create the `.arg` file.

:::

## Build Artifacts

Issue the following command to build the Edge artifacts.

```bash
sudo ./earthly.sh +build-all-images
```

The build may take 15 to 20 minutes to complete, depending on the hardware resources available on the host machine. Once
complete, a success message appears.

```text hideClipboard title="Example Success Message"
========================== 🌍 Earthly Build  ✅ SUCCESS ==========================
```

The output also includes a manifest with predefined values required to create the Edge cluster profile. These parameters
reference the built provider image. Copy and save the manifest, as you will need it for the next tutorial.

<!-- prettier-ignore -->
```yaml
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
  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"


  system.registry: spectrocloud
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v4.6.24
  system.customTag: gs-tutorial
  system.osVersion: 22.04
```

Confirm that the Edge installer ISO and its checksum have been created correctly.

```bash
ls build
```

```text hideClipboard
palette-edge-installer.iso  palette-edge-installer.iso.sha256
```

List the container images to confirm that the provider images were built successfully.

```bash
docker images --filter=reference="*/*:*$CUSTOM_TAG"
```

```text hideClipboard
REPOSITORY           TAG                                          IMAGE ID       CREATED          SIZE
spectrodocs/ubuntu   k3s-1.32.3-v4.6.24-gs-tutorial               d28750baa9a6   33 minutes ago   5.05GB
spectrodocs/ubuntu   k3s-1.32.3-v4.6.24-gs-tutorial_linux_amd64   d28750baa9a6   33 minutes ago   5.05GB
```

## Push Provider Images

Push the provider image to the image registry specified in the `.arg` file, so that your Edge host can download it
during the cluster deployment.

```bash
docker push $IMAGE_REGISTRY/ubuntu:k3s-1.32.3-v4.6.24-$CUSTOM_TAG
```

The output confirms that the image was pushed to the registry with the correct tag and is ready to be used in a cluster
profile.

```text hideClipboard
...
k3s-1.32.3-v4.6.24-gs-tutorial: digest: sha256:518f937c3256e49c31b54ae72404812c99198281ddea647183b6ee8fc6938aaa size: 16576
```

## Automate EdgeForge

The following example script automates the EdgeForge process. It provides an alternative way to build the artifacts if
you have already learned the steps and want to replicate them quickly. You can skip this section if you have followed
the tutorial and built the artifacts manually.

The script clones the CanvOS repository, creates a sample `user-data` file, or uses the one provided by the user. It
then builds the Edge artifacts and pushes the provider images to the registry. The script prompts the user for a few
options, including the CanvOS Git tag, Kubernetes distribution and version for the provider images, and more.

Follow the steps below to build the artifacts using the script.

<details>
<summary>EdgeForge Automation Example Script</summary>

1. Open a terminal window on your Linux machine and issue the following command to create the script file.

   ```shell
   cat << EOF > edgeforge.sh
   #!/bin/bash

   # Prompt user for working directory (defaults to current if empty)
   read -p "📂 Enter the absolute path where operations should take place [default: current directory]: " WORKING_DIR

   # Use current directory if none provided
   if [ -z "$WORKING_DIR" ]; then
       WORKING_DIR=$(pwd)
       echo "ℹ️  No directory provided. Using current directory: $WORKING_DIR"
   fi

   # Verify and enter the directory
   if [ -d "$WORKING_DIR" ]; then
       cd "$WORKING_DIR" || { echo "❌ Failed to change directory: $WORKING_DIR"; exit 1; }
       echo "✅ Working directory set to: $WORKING_DIR"
   else
       echo "❌ Invalid path provided. Please ensure the directory exists."
       exit 1
   fi

   # Clone the CanvOS repository
   echo "Cloning CanvOS repository..."
   git clone https://github.com/spectrocloud/CanvOS.git
   cd CanvOS || { echo "Failed to enter CanvOS directory"; exit 1; }

   # Fetch latest git tags
   echo "Fetching git tags..."
   git fetch --tags
   echo "Available tags:"
   git --no-pager tag --list | sort --version-sort

   # Prompt for tag selection
   while true; do
       read -p "Enter the CanvOS tag to checkout (for example, v4.6.24): " TAG

       # Validate the tag exists
       if git --no-pager tag --list | grep --quiet --line-regexp "$TAG"; then
           git checkout "$TAG"
           break
       else
           echo "❌ Tag '$TAG' not found in the list of available tags. Please try again."
       fi
   done

   # Prompt for user-data file content
   echo "Enter the absolute path to your user-data file (must already contain the Palette registration token)."
   echo "If you leave this empty, a default user-data file will be created."
   read -p "Absolute path to user-data file (or press Enter to use default): " USER_DATA_PATH

   # If user-data file is empty, use the sample user-data
   if [ -z "$USER_DATA_PATH" ]; then
       # Prompt for Palette registration token in a loop
       while true; do
           read -p "Enter your Palette registration token: " TOKEN
           if [ -n "$TOKEN" ]; then
               export TOKEN
               break
           else
               echo "❌ Token cannot be empty. Please enter a valid token."
           fi
       done

       # Create sample user-data file
       echo "Creating default user-data file..."
       cat << EOF > user-data
   #cloud-config
   stylus:
     site:
       edgeHostToken: $TOKEN
       paletteEndpoint: api.spectrocloud.com

   stages:
     initramfs:
       - users:
           kairos:
             passwd: kairos

   install:
     poweroff: true
   EOF

   else
       # Check if the provided path is a file and copy it to CanvOS directory
       if [ -f "$USER_DATA_PATH" ]; then
           cp "$USER_DATA_PATH" ./user-data
           echo "✅ user-data file copied from: $USER_DATA_PATH"
       else
           echo "❌ File not found at: $USER_DATA_PATH"
           exit 1
       fi
   fi

   # Validate user-data file
   echo "Validating user-data file..."
   VALIDATION_OUTPUT=$(sudo ./earthly.sh +validate-user-data 2>&1)

   if echo "$VALIDATION_OUTPUT" | grep --ignore-case --quiet -e "Validation successful" -e "user data validated successfully"; then
       echo "✅ User data validation passed. Proceeding..."
   else
       echo "❌ User data validation failed. Please check 'user-data' and try again."
       exit 1
   fi

   # Ensure k8s_version.json exists
   if [ ! -f "k8s_version.json" ]; then
       echo "❌ k8s_version.json not found. Check out a Git tag v4.4.12 or later. Exiting..."
       exit 1
   fi

   # Create .arg file with user input
   echo "Creating .arg file..."

   # Prompt for Kubernetes distribution
   echo "⚙️ Available Kubernetes distributions:"
   cat k8s_version.json | jq -r 'keys[]'

   while true; do
       read -p "Enter a valid Kubernetes distribution to build artifacts for (must be listed above) [default: k3s]: " K8S_DISTRIBUTION
       K8S_DISTRIBUTION=${K8S_DISTRIBUTION:-k3s}

       # Check if the selected distribution exists
       if cat k8s_version.json | jq -e --arg dist "$K8S_DISTRIBUTION" 'has($dist)' > /dev/null; then
           break
       else
           echo "❌ Distribution '$K8S_DISTRIBUTION' not found in k8s_version.json. Please try again."
       fi
   done

   # Show available versions
   echo "📦 Available versions for $K8S_DISTRIBUTION:"
   AVAILABLE_VERSIONS=$(cat k8s_version.json | jq -r --arg dist "$K8S_DISTRIBUTION" '.[$dist][]')
   echo "$AVAILABLE_VERSIONS"

   # Prompt for a valid version
   while true; do
       read -p "Enter a valid Kubernetes version to build artifacts for (must be listed above): " K8S_VERSION

       if echo "$AVAILABLE_VERSIONS" | grep --quiet --line-regexp "$K8S_VERSION"; then
           break
       else
           echo "❌ Version '$K8S_VERSION' is invalid. Please enter a valid version from the list above."
       fi
   done

   # Prompt for other .arg file parameters
   read -p "Enter custom tag for the artifacts [default: gs-tutorial]: " CUSTOM_TAG
   CUSTOM_TAG=${CUSTOM_TAG:-gs-tutorial}

   read -p "Enter OS distribution [default: ubuntu]: " OS_DISTRIBUTION
   OS_DISTRIBUTION=${OS_DISTRIBUTION:-ubuntu}

   read -p "Enter OS version [default: 22.04]: " OS_VERSION
   OS_VERSION=${OS_VERSION:-22.04}

   while true; do
       read -p "Enter Image Registry Name (for example, spectrocloud): " IMAGE_REGISTRY
       if [ -n "$IMAGE_REGISTRY" ]; then
           break
       else
           echo "❌ Image registry name cannot be empty. Please enter a valid registry."
       fi
   done

   cat << EOF > .arg
   CUSTOM_TAG=$CUSTOM_TAG
   IMAGE_REGISTRY=$IMAGE_REGISTRY
   OS_DISTRIBUTION=$OS_DISTRIBUTION
   IMAGE_REPO=$OS_DISTRIBUTION
   OS_VERSION=$OS_VERSION
   K8S_DISTRIBUTION=$K8S_DISTRIBUTION
   K8S_VERSION=$K8S_VERSION
   ISO_NAME=palette-edge-installer
   ARCH=amd64
   UPDATE_KERNEL=false
   EOF

   echo "✅ .arg file created."

   # Build artifacts
   echo "Building Edge artifacts... This will take approximately 15 minutes."

   # Create a temp file to capture the output
   TEMP_BUILD_LOG=$(mktemp)

   # Run the build, tee output to console and save it to temp file
   if sudo ./earthly.sh +build-all-images | tee "$TEMP_BUILD_LOG"; then
     echo "✅ Artifacts built successfully."

     # Extract the manifest profile YAML from build output
     awk '/^pack:/{flag=1} flag' "$TEMP_BUILD_LOG" > manifest-profile.yaml

     if [ -s manifest-profile.yaml ]; then
           echo "✅ Extracted manifest profile YAML to 'manifest-profile.yaml'."
     else
           echo "❌ Failed to extract manifest profile YAML from build output."
     fi
   else
     echo "❌ Failed to build artifacts. Please check the logs and try again."
     rm -f "$TEMP_BUILD_LOG"
     exit 1
   fi

   # Push images to registry
   echo "Pushing provider image to registry..."
   if docker push "$IMAGE_REGISTRY/$OS_DISTRIBUTION:$K8S_DISTRIBUTION-$K8S_VERSION-$TAG-$CUSTOM_TAG"; then
       echo "✅ Image pushed successfully to registry: $IMAGE_REGISTRY/$OS_DISTRIBUTION:$K8S_DISTRIBUTION-$K8S_VERSION-$TAG-$CUSTOM_TAG"
   else
       echo "❌ Failed to push the image to the registry."
       exit 1
   fi

   echo "✅ Build completed successfully."
   echo "Artifacts are located in the 'CanvOS/build' folder."
   echo "The manifest to paste into your cluster profile is available in 'CanvOS/manifest-profile.yaml'"
   EOF
   ```

2. Grant execution permissions to the script.

   ```shell
   chmod +x edgeforge.sh
   ```

3. Invoke the script to build the artifacts, answering the prompts.

   ```shell
   ./edgeforge.sh
   ```

4. Once the build is complete, the script generates a manifest in `CanvOS/manifest-profile.yaml` with predefined values
   required to create the cluster profile. Ensure to save this manifest, as you will need it for the next tutorial.

5. Confirm that the Edge installer ISO and its checksum have been created correctly.

   ```bash
   ls CanvOS/build
   ```

   ```text hideClipboard
   palette-edge-installer.iso  palette-edge-installer.iso.sha256
   ```

</details>

## Next Steps

In this tutorial, you built the artifacts required for your Edge deployment. We recommend proceeding to the
[Create Edge Cluster Profile](./edge-cluster-profile.md) tutorial, where you will learn how to create an Edge native
cluster profile that references the built provider image. You will then learn how to use the installer ISO to bootstrap
the Edge installation on your host and use it as a node for deploying your first Edge cluster.
