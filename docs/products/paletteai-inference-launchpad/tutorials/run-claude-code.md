---
sidebar_label: "Run Claude Code"
title: "Run Claude Code on Your Own Hardware"
description:
  "A hands-on tutorial that takes you from a freshly installed PaletteAI Inference Launchpad appliance to a Claude Code
  session answered by a model on your own hardware."
hide_table_of_contents: false
sidebar_position: 1
toc_max_heading_level: 2
tags: ["paletteai-inference-launchpad", "claude-code", "tutorial"]
keywords: ["launchpad", "ai", "claude code", "anthropic", "coding agent", "tutorial", "first model", "api token"]
---

In this tutorial, you deploy a model to a PaletteAI Inference Launchpad appliance and connect Claude Code to it. When
you finish, a model on your appliance answers the coding questions you send from Claude Code. Along the way, you learn
about the model catalog, GPU memory, clients, API tokens, and alias routing.

You work in two places:

- The console in a browser, where you deploy the model and create the client.
- A terminal on your machine, where you watch the appliance and run Claude Code. Any directory works.

Set aside about 20 minutes. The appliance spends most of that time loading model weights onto a GPU. Your first result
appears about one minute in.

## What You Need

Confirm each of the following before you start. Every item is something you can check in a few seconds, and stopping now
is faster than stopping at **Create a Client and Its API Token**.

On the appliance:

- PaletteAI Inference Launchpad 1.1.5 or later. To check, in the console look at the bottom of the left main menu.
  Anything earlier does not have the surfaces this tutorial uses. To upgrade, refer to
  [Upgrade the Platform](../how-to-guides/upgrade-the-platform.md).

- The console reachable in a browser at `https://<appliance-address>`.

- The local admin account you set during setup.

- At least one model on the appliance. To check, in the console open **Cluster** > **Models**. If the table lists a row,
  you have a deployed model.

  ![Cluster Models tab with a single row for qwen3.6-35b-a3b-fp8, showing 1 of 1 node and a 1 of 1 healthy chip.](/assets/docs/images/run-claude-code_cluster-models-deployed.webp)

  If the table is empty, select **Deploy New Model**, confirm the **Model** drop-down is not empty, and then select
  **Cancel**. You deploy the model later in **Deploy a Model**.

  ![The Deploy model dialog with the Model drop-down open, listing two available models.](/assets/docs/images/run-claude-code_deploy-model-dropdown.webp)

  If the drop-down is also empty, refer to [Upload a Model](../how-to-guides/upload-a-model.md).

On your own machine:

