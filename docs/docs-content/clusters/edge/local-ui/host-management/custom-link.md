---
sidebar_label: "Add Custom Links to Sidebar"
title: "Add Custom Links to Sidebar"
description: "Instructions for adding custom links to the Local UI side bar."
hide_table_of_contents: false
sidebar_position: 100
tags: ["edge"]
---

Palette allows you to add custom links to the sidebar of local UI. These links allow you to integrate your own web
applications with the local UI. When you click on a custom link, it can either open the page within the local UI
interface or open a new tab in your browser depending on how to configure the links.

:::preview

:::

## Prerequisites

- The process to add custom links prior to deployment is based on the EdgeForge process. We recommend that you
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
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

## Customize theme during EdgeForge

1. Clone the **CanvOS** repository.

   ```shell
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change into the **CanvOS** directory.

   ```shell
   cd CanvOS
   ```

3. Create a directory called **ui.tar** at the path `CanvOS/ui.tar`.

4. In the directory, create a file named **customizations.json**. This is the same file where you customize the theme of
   the local UI. If the file is already present, there is no need to create a new one.

5. Populate the file with the following schema:

   ```json
   {
     "links": [
       {
         "label": "example",
         "url": "https:/www.example.com",
         "type": "iframe"
       },
       {
         "label": "example",
         "url": "https:/docs.examplee.com"
       }
     ]
   }
   ```

   Link objects with `"type": "iframe"` means the link will open within the local UI interface in an iframe. Link
   objects without `"type": "iframe"` will open a new tab instead.

6. You can add a group attribute to each link. Links sharing the same group are grouped together in the side bar.

7. Compress the UI directory to a TAR file. The file must be named **ui.tar**.

8. Follow the [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide from step 3
   onwards to finish the EdgeForge process.

### Validate

1. Use the ISO you produced to install Palette Edge on an Edge device.

2. Power up the device and follow [Access Local UI](./access-console.md) to access the Edge management console.

3. Verify that the custom links you added are reflected in the sidebar.
