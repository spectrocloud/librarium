---
sidebar_label: "Authorization Token"
title: "Authorization Token"
description: "Learn about Authorization Token authentication method in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["user-management", "authentication"]
---

Palette exposes an API endpoint to generate an authorization token for a user. The authorization token is valid for the
tenant's [session timeout](../../tenant-settings/session-timeout.md), which is 240 minutes by default. Tenant
administrators can set the session timeout from 15 to 1,440 minutes. Before the token expires, you can refresh it. Refer
to [Refresh Authorization Token](#refresh-authorization-token).

API requests using the authorization token must use the HTTP header `Authorization` with a token as the value.

```bash
TOKEN=abcd1234
```

```bash
curl --location --request GET 'https://api.spectrocloud.com/v1/projects/alerts' \
--header "Authorization: $TOKEN" \
--header "Content-Type: application/json"
```

## Acquire Authorization Token

To acquire an authorization token, use the `v1/auth/authenticate` endpoint with a POST request. Provide your email
address, organization name, and password in the request body, as shown in the following example.

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

To refresh the authorization token, use the `v1/auth/refresh` endpoint with a GET request. Palette does not issue a
separate refresh token.

```bash
curl --location 'https://api.spectrocloud.com/v1/auth/refresh/<authorization-token>' \
--header 'Accept: application/json'
```

Replace `<authorization-token>` with your current authorization token.

The response contains a new authorization token, which is valid for the tenant's session timeout from the time of the
refresh. Use the new authorization token in the `Authorization` header to make API requests.

You cannot refresh an expired token. If your token has expired, request a new one. Refer to
[Acquire Authorization Token](#acquire-authorization-token).

The following example shows how to refresh the authorization token. The token in the URL is shortened.

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

The `v1/auth/authenticate` endpoint returns a restricted authorization token in the following cases.

- If you have a passkey, the token allows you only to complete passkey verification in the browser. This applies in
  every tenant, whether or not the tenant enforces passkeys.

- If your tenant [enforces passkeys](../../tenant-settings/passkeys.md), you do not have a passkey, and your grace
  period is over, the token allows you only to add a passkey.

You cannot use a restricted token for any other API request. The response shows whether the token is restricted. The
`isMfa` field is `true` when passkey verification is required, and the `mfaEnrollment` field is `required` when you must
add a passkey. The following example shows the response for a user who must verify a passkey.

```json hideClipboard
{
  "Authorization": "eyJhbGc..........",
  "isMfa": true,
  "mfaEnrollment": "none"
}
```

You cannot complete passkey verification through the API. If the `isMfa` field is `true` or the `mfaEnrollment` field is
`required`, sign in to Palette through your browser instead. To authenticate API requests for automation, use an
[API key](./api-key/api-key.md). Palette does not ask for a passkey when you authenticate with an API key or sign in
through Single Sign-On (SSO).
