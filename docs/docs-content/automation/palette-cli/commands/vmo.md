---
sidebar_label: "VMO"
title: "VMO"
description: "Reference resource for the vmo command."
hide_table_of_contents: false
sidebar_position: 60
tags: ["palette-cli"]
---

Use the `vmo` command to migrate Virtual Machines (VMs) and import and deploy vSphere Open Virtual Appliances (OVAs).
The VMs can then be used with the Virtual Machine Orchestrator (VMO).

## Subcommands

- [`deploy-ova`](#deploy-ova) - Deploy an imported vSphere OVA. This command requires you to have an OVA deployment
  file. If you do not have one, you can generate an OVA with the `import-ova` subcommand.

- [`import-ova`](#import-ova) - Import a vSphere OVA. This subcommand will generate an OVA deployment configuration
  file. The configuration can then be deployed using the `deploy-ova` subcommand.

- [`migrate-vm`](#migrate-vm) - Migrate one or more VMware vSphere VMs to Palette VMO.

## Limitations

- You can only use the `vmo` subcommand with VMs hosted in VMware vSphere.

## Deploy OVA

### Prerequisites

- A Healthy VMO cluster. Refer to the [Create a VMO Profile](../../../vm-management/create-vmo-profile.md) for further
  guidance.
- One or more VMs hosted in VMware vSphere. Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.

### Usage

Use the `deploy-ova` subcommand to deploy an imported vSphere OVA to Palette VMO. The following flags are supported by
the `deploy-ova` subcommand. Refer to the
[Import and Deploy OVAs to Palette VMO](../../../vm-management/create-manage-vm/advanced-topics/deploy-import-ova.md)
guide for further details on importing and deploying vSphere OVAs.

| **Short Flag** | **Long Flag**   | **Description**                                                                                                                      | **Type** |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `-f`           | `--config-file` | Specifies an OVA configuration file.                                                                                                 | string   |
| `-o`           | `--config-only` | Update the OVA configuration file only, without proceeding with the deployment. This flag requires the `--config-file` be specified. | boolean  |
| `-s`           | `--silent`      | Perform a silent OVA deployment. This flag requires the `--config-file` be specified.                                                | boolean  |
| `-h`           | `--help`        | Help for the `deploy-ova` subcommand.                                                                                                | -        |

### Examples

Deploy a vSphere OVA previously imported to Palette VMO in interactive mode.

```shell
palette vmo deploy-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml
```

Update the OVA configuration file without proceeding with the depoyment.

```shell
palette vmo import-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml --config-only
```

Deploy a vSphere OVA previously imported to Palette VMO in interactive mode silently, without blocking the terminal.

```shell
palette vmo deploy-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml --silent
```

## Import OVA

### Prerequisites

- A Healthy VMO cluster. Refer to the [Create a VMO Profile](../../../vm-management/create-vmo-profile.md) for further
  guidance.
- One or more VMs hosted in VMware vSphere. Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.

### Usage

Use the `import-ova` subcommand to import a vSphere OVA to Palette VMO. The following flags are supported by the
`import-ova` subcommand. The OVA will be converted to the QCOW2 virtual disk storage format. This subcommand generates
an OVA deployment configuration file. You can then either directly upload the imported image to a `DataVolume` or upload
it a Docker image registry. Refer to the
[Import and Deploy OVAs to Palette VMO](../../../vm-management/create-manage-vm/advanced-topics/deploy-import-ova.md)
guide for further details on importing and deploying vSphere OVAs

| **Short Flag** | **Long Flag**    | **Description**                                                               | **Type** |
| -------------- | ---------------- | ----------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`  | Specifies an OVA configuration file.                                          | string   |
| `-o`           | `--config-only`  | Generate the OVA configuration file only, without proceeding with the import. | boolean  |
|                | `--skip-convert` | Skip OVA conversion to QCOW2 format.                                          | boolean  |
|                | `--skip-image`   | Skip VM image upload.                                                         | boolean  |
| `-h`           | `--help`         | Help for the `deploy-ova` subcommand.                                         | -        |

### Examples

Import a vSphere OVA to Palette VMO in interactive mode.

```shell
palette vmo import-ova
```

Create a configuration file for the OVA import without proceeding with the import.

```shell
palette vmo import-ova --config-only
```

Import an OVA to Palette VMO using a configuration file. The configuration file is generated using the `--config-only`
flag.

```shell hideCliboard
palette vmo import-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml
```

Import an OVA to Palette VMO without converting it to QCOW2 format.

```shell hideCliboard
palette vmo import-ova --skip-convert
```

Import an OVA to Palette VMO without uploading it.

```shell hideCliboard
palette vmo import-ova --skip-image
```

## Migrate VM

### Prerequisites

- A Healthy VMO cluster. Refer to the [Create a VMO Profile](../../../vm-management/create-vmo-profile.md) for further
  guidance.

  - The VMO cluster must have access to VMware and the VM you want to migrate.

  :::warning

  If you need to provision `Block` storage volumes during the VM migration process, add the following custom
  configuration to your VMO cluster OS pack. Applying this configuration may cause a cluster repave. For more
  information, refer to
  [Repave Behaviors and Configurations](../../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration)

  Additionally, we recommend provisioning volumes with the `ReadWriteMany` access mode to ensure that VMs can be
  [live migrated](https://kubevirt.io/user-guide/compute/live_migration/#limitations).

  ```yaml
  kubeadmconfig:
     preKubeadmCommands:
        # Start containerd with new configuration
        - systemctl daemon-reload
        - systemctl restart containerd
     files:
        - targetPath: /etc/containerd/config.toml
        targetOwner: "root:root"
        targetPermissions: "0644"
        content: |
           ## template: jinja

           # Use config version 2 to enable new configuration fields.
           version = 2

           imports = ["/etc/containerd/conf.d/*.toml"]

           [plugins]
              [plugins."io.containerd.grpc.v1.cri"]
              sandbox_image = "registry.k8s.io/pause:3.9"
              device_ownership_from_security_context = true
              [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
              runtime_type = "io.containerd.runc.v2"
              [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
              SystemdCgroup = true
  ```

  :::

- A VMware vSphere user account with the necessary permissions to manage the VMs you want to migrate.
  - Migration can optionally accelerated by providing credentials for the ESXi hosts where the VMs reside.
- One or more VMs hosted in VMware vSphere. Only VMs whose operating systems are included under
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) can be migrated.
  - The VMs must be powered off before migration.
  - Ensure that VMs operating Windows are shut down at the virtualized OS level.
  - If you are migrating more than one VM in the same plan, they must all share the same network.
- The Palette CLI installed and setup. Refer to the [Installation](../install-palette-cli.md) guide for further details.
  - The Palette CLI must have access to both the VMO cluster and the machines to be migrated.
- The kubectl command-line tool should also be installed. Refer to the
  [kubectl installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/) guide to learn more.
- We recommend providing a VMware Virtual Disk Development Kit (VDDK) image for the migration. This will significantly
  speed up the migration.

  - The VDDK image must be built and uploaded to your image registry before starting the migration. Refer to the
    [Red Hat Documentation](https://docs.redhat.com/en/documentation/migration_toolkit_for_virtualization/2.6/html/installing_and_using_the_migration_toolkit_for_virtualization/prerequisites_mtv#creating-vddk-image_mtv)
    for guidance.
  - The host with the Palette CLI setup for migration must have access to your image registry.
  - If you are using a private image registry, you must create a Secret to be used for the migration. The Secret must be
    in the form of a yaml file and the `metadata.name` value must be `vddk-image-pull-secret`.

    <!--prettier-ignore-->
    <details>
    <summary> Example Secret Creation </summary>

    A Secret can be created by issuing the following command.

    ```shell
    kubectl create secret docker-registry vddk-image-pull-secret \
    --docker-server=myRegistryServer \
    --docker-username=myUsername \
    --docker-password=myPassword \
    --docker-email=myEmail \
    -o yaml > image-pull-secret.yaml
    ```

    This creates the `image-pull-secret.yaml` file in your working directory.

    ```yaml title="Example contents of image-pull-secret.yaml"
    apiVersion: v1
    kind: Secret
    metadata:
      name: vddk-image-pull-secret
    data:
      .dockerconfigjson: #base64 encoded dockerconfigjson
    type: kubernetes.io/dockerconfigjson
    ```

    The `data..dockerconfigjson` value contains your registry credentials, which have been base64 encoded by the
    command.

    Alternatively, you can manually encode a `config.json` by issuing the following command.

    ```shell
    cat path/to/config.json | base64 --wrap=0
    ```

    ```text title="Example output"
    eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    ```

    You can then use this output to create your own Secret manually. Just ensure that the `metadata.name` is set to
    `vddk-image-pull-secret`.

    Refer to the
    [Kubernetes Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
    for additional guidance.

    </details>

### Usage

Use the `migrate-vm` subcommand to migrate one or more VMs from VMware vSphere to Palette VMO. The following flags are
supported by the `migrate-vm` subcommand. The migration consists of two phases. First, all guest disks are transferred
to Persistent Volumes (PVs) in K8s using KubeVirt CDI and VMware Virtual Disk Development Kit (VDDK). Then, the guest OS
on the root disk is made bootable and drivers are installed using [virt-v2v](https://libguestfs.org/virt-v2v.1.html).
Refer to the
[Migrate a VM to a VMO cluster](../../../vm-management/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md) guide
for further details on migrating a vSphere VM to Palette VMO.

| **Short Flag** | **Long Flag**        | **Description**                                                                                                                | **Type** |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `-f`           | `--config-file`      | Specifies a configuration file for the VM migration.                                                                           | string   |
| `-o`           | `--config-only`      | Generate the migration configuration file only, without proceeding with the migration.                                         | boolean  |
| `-p`           | `--update-passwords` | Update the vSphere and ESXi passwords saved in the configuration file. This flag requires the `--config-file` to be specified. | boolean  |
| `-h`           | `--help`             | Help for the `migrate-vm` subcommand.                                                                                          | -        |

### Examples

Migrate a VM to Palette VMO in interactive mode.

```shell
palette vmo migrate-vm
```

Create a configuration file for the VM migration without proceeding with the migration.

```shell
palette vmo migrate-vm --config-only
```

Migrate a VM using a configuration file. The configuration file is generated using the `--config-only` flag.

```shell hideCliboard
palette vmo migrate-vm --config-file ~/.palette/vmo/migrations/migration-123/config.yaml
```

Update the passwords of an VM migration using a configuration file. The configuration file is generated using the
`--config-only` flag.

```shell hideCliboard
palette vmo migrate-vm --config-file ~/.palette/vmo/migrations/migration-123/config.yaml --update-passwords
```
