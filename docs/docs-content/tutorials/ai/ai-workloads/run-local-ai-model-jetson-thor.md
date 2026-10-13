---
sidebar_position: 0
sidebar_label: "Run a Local AI Model on a Jetson Thor"
title: "Run a Local AI Model on a Jetson Thor at the Edge"
description:
  "Flash an NVIDIA Jetson AGX Thor, register it with Palette in agent mode, deploy an Edge Native cluster, and serve a
  local AI model on the device GPU."
tags: ["ai workloads", "edge", "nvidia", "jetson", "tutorial"]
category: ["tutorial"]
toc_max_heading_level: 2
---

Edge locations increasingly run AI inference locally, close to where data is generated, instead of sending that data to
a central cloud. NVIDIA Jetson devices pair a power-efficient ARM64 system with an integrated GPU, which makes them a
common platform for edge AI. Palette manages a Jetson as an Edge host, so you deploy and operate a Kubernetes cluster
and its AI workloads on the device with the same profile-driven workflow you use everywhere else.

In this tutorial, you take an NVIDIA Jetson AGX Thor Developer Kit from a bare device to a running large language model
(LLM) that answers prompts on the device GPU, all managed by Palette. You serve the model with
[Ollama](https://ollama.com/).

The tutorial covers the following stages:

- Flash JetPack onto the Jetson and install the operating system.

- Prepare the host with the Palette agent prerequisites.

- Register the device with Palette as an Edge host in agent mode.

- Create an Edge Native cluster profile and deploy a single-node cluster.

- Enable GPU access for a workload and serve a local AI model.

- Clean up the resources you created.

:::info

Palette manages a Jetson in [agent mode](../../../deployment-modes/agent-mode/agent-mode.md), in which the Palette agent
on the device makes an outbound connection to Palette. Appliance mode is not available on ARM64 devices. Refer to
[Jetson Requirements](../../../ai-workloads/edge-ai/jetson-requirements.md) for the full requirements.

:::

## Prerequisites

- An NVIDIA Jetson AGX Thor Developer Kit, with its power supply, a monitor, and a USB keyboard.

- An empty USB drive, 16 GB or larger, for the JetPack installer.

- A workstation with a disk-imaging tool, such as [Etcher](https://etcher.balena.io/), to write the installer image.

- The [kubectl](https://kubernetes.io/docs/reference/kubectl/) command-line tool on a workstation with network access to
  the Jetson.

- A Palette tenant and a project that you can register hosts into, with the **Project Admin** role in that project or a
  custom role with the same permissions to register Edge hosts, create cluster profiles, and deploy clusters. Refer to
  [Project Scope Roles and Permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md).

- A Palette Edge host
  [registration token](../../../clusters/edge/site-deployment/site-installation/create-registration-token.md).

- Outbound HTTPS connectivity from the Jetson to `console.spectrocloud.com` and the Palette pack and image registries.
  Because agent mode is outbound only, a device behind NAT works without inbound firewall rules.

## Flash JetPack and Install the Operating System

Write an NVIDIA installer image to a USB drive, boot the Thor from it, and install the operating system onto the
on-board NVMe SSD. This tutorial uses JetPack 7.2.1, which includes NVIDIA Jetson Linux (L4T) r39.2.1. For the
authoritative procedure, refer to NVIDIA's
[Jetson AGX Thor Developer Kit Quick Start Guide](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html).

1. On your workstation, download the AGX Thor installer image from the
   [JetPack download page](https://developer.nvidia.com/embedded/jetpack).

2. Write the image to your USB drive with Etcher. Select the image, select the USB drive, and then flash it. You must
   write the image with an imaging tool. Copying the image file onto the drive does not create a bootable installer.

3. Plug the USB drive into the Thor, connect a monitor and keyboard, and then press the power button.

4. At the pre-boot prompt, press **ENTER** or wait for the timeout to boot the installer.

   If the device does not boot from USB, press **ESC** at the NVIDIA logo to enter the UEFI setup. Open **Boot
   Manager**, move the USB drive to the top of the boot order, and then select **Save & Exit**.

5. _(Optional)_ If the device prompts you to update the firmware capsule, confirm the update and wait for it to finish.

6. At the GRUB menu, select **Install on NVMe**. The installation runs for approximately 10 minutes and then reboots the
   device.

7. Remove the USB drive as soon as the device reboots, so that it does not boot into the installer again.

8. Complete the Ubuntu first-boot wizard to set the keyboard layout, license, network, time zone, and a local username
   and password. Palette does not require Ubuntu Pro. If you turn on Ubuntu Pro, do not enable the FIPS kernel, FIPS
   updates, or real-time kernel services, because those services try to replace the Jetson Linux (L4T) kernel.

9. Confirm the operating system versions. The first command reports the Jetson Linux (L4T) release, and the second
   command reports the Ubuntu base version, which is 24.04.

   ```shell
   cat /etc/nv_tegra_release
   lsb_release --all
   ```

   The device reports a firmware string, such as `38.0.0-gcid-...`, at first boot. That value is the UEFI firmware
   version, not the JetPack or L4T version.

## Prepare the Host

Install the Palette agent prerequisites on the Jetson. JetPack is Ubuntu-based, so you use `apt-get` to install the
packages and enable the required services. For the full host-preparation reference, refer to
[Prepare the Jetson Host](../../../ai-workloads/edge-ai/prepare-jetson-host.md).

1. Connect to the Thor over SSH or use the local terminal, and then install the prerequisite packages.

   ```shell
   sudo apt-get update && sudo apt-get install --yes --no-install-recommends \
     bash jq zstd rsync systemd-timesyncd conntrack iptables rsyslog
   ```

2. Enable the required system services.

   ```shell
   sudo systemctl enable --now systemd-timesyncd
   sudo systemctl enable --now systemd-resolved
   sudo systemctl enable --now rsyslog
   ```

   JetPack already runs `systemd-networkd`, so you do not need to enable it.

## Register the Jetson Host with Palette

Register the prepared device with your Palette tenant. In agent mode, the Palette agent installer reads a `user-data`
file to register the host, and then Palette adds it to your Edge host inventory. For the full registration reference,
including optional settings for a Jetson device, refer to
[Register a Jetson Host and Serve a Model](../../../ai-workloads/edge-ai/register-jetson-host.md).

1. On the Thor, create a `user-data` file in your working directory with the following content.

   ```yaml
   #cloud-config
   install:
     reboot: true
   stylus:
     site:
       edgeHostToken: "<your-registration-token>"
       paletteEndpoint: "console.spectrocloud.com"
       projectName: "Default"
   stages:
     initramfs:
       - users:
           kairos:
             groups:
               - sudo
             passwd: "<strong-password>"
   ```

   Replace `<your-registration-token>` with your registration token and `<strong-password>` with a strong password.

   Note the following about this file:

   - The `#cloud-config` header on the first line is required. Without it, cloud-init skips the block.

   - `install.reboot` set to `true` reboots the host after the agent installs. Registration completes on that reboot.

   - `projectName` must be an existing Palette project that the registration token can access. A project name that does
     not exist fails silently, and the host never appears in Palette. To use the token's own project, omit the field.

   - The `stages.initramfs.users` block creates a local administrator account named `kairos` in the `sudo` group. If the
     host loses its connection to Palette, use this account to sign in over SSH, at the host terminal, or through
     [Local UI](../../../clusters/edge/local-ui/local-ui.md).

   Refer to [Edge Installer Configuration Reference](../../../clusters/edge/edge-configuration/installer-reference.md)
   for the full list of configuration options.

2. Export the path to the `user-data` file.

   ```shell
   export USERDATA=./user-data
   ```

3. Download the non-FIPS Palette agent installation script for Palette SaaS, and then grant it execute permission. The
   FIPS build is available only for Red Hat Enterprise Linux and Rocky Linux 8.

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
   chmod +x ./palette-agent-install.sh
   ```

4. Run the installer with `sudo --preserve-env` so that it inherits the `USERDATA` variable.

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

   The installer downloads the agent, configures the systemd service, and starts registration. You can ignore messages
   about skipping a metadata or user-data source, such as `Pull userdata: no metadata/userdata found`. When the
   installer reports `palette edge installation completed successfully`, the host reboots.

5. After the host reboots, log in to [Palette](https://console.spectrocloud.com). From the left main menu, select
   **Clusters**, and then select the **Edge Hosts** tab.

6. Switch to the project that you set in `projectName` or, if you omitted it, the project associated with your
   registration token. The Jetson appears as a new Edge host. Use the **Architecture** filter to confirm that it is an
   ARM64 host.

   After the host connects, the **Status** column shows **Ready**, the **Health** column shows **Healthy**, and the
   **GPU** column lists the device GPU with `0.00 GB` of memory. This value is expected, because the Jetson GPU shares
   system memory instead of using dedicated memory.

## Create the Cluster Profile

Create an Edge Native cluster profile that models the operating system, Kubernetes distribution, and network for the
Jetson. Use a **Full** profile so that you can add add-on layers later, such as the storage layer described in
[Serve a Model on the GPU](#serve-a-model-on-the-gpu).

1. From the left main menu, select **Profiles**, and then select **Add Cluster Profile**.

2. Enter a name, select the **Full** profile type, and then select **Next**.

3. For the **Cloud Type**, select **Edge Native**, and then select **Next**.

4. Add the following core layers. For each layer, select a pack version that supports ARM64. This tutorial does not need
   a storage layer.

   | Layer      | Pack                                   | Configuration                                                                                                                                                                              |
   | ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | OS         | **BYOOS (Edge)** (`edge-native-byoi`)  | In the pack **Values**, expand **Presets** and select **Agent Mode**. This sets `options.system.uri` to `NA`, because agent mode manages the operating system that is already on the host. |
   | Kubernetes | **Palette Optimized K3s** (`edge-k3s`) | **Palette Optimized Canonical** (`edge-canonical`) has no ARM64 build, so use K3s on a Jetson.                                                                                             |
   | Network    | **Flannel** (`cni-flannel`)            | Flannel is the verified Container Network Interface (CNI) for K3s.                                                                                                                         |

5. Complete the profile and save it.

For the full profile-creation flow, refer to
[Create an Edge Native Cluster Profile](../../../clusters/edge/site-deployment/model-profile.md).

## Deploy the Cluster

Deploy the cluster profile to the registered Jetson host to create a single-node Edge cluster that runs both the control
plane and your workloads.

1. From the left main menu, select **Clusters**, and then select **Add New Cluster**.

2. Select **Edge Native**, and then select **Start Edge Native Configuration**.

3. Enter the cluster basic information, and then select **Next**.

4. Select the cluster profile that you created, and then continue through the profile layers.

5. In the node pool configuration, set the pool **Architecture** to **ARM64**, and then add the registered Jetson host
   to the pool. The **Architecture** field defaults to **AMD64**, and the Jetson host appears in the list of available
   hosts only after you select **ARM64**.

6. Review the settings and deploy the cluster.

When the deployment finishes, the cluster status is **Running** and its health is **Healthy**.

## Enable GPU Access for a Workload

Run the `kubectl` commands in this tutorial from your workstation, in the same terminal session. Download the cluster
kubeconfig file from the cluster **Overview** page, and then export its path. Refer to
[Kubeconfig](../../../clusters/cluster-management/kubeconfig.md) for details.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file you downloaded.

<!-- prettier-ignore-start -->

Palette detects the Jetson GPU when the host registers, but detection does not expose the GPU to your workloads. On
JetPack, the K3s container runtime automatically registers an `nvidia`
[RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) that routes a pod through the NVIDIA
container runtime. You do not add a GPU layer to the cluster profile, and you do not use the
<VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack, which does not
support embedded devices such as the Jetson.

<!-- prettier-ignore-end -->

A workload reaches the GPU when its pod specification sets `runtimeClassName` to `nvidia` and requests the GPU with the
`NVIDIA_VISIBLE_DEVICES` and `NVIDIA_DRIVER_CAPABILITIES` environment variables. A pod that omits these environment
variables does not receive the GPU.

1. Create a file named `gpu-check.yaml` with the following content.

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

2. Apply the pod.

   ```shell
   kubectl apply --filename gpu-check.yaml
   ```

3. Wait for the pod to finish.

   ```shell
   kubectl wait pod/gpu-check --for=jsonpath='{.status.phase}'=Succeeded --timeout=120s
   ```

4. Review the pod logs. The `nvidia-smi` output lists the Jetson GPU.

   ```shell
   kubectl logs gpu-check
   ```

   ```text hideClipboard title="Example Output"
   Tue Oct  6 12:13:37 2026
   +-----------------------------------------------------------------------------------------+
   | NVIDIA-SMI 595.78                 Driver Version: 595.78         CUDA Version: 13.2     |
   +-----------------------------------------+------------------------+----------------------+
   | GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
   | Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
   |                                         |                        |               MIG M. |
   |=========================================+========================+======================|
   |   0  NVIDIA Thor                    Off |   00000000:01:00.0 Off |                  N/A |
   | N/A   35C  N/A               1W /  N/A  | Not Supported          |      0%      Default |
   |                                         |                        |             Disabled |
   +-----------------------------------------+------------------------+----------------------+

   +-----------------------------------------------------------------------------------------+
   | Processes:                                                                              |
   |  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
   |        ID   ID                                                               Usage      |
   |=========================================================================================|
   |  No running processes found                                                             |
   +-----------------------------------------------------------------------------------------+
   ```

5. Delete the test pod.

   ```shell
   kubectl delete --filename gpu-check.yaml
   ```

## Serve a Model on the GPU

Deploy a model server that runs on the GPU, pull a model, and confirm that it responds. This example uses Ollama, which
serves local models over an HTTP API. The serving pod uses the same GPU access pattern as
[Enable GPU Access for a Workload](#enable-gpu-access-for-a-workload).

1. Create a file named `ollama.yaml` with the following content.

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: ollama
     labels:
       app: ollama
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: ollama
     template:
       metadata:
         labels:
           app: ollama
       spec:
         runtimeClassName: nvidia
         containers:
           - name: ollama
             image: ollama/ollama:latest
             ports:
               - containerPort: 11434
             env:
               - name: NVIDIA_VISIBLE_DEVICES
                 value: "all"
               - name: NVIDIA_DRIVER_CAPABILITIES
                 value: "all"
               - name: OLLAMA_HOST
                 value: "0.0.0.0"
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: ollama
   spec:
     selector:
       app: ollama
     ports:
       - port: 11434
         targetPort: 11434
   ```

2. Apply the manifest and wait for the deployment to roll out.

   ```shell
   kubectl apply --filename ollama.yaml
   kubectl rollout status deployment/ollama
   ```

3. Pull a model into the running server. The pull downloads the model but does not load it. Ollama loads a model into
   the GPU on the first request.

   ```shell
   kubectl exec deployment/ollama -- ollama pull llama3.2:1b
   ```

4. Send a request to load and exercise the model. The response confirms that the model serves inference.

   ```shell
   kubectl exec deployment/ollama -- ollama run llama3.2:1b "In one short sentence, what is edge computing?"
   ```

   ```text hideClipboard title="Example Output"
   Edge computing is a computing model where processing and analysis of data
   occur at the edge of a network, closer to the data source, rather than at
   a central server or cloud.
   ```

5. Confirm that the model runs on the GPU. Because `ollama ps` lists only loaded models, run it after step 4. In the
   output, the `PROCESSOR` column reads `100% GPU`, which confirms that the model runs on the Jetson GPU instead of the
   CPU.

   ```shell
   kubectl exec deployment/ollama -- ollama ps
   ```

   ```text hideClipboard title="Example Output"
   NAME         ID              SIZE      PROCESSOR    CONTEXT    UNTIL
   llama3.2:1b  baf6a787fdff    6.4 GB    100% GPU     131072     4 minutes from now
   ```

6. To reach the model over its HTTP API from your workstation, forward the `Service` port.

   ```shell
   kubectl port-forward service/ollama 11434:11434
   ```

7. In a second terminal, call the Ollama API. The response contains the model completion, which confirms that the
   endpoint serves inference from the device GPU.

   ```shell
   curl http://localhost:11434/api/generate \
     --data '{"model":"llama3.2:1b","prompt":"In one short sentence, what is edge computing?","stream":false}'
   ```

   ```json hideClipboard title="Example Output"
   {
     "model": "llama3.2:1b",
     "created_at": "2026-10-06T12:30:58.015015559Z",
     "response": "Edge computing is a method of processing and analyzing data at the edge of the network, closer to the source of the data, rather than at a centralized server.",
     "done": true,
     "done_reason": "stop",
     "context": [128006, 9125, 128007, ...],
     "total_duration": 335386715,
     "load_duration": 2898824,
     "prompt_eval_count": 35,
     "prompt_eval_cached_count": 34,
     "prompt_eval_duration": 30516000,
     "eval_count": 33,
     "eval_duration": 298859000
   }
   ```

:::info

Without a persistent volume, the pulled model is stored in the pod and is lost if the pod restarts. To keep models
across restarts, add a storage layer to the cluster profile and mount a `PersistentVolumeClaim` at `/root/.ollama`.

:::

## Cleanup

Remove the resources that you created in this tutorial.

1. Stop the port forward. In the first terminal, press **CTRL + C**.

2. Delete the workloads from the cluster.

   ```shell
   kubectl delete --filename ollama.yaml
   ```

3. From the left main menu, select **Clusters**, and then select the cluster that you deployed. Select **Settings** >
   **Delete Cluster**, and then enter the cluster name to confirm. Deleting the cluster releases the Jetson host.

4. From the left main menu, select **Profiles**. Open the three-dot menu for the cluster profile that you created, and
   then select **Delete**.

5. On the Jetson, uninstall the Palette agent so that the host does not register with Palette again. Refer to
   [Uninstall Palette Agent](../../../deployment-modes/agent-mode/install-agent-host.md#uninstall-palette-agent) for the
   procedure.

6. From the left main menu, select **Clusters**, and then select the **Edge Hosts** tab. Open the three-dot menu for the
   Jetson host, and then select **Delete**.

## Wrap-Up

In this tutorial, you flashed an NVIDIA Jetson AGX Thor, registered it with Palette in agent mode, deployed a
single-node Edge Native cluster, and served a local AI model that runs on the device GPU. Because Palette manages the
device with a cluster profile, you can version the operating system and Kubernetes layers and roll changes out to the
device the same way you manage clusters elsewhere.

To learn more about running Edge AI workloads on Jetson devices, refer to the
[Jetson Edge AI](../../../ai-workloads/edge-ai/edge-ai.md) guide, which covers the host requirements, host preparation,
and ongoing operations in more detail.
