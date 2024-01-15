---
sidebar_label: "Using DataVolumes for disk templates"
title: "Using DataVolumes for disk templates"
description: "Using DataVolumes to quickly create VMs from template disks in Palette Virtual Machine Orchestrator"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---



Palette Virtual Machine Orchestrator (VMO) streamlines the deployment of VMs through the ability to create and manage templates. Check out the [Create a VM Template](./create-vm-template.md) guide to learn more. When VMs are deployed from template, they often include a disk template containing a pre-installed copy of the desired OS. The [Kubevirt Containerized Data Importer (CDI)](https://github.com/kubevirt/containerized-data-importer/tree/main) imports templates through [Data Volumes](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md). This tutorial teaches you how to implement your own disk templates using Kubevirt Data Volumes.


## Overview

![Image cloning with CDI](/cdi-disk-clone.png)

The diagram above is a representation of best approach:
1. Create a `DataVolume` resource to import an external disk image into the cluster, saving it as a template PVC on the cluster
2. Configure a `vmTemplate` resource to clone the template PVC into a new PVC for use by the VM. This is also achieved through a `DataVolume` specification, but this time inside the VM specification.
3. Set up RBAC permissions within the cluster to ensure Data Volumes can be used across namespaces.
4. Define `StorageProfile` resources to ensure Kubevirt CDI uses the CSI-assisted cloning technique instead of any slower alternatives.

<br />

## Implementation

The following reference implementation details the recommended approach to implementing the components mentioned above. Version 4.2.0 and higher of the VMO pack contain native support for this approach:
* Template disks will be imported into the `vmo-golden-images` namespace
* The `default` and `virtual-machines` namespaces will be configured with RBAC permissions required for cloning DataVolumes from the `vmo-golden-images` namespace
* `vmTemplate` resources will use a `dataVolumeTemplates` section that clones the template disk from the `vmo-golden-images` namespace

<br />

### Importing disk images as templates

The following manifest can be added to a manifest layer in a Palette cluster profile to define a `DataVolume` that imports the example disk template for Ubuntu 22.04 into the `vmo-golden-images` namespace:

```
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
    volumeMode: Block      # or "Filesystem", depending on the CSI used
  source:
    registry:
      url: "docker://gcr.io/spectro-images-public/release/vm-dashboard/os/ubuntu-container-disk:22.04"
```

Possible `source` options are described in the [CDI DataVolumes documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#source). The example above uses the `registry` source to import the data from a container disk on an external Docker registry.

Note 2 important aspects of this DataVolume:
* It sets an annotation to prevent deleting the `DataVolume` object after if finishes the import process. This is necessary to prevent Palette from continuously recreating the `DataVolume` object, resulting in error messages.
* The `volumeMode` needs to align with the mode that the CSI supports for `ReadWriteMany` access. For some CSIs such as Rook-Ceph and EMC PowerMax this is `Block` mode, while for other CSIs such as Portworx, Longhorn and EMC PowerFlex this is `Filesystem` mode.

:::info
When `Filesystem` mode is selected, the CDI will automatically apply a small overhead factor to the PVC size to account for the storage space lost due to filesystem overhead. As a result, the PVC for such a template will be slightly larger. Any clones made from this PVC also need to use this slightly larger minimum size.
:::

As soon as the `DataVolume` resource above is applied to the cluster, the CDI will begin importing the data into the target PVC in the `vmo-golden-images` namespace. The target PVC will have the same name as the `DataVolume` object.

<br />

### Creating vmTemplates with CSI-assisted cloning

The next step is to create a `vmTemplate` resource that clones the PVC in the `vmo-golden-images` namespace. This is done through the `dataVolumeTemplates` section:

```
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
          volumeMode: Block      # or "Filesystem", depending on the CSI used
  template:
    < rest of template >
```

The `spec.dataVolumeTemplates.spec` section defines which source PVC to clone and what PVC to clone into. In the example above, the `source` section points to the `template-ubuntu-2204` PVC in the `vmo-golden-images` namespace. The `pvc` section creates a new target PVC with the specified `accessMode` and `volumeMode` characteristics. The size of the new PVC must be the same or larger as the source PVC.

:::info
To allow CSI-assisted cloning to work, there are a few [prerequisites](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/csi-cloning.md#prerequisites) that must be followed. Most importantly, the source and target PVC must share the same Storage Class and the same Volume Mode. If the requirements are not met, CDI will automatically fallback to the slower host-assisted cloning.

To enable CSI-assisted cloning into larger PVCs than the source PVC, the Storage Class used must have `allowVolumeExpansion` set to `true`.
:::

<br />

### Setting up RBAC permissions for cloning across namespaces

When the CDI performs a cloning operation, it runs under the `default` serviceaccount in the namespace of the target PVC. When the source PVC is in a different namespace, required permissions must be given to the serviceaccount. Version 4.2.0 of the VMO pack does this automatically, you can specify the namespaces for which the permissions are configured through the `vmEnabledNamespaces` option in the pack:

```
charts:
  virtual-machine-orchestrator:

    # This namespace will be used to store golden images
    goldenImagesNamespace: "vmo-golden-images"

    # These namespaces will be created and set up to deploy VMs into
    vmEnabledNamespaces:
      - "default"
      - "virtual-machines"
```

<br />

### Defining StorageProfiles to ensure CSI-assisted cloning

While the CDI contains an internal database of CSIs and their supported access modes, volume modes and CSI-assisted cloning support, it is still recommended to create a `StorageProfile` to force these parameters to what we want them to be. For example:

```
apiVersion: cdi.kubevirt.io/v1beta1
kind: StorageProfile
metadata:
  name: ceph-block
spec:
  claimPropertySets: 
  - accessModes:
    - ReadWriteMany
    volumeMode: 
      Block
  cloneStrategy: csi-clone
```

The example above informs CDI that a Storage Class with the name `ceph-block` supports the `Block` volumeMode with the ReadWriteMany accessMode, and it should use `csi-clone` for cloning operations.

More information about Storage Profiles is available in the [CDI documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/storageprofile.md).

:::info
If Storage Profiles are not manually defined, CDI will automatically generate one for every Storage Class, based on the information in its internal database. It is recommend to verify these parameters are accurate for use case and if not, overwrite them by defining the Storage Profile manually.
:::

When Storage Profiles are properly defined, you can optionally replace the target `pvc` sections in your `vmTemplate` resources with a `storage` section as noted in the [CDI documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#storage):

```
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
    < rest of template >
```

Using `storage` instead of `pvc` will automatically discover default values for `accessModes`, `volumeMode` and optionally even the size from the source PVC and its associated Storage Profile. One benefit of `storage` over `pvc` is that the CDI will automatically calculate the size overhead for `Filesystem` mode Storage Classes, allowing the VM template to use the original disk size instead of one adjusted for the filesystem overhead.
