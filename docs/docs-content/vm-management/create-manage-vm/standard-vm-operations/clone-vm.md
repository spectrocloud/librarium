---
sidebar_label: "Clone a VM"
title: "Clone a VM"
description: "Learn how to clone a VM from a template using Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 40
tags: ["vmo"]
---

A VM clone is a copy of an existing, or parent, virtual machine (VM). The cloned VM has the same configuration settings and identifiers as the parent VM. After you clone a VM, it as a separate virtual machine.

Cloning is a quick way to create a new virtual machine that shares the same properties as the parent. You may want to clone a VM for the following reasons:

<br />

- Software testing - developers can clone an active VM to test new changes to their code.

- Forensics - security administators can clone an infected machine and connect it to an air-gaped network to investigate the source of the infection while the parent VM can be destroyed or remediated.

## Prerequisites

There are no requirements.

## Clone a VM

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Select the VM to clone and click either the **three-dot Menu** or **Actions**

4. Power off the parent VM and click **Clone**. If you forget to power it off, the parent VM will automatically be powered off while cloning is in progress.

5. Give the clone a name, give an optional description, and select a namespace.

6. Optionally, you can enable the checkbox to start the cloned VM automatically when cloning is complete.

## Validate

From the **Virtual Machines** tab, verify the cloned VM is listed and displays **Running** status.
