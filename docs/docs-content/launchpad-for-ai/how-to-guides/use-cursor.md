---
sidebar_label: "Use Cursor"
title: "Use Launchpad for AI with Cursor"
description:
  "Connect the Cursor code editor to a Launchpad for AI appliance so that a model on the appliance serves your requests
  in Cursor's Ask mode."
hide_table_of_contents: false
sidebar_position: 4
tags: ["launchpad-for-ai", "cursor", "how-to"]
keywords: ["launchpad", "ai", "cursor", "openai-compatible", "model alias", "ask mode", "api token"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This guide explains how to connect Cursor to a Launchpad for AI appliance so that a model running on the appliance
serves your requests instead of a cloud provider. You generate an API token, create a uniquely named model alias on the
appliance, point Cursor at the appliance, and confirm that requests route through the appliance.

:::warning

Cursor routes only **Ask** mode (chat) requests to a custom endpoint. Agent, Edit, and Tab remain locked to Cursor's own
models. This is a limitation of Cursor's bring-your-own-key support, not of the appliance, so those modes do not use the
appliance even after you complete this guide.

:::

## Prerequisites

- Cursor installed and already working. For installation, refer to the [Cursor documentation](https://docs.cursor.com).
- A running Launchpad for AI appliance with at least one model deployed and serving. To deploy a model, refer to
  [Deploy a Model](./deploy-a-model.md).
- Operator access to the Launchpad for AI console, or an operator who can generate an API token and create a model alias
  for you. Both tasks can require operator access.
- The appliance reachable at a DNS name with a valid, publicly trusted TLS certificate. Cursor sends requests from its
  own cloud servers, so a self-signed certificate does not work and there is no client-side workaround.

## Generate an API Token

If an administrator already gave you an API token, skip to [Create a Model Alias](#create-a-model-alias).

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Access & Policy** > **Users**.

3. Create a token.

4. Copy the token when the console reveals it. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
create a new one.

:::

## Create a Model Alias

Cursor sends model requests from its own cloud servers and decides where to route each request by the model name. If the
name matches a model already in Cursor's catalog, such as `glm-5.2` or `gpt-4o`, Cursor routes the request to its own
backend and never contacts your appliance. To force Cursor to use the appliance, serve the model under a unique alias
name that does not exist in Cursor's catalog.

Creating an alias is an operator task. If you do not have operator access, ask an administrator to create the alias and
give you its name, then continue to [Configure Cursor](#configure-cursor).

The appliance can serve any model id as an alias of a model it already runs. On the appliance, alias a unique name to a
served model. Replace `<appliance-host>` with your appliance address and `<admin-session-token>` with an operator
session token.

```bash
curl --silent "https://<appliance-host>/admin/apply" \
  --header "Authorization: Bearer <admin-session-token>" \
  --header "Content-Type: application/json" \
  --data '{"proposed_op":{"op":"set_tier","alias_prefix":"launchpad-glm52","model":"zai-org/GLM-5.2","thinking":"off","confirmed":true}}'
```

Set `alias_prefix` to the unique name Cursor requests, and set `model` to the id of a model the appliance already
serves, such as `zai-org/GLM-5.2`. To find the served model id, check the appliance's `/v1/models` endpoint or the admin
view in the console.

The alias then appears in the appliance's `/v1/models` response and routes to the real model. The `alias_prefix` value,
such as `launchpad-glm52`, is the name you enter in Cursor.

{/* NEEDS REVIEW: the alias command and its admin-session bearer token ($ADMIN_SESSION) come verbatim from the connect guide; confirm how an operator obtains that session token. */}

## Configure Cursor

Point Cursor at the appliance in Cursor's settings. For the full list of settings and their example values, refer to
[Cursor Configuration](../reference/cursor-reference.md).

1. In Cursor, open **Settings** > **Models**.

2. Enable **Override OpenAI Base URL**, and enter your appliance address with the `/v1` path appended, such as
   `https://<appliance-host>/v1`.

3. In the **OpenAI API Key** field, enter your `lpai_` token.

4. Under **OpenAI API Key**, select **Add model**, and enter the unique alias name, such as `launchpad-glm52`. A unique
   name forces Cursor to treat the model as your custom model and send the request to your endpoint.

5. Turn off Cursor's built-in models so that only your alias is active.

## Verify the Connection

Confirm that Cursor routes a request to the appliance instead of to its own backend.

1. In Cursor, open a chat and set the mode to **Ask**.

2. In the model picker, select your alias, such as `launchpad-glm52`.

3. Send a test prompt.

   ```text
   reply with exactly CURSOR_OK and nothing else
   ```

4. Confirm that Cursor displays the reply `CURSOR_OK`.

Because the alias name exists only on your appliance, Cursor cannot serve it from its own backend. A reply confirms that
the chat request reached the appliance, that a model there served it, and that the base URL, token, alias, and routing
all work.

:::warning

If Cursor returns `We're having trouble finding the resource you requested`, the alias name matches a model in Cursor's
catalog, so Cursor routed the request to its own backend and never contacted the appliance. Create the alias again with
a more unique name, and select the new name in Cursor.

:::

## Request Routing and Quotas

Requests you send through the appliance are subject to the routing rule and quota configured for your API token. If an
operator configured a routing rule for your token, the appliance can redirect a request to a frontier model instead of a
local one. Token quotas apply per API token, and when a token exhausts its quota, the appliance returns an HTTP `429`
response.
{/* TODO: link to the intelligent routing how-to and the token quotas and metering reference once they exist */}

## Next Steps

To look up the base URL, alias, and the Cursor modes the appliance supports, refer to
[Cursor Configuration](../reference/cursor-reference.md).
