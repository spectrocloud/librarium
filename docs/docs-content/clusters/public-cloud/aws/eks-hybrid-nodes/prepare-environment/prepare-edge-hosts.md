---
sidebar_label: "Prepare Edge Hosts"
title: "Prepare Edge Hosts"
description: "Learn how to prepare your edge hosts to be used as Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 3
---

This guide explains how to prepare edge hosts for use as Amazon EKS Hybrid Nodes within the Spectro Cloud ecosystem.
There are two available methods to register these hosts:

- [Agent Mode](../../../../../deployment-modes/agent-mode/agent-mode.md)
- [Appliance Mode](../../../../../deployment-modes/appliance-mode/appliance-mode.md) using the
  [EdgeForge Workflow](../../../../edge/edgeforge-workflow/edgeforge-workflow.md).

Agent Mode installs a lightweight agent on existing systems, and Appliance Mode deploys a fully managed operating system
(OS) and stack. Choose the approach that aligns best with your operational and security requirements.

:::info

Check out [Deployment Modes](../../../../../deployment-modes/deployment-modes.md) for further explanation and comparison
of both modes.

:::

## Agent Mode

In Agent Mode, you install the Palette agent on your existing host OS. This agent communicates with Palette in central
management mode to manage configurations, updates, and workloads.

### Prerequisites

#### Infrastructure

- You have physical or virtual machines ready to be used as edge hosts.

