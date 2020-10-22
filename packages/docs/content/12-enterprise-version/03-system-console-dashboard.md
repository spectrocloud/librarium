---
title: "System Console Dashboard"
metaTitle: "System Console Dashboard"
metaDescription: "Understanding the super-admin settings in Spectro Cloud's Enterprise (on-premise) variant."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Overview

The on-prem system console enables an initial setup and onboarding, administration, as well as upgrade management of the Spectro Cloud Platform. The on-prem system console is available in a "quick start" mode and an "enterprise" mode.

Platform administrators can use this console to perform the following operations:

| Setting | Function |
| --- | --- |
| Tenant Management | Create and activate tenants |
| Update Management | Upgrade Spectro Cloud platform to newer versions |
| Administration | Configure platform settings like SMTP, Certificates, etc. |
| Enterprise Cluster Migration | Available in quick start mode to install an enterprise cluster |

# Tenant Management

Create new tenants and their initial tenant admin accounts. Optionally, activate new tenants to enable tenant administrators to log in and access the tenant management console.

# Update Management

Upgrades to the Spectro Cloud platform are published to the Spectro Cloud repository and a notification is displayed on the console when new versions are avialble. Platform administrators can apply platform upgrades directly from the on-prem system console.

# Administration

## SMTP

Configure SMTP settings to enable the Spectro Cloud platform to send out email notifications. Email Notifications are sent out to new users when they are onboarded to the platform so they can activate their accounts.

## Certificates

Provide the desired certificate and key to be used for external access.

# Cluster Management

Enterprise clusters are created and deployed from this section. The layers and/or pack integrations constituting a cluster also can be configured and their versions updated.
