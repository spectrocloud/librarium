---
sidebar_label: "System Management"
title: "System Management"
description: "Manage your Palette VerteX system settings."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["vertex", "management"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX contains many system settings you can configure to meet your organization's needs. These settings are available at the system level and are applied to all [tenants](../../glossary-all.md#tenant) in the system. 


## System Console

The system console enables you to complete the initial setup and onboarding and manage the overall Palette environment.


### Access the System Console

You can access the system setting by visiting the IP address or the custom domain name assigned to your Palette VerteX cluster and appending the `/system` path to the URL. For example, if your Palette VerteX cluster is hosted at `https://vertex.abc.com`, you can access the system settings at `https://vertex.abc.com/system`.


![View of the VerteX system console landing page.](/vertex_system-management_overview-system-console.png)


## Administration and Management

Platform administrators can use the system console to perform the following operations:

- Manage FIPS enforcement behaviors and settings.

- Configure and manage SMTP settings.

- [Configure and manage pack registries](../system-management/add-registry.md).

- [Configure and manage SSL certificates](ssl-certificate-management.md).

- Configure DNS settings.

- Setup alerts and notifications.

- Enable metrics collection.

- Manage VerteX platform upgrades.

- Configuere login banner.

- [Manage tenants](tenant-management.md).

- Manage the Enterprise cluster and the profile layers and pack integrations that makeup the Enterprise cluster.

Check out the following resources to learn more about these operations.

:::caution

Exercise caution when changing system settings as the changes will be applied to all tenants in the system.

:::


## Resources

- [Add a Registry](add-registry.md)

- [Enable non-FIPS Settings](enable-non-fips-settings/enable-non-fips-settings.md)

- [Tenant Management](../system-management/tenant-management.md)

- [SSL Certificate Management](../system-management/ssl-certificate-management.md)

- [Configure and manage pack registries](../system-management/add-registry.md).
