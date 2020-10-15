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

# Understanding the System Console

When Spectro Cloud's Platform Installer is deployed either in the Quick Start variant or the Enterprise variant, the super admins have access to the System console. This is different from the tenant [admin console](/getting-started/#admindashboard). Super admins can use this console to:

| Setting | Function |
| --- | --- |
| Tenant Management | Manage tenants in the private network |
| Update Management | Schedule updates to the Spectro Cloud product |
| Network Management | Monitor the private network |
| Administration | Configure the SMTP, Proxy, and Certificate settings |
| Cluster Management | Operate on the enterprise clusters |
| Backup/Restore | Backup and restore data from the Quick Start variant |

***Random text; verification needed.***

# Tenant Management

Super admins can create and delete tenant spaces here. Once a tenant space is created, one or more tenant admins can be created here. For each tenant admin, an activation link is needed for the first login. This link is also generated in this section.

# Update Management

An update to the product will be automatically pushed to the Spectro Cloud repository. The update manager will notify the super admins when an update is available. Super admins can use the Update Management setting to view and enable the updates to one or more tenants, as applicable, and also schedule when the updates are installed.

# Network Management

This setting allows super admins to create multiple VPNs and/or gateways for isolating tenant spaces.

# Administration

For all things related to connection protocols such as SMTP, Proxies, and Certificates.

## SMTP

Create and configure SMTP clients and servers, security extensions, and [implementation logics](https://docs.nginx.com/nginx/admin-guide/mail-proxy/mail-proxy/).

## Proxy

Details of HTTP proxies, HTTPS proxies, SOCKS proxies, NO_PROXY; adding and configuring firewalls, etc.

## Certificates

Key management for SSH keys on a per-tenant basis.

# Cluster Management

Enterprise clusters are created and deployed from this section. The layers and/or pack integrations constituting a cluster also can be configured and their versions updated.

# Backup and Restore

This section allows super admins to handle the databases of the Quick Start variant - backup and restore locations and frequencies, database formats and languages, etc.
