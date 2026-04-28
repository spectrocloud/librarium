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

Prior to creating OpenShift workload clusters, you must build a custom
[Red Hat Enterprise Linux CoreOS (RHCOS)](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/architecture/architecture-rhcos)
image that is compatible with MAAS deployment.

This guide covers three sequential tasks that enable you to create and manage OpenShift clusters on MAAS using
HyperShift:

1. Build and import a MAAS-compatible RHCOS image.
2. Create a HyperShift cluster to host the OpenShift control plane pods.
3. Create OpenShift workload clusters that use the HyperShift hosted control plane.

## Limitations

The following limitations apply broadly to both HyperShift host clusters and OpenShift workload clusters deployed on
MAAS. Specific limitations for each cluster type are detailed in the respective sections.

- Terraform and Crossplane are not supported as deployment methods.

- Palette does not validate version compatibility between the HyperShift Operator on the host cluster and the OpenShift
  version on workload clusters. You must ensure these are compatible before deploying or upgrading. Refer to the
  [HyperShift Versioning Support](https://hypershift-docs.netlify.app/reference/versioning-support/) documentation for
  guidance.

### HyperShift Host Cluster

<!-- prettier-ignore-start -->

- Using a [Private Cloud Gateway (PCG)](../../pcg/pcg.md) as the HyperShift host is not supported. As mentioned in
  the [prerequisites](#prerequisites-1) for the HyperShift host cluster, it must be a
  <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" />
  MAAS cluster deployed using Palette.

<!-- prettier-ignore-end -->

- Multus Container Network Interface (CNI) is not supported.

- It is not possible to install additional addon layers on OpenShift workload clusters through Palette. If you need to
  install addons such as MetalLB, we recommend using the [OperatorHub](https://operatorhub.io/). The OperatorHub is
  accessed through the OpenShift console of your workload cluster. Addons installed through the OperatorHub are managed
  directly through the OpenShift console and are not visible in Palette.

- The HyperShift host cluster cannot be deleted if there are any workload clusters using it as a host. You must delete
  all associated workload clusters before deleting the host cluster.

### OpenShift Workload Clusters

- Only the Bring Your Own OS (BYOOS) pack is supported for the OS layer. The RHCOS image must be built specifically for
  MAAS using the process described in the
  [1. Build and Import MAAS-Compatible RHCOS Image](#1-build-and-import-maas-compatible-rhcos-image) section. Standard
  MAAS OS images are not compatible with OpenShift.

- OVN-Kubernetes is configured automatically by the OpenShift pack. A dedicated OVN-Kubernetes CNI pack is not
  supported. The CNI layer of the workload cluster profile must use the passthrough CNI pack.

- Some Day 1 operations are not available through Palette, such as configuring an external OIDC provider or NTP servers.

- Some Day 2 operations are not available through Palette, such as OS patching, security and compliance scans, backup
  and restore, and maintenance mode.

## 1. Build and Import MAAS-Compatible RHCOS Image

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

   - Replace `<path-to-rhcos-raw-image>` with the path to your RHCOS raw image downloaded in the prerequisites step.

   ```bash title="Template"
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     <path-to-rhcos-raw-image>
   ```

   ```bash title="Example"
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
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
   - Replace `<image-name>` with a descriptive name for the image as it will appear in the MAAS boot resources list.
   - Replace `<operating-system>` with the OS name to associate with the image in MAAS.
   - Replace `<release-version>` with the OS version to associate with the image in MAAS.

   ```bash title="Template"
   ./import-maas-image.sh \
     <maas-ready-rhcos-image-filepath> \
     <image-name> \
     <operating-system> \
     <release-version>
   ```

   ```bash title="Example"
   ./import-maas-image.sh \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz \
     rhcos-4.20.13-with-ubuntu \
     openshift \
     4.20.13
   ```

   The script logs into MAAS using the `default` profile, uploads the image as a `ddgz` resource, and triggers a
   boot-resources import. The image will then appear in the MAAS boot resources list. Partition cleanup is handled
   automatically during deployment, no manual disk management is required.

### Validate

<Tabs groupId="validate-image">

<TabItem label="MAAS UI" value="maas-ui">

1. Log in to your MAAS server web interface.

2. From the left sidebar, navigate to **Images**.

3. Locate the image and verify it appears with the name you specified during import. The name will appear under the
   **Release Title** column. For example, `rhcos-4.20.13-with-ubuntu`.

   The image may appear in the **Other** category if the image metadata does not match any existing categories.

4. Confirm the image status is **Synced**.

</TabItem>

<TabItem label="MAAS CLI" value="maas-cli">

Use the following command to list all boot resources and confirm your image is present. Replace `<image-name>` with the
name of the image you specified during import. For example, `rhcos-4.20.13-with-ubuntu`.

```bash
maas default boot-resources read | grep "<image-name>"
```

If the image was imported successfully, the command returns a JSON entry containing the image name. No output indicates
the image was not found.

</TabItem>

</Tabs>

## 2. Create HyperShift Host Cluster

The HyperShift host cluster is a MAAS cluster with the HyperShift Operator installed as a system app. It runs the
OpenShift control plane components as pods for all downstream OpenShift workload clusters. You must deploy this host
cluster in Palette before creating any OpenShift workload clusters.

### Prerequisites

- A [MAAS account registered in Palette](./register-manage-maas-cloud-accounts.md). All MAAS-registered Palette accounts
  must use either a System Private Gateway or Private Cloud Gateway (PCG) to connect to the MAAS environment. For more
  information on which to use, refer to the MAAS [Architecture](./architecture.md) guide.

  - If your Palette instance does not have a direct connection to the MAAS environment, you must
    [deploy a PCG](../../pcg/deploy-pcg/maas.md) to your MAAS environment.
  - If you are using a self-hosted Palette or Palette VerteX instance with a direct connection to your MAAS environment,
    you can use Palette's [System Private Gateway](../../pcg/architecture.md#system-private-gateway).

- The **OpenShift** feature flag enabled in the
  [system console](../../../enterprise-version/system-management/feature-flags.md).

- The [Cluster Admin](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role in Palette.

  - You may also need the
    [Cluster Profile Admin](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
    role if you have not yet created a cluster profile for the HyperShift host cluster.

- A cluster profile for the HyperShift host cluster configured with the following packs:

  - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> for
    the **Kubernetes** layer.
  - <VersionedLink text="HyperShift Operator" url="/integrations/packs/?pack=spectro-hypershift-operator&tab=main" />
    added as a **System App** layer.

  Refer to [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) for guidance on creating cluster
  profiles.

- Sufficient bare-metal resources in MAAS for the host cluster nodes. The host cluster must have enough capacity to run
  the OpenShift control plane pods for all intended workload clusters. A minimum of three control plane nodes spread
  across different availability zones is recommended for high availability.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**, and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**, then click **Start MAAS Configuration**.

5. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**.

   From the **Cloud Account** drop-down menu, select your MAAS cloud account.

   Click **Next** when done.

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. On the **Cluster Config** step, select a domain from the **Domains** drop-down menu. You can also specify **NTP
   Servers**.

   :::warning

   Although optional, we recommend specifying Network Time Protocol (NTP) servers to ensure that the cluster nodes have
   the correct time. If no NTP servers are specified, it could lead to time drift issues.

   :::

9. Click the **Host HyperShift-based control planes** toggle to enable this cluster to deploy HyperShift control planes
   for OpenShift workload clusters. Click **Next** when done.

10. On the **Nodes Config** step, configure the control plane and, optionally, worker node pools.

    The following input fields apply to MAAS node pools. For a description of input fields common across target
    platforms, refer to [Node Pools](../../cluster-management/node-pool.md). Click **Next** when done.

    #### Cloud Configuration

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                      |
    | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource pool**      | The [MAAS resource pool](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-resource-pools) from which to select available servers for deployment. Filter available servers to only those that have at least the amount of **Minimum CPU** and **Minimum Memory** selected. |
    | **Minimum CPU**        | The minimum number of CPU cores required for servers in this node pool.                                                                                                                                                                                                                              |
    | **Minimum Memory**     | The minimum amount of memory required for servers in this node pool.                                                                                                                                                                                                                                 |
    | **Availability zones** | Specify the [Availability Zones (AZs)](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-availability-zones) for the node pool.                                                                                                                                            |
    | **Tags**               | Specify the MAAS machine tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags-flexible-labels) documentation.                        |

11. <PartialsComponent category="clusters" name="cluster-settings" />

12. Select **Validate** to review your cluster configuration and settings.

13. If no changes are needed, select **Finish Configuration** to deploy the host cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the HyperShift host cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

5. In the **Cluster Profiles** section, confirm the **HyperShift Operator** system app is installed and in a healthy
   state (green icon).

## 3. Create OpenShift Workload Cluster with HyperShift Control Plane

OpenShift workload clusters use a hosted control plane model where their Kubernetes control plane components run as pods
in the HyperShift host cluster. Worker nodes are then provisioned as bare-metal MAAS hosts.

### Prerequisites

- The MAAS-compatible RHCOS image imported in the
  [1. Build and Import MAAS-Compatible RHCOS Image](#1-build-and-import-maas-compatible-rhcos-image) of this guide must
  be available in your MAAS environment.

- The HyperShift host cluster created in the [2. Create HyperShift Host Cluster](#2-create-hypershift-host-cluster)
  section must be in **Running** state with the HyperShift Operator healthy.

- The [Cluster Admin](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster) role in Palette.

  - You may also need the
    [Cluster Profile Admin](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
    role if you have not yet created a cluster profile for OpenShift workload clusters.

- A cluster profile for your OpenShift workload clusters configured with the following packs:

  - <VersionedLink text="Bring Your Own OS (BYOOS)" url="/integrations/packs/?pack=generic-byoi" /> pack for the OS
    layer. Set the following parameters in the pack values.

    | Parameter              | Description                                                                                                                                                                                                                                           | Example value               |
    | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
    | `pack.osImageOverride` | The name of the MAAS image imported in the [1. Build and Import MAAS-Compatible RHCOS Image](#1-build-and-import-maas-compatible-rhcos-image) section. This should match the `<image-name>` parameter specified in the `import-maas-image.sh` script. | `rhcos-4.20.13-with-ubuntu` |
    | `pack.osName`          | The value of the `<operating-system>` parameter during import.                                                                                                                                                                                        | `openshift`                 |
    | `pack.osVersion`       | The value of the `<release-version>` parameter specified during import.                                                                                                                                                                               | `4.20.13`                   |

  - <VersionedLink text="OpenShift" url="/integrations/packs/?pack=openshift&tab=main" /> pack for the Kubernetes layer.
    Ensure the OpenShift version is compatible with the HyperShift Operator version installed on the host cluster. Refer
    to the [HyperShift Operator (HO) Versioning
    Support](https://hypershift-docs.netlify.app/reference/versioning-support/#ho) documentation for guidance.

    - Ensure to set the Red Hat OpenShift pull secret in the `cluster.pullSecret` parameter of the OpenShift pack
      values. This is required for the OpenShift installer to pull necessary images from Red Hat's container registry.
      Obtain your pull secret from the
      [Red Hat OpenShift Cluster Manager](https://console.redhat.com/openshift/install/pull-secret). The pull secret
      must be in Base64-encoded format.

      <details>

      <summary> Example command to Base64 encode the pull secret </summary>

      In this example, the pull secret is stored in a file named `pull-secret.txt`. The command reads the pull secret
      from the file, encodes it in Base64 format, and sets it as the `OPENSHIFT_PULL_SECRET` environment variable. The
      `--wrap 0` option for `base64` ensures that the output is a single line, which is necessary for proper formatting
      in the OpenShift pack values.

      ```bash title="Base64 encode pull secret"
      export OPENSHIFT_PULL_SECRET=$(cat pull-secret.txt | base64 --wrap 0)
      echo $OPENSHIFT_PULL_SECRET
      ```

      </details>

    - It is recommended to add the `cluster.controlPlaneHighAvailability` parameter to the OpenShift pack values and set
      it to `true`. This parameter is not present by default and must be added manually.

      ```yaml title="Example OpenShift pack values with control plane HA enabled" {4}
      pack:
      ...
      cluster:
        controlPlaneHighAvailability: true
        ...
      ```

      - When `cluster.controlPlaneHighAvailability` is `true`, the hosted control plane runs in HA mode with multiple
        replicas of API server, etcd, and other components. This allows PodDisruptionBudgets (PDBs) to maintain
        availability during node repave, and drain operations can proceed without issues.
      - When `cluster.controlPlaneHighAvailability` is `false` or not set, the hosted control plane runs with a single
        replica (non-HA). In this configuration, a node repave or any other operation that drains the node hosting that
        control plane replica can remain blocked because the PDB prevents eviction of the control plane pod. The typical
        symptom is that the repaving node remains in `Deleting` or `Draining` state until the drain is able to complete.

  - <VersionedLink text="OVN-Kubernetes CNI" url="/integrations/packs/?pack=ovn-kubernetes-cni" /> pack for the
    Container Network Interface (CNI) layer. This is used as a dummy CNI pack since the CNI is configured automatically
    by the **OpenShift** pack and a dedicated CNI pack is not supported for HyperShift workload clusters.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**, and click **Add New Cluster**.

4. In the **Data Center** section, select **MAAS**, then click **Start MAAS Configuration**.

5. Enter the basic information for your cluster, including the **Cluster Name**, **Description**, and **Tags**.

   From the **Cloud Account** drop-down menu, select your MAAS cloud account.

   Click **Next** when done.

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. On the **Cluster Config** step, select a domain from the **Domains** drop-down menu. You can also specify **NTP
   Servers**.

   :::warning

   Although optional, we recommend specifying Network Time Protocol (NTP) servers to ensure that the cluster nodes have
   the correct time. If no NTP servers are specified, it could lead to time drift issues.

   :::

9. Select a **HyperShift host cluster** from the drop-down menu. This should match the name of the HyperShift host
   cluster you created in the [2. Create HyperShift Host Cluster](#2-create-hypershift-host-cluster) section. This
   associates the workload cluster with the selected host cluster.

10. On the **Nodes Config** step, configure the worker node pools. As the OpenShift control plane is hosted in the
    HyperShift host cluster, you only configure worker nodes here.

    The following input fields apply to MAAS worker node pools. For a description of input fields common across target
    platforms, refer to [Node Pools](../../cluster-management/node-pool.md). Click **Next** when done.

    #### Cloud Configuration

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                      |
    | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource pool**      | The [MAAS resource pool](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-resource-pools) from which to select available servers for deployment. Filter available servers to only those that have at least the amount of **Minimum CPU** and **Minimum Memory** selected. |
    | **Minimum CPU**        | The minimum number of CPU cores required for servers in this node pool.                                                                                                                                                                                                                              |
    | **Minimum Memory**     | The minimum amount of memory required for servers in this node pool.                                                                                                                                                                                                                                 |
    | **Availability zones** | Specify the [Availability Zones (AZs)](https://canonical.com/maas/docs/how-to-manage-machine-groups#p-19384-manage-availability-zones) for the node pool.                                                                                                                                            |
    | **Tags**               | Specify the MAAS machine tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags-flexible-labels) documentation.                        |

11. On the **Cluster Settings** page, configure additional options as needed. If you are deploying your workload cluster
    using [cluster templates](../../../cluster-templates/cluster-templates.md), a **Cluster Timezone** is required.

    | **Left Menu Item**   | **Additional Information**                                                                                                                                                                                                                                                                                                                                                                       |
    | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Cluster Timezone** | Specify the time zone where your cluster is being deployed. The time zone is used in [maintenance policies](../../../cluster-templates/create-cluster-template-policies/maintenance-policy.md) to determine when updates are rolled out to clusters deployed with [cluster templates](../../../cluster-templates/cluster-templates.md).                                                          |
    | **RBAC**             | Map a set of users or groups to a Kubernetes RBAC role. This is required when custom OIDC is configured. Refer to the following guides for more information: <br />- [Create Role Bindings](../../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> |
    | **Location**         | Specify the location of your cluster by entering the address in the search bar and selecting one of the options in the drop-down. For example, **London, Greater London, England, United Kingdom**. This is used for display purposes and does not impact cluster functionality.                                                                                                                 |

12. Select **Validate** to review your cluster configuration and settings.

13. If no changes are needed, select **Finish Configuration** to deploy the workload cluster.

Palette communicates the cluster configuration to the HyperShift Operator on the host cluster, which provisions the
OpenShift hosted control plane. Worker nodes are simultaneously provisioned on MAAS bare-metal hosts and joined to the
workload cluster. Provisioning may take several minutes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page lists all clusters that Palette manages.

4. Select the OpenShift workload cluster. On the **Overview** tab, confirm the **Cluster Status** is **Running** and the
   **Health** status is **Healthy**.

## Next Steps

Now that you have deployed a HyperShift host cluster and an OpenShift workload cluster, you can start deploying
applications to your OpenShift cluster. Consider the following next steps:

- You can create multiple OpenShift workload clusters on the same HyperShift host cluster. Repeat the steps in the
  [Create MAAS OpenShift Workload Cluster](#3-create-openshift-workload-cluster-with-hypershift-control-plane) section
  for each additional cluster, ensuring that the host cluster has sufficient capacity to run the additional control
  plane pods.

- Refer to [Manage Clusters](../../cluster-management/cluster-management.md) for Day-2 cluster management tasks, but
  ensure that you have reviewed the [Limitations](#limitations) section of this guide as some management tasks are not
  supported for HyperShift-hosted OpenShift clusters.
