---
title: "Spectro Cloud Documentation"
description:
  "Find Spectro Cloud documentation by what you want to deploy, from AI and machine learning workloads to Kubernetes
  clusters and virtual machines."
hide_title: true
hide_table_of_contents: true
slug: /
---

<LandingHero title="Spectro Cloud Documentation">
  <AskAI placeholder="Ask AI about Spectro Cloud products..." />
</LandingHero>

<!-- vale off -->

<div className="landing-section landing-section--ai">

## Deploy AI and Machine Learning Workloads

<SimpleCardGrid
  compact
  cards={[
    {
      title: "PaletteAI for Self-Service AI Environments",
      description: "Provision infrastructure on demand and deploy AI and machine learning application stacks.",
      tags: ["Public cloud", "Data center"],
      icon: "brain",
      url: "https://docs.palette-ai.com/",
    },
    {
      title: "PaletteAI Inference Launchpad for Serving LLMs on Your Own Hardware",
      description: "Boot a single appliance image and serve models on NVIDIA or AMD GPUs.",
      tags: ["Data center", "Air-gapped"],
      icon: "microchip",
      url: "/paletteai-inference-launchpad/",
    },
  ]}
/>

</div>

<div className="landing-section">

## Deploy Kubernetes Clusters

<SimpleCardGrid
  compact
  cards={[
    {
      title: "Palette for Clouds and Data Centers",
      description: "Deploy, update, and manage Kubernetes clusters in public clouds and data centers.",
      tags: ["Public cloud", "Data center"],
      icon: "palette",
      url: "/palette/",
    },
    {
      title: "Palette Edge for Remote Edge Sites",
      description:
        "Provision, scale, and upgrade Kubernetes clusters on Edge hosts at remote sites, such as grocery stores and restaurants.",
      tags: ["Edge", "Air-gapped"],
      icon: "hdd",
      url: "/clusters/edge/",
    },
    {
      title: "Palette VerteX for Regulated Environments",
      description:
        "Deploy Kubernetes clusters that integrate validated Federal Information Processing Standards (FIPS) 140-3 cryptographic modules.",
      tags: ["Public cloud", "Data center", "Edge", "Air-gapped"],
      icon: "shield",
      url: "/vertex/",
    },
    {
      title: "Self-Hosted Palette for Your Own Infrastructure",
      description:
        "Manage Kubernetes clusters from a self-hosted instance in your own data center or public cloud account, including air-gapped environments.",
      tags: ["Public cloud", "Data center", "Air-gapped"],
      icon: "warehouse",
      url: "/enterprise-version/",
    },
  ]}
/>

</div>

<div className="landing-section landing-section--vm">

## Deploy Virtual Machines

<SimpleCardGrid
  compact
  cards={[
    {
      title: "PaletteAI VM Launchpad for VMs on a Standalone Appliance",
      description: "Install a bootable ISO on bare metal or Edge devices and manage VMs from a dedicated UI.",
      tags: ["Data center", "Edge", "Air-gapped"],
      icon: "server",
      url: "/vm-management/vm-launchpad/",
    },
    {
      title: "Palette Virtual Machine Orchestrator for VMs on Your Kubernetes Clusters",
      description: "Deploy VMs alongside containers on Palette-managed or imported Kubernetes clusters.",
      tags: ["Data center", "Edge", "Air-gapped"],
      icon: "cubes",
      url: "/vm-management/vmo-pack/",
    },
  ]}
/>

</div>
