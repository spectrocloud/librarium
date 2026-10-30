---
sidebar_label: "Manage Packages"
title: "Manage Packages"
description: "Learn how to manage packages in airgap VM Launchpad environments."
icon: " "
hide_table_of_contents: false
sidebar_position: 9
tags: ["vmo", "vm launchpad", "packages"]
---

VM Launchpad provides package management for airgap environments. Upload DEB, RPM, MSI, and ISO packages, and serve them
to VMs via a built-in APT/YUM-compatible repository.

## Overview

In airgap clusters, VMs cannot reach external package repositories. VM Launchpad provides the following capabilities.

| **Capability**                    | **Description**                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Stores packages**               | Upload DEB, RPM, MSI, and ISO files with SHA-256 checksums.                                             |
| **Generates repository metadata** | Pure-Go APT and YUM metadata so VMs can use `apt` or `dnf`/`yum` to install packages.                   |
| **Serves packages**               | The `/serve/repo/` endpoint serves package files and metadata to in-cluster VMs.                        |
| **Auto-injects guest agent**      | Cloud-init can be augmented to configure the repository and install the QEMU guest agent automatically. |

## Package Management in Airgap Environments

### Workflow

1. **Upload packages**. On a connected machine, download DEB/RPM/MSI/ISO files. Upload them to VM Launchpad from the
   Packages page or API.
2. **Rebuild metadata**. Trigger a repository metadata rebuild so APT/YUM clients detect the new packages.
3. **Configure VMs**. Use cloud-init to add the VMO repository as a source and install packages, or enable **Install
   QEMU Guest Agent** in the VM wizard to auto-inject the guest agent installation.

### Supported Formats

| Format  | Use Case                                                  |
| ------- | --------------------------------------------------------- |
| **DEB** | Debian, Ubuntu packages                                   |
| **RPM** | RHEL, CentOS, Fedora, SUSE packages                       |
| **MSI** | Windows installers, such as the QEMU guest agent.         |
| **ISO** | Full disk images, such as the Virtio Windows drivers ISO. |

## Packages Page

Navigate to **Image Catalog** > **Packages** to view and manage uploaded packages. The page shows the current storage
usage and the time the repository was last rebuilt, and provides the following controls.

