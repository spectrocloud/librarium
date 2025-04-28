---
sidebar_label: "Export Factory Keys with Command-line Tools"
title: "Export Factory Keys with Command-line Tools"
description: "Learn about how to export the factory keys from your Edge device using command-line tools. "
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

Before generating keys for Trusted Boot, you should first export the factory keys on your Edge device. These keys are
often used to verify the authenticity of the peripheral firmware on your Edge device. These keys need to be included
during EdgeForge key generation in order to ensure that the firmware starts normally at boot time. For more information,
refer to [EdgeForge with Trusted Boot](../edgeforge/edgeforge.md).

You have two options to export factory keys. You can export them directly from the Unified Extensible Firmware Interface
(UEFI) or Basic Input/Output System (BIOS) interface if the interface allows it. However, not every machine allows you
to export the factory keys through the BIOS interface, and machines that do will have different steps from model to
model.

Another approach is to boot from a Linux with LiveCD or a Windows Operating System (OS) on your Edge host, and use
command-line tools to export them. This approach is more broadly applicable and consistent across different Edge hosts.

This page guides you through how to export your factory keys using command-line tools on Windows and Linux.

### Prerequisites

- Your Edge device uses either Windows or a Linux operating system.

- If your Edge device uses Linux, you need an internet connection to download the `efitools` command-line tool.

### Instructions

1. Turn on the Edge device.

2. Open a terminal session on the Edge host, or a Powershell session on Windows, and issue the following commands to
   export the keys.

   <Tabs>

   <TabItem label="Linux" value="linux">

   ```shell
   sudo apt-get install --yes efitools
   efi-readvar -v KEK -o 'KEK'
   efi-readvar -v db -o 'db'
   efi-readvar -v dbx -o 'dbx'
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```shell
   Get-SecureBootUEFI –Name KEK –OutputFilePath KEK
   Get-SecureBootUEFI –Name db –OutputFilePath db
   Get-SecureBootUEFI –Name dbx –OutputFilePath dbx
   ```

   </TabItem>

   </Tabs>

   The commands will export the keys in the current directory where the commands are executed. Your Edge host often has
   more than one public KEK key, and the exported KEK variable contains all of them. The `db` and `dbx` files also
   contain all the allowed and forbidden public keys that can be used to verify different boot components.

3. Copy the keys to a secure location, such as a USB storage device. You will need them during the key generation step
   for Trusted Boot. Refer to [Generate Keys for Trusted Boot](./generate-keys.md) for details.

### Validate

1. Issue the `ls` command to confirm that the keys have been exported. The output should include the following files.

   ```
   $ ls
   db   dbx   KEK
   ```

2. You can also use the `cat` command to view the content of each key. The keys are in binary format, so a large part of
   the keys is illegible. However, there should be strings interspersed in the content of the key that describes the
   entity that issued them.
