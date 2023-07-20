---
title: "Palette Resource Limits"
metaTitle: "Default Palette Resource Limits"
metaDescription: "Palette Resource Limit table "
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from 'shared/components/InfoBox';

# Default Palette Resource Limits Per Tenant 

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

To set resource limit:

<br />

* Login to Palette console as `Tenant Admin`.


* Select `Tenant Settings` from the left ribbon menu.


* Select `Resource Limits` tab and set the values for different Palette resources as per tenant resource requirements.
 
<InfoBox>
The resource limit can be customized according to per tenant resource requirements 
</InfoBox>

# Palette API Rate Limits

* API operations are limited to 10 requests per second for an IP Address.


* The API request limits are categorized by resources such as /v1/cloudconfig/:uid and /v1/cloudconfig/:uid/machinepools. Both API requests are counted for the same rate limits as both belong to the same cluster's cloud config resource.


* In case of too many requests, the user will receive an error with HTTP code 429 - `TooManyRequests.` In that event, it is recommended to retry the API call after a specific interval.

<br />
<br />
