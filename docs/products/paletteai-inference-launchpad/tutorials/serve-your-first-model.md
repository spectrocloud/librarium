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

- PaletteAI Inference Launchpad 1.1.5 or later. The version appears at the bottom of the left main menu. Anything
  earlier does not have the surfaces this tutorial uses. To upgrade, refer to
  [Upgrade the Platform](../how-to-guides/upgrade-the-platform.md).

- The console reachable in a browser at `https://<appliance-address>`, and the local admin account you set during setup.
  To install an appliance, refer to [Install the Appliance](../how-to-guides/install-the-appliance.md).

- At least one model on the appliance. To check, in the console open **Cluster** > **Models**. If the table lists a
  row, you have a deployed model.

  ![Cluster Models tab with a single row for qwen3.6-35b-a3b-fp8, showing 1 of 1 node and a 1 of 1 healthy chip.](/assets/docs/images/serve-your-first-model_cluster-models-deployed.webp)

  If the table is empty, select **Deploy New Model** and confirm the **Model** drop-down is not empty.

  ![The Deploy model dialog with the Model drop-down open, listing two available models.](/assets/docs/images/serve-your-first-model_deploy-model-dropdown.webp)

  If the drop-down is also empty, refer to [Upload a Model](../how-to-guides/upload-a-model.md).

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

## Download the Platform CA Certificate

Your appliance presents a certificate signed by its own platform Certificate Authority (CA). Your machine does not trust
that CA yet, so we download the certificate now and reach for it in every step that talks to the appliance.

1. On the **Overview** page, select **Connect Coding Agent**. The **Connect a coding agent** dialog opens.

2. Select the **Claude Code CLI** tab.

3. Select **CA certificate**. The browser saves `palette-ai-inference-launchpad-ca.crt` to your `Downloads` folder.

   ![The Connect a coding agent dialog with the CA certificate button highlighted.](/assets/docs/images/serve-your-first-model_ca-certificate-button.webp)

4. Close the dialog. We open it again in **Point Claude Code at the Appliance**.

## Ask the Appliance About Its GPUs

Before we change anything on the appliance, we get something back from it. Open a terminal and run the following
command, replacing `<appliance-address>` with your appliance address.

{/* TODO: confirm with an SME that /healthz is a supported surface the docs may document, and that publishing its response shape is acceptable. */}

```bash
curl --silent --cacert $HOME/Downloads/palette-ai-inference-launchpad-ca.crt https://<appliance-address>/healthz | jq '.gpus'
```

```bash hideClipboard title="Expected output"
[
  {
    "index": "0",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "29",
    "util_available": true,
    "mem_available": true
  },
  {
    "index": "1",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "30",
    "util_available": true,
    "mem_available": true
  }
]
```

Your output names your own GPUs, so the model names and the totals differ from the example.

Notice the `mem_used_mib` value on each GPU. Any GPU that reads `0` has nothing loaded. Remember this command, because
we run it again in **Watch the Weights Load** and the number changes.

## Deploy a Model

If a model is already deployed on your appliance, skip ahead to **Create a Client and Its API Token** and use that
model.

Now we give those GPUs something to do.

1. In the console, select **Cluster** from the left main menu. The page opens on the **Nodes** tab.

2. Select the **Models** tab, and then select **Deploy New Model**. The **Deploy model** dialog opens.

3. Open the **Model** drop-down menu and select a model that serves chat requests. A smaller model finishes loading
   sooner. A vision preprocessing sidecar is not a chat model, so do not choose one here.

   The catalog lists only models whose weights are already on a node in this appliance, so your list is specific to your
   hardware.

4. Leave **Engine** on **auto**.

5. In **Nodes**, select your node. On a first deploy, no node is selected, and **Deploy** stays unavailable until you
   choose one.

6. Select **Deploy**, review the preview, and then select **Confirm & Apply**.

The model appears in the **Model** table. Its state reads `deploying` or `smoke-testing` while the appliance brings it
up.

## Watch the Weights Load

Loading model weights onto a GPU takes a few minutes. Rather than wait, we watch it happen. Run the same command from
**Ask the Appliance About Its GPUs** again.

```bash
curl --silent --cacert $HOME/Downloads/palette-ai-inference-launchpad-ca.crt https://<appliance-address>/healthz | jq '.gpus'
```

```bash hideClipboard title="Expected output"
[
  {
    "index": "0",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "0",
    "mem_total_mib": "97887",
    "temp_c": "30",
    "util_available": true,
    "mem_available": true
  },
  {
    "index": "1",
    "name": "NVIDIA RTX PRO 6000 Blackwell Server Edition",
    "util_pct": "0",
    "mem_used_mib": "88110",
    "mem_total_mib": "97887",
    "temp_c": "39",
    "util_available": true,
    "mem_available": true
  }
]
```

