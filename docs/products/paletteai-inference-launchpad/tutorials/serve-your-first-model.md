---
sidebar_label: "Serve Your First Model"
title: "Serve Your First Model to Claude Code"
description:
  "A hands-on tutorial that takes you from a freshly installed PaletteAI Inference Launchpad appliance to a Claude Code
  session answered by a model on your own hardware."
hide_table_of_contents: false
sidebar_position: 1
toc_max_heading_level: 2
tags: ["paletteai-inference-launchpad", "claude-code", "tutorial"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "tutorial", "first model", "api token"]
---

In this tutorial, we deploy a model to a PaletteAI Inference Launchpad appliance and connect Claude Code to it, so that
a coding question is answered by hardware you control. Along the way we meet the model catalog, GPU memory, clients, API
tokens, and alias routing.

We work in two places. The console, in a browser, is where we deploy the model and create the client. A terminal, on
your own machine, is where we watch the appliance and run Claude Code.

Set aside about 20 minutes. Most of that time is the appliance loading model weights onto a GPU, and you get your first
result about one minute in.

## What You Need

Confirm each of the following before you start. Every item is something you can check in a few seconds, and stopping now
is faster than stopping at **Create a Client and Its API Token**.

On the appliance:

- PaletteAI Inference Launchpad 1.1.3 or later. The version appears at the bottom of the left main menu. To upgrade,
  refer to [Upgrade the Platform](../how-to-guides/upgrade-the-platform.md).

- The console reachable in a browser at `https://<appliance-address>`, and the local admin account you set during setup.
  To install an appliance, refer to [Install the Appliance](../how-to-guides/install-the-appliance.md).

- At least one model uploaded to a node, with enough free GPU memory to run it. To upload a model, refer to
  [Upload a Model](../how-to-guides/upload-a-model.md).

On your own machine:

- Claude Code, installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).

- A terminal, with `curl` and `jq` available.

- Network access to the appliance address. If the console loads in your browser, your terminal can reach it too.

:::info

Two credentials appear in this tutorial, and they are not interchangeable. The **admin sign-in** gets you into the
console, and you already have it. The **API token** authenticates Claude Code, and we create it in **Create a Client and
Its API Token**. Neither one works in place of the other.

:::

## Sign In to the Console

First, open `https://<appliance-address>` in a browser and sign in with your admin account.

The **Overview** page opens. Notice the status indicator near the top of the page. On a healthy appliance it reads
`all clear`, which means the appliance has nothing waiting on you.

Keep this browser tab open.

## Ask the Appliance About Its GPUs

Before we change anything on the appliance, we get something back from it. Open a terminal and run the following
command, replacing `<appliance-address>` with your appliance address.

{/* TODO: confirm with an SME that /healthz is a supported surface the docs may document, and that publishing its response shape is acceptable. */}

```bash
curl --silent --insecure https://<appliance-address>/healthz | jq '.gpus'
```

```bash hideClipboard title="Expected output"
[
  {
    "index": "0",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "29"
  },
  {
    "index": "1",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "30"
  }
]
```

Your output names your own GPUs, so the model names and the totals differ from the example.

Notice that `mem_used_mib` reads `0` on every GPU. Nothing is loaded yet. Remember this command, because we run it again
in **Watch the Weights Load** and the number changes.

:::info

We use `--insecure` because a freshly installed appliance presents a self-signed certificate. If your appliance has a
publicly trusted certificate, you can omit that flag.

:::

## Deploy a Model

Now we give those GPUs something to do.

1. In the console, select **Cluster** from the left main menu. The page opens on the **Nodes** tab.

2. Select the **Models** tab, and then select **Deploy New Model**. The **Deploy model** dialog opens.

3. Open the **Model** drop-down menu and select the smallest model your catalog offers.

   The catalog lists only models whose weights are already on a node in this appliance, so your list is specific to your
   hardware.

4. Leave **Engine** on **auto**.

