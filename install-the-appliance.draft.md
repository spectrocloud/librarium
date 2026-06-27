# Install the Launchpad for AI Appliance

_This is unreleased documentation for Launchpad for AI. The product is not yet generally available, and the content below is subject to change before release._

This guide walks you through installing the Launchpad for AI appliance on bare metal, from flashing the ISO to a running cluster with a reachable console. For an overview of the appliance components and how they fit together, refer to [Architecture](../explanation/architecture.md).

The installation procedure is the same as the Palette Management Appliance.

> **[SME REVIEW]** Confirm we can point readers to the existing Palette Management Appliance install guide as the canonical procedure, or whether the Launchpad for AI flow diverges enough to keep this guide fully self-contained. (Candidate cross-link target in the repo: `enterprise-version/install-palette/palette-management-appliance.md`.)

## Prerequisites

- Each node meets the Launchpad for AI [Hardware Requirements](../reference/hardware-requirements.md).
- The Launchpad for AI ISO and the content bundle built for your GPU model.
- A second, dedicated storage device on each node for the Piraeus storage pool (for example, `/dev/sdb`).
- A reserved virtual IP address (VIP) for the cluster, and an unused IP address (or range) for MetalLB to expose platform services.

> **[SME REVIEW]** Confirm the GA download location and access method for the ISO and content bundle. The content bundle is hardware-specific (a separate bundle is validated per supported GPU), so the guide must direct users to obtain the bundle that matches their hardware. Need the confirmed GA mechanism before publishing.

## Install the OS with the Interactive Installer

1. Download the Launchpad for AI ISO and the content bundle for your hardware.

