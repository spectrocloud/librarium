---
sidebar_label: "Edit User Data"
title: "Edit User Data"
description: "Instructions for editing user data in Local UI."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The **user-data** file is a YAML file that contains installer configuration for the Palette agent. This file is usually
prepared before the EdgeForge process and is written into the installer ISO.

Local UI allows you to make edits to most fields in the **user-data** file after installation has completed before
cluster creation. The new settings will apply after the host reboots.

:::preview

:::

## Limitations

- The following fields cannot be edited.
  - `stylus.site.deviceUIDPaths`
  - `stylus.site.tagsFromFile`
  - `stylus.site.tagsFromScript`
  - `stylus.localUI.port`
  - `stylus.includeTui`
  - `stylus.debug`
  - `stylus.trace`
  - `stylus.disablePasswordUpdate`
  - `stylus.imageRedirectWebhook`
  - `install.bind_mounts`

## Prerequisites

- You have set `EnableUserdataForm` to true in your user data during EdgeForge.
- You host is not assigned to any cluster.

## Edit User Data

1. Log in to [Local UI](./access-console.md).

2. In the

## Validate

1. Log in to [Local UI](./access-console.md).

2. Click **Configure**.

3. Confirm that the pre-populated values have been updated to the new values you configured.
