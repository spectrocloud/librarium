---
sidebar_label: "Create Disk Templates"
title: "Create Disk Templates"
description: "Create VMs from template disks in Palette Virtual Machine Orchestrator"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator(VMO) streamlines the deployment of Virtual Machines (VMs) through its ability to
create and manage templates. Check out the [Create a VM Template](./create-vm-template.md) guide to learn more about how
to create your own VM template.

When VMs are deployed from template, they often include a disk template containing a pre-installed copy of the desired
OS. The [Kubevirt Containerized Data Importer (CDI)](https://github.com/kubevirt/containerized-data-importer/tree/main)
imports templates through
[Data Volumes](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md). This guide
demonstrates how to implement your own disk templates using Kubevirt Data Volumes.

## Prerequisites

- A VMO profile. Check out the [Create a VMO Profile](../vm-packs-profiles/create-vmo-profile.md) guide for the steps of
  how to create this profile.
- A deployed cluster with this VMO profile. Check out the
  [Deploy a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md) tutorial for the detailed steps on how to deploy
  a cluster to a public cloud.

## Create a DataVolume

Create a new **Add-on Profile** with the following manifest. Check out the
[Add a Manifest](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
guide for more information.

```yaml {5,6,7,15,17,18}
apiVersion: cdi.kubevirt.io/v1beta1
kind: DataVolume
metadata:
  name: "template-ubuntu-2204"
  namespace: "vmo-golden-images"
  annotations:
    cdi.kubevirt.io/storage.deleteAfterCompletion: "false"
spec:
  storage:
    accessModes:
      - ReadWriteMany
    resources:
      requests:
        storage: 50Gi
    volumeMode: Block # or "Filesystem", depending on the CSI used
  source:
    registry:
      url: "docker://gcr.io/spectro-images-public/release/vm-dashboard/os/ubuntu-container-disk:22.04"
```

The provided manifest defines a `DataVolume` that imports the example disk template for Ubuntu 22.04 into the
`vmo-golden-images` namespace.

This `DataVolume` has three important configuration options.

- It sets the `cdi.kubevirt.io/storage.deleteAfterCompletion` annotation to prevent deleting the `DataVolume` object
  after the import process completes. This is necessary to prevent Palette from continuously recreating the `DataVolume`
  object.
- The `volumeMode` aligns with the mode that the CSI supports for `ReadWriteMany` access. For some CSIs such as
  Rook-Ceph and EMC PowerMax this is `Block` mode, while for other CSIs such as Portworx, Longhorn and EMC PowerFlex
  this is `Filesystem` mode. Make sure to check this setting if you choose another CSI than demonstrated.
- The `registry` source specifies data should be imported from a container disk on an external Docker registry.
  [CDI DataVolumes documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#source)
  describes other possible `source` values.

:::warning

When `Filesystem` mode is selected, the CDI will automatically apply a small overhead factor to the Persisten Volume
Claim (PVC) size to account for the storage space lost due to filesystem overhead. As a result, the PVC for such a
template will be slightly larger. Any clones made from this PVC also need to use this slightly larger minimum size.

:::

Navigate to the left **Main Menu** and select **Clusters**.

Select your cluster and view its **Overview** tab. Select the **Profile** tab.

Add the newly created **Add-on Profile** to your cluster profile. Click on **Save**.

![Add-on Profile](/create-disk-templates-guide/vm-management_create-manage-vm_create-disk-templates_add-on-disk-template-profile.png)

Your cluster applies the changes. As soon as the cluster finishes updating, the CDI begins to import the data into the
target PVC in the `vmo-golden-images` namespace. The target PVC has the same name as the `DataVolume` object.

### Create templates with CSI-assisted cloning

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profiles page. Find the cluster profile
you created in the previous step.

Click on the manifest layer. The manifest editor appears.

Add the following code snippet to the manifest contents, separated by `---`.

```yaml {9,10,14}
apiVersion: spectrocloud.com/v1
kind: VmTemplate
metadata:
  name: ubuntu-2204
spec:
  dataVolumeTemplates:
    - metadata:
        name: ubuntu-2204
      spec:
        source:
          pvc:
            name: template-ubuntu-2204
            namespace: vmo-golden-images
        pvc:
          accessModes:
            - ReadWriteMany
          resources:
            requests:
              storage: 50Gi
          volumeMode: Block # or "Filesystem", depending on the CSI used
  template:
    metadata:
      annotations:
        descheduler.alpha.kubernetes.io/evict: "true"
    spec:
      domain:
        cpu:
          cores: 2
          sockets: 1
          threads: 1
        devices:
          disks:
            - disk:
                bus: virtio
              name: datavolume-os
            - disk:
                bus: virtio
              name: cloudinitdisk
          interfaces:
            - masquerade: {}
              name: default
              model: virtio
        machine:
          type: q35
        resources:
          limits:
            memory: 2Gi
          requests:
            memory: 2Gi
      networks:
        - name: default
          pod: {}
      volumes:
        - dataVolume:
            name: ubuntu-2204
          name: datavolume-os
        - cloudInitNoCloud:
            userData: |
              #cloud-config
              ssh_pwauth: True
              chpasswd: { expire: False }
              password: spectro
              disable_root: false
              runcmd:
                - apt-get update
                - apt-get install -y qemu-guest-agent
                - systemctl start qemu-guest-agent
          name: cloudinitdisk
```

Click on **Confirm updates**. The manifest editor closes.

Click on **Save Changes**.

This snippet has three notable configurations.

- The `spec.dataVolumeTemplates.spec` section defines which source PVC to clone from and what PVC to clone into.
- The `spec.dataVolumeTemplates.spec.source` section points to the `template-ubuntu-2204` PVC in the `vmo-golden-images`
  namespace.
- The `spec.dataVolumeTemplates.spec.pvc` section creates a new target PVC with the specified `accessMode` and
  `volumeMode` characteristics. The size of the new PVC must be the same or larger as the source PVC.

:::warning

To allow CSI-assisted cloning to work, there are a few
[prerequisites](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/csi-cloning.md#prerequisites) that
must be followed. Most importantly, the source and target PVC must share the same Storage Class and the same Volume
Mode. If the requirements are not met, the CDI will automatically fallback to the slower host-assisted cloning.

:::

:::tip

To enable CSI-assisted cloning into larger PVCs than the source PVC, set `allowVolumeExpansion : true` on your defined
Storage Class.

:::

Navigate to the left **Main Menu** and select **Clusters**.

Select your cluster and view its **Overview** tab.

Click on **Updates** and review the changes to your cluster profile. Click **Confirm updates**.

Once the cluster updates, this VM template is available to the VMs you create on your cluster. Check out the
[Deploy VM From a Template](./standard-vm-operations/deploy-vm-from-template.md) guide for more information.

![Create VM from template](/create-disk-templates-guide/vm-management_create-manage-vm_create-disk-templates_create-vm-from-template.png)

### Set up RBAC permissions for cloning across namespaces

When the CDI performs a cloning operation, it runs under the `default` serviceaccount in the namespace of the target
PVC. When the source PVC is in a different namespace, required permissions must be given to the serviceaccount.

The [VMO pack](../vm-management.md) version 4.2.0 does this automatically through its default charts specification. This
configuration uses the `vmEnabledNamespaces` option to specify the namespaces for which the permissions are configured.

```yaml {8}
charts:
  virtual-machine-orchestrator:
    # This namespace will be used to store golden images
    goldenImagesNamespace: "vmo-golden-images"

    # These namespaces will be created and set up to deploy VMs into
    vmEnabledNamespaces:
      - "default"
      - "virtual-machines"
```

### Define StorageProfiles to ensure CSI-assisted cloning

The CDI contains an internal database of CSIs, the CSI supported access modes, volume modes and CSI-assisted cloning
support. However, it is still recommended to create a `StorageProfile` to force these parameters to your desired values.

Navigate to the left **Main Menu** and select **Profiles** to view the cluster profiles page. Find the cluster profile
you created in the previous step.

Click on the manifest layer. The manifest editor appears.

Add the following code snippet to the manifest contents, separated by `---`.

```yaml {4,8,10,11}
apiVersion: cdi.kubevirt.io/v1beta1
kind: StorageProfile
metadata:
  name: ceph-block
spec:
  claimPropertySets:
    - accessModes:
        - ReadWriteMany
      volumeMode: Block
  cloneStrategy: csi-clone
```

Click on **Confirm updates**. The manifest editor closes.

Click on **Save Changes**.

This snippet has three notable configurations for the storage class it defines.

- The storage class has the name `ceph-block`.
- The storage class supports the `Block` volume mode with the `ReadWriteMany` accessMode.
- The storage class uses `csi-clone` for cloning operations.

The [Storage Profiles](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/storageprofile.md) page in
the CDI documentation contains more information about storage profiles.

If Storage Profiles are not manually defined, the CDI will automatically generate one for every Storage Class, based on
the information in its internal database. It is recommend to verify these parameters are accurate for your use case and
if not, overwrite them by defining the Storage Profile manually.

As noted in the
[CDI documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#storage), you
can optionally replace the target `pvc` sections in your `vmTemplate` resources with a `storage` section once you have
defined a storage profile:

```yaml {14}
apiVersion: spectrocloud.com/v1
kind: VmTemplate
metadata:
  name: ubuntu-2204
spec:
  dataVolumeTemplates:
    - metadata:
        name: ubuntu-2204
      spec:
        source:
          pvc:
            name: template-ubuntu-2204
            namespace: vmo-golden-images
        storage:
          resources:
            requests:
              storage: 50Gi
  template:
    metadata:
      annotations:
        descheduler.alpha.kubernetes.io/evict: "true"
    spec:
      domain:
        cpu:
          cores: 2
          sockets: 1
          threads: 1
        devices:
          disks:
            - disk:
                bus: virtio
              name: datavolume-os
            - disk:
                bus: virtio
              name: cloudinitdisk
          interfaces:
            - masquerade: {}
              name: default
              model: virtio
        machine:
          type: q35
        resources:
          limits:
            memory: 2Gi
          requests:
            memory: 2Gi
      networks:
        - name: default
          pod: {}
      volumes:
        - dataVolume:
            name: ubuntu-2204
          name: datavolume-os
        - cloudInitNoCloud:
            userData: |
              #cloud-config
              ssh_pwauth: True
              chpasswd: { expire: False }
              password: spectro
              disable_root: false
              runcmd:
                - apt-get update
                - apt-get install -y qemu-guest-agent
                - systemctl start qemu-guest-agent
          name: cloudinitdisk
```

Using storage instead of PVC will automatically discover default values for `accessModes`, `volumeMode` and optionally
even the size from the source PVC and its associated storage profile.

A benefit of `storage` over `pvc` is that the CDI will automatically calculate the size overhead for `Filesystem` mode
storage classes, allowing the VM template to use the original disk size instead of one adjusted for the filesystem
overhead.

## Cleanup

Navigate to the left **Main Menu** and select **Clusters**.

Select your cluster to view its **Overview** tab.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

A dialog appears. Input the cluster name to confirm the delete action.

The deletion process takes several minutes to complete.

## Wrap-Up

In this guide, you created your own disk templates using Kubevirt Data Volumes. The process covered the following steps.

- Create a `DataVolume` resource to import an external disk image into the cluster. The data volume is a template
  Persistent Volume Claim (PVC).
- Configure a `vmTemplate` resource to clone the template PVC into a new PVC for use by your VM. This is a custom
  template that you can use with the VMO.
- Set up Role-Based Access Control (RBAC) permissions within the cluster to ensure Data Volumes can be used across
  namespaces.
- Define `StorageProfile` resources to ensure that the Kubevirt CDI uses the CSI-assisted cloning technique. The storage
  profile allows you to efficiently create VMs using the images already saved on your cluster.
