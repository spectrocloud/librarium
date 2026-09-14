---
sidebar_label: "Register a Jetson Host and Serve a Model"
title: "Register a Jetson Host and Serve a Model"
description:
  "Register an NVIDIA Jetson device with Palette in agent mode, deploy an Edge Native cluster profile, and serve a local
  AI model on the device GPU."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "day 1"]
---

<!-- SCAFFOLD (DOC-3090 Day 1). Structure and verified-from-docs prose are seeded here; every device-specific value (agent install output, the ARM64 distribution/CNI, the embedded-GPU layer, and the model-serving layer) is a TODO gated on validation on the Thor. Do not publish until the TODOs and VERIFY markers are resolved. The serving-stack choice (Ollama ARM64, fallback llama.cpp) is tentative pending Thor validation and product sign-off. -->

This page describes Day 1 of running Edge AI workloads on an NVIDIA Jetson device. Starting from a host you prepared in
[Prepare the Jetson Host](./prepare-jetson-host.md), you register the device with Palette as an Edge host in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md), model the operating system, Kubernetes distribution, and
AI serving workload as an Edge Native cluster profile, deploy that profile to the device, and confirm the model
responds.

:::info

Palette registers the Jetson device using agent mode, in which the Palette agent on the device makes an outbound
connection to Palette. Appliance mode is not available on ARM64 devices. Refer to
[Jetson Requirements](./jetson-requirements.md) for the full requirements.

:::

## Prerequisites

- A Jetson device prepared as described in [Prepare the Jetson Host](./prepare-jetson-host.md), with the software
  prerequisites installed.
- A Palette tenant
  [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md).
- Permissions to create cluster profiles and deploy clusters in your Palette project.

## Create the user-data file

Create a `user-data` file on the Jetson device. In agent mode, the Palette agent installer reads this file to register
the host with your Palette tenant and project. Unlike appliance mode, the file is not built into an installer image. It
is a plain file on the device that you pass to the installer.

