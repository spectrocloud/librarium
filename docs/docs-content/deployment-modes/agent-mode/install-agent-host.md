---
sidebar_label: "Install Palette Agent"
title: "Install Palette Agent"
description: "Learn how to install the Palette Agent on your host."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "agent mode"]
---

Agent mode allows you to bring your own host, regardless of its architecture and Operating System (OS), to be managed by
Palette and to operate as nodes in your Kubernetes clusters. For example, you can use an
[AWS EC2 instance](https://aws.amazon.com/ec2/), a
[Raspberry Pi](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.raspberrypi.com/&ved=2ahUKEwi-38Gt__SIAxU2CnkGHeU6Ha8QFnoECAkQAQ&usg=AOvVaw12ldjgQls5EV3KbUmJD0nz),
a
[VMware vSphere virtual machine](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-F559CE9C-2D8F-4F69-A846-56A1F4FC8529.html),
and more, as long as they meet the minimum hardware requirements.

This page guides you through the process of installing the Palette agent on your host. You will learn how to create the
user data file to configure your host, install the agent, and verify that your host was successfully registered with
Palette. You will then create a cluster profile and use the registered host to deploy a cluster.

:::preview

:::

## Limitations

- Currently, agent mode only supports non-FIPS workflows.

- The following table presents the verified combinations of host architecture and cluster profile layers.

  | Host Architecture | OS     | Kubernetes                                 | Container Network Interface (CNI) | Verified           |
  | ----------------- | ------ | ------------------------------------------ | --------------------------------- | ------------------ |
  | AMD64             | Ubuntu | Palette eXtended Kubernetes - Edge (PXK-E) | Calico                            | :white_check_mark: |
  | AMD64             | Ubuntu | K3s                                        | Flannel                           | :white_check_mark: |

- Clusters with Flannel CNI is not verified for airgap deployments.

- Agent mode is only supported on Linux distributions that have
  [`systemd`](https://www.freedesktop.org/software/systemd/man/latest/systemd.html) installed and available.

## Prerequisites

- A physical or virtual host with SSH access, access to the internet, and connection to Palette. For airgap deployments,
  the host does not need to have a connection to Palette and may have limited access to the internet. This guide uses an
  **Ubuntu 22.04** virtual machine deployed in VMware vSphere as an example.

- The host must meet the following minimum hardware requirements:

  - 2 CPU
  - 8 GB memory
  - 100 GB storage

- A Palette tenant registration token. Refer to the
  [Create a Registration Token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md)
  guide for instructions on how to create a token.

- One IP address is required for the cluster's Virtual IP (VIP) address.

- Ensure that the host has `Bash` configured as the default shell.

- Ensure the following software is installed and available:

  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [rsync](https://github.com/RsyncProject/rsync)
  - [systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html)
  - [conntrack](https://conntrack-tools.netfilter.org/downloads.html). This requirement is specific for clusters that
    use PXKE as the Kubernetes layer.
  - [iptables](https://linux.die.net/man/8/iptables)
  - (Airgap only) [Crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and
    available.
  - (Airgap only) [Palette Edge CLI](../../spectro-downloads.md#palette-edge-cli) is installed and available.

  :::warning

  Avoid installing Docker on the host where you want to install the agent. Docker is a heavyweight tool that could
  interfere with the Palette agent.

  :::

## Install Palette Agent

<Tabs groupId="env">

<TabItem value="Connected">

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to
   your private SSH key and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> ubuntu@<host-ip-or-domain>
   ```

2. Export your Palette registration token. Replace `<your-palette-registration-token>` with your token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. (Optional) If you are not installing the agent on a host that accesses the internet via a proxy, skip this step.

   If you are installing the agent on a host that accesses the internet via a network proxy, export the proxy
   configurations in your current terminal session. We recommend exporting the variables both in uppercase and lowercase
   to ensure compatibility. Replace `<httpProxyAddress>` and `<httpsProxyAddress>` with the address and port to your
   HTTP and HTTPS proxy servers, respectively.

   ```shell
   export http_proxy=<httpProxyAddress>
   export https_proxy=<httpsProxyAddress>
   export HTTP_PROXY=<httpProxyAddress>
   export HTTPS_PROXY=<httpsProxyAddress>
   ```

4. Issue the command below to create the **user-data** file and configure your host declaratively.

   :::info

   If your host needs a proxy to access the internet, you need to provide the proxy configurations in the user data as
   well. For more information, refer to
   [Site Network Parameters](../../clusters/edge/edge-configuration/installer-reference.md#site-network-parameters).

   Alternatively, you can install the agent first and configure proxy in Local UI. For more information, refer to
   [Configure HTTP Proxy](../../clusters/edge/local-ui/host-management/configure-proxy.md).

   :::

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

5. Export the path to your user data file.

   ```shell
   export USERDATA=./user-data
   ```

6. Download the latest version of the Palette agent installation script.

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
   ```

   If you have a dedicated or on-premises instance of Palette, use the command below to get the Palette's stylus
   version. Replace `<palette-endpoint>` with your Palette endpoint and `<api-key>` with your Palette API key.

   ```shell
   curl --location --request GET 'https://<palette-endpoint>/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: <api-key>'  | jq --raw-output '.spec.latestVersion.content | match("version: ([^\n]+)").captures[0].string'
   ```

   ```text hideClipboard
   4.5.0
   ```

   Next, download the version of the Palette agent installation script that matches the stylus version. Replace
   `<stylus-version>` with your Palette stylus version. For example, if the output of the previous command was `4.5.0`,
   replace `<stylus-version>` with `v4.5.0`.

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/download/<stylus-version>/palette-agent-install.sh
   ```

7. Grant execution permissions to the `install.sh` script.

   ```shell
   chmod +x ./palette-agent-install.sh
   ```

8. Issue the following command to install the agent on your host.

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

   The termination of the SSH connection, as shown in the example below, confirms that the script has completed its
   tasks.

   ```text hideClipboard
   Connection to 192.168.1.100 closed by remote host.
   Connection to 192.168.1.100 closed.
   ```

9. Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for
   automatic registration with Palette. The host will be registered in the same project where the registration token was
   created.

10. Log in to [Palette](https://console.spectrocloud.com/) and select **Clusters** from the left **Main Menu**.

11. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the Edge hosts list.

12. Once the host has been registered with Palette, proceed with the cluster profile creation. Select **Profiles** from
    the left **Main Menu**.

13. Click on **Add Cluster Profile**.

14. In the **Basic Information** section, assign the a profile name, a description, and tags. Select the type as
    **Full** and click **Next**.

15. Select **Edge Native** as the **Cloud Type** and click **Next**.

16. The **Profile Layers** section specifies the packs that compose the profile. Add the **BYOS Edge OS** pack version
    **2.0.0** to the OS layer.

17. Click **Values** under **Pack Details**, then click on **Presets** on the right-hand side. Select **Agent Mode**.

    ![View of the cluster profile creation page with the BYOS pack.](/deployment-modes_agent-mode_byos-pack.webp)

18. Click **Next Layer** to continue.

19. Complete the cluster profile creation process by filling out the remaining layers.

20. Follow the steps in the [Create Cluster Definition](../../clusters/edge/site-deployment/model-profile.md) guide to
    deploy a cluster using your registered host as a cluster node.

</TabItem>

<TabItem value="Airgap">

In an airgapped environment, your host does not have a connection to Palette and may also have limited access to the
internet.

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to
   your private SSH key and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> ubuntu@<host-ip-or-domain>
   ```

2. Issue the command below to create the **user-data** file and configure your host declaratively.

   The following configuration indicates the installation mode to be airgap and sets up the `kairos` user. The host will
   not shut down and will reboot after the agent installation, with
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
     installationMode: airgap
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: kairos
   EOF
   ```

3. Export the path to your user data file.

   ```shell
   export USERDATA=./user-data
   ```

4. (Optional) If you are not accessing the internet via a proxy, skip this step.

   If you are downloading the agent on a host that accesses the internet via a proxy network, export the proxy
   configurations in your current terminal session so that the script downloading the agent binary can execute
   successfully. We recommend exporting the variables both in uppercase and lowercase to ensure compatibility. Replace
   `<httpProxyAddress>` and `<httpsProxyAddress>` with the address and port to your HTTP and HTTPS proxy servers,
   respectively.

   ```shell
   export http_proxy=<httpProxyAddress>
   export https_proxy=<httpsProxyAddress>
   export HTTP_PROXY=<httpProxyAddress>
   export HTTPS_PROXY=<httpsProxyAddress>
   ```

5. Download the agent installation image from a host with internet access and export it to a TAR file. Replace
   `<architecture>` with the architecture of your CPU. If you have ARM64, use `arm64`. If you have AMD64 or x86_64, use
   `amd64`. Replace `<version>` with the desired version number. In this example, we use `v4.5.0`.

   ```shell
   crane pull us-docker.pkg.dev/palette-images/edge/stylus-agent-mode-linux-<architecture>:<version> agent-image.tar
   ```

6. Issue the following command from a host with internet access to download the agent binary and name the binary
   `palette-agent`. Replace `<architecture>` with the architecture of your CPU. If you have ARM64, use `arm64`. If you
   have AMD64 or x86_64, use `amd64`. Replace `<version>` with the desired version number. In this example, we use
   `v4.5.0`.

   ```shell
   export URL=https://github.com/spectrocloud/agent-mode/releases/download/<version>/palette-agent-linux-<architecture>
   curl --verbose --location $URL --output palette-agent
   ```

7. Issue the following command to make the binary executable.

   ```shell
   chmod +x palette-agent
   ```

8. Copy the agent binary as well as the agent image TAR file from your host with internet access to the host where you
   want to install the Palette agent.

9. Issue the following command to install the agent on your host. Replace `<image-tag>` with the tag of the installation
   image. If your user data is not in the current directory, replace `./user-data` with the path to your user data file.
   If your agent image TAR file is not in the current directory, replace `./agent-image.tar` with the path to your image
   TAR file.

   ```shell
   sudo ./palette-agent install --source ./agent-image.tar --config "./user-data" --local
   ```

   The termination of the SSH connection, as shown in the example below, confirms that the script has completed its
   tasks.

   ```text hideClipboard
   Connection to 192.168.1.100 closed by remote host.
   Connection to 192.168.1.100 closed.
   ```

10. Log in to [Palette](https://console.spectrocloud.com/) and select **Clusters** from the left **Main Menu**.

11. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the Edge hosts list.

12. Once the host has been registered with Palette, proceed with the cluster profile creation. Select **Profiles** from
    the left **Main Menu**.

13. Click on **Add Cluster Profile**.

14. In the **Basic Information** section, assign the a profile name, a description, and tags. Select the type as
    **Full** and click **Next**.

15. Select **Edge Native** as the **Cloud Type** and click **Next**.

16. The **Profile Layers** section specifies the packs that compose the profile. Add the **BYOS Edge OS** pack version
    **2.0.0** to the OS layer.

17. Click **Values** under **Pack Details**, then click on **Presets** on the right-hand side. Select **Agent Mode**.

    ![View of the cluster profile creation page with the BYOS pack.](/deployment-modes_agent-mode_byos-pack.webp)

18. Click **Next Layer** to continue.

19. In the **Kubernetes** layer, under `cluster.config.kube-apiserver-arg`, remove `AlwaysPullImages` from the list item
    `enable-admission-plugins`:

    ```yaml {7}
    kube-apiserver-arg:
      - anonymous-auth=true
      - profiling=false
      - disable-admission-plugins=AlwaysAdmit
      - default-not-ready-toleration-seconds=60
      - default-unreachable-toleration-seconds=60
      - enable-admission-plugins=NamespaceLifecycle,ServiceAccount,NodeRestriction
    ```

20. Complete the cluster profile creation process by filling out the remaining layers. In the application layer, make
    sure you include the **Harbor Edge-Native Config** pack. This pack is required for airgapped clusters.

21. Follow the steps in
    [Export Cluster Definition](../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) to export
    a cluster definition of your profile. You will use this cluster definition later when you create the cluster in
    Local UI.

22. (Optional) If your host has access to all the images referenced by your cluster profile, you may skip this step.

    Follow the steps in
    [Build Content Bundles](../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) to build a
    content bundle for your cluster profile. The content bundle will contain all the artifacts required to create your
    cluster and it will allow you to create a cluster even if your host has no access to an external image registry.

23. Log in to [Local UI](../../clusters/edge/local-ui/host-management/access-console.md).

24. Follow the steps in
    [Upload Content Bundles](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to upload the
    content bundle to your host.

25. Follow the steps in [Create Local Cluster](../../clusters/edge/local-ui/cluster-management/create-cluster.md) to use
    the cluster definition you exported previously to create a cluster.

</TabItem>

</Tabs>

## Validate

<Tabs groupId="env">

<TabItem value="Connected">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the host cluster you created to view its details page.

4. Verify that the cluster is listed as **Healthy** and has a **Running** status.

</TabItem>

<TabItem value="Airgap">

1. Log in to [Local UI](../../clusters/edge/local-ui/host-management/access-console.md).

2. Select **Cluster** from the left **Main Menu**.

3. Verify that your cluster is in a **Heathy** status.

</TabItem>

</Tabs>
