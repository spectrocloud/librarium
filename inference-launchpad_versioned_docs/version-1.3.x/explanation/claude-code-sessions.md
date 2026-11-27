---
sidebar_label: "Claude Code Sessions"
title: "Claude Code Sessions"
description:
  "Where Claude Code reads its PaletteAI Inference Launchpad configuration, which tools reach the appliance, how auto
  mode safety checks run, and what a session on the appliance does not include."
hide_table_of_contents: false
sidebar_position: 8.5
tags: ["paletteai-inference-launchpad", "explanation", "claude-code"]
keywords: ["launchpad", "ai", "claude code", "ide", "vs code", "environment variables", "auto mode", "connectors"]
---

Claude Code is a coding agent. You run it as the `claude` command in a terminal, or through its extensions for VS Code
and other integrated development environments (IDEs). It can send its requests to a PaletteAI Inference Launchpad
appliance instead of Anthropic's hosted API. This page explains where Claude Code reads its configuration and why a
setup in one terminal does not reach your IDE. It also covers which tools reach the appliance, how auto mode safety
checks run, and what a session on the appliance does not include.

## Where Claude Code Reads Its Configuration

The **Connect a coding agent** panel gives you `export` lines for one terminal session. Those variables reach only the
programs that you start from that terminal.

- A new terminal, or the same terminal after a restart, starts without them.

- If you add the `export` lines to `~/.zshrc`, only interactive `zsh` shells read them. Scripts and other
  non-interactive shells skip `~/.zshrc`.

- On macOS, apps that you open from Spotlight, Finder, or the Dock do not always inherit the exports in `~/.zshrc`. An
  IDE opened this way can start its Claude Code extension without them, so Claude Code sends its requests to Anthropic's
  hosted API instead of the appliance.

Each persistence method reaches a different set of programs. We recommend a Claude Code settings file as the default.

| **Method**                                 | **What it reaches**                                                                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env` block in a Claude Code settings file | Claude Code no matter how it starts, including from an IDE extension. It affects no other program.                                                       |
| `~/.zshenv`                                | Every `zsh` shell, including scripts and the shells that an IDE starts.                                                                                  |
| `launchctl setenv`                         | Apps that you open from Spotlight, Finder, or the Dock on macOS, until the next restart. A LaunchAgent file sets the variables again after each restart. |
| macOS Keychain                             | Certificate trust for tools that do not read `NODE_EXTRA_CA_CERTS`.                                                                                      |

An IDE that is already running keeps the environment that it started with. It picks up `launchctl` changes only after
you quit it fully and open it again.

### Claude Code Settings Files

Two of Claude Code's settings files work for this setup. Both hold the same `env` block, and each file applies to a
different set of sessions.

| **File**                                              | **Applies to**                                                            | **Use it when**                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| User file, `~/.claude/settings.json`                  | Every Claude Code session in every project and IDE window on this machine | You use Claude Code only with the appliance.                                                               |
| Project file, `<project>/.claude/settings.local.json` | Claude Code sessions in the `<project>` folder only                       | You also use Claude Code with your Anthropic account. Other projects and IDE windows stay on that account. |

The settings files, `~/.zshenv`, and the LaunchAgent file all store your token in plain text. A project file is inside
the project folder. If that folder is a Git repository, you might commit the file and your token by mistake. Listing
`.claude/settings.local.json` in the project's `.gitignore` file prevents that.

## Tool Coverage

The following table shows how common tools reach the appliance.

| **Tool**                                                         | **How it reaches the appliance**                                                             |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Claude Code in a terminal                                        | Environment variables or a Claude Code settings file.                                        |
| Claude Code extension for VS Code or JetBrains IDEs              | The same configuration as Claude Code in a terminal, because the extension runs Claude Code. |
| Third-party AI extensions, such as Cline, Continue, and Roo Code | The base URL and certificate settings in the extension's own settings panel.                 |
| Claude models built into Cursor, GitHub Copilot, or Windsurf     | None. You cannot point them at a self-hosted endpoint.                                       |

Cursor's **Override OpenAI Base URL** setting is a separate path that does not use Cursor's built-in Claude models. For
that path, refer to [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md).

## Auto Mode Safety Checks

In auto mode, Claude Code checks some actions, such as shell commands, before it runs them. By default, Claude Code asks
the API server to run these checks. The appliance does not run Anthropic's server-side safety checks, so Claude Code
falls back to its own checks, shows a warning, and holds the checked action until you respond.

The `CLAUDE_CODE_AUTO_MODE_SERVER=0` setting makes Claude Code run its own checks from the start. The warning then does
not appear. The **Connect a coding agent** panel includes this setting in the environment block on its **Claude Code
CLI** tab. To run its own checks, Claude Code sends check requests to the appliance. The appliance counts them toward
the client's quota.

## What a Session on the Appliance Does Not Include

A session on the appliance signs in with your `lpai_` token, not your Anthropic account. Features tied to that account
are missing. The `/mcp` command lists only the Model Context Protocol (MCP) servers configured on your machine. The
claude.ai connectors that load when you sign in with your Anthropic account, such as Slack, Google Drive, and Atlassian,
do not appear.

The claude.ai connectors load in Claude Code again after you switch back to your Anthropic account. For the steps, refer
to
[Switch Back to Your Anthropic Account](../how-to-guides/persist-claude-code-configuration.md#switch-back-to-your-anthropic-account).

## Next Steps

To keep Claude Code connected in new terminals and IDEs, refer to
[Persist Claude Code Configuration](../how-to-guides/persist-claude-code-configuration.md).
