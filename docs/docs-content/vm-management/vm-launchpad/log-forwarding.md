---
sidebar_label: "Log Forwarding"
title: "Log Forwarding"
description:
  "Forward PaletteAI VM Launchpad appliance logs to Splunk or another central logging system with a cluster
  log-forwarding agent."
icon: " "
hide_table_of_contents: false
sidebar_position: 7
tags: ["vmo", "vm launchpad", "logging", "configuration"]
---

Virtual Machine Orchestrator (VMO) writes its logs to container standard output, where any cluster-wide log-forwarding
agent can collect them. Use the **Logging** page to set the verbosity and encoding of those logs and to record that a
central logging system collects them.

VMO does not open a connection to your central logging system. The delivery hop belongs to a log-forwarding agent that
you deploy and operate. The agent reads container logs from the nodes and ships them to Splunk, Elasticsearch, or
another destination. This keeps the appliance free of outbound network dependencies, which matters in airgapped and
regulated environments, and it lets you reuse the agent, credentials, and retention policy that already serve the rest
of your cluster.

:::info

The **Logging** page controls the operational logs that the appliance produces. It does not replace the appliance
[Audit Trail](./system/audit.md), which records who performed each security-relevant action. Because VMO deletes audit
events after 30 days, forwarding appliance logs to a central system is how you keep that record beyond the window.

:::

## How Log Forwarding Works

Every VMO service runs as an ordinary Kubernetes pod and writes structured log lines to standard output. Kubernetes
stores those lines on the node under `/var/log/pods/`. A log-forwarding agent that runs as a DaemonSet reads the node
files and delivers them to your destination, so VMO needs no appliance-specific log shipper.

Two namespaces hold the logs that are worth collecting.

| **Namespace**       | **Contents**                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `vm-dashboard`      | Appliance services, including the management UI backend, the audit event writer, and the API.    |
| `vmo-golden-images` | Golden image builder VMs. Collect this namespace when you want a record of image build activity. |

Most agents tail every namespace by default, so an agent that already runs in the cluster picks up VMO logs without
extra configuration. Confirm the namespace list only when you have narrowed it explicitly.

VMO works with any agent that reads container logs. The following agents are in common use.

