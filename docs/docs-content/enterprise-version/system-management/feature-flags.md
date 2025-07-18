---
sidebar_label: "Feature Flags"
title: "Feature Flags"
description: "Learn how to to use feature flags to manage features in Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["self-hosted", "management", "feature-flags"]
keywords: ["self-hosted", "palette", "feature-flags"]
---

Feature flags allow
[system administrators](../system-management/account-management/account-management.md#system-administrators) to manage
what features are available to the system's tenants. They can use this capability to roll out new features to
{props.edition} tenants in a controlled manner or choose not to implement a feature for their tenants due to security or
compliance reasons.

Features enabled by system administrators are applied to all tenants in the system. Once a feature is enabled, it cannot
be disabled.

:::warning

We recommend trying out new features in a test environment before enabling them in a production environment. Depending
on the feature, enabling it may have a significant impact on the system and current workloads.

:::

Review the following section for detailed instructions on enabling and managing feature flags.

## Enable a Feature

Use the following steps to enable a feature flag.

## Prerequisites

- You are a system administrator of the type _Operations Administrator_ or _Root Administrator_.

- You have access to the system console.

## Enablement

1. Log in to the system console. For additional guidance on accessing the system console, check out the
   [Access the System Console](../system-management/system-management.md#access-the-system-console) guide.

2. From the left **Main Menu**, select **Administration**.

3. Select the **Feature Flags** tab.

4. Locate the feature you want to enable and toggle the switch on the right to enable it. You can also search for a
   feature by typing the feature name in the search bar.

## Validate

Use the following steps to validate that the feature flag is enabled.

1. Log in as a tenant administrator to one of the tenants in the system.

2. Attempt to access the enabled feature flag. If the feature is enabled, you will be able to use it. If the feature is
   disabled, you will not be able to access it.
