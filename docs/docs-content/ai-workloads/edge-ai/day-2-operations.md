---
sidebar_label: "Day 2 Operations"
title: "Day 2 Operations for Jetson Edge AI"
description:
  "Monitor, update, reset, troubleshoot, and decommission a Palette-managed NVIDIA Jetson Edge AI cluster after it is
  registered and serving a model."
hide_table_of_contents: false
sidebar_position: 40
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "day 2"]
---

This page describes Day 2 of running Edge AI workloads on an NVIDIA Jetson device. You start from a registered host that
serves a model, as described in [Register a Jetson Host and Serve a Model](./register-jetson-host.md). You monitor the
deployment, apply updates, reset the host and renew its certificates, troubleshoot common issues, and decommission the
host when you are finished.

Because Palette manages the Jetson device in [agent mode](../../deployment-modes/agent-mode/agent-mode.md) with a
bring-your-own operating system, you perform some Day 2 tasks through Palette and others on the device. Each section
notes where you perform the task.

:::warning

The Jetson device runs a single-node Edge cluster, with the control plane and your workloads on the same node, so the
cluster has no high availability. Any operation that restarts the host, such as a Kubernetes upgrade, interrupts the
served model, and the serving pod loses any model that you pulled. After the cluster returns to the **Running** status
and the serving pod is ready, pull the model again, as described in
[Change the Model Directly on the Cluster](#change-the-model-directly-on-the-cluster).

:::

## Prerequisites

- A Jetson device registered with Palette and serving a model, as described in
  [Register a Jetson Host and Serve a Model](./register-jetson-host.md).

- `kubectl` installed on a workstation that can reach the cluster, with the cluster kubeconfig file exported in the
  terminal session that you use for the commands on this page. Refer to
  [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) for how to download the file and export its path.

## Monitor the Host, Cluster, and Model

Palette reports the cluster and host health, but it does not surface GPU utilization or model activity. You monitor
those on the host and in the workload.

| What                    | How to Check                                                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster and host health | In Palette, select **Clusters** for the cluster status and events, or the **Edge Hosts** tab for the host status. Refer to [Cluster Management for Edge Clusters](../../clusters/edge/cluster-management/cluster-management.md). |
| Node and pod metrics    | The cluster runs `metrics-server`, so `kubectl top nodes` and `kubectl top pods` report CPU and memory.                                                                                                                          |
| GPU utilization         | Use the NVIDIA host tools on the device, such as `nvidia-smi` and `tegrastats`, or run `nvidia-smi` inside a GPU-enabled pod.                                                                                                    |
| Model activity          | Run `kubectl exec deployment/ollama -- ollama ps` to confirm that the model is loaded and runs on the GPU.                                                                                                                       |

To view GPU and system metrics over time, deploy a metrics exporter and a dashboard such as Grafana. To monitor the
device from its terminal, you can use
[jetson-stats](https://developer.nvidia.com/embedded/community/jetson-projects/jetson_stats).

## Update Kubernetes and Packs

You update Kubernetes and packs through Palette. Create a new version of the cluster profile with the new pack versions,
and then update the cluster to that version. Refer to
[Update a Cluster](../../clusters/cluster-management/cluster-updates.md). The Palette agent applies the change on the
device, so you do not need to take any action on the host. The Jetson GPU driver ships with JetPack, not with a pack.
Refer to [Update JetPack and the Operating System](#update-jetpack-and-the-operating-system).

A Kubernetes version upgrade restarts the host, so the served model is unavailable until the host finishes restarting
and K3s becomes ready. Palette reports the upgrade type as a repave in the cluster's **Upgrade Details**, but the device
keeps its cluster configuration and workloads. Other pack updates do not always restart the host. For example, a
**Flannel** pack update replaces only the Flannel pod, which can briefly interrupt connections to the model.

To learn how Edge clusters apply updates and what to expect during reconciliation, refer to
[Edge Cluster Upgrade Behavior](../../clusters/edge/cluster-management/upgrade-behavior.md). On a centrally managed
host, the Palette agent upgrades automatically unless you
[pause agent upgrades](../../clusters/cluster-management/platform-settings/pause-platform-upgrades.md).

## Update JetPack and the Operating System

You update JetPack and Jetson Linux (L4T) on the device, outside Palette. In agent mode, you manage the operating system
and all its dependencies, so you update JetPack with NVIDIA's tooling. Refer to the
[NVIDIA JetPack](https://developer.nvidia.com/embedded/jetpack) documentation.

After an in-place JetPack or operating system update, the host does not need to register with Palette again, because the
Palette agent keeps its connection to Palette. Flashing a new image onto the device erases the operating system and the
Palette agent. After you flash the device, prepare and register the host again, as described in
[Prepare the Jetson Host](./prepare-jetson-host.md) and
[Register a Jetson Host and Serve a Model](./register-jetson-host.md).

A JetPack or L4T update can change the GPU driver on the host. A driver change can affect the `nvidia` RuntimeClass and
interrupt workloads that use the GPU, including the served model. After the update, confirm that the model still runs on
the GPU. Refer to [Monitor the Host, Cluster, and Model](#monitor-the-host-cluster-and-model).

## Change the Served Model

You change the model that the device serves directly on the cluster with `kubectl`. You can also manage the model server
through the cluster profile, so that Palette versions and applies it.

### Change the Model Directly on the Cluster

Pull a different model into the running server with `kubectl`. This approach is immediate, but Palette does not track
the change, and the serving pod loses the model when it restarts. After a restart, pull the model again.

1. Pull the new model into the running server.

   ```shell
   kubectl exec deployment/ollama -- ollama pull <model-name>
   ```

   Replace `<model-name>` with the model you want, such as `llama3.2:3b`.

2. Send a prompt to the new model. Ollama loads a model into the GPU on the first request.

   ```shell
   kubectl exec deployment/ollama -- ollama run <model-name> "In one short sentence, what is edge computing?"
   ```

   Replace `<model-name>` with the model that you pulled in step 1.

3. Confirm that the new model is loaded and runs on the GPU. In the output, the `PROCESSOR` column reads `100% GPU`.

   ```shell
   kubectl exec deployment/ollama -- ollama ps
   ```

   ```text hideClipboard title="Example Output"
   NAME           ID              SIZE     PROCESSOR    CONTEXT    RUNNER      UNTIL
   llama3.2:3b    a80c4f17acd5    17 GB    100% GPU     131072     llamacpp    4 minutes from now
   ```

### Manage the Model Server through the Cluster Profile

To keep the model server versioned and applied by Palette, define the Ollama `Deployment` and `Service` as a manifest or
Helm chart layer in the cluster profile instead of applying them with `kubectl`. Palette then applies changes to the
server, such as a new Ollama image, as a cluster profile update. The layer does not include the model. After Palette
applies the layer, pull the model as described in
[Change the Model Directly on the Cluster](#change-the-model-directly-on-the-cluster). To add the layer, refer to
[Add a Manifest](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md)
or
[Add a Helm Chart](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md).
For the `Deployment` and `Service` to use, refer to
[Serve and Verify the Model](./register-jetson-host.md#serve-and-verify-the-model).

## Reset the Host and Renew Certificates

To return the host to a clean state, uninstall the Palette agent. If the host still belongs to a cluster, delete the
cluster first, as described in [Decommission the Host](#decommission-the-host). To register the host with Palette again
afterward, reinstall the agent. Refer to
[Uninstall Palette Agent](../../deployment-modes/agent-mode/install-agent-host.md#uninstall-palette-agent) and
[Reinstall Palette Agent](../../deployment-modes/agent-mode/install-agent-host.md#reinstall-palette-agent).

To renew the cluster certificates, refer to
[Renew Cluster PKI Certificates](../../clusters/cluster-management/certificate-management.md).

## Troubleshoot Common Issues

The following issues are common on a Jetson Edge AI deployment.

### Workload Does Not Reach the GPU

A pod reaches the GPU only when its specification sets `runtimeClassName: nvidia` and the `NVIDIA_VISIBLE_DEVICES` and
`NVIDIA_DRIVER_CAPABILITIES` environment variables. Palette detects the GPU when the host registers, but detection does
not expose the GPU to pods. Refer to
[Enable GPU Access for Workloads](./register-jetson-host.md#enable-gpu-access-for-workloads).

### Host Does Not Appear in Palette

To troubleshoot on the device, sign in to [Local UI](../../clusters/edge/local-ui/local-ui.md) with the local
administrator account that you created in the `user-data` file.

1. Confirm that `projectName` in your `user-data` file matches an existing Palette project, and that the host rebooted
   after the agent installed. Refer to [Verify the Host Registers](./register-jetson-host.md#verify-the-host-registers).

2. Check the Palette agent logs on the device.

   ```shell
   sudo journalctl --boot --unit 'spectro-*' --no-pager | tail --lines 20
   ```

3. If the logs repeat `EdgeHostToken is mandatory`, the agent did not read your `user-data` file. Confirm that
   `#cloud-config` is the first line of the file, with no spaces before it, as described in
   [Create the User-Data File](./register-jetson-host.md#create-the-user-data-file). Export `USERDATA` again, and then
   run the installer with `sudo --preserve-env` in the same terminal session. Refer to
   [Install the Palette Agent](./register-jetson-host.md#install-the-palette-agent).

### Model Does Not Respond

1. Confirm that the serving deployment is ready.

   ```shell
   kubectl rollout status deployment/ollama
   ```

2. Send a request to load the model. A pulled model does not load until the first request.

   ```shell
   kubectl exec deployment/ollama -- ollama run <model-name> "In one short sentence, what is edge computing?"
   ```

   Replace `<model-name>` with the model that you pulled, such as `llama3.2:1b`.

3. Confirm that the model is loaded and runs on the GPU. In the output, the `PROCESSOR` column reads `100% GPU`.

   ```shell
   kubectl exec deployment/ollama -- ollama ps
   ```

   If the `PROCESSOR` column shows any CPU share, such as `100% CPU`, refer to
   [Workload Does Not Reach the GPU](#workload-does-not-reach-the-gpu).

For more information, refer to [Serve and Verify the Model](./register-jetson-host.md#serve-and-verify-the-model).

## Decommission the Host

When you finish with the deployment, decommission it in the following order so that Palette releases the host and you
can reuse the device. Before you delete the cluster, save any model data or configuration that you want to keep.

1. From the left main menu, select **Clusters**, and then select the cluster. Select **Settings** > **Delete Cluster**,
   and then enter the cluster name to confirm. Deleting the cluster stops the served model, removes the workloads, and
   releases the Jetson host back to your Edge host inventory.

2. On the Jetson device, uninstall the Palette agent so that the host does not register with Palette again. Refer to
   [Uninstall Palette Agent](../../deployment-modes/agent-mode/install-agent-host.md#uninstall-palette-agent).

3. From the left main menu, select **Clusters**, and then select the **Edge Hosts** tab. Open the three-dot menu for the
   Jetson host, and then select **Delete**.

## Next Steps

To run the full flow on a Jetson AGX Thor, refer to
[Run a Local AI Model on a Jetson Thor at the Edge](../../tutorials/ai/ai-workloads/run-local-ai-model-jetson-thor.md).
For other operations on Edge clusters, refer to
[Cluster Management for Edge Clusters](../../clusters/edge/cluster-management/cluster-management.md).