| **Control**            | **Description**                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Upload Package**     | Upload a new package. Refer to [Upload a Package](#upload-a-package).                      |
| **Check for Updates**  | Check for newer versions of the built-in packages.                                         |
| **Refresh**            | Reload the package list.                                                                   |
| **Rebuild Repository** | Regenerate the APT and YUM repository metadata so VMs can install the current package set. |
| **URLs**               | Display the repository URLs that VMs use as package sources.                               |
| **Filters**            | Filter the package list. Use **Filter rows** to search by name.                            |
| **Delete**             | Select one or more package rows, then select **Delete** to remove them.                    |

Each package is listed with the following columns.

| **Column**       | **Description**                                                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**         | The package name and target, such as `libnuma1 (Ubuntu 24.04 Noble / generic, amd64)`. A **Built-in** badge marks packages that VM Launchpad seeds automatically, such as the QEMU guest agent and its dependencies. |
| **Type**         | The package format, such as DEB or RPM, including codename-specific variants such as DEB (jammy).                                                                                                                    |
| **Architecture** | The target architecture, such as amd64 or arm64.                                                                                                                                                                     |
| **Version**      | The package version.                                                                                                                                                                                                 |
| **File**         | The package filename.                                                                                                                                                                                                |
| **Size**         | The package file size.                                                                                                                                                                                               |
| **Uploaded**     | The date and time the package was uploaded.                                                                                                                                                                          |

## Package Storage

VM Launchpad stores the files of uploaded packages, along with its branding images (the logo and favicon), in a package
store, an S3-compatible bucket. The package details, such as the name, version, and checksum, are Kubernetes custom
resources, so the **Packages** page lists a package even when its file is missing.

| **Deployment**         | **Package Store**                                                      | **Uploaded Files After a Pod Restart** |
| ---------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| VM Launchpad appliance | The appliance's SeaweedFS, configured automatically.                   | Kept                                   |
| VMO pack               | Off by default. VM Launchpad keeps uploaded files only on its own pod. | Lost                                   |

VM Launchpad restores the built-in packages, such as the QEMU guest agent, every time it starts, with or without a
package store. The [Virtio Windows ISO](#virtio-windows-iso) is the exception. VM Launchpad downloads it only when a
package store is configured, and without it you cannot create Windows VMs.

### Configure a Package Store for the VMO Pack

To keep uploaded packages and branding images when the VM Launchpad pod restarts, add the SeaweedFS pack to the cluster
profile that contains the VMO pack, and set the following values in the VMO pack.

<!-- TODO(DOC-3274): Confirm with Ahmed Kadri before Ready: the SeaweedFS pack name in the Palette registry, where users
find the secret key of the identity that accessKey names, and the multi-pod Service. The SeaweedFS pack runs three pods by
default, and vmo-manager needs an endpoint with ClientIP session affinity (the appliances' seaweedfs-s3 Service), or
multipart uploads can fail with a 404. Source: vmo-manager docs/user/image-catalog/packages.md, Package storage. -->

```yaml
integrations:
  packageStore:
    enabled: true
    endpoint: "http://seaweedfs.seaweedfs.svc.cluster.local:8333"
    accessKey: "seaweedfs-zot-access-key"
    secretKey: "<secret-key>"
```

Replace `<secret-key>` with the secret key of the SeaweedFS identity that `accessKey` names. VM Launchpad creates the
`vmo-packages` bucket if it does not exist.

## Upload a Package

1. Navigate to **Image Catalog** > **Packages**.

2. Select **Upload Package**.

3. In the **Upload Package** dialog, configure the following fields.

   | **Field**        | **Description**                                                                                                                                                          |
   | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Package Name** | The package name, such as `qemu-guest-agent`.                                                                                                                            |
   | **Version**      | The package version, such as `9.1.0`.                                                                                                                                    |
   | **OS Type**      | Select the package OS type and format from the drop-down menu, such as Linux DEB, Linux RPM, or Windows MSI. DEB packages can be codename-agnostic or codename-specific. |
   | **Architecture** | Select the target architecture from the drop-down menu, such as **amd64** or **arm64**.                                                                                  |
   | **Description**  | An optional description for the package.                                                                                                                                 |
   | **File**         | Select **Choose File** and select the package file (DEB, RPM, MSI, or ISO).                                                                                              |

4. Select **Upload**. VM Launchpad stores the package and computes its SHA-256 checksum.

:::info

Package uploads are streamed to the cluster. Large files, such as multi-GB ISOs, may take time. Ensure the request body
limit and CDI upload infrastructure can handle the file size.

:::

### SHA-256 Checksums

Packages are stored with SHA-256 checksums for integrity verification. When the repository metadata is generated,
checksums are included so clients can verify downloads.

## QEMU Guest Agent

The QEMU guest agent enables:

- VNC clipboard support.
- Graceful shutdown and reboot.
- Guest identity diagnostics.
- Live migration features.

### Built-in Package

VM Launchpad ships with a built-in QEMU guest agent package for Debian/Ubuntu (amd64 and arm64). It is embedded in the
container image at `/embedded-packages/` and does not require upload.

### Auto-Injection via Cloud-Init

When **Install QEMU Guest Agent** is enabled in the [VM creation wizard](./creating.md) (Lifecycle step, Cloud-Init
section), the generated cloud-init user-data includes:

- Repository configuration pointing to the VMO package server.
- Commands to install the guest agent, such as `apt-get install --yes qemu-guest-agent` for Debian/Ubuntu.

The package server URL uses the in-cluster service name, such as
`http://vmo-manager.vm-dashboard.svc.cluster.local:8080/serve/repo/`. VMs must be able to reach the VM Launchpad service
from within the cluster.

:::tip

The `GUEST_AGENT_AUTO_INSTALL` config controls whether the wizard offers and applies guest agent injection. Disable it
if you manage the guest agent separately.

:::

## Package Repository

### Pure-Go APT/YUM Metadata

VM Launchpad generates APT and YUM repository metadata in pure Go. No external tools, such as `dpkg-scanpackages` or
`createrepo`, are required. This keeps the container image small and avoids licensing concerns.

### Metadata Rebuild

After uploading or deleting packages, trigger a metadata rebuild.

1. Navigate to **Image Catalog** > **Packages**.
2. Select **Rebuild Repository** or use the API `POST /api/v1/packages/repo/rebuild`.

The rebuild scans the package directory and regenerates the APT `Packages` metadata and the YUM `repodata` metadata so
clients can install the current package set.

### Serve Packages

Packages are served at `/serve/repo/`. The path structure is compatible with APT and YUM.

| **Repository** | **URL**                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| **APT**        | `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/apt/` |
| **YUM**        | `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/yum/` |

VMs add these URLs as package sources in `/etc/apt/sources.list` or `/etc/yum.repos.d/`.

## Cloud-Init Auto-Injection

When creating a VM with **Install QEMU Guest Agent** enabled, the following occurs.

1. The wizard generates cloud-init user-data.
2. The backend injects a snippet that:
   - Adds the VMO package repository as an APT or YUM source (based on guest OS).
   - Installs `qemu-guest-agent` (and dependencies such as `liburing2`, `libnuma1` for DEB).
3. At first boot, cloud-init runs and installs the guest agent.

For Windows, the guest agent is typically installed from an MSI. The Virtio Windows ISO or a separate MSI package can be
used. The Windows [finalization template](./image-customization.md)'s seal script may install the guest agent from the
VMO package server before `sysprep`.

## Virtio Windows ISO

The **Virtio Windows drivers ISO** is a dedicated package used for Windows [golden image](./golden-images.md) builds. It
provides Virtio disk and network drivers so Windows can boot from Virtio devices.

| **Aspect**       | **Description**                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Storage**      | A DataVolume `vmo-virtio-win` is created in the golden images namespace. It is populated from a built-in package definition or downloaded at runtime.              |
| **Auto-mount**   | When creating a Windows builder VM, the Virtio ISO is automatically attached as a CD-ROM. The ISO is served from a shared RWX PVC so the builder VM can access it. |
| **Installation** | During Windows setup, load the Virtio drivers from the attached CD-ROM when prompted for disk or network drivers.                                                  |

The Virtio ISO is managed as part of package seeding. Ensure the package is seeded and the PVC is bound before building
Windows golden images.

## Upgrade Considerations

<!-- TODO(DOC-3274): Name the first release without a data volume (drop eight, VM Launchpad 4.10.TBD) once Platone
promotes it, and link the Breaking Changes entry in the drop-eight release notes. -->

Earlier VM Launchpad releases stored uploaded package files and branding images on a data volume. VM Launchpad no longer
uses a data volume and stores these files in a [package store](#package-storage) instead. The upgrade does not copy
anything from the data volume. VM Launchpad restores the built-in packages automatically, but you must upload your
custom packages and branding images again. This applies to the VM Launchpad appliance and to VMO pack deployments that
turned on persistent storage.

### Before You Upgrade

Keep a copy of every custom package and branding image that you uploaded. The following steps require `kubectl` access
to the cluster that runs VM Launchpad.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file of the cluster.

1. List your custom packages and keep the original file of each one. Custom packages show `false` in the `BUILTIN`
   column.

   ```shell
   kubectl get vmopackages --namespace <vmo-namespace> \
     --output custom-columns=ID:.metadata.name,NAME:.spec.name,FILE:.spec.fileName,BUILTIN:.spec.builtIn
   ```

   Replace `<vmo-namespace>` with the namespace of VM Launchpad. On the VM Launchpad appliance, the namespace is
   `vm-dashboard`.

2. Save your logo and favicon. Open `https://<vm-launchpad-host>/api/v1/branding/assets/logo` and
   `https://<vm-launchpad-host>/api/v1/branding/assets/favicon` in a browser and save each image.

   Replace `<vm-launchpad-host>` with the host name of VM Launchpad.

If you upgrade without a copy, you can still copy the files out of the previous data volume. Refer to
[Recover Files From the Previous Data Volume](#recover-files-from-the-previous-data-volume).

### Upload Packages and Branding Images Again

After the upgrade, your custom packages stay listed on the **Packages** page, but VM Launchpad no longer serves their
files. A VM that installs one of them receives a `404` error.

If you use the VMO pack, configure a package store before you upload anything. Otherwise, you lose the files that you
upload the next time the VM Launchpad pod restarts. Refer to
[Configure a Package Store for the VMO Pack](#configure-a-package-store-for-the-vmo-pack).

1. Navigate to **Image Catalog** > **Packages**.

2. Select the rows of your custom packages, and select **Delete**. You cannot upload a package with the same name, OS
   type, and architecture while its previous row exists.

3. Upload each package again. Refer to [Upload a Package](#upload-a-package). VM Launchpad rejects filenames that
   contain a space, a non-ASCII character, or any of the characters `/`, `%`, `?`, `#`, and `\`. Earlier releases
   accepted these names, so rename any such file before you upload it.

4. Select **Rebuild Repository**.

5. Upload your logo and favicon through the VM Launchpad API. Use an [API key](../access-management/api-keys.md) of a
   user with the `vmo:branding:write` permission, such as a Platform Admin.

   ```shell
   curl --header "Authorization: Bearer <api-key>" --form target=logo --form file=@<logo-file> \
     https://<vm-launchpad-host>/api/v1/branding/upload
   curl --header "Authorization: Bearer <api-key>" --form target=favicon --form file=@<favicon-file> \
     https://<vm-launchpad-host>/api/v1/branding/upload
   ```

   Replace `<api-key>` with your API key, `<logo-file>` and `<favicon-file>` with the paths to your image files, and
   `<vm-launchpad-host>` with the host name of VM Launchpad. If VM Launchpad uses a self-signed certificate, add
   `--cacert <ca-certificate>` to each command and replace `<ca-certificate>` with the path to its CA certificate.

6. (Optional) To generate the favicon from your logo instead of uploading one, issue the following command.

   ```shell
   curl --request POST --header "Authorization: Bearer <api-key>" \
     https://<vm-launchpad-host>/api/v1/branding/generate-favicon
   ```

### Restore the Virtio Windows ISO

<!-- TODO(DOC-3274): The vmo-manager notes say the reset and both refill paths are covered by unit tests but have not
been run on a cluster. Verify on a drop-eight build, or confirm with Ahmed Kadri, before Ready. -->

Follow these steps only if VM Launchpad downloaded the [Virtio Windows ISO](#virtio-windows-iso), or you uploaded it,
before the upgrade. After the upgrade, its package row still records a file that is no longer stored. This blocks the
automatic download and the **Upload Image** action, you cannot delete the row, and the Windows VM wizard reports the
Virtio drivers as not available.

1. Reset the package row.

   ```shell
   kubectl patch vmopackages.virtualization.spectrocloud.com builtin-virtio-win --namespace <vmo-namespace> \
     --type merge --patch '{"spec":{"fileSize":0,"sha256":""}}'
   ```

   Replace `<vmo-namespace>` with the namespace of VM Launchpad.

2. Restore the ISO.

   - In a connected environment, navigate to **Image Catalog** > **Packages** and select **Check for Updates**. VM
     Launchpad downloads the ISO in the background within two minutes. This requires a
     [package store](#package-storage).

   - In an airgap environment, right-click the Virtio Windows ISO row, select **Upload Image**, and upload the ISO. Keep
     the filename `virtio-win.iso`, and enter the ISO version if it differs from the one displayed.

### Recover Files From the Previous Data Volume

VM Launchpad keeps the previous data volume, but it no longer mounts it, so you can copy files out of it before you
upload them again. The volume is the `vmo-manager-data` PersistentVolumeClaim (PVC), or `data-vmo-manager-<N>` on older
StatefulSet installations. Nothing deletes it, so delete it yourself when you finish.

The volume stores packages at `packages/<id>/<file-name>` and branding images at `branding/logo.<extension>` and
`branding/favicon.<extension>`. The following steps require `kubectl` access to the cluster that runs VM Launchpad.

1. Find the PVC.

   ```shell
   kubectl get pvc --namespace <vmo-namespace>
   ```

   If the PVC uses node-local storage or the `ReadWriteOnce` access mode, find the node that its volume is pinned to.

   ```shell
   kubectl get pvc <pvc-name> --namespace <vmo-namespace> \
     --output jsonpath='{.metadata.annotations.volume\.kubernetes\.io/selected-node}{"\n"}'
   ```

   Replace `<vmo-namespace>` with the namespace of VM Launchpad and `<pvc-name>` with the name of the PVC.

2. Create a file named `vmo-data-reader.yaml` with the following helper pod, which mounts the PVC read-only. The pod
   runs as user `65534`, the user that earlier releases wrote the files as.

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: vmo-data-reader
     namespace: <vmo-namespace>
   spec:
     nodeName: <node-name>
     restartPolicy: Never
     securityContext:
       runAsNonRoot: true
       runAsUser: 65534
       runAsGroup: 65534
       seccompProfile:
         type: RuntimeDefault
     containers:
       - name: reader
         image: busybox:1.36
         command: ["sleep", "3600"]
         securityContext:
           allowPrivilegeEscalation: false
           capabilities:
             drop: ["ALL"]
         volumeMounts:
           - name: old-data
             mountPath: /legacy
             readOnly: true
     volumes:
       - name: old-data
         persistentVolumeClaim:
           claimName: <pvc-name>
           readOnly: true
   ```

   Replace `<vmo-namespace>` with the namespace of VM Launchpad and `<pvc-name>` with the name of the PVC. Replace
   `<node-name>` with the node from step 1, or remove the `nodeName` line if you did not need to find a node. The
   `kubectl cp` command requires `tar` in the image. In an airgap environment, use an image from your registry that
   includes `tar`.

3. Create the helper pod.

   ```shell
   kubectl apply --filename vmo-data-reader.yaml
   ```

4. Match your packages to their directories, and copy the files out of the volume.

   ```shell
   kubectl get vmopackages --namespace <vmo-namespace> \
     --output custom-columns=ID:.metadata.name,NAME:.spec.name,FILE:.spec.fileName
   kubectl exec vmo-data-reader --namespace <vmo-namespace> -- ls /legacy/packages /legacy/branding
   kubectl cp <vmo-namespace>/vmo-data-reader:/legacy/packages/<id>/<file-name> ./<file-name>
   kubectl cp <vmo-namespace>/vmo-data-reader:/legacy/branding ./branding
   ```

   Replace `<id>` with the package ID and `<file-name>` with its filename, as listed by the first command.

5. Upload the packages and branding images again. Refer to
   [Upload Packages and Branding Images Again](#upload-packages-and-branding-images-again).

6. Delete the helper pod.

   ```shell
   kubectl delete pod vmo-data-reader --namespace <vmo-namespace>
   ```

7. After you copy everything you need, delete the previous PVC.

   ```shell
   kubectl delete pvc <pvc-name> --namespace <vmo-namespace>
   ```