5. In **Nodes**, select your node. On a first deploy, no node is selected, and **Deploy** stays unavailable until you
   choose one.

6. Select **Deploy**, review the preview, and then select **Confirm & Apply**.

The model appears in the **Model** table. Its state reads `deploying` or `smoke-testing` while the appliance brings it
up.

:::info

The appliance writes nothing until you select **Confirm & Apply**. For the stages a model passes through on its way to
serving, refer to [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

:::

## Watch the Weights Load

Loading model weights onto a GPU takes a few minutes. Rather than wait, we watch it happen. Run the same command from
**Ask the Appliance About Its GPUs** again.

```bash
curl --silent --insecure https://<appliance-address>/healthz | jq '.gpus'
```

```bash hideClipboard title="Expected output"
[
  {
    "index": "0",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "30"
  },
  {
    "index": "1",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "88110",
    "mem_total_mib": "97887",
    "temp_c": "39"
  }
]
```

Notice that `mem_used_mib` is climbing on one GPU, and that its `temp_c` has risen with it. Those are your model weights
arriving on the card. Run the command a few more times. Watching the number settle is the clearest sign that the
appliance is doing what you asked.

Now return to the console and confirm the model finished. In the **Model** table on the **Cluster** page, the **Nodes**
column reports the one node you chose out of however many nodes your cluster has, with a `1/1 healthy` chip, and the
model's state reads `ready` or `serving`.

Wait for that state before you continue. The next step offers only models that have finished loading.

## Create a Client and Its API Token

Claude Code needs a credential, and a credential belongs to a client. We create both here, and tell the appliance which
model answers the requests this client sends.

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. Select **Add client**. The **Add client** wizard opens on the **Overview** step.

3. Enter `coding-agent` as the **Client name**, and then select **Next step**.

4. On the **Quotas** step, select **Next step** without adding a limit.

5. On the **Egress** step, select **Next step** without enabling egress. Every request in this tutorial is answered on
   the appliance, so this client never needs to reach an external model.

6. On the **Routing** step, set the `claude-opus-`, `claude-sonnet-`, and `claude-haiku-` rows in the **Tier map** to
   the model you deployed in **Deploy a Model**.

   Claude Code asks for a different alias depending on the kind of work it is doing. Here we send all three to your one
   model. For how the appliance turns an alias into a model, refer to
   [Routing Behavior](../explanation/routing-behavior.md).

7. On the **API tokens** step, select **Add API Token**. In the **Add API token** dialog, enter `tutorial` as the
   **Label**, set **Expires** to a date a few days from now, and then select **Add Token**. A tutorial token should be
   short-lived.

8. Select **Create client**.

9. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

   :::warning

   The console displays the token once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
   create a new one.

   :::

10. The configuration the console generates names a fourth alias, so we route that one as well. From the left main menu,
    select **Access & Policy**, select the `coding-agent` client to open its detail panel, and then select the
    **Routing** section. In the **Tier map**, select **Add alias rule**, enter `claude-fable-` as the **Alias prefix**,
    point it at the same model, and then save the client.

Notice that your new client now appears on the **Clients & API tokens** page under the name `coding-agent`. We look for
that name again at the end.

## Point Claude Code at the Appliance

Now we connect the two halves.

{/* TODO: other PAIIL pages spell this control Connect coding agent while the live console renders it Connect Coding Agent; align the other pages separately. */}

1. In the console, return to **Overview** and select **Connect Coding Agent**. The **Connect a coding agent** dialog
   opens.

2. Select the **Claude Code** tab, and then select your shell.

3. Select the copy button to copy the generated configuration.

4. In your terminal, paste the configuration and replace `<per-user-token>` with the token you copied in **Create a
   Client and Its API Token**.

The configuration the console generates begins with `export NODE_TLS_REJECT_UNAUTHORIZED=0`, and goes on to set your
appliance address, your token, and the model alias for each tier. Each appliance advertises its own tier aliases, so
your values can differ from the following example. Use the block the console generated rather than the example.

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
export ANTHROPIC_BASE_URL=https://<appliance-address>
export ANTHROPIC_AUTH_TOKEN='<per-user-token>'
export ANTHROPIC_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5
export ANTHROPIC_DEFAULT_FABLE_MODEL=claude-fable-5
export CLAUDE_CODE_EFFORT_LEVEL=auto
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
```

Now confirm the connection with a single prompt.

{/* TODO: reference/known-issues.md still publishes that Anthropic model aliases return not served with no version scope, which contradicts this tutorial; confirm with an SME whether that entry is stale or needs version scoping. */}

```bash
claude --print "reply with exactly CC_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CC_OK
```

That reply came from your own hardware.

:::warning

`NODE_TLS_REJECT_UNAUTHORIZED=0` turns off certificate verification for this shell session, which a self-signed
appliance certificate requires. Delete that line if your appliance presents a publicly trusted certificate. Do not carry
it into day-to-day use.

:::

:::info

These variables last only as long as this terminal session. To keep them, refer to
[Use Claude Code](../how-to-guides/use-claude-code.md). If the reply is an authentication error, the token did not paste
correctly. If it is a `404`, an alias in **Create a Client and Its API Token** is not pointing at your model.

:::

## Ask a Question, and Then Ask Another

Now we give it real work.

Start Claude Code.

```bash
claude
```

Ask it a coding question, such as `what is the difference between a shallow copy and a deep copy?`

The model on your appliance answers. Ask a second question, and notice that the reply arrives the same way. This is the
loop you work in from now on.

Models differ in how well they drive a coding agent's tools, so a larger or coding-focused model gives better answers.
For the models certified for your hardware, refer to
[Certified Models by Hardware](../reference/certified-models-by-hardware.md).

Now we confirm the appliance counted it.

1. In the console, select **Usage** from the left main menu.

2. On the **Overview** tab, read the **Totals** card. Requests, input tokens, and output tokens have all risen from
   zero.

3. Find the **Local vs external** card. Every token is kept on the Launchpad, and the share routed externally reads zero
   tokens, because your appliance answered each request and no frontier model took part.

4. Select the **By Client** tab, and find the `coding-agent` client you named in **Create a Client and Its API Token**.
   Its row carries the tokens your two questions spent.

:::info

The **By Client** table is empty until at least one client accrues usage within the current quota window. This is
expected on a new appliance and is not an error.

:::

## What You Built

You deployed a model onto your own GPU, created a client and a token, routed four Claude aliases to that model, and had
Claude Code answer a coding question without a single request leaving the appliance. You also learned to read GPU memory
as a model loads, which is the quickest way to tell whether an appliance is busy.

## Next Steps

- To keep your Claude Code configuration between sessions, refer to
  [Use Claude Code](../how-to-guides/use-claude-code.md).

- For every configuration value Claude Code accepts, including the output-token ceiling, refer to
  [Claude Code Configuration](../reference/claude-code-reference.md).

- To carry out a specific task on the appliance, refer to the [How-to Guides](../how-to-guides/how-to-guides.md).

- To cap what a client can spend, refer to [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md).

- To let this client reach a frontier model when your own model is not enough, refer to
  [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md).

- To change how much a model reasons before it answers, refer to
  [Set the Thinking Directive for a Tier](../how-to-guides/set-tier-thinking.md).

- To understand how the appliance chooses a model for each request, refer to
  [Routing Behavior](../explanation/routing-behavior.md).

- To keep using Claude Code against the appliance after the `tutorial` token expires, mint a longer-lived one, as
  described in [Generate an API Token](../how-to-guides/generate-an-api-token.md).

- To revoke the `tutorial` token when you are finished, refer to
  [Revoke or Delete a Client](../how-to-guides/revoke-or-delete-a-client.md).
