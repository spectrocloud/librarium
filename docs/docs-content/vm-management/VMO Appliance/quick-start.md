---
sidebar_label: "Getting Started"
title: "Getting Started"
description: "Learn about Palette VMO Appliance and how to quickly get started."
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "vmo appliance", "getting started"]
---

# Getting Started

This guide walks you through accessing VMO Manager, logging in, viewing the dashboard, and creating your first virtual machine in about five minutes.

## Access the Platform

VMO Manager is typically accessed via a single platform URL. In production, this is the Traefik LoadBalancer IP or hostname (for example, `https://10.100.1.50` or `https://vmo.example.com`).

> **Note:** VMO Manager works with bare IP addresses. A DNS hostname is not required.

Open your browser and navigate to the platform URL. You will be redirected to the login flow.

## Login

### OIDC (Keycloak)

When Keycloak is configured, the platform uses OIDC for authentication:

1. Click **Login** or navigate to the platform URL.
2. You are redirected to the Keycloak login page.
3. Enter your username and password.
4. After successful authentication, you are redirected back to VMO Manager with an encrypted session cookie.

### Local Auth (Day 0)

Before Keycloak is configured, you can use local admin accounts:

1. Navigate to `/local-login`.
2. Enter the local admin username (default: `admin`) and password.
3. The password is typically set via the `LOCAL_ADMIN_PASSWORD` environment variable during initial deployment.

> **Tip:** Local auth is intended for Day 0 bootstrap. Configure Keycloak for production use. See [Local Auth](/docs/access-management/local-auth) for details.

## Dashboard Overview

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

The VM creation wizard guides you through seven steps. Follow these steps to create a simple VM:

### 1. Source

Choose where the VM disk comes from:

- **Template** — Use an existing VmTemplate (recommended for first-time users)
- **Golden Image** — Use a sealed base disk image
- **ISO** — Attach an ISO for installation
- **Blank** — Create an empty disk

Select a template or golden image, then set the VM **name** and **namespace**. The name must follow Kubernetes DNS-1123 rules (lowercase, alphanumeric, hyphens).

### 2. Compute

Configure CPU and memory:

- **Instance Type** — Pick a predefined size (e.g., `u1.small`, `cx1.medium`)
- **Custom** — Set CPU cores and memory manually

### 3. Storage

Configure the root disk:

- **Size** — Set the disk size (e.g., 20 Gi)
- **Storage Class** — Use the cluster default or select another
- **Boot order** — Choose disk, CD-ROM, or network as first boot device

### 4. Network

Add network interfaces:

- Select a **Network Attachment Definition** (NAD) for each interface
- Optionally configure static IPs via cloud-init

### 5. Hardware

Optional advanced settings:

- Firmware (EFI, Secure Boot)
- TPM, RNG, tablet devices
- Node placement (node selector, tolerations)

You can skip this step for a basic VM.

### 6. Lifecycle

Optional lifecycle settings:

- **Run strategy** — Always, RerunOnFailure, Manual, or Halted
- **Eviction strategy** — LiveMigrate or None
- **Snapshot policy** — Attach a scheduled snapshot policy

You can skip this step for a basic VM.

### 7. Review

Review the summary and YAML preview. Click **Create** to provision the VM.

> **Tip:** Use the YAML drawer to inspect or edit the full VirtualMachine spec before creating. For a detailed walkthrough of each wizard step, see [Creating VMs](/docs/virtual-machines/creating).

## Verify the VM Is Running

1. Go to **Workloads > Virtual Machines** (`/vms`).
2. Find your VM in the list. The status column shows **Running** when the VM is started.
3. Click the VM name to open the detail page.

## Open the VNC Console

1. On the VM detail page, open the **Console** tab.
2. Click **Open VNC Console**.
3. A new tab opens with a noVNC-based remote console. You can interact with the VM as if you were at its keyboard.

> **Note:** The VNC console requires the VM to be running. If the VM is stopped, start it first from the Overview tab or VM list. See [Managing VMs](/docs/virtual-machines/managing) for all available VM actions.
