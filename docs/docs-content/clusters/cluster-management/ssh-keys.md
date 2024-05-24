---
sidebar_label: "SSH Keys"
title: "SSH Keys"
description: "Learn how to create and manage SSH keys in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster management"]
---

Palette supports SSH (Secure Shell) to establish, administer, and communicate with remote clusters. This section
describes creating and managing SSH Keys in the Palette Management Console.

## Scope of SSH Key

Palette groups clusters for logical separation into [Projects](../../tenant-settings/projects/projects.md). Users and
teams can be assigned roles within a project for granular control over permissions within the project scope. SSH key
authentication is scoped to a project. Multiple users can gain access to a single project. To access a cluster with SSH,
you need a public SSH key registered in Palette.

## Prerequisites

- Access to a terminal window.

- The utility ssh-keygen or similar SSH key generator software.

## Create and Upload an SSH Key

Follow these steps to create an SSH key using the terminal and upload it to Palette:

1. Open the terminal on your computer.

2. Check for existing SSH keys by invoking the following command.

   <br />

   ```shell
    ls -la ~/.ssh
   ```

   If you see files named **id_rsa** and **id_rsa.pub**, you already have an SSH key pair and can skip to step 8. If
   not, proceed to step 3.

3. Generate a new SSH key pair by issuing the following command.

   <br />

   ```shell
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

   Replace `your_email@example.com` with your actual email address.

4. Press Enter to accept the default file location for the key pair.

5. Enter a passphrase (optional) and confirm it. We recommend using a strong passphrase for added security.

6. Copy the public SSH key value. Use the `cat` command to display the public key.

   <br />

   ```shell
   cat ~/.ssh/id_rsa.pub
   ```

   Copy the entire key, including the `ssh-rsa` prefix and your email address at the end.

7. Log in to [Palette](https://console.spectrocloud.com).

8. Navigate to the left **Main Menu**, select **Project Settings**, and then the **SSH Keys** tab.

9. Open the **Add New SSH Key** tab and complete the **Add Key** input form:

   - **Name**: Provide a unique name for the SSH key.

   - **SSH Key**: Paste the SSH public key contents from the key pair generated earlier.

10. Click **Confirm** to complete the wizard.

<br />

:::info

You can edit or delete SSH keys later by using the **three-dot Menu** to the right of each key.

:::

During cluster creation, assign your SSH key to a cluster. You can use multiple keys to a project, but only one key can
be assigned to an individual cluster.

## Validate

You can validate that the SSH public key is available in Palette by attempting to deploy a host cluster. During the host
cluster creation wizard, you will be able to assign the SSH key to the cluster. Refer to the
[Deploy a Cluster](../public-cloud/deploy-k8s-cluster.md) tutorial for additional guidance.
