---
sidebar_label: "Install Palette Agent"
title: "Install Palette Agent"
description: "Learn how to install the Palette Agent on your host."
hide_table_of_contents: false
toc_max_heading_level: 2
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

## Limitations

- The following table presents the verified combinations of host architecture and cluster profile layers.

  | Host Architecture | OS                                | Kubernetes                                 | Container Network Interface (CNI) | Verified           |
  | ----------------- | --------------------------------- | ------------------------------------------ | --------------------------------- | ------------------ |
  | AMD64             | Ubuntu                            | Palette eXtended Kubernetes - Edge (PXK-E) | Calico                            | :white_check_mark: |
  | AMD64             | Ubuntu                            | K3s                                        | Flannel                           | :white_check_mark: |
  | AMD64             | Rocky Linux 8.10 (Green Obsidian) | Palette eXtended Kubernetes - Edge (PXK-E) | Cilium                            | :white_check_mark: |

- Clusters with Flannel CNI are not verified for local management mode deployments.

- Agent mode is only supported on Linux distributions that have
  [`systemd`](https://www.freedesktop.org/software/systemd/man/latest/systemd.html) installed and available.

- The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL) and Rocky Linux 8
  systems.

- Palette versions prior to 4.6.32 do not support local management mode. Even if you build an ISO using Palette agent
  and CanvOS version 4.6.21 or later, which support local management mode, the agent may be downgraded if your cluster
  uses a content bundle built against a Palette instance older than 4.6.32. This results in deployment failure.

## Prerequisites

