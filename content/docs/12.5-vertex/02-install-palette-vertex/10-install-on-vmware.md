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

Palette provides an installer command line interface (CLI) that prompts you for details and creates the Private Cloud Gateway (PCG) configuration file needed to establish a secure connection from your internal network to the internet-accessible Palette VerteX instance. You can invoke the installer on any Linux x86-64 system that has the docker daemon installed and connectivity to the Palette Management console or VMware vSphere. 

The PCG creates a three-node enterprise cluster for high availability (HA): 6 vCPU, 12 GB memory, 70 GB storage.

# Prerequisites

- A Palette VerteX account. Refer to [Access Palette VerteX](/vertex#accesspalettevertex).


- Downloaded PCG installer CLI.


- An Ubuntu Pro Subscription. Ubuntu Pro is FIPS 140-2 certified.


- An Ubuntu Pro token.


- In VMware environments with internet connectivity, you will need added port permissions to inbound rules for security groups to provide Palette VerteX connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication.


- A new or existing SSH key pair to access the PCG installer for any troubleshooting.

<!-- <InfoBox>

Self-hosted Palette installations provide a system PCG out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the management console.

</InfoBox> -->


# Install the PCG

1. Download the PCG installer. Refer to [Download and Setup](/palette-cli/install-palette-cli#downloadandsetup).


2. Invoke the installer by using the following command. The installer prompts you for details to create the PCG configuration file and then initiates the installation.

  <br />

  ```bash
  palette pcg install
  ```

  <br />

3. When prompted to enable Ubuntu Pro, type `y` and provide your Ubuntu Pro token.  


4. When prompted to enable FIPS, type `y`. The repository location is displayed. 


5. Type your Palette username and password.


6. When prompted, enter the information listed in each of the following tables.


#### Palette PCG Parameters




  


























# Next Steps

Start exploring the Palette CLI by using the `--help` command with the various commands. The Palette CLI will continue to receive more functionality, so you will want to keep it updated by downloading the newest version and replacing the current binary.

<br />
   