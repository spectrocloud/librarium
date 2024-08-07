---
sidebar_label: "Download Core Dump Files"
title: "Download Core Dump Files"
description: "Instructions for downloading core dump files from Local UI."
hide_table_of_contents: false
sidebar_position: 130
tags: ["edge"]
---

If you have configured your applications to direct core dumps to the folder `/var/log/files` in the event of a crash,
you can download the core dump files from Local UI for diagnostic purposes.

## Prerequisites

- You have configured your applications to direct core dump files to `/var/log/files` in the event of a crash. The steps
  to do this vary by application, but the path must be exactly `/var/log/files`. This is the only path where files can
  be downloaded from Local UI.

- An operational Edge host installed in the `airgap` installation mode. For more information, refer to
  [Installer Reference](../../edge-configuration/installer-reference.md).

- Network access to your Edge host's Local UI port. The default port is 5800.

## Procedure

1. Log in to Local UI. For more information, refer to [Access Local UI Console](./access-console.md).

2. From the left **Main Menu**, click on **Diagnostics**.

3. Click on the **Files** tab.

4. Check the files you'd like to download.

5. Click the **Download** button in the upper right corner.

## Validate

View the files you downloaded in your downloads folder. Confirm that they are the core dump files from your application.
