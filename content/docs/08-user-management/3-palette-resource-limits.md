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

|Resources           |  Max Limit Per Tenant|
|--------------------|----------------------|
|Users               |     300              |
|Teams               |     100              |
|Projects            |      50              |
|Workspaces          |      50              |
|Roles               |     100              |
|CloudAccounts       |     200              |
|Cluster profiles    |     200              |
|Registries          |      50              |
|Private Gateway     |      50              |
|Api Keys            |   20 keys per user   |
|Locations(Backup)   |      100             |
|Certificates        |       20             |
|Macros              |      200 (Per Project)|
|SSH Keys            |      300              |
|Alerts or Webhook   |   100 (Per Project)   |
|Clusters.           |      200              |
|Appliances(Edgehosts|      200              |  


<InfoBox>
The resource limit can be customized according to per tenant resource requirements 
</InfoBox>

# Palette API Rate Limits

* API operations are limited to 10 requests per second for an IP Address.


* The API request limits are categorized by resources such as  `/v1/cloudconfig/:uid` and `/v1/cloudconfig/:uid/`.


* Machine pools are counted for rate limits as both belong to the same cloud-config resource.


* In case of too many requests, the user will receive an error with HTTP code 429 - `TooManyRequests.` In that event, it is recommended to retry the API call after a specific interval.

<br />
<br />
