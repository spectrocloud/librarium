---
sidebar_label: "Agent Mode"
title: "Agent Mode"
description: "Download links relating to agent mode."
hide_table_of_contents: false
sidebar_position: 50
sidebar_custom_props:
  icon: "users"
tags: ["downloads","edge","agent mode"]
---

The following sections provide links to download the agent mode installation scripts depending on your environment.

## Connected

This version of agent mode requires internet access on the host to connect to a Palette instance.

### Latest

Use the following command to download the latest version of the Palette agent installation script.

<Tabs groupId="FIPS">

<TabItem value="Non-FIPS">

```shell
curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
```

</TabItem>

<TabItem value="FIPS">

```shell
curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install-fips.sh
```

</TabItem>

</Tabs>

### Versioned

If you have a dedicated or on-premises instance of Palette, you need to identify the correct agent version and then download the corresponding version of the agent installation script.

1. Use the following command to identify the agent version for your Palette instance. Replace `<palette-endpoint>` with your Palette endpoint and `<api-key>` with your [Palette API key](../user-management/authentication/api-key/api-key.md).

   ```shell
   curl --location --request GET 'https://<palette-endpoint>/v1/services/stylus/version' --header 'Content-Type: application/json' --header 'Apikey: <api-key>'  | jq --raw-output '.spec.latestVersion.content | match("version: ([^\n]+)").captures[0].string'
   ```

   ```text hideClipboard title="Example output"
   4.5.0
   ```

2. Use the following command to download the version of the Palette agent for your dedicated or on-prem instance. Replace `<stylus-version>` with your output from the previous step.

   <Tabs groupId="FIPS">

   <TabItem value="Non-FIPS">

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install.sh
   ```

   </TabItem>

   <TabItem value="FIPS">

   ```shell
   curl --location --output ./palette-agent-install-fips.sh https://github.com/spectrocloud/agent-mode/releases/download/v<stylus-version>/palette-agent-install-fips.sh
   ```

   </TabItem>

   </Tabs>

## Airgap

This version of agent mode is designed for environments without direct internet access.

Download the airgap agent installation package and save it as a TAR file.

- Replace `<architecture>` with the architecture of your CPU. If you have ARM64, use `arm64`. If you have AMD64 or x86_64, use `amd64`.
- Replace `<version>` with the desired version number. Refer to [agent mode releases](https://github.com/spectrocloud/agent-mode/releases) for all the available releases.

<Tabs groupID="FIPS">

<TabItem value="Non-FIPS">

```shell
curl -L https://github.com/spectrocloud/agent-mode/releases/download/<version>/agent-mode-linux-<architecture>.tar --output agent-mode-linux-<architecture>.tar
```

</TabItem>

<TabItem value="FIPS">

```shell
curl -L https://github.com/spectrocloud/agent-mode/releases/download/<version>/agent-mode-fips-linux-<architecture>.tar --output agent-mode-linux-<architecture>.tar
```

</TabItem>

</Tabs>
