---
title: "Palette Resource Limits"
metaTitle: "Default Palette Resource Limits"
metaDescription: "This topic describes the default resource limits for Palette and how to set resource limits for your Palette tenant."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';

# Default Palette Resource Limits

The following table lists the default resource limits for Palette:

|Resources           |  Max Limit | Scope | 
|--------------------|----------------------|  ---- |
|Users               |     300              | Tenant|
|Teams               |     100              | Tenant| 
|Projects            |      50              | Tenant | 
|Workspaces          |      50              | Tenant |
|Roles               |     100              | Tenant |
|Cloud Accounts       |     200              | Tenant |
|Cluster Profiles    |     200              | Tenant |
|Registries          |      50              | Tenant |
|Private Gateway     |      50              | Tenant |
|API Keys            |       20             |  User |
|Backup Locations    |      100             | Tenant |
|Certificates        |       20             | Tenant |
|Macros              |      200              | Project|
|SSH Keys            |      300              | Tenant |
|Alerts or Webhook   |       100            | Project|
|Clusters            |      12,000          | Tenant |
|Edge Hosts          |      200            |  Tenant |

# Set Resource Limit 

Use the following steps to set or update resource limits for your Palette tenant.

## Prerequisites

* You must have access to the Tenant Admin role.


## Update Limits

1. Login to [Palette](https://console.spectrocloud.com) as a Tenant Admin.


2. Navigate to the left **Main Menu** and select **Tenant Settings**.


3. Select **Resource Limits** from the **Tenant Settings Menu**.


4. Set the values for the different Palette resources. Ensure you do not 


5. Click **Save changes**.


## Validate

You can validate the updated resource limits by attempting to create a resource of the resource type you updated. For example, if you updated the **API Key** to five, you can create five API keys. If you attempt to create a sixth API key, you will receive an error message.



<br />
<br />
