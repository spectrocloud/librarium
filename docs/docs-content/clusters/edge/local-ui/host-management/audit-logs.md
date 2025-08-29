---
sidebar_label: "Configure and Access Audit Logs"
title: "Configure and Access Audit Logs"
description: "Instructions for configuring applications to write to the audit log file and how to download the files. "
hide_table_of_contents: false
sidebar_position: 110
tags: ["edge"]
---

On any operational Edge host, many services write events, logs, and any other applicable audit logs to the
`/var/log/stylus-audit.log` file. If you have application workloads on your cluster, you can also configure them to
write audit logs to the same file. This allows you to keep all audit logs in a single location for easy management and
retrieval. Audit logs written to the `/var/log/stylus-audit.log` file can be downloaded from Local UI.

## Configure Audit Logs to be Written to File

You can configure your own application to write log entries to the `/var/log/stylus-audit.log` file by setting up the
applications to write to `syslog` and configure your `syslog` daemon to direct the logs to the file. The exact steps to
do this vary by application, but the log entries must conform to the expected schema. In addition, you can also direct
Palette agent's logs to another file if you want to collect the logs in a different file.

By default, you can view one year's worth of audit logs in Local UI. Log files past the one year mark will be rotated
out and archived. You can still download your log files from any period, but they will not be viewable in Local UI.

### Prerequisites

- You must have configured your application to write logs to `syslog` with a given facility and severity level. We
  recommend setting the facility as `local7` and severity as `notice`. We also recommend that you add a tag to your
  application logs to distinguish it from other logs.

- The audit entries logged to `syslog` must be in the RFC 5424 Syslog protocol, with the message in JSON format. The
  JSON object must contain the following keys: `edgeHostId`, `contentMsg`, `action`, `actor`, `actorType`, `resourceId`,
  `resourceName`, `resourceKind`. For more information about the Syslog protocol, refer to
  [RFC 5424 - The Syslog Protocol](https://datatracker.ietf.org/doc/html/rfc5424).

- This how-to is based on the EdgeForge process. We recommend that you familiarize yourself with
  [EdgeForge](../../edgeforge-workflow/edgeforge-workflow.md) and the process to build Edge artifacts.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

### Procedure

1. Clone the CanvOS repository and change into the directory.

   ```shell
    git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Create a file at the path `overlay/files/etc/rsyslog.d/48-audit.conf`. You can change the file name, but it must be a
   `conf` file and sorted alphanumerically before `49-stylus-audit.conf`. For example, `30-my-log.conf`.

<Tabs>

<TabItem value="Send Application Logs to Palette Log File">

3. Populate the file with the following configuration. Replace `your-tag` with the tag you configured for the logs of
   your own application. If you changed the facility or the severity level from the suggested values, replace them with
   your actual values.

   ```conf
   $PrivDropToUser root
   $PrivDropToGroup root
   $Umask 0000
   $template ForwardFormat,"<%pri%>1 %timestamp:::date-rfc3339% %HOSTNAME% %syslogtag% %procid% - - %msg%\n"
   if ($syslogfacility-text == 'local7' and $syslogseverity-text == 'notice' and $syslogtag contains '<your-tag>') then {
        action(
            type="omfile"
            file="/var/log/stylus-audit.log"
            FileCreateMode="0600"
            fileowner="root"
            template="ForwardFormat"
        )
    }
   ```

   Ensure your logs follow the RFC 5424 Syslog protocol, with the message in JSON format. The JSON object must contain
   the following keys: `edgeHostId`, `contentMsg`, `action`, `actor`, `actorType`, `resourceId`, `resourceName`,
   `resourceKind`. If your log entries do not follow the RFE 5424 Syslog protocol, or do not contain the necessary keys,
   they will still be logged, but will not show up in Local UI.

</TabItem>

<TabItem value="Send Palette Logs to Another File">

3. Populate the file with the following configuration. Replace `your-file` with the name of your log file.

   ```conf
   $PrivDropToUser root
   $PrivDropToGroup root
   $Umask 0000
   $template ForwardFormat,"<%pri%>1 %timestamp:::date-rfc3339% %HOSTNAME% %syslogtag% %procid% - - %msg%\n"
   if ($syslogfacility-text == 'local7' and $syslogseverity-text == 'notice' and $syslogtag contains 'stylus-audit') then {
        action(
            type="omfile"
            // highlight-next-line
            file="</var/log/your-file>"
            FileCreateMode="0600"
            fileowner="root"
            template="ForwardFormat"
        )
    }
   ```

   This makes sure that the Palette agent logs are sent both to the file you configured and to the default
   `stylus-audit.log` file.

</TabItem>

</Tabs>

4. Follow the [Build Edge Installer ISO](../../edgeforge-workflow/palette-canvos/build-installer-iso.md) guide to build
   an Edge installer ISO and install an Edge host. Then follow the relevant guides in
   [Deployment](../../site-deployment/site-deployment.md) to deploy a cluster with your application workloads.

### Validate

1. Log in to Local UI. For more information, refer to [Access Local UI Console](access-console.md).

2. In the left **Main Menu**, click **Audit Log**. Confirm that the logs from your applications are being collected.

## View and Download Log File from Local UI

Log files are stored in the `/var/log/` folder. The active log file `stylus-audit.log` stores up to one year's worth of
logs. After a year, or when the file size reaches 100 MB, the log file is rotated out and archived. If the log messages
are configured to be picked up by Local UI, they will show up in Local UI.

You can also download log files less than three years old in the `/var/log/` file from Local UI. This includes the log
entries that were not configured to be displayed in Local UI.

### Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Procedure

1. Log in to Local UI. For more information, refer to [Access Local UI Console](access-console.md).

2. In the left **Main Menu**, click **Diagnostics**. Then click the **Logs** tab. You can view all audit log entries on
   this page. Local UI displays log entries dated up to one year ago.

   :::info

   To configure the preferred **Date & Time** field format, navigate to the **User Menu** in the upper-right corner and
   select **Time/Date Settings**. Local UI supports displaying values in Coordinated Universal Time (UTC), the browser’s
   local time zone, or both simultaneously.

   :::

3. To download the log files, click the **Download** button in the upper-right corner. This will download all files in
   the `/var/log` folder, including the archived log files as well as any additional log files you configured to be
   stored in the directory.

### Validate

1. Open the downloaded file. Confirm that the logs are included in the file.