- [Splunk Connect for Kubernetes](https://github.com/splunk/splunk-connect-for-kubernetes)

- [Splunk Distribution of the OpenTelemetry Collector](https://docs.splunk.com/observability/en/gdi/opentelemetry/opentelemetry.html)

- [Fluent Bit](https://docs.fluentbit.io/manual/)

- [Vector](https://vector.dev/docs/)

- [Grafana Alloy](https://grafana.com/docs/alloy/latest/)

## Prerequisites

- A log-forwarding agent that runs in the appliance cluster, or the ability to deploy one. The agent holds the
  credentials for your destination, such as a Splunk
  [HTTP Event Collector (HEC)](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector) token.
  VMO never stores those credentials.

- Network connectivity from the cluster nodes to your central logging system.

- A VMO account with the **Platform Admin** role, which holds the `vmo:config:read` and `vmo:config:write` permissions.

- Access to the appliance cluster with [kubectl](https://kubernetes.io/docs/tasks/tools/) to verify delivery. This step
  is optional.

## Configure Log Forwarding

1. Point your log-forwarding agent at the `vm-dashboard` namespace, and at `vmo-golden-images` if you want builder logs.
   Configure the destination, credentials, and index on the agent, following the instructions for the agent you use.

2. Log in to VMO.

3. From the VMO left main menu, select **Settings**.

4. Under **Configuration**, select **Logging**. The page lists the logging settings with their current values.

5. Select the edit icon next to **Log Format** and enter `json`. Select the save icon.

   JSON encoding gives your indexer discrete fields for the timestamp, level, message, and any structured context,
   instead of one free-form string that you have to parse at search time. VMO swaps the log encoder when you save,
   without a pod restart.

6. Select the checkbox next to **Forward Logs to Central System**. The label changes to **Enabled**.

   This setting records that a central logging system collects the appliance logs. VMO writes a
   `logging.forwarding.toggled` audit event that captures the previous value, the new value, and your identity, which
   gives compliance reviewers a first-class record of when an administrator acknowledged central logging. The setting
   does not start or stop delivery, because your agent performs the delivery.

7. _(Optional)_ Set **Forwarding Target** to the name of your destination, such as `splunk-hec`, and **Forwarding
   Endpoint** to the address your agent delivers to, such as `splunk-hec.example.com:8088`. Both settings are
   informational. They let the next administrator read the central logging arrangement from the appliance instead of
   tracing it through cluster manifests.

   :::warning

   Do not enter a token, password, or other credential in **Forwarding Endpoint**. Every administrator who can read the
   logging configuration can read this value.

   :::

8. _(Optional)_ Adjust **Log Level** if the default verbosity does not give your indexer enough detail. VMO applies the
   new level immediately, without a pod restart.

## Settings Reference

The **Logging** page exposes the following settings. Each setting has a matching environment variable that the appliance
reads at startup.

| **Setting**                        | **Configuration key**         | **Environment variable**  | **Default** | **Description**                                                                                                                                                      |
| ---------------------------------- | ----------------------------- | ------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Log Level**                      | `logging.level`               | `LOG_LEVEL`               | `warn`      | Verbosity of the appliance logs. Accepts `debug`, `info`, `warn`, and `error`. Applied immediately.                                                                  |
| **Log Format**                     | `logging.format`              | `LOG_FORMAT`              | `text`      | Encoding of the appliance logs. Accepts `text` and `json`. Use `json` when an agent indexes the logs. Applied immediately.                                           |
| **Forward Logs to Central System** | `logging.forwarding_enabled`  | `LOG_FORWARDING_ENABLED`  | `false`     | Records that a central logging system collects the appliance logs. Writing this setting emits a `logging.forwarding.toggled` audit event. Does not perform delivery. |
| **Forwarding Target**              | `logging.forwarding_target`   | `LOG_FORWARDING_TARGET`   | Empty       | Informational name of the destination, such as `splunk-hec`, `otlp`, `syslog`, or `elasticsearch`. Free text that VMO does not enforce.                              |
| **Forwarding Endpoint**            | `logging.forwarding_endpoint` | `LOG_FORWARDING_ENDPOINT` | Empty       | Informational address that your agent delivers to. Free text that VMO does not enforce.                                                                              |

**Log Level** and **Log Format** accept lowercase values only. VMO rejects a value outside the accepted set before it
stores the value, and displays a message that lists the accepted values, such as
`invalid logging.level: value "bogus" must be one of [debug, info, warn, error]`.

### Value Sources

Each row on the page carries a badge that identifies where its current value comes from.

| **Badge**    | **Meaning**                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Default**  | The value ships with the appliance. No one has changed it.                                                                        |
| **Env**      | An environment variable in the appliance deployment sets the value. A lock icon accompanies the badge and editing is unavailable. |
| **Override** | An administrator changed the value in the UI. VMO stores the value in the appliance configuration.                                |

An environment variable takes precedence over a value that you set in the UI, so a setting with the **Env** badge is
read-only until the deployment stops supplying the variable. To discard an override and return a setting to its shipped
value, select the revert icon on its row.

## Verify Log Delivery

1. Confirm that the appliance emits JSON after you change **Log Format**.

   ```bash
   kubectl logs --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager --tail=5
   ```

2. Confirm that VMO recorded the audit event for the **Forward Logs to Central System** setting.

   ```bash
   kubectl get vmoauditevents.virtualization.spectrocloud.com --namespace vm-dashboard --output json \
   | jq '.items[] | select(.spec.action=="logging.forwarding.toggled")'
   ```

   You can review the same event in the VMO UI. Select **System** > **Audit** and filter the **Action** column for
   `logging.forwarding.toggled`.

3. Search your central logging system for the audit event. In Splunk, a search for `logging.forwarding_enabled` returns
   the log line that VMO wrote when you changed the setting, which confirms that the full path from the appliance to
   your indexer works.

## Considerations

- **Forwarding Target** and **Forwarding Endpoint** do not configure anything. VMO stores them so that administrators
  can read the central logging arrangement from the appliance. Configure the real destination on your agent.

- On a multi-replica appliance, a **Log Format** change that you make in the UI applies to the replica that handled the
  request. The remaining replicas keep their previous encoding until they restart. To apply an encoding change across
  every replica at once, set `LOG_FORMAT` in the appliance deployment instead, or restart the `vmo-manager` StatefulSet
  after you save the change.

- A `debug` log level increases log volume. Confirm that your destination has the capacity and retention budget for the
  extra volume before you leave the appliance at `debug`.

## Palette Audit Trail Forwarding

The **Logging** page covers the appliance. If your organization also runs Palette, Palette forwards its own control
plane audit events, which cover cluster, profile, and user activity at the tenant scope, through a separate path that
you configure in Palette at **Tenant Settings** > **Audit Trails**. That path supports Splunk HEC as a destination and
is independent of the agent that collects appliance logs. Refer to [Audit Logs](../../audit-logs/audit-logs.md) for
those steps.

## Next Steps

Review the appliance [Audit Trail](./system/audit.md) to confirm which actions VMO records, and which of those records
your central logging system now retains beyond the 30-day window that the appliance enforces.
