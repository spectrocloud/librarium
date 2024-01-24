---
sidebar_label: "User Authentication"
title: "API Key for API Authentication"
description: "Palette's API key for user authentication for API access "
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management"]
---

Palette supports three types of user authentication methods.

- [User Interface (UI)](#ui-authentication) authentication

- [API Key](#api-key)

- [Authorization Token](#authorization-token)

The API key and the authorization token method can be used when interacting with Palette REST APIs for automation and
programmatic purposes.

## UI Authentication

<!-- vale off -->

You can log into Palette by visiting the Palette at [http://console.spectrocloud.com](https://console.spectrocloud.com).
If you are a user of a Palette Enterprise instance, then you should use the URL provided by your Palette system
administrator, such as `example-company.console.spectrocloud.com.`

<!-- vale on -->

## Account Sign Up

You can sign up for a Palette SaaS account by visiting [Palette](https://console.spectrocloud.com) or an Enterprise
Palette account under your organization by using your organization's custom Palette URL.

When you create an account, you can create a username and password or create the account through a third-party identity
provider, GitHub, Google, or other OIDC providers that are enabled for your organization. For Palette SaaS, GitHub and
Google are automatically enabled for SSO integration.

## Sign In Flow

Starting with Palette 3.2, the user sign-in flow can be different depending on how you created your Palette account. If
you created your user with a username and password, then you may be prompted to select the organization you wish to log
in to. If you are a member of a single organization, then you will not be prompted for an organization selection.

If you created an account through SSO and are a member of different organizations, then you must first select the
organization name you wish to log in to. Click on the **Sign in to your organization** button for the option to specify
the organization name. If you need help remembering the organization name, click on the **Forgot your organization
name?** button and provide your email address to receive an email containing your organization name and its login URL.

<br />

:::info

If you are a Palette Enterprise user, use the custom Palette URL for an optimized login experience and avoid specifying
the organization name. Ask your Palette system administrator for the custom Palette URL.

:::

## API Key

Palette API can also use API Keys to authenticate requests. This is the method of accessing the API without referring to
the actual user.

## Scope of Palette API Keys

- Tenant admin can create an API Key for any user within the tenant.
- Users can create API Keys for themselves.

## Creating an API key as a tenant admin

- Login to Palette using credential with admin role.
- Go to Tenant Settings and select **API Keys**.
- Click on “Add New API Key” to create a new API key. The following information is required for creating a new API Key:
  - API Key Name: The tenant/user-specified custom name for the key.
  - Description: An optional description about the key.
  - Username: Select the user for whom the key is created from the drop-down.
  - Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further
    customized after the key creation. The various options available for the expiration dates are:
    - 7 days
    - 30 days
    - 60 days
    - 90 days
    - Custom: Select a custom expiry date from the calendar.
- Confirm the information to complete the wizard.

### Manage API Keys as a tenant admin

- Log in to Palette using credential with admin role.
- Go to Tenant Settings and select **API Keys**.
- Detailed status of the keys can be observed from the API overview page. In addition to the key's name, description,
  and expiration date, the overview page displays the API keys, the user to which each key is assigned, and the status
  of the key.
- To view all the keys assigned to a particular user, select the user's name at **User Name** on top of the page, below
  the **Manage API Keys**.
- Each API has a settings menu, click on the **three-dot Menu**, to view the following options:
  - Edit: The following information can be edited from the menu,
    - API Key name
    - Description(optional)
    - Expiration Date
  - Revoke: Change the status of the key from **active** to **inactive**.
  - Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  - Delete: Delete the key.

## Creating an API key for the logged-in user

- Log in to Palette
- Select **API Keys** from **User Menu**.
- Click on **Add New API Key** to create a new API key. The following information is required for creating a new API
  Key:
  - API Key Name: The tenant/user-specified custom name for the key.
  - Description: An optional description about the key.
  - Expiration Date: Set an expiry date for the key from the options available. The expiration date can be further
    customized after the key creation. The various options available for the expiration dates are:
    - 7 days
    - 30 days
    - 60 days
    - 90 days
    - Custom: Select a custom expiry date from the calendar.
- Confirm the information to complete the wizard.

### Manage API Keys for the logged-in user

- Log in to Palette
- Select **API Keys** from the **User Menu**.
- Detailed status of the key can be observed from the API overview page. In addition to the key's name, description, and
  expiration date, the overview page displays the API keys belonging to the user, and the status of the keys.
- To view all the keys assigned to a particular user, select the user's name at **User Name** on top of the page, below
  the “Manage API Keys”.
- Each API has a settings menu, click on the **three-dot Menu**, to view the following options:
  - Edit: The following information can be edited from the menu,
    - API Key name
    - Description(optional)
    - Expiration Date
  - Revoke: Change the status of the key from **active** to **inactive**.
  - Re-activate: Change the status of the key from ‘inactive’ to ‘active’ as long as expiration date has not passed.
  - Delete: Delete the key.

## API Key Usage

You copy your API key from the Palette dashboard and use it for making REST API calls in one of the following ways:

- Query Parameter - Pass the key as a query parameter`ApiKey=<apiKey>`. Example:
  `v1/spectroclusters?ApiKey=QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl`
- Request Header - Pass the API Key as a HTTP request header in the following format:
  - Key: ApiKey
  - Value: API key copied from the Palette Console. E.g.: QMOI1ZVKVIoW6LM6uXqSWFPsjmt0juvl

## Authorization Token

You can use authorization tokens to authenticate requests.

To obtain an authorization token, use the `v1/auth/authenticate` endpoint with a POST request to authenticate and obtain
the authorization token. Provide your API key as a header value or query parameter. The authorization token is valid for
15 minutes. You can refresh the token using the refresh token API.

API requests using the authroization token must use the HTTP header `Authorization` with token as the value. For
example:

```bash
TOKEN=abcd1234
```

```bash
curl --location --request GET 'https://api.spectrocloud.com/v1/projects/alert' \
--header 'Authorization: $TOKEN' \
--header 'Content-Type: application/json'
```

To refresh the authorization token, use the `v1/auth/refresh` endpoint with a GET request to refresh the authorization
token.
