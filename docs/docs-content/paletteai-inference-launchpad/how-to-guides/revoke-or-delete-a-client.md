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

This guide explains how a platform administrator ends a client's access on a PaletteAI Inference Launchpad appliance:
finding expired or revoked tokens, revoking a single API token, and suspending or deleting a client. To understand how
clients and API tokens relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.

## Find Expired or Revoked Keys

The console shows each token's state, so you can find expired or revoked tokens. For how the appliance enforces token
expiry and revocation, refer to [Client Lifecycle](../explanation/clients-and-quotas.md#client-lifecycle).

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

4. Find the token, then select the **Revoke access** icon (a prohibit symbol) at the end of its row, and confirm in the
   **Revoke token** dialog.

Revoking a token is immediate and cannot be undone.

## Suspend or Delete a Client

Suspend a client to block its requests temporarily; suspension is reversible. Delete a client to permanently retire it,
which revokes all its API tokens and cannot be undone. For what each action keeps or removes, refer to
[Client Lifecycle](../explanation/clients-and-quotas.md#client-lifecycle).

Both actions are in the **Overview** section of the client's detail panel, each behind a confirmation.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Overview** section, then select **Suspend** or **Delete**, and then confirm.

To restore a suspended client, select **Resume** in the **Overview** section.

## Next Steps

- [Create a Client](./create-a-client.md)
- [Generate an API Token](./generate-an-api-token.md)
