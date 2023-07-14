---
title: "Install on VMware vSphere"
metaTitle: "Install on VMware vSphere"
metaDescription: "Install Palette on VMware vSphere."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Install Palette VerteX on VMware vSphere

Use the following steps to install and set up the Palette VerteX Private Cloud Gateway (PCG) installer.


# Prerequisites

- A Palette VerteX account. Refer to [Access Palette VerteX](/vertex#accesspalettevertex).


- Downloaded PCG installer CLI.


- An Ubuntu Pro Subscription.


- An Ubuntu Advantage token.


- In VMware environments with internet connectivity, you will need added port permissions to inbound rules for security groups to provide Palette VerteX connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication.


- A new or existing SSH key pair to access the PCG installer for any troubleshooting.


# Install the PCG

Palette provides an installer in the form of a CLI that prompts you for details and creates the PCG configuration file needed to establish a secure connection from your internal network to the internet-accessible Palette VerteX instance. You can invoke the installer on any Linux x86-64 system that has the docker daemon installed and connectivity to the Palette Management console or VMware vSphere.

1. Download the PCG installer. Refer to [Download and Setup](/palette-cli/install-palette-cli#downloadandsetup).


2. 

























# Next Steps

Start exploring the Palette CLI by using the `--help` command with the various commands. The Palette CLI will continue to receive more functionality, so you will want to keep it updated by downloading the newest version and replacing the current binary.

<br />
   