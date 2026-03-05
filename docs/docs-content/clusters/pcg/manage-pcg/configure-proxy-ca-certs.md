---
sidebar_label: "Proxy CA Certificates for Workload Clusters"
title: "Configure Proxy CA Certificates for Workload Clusters"
description:
  "Learn how to configure proxy CA certificates for workload clusters deployed through a Private Cloud Gateway (PCG)."
hide_table_of_contents: false
sidebar_position: 15
tags: ["pcg", "proxy"]
---

When your proxy server uses a Certificate Authority (CA) certificate for TLS inspection, workload cluster nodes and pods
need access to the CA certificate to establish trusted connections through the proxy. The
[Reach system](../architecture.md#reach-system) handles injecting proxy environment variables into pods automatically,
but the CA certificate must be configured separately.

Proxy CA certificates provided during PCG installation are propagated to the PCG cluster nodes but are not automatically
propagated to workload cluster nodes. You must configure the CA certificate for workload clusters using one of the
methods described in this guide.

There are two levels of CA certificate trust to consider:

- **Node-level trust** - The CA certificate is written to each workload cluster node's filesystem and added to the
  operating system trust store. System services on the node, such as `containerd` and `kubelet`, will trust the proxy.
  Both the [tenant-level](#tenant-level) and [cluster profile](#cluster-profile-os-layer) approaches provide node-level
  trust.

- **Pod-level trust** - The CA certificate is mounted into pods as a volume so that applications running inside
  containers can trust the proxy. Pod-level trust requires the `podMount` configuration in the cluster profile OS layer
  and is _only_ available through the [cluster profile](#cluster-profile-os-layer) approach. Certificates configured at
  the tenant level are not mounted into pods.

## Prerequisites

- An active PCG cluster with proxy configured. Refer to the appropriate installation guide for your environment:

  - **Palette CLI** - [MAAS](../deploy-pcg/maas.md), [VMware vSphere](../deploy-pcg/vmware.md),
    [OpenStack](../deploy-pcg/openstack.md), or [Apache CloudStack](../deploy-pcg/cloudstack.md).
  - **Existing Kubernetes cluster** - [Enable and Manage Proxy Configurations](./configure-proxy.md).

- Palette tenant administrator access.

- The proxy CA certificate in Privacy-Enhanced Mail (PEM) format. The certificate file must be named `ca.crt`.

## Add CA Certificate to Workload Cluster Nodes

To make the proxy CA certificate available to workload cluster nodes, configure it at either the tenant level or the
cluster profile level in the OS layer.

- **Tenant level** - All workload clusters provisioned from the tenant, with the exception of managed Kubernetes
  clusters (EKS, AKS, and GKE) and Edge clusters, have the CA certificate injected into their cluster nodes.

- **Cluster profile OS level** - Only workload clusters deployed using the cluster profile have the CA certificate
  injected.

### Tenant Level

Use this approach to propagate your proxy server CA certificate to _all_ workload cluster nodes provisioned from the
tenant, with the exception of managed Kubernetes clusters (EKS, AKS, and GKE) and Edge clusters. For managed Kubernetes
and Edge clusters, proceed to the [Cluster Profile OS Layer](#cluster-profile-os-layer) section.

:::warning

Tenant-level certificates provide node-level trust only. Applications running inside pods do not inherit the node trust
store and will not trust the proxy CA certificate. If your workloads need to make HTTPS requests through the proxy, use
the [Cluster Profile OS Layer](#cluster-profile-os-layer) approach with the `podMount` configuration to mount the
certificate into pods.

:::

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings** menu, below **Platform**, select **Certificates**.

4. Select **Add A New Certificate**.

5. In the **Add Certificate** dialog, enter the **Certificate Name** and **Certificate** value.

6. **Confirm** your changes.

### Cluster Profile OS Layer

Use this approach to propagate proxy server CA certificates on a per-cluster basis. This is the only approach that
supports mounting the CA certificate into pods through the [Reach system](../architecture.md#reach-system).

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Choose an existing cluster profile or create a new cluster profile. For more information, refer to the
   [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) guide.

4. In the OS layer of your cluster profile, add your CA certificate to the `content` field under `kubeadmconfig.files`.
   The CA certificate file _must_ be named `ca.crt`.

   By default, adding a proxy CA certificate to the cluster profile OS layer places the certificate on each workload
   cluster node and adds it to the node trust store. However, applications running inside pods do not automatically
   inherit the node trust store. To make the CA certificate available inside pods, use the `podMount` configuration in
   the `kubeadmconfig.files` section of the OS layer. The `podMount` configuration instructs Palette to mount the
   specified host file into pods through the [Reach system](../architecture.md#reach-system).

   The following table describes the configuration fields.

   | Field                 | Description                                                                                                                                                                      |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `targetPath`          | The path on the host node where the CA certificate file is written. The certificate file must be named `ca.crt`.                                                                 |
   | `targetOwner`         | The file ownership in the format `user:group`.                                                                                                                                   |
   | `targetPermissions`   | The file permissions in octal notation.                                                                                                                                          |
   | `content`             | The PEM-encoded CA certificate content. If the file already exists on the host node, you can omit this field.                                                                    |
   | `podMount.allowed`    | Set to `true` to enable mounting the host file into pods through the Reach system.                                                                                               |
   | `podMount.targetPath` | The path inside pods where the file is mounted. Use `/etc/ssl/certs/ca-certificates.crt` to make the certificate available to most applications that use the system trust store. |

   ```yaml hideClipboard title="Example OS layer configuration" {17-19}
   kubeadmconfig:
     preKubeadmCommands:
       - echo "Executing pre kube admin config commands"
       - update-ca-certificates
       - "systemctl restart containerd; sleep 3"
       - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
     postKubeadmCommands:
       - echo "Executing post kube admin config commands"
     files:
       - targetPath: /usr/local/share/ca-certificates/ca.crt
         targetOwner: "root:root"
         targetPermissions: "0644"
         content: |
           -----BEGIN CERTIFICATE-----
           <your-proxy-ca-certificate-content>
           -----END CERTIFICATE-----
         podMount:
           allowed: true
           targetPath: /etc/ssl/certs/ca-certificates.crt
   ```

5. Select **Confirm Updates**.

6. If you have existing workload clusters using this profile, apply the updated profile to trigger a cluster update.

## Validate

Use the following steps to verify that the proxy CA certificate was successfully propagated to workload cluster nodes
and, if you configured `podMount`, into pods.

### Verify Node-Level Trust

1. Deploy a workload cluster through Palette using the PCG, or apply the updated cluster profile to an existing workload
   cluster.

2. SSH into a node in the workload cluster.

3. Verify the CA certificate file is present on the node.

   ```shell
   ls -l /usr/local/share/ca-certificates/ca.crt
   ```

   The output should display the certificate file.

4. Verify the certificate is included in the system trust store.

   ```shell
   openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt /usr/local/share/ca-certificates/ca.crt
   ```

   The output should display the following.

   ```shell hideClipboard
   /usr/local/share/ca-certificates/ca.crt: OK
   ```

### Verify Pod-Level Trust

If you configured `podMount` in the cluster profile OS layer, use the following steps to verify the CA certificate is
mounted into pods.

1. Access the workload cluster using kubectl. Refer to the
   [Access Cluster with CLI](../../cluster-management/palette-webctl.md) guide for more information.

2. Verify the ClusterPodPreset contains volume and volumeMount entries for the CA certificate.

   ```shell
   kubectl get clusterpodpreset proxy --output yaml
   ```

   The output should include `volumes` and `volumeMounts` entries referencing the CA certificate path.

   ```yaml hideClipboard
   spec:
     volumeMounts:
       - mountPath: /etc/ssl/certs/ca-certificates.crt
         name: ca-crt-xxxxxxxx
     volumes:
       - hostPath:
           path: /usr/local/share/ca-certificates/ca.crt
           type: File
         name: ca-crt-xxxxxxxx
   ```

3. Deploy a test pod and verify the certificate file is available inside the container.

   ```shell
   kubectl run test-proxy-cert --image=busybox --restart=Never \
     --command -- cat /etc/ssl/certs/ca-certificates.crt
   ```

4. Check the pod logs to confirm the certificate content is present.

   ```shell
   kubectl logs test-proxy-cert
   ```

   The output should contain certificate content, including `-----BEGIN CERTIFICATE-----` blocks.

5. Clean up the test pod.

   ```shell
   kubectl delete pod test-proxy-cert
   ```
