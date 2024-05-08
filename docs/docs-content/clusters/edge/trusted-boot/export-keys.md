---
sidebar_label: "Export Factory Keys with Command-line Tools"
title: "Export Factory Keys with Command-line Tools"
description: "Learn about how to export the factory keys from your Edge device using command-line tools. "
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

Before generating keys for Trusted Boot, you should first export the factory keys on your Edge device. These keys are
often used verify the authenticity of the firmware on your Edge device and need to be included in EdgeForge key
generation to ensure that the firmware starts normally in the boot process.

There are two ways to export factory keys. You can export them directly from the Unified Extensible Firmware Interface
(UEFI) or Basic Input/Output System (BIOS) interface if the interface allows it. However, not every machine allows you
to export the factory keys through the BIOS interface, and machines that do will have different steps from model to
model.

Another approach is to install a Linux or Windows Operating System (OS) on your system, and use command-line tools to
export them. This approach is more broadly applicable because you can install an Linux on almost any machine.

This page guides you through how to export your factory keys using command-line tools on Windows and Linux.

## Export Keys from Using the Command-line

You can export the Key Exchange Key (KEK), the Signature Database (db), and the forbidden signature database (dbx) with
command-line tools. T

### Prerequisites

- You Edge device uses either Windows or Ubuntu operating systems.

- If your Edge device uses Ubuntu, you need an internet connection to download the `efitools` command-line tool.

### Instructions

1. Turn on the Edge device.

2. Open a terminal session on the device, and issue the following commands to export the keys.

   <Tabs>

   <TabItem label="Linux" value="linux">

   ```shell
   sudo apt-get install -y efitools
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

   The commands will export the keys in the current directory where the commands are executed. There are often more than
   one public KEK key on your Edge device, and the exported KEK key contains all of them. The db and dbx files also
   contain all the allowed and forbidden public keys that can be used to verify different boot components.

3. Copy the keys to a secure location, such as a USB storage device. You will need them during the key generation step
   for Trusted Boot. Refer to [Generate Keys for Trusted Boot](./generate-key.md) for details.

### Validate

1. Issue the `ls` command to confirm that the keys have been exported. You should see

2. You can also use the `cat` command to view the content of each key. The keys are in binary format, so a large part of
   the keys is illegible. However, you should be able to see strings interspersed in the content of the key that
   describes the entity that issued them.
