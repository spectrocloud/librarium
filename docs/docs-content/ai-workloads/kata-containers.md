---
sidebar_label: "Kata Containers Pack"
title: "Isolate Workloads with the Kata Containers Pack"
description:
  "Add the kata-containers-ai pack to a Palette cluster profile to run pods in lightweight virtual machines that have
  their own kernel."
tags: ["kata containers", "packs", "runtimeclass", "isolation", "ai workloads"]
sidebar_position: 20
---

You can use the Kata Containers pack to run pods inside lightweight virtual machines (VMs) on your Palette-managed
clusters. Each pod that runs in Kata Containers gets its own guest kernel and hardware-enforced isolation from the host
and from other pods, while you keep the standard Kubernetes workflow. Kata Containers suits multi-tenant clusters and
workloads that you do not fully trust. Follow this guide to add the pack to a cluster profile and verify that pods can
run in Kata VMs.

## How the Pack Works

The pack installs [Kata Containers](https://katacontainers.io/) with the upstream
[kata-deploy](https://kata-containers.github.io/kata-containers/installation/#install-on-kubernetes-with-helm-recommended)
Helm chart. On each node that the pack targets, the installation copies the Kata runtime, hypervisors, and guest images,
updates the containerd configuration, and adds the `katacontainers.io/kata-runtime=true` label. The pack also creates a
Kubernetes [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) named `kata-<shim>` for each
hypervisor shim that it enables.

The **Kubernetes Distribution** preset determines where the installation finds the containerd configuration on each
node.

Pods keep using the default container runtime unless they set `runtimeClassName` to a Kata RuntimeClass. Kubernetes
schedules those pods only on nodes that have the `katacontainers.io/kata-runtime=true` label.

The shims available on a node depend on its architecture. The following table lists the main RuntimeClasses.

| **RuntimeClass**                  | **Hypervisor and Runtime**                                 | **Node Architecture** |
| --------------------------------- | ---------------------------------------------------------- | --------------------- |
| `kata-qemu-runtime-rs`            | QEMU with the Rust runtime. This is the default Kata shim. | amd64, arm64          |
| `kata-qemu`                       | QEMU with the Go runtime.                                  | amd64, arm64          |
| `kata-clh`, `kata-clh-runtime-rs` | Cloud Hypervisor with the Go runtime or the Rust runtime.  | amd64                 |
| `kata-dragonball`                 | Dragonball, a hypervisor built into the Rust runtime.      | amd64                 |

We recommend `kata-qemu-runtime-rs` unless you have a reason to choose another shim.

## Considerations

- The pack installs Kata on every node unless you set `charts.kata-deploy.nodeSelector` to limit it to matching nodes.

- Installing or updating the pack changes the containerd configuration on each selected node and might restart
  containerd.

- By default, the pack uses the `job` deployment mode, which installs Kata only on the nodes that exist when you install
  or update the pack. Nodes that join the cluster later do not get Kata until you update the pack. To cover new nodes
  automatically, change one of the following values:

  - Set `charts.kata-deploy.job.reconcile.enabled` to `true`. The pack then checks for new nodes every 15 minutes.

  - Set `charts.kata-deploy.deploymentMode` to `daemonset`. The pack then keeps a privileged DaemonSet on every selected
    node.

- The pack creates the `kata-system` namespace with the `privileged` Pod Security level, because the installation writes
  to the host.

- The default values do not enable the NVIDIA GPU passthrough shims.

## Prerequisites

- A Palette account with permissions to create and manage cluster profiles and clusters. Refer to
  [Roles and Permissions](/user-management/palette-rbac/resource-scope-roles-permissions) for details.

<!-- prettier-ignore-start -->

- Version 4.4.0 or later of the <VersionedLink text="Kata Containers pack" url="/integrations/packs/?pack=kata-containers-ai" />, available in a Palette-registered registry. Refer to [Registries](/registries-and-packs/registries/) for information on adding registries to Palette.

<!-- prettier-ignore-end -->

- A Palette-managed cluster that uses Palette eXtended Kubernetes (PXK), RKE2, or K3s, with Kubernetes 1.29 or later and
  containerd 1.7 or later. For Edge clusters, use Palette eXtended Kubernetes Edge (PXK-E). If you do not have a cluster
  yet, refer to [Clusters](/clusters/) for deployment guides.

- Nodes that use the amd64 or arm64 architecture and support hardware virtualization through `/dev/kvm`. Use bare metal
  nodes, or VMs with nested virtualization enabled. The installation fails on a node that does not expose `/dev/kvm`.

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your workstation.

## Create Add-on Cluster Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. From the **Cluster Profiles** table, select **Add Cluster Profile**.

   :::tip

   If you deployed your cluster with a
   [full cluster profile](/profiles/cluster-profiles/create-cluster-profiles/create-full-profile/), you can instead add
   the Kata Containers pack to a
   [new version](/profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile/) of that profile.

   :::

4. Enter a unique **Name** for the cluster profile and choose a cluster profile **Type** of **Add-on**. Select **Next**.

5. On the **Profile Layers** step, select **Add New Pack**.

6. Search for `kata` and select the **Kata Containers** pack.

7. Select a **Pack Version** of **4.4.0** or later.

8. In the pack **Values**, expand **Presets**. Under **Kubernetes Distribution**, select the preset that matches your
   cluster.

   | **Cluster Kubernetes Distribution** | **Preset**        |
   | ----------------------------------- | ----------------- |
   | PXK or PXK-E                        | **PXK (kubeadm)** |
   | RKE2                                | **RKE2**          |
   | K3s                                 | **K3s**           |

9. Review the remaining pack **Values**. The default values work for most deployments. Refer to
   [Considerations](#considerations) for the values that control which nodes get Kata.

10. Select **Confirm & Create** to return to the **Profile Layers** page. Select **Next**.

11. Review your cluster profile. If the profile needs no changes, select **Finish Configuration**.

## Add Profile to Cluster

Once you have created the add-on profile, attach it to your cluster. If you added the Kata Containers pack to an
existing full profile, update the cluster profile version to the version that includes your changes. Refer to
[Update a Cluster](/clusters/cluster-management/cluster-updates/) for more information.

## Validate

Confirm that the nodes can run Kata and that a pod runs inside a Kata VM.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**.

3. Choose your cluster from the **Clusters** table.

4. Download the kubeconfig file for your cluster and configure `kubectl` to use it. Refer to
   [Access Cluster with CLI](/clusters/cluster-management/kubeconfig/) for guidance.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig>
   ```

   Replace `<path-to-kubeconfig>` with the path to the kubeconfig file that you downloaded.

5. List the nodes that can run Kata.

   ```bash
   kubectl get nodes --selector katacontainers.io/kata-runtime=true
   ```

   Each node where the installation succeeded appears in the output. If a node is missing, confirm that it exposes
   `/dev/kvm`. If the node joined the cluster after you installed the pack, refer to [Considerations](#considerations).

6. List the Kata RuntimeClasses.

   ```bash
   kubectl get runtimeclass
   ```

   The output lists a `kata-<shim>` RuntimeClass for each shim that the pack enabled, such as `kata-qemu-runtime-rs`.

7. Deploy a test pod that runs in a Kata VM and prints its kernel version.

   ```bash
   cat << EOF | kubectl apply --filename -
   apiVersion: v1
   kind: Pod
   metadata:
     name: kata-test
   spec:
     runtimeClassName: kata-qemu-runtime-rs
     restartPolicy: Never
     containers:
       - name: test
         image: "busybox:1.37"
         command: ["uname", "--kernel-release"]
   EOF
   ```

8. Wait for the pod to complete.

   ```bash
   kubectl wait --for=jsonpath='{.status.phase}'=Succeeded pod/kata-test --timeout=120s
   ```

   ```text hideClipboard title="Example Output"
   pod/kata-test condition met
   ```

   If the command times out, run `kubectl describe pod kata-test` and review the `Events` section of the output for the
   cause.

9. Compare the kernel version that the pod reports with the kernel versions of the nodes.

   ```bash
   kubectl logs kata-test
   kubectl get nodes --output custom-columns=NAME:.metadata.name,KERNEL:.status.nodeInfo.kernelVersion
   ```

   The pod reports a different kernel version from the nodes because it runs on the guest kernel of its Kata VM.

10. Clean up the test pod.

    ```bash
    kubectl delete pod kata-test
    ```

## Next Steps

<!-- prettier-ignore-start -->

For the full list of configurable values, refer to the <VersionedLink text="Kata Containers pack" url="/integrations/packs/?pack=kata-containers-ai" />. For more information about Kata Containers, including the available hypervisors and their limitations, refer to the [Kata Containers documentation](https://kata-containers.github.io/kata-containers/).

<!-- prettier-ignore-end -->
