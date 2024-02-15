---
sidebar_label: "Customize Edge Management Console Theme"
title: "Customize Edge Management Console Theme"
description: "Instructions for Edge Host Manage"
hide_table_of_contents: false
sidebar_position: 100
tags: ["edge"]
---

Palette offers the option to customize the Edge Management Console web interface. You can change the color of the side
bar as well as using your own logo. You can do this before deployment during the EdgeForge process to standardize the
look feel of the console for all Edge hosts of your organization.

## Prerequisites

- The theme customization process prior to deployment is based on the EdgeForge process. We recommend that you
  familiarize yourself with EdgeForge and the process to build Edge artifacts.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version`
  command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

## Customize theme during EdgeForge

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. Create a directory called **ui.tar** at the path `CanvOS/ui.tar`.

4. In the directory, create a file named **customizations.json**.

5. Populate the file with the following schema:

   ```json
   {
     "colors": {
       "brand": "#4A8FF1",
       "sidebar": "#2B323C"
     },
     "logo": "/logo.png"
   }
   ```

   To do: a screenshot demoing what each property does.

6. Follow the EdgeForge guide from step 3 onwards to finish the EdgeForge process.

### Validate

1. Use the ISO you produced to install Palette Edge on an Edge device.

2. Power up the device and follow [Access Edge Management Console](./access-console.md) to access the Edge management
   console.

3. Verify that the customizations you made are reflected in the UI.