- The physical or virtual machine resources for each edge host meet the
  [Minimum Device Requirements](../../../../../deployment-modes/agent-mode/architecture.md#minimum-device-requirements).

- The edge host has at least one static IP address assigned.

#### Network Connectivity

- You can connect to the edge host through SSH using your private key.

  For example, issue the following command and replace `<privateKey>`, `<sshUsername>`, and `<hostIpAddress>` with your
  SSH private key, SSH username on the host, and the host IP address respectively.

  ```bash
  ssh -i <pathToPrivateKey> <sshUsername>@<hostIpAddress> exit
  ```

- The Edge host has outbound access to the internet.

- The edge host has inbound and outbound connectivity to Palette SaaS
  [services](../../../../../architecture/palette-public-ips.md) and
  [ports](../../../../../architecture/networking-ports.md#network-ports).

  For example, if you have [netcat](https://linux.die.net/man/1/nc) installed, issue the following command on the edge
  host to check whether the `api.spectrocloud.com` domain is accessible on port `443`.

  ```bash
  nc -z -v api.spectrocloud.com 443
  ```

  Example output, if successful.

  ```shell
  Connection to api.spectrocloud.com port 443 [tcp/https] succeeded!
  ```

- The edge host has outbound connectivity to the required
  [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).
  Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster
  operations** sections for listed guidance.

  For example, if you have [netcat](https://linux.die.net/man/1/nc) installed, issue the following command to check
  whether the `eks.us-east-1.amazonaws.com` domain is accessible on port `443`.

  ```bash
  nc -z -v eks.us-east-1.amazonaws.com 443
  ```

  Example output, if successful.

  ```shell
  Connection to eks.us-east-1.amazonaws.com port 443 [tcp/https] succeeded!
  ```

  :::info

  A table showing the required domains and ports for an example region can be found in the
  [Configure Remote Network](./prepare-network.md#configure-remote-network) section during step 2.

  :::

- The edge host has the necessary ports available exclusively for
  [Cilium operations](https://docs.cilium.io/en/stable/operations/system_requirements/#firewall-rules).

  For example, issue the following command to check whether port `4240` is being used on the edge host.

  ```bash
  sudo lsof -i :4240
  ```

  If the command returns no output, this typically indicates that the port is free.

#### Package Manager Index

- Your edge host package manager must have an up-to-date package index. This is to ensure that dependency packages for
  [`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully downloaded
  and installed when [creating hybrid node pools](../create-hybrid-node-pools.md#create-hybrid-node-pool).

  For example, on Ubuntu, you would issue the following command.

  ```shell
  sudo apt-get update
  ```

  Adjust it to your operating system and package manager on your edge host.

#### OS and Dependencies

- You must have a supported OS installed on your edge hosts. Palette supports the same operating systems as AWS. Refer
  to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html)
  for details.

  - The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL).

- Ensure the following software is installed and available:

  - [bash](https://www.gnu.org/software/bash/)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [rsync](https://github.com/RsyncProject/rsync)
  - [systemd](https://systemd.io/)
  - [systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html) -
    Required if you want Palette to manage Network Time Protocol (NTP).
  - [systemd-resolved](https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html) - Required
    if you want Palette to manage Domain Name System (DNS) or if you plan to use overlay networks for clusters deployed
    on your Edge host. Refer to our
    [Configure networkd to Prepare Host for Overlay Network](../../../../../deployment-modes/agent-mode/overlay-preparation.md)
    guide for information on installing and configuring `systemd-resolved`.
  - [systemd-networkd](https://www.freedesktop.org/software/systemd/man/latest/systemd-networkd.html) - Required if you
    want Palette to manage static IP addresses or if you plan to use overlay networks for clusters deployed on your Edge
    host. Refer to our
    [Configure networkd to Prepare Host for Overlay Network](../../../../../deployment-modes/agent-mode/overlay-preparation.md)
    guide for information on installing and configuring `systemd-networkd`.
  - [conntrack](https://conntrack-tools.netfilter.org/downloads.html) - Required for clusters that use PXK-E as its
    Kubernetes layer.
  - [iptables](https://linux.die.net/man/8/iptables)
  - [rsyslog](https://github.com/rsyslog/rsyslog) - Required for audit logs.

  If you are using Ubuntu or any OS that uses apt or apt-get for package management, you can issue the following command
  to install all dependencies for installation with the following command:

  ```shell
  sudo apt-get update && sudo apt-get install -y bash jq zstd rsync systemd-timesyncd conntrack iptables rsyslog --no-install-recommends
  ```

  :::warning

  Avoid installing [Docker](https://www.docker.com/) on the host where you want to install the agent. Docker is a
  heavyweight tool that could interfere with the Palette agent.

  :::

- Ensure that the host has `Bash` configured as the default shell.

#### Palette Registration Token

- You will need a Palette tenant registration token. Refer to the
  [Create a Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token.md) guide
  for instructions on how to create a token.

### Register Edge Host in Agent Mode

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to
   your private SSH key, `<ssh-user>` with the SSH username, and `<host-ip-or-domain>` with the host's IP address or
   hostname.

   ```shell
   ssh -i <pathToPrivateKey> <sshUsername>@<hostIpAddress> exit
   ```

2. Export your Palette registration token. Replace `<your-palette-registration-token>` with your token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. _(Optional)_ If you are installing the agent on a host that accesses the internet through a network proxy, export the
   proxy configurations in your current terminal session.

   We recommend exporting the variables both in uppercase and lowercase to ensure compatibility. Replace
   `<http-proxy-address>` and `<https-proxy-address>` with the address and port to your HTTP and HTTPS proxy servers,
   respectively.

   ```shell
   export http_proxy=<http-proxy-address>
   export https_proxy=<https-proxy-address>
   export HTTP_PROXY=<http-proxy-address>
   export HTTPS_PROXY=<https-proxy-address>
   ```

4. Issue the command below to create the **user-data** file and configure your host declaratively.

   The following configuration includes a Palette registration token and the default Palette endpoint, specifies a
   Palette project, and sets up the `kairos` user. Note the following:

   - If your host needs a proxy to access the internet, you need to provide the proxy configurations in the user data as
     well. For more information, refer to
     [Site Network Parameters](../../../../../clusters/edge/edge-configuration/installer-reference.md#site-network-parameters).
   - The host will not shut down and will instead reboot after the agent is installed, with
     [kube-vip](../../../../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and
     VMware vSphere deployments. If your environment does not require kube-vip, set `stylus.vip.skip` to `true`. Refer
     to [Edge Installer Configuration Reference](../../../../../clusters/edge/edge-configuration/installer-reference.md)
     to learn more about user data configuration.
   - The `projectName` parameter is not required if the associated Palette
     [registration token](../../../../../clusters/edge/site-deployment/site-installation/create-registration-token.md)
     has been configured with a default project.

   <br />

   ```shell
   cat << EOF > user-data
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     vip:
       skip: false
     site:
       edgeHostToken: $TOKEN
       paletteEndpoint: api.spectrocloud.com
       projectName: Default
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
     vip:
       skip: false
     site:
       edgeHostToken: ****************
       paletteEndpoint: api.spectrocloud.com
       projectName: Default
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   ```

   :::warning

   <!-- prettier-ignore-start -->

   If your host is a virtual machine using a VMXNET3 adapter and you are planning to use
   <VersionedLink text="Flannel" url="/integrations/cni-flannel" /> for your CNI, include the following `initramfs`
   stage in your `user-data` file, replacing `<interface-name>` with the name of the network interface on your Edge
   host. This is due to a
   [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
   which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.
   <!-- prettier-ignore-end -->

   ```shell
    stages:
      initramfs:
        - name: "Disable UDP segmentation"
          commands:
            - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
            - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
   ```

   :::

5. Export the path to your user data file.

   ```shell
   export USERDATA=./user-data
   ```

6. Download the latest version of the Palette agent installation script. There is a FIPS-compliant script, if needed.

   <PartialsComponent category="agent-mode" name="agent-mode-latest-version" />

   <details>

   {" "}

   <summary>Dedicated or On-Premises Palette Instance</summary>

   <PartialsComponent category="agent-mode" name="agent-mode-versioned" />

   </details>

7. Grant execution permissions to the installation script.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   chmod +x ./palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   chmod +x ./palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

8. Issue the following command to install the agent on your host.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   sudo --preserve-env ./palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

   The termination of the SSH connection, as shown in the example below, confirms that the script has completed its
   tasks.

   ```text hideClipboard
   Connection to 192.168.1.100 closed by remote host.
   Connection to 192.168.1.100 closed.
   ```

Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for
automatic registration with Palette. The host will be registered in the same project where the registration token was
created.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the table.

## Appliance Mode

In Appliance Mode, you follow the EdgeForge workflow to provision your edge hosts. The EdgeForge workflow requires a
provider image and an installer ISO to be built.

The provider image is a [Kairos-based image](https://kairos.io/) that provides an immutable OS and Kubernetes runtime
components for a specified Kubernetes version. The installer ISO partitions the disk, installs required dependencies
including the Palette agent, registers the host with Palette, and sets up user and security configurations.

Once these artifacts are built, you can use them to provision your edge hosts on existing hardware.

### Prerequisites

Appliance mode requires the following components:

- A Linux machine to build the required
  [Edge artifacts](../../../../edge/edgeforge-workflow/edgeforge-workflow.md#edge-artifacts).
- Physical or virtual machines ready to be used as edge hosts.

<Tabs>

<TabItem label="Prerequisites for Build Machine" value="build-machine-prereqs">

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname --machine
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- _(Optional)_ [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it will require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  - If you do not install Earthly, you must install Docker.

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token.md) guide.

- Access to an image registry and permissions to push images. This page uses a public
  [Docker Hub](https://www.docker.com/products/docker-hub/) registry as an example. If you need to use a private
  registry, refer to the
  [Deploy Cluster with a Private Provider Registry](/clusters/edge/site-deployment/deploy-custom-registries/deploy-private-registry.md)
  guide for instructions on how to configure the credentials.

</TabItem>

<TabItem label="Prerequisites for Edge Hosts" value="edge-hosts-prereqs">

- The physical or virtual machine resources for each edge host meet the
  [Minimum Requirements](../../../../edge/hardware-requirements.md#minimum-requirements).

- The edge host has at least one static IP address assigned.

- During the [Register Edge Host in Appliance Mode](#register-edge-host-in-appliance-mode) steps, you must specify a
  supported OS to build for your edge hosts. Palette supports the same operating systems as AWS. Refer to
  [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for
  details.

</TabItem>

</Tabs>

### Register Edge Host in Appliance Mode

Use the following instructions on your build host to customize the arguments and Dockerfile, and then create all the
required Edge artifacts.

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the newest available tag. This guide uses **v4.5.15** tag as an example.

   ```shell
   git checkout v4.5.15
   ```

5. In the repository, review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.
   - **k8s_version.json** - Lists all supported Kubernetes versions for each Kubernetes distribution.
   - **Dockerfile** - Embeds the arguments and other configurations in the image.
   - **user-data.template** - A sample user-data file.

6. Issue the following command to create the **.arg** file with the customizable arguments. Adjust the parameters to
   your requirements. Refer to the
   [Edge Artifact Build Configurations](../../../../edge/edgeforge-workflow/palette-canvos/arg.md) table for
   descriptions of all the parameters you can use.

   :::important

   - You must specify a supported OS for your edge hosts. Palette supports the same operating systems as AWS. Refer to
     [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html)
     for details.
   - The `K8S_DISTRIBUTION` argument _must_ be set to `nodeadm` to ensure compatibility with EKS Hybrid Nodes.
   - For `K8S_VERSION`, review the `k8s_version.json` file for supported versions for `nodeadm`.
   - The `OS_VERSION` argument can be omitted when not specifying `OS_DISTRIBUTION` as `ubuntu`.

   :::

   ```bash
   cat << EOF > .arg
   CUSTOM_TAG=<custom-tag>
   IMAGE_REGISTRY=<image-registry>
   OS_DISTRIBUTION=<os-distribution>
   IMAGE_REPO=<image-repository-name>
   OS_VERSION=<os-version>
   K8S_DISTRIBUTION=nodeadm
   K8S_VERSION=<kubernetes-version>
   ISO_NAME=<installer-iso-file-name>
   ARCH=<image-architecture>
   UPDATE_KERNEL=false
   EOF
   ```

   View the newly created file to ensure the customized arguments are set correctly.

   ```bash
   cat .arg
   ```

   Example output.

   ```bash hideClipboard
   CUSTOM_TAG=eks-hybrid
   IMAGE_REGISTRY=spectrocloud
   OS_DISTRIBUTION=ubuntu
   IMAGE_REPO=ubuntu
   OS_VERSION=22
   K8S_DISTRIBUTION=nodeadm
   K8S_VERSION=1.30.0
   ISO_NAME=palette-edge-installer
   ARCH=amd64
   UPDATE_KERNEL=false
   ```

   Based on the arguments defined in the **.arg** file, the final provider image name will have the following naming
   pattern, `$IMAGE_REGISTRY/$IMAGE_REPO:$K8S_DISTRIBUTION-$K8S_VERSION-$PE-VERSION-$CUSTOM_TAG`. `$PE_VERSION` refers
   to the Palette Edge agent version, which is automatically determined. Using the example output, the image name would
   be `spectrocloud/ubuntu:nodeadm-1.30.0-v4.5.15-eks-hybrid`.

7. _(Optional)_ This step is only required if your builds occur in a proxied network environment, and your proxy servers
   require client certificates, or if your base image is in a registry that requires client certificates.

   You can provide the base-64 encoded certificates in PEM format in the **certs** folder at the root directory of the
   **CanvOS** repository. You can provide as many certificates as you need in the folder.

   If you are using a CanvOS tag that is earlier than `4.5.15`, you need to add the `PROXY_CERT_PATH` build argument to
   provide a path to the certificate. This should be added to the **.arg** file that was created in the previous step.
   This approach only allows you to specify one certificate. For more information, refer to
   [Edge Artifact Build Configurations](../../../../edge/edgeforge-workflow/palette-canvos/arg.md).

   :::warning

   These proxy settings are only configured for the build process itself, when your builder machine needs to pull
   certain images to build the Edge artifacts. These certificates will not be present on the host after it has been
   deployed. To configure the proxy network settings for a host, refer to
   [Configure HTTP Proxy](../../../../edge/local-ui/host-management/configure-proxy.md) or
   [Configure Proxy Settings in User Data](../../../../edge/edgeforge-workflow/prepare-user-data.md#configure-proxy-settings-optional).

   :::

8. You can install tools and dependencies and configure the image to meet your needs by using the
   **[Dockerfile](https://docs.docker.com/reference/dockerfile/)**. Add your customizations below the
   `Add any other image customizations here` comment in the Dockerfile. Do not edit or add any lines before this tagged
   comment.

   <!-- prettier-ignore -->
   <details>
   <summary> Example </summary>

   You can issue the following command to append instructions to install [WireGuard](https://www.wireguard.com/install/)
   in the Dockerfile.

   ```bash
   echo 'RUN apt-get update && apt-get install --assume-yes --no-install-recommends wireguard && rm --recursive --force /var/lib/apt/lists/*' >> Dockerfile
   ```

   View the newly created file to ensure the instruction to install WireGuard is appended correctly.

   ```bash
   cat Dockerfile
   ```

   Example output, shortened for brevity.

   ```bash hideClipboard
   ...
   RUN apt-get update && apt-get install --assume-yes --no-install-recommends wireguard && rm --recursive --force /var/lib/apt/lists/*
   ```

   </details>

9. Issue the following command to save your Palette tenant registration token to a local variable. Replace
   `<registration-token>` with your actual registration token.

   ```bash
   export token=<registration-token>
   ```

10. Use the following command to create the **user-data** file. The command creates the minimal recommended
    configuration and you should adjust this file to your requirements. Refer to
    [Prepare User Data](../../../../edge/edgeforge-workflow/prepare-user-data.md) for common configuration options,
    validation steps, and full user data samples. The
    [Edge Installer Configuration Reference](../../../../edge/edge-configuration/installer-reference.md) article also
    provides guidance on all available options.

    You can edit user data in [Local UI](../../../../edge/local-ui/host-management/edit-user-data.md) after
    installation. However, we still recommend you provide user data during this workflow for production workloads. This
    is because not all user data fields can be updated in Local UI.

    :::important

    - The edge host must be deployed in `central` mode, which is the default when `stylus.managementMode` is omitted.
    - Replace `<registration-token>` with your Palette tenant registration token.
    - Replace `<palette-project-uid>` with the Palette project ID the Edge host should pair with. This field is only
      required if your Palette tenant registration token was not assigned to a project, or you want to assign the edge
      host to a different project.
    - The `install` block shown in the command is _required_ to ensure compatibility with EKS Hybrid Nodes. This should
      not be adjusted or removed in your final **user-data** file.
    - The `stages.initramfs` block is optional and can be adjusted or removed depending on your requirements. If using
      this example, replace `<ssh-public-key>` with your SSH public key.
    - If you need to pull images from a private image registry, supply the credentials for the registry in a
      [`stylus.registryCredentials`](../../../../edge/edge-configuration/installer-reference.md#single-external-registry)
      block.

    :::

    ```shell
    cat << EOF > user-data
    #cloud-config
    stylus:
      site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: <registration-token>
        projectUid: <palette-project-uid>

    install:
      extra-dirs-rootfs:
        - /eks-hybrid
      bind_mounts:
        - /eks-hybrid
        - /etc/aws
        - /etc/containerd
        - /etc/eks
        - /etc/iam
        - /etc/modules-load.d
        - /var/lib/amazon

    stages:
      initramfs:
        - users:
            kairos:
              groups:
                - sudo
              ssh_authorized_keys:
                - <ssh-public-key>
    EOF
    ```

    You can follow the steps in
    [Validate User Data](../../../../edge/edgeforge-workflow/validate-user-data.md#validate-user-data) to validate your
    **user-data** file after creation.

    :::warning

    <!-- prettier-ignore-start -->

    If your host is a virtual machine using a VMXNET3 adapter and you are planning to use
    <VersionedLink text="Flannel" url="/integrations/cni-flannel" /> for your CNI, include the following `initramfs`
    stage in your `user-data` file, replacing `<interface-name>` with the name of the network interface on your Edge
    host. This is due to a
    [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
    which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.
    <!-- prettier-ignore-end -->

    ```shell
     stages:
       initramfs:
         - name: "Disable UDP segmentation"
           commands:
             - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
             - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
    ```

    :::

11. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

    <Tabs group="earthly">

    <TabItem value="Earthly Installed">

    ```bash
    earthly +build-all-images
    ```

    </TabItem>

    <TabItem value="Earthly Not Installed">

    ```bash
    sudo ./earthly.sh +build-all-images
    ```

    </TabItem>

    </Tabs>

    ```hideClipboard bash {2}
    # Output condensed for readability
    ========================== 🌍 Earthly Build  ✅ SUCCESS ==========================
    ```

    :::info

    If you plan to build the Edge Installer ISO using a content bundle, use the `+build-provider-images` option instead
    of the `+build-all-images` option in the command above. The command `sudo ./earthly.sh +build-provider-images` will
    build the provider images but not the Edge installer ISO. After the provider images are built, follow the steps in
    the [Build Content Bundle](../../../../edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) guide to
    build the Edge installer ISO using a content bundle.

    :::

    This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion,
    the command will output the manifest. Note that the `system.*` parameter values in the manifest are the same as what
    you defined earlier in the **.arg** file.

    Copy and save the output attributes in a notepad or clipboard as you will use this output when
    [creating the cluster profile for your hybrid node pools](../create-hybrid-node-pools.md#create-cluster-profile-for-hybrid-node-pools).

    Example manifest output.

    ```bash hideClipboard
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
      system.k8sDistribution: nodeadm
      system.osName: ubuntu
      system.peVersion: v4.5.15
      system.customTag: eks-hybrid
      system.osVersion: 22
    ```

12. Once the build is complete, confirm that the Edge Installer ISO and its checksum were created correctly. The
    filenames will match the `ISO_NAME` argument defined in your `.arg` file.

    ```shell
    ls build
    ```

    Example output.

    ```shell
    palette-edge-installer.iso
    palette-edge-installer.iso.sha256
    ```

13. List the Docker images to review the provider images created. You can identify the provider images by using
    `CUSTOM_TAG` argument defined in your **.arg** file.

    ```shell
    docker images --filter=reference='*/*:*eks-hybrid'
    ```

    Example output.

    ```bash hideClipboard
    REPOSITORY                TAG                                 IMAGE ID       CREATED          SIZE
    spectrocloud/ubuntu       nodeadm-1.30.0-v4.5.15-eks-hybrid   1234a567b890   24 minutes ago   3.67GB
    ```

14. Use the following commands to push the provider images to the image registry you specified. Replace `<repository>`
    and `<tag>` using the output from the previous step.

    :::tip

    If using Docker Hub, you may need to log in first using `docker login`. Provide your Docker ID and password when
    prompted.

    :::

    ```bash
    docker push <repository>:<tag>
    ```

    Example.

    ```bash hideClipboard
    docker push spectrocloud/ubuntu:nodeadm-1.30.0-v4.5.15-eks-hybrid
    ```

    The following example output confirms that the image was pushed to the registry with the correct tag.

    ```bash hideClipboard
    # Lines omitted for readability
    nodeadm-1.30.0-v4.5.15-eks-hybrid: digest: sha256:xyz123... size: 19917
    ```

15. Provision your edge hosts using the installer ISO created in the `build` directory. You can use the following
    sections to help you:

    - [Provision Virtual Machines](/tutorials/clusters/edge/deploy-cluster/#provision-virtual-machines)
    - [Installation on Bare Metal](../../../../edge/site-deployment/stage.md)

Ensure your edge hosts are fully provisioned, configured, and active before performing [validation](#validate-1).

### Validate

Use the following sections to help check that your edge host is ready to be used as an Amazon EKS Hybrid Node.

#### Palette Edge Host Registration

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the table.

#### Network Connectivity

- Verify that you can connect to the edge host through SSH using your private key.

  For example, issue the following command and replace `<privateKey>`, `<sshUsername>`, and `<hostIpAddress>` with your
  SSH private key, SSH username on the host, and the host IP address respectively.

  ```bash
  ssh -i <pathToPrivateKey> <sshUsername>@<hostIpAddress> exit
  ```

- Verify that the edge host has outbound access to the internet.

- Verify that the edge host has outbound connectivity to Spectro Cloud
  [services](../../../../../architecture/palette-public-ips.md) and
  [ports](../../../../../architecture/networking-ports.md#network-ports).

  For example, if you have [netcat](https://linux.die.net/man/1/nc) installed, issue the following command on the edge
  host to check whether the `api.spectrocloud.com` domain is accessible on port `443`.

  ```bash
  nc -z -v api.spectrocloud.com 443
  ```

  Example output, if successful.

  ```shell
  Connection to api.spectrocloud.com port 443 [tcp/https] succeeded!
  ```

- Verify that the edge host has outbound connectivity to the required
  [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).
  Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster
  operations** sections for listed guidance.

  For example, if you have [netcat](https://linux.die.net/man/1/nc) installed, issue the following command on the edge
  host to check whether the `eks.us-east-1.amazonaws.com` domain is accessible on port `443`.

  ```bash
  nc -z -v eks.us-east-1.amazonaws.com 443
  ```

  Example output, if successful.

  ```shell
  Connection to eks.us-east-1.amazonaws.com port 443 [tcp/https] succeeded!
  ```

  :::info

  A table showing the required domains and ports for an example region can be found in the
  [Configure Remote Network](./prepare-network.md#configure-remote-network) section during step 2.

  :::

- Verify that the edge host has the necessary ports available exclusively for
  [Cilium operations](https://docs.cilium.io/en/stable/operations/system_requirements/#firewall-rules).

  For example, issue the following command on the edge host to check whether port `4240` is being used on the edge host.

  ```bash
  sudo lsof -i :4240
  ```

  If the command returns no output, this typically indicates that the port is free.

#### Package Manager Index

- Verify that your edge host package manager has an up-to-date package index. This is to ensure that dependency packages
  for [`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully
  downloaded and installed when [creating hybrid node pools](../create-hybrid-node-pools.md#create-hybrid-node-pool).

  For example, on Ubuntu, you would issue the following command.

  ```shell
  sudo apt-get update
  ```

  Adjust to your operating system and package manager on your edge host.

## Next Steps

Complete the remaining sections as highlighted in [Prepare Environment](./prepare-environment.md).
