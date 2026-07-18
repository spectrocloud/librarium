---
sidebar_label: "Revoke or Delete a Client"
title: "Revoke or Delete a Client"
description:
  "Step-by-step guidance for platform administrators on how to find expired keys, revoke an API token, and delete a
  client on a PaletteAI Inference Launchpad appliance, and what happens to in-flight requests."
hide_table_of_contents: false
sidebar_position: 8
tags: ["paletteai-inference-launchpad", "clients", "api token", "how-to"]
keywords: ["launchpad", "ai", "clients", "revoke", "delete", "expired", "api token", "in-flight"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This guide explains how a platform administrator ends a client's access on a PaletteAI Inference Launchpad appliance:
finding expired or revoked tokens, revoking a single API token, and deleting a client. To understand how clients and API
tokens relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.

## Find Expired or Revoked Keys

An API token that passes its expiration date becomes expired, and the appliance rejects any request that presents it,
fail-closed. The console shows each token's state so you can find expired tokens.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **API tokens** section. Each token shows a state of **active**, **expired**, or **revoked**.

The **Usage** page also shows a token's state in its per-token detail. For usage, refer to
[View Client Usage](./view-client-usage.md).

{/* NEEDS REVIEW: the ticket (DOC-2927) also asks for expired keys to be flagged on an overview page, but the appliance Overview dashboard, the client Overview section, and the client list do not flag expired tokens. Expired state appears only in a client's API tokens section and in the Usage per-token detail. Confirm the intended surface with the ticket owner. */}

## Revoke an API Token

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **API tokens** section.

4. Find the token, and then select **Revoke**.

Revoking a token is immediate and cannot be undone.

## Delete a Client

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client's delete action, and then confirm.
   {/* NEEDS REVIEW: exact delete control and confirmation wording. */}

Deleting a client revokes every API token that belongs to it.

## Next Steps

- [Create a Client](./create-a-client.md)
- [Generate an API Token](./generate-an-api-token.md)
