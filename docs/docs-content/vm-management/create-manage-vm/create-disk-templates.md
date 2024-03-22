---
sidebar_label: "Create Disk Templates"
title: "Create Disk Templates"
description: "Create VMs from template disks in Palette Virtual Machine Orchestrator"
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) enables you to quickly deploy Virtual Machines (VMs) by
[creating VM templates](./create-vm-template.md).

When deployed from a template, VMs include a disk template containing a pre-installed copy of the desired Operating
System (OS). The
[Kubevirt Containerized Data Importer (CDI)](https://github.com/kubevirt/containerized-data-importer/tree/main) imports
templates through [Data Volumes](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md).
This guide demonstrates how to implement your own disk and VM templates using Kubevirt Data Volumes.

## Prerequisites

- A VMO profile. Check out the [Create a VMO Profile](../vm-packs-profiles/create-vmo-profile.md) guide to learn how you
  can create this profile.
- A cluster deployed with this VMO profile. Check out the
  [Deploy a Cluster](../../clusters/public-cloud/deploy-k8s-cluster.md) tutorial for detailed steps on how you can
  deploy clusters to a public cloud.

## Create a Template

1.  Create a new **Add-on Profile** with the following manifest. Check out the
    [Add a Manifest](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
    guide for more information.

    The provided manifest defines a `DataVolume` that imports the example disk template for Ubuntu 22.04 into the
    `vmo-golden-images` namespace. This snippet has three important configuration options.

    - `cdi.kubevirt.io/storage.deleteAfterCompletion` that prevents deleting the `DataVolume` object after the import
      process completes. This annotation is necessary to stop Palette from continuously recreating the `DataVolume`
      object.
    - `volumeMode` that aligns with the mode that CSI supports for `ReadWriteMany` access. For some CSIs, such as
      Rook-Ceph and EMC PowerMax, it's the `Block` mode, while for other CSIs, such as Portworx, Longhorn, and EMC
      PowerFlex, it's the `Filesystem` mode. Make sure to check the `volumeMode` setting if you choose another CSI.
    - `registry` that specifies a container disk on an external Docker registry from which data should be imported.
      Check the
      [CDI DataVolumes documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#source)
      for other possible `source` values.

    <br />

    ```yaml {7,15,17,18}
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

    :::warning

    When the `Filesystem` mode is selected, the CDI will automatically apply a small overhead factor to the Persistent
    Volume Claim (PVC) size to account for the storage space lost due to the filesystem overhead. As a result, the PVC
    for such a template will be slightly larger. Any clones made from this PVC will also use this larger minimum size.

    :::

2.  Create another manifest in this cluster profile and add the following code snippet.

    This snippet has three notable configurations.

    - `spec.dataVolumeTemplates.spec` that defines which source PVC to clone from and what PVC to clone into.
    - `spec.dataVolumeTemplates.spec.source` that points to the `template-ubuntu-2204` PVC in the `vmo-golden-images`
      namespace.
    - `spec.dataVolumeTemplates.spec.pvc` that creates a new target PVC with the specified `accessMode` and `volumeMode`
      characteristics. The size of the new PVC must be the same or larger as the source PVC.

    <br />

    :::warning

    To enable CSI-assisted cloning, you must fulfill a few
    [prerequisites](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/csi-cloning.md#prerequisites).
    For instance, the source and target PVCs must share the same Storage Class and Volume Mode. The CDI will
    automatically fall back to slower host-assisted cloning if you don't meet these requirements.

    :::

    <br />

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

    :::tip

    To enable CSI-assisted cloning into larger PVCs than the source PVC, set `allowVolumeExpansion : true` on your
    defined Storage Class.

    :::

3.  When the CDI clones a PVC, it runs under the `default` service account in the namespace of the target PVC. When the
    source PVC is in a different namespace, you must give the required permissions to the service account. The
    [VMO pack](../vm-management.md) version 4.2.0 (or higher) does this automatically through its default pack
    specification. This configuration uses the `vmEnabledNamespaces` option to specify the namespaces for which the
    permissions are configured.

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

4.  By default, the CDI contains an internal database of CSIs, with the CSI supported access modes, volume modes, and
    CSI-assisted cloning support. However, we recommend creating a `StorageProfile` to adjust these parameters to your
    desired values.

    Create another manifest in this cluster profile and add the following code snippet.

    This snippet has three notable configurations that define the storage class.

    - The storage class has the name `ceph-block`.
    - The storage class supports the `Block` volume mode with the `ReadWriteMany` access mode.
    - The storage class uses `csi-clone` for cloning operations.

    <br />

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

    Expand the following section to learn how you can use storage profiles for CSI-assisted cloning.

    <details>

    <summary>Storage Profiles in VM Templates</summary>

    If Storage Profiles are not manually defined, the CDI will automatically generate one for every Storage Class based
    on the information in its internal database. We recommend verifying that these parameters are accurate for your use
    case and, if not, overwriting them to define a Storage Profile manually.

    Per the
    [CDI documentation](https://github.com/kubevirt/containerized-data-importer/blob/main/doc/datavolumes.md#storage),
    you can optionally replace the target `pvc` sections in your `vmTemplate` resources with a `storage` section once
    you have defined a storage profile.

    Using storage instead of PVC will automatically discover default values for `accessMode`, `volumeMode` and,
    optionally, even the size from the source PVC and its associated storage profile.

    A benefit of `storage` over `pvc` is that the CDI will automatically calculate the size overhead for `Filesystem`
    mode storage classes, allowing the VM template to use the original disk size instead of the one adjusted for the
    filesystem overhead.

    If you want to use this template, replace the contents of the manifest you added in step two with the following
    snippet.

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

    </details>

5.  Click on **Confirm & Create**.

6.  Complete the cluster profile configuration and click on **Finish Configuration**.

## Validate

1.  Navigate to the left **Main Menu** and select **Clusters**.

2.  Select your cluster and click the **Profile** tab.

3.  Add the newly created **Add-on Profile** to your cluster profile. Click on **Save**.

    Your cluster applies the changes. As soon as the cluster finishes updating, the CDI begins to import the data into
    the target PVC in the `vmo-golden-images` namespace. The target PVC has the same name as the `DataVolume` object.

    ![Add-on Profile](/create-disk-templates-guide/vm-management_create-manage-vm_create-disk-templates_add-on-disk-template-profile.webp)

4.  Once the cluster updates, this VM template is available to the VMs you create on your cluster. Check out the
    [Deploy VM From a Template](./standard-vm-operations/deploy-vm-from-template.md) guide for more information.

    ![Create VM from template](/create-disk-templates-guide/vm-management_create-manage-vm_create-disk-templates_create-vm-from-template.webp)

## Resources

To learn more about the Palette VMO, we encourage you to check out the reference resources below.

- [Virtual Machine Orchestrator Pack](../vm-packs-profiles/vm-packs-profiles.md)

- [Standard VM Operations](../create-manage-vm/standard-vm-operations/standard-vm-operations.md)

- [Deploy VM From a Template](../create-manage-vm/standard-vm-operations/deploy-vm-from-template.md)
