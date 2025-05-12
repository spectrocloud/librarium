---
sidebar_label: "Activate Palette VerteX"
title: "Activate Palette VerteX"
description: "Learn how to activate your self-hosted Palette VerteX installation"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "account", "activate"]
keywords: ["self-hosted", "vertex", "activate"]
---

Beginning with version 4.6.c, once you install Palette VerteX or upgrade to version 4.6.c or later, you have 30 days to activate it. During this time, you have unrestricted access to all of Palette VerteX's features. After 30 days, you can continue to use Palette VerteX, but you cannot perform any [day-2 operations](../../clusters/cluster-management/cluster-management.md) on existing clusters, such as scaling node pools, updating cluster profiles, and upgrading pack versions, or deploy additional clusters until Palette VerteX is activated. 

Each installation of Palette VerteX has a unique product ID and corresponding activation key. Activation keys are single-use and valid for the entirety of the Palette VerteX installation, including all subsequent version upgrades. Once Palette VerteX is activated, it does not need to be reactivated unless you need to reinstall Palette VerteX, at which time a new product ID will be assigned, and a new activation key will be needed. Activation keys are no additional cost and are included with your purchase of Palette VerteX. The activation process is the same for connected and airgapped installations, regardless of whether Palette VerteX was installed via the [Palette CLI](../../automation/palette-cli/palette-cli.md) or a [Helm Chart](../install-palette-vertex/install-on-kubernetes/install-on-kubernetes.md).

If you are in trial mode or your trial has expired, Palette VerteX displays the appropriate banner on the **Summary** screen of your system console, as well as at **Administration > Activation**. Trial mode and expired statuses are also displayed in the Palette VerteX UI at the bottom of the left main menu. 

## Overview

Below is an overview of the activation process.

![Diagram of the self-hosted system activation process](/enterprise-version_activate-installation_system-activation-diagram.webp)

1. The system admin installs Palette VerteX.
   
2. Once Palette VerteX is installed, it enters trial mode. During this time, you have 30 days to take advantage of all of Palette VerteX's features. After 30 days, the trial expires, and Palette VerteX functionality is restricted. Any clusters that you have deployed will remain functional, but you cannot perform day-2 operations, and you cannot deploy additional clusters.

3. Before or after your trial expires, contact a Spectro Cloud customer support representative and provide them your installation's product ID.

4. Spectro Cloud provides you the activation key.

5. The system admin enters the activation key and activates Palette VerteX, allowing you to resume day-2 operations and deploy additional clusters.

## Prerequisites

- A self-hosted instance of Palette VerteX that is not activated. For help installing Palette VerteX, check out our self-hosted [Installation](../install-palette-vertex/install-palette-vertex.md) guide.

- Access to the [system console](../system-management/system-management.md#access-the-system-console).

## Enablement

1. Log in to the system console. For more information, refer to the [Access the System Console](../system-management/system-management.md#access-the-system-console) guide.

2. A banner is displayed on the **Summary** screen, alerting you that your product is either in trial mode or has expired. On the banner, select **Activate VerteX**. Alternatively, from the left main menu, select **Administration**. 

3. The **Activation** tab of the **Administration** screen reiterates your product's status. Contact your customer support representative, providing them with your **Product Setup ID**.
   
4. Your customer support representative will provide you with an **Activation key**. The activation key is single-use and cannot be used to activate another Palette VerteX installation. Enter the **Activation key** and **Update** your settings. If the product ID and activation key pair are correct, an activation successful message is displayed, and your banner is updated to state that your license is active. 

## Validation

You can view the status of your license from the system console. If your license is active, no status is displayed on the left main menu of the Palette VerteX UI.

1. Log in to the [system console](../system-management/system-management.md#access-the-system-console).

2. The banner displayed on the **Summary** screen indicates that your license is active. This banner can also be viewed from **Administration > Activation**.

