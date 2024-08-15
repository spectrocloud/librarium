---
sidebar_label: "Download Files from Local UI"
title: "Download Files from Local UI"
description: "Instructions for downloading files from Local UI."
hide_table_of_contents: false
sidebar_position: 130
tags: ["edge"]
---

Palette Edge provides you with a fixed path where you can configure your applications to write files. These files can then be
downloaded from Local UI.

This is particularly useful if you want to access core dump files of your applications in the event of a crash. For example, if you
have configured your applications to direct core dumps to the folder `/var/log/files` in the event of a crash, you can
download the core dump files from Local UI for diagnostic purposes. You can also write any type of file to this directory; it is not limited to core dump files.

## Prerequisites

- You have configured your applications to write files to `/var/log/files`. The steps to do this vary by application,
  but the path must be exactly `/var/log/files`. This is the only path where files can be downloaded from Local UI.

- An operational Edge host installed in the `airgap` mode. For more information, refer to
  [Installer Reference](../../edge-configuration/installer-reference.md).

- Network access to your Edge host's Local UI port. The default port is `5080`.

## Enablement

1. Log in to Local UI. For more information, refer to [Access Local UI Console](./access-console.md).

2. From the left **Main Menu**, click **Diagnostics**.

3. Click on the **Files** tab.

4. Check the files you would like to download.

5. Click the **Download** button in the upper-right corner.

## Validate

View the files you downloaded in your downloads folder. Confirm that they are the files written by your application.
