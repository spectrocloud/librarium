---
sidebar_label: "Banners"
title: "Banners"
description:
  "Learn how to add login and classification banners, also known as Authority to Operate (ATO) banners, in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["enterprise", "management", "ato", "banner"]
keywords: ["self-hosted", "enterprise", "ato", "banner"]
---

<PartialsComponent category="self-hosted" name="login-banner-intro" edition="Palette" official="Palette" />

## Prerequisites

<PartialsComponent category="self-hosted" name="login-banner-prerequisites" edition="Palette" />

## Add Login Banner

Take the following steps to add a login banner to your system console and tenant login pages, such as the one below.

![An example of a login banner on the Palette system console login page](/enterprise-version_system-management_login-banner_login-banner.webp)

:::warning

Login banners configured in the system console override tenant-specific login banners. Refer to the
[Tenant Login Banner](../../tenant-settings/login-banner.md) guide to learn more about tenant-specific login banners.

:::

### Enablement

<PartialsComponent category="self-hosted" name="login-banner-setup-login" edition="Palette" />

### Validate

<PartialsComponent category="self-hosted" name="login-banner-validate-login" edition="Palette" />

## Add Classification Banner

Take the following steps to add a classification banner across all system console and tenant pages, such as the one
below.

![An example of a classification banner for a Secret environment](/enterprise-version_system-management_login-banner_classification-banner.webp)

### Enablement

<PartialsComponent category="self-hosted" name="login-banner-setup-classification" edition="Palette" />

### Validate

<PartialsComponent category="self-hosted" name="login-banner-validate-classification" edition="Palette" />
