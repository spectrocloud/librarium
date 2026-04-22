---
sidebar_label: "Create and Manage MAAS OpenShift Clusters"
title: "Create and Manage MAAS OpenShift Clusters"
description: "Learn how to create and manage MAAS OpenShift clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
---

:::preview

:::

Palette supports creating and managing OpenShift clusters on MAAS bare-metal servers using
[HyperShift](https://hypershift-docs.netlify.app/). In this model, a HyperShift host cluster runs the OpenShift control
plane components as pods. OpenShift workload clusters are then provisioned with their worker nodes on bare-metal MAAS
hosts, while their control planes are hosted on the HyperShift host cluster.

Prior to creating OpenShift workload clusters, a custom built
[Red Hat Enterprise Linux CoreOS (RHCOS)](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/architecture/architecture-rhcos)
image is required to be compatible with MAAS deployment.

This guide covers three sequential tasks that enable you to create and manage OpenShift clusters on MAAS using
HyperShift:

1. Building and importing a MAAS-compatible RHCOS image.
2. Creating a HyperShift host cluster.
3. Creating OpenShift workload clusters that use the HyperShift hosted control plane.

## 1. Create MAAS-Compatible RHCOS Image

RHCOS is incompatible with the standard MAAS/[Curtin](https://canonical.com/blog/customising-maas-installs) deployment
process out of the box. MAAS deploys machines using a two-stage boot process in which Curtin writes and validates the
target OS disk image. Curtin expects a traditional Linux root filesystem layout including:

- a `/curtin` directory.
- `cloud-init` as the machine configuration tool.
- a standard filesystem structure.

None of these are provided natively by RHCOS. In addition, RHCOS uses
[Ignition](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/composing_installing_and_managing_rhel_for_edge_images/assembly_using-the-ignition-tool-for-the-rhel-for-edge-simplified-installer-images_composing-installing-managing-rhel-for-edge-images)
for machine configuration rather than cloud-init.

To work around this, the RHCOS MAAS image build process appends a minimal Ubuntu root filesystem as an extra partition
to the official RHCOS raw image. This allows Curtin validation to pass, while Curtin hooks persist the real Ignition
configuration for RHCOS, which is applied on first boot.

### Prerequisites

- A Linux build host with the following tools installed:

  - `debootstrap`
  - `rsync`
  - `losetup` (util-linux)
  - `sgdisk` (gdisk)
  - `kpartx`
  - `partprobe`
  - `udevadm`
  - `mkfs.ext4`
  - `e2label`
  - `gzip` / `gunzip`
  - Root privileges (`sudo`)

- The MAAS CLI (`maas-cli`) installed on your build host.

- A MAAS server endpoint and API key. Refer to the
  [MAAS API Keys](https://canonical.com/maas/docs/how-to-find-and-use-api-keys) documentation for guidance on obtaining
  your API key.

- The RHCOS image build scripts, available at the following URL.

  **Last updated**: June 3, 2026

  ```text
  http://software.spectrocloud.com/rhcos-maas-image-builder/v4.8.c-v2/rhcos-maas-image.tgz
  ```

  Download and extract the archive before proceeding. The archive contains the following files and scripts used in this
  guide.

  ```shell
  build-rootfs.sh
  create-maas-image.sh
  import-maas-image.sh
  curtin/curtin-hooks
  curtin/deploy-ignition-config
  ```

- The official RHCOS raw image for your target OpenShift version, downloaded from the Red Hat mirror. For example:

  ```text
  https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.20/4.20.13/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

  Save the file on your build host and note the path for use in the [Enablement](#enablement) steps.

  ```shell title="Example RHCOS image path"
  ~/images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

### Enablement

1. Log in to your MAAS build host and navigate to the directory where you extracted the RHCOS image build scripts.

2. Use the following command to build the minimal Ubuntu root filesystem. This creates the fake root filesystem used for
   Curtin validation.

   ```bash
   sudo ./build-rootfs.sh ./ubuntu2404-rootfs
   ```

   The script runs `debootstrap` for Ubuntu 24.04 (Noble), installs `cloud-init`, `netplan.io`, `python3-cffi`, and
   `python3-ply`, cleans apt caches, and outputs the rootfs to `./ubuntu2404-rootfs/`. This directory is copied into the
   extra partition in the next step.

3. Use the following command to create the MAAS-ready RHCOS image. This appends a new partition (p5) to the RHCOS raw
   image and injects the Ubuntu rootfs and Curtin hooks.

   - Replace `<path-to-rhcos-raw-image>` with the path to your RHCOS raw image downloaded in the prerequisites step. For
     example, `./images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz`.

   ```bash
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     <path-to-rhcos-raw-image>
   ```

   <details>

   <summary> Click to view the script operations </summary>

   1. Decompresses the raw image.
   2. Extends the disk size by 512 MB.
   3. Attaches a loop device with a partition scan.
   4. Relocates the GPT backup header.
   5. Creates a new partition p5 after p4.
   6. Formats p5 as ext4.
   7. Copies the Ubuntu rootfs into p5.
   8. Copies the Curtin scripts into `/curtin`.
   9. Compresses the new raw image to `*-with-ubuntu.raw.gz`.

   The resulting partition layout is as follows:

   | Partition | Contents                                       |
   | --------- | ---------------------------------------------- |
   | p3        | RHCOS boot                                     |
   | p4        | RHCOS root                                     |
   | p5        | Ubuntu fake rootfs (Curtin validation + hooks) |

   </details>

   The original input image remains unchanged and the output image is saved alongside the original input image.

   ```text title="Example output image path"
   ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz
   ```

4. Set your MAAS credentials as environment variables. Replace `<https://your-maas-server/MAAS>` and `<maas-api-key>`
   with your MAAS server endpoint and API key, respectively.

   ```bash title="Set MAAS credentials"
   export MAAS_ENDPOINT="<https://your-maas-server/MAAS>"
   export MAAS_API_KEY="<maas-api-key>"
   ```

   :::warning

   MAAS OAuth credentials are sensitive. Do not hardcode credentials in the deploy scripts. Using environment variables
   allows the deploy scripts to read credentials securely without exposing them in code or logs.

   :::

5. Use the following command to import the new image into MAAS.

   - Replace `<maas-ready-rhcos-image-filepath>` with the path to the new RHCOS image created in the previous step.
   - Replace `<openshift-version>` with the OpenShift version that matches your RHCOS image, for example `4.20.13`.

   ```bash title="Import image into MAAS"
   ./import-maas-image.sh \
     <maas-ready-rhcos-image-filepath> \
     rhcos-<openshift-version>-with-ubuntu \
     openshift \
     <openshift-version>
   ```

   ```bash title="Example"
   ./import-maas-image.sh \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz \
     rhcos-4.20.13-with-ubuntu \
     openshift \
     4.20.13
   ```

   The script logs into MAAS using the `default` profile, uploads the image as a `ddgz` resource, and triggers a
   boot-resources import. The image will then appear in the MAAS boot resources list.

   :::info

   - The MAAS credentials set in step 4 are required. The `deploy-ignition-config` Curtin hook uses them to authenticate
     against the MAAS metadata endpoint and fetch the Ignition configuration during deployment.
   - Partition cleanup is handled automatically. No manual disk management is required after deployment.

   :::

### Validate - TBC

To confirm the image was imported successfully, use the following steps.

1. Log in to your MAAS server web interface.

2. Navigate to **Images** in the top navigation bar.

3. In the **Custom** images section, locate the image and verify it appears with the name and version you specified
   during import — for example, `rhcos-4.20.13-with-ubuntu`.

4. Confirm the image status is **Synced** or **Complete**.

## 2. Create HyperShift Host Cluster

The HyperShift host cluster is a standard PXK MAAS cluster with the HyperShift Operator installed as a system app. It
runs the OpenShift control plane components as pods for all downstream OpenShift workload clusters. You must deploy this
host cluster before creating any OpenShift workload clusters.

### Prerequisites

- A [MAAS account registered in Palette](register-manage-maas-cloud-accounts.md). All MAAS-registered Palette accounts
  must use either a System Private Gateway or Private Cloud Gateway (PCG) to connect to the MAAS environment. For more
  information on which to use, refer to the MAAS [Architecture](./architecture.md) guide.

  - If your Palette instance does not have a direct connection to the MAAS environment, you must
    [deploy a PCG](../../pcg/deploy-pcg/maas.md) to your MAAS environment.
  - If you are using a self-hosted Palette or Palette VerteX instance with a direct connection to your MAAS environment,
    you can use Palette's [System Private Gateway](../../pcg/architecture.md#system-private-gateway).

- The **OpenShift** feature flag enabled in the
  [system console](../../../enterprise-version/system-management/feature-flags.md).

- A cluster profile for the HyperShift host cluster configured with the following layers:

  - **Palette eXtended Kubernetes (PXK)** for the Kubernetes layer.
  - The **HyperShift Operator** added as a System App layer in the cluster profile. The HyperShift Operator manages the
    lifecycle of the hosted OpenShift control planes.
  - Any compatible OS image available in your MAAS environment for the OS layer.
  - Any supported CNI for the network layer.

  Refer to [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) for guidance on creating cluster
  profiles.

- Sufficient bare-metal resources in MAAS for the host cluster nodes. The host cluster must have enough capacity to run
  the OpenShift control plane pods for all intended workload clusters. A minimum of three control plane nodes spread
  across different availability zones is recommended for high availability.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**, and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**.

5. In the bottom-right corner, click **Start MAAS Configuration**.

6. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**. Click
   **Next**.

7. From the **Cloud Account** drop-down menu, select your MAAS cloud account, and click **Next**.

8. Select the HyperShift host cluster profile and click **Next**.

9. Select a **Domain** from the drop-down menu. Click **Next**.

   :::warning

   We recommend specifying Network Time Protocol (NTP) servers to ensure that the cluster nodes have the correct time.
   If no NTP servers are specified, it could lead to time drift issues. You can specify this configuration in the
   **Cluster Config** step.

   :::

10. Configure the control plane and worker node pools. The following input fields apply to MAAS node pools. For a
    description of input fields common across target platforms, refer to
    [Node Pools](../../cluster-management/node-pool.md). Click **Next** when done.

    | **Parameter**          | **Description**                                                                                                                                                                                                                                               |
    | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource Pool**      | The MAAS resource pool from which to select available servers for deployment. Filter available servers to only those with at least the specified CPU and Memory.                                                                                              |
    | **Availability Zones** | Specify the Availability Zones for the node pool.                                                                                                                                                                                                             |
    | **Tags**               | Specify the MAAS machine tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags) documentation. |

11. Review the cluster settings and click **Next**.

12. Select **Validate** to review your cluster configuration.

13. If no changes are needed, select **Finish Configuration** to deploy the host cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

### Validate

Use the following steps to confirm your HyperShift host cluster is running.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the HyperShift host cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

5. On the **Add-ons** tab, confirm the HyperShift Operator system app is installed and in a healthy state.

Do not proceed to create OpenShift workload clusters until the host cluster is fully running and the HyperShift Operator
is healthy.

## 3. Create MAAS OpenShift Workload Cluster with HyperShift Control Plane

OpenShift workload clusters use a hosted control plane model — their Kubernetes control plane components run as pods in
the HyperShift host cluster, while worker nodes are provisioned as bare-metal MAAS hosts. Each workload cluster requires
a dedicated OpenShift cluster profile that uses BYOOS for the OS layer (to reference the MAAS-compatible RHCOS image
built in the first section of this guide).

### Prerequisites

- The HyperShift host cluster created in the previous section must be in **Running** state with the HyperShift Operator
  healthy.

- The MAAS-compatible RHCOS image imported in the
  [first section](#create-maas-compatible-red-hat-enterprise-linux-coreos-image) of this guide must be available in your
  MAAS environment.

- A cluster profile for your OpenShift workload clusters configured with the following infrastructure layers:

  - **Bring Your Own OS (BYOOS)** pack for the OS layer. Set the following parameters in the pack values.

    | Parameter              | Description                                                                                                                             | Example value               |
    | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
    | `pack.osImageOverride` | The name of the MAAS image imported in the previous section. This should match the name specified in the `import-maas-image.sh` script. | `rhcos-4.20.13-with-ubuntu` |
    | `pack.osName`          | The OS name specified during import.                                                                                                    | `openshift`                 |
    | `pack.osVersion`       | The OS version specified during import.                                                                                                 | `4.20.13`                   |

  - **OpenShift** pack for the Kubernetes layer. Ensure the OpenShift version is compatible with the HyperShift Operator
    version installed on the host cluster. Refer to the
    [HyperShift version support matrix](https://hypershift-docs.netlify.app/reference/support-matrix/) for version
    compatibility details.

    :::warning

    Version skew between the HyperShift Operator on the host cluster and the OpenShift version on the workload cluster
    can cause deployment or upgrade failures. Validate version compatibility before deploying.

    :::

  - A **CNI** layer using the dummy CNI pack. OVN-Kubernetes is configured automatically by the OpenShift pack and does
    not require a separate CNI configuration.

  - **Local Path Provisioner** pack for the storage layer.

- An image pull secret for Red Hat's container registry must be available. Add this as part of your cluster profile
  configuration so Palette can pass it to the OpenShift installer during provisioning.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**, and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**.

5. In the bottom-right corner, click **Start MAAS Configuration**.

6. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**. Click
   **Next**.

7. From the **Cloud Account** drop-down menu, select your MAAS cloud account, and click **Next**.

8. Select the OpenShift workload cluster profile and click **Next**.

9. Select a **Domain** from the drop-down menu. Click **Next**.

10. Configure the worker node pool. Because the OpenShift control plane is hosted in the HyperShift host cluster, you
    only configure worker nodes here. Click **Next** when done.

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                      |
    | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Host Cluster**       | From the drop-down menu, select the HyperShift host cluster that will run the control plane for this workload cluster.                                                                                                                                               |
    | **Resource Pool**      | The MAAS resource pool from which to select available bare-metal servers for the worker nodes.                                                                                                                                                                       |
    | **Availability Zones** | Specify the Availability Zones for the worker node pool.                                                                                                                                                                                                             |
    | **Tags**               | Specify the MAAS machine tags so that Palette can deploy worker nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags) documentation. |

    :::info

    The OpenShift control plane is managed by the HyperShift Operator on the host cluster. Palette does not provision
    separate control plane nodes for OpenShift workload clusters. Only worker node pools are configured here.

    :::

11. Review the cluster settings and click **Next**.

12. Select **Validate** to review your cluster configuration.

13. If no changes are needed, select **Finish Configuration** to deploy the workload cluster.

Palette communicates the cluster configuration to the HyperShift Operator on the host cluster, which provisions the
OpenShift hosted control plane. Worker nodes are simultaneously provisioned on MAAS bare-metal hosts, bootstrapped using
Ignition, and joined to the workload cluster. Provisioning may take several minutes.

### Validate

Use the following steps to confirm your OpenShift workload cluster is running.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the OpenShift workload cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

5. Confirm that the expected number of worker nodes are present and in a **Ready** state under the **Nodes** tab.

To further verify the cluster, you can download the kubeconfig from the cluster **Overview** tab and use `oc` or
`kubectl` to inspect the cluster:

```bash
oc get nodes
oc get clusteroperators
```

All cluster operators should report as **Available** with no **Degraded** or **Progressing** conditions.

## Next Steps

Now that you have deployed a HyperShift host cluster and an OpenShift workload cluster, you can start deploying
applications to your OpenShift cluster. Consider the following next steps:

- **Day-2 operations**: Palette supports scaling and Kubernetes upgrades for both the HyperShift host cluster and
  OpenShift workload clusters. Refer to [Manage Clusters](../../cluster-management/cluster-management.md) for available
  Day-2 cluster management tasks.

- **Backup and restore**: To protect your workloads, review the
  [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) guide.

- **Additional workload clusters**: You can create multiple OpenShift workload clusters on the same HyperShift host
  cluster. Repeat the steps in the
  [Create MAAS OpenShift Workload Cluster](#create-maas-openshift-workload-cluster-with-hypershift-control-plane)
  section for each additional cluster, ensuring that the host cluster has sufficient capacity to run the additional
  control plane pods.

- **Known limitations**: Some Day-2 operations — including OS patching, security and compliance scans, backup and
  restore, OIDC, autoscaler, and NTP configuration — are not supported for OpenShift workload clusters in this release
  due to OpenShift's opinionated lifecycle management. Operations that fall outside Palette's control plane are deferred
  to OpenShift's native tooling.
