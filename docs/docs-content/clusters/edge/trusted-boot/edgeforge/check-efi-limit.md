---
sidebar_label: "Check EFI Size and Device Limit"
title: "Check EFI Size and Device Limit with Trusted Boot"
description:
  "Learn about how to check the EFI size limit of your Edge host and avoid creating an EFI that is too large to boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

When you use Trusted Boot, your OS becomes part of the Extensible Firmware Interface (EFI) file that gets loaded by the
firmware of the Edge host and booted directly. This means that the EFI file will grow quite large due to the size of the
OS, and you must ensure that your Edge host has the capacity to boot the large EFI file.

This page guides you through how to estimate the bootable EFI limit of your Edge host as well as the EFI size of your
installer ISO. You need to ensure that the bootable EFI size limit is greater than the size of the EFI partition in your
ISO file.

## Prerequisites

## Instructions

## Validate
