---
sidebar_label: "Connect to Edge Host Using Remote Shell"
title: "Connect to Edge Host Using Remote Shell"
description: "Learn about how to connect to an Edge host using remote shell."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

Edge hosts deployed in remote locations are often difficult to access. If a cluster starts to experience problems, but
Kubernetes remains available, you can troubleshooting using `kubectl` or other command-line tools. If Kubernetes is
down, however, your troubleshooting options become quite limited, especially the network that the host is deployed in is
outside of your control.

Palette allows you to use a remote shell session to access your connected Edge host. You can either generate temporary
user credentials with root privileges or use an existing user on your Edge host.

## Prerequisites

## Procedure

### Enable Remote Shell

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**.

3. In the **Clusters** view, select the **Edge hosts** tab.

4. Select the Edge host you want to open a remote shell session to.

5. In the upper-right corner, click on **Settings**. Then click **Edit**.

6. Turn on **Remote shell**. This will allow you to open a remote shell session to the Edge host from Palette. You will
   need the credentials from the host to log in. The privilege you have on the host depends on the user credentials you
   used to log in to the host.

7. (Optional) You may also turn on **Create temporary username and password**. Turning this one will allow you to
   connect to the Edge host with root privileges without needing credentials for the Edge host itself.

8. Click **OK** to apply changes.

### Connect to Host

9. On the Edge host page, the **Remote Shell** field will show **Enabled**. Click **Connect**.

10. If you did not turn on **Create temporary username and password**, you will be asked to enter the credentials for
    the Edge host as well as the port you want to connect to. Edge hosts use the standard port 22 for SSH connections
    unless you have configured otherwise.

    If you turned on **Create temporary username and password**, Palette will generate temporary credentials for you
    automatically, and you only need to select the port used to connect to the host.

11. Click **Confirm** to start the session.

## Validate

1. In the remote shell, issue the following command.

   ```shell
   whoami
   ```

2. Confirm that you are logged in as the expected user.
