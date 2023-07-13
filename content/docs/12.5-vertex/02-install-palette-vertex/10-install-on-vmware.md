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


- Downloaded PCG installer.


- An Ubuntu Pro Subscription.


- An Ubuntu Advantage token.


- Added port permissions to inbound rules for security groups to provide Palette VerteX connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication. >TAKEN FROM QUICKSTART OVA DRAFT.


- A new or existing SSH key pair to access the PCG installer for any troubleshooting. >TAKEN FROM QUICKSTART OVA DRAFT.


# Download and Set Up

>STEPS ARE FROM PALETTE CLI INSTALL

1. Open up a terminal session on your local system.


2. Navigate to your default download folder. For Mac and Linux environments the default location is **~/Downloads**.


3. Move the binary to a folder that is part of your system's PATH environment variable. Use the following command to move the binary to the /usr/local/bin folder.

  <br />

  ```shell
  sudo mv ~/Downloads/palette /usr/local/bin/palette && \
  chmod +x /usr/local/bin/palette
  ``` 

<br />


## Validate

Verify the Palette CLI is part of your system path by issuing the Palette CLI `version` command. 

  <br />

  ```shell
  palette version
  ```

  Output:
  ```shell
  Palette CLI version: 3.4.0
  ```

# Install PCG

Palette provides an installer in the form of a CLI. You can invoke the installer on any Linux x86-64 system that has the docker daemon installed and connectivity to the Palette Management console or VMware vSphere.

1. 






















# Next Steps

Start exploring the Palette CLI by using the `--help` command with the various commands. The Palette CLI will continue to receive more functionality, so you will want to keep it updated by downloading the newest version and replacing the current binary.

<br />
   