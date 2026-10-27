---
sidebar_label: "Authorization Token"
title: "Authorization Token"
description: "Learn about Authorization Token authentication method in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["user-management", "authentication"]
---

Palette exposes an API endpoint to generate an authorization token for a user. The authorization token is valid for 15
minutes. You can refresh the token using the refresh token API endpoint.

API requests using the authorization token must use the HTTP header `Authorization` with a token as the value.

```bash
TOKEN=abcd1234
```

```bash
curl --location --request GET 'https://api.spectrocloud.com/v1/projects/alerts' \
--header "Authorization: $TOKEN" \
--header "Content-Type: application/json"
```

To refresh the authorization token, use the `v1/auth/refresh` endpoint with a GET request.

## Acquire Authorization Token

To acquire an authorization token, use the `v1/auth` endpoint with a POST request to generate the token. Provide the
email ID, organization name, and password in the request body. For example:

```bash
curl --location 'https://api.spectrocloud.com/v1/auth/authenticate' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw '{
  "emailId": "YOUR_EMAIL_ID",
  "org": "YOUR_ORG_NAME",
  "password": "YOUR_PASSWORD"
}'
```

```json hideClipboard
{
  "Authorization": "eyJhbGc.........."
}
```

Use the authorization token in the `Authorization` header to make API requests.

## Refresh Authorization Token

To refresh the authorization token, use the `v1/auth/refresh` endpoint with a GET request. Provide the refresh token as
a path parameter by replacing `:token` in the URL with the refresh token.

```bash
curl --location 'https://api.spectrocloud.com/v1/auth/refresh/:token' \
--header 'Accept: application/json'
```

The response contains the authorization token. Use the new authorization token in the `Authorization` header to make API
requests.

The following example shows how to refresh the authorization token using the refresh token. The refresh token is
abbreviated for brevity.

```bash hideClipboard
curl --location 'https://api.spectrocloud.com/v1/auth/refresh/eyJhbGc..........' \
--header 'Accept: application/json'
```

```json hideClipboard
{
  "Authorization": "eyJhbGc.........."
}
```

## Authorization Tokens and Passkeys

If you have a passkey and your tenant enforces passkeys, the authorization token that the `v1/auth/authenticate`
endpoint returns is restricted. You can use a restricted token only to complete passkey verification, not for other API
requests. The same applies if your grace period to add a passkey is over and you do not have one yet, except that the
token only allows you to add a passkey. For more information about passkey enforcement, refer to
[Passkey Enforcement](../../tenant-settings/passkeys.md).

The response shows whether the token is restricted. The `isMfa` field is `true` when passkey verification is required,
and the `mfaEnrollment` field is `required` when you must add a passkey. The following example shows the response for a
user who must verify a passkey.

```json hideClipboard
{
  "Authorization": "eyJhbGc..........",
  "isMfa": true,
  "mfaEnrollment": "none"
}
```

To authenticate API requests for automation in a tenant that enforces passkeys, use an [API key](./api-key/api-key.md)
instead. Passkey enforcement does not apply to API keys.
