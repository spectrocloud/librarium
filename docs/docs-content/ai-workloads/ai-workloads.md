---
sidebar_label: "AI Workloads"
title: "AI Workloads"
description: "Guides for running AI workloads on Palette-managed infrastructure."
hide_table_of_contents: false
tags: ["ai workloads", "gpu", "nvidia", "edge", "machine learning"]
---

Palette supports AI workloads across data center and Edge environments. To enable GPU workloads, Palette provides
curated packs that handle GPU driver installation, node feature detection, and runtime integration. This means your
nodes are ready to schedule GPU workloads without manual setup.

These guides cover how to provision and configure the infrastructure needed to run AI workloads on your Palette-managed
clusters and devices. For an elevated AI platform experience, where platform engineers deploy and manage GPU-enabled
clusters and application engineers independently deploy AI/ML applications and models on those clusters, refer to our
[PaletteAI](https://docs.palette-ai.com/) documentation.

## Resources

<!-- prettier-ignore-start -->

- [Enable AI Workloads with the NVIDIA GPU Operator Pack](./nvidia-gpu-operator.md) - Add the
  <VersionedLink text="NVIDIA GPU Operator" url="integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack to a Palette
  cluster profile to provision GPU nodes for AI workloads.

<!-- prettier-ignore-end -->

- [PaletteAI](https://docs.palette-ai.com/) - Provision and manage GPU-optimized infrastructure and clusters, allowing
  application teams to deploy curated AI/ML applications and models as needed.
