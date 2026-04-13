---
sidebar_position: 20
sidebar_label: "Get Started with the Palette MCP Server"
title: "Get Started with the Palette MCP Server"
description: "Learn how to use the Palette MCP Server to connect to and debug cluster deployments."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

<YOLO THE INTRO HERE>

## Prerequisites

- Ensure the following software is installed locally on your workstation:

  - A container engine, such as [Docker](https://www.docker.com/products/docker-desktop/) or
    [Podman](https://podman.io/docs/installation).
  - The Gemini CLI. Refer to [Get started with Gemini CLI](https://geminicli.com/docs/get-started/) for more
    information.
  - The Palette MCP server is configured in your environment. Refer to the
    [Set Up MCP Server with Gemini CLI](../../../automation/palette-mcp/palette-mcp.md) guide for more information.

- A Palette account.

- A Palette API key. Check out the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  guide for more information.

## Import a Cluster Profile

In this section, you will import a cluster profile into Palette. This profile will be used to deploy two clusters: a
development cluster running fewer application replicas and a production cluster running more.

<PartialsComponent category="cluster-templates" name="cluster-profile-pack-versions" />

The `hello-universe` pack declares an `app_replicas`
[cluster profile variable](../../../../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/).
This variable has no value in the profile itself. A cluster template assigns a value for each cluster it manages. This
allows a development cluster and a production cluster to share the same profile while running different replica counts.
The variable is marked `required`, so no cluster can be deployed without a value.

Log in to [Palette](https://console.spectrocloud.com). From the left main menu, select **Profiles** and click **Import
Cluster Profile**.

In the slide drawer that opens, paste the following JSON snippet for your cloud provider.

<Tabs>

<TabItem label="AWS" value="aws">

```json
{
  "metadata": {
    "name": "cluster-template-profile-aws",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "aws",
      "packs": [
        {
          "name": "ubuntu-aws",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-aws-ebs",
          "type": "spectro",
          "layer": "csi",
          "version": "1.46.0",
          "tag": "1.46.0",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

<TabItem label="Azure" value="azure">

```json
{
  "metadata": {
    "name": "cluster-template-profile-azure",
    "description": "Cluster profile for the cluster templates tutorial",
    "labels": {}
  },
  "spec": {
    "version": "1.0.0",
    "template": {
      "type": "cluster",
      "cloudType": "azure",
      "packs": [
        {
          "name": "ubuntu-azure",
          "type": "spectro",
          "layer": "os",
          "version": "22.04",
          "tag": "22.04",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "kubernetes",
          "type": "spectro",
          "layer": "k8s",
          "version": "1.33.6",
          "tag": "1.33.6",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "cni-calico-azure",
          "type": "spectro",
          "layer": "cni",
          "version": "3.31.2",
          "tag": "3.31.2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "csi-azure",
          "type": "spectro",
          "layer": "csi",
          "version": "1.31.2-rev2",
          "tag": "1.31.2-rev2",
          "values": "",
          "registry": {
            "metadata": { "name": "Public Repo", "kind": "oci", "isPrivate": false, "providerType": "pack" }
          }
        },
        {
          "name": "hello-universe",
          "type": "oci",
          "layer": "addon",
          "version": "1.3.0",
          "tag": "1.3.0",
          "values": "pack:\n  content:\n    images:\n      - image: ghcr.io/spectrocloud/hello-universe:1.3.0\n\nmanifests:\n  hello-universe:\n    images:\n      hellouniverse: ghcr.io/spectrocloud/hello-universe:1.3.0\n    apiEnabled: false\n    namespace: hello-universe\n    port: 8080\n    replicas: \"{{.spectro.var.app_replicas}}\"",
          "registry": {
            "metadata": {
              "name": "Palette Community Registry",
              "kind": "oci",
              "isPrivate": true,
              "providerType": "pack"
            }
          }
        }
      ]
    },
    "variables": [
      {
        "name": "app_replicas",
        "displayName": "Hello Universe Replicas",
        "format": "number",
        "description": "Number of replicas for the hello-universe workload",
        "defaultValue": "1",
        "required": true,
        "isSensitive": false,
        "isHidden": false,
        "immutable": false
      }
    ]
  }
}
```

</TabItem>

</Tabs>

Click **Validate**. Palette displays a _Validated successfully_ message. Click **Confirm**. The cluster profile is
created.

## Deploy a Cluster

## Connect and Debug the Cluster

## Cleanup

## Wrap-up
