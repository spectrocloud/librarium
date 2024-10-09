---
sidebar_label: "Customize Local UI Theme"
title: "Customize Local UI Theme - Agent mode"
description: "Instructions for customizing Local UI theme for hosts deployed in agent mode."
hide_table_of_contents: false
sidebar_position: 100
tags: ["edge"]
---

Palette offers the option to customize the Local UI web interface. You can change the color of the sidebar as well as
use your own logo. You can do this after the agent has been installed on the host to standardize the look feel of the
console for all hosts of your organization.

:::warning

This guide is specific to agent mode. If you have an Edge host deployed in [appliance mode](../../appliance-mode.md),
you need to provide the customizations during EdgeForge. Refer to
[Customize Local UI Theme](../../../clusters/edge/local-ui/host-management/theming.md) for more information.

:::

## Prerequisite

- You have installed the Palette agent on your host machine deployed in agent mode.

- You have SSH access to your host and have sufficient privilege to make changes in the **/opt/spectrocloud/localui/ui**
  folder.

## Procedure

1. Connect to your host via SSH.

2. Navigate to the **/opt/spectrocloud/localui/ui** folder.

3. In the **ui** folder, upload a logo you would like to use for Local UI to the **ui** directory. All file types are
   allowed. We recommend limiting the height of the logo image to between 64 pixels and 120 pixels. If you do not upload
   a logo, Local UI will use the Spectro Cloud logo.

4. In the **ui** folder, create a file named **customizations.json**.

5. Populate the file with the following schema:

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
   Local UI login screen. We suggest choosing a color that contrasts well with your logo, as this color will serve as
   the background for it. The **brand** color controls the color of buttons and checkboxes in the UI. The following
   image displays the default logo, brand, and sidebar color.

   ![A screenshot of Local UI showing the elements controlled by the color properties and the location of the logo](/cluster_edge_emc_theming.webp)

   Once you have finished editing the file, save it and exit.

## Validate

1. Log in to [Local UI](../../../clusters/edge/local-ui/host-management/access-console.md).

2. Confirm that the logo and CSS changes have taken effect. You may need to perform a hard refresh to refresh the cached
   content on your browser.
