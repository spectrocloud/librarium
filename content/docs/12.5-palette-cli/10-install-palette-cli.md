---
title: "Install"
metaTitle: "Install"
metaDescription: "Learn how to install the Palette CLI and how you can use the CLI with Palette Dev Engine."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';


# Installation

Use the following steps to install and set up the Palette CLI.


## Prerequisites

- A Palette account. Click [here](https://console.spectrocloud.com/) to create a Palette account.


- A Palette API key. Refer to the [API Key](/user-management/user-authentication/#apikey) reference page to learn how to create an API key.



## Download and Setup

1. Visit the [Downloads](/spectro-downloads#palettecli) page and download the Palette CLI by using the URL provided.


2. Open up a terminal session on your local system.


3. Navigate to your default download folder. For Mac and Linux environments, the default location is **~/Downloads**.


4. Move the binary to a folder that is part of your system's `PATH` environment variable. Use the following command to move the binary to the **/usr/local/bin** folder.

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

  
  ```shell hideClipboard
  Palette CLI version: 4.0.0
  ```


  # Next Steps

Start exploring the Palette CLI by using the `--help` command with the various commands. The Palette CLI will continue to receive more functionality, so you will want to keep it updated by downloading the newest version and replacing the current binary.

<br />