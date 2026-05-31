---
sidebar_label: "Install Palette Agent"
title: "Install Palette Agent"
description: "Learn how to install the Palette Agent on your host."
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
sidebar_position: 10
tags: ["edge", "agent mode"]
---

Agent mode allows you to bring your own host, regardless of its architecture and OS, to be managed by Palette and
operate as nodes in your Kubernetes clusters. For example, you can use an
[AWS EC2 instance](https://aws.amazon.com/ec2/), a [Raspberry Pi](https://www.raspberrypi.com/), a
[VMware vSphere virtual machine](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-virtual-machine-administration.html),
and more, as long as they meet the minimum hardware requirements.

This page guides you through the process of installing the Palette agent on your host, as well as uninstalling the agent
if it is no longer needed. You will learn how to create the user data file to configure your host, install the agent,
and verify that your host was successfully registered with Palette. You will then create a cluster profile, which can be
used to deploy your cluster.

## Limitations

- The following table presents the verified combinations of host architecture and cluster profile layers.

  | Host Architecture | OS                                | Kubernetes                                 | Container Network Interface (CNI) |
  | ----------------- | --------------------------------- | ------------------------------------------ | --------------------------------- |
  | AMD64             | Ubuntu                            | Palette eXtended Kubernetes - Edge (PXK-E) | Calico                            |
  | AMD64             | Ubuntu                            | K3s                                        | Flannel                           |
  | AMD64             | Rocky Linux 8.10 (Green Obsidian) | Palette eXtended Kubernetes - Edge (PXK-E) | Cilium                            |

- Clusters with Flannel CNI are not verified for local management mode deployments.

- The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL) and Rocky Linux 8
  systems.

- Palette versions prior to 4.6.32 do not support local management mode. Even if you build an ISO using Palette agent
  and CanvOS version 4.6.21 or later, which support local management mode, the agent may be downgraded if your cluster
  uses a content bundle built against a Palette instance older than 4.6.32. This results in deployment failure.

## Install Palette Agent

Take the following steps to install the Palette agent on an Edge host for the first time.

### Prerequisites

- A physical or virtual host with SSH access, access to the internet, and a connection to Palette. For local management
  mode deployments, the host does not need to have a connection to Palette and may have limited access to the internet.

- The host must meet the following minimum hardware requirements:

  - 2 CPU
  - 8 GB of memory
  - 100 GB of storage

- A Palette tenant
  [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md).

