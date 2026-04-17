---
sidebar_label: "NVIDIA GPU Operator Pack"
title: "Enable AI Workloads with the NVIDIA GPU Operator Pack"
description:
  "Add the nvidia-gpu-operator-ai pack to a Palette cluster profile to simplify GPU infrastructure management and enable
  AI workloads on your cluster nodes."
tags: ["gpu", "nvidia", "ai workloads", "cuda", "packs", "gpu operator"]
sidebar_position: 10
---

<!-- prettier-ignore-start -->

You can use the <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack
to simplify the provisioning and management of GPU infrastructure for AI workloads on your Palette-managed clusters.
This pack bundles the [GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html)
alongside supporting components for driver management, node labeling, and monitoring. Follow this guide to add the pack
to a cluster profile and verify that GPU workloads can run on your nodes.

<!-- prettier-ignore-end -->

![NVIDIA GPU Operator architecture](/ai-workloads/nvidia-gpu-operator_architecture.webp)

## Prerequisites

- A Palette account with permissions to create and manage cluster profiles and clusters. Refer to
[Roles and Permissions](/user-management/palette-rbac/resource-scope-roles-permissions) for details.
<!-- prettier-ignore-start -->
- <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack version
    25.10.0 or later available in a Palette-registered registry. Refer to [Registries](/registries-and-packs/registries/) for
    information on adding registries to Palette.
  <!-- prettier-ignore-end -->
- A Palette-managed cluster with nodes that are VMs with GPU passthrough enabled, VMs with NVIDIA vGPUs, or bare metal
  servers with GPUs. If you do not have a cluster yet, refer to [Clusters](/clusters/) for deployment guides.
- At least one node equipped with a dedicated NVIDIA GPU. Embedded products such as NVIDIA Jetson are not supported.
- A supported OS and Kubernetes version. Refer to the
  [NVIDIA GPU Operator Platform Support](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/platform-support.html)
  page for details.

## Create Add-on Cluster Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. From the **Cluster Profiles** table, select **Add Cluster Profile**.

   :::tip

   Alternatively, if your GPU-enabled cluster was deployed using a
   [full cluster profile](/profiles/cluster-profiles/create-cluster-profiles/create-full-profile/), you can select it
   and add the NVIDIA GPU Operator as an additional pack to your cluster profile stack. We recommend
   [creating a new cluster profile version](/profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile/)
   before making any changes.

   :::

4. Enter a unique **Name** for the cluster profile and choose a cluster profile **Type** of **Add-on**. Select **Next**.

5. On the **Profile Layers** step, select **Add New Pack**.

6. Search for `nvidia gpu operator` and select the **Nvidia GPU Operator** pack.

7. Select a **Pack Version** of **25.10.0** or later.

<!-- prettier-ignore-start -->

8. Review the pack **Values**. The default values and parameters are sufficient for most deployments. For additional
customization options and bundled capabilities, refer to the
  <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack page.

<!-- prettier-ignore-end -->

9. Select **Confirm & Create** to return to the **Profile Layers** page. Select **Next**.

10. Review your cluster profile. If no changes are needed, select **Finish Configuration**.

## Add Profile to Cluster

Once you have created an add-on profile, attach it to your GPU-enabled cluster. If you added the NVIDIA GPU Operator
pack to an existing full profile, update the cluster profile version to the version that includes your changes. The
initial driver compilation on GPU nodes can take several minutes. Refer to
[Update a Cluster](/clusters/cluster-management/cluster-updates/) for more information.

## Validate

Confirm the GPU Operator is running correctly by verifying that GPU nodes are labeled and that a GPU workload can run
successfully on the cluster.

### Verify GPU Node Labels

To verify your cluster is ready to run GPU workloads, verify the cluster nodes have the label
`feature.node.kubernetes.io/pci-10de.present=true`. This filter is automatically applied using Node Feature Discovery
(NFD) when a NVIDIA Peripheral Component Interconnect (PCI) device is detected.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Choose your GPU-enabled cluster from the **Clusters** table.

4. Download the kubeconfig file for your cluster and configure kubectl to use it. Refer to
   [Access Cluster with CLI](/clusters/cluster-management/kubeconfig/) for guidance.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig>
   ```

5. Search for nodes with the label `feature.node.kubernetes.io/pci-10de.present=true`.

   ```bash
   kubectl get nodes --selector feature.node.kubernetes.io/pci-10de.present=true
   ```

   GPU nodes should appear in the output.

   ```text hideClipboard title="Example output"
   NAME                    STATUS   ROLES    AGE   VERSION
   gpu-worker-node-name    Ready    <none>   11m   v1.33.6
   ```

6. Confirm that the node advertises allocatable GPUs. Replace `<gpu-node-name>` with the GPU node. 

   ```bash
   kubectl describe node <gpu-node-name> | grep nvidia.com/gpu
   ```

   The value of `nvidia.com/gpu` indicates the number of GPUs available for scheduling on that node.

   ```text hideClipboard title="Example output"
   nvidia.com/gpu:  1
   ```

### Run a GPU Workload Test

1. Deploy a test pod using the standard NVIDIA CUDA vector addition sample to confirm the node can run GPU workloads.

   ```bash
   cat << EOF | kubectl apply --filename -
   apiVersion: v1
   kind: Pod
   metadata:
     name: gpu-test
   spec:
     restartPolicy: OnFailure
     containers:
       - name: cuda-vector-add
         image: "nvcr.io/nvidia/k8s/cuda-sample:vectoradd-cuda11.2.1"
         resources:
           limits:
             nvidia.com/gpu: 1
   EOF
   ```

2. Wait for the pod to complete.

   ```bash
   kubectl wait --for=jsonpath='{.status.phase}'=Succeeded pod/gpu-test --timeout=120s
   ```

3. Retrieve the logs from the `gpu-test` pod to ensure the test was successful.

   ```bash
   kubectl logs gpu-test
   ```

   ```text hideClipboard title="Example output"
   [Vector addition of 50000 elements]
   Copy input data from the host memory to the CUDA device
   CUDA kernel launch with 196 blocks of 256 threads
   Copy output data from the CUDA device to the host memory
   Test PASSED
   Done
   ```

4. Clean up the test pod.

   ```bash
   kubectl delete pod gpu-test
   ```

## Next Steps

Once you have verified GPU workloads can run on your cluster, you can review the

<VersionedLink text="NVIDIA GPU Operator" url="integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack page for a full
list of configurable values and make the necessary modifications to fit your needs.

For additional information on the GPU Operator itself, including advanced configurations and known limitations, refer to
the [NVIDIA GPU Operator documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html).

If you plan on regularly running GPU-intensive applications on clusters, such as AI/ML applications and models, consider
using [PaletteAI](https://docs.palette-ai.com/) to streamline the deployment and management of GPU-enabled clusters and
create predefined, reusable application bundles that application engineers use to deploy workloads as needed.
