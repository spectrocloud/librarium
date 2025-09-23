---
sidebar_label: "System Management"
title: "System Management"
description: "Manage your Palette system settings."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["palette", "self-hosted", "management"]
keywords: ["self-hosted", "enterprise"]
---

Palette contains many system settings you can configure to meet your organization's needs. These settings are available
at the system level and are applied to all [tenants](../../glossary-all.md#tenant) in the system.

:::warning

Exercise caution when changing system settings, as the changes will be applied to all tenants in the system.

:::

## System Console

The system console enables you to complete the initial setup and onboarding and manage the overall Palette environment.

### Access the System Console

You can access the system console by visiting the IP address or the custom domain name assigned to your Palette cluster
and appending the `/system` path to the URL. For example, if your Palette cluster is hosted at
`https://palette.abc.com`, you can access the system console at `https://palette.abc.com/system`.

## Administration and Management

Platform administrators can use the system console to perform the following operations:

- [Account management](account-management/account-management.md)

- [Create and Manage System Accounts](./account-management/account-management.md)

- [Configure and manage SMTP settings](smtp.md).

- [Configure and manage Pack registries](add-registry.md).

- [Configure and manage SSL certificates](ssl-certificate-management.md).

- [Enable backup and restore](backup-restore.md).

- Configure DNS settings.

- Setup alerts and notifications.

- Enable metrics collection.

- [Manage feature flags](./feature-flags.md).

- Manage Palette platform upgrades.

- [Configure login banner](./login-banner.md).

- [Manage tenants](tenant-management.md).

- [Override Registry Configuration](registry-override.md)

- Manage the Enterprise cluster and the profile layers and pack integrations that makeup the Enterprise cluster.

- [Customize the login screen and dashboard interface](./customize-interface.md).

Check out the following resources to learn more about these operations.

## Resources

- [Add a Tenant-Level Registry](add-registry.md)

- [Tenant Management](tenant-management.md)

- [Configure Reverse Proxy](reverse-proxy.md)

- [SSL Certificate Management](ssl-certificate-management.md)
