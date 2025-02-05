---
sidebar_label: "Prepare Edge Hosts"
title: "Prepare Edge Hosts"
description: "Learn how to prepare your edge hosts to be used as Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 3
---

This guide explains how to prepare on-premises Edge Hosts for use as Amazon EKS Hybrid Nodes within the Spectro Cloud ecosystem. There are two main ways to register these hosts:

1. [**Agent Mode**](../../../../../deployment-modes/agent-mode/agent-mode.md)
2. [**Appliance Mode**](../../../../../deployment-modes/appliance-mode.md)

Agent Mode installs a lightweight agent on existing systems, and Appliance Mode deploys a fully managed OS and stack. Choose the approach that aligns best with your operational and security requirements.

## Prerequisites

Before you begin, ensure the following:

1. **Infrastructure**: 
   - You have physical or virtual servers ready to act as Edge Hosts.
   - The physical or virtual server resources meet the recommended guidelines.
2. **OS and Dependencies**:  
   - Compatible operating system (e.g., Ubuntu, CentOS, or a supported Linux distribution).  
   - Correct versions of Docker/Containerd, Kubernetes tooling (if needed), etc.  
3. **Network Connectivity**:  
   - Verify that the Edge Host has outbound connectivity to Spectro Cloud services and AWS endpoints.  
   - Ensure any firewalls or proxies are configured to allow necessary ports/protocols.  
4. **Spectro Cloud Access**:  
   - You have an account and the necessary permissions in Spectro Cloud to register and manage Edge Hosts.  

## Agent Mode

In Agent Mode, you install a lightweight Spectro Cloud agent on your existing host OS. This agent communicates with the Spectro Cloud control plane to manage configurations, updates, and workloads.

### Steps to Register Edge Host in Agent Mode

1. **Install the Spectro Cloud Agent**  
   - Download the agent installer from your Spectro Cloud portal.  
   - Run the installation script or package manager commands according to your OS.  
   - Confirm that the agent service is running and can connect to Spectro Cloud.

2. **Assign the Host to a Cluster or Project**  
   - In the Spectro Cloud UI or via CLI, navigate to the “Hosts” or “Infrastructure” section.  
   - Initiate the registration process, which may generate a one-time token or registration command.  
   - Paste the registration token/command into the host CLI if needed.

3. **Validate Connection**  
   - Check the Spectro Cloud dashboard to confirm the new Edge Host is listed as “Online” or “Healthy.”  
   - Run any required health checks to ensure the agent has the necessary permissions and network access.

**Benefits of Agent Mode**  
- Minimal overhead on the host OS.  
- Easier to integrate with custom OS configurations.  
- Agent updates can be rolled out seamlessly from the Spectro Cloud console.

## Appliance Mode

In Appliance Mode, you deploy a prepackaged Spectro Cloud appliance image (often an ISO or OVA) onto your bare-metal or virtual infrastructure. The appliance includes an embedded OS and the Spectro Cloud stack, providing a more controlled, consistent runtime environment.

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

Preparing Edge Hosts for Amazon EKS Hybrid Nodes with Spectro Cloud can be done via **Agent Mode**, which installs a lightweight agent on existing systems, or **Appliance Mode**, which deploys a fully managed OS and stack. Each approach offers different benefits in terms of simplicity, control, and consistency.

## Next Steps

1. Pick the registration mode (Agent or Appliance) best suited to your infrastructure.
2. Complete the setup.
3. Validate connectivity, performance, and security for your Edge Hosts once registered.
