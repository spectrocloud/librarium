---
title: "Palette CLI"
metaTitle: "Palette CLI"
metaDescription: "Learn how to install the Palette CLI and how you can use the CLI with Palette Dev Engine."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';


# Overview

The Palette CLI contains various functionalities that you can use to interact with Palette and manage resources. The Palette CLI is well suited for Continuous Delivery/Continuous Deployment (CI/CD) pipelines and recommended for automation tasks where Terraform or directly querying the API is not an ideal fit.

# Installation

Use the following steps to install and set up the Palette CLI.


## Prerequisites

- A Palette account. Click [here](https://console.spectrocloud.com/) to create a Palette account.


- A Palette API key. Refer to the [API Key](/user-management/user-authentication/#apikey) reference page to learn how to create an API key.



## Download and Setup

1. Visit the [Download](/spectro-downloads#palettecli) and download the Palette CLI by using the download URL.


2. Open up a local terminal session on your local system.


3. Navigate to your defaults download folder. For Mac and Linux environments the default location is `~/Downloads` for Windows it's `C:\Users<Username>\Downloads`. Replace `Username` with the name of the user account.


4. Move the binary to a folder that is part of your system's `PATH` variable.


<Tabs>
<Tabs.TabPane tab="MacOS/Linux" key="linux-mac">

Move the binary to the `/usr/local/bin` folder. Replace the download file with the name of your download file.

<br />

```shell
mv ~/Downloads/spectro-cli-darwin-amd64 /usr/local/bin/palette
```

</Tabs.TabPane>

<Tabs.TabPane tab="Windows" key="windows">

Move the binary to a folder on your system. If you want to access Palette CLI from the command-line, ensure place the binary in a folder that is part of your system `PATH`. Check out the [Add Tool Locations to the PATH Environment Variable](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14)) for detailed steps.

Open up Command Prompt and move the file to a target folder that is part of your system `PATH`. The following command is for example purposes. 

<br />

```shell
move C:\Users\johndoe\Downloads\spectro-cli-darwin-amd64 C:\Users\johndoes\tools\palette
```



</Tabs.TabPane>

</Tabs>

---

<br />
   

5. Log in to Palette by using the `login` command. Replace `<YOUR-API-KEY>` with your Palette API key. If you are using a Palette self-hosted instance, replace the `--console-url` with your custom Palette URL.

  <br />

  ```shell
  palette pde login --api-key <YOUR-API-KEY> --console-url https://console.spectrocloud.com/
  ```

## Validation

Verify the Palette CLI is part of your system path by issuing the Palette CLI help command.

  <br />

  ```shell
  palette --help
  ```

  Output:
  ```shell
  Use 'palette help <sub-command>' to explore all of the functionality the Spectro Cloud Palette CLI has to offer.

  Usage:
    palette [command]

  Available Commands:
    completion  Generate the autocompletion script for the specified shell
    ec          Enterprise Cluster installation & pre-validation
    help        Help about any command
    pcg         Private Cloud Gateway installation & pre-validation
    pde         Palette Developer Experience
    vm          Virtual Machine lifecycle management and migration

  Flags:
    -c, --config string      Config file location
    -h, --help               help for palette
    -l, --log-level string   Log level. One of: [panic fatal error warn info debug trace] (default "info")
    -w, --workspace string   Workspace location for staging runtime configurations and logs (default "$HOME/.palette")

  Use "palette [command] --help" for more information about a command.
  ```


  # Next Steps

Start exploring the Palette CLI by using the --help command with the various commands. The Palette CLI will continue to receive more functionality in the future, so keep it updated.