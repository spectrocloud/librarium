---
sidebar_label: "Add Custom Links to Sidebar"
title: "Add Custom Links to Sidebar"
description: "Instructions for adding custom links to the Local UI side bar."
hide_table_of_contents: false
sidebar_position: 100
tags: ["edge"]
---

Palette allows you to add custom links to the sidebar of Local UI. These links allow you to integrate your own web
applications with Local UI. When you click on a custom link, it can either open the page within the Local UI interface
or open a new tab in your browser depending on how to configure the links.

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

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

## Customize theme during EdgeForge

1. Clone the **CanvOS** repository.

   ```shell
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change into the **CanvOS** directory.

   ```shell
   cd CanvOS
   ```

3. View the available tags and use the latest available tag. This guide uses `v4.4.0` as an example.

   ```shell
   git tag
   git checkout v4.4.0
   ```

4. Create a directory called **local-ui** at the path **CanvOS/local-ui**. Then, under the **local-ui** directory,
   create a directory named **ui**. You can issue the following command to create both directories.

   ```shell
   mkdir -p local-ui/ui
   ```

5. In the **CanvOS/local-ui/ui** directory, create a file named **customizations.json**. This is the same file where you
   customize the Local UI theme. If the file is already present, there is no need to create a new one. For more
   information about customizing the Local UI theme, refer to [Customize Local UI Theme](./theming.md).

6. If you want Local UI to host static web pages that you want your users to be able to access from the sidebar, create
   another folder for your website under the **local-ui** folder and put all assets for your web pages in that folder.

   Choose a name that describes the web pages. For example, if your website has content related to an application, you
   can name the folder **app** and create the folder at **local-ui/app**.

   The HTML files may link to JavaScript and CSS files. Ensure that your HTML file can reference its assets. The hosted
   static sites are exposed through HTTPS with a self-signed certificate.

   For example, you can put the following content inside the **local-ui** folder.

   ```text
   |-local-ui
     |--ui
         |--customizations.json
     |--app
          |--index.html
          |--index.js
          |--index.css
   ```

   When using a URL to locate the local webpage, you can treat the **local-ui** folder as the root folder and you must
   use absolute paths to locate your assets. For example, from **customizations.json**, you can locate the HTML file in
   the example with `/app/index.html`.

7. Populate the file with the following schema. Each link requires one object with the `label` and `url` properties.

   ```json
   {
     "links": [
       {
         "label": "Google",
         "url": "https://www.google.com",
         "type": "iframe"
       },
       {
         "label": "Google 2",
         "url": "https://www.google.com"
       },
       {
         "label": "Docs",
         "url": "https://docs.google.com",
         "group": "Example"
       },
       {
         "label": "Maps",
         "url": "/app/index.html",
         "group": "Example"
       }
     ]
   }
   ```

   Link objects with `"type": "iframe"` means the link will open within the Local UI interface in an iframe. Link
   objects without `"type": "iframe"` will open a new tab instead.

   :::warning

   Some websites and domains cannot be embedded as iframes due to security. Confirm whether the sites can be loaded
   through iframes first. If they cannot be loaded as iframes, do not use the `type: iframe` property.

   :::

8. You can add a group attribute to each link. Links sharing the same group are grouped together in the side bar.

   ![A screenshot of the sidebar with custom links](/clusters_edge_localui_custom-link-sidebar.webp)

9. Ensure you include all the links you want to add to the sidebar before proceeding. You cannot add new links to the
   sidebar without rebuilding the installer ISO.

10. Archive the **local-ui** directory to a TAR file. The file must be named **local-ui.tar** and must be placed at the
    root directory of CanvOS.

    ```shell
    tar cvf local-ui.tar local-ui
    ```

11. Follow the [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide from step onward
    to finish the EdgeForge process. As long as the **local-ui.tar** file is at the root directory of **CanvOS** and the
    installation mode is set to airgap as required by Local UI, the custom links will be added to the sidebar when you
    log in to Local UI.

### Validate

1. Use the ISO you produced to install Palette Edge on an Edge device.

2. Power up the device and follow [Access Local UI](./access-console.md) to access the Edge management console.

3. Verify that the custom links you added are reflected in the sidebar.
