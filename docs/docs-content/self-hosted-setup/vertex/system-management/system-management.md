---
sidebar_label: "System Management"
title: "System Management"
description: "Manage your Palette VerteX system settings."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["self-hosted", "vertex", "management"]
keywords: ["self-hosted", "vertex", "management"]
---

Palette VerteX contains many system settings you can configure to meet your organization's needs. These settings are
available at the system level and are applied to all [tenants](../../glossary-all.md#tenant) in the system.

## System Console

The system console enables you to complete the initial setup and onboarding and manage the overall Palette environment.

### Access the System Console

You can access the system setting by visiting the IP address or the custom domain name assigned to your Palette VerteX
cluster and appending the `/system` path to the URL. For example, if your Palette VerteX cluster is hosted at
`https://vertex.abc.com`, you can access the system settings at `https://vertex.abc.com/system`.

![View of the VerteX system console landing page.](/vertex_system-management_overview-system-console.webp)

## Administration and Management

System administrators can use the system console to perform the following operations:

- [Create and manage system administrators](account-management/account-management.md)

- [Configure and manage SMTP settings](smtp.md).

- [Add system-level OCI-compliant pack registries](add-registry.md).

- [Configure and manage SSL certificates](ssl-certificate-management.md).

- [Enable backup and restore for your self-hosted installation](backup-restore.md).

- Configure DNS settings.

- Set up alerts and notifications.

- Enable metrics collection.

- [Enable tech preview features using feature flags](./feature-flags.md).

- Manage Palette platform upgrades.

- [Configure login and classification banners](./login-banner.md).

- [Create and manage tenants](tenant-management.md).

- [Configure Palette to pull images from an alternate registry](registry-override.md)

- Manage the Enterprise cluster and the profile layers and pack integrations that makeup the Enterprise cluster.

- [Customize the login screen and dashboard interface](./customize-interface.md).

- [Configure reverse proxy](reverse-proxy.md)