- Claude Code, installed and already working against Anthropic's hosted API. For installation, refer to the
  [Claude Code documentation](https://docs.claude.com/en/docs/claude-code).

- A terminal, with `curl` and `jq` available.

- Network access to the appliance address. If the console loads in your browser, your terminal can reach it too.

## Sign In to the Console

First, open `https://<appliance-address>` in a browser and sign in with your admin account.

The **Overview** page opens. Notice the status indicator near the top of the page. On a healthy appliance it reads
`all clear`, which means the appliance has nothing waiting on you.

![Overview page with the all clear status indicator near the top.](/assets/docs/images/run-claude-code_overview-all-clear.webp)

Keep this browser tab open.

## Download the Platform CA Certificate

Your appliance presents a certificate signed by its own platform Certificate Authority (CA). Your machine does not trust
that CA yet, so you download the certificate now and reach for it in every step that talks to the appliance.

1. On the **Overview** page, select **Connect Coding Agent**. The **Connect a coding agent** dialog opens.

2. Select the **Claude Code CLI** tab.

3. Select **CA certificate**. The browser saves `palette-ai-inference-launchpad-ca.crt` to your `Downloads` folder.

   ![The Connect a coding agent dialog with the CA certificate button highlighted.](/assets/docs/images/run-claude-code_ca-certificate-button.webp)

4. Close the dialog. You open it again in **Point Claude Code at the Appliance**.

## Ask the Appliance About Its GPUs

Before you change anything on the appliance, read something from it. Open a terminal and run the following command,
replacing `<appliance-address>` with your appliance address.

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
you run it again in **Watch the Weights Load** and the number changes.

## Deploy a Model

If a model is already deployed on your appliance, skip ahead to **Create a Client and Its API Token** and use that
model.

Give those GPUs something to do.

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

The model appears in the **Model** table. Its state reads `Deploying` while the appliance brings it up.

## Watch the Weights Load

Loading model weights onto a GPU takes a few minutes. Rather than wait, watch it happen. Run the same command from **Ask
the Appliance About Its GPUs** again.

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

Now return to the console and confirm that the model finished. In the **Model** table on the **Cluster** page, the **Nodes**
column reads `1/1 healthy` for the node you chose, and the model's state reads `Ready`.

![Cluster Models tab with the deployed model row expanded, showing the Ready state chip, a 1 of 1 healthy Health chip, and VRAM usage.](/assets/docs/images/run-claude-code_model-ready.webp)

Wait until the state reads `Ready` before you map an alias to the model. An alias pointed at a model that is not yet
serving cannot answer requests, so the verification later in this tutorial would fail.

## Create a Client and Its API Token

Claude Code needs a credential, and a credential belongs to a client. Create both here, and tell the appliance which
model answers the requests this client sends.

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. Select **Add Client**. The **Add client** wizard opens on the **Overview** step.

3. Enter `coding-agent` as the **Client name**, and then select **Next**.

4. On the **Quotas** step, select **Next** without adding a limit.

5. On the **Egress** step, select **Next** without enabling egress. Every request in this tutorial is answered on the
   appliance, so this client never needs to reach an external model.

6. On the **Routing** step, set every row in the **Tier map** to the model deployed on your appliance, and then select
   **Next**. The wizard requires every alias to be mapped before it lets you continue.

   ![Routing step with all seven Tier map rows mapped to the deployed model.](/assets/docs/images/run-claude-code_routing-mapped.webp)

7. On the **API tokens** step, select **Add API Token**. In the **Add API token** dialog, enter `tutorial` as the
   **Label**, select a date within the next year in **Expires**, and then select **Add Token**.

8. Select **Create**.

9. The console reveals the token, which begins with `lpai_`.

   ![Client coding-agent created modal with the API tokens section expanded, showing the tutorial token and a Connect Agent button.](/assets/docs/images/run-claude-code_token-reveal.webp)

   :::warning

   The console shows the token once and stores only a hash. Keep this modal open until you finish **Point Claude Code at
   the Appliance**.

   :::

10. In the same modal, select **Connect Agent**. The coding-agent setup expands inline.

## Point Claude Code at the Appliance

Now connect the two halves.

{/* TODO: other PAIIL pages spell this control Connect coding agent while the live console renders it Connect Coding Agent; align the other pages separately. */}

1. Select your shell from the dropdown at the top of the code block. Then select the copy button to copy the
   configuration.

   ![The coding-agent setup with the shell picker and the copy button highlighted at the top of the code block.](/assets/docs/images/run-claude-code_shell-picker.webp)

2. In your terminal, paste the configuration. Any directory works.

3. In the panel, select the copy button next to the `export ANTHROPIC_AUTH_TOKEN=...` line. In your terminal, paste it.
   The panel fills in your real token, so nothing needs replacing.

{/* TODO: reference/known-issues.md still publishes that Anthropic model aliases return not served with no version scope, which contradicts this tutorial; confirm with an SME whether that entry is stale or needs version scoping. */}

4. Start Claude Code.

   ```bash
   claude
   ```

5. In Claude Code, run `/status` and check that the **Anthropic base URL** line points at your appliance address.

   ```bash hideClipboard title="Expected output"
   Settings  Status   Config   Usage   Stats

   Auth token:                 ANTHROPIC_AUTH_TOKEN
   Anthropic base URL:         https://<appliance-address>
   Additional CA cert(s):      $HOME/Downloads/palette-ai-inference-launchpad-ca.crt

   Model:                      claude-opus-4-8
   ```

## Ask a Question, and Then Ask Another

1. In your Claude Code session, ask a coding question, such as
   `what is the difference between a shallow copy and a deep copy?` The model on your appliance answers. That reply came
   from your own hardware.

2. Ask a second question, such as `what is the difference between a stack and a queue?` The reply arrives the same way.
   This is the loop you work in from now on.

## Monitor Your Token Usage

Now confirm that the appliance counted it.

1. In the console, select **Usage** from the left main menu.

2. On the **Overview** tab, read the **Totals** card. Requests, input tokens, and output tokens have all risen from
   zero.

3. Find the **Local vs external** card. Every token is kept on the Launchpad, and the share routed externally reads zero
   tokens, because your appliance answered each request and no frontier model took part.

   ![Usage Overview tab with the Totals card showing requests and tokens risen from zero, and the Local vs external card showing 100 percent kept on the Launchpad.](/assets/docs/images/run-claude-code_usage-overview.webp)

4. Select the **By Client** tab, and find the `coding-agent` client you named in **Create a Client and Its API Token**.
   Its row carries the tokens your two questions spent.

   ![Usage By Client tab with a coding-agent row showing 1 API key, 3 local requests, and 86.9K local tokens.](/assets/docs/images/run-claude-code_usage-by-client.webp)

## Change a Setting and Watch

Before you leave, change one setting and ask the same question again. This change cannot break anything you did.

1. In your Claude Code session, exit with `/exit`.

2. In the same terminal, lower the output ceiling.

   ```bash
   export CLAUDE_CODE_MAX_OUTPUT_TOKENS=1024
   ```

3. Start Claude Code again.

   ```bash
   claude
   ```

4. Ask the shallow-copy-vs-deep-copy question again. The reply is shorter, because Claude Code stopped it earlier.

## What You Built

You downloaded the platform CA certificate, created a client and its API token, routed the Tier map's aliases to a model
on your appliance, and had Claude Code answer coding questions using that model. You watched the requests and tokens
land under your client on the **Usage** page, and saw the output ceiling take effect when you lowered it.

## Clean Up

Undo the changes the tutorial made.

1. In your Claude Code session, exit with `/exit`.

2. In the same terminal, unset the tutorial's environment variables.

   ```bash
   unset NODE_EXTRA_CA_CERTS
   unset ANTHROPIC_BASE_URL
   unset ANTHROPIC_AUTH_TOKEN
   unset ANTHROPIC_MODEL
   unset ANTHROPIC_DEFAULT_OPUS_MODEL
   unset ANTHROPIC_DEFAULT_SONNET_MODEL
   unset ANTHROPIC_DEFAULT_HAIKU_MODEL
   unset ANTHROPIC_DEFAULT_FABLE_MODEL
   unset CLAUDE_CODE_EFFORT_LEVEL
   unset CLAUDE_CODE_MAX_OUTPUT_TOKENS
   ```

3. Remove the platform CA certificate.

   <Tabs groupId="shell">

   <TabItem label="bash / zsh" value="unix">

   ```bash
   rm $HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   ```

   </TabItem>

   <TabItem label="PowerShell" value="windows">

   ```powershell
   Remove-Item $env:USERPROFILE\Downloads\palette-ai-inference-launchpad-ca.crt
   ```

   </TabItem>

   </Tabs>

4. From the left main menu, select **Access & Policy**.

5. On the **Clients & API tokens** page, find the `coding-agent` row and select the three-dot menu at the end of the
   row.

   ![Clients and API tokens page with the three-dot menu at the end of the coding-agent row highlighted.](/assets/docs/images/run-claude-code_three-dot-menu.webp)

6. Select **Delete** and confirm.

   <img
     src="/assets/docs/images/run-claude-code_delete-menu.webp"
     alt="The three-dot menu open showing Manage Client and Delete options."
     width="220"
   />

## Next Steps

- To cap what a client can spend, refer to [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md).

- To let this client reach a frontier model when your own model is not enough, refer to
  [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md).

- To carry out a specific task on the appliance, refer to the [How-to Guides](../how-to-guides/how-to-guides.md).
