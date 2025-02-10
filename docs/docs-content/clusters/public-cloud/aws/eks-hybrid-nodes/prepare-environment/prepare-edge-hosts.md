---
sidebar_label: "Prepare Edge Hosts"
title: "Prepare Edge Hosts"
description: "Learn how to prepare your edge hosts to be used as Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 3
---

This guide explains how to prepare on-premises edge hosts for use as Amazon EKS Hybrid Nodes within the Spectro Cloud ecosystem. There are two available methods to register these hosts:

- [Agent Mode](../../../../../deployment-modes/agent-mode/agent-mode.md)
- [Appliance Mode](../../../../../deployment-modes/appliance-mode.md) using the [EdgeForge Workflow](../../../../edge/edgeforge-workflow/edgeforge-workflow.md).

Agent Mode installs a lightweight agent on existing systems, and Appliance Mode deploys a fully managed operating system (OS) and stack. Choose the approach that aligns best with your operational and security requirements.

## Agent Mode

In Agent Mode, you install the Palette agent on your existing host OS. This agent communicates with Palette in connected mode to manage configurations, updates, and workloads.

The key benefits of Agent Mode are:

- Minimal overhead on the host OS.
- Easier to integrate with custom OS configurations.
- Agent updates can be rolled out seamlessly from the Spectro Cloud console.

### Prerequisites

#### Infrastructure

- You have physical or virtual servers ready to be used as edge hosts.

- The physical or virtual server resources meet the [Minimum Device Requirements](../../../../../deployment-modes/agent-mode/architecture.md#minimum-device-requirements).

- The server has at least one static IP address assigned.

#### OS and Dependencies

- You must have a supported OS installed on your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.

  - The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL).

