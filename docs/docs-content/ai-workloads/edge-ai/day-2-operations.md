---
sidebar_label: "Day 2 Operations"
title: "Day 2 Operations for Jetson Edge AI"
description:
  "Ongoing operations for a Palette-managed NVIDIA Jetson Edge AI cluster: monitoring, upgrades, model updates, backup
  and recovery, troubleshooting, and decommissioning."
hide_table_of_contents: false
sidebar_position: 40
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "day 2"]
---

<!-- SCAFFOLD (DOC-3091 Day 2). This page is a plan-driven scaffold. The section structure follows the Day-2 plan in the DOC-3091 Jira comment (id 293678). Most flows are NOT yet validated on the Thor; each section carries a TODO/VERIFY marker for what still needs validation on the kit or an engineering answer. Do NOT publish: like the rest of the set, this page documents Jetson AGX Thor and is gated on the ARM64 support sign-off (DOC-3093, Rishi). Placement is provisional pending DOC-3094. -->

This page describes Day 2 of running Edge AI workloads on an NVIDIA Jetson device. Starting from a registered host that
serves a model, as described in the Day 1 guide, you monitor the deployment, apply updates, back up and recover the
device, troubleshoot common issues, and decommission the host when you are finished.

## Two operational lanes

Because Palette manages the Jetson in [agent mode](../../deployment-modes/agent-mode/agent-mode.md) with a
bring-your-own operating system (BYOOS), Day 2 operations fall into two lanes. Knowing which lane a task belongs to
tells you where you perform it.

- **Palette-managed.** You perform these through Palette, usually by updating the cluster profile. They include
  Kubernetes and pack updates, the model-serving workload, and cluster health.
- **Host-managed.** You perform these on the device, outside Palette. They include JetPack and Jetson Linux (L4T)
  upgrades, the NVIDIA GPU driver, and the kernel. Palette does not manage the operating system on a BYOOS host.

:::warning

This device is a single-node Edge cluster that runs the control plane and your workloads on the same node. It has no
high availability. Any operation that reboots or reconciles the node, such as a Kubernetes upgrade, interrupts the
served model until the node returns to a **Running** state. Plan for downtime.

:::

<!-- VERIFY(DOC-3091): confirm the single-node no-HA, downtime-on-reconcile behavior on the kit during the upgrade validation. -->

## Monitor the host, cluster, and model

Palette reports the cluster and host health, but it does not surface GPU utilization or model activity. You monitor
those on the host and in the workload.

- **Cluster and host health.** Use the Palette **Clusters** and **Edge Hosts** views for status and events. Refer to
  [Edge Cluster Management](../../clusters/edge/cluster-management/cluster-management.md).
- **Node and pod metrics.** The cluster runs `metrics-server`, so `kubectl top nodes` and `kubectl top pods` report CPU
  and memory.
- **GPU utilization.** Use the NVIDIA host tools on the device, such as `nvidia-smi` and `tegrastats`, or run
  `nvidia-smi` inside a GPU-enabled pod. Palette does not display GPU metrics.
- **Model activity.** Use `ollama ps` to confirm the model is loaded and running on the GPU.

<!-- VERIFY(DOC-3091): validate the exact monitoring commands on the kit. `nvidia-smi` and `ollama ps` are validated (Day 1); `kubectl top` (metrics-server) and `tegrastats` are NOT yet run on the Thor. Capture representative output. Demo metrics already captured 2026-09-14 (llama3.1:8b via Open WebUI): GPU util 98%, ~42 W GPU, ~112 W board, ~72 C — decide whether to include a metrics example. -->

## Update Kubernetes and packs

Kubernetes and pack updates are Palette-managed. You update the cluster profile to a new pack version, and Palette
reconciles the change to the cluster.

<!-- TODO(DOC-3091): write the K3s/pack update flow for the single-node Jetson, referencing the cluster-profile version-update procedure. VALIDATE on the kit (semi-destructive): change a pack version, observe the single-node reconcile and downtime, confirm the model returns. Open eng question (DOC-3093 candidate): is an in-place K3s upgrade supported on a single-node Jetson, and what downtime should the reader expect? -->

For how Edge clusters apply updates and what to expect during reconciliation, refer to
[Upgrade Behavior](../../clusters/edge/cluster-management/upgrade-behavior.md). In an air-gapped deployment, the agent
and content are updated differently; refer to
[Agent Upgrade in Airgap](../../clusters/edge/cluster-management/agent-upgrade-airgap.md).

## Update JetPack and the operating system

