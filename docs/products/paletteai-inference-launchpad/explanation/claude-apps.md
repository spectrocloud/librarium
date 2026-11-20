---
sidebar_label: "Claude Code and Claude Desktop"
title: "Claude Code and Claude Desktop"
description:
  "How Claude Code and the Claude Desktop app each reach a PaletteAI Inference Launchpad appliance, where each reads its
  configuration, and what a session on the appliance does not include."
hide_table_of_contents: false
sidebar_position: 8.5
tags: ["paletteai-inference-launchpad", "explanation", "claude-code", "claude-desktop"]
keywords:
  [
    "launchpad",
    "ai",
    "claude code",
    "claude desktop",
    "ide",
    "vs code",
    "environment variables",
    "auto mode",
    "connectors",
  ]
---

Claude Code and the Claude Desktop app can both send their requests to a PaletteAI Inference Launchpad appliance. They
read their configuration from different places, so a setup that works for one does nothing for the other. This page
explains where each app reads its configuration, why a setup in one terminal does not reach your IDE, and what a session
on the appliance does not include.

## Two Apps, Two Configurations

Claude Code is the coding agent that you run as the `claude` command in a terminal or through its extensions for VS Code
and JetBrains IDEs. Claude Desktop is a separate chat app with **Chat**, **Cowork**, and **Code** tabs.

| **Question**                                  | **Claude Code**                                                                                                                                       | **Claude Desktop**                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Where you set the appliance address and token | The `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` environment variables, in a shell or in a Claude Code settings file                               | The **Configure Third-Party Inference** form, which appears after you enable Developer Mode |
| How it trusts a platform-issued certificate   | The `NODE_EXTRA_CA_CERTS` environment variable                                                                                                        | The macOS Keychain                                                                          |
| Setup guide                                   | [Use Claude Code](../how-to-guides/use-claude-code.md) and [Persist Claude Code Configuration](../how-to-guides/persist-claude-code-configuration.md) | [Use Claude Desktop](../how-to-guides/use-claude-desktop.md)                                |

Claude Desktop does not read `ANTHROPIC_BASE_URL` or `NODE_EXTRA_CA_CERTS`. Setting those variables leaves Claude
Desktop on your Anthropic account, and filling in the Desktop form leaves Claude Code in your terminal and IDE
unchanged.

## Where Claude Code Reads Its Configuration

The **Connect a coding agent** panel gives you `export` lines for one terminal session. Those variables reach only the
programs that you start from that terminal.

- A new terminal, or the same terminal after a restart, starts without them.

- zsh reads `~/.zshrc` only for interactive shells. Scripts and other non-interactive shells skip it.

- On macOS, apps that you open from Spotlight, Finder, or the Dock do not inherit the exports in `~/.zshrc`. The Claude
  Code extension for VS Code and JetBrains IDEs runs the `claude` command, so an IDE opened this way starts Claude Code
  without your exports. Claude Code then sends its requests to Anthropic's API instead of the appliance.

Each persistence method reaches a different set of programs.

| **Method**                                 | **What it reaches**                                                                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env` block in a Claude Code settings file | Claude Code no matter how it starts, including from an IDE extension. It affects no other program.                                                    |
| `~/.zshenv`                                | Every zsh shell, including scripts and the shells that an IDE starts.                                                                                 |
| `launchctl setenv`                         | Apps that you open from Spotlight, Finder, or the Dock on macOS, until the next restart. A LaunchAgent file sets the variables again at each sign-in. |
| macOS Keychain                             | Certificate trust for tools that do not read `NODE_EXTRA_CA_CERTS`.                                                                                   |

The settings file is the recommended default. The user file, `~/.claude/settings.json`, switches every Claude Code
session on the machine to the appliance, including IDE windows that you want to keep on your Anthropic account. A
project file, `<project>/.claude/settings.local.json`, holds the same `env` block but applies only to that project
folder. A settings file, `~/.zshenv`, and a LaunchAgent file each store your token in plain text.

An IDE that is already running keeps the environment that it started with. It picks up `launchctl` changes only after
you quit it fully and open it again.

## Tool Coverage

The following table shows how common tools reach the appliance.

| **Tool**                                                         | **How it reaches the appliance**                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Claude Code in a terminal                                        | Environment variables or a Claude Code settings file.                                                 |
| Claude Code extension for VS Code or JetBrains IDEs              | The same configuration as Claude Code in a terminal, because the extension runs the `claude` command. |
| Third-party AI extensions, such as Cline, Continue, and Roo Code | The base URL and certificate settings in the extension's own settings panel.                          |
| Claude models built into Cursor, GitHub Copilot, or Windsurf     | None. You cannot point them at a self-hosted endpoint.                                                |
| Claude Desktop                                                   | The **Configure Third-Party Inference** form in Developer Mode.                                       |

Cursor's custom OpenAI endpoint is a separate path that does not use Cursor's built-in Claude models. For that path,
refer to [Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md).

## Auto Mode Safety Checks

In auto mode, Claude Code checks some actions, such as shell commands, before it runs them. Claude Code 2.1.278 and
later asks the API server to run these safety checks. The appliance does not run Anthropic's server-side safety checks.
Claude Code then falls back to its own checks, shows a warning, and holds the checked action until you answer it.

The `CLAUDE_CODE_AUTO_MODE_SERVER=0` setting makes Claude Code run its own checks from the start, so the warning does
not appear. The **Connect a coding agent** panel includes this setting in the Claude Code block. Claude Code sends its
check requests to the appliance, and the appliance counts them toward the client's quota.

## What a Session on the Appliance Does Not Include

A session on the appliance signs in with your `lpai_` token instead of your Anthropic account, so features tied to that
account are missing.

- In Claude Code, `/mcp` lists only the MCP servers configured on your machine. The claude.ai connectors that load when
  you sign in with your Anthropic account, such as Slack, Google Drive, and Atlassian, do not appear.

- In Claude Desktop, you lose access to the chats, artifacts, and projects in your Anthropic account.

To get the claude.ai connectors back in Claude Code, switch back to your Anthropic account. For the steps, refer to
[Switch Back to Your Anthropic Account](../how-to-guides/persist-claude-code-configuration.md#switch-back-to-your-anthropic-account).

## Next Steps

To keep Claude Code connected in new terminals and IDEs, refer to
[Persist Claude Code Configuration](../how-to-guides/persist-claude-code-configuration.md). To connect Claude Desktop,
refer to [Use PaletteAI Inference Launchpad with Claude Desktop](../how-to-guides/use-claude-desktop.md).
