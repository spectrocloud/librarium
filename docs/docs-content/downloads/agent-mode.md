---
sidebar_label: "Agent Mode Downloads"
title: "Agent Mode Downloads"
description: "Download links relating to agent mode."
hide_table_of_contents: false
sidebar_position: 50
sidebar_custom_props:
  icon: "users"
tags: ["downloads", "edge", "agent mode"]
---

The following sections provide links to download the agent mode installation scripts depending on your environment.

## Connected

This version of agent mode requires internet access on the host to connect to a Palette instance.

### Latest

Use the following command to download the latest version of the Palette agent installation script.

<PartialsComponent category="agent-mode" name="agent-mode-latest-version" />

### Versioned

<PartialsComponent category="agent-mode" name="agent-mode-versioned" />

## Airgap

This version of agent mode is designed for environments without direct internet access.

Download the airgap agent installation package and save it as a TAR file.

- Replace `<architecture>` with the architecture of your CPU. If you have ARM64, use `arm64`. If you have AMD64 or
  x86_64, use `amd64`.
- Replace `<version>` with the desired version number. Refer to
  [agent mode releases](https://github.com/spectrocloud/agent-mode/releases) for all the available releases.

<PartialsComponent category="agent-mode" name="agent-mode-airgap-version" />
