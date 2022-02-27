---
title: "User Authentication"
metaTitle: "API Key for API Authentication"
metaDescription: "Palette's API key for user authentication for API access "
icon: ""
hideToC: false
fullWidth: false
---
# Overview

Palette supports two types of user authentication methods that can be used when interacting with Palette REST APIs for automation purposes:

# API Key

Palette API can also uses API Keys to authenticate requests. This is the method of accessing the API without referring to the actual user.

## Scope of Palette API Keys

* Tenant admin can create an API Key for any user within the tenant.
* Users can create API Keys for themselves.

## Creating an API key as a tenant admin

* Login to Palette using credential with admin role.
* Go to Tenant Settings and select `API Keys`.
* Click on “Add New API Key” to create a new API key. The following information is required for creating a new API Key:
  * API Key Name: The tenant/user-specified custom name for the key.
  * Description: An optional description about the key.
  * Username: Select the user for whom the key is created from the drop-down.
  * Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further customized after the key creation. The various options available for the expiration dates are:
    * 7 days
    * 30 days
    * 60 days
    * 90 days
    * Custom: Select a custom expiry date from the calendar.
* Confirm the information to complete the wizard.

### Manage API Keys as a tenant admin

* Login to Palette using credential with admin role.
* Go to Tenant Settings and select `API Keys`.
* Detailed status of the keys can be observed from the Palette dashboard. In addition to the key's name, description, and expiration date, the Palette console displays the API keys, the user to which each key is assigned, and the status of the key.
* To view all the keys assigned to a particular user, select the user's name at “User Name” on top of the page, below the “Manage API Keys”.
* For each key from the Kabab menu, we can:
  * Edit: The following information can be edited from the menu,
    * API Key name
    * Description(optional)
    * Expiration Date
  * Revoke: Change the status of the key from ‘active’ to ‘inactive’.
  * Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  * Delete: Delete the key.

## Creating an API key for the logged-in user

* Login to Palette
* Select `API Keys` from user menu.
* Click on “Add New API Key” to create a new API key. The following information is required for creating a new API Key:
  * API Key Name: The tenant/user-specified custom name for the key.
  * Description: An optional description about the key.
  * Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further customized after the key creation. The various options available for the expiration dates are:
    * 7 days
    * 30 days
    * 60 days
    * 90 days
    * Custom: Select a custom expiry date from the calendar.
* Confirm the information to complete the wizard. The created key will be assigned to the logged-in user.

### Manage API Keys for the logged-in user

* Login to Palette
* Select `API Keys` from user menu.
* Detailed status of the key can be observed from the Palette dashboard. In addition to the key's name, description, and expiration date, the Palette console displays the API keys belonging to the user, and the status of the keys.
* To view all the keys assigned to a particular user, select the user's name at “User Name” on top of the page, below the “Manage API Keys”.
* For each key from the Kabab menu, we can:
  * Edit: The following information can be edited from the menu,
    * API Key name
    * Description(optional)
    * Expiration Date
  * Revoke: Change the status of the key from ‘active’ to ‘inactive’.
  * Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  * Delete: Delete the key.

## Using your API key

User can copy their API key from the Palette dashboard and use it for making REST API calls in one of the following ways:

* Query Parameter - Pass the key as a query parameter`ApiKey=<apiKey>`. Example:
  `v1/spectroclusters?ApiKey=QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl`
* Request Header - Pass the API Key as a HTTP request header in the following format:
  * Key: ApiKey
  * Value: API key copied from the Palette Console. E.g.: QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl

# Authorization Token

* All requests must be authenticated with an API token that is passed using the HTTP request header `Authorization`.
* Users can use the [`/auth/authenticate`](/api/v1/auth) API to authenticate and obtain the authorization token by supplying their username and password.
* Every authorization token is valid for 15 min.
* To refresh the token use: [`GET /v1/auth/refresh/{token}`](/api/v1/auth)
