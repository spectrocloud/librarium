---
sidebar_label: "Enroll Keys in Edge Device"
title: "Enroll Keys in Edge Device"
description: "Learn about how to enroll keys in your Edge device."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

To use Trusted Boot, you need to first enroll the keys you generated in the key generation step in your Edge device.
This means to store the keys in the Trusted Platform Module (TPM) of your Edge device, and the keys are used to verify
the authenticity of the software that the operates on the device.

Sometimes, your device may have additional keys needed to verify its firmware. In such cases, you must export those keys
first and combine those keys with the keys you generated.

This process varies depending on the device model, and this document uses the Intel NUC 13 Pro as an example.

## Prerequisites

- The Edge device uses a Linux distribution as its operating system (OS).
- You have generated keys needed for Trusted Boot. For more information, refer to [Generate Keys](./generate-key.md).

## Enroll Keys in Edge Device
