---
sidebar_label: "Install the Appliance"
title: "Install the PaletteAI Inference Launchpad Appliance"
description:
  "Step-by-step guidance for platform operators on how to install the PaletteAI Inference Launchpad appliance from bare
  hardware to a running, reachable appliance console."
hide_table_of_contents: false
sidebar_position: 0
tags: ["paletteai-inference-launchpad", "install", "how-to"]
keywords: ["launchpad", "ai", "install", "appliance", "hardware", "iso", "edge", "local ui"]
---

This guide explains how to install the PaletteAI Inference Launchpad appliance on bare hardware, from an administrative
workstation (a [jumpbox](../reference/glossary.md#jumpbox)). You download the
[slim ISO](../reference/glossary.md#slim-iso), [content bundle](../reference/glossary.md#content-bundle), and model
metadata from Artifact Studio, install the edge OS on the node, configure the network in the Palette text-based user
interface (TUI) and Local UI, upload the content bundle, deploy the cluster, and upload a model. By the end, you will
have a running, reachable appliance console with a model ready to deploy. For the two-stage architecture and design
rationale, refer to [Installation Architecture](../explanation/installation-architecture.md).

:::info

Each terminal command in this guide has a **Linux / macOS** tab (POSIX shell) and a **Windows** tab (PowerShell). Select
the tab that matches your jumpbox. Your choice applies to every command on the page.

:::

## Before You Begin

Confirm each prerequisite before starting:

- The appliance server and administrative workstation (jumpbox) meet the
  [Hardware Requirements](../reference/hardware-requirements.md), which covers GPU, CPU, RAM, storage, network, and IP
  addressing.
- The Palette CLI is installed and configured on the jumpbox.
- The hardware supports Ubuntu 24.04.
- The server has [baseboard management controller (BMC)](../reference/glossary.md#bmc) access available for
  [virtual media](../reference/glossary.md#virtual-media), as a fallback if USB boot fails.
- You have a reserved [virtual IP address (VIP)](../reference/glossary.md#vip) for the cluster, and a single unused
  platform IP address (not a range) for MetalLB to assign to platform services.
- The target model fits the available GPU memory. Refer to
  [Certified Models by Hardware](../reference/certified-models-by-hardware.md) for the model-to-hardware mapping, and to
  [Installation Architecture](../explanation/installation-architecture.md#gpu-memory-sizes-the-model) for the memory
  ceiling rule.
- _(External NFS only)_ If the environment uses an external Network File System (NFS) storage network, such as a
  dedicated storage fabric, have the virtual local area network (VLAN) ID and IP address ready for a tagged VLAN
  sub-interface on the node's bond, for example `bond0.396` on VLAN 396 with `10.0.22.110/24`. You configure this when
  you create the bond, because the storage network is otherwise unreachable. This is separate from the appliance's
  internal Piraeus storage.

## Download the Artifacts

Three artifacts come from Artifact Studio, Spectro Cloud's artifact download portal. Download all three before you
begin. The slim ISO and content bundle must match the target hardware's GPU (NVIDIA or AMD).

- **Slim ISO (~1.5 GB)**. the bootable installer. You write it to a USB drive, or mount it through the server's BMC, and
  boot the node from it.
- **Content bundle (more than 20 GB)**. the platform and application layers. You upload it through the Palette CLI
  (recommended) or Local UI after the node is on the network.
- **Model metadata (`metadata.yaml`, a few KB)**. one file per model you intend to deploy. It is a separate download,
  not part of the ISO or content bundle. You use it later, with the Palette CLI, to download the model weights from
  Hugging Face and upload them to the appliance. Download it from Artifact Studio, or from the `models/` directory of
  the `launchpad-ai` repository, for example `models/glm-5.2/1.0.0/metadata.yaml`.

## Install the OS

1. Flash the slim ISO to bootable media, such as a USB drive, with an imaging tool such as balenaEtcher. You can also
   transfer the ISO to the node with `scp` or `rsync`.
2. Attach the media to the node and set the boot order to boot from it first.
3. Power on the node. At the GRUB menu, let it select the Palette Edge interactive installer.
4. In the interactive installer:
   - When the installer prompts for the registration option after its first boot, select **Palette eXtended Kubernetes
     (PXK)**. This registers the node with the edge Kubernetes distribution the appliance uses.
   - The installer inspects every disk and blocks the install if any disk still holds Kairos partitions from a prior
     install. It reports the offending disks by name.
   - If needed, use the in-flow wipe option to clear leftover partitions. Refer to
     [Wipe Non-Empty Disks](#wipe-non-empty-disks).
   - Select the target disk for the operating system. The installer erases this disk, so do not select the disk you
     intend to use for the Piraeus storage pool.
   - Choose the post-install action (reboot or power off).
   - Review the installation summary and press **ENTER** to start.
5. Wait for the install to finish. It takes at least 15 minutes, depending on hardware. When it finishes, disconnect the
   ISO. If you chose reboot, the node reboots into the Palette TUI; if you chose power off, power it back on.

### Wipe Non-Empty Disks

The interactive installer detects Kairos partitions on any disk and prevents the install until they are cleared, to
avoid unpredictable behavior from stale partitions. It provides an in-flow wipe-all-disks option, so you do not have to
drop to a shell. The action is destructive; confirm before you run it.

## Configure the Node with the Palette TUI

After the OS install and reboot, the node comes up in the Palette TUI, where you set the initial credentials and
network. The hostname, DNS, and NTP settings are configured here in the TUI, not in Local UI.

The appliance enforces a password policy on every account you create in the Palette TUI, including `root`. Each password
must meet all of the following requirements:

- Be at least 15 characters long.
- Include at least one lowercase letter, one uppercase letter, one digit, and one special character, such as `!`, `@`,
  `#`, `$`, `%`, `^`, `&`, or `*`.
- Not contain the account username.
- Not contain spaces, a double quote (`"`), a single quote (`'`), or a backslash (`\`).

When you change an existing password, the new password must differ from the old one by at least 5 characters.

1. On the Palette TUI landing page, no local account exists yet, so press **F2** (**Create login**) to create the
   initial administrator account, then set its username and password. This account signs in to Local UI and accesses the
   node over SSH.
   {/* NEEDS REVIEW: the F2 "Create login" entry point is from PE-8675, which is not yet merged. Confirm the label and flow before publishing; until then F2 opens node customization and the account is created through the TUI account step. */}
2. Move between options with **TAB** or the arrow keys. Press **ENTER** to apply a change, and **ESC** to go back.
   - **Hostname.** Review the hostname and change it if required.
   - **Network adapter.** Each adapter uses Dynamic Host Configuration Protocol (DHCP) by default. For each adapter you
     can switch to a static IP address (with subnet mask and gateway), set a VLAN ID, or set the Maximum Transmission
     Unit (MTU). Setting a static IP removes the DHCP settings.
   - **DNS.** Set the primary and alternate name servers, and an optional search domain.
   - **NTP.** Set one or more NTP servers, for example `0.pool.ntp.org`.
3. Navigate to **Quit** and confirm. Quit acts as a logout. It ends your TUI session and returns to the device
   information screen, which shows the node details and the Local UI address. It does not power off the node. To
   re-enter the TUI later, run `palette-tui` on the node.
4. Repeat the OS install and this TUI configuration on every node. On a multi-node cluster, also complete the network
   bond on every node before you link them.

## Configure the Network in Local UI

Once the node has an IP address, you can leave the console and reach the node's Local UI from a browser.

1. In a browser, go to `https://<node-ip>:5080`, using the IP you set in the Palette TUI. Local UI uses a self-signed
   certificate, so proceed past the browser warning.
2. Sign in with the credentials you created in the Palette TUI.
3. Confirm the node reports a pre-cluster state, ready to build or join a cluster.

### Create a Bond

1. In Local UI, open **Network Interfaces**.
2. Under **Bonds**, select **Create**.
3. Fill in the bond form. The **Name** field shows `bond0` as placeholder text, not a saved value, so click into it and
   type the name before you continue. Set **Bond type** to `static` so the bond keeps a fixed IP, select the member NICs
   manually, and set the **Bonding mode** to `802.3ad`. Bond type (the IP method) and bonding mode (the link-aggregation
   algorithm) are separate fields. For each field's recommended value, meaning, and when to deviate, refer to
   [Bond Configuration Reference](../reference/bond-configuration.md). The values must match how your data-center switch
   is configured on the ports the appliance is plugged into, so coordinate with your network administrator before you
   apply.

4. Select **Apply**. If Local UI is briefly unreachable, reload the same address after a few seconds. The IP moves from
   the network interface card (NIC) to the bond.

## Configure the Storage

If you do not configure storage, Local UI configures it automatically and adds every available data disk on the host to
the **Data volume group**, always excluding the operating system disk. Configure it manually only when you need to
control which disks [Piraeus](../reference/glossary.md#piraeus) uses, for example, to keep a data disk out of the
storage pool. The **Data volume group** tells Piraeus which physical disks to use for cluster storage, and model weights
and the KV cache live on these disks. Local UI mounts the volume group at `/opt/data/spectrocloud`. Configure the volume
group after the bond and before you link hosts, and on a multi-node cluster, complete this section on every node.

:::warning Read-only after cluster creation

You can delete or modify the Data volume group any number of times before you deploy the cluster. After cluster
creation, the group becomes read-only. Confirm the disk selection before you continue.

:::

1. In Local UI, open the **Edgehost** tab.
2. Under **Hardware**, select **Disks**. A side pane opens listing every disk on the host.
3. Under **Data volume group**, select **Create volume** to open the wizard.
4. Review the disk selection. By default, the wizard selects every data disk on the host and automatically excludes the
   operating system disk, so you cannot add it to the volume group by mistake. Deselect any data disk you want to keep
   out of the volume group.
5. Select **Create** to apply. The new entry appears under **Data volume group**.

## Link Hosts (Multi-Node Only)

Skip this section for a single-node installation. Link the hosts before you upload the content bundle, so that content
synchronizes across all linked hosts automatically. Every host must have a static IP, a Local UI login, and its own bond
before you link them.

1. Decide which host is the leader of the group. The leader coordinates linking. For high availability, use an odd
   number of control-plane nodes.
2. In the leader's Local UI, open **[Linked Edge Hosts](../reference/glossary.md#linked-edge-hosts)** > **Generate
   token**. The leader emits a Base64-encoded token containing its IP address and a
   [one-time password (OTP)](../reference/glossary.md#otp) valid for two minutes. Select **Copy**.
3. On each other host's Local UI, open **Linked Edge Hosts** > **Link this device to another**. Paste the token from the
   leader and confirm.
4. Repeat for every host you want to link.
5. Confirm all linked hosts appear in the **Linked Edge Hosts** table. Content synchronization takes at least five
   minutes, depending on the network.

## Upload the Content Bundle

Upload the content bundle before you deploy the cluster. On a multi-node cluster, content uploaded on the leader
synchronizes automatically to every linked host. The model itself is not uploaded here; you upload it separately in
[Upload Your Model](#upload-your-model).

Two upload paths are available:

- **Palette CLI from the jumpbox (recommended).** Streams the bundle to the node from the command line, so you can
  script the upload and it does not depend on a browser session. The bundle can sit on the jumpbox filesystem or on an
  NFS share mounted on the jumpbox.
- **Local UI browser upload (not recommended).** Uploads through the browser. The content bundle is more than 20 GB, so
  the browser upload is slow and prone to timeouts. Use it only when the Palette CLI is not available on the jumpbox.

### Upload with the Palette CLI (Recommended)

The Palette CLI runs on your jumpbox and authenticates to the node with a per-node upload token, so you do not sign in
to Palette SaaS for this step.

Before you start, confirm the jumpbox has everything the upload needs:

- **The Palette CLI installed and on your `PATH`.** Download the Linux binary from the Downloads page and move it to
  `/usr/local/bin/palette` so the `palette` command resolves from any directory. For step-by-step instructions, refer to
  [Install Palette CLI](../../automation/palette-cli/install-palette-cli.md). You do not need to run `palette login` for
  this workflow, because the content-upload command uses a node-issued token, not your Palette API key.
- **The content bundle reachable on the jumpbox.** The `.tar.zst` file must be on the jumpbox filesystem or on an NFS
  share mounted on the jumpbox. If you downloaded it on another machine, copy it to the jumpbox first with `scp` or
  `rsync`.
- **SSH access to the node** using the administrator account you created in the Palette TUI. You use SSH once, to read
  the token off the node.
- **Network reachability from the jumpbox to the node on TCP port `5082`.** The Palette CLI posts the bundle to the
  node's Local UI API on port `5082`, which is separate from the Local UI web address on port `5080`. If the jumpbox
  cannot reach the bond IP on port `5082`, the upload fails.

#### (Optional) Locate the bundle on an NFS share

If the content bundle is on an NFS share rather than the jumpbox's local disk, mount the share on the jumpbox and note
the bundle's full path. You upload it directly from the mount, so no local copy is needed. These commands assume a POSIX
shell on the Linux jumpbox.

1. List the NFS mounts on the jumpbox to find the share.

   ```bash
   df --human-readable --type=nfs --type=nfs4
   ```

   ```bash hideClipboard title="Expected output"
   Filesystem             Size  Used Avail Use% Mounted on
   10.0.19.10:/data/ipmi  7.0T   52G  6.6T   1% /mnt/nfs/ipmi
   ```

   The path in the **Mounted on** column is the mount point. In this example the share is mounted at `/mnt/nfs/ipmi`.

2. List the bundle on the mount and note the full path to the `.tar.zst` file.

   ```bash
   ls --format=long --human-readable /mnt/nfs/ipmi/
   ```

   ```bash hideClipboard title="Expected output"
   -rw-r--r-- 1 root root 22G Jul 21 10:00 launchpad-ai-content.tar.zst
   ```

   Use the full mount path, for example `/mnt/nfs/ipmi/<content-bundle>.tar.zst`, as the `--file` value in the upload
   command below.

#### Upload steps

1. From the jumpbox, read the per-node upload token from the node and store it in an environment variable. Local UI
   writes this token to a file on the node when it first comes up, so the token already exists and you do not generate
   or request one. Replace `<user>` with the administrator username you set in the Palette TUI and `<node-ip>` with the
   bond IP.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   export AIL_NODE_TOKEN=$(ssh <user>@<node-ip> sudo cat /opt/spectrocloud/.upload-auth-token)
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   $env:AIL_NODE_TOKEN = ssh <user>@<node-ip> sudo cat /opt/spectrocloud/.upload-auth-token
   ```

   </TabItem>

   </Tabs>

2. Run the upload from the jumpbox. Replace `<content-bundle>` with the path to the bundle, on the jumpbox filesystem or
   on the NFS mount (for example `./launchpad-ai-content.tar.zst` or `/mnt/nfs/ipmi/launchpad-ai-content.tar.zst`), and
   `<node-ip>` with the bond IP. The default target port is `5082`; if the Local UI API uses a different port, add
   `-p <port>`.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   palette content upload \
     --file <content-bundle> \
     --token "$AIL_NODE_TOKEN" \
     <node-ip>
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   palette content upload `
     --file <content-bundle> `
     --token $env:AIL_NODE_TOKEN `
     <node-ip>
   ```

   </TabItem>

   </Tabs>

   ```bash hideClipboard title="Expected output"
   response: Uploaded content successfully
   ```

   A progress bar tracks the transfer. After it reaches 100 percent, the node decompresses the archive and imports its
   images into the local registry. For a bundle of 20 GB or more, this server-side phase can take 15 to 30 minutes with
   no visible progress. Use a wired connection, keep the terminal open, do not interrupt the CLI, and wait for the node
   to finish before you continue.

### Upload from Local UI (Not Recommended)

The content bundle is more than 20 GB, so the browser upload is slow and can time out. Use this path only when the
Palette CLI is not available on the jumpbox.

1. From the left main menu, select **Content** > **Actions** > **Upload Content**.
2. Select the content bundle and start the upload.
3. After the upload reaches 100 percent, wait for the node to finish unpacking the bundle before continuing.

## Deploy the Cluster

:::warning HPE hardware

On HPE servers, confirm the GPUs are visible to the operating system before you deploy. The cluster installs the GPU
driver pack during deployment, so if the GPUs do not enumerate on the PCI bus, apply the PCI workaround first. Refer to
[Known Issues: GPUs do not enumerate on HPE servers](../reference/known-issues.md#gpus-do-not-enumerate-on-hpe-servers).

:::

1. From the left main menu, select **Cluster** > **Create cluster**.
2. Complete **Basic Information** (cluster name and tags), then select **Next**.
3. In **Cluster Profile**, review the default PaletteAI Inference Launchpad profile. It bundles the edge OS, Kubernetes,
   storage, networking, ingress, observability, and the PaletteAI Inference Launchpad application. The exact packs are
   defined by the profile and can change between releases, so review the profile in Local UI for the current list.
   Select **Next**.
4. In **Profile Config**, complete the PaletteAI Inference Launchpad custom wizard. The wizard collects the settings the
   platform packs need to install correctly on your hardware and network, in six sections: Networking, OS and metrics,
   Container registry, Local admin, Storage, and Certificates. In Networking, the **Platform IP Address** is a single
   unused IP address (not a range) that MetalLB assigns to the appliance console and API. In Certificates, either select
   **Generate** to create a self-signed CA certificate, or provide your own CA certificate and key. For every field's
   type, default, and validation rules, including the password complexity requirements for the Registry and Local Admin
   passwords, refer to [Cluster Profile Variables](../reference/profile-variables.md). Then select **Next**.

5. In **Cluster Config**, configure the cluster settings, including the cluster VIP.
6. In **Node Config**, assign hosts to the control-plane and worker node pools.
   {/* NEEDS REVIEW: review notes (2026-07-21) ask to tell users to select the bond, if one exists, during node config. Confirm the exact step and field label before publishing. */}
   - Single node: no host selection is needed. Remove the worker pool and ensure **Allow worker capability** is enabled
     on the control-plane pool so the sole node acts as both the control plane and the worker.
   - Multi-node: assign the hosts you linked previously. Keep the leader in the control-plane pool and use an odd number
     of control-plane nodes. You can remove the worker pool if it is not required, but ensure **Allow worker
     capability** is enabled on the control-plane pool.
7. Review the configuration and deploy. The nodes reboot as part of the build, and deployment can take up to
   approximately 45 minutes; GPU driver installation adds time on first boot. During deployment, Traefik and Local UI
   restart alongside the packs, so the browser may display a **"Your service is temporarily unavailable"** page more
   than once. Refresh the browser to resume, and do not close the wizard or restart the deployment.

   :::warning Extended pause during the node reboot

   The deployment includes a node reboot during which the browser displays no progress for approximately 10 minutes.
   This pause is expected. Wait for the browser to reconnect automatically; do not power-cycle the node or close the
   wizard.

   :::

## Validate the Installation

1. On the **Cluster** page, confirm the cluster reaches a **Running** and **Healthy** state and that all packs install.
2. Confirm that all pods are running. SSH to a control-plane node (the sole node on a single-node install, or the leader
   on a multi-node install) and run the following command. You can also copy the cluster's kubeconfig to the jumpbox and
   run the same command, or a tool such as K9s, over the VPN.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   kubectl get pods --all-namespaces
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   kubectl get pods --all-namespaces
   ```

   </TabItem>

   </Tabs>

   The output lists pods across namespaces in the `Running` state.

3. If the installation stalls, verify that the `piraeus-operator` and `nvidia-gpu-operator-ai` packs install correctly.
   GPU driver installation can take additional time on first boot.
4. After deployment completes, additional items appear in the Local UI left main menu. Use them to reach the PaletteAI
   Inference Launchpad platform and confirm that GPU nodes are schedulable.

:::info Log in to the console

The cluster is now running. Open the PaletteAI Inference Launchpad console from the custom link that appears in the
Local UI left main menu after deployment completes, rather than typing the platform IP address by hand. The console is
served at `https://<platform-ip>`, the single Platform IP Address that Traefik fronts (the one you set in the cluster
profile). Sign in with the **Local Admin** username and password you set in the Profile Config wizard during cluster
creation. These are the console credentials, and they are also the Grafana admin login. They are not a separate account
and not the Palette TUI account you created earlier.

:::

If the cluster stalls, or if the GPUs do not enumerate as expected, refer to
[Known Issues](../reference/known-issues.md).

## Upload Your Model

Uploading a model is a day-two operation, separate from the day-zero appliance install. You can run it in parallel with
cluster deployment; it does not need to wait for validation. Models are uploaded separately from the content bundle,
from the jumpbox to an appliance node, using the Palette CLI. The jumpbox needs `rsync` 3.2.3 or later and OpenSSH 8.4
or later.

For the full flag list, the metadata file schema, the on-appliance layout, and the deploy-catalog states, refer to
[Model Upload Reference](../reference/model-upload-reference.md).

1. Download the model metadata (`metadata.yaml`) from Artifact Studio.
2. On the jumpbox, download the model to a writable local directory, for example `/home/ubuntu/downloads`. Do not use an
   NFS share, which may be mounted read-only. The model lands at `<model-dir>/<name>/<version>/`.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   palette content model download \
     --metadata model.yaml \
     --model-dir ./models
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   palette content model download `
     --metadata model.yaml `
     --model-dir .\models
   ```

   </TabItem>

   </Tabs>

   For gated or private Hugging Face repos, set `HF_TOKEN`.

3. Upload the model to an appliance node. We recommend using SSH key authentication (`--ssh-key`). If you do not have a
   key on the node, use `--ssh-password` for password authentication (supported on a Unix jumpbox only), and add
   `--insecure-skip-host-key-check` if the node's host key is not yet known.

   <Tabs groupId="os">

   <TabItem label="Linux / macOS" value="unix">

   ```bash
   palette content model upload \
     --metadata model.yaml \
     --model-dir ./models \
     --ssh-user <user> \
     --ssh-host <node-ip> \
     --ssh-key ~/.ssh/id_ed25519
   ```

   </TabItem>

   <TabItem label="Windows" value="windows">

   ```powershell
   palette content model upload `
     --metadata model.yaml `
     --model-dir .\models `
     --ssh-user <user> `
     --ssh-host <node-ip> `
     --ssh-key ~\.ssh\id_ed25519
   ```

   </TabItem>

   </Tabs>

4. Wait for the model to reach **Available** in the appliance console's deploy picker. On a multi-node cluster the
   appliance syncs the model to every node before marking it **Available**; the picker shows **Pending** or **Missing**
   for nodes that are still catching up.

## Next Steps

After the model is uploaded, the remaining tasks are day-two product usage, covered by the existing how-to guides:

- **Deploy a model**. [Deploy a Model](./deploy-a-model.md).
- **Set the default model**. [Set the Default Model](./set-the-default-model.md).
- **Generate an API token**. [Generate an API Token](./generate-an-api-token.md).
- **Connect a coding tool**. [Claude Code](./use-claude-code.md), [Cursor](./use-cursor.md),
  [OpenAI Codex](./use-codex.md), or [OpenCode](./use-opencode.md).

For definitions of the terms used in this guide, such as slim ISO, content bundle, jumpbox, bond, leader, follower,
Palette TUI, Local UI, and OTP, refer to the [Glossary](../reference/glossary.md).