- Your edge host package managers have up-to-date package indexes. This is to ensure that dependency packages for
[`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully downloaded
and installed.

  For example, on Ubuntu, you would issue the following command.

  ```shell
  sudo apt-get update
  ```

  Adjust to your operating system and package manager on your edge hosts.

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
    skip this requirement.
  - [systemd-networkd](https://www.freedesktop.org/software/systemd/man/latest/systemd-networkd.html). This requirement
    is specific for clusters that use static IP addresses. You also need this if you want Palette to manage the Edge
    host network.
  - [iptables](https://linux.die.net/man/8/iptables)
  - [rsyslog](https://github.com/rsyslog/rsyslog). This is required for audit logs.

  <br />

  :::warning

  Avoid installing [Docker](https://www.docker.com/) on the host where you want to install the agent. Docker is a heavyweight tool that could
  interfere with the Palette agent.

  :::

- Ensure that the host has `Bash` configured as the default shell.

#### Network Connectivity

- Verify that you can connect to the edge host through SSH using your private key.

- Verify that the edge host has outbound access to the internet.

- Verify that the edge host has outbound connectivity to Spectro Cloud [services](../../../../../architecture/palette-public-ips.md) and [ports](../../../../../architecture/networking-ports.md#network-ports).

- Verify that the edge host has outbound connectivity to the required [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem)
  - Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster operations** sections for listed guidance.

#### Palette Registration Token

- You will need a Palette tenant registration token. Refer to the [Create a Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token.md) guide for instructions on how to create a token.

### Register Edge Host in Agent Mode

1. In your terminal, use the following command to SSH into the host. Replace `</path/to/private/key>` with the path to your private SSH key, `<ssh-user>` with the SSH username, and `<host-ip-or-domain>` with the host's IP address or hostname.

   ```shell
   ssh -i </path/to/private/key> <ssh-user>@<host-ip-or-domain>
   ```

2. Export your Palette registration token. Replace `<your-palette-registration-token>` with your token.

   ```shell
   export TOKEN=<your-palette-registration-token>
   ```

3. _(Optional)_  If you are installing the agent on a host that accesses the internet through a network proxy, export the proxy configurations in your current terminal session.

   We recommend exporting the variables both in uppercase and lowercase to ensure compatibility. Replace `<http-proxy-address>` and `<https-proxy-address>` with the address and port to your HTTP and HTTPS proxy servers, respectively.

   ```shell
   export http_proxy=<http-proxy-address>
   export https_proxy=<https-proxy-address>
   export HTTP_PROXY=<http-proxy-address>
   export HTTPS_PROXY=<https-proxy-address>
   ```

4. Issue the command below to create the **user-data** file and configure your host declaratively.

   The following configuration includes a Palette registration token and the default Palette endpoint, specifies a
   Palette project, and sets up the `kairos` user. Note the following:

   - If your host needs a proxy to access the internet, you need to provide the proxy configurations in the user data as well. For more information, refer to [Site Network Parameters](../../../../../clusters/edge/edge-configuration/installer-reference.md#site-network-parameters).
   - The host will not shut down and will instead reboot after the agent is installed, with
     [kube-vip](../../../../../clusters/edge/networking/kubevip.md) enabled, as this is required for bare metal and VMware
     vSphere deployments. If your environment does not require kube-vip, set `skipKubeVip` to `true`. Refer to the
     [Prepare User Data](../../../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide to learn more about user
     data configuration.
   - The `projectName` parameter is not required if the associated Palette
     [registration token](../../../../../clusters/edge/site-deployment/site-installation/create-registration-token.md) has been configured with a default project.

   <br />

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
     skipKubeVip: false
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

5. Export the path to your user data file.

   ```shell
   export USERDATA=./user-data
   ```

6. Download the latest version of the Palette agent installation script. There is a FIPS-compliant script, if needed.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

   <details>

   <summary>Dedicated or On-Premises Palette Instance</summary>

   If you have a dedicated or on-premises instance of Palette, you need to identify the correct agent version and then
   download the corresponding version of the agent installation script. Use the command below and replace
   `<palette-endpoint>` with your Palette endpoint and `<api-key>` with your Palette API key to identify the version.

   ```shell
   curl --location --request GET 'https://<palette-endpoint>/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: <api-key>'  | jq --raw-output '.spec.latestVersion.content | match("version: ([^\n]+)").captures[0].string'
   ```

   Example output.

   ```text hideClipboard
   4.6.0
   ```

   Issue the following command to download the version of the Palette agent for your dedicated or on-prem instance.
   Replace `<stylus-version>` with your output from the previous step.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

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

Upon agent installation, the host will reboot to the registration screen and use the provided `EdgeHostToken` for automatic registration with Palette. The host will be registered in the same project where the registration token was created.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Clusters** from the left **Main Menu**.

3. Select the **Edge Hosts** tab and verify your host is displayed and marked as **Healthy** in the table.

## Appliance Mode

In Appliance Mode, you deploy a provider image and installer ISO onto your edge host. The provider image is a [Kairos-based image](https://kairos.io/) that provides an immutable OS and Kubernetes runtime components for a specified Kubernetes version. The installer ISO partitions the disk, installs required dependencies and the Palette agent, registers the host with Palette, and sets up user and security configurations.

The key benefits of Appliance Mode are:

- Consistent and controlled runtime environment.
- Streamlined updates since OS and Palette agent are managed as a single appliance.
- Potentially less configuration drift across multiple edge sites.

### Prerequisites

#### Infrastructure

- You have physical or virtual servers ready to be used as edge hosts.

- The physical or virtual server resources meet the [Minimum Requirements](../../../../edge/hardware-requirements.md#minimum-requirements).

- The server has at least one static IP address assigned.

#### OS and Dependencies

- You must build a supported OS for your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.

#### Network Connectivity

- Verify that you can connect to the edge host through SSH using your private key.

- Verify that the edge host has outbound access to the internet.

- Verify that the edge host has outbound connectivity to Spectro Cloud [services](../../../../../architecture/palette-public-ips.md) and [ports](../../../../../architecture/networking-ports.md#network-ports).

- Verify that the edge host has outbound connectivity to the required [AWS EKS domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem)
  - Refer to the **Access required during hybrid node installation and upgrade** and **Access required for ongoing cluster operations** sections for listed guidance.

### Register Edge Host in Appliance Mode

1. **Obtain the Appliance Image**  
   - Download the Spectro Cloud appliance image (ISO, OVA, etc.) from your Spectro Cloud portal.  
   - Verify checksums and follow any recommended guidelines for hardware or hypervisor compatibility.

2. **Deploy or Install the Appliance**  
   - If using bare metal, write the ISO to a USB or attach it as a virtual CD in your server’s management interface, then boot from it.  
   - If using a hypervisor (e.g., VMware, VirtualBox), import the OVA or ISO.  
   - Follow the on-screen prompts for basic configuration (IP address, hostname, etc.).

3. **Initial Configuration**  
   - During the first boot, you may be prompted to enter a registration token or connect to the Spectro Cloud control plane.  
   - Complete the setup wizard to finalize appliance networking and connect it to your Spectro Cloud account.

## Troubleshooting

- **Registration Failures**  
  - Check logs in the Spectro Cloud agent (Agent Mode) or the console of the appliance (Appliance Mode) for connectivity issues.  
  - Validate any tokens or credentials used during registration.

- **Connectivity/Firewall**  
  - Confirm that outbound ports to Spectro Cloud and AWS endpoints are open.  
  - Validate DNS resolution if using domain names for your endpoints.

## Summary

Preparing edge hosts for Amazon EKS Hybrid Nodes with Spectro Cloud can be done via **Agent Mode**, which installs a lightweight agent on existing systems, or **Appliance Mode**, which deploys a fully managed OS and stack. Each approach offers different benefits in terms of simplicity, control, and consistency.

## Next Steps

1. Pick the registration mode (Agent or Appliance) best suited to your infrastructure.
2. Complete the setup.
3. Validate connectivity, performance, and security for your edge hosts once registered.
