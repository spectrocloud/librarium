---
sidebar_label: "User Authentication"
title: "User Authentication"
description:
  "Palette supports three types of user authentication methods. User Interface (UI) authentication, API Key, and
  Authorization Token."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "authentication"]
---

Palette supports three types of user authentication methods.

- User Interface UI authentication

- API Key

- Authorization Token

The API key and the authorization token method can be used when interacting with Palette REST APIs for automation and
programmatic purposes.

## UI Authentication

<!-- vale off -->

You can log into Palette SaaS platform by visiting the console URL at
[http://console.spectrocloud.com](https://console.spectrocloud.com). If you are a user of a self-hosted Palette or
Palette VerteX, then you should use the URL provided by your system administrator, such as `palette.abc-company.com.`

To learn more the UI authentication, refer to the [UI Authentication](./ui-autentication.md) section.

<!-- vale on -->

## API Key

You can use API keys to authenticate API requests. Use the API key to make REST API without having to provide your
username and password. Check the [API Key](api-key/api-key.md) section for more information.

<!-- Key points to note about API Keys:

* Tenant admin can create an API Key for any user within the tenant.

* Once you create an API Key, you cannot view the key again. Save the key in a secure location, such as a password manager.

* Users can create API Keys for themselves. -->

<!-- ## Creating an API key as a tenant admin

* Login to Palette using credential with admin role.
* Go to Tenant Settings and select **API Keys**.
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

* Log in to Palette using credential with admin role.
* Go to Tenant Settings and select **API Keys**.
* Detailed status of the keys can be observed from the API overview page. In addition to the key's name, description, and expiration date, the overview page displays the API keys, the user to which each key is assigned, and the status of the key.
* To view all the keys assigned to a particular user, select the user's name at **User Name** on top of the page, below the **Manage API Keys**.
* Each API has a settings menu, click on the **three-dot Menu**, to view the following options:
  * Edit: The following information can be edited from the menu,
    * API Key name
    * Description(optional)
    * Expiration Date
  * Revoke: Change the status of the key from **active** to **inactive**.
  * Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  * Delete: Delete the key.

## Creating an API key for the logged-in user

* Log in to Palette
* Select **API Keys** from **User Menu**.
* Click on **Add New API Key** to create a new API key. The following information is required for creating a new API Key:
  * API Key Name: The tenant/user-specified custom name for the key.
  * Description: An optional description about the key.
  * Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further customized after the key creation. The various options available for the expiration dates are:
    * 7 days
    * 30 days
    * 60 days
    * 90 days
    * Custom: Select a custom expiry date from the calendar.
* Confirm the information to complete the wizard.

### Manage API Keys for the logged-in user

* Log in to Palette
* Select **API Keys** from the **User Menu**.
* Detailed status of the key can be observed from the API overview page. In addition to the key's name, description, and expiration date, the overview page displays the API keys belonging to the user, and the status of the keys.
* To view all the keys assigned to a particular user, select the user's name at **User Name** on top of the page, below the “Manage API Keys”.
* Each API has a settings menu, click on the **three-dot Menu**, to view the following options:
  * Edit: The following information can be edited from the menu,
    * API Key name
    * Description(optional)
    * Expiration Date
  * Revoke: Change the status of the key from **active** to **inactive**.
  * Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  * Delete: Delete the key.

### API Key Usage

You copy your API key from the Palette dashboard and use it for making REST API calls in one of the following ways:

* Query Parameter - Pass the key as a query parameter`ApiKey=<apiKey>`. Example:
  `v1/spectroclusters?ApiKey=QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl`
* Request Header - Pass the API Key as a HTTP request header in the following format:
  * Key: ApiKey
  * Value: API key copied from the Palette Console. E.g.: QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl -->

## Authorization Token

You can use authorization tokens to authenticate API requests. To obtain an authorization token, use the
`v1/auth/authenticate` API endpoint with a POST request to authenticate and obtain the authorization token. Provide your
API key as a header value or query parameter.

To learn more about the authorization token, refer to the [Authorization Token](authorization-token.md) section.

## Resources

- [Authorization Token](authorization-token.md)

- [API Key](api-key/api-key.md)

- [UI Authentication](authentication.md)
