---
sidebar_label: "Customize Local UI Theme"
title: "Customize Local UI Theme"
description: "Instructions for customizing Local UI theme."
hide_table_of_contents: false
sidebar_position: 100
tags: ["edge"]
---

Palette offers the option to customize the Local UI web interface. You can change the color of the sidebar as well as
using your own logo. You can do this before deployment during the EdgeForge process to standardize the look feel of the
console for all Edge hosts of your organization.

:::preview

:::

## Prerequisites

- The theme customization process prior to deployment is based on the EdgeForge process. We recommend that you
  familiarize yourself with [EdgeForge](../../edgeforge-workflow/edgeforge-workflow.md) and the process to build Edge
  artifacts.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

## Customize theme during EdgeForge

1.  Clone the **CanvOS** repository.

    ```shell
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Change into the **CanvOS** directory.

    ```shell
    cd CanvOS
    ```

3.  Create a directory called **local-ui** at the path **CanvOS/local-ui**. Then under the **local-ui** directory,
    create a directory named **ui**. You can issue the following command to create both directories.

    ```shell
    mkdir -p local-ui/ui
    ```

4.  In the **ui** directory, create a file named **customizations.json**. This is the same file you can use to add
    custom links to your sidebar. If the file is already present, there is no need to create a new one. For more
    information, refer to [Add Custom Links to Local UI](./custom-link.md).

5.  Upload a logo you'd like to use for Local UI to the **ui** directory. All file types are allowed. We recommend you
    limit the height of the logo image to between 64 px and 120 px. If you don't upload a logo, Local UI will use the
    Spectro Cloud logo.

6.  Populate the file with the following schema:

    ```json
    {
      "colors": {
        "brand": "#4A8FF1",
        "sidebar": "#2B323C"
      },
      "logo": "logo.webp"
    }
    ```

    The `colors.sidebar` property controls the color of the sidebar. This is also the color of the background in the
    Local UI login screen. We suggest you choose a color that contrasts well against your logo as the logo as the color
    will serve as the background for your logo. The **brand** color controls the color of buttons and checkboxes in the
    UI. The following image displays the default logo, brand, and sidebar color.

    ![A screenshot of Local UI showing the elements controlled by the color properties and the location of the logo](/cluster_edge_emc_theming.webp)

7.  Compress the UI directory to a TAR file. The file must be named **local-ui.tar**.

    ```shell
    tar cvf local-ui.tar local-ui
    ```

8.  Follow the [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide from step 3
    onwards to finish the EdgeForge process.

### Validate

1. Use the ISO you produced to install Palette Edge on an Edge device.

2. Power up the device and follow [Access Local UI](./access-console.md) to access the Edge management console.

3. Verify that the customizations you made are reflected in the user interface.
