---
sidebar_label: "Quick Start"
title: "Quick Start"
description: "Learn about Palette VMO Appliance and how to quickly get started."
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "vmo appliance", "quick start"]
---

# Quick Start

This guide walks you through accessing VMO Manager, logging in, viewing the dashboard, and creating your first virtual machine in about five minutes.

## Access the Platform

1. Navigate to the VMO Manager IP address using your browser. A DNS hostname is not required. 

2. Log in to the VMO Appliance.

    <Tabs>

    <TabItem label="Local Auth (Day-0)" value="local-auth">

    Before Keycloak is configured, you can use local admin accounts:

    1. Navigate to `/local-login`.
    2. Enter the local admin username (default: `admin`) and password.
    3. The password is typically set via the `LOCAL_ADMIN_PASSWORD` environment variable during initial deployment.

    :::tip
    
    Local auth is intended for Day 0 bootstrap. Configure Keycloak for production use. See [Local Auth](./user/access-management/local-auth.md) for details.

    :::

    </TabItem>

    <TabItem label="OIDC using Keycloak" value="keycloak">

    When Keycloak is configured, the platform uses OIDC for authentication:

    1. Click **Login** or navigate to the platform URL.
    2. You are redirected to the Keycloak login page.
    3. Enter your username and password.
    4. After successful authentication, you are redirected back to VMO Manager with an encrypted session cookie.

    </TabItem>

    </Tabs>

After login, the **Dashboard** (`/`) is the default landing page. It opens to the **Virtual Machines** tab, which contains a set of resizable, drag-to-reorder widgets:

    - **VM Summary** — KPI cards showing Total, Running, Stopped, Issues, Transitional, and Namespace counts. Click a card to navigate to the filtered VM list.
    - **Resource Summary** — CPU and memory cluster utilization plus quick links to Data Volumes and Networks.
    - **Charts** — VM status distribution, namespace breakdown, OS type and flavor breakdowns.
    - **Issues** — VMs currently in an error or unhealthy state.
    - **Events** — Recent Kubernetes events across monitored namespaces.
    - **Metrics** — PromQL-based time-series panels for CPU, memory, and network (requires an external metrics backend).

### Auto-Refresh and Pause

The dashboard polls the API and metrics backend on a configurable interval (5 s, 15 s, or 30 s). Use the **interval selector** in the toolbar to change the cadence. Click the **Pause** button to stop all background polling immediately — useful when inspecting data or troubleshooting. Click **Resume** to restart polling.

### Customizing the Layout

- **Drag** widget headers to reorder widgets within the grid.
- **Resize** widgets from their bottom-right corner handle.
- **Add / Remove widgets** using the **+** button in the toolbar to open the widget picker.
- **Reset layout** returns all widgets to the default arrangement.
- Layout changes are saved automatically and persist across sessions.

Use the sidebar to navigate to other sections such as Workloads, Image Catalog, and Inventory.

## Create Your First VM

The VM creation wizard guides you the following steps to create a simple VM.

1. Select where the source VM disk:

    - **Template** — Use an existing VmTemplate (recommended for first-time users)
    - **Golden Image** — Use a sealed base disk image
    - **ISO** — Attach an ISO for installation
    - **Blank** — Create an empty disk

Select a template or golden image, then set the VM **name** and **namespace**. The name must follow Kubernetes DNS-1123 rules (lowercase, alphanumeric, hyphens).

2. Configure CPU and memory:

    - **Instance Type** — Pick a predefined size (e.g., `u1.small`, `cx1.medium`)
    - **Custom** — Set CPU cores and memory manually

3. Configure the root disk:

    - **Size** — Set the disk size (e.g., 20 Gi)
    - **Storage Class** — Use the cluster default or select another
    - **Boot order** — Choose disk, CD-ROM, or network as first boot device

4. Add network interfaces:

    - Select a **Network Attachment Definition** (NAD) for each interface
    - Optionally configure static IPs via cloud-init

5. Select optional advanced settings, such as firmware, TPM, RNG, tablet devices, and node placement. For a basic VM, this step can be skipped. 

    - Firmware (EFI, Secure Boot)
    - TPM, RNG, tablet devices
    - Node placement (node selector, tolerations)

6. Select optional lifecycle settings, such as **Run strategy** (Always, RerunOnFailure, Manual, or Halted), **Eviction strategy** (LiveMigrate or None), and **Snapshot policy**. For a basic VM, this step can be skipped. 


7. Review the summary and YAML preview. Click **Create** to provision the VM.

:::tip

Use the YAML drawer to inspect or edit the full VirtualMachine spec before creating. For a detailed walkthrough of each wizard step, see [Creating VMs](./user/virtual-machines/creating.md).

:::

## Validation

1. Go to **Workloads > Virtual Machines** (`/vms`).
2. Find your VM in the list. The status column shows **Running** when the VM is started.
3. Click the VM name to open the detail page.
4. On the VM detail page, open the **Console** tab. The VNC console requires the VM to be running. If the VM is stopped, start it first from the Overview tab or VM list.
5. Click **Open VNC Console**.
6. A new tab opens with a noVNC-based remote console. You can interact with the VM as if you were at its keyboard.
