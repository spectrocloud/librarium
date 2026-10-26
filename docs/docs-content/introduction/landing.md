---
title: "Spectro Cloud Documentation"
description:
  "Find Spectro Cloud documentation by what you want to run: AI and machine learning workloads, Kubernetes clusters, and
  virtual machines."
hide_table_of_contents: true
slug: /
---

<AskAI placeholder="Ask AI about Spectro Cloud products..." />

<!-- vale off -->

## Run AI and Machine Learning Workloads

<div className="margin-bottom--lg">
  <SimpleCardGrid
    hideNumber
    cards={[
      {
        title: "PaletteAI for Self-Service AI Environments",
        description:
          "Use PaletteAI to provision infrastructure on demand and deploy AI and machine learning application stacks.",
        tags: ["Public cloud", "Data center"],
        url: "https://docs.palette-ai.com/",
      },
      {
        title: "PaletteAI Inference Launchpad for Serving LLMs on Your Own Hardware",
        description:
          "Use PaletteAI Inference Launchpad to boot a single appliance image and serve models on NVIDIA or AMD GPUs.",
        tags: ["Data center", "Air-gapped"],
        url: "/paletteai-inference-launchpad/",
      },
    ]}
  />
</div>

## Run Kubernetes Clusters

<div className="margin-bottom--lg">
  <SimpleCardGrid
    hideNumber
    cards={[
      {
        title: "Palette for Clouds and Data Centers",
        description: "Use Palette to deploy, update, and manage Kubernetes clusters in public clouds and data centers.",
        tags: ["Public cloud", "Data center"],
        url: "/palette/",
      },
      {
        title: "Palette Edge for Remote Edge Sites",
        description:
          "Use Palette Edge to provision, scale, and upgrade Kubernetes clusters on Edge hosts at remote sites, such as grocery stores and restaurants.",
        tags: ["Edge", "Air-gapped"],
        url: "/clusters/edge/",
      },
      {
        title: "Palette VerteX for Regulated Environments",
        description:
          "Use Palette VerteX to deploy Kubernetes clusters that integrate validated Federal Information Processing Standards (FIPS) 140-3 cryptographic modules.",
        tags: ["Public cloud", "Data center", "Edge", "Air-gapped"],
        url: "/vertex/",
      },
      {
        title: "Self-Hosted Palette for Your Own Infrastructure",
        description:
          "Use Palette to manage Kubernetes clusters from a self-hosted instance in your own data center or public cloud account, including air-gapped environments.",
        tags: ["Public cloud", "Data center", "Air-gapped"],
        url: "/enterprise-version/",
      },
    ]}
  />
</div>

## Run Virtual Machines

<SimpleCardGrid
  hideNumber
  cards={[
    {
      title: "PaletteAI VM Launchpad for VMs on a Standalone Appliance",
      description:
        "Use PaletteAI VM Launchpad to install a bootable ISO on bare metal or Edge devices and manage VMs from a dedicated UI.",
      tags: ["Data center", "Edge", "Air-gapped"],
      url: "/vm-management/vm-launchpad/",
    },
    {
      title: "Palette Virtual Machine Orchestrator for VMs on Your Kubernetes Clusters",
      description:
        "Use Palette Virtual Machine Orchestrator to run VMs alongside containers on Palette-managed or imported Kubernetes clusters.",
      tags: ["Data center", "Edge", "Air-gapped"],
      url: "/vm-management/vmo-pack/",
    },
  ]}
/>
