---
sidebar_position: 10
sidebar_label: "Integrate Palette MCP in an Agentic Workflow"
title: "Integrate Palette MCP in an Agentic Workflow"
description:
  "Learn how to integrate the Palette MCP server into an agentic workflow using Langchain. The workflow will identify
  packs in cluster profiles that you want to upgrade or remove and tag cluster profiles using that instance of a pack,
  along with deployed clusters using that cluster profil"
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The Palette MCP server can be used to help you power different AI use cases and workflows. In a previous tutorial,
INSERT TUTORIAL LINK you learned how to deploy the Palette MCP server and how to use it by querying questions to a Large
Language Model (LLM) and configuring the LLM to use the Palette MCP to answer questions. While this is a great way to
use the Palette MCP server, it is not the only way. You can also use the Palette MCP server to power agentic workflows
that can perform actions on your Palette environment.

In this tutorial, you will learn how to integrate the Palette MCP server into an agentic workflow that identifies if a
specific pack is present in your environment's cluster profiles and deployed clusters. If the pack is present, the
workflow will tag the cluster profiles using that instance of the pack, along with deployed clusters using that cluster
profile

![Palette MCP server in an agentic workflow](/tutorials/ai/palette-mcp/ai_palette-mcp_integrate-palette-mcp-agentic_architecture.webp)

## Prerequisites

- A Palette account.
- A Palette API key. Check out the
  [Create a Palette API Key ](../../getting-started/palette/aws/setup.md#create-a-palette-api-key) guide to learn how to
  create a Palette API key. guide for further instructions.
- Kind installed locally. Use the [Kind Installation](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
  guide to install Kind.
- uv installed locally. Use the [uv Installation](https://docs.astral.sh/uv/getting-started/installation/) guide to
  install uv.
- git installed locally. Use the [git Installation](https://git-scm.com/downloads) guide to install git.
- Internet access to clone the Palette tutorial repository.
- A container runtime installed locally, such as [Docker](https://www.docker.com/products/docker-desktop/) or
  [Podman](https://podman.io/docs/installation).
- The Palette MCP server deployed in your environment. Refer to the Setup Palette MCP server guide to learn how to
  deploy the Palette MCP server.

## Setup

Start by opening a terminal window and clone the Palette tutorial repository.

```bash
git clone git@github.com:spectrocloud/tutorials.git
```

If you already have the Palette tutorial repository cloned, pull the latest changes.

```bash
git pull origin main && git fetch --tags
```

<PartialsComponent category="tutorials" name="checkout-tutorials-tag" />

Change to the tutorial directory that contains the code for this tutorial.

```bash
cd tutorials/ai/palette-mcp/integrate-palette-mcp/
```

Next, initialize the tutorial environment by issuing the following command. This will install the dependencies required
for the tutorial.

```bash
uv sync
```

Start a Kind cluster by issuing the following command.

```bash
kind create cluster --name palette-mcp-agentic-tutorial
```

This will start a Kind cluster named `palette-mcp-agentic`.

Next, set the Kind cluster as the default cluster by issuing the following command.

```bash
kind use cluster palette-mcp-agentic
```

```bash hideClipboard
Creating cluster "palette-mcp-agentic-tutorial" ...
 ✓ Ensuring node image (kindest/node:v1.33.1) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-palette-mcp-agentic-tutorial"
You can now use your cluster with:

kubectl cluster-info --context kind-palette-mcp-agentic-tutorial
```

Once the clusters is created and ready, deploy the Kubernetes metrics-server through Helm. Use the following command to
deploy the metrics-server.

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
helm upgrade --install --set args={--kubelet-insecure-tls} metrics-server metrics-server/metrics-server --namespace kube-system
```

:::tip

To enable the metrics-server in a kind cluster, you need to set the `--kubelet-insecure-tls` argument. Otherwise, the
metrics-server will not start due to the self-signed certificate SSL used by the kind cluster's Kubernetes API server.

:::

### Import Cluster

You will use the freshly created Kind cluster to act as a Palette deployed cluster. Deploying an acutal cluster through
Palette takes time and requires real infrastructure. To optimize the learning experience of this tutorial, you will use
the Kind cluster to act as a Palette deployed cluster by importing it into Palette.

Open up a web browser and log in to your Palette account. Navigate to the left **Main Menu** and select **Clusters**.
From the cluster list page, click on **Import Cluster** in the top right corner.

![A view of the cluster list page with the Import Cluster button](/tutorials/ai/palette-mcp/ai_palette-mcp_import-cluser-view.webp)

In the following screen, you will need to fill out the required information to import the cluster. Fill out the
following fields:

- Cluster Name: `palette-mcp-agentic-tutorial`
- Cloud Type: `Generic`
- Import mode: `Full-permission mode`

Click on **Create & Open Cluster Instance**. You will be redirected to the cluster details page. A set of instructions
with commands is displayed on the right side of the screen.

![A view of the cluster details page with the import instructions](/tutorials/ai/palette-mcp/ai_palette-mcp_import-instructions.webp)

Go ahead and copy the command to your clipboard and issue it in your terminal window where created the Kind cluster.
After a few moments, the cluster will report a status of **Running** in the cluster details page.

:::tip

In the event you need more detailed instructions on how to import a cluster into Palette, Check out the the
[Import a Cluster](../../../clusters/imported-clusters/cluster-import.md) guide.

:::

### Import Cluster Profile
