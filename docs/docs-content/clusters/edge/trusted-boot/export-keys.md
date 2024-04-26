---
sidebar_label: "Export Factory Keys"
title: "Export Factory Keys"
description: "Learn about how to export the factory keys from your Edge device. "
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Before generating keys for Trusted Boot, you should first export the factory keys on your Edge device. These keys are
often used verify the authenticity of the firmware on your Edge device and need to be included in EdgeForge key
generation to ensure that the firmware starts normally in the boot process.

There are two ways to export factory keys. You can export them from the Unified Extensible Firmware Interface (UEFI) or
Basic Input/Output System (BIOS) interface if the interface allows it. You can also export keys

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

1. Issue the `ls` command to confirm that the

2. You can also use the `cat` command to view the content of each key. The keys are in binary format, so a large part of
   the keys is illegible. However, you should be able to see strings interspersed in the content of the key that
   describes the entity that issued them.

## Export Keys from BIOS/UEFI

Certain BIOS/UEFI allows you to export the keys directly, so you do not need to rely on software in any particular OS to
export keys. However, since BIOS and UEFI interfaces vary greatly on different devices, this guide only uses the Intel
NUC 11 as an example.

If you are using a different device, it's possible that your BIOS/UEFI interface is different and the steps to export
the keys are different. In addition, it's also possible that your BIOS/UEFI interface does not support exporting keys.
If that is the case, refer to the aforementioned method to export the keys using command-line tools.

### Prerequisites

- Your Edge device is a Intel NUC 11 device.

### Instructions

### Validate
