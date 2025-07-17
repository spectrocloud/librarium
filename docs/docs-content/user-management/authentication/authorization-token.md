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
TOKEN=abcd1234 # pragma: allowlist-secret
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
