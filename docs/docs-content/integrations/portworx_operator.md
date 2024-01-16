---
sidebar_label: "Portworx /w Operator"
title: "Portworx Operator"
description: "Portworx storage CSI for all use cases"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/csi-portworx/blobs/sha256:e27bc9aaf22835194ca38062061c29b5921734eed922e57d693d15818ade7486?type=image/png"
tags: ["packs", "portworx", "storage"]
---

[Portworx](https://portworx.com/) is a software-defined persistent storage solution designed and purpose-built for applications deployed as containers via container orchestrators such as Kubernetes. You can include Portworx in your Kubernetes cluster by using the Portworx Operator pack.

## Versions Supported

<Tabs groupId="versions">
<TabItem label="3.0.x" value="3.x">

## Prerequisites

Portworx Operator has the following prerequisites for installation. You can learn more about all the required Portworx requirements in the [Portworx documentation](https://docs.portworx.com/install-portworx/prerequisites).

- The Kubernetes cluster must have at least three nodes of the type bare metal or virtual machine.

- Storage drives must be unmounted block storage. You can use either, raw disks, drive partitions, LVM, or cloud block storage.

- The backing drive must be at least 8 GB in size.

- The following disk folder require enough space to store Portworx metadata:

  - **/var** - 2 GB

  - **/opt** - 3 GB

- The operating system root partition must be at least 64 GB is the minimum.

- The minimum hardware requirements for each node are:

  - 4 CPU cores

  - 8 GB RAM

  - 50 GB disk space

  - 1 Gbps network connectivity

- A Linux kernel version of 3.10 or higher is required.

* Docker version 1.13.1 or higher is required.

- Ensure you use a [supported Kubernetes version](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites#supported-kubernetes-versions).

- Identify and set up the type of storage you want to use.

:::warning

Starting with Portworx version 3.x.x and greater. Lighthouse is no longer available in the pack itself. Instead you can install [Portworx Central](https://docs.portworx.com/portworx-central-on-prem/install/px-central.html), which provides monitoring capabilities.

:::

## Parameters

The following parameters are highlighted for this version of the pack and provide a preset option when configured through the UI. These parameters are not exhaustive and you can configure additional parameters as needed.

| Parameter                              | Description                                                                                                                                                                                                               | Default      |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------- |
| `portworx-generic.activateLicense`     | Set to `true` to activate the Portworx license.                                                                                                                                                                           | `true`       |
| `portworx-generic.license.type`        | Allowed values are: `essentials`, `saas`, `enterprise`. If you want to deploy the PX Enterprise Trial version, or need manual offline activation, select the **PX Enterprise** type and set `activateLicense` to `false`. | `essentials` |
| `portworx-generic.Storagecluster.spec` | Define the storage type and behavior for Portworx.Refer to the Storage Specification section below to learn more.                                                                                                         | `{}`         |
| `portworx-generic.externalKvdb`        | Define the external Key Value Database (KVDB) configuration for Portworx. Refer to the Integration With External etcd section below to learn more.                                                                        | `{}`         |
| `portworx-generic.storageCluster.env`  | Specify environment variables, such as HTTP Proxy settings, for Portworx.                                                                                                                                                 | `{}`         |

## Usage

The default installation of Portworx /w Operator will deploy the following components in the Kubernetes cluster:

- Portworx Operator

- `StorageCluster` resource that tells the Operator how to deploy and configure Portworx.

- `StorageClass` resource for dynamic provisioning of `PersistentVolumes`` using the `pxd.portworx.com` provisioner.

- [Stork](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/stork.html). Portworx's storage scheduler for Kubernetes.

<!-- Optionally for Portworx 2.x, you can enable Lighthouse for basic monitoring of the Portworx cluster. -->

<br />

### License Model

This pack can install Portworx in three different licensing modes:

- **Essentials**: a free Portworx license with limited functionality that allows you to deploy a small production or proof-of-concept workloads. Essentials limits capacity and advanced features, but otherwise functions the same way as the fully featured Portworx Enterprise version of Portworx.

- **Enterprise**: the fully featured version of Portworx. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

- **Enterprise SaaS PAYG**: the fully featured version of Portworx but using a SaaS license key that allows unlimited use and in-arrears billing. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

Use the presets in the pack user interface to select which license model you want to use, then update the `charts.portworx-generic.license` section for your chosen license model.

<br />

<Tabs queryString="license">
<TabItem label="PX Essentials" value="PX Essentials">

```yaml
license:
  type: essentials
  essentials:
    # Base64-decoded value of the px-essen-user-id value in the px-essential secret
    # Find your Essentials Entitlement ID at https://central.portworx.com/profile
    userId: 1234abcd-12ab-12ab-12ab-123456abcdef
    # Base64-decoded value of the px-osb-endpoint value in the px-essential secret
    # Leave at the default value unless there are special circumstances
    endpoint: https://pxessentials.portworx.com/osb/billing/v1/register
```

</TabItem>
<TabItem label="PX Enterprise" value="PX Enterprise">

```yaml
license:
  type: saas
  saas:
    key: <PAY-AS-YOU-GO-KEY>
```

</TabItem>

<TabItem label="PX Enterprise SaaS PAYG" value="PX Enterprise SaaS PAYG">

```yaml
license:
  type: enterprise
  enterprise:
    activateLicense: true
    activationId: <Activation ID>
    # customLicenseServer:
    #   url: http://hostname:7070/fne/bin/capability
    #   importUnknownCa: true
    #   licenseBorrowInterval: 1w15m
    #   addFeatures:
    #   - feature1
    #   - feature2
```

</TabItem>
</Tabs>

### Storage Specification

You can install Portworx in a variety of storage configurations.

- **Existing disks (generic)**: This mode does not integrate with any particular storage solution, it uses existing disks available on the nodes.

- **AWS Cloud Storage**: This mode integrates with Amazon EBS block volumes and allows AWS EKS and EC2 based Kubernetes clusters to dynamically attach EBS volumes to worker nodes for Portworx.

- **Azure Cloud Storage**: This mode integrates with Azure block storage and allows Azure AKS and regular Azure Kubernetes clusters to dynamically attach Azure block storage to worker nodes for Portworx.

- **Google Cloud Storage**: This mode integrates with Google persistent disks and allows GKE and regular Google Kubernetes clusters to dynamically attach persistent disks to worker nodes for Portworx.

- **VMware vSphere Datastores**: This mode integrates with VMware vSphere storage and allows Kubernetes clusters on vSphere to dynamically attach vSAN and regular Datastore disks to worker nodes for Portworx.

- **Pure Storage Flash Array**: This mode integrates with Pure Storage Flash Arrays and allows Kubernetes clusters to dynamically attach Flash Array disks over iSCSI to worker nodes for Portworx.

:::tip

Use the presets in the pack user interface to select which storage specification you want to use, then update the `charts.portworx-generic.storageCluster` section to your specific needs.

:::

Select the tab below for the storage specification you want to use. Use the example YAML as a starting point for your configuration.

<br />

<Tabs queryString="storage">
<TabItem label="Generic" value="Generic">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    storage:
      useAll: true
      # kvdbDevice: /dev/sdb
      journalDevice: auto
    # network:
    #   dataInterface: eth0
    #   mgmtInterface: eth1
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
```

</TabItem>
<TabItem label="AWS" value="AWS">

To deploy Portworx in an AWS environment, ensure the following IAM policy is created in AWS and attached to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role.
<br/>

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action":
          [
            "ec2:AttachVolume",
            "ec2:ModifyVolume",
            "ec2:DetachVolume",
            "ec2:CreateTags",
            "ec2:CreateVolume",
            "ec2:DeleteTags",
            "ec2:DeleteVolume",
            "ec2:DescribeTags",
            "ec2:DescribeVolumeAttribute",
            "ec2:DescribeVolumesModifications",
            "ec2:DescribeVolumeStatus",
            "ec2:DescribeVolumes",
            "ec2:DescribeInstances",
            "autoscaling:DescribeAutoScalingGroups",
          ],
        "Resource": ["*"],
      },
    ],
}
```

- When deploying a regular Kubernetes cluster on an AWS EC2 using Palette, attach the policy to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role. Or alternatively, edit the AWS cloud account in Palette, enable the `Add IAM Policies` option, and select the Portworx IAM policy described above. This will automatically attach the IAM policy to the correct IAM role..

- When deploying an AWS EKS cluster, use the `managedMachinePool.roleAdditionalPolicies` option in the Kubernetes pack layer YAML to automatically attach the Portworx IAM policy to the EKS worker pool IAM role . The example below shows how to attach the Portworx IAM policy to the EKS worker pool IAM role.

```yaml
managedMachinePool:
  roleAdditionalPolicies:
    - "arn:aws:iam::012345678901:policy/my-portworx-policy"
```

```yaml
storageCluster:
  annotations:
    portworx.io/is-eks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      maxStorageNodesPerZone: 0
      deviceSpecs:
        - type=gp3,size=150
      kvdbDeviceSpec: type=gp3,size=150
      journalDeviceSpec: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
```

</TabItem>
<TabItem label="Azure" value="Azure">

```yaml
storageCluster:
  annotations:
    portworx.io/is-aks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      maxStorageNodesPerZone: 0
      deviceSpecs:
        - type=Premium_LRS,size=150
      kvdbDeviceSpec: type=Premium_LRS,size=150
      journalDeviceSpec: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
    env:
      - name: AZURE_CLIENT_SECRET
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_SECRET
      - name: AZURE_CLIENT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_ID
      - name: AZURE_TENANT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_TENANT_ID
azureSecret:
  tenantId: "your_azure_tenant_id"
  clientId: "your_azure_client_id"
  clientSecret: "your_client_secret"
```

</TabItem>
<TabItem label="Google" value="Google">

```yaml
storageCluster:
  annotations:
    portworx.io/is-gke: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      maxStorageNodesPerZone: 0
      deviceSpecs:
        - type=pd-standard,size=150
      kvdbDeviceSpec: type=pd-standard,size=150
      journalDeviceSpec: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
```

</TabItem>
<TabItem label="VMware vSphere" value="VMware vSphere">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      maxStorageNodesPerZone: 0
      deviceSpecs:
        - type=lazyzeroedthick,size=150
      kvdbDeviceSpec: type=lazyzeroedthick,size=32
      journalDeviceSpec: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
    env:
      - name: VSPHERE_INSECURE
        value: "true"
      - name: VSPHERE_USER
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_USER
      - name: VSPHERE_PASSWORD
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_PASSWORD
      - name: VSPHERE_VCENTER
        value: my-vcenter.company.local
      - name: VSPHERE_VCENTER_PORT
        value: "443"
      - name: VSPHERE_DATASTORE_PREFIX
        value: Datastore
      - name: VSPHERE_INSTALL_MODE
        value: shared
vsphereSecret:
  user: "username_for_vCenter_here"
  password: "your_password"
```

</TabItem>
<TabItem label="Pure Flash Array" value="Pure Flash Array">

To activate the Pure Flash Array integration, you will need to create a Kubernetes secret named `px-pure-secret` on your cluster containing your [Flash Array license JSON](https://docs.portworx.com/portworx-enterprise/cloud-references/auto-disk-provisioning/pure-flash-array.html#deploy-portworx). The secret must be created in the namespace that contains the `StorageCluster` resource. The namespace is `portworx` by default.

Use the following command to create the secret:

```
kubectl create secret generic px-pure-secret --namespace portworx --from-file=pure.json=<file path>
```

Alternatively, you can attach a manifest to the Portworx /w Operator pack that contains the YAML for the secret.

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:3.0.0
    imagePullPolicy: Always
    deleteStrategy:
      type: UninstallAndWipe
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      maxStorageNodesPerZone: 0
      deviceSpecs:
        - size=150
      kvdbDeviceSpec: size=32
      journalDeviceSpec: auto
    # network:
    #  dataInterface: eth0
    #  mgmtInterface: eth1
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
      providers:
        - name: default
          params:
            url: http://prometheus-operator-prometheus.monitoring.svc.cluster.local:9090
          type: prometheus
    runtimeOptions:
      default-io-profile: "6"
    csi:
      enabled: true
    monitoring:
      telemetry:
        enabled: true
      prometheus:
        enabled: false
        exportMetrics: true
    env:
      - name: PURE_FLASHARRAY_SAN_TYPE
        value: ISCSI # or "FC"
```

<!-- For version 2.x of the pack, the namespace is `kube-system`. For version 3.x and higher of the pack, the namespace is `portworx` by default. -->

</TabItem>
</Tabs>

<br />

### Etcd

Portworx Enterprise supports multiple etcd scenarios. Portworx will default to an internal key-value store (KVDB).

#### Kvdb and Etcd Presets

The following pack presets are available for configuring etcd.

The pack defaults to the **Use Internal Kvdb** option. You can change to a different preset if you need to connect to an external etcd server.

<Tabs queryString="keyvalue">
<TabItem label="Use Internal Kvdb" value="Use Internal Kvdb">

```yaml
storageCluster:
  spec:
    kvdb:
      internal: true
```

</TabItem>
<TabItem label="Use External Kvdb over HTTP" value="Use External Kvdb over HTTP">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
```

</TabItem>

<TabItem label="Use External Kvdb over SSL" value="Use External Kvdb over SSL">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
      authSecret: px-kvdb-auth

# External kvdb related config, only used if storageCluster.spec.kvdb.internal != true
externalKvdb:
  useCertsForSSL: true
  # The CA cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cacert: |
    < PEM KEY DATA >
  # The cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cert: |
    < PEM KEY DATA >
  # The key to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  key: |
    < PEM KEY DATA >
```

</TabItem>
</Tabs>

#### Integration With External Etcd

Use the following steps to integrate Portworx to an external etcd server by following the steps below.

1. During the cluster profile creation, select the Portworx pack and click on the **Presets** button in the top right corner of the pack user interface.

2. Select the **Use External Kvdb over HTTP** or **Use External Kvdb over SSL** preset in the pack UI. If your external etcd server requires certificate authentication, select **Use External Kvdb over SSL** preset.

3. Configure the external etcd endpoints in the YAML parameter block named `charts.portworx-generic.storageCluster.spec.kvdb.endpoints`.

4. If you selected the **Use External Kvdb over SSL** preset, you will also need to configure the `charts.portworx-generic.externalKvdb` section. Set `charts.portworx-generic.externalKvdb.useCertsForSSL` to `true` to enable certificate authentication. Input your SSL certificates in the `cacert`, `cert`, and `key` sections of `charts.portworx-generic.externalKvdb`. The preset will give you cropped example values that you can overwrite with your actual PEM certificates. Leave the `charts.portworx-generic.storageCluster.spec.kvdb.endpoints` option to its default of `px-kvdb-auth`. The name of the Kubernetes secret will automatically get created by this pack.

:::warning

    When inserting SSL certificate values into the YAML. Ensure you follow the provided indentation style. Otherwise, SSL certificates will not be imported correctly and will result in Portworx deployment failure.

:::

<br />

</TabItem>

<TabItem label="2.13.X" value="2.13.x">

## Prerequisites

Portworx Operator has the following prerequisites for installation. You can learn more about all the required Portworx requirements in the [Portworx documentation](https://docs.portworx.com/install-portworx/prerequisites).

- The Kubernetes cluster must have at least three nodes of the type bare metal or virtual machine.

- Storage drives must be unmounted block storage. You can use either, raw disks, drive partitions, LVM, or cloud block storage.

- The backing drive must be at least 8 GB in size.

- The following disk folder require enough space to store Portworx metadata:

  - **/var** - 2 GB

  - **/opt** - 3 GB

- The operating system root partition must be at least 64 GB is the minimum.

- The minimum hardware requirements for each node are:

  - 4 CPU cores

  - 8 GB RAM

  - 50 GB disk space

  - 1 Gbps network connectivity

- A Linux kernel version of 3.10 or higher is required.

* Docker version 1.13.1 or higher is required.

- Ensure you use a [supported Kubernetes version](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites#supported-kubernetes-versions).

- Identify and set up the type of storage you want to use.

:::warning

Starting with Portworx version 3.x.x and greater. Lighthouse is no longer available in the pack itself. Instead you can install [Portworx Central](https://docs.portworx.com/portworx-central-on-prem/install/px-central.html), which provides monitoring capabilities.

:::

## Parameters

The following parameters are highlighted for this version of the pack and provide a preset option when configured through the UI. These parameters are not exhaustive and you can configure additional parameters as needed.

| Parameter                              | Description                                                                                                                                                                                                           | Default      |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- |
| `portworx-generic.activateLicense`     | Set to `true` to activate the Portworx license.                                                                                                                                                                       | `true`       |
| `portworx-generic.license.type`        | Allowed values are: `essentials`, `saas`, `enterprise`. If you want to deploy the PX Enterprise Trial version, or need manual offline activation, select **PX Enterprise** type and set `activateLicense` to `false`. | `essentials` |
| `portworx-generic.Storagecluster.spec` | Define the storage type and behavior for Portworx.Refer to the Storage Specification section below to learn more.                                                                                                     | `{}`         |
| `portworx-generic.externalKvdb`        | Define the external Key Value Database (KVDB) configuration for Portworx. Refer to the Integration With External etcd section below to learn more.                                                                    | `{}`         |
| `portworx-generic.storageCluster.env`  | Specify environment variables, such as HTTP Proxy settings, for Portworx.                                                                                                                                             | `{}`         |

## Usage

The default installation of Portworx /w Operator will deploy the following components in the Kubernetes cluster:

- Portworx Operator

- `StorageCluster` resource that tells the Operator how to deploy and configure Portworx.

- `StorageClass` resource for dynamic provisioning of `PersistentVolumes`` using the `pxd.portworx.com` provisioner.

- [Stork](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/stork.html). Portworx's storage scheduler for Kubernetes.

- [Lighthouse](https://portworx.com/blog/manage-portworx-clusters-using-lighthouse/). Portworx's monitoring and alerting solution for Kubernetes.

<br />

### License Model

This pack can install Portworx in three different licensing modes:

- **Essentials**: a free Portworx license with limited functionality that allows you to deploy a small production or proof-of-concept workloads. Essentials limits capacity and advanced features, but otherwise functions the same way as the fully featured Portworx Enterprise version of Portworx.

- **Enterprise**: the fully featured version of Portworx. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

- **Enterprise SaaS PAYG**: the fully featured version of Portworx but using a SaaS license key that allows unlimited use and in-arrears billing. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

Use the presets in the pack user interface to select which license model you want to use, then update the `charts.portworx-generic.license` section for your chosen license model.

<br />

<Tabs queryString="license">
<TabItem label="PX Essentials" value="PX Essentials">

```yaml
license:
  type: essentials
  essentials:
    # Base64-decoded value of the px-essen-user-id value in the px-essential secret
    # Find your Essentials Entitlement ID at https://central.portworx.com/profile
    userId: 1234abcd-12ab-12ab-12ab-123456abcdef
    # Base64-decoded value of the px-osb-endpoint value in the px-essential secret
    # Leave at the default value unless there are special circumstances
    endpoint: https://pxessentials.portworx.com/osb/billing/v1/register
```

</TabItem>
<TabItem label="PX Enterprise" value="PX Enterprise">

```yaml
license:
  type: saas
  saas:
    key: <PAY-AS-YOU-GO-KEY>
```

</TabItem>

<TabItem label="PX Enterprise SaaS PAYG" value="PX Enterprise SaaS PAYG">

```yaml
license:
  type: enterprise
  enterprise:
    activateLicense: true
    activationId: <Activation ID>
    # customLicenseServer:
    #   url: http://hostname:7070/fne/bin/capability
    #   importUnknownCa: true
    #   licenseBorrowInterval: 1w15m
    #   addFeatures:
    #   - feature1
    #   - feature2
```

</TabItem>
</Tabs>

### Storage Specification

You can install Portworx in a variety of storage configurations.

- **Existing disks (generic)**: This mode does not integrate with any particular storage solution, it uses existing disks available on the nodes.

- **AWS Cloud Storage**: This mode integrates with Amazon EBS block volumes and allows AWS EKS and EC2 based Kubernetes clusters to dynamically attach EBS volumes to worker nodes for Portworx.

- **Azure Cloud Storage**: This mode integrates with Azure block storage and allows Azure AKS and regular Azure Kubernetes clusters to dynamically attach Azure block storage to worker nodes for Portworx.

- **Google Cloud Storage**: This mode integrates with Google persistent disks and allows GKE and regular Google Kubernetes clusters to dynamically attach persistent disks to worker nodes for Portworx.

- **VMware vSphere Datastores**: This mode integrates with VMware vSphere storage and allows Kubernetes clusters on vSphere to dynamically attach vSAN and regular Datastore disks to worker nodes for Portworx.

- **Pure Storage Flash Array**: This mode integrates with Pure Storage Flash Arrays and allows Kubernetes clusters to dynamically attach Flash Array disks over iSCSI to worker nodes for Portworx.

:::tip

Use the presets in the pack user interface to select which storage specification you want to use, then update the `charts.portworx-generic.storageCluster` section to your specific needs.

:::

Select the tab below for the storage specification you want to use. Use the example YAML as a starting point for your configuration.

<br />

<Tabs queryString="storage">
<TabItem label="Generic" value="Generic">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    storage:
      useAll: true
      journalDevice: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="AWS" value="AWS">

To deploy Portworx in an AWS environment, ensure the following IAM policy is created in AWS and attached to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role.
<br/>

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action":
          [
            "ec2:AttachVolume",
            "ec2:ModifyVolume",
            "ec2:DetachVolume",
            "ec2:CreateTags",
            "ec2:CreateVolume",
            "ec2:DeleteTags",
            "ec2:DeleteVolume",
            "ec2:DescribeTags",
            "ec2:DescribeVolumeAttribute",
            "ec2:DescribeVolumesModifications",
            "ec2:DescribeVolumeStatus",
            "ec2:DescribeVolumes",
            "ec2:DescribeInstances",
            "autoscaling:DescribeAutoScalingGroups",
          ],
        "Resource": ["*"],
      },
    ],
}
```

- When deploying a regular Kubernetes cluster on an AWS EC2 using Palette, attach the policy to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role. Or alternatively, edit the AWS cloud account in Palette, enable the `Add IAM Policies` option, and select the Portworx IAM policy described above. This will automatically attach the IAM policy to the correct IAM role..

- When deploying an AWS EKS cluster, use the `managedMachinePool.roleAdditionalPolicies` option in the Kubernetes pack layer YAML to automatically attach the Portworx IAM policy to the EKS worker pool IAM role . The example below shows how to attach the Portworx IAM policy to the EKS worker pool IAM role.

```yaml
managedMachinePool:
  roleAdditionalPolicies:
    - "arn:aws:iam::012345678901:policy/my-portworx-policy"