JetPack and Jetson Linux (L4T) updates are host-managed. Palette does not upgrade the operating system on a BYOOS host,
so you update JetPack on the device using NVIDIA's tooling, as described in
[Prepare the Jetson Host](./prepare-jetson-host.md).

<!-- TODO(DOC-3091): document the host-side JetPack/OS update path and its relationship to the registered host. Open eng questions (DOC-3093 candidates): (1) is a JetPack update an in-place apt upgrade or a reflash? (2) does the host need to re-register with Palette after an OS update, or does the agent persist? (3) does a GPU driver/L4T change affect the nvidia RuntimeClass or the running model? VALIDATE last (destructive: a reflash wipes the device). -->

## Update or swap the served model

You can change the model the device serves in two ways.

- **Directly on the cluster.** Pull a different model into the running server or edit the workload with `kubectl`. This
  is quick but is not tracked by Palette.
- **Through the cluster profile.** Model the serving workload as a manifest or Helm layer in the cluster profile, so
  that model changes are versioned and reconciled by Palette. This keeps the device's configuration in one managed
  place.

<!-- TODO(DOC-3091): write both paths. The ad-hoc kubectl/ollama path is validated (Day 1). The Palette-managed path needs a decision: is there a blessed pattern for modeling the model-serving workload as a manifest/add-on layer so model updates go through a profile version? (Open eng/PM question, DOC-3093 candidate.) Cross-link the Day-1 serve section once that page lands on this branch. -->

## Back up, reset, and recover

A single-node Edge device has no control-plane high availability, so recovery differs from a multi-node cluster.

- **Model data.** Without a persistent volume, a pulled model is lost when the serving pod restarts. To keep models
  across restarts, mount a `PersistentVolumeClaim` for the model store.
- **Reset the host.** To return a host to a clean state, refer to
  [Reset an Edge Host](../../clusters/edge/cluster-management/reset-host.md).
- **Certificate renewal.** Refer to
  [Certificate Renewal](../../clusters/edge/cluster-management/certificate-renewal.md).

<!-- TODO(DOC-3091): document backup/reset/recovery for the single-node Jetson. Open eng question (DOC-3093 candidate): is backup/restore (for example, Velero) supported on a single-node Edge ARM64 device? Note that replace-failed-node.md (../../clusters/edge/cluster-management/replace-failed-node.md) is a multi-node flow and may NOT apply to a single-node device — confirm before linking it as guidance. VALIDATE reset on the kit LAST (destructive). -->

## Troubleshoot common issues

The following issues are the ones most likely to arise on a Jetson Edge AI deployment. Where a cause is already
documented in the Day 0 or Day 1 guide, this section points to it rather than repeating it.

- **A workload does not reach the GPU.** The pod needs `runtimeClassName: nvidia` and the `NVIDIA_VISIBLE_DEVICES` and
  `NVIDIA_DRIVER_CAPABILITIES` environment variables. Detection alone does not expose the GPU.
- **The host is not connected.** Check the agent on the device and the host's status in Palette. Use
  [Local UI](../../clusters/edge/local-ui/local-ui.md) and the host's local login for on-device troubleshooting.
- **The model does not respond.** Confirm the serving pod is running and the model is loaded with `ollama ps`, because a
  pulled model does not load until the first request.

<!-- TODO(DOC-3091): consolidate the banked troubleshooting items and link, do not duplicate: GPU env-var pattern (Day 1 Enable GPU access), agent connectivity (Local UI / journalctl), projectName-must-exist (Day 1), ollama ps loaded-state (Day 1). Add Day-1 cross-links once that page lands on this branch. -->

## Decommission the host

When you are finished, delete the cluster in Palette, remove the Edge host from Palette, and optionally reset the device
to a bare state so you can reuse it.

<!-- TODO(DOC-3091): write the decommission/deregister flow (delete cluster -> deregister host -> optional factory reset). VALIDATE LAST on the kit: this tears down the environment needed for the other Day-2 validations and the DOC-3092 tutorial screenshots. Reference host-management (../../clusters/edge/local-ui/host-management/host-management.md) and reset-host.md. -->

## Next steps

For host preparation and registration, refer to [Prepare the Jetson Host](./prepare-jetson-host.md) and the Day 1
registration guide.

<!-- TODO(DOC-3090): link "Register a Jetson host and serve a model" (Day 1) once that page lands on this branch. onBrokenLinks is "throw", so do not link register-jetson-host.md until it exists here. -->
<!-- TODO(DOC-3092): link the "Run a local AI model on a Jetson at the edge" tutorial once that page exists. -->
