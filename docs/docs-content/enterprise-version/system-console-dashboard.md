---
sidebar_label: "System Console Dashboard"
title: "System Console Dashboard"
description: "Understanding the super-admin settings in Palette's Enterprise (on-premise) variant."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["self-hosted", "enterprise"]
---


The self-hosted system console enables an initial setup and onboarding, administration, as well as upgrade management of the Palette Platform. The on-prem system console is available in a "quick start" mode and an "enterprise" mode.

Platform administrators can use this console to perform the following operations:

| Setting | Function |
| --- | --- |
| Tenant Management | Create and activate tenants |
| Update Management | Upgrade Spectro Cloud platform to newer versions |
| Administration | Configure platform settings like SMTP, Certificates, etc. |
| Migrate quick start mode cluster to enterprise | Available in quick start mode to install an enterprise cluster |

## Tenant Management

Create new tenants and their initial tenant admin accounts. Optionally, activate new tenants to enable tenant administrators to log in and access the tenant management console.

## Update Management

Apply Palette platform upgrades. Upgrades to the Palette platform are published to the Palette repository and a notification is displayed on the console when new versions are available. Platform administrators can apply platform upgrades directly from the on-prem system console.

## Administration

### SMTP

Configure SMTP settings to enable the Palette platform to send out email notifications. Email Notifications are sent out to new users when they are onboarded to the platform to activate their accounts.

### Certificates

Provide the desired SSL/TLS server certificates to support external access to valid HTTPs.

## Cluster Management

Enterprise clusters are created and deployed from this section. The layers and/or pack integrations constituting a cluster can also be configured and updated.