```

```yaml
storageCluster:
  annotations:
    portworx.io/is-eks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=gp2,size=150
      kvdbDeviceSpec: type=gp2,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="Azure" value="Azure">

```yaml
storageCluster:
  annotations:
    portworx.io/is-aks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=Premium_LRS,size=150
      kvdbDeviceSpec: type=Premium_LRS,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: AZURE_CLIENT_SECRET
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_SECRET
      - name: AZURE_CLIENT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_ID
      - name: AZURE_TENANT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_TENANT_ID
  azureSecret:
    tenantId: "your_azure_tenant_id"
    clientId: "your_azure_client_id"
    clientSecret: "your_client_secret"
```

</TabItem>
<TabItem label="Google" value="Google">

```yaml
storageCluster:
  annotations:
    portworx.io/is-gke: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=pd-standard,size=150
      kvdbDeviceSpec: type=pd-standard,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="VMware vSphere" value="VMware vSphere">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=lazyzeroedthick,size=150
      kvdbDeviceSpec: type=lazyzeroedthick,size=32
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: VSPHERE_INSECURE
        value: "true"
      - name: VSPHERE_USER
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_USER
      - name: VSPHERE_PASSWORD
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_PASSWORD
      - name: VSPHERE_VCENTER
        value: "my-vcenter.company.local"
      - name: VSPHERE_VCENTER_PORT
        value: "443"
      - name: VSPHERE_DATASTORE_PREFIX
        value: "datastore"
      - name: VSPHERE_INSTALL_MODE
        value: "shared"
vsphereSecret:
  user: "username_for_vCenter_here"
  password: "your_password"
```

