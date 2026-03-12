---
sidebar_label: "Configure Proxy CA Certificates for Workload Clusters"
title: "Configure Proxy CA Certificates for Workload Clusters"
description:
  "Learn how to configure proxy CA certificates for workload clusters deployed through a Private Cloud Gateway (PCG)."
hide_table_of_contents: false
toc_max_heading_level: 5
sidebar_position: 15
tags: ["pcg", "proxy"]
---

When your proxy server uses a Certificate Authority (CA) certificate for Transport Layer Security (TLS) inspection,
workload cluster nodes and pods need access to the CA certificate to establish trusted connections through the proxy.
The [Reach system](../architecture.md#reach-system) handles injecting proxy environment variables into pods
automatically, but the CA certificate must be configured separately.

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

## Add CA Certificate to Workload Cluster Nodes

To make the proxy CA certificate available to workload cluster nodes, configure it at either the tenant level or the
cluster profile level in the OS layer.

- **Tenant level** - All workload clusters provisioned from the tenant, with the exception of managed Kubernetes
  clusters (EKS, AKS, and GKE) and Edge clusters, have the CA certificate injected into their cluster nodes.

- **Cluster profile OS level** - Only workload clusters deployed using the cluster profile have the CA certificate
  injected.

The approach you use must also depend on whether the proxy CA certificate needs to be trusted at the node-level or
pod-level.

| **Approach**                 | **Node-Level Trust** | **Pod-Level Trust** |
| ---------------------------- | :------------------: | :-----------------: |
| **Tenant Level**             |  :white_check_mark:  |         :x:         |
| **Cluster Profile OS Layer** |  :white_check_mark:  | :white_check_mark:  |

### Tenant Level

Use this approach to propagate your proxy server CA certificate to _all_ workload cluster nodes provisioned from the
tenant, with the exception of managed Kubernetes clusters (EKS, AKS, and GKE) and Edge clusters. For managed Kubernetes
and Edge clusters, you must use the [Cluster Profile OS Layer](#cluster-profile-os-layer) approach.

:::warning

Tenant-level certificates provide node-level trust only. Applications running inside pods do not inherit the node trust
store and will not trust the proxy CA certificate. If your workloads need to make HTTPS requests through the proxy, use
the [Cluster Profile OS Layer](#cluster-profile-os-layer) approach with the `podMount` configuration to mount the
certificate into pods.

:::

#### Prerequisites

- Palette tenant administrator access.

- An active PCG cluster with proxy configured. Refer to the appropriate installation guide for your environment:

  - **Palette CLI** - [MAAS](../deploy-pcg/maas.md), [VMware vSphere](../deploy-pcg/vmware.md),
    [OpenStack](../deploy-pcg/openstack.md), or [Apache CloudStack](../deploy-pcg/cloudstack.md).
  - **Existing Kubernetes cluster** - [Enable and Manage Proxy Configurations](./configure-proxy.md).

- The proxy CA certificate in Privacy-Enhanced Mail (PEM) format. The certificate file must be named `ca.crt`.

#### Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings** menu, below **Platform**, select **Certificates**.

4. Select **Add A New Certificate**.

5. In the **Add Certificate** dialog, enter the **Certificate Name** and **Certificate** value.

6. **Confirm** your changes.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Deploy a workload cluster through using the PCG, or apply the updated cluster profile to an existing workload
   cluster.

3. SSH into a node in the workload cluster. Refer to the [SSH Keys](../../cluster-management/ssh/ssh-keys.md) and
   [SSH Usernames](../../cluster-management/ssh/ssh-usernames.md) guides for information on accessing cluster nodes.

   ```shell
   ssh -i <private-key-path> <username>@<dns-or-ip-address>
   ```

   ```shell hideClipboard title="Example command"
   ssh -i ~/.ssh/spectro2026.pem spectro@10.10.149.37
   ```

4. Verify the CA certificate file is present on the node.

   ```shell
   ls -l /usr/local/share/ca-certificates/spectro-ca.crt
   ```

   ```shell hideClipboard title="Example output"
   -rw-r--r-- 1 root root 1049 Mar  6 13:46 /usr/local/share/ca-certificates/spectro-ca.crt
   ```

5. Verify the certificate entered at **Tenant Settings > Certificates** matches the CA certificate on the node.

   ```shell
   cat /usr/local/share/ca-certificates/spectro-ca.crt
   ```

   ```shell hideClipboard title="Example output"
   -----BEGIN CERTIFICATE-----
   **************************
   -----END CERTIFICATE-----
   ```

6. Verify the certificate is included in the system trust store.

   ```shell
   openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt /usr/local/share/ca-certificates/spectro-ca.crt
   ```

   ```shell hideClipboard title="Example output"
   /usr/local/share/ca-certificates/spectro-ca.crt: OK
   ```

### Cluster Profile OS Layer

Use this approach to propagate proxy server CA certificates on a per-cluster basis. This is the only approach that
supports mounting the CA certificate into pods through the [Reach system](../architecture.md#reach-system).

#### Prerequisites

- An active PCG cluster with proxy configured. Refer to the appropriate installation guide for your environment:

  - **Palette CLI** - [MAAS](../deploy-pcg/maas.md), [VMware vSphere](../deploy-pcg/vmware.md), or
    [Apache CloudStack](../deploy-pcg/cloudstack.md).
  - **Existing Kubernetes cluster** - [Enable and Manage Proxy Configurations](./configure-proxy.md).

- The proxy CA certificate in PEM format. The certificate file must be named `ca.crt`.

#### Enablement

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
   | `targetPermissions`   | The file permissions in octal notation. For example, `0644`.                                                                                                                     |
   | `content`             | The PEM-encoded CA certificate content.                                                                                                                                          |
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
           *************************
           -----END CERTIFICATE-----
         podMount:
           allowed: true
           targetPath: /etc/ssl/certs/ca-certificates.crt
   ```

   :::warning

   When using `podMount`, the Reach system creates a host-path volume from the file at `targetPath` on the node and
   mounts it at `podMount.targetPath` inside pods. If the individual proxy CA certificate file is mounted at
   `/etc/ssl/certs/ca-certificates.crt`, it replaces the container's default CA bundle. This means pods will trust the
   proxy CA but not standard public CAs.

   In most proxy environments, this is acceptable because all outbound HTTPS traffic passes through the proxy, which
   handles upstream TLS verification on behalf of the pod. However, if your pods make direct TLS connections to services
   that bypass the proxy, such as internal services listed in `NO_PROXY`, those connections may fail because the
   container no longer has the default public CA certificates.

   To preserve the container's default CA bundle, use a path other than `/etc/ssl/certs/ca-certificates.crt` for
   `podMount.targetPath`. However, doing so requires individual configurations for each app to point to the custom
   `podMount.targetPath`.

   :::

5. Select **Confirm Updates**.

#### Validate

Use the [Node-Level Trust](#node-level-trust) section to verify the proxy CA certificate exists on and is trusted by
your workload cluster nodes. Additionally, if you configured the `kubeadmconfig.files.podMount` section in your cluster
profile OS layer, use the [Pod-Level Trust](#pod-level-trust) section to verify the proxy CA was mounted to the pods
within your workload cluster nodes.

##### Node-Level Trust

1. Log in to [Palette](https://console.spectrocloud.com).

2. Deploy a workload cluster through using the PCG, or apply the updated cluster profile to an existing workload
   cluster.

3. SSH into a node in the workload cluster. Refer to the [SSH Keys](../../cluster-management/ssh/ssh-keys.md) and
   [SSH Usernames](../../cluster-management/ssh/ssh-usernames.md) guides for information on accessing cluster nodes.

   ```shell
   ssh -i <private-key-path> <username>@<dns-or-ip-address>
   ```

   ```shell hideClipboard title="Example command"
   ssh -i ~/.ssh/spectro2026.pem spectro@10.10.149.37
   ```

4. Verify the CA certificate file is present on the node.

   ```shell
   ls -l /usr/local/share/ca-certificates/ca.crt
   ```

   ```shell hideClipboard title="Example output"
   -rw-r--r-- 1 root root 1049 Mar  6 13:46 /usr/local/share/ca-certificates/ca.crt
   ```

5. Verify the certificate entered in the cluster profile OS layer matches the CA certificate on the node.

   ```shell
   cat /usr/local/share/ca-certificates/ca.crt
   ```

   ```shell hideClipboard title="Example output"
   -----BEGIN CERTIFICATE-----
   **************************
   -----END CERTIFICATE-----
   ```

6. Verify the certificate is included in the system trust store.

   ```shell
   openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt /usr/local/share/ca-certificates/ca.crt
   ```

   ```shell hideClipboard title="Example output"
   /usr/local/share/ca-certificates/ca.crt: OK
   ```

##### Pod-Level Trust

:::info

This section is not applicable if you did not configure the `kubeadmconfig.files.podMount` section in your cluster
profile OS layer.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. Deploy a workload cluster through using the PCG, or apply the updated cluster profile to an existing workload
   cluster.

3. Download your workload cluster's kubeconfig and configure kubectl to access the cluster. Refer to our
   [Access Cluster with CLI](../../cluster-management/palette-webctl.md) guide for more information.

4. Verify the ClusterPodPreset contains `volume` and `volumeMount` entries for the CA certificate.

   ```shell
   kubectl get clusterpodpreset proxy --output yaml | grep --after-context=10 volumeMounts
   ```

   The output should include `volumes` and `volumeMounts` entries referencing the CA certificate path.

   ```yaml hideClipboard title="Example output" {4,8}
   volumeMounts:
     - metadata:
         merge_strategy: replace
       mountPath: /etc/ssl/certs/ca-certificates.crt
       name: ca-crt-11d45c1c
   volumes:
     - hostPath:
         path: /usr/local/share/ca-certificates/ca.crt
         type: File
       metadata:
         merge_strategy: replace
   ```

5. Locate pods with the `spectrocloud.com/connection: proxy` label. The Reach system only injects volumes into pods that
   match the ClusterPodPreset's label selector.

   ```shell
   kubectl get pods --all-namespaces --selector=spectrocloud.com/connection=proxy
   ```

   ```shell hideClipboard title="Example output"
   NAMESPACE                          NAME                                         READY   STATUS    RESTARTS      AGE
   capi-webhook-system                capv-controller-manager-cd9474c54-qxc25      1/1     Running   0             25m
   cluster-69b029bd77beee88f6961f4f   capv-controller-manager-554b46cf65-x76zx     1/1     Running   0             25m
   cluster-69b029bd77beee88f6961f4f   cluster-management-agent-cbb78fb69-g72k2     1/1     Running   0             24m
   cluster-69b029bd77beee88f6961f4f   crony-56c6bc6bdd-gm9pf                       1/1     Running   0             24m
   cluster-69b029bd77beee88f6961f4f   palette-controller-manager-f98487785-84klk   3/3     Running   0             25m
   kube-system                        vsphere-cloud-controller-manager-wclrf       1/1     Running   1 (21m ago)   21m
   kube-system                        vsphere-cloud-controller-manager-xfdv5       1/1     Running   1 (17m ago)   18m
   kube-system                        vsphere-cloud-controller-manager-ztxbh       1/1     Running   0             24m
   kube-system                        vsphere-csi-controller-866f6f7756-bnc94      7/7     Running   1 (20m ago)   24m
   kube-system                        vsphere-csi-controller-866f6f7756-g59p5      7/7     Running   0             24m
   kube-system                        vsphere-csi-controller-866f6f7756-x9nwj      7/7     Running   0             24m
   kube-system                        vsphere-csi-node-4wthp                       3/3     Running   1 (17m ago)   18m
   kube-system                        vsphere-csi-node-5tkfl                       3/3     Running   2 (20m ago)   21m
   kube-system                        vsphere-csi-node-gl9nv                       3/3     Running   3 (14m ago)   15m
   kube-system                        vsphere-csi-node-rt7rg                       3/3     Running   0             24m
   palette-system                     palette-webhook-bf496fdfb-2gqsp              1/1     Running   0             21m
   palette-system                     palette-webhook-bf496fdfb-mp54l              1/1     Running   0             18m
   palette-system                     palette-webhook-bf496fdfb-npt88              1/1     Running   0             24m
   ```

6. Verify the certificate file is mounted inside all containers within a `spectrocloud.com/connection: proxy` labeled
   pod.

   ```shell
   kubectl describe pod <pod-name> --namespace <namespace> | grep --context=5 "ca-crt"
   ```

   ```shell hideClipboard title="Example command"
   kubectl describe pod palette-webhook-bf496fdfb-npt88 --namespace palette-system | grep --context=5 "ca-crt"
   ```

   ```shell hideClipboard title="Example output" {6,20}
               BUILD_ID:        <set to the key 'BUILD_ID' of config map 'palette-version-info-for-webhook'>  Optional: false
            CONTAINER_REPO:  gcr.io
            no_proxy:        .cluster.local,.kvdb,.svc,10.96.0.0/12,127.0.0.1,192.168.0.0/16,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,vcenter.spectrocloud.dev
            NO_PROXY:        .cluster.local,.kvdb,.svc,10.96.0.0/12,127.0.0.1,192.168.0.0/16,kubernetes,localhost,portworx-service,prometheus-operator-prometheus,vcenter.spectrocloud.dev
         Mounts:
            /etc/ssl/certs/ca-certificates.crt from ca-crt-11d45c1c (rw)
            /packs from mold-drive-storage (rw)
            /tmp/k8s-webhook-server/serving-certs from cert (ro)
            /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-45swv (ro)
      Conditions:
      Type                        Status
      --
         Type:                    Projected (a volume that contains injected data from multiple sources)
         TokenExpirationSeconds:  3607
         ConfigMapName:           kube-root-ca.crt
         Optional:                false
         DownwardAPI:             true
      ca-crt-11d45c1c:
         Type:          HostPath (bare host directory volume)
         Path:          /usr/local/share/ca-certificates/ca.crt
         HostPathType:  File
      QoS Class:         Burstable
      Node-Selectors:    kubernetes.io/os=linux
   ```

7. Optionally, if the container contains the `cat` utility, verify that the certificate matches the content pasted into
   the cluster profile OS layer.

   ```shell
   kubectl exec <pod-name> --namespace <namespace> -- cat /etc/ssl/certs/ca-certificates.crt
   ```

   ```shell hideClipboard title="Example command"
   kubectl exec palette-webhook-bf496fdfb-2gqsp --namespace palette-system -- cat /etc/ssl/certs/ca-certificates.crt
   ```

   ```shell hideClipboard title="Example output"
   -----BEGIN CERTIFICATE-----
   **************************
   -----END CERTIFICATE-----
   ```
