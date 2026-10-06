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
serves a model, as described in [Register a Jetson Host and Serve a Model](./register-jetson-host.md), you monitor the
deployment, apply updates, back up and recover the device, troubleshoot common issues, and decommission the host when
you are finished.

Because Palette manages the Jetson device in [agent mode](../../deployment-modes/agent-mode/agent-mode.md) with a
bring-your-own operating system (BYOOS), you perform some Day 2 tasks through Palette and others on the device. Each
section notes where you perform the task.

:::warning

This device is a single-node Edge cluster that runs the control plane and your workloads on the same node. It has no
high availability. Any operation that reboots or reconciles the node, such as a Kubernetes upgrade, interrupts the
served model until the node returns to a **Running** state. Plan for downtime.

:::

<!-- VERIFY(DOC-3091): confirm the single-node no-HA, downtime-on-reconcile behavior on the kit during the upgrade validation. -->

## Prerequisites

- A Jetson device registered with Palette and serving a model, as described in
  [Register a Jetson Host and Serve a Model](./register-jetson-host.md).

- `kubectl` installed on a workstation that can reach the cluster, with the cluster kubeconfig file exported. Refer to
  [Enable GPU Access for Workloads](./register-jetson-host.md#enable-gpu-access-for-workloads) for how to download and
  export the kubeconfig file.

## Monitor the Host, Cluster, and Model

Palette reports the cluster and host health, but it does not surface GPU utilization or model activity. You monitor
those on the host and in the workload.

| What                    | How to Check                                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster and host health | Use the **Clusters** and **Edge Hosts** views in Palette for status and events. Refer to [Edge Cluster Management](../../clusters/edge/cluster-management/cluster-management.md). |
| Node and pod metrics    | The cluster runs `metrics-server`, so `kubectl top nodes` and `kubectl top pods` report CPU and memory.                                                                           |
| GPU utilization         | Use the NVIDIA host tools on the device, such as `nvidia-smi` and `tegrastats`, or run `nvidia-smi` inside a GPU-enabled pod. Palette does not display GPU metrics.               |
| Model activity          | Run `kubectl exec deployment/ollama -- ollama ps` to confirm that the model is loaded and runs on the GPU.                                                                        |

<!-- VERIFY(DOC-3091): validate the exact monitoring commands on the kit. `nvidia-smi` and `ollama ps` are validated (Day 1); `kubectl top` (metrics-server) and `tegrastats` are NOT yet run on the Thor. Capture representative output. Demo metrics already captured 2026-09-14 (llama3.1:8b via Open WebUI): GPU util 98%, ~42 W GPU, ~112 W board, ~72 C — decide whether to include a metrics example. -->

## Update Kubernetes and Packs

You update Kubernetes and packs through Palette. Update the cluster profile to a new pack version, and Palette
reconciles the change to the cluster.

<!-- TODO(DOC-3091): write the K3s/pack update flow for the single-node Jetson, referencing the cluster-profile version-update procedure. VALIDATE on the kit (semi-destructive): change a pack version, observe the single-node reconcile and downtime, confirm the model returns. Open eng question (DOC-3093 candidate): is an in-place K3s upgrade supported on a single-node Jetson, and what downtime should the reader expect? -->

For how Edge clusters apply updates and what to expect during reconciliation, refer to
[Upgrade Behavior](../../clusters/edge/cluster-management/upgrade-behavior.md). In an airgap deployment, the agent and
content are updated differently. Refer to
[Agent Upgrade in Airgap](../../clusters/edge/cluster-management/agent-upgrade-airgap.md).

## Update JetPack and the Operating System

You update JetPack and Jetson Linux (L4T) on the device, outside Palette. Palette does not upgrade the operating system
on a BYOOS host, so you update JetPack with NVIDIA's tooling, as described in
[Prepare the Jetson Host](./prepare-jetson-host.md).

<!-- TODO(DOC-3091): document the host-side JetPack/OS update path and its relationship to the registered host. Open eng questions (DOC-3093 candidates): (1) is a JetPack update an in-place apt upgrade or a reflash? (2) does the host need to re-register with Palette after an OS update, or does the agent persist? (3) does a GPU driver/L4T change affect the nvidia RuntimeClass or the running model? VALIDATE last (destructive: a reflash wipes the device). -->

## Update or Swap the Served Model

You can change the model that the device serves in two ways.

### Change the Model Directly on the Cluster

Pull a different model into the running server with `kubectl`. This approach is immediate, but Palette does not track
the change.

1. Pull the new model into the running server.

   ```shell
   kubectl exec deployment/ollama -- ollama pull <model-name>
   ```

   Replace `<model-name>` with the model you want, such as `llama3.2:3b`.

2. Load and exercise the new model. Ollama loads a model into the GPU on the first request.

   ```shell
   kubectl exec deployment/ollama -- ollama run <model-name> "In one short sentence, what is edge computing?"
   ```

   Replace `<model-name>` with the model that you pulled in step 1.

3. Confirm that the new model is loaded and runs on the GPU. In the output, the `PROCESSOR` column reads `100% GPU`.

   ```shell
   kubectl exec deployment/ollama -- ollama ps
   ```

   <!-- TODO(DOC-3091): add a hideClipboard title="Example output" block with the ollama ps output for the new model from the next Thor run. -->

### Manage the Model through the Cluster Profile

To keep model changes versioned and reconciled by Palette, model the serving workload as a manifest or Helm layer in the
cluster profile instead of changing it directly on the cluster. Palette then applies a model change as a cluster profile
update, which keeps the device's configuration in one managed place. For the serving workload that this page starts
from, refer to [Serve and Verify the Model](./register-jetson-host.md#serve-and-verify-the-model).

<!-- TODO(DOC-3091): expand the cluster-profile path once the blessed pattern is confirmed (eng/PM) - is the model-serving workload modeled as a manifest or add-on layer so model updates go through a profile version? -->

## Back Up, Reset, and Recover

A single-node Edge device has no control-plane high availability, so recovery differs from a multi-node cluster.

Without a persistent volume, a pulled model is lost when the serving pod restarts. To keep models across restarts, add a
storage layer to the cluster profile and mount a `PersistentVolumeClaim` at `/root/.ollama`.

To return a host to a clean state, refer to [Reset an Edge Host](../../clusters/edge/cluster-management/reset-host.md).
To renew the cluster certificates, refer to
[Certificate Renewal](../../clusters/edge/cluster-management/certificate-renewal.md).

<!-- TODO(DOC-3091): document backup/reset/recovery for the single-node Jetson. Open eng question (DOC-3093 candidate): is backup/restore (for example, Velero) supported on a single-node Edge ARM64 device? Note that replace-failed-node.md (../../clusters/edge/cluster-management/replace-failed-node.md) is a multi-node flow and may NOT apply to a single-node device — confirm before linking it as guidance. VALIDATE reset on the kit LAST (destructive). -->

## Troubleshoot Common Issues

The following issues are common on a Jetson Edge AI deployment. Where the Day 1 guide already covers a cause, this
section links to it.

### Workload Does Not Reach the GPU

A pod reaches the GPU only when its specification sets `runtimeClassName: nvidia` and the `NVIDIA_VISIBLE_DEVICES` and
`NVIDIA_DRIVER_CAPABILITIES` environment variables. Detection alone does not expose the GPU. Refer to
[Enable GPU Access for Workloads](./register-jetson-host.md#enable-gpu-access-for-workloads).

### Host Does Not Appear or Is Disconnected

Confirm that `projectName` in your `user-data` file matches an existing Palette project and that the host rebooted after
the agent installed. Refer to [Verify the Host Registers](./register-jetson-host.md#verify-the-host-registers). For
on-device troubleshooting, sign in to [Local UI](../../clusters/edge/local-ui/local-ui.md) with the local administrator
account that you created in the `user-data` file.

### Model Does Not Respond

Confirm that the serving pod is running, and then send a request to load the model before you run
`kubectl exec deployment/ollama -- ollama ps`. A pulled model does not load until the first request. Refer to
[Serve and Verify the Model](./register-jetson-host.md#serve-and-verify-the-model).

## Decommission the Host

When you finish with the deployment, decommission it in the following order so that Palette releases the host and you
can reuse the device. Before you delete the cluster, back up any model data or configuration that you want to keep.
Refer to [Back Up, Reset, and Recover](#back-up-reset-and-recover).

1. From the left main menu, select **Clusters**, select the cluster, and then delete it. Deleting the cluster stops the
   served model, removes the workloads, and releases the Jetson host back to your Edge host inventory.

2. From the left main menu, select **Clusters**, select the **Edge Hosts** tab, select the host, and then delete it to
   remove it from Palette.

3. _(Optional)_ To return the Jetson device to a clean state so that you can reuse it, reset the host. Refer to
   [Reset an Edge Host](../../clusters/edge/cluster-management/reset-host.md).

<!-- VERIFY(DOC-3091): validate the decommission flow on the kit LAST - it tears down the environment needed for the other Day-2 validations and the DOC-3092 tutorial screenshots. -->

## Next Steps

For host preparation and registration, refer to [Prepare the Jetson Host](./prepare-jetson-host.md) and
[Register a Jetson Host and Serve a Model](./register-jetson-host.md).

<!-- TODO(DOC-3092): link the "Run a local AI model on a Jetson at the edge" tutorial once that page exists. -->