2. Flash the ISO to a bootable device, such as a USB stick. You can use tools such as [balenaEtcher](https://etcher.balena.io), or transfer the ISO to the node with `scp` or `rsync`.

3. Attach the bootable media to each bare metal node and set the boot order to boot from the Launchpad for AI ISO first.

4. Restart the node to start the installation process.

5. When the node reaches the GRand Unified Bootloader (GRUB) menu, allow it to select the **Palette Edge Interactive Installer** boot option automatically.

6. When the **Palette Edge Interactive Installer** window appears, select the target disk to install the OS onto.

   > **Warning:** Ensure you select the correct disk. The installation process erases all content on the target disk. Do not select the disk you intend to use as the storage pool drive.

7. Choose the post-installation action — **nothing**, **reboot**, or **poweroff** — then press **ENTER**.

   | Option   | Description                                     |
   | -------- | ----------------------------------------------- |
   | nothing  | Keeps the system powered on after installation. |
   | reboot   | Automatically reboots the system.               |
   | poweroff | Powers off the system.                          |

8. Review the **Installation Summary** and press **ENTER** to start the installation.

9. Wait for the installation to complete. This takes at least 15 minutes, depending on the node's resources. After it completes, disconnect the ISO. If you selected **reboot**, the node reboots and displays the Palette TUI. If you selected **poweroff**, power the node back on.

## Configure the IP Address with the Palette TUI

1. In the **Palette TUI**, provide credentials for the initial account. Use this account to log in to Local UI and to access the node over SSH.

   | Field            | Description                                |
   | ---------------- | ------------------------------------------ |
   | Username         | Provide a username to use for the account. |
   | Password         | Enter a password for the account.          |
   | Confirm Password | Re-enter the password for confirmation.    |

   Press **ENTER** to continue.

2. The available configuration options appear. Use the **TAB** key or the up and down arrow keys to switch between fields. When you make a change, press **ENTER** to apply it. Use **ESC** to go back.

3. In **Hostname**, check the existing hostname and, optionally, change it.

4. In **Network Adapter**, select the adapter to configure. By default, adapters request an IP address automatically from the DHCP server. For each adapter, you can:

   - Switch from DHCP to **static IP**, and provide a static IP address, subnet mask, and default gateway. Setting a static IP removes the existing DHCP settings.
   - Specify a **VLAN ID** to segment traffic on the same physical interface.
   - Specify the **MTU** for the interface.

5. In **DNS Configuration**, specify the primary and alternate name servers, and optionally a search domain.

6. In **NTP Configuration**, specify one or more NTP servers. For example, `0.pool.ntp.org`.

7. After you are satisfied with the configuration, navigate to **Quit** and press **ENTER**. Press **ENTER** again on the confirmation prompt. After a few seconds, the terminal displays the **Device Info** and the Local UI address.

   To access the Palette TUI again, issue the `palette-tui` command in the terminal.

8. Repeat the OS installation and Palette TUI configuration on every node before continuing.

## Link the Hosts in Local UI

> **Note:** Skip this section for a single-node installation.

1. Decide which host is the leader of the group. For multi-node clusters, use an odd number of nodes in the control plane for high availability.

2. In a web browser, go to `https://<node-ip>:5080`. Replace `<node-ip>` with the leader host's IP address. The Local UI address also appears on the node's terminal screen. If you changed the default port, replace `5080` with your configured port.

   > **Note:** Local UI uses a self-signed certificate, so your browser may show a security warning the first time. You can safely proceed.

3. Log in to Local UI with the credentials you created in the Palette TUI.

4. From the left **Main Menu**, select **Linked Edge Hosts**.

5. Select **Generate token**. The leader generates a Base64-encoded token that contains its IP address and a one-time password (OTP) that expires after two minutes. Select **Copy** to copy the token.

6. Log in to Local UI on each host you want to link, select **Linked Edge Hosts**, then select **Link this device to another**. Enter the token you copied from the leader and select **Confirm**.

7. Repeat for every host you want to link to the leader.

8. Confirm that all linked hosts appear in the **Linked Edge Hosts** table with the following statuses.

   | Column  | Status  |
   | ------- | ------- |
   | Status  | Ready   |
   | Content | Synced  |
   | Health  | Healthy |

   > **Note:** Content synchronization takes at least five minutes, depending on your network.

## Deploy the Cluster

1. From the left **Main Menu**, select **Content**, then select **Actions** and **Upload Content**.

2. Wait for the content to upload successfully.

3. From the left **Main Menu**, select **Cluster**, then select **Create cluster**.

4. Complete the **Basic Information** fields and select **Next**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | Cluster name | Name of the cluster.                                    |
   | Tags         | Key-value pairs to provide metadata about your cluster. |

5. In **Cluster Profile**, the default Launchpad for AI profile loads with the packs described in the **Architecture** section. Review the profile and select **Next**.

6. In **Profile Config**, review the profile variables for the cluster. The default Launchpad for AI profile ships with values pre-validated for your hardware. Keep the defaults unless the bundle instructions for your hardware tell you otherwise, then select **Next**.

   > **[SME REVIEW — content held]** A full Profile Variables reference is intentionally omitted from this guide. Per the team discussion, pack values are currently hardware-specific and not templatized, and the planned direction is a packaged Custom UI in Local UI that performs GPU lookup and presents the appropriate, pre-validated configuration (preset selection is a P0 item, not yet available). Documenting the current manual variable list risks (a) presenting one hardware's defaults as universal — a known install-failure mode — and (b) enshrining an interim workflow that is being replaced. Revisit once the preset/Custom UI story lands.

7. In **Cluster Config**, enter the cluster's virtual IP address (VIP). Optionally, add the IP address of an NTP server for the cluster to reference and one or more public SSH keys to access the cluster nodes. Select **Next**.

8. In **Node Config**, assign hosts to the control plane and worker node pools. To assign a host, select **Add Item** in the node pool and select the host. Keep the leader node in the control plane pool, and use an odd number of control plane nodes. You can remove the worker pool if it is not required, but ensure **Allow worker capability** is enabled on the control plane pool when you do. Select **Next**.

9. Review your configuration and deploy the cluster. The **Cluster** page displays the deployment status. The nodes reboot as part of the build process, and deployment can take up to 45 minutes.

## Validate the Installation

1. On the **Cluster** page, confirm that the cluster reaches a **Running** / **Healthy** state and that all packs install successfully.

   > **Note:** If the installation stalls, verify that the `piraeus-operator` and `nvidia-gpu-operator-ai` packs installed correctly. GPU driver installation can take additional time on first boot.

2. After deployment completes, additional options appear in the left **Main Menu**. Use them to access the Launchpad for AI platform and confirm that GPU nodes are schedulable.

## Next Steps

After you deploy your Launchpad for AI cluster, configure the Launchpad for AI platform and deploy your first AI workload. Once the appliance console is reachable, follow the Run Your First Model and Send Your First Prompt tutorial to deploy a model and send your first inference prompt.

---

## Notes for porting into the repo doc (delete before publishing)

These notes are for moving this content into `docs/docs-content/launchpad-for-ai/how-to-guides/install-the-appliance.md`. They are not part of the guide.

- **Unreleased banner:** Replace the italic disclaimer at the top with the partial — `<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />`.
- **Callouts:** Convert each `> **Warning:** …` / `> **Note:** …` blockquote to a Docusaurus admonition (`:::warning` / `:::info`).
- **Cross-links (relative paths from the how-to-guides directory):**
  - Palette Management Appliance → `../../enterprise-version/install-palette/palette-management-appliance.md` (pending SME confirmation).
  - Link Hosts → `../../clusters/edge/local-ui/cluster-management/link-hosts.md` (add at the end of the "Link the Hosts in Local UI" section).
  - Run Your First Model → `../tutorials/run-first-model.md` (the "Run Your First Model and Send Your First Prompt" mention in Next Steps).
  - Architecture → `../explanation/architecture.md` (linked in the intro, and referenced again in Deploy step 5).
  - Hardware Requirements → `../reference/hardware-requirements.md` (the first Prerequisites bullet). Note this reference page is currently a stub (DOC-2921); the link resolves once that page is populated.
- **Headings:** Body should start at `##` (the H1 title comes from frontmatter). Keep frontmatter from the current stub.
- **Open SME items to resolve before publishing:** GA download location/method; the Hardware Requirements reference page content (DOC-2921), which this guide now links to; whether to cross-link vs. inline the Management Appliance procedure; and the deferred Profile Variables reference (pending preset/Custom UI).
