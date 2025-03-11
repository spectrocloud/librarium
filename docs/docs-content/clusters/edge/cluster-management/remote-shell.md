---
sidebar_label: "Connect to Edge Host Using Remote Shell"
title: "Connect to Edge Host Using Remote Shell"
description: "Learn about how to connect to an Edge host using remote shell."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

Edge hosts deployed in remote locations are often difficult to access. Traditional troubleshooting tools such as
`kubectl` rely on the Kubernetes API being available, which is not always the case in an outage. Palette allows you to
use a remote shell session to access your connected Edge host. This connection operates on the Operating System (OS)
level and does not require Kubernetes to be available.

![Diagram of the relationship between user, Palette, and Edge host in Remote Shell](/clusters_edge_cluster-mgmt_remote-shell.webp)

:::preview

:::

You can generate temporary user credentials with root privileges or use an existing user on your Edge host. Temporary
users have root privilege on the Edge host, allowing you the permissions often required to troubleshoot, but they must
be enabled per Edge host by someone with sufficient permissions.

## Prerequisites

- An Edge host registered with your Palette account. The Edge host may or may not be part of an Edge cluster.

- You are logged in as a Palette user who has the `edgehost.sshUpdate` permission in the project to which the Edge host
  is associated.

- If you wish to enable temporary user generation, you also need the `edgehost.sshUserUpdate` permission. For more
  information, refer to [Permissions](../../../user-management/palette-rbac/permissions.md).

## Procedure

### Enable Remote Shell

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**.

3. In the **Clusters** view, select the **Edge hosts** tab.

4. Select the Edge host you want to open a remote shell session to.

5. In the upper-right corner, click on **Settings**. Then click **Edit**.

6. Turn on **Remote shell**. This will allow you to open a remote shell session to the Edge host from Palette. You will
   need the credentials from the host to log in. The privileges you have on the host depends on the user credentials you
   used to log in to the host.

7. (Optional) You may also turn on **Create temporary username and password**. Turning this on will allow you to connect
   to the Edge host with root privileges without needing credentials for the Edge host itself. This action requires the
   `edgehost.sshUserUpdate` permission.

   :::warning

   If you open a shell session with temporary credentials and then disable temporary user generation, the current
   session will remain open for up to one minute before the shell times out and the temporary user is deleted.

   :::

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