There is no required directory for the file. Create it in your working directory on the device, for example as
`./user-data`, and point the installer at it with the `USERDATA` environment variable in the
[Install the Palette agent](#install-the-palette-agent) section.

<!-- Validated on the Thor 2026-09-14 (agent v4.8.29): edgeHostToken + paletteEndpoint + a valid projectName registers the host. install.reboot: true triggers the post-install reboot that completes registration. A projectName that does not exist silently fails to register (the host never appears in Palette). Appliance/EdgeForge stanzas (disk install: fields, users:, stages:) do not apply on a BYO host. -->

```yaml
#cloud-config
install:
  reboot: true
stylus:
  site:
    edgeHostToken: "<your-registration-token>"
    paletteEndpoint: "console.spectrocloud.com"
    projectName: "Default"
```

This set is enough to register the host. Note the following:

- `install.reboot` set to `true` reboots the host after the agent installs. Registration completes on that reboot. If
  you omit it, reboot the host manually after the installer finishes.
- `projectName` must be an existing Palette project that the registration token can access. If you specify a project
  that does not exist, the host does not register and does not appear in Palette. To use the project associated with the
  registration token instead, omit `projectName`.
- The `#cloud-config` header on the first line is required. Without it, cloud-init skips the block.
- You do not need the disk-partitioning fields under `install:`, the `users:` stanza, or `stages:` that appliance-mode
  installer images use, because the agent runs on the existing host operating system.

Two optional settings are useful on a Jetson:

- `stylus.path` - Redirect the agent's persistent data to an NVMe drive or SSD instead of the default root filesystem.
  This avoids exhausting the on-board eMMC storage.
- `stylus.site.caCerts` - Required only if your Palette endpoint presents a certificate signed by a private certificate
  authority (CA).

Refer to [Edge Installer User Data](../../clusters/edge/site-deployment/site-installation/site-user-data.md) for the
full list of configuration options.

## Install the Palette agent

Point the installer at the `user-data` file, then download and run the Palette agent installation script on the device.
The installer downloads the agent, unpacks the agent runtime, configures the systemd service, and starts registration.

<!-- TODO(DOC-3090): Confirm which agent version the ARM64 install script resolves to and whether to pin a 4.10.x-matching tag. Validated on the Thor 2026-09-14: the script resolved to agent v4.8.29 against Palette 4.10.16, which is within the N-2 agent compatibility window; Palette reconciles the agent version on cluster provisioning unless pinned. Steps below mirror install-agent-host.md (steps 5-8): export USERDATA, download the script, chmod, then run with sudo --preserve-env. Do NOT use a `curl | sudo bash` pipe. A JetPack (Ubuntu-based) host uses the non-FIPS script, because the FIPS build is RHEL/Rocky only. -->

1. Export the path to your `user-data` file.

   ```shell
   export USERDATA=./user-data
   ```

2. Download the Palette agent installation script for Palette SaaS or your self-hosted instance, then grant it execute
   permission.

   ```shell
   chmod +x ./palette-agent-install.sh
   ```

   :::info

   Find the download command for both the FIPS and non-FIPS builds in step 6 of the **Enablement** section on the
   [Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md#enablement) page. That step also
   distinguishes the Palette SaaS and self-hosted commands.

   :::

3. Run the installer with `sudo --preserve-env` so that it inherits the `USERDATA` variable you exported.

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

Refer to [Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md) for the full agent-mode
install reference, including the SaaS and self-hosted download commands and the FIPS-compliant variant.

:::info

During installation, the agent log might show an error such as
`Error on file /system/oem/80_stylus_agent_mode.yaml on stage Pull userdata: no metadata/userdata found`, followed by a
warning that the `before-install` stage had one error. This is expected on a Jetson and does not indicate a failed
install. The installer reads your local `user-data` file directly. The `Pull userdata` stage separately probes for a
cloud metadata source, such as a CD-ROM or a cloud provider metadata service, which a bare device does not have.
Installation continues and reports `palette edge installation completed successfully` when it finishes.

:::

## Verify the host registers

After the host reboots, the Palette agent registers the device with your tenant, and it appears in your Edge host
inventory.

<!-- Validated on the Thor 2026-09-14; screenshot still TODO(DOC-3090). -->

1. Log in to [Palette](https://console.spectrocloud.com).
2. From the left **Main Menu**, select **Clusters**, and then select the **Edge Hosts** tab.
3. Switch to the project you set in `projectName`, or the project associated with your registration token. The Jetson
   appears as a new Edge host. Use the **Architecture** filter to confirm it is an ARM64 host.

Once the host connects to Palette, it shows a **Ready** status and a **Healthy** state. Palette also detects the device
GPU and lists it in the **GPU** column. For a Jetson AGX Thor, this reads as `1 NVIDIA Thor`.

:::info

If the host does not appear, confirm that the `projectName` in your `user-data` matches an existing Palette project and
that you are viewing that project. A host registered with a `projectName` that does not exist never appears in Palette.
Also confirm that the host rebooted after the agent installed, because registration completes on that reboot.

:::

## Create the cluster profile

Create an Edge Native cluster profile that models the operating system, Kubernetes distribution, and network for the
Jetson device. Use a **Full** profile so that you can add the model-serving workload to the same profile.

<!-- Validated on the Thor 2026-09-14: Full profile = BYOOS (Edge) Agent Mode + Palette Optimized K3S + Flannel, all ARM64-compatible. edge-canonical has no ARM64 build. Thor support statement still gated on DOC-3093 (Rishi). Model-serving layer pending (Option 2). -->

1. From the left **Main Menu**, select **Profiles**, and then select **Add Cluster Profile**.
2. Enter a name, select the **Full** profile type, and then select **Next**.
3. For the **Cloud Type**, select **Edge Native**, and then select **Next**.
4. Add the following core layers. For each layer, select a pack version that supports ARM64.

   | Layer      | Pack                               | Configuration                                                                                                                                                                              |
   | ---------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | OS         | BYOOS (Edge) (`edge-native-byoi`)  | In the pack **Values**, expand **Presets** and select **Agent Mode**. This sets `options.system.uri` to `NA`, because agent mode manages the operating system that is already on the host. |
   | Kubernetes | Palette Optimized K3s (`edge-k3s`) | Palette Optimized Canonical (`edge-canonical`) has no ARM64 build, so use K3s on a Jetson.                                                                                                 |
   | Network    | Flannel (`cni-flannel`)            | Flannel is the verified Container Network Interface (CNI) for K3s.                                                                                                                         |

5. Complete the profile and save it.

You do not add a layer to enable the GPU. Refer to [Enable GPU access for workloads](#enable-gpu-access-for-workloads)
for how a workload reaches the device GPU. For the full profile-creation flow, refer to
[Create an Edge Native Cluster Profile](../../clusters/edge/site-deployment/model-profile.md).

## Deploy the cluster

Deploy the cluster profile to the registered Jetson host to create a single-node Edge cluster that runs both the control
plane and your workloads.

1. From the left **Main Menu**, select **Clusters**, and then select **Add New Cluster**.
2. Select **Edge Native** as the cluster type, and then start the Edge Native configuration.
3. Enter the cluster basic information, and then select **Next**.
4. Select the cluster profile you created, and then continue through the profile layers.
5. In the node pool configuration, set the pool **Architecture** to **ARM64**, and then add the registered Jetson host
   to the pool.
6. Review the settings and deploy the cluster.

:::warning

In the node pool **Pool Configuration**, the **Architecture** field defaults to **AMD64**. Change it to **ARM64** for a
Jetson device. If you leave the default, the cluster does not build correctly.

:::

The cluster deploys as a single node that runs both the control plane and workloads. When the deployment finishes, the
cluster reaches a **Running** state and a **Healthy** status.

<!-- Validated on the Thor 2026-09-14: node Ready, K3s v1.36.2+k3s1, arch arm64, kernel 6.8.12-1021-tegra, Ubuntu 24.04.5; Flannel and kube-vip pods Running, all system pods healthy. The ARM64 node-pool default is AMD64 and must be changed by hand. -->

## Enable GPU access for workloads

Palette detects the Jetson GPU when the host registers, but detection does not expose the GPU to your workloads. On
JetPack, the K3s container runtime automatically registers an `nvidia`
[RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) that routes a pod through the NVIDIA
container runtime. You do not add a GPU layer to the cluster profile, and you do not use the

<VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack, which does not
support embedded devices such as the Jetson.

A workload reaches the GPU when its pod specification does both of the following:

- Sets `runtimeClassName` to `nvidia`.
- Requests the GPU with the `NVIDIA_VISIBLE_DEVICES` and `NVIDIA_DRIVER_CAPABILITIES` environment variables.

The following example pod requests the GPU and prints the GPU status.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-check
spec:
  runtimeClassName: nvidia
  restartPolicy: Never
  containers:
    - name: check
      image: ubuntu:24.04
      env:
        - name: NVIDIA_VISIBLE_DEVICES
          value: "all"
        - name: NVIDIA_DRIVER_CAPABILITIES
          value: "all"
      command: ["bash", "-lc", "nvidia-smi"]
```

Apply the pod and review its logs.

```shell
kubectl apply --filename gpu-check.yaml
kubectl logs gpu-check
```

When the runtime injects the GPU, the container has the `/dev/nvidia*` devices, and `nvidia-smi` reports the device even
though the image is not a CUDA image. A pod that omits the two environment variables does not receive the GPU, because
the NVIDIA container runtime injects the GPU only when the workload requests it.

<!-- Validated on the Thor 2026-09-14: pod with runtimeClassName nvidia + NVIDIA_VISIBLE_DEVICES=all + NVIDIA_DRIVER_CAPABILITIES=all got /dev/nvidia0,1,ctl,uvm-tools and nvidia-smi reported NVIDIA Thor (driver 595.78, CUDA 13.2) inside a plain ubuntu:24.04 image. Without the env vars: no /dev/nvidia*. The nvidia RuntimeClass is auto-created by K3s/containerd on JetPack; no profile layer or device plugin needed. Confirm blessed pattern with Rishi (DOC-3093 Q3). -->

## Serve and verify the model

After the cluster reaches a healthy state, the model-serving workload runs on the device and exposes a serving endpoint.
The serving workload uses the same GPU access pattern described in
[Enable GPU access for workloads](#enable-gpu-access-for-workloads). Confirm the model responds.

<!-- TODO(DOC-3090): Document the model-serving layer and verification (Option 2). Deploy the serving workload (Ollama on ARM64, tentative pending validation and product sign-off; llama.cpp fallback) with runtimeClassName nvidia + the NVIDIA_* env vars, then capture the real endpoint, port, and an example request/response from the Thor. -->

## Next steps

The Jetson device now runs a local AI model managed by Palette. To learn about ongoing operations, continue to

<!-- TODO(DOC-3091): link the Day 2 operations page once it exists. -->

the Day 2 operations guide. For a complete end-to-end guide, refer to

<!-- TODO(DOC-3092): link the "Run a local AI model on a Jetson at the edge" tutorial once it exists. -->

the tutorial.
