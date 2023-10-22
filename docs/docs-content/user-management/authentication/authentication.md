---
sidebar_label: "User Authentication"
title: "User Authentication"
description: "Palette supports three types of user authentication methods. User Interface (UI) authentication, API Key, and Authorization Token."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "authentication"]
---



Palette supports three types of user authentication methods. 

* User Interface UI authentication

* API Key

* Authorization Token

The API key and the authorization token method can be used when interacting with Palette REST APIs for automation and programmatic purposes.


## UI Authentication
<!-- vale off -->
You can log into Palette SaaS platform by visiting the console URL at [http://console.spectrocloud.com](https://console.spectrocloud.com). If you are a user of a self-hosted Palette or Palette VerteX, then you should use the URL provided by your system administrator, such as `palette.abc-company.com.` 

To learn more the UI authentication, refer to the [UI Authentication](./ui-autentication.md) section.


<!-- vale on -->


## API Key

You can use API keys to authenticate API requests. Use the API key to make REST API without having to provide your username and password. Check the [API Key](api-key/api-key.md) section for more information.

## Authorization Token

You can use authorization tokens to authenticate API requests.  To obtain an authorization token, use the `v1/auth/authenticate` API endpoint with a POST request to authenticate and obtain the authorization token. Provide your API key as a header value or query parameter. 

To learn more about the authorization token, refer to the [Authorization Token](authorization-token.md) section.


## Resources

- [Authorization Token](authorization-token.md)

- [API Key](api-key/api-key.md)

- [UI Authentication](authentication.md)