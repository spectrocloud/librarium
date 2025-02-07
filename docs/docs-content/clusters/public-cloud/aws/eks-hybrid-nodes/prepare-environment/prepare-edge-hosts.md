---
sidebar_label: "Prepare Edge Hosts"
title: "Prepare Edge Hosts"
description: "Learn how to prepare your edge hosts to be used as Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 3
---

This guide explains how to prepare on-premises edge hosts for use as Amazon EKS Hybrid Nodes within the Spectro Cloud ecosystem. There are two available methods to register these hosts:

- [Agent Mode](../../../../../deployment-modes/agent-mode/agent-mode.md) using connected mode installation.
- [Appliance Mode](../../../../../deployment-modes/appliance-mode.md)

Agent Mode installs a lightweight agent on existing systems, and Appliance Mode deploys a fully managed operating system (OS) and stack. Choose the approach that aligns best with your operational and security requirements.

## Agent Mode

In Agent Mode, you install the Palette agent on your existing host OS. This agent communicates with the Spectro Cloud control plane to manage configurations, updates, and workloads.

The key benefits of Agent Mode are:

- Minimal overhead on the host OS.
- Easier to integrate with custom OS configurations.
- Agent updates can be rolled out seamlessly from the Spectro Cloud console.

### Prerequisites

#### Infrastructure

- You have physical or virtual servers ready to be used as edge hosts.
- The physical or virtual server resources meet the [Minimum Device Requirements](../../../../../deployment-modes/agent-mode/architecture.md#minimum-device-requirements).
- The server has at least one IP address assigned.

#### OS and Dependencies

- You must have a supported OS installed on your edge hosts. Palette supports the same operating systems as AWS. Refer to [Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for details.
  - The FIPS-compliant version of Agent Mode is only available for Red Hat Enterprise Linux (RHEL).
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

- Verify that you can access the edge host through SSH.
- Verify that the edge host has outbound connectivity to Spectro Cloud [services](../../../../../architecture/palette-public-ips.md) and [ports](../../../../../architecture/networking-ports.md#network-ports).
- Verify that the edge host has outbound connectivity to the required AWS [domains and ports](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem) (**Access required during hybrid node installation and upgrade** & **Access required for ongoing cluster operations**).
- Verify that the edge host can has outbound access to the internet.

#### Palette Registration Token

- You will need a Palette tenant registration token. Refer to the [Create a Registration Token](../../../../edge/site-deployment/site-installation/create-registration-token.md) guide for instructions on how to create a token.

### Steps to Register Edge Host in Agent Mode

1. **Install the Spectro Cloud Agent**  
   - Download the agent installer from your Spectro Cloud portal.  
   - Run the installation script or package manager commands according to your OS.  
   - Confirm that the agent service is running and can connect to Spectro Cloud.

2. **Assign the Host to a Cluster or Project**  
   - In the Spectro Cloud UI or via CLI, navigate to the “Hosts” or “Infrastructure” section.  
   - Initiate the registration process, which may generate a one-time token or registration command.  
   - Paste the registration token/command into the host CLI if needed.

### Validate

- Check the Spectro Cloud dashboard to confirm the new edge host is listed as “Online” or “Healthy.”  
- Run any required health checks to ensure the agent has the necessary permissions and network access.

## Appliance Mode

In Appliance Mode, you deploy a prepackaged Spectro Cloud appliance image (often an ISO or OVA) onto your bare-metal or virtual infrastructure. The appliance includes an embedded OS and the Spectro Cloud stack, providing a more controlled, consistent runtime environment.

### Prerequisites



### Steps to Register Edge Host in Appliance Mode

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

**Benefits of Appliance Mode**  
- Consistent, controlled OS environment that is tested and maintained by Spectro Cloud.  
- Streamlined updates since OS and agent are managed as a single appliance.  
- Potentially less configuration drift across multiple edge sites.

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