</TabItem>
<TabItem label="Pure Flash Array" value="Pure Flash Array">

To activate the Pure Flash Array integration, you will need to create a Kubernetes secret named `px-pure-secret` on your cluster containing your [Flash Array license JSON](https://docs.portworx.com/portworx-enterprise/cloud-references/auto-disk-provisioning/pure-flash-array.html#deploy-portworx). The secret must be created in the namespace that contains the `StorageCluster` resource. The namespace is `kube-system` by default.

Use the following command to create the secret:

```
kubectl create secret generic px-pure-secret --namespace portworx --from-file=pure.json=<file path>
```

Alternatively, you can attach a manifest to the Portworx /w Operator pack that contains the YAML for the secret.

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - size=150
      kvdbDeviceSpec: size=32
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: PURE_FLASHARRAY_SAN_TYPE
        value: "ISCSI"
```

</TabItem>
</Tabs>

<br />

### Etcd

Portworx Enterprise supports multiple etcd scenarios. Portworx will default to an internal key-value store (KVDB).

#### Kvdb and Etcd Presets

The following pack presets are available for configuring etcd.

The pack defaults to the **Use Internal Kvdb** option. You can change to a different preset if you need to connect to an external etcd server.

<Tabs queryString="keyvalue">
<TabItem label="Use Internal Kvdb" value="Use Internal Kvdb">

```yaml
storageCluster:
  spec:
    kvdb:
      internal: true
```

</TabItem>
<TabItem label="Use External Kvdb over HTTP" value="Use External Kvdb over HTTP">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
```

</TabItem>

<TabItem label="Use External Kvdb over SSL" value="Use External Kvdb over SSL">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
      authSecret: px-kvdb-auth

# External kvdb related config, only used if storageCluster.spec.kvdb.internal != true
externalKvdb:
  useCertsForSSL: true
  # The CA cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cacert: |
    < PEM KEY DATA >
  # The cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cert: |
    < PEM KEY DATA >
  # The key to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  key: |
    < PEM KEY DATA >
```

</TabItem>
</Tabs>

#### Integration With External Etcd

Use the following steps to integrate Portworx to an external etcd server by following the steps below.

1. During the cluster profile creation, select the Portworx pack and click on the **Presets** button in the top right corner of the pack user interface.

2. Select the **Use External Kvdb over HTTP** or **Use External Kvdb over SSL** preset in the pack UI. If your external etcd server requires certificate authentication, select **Use External Kvdb over SSL** preset.

3. Configure the external etcd endpoints in the YAML parameter block named `charts.portworx-generic.storageCluster.spec.kvdb.endpoints`.

4. If you selected the **Use External Kvdb over SSL** preset, you will also need to configure the `charts.portworx-generic.externalKvdb` section. Set `charts.portworx-generic.externalKvdb.useCertsForSSL` to `true` to enable certificate authentication. Input your SSL certificates in the `cacert`, `cert`, and `key` sections of `charts.portworx-generic.externalKvdb`. The preset will give you cropped example values that you can overwrite with your actual PEM certificates. Leave the `charts.portworx-generic.storageCluster.spec.kvdb.endpoints` option to its default of `px-kvdb-auth`. The name of the Kubernetes secret will automatically get created by this pack.

:::warning

    When inserting SSL certificate values into the YAML. Ensure you follow the provided indentation style. Otherwise, SSL certificates will not be imported correctly and will result in Portworx deployment failure.

:::

<br />

</TabItem>

<TabItem label="2.12.X" value="2.12.x">

## Prerequisites

Portworx Operator has the following prerequisites for installation. You can learn more about all the required Portworx requirements in the [Portworx documentation](https://docs.portworx.com/install-portworx/prerequisites).

- The Kubernetes cluster must have at least three nodes of the type bare metal or virtual machine.

- Storage drives must be unmounted block storage. You can use either, raw disks, drive partitions, LVM, or cloud block storage.

- The backing drive must be at least 8 GB in size.

- The following disk folder require enough space to store Portworx metadata:

  - **/var** - 2 GB

  - **/opt** - 3 GB

- The operating system root partition must be at least 64 GB is the minimum.

- The minimum hardware requirements for each node are:

  - 4 CPU cores

  - 8 GB RAM

  - 50 GB disk space

  - 1 Gbps network connectivity

- A Linux kernel version of 3.10 or higher is required.

* Docker version 1.13.1 or higher is required.

- Ensure you use a [supported Kubernetes version](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites#supported-kubernetes-versions).

- Identify and set up the type of storage you want to use.

:::warning

Starting with Portworx version 3.x.x and greater. Lighthouse is no longer available in the pack itself. Instead you can install [Portworx Central](https://docs.portworx.com/portworx-central-on-prem/install/px-central.html), which provides monitoring capabilities.

:::

## Parameters

The following parameters are highlighted for this version of the pack and provide a preset option when configured through the UI. These parameters are not exhaustive and you can configure additional parameters as needed.

| Parameter                              | Description                                                                                                                                                                                                      | Default      |
| :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- |
| `portworx-generic.activateLicense`     | Set to `true` to activate the Portworx license.                                                                                                                                                                  | `true`       |
| `portworx-generic.license.type`        | Allowed values are: `essentials`, `saas`, `enterprise`. If you want to deploy the PX Enterprise Trial version, or need manual offline activation, select **PX Enterprise** and set `activateLicense` to `false`. | `essentials` |
| `portworx-generic.Storagecluster.spec` | Define the storage type and behavior for Portworx.Refer to the Storage Specification section below to learn more.                                                                                                | `{}`         |
| `portworx-generic.externalKvdb`        | Define the external Key Value Database (KVDB) configuration for Portworx. Refer to the Integration With External etcd section below to learn more.                                                               | `{}`         |
| `portworx-generic.storageCluster.env`  | Specify environment variables, such as HTTP Proxy settings, for Portworx.                                                                                                                                        | `{}`         |

## Usage

The default installation of Portworx /w Operator will deploy the following components in the Kubernetes cluster:

- Portworx Operator

- `StorageCluster` resource that tells the Operator how to deploy and configure Portworx.

- `StorageClass` resource for dynamic provisioning of `PersistentVolumes`` using the `pxd.portworx.com` provisioner.

- [Stork](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/stork.html). Portworx's storage scheduler for Kubernetes.

- [Lighthouse](https://portworx.com/blog/manage-portworx-clusters-using-lighthouse/). Portworx's monitoring and alerting solution for Kubernetes.

<br />

### License Model

This pack can install Portworx in three different licensing modes:

- **Essentials**: a free Portworx license with limited functionality that allows you to deploy a small production or proof-of-concept workloads. Essentials limits capacity and advanced features, but otherwise functions the same way as the fully featured Portworx Enterprise version of Portworx.

- **Enterprise**: the fully featured version of Portworx. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

- **Enterprise SaaS PAYG**: the fully featured version of Portworx but using a SaaS license key that allows unlimited use and in-arrears billing. If you install this model without a valid key, Portworx will automatically enter a 30-day trial mode.

Use the presets in the pack user interface to select which license model you want to use, then update the `charts.portworx-generic.license` section for your chosen license model.

<br />

<Tabs queryString="license">
<TabItem label="PX Essentials" value="PX Essentials">

```yaml
license:
  type: essentials
  essentials:
    # Base64-decoded value of the px-essen-user-id value in the px-essential secret
    # Find your Essentials Entitlement ID at https://central.portworx.com/profile
    userId: 1234abcd-12ab-12ab-12ab-123456abcdef
    # Base64-decoded value of the px-osb-endpoint value in the px-essential secret
    # Leave at the default value unless there are special circumstances
    endpoint: https://pxessentials.portworx.com/osb/billing/v1/register
```

</TabItem>
<TabItem label="PX Enterprise" value="PX Enterprise">

```yaml
license:
  type: saas
  saas:
    key: <PAY-AS-YOU-GO-KEY>
```

</TabItem>

<TabItem label="PX Enterprise SaaS PAYG" value="PX Enterprise SaaS PAYG">

```yaml
license:
  type: enterprise
  enterprise:
    activateLicense: true
    activationId: <Activation ID>
    # customLicenseServer:
    #   url: http://hostname:7070/fne/bin/capability
    #   importUnknownCa: true
    #   licenseBorrowInterval: 1w15m
    #   addFeatures:
    #   - feature1
    #   - feature2
```

</TabItem>
</Tabs>

### Storage Specification

You can install Portworx in a variety of storage configurations.

- **Existing disks (generic)**: This mode does not integrate with any particular storage solution, it uses existing disks available on the nodes.

- **AWS Cloud Storage**: This mode integrates with Amazon EBS block volumes and allows AWS EKS and EC2 based Kubernetes clusters to dynamically attach EBS volumes to worker nodes for Portworx.

- **Azure Cloud Storage**: This mode integrates with Azure block storage and allows Azure AKS and regular Azure Kubernetes clusters to dynamically attach Azure block storage to worker nodes for Portworx.

- **Google Cloud Storage**: This mode integrates with Google persistent disks and allows GKE and regular Google Kubernetes clusters to dynamically attach persistent disks to worker nodes for Portworx.

- **VMware vSphere Datastores**: This mode integrates with VMware vSphere storage and allows Kubernetes clusters on vSphere to dynamically attach vSAN and regular Datastore disks to worker nodes for Portworx.

- **Pure Storage Flash Array**: This mode integrates with Pure Storage Flash Arrays and allows Kubernetes clusters to dynamically attach Flash Array disks over iSCSI to worker nodes for Portworx.

:::tip

Use the presets in the pack user interface to select which storage specification you want to use, then update the `charts.portworx-generic.storageCluster` section to your specific needs.

:::

Select the tab below for the storage specification you want to use. Use the example YAML as a starting point for your configuration.

<br />

<Tabs queryString="storage">
<TabItem label="Generic" value="Generic">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    storage:
      useAll: true
      journalDevice: auto
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="AWS" value="AWS">

To deploy Portworx in an AWS environment, ensure the following IAM policy is created in AWS and attached to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role.
<br/>

```yaml
{
  "Version": "2012-10-17",
  "Statement":
    [
      {
        "Effect": "Allow",
        "Action":
          [
            "ec2:AttachVolume",
            "ec2:ModifyVolume",
            "ec2:DetachVolume",
            "ec2:CreateTags",
            "ec2:CreateVolume",
            "ec2:DeleteTags",
            "ec2:DeleteVolume",
            "ec2:DescribeTags",
            "ec2:DescribeVolumeAttribute",
            "ec2:DescribeVolumesModifications",
            "ec2:DescribeVolumeStatus",
            "ec2:DescribeVolumes",
            "ec2:DescribeInstances",
            "autoscaling:DescribeAutoScalingGroups",
          ],
        "Resource": ["*"],
      },
    ],
}
```

- When deploying a regular Kubernetes cluster on an AWS EC2 using Palette, attach the policy to the `nodes.cluster-api-provider-aws.sigs.k8s.io` IAM role. Or alternatively, edit the AWS cloud account in Palette, enable the `Add IAM Policies` option, and select the Portworx IAM policy described above. This will automatically attach the IAM policy to the correct IAM role..

- When deploying an AWS EKS cluster, use the `managedMachinePool.roleAdditionalPolicies` option in the Kubernetes pack layer YAML to automatically attach the Portworx IAM policy to the EKS worker pool IAM role . The example below shows how to attach the Portworx IAM policy to the EKS worker pool IAM role.

```yaml
managedMachinePool:
  roleAdditionalPolicies:
    - "arn:aws:iam::012345678901:policy/my-portworx-policy"
```

```yaml
storageCluster:
  annotations:
    portworx.io/is-eks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=gp2,size=150
      kvdbDeviceSpec: type=gp2,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="Azure" value="Azure">

```yaml
storageCluster:
  annotations:
    portworx.io/is-aks: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=Premium_LRS,size=150
      kvdbDeviceSpec: type=Premium_LRS,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: AZURE_CLIENT_SECRET
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_SECRET
      - name: AZURE_CLIENT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_CLIENT_ID
      - name: AZURE_TENANT_ID
        valueFrom:
          secretKeyRef:
            name: px-azure
            key: AZURE_TENANT_ID
  azureSecret:
    tenantId: "your_azure_tenant_id"
    clientId: "your_azure_client_id"
    clientSecret: "your_client_secret"
```

</TabItem>
<TabItem label="Google" value="Google">

```yaml
storageCluster:
  annotations:
    portworx.io/is-gke: "true"
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=pd-standard,size=150
      kvdbDeviceSpec: type=pd-standard,size=150
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
```

</TabItem>
<TabItem label="VMware vSphere" value="VMware vSphere">

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - type=lazyzeroedthick,size=150
      kvdbDeviceSpec: type=lazyzeroedthick,size=32
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: VSPHERE_INSECURE
        value: "true"
      - name: VSPHERE_USER
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_USER
      - name: VSPHERE_PASSWORD
        valueFrom:
          secretKeyRef:
            name: px-vsphere-secret
            key: VSPHERE_PASSWORD
      - name: VSPHERE_VCENTER
        value: "my-vcenter.company.local"
      - name: VSPHERE_VCENTER_PORT
        value: "443"
      - name: VSPHERE_DATASTORE_PREFIX
        value: "datastore"
      - name: VSPHERE_INSTALL_MODE
        value: "shared"
vsphereSecret:
  user: "username_for_vCenter_here"
  password: "your_password"
```

</TabItem>
<TabItem label="Pure Flash Array" value="Pure Flash Array">

To activate the Pure Flash Array integration, you will need to create a Kubernetes secret named `px-pure-secret` on your cluster containing your [Flash Array license JSON](https://docs.portworx.com/portworx-enterprise/cloud-references/auto-disk-provisioning/pure-flash-array.html#deploy-portworx). The secret must be created in the namespace that contains the `StorageCluster` resource. The namespace is `kube-system` by default.

Use the following command to create the secret:

```
kubectl create secret generic px-pure-secret --namespace portworx --from-file=pure.json=<file path>
```

Alternatively, you can attach a manifest to the Portworx /w Operator pack that contains the YAML for the secret.

```yaml
storageCluster:
  spec:
    # Use the Portworx Spec Builder at https://central.portworx.com/landing/login to define custom configurations, then paste the spec section here
    image: portworx/oci-monitor:2.11.2
    imagePullPolicy: Always
    kvdb:
      internal: true
      # endpoints:
      # - etcd:https://etcd.company.domain:2379
      # authSecret: px-kvdb-auth
    cloudStorage:
      deviceSpecs:
        - size=150
      kvdbDeviceSpec: size=32
    secretsProvider: k8s
    stork:
      enabled: true
      args:
        webhook-controller: "true"
    autopilot:
      enabled: true
    csi:
      enabled: true
    monitoring:
      prometheus:
        enabled: false
        exportMetrics: false
    env:
      - name: PURE_FLASHARRAY_SAN_TYPE
        value: "ISCSI"
```

</TabItem>
</Tabs>

<br />

### Etcd

Portworx Enterprise supports multiple etcd scenarios. Portworx will default to an internal key-value store (KVDB).

#### Kvdb and Etcd Presets

The following pack presets are available for configuring etcd.

The pack defaults to the **Use Internal Kvdb** option. You can change to a different preset if you need to connect to an external etcd server.

<Tabs queryString="keyvalue">
<TabItem label="Use Internal Kvdb" value="Use Internal Kvdb">

```yaml
storageCluster:
  spec:
    kvdb:
      internal: true
```

</TabItem>
<TabItem label="Use External Kvdb over HTTP" value="Use External Kvdb over HTTP">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
```

</TabItem>

<TabItem label="Use External Kvdb over SSL" value="Use External Kvdb over SSL">

```yaml
storageCluster:
  spec:
    kvdb:
      endpoints:
        - etcd:http://etcd.company.domain:2379
      authSecret: px-kvdb-auth

# External kvdb related config, only used if storageCluster.spec.kvdb.internal != true
externalKvdb:
  useCertsForSSL: true
  # The CA cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cacert: |
    < PEM KEY DATA >
  # The cert to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  cert: |
    < PEM KEY DATA >
  # The key to use for etcd authentication. Make sure to follow the same indentation style as given in the example below
  key: |
    < PEM KEY DATA >
```

</TabItem>
</Tabs>

#### Integration With External Etcd

Use the following steps to integrate Portworx to an external etcd server by following the steps below.

1. During the cluster profile creation, select the Portworx pack and click on the **Presets** button in the top right corner of the pack user interface.

2. Select the **Use External Kvdb over HTTP** or **Use External Kvdb over SSL** preset in the pack UI. If your external etcd server requires certificate authentication, select **Use External Kvdb over SSL** preset.

3. Configure the external etcd endpoints in the YAML parameter block named `charts.portworx-generic.storageCluster.spec.kvdb.endpoints`.

4. If you selected the **Use External Kvdb over SSL** preset, you will also need to configure the `charts.portworx-generic.externalKvdb` section. Set `charts.portworx-generic.externalKvdb.useCertsForSSL` to `true` to enable certificate authentication. Input your SSL certificates in the `cacert`, `cert`, and `key` sections of `charts.portworx-generic.externalKvdb`. The preset will give you cropped example values that you can overwrite with your actual PEM certificates. Leave the `charts.portworx-generic.storageCluster.spec.kvdb.endpoints` option to its default of `px-kvdb-auth`. The name of the Kubernetes secret will automatically get created by this pack.

:::warning

When inserting SSL certificate values into the YAML. Ensure you follow the provided indentation style. Otherwise, SSL certificates will not be imported correctly and will result in Portworx deployment failure.
:::

</TabItem>

<TabItem label="Deprecated" value="deprecated">

:::warning

All versions less than 2.12.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

<br />

</TabItem>

</Tabs>

## Terraform

Use the following Terraform code to interact with the Portworx Operator pack in your Terraform scripts.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "portworx-operator" {
  name    = "csi-portworx-generic"
  version = "3.0.0"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Portworx Install with Kubernetes](https://docs.portworx.com/portworx-install-with-kubernetes/)

- [Installation Prerequisites](https://docs.portworx.com/install-portworx/prerequisites/)

- [Portworx Supported Kubernetes versions](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites#supported-kubernetes-versions)

- [Stork](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/stork.html)

- [Portworx Central](https://docs.portworx.com/portworx-central-on-prem/install/px-central.html)

- [Flash Array License JSON](https://docs.portworx.com/portworx-enterprise/cloud-references/auto-disk-provisioning/pure-flash-array.html#deploy-portworx)
