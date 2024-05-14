---
sidebar_label: "Add Content to Persistent Partition"
title: "Add Content to Persistent Partition with Trusted Boot"
description: "Learn about how to add content to the persistent partition of your Edge host with Trusted Boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

During EdgeForge, you are able to customize the Operating System (ISO) used by the Installer ISO image. This allows you
to add various utilities that can be useful in setting up your Edge host and getting it ready for cluster creation.

However, if you want to use Trusted Boot, there is usually a limitation to the size of a bootable Extensible Firmware
Interface (EFI) file. This means that you can no longer add such utilities to your OS as freely as before. If the EFI
becomes too large in size, the Edge host might not be able to boot.

If you would like to add software that can be used after ISO installation, you can instead use the approach described in
this guide to add the content to the persistent partition of the installation partition. You will be able to access the
content both before cluster formation and after.

## Prerequisites

## Instructions

## Validate
