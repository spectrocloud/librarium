---
sidebar_label: "Configure and Access Audit Logs"
title: "Configure and Access Audit Logs"
description: "Instructions for configuring applications to write to the audit log file and how to download the files. "
hide_table_of_contents: false
sidebar_position: 110
tags: ["edge"]
---

On any operational Edge host, many services write events, logs, and any other applicable audit log to the
`/var/log/stylus-audit.log` file. If you have application workloads on your cluster, you can also configure them to
write audit logs to the same file. This allows you to keep all audit logs in a single location for easy management and
retrieval. Audit logs written to the `/var/log/stylus-audit.log` file can be downloaded from Local UI.

## Configure Audit Logs to be Written to File

You can configure your own application to write log entries to the `/var/log/stylus-audit.log` file by setting up the
applications to write to `syslog` and configure your `syslog` daemon to direct the logs to the file. The exact steps to
do this vary by application, but the log entries must conform to the expected schema. In addition, you can also direct
Palette agent's logs to be directed to another file if you want to collect the logs in a different file.

By default, you can view one year's worth of audit logs in Local UI. Log files past the one year mark will be rotated
out and archived. You can still download your log files from any period, but they will not be viewable in Local UI.

### Limitations

- This feature is available to airgapped Edge hosts without a connection to Palette only.

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

2. Create a file at the path `overlay/files/etc/rsyslog.d/48-audit.conf`. You can change the filename, but it must be a
   `conf` file and sort alphanumerically before `49-stylus-audit.conf`. For example, `30-my-log.conf`.

<Tabs>

<TabItem label="Send Application Logs to Palette Log File">

3. Populate the file with the following configuration. Replace `your-tag` with the tag you configured for the logs of
   your own application. If you changed the facility or the severity level from the suggested values, replace them with
   your actual values.

   ```conf
   $PrivDropToUser root
   $PrivDropToGroup root
   $Umask 0000
   $template ForwardFormat,"<%pri%>1 %timestamp:::date-rfc3339% %HOSTNAME% %syslogtag% %procid% - - %msg%\n"
   if ($syslogfacility-text == 'local7' and $syslogseverity-text == 'notice' and $syslogtag contains 'your-tag') then {
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
   `resourceKind`. If your log entries do not follow this RFE 5424 Syslog protocol, or do not contain the necessary
   keys, they will still be logged, but will not show up in Local UI.

</TabItem>

<TabItem label="Send Palette Logs to Another File">

3. Populate the file with the following configuration. Replace `your-file` with the name of your log file.

   ```conf
   $PrivDropToUser root
   $PrivDropToGroup root
   $Umask 0000
   $template ForwardFormat,"<%pri%>1 %timestamp:::date-rfc3339% %HOSTNAME% %syslogtag% %procid% - - %msg%\n"
   if ($syslogfacility-text == 'local7' and $syslogseverity-text == 'notice' and $syslogtag contains 'stylus-audit') then {
        action(
            type="omfile"
            file="/var/log/your-file"
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

4. Follow [Build Edge Installer ISO](../../edgeforge-workflow/palette-canvos/build-installer-iso.md) to build an Edge
   installer ISO and install an Edge host. Then follow the relevant guides in
   [Deployment](../../site-deployment/site-deployment.md) to deploy a cluster with your application workloads.

### Validate

1. Log in to Local UI. For more information, refer to [Access Local UI Console](access-console.md).

2. In the left **Main Menu**, click **Audit Log**. Confirm that the logs from your applications are being collected.

## View and Download Log File from Local UI

Log files are stored in the `/var/log/` folder. By default, the active log file `stylus-audit.log` stores up to one
year's worth of logs. When the one period is reached, or when the file size reaches 100 MB, the log file is rotated out
and archived. If the log messages are configured to be picked up by Local UI, they will show up in Local UI. You can
also download all log files in the `/var/log/` file from Local UI, including files that are older than one-year old, as
well as files that were not configured to be displayed by Local UI.

### Prerequisites

- An active Edge host installed in the `airgap` installation mode.

### Procedure

1. Log in to Local UI. For more information, refer to [Access Local UI Console](access-console.md).

2. In the left **Main Menu**, click **Audit Log**. You can view all audit log entries on this page. By default, local UI
   will display log entries dated up to one year ago.

3. To download the log files, click the **Download Logs** button in the upper-right corner. This will download all files
   in the `/var/log` folder, including archived old log files as well as any additional log files you configured to be
   stored in the directory.

### Validate

1. Open the downloaded file. Confirm that the logs are included in the file.