- The following software installed and available:

  - [bash](https://www.gnu.org/software/bash/) - Must be configured as the default shell.
  - [jq](https://jqlang.github.io/jq/download/)
  - [Zstandard](https://facebook.github.io/zstd/)
  - [rsync](https://github.com/RsyncProject/rsync)
  - [systemd](https://systemd.io/)
  - [systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html) -
    Required if you want Palette to manage Network Time Protocol (NTP). Must be enabled.
  - [systemd-resolved](https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html) - Required
    if you want Palette to manage Domain Name System (DNS) or if you plan to use overlay networks for clusters deployed
    on your Edge host. Must be enabled. Refer to our
    [Configure networkd to Prepare Host for Overlay Network](./overlay-preparation.md) guide for information on
    installing and configuring `systemd-resolved`.
  - [systemd-networkd](https://www.freedesktop.org/software/systemd/man/latest/systemd-networkd.html) - Required if you
    want Palette to manage static IP addresses or if you plan to use overlay networks for clusters deployed on your Edge
    host. Must be enabled. Refer to our
    [Configure networkd to Prepare Host for Overlay Network](./overlay-preparation.md) guide for information on
    installing and configuring `systemd-networkd`.
  - [conntrack](https://conntrack-tools.netfilter.org/downloads.html) - Required for clusters that use PXK-E as its
    Kubernetes layer.
  - [iptables](https://linux.die.net/man/8/iptables)
  - [rsyslog](https://github.com/rsyslog/rsyslog) - Required for audit logs. Must be enabled.

  If you are using Ubuntu or any OS that uses apt or apt-get for package management, you can issue the following command
  to install all dependencies.

  ```shell
  sudo apt-get update && \
  sudo apt-get install --yes --no-install-recommends \
    bash \
    jq \
    zstd \
    rsync \
    systemd-timesyncd \
    conntrack \
    iptables \
    rsyslog
  ```

  Use the following command to verify that the necessary systemd services are enabled.

  ```shell
  sudo systemctl enable --now systemd-timesyncd
  sudo systemctl enable --now systemd-resolved
  sudo systemctl enable --now systemd-networkd
  sudo systemctl enable --now rsyslog
  ```

  :::warning

  Avoid installing Docker on the host where you want to install the agent. Docker is a heavyweight tool that could
  interfere with the Palette agent.

  :::

- If you plan on creating clusters that need to enable network overlay, consider adding specific user data blocks to
  install and configure the necessary network prerequisites. Refer to
  [Configure networkd to Prepare Host for Overlay Network](./overlay-preparation.md) for more information.

- If installing the FIPS version of Agent Mode on a Rocky Linux Edge host, you must configure your SELinux policies to
  grant rsync the required host permissions and ensure you enable cgroup v2.

  If you are using Cilium and have `firewalld` enabled, you must also configure the appropriate `firewalld` rules.
  Follow the process below to apply the necessary configurations before installing Agent Mode.

  <details>

  <summary>Rocky Linux 8 Configurations</summary>

  #### Configure rsync

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

  #### Enable cgroup v2

  1.  Issue the following command to check if your kernel supports cgroup v2.

      ```shell
      grep cgroup2 /proc/filesystems
      ```

      If the response is `nodev	cgroup2`, your kernel supports cgroup v2 and you may proceed to the next step. If the
      response does not match `nodev	cgroup2`, then your kernel does not support cgroup v2. You need to upgrade to a
      kernel that supports cgroup v2 to proceed.

  2.  Issue the following command to check if cgroup v2 is already enabled.

      ```shell
      stat -fc %T /sys/fs/cgroup
      ```

      If the output is `tmpfs` then cgroup v2 is not enabled. When cgroup v2 is enabled, the output is `cgroup2fs`. If
      cgroup v2 is enabled, skip to step 12.

  3.  Issue the following command to edit the GRUB file to enable cgroup v2.

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

  4.  Save the file and regenerate the GRUB configuration.

      ```shell
      sudo grub2-mkconfig -o /boot/grub2/grub.cfg
      ```

  5.  Reboot the system.

      ```shell
      sudo reboot
      ```

  #### Configure firewalld (Cilium Only)

  1. (Optional) If you are using Cilium and have `firewalld` enabled, put the following commands into a shell script.

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

  2. Execute the script with the name of the `firewalld` zone. For example, the following script sets the rules in the
     firewall zone `public`.

     ```shell
     ./firewalld-cilium.sh public
     ```

  </details>

### Enablement

<Tabs groupId="env">

<TabItem value="Central Management Mode">

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Export your Palette registration token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. (Proxy only) For Edge hosts that use proxies to access the internet, export the proxy configurations in your current
   terminal session. We recommend exporting the variables both in uppercase and lowercase to ensure compatibility.
   Replace `<http-proxy-address>` and `<https-proxy-address>` with the address and port of your HTTP and HTTPS proxy
   servers, respectively.

   ```shell
   export http_proxy=<httpProxyAddress>
   export http_proxy=<http-proxy-address>
   export https_proxy=<https-proxy-address>
   export HTTP_PROXY=<http-proxy-address>
   export HTTPS_PROXY=<https-proxy-address>
   ```

4. Issue the command below to create the `user-data` file and configure your host declaratively.

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

   - Palette automatically displays Graphics Processing Unit (GPU) specifications for Edge hosts with certain GPU
     vendor-model combinations in [Edge Host Grid View](../../clusters/edge/site-deployment/edge-host-view.md) and on
     the Edge host **Overview** tab. For other GPU models and vendors, Palette attempts to automatically source GPU
     information using the vendor-specific driver or command-line interface (CLI) installed on the Edge host. If Palette
     cannot automatically retrieve the GPU specs, you can provide them manually via the `user-data` file (Appliance and
     Agent mode) or with a `custom-hardware-specs-lookup.json` file (Appliance mode only). Refer to
     [Prepare User Data and Argument Files](../../clusters/edge/edgeforge-workflow/prepare-user-data.md#configure-gpu-specifications-optional)
     for additional information.

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

     The output should contain the value of your Palette registration token assigned to the `edgeHostToken` parameter,
     as displayed in the example output below.

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

      <!-- prettier-ignore-start -->

     :::warning

     If your setup meets the following conditions, include the following `initramfs` stage in your `user-data` file,
     replacing `<interface-name>` with the name of the network interface on your Edge host:

     - Your host is a virtual machine.
     - The virtual machine uses a VMXNET3 adapter.
     - You are planning to use _one_ of the following in your Edge cluster:

       - An [overlay network](../../clusters/edge/networking/vxlan-overlay.md).
       - <VersionedLink text="Flannel" url="/integrations/cni-flannel" /> for your CNI.

       ```shell
       stages:
         initramfs:
           - name: "Disable UDP segmentation"
             commands:
               - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
               - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
       ```

     This is due to a
     [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
     which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.

     :::

      <!-- prettier-ignore-end -->

5. Export the path to your `user-data` file.

   ```shell
   export USERDATA=./user-data
   ```

6. Download the appropriate script based on whether you are registering your Edge host with Palette SaaS or a
   self-hosted Palette instance.

    <Tabs>

    <TabItem label="SaaS" value="saas">

   Choose between installing a FIPS-compliant version or non-FIPS version.

   <PartialsComponent category="agent-mode" name="agent-mode-latest-version" />

    </TabItem>

    <TabItem label="Self-Hosted" value="self-hosted">

   <PartialsComponent category="agent-mode" name="agent-mode-versioned" />

    </TabItem>

    </Tabs>

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

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. (Proxy only) For Edge hosts that use proxies to access the internet, export the proxy configurations in your current
   terminal session. We recommend exporting the variables both in uppercase and lowercase to ensure compatibility.
   Replace `<http-proxy-address>` and `<https-proxy-address>` with the address and port of your HTTP and HTTPS proxy
   servers, respectively.

   ```shell
   export http_proxy=<httpProxyAddress>
   export https_proxy=<httpsProxyAddress>
   export HTTP_PROXY=<httpProxyAddress>
   export http_proxy=<http-proxy-address>
   export https_proxy=<https-proxy-address>
   export HTTP_PROXY=<http-proxy-address>
   export HTTPS_PROXY=<https-proxy-address>
   ```

3. Download the airgap agent installation package and save it as a TAR file. Replace `<architecture>` with the
   architecture of your CPU. If you have ARM64, use `arm64`. If you have AMD64 or x86_64, use `amd64`. Replace
   `<version>` with the desired version number. Refer to
   [Agent Mode Releases](https://github.com/spectrocloud/agent-mode/releases) for all the available releases.

   <PartialsComponent category="agent-mode" name="agent-mode-airgap-version" />

4. Extract the package to the root folder.

   ```shell
   sudo tar -xvf agent-mode-linux-<architecture>.tar -C /
   ```

5. Issue the command below to create your user data, which is used to configure your host declaratively.

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

    <!-- prettier-ignore-start -->

   :::warning

   If your setup meets the following conditions, include the following `initramfs` stage in your `user-data` file,
   replacing `<interface-name>` with the name of the network interface on your Edge host:

   - Your host is a virtual machine.
   - The virtual machine uses a VMXNET3 adapter.
   - You are planning to use _one_ of the following in your Edge cluster:

     - An [overlay network](../../clusters/edge/networking/vxlan-overlay.md).
     - <VersionedLink text="Flannel" url="/integrations/cni-flannel" /> for your CNI.

   ```shell
   stages:
     initramfs:
       - name: "Disable UDP segmentation"
         commands:
           - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
           - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
   ```

   This is due to a
   [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
   which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.

   :::

    <!-- prettier-ignore-end -->

6. Issue the following command to confirm that your user data was created successfully at the correct location.

   ```shell
   sudo cat /var/lib/spectro/userdata
   ```

   The response is the content of the `userdata` file.

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

</TabItem>

</Tabs>

### Validate

<Tabs groupId="env">

<TabItem value="Central Management Mode">

To verify the Palette agent was installed, you can confirm the Edge host is registered with your Palette instance
through the Palette UI or issue `palette-agent` commands directly against the host.

#### Palette UI

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Select the **Edge Hosts** tab. Locate the machine you installed the Palette agent on, and verify the host is
   **Healthy**.

#### Edge Host Terminal

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Verify the Palette agent version.

   ```shell
   palette-agent version
   ```

   ```shell title="Example output" hideClipboard
   version: v4.9.10
   build: release
   fips:
   ```

</TabItem>

<TabItem value="Local Management Mode">

To verify the Palette agent was installed, you can either access
[Local UI](../../clusters/edge/local-ui/host-management/access-console.md) using the IP address of your Edge host or
issue `palette-agent` commands directly against the host.

#### Edge Host Terminal

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Verify the Palette agent version.

   ```shell
   palette-agent version
   ```

   ```shell title="Example output" hideClipboard
   version: v4.9.10
   build: release
   fips:
   ```

</TabItem>

</Tabs>

## Create Edge Native Cluster Profile

To use your Edge host as part of a cluster, you must create an Edge Native cluster profile using the Agent Mode preset.

### Prerequisites

- A Palette account with the `clusterProfile.create` permission. Refer to our
  [Cluster Profile Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference guide for more information about roles and permissions.

### Enablement

<Tabs groupId="env">

<TabItem value="Central Management Mode">

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Infrastructure" />

5. For the **Infrastructure provider**, select **Edge Native**. Click **Next**.

<!-- prettier-ignore-start -->

6. Add the <VersionedLink text="BYOOS (Edge)" url="/integrations/packs/?pack=edge-native-byoi" /> pack.

<!-- prettier-ignore-end -->

7. On the **Configure Pack** overlay, under **Pack Details**, select **Values**.

8. On the top-right, expand **Presets** and select **Agent Mode**.

   ![View of the cluster profile creation page with the BYOS pack.](/install-agent-host_byoos-pack.webp)

9. Select **Next Layer** to continue.

10. Complete the cluster profile creation process by filling out the remaining layers.

</TabItem>

<TabItem value="Local Management Mode">

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Full" />

5. For the **Infrastructure provider**, select **Edge Native**. Click **Next**.

<!-- prettier-ignore-start -->

6. Add the <VersionedLink text="BYOOS (Edge)" url="/integrations/packs/?pack=edge-native-byoi" /> pack.

<!-- prettier-ignore-end -->

7. On the **Configure Pack** overlay, under **Pack Details**, select **Values**.

8. On the top-right, expand **Presets** and select **Agent Mode**.

   ![View of the cluster profile creation page with the BYOS pack.](/install-agent-host_byoos-pack.webp)

9. Select **Next Layer** to continue.

10. In the **Kubernetes** layer, under `cluster.config`, remove `AlwaysPullImages` from the list item
    `enable-admission-plugins`.

    ```yaml {7}
    cluster:
      config: |
        clusterConfiguration:
          apiServer:
            extraArgs:
              - name: "enable-admission-plugins"
                value: "NamespaceLifecycle,ServiceAccount,NodeRestriction"
    ```

<!-- prettier-ignore-start -->

11. Complete the cluster profile creation process by filling out the remaining layers. Ensure you add the
<VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> add-on pack. 
This pack is required for clusters in local management mode.

<!-- prettier-ignore-end -->

</TabItem>

</Tabs>

:::warning

If using the FIPS version of Agent Mode on a Rocky Linux Edge host, SELinux may incorrectly label the
`kubeadm-flags.env` file during cluster deployment or when certain configurations are adjusted, preventing the Kubelet
from accessing it and properly managing the cluster. Refer to the
[Edge Troubleshooting Guide](../../troubleshooting/edge/edge.md#scenario---kubelet-process-cannot-access-kubeadm-flags)
for guidance.

:::

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**.

3. Verify the cluster profile you created is present in the **Cluster Profiles** table.

## Uninstall Palette Agent

The `palette-agent uninstall` command removes the Palette agent. The uninstall process removes agent binaries, systemd
services, Kubernetes components, and runtime state, but some artifacts from the agent or the Kubernetes distribution it
provisioned may remain on the filesystem.

The following table lists the available flags for `palette-agent uninstall`.

| **Flag**               | **Description**                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--force`              | Skip the interactive confirmation prompt. Required for non-interactive or automated use.                                                                                                                                                                                                    |
| `--dry-run`            | Display every step that would run without modifying anything on the host.                                                                                                                                                                                                                   |
| `--stylus-root <path>` | Specify the directory where the Palette agent was originally installed. By default, the Palette agent reads this value from `/etc/spectro/environment`. Use this flag if the environment file is missing or corrupt. Most installations use the default location and do not need this flag. |

### Prerequisites

- The [Palette agent installed](#install-palette-agent) on a centrally or locally managed Edge host.

- Root access to the Edge host.

### Enablement

<Tabs groupId="env">

<TabItem value="Central Management Mode">

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Issue the uninstall command as root. Without flags, the command prompts for confirmation before making changes. Refer
   to the [table above](#uninstall-palette-agent) for additional information on flag usage.

   ```shell
   sudo palette-agent uninstall
   ```

   The command displays a step-by-step progress log as each cleanup task runs. A failure in one step does not prevent
   subsequent steps from running.

   On hosts that use a custom install root, all cleanup runs at both the absolute host path and the rooted path under
   `STYLUS_ROOT`.

   ```shell title="Example output" hideClipboard
   time="2026-05-22T18:14:58Z" level=info msg="Creating new cached handler with duration: 30s" version=v4.10.0-260521
   This will permanently remove the Palette Edge Agent and all associated files. Continue? [y/N]: y
    +  Load environment configuration [0ms]
    +  Stop spectro services (/etc/systemd) [2.4s]
    +  Stop spectro services (/run/systemd) [0ms]
    +  Reload systemd daemon [300ms]
    +  Stop bundle mount units [146ms]
    +  Reset node state [0ms]
    +  Remove Kubernetes binaries [0ms]
    +  Remove spectro unit files [0ms]
    +  Remove spectro runtime files [0ms]
    +  Remove stylus root directories [171ms]

    All 10 tasks completed successfully (3.03s)
   ```

The Edge host record remains in Palette after you uninstall the Palette agent. Even if you reinstall the Palette agent
on the same Edge host, the host cannot be re-registered with Palette until you delete the old record from Palette. This
is because the Palette agent derives its identity from the host's `/etc/machine-id` file, which is an OS-managed file
that the uninstall does not remove. Because the same machine produces the same identity during the reinstall process,
Palette rejects the new registration as a duplicate.

To remove the Edge host from Palette:

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Select the **Edge Hosts** tab. Locate the machine you uninstalled the Palette agent from. After a few minutes, the
   Edge host becomes **Unhealthy**.

4. Select the three-dot menu beside the Edge host and choose **Delete**. Select **OK** to confirm the deletion.

</TabItem>

<TabItem value="Local Management Mode">

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Issue the uninstall command as root. Without flags, the command prompts for confirmation before making changes. Refer
   to the [table above](#uninstall-palette-agent) for additional information on flag usage.

   ```shell
   sudo palette-agent uninstall
   ```

   The command displays a step-by-step progress log as each cleanup task runs. A failure in one step does not prevent
   subsequent steps from running.

   On hosts that use a custom install root, all cleanup runs at both the absolute host path and the rooted path under
   `STYLUS_ROOT`.

   ```shell title="Example output" hideClipboard
   time="2026-05-22T18:14:58Z" level=info msg="Creating new cached handler with duration: 30s" version=v4.10.0-260521
   This will permanently remove the Palette Edge Agent and all associated files. Continue? [y/N]: y
    +  Load environment configuration [0ms]
    +  Stop spectro services (/etc/systemd) [2.4s]
    +  Stop spectro services (/run/systemd) [0ms]
    +  Reload systemd daemon [300ms]
    +  Stop bundle mount units [146ms]
    +  Reset node state [0ms]
    +  Remove Kubernetes binaries [0ms]
    +  Remove spectro unit files [0ms]
    +  Remove spectro runtime files [0ms]
    +  Remove stylus root directories [171ms]

    All 10 tasks completed successfully (3.03s)
   ```

</TabItem>

</Tabs>

### Validate

<Tabs groupId="env">

<TabItem value="Central Management Mode">

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Verify the Palette agent has been uninstalled by attempting to check the version.

   ```shell
   palette-agent version
   ```

   A missing Palette agent binary indicates the Palette agent was uninstalled.

   ```shell title="Example output" hideClipboard
   bash: /usr/local/bin/palette-agent: No such file or directory
   ```

</TabItem>

<TabItem value="Local Management Mode">

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Verify the Palette agent has been uninstalled by attempting to check the version.

   ```shell
   palette-agent version
   ```

   A missing Palette agent binary indicates the Palette agent was uninstalled.

   ```shell title="Example output" hideClipboard
   bash: /usr/local/bin/palette-agent: No such file or directory
   ```

3. Verify you can no longer access [Local UI](../../clusters/edge/local-ui/host-management/access-console.md).

</TabItem>

</Tabs>

## Reinstall Palette Agent

After you uninstall the Palette agent, you can reinstall it on the same host. Several files, including `user-data` and
install scripts (central mode) or binaries (local mode), remain on the host; however, certain variables may need to be
re-exported or files extracted, depending on your management mode.

### Prerequisites

<Tabs groupId="env">

<TabItem value="Central Management Mode">

- The required hardware and software dependencies needed to [install the Palette agent](#prerequisites).

- An Edge host that previously had the [Palette agent uninstalled](#uninstall-palette-agent).

</TabItem>

<TabItem value="Local Management Mode">

- The required hardware and software dependencies needed to [install the Palette agent](#prerequisites).

- An Edge host that previously had the [Palette agent uninstalled](#uninstall-palette-agent).

- The Edge host must not be registered at **Clusters** > **Edge Hosts** tab. If it is, select the three-dot menu, and
  **Delete** the Edge host record from Palette.

</TabItem>

</Tabs>

### Enablement

<Tabs groupId="env">

<TabItem value="Central Management Mode">

1.  In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

    ```shell
    ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
    ```

2.  Export your Palette registration token.

    ```shell
    export TOKEN=<your-palette-registration-token>
    ```

3.  (Optional) The `user-data` file remains on the host after uninstalling the Palette agent. Review the existing file
    and make changes if needed. Refer to the [central management mode install steps](#install-palette-agent) for an
    example user data configuration. For a full list of parameters and arguments, refer to
    [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md).

    ```shell
    cat user-data
    ```

4.  Export the path to your `user-data` file.

    ```shell
    export USERDATA=./user-data
    ```

5.  (Optional) The file `palette-agent-install.sh` (or `palette-agent-install-fips.sh`, for FIPS compliance) remains on
    the host after uninstalling the Palette agent. If necessary, use the following command to download a new Palette
    agent version for Palette SaaS or self-hosted Palette, respectively.

    <Tabs>

    <TabItem label="SaaS" value="saas">

    Choose between installing a FIPS-compliant version or non-FIPS version.

    <PartialsComponent category="agent-mode" name="agent-mode-latest-version" />

    </TabItem>

    <TabItem label="Self-Hosted" value="self-hosted">

    <PartialsComponent category="agent-mode" name="agent-mode-versioned" />

    </TabItem>

    </Tabs>

6.  If you downloaded a new Palette agent version, grant execution permissions to the installation script.

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

7.  Reinstall the agent on your host.

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

</TabItem>

<TabItem value="Local Management Mode">

1. The file `agent-mode-linux-<architecture>.tar` remains on the host after uninstalling the Palette agent. However, you
   must re-extract the agent installation package to the root folder. Replace `<architecture>` with the architecture of
   your CPU. If you have ARM64, use `arm64`. If you have AMD64 or x86_64, use `amd64`.

   ```shell
   sudo tar -xvf agent-mode-linux-<architecture>.tar -C /
   ```

2. The file `/var/lib/spectro/userdata` remains on the host after uninstalling the Palette agent. Review the existing
   file and make changes if needed. Refer to the [local management mode install steps](#install-palette-agent) for an
   example user data configuration. For a full list of parameters and arguments, refer to
   [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md).

   ```shell
   cat /var/lib/spectro/userdata
   ```

3. Run the install command using the staging binary that the tar extraction placed on disk.

   ```shell
   sudo /var/lib/spectro/stylus/opt/spectrocloud/bin/palette-agent install \
       --source dir:/var/lib/spectro/stylus \
       --config /var/lib/spectro/userdata
   ```

4. Reboot the host.

   ```shell
   sudo reboot
   ```

   After the host reboots, the Local UI info screen is displayed and the host is ready for use.

</TabItem>

</Tabs>

### Validate

<Tabs groupId="env">

<TabItem value="Central Management Mode">

To verify the Palette agent was installed, you can confirm the Edge host is registered with your Palette instance
through the Palette UI or issue `palette-agent` commands directly against the host.

#### Palette UI

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Select the **Edge Hosts** tab. Locate the machine you installed the Palette agent on, and verify the host is
   **Healthy**.

#### Edge Host Terminal

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Verify the Palette agent version.

   ```shell
   palette-agent version
   ```

   ```shell title="Example output" hideClipboard
   version: v4.9.10
   build: release
   fips:
   ```

</TabItem>

<TabItem value="Local Management Mode">

To verify the Palette agent was installed, you can either access
[Local UI](../../clusters/edge/local-ui/host-management/access-console.md) using the IP address of your Edge host or
issue `palette-agent` commands directly against the host.

1. In your terminal, SSH into the Edge host, substituting the placeholders with the necessary values.

   ```shell
   ssh -i </path/to/private/key> <username>@<host-ip-or-domain>
   ```

2. Create a symbolic link to the Palette agent binary.

   ```shell
   sudo ln --symbolic /opt/spectrocloud/bin/palette-agent /usr/local/bin/palette-agent
   ```

3. Verify the Palette agent version.

   ```shell
   palette-agent version
   ```

   ```shell title="Example output" hideClipboard
   version: v4.9.10
   build: release
   fips:
   ```

</TabItem>

</Tabs>

## Next Steps

You can use [Local UI](../../clusters/edge/local-ui/host-management/access-console.md) to manage the lifecycle of your
Edge hosts. Refer to the
[Reboot, Shutdown, and Reset Edge Host](../../clusters/edge/local-ui/host-management/reset-reboot.md) guide for further
details on how to use these operations.

Depending on your management mode, additional steps may be required before you can deploy a cluster using your Edge host
as a cluster node.

<Tabs groupId="env">

<TabItem value="Central Management Mode">

Follow the steps in [Create Cluster Definition](../../clusters/edge/site-deployment/cluster-deployment.md) to deploy a
cluster using your Edge host.

</TabItem>

<TabItem value="Local Management Mode">

Before you can deploy a cluster using your Edge host as a cluster node, you must export your cluster profile as a
cluster definition and, optionally, build and upload a content bundle if your Edge host has restricted internet access.
Follow the below guides in order to deploy your cluster.

1.  [Export Cluster Definition](../../clusters/edge/local-ui/cluster-management/export-cluster-definition.md) - Export a
    cluster definition of your profile. You will use this cluster definition later when you create the cluster in Local
    UI.

2.  [Build Content Bundles](../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) - If your
    host has access to all the images referenced by your cluster profile, you may skip this guide. Otherwise, you must
    build a content bundle that contains all the artifacts required to create your cluster.

3.  [Upload Content Bundles](../../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) - If you built a
    content bundle, you must upload it to your Edge host.

4.  [Create Local Cluster](../../clusters/edge/local-ui/cluster-management/create-cluster.md) - Use your exported
    cluster definition (and content bundles, if necessary) to create a cluster using your Edge host.

</TabItem>

</Tabs>