- A physical or virtual host with SSH access, access to the internet, and connection to Palette. For local management
  mode deployments, the host does not need to have a connection to Palette and may have limited access to the internet.
  This guide uses an **Ubuntu 22.04** virtual machine deployed in VMware vSphere as an example.

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

  - [bash](https://www.gnu.org/software/bash/)
  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [rsync](https://github.com/RsyncProject/rsync)
  - [systemd](https://systemd.io/)
  - [systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html). This is
    required if you want Palette to manage Network Time Protocol (NTP). If you don't want Palette to manage NTP, you can
    skip this requirement.
  - [systemd-resolved](https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html). This is
    required if you want Palette to manage Domain Name System (DNS). If you don't want Palette to manage DNS, you can
    skip this requirement
  - [systemd-networkd](https://www.freedesktop.org/software/systemd/man/latest/systemd-networkd.html). This requirement
    is specific for clusters that use static IP addresses. You also need this if you want Palette to manage the Edge
    host network
  - [conntrack](https://conntrack-tools.netfilter.org/downloads.html). This requirement is specific for clusters that
    use PXKE as the Kubernetes layer
  - [iptables](https://linux.die.net/man/8/iptables)
  - [rsyslog](https://github.com/rsyslog/rsyslog). This is required for audit logs.
  - (Local management mode only) [Palette Edge CLI](../../downloads/cli-tools.md#palette-edge-cli)

  If you are using Ubuntu or any OS that uses apt or apt-get for package management, you can issue the following command
  to install all dependencies for installation (not including the Palette Edge CLI) with the following command:

  ```shell
  sudo apt-get update && sudo apt-get install -y bash jq zstd rsync systemd-timesyncd conntrack iptables rsyslog --no-install-recommends
  ```

  :::warning

  Avoid installing Docker on the host where you want to install the agent. Docker is a heavyweight tool that could
  interfere with the Palette agent.

  :::

- If installing the FIPS version of Agent Mode on a Rocky Linux edge host, you must configure your SELinux policies to
  grant rsync the required host permissions and ensure you enable cgroup V2.

  If you are using Cilium and have `firewalld` enabled, you must also configure the appropriate `firewalld` rules.
  Follow the process below to apply the necessary configurations before installing Agent Mode.

  <details>

  <summary>Rocky Linux 8 Configurations</summary>

  ### Configure rsync

  1. Enable SELinux to allow full rsync access.

     ```shell
     setsebool -P rsync_full_access 1
     ```

  2. Install the necessary tools to create and apply SELinux policy modules.

     ```shell
     dnf install selinux-policy-devel audit
     ```

  3. Create a file named **rsync_dac_override.te**.

     ```shell
     nano rsync_dac_override.te
     ```

  4. Add the following content to the **rsync_dac_override.te** file.

     ```shell
     module rsync_dac_override 1.0;

     require {
       type rsync_t;
       type default_t;
       class dir read;
       class capability dac_override;
     }

     # Allow rsync_t to read directories labeled default_t
     allow rsync_t default_t:dir read;

     # Allow rsync_t to override discretionary access control (DAC)
     allow rsync_t self:capability dac_override;
     ```

  5. Compile and package the SELinux policy module.

     ```shell
     checkmodule -M -m --output rsync_dac_override.mod rsync_dac_override.te
     semodule_package --outfile rsync_dac_override.pp -m rsync_dac_override.mod
     ```

  6. Install the compiled policy module.

     ```shell
     semodule --install rsync_dac_override.pp
     ```

  ### Enable cgroup V2

  7.  Issue the following command to check if your kernel supports cgroup v2.

      ```shell
      grep cgroup2 /proc/filesystems
      ```

      If the response is `nodev	cgroup2`, your kernel supports cgroup v2 and you may proceed to the next step. If the
      response does not match `nodev	cgroup2`, then your kernel does not support cgroup v2. You need to upgrade to a
      kernel that supports cgroup v2 to proceed.

  8.  Issue the following command to check if cgroup v2 is already enabled.

      ```shell
      stat -fc %T /sys/fs/cgroup
      ```

      If the output is `tmpfs` then cgroup v2 is not enabled. When cgroup v2 is enabled, the output is `cgroup2fs`. If
      cgroup v2 is enabled, skip to step 12.

  9.  Issue the following command to edit the GRUB file to enable cgroup v2.

      ```shell
      sudo vi /etc/default/grub
      ```

      Find the line starting with `GRUB_CMDLINE_LINUX` and add the `systemd.unified_cgroup_hierarchy=1` parameter.

      ```
      GRUB_TIMEOUT=5
      GRUB_DISTRIBUTOR="$(sed 's, release *$,,g' / etc/system-release)"
      GRUB_DEFAULT=saved
      GRUB_DISABLE_SUBMENU=true
      GRUB_TERMINAL_OUTPUT="console"
      GRUB_CMDLINE_LINUX="crashkernel=auto resume=/dev/mapper/rl-swap rd.lvm.lv=rl/root rd.lvm.lv=rl/swap systemd.unified_cgroup_hierarchy=1
      systemd.unified_cgroup_hierarchy=1" GRUB_DISABLE_RECOVERY="true"
      GRUB_ENABLE_BLSCFG=true
      ```

  10. Save the file and regenerate the GRUB configuration.

      ```shell
      sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

  11. Reboot the system.

      ```shell
      sudo reboot
      ```

  ### Configure firewalld (Cilium Only)

  12. (Optional) If you are using Cilium and have `firewalld` enabled, put the following commands into a shell script.

      ```shell
      cat << 'EOF' > firewalld-cilium.sh
      #!/bin/bash

      if [ -z "$1" ]; then
        echo "Usage: $0 <zone>"
        exit 1
      fi

      ZONE="$1"

      # Kubernetes API Server
      firewall-cmd --permanent --zone="$ZONE" --add-port=6443/tcp

      # Etcd
      firewall-cmd --permanent --zone="$ZONE" --add-port=2379-2380/tcp

      # Kubelet API
      firewall-cmd --permanent --zone="$ZONE" --add-port=10250/tcp

      # Scheduler and Controller Manager
      firewall-cmd --permanent --zone="$ZONE" --add-port=10257-10259/tcp

      # kube proxy health check
      firewall-cmd --permanent --zone="$ZONE" --add-port=10255/tcp

      # Nodeport range
      firewall-cmd --permanent --zone="$ZONE" --add-port=30000-32767/tcp

      ############### Start Cilium Rules ##########################

      # Cilium: VXLAN Overlay
      firewall-cmd --permanent --zone="$ZONE" --add-port=8472/udp

      # Cilium: Health Checks
      firewall-cmd --permanent --zone="$ZONE" --add-port=4240/tcp

      # Cilium: Geneve Overlay networking (if enabled)
      firewall-cmd --permanent --zone="$ZONE" --add-port=6081/udp

      # Cilium: WireGuard Encryption (if enabled)
      firewall-cmd --permanent --zone="$ZONE" --add-port=51871/udp

      # Cilium: IPsec Encryption (if enabled)
      firewall-cmd --permanent --zone="$ZONE" --add-protocol=esp

      # Cilium: Prometheus Observability
      firewall-cmd --permanent --zone="$ZONE" --add-port=9962/tcp
      firewall-cmd --permanent --zone="$ZONE" --add-port=9963/tcp

      # Cilium: Enable ICMP Type 8 (Echo request) and Type 0 (Echo Reply)
      firewall-cmd --permanent --zone="$ZONE" --add-icmp-block-inversion

      ############### End Cilium Rules ##########################

      # DNS and service communications

      # DNS (CoreDNS)
      firewall-cmd --permanent --zone="$ZONE" --add-port=53/tcp
      firewall-cmd --permanent --zone="$ZONE" --add-port=53/udp

      # Allow inbound/outbound traffic to port 443 (HTTPS)
      firewall-cmd --permanent --zone="$ZONE" --add-port=443/tcp

      # Allow NAT traffic
      firewall-cmd --permanent --add-masquerade

      # Reload firewalld cache
      firewall-cmd --reload
      EOF

      # Make the script executable
      chmod +x firewalld-cilium.sh
      ```

  13. Execute the script with the name of the `firewalld` zone. For example, the following script sets the rules in the
      firewall zone `public`.

      ```shell
      ./firewalld-cilium.sh public
      ```

  </details>

## Install Palette Agent

<Tabs groupId="env">

<TabItem value="Central Management Mode">

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

   The following configuration includes a Palette registration token and the default Palette endpoint, specifies a
   Palette project, and sets up the `kairos` user. It also specifies credentials for private external registries as well
   as registry mapping rules. Note the following:

   - The host will not shut down and will instead reboot after the agent is installed, with
     [kube-vip](../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and VMware
     vSphere deployments. If your environment does not require kube-vip, set `stylus.vip.skip` to `true`. Refer to
     [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md) to learn
     more about user data configuration.
   - The `projectName` parameter is not required if the associated Palette
     [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) has a
     Default Project set.

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
       externalRegistries:
         registries:
           - domain: "example.registry.com/palette-images"
             username: "admin"
             password: "***************"
             repositoryName: example-repository-private
             certificates:
               - |
                  -----BEGIN CERTIFICATE-----
                  **********************
                  -----END CERTIFICATE-----
         registryMappingRules:
           "us-docker.pkg.dev/palette-images": "example.registry.com/palette-images"

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
     externalRegistries:
       registries:
         - domain: "example.registry.com/palette-images"
           username: "admin"
           password: "***************"
           repositoryName: example-repository-private
           certificates:
             - |
                -----BEGIN CERTIFICATE-----
                **********************
                -----END CERTIFICATE-----
       registryMappingRules:
         "us-docker.pkg.dev/palette-images": "example.registry.com/palette-images"
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

6. If you are using Palette SaaS, download the latest Palette agent installation script. There is a FIPS-compliant
   script, if needed.

   <PartialsComponent category="agent-mode" name="agent-mode-latest-version" />

   <PartialsComponent category="agent-mode" name="agent-mode-versioned" />

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

9. Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for
   automatic registration with Palette. The host will be registered in the same project where the registration token was
   created.

10. Log in to [Palette](https://console.spectrocloud.com/) and select **Clusters** from the left **Main Menu**.

11. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the Edge hosts list.

12. Once the host has been registered with Palette, proceed with the cluster profile creation. Select **Profiles** from
    the left **Main Menu**.

13. Click on **Add Cluster Profile**.

14. In the **Basic Information** section, assign a profile name, a description, and tags. Select the type as **Full**
    and click **Next**.

15. Select **Edge Native** as the **Cloud Type** and click **Next**.

16. The **Profile Layers** section specifies the packs that compose the profile. Add the **BYOS Edge OS** pack version
    **2.0.0** to the OS layer.

17. Click **Values** under **Pack Details**, then click on **Presets** on the right-hand side. Select **Agent Mode**.

    ![View of the cluster profile creation page with the BYOS pack.](/deployment-modes_agent-mode_byos-pack.webp)

18. Click **Next Layer** to continue.

19. Complete the cluster profile creation process by filling out the remaining layers.

20. Follow the steps in the [Create Cluster Definition](../../clusters/edge/site-deployment/model-profile.md) guide to
    deploy a cluster using your registered host as a cluster node.

:::warning

If using the FIPS version of Agent Mode on a Rocky Linux edge host, SELinux may incorrectly label the
**kubeadm-flags.env** file during cluster deployment or when certain configurations are adjusted, preventing the Kubelet
from accessing it and properly managing the cluster. Refer to the
[Edge Troubleshooting Guide](../../troubleshooting/edge/edge.md#scenario---kubelet-process-cannot-access-kubeadm-flags)
for guidance.

:::

</TabItem>

<TabItem value="Local Management Mode">

In local management mode, your host does not have a connection to Palette and may also have limited access to the
internet.

:::warning

Ensure your Palette instance is version 4.6.32 or later to build Edge artifacts, as earlier versions do not support
local management mode.

You can check the Palette agent version your Palette environment uses with the following command. Replace
`<palette-endpoint>` with your Palette endpoint and `<api-key>` with your
[Palette API key](../../user-management/authentication/api-key/api-key.md).

```shell
curl --location --request GET 'https://<palette-endpoint>/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: <api-key>'  | jq --raw-output '.spec.latestVersion.content | match("version: ([^\n]+)").captures[0].string'
```

The Palette agent version should be 4.6.21 or later, which corresponds to Palette instance version 4.6.32. If you are
building a custom Edge ISO, ensure you use CanvOS version 4.6.21 or later as well.

:::

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to
   your private SSH key and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> ubuntu@<host-ip-or-domain>
   ```

2. (Optional) If you are not accessing the internet via a proxy, skip this step.

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

3. Download the airgap agent installation package and save it as a TAR file. Replace `<architecture>` with the
   architecture of your CPU. If you have ARM64, use `arm64`. If you have AMD64 or x86_64, use `amd64`. Replace
   `<version>` with the desired version number. In this example, we use `v4.6.24`. Refer to
   [Agent Mode Releases](https://github.com/spectrocloud/agent-mode/releases) for all the available releases.

   <PartialsComponent category="agent-mode" name="agent-mode-airgap-version" />

4. Extract the package to the root folder.

   ```shell
   sudo tar -xvf agent-mode-linux-<architecture>.tar -C /
   ```

5. Issue the command below to create the `userdata` file and configure your host declaratively.

   The following configuration indicates the management mode to be local and sets up the `kairos` user. The host will
   not shut down and will reboot after the agent installation, with
   [kube-vip](../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and VMware vSphere
   deployments. If your environment does not require kube-vip, set `stylus.vip.skip` to `true`. Refer to
   [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md) to learn more
   about user data configuration.

   ```shell
   sudo tee /var/lib/spectro/userdata > /dev/null << EOF
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     vip:
       skip: false
     managementMode: local
   stages:
     initramfs:
       - users:
          kairos:
            groups:
              - sudo
            passwd: kairos
         name: "Configure user"
   EOF
   ```

6. Issue the following command confirm that your user data file was created successfully at the correct location.

   ```shell
   sudo cat /var/lib/spectro/userdata
   ```

   The response is the content of the user data file.

   <!-- prettier-ignore -->
   ```yaml
   #cloud-config
   install:
     reboot: true
     poweroff: false

   stylus:
     vip:
       skip: false
     managementMode: local
   stages:
     initramfs:
       - users:
          kairos:
            groups:
              - sudo
            passwd: kairos
         name: "Configure user"
   ```

7. Reboot the host. The host will automatically start the installation process once it reboots.

8. Log in to [Palette](https://console.spectrocloud.com/) and select **Clusters** from the left **Main Menu**.

9. Select **Profiles** from the left **Main Menu**.

10. Click on **Add Cluster Profile**.

11. In the **Basic Information** section, assign the a profile name, a description, and tags. Select the type as
    **Full** and click **Next**.

12. Select **Edge Native** as the **Cloud Type** and click **Next**.

13. The **Profile Layers** section specifies the packs that compose the profile. Add the **BYOS Edge OS** pack version
    **2.0.0** to the OS layer.

14. Click **Values** under **Pack Details**, then click on **Presets** on the right-hand side. Select **Agent Mode**.

    ![View of the cluster profile creation page with the BYOS pack.](/deployment-modes_agent-mode_byos-pack.webp)

15. Click **Next Layer** to continue.

16. In the **Kubernetes** layer, under `cluster.config.kube-apiserver-arg`, remove `AlwaysPullImages` from the list item
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

17. Complete the cluster profile creation process by filling out the remaining layers. In the application layer, make
    sure you include the **Harbor Edge-Native Config** pack. This pack is required for clusters in local management
    mode.

18. Follow the steps in
    [Export Cluster Definition](../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) to export
    a cluster definition of your profile. You will use this cluster definition later when you create the cluster in
    Local UI.

19. (Optional) If your host has access to all the images referenced by your cluster profile, you may skip this step.

    Follow the steps in
    [Build Content Bundles](../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) to build a
    content bundle for your cluster profile. The content bundle will contain all the artifacts required to create your
    cluster and it will allow you to create a cluster even if your host has no access to an external image registry.

20. Log in to [Local UI](../../clusters/edge/local-ui/host-management/access-console.md).

21. Follow the steps in
    [Upload Content Bundles](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to upload the
    content bundle to your host.

22. Follow the steps in [Create Local Cluster](../../clusters/edge/local-ui/cluster-management/create-cluster.md) to use
    the cluster definition you exported previously to create a cluster.

:::warning

If using the FIPS version of Agent Mode on a Rocky Linux edge host, SELinux may incorrectly label the
**kubeadm-flags.env** file during cluster deployment or when certain configurations are adjusted, preventing the Kubelet
from accessing it and properly managing the cluster. Refer to the
[Edge Troubleshooting Guide](../../troubleshooting/edge/edge.md#scenario---kubelet-process-cannot-access-kubeadm-flags)
for guidance.

:::

</TabItem>

</Tabs>

## Validate

<Tabs groupId="env">

<TabItem value="Central Management Mode">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the host cluster you created to view its details page.

4. Verify that the cluster is listed as **Healthy** and has a **Running** status.

Alongside Palette, [Local UI](../../clusters/edge/local-ui/host-management/access-console.md) allows you to fully manage
the lifecycle of your edge hosts. Refer to the
[Reboot, Shutdown, and Reset Edge Host](../../clusters/edge/local-ui/host-management/reset-reboot.md) guide for further
details on how to use these operations

</TabItem>

<TabItem value="Local Management Mode">

1. Log in to [Local UI](../../clusters/edge/local-ui/host-management/access-console.md).

2. Select **Cluster** from the left **Main Menu**.

3. Verify that your cluster is in a **Heathy** status.

Local UI allows you to fully manage the lifecycle of your edge hosts. Refer to the
[Reboot, Shutdown, and Reset Edge Host](../../clusters/edge/local-ui/host-management/reset-reboot.md) guide for further
details on how to use these operations.

</TabItem>

</Tabs>
