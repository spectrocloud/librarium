---
sidebar_label: "Build Edge Artifacts with Trusted Boot"
title: "Build Edge Artifacts with Trusted Boot"
description: "Learn about how to build Edge Artifacts for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

This document guides you through the process of producing Edge artifacts that are secured by Trusted Boot.

## Prerequisites

## Build Edge Artifacts with Trusted Boot

## Validate

List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.

```shell
ls build/
```

```text
kairos_uki_v3.0.4-2-g3fba4f4.tar  kairos_v3.0.4-2-g3fba4f4.iso
```

You can validate the ISO image by creating a bootable USB flash drive using any third-party software and attempting to
flash a bare host machine. Most software that creates a bootable USB drive will validate the ISO image. Here, the flash
process means installing the necessary tools and configurations on a host machine.
