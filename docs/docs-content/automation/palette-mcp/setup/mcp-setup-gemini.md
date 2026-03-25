---
sidebar_label: "Setup the MCP Server with Gemini CLI"
title: "Setup the MCP Server with Gemini CLI"
description: "Learn how to setup the Palette MCP server with Gemini CLI."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai", "mcp", "automation"]
---

This guide covers how to setup the [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) with
[Gemini CLI](https://geminicli.com/).

## Prerequisites

- Ensure the following software is installed locally on your workstation.

  - A container runtime, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - Gemini CLI. Refer to the [Get started with Gemini CLI](https://geminicli.com/docs/get-started/) page for further
    information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide to learn how to create a Palette API key. guide for further instructions.

## Setup

<PartialsComponent category="palette-mcp" name="folder-setup" />

5. Start the Gemini CLI in a terminal. Ensure that you trust the folders that the `.env-mcp` file is located in and
   authenticate with Gemini CLI by following the prompts.

   ```shell
   gemini
   ```

6. Open the `~/.gemini/settings.json` file in your favorite text editor.

7. <PartialsComponent category="palette-mcp" name="server-snippet" />

8. Save the `settings.json` file and close it.

9. Navigate back to the terminal and execute the following to command to ensure that the MCP server has been set up
   successfully.

   ```shell
   gemini mcp list
   ```

   ```shell title="Example Output"
   Configured MCP servers:

   ✓ palette: docker run --rm -i --pull always --mount type=bind,source=/<local-path>/.palette/kubeconfig,target=/tmp/kubeconfig --env-file /<local-path>/.palette/.env-mcp public.ecr.aws/palette-ai/palette-mcp-server:latest (stdio) - Connected
   ```

10. If you configured the path to your kubeconfig file in **Step 4**, we recommend adding an
    [Agent Skill](https://geminicli.com/docs/cli/skills/) to enable Gemini to use the downloaded kubeconfig files to
    access clusters.

    Execute the following command to create a guidance file on your local machine. Replace the `<local-path>`
    placeholder with your local path.

    ```shell
    touch <local-path>/.palette-guidance.md
    ```

    Open the file in your preferred editor and paste the following snippet into it. Replace the `<local-path>`
    placeholder with the kubeconfig local path you configured in **Step 4**.

    <PartialsComponent category="palette-mcp" name="example-skill" />

    :::info

    Gemini does not automatically load skills, so you will need to load this skill on every invocation using the
    `gemini "$(cat /<local-path>/.palette-guidance.md)"` syntax.

    :::

You can now use the Palette MCP server with Gemini CLI.

## Validation

1. Start the Gemini CLI in a terminal. Ensure that you trust the folders that the `.env-mcp` file is located in and
   authenticate with Gemini CLI by following the prompts.

   ```shell
   gemini
   ```

2. Send any query about your Palette environment to test out that your MCP server is successfully connected to Palette.

   For example, you can ask "Can you help me identify how many active clusters I have in Palette?" to learn more about
   your Palette clusters.

   ```shell title="Example Output"
   ✦ I will list the active clusters in Palette to determine how many you have.
   ╭─────────────────────────────────────────────────────────────────────────────────────────────╮
   │ ✓  gather_or_delete_clusters (palette MCP Server) {"active_only":true,"action":"list"}      │
   │                                                                                             │
   │ {                                                                                           │
   │   "content": [                                                                              │
   │     {                                                                                       │
   │       "type": "text",                                                                       │
   │       "text": "{\n  \"clusters\": {\n    \"items\": [\n      {\n        \"metadata\": {\n   │
   │ \"annotations\": {\n            \"ownerUid\": \"65539867083a5585bb262c4f\",\n               │
   │ \"permissions\":                                                                            │
   │ \"cluster.adminKubeconfigDownload,cluster.create,cluster.delete,cluster.get,cluster.import, │
   │ cluster.list,cluster.update,tag.update\",\n            \"projectUid\":                      │
   │ \"xxx\",\n            \"scope\": \"project\",\n                        │
   │ \"scopeVisibility\": \"16\",\n            \"tenantUid\": \"6342eaaffaa0813ea548ea04\"\n     │
   │ },\n          \"creationTimestamp\": \"2026-03-17T13:37:05.071Z\",\n                        │
   │ \"deletionTimestamp\": \"0001-01-01T00:00:00.000Z\",\n          \"labels\": {\n             │
   │ \"owner\": \"xx\"\n          },\n          \"lastModifiedTimestamp\":           │
   │ \"2026-03-17T13:46:48.273Z\",\n          \"name\": \"aws-cluster-test\",\n                  │
   │ \"uid\": \"69b959018db5c767205d0432\"\n        },\n        \"specSummary\": {\n             │
   │ \"archTypes\": [\n            \"amd64\"\n          ],\n          \"cloudAccountMeta\": {\n  │
   │ \"name\": \"aws-deploy-user\",\n            \"uid\": \"6926f6f6d8b4acf80ad84b21\"\n         │
   │ },\n          \"cloudConfig\": {\n            \"cloudType\": \"aws\",\n                     │
   │ \"hybridMachinePools\": [],\n            \"machinePools\": [\n              {\n             │
   │ \"cloudType\": \"aws\",\n                \"healthy\": 1,\n                                  │
   │ \"infraProfileTemplate\": {\n                  \"packs\": null\n                },\n        │
   │ \"isControlPlane\": true,\n                \"labels\": [\n                                  │
   │ \"control-plane\"\n                ],\n                \"maintenanceMode\": 0,\n            │
   │ \"size\": 1\n              },\n              {\n                \"cloudType\": \"aws\",\n   │
   │ \"healthy\": 1,\n                \"infraProfileTemplate\": {\n                  \"packs\":  │
   │ null\n                },\n                \"isControlPlane\": false,\n                      │
   │ \"labels\": [\n                  \"worker\"\n                ],\n                           │
   │ \"maintenanceMode\": 0,\n                \"size\": 1\n              }\n            ],\n     │
   │ \"uid\": \"69b959018db5c7671e218e9d\"\n          },\n          \"clusterConfig\": {\n       │
   │ \"hostClusterConfig\": {},\n            \"timezone\": \"Etc/UTC\"\n          },\n           │
   │ \"clusterProfileTemplates\": [],\n          \"projectMeta\": {\n            \"name\":       │
   │ \"Default\",\n            \"uid\": \"6342eab2faa0813ead9082e0\"\n          }\n        },\n  │
   │ \"status\": {\n          \"clusterImport\": {\n            \"isBrownfield\": false\n        │
   │ },\n          \"cost\": {\n            \"cloud\": {\n              \"compute\": 0,\n        │
   │ \"storage\": 0,\n              \"total\": 0\n            },\n            \"total\": 0\n     │
   │ },\n          \"fips\": {\n            \"mode\": \"none\"\n          },\n                   │
   │ \"health\": {\n            \"agentVersion\": \"4.8.18/20260228.2209\",\n                    │
   │ \"conditions\": [],\n            \"lastHeartBeatTimestamp\":                                │
   │ \"2026-03-19T14:31:41.348Z\",\n            \"state\": \"Healthy\"\n          },\n           │
   │ \"hourlyRate\": {\n            \"cloud\": {\n              \"compute\": 0,\n                │
   │ \"storage\": 0,\n              \"total\": 0\n            },\n            \"total\": 0\n     │
   │ },\n          \"location\": {\n            \"coordinates\": [\n              -76.015778,\n  │
   │ 36.86314\n            ],\n            \"countryCode\": \"US\",\n                            │
   │ \"countryName\": \"United States\",\n            \"regionCode\": \"VA\",\n                  │
   │ \"regionName\": \"Virginia\"\n          },\n          \"metrics\": {\n            \"cpu\":  │
   │ {\n              \"lastUpdatedTime\": \"2026-03-19T14:28:57.617Z\",\n                       │
   │ \"limit\": 0,\n              \"request\": 0,\n              \"total\": 8000,\n              │
   │ \"unit\": \"MilliCore\",\n              \"usage\": 30\n            },\n                     │
   │ \"memory\": {\n              \"lastUpdatedTime\": \"2026-03-19T14:28:57.617Z\",\n           │
   │ \"limit\": 0,\n              \"request\": 0,\n              \"total\": 32864312,\n          │
   │ \"unit\": \"KiB\",\n              \"usage\": 1019114\n            }\n          },\n         │
   │ \"notifications\": {\n            \"isAvailable\": false,\n                                 │
   │ \"isTemplateVariableResolutionPending\": false\n          },\n          \"repave\": {},\n   │
   │ \"state\": \"Running\",\n          \"virtual\": {\n            \"appDeployments\": null,\n  │
   │ \"clusterGroup\": {},\n            \"hostCluster\": {},\n            \"lifecycleStatus\":   │
   │ {},\n            \"virtualClusters\": []\n          }\n        }\n      }\n    ]\n  }\n}"   │
   │     }                                                                                       │
   │   ],                                                                                        │
   │   "isError": false                                                                          │
   │ }                                                                                           │
   ╰─────────────────────────────────────────────────────────────────────────────────────────────╯
   ✦ You have 1 active cluster in Palette: aws-cluster-test.
   ```

## Next Steps

Refer to the [Palette MCP Server Operations](../palette-mcp-operations.md) page for further examples on how to leverage
the functionality of the MCP server.
