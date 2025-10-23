---
sidebar_label: "Activate Palette VerteX"
title: "Activate Palette VerteX"
description: "Activate your self-hosted Palette VerteX installation."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["self-hosted", "vertex", "activate"]
keywords: ["self-hosted", "vertex", "activate"]
---

Beginning with version 4.6.32, once you install Palette VerteX or upgrade to version 4.6.32 or later, you have 30 days
to activate it. During this time, you have unrestricted access to all of VerteX's features. After 30 days, you can
continue to use VerteX, and existing clusters will continue to run, but you cannot perform the following operations
until VerteX is activated:

- Create new clusters.

- Modify the configuration of active clusters. This includes modifying
  [cluster profile variables](../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md);
  changing [cluster profile versions](../../../../clusters/cluster-management/cluster-updates.md#enablement); editing,
  deleting, or replacing profile layers; and editing YAML files.

- Update [node configurations](../../../../clusters/cluster-management/node-pool.md), such as the node pool size.

Each installation of Palette VerteX has a unique product ID and corresponding activation key. Activation keys are
single-use and valid for the entirety of the VerteX installation, including all subsequent version upgrades. Once VerteX
is activated, it does not need to be reactivated unless you need to reinstall VerteX, at which time a new product ID
will be assigned, and a new activation key will be needed. Activation keys are no additional cost and are included with
your purchase of Palette VerteX. The activation process is the same for connected and airgapped installations,
regardless of whether Palette is installed via the [Palette CLI](../../../../automation/palette-cli/palette-cli.md),
[Helm chart](../../kubernetes/install/install.md), or
[Management Appliance](../../management-appliance/management-appliance.md) ISO.

If you are in trial mode or your trial has expired, Palette VerteX displays the appropriate banner on the **Summary**
screen of your system console, as well as at **Administration > Activation**. Trial mode and expired statuses are also
displayed in the Palette VerteX UI at the bottom of the left main menu.

## Overview

Below is an overview of the activation process.

![Diagram of the self-hosted system activation process](/enterprise-version_activate-installation_system-activation-diagram.webp)

1. The system admin installs Palette VerteX or upgrades to version 4.6.32 or later.
2. VerteX enters trial mode. During this time, you have 30 days to take advantage of all of VerteX's features. After 30
   days, the trial expires, and VerteX functionality is restricted. Any clusters that you have deployed will remain
   functional, but you cannot perform [day-2 operations](../../../../clusters/cluster-management/cluster-management.md),
   and you cannot deploy additional clusters.

3. Before or after your trial expires, contact a Spectro Cloud customer support representative. You must specify whether
   you are activating Palette or VerteX and also provide a short description of your instance, along with your
   installation's product ID.

4. Spectro Cloud provides the activation key.

5. The system admin enters the activation key and activates VerteX, allowing you to resume day-2 operations and deploy
   additional clusters.

## Prerequisites

- A Palette VerteX subscription.

- A self-hosted instance of Palette VerteX that is not activated. For help installing Palette VerteX, check out our
  [Installation](../install/install.md) guide.

- Access to the [system console](../../system-management/system-management.md#access-the-system-console).

## Enablement

1. Log in to the system console. For more information, refer to the
   [Access the System Console](../../system-management/system-management.md#access-the-system-console) guide.

2. A banner is displayed on the **Summary** screen, alerting you that your product is either in trial mode or has
   expired. On the banner, select **Activate VerteX**. Alternatively, from the left main menu, select **Administration >
   Activation**.

3. The **Activation** tab of the **Administration** screen reiterates your product's status and displays your **Product
   Setup ID**. Contact your customer support representative and provide them the following information:

   - Your installation type (VerteX).

   - A short description of your instance. For example, `Spacetastic - Dev Team 1`.

   - Your instance's **Product Setup ID**.

4. Your customer support representative will provide you an **Activation key**. The activation key is single-use and
   cannot be used to activate another Palette or VerteX installation.
5. On the **Activation** tab, enter the **Activation key** and **Update** your settings. If the product ID and
   activation key pair is correct, an activation successful message is displayed, and your banner is updated to state
   that your license is active.

## Validation

You can view the status of your license from the system console. If your license is active, the license status is
removed from the left main menu of the Palette VerteX UI.

1. Log in to the [system console](../../system-management/system-management.md#access-the-system-console).

2. The activation banner is no longer displayed on the **Summary** screen, indicating your license is active. Confirm
   your license status by navigating to **Administration > Activation**. The banner states that **Your license is
   active**.
