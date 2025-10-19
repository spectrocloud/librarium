---
sidebar_label: "Connect to Edge Host Using Remote Shell"
title: "Connect to Edge Host Using Remote Shell"
description: "Learn about how to connect to an Edge host using remote shell."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Edge hosts deployed in remote locations are often difficult to access. Traditional troubleshooting tools such as
`kubectl` rely on the Kubernetes API being available, which is not always the case in an outage. Palette allows you to
use a remote shell session to access your centrally managed Edge host. This connection operates on the Operating System
(OS) level and does not require Kubernetes to be available.

![Diagram of the relationship between user, Palette, and Edge host in Remote Shell](/clusters_edge_cluster-mgmt_remote-shell.webp)

You can generate temporary user credentials with root privileges or use an existing user on your Edge host. Temporary
users have root privilege on the Edge host, allowing you the permissions often required to troubleshoot, but they must
be enabled per Edge host by someone with sufficient permissions.

After 24 hours of inactivity, the remote shell temporary user credentials and the underlying tunnel are both removed for
security purposes, and the Palette UI displays that remote shell is disabled on the host. If you want to use remote
shell after 24 hours of inactivity, you need to re-enable it.

## Prerequisites

- In your Edge host's `sshd` configuration, `PasswordAuthentication` must be set to `true`. In most cases, `true` is the
  default value for this attribute.

- An Edge host registered with your Palette account. The Edge host may or may not be part of an Edge cluster.

- If your Edge host is built with Palette Agent version 4.7.16 or later, the `stylus.site.remoteShell.disable` parameter
  in the `user-data` file must be omitted or set to `false` before the Edge host registers with Palette. `false` is the
  default value for this attribute. If you set this value to `true`, you cannot enable remote shell in Palette. The
  value cannot be changed after the host registers.

- You are logged in as a Palette user who has the `edgehost.sshUpdate` permission in the project to which the Edge host
  is associated.

- If you wish to enable temporary user generation, you also need the `edgehost.sshUserUpdate` permission. For more
  information, refer to [Permissions](../../../user-management/palette-rbac/permissions.md).

- Your Palette agent version must be 4.6.9 or later, and your Palette/VerteX version must be 4.6.12 or later.
  - If your Palette agent version is 4.6.23 or later, your Palette/Vertex version must be 4.6.23 or later.
  - If your Palette agent version earlier than 4.6.23, your Palette/Vertex version must be also be earlier than 4.6.23.

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

    :::info

    The default timeout for a remote shell session is 12 hours of inactivity. After that, the session terminates.
    Additionally, some browsers may suspend background tabs after a shorter period of inactivity, which causes the
    remote shell connection to terminate sooner.

    This is different from the tunnel and credential termination caused by 24 hours of inactivity. After 12 hours of
    inactivity, only the shell session is terminated; the underlying tunnel and the temporary user credentials remain,
    and the UI still shows remote shell as enabled on your host, allowing you to start a new session with the same
    credentials. After 24 hours of inactivity, the tunnel and the credentials are both removed, and the UI displays the
    remote shell status as disabled. To use remote shell again, you will need to re-enable it and create new
    credentials.

    :::

## Validate

1. In the remote shell, issue the following command.

   ```shell
   whoami
   ```

2. Confirm that you are logged in as the expected user.
