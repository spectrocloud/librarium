---
sidebar_label: "Use OpenAI Codex"
title: "Use PaletteAI Inference Launchpad with OpenAI Codex"
description:
  "Connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model on the appliance serves
  every request."
hide_table_of_contents: false
sidebar_position: 11
tags: ["paletteai-inference-launchpad", "codex", "how-to"]
keywords: ["launchpad", "ai", "openai codex", "codex cli", "responses api", "config.toml", "api token"]
---

This guide explains how to connect the OpenAI Codex CLI to a PaletteAI Inference Launchpad appliance so that a model
running on the appliance serves every request instead of OpenAI's hosted API. You add a custom model provider to the
Codex configuration file and confirm the connection.

## Prerequisites

- The OpenAI Codex CLI installed and already working. For installation, refer to the
  [OpenAI Codex website](https://github.com/openai/codex).
- A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).
- An API token for the appliance. To create one, refer to [Generate an API Token](./generate-an-api-token.md), or use a
  token an administrator generated for you.
- The appliance reachable from your machine at an address whose TLS certificate your machine trusts. Codex validates TLS
  strictly and cannot skip certificate verification. If your machine does not yet trust the appliance certificate,
  complete [Trust the Appliance Certificate](#trust-the-appliance-certificate) first.

## Trust the Appliance Certificate

Codex validates TLS strictly and cannot skip certificate verification. Unless your organization supplied a certificate
when the appliance was installed, the appliance presents a certificate that its own root certificate authority (CA)
issues, and no public authority trusts that CA. Add the appliance root CA to your system trust store before you
configure Codex. If your machine already trusts the certificate the appliance presents, skip this section.

Your machine must also reach the appliance address over a VPN or from the same network, because step 1 opens an SSH
session to the node.

Each command below has a **Linux / macOS** tab (POSIX shell) and a **Windows** tab (PowerShell). Select the tab that
matches your machine.

1. Copy the appliance root CA to your machine. Replace `<user>` with an SSH user on the node and `<node-ip>` with the
   node's Host IP.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   mkdir -p ~/.codex
   ssh <user>@<node-ip> \
     "sudo kubectl --kubeconfig /etc/kubernetes/admin.conf --namespace cert-manager \
     get secret lab-root-ca --output jsonpath='{.data.tls\.crt}' | base64 --decode" \
     > ~/.codex/launchpad-ca.crt
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   New-Item -ItemType Directory -Force -Path $HOME\.codex | Out-Null
   ssh <user>@<node-ip> "sudo kubectl --kubeconfig /etc/kubernetes/admin.conf --namespace cert-manager get secret lab-root-ca --output jsonpath='{.data.tls\.crt}' | base64 --decode" | Out-File -Encoding ascii $HOME\.codex\launchpad-ca.crt
   ```

   </TabItem>

   </Tabs>

   The command writes the certificate to a file and prints no output. PowerShell writes UTF-16 by default, which
   produces a file no certificate tool can read, so the Windows command sets the encoding explicitly.

   If `sudo` on the node requires a password, the command fails with a `sudo: no tty present` error, because it opens no
   session for you to type one into. Open an SSH session to the node, run the same `sudo kubectl` command there, and
   save its output to `~/.codex/launchpad-ca.crt` on your machine.

2. Confirm the file holds a certificate.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   grep --max-count=1 "BEGIN CERTIFICATE" ~/.codex/launchpad-ca.crt
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   Get-Content $HOME\.codex\launchpad-ca.crt | Select-Object -First 1
   ```

   </TabItem>

   </Tabs>

   ```bash hideClipboard title="Expected output"
   -----BEGIN CERTIFICATE-----
   ```

   If the command prints nothing, the copy did not succeed. Confirm SSH and sudo access to the node, then run the copy
   command in step 1 again.

3. Trust the CA. This step runs once per machine.

   :::warning

   Trusting this root makes the appliance CA trusted for every host the machine connects to. Do this only on a machine
   you control, for an appliance you administer, and remove the certificate when you no longer need it, as described in
   [Remove the Certificate](#remove-the-certificate).

   :::

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   On macOS, add the certificate to the system keychain. The command prints no output.

   ```bash
   sudo security add-trusted-cert -d -r trustRoot \
     -k /Library/Keychains/System.keychain ~/.codex/launchpad-ca.crt
   ```

   On Debian and Ubuntu, copy the certificate into the system store and refresh it. On RHEL and its derivatives, copy it
   to `/etc/pki/ca-trust/source/anchors/` and run `sudo update-ca-trust` instead.

   ```bash
   sudo cp ~/.codex/launchpad-ca.crt /usr/local/share/ca-certificates/launchpad-ca.crt
   sudo update-ca-certificates
   ```

   ```bash hideClipboard title="Expected output"
   Updating certificates in /etc/ssl/certs...
   1 added, 0 removed; done.
   Running hooks in /etc/ca-certificates/update.d...
   done.
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   Run PowerShell as Administrator, because the machine-wide store is not writable otherwise.

   ```powershell
   Import-Certificate -FilePath $HOME\.codex\launchpad-ca.crt -CertStoreLocation Cert:\LocalMachine\Root
   ```

   ```powershell hideClipboard title="Expected output"
   PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\Root

   Thumbprint                                Subject
   ----------                                -------
   9F2A1C7B4D8E30561A2B3C4D5E6F70819A2B3C4D  CN=launchpad-ca
   ```

   </TabItem>

   </Tabs>

{/* NEEDS REVIEW: only the macOS path in step 3 is confirmed by the requester on a real appliance. The Debian, RHEL, and Windows trust-store commands and their sample output are written from each platform's standard mechanism and need verification, including whether Codex reads the platform trust store on Linux and Windows. The certificate subject shown in the Windows output varies by appliance. */}

### Remove the Certificate

When you no longer need the appliance CA, remove it from the trust store.

<Tabs groupId="os">

<TabItem label="Linux / macOS" value="unix">

On macOS, remove the trust setting. The command prints no output.

```bash
sudo security remove-trusted-cert -d ~/.codex/launchpad-ca.crt
```

On Debian and Ubuntu, delete the certificate and refresh the store. On RHEL and its derivatives, delete it from
`/etc/pki/ca-trust/source/anchors/` and run `sudo update-ca-trust` instead.

```bash
sudo rm /usr/local/share/ca-certificates/launchpad-ca.crt
sudo update-ca-certificates --fresh
```

</TabItem>

<TabItem label="Windows" value="windows">

Run PowerShell as Administrator. Replace `<thumbprint>` with the thumbprint reported when you imported the certificate.

```powershell
Remove-Item -Path Cert:\LocalMachine\Root\<thumbprint>
```

</TabItem>

</Tabs>

## Configure Codex

Codex uses the Responses API, so you add a custom model provider that points at the appliance. For a description of each
field, refer to [OpenAI Codex Configuration](../reference/codex-reference.md).

:::tip

The console can generate a starter version of this configuration for you. Select **Connect coding agent** and open the
**Codex** tab to copy a `config.toml` snippet pre-filled with your appliance's endpoint. Review the model and provider
values against the steps below before you save it.

:::

1. Add the following custom provider to the Codex configuration file at `~/.codex/config.toml`. Replace
   `<appliance-host>` with your appliance address.

   ```toml
   model = "glm-5.2"            # a model the appliance serves, not "auto"
   model_provider = "lpai"

   [model_providers.lpai]
   name = "Launchpad"
   base_url = "https://<appliance-host>/v1"
   env_key = "LPAI_KEY"
   wire_api = "responses"       # Codex uses the Responses API
   ```

   Set `model` to a model the appliance serves, such as `glm-5.2`. Do not use `auto`, because the Responses API passes
   the model straight to the engine. Set `base_url` to your appliance address with the `/v1` path appended. Keep
   `wire_api` set to `responses`; current Codex CLI releases support no other value.

2. Set the environment variable named in `env_key` to your API token so that Codex can authenticate. In this example,
   `env_key` is `LPAI_KEY`. Replace `<lpai-token>` with the token you copied.

   ```bash
   export LPAI_KEY=<lpai-token>
   ```

{/* NEEDS REVIEW: this guide says `model` must be a real served id (not an alias) because the Responses API passes the model straight to the engine, but the console's "Connect coding agent" > Codex snippet sets `model = "claude-opus-4-8"`, a tier-map alias. Confirm with an SME whether the tier map resolves aliases over the Responses API. */}

## Verify the Connection

Run a single prompt to confirm the appliance answers.

```bash
codex exec --skip-git-repo-check "reply with exactly CODEX_OK and nothing else"
```

```bash hideClipboard title="Expected output"
CODEX_OK
```

A reply confirms that the base URL, token, provider, and model routing all work. The `--skip-git-repo-check` flag lets
you run the test outside a git repository.

:::info

Codex may print a `Model metadata for glm-5.2 not found` warning. This warning is cosmetic and does not affect the
request.

:::

## Request Routing and Quotas

<PartialsComponent category="paletteai-inference-launchpad" name="request-routing-and-quotas" />

## Next Steps

To look up each configuration value, refer to [OpenAI Codex Configuration](../reference/codex-reference.md). To connect
a different coding tool, refer to [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md) or
[Use PaletteAI Inference Launchpad with Cursor](./use-cursor.md).
