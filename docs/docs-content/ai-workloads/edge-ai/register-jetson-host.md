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

This page describes Day 1 of running Edge AI workloads on an NVIDIA Jetson device. You start from a host you prepared in
[Prepare the Jetson Host](./prepare-jetson-host.md). First, you register the device with Palette as an Edge host in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md). Next, you build an Edge Native cluster profile with the
operating system, Kubernetes distribution, and network layers, and deploy the profile to the device. Finally, you deploy
a model server to the cluster and confirm the model responds.

:::info

Appliance mode is not available on ARM64 devices. Refer to [Jetson Requirements](./jetson-requirements.md) for the full
requirements.

:::

## Prerequisites

- A Jetson device prepared as described in [Prepare the Jetson Host](./prepare-jetson-host.md), with the software
  prerequisites installed.
- A Palette tenant
  [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md).
- Permissions to create cluster profiles and deploy clusters in your Palette project.
- `kubectl` installed on a workstation with network access to the Jetson device.

## Create the User-Data File

Create a `user-data` file on the Jetson device. In agent mode, the Palette agent installer reads this file to register
the host with your Palette tenant and project. Unlike appliance mode, the file is not built into an installer image. It
is a plain file on the device that you pass to the installer.

There is no required directory for the file. Create it in your working directory on the device, for example as
`./user-data`, and point the installer at it with the `USERDATA` environment variable in the
[Install the Palette Agent](#install-the-palette-agent) section.

Add the following configuration to the file.

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

Replace `<your-registration-token>` with your Palette registration token and `<strong-password>` with a password for the
local administrator account. If you use a self-hosted Palette instance, replace the `paletteEndpoint` value with your
Palette endpoint.

This set registers the host and creates a local administrator account. Note the following:

- `install.reboot` set to `true` reboots the host after the agent installs. Registration completes on that reboot. If
  you omit it, reboot the host manually after the installer finishes.
- `projectName` must be an existing Palette project that the registration token can access. If you specify a project
  that does not exist, the host does not register and does not appear in Palette. To use the project associated with the
  registration token instead, omit `projectName`.
- The `stages.initramfs.users` block creates a local administrator account named `kairos` in the `sudo` group. If the
  host loses its connection to Palette, use this account to sign in over SSH, at the host terminal, or through
  [Local UI](../../clusters/edge/local-ui/local-ui.md). You can change the username.
- The `#cloud-config` header on the first line is required. Without it, cloud-init skips the block.
- You do not need the disk-partitioning fields under `install:` that appliance-mode installer images use, because the
  agent runs on the existing host operating system.

Two optional settings are useful on a Jetson device:

- `stylus.path` - Redirect the agent's persistent data to an NVMe drive or SSD instead of the default root filesystem.
  This avoids exhausting the on-board eMMC storage. Custom `stylus.path` values can cause deployment issues in some
  configurations, so review the warning in
  [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md) first.
- `stylus.site.caCerts` - Required only if your Palette endpoint presents a certificate signed by a private certificate
  authority (CA).

Refer to [Edge Installer Configuration Reference](../../clusters/edge/edge-configuration/installer-reference.md) for the
full list of configuration options.

## Install the Palette Agent

Point the installer at the `user-data` file, and then download and run the Palette agent installation script on the
device. The installer downloads the agent, unpacks the agent runtime, configures the systemd service, and starts
registration.

1. Export the path to your `user-data` file.

   ```shell
   export USERDATA=./user-data
   ```

2. Download the non-FIPS Palette agent installation script. The FIPS build is not available on JetPack.

   ```shell
   curl --location --output ./palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh
   ```

   For a self-hosted Palette instance, use the **Self-Hosted** command in
   [Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md#enablement).

3. Grant execute permission to the script.

   ```shell
   chmod +x ./palette-agent-install.sh
   ```

4. Run the installer with `sudo --preserve-env` so that it inherits the `USERDATA` variable you exported.

   ```shell
   sudo --preserve-env ./palette-agent-install.sh
   ```

5. Watch the installer output. The installation is complete when the output shows
   `palette edge installation completed successfully`. You can ignore messages about
   `/system/oem/80_stylus_agent_mode.yaml`, such as `because it has no valid header` or `no metadata/userdata found`.

After the host registers, Palette reconciles the agent to the version that matches your Palette instance, so you do not
need to pin an agent version. Refer to
[Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md) for the full agent-mode install
reference, including the SaaS and self-hosted download commands.

## Verify the Host Registers

After the host reboots, the Palette agent registers the device with your tenant, and it appears in your Edge host
inventory.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select the **Edge Hosts** tab.

3. Switch to the project you set in `projectName`, or the project associated with your registration token. The Jetson
   appears as a new Edge host. Use the **Architecture** filter to confirm it is an ARM64 host.

After the host connects to Palette, the **Status** column shows **Ready** and the **Health** column shows **Healthy**.
The **GPU** column lists the device GPU with `0.00 GB` of memory. This value is expected, because the Jetson GPU shares
system memory instead of using dedicated memory.

If the host does not appear, confirm that you are viewing the project set in `projectName` and that the host rebooted
after the agent installed.

## Create the Cluster Profile

Create an Edge Native cluster profile that models the operating system, Kubernetes distribution, and network for the
Jetson device. Use a **Full** profile so that you can add add-on layers later, such as the storage layer described in
[Serve and Verify the Model](#serve-and-verify-the-model).

1. From the left main menu, select **Profiles**, and then select **Add Cluster Profile**.

2. Enter a name, select the **Full** profile type, and then select **Next**.

3. For the **Cloud Type**, select **Edge Native**, and then select **Next**.

4. Add the following core layers. For each layer, select a pack version that supports ARM64.

   | Layer      | Pack                                   | Configuration                                                                                                                                                                                     |
   | ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | OS         | **BYOOS (Edge)** (`edge-native-byoi`)  | In the pack **Values**, expand **Presets** and select **Agent Mode**. This sets `options.system.uri` to `NA`, because agent mode uses the operating system that is already installed on the host. |
   | Kubernetes | **Palette Optimized K3s** (`edge-k3s`) | **Palette Optimized Canonical** (`edge-canonical`) has no ARM64 build, so use K3s on a Jetson device.                                                                                             |
   | Network    | **Flannel** (`cni-flannel`)            | Flannel is the verified Container Network Interface (CNI) for K3s.                                                                                                                                |

5. Complete the profile and save it.

You do not add a layer to enable the GPU. Refer to [Enable GPU Access for Workloads](#enable-gpu-access-for-workloads)
for how a workload reaches the device GPU. For the full profile-creation flow, refer to
[Create an Edge Native Cluster Profile](../../clusters/edge/site-deployment/model-profile.md).

## Deploy the Cluster

Deploy the cluster profile to the registered Jetson host to create a single-node Edge cluster that runs both the control
plane and your workloads.

1. From the left main menu, select **Clusters**, and then select **Add New Cluster**.

2. Select **Edge Native**, and then select **Start Edge Native Configuration**.

3. Enter the cluster basic information, and then select **Next**.

4. Select the cluster profile you created, and then continue through the profile layers.

5. In the node pool configuration, set the pool **Architecture** to **ARM64** first, and then add the registered Jetson
   host to the pool. The host appears in the list of hosts to add only after you set the architecture to **ARM64**.

6. Review the settings and deploy the cluster.

When the deployment finishes, the cluster status is **Running** and its health is **Healthy**.

## Enable GPU Access for Workloads

Run the `kubectl` commands on this page from a workstation that can reach the cluster. Download the cluster kubeconfig
file from the cluster **Overview** page, and then export its path. Refer to
[Kubeconfig](../../clusters/cluster-management/kubeconfig.md) for details.

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

A workload reaches the GPU when its pod specification does both of the following:

- Sets `runtimeClassName` to `nvidia`.
- Requests the GPU with the `NVIDIA_VISIBLE_DEVICES` and `NVIDIA_DRIVER_CAPABILITIES` environment variables.

Use a test pod to confirm that a workload reaches the GPU.

1. Save the following example pod as `gpu-check.yaml`. The pod requests the GPU and prints the GPU status.

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

When the runtime injects the GPU, the container has the `/dev/nvidia*` devices, and `nvidia-smi` reports the device even
though the image is not a CUDA image. A pod that omits the two environment variables does not receive the GPU, because
the NVIDIA container runtime injects the GPU only when the workload requests it.

## Serve and Verify the Model

Deploy a model server that runs on the GPU, pull a model, and confirm that it responds. This example uses
[Ollama](https://ollama.com/), which serves local models over an HTTP API. The serving pod uses the same GPU access
pattern described in [Enable GPU Access for Workloads](#enable-gpu-access-for-workloads).

1. Save the following `Deployment` and `Service` for Ollama as `ollama.yaml`. The pod sets `runtimeClassName` and the
   `NVIDIA_*` environment variables so that it reaches the device GPU.

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

5. Confirm the model runs on the GPU. Because `ollama ps` lists only loaded models, run it only after step 4 loads the
   model. In the output, the `PROCESSOR` column reads `100% GPU`, which confirms that the model runs on the Jetson GPU
   instead of the CPU.

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

## Next Steps

The Jetson device now runs a local AI model managed by Palette. To learn about ongoing operations, continue to the Day 2
operations guide. For a complete end-to-end guide, refer to
[Run a Local AI Model on a Jetson Thor at the Edge](../../tutorials/ai/ai-workloads/run-local-ai-model-jetson-thor.md).

<!-- TODO(DOC-3091): link the Day 2 operations page (day-2-operations.md) here once it is merged. -->
