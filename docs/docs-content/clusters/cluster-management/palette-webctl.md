---
sidebar_label: "Kubectl"
title: "Kubectl"
description: "Learn how to access your Kubernetes cluster with the kubectl CLI."
hide_table_of_contents: false
sidebar_position: 160
tags: ["clusters", "cluster management", "kubectl"]
---

Palette generates [kubeconfig](./kubeconfig.md) files that you can download and use to connect to your workload cluster
with the [kubectl](https://kubernetes.io/docs/reference/kubectl/) CLI. This guide walks you through downloading a
kubeconfig file and verifying access to your cluster.

:::info

If you are using Palette Virtual Machine Orchestrator (VMO), you can connect to your VMs with the
[virtctl CLI](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/). `virtctl` facilitates certain VM
operations, including copying, pasting, or transferring files to and from VMs using Secure Copy Protocol (SCP). Refer to
our
[Access VM Cluster with virtctl](../../vm-management/create-manage-vm/advanced-topics/access-cluster-with-virtctl.md)
guide for more information.

:::

## Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally.

  - If your workload cluster has OIDC configured and you download the **Kubeconfig File**, you must also install
    [kubelogin](https://github.com/int128/kubelogin) on the machine where you run `kubectl`; otherwise, `kubectl`
    commands issued against the cluster will fail.

<!-- prettier-ignore-start -->

- A workload cluster that is either publicly accessible or a private workload cluster that has the
<VersionedLink text="Spectro Proxy" url="/integrations/packs/?pack=spectro-proxy" /> pack installed.

<!-- prettier-ignore-end -->

- Appropriate Palette permissions for the kubeconfig file you intend to use. Refer to
  [Kubeconfig Permission Requirements](./kubeconfig.md#permission-requirements) for more information.

## Access Cluster Using Kubeconfig

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Select the workload cluster you want to access.

4. From the cluster **Overview** tab, locate the **Kubeconfig File** or **Admin Kubeconfig File**. The available
   kubeconfig files depend on your Palette permissions and whether OIDC is configured for your workload cluster. Refer
   to our [Kubeconfig](./kubeconfig.md) guide for more information.

5. Select the appropriate kubeconfig link to download the workload cluster's kubeconfig file.

   ![Kubeconfig file location](/kubeconfig_workload-cluster_4-9.webp)

   :::tip

   To copy the contents of the kubeconfig file to your clipboard instead of downloading the file, select the **Copy**
   icon beside the kubeconfig link.

   :::

6. Open a terminal session in an environment that has network access to the cluster. Set the `KUBECONFIG` environment
   variable to the file path of the downloaded kubeconfig file.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   ```

You can now issue `kubectl` commands against your workload cluster.

## Validate

Verify you have access to your workload cluster by issuing `kubectl` commands against it. For example, use the following
command to view all pods in your cluster.

```bash title="Example command"
kubectl get pods --all-namespaces
```

```bash title="Example output" hideClipboard
NAMESPACE                          NAME                                                               READY   STATUS      RESTARTS      AGE
capi-webhook-system                capa-controller-manager-5bbffdf6bb-sz48f                           1/1     Running     0             8d
capi-webhook-system                capi-controller-manager-7bb56fbdd4-qkstl                           1/1     Running     0             8d
capi-webhook-system                capi-kubeadm-bootstrap-controller-manager-68647cc467-fx9ps         1/1     Running     0             8d
capi-webhook-system                capi-kubeadm-control-plane-controller-manager-7ddbc67456-hm2hc     1/1     Running     0             8d
cert-manager                       cert-manager-5649585bd4-d8xth                                      1/1     Running     0             11d
cert-manager                       cert-manager-cainjector-7b58b7fb85-bj2p4                           1/1     Running     0             11d
cert-manager                       cert-manager-webhook-6d4cc48554-g74rx                              1/1     Running     0             11d
cluster-69ce7de27fc0dde9d7255fd8   capa-controller-manager-cf9fb4598-86zc6                            1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   capi-controller-manager-678cd5bf56-fd6jr                           1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   capi-kubeadm-bootstrap-controller-manager-7bf69dbdc4-4s57f         1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   capi-kubeadm-control-plane-controller-manager-66c6dbd879-bz5gn     1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   cluster-management-agent-6c97fc58df-hhgrb                          1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   crony-6474bcb49-psws5                                              1/1     Running     0             8d
cluster-69ce7de27fc0dde9d7255fd8   metrics-server-848b66dfd8-cp7s2                                    1/1     Running     0             11d
cluster-69ce7de27fc0dde9d7255fd8   palette-controller-manager-58664d9585-m45sc                        3/3     Running     0             8d
default                            gpu-test                                                           0/1     Completed   0             11d
kube-system                        aws-cloud-controller-manager-wlt8w                                 1/1     Running     0             8d
kube-system                        calico-kube-controllers-f67c6f96-zzrkn                             1/1     Running     0             11d
kube-system                        calico-node-95ltz                                                  1/1     Running     0             11d
kube-system                        calico-node-sqr5h                                                  1/1     Running     0             11d
kube-system                        coredns-674b8bbfcf-2bsw4                                           1/1     Running     0             11d
kube-system                        coredns-674b8bbfcf-tfg7t                                           1/1     Running     0             11d
kube-system                        ebs-csi-controller-55644f45c8-crp4x                                5/5     Running     0             11d
kube-system                        ebs-csi-controller-55644f45c8-dm688                                5/5     Running     3 (11d ago)   11d
kube-system                        ebs-csi-node-c8bnt                                                 3/3     Running     0             11d
kube-system                        ebs-csi-node-mtk2k                                                 3/3     Running     0             11d
kube-system                        etcd-ip-10-0-1-234.us-east-2.compute.internal                      1/1     Running     0             11d
kube-system                        kube-apiserver-ip-10-0-1-234.us-east-2.compute.internal            1/1     Running     0             11d
kube-system                        kube-controller-manager-ip-10-0-1-234.us-east-2.compute.internal   1/1     Running     0             11d
kube-system                        kube-proxy-8hzmj                                                   1/1     Running     0             11d
kube-system                        kube-proxy-zszpp                                                   1/1     Running     0             11d
kube-system                        kube-scheduler-ip-10-0-1-234.us-east-2.compute.internal            1/1     Running     0             11d
palette-system                     palette-webhook-5dc5d9f684-8nk2b                                   1/1     Running     0             8d
palette-system                     palette-webhook-5dc5d9f684-nglbb                                   1/1     Running     0             8d
```
