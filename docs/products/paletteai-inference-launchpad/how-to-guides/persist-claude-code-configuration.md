---
sidebar_label: "Persist Claude Code Configuration"
title: "Persist Claude Code Configuration"
description:
  "Keep Claude Code connected to a PaletteAI Inference Launchpad appliance in new terminals, after a restart, and in
  IDEs and apps that you start outside a terminal."
hide_table_of_contents: false
sidebar_position: 9.1
tags: ["paletteai-inference-launchpad", "claude-code", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "claude code",
    "settings.json",
    "settings.local.json",
    "zshenv",
    "launchctl",
    "keychain",
    "vs code",
    "ide",
  ]
---

This guide explains how to keep Claude Code connected to a PaletteAI Inference Launchpad appliance after you close the
terminal. The steps save the connection for new terminals, integrated development environment (IDE) extensions, and apps
that you start outside a terminal.

Start with [Save the Configuration in a Settings File](#save-the-configuration-in-a-settings-file). Use the other
sections only for the cases they name. For what each method reaches, refer to
[Where Claude Code Reads Its Configuration](../explanation/claude-code-sessions.md#where-claude-code-reads-its-configuration).
For what a session on the appliance does not include, such as your claude.ai connectors, refer to
[What a Session on the Appliance Does Not Include](../explanation/claude-code-sessions.md#what-a-session-on-the-appliance-does-not-include).

## Prerequisites

- Claude Code connected to the appliance in a terminal. To connect it, refer to
  [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md).

- The values from the **Claude Code CLI** tab of the **Connect a coding agent** panel.

- macOS. The [Set the Variables for Non-Interactive Shells](#set-the-variables-for-non-interactive-shells) section also
  needs `zsh`, the default macOS shell.

## Save the Configuration in a Settings File

To apply the configuration no matter how Claude Code starts, including from an IDE extension, save it in a Claude Code
settings file.

1. Choose the settings file. For the difference between the files, refer to
   [Claude Code Settings Files](../explanation/claude-code-sessions.md#claude-code-settings-files).

   - If you use Claude Code only with the appliance, use the user file, `~/.claude/settings.json`.

   - If you also use Claude Code with your Anthropic account, use the project file,
     `<project>/.claude/settings.local.json`. Add `.claude/settings.local.json` to the project's `.gitignore` file.

2. Open the file in a text editor, or create it if it does not exist. Add the following `env` block at the top level of
   the file, next to any other settings.

   ```json
   {
     "env": {
       "ANTHROPIC_BASE_URL": "https://<appliance-host>",
       "ANTHROPIC_AUTH_TOKEN": "<lpai-token>",
       "NODE_EXTRA_CA_CERTS": "/Users/<username>/Downloads/palette-ai-inference-launchpad-ca.crt",
       "CLAUDE_CODE_AUTO_MODE_SERVER": "0"
     }
   }
   ```

   Replace `<appliance-host>` with your appliance address, `<lpai-token>` with your API token, and `<username>` with
   your macOS user name.

   - If the file already has an `env` key, add the variables to it instead of adding a second one.

   - Do not add the variables to the `environment` key inside `autoMode`.

   - Include the `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. Use the full path to
     the file.

   - To save another variable from the panel, such as `ANTHROPIC_MODEL`, add it to the `env` block.

   - Do not share or commit the file.

3. _(Optional)_ If the Claude Code extension for VS Code asks you to sign in, open the VS Code settings, search for
   `claudeCode.disableLoginPrompt`, and select its checkbox.

## Set the Variables for Non-Interactive Shells

To make the variables available to every `zsh` shell, including scripts and the shells that an IDE starts, add them to
`~/.zshenv` instead of `~/.zshrc`.

1. Open `~/.zshenv` in a text editor, or create it if it does not exist. Add the following lines.

   ```bash
   export ANTHROPIC_BASE_URL="https://<appliance-host>"
   export ANTHROPIC_AUTH_TOKEN="<lpai-token>"
   export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export CLAUDE_CODE_AUTO_MODE_SERVER=0
   ```

   Replace `<appliance-host>` with your appliance address and `<lpai-token>` with your API token. Include the
   `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. To save another variable from the
   panel, add another `export` line. Do not share the file.

2. Open a new terminal, and confirm that `ANTHROPIC_BASE_URL` is set.

   ```bash
   echo $ANTHROPIC_BASE_URL
   ```

   ```bash hideClipboard title="Expected output"
   https://<appliance-host>
   ```

## Set the Variables for Apps Opened Outside a Terminal

To make the variables available to IDEs and other apps that you open from Spotlight, Finder, or the Dock, set them with
`launchctl`.

1. Set each variable.

   ```bash
   launchctl setenv ANTHROPIC_BASE_URL "https://<appliance-host>"
   launchctl setenv ANTHROPIC_AUTH_TOKEN "<lpai-token>"
   launchctl setenv NODE_EXTRA_CA_CERTS $HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   launchctl setenv CLAUDE_CODE_AUTO_MODE_SERVER 0
   ```

   Replace `<appliance-host>` with your appliance address and `<lpai-token>` with your API token. Include the
   `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. To save another variable from the
   panel, add another `launchctl setenv` command. The commands print nothing when they succeed.

2. Confirm that `ANTHROPIC_BASE_URL` is set.

   ```bash
   launchctl getenv ANTHROPIC_BASE_URL
   ```

   ```bash hideClipboard title="Expected output"
   https://<appliance-host>
   ```

3. _(Optional)_ If an IDE is already running, quit the whole app with **CMD + Q**, not only its windows. Then open the
   IDE again.

4. _(Optional)_ To set the variables again after each restart, save the following file as
   `~/Library/LaunchAgents/local.launchpad-env.plist`.

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
     <key>Label</key>
     <string>local.launchpad-env</string>
     <key>ProgramArguments</key>
     <array>
       <string>/bin/sh</string>
       <string>-c</string>
       <string>launchctl setenv ANTHROPIC_BASE_URL https://<appliance-host>; launchctl setenv ANTHROPIC_AUTH_TOKEN <lpai-token>; launchctl setenv NODE_EXTRA_CA_CERTS /Users/<username>/Downloads/palette-ai-inference-launchpad-ca.crt; launchctl setenv CLAUDE_CODE_AUTO_MODE_SERVER 0</string>
     </array>
     <key>RunAtLoad</key>
     <true/>
   </dict>
   </plist>
   ```

   Replace `<appliance-host>` with your appliance address, `<lpai-token>` with your API token, and `<username>` with
   your macOS user name. Include a `launchctl setenv` command for each variable that you set in step 1. Remove the
   `NODE_EXTRA_CA_CERTS` command when the panel shows no **CA certificate** step. Do not share the file.

5. _(Optional)_ If you created the LaunchAgent file, load it.

   ```bash
   launchctl bootstrap gui/$UID ~/Library/LaunchAgents/local.launchpad-env.plist
   ```

   The command prints nothing when it succeeds.

## Trust the Platform CA in the macOS Keychain

If the panel shows the **CA certificate** step and you use tools that do not read `NODE_EXTRA_CA_CERTS`, add the
platform Certificate Authority (CA) certificate to your login keychain.

1. Add the certificate. If macOS asks you to authenticate, approve the prompt.

   {/* Vale is off for this block because the security command has no long-form flags. */}

   <!-- vale off -->

   ```bash
   security add-trusted-cert -r trustRoot -k ~/Library/Keychains/login.keychain-db $HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   ```

   <!-- vale on -->

   The command prints nothing when it succeeds.

2. Confirm that macOS trusts the appliance.

   ```bash
   curl --output /dev/null --silent --show-error --write-out '%{http_code}\n' https://<appliance-host>/v1/models
   ```

   Replace `<appliance-host>` with your appliance address.

   ```bash hideClipboard title="Expected output"
   401
   ```

   A `401` status code means that macOS trusts the appliance certificate. If the command prints a certificate error
   instead, confirm that the certificate path in step 1 points to the file that you downloaded, and run step 1 again.

## Verify the Configuration

1. Open a new terminal. If you used the project file, change to the project folder.

2. Start Claude Code.

   ```bash
   claude
   ```

3. Run `/status`, and check that the **Anthropic base URL** line shows your appliance address.

   ```bash hideClipboard title="Expected output"
   Auth token:                 ANTHROPIC_AUTH_TOKEN
   Anthropic base URL:         https://<appliance-host>
   ```

4. Exit with `/exit`.

5. _(Optional)_ If you use Claude Code in an IDE, open a new integrated terminal in the IDE, and repeat steps 2 - 4.

## Switch Back to Your Anthropic Account

1. In the settings file that you edited, remove the variables that you added to the `env` key. If the `env` key is then
   empty, remove it. If the file holds nothing else, delete the file.

2. _(Optional)_ If you added the variables to `~/.zshenv`, remove those lines.

3. _(Optional)_ If you set the variables with `launchctl`, remove them.

   ```bash
   launchctl unsetenv ANTHROPIC_BASE_URL
   launchctl unsetenv ANTHROPIC_AUTH_TOKEN
   launchctl unsetenv NODE_EXTRA_CA_CERTS
   launchctl unsetenv CLAUDE_CODE_AUTO_MODE_SERVER
   ```

   The commands print nothing when they succeed.

4. _(Optional)_ If you created the LaunchAgent file, remove it.

   ```bash
   launchctl bootout gui/$UID/local.launchpad-env
   rm ~/Library/LaunchAgents/local.launchpad-env.plist
   ```

   The commands print nothing when they succeed.

5. _(Optional)_ If you selected the `claudeCode.disableLoginPrompt` checkbox, open the VS Code settings, search for
   `claudeCode.disableLoginPrompt`, and clear its checkbox.

6. _(Optional)_ If you use Claude Code in an IDE, quit the IDE with **CMD + Q**, and open it again.

7. _(Optional)_ If you removed `launchctl` variables, quit your terminal app with **CMD + Q**, and open it again.

8. Open a new terminal, start Claude Code, and run `/status`. Confirm that the **Anthropic base URL** line no longer
   shows your appliance address.

9. _(Optional)_ If you use Claude Code in an IDE, open a new integrated terminal in the IDE, and repeat step 8.

## Next Steps

To look up each variable, refer to [Claude Code Configuration](../reference/claude-code-reference.md).
