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

The on-prem system console is enables initail setup and ongoing and administration as well as upgrade management of Spectro Cloud Platform. The on-prem system console is available in quick start and enterpsise mode. 

Platform administrators can use this console to perform the following operations:

| Setting | Function |
| --- | --- |
| Tenant Management | Create and activate tenants |
| Update Management | Upgrade Spectro Cloud platform to newer versions |
| Administration | Configure platform settings like SMTP, Certificate etc. |
| Enterprise Cluster Migration | Available in quick start mode install an enterprise cluster |


***Random text; verification needed.***

# Tenant Management

Create new tenants and their initial tenant admin accounts. Optionally activate new tenants to enable administrators to login and access the tenant management console. 

# Update Management

Upgrades to Spectro Cloud platform are deployed to the Spectro Cloud repository and a notification is displayed on the console when new versions are avialble. Platform administrators can apply platform upgrades direcly from the on-prem system console. 


# Administration


## SMTP

Configure SMTP settings to enable Spectro Cloud platform to send out email notifications. Email Notifications are sent out to new users when they are onboarded to the platform so they can activate their accounts

## Certificates

Provide the desired certificate and key to be used for external 


# Cluster Management

Enterprise clusters are created and deployed from this section. The layers and/or pack integrations constituting a cluster also can be configured and their versions updated.

