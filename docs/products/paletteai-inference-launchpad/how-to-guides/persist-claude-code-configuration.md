---
sidebar_label: "Persist Claude Code Configuration"
title: "Persist Claude Code Configuration"
description:
  "Keep Claude Code connected to a PaletteAI Inference Launchpad appliance in new terminals, after a restart, and in
  IDEs and apps that you open from the Dock."
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
terminal where you set it up. [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md) connects one
terminal session. The steps here save that connection for new terminals, IDE extensions, and apps that you open from the
Dock.

Start with [Save the Configuration in a Settings File](#save-the-configuration-in-a-settings-file). Use the other
sections only for the cases they name. For what each method reaches, refer to
[Claude Code and Claude Desktop](../explanation/claude-apps.md#where-claude-code-reads-its-configuration). For what a
session on the appliance does not include, such as your claude.ai connectors, refer to
[What a Session on the Appliance Does Not Include](../explanation/claude-apps.md#what-a-session-on-the-appliance-does-not-include).

## Prerequisites

- Claude Code connected to the appliance in a terminal. To connect it, refer to
  [Use PaletteAI Inference Launchpad with Claude Code](./use-claude-code.md).

- The values from the **Claude Code CLI** tab of the **Connect a coding agent** panel.

- macOS with zsh, the default macOS shell, for every section except
  [Save the Configuration in a Settings File](#save-the-configuration-in-a-settings-file).

## Save the Configuration in a Settings File

To apply the configuration no matter how Claude Code starts, including from an IDE extension, save it in a Claude Code
settings file.

1. Choose the settings file.

   | **File**                                | **Applies to**                                                            |
   | --------------------------------------- | ------------------------------------------------------------------------- |
   | `~/.claude/settings.json`               | Every Claude Code session in every project and IDE window on this machine |
   | `<project>/.claude/settings.local.json` | Claude Code sessions in the `<project>` folder only                       |

   - To keep other projects and IDE windows on your Anthropic account, use the project file.

   - If the project is a Git repository, add `.claude/settings.local.json` to its `.gitignore` file so that you do not
     commit your token.

2. Open the file in a text editor, and add the following `env` block. Create the file if it does not exist. If the file
   already has settings, add the `env` key next to them. If it already has an `env` key, add the variables to it instead
   of adding a second `env` key.

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

   - Include the `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. Use the full path to
     the file.

   - To save another variable from the panel, such as `ANTHROPIC_MODEL`, add it to the `env` block.

   - Do not share or commit the file.

3. _(Optional)_ If the Claude Code extension for VS Code asks you to sign in, open the VS Code settings, search for
   `claudeCode.disableLoginPrompt`, and select its checkbox.

## Set the Variables for Non-Interactive Shells

To make the variables available to every zsh shell, including scripts and the shells that an IDE starts, add them to
`~/.zshenv` instead of `~/.zshrc`.

1. Open `~/.zshenv` in a text editor, and add the following lines. Create the file if it does not exist.

   ```bash
   export ANTHROPIC_BASE_URL=https://<appliance-host>
   export ANTHROPIC_AUTH_TOKEN=<lpai-token>
   export NODE_EXTRA_CA_CERTS=$HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   export CLAUDE_CODE_AUTO_MODE_SERVER=0
   ```

   Replace `<appliance-host>` with your appliance address and `<lpai-token>` with your API token. Include the
   `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step.

2. Open a new terminal, and confirm that the variable is set.

   ```bash
   echo $ANTHROPIC_BASE_URL
   ```

   ```bash hideClipboard title="Expected output"
   https://<appliance-host>
   ```

## Set the Variables for Apps Opened from the Dock

To make the variables available to IDEs and other apps that you open from Spotlight, Finder, or the Dock, set them with
`launchctl`.

1. Set each variable.

   ```bash
   launchctl setenv ANTHROPIC_BASE_URL https://<appliance-host>
   launchctl setenv ANTHROPIC_AUTH_TOKEN <lpai-token>
   launchctl setenv NODE_EXTRA_CA_CERTS $HOME/Downloads/palette-ai-inference-launchpad-ca.crt
   launchctl setenv CLAUDE_CODE_AUTO_MODE_SERVER 0
   ```

   Replace `<appliance-host>` with your appliance address and `<lpai-token>` with your API token. Include the
   `NODE_EXTRA_CA_CERTS` line only when the panel shows the **CA certificate** step. The commands print nothing when
   they succeed.

2. Confirm that the variable is set.

   ```bash
   launchctl getenv ANTHROPIC_BASE_URL
   ```

   ```bash hideClipboard title="Expected output"
   https://<appliance-host>
   ```

3. Quit each IDE that is already running with **CMD + Q**, not only its windows, and then open it again.

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
   your macOS user name. Remove the `NODE_EXTRA_CA_CERTS` command when the panel shows no **CA certificate** step. Do
   not share the file.

5. _(Optional)_ If you created the LaunchAgent file, load it.

   ```bash
   launchctl bootstrap gui/$UID ~/Library/LaunchAgents/local.launchpad-env.plist
   ```

   The command prints nothing when it succeeds.

## Trust the Platform CA in the macOS Keychain

_(Platform-issued certificate only)_ To let tools that do not read `NODE_EXTRA_CA_CERTS` trust the appliance, add the
platform CA certificate to your login keychain.

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
   curl --output /dev/null --silent --write-out '%{http_code}\n' https://<appliance-host>/v1/models
   ```

   Replace `<appliance-host>` with your appliance address.

   ```bash hideClipboard title="Expected output"
   401
   ```

   If the command reports a certificate error, repeat step 1.

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

5. In your IDE, open a new integrated terminal, and repeat steps 2 - 4.

## Switch Back to Your Anthropic Account

1. In the settings file that you edited, remove the variables that you added from the `env` key. If the `env` key is
   then empty, remove it. If the file holds nothing else, delete the file.

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

6. In VS Code, open the Command Palette with **CMD + SHIFT + P**, and run **Developer: Reload Window**. If you removed
   lines from `~/.zshenv` or removed `launchctl` variables, quit VS Code with **CMD + Q** and open it again instead. If
   you removed `launchctl` variables, also quit your terminal app with **CMD + Q** and open it again.

7. In VS Code, start a new Claude Code conversation, and run `/status`. Confirm that the **Anthropic base URL** line no
   longer shows your appliance address.

8. Open a new terminal, start Claude Code, and run `/status`. Confirm that the **Anthropic base URL** line no longer
   shows your appliance address.

## Next Steps

To connect the Claude Desktop app to the appliance, refer to
[Use PaletteAI Inference Launchpad with Claude Desktop](./use-claude-desktop.md). To look up each variable, refer to
[Claude Code Configuration](../reference/claude-code-reference.md).