Notice that `mem_used_mib` is climbing on one GPU, and that its `temp_c` has risen with it. Those are your model weights
arriving on the card. Run the command a few more times. Watching the number settle is the clearest sign that the
appliance is doing what you asked.

Now return to the console and confirm the model finished. In the **Model** table on the **Cluster** page, the **Nodes**
column reads `1/1 healthy` for the node you chose, and the model's state reads `ready` or `serving`.

Wait until the state reads `ready` or `serving` before you map an alias to the model. An alias pointed at a model that
is not yet serving cannot answer requests, so the verification later in this tutorial would fail.

## Create a Client and Its API Token

Claude Code needs a credential, and a credential belongs to a client. We create both here, and tell the appliance which
model answers the requests this client sends.

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. Select **Add Client**. The **Add client** wizard opens on the **Overview** step.

3. Enter `coding-agent` as the **Client name**, and then select **Next**.

4. On the **Quotas** step, select **Next** without adding a limit.

5. On the **Egress** step, select **Next** without enabling egress. Every request in this tutorial is answered on the
   appliance, so this client never needs to reach an external model.

6. On the **Routing** step, set every row in the **Tier map** to the model deployed on your appliance, and then select
   **Next**. The wizard requires every alias to be mapped before it lets you continue.

7. On the **API tokens** step, select **Add API Token**. In the **Add API token** dialog, enter `tutorial` as the
   **Label**, select a date within the next year in **Expires**, and then select **Add Token**.

8. Select **Create**.

9. When the console reveals the token, select the copy icon next to it. The token begins with `lpai_`.

   :::warning

   The console displays the token once and stores only a hash of it. Copy it now.

   :::

Notice that your new client now appears on the **Clients & API tokens** page under the name `coding-agent`. We look for
that name again at the end.

## Point Claude Code at the Appliance

Now we connect the two halves.

{/* TODO: other PAIIL pages spell this control Connect coding agent while the live console renders it Connect Coding Agent; align the other pages separately. */}

1. In the console, return to **Overview** and select **Connect Coding Agent**. The **Connect a coding agent** dialog
   opens.

2. Select the **Claude Code CLI** tab, and then select your shell.

3. Select the copy button to copy the generated configuration.

4. In your terminal, paste the configuration.

5. In the same terminal, export your API token. Replace `<per-user-token>` with the token you copied in **Create a
   Client and Its API Token**.

   ```bash
   export ANTHROPIC_AUTH_TOKEN=<per-user-token>
   ```

The configuration sets your appliance address, the platform CA certificate you downloaded in
**Download the Platform CA Certificate**, and the model alias for each tier. Each appliance advertises its own tier
aliases, so your values can differ from the following example. Use the block the console generated rather than the
example.

```bash
export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
export ANTHROPIC_BASE_URL=https://<appliance-address>
export ANTHROPIC_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-8
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-5
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

## Ask a Question, and Then Ask Another

Now we ask it a question.

Start Claude Code.

```bash
claude
```

Ask it a coding question, such as `what is the difference between a shallow copy and a deep copy?`

The model on your appliance answers. Ask a second question, and notice that the reply arrives the same way. This is the
loop you work in from now on.

## Monitor Your Token Usage

Now we confirm the appliance counted it.

1. In the console, select **Usage** from the left main menu.

2. On the **Overview** tab, read the **Totals** card. Requests, input tokens, and output tokens have all risen from
   zero.

3. Find the **Local vs external** card. Every token is kept on the Launchpad, and the share routed externally reads zero
   tokens, because your appliance answered each request and no frontier model took part.

4. Select the **By Client** tab, and find the `coding-agent` client you named in **Create a Client and Its API Token**.
   Its row carries the tokens your two questions spent.

## Change a Setting and Watch

Before you leave, change one setting and ask the same question again. This change cannot break anything you did.

Lower the output ceiling for this shell.

```bash
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=1024
```

Restart Claude Code and ask the same question again. The reply is shorter, because Claude Code stopped it earlier.

## What You Built

You created a client and an API token, routed the Tier map's aliases to a model on your appliance, and had Claude Code
answer a coding question using that model. You also watched the requests and tokens land under your client on the
**Usage** page.

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

- To follow the states a model passes through as it comes up, refer to
  [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

- To let the appliance answer questions about pasted screenshots, refer to
  [Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).
