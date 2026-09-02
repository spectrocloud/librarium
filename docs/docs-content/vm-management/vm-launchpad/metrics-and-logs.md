---
sidebar_label: "Metrics and Logs"
title: "Metrics and Logs"
description:
  "Forward PaletteAI VM Launchpad appliance metrics to Splunk HTTP Event Collector, and record central log delivery,
  with two audit-first toggles on one Settings page."
icon: " "
hide_table_of_contents: false
sidebar_position: 7
tags: ["vmo", "vm launchpad", "logging", "metrics", "splunk", "configuration"]
---

The PaletteAI VM Launchpad appliance exposes two independent forwarding surfaces on the **Metrics and Logs** page under
**Settings** and **Configuration**. The **Metrics** section pushes appliance metrics directly to Splunk HTTP Event
Collector (HEC), and the **Logs** section records that a central logging system collects the appliance logs. Both
toggles emit first-class filterable audit events, and both apply immediately without a pod restart.

The two surfaces have different runtime shapes:

- **Metrics forwarding is a real network gate.** The `vmo-manager` service holds a Splunk HEC client that POSTs each
  metric point to Splunk directly. When the toggle is off, or the URL or token is empty, zero bytes leave the appliance
  for metrics. This preserves the airgap posture of installs that have not yet been configured for forwarding.
- **Log forwarding is a compliance signal.** The OpenTelemetry Collector that the VMO pack deploys reads appliance logs
  from the node filesystem and pushes them to Splunk HEC through its own exporter. The **Log Forwarding** toggle records
  that an administrator has acknowledged central log collection. The delivery itself happens in the OpenTelemetry
  Collector, not in the appliance.

:::info

The settings on this page control the appliance's operational metrics and logs. They do not replace the appliance
[Audit Trail](./system/audit.md), which records who performed each security-relevant action. Because VMO deletes audit
events after 30 days, forwarding appliance logs to a central system is how you keep that record beyond the window.

:::

## Page Visibility

The **Metrics and Logs** page appears in the VMO UI only when VMO detects an OpenTelemetry Collector Deployment or
DaemonSet in the cluster. VMO checks at runtime through a capability probe that scans a built-in set of namespaces for
workloads with a built-in set of names. The page stays hidden until at least one match exists.

By default, the probe searches the following namespaces:

- `kube-system`
- `opentelemetry`
- `monitoring`
- `otel`

for a Deployment or DaemonSet with any of the following names:

- `otel-collector-agent`
- `opentelemetry-collector`
- `otel-collector`

The `kube-system` namespace covers the OpenTelemetry Collector that the Palette VMO pack addon deploys. The other three
cover community Helm charts and manual installs into a dedicated namespace.

If **Metrics and Logs** does not appear under **Settings** > **Configuration**, either deploy an OpenTelemetry Collector
into one of the default locations or extend the probe as described in
[Extend the OpenTelemetry Collector Probe](#extend-the-opentelemetry-collector-probe). Refer to
[Configure the OpenTelemetry Collector addon](#configure-the-opentelemetry-collector-addon) for the Palette VMO pack
addon path.

:::info

If the probe cannot reach the Kubernetes API server for any check because of a network error, RBAC denial, or 5xx
response, VMO leaves the **Metrics and Logs** page visible rather than hiding a working feature. Confirm the
OpenTelemetry Collector is present before relying on page visibility as a signal.

:::

### Extend the OpenTelemetry Collector Probe

If your OpenTelemetry Collector runs under a non-default namespace or workload name, such as one deployed by a custom
Helm chart or a service mesh sidecar, extend the probe by setting two environment variables on the `vmo-manager`
container through the VMO pack values. VMO appends the extras to the defaults, so existing installs keep working with no
configuration change.

1. Open your VMO cluster profile in Palette and select the **Virtual Machine Orchestrator** pack.

2. Under `charts.vmo-manager.deployment.extraEnv`, add the two environment variables `VMO_OTEL_EXTRA_NAMESPACES` and
   `VMO_OTEL_EXTRA_NAMES` with your extra namespaces and workload names. Use these exact variable names, which VMO reads
   literally; only the values in the following example are placeholders. Both fields take comma-separated values and
   trim whitespace.

   ```yaml title="Example YAML values"
   charts:
     vmo-manager:
       deployment:
         extraEnv:
           - name: VMO_OTEL_EXTRA_NAMESPACES
             value: "my-observability,mesh-obs"
           - name: VMO_OTEL_EXTRA_NAMES
             value: "my-otel-agent"
   ```

3. Save the profile and apply the update. Palette re-renders the Deployment, the `vmo-manager` pods restart with the new
   environment, and the next capability probe picks up the extras within 60 seconds. The **Metrics and Logs** page
   appears in the sidebar once a matching workload is found.

The extension is additive. Removing the environment variables reverts the probe to the built-in defaults on the next pod
restart.

## How Forwarding Works

### Metrics Path

The `vmo-node-agent` DaemonSet scrapes each node and ships OpenTelemetry Protocol (OTLP) metrics to the per-node
OpenTelemetry Collector. The Collector forwards the metrics to Victoria Metrics for the built-in dashboards and to the
`vmo-manager` service's OTLP receiver. Inside `vmo-manager`, a ring buffer receives every point. When the **Metrics
Forwarding** toggle is enabled and both **Forwarding URL** and **Forwarding Token** are set, the ring buffer POSTs each
point to Splunk HEC under `sourcetype=vmo:metric`.

The toggle plus the URL and token together form the network gate. If any of them is unset, `vmo-manager` sends nothing.

### Logs Path

`vmo-manager` writes structured log lines to container standard output, which Kubernetes stores under `/var/log/pods` on
the node. The OpenTelemetry Collector's `filelog/vmo` receiver tails those files through a `hostPath` mount and hands
events to the `splunk_hec/vmo-logs` exporter, which POSTs them to Splunk HEC under `sourcetype=vmo:log`. The exporter
carries its own HEC token, configured in the VMO pack values.

The **Log Forwarding** toggle is independent of this pipeline. Flipping it emits the `logging.forwarding.toggled` audit
event, which is the compliance record that an administrator has acknowledged central log collection. The toggle does not
start or stop delivery, and the OpenTelemetry Collector keeps shipping logs as long as its exporter is configured.

## Prerequisites

- The Palette VMO pack **OpenTelemetry Collector** addon deployed in the appliance cluster. The addon carries the OTLP
  receiver, the `filelog/vmo` log receiver, the `otlphttp/vmo` metrics exporter that feeds `vmo-manager`, and the
  `splunk_hec/vmo-logs` exporter that delivers logs to Splunk.

- A Splunk HTTP Event Collector endpoint and token. The metrics client in `vmo-manager` and the OpenTelemetry
  Collector's `splunk_hec/vmo-logs` exporter each hold their own token. You can use the same token for both, or two
  separate tokens scoped to the `sourcetype=vmo:metric` and `sourcetype=vmo:log` events.

- Network connectivity from the `vmo-manager` StatefulSet to your Splunk HEC endpoint for the metrics push, and from the
  OpenTelemetry Collector DaemonSet to the same or a different Splunk HEC endpoint for the log push.

- A VMO account with the **Platform Admin** role, which holds the `vmo:config:read` and `vmo:config:write` permissions.

- (Optional) Access to the appliance cluster with [kubectl](https://kubernetes.io/docs/tasks/tools/) to verify delivery.

## Configure the OpenTelemetry Collector addon

Set the Splunk HEC endpoint and token on the OpenTelemetry Collector addon in your VMO cluster profile. The addon uses
these values to configure the `splunk_hec/vmo-logs` exporter for the logs path.

1. Open your VMO cluster profile in Palette and select the **OpenTelemetry Collector** pack.

2. Set the following values in the pack YAML.

   ```yaml
   spectro:
     pack:
       opentelemetry:
         splunkHECEndpoint: "https://<your-splunk-hec-host>:8088"
         splunkHECToken: "<your-splunk-hec-token>"
   ```

   Replace `<your-splunk-hec-host>` with your Splunk HEC endpoint and `<your-splunk-hec-token>` with your Splunk HEC
   token.

3. Save the profile and apply the update to the cluster.

The metrics push in `vmo-manager` does not read these pack values. The metrics side is configured entirely on the
**Metrics** section of the appliance UI. Refer to [Configure Metrics Forwarding](#configure-metrics-forwarding) for
those steps.

## Configure Metrics Forwarding

1. Sign in to VMO.

2. From the left main menu, select **Settings** > **Configuration** > **Metrics and Logs**.

3. In the **Metrics** section, select the edit icon next to **Forwarding URL** and enter your Splunk HEC endpoint, such
   as `https://splunk.example.com:8088`. Save.

4. Select the edit icon next to **Forwarding Token** and enter your Splunk HEC token. Save.

   The token is stored as a masked field.

5. Adjust **TLS Verify** if your Splunk HEC certificate is trusted by the appliance. Leave the value at `true` in
   production. Set the value to `false` only for development or demonstration environments where the certificate cannot
   be verified.

6. Flip the **Metrics Forwarding** toggle to **Enabled**.

   VMO writes a `monitoring.splunk_hec.toggled` audit event that captures the previous value, the new value, and your
   identity. Metric points start flowing to Splunk under `sourcetype=vmo:metric` on the next scrape cycle.

## Configure Log Forwarding

1. Confirm the OpenTelemetry Collector addon carries the correct Splunk HEC endpoint and token. Refer to
   [Configure the OpenTelemetry Collector addon](#configure-the-opentelemetry-collector-addon) for the pack values. The
   addon delivers the logs; VMO never sits on the log wire path.

2. Sign in to VMO.

3. From the left main menu, select **Settings** > **Configuration** > **Metrics and Logs**.

4. In the **Logs** section, select the edit icon next to **Log Format** and select `json`. Save.

   JSON encoding gives Splunk discrete fields for the timestamp, level, message, and any structured context, instead of
   one free-form string that Splunk has to parse at search time. VMO swaps the log encoder immediately without a pod
   restart.

5. From the **Forwarding Target** dropdown, select the option that matches your destination.

   <!-- vale Vale.Spelling = NO -->

   | **Option**   | **Use for**                                                                                           |
   | ------------ | ----------------------------------------------------------------------------------------------------- |
   | `splunk-hec` | A Splunk HTTP Event Collector endpoint (the Splunk product).                                          |
   | `general`    | Any other HEC-format-compatible sink over HTTPS, such as Cribl HEC input or an HEC-emulating gateway. |

   <!-- vale Vale.Spelling = YES -->

   Both options require the destination to speak the Splunk HEC protocol over HTTPS. Sinks that use a different wire
   protocol, such as native Elastic, Loki, or Syslog, are not compatible with either option and need a different
   delivery path.

   Enter your delivery address in **Forwarding URL**. The URL is informational. VMO stores it so administrators can read
   the central log delivery arrangement from the appliance without tracing it through cluster manifests, but VMO does
   not enforce or validate the value.

   :::warning

   Do not enter a token, password, or other credential in **Forwarding URL**. Every administrator who can read the
   logging configuration can read this value.

   :::

6. Flip the **Log Forwarding** toggle to **Enabled**.

   VMO writes a `logging.forwarding.toggled` audit event that captures the previous value, the new value, and your
   identity. The toggle does not start or stop delivery. The OpenTelemetry Collector's `splunk_hec/vmo-logs` exporter
   ships log lines to Splunk under `sourcetype=vmo:log` whenever the addon is configured, regardless of this toggle
   state.

## Settings Reference

The **Metrics and Logs** page exposes the following settings. Configuration keys reflect the appliance's persistent
storage in the `VMOConfig` custom resource.

### Metrics Section

| **Setting**            | **Configuration Key**                        | **Default** | **Sensitive** | **Description**                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Metrics Forwarding** | `monitoring.splunk_hec_enabled`              | `false`     | No            | Real network gate. When enabled with URL and token set, `vmo-manager` POSTs each metric point to Splunk HEC under `sourcetype=vmo:metric`. Emits `monitoring.splunk_hec.toggled` on every change.  |
| **Forwarding URL**     | `monitoring.splunk_hec_url`                  | Empty       | No            | Splunk HTTP Event Collector base URL. An empty value disables the metrics push regardless of the toggle state.                                                                                     |
| **Forwarding Token**   | `monitoring.splunk_hec_token`                | Empty       | **Yes**       | Splunk HEC token used by the metrics client in `vmo-manager`. Masked in GET responses; the UI renders `(set)` in place of the value.                                                               |
| **TLS Verify**         | `monitoring.splunk_hec_insecure_skip_verify` | `false`     | No            | Controls TLS certificate verification for the metrics push. `false` (default) verifies the Splunk HEC certificate. `true` skips verification and is intended for development or demo environments. |

### Logs Section

<!-- vale Vale.Spelling = NO -->

| **Setting**           | **Configuration Key**         | **Default** | **Description**                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Log Format**        | `logging.format`              | `text`      | Encoding of the appliance logs. Accepts `text` and `json`. Use `json` when Splunk indexes the logs. Applied immediately without a pod restart.                                                                                                                                                                                               |
| **Log Forwarding**    | `logging.forwarding_enabled`  | `false`     | Compliance signal that records central log collection. Emits `logging.forwarding.toggled` on every change. Does not start or stop delivery; the OpenTelemetry Collector delivers logs.                                                                                                                                                       |
| **Forwarding Target** | `logging.forwarding_target`   | `(not set)` | Bounded dropdown identifying the destination category. Accepts `splunk-hec` for a Splunk HEC endpoint, or `general` for any other HEC-format-compatible sink over HTTPS (Cribl HEC input, HEC-emulating gateways). Both require the destination to speak the Splunk HEC protocol. Informational. VMO does not route logs based on the value. |
| **Forwarding URL**    | `logging.forwarding_endpoint` | Empty       | Informational address that your OpenTelemetry Collector delivers logs to. VMO does not enforce or interpret the value.                                                                                                                                                                                                                       |

<!-- vale Vale.Spelling = YES -->

### Value Source Badges

Each row on the page carries a badge that identifies where the current value comes from.

| **Badge**    | **Meaning**                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Default**  | The value ships with the appliance. No one has changed it.                                                                        |
| **Env**      | An environment variable in the appliance deployment sets the value. A lock icon accompanies the badge and editing is unavailable. |
| **Override** | An administrator changed the value in the UI. VMO stores the value in the appliance configuration.                                |

An environment variable takes precedence over a value that you set in the UI, so a setting with the **Env** badge is
read-only until the deployment stops supplying the variable. To discard an override and return a setting to its shipped
value, select the revert icon on its row.

## Audit Events

Both toggles emit first-class audit events into `vmoauditevents.virtualization.spectrocloud.com`. The same events appear
in the appliance UI under **System** > **Audit**.

| **Action**                      | **Fires When**                                | **Payload**                                                             | **Consumed By**           |
| ------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- | ------------------------- |
| `logging.forwarding.toggled`    | `logging.forwarding_enabled` changes value    | Actor identity, previous value, new value, standard audit event fields. | Compliance and PCI review |
| `monitoring.splunk_hec.toggled` | `monitoring.splunk_hec_enabled` changes value | Actor identity, previous value, new value, standard audit event fields. | Compliance and PCI review |

No-op writes that keep the same value are suppressed. Only real transitions produce an event.

## Verify Delivery

Before verifying delivery, set the `KUBECONFIG` environment variable to point at the appliance cluster's kubeconfig
file.

```shell
export KUBECONFIG=<path-to-appliance-kubeconfig>
```

1. Confirm that VMO emits JSON after you change **Log Format**.

   ```shell
   kubectl logs --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager --tail=5
   ```

2. Confirm that Splunk receives the metrics push. In your Splunk search head, run the following query.

   ```spl
   sourcetype=vmo:metric | head 10
   ```

   Recent metric points from the appliance appear within a scrape interval of the toggle flip.

3. Confirm that Splunk receives the log push. In your Splunk search head, run the following query.

   ```spl
   sourcetype=vmo:log | head 10
   ```

   Recent log lines from the `vmo-manager` pods appear within a few seconds of the toggle flip.

4. Confirm that VMO recorded the two audit events.

   ```shell
   kubectl get vmoauditevents.virtualization.spectrocloud.com --namespace vm-dashboard --output json \
     | jq '.items[] | select(.spec.action=="monitoring.splunk_hec.toggled" or .spec.action=="logging.forwarding.toggled")'
   ```

   The same events appear in the VMO UI under **System** > **Audit**. Filter the **Action** column for
   `monitoring.splunk_hec.toggled` or `logging.forwarding.toggled`.

## Considerations

| **Behavior**                     | **What to know**                                                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metrics forwarding airgap safety | The toggle is the network gate. If the toggle is off, or the URL or token is empty, `vmo-manager` sends zero bytes to Splunk for metrics.                                                                                                                                          |
| Log forwarding delivery          | The OpenTelemetry Collector's `splunk_hec/vmo-logs` exporter delivers logs whenever its addon values name a Splunk HEC endpoint and token, regardless of the **Log Forwarding** toggle state. The toggle is the compliance acknowledgment, not the delivery switch.                |
| Independent Forwarding URLs      | Metrics and Logs each carry their own Forwarding URL. Point them at the same Splunk instance to keep the operational picture in one place, or at different Splunk endpoints if your organization separates metrics and log indexers.                                               |
| Multi-replica log format changes | A **Log Format** change made in the UI applies to the replica that handled the request. The remaining replicas keep their previous encoding until they restart. To apply an encoding change across every replica at once, restart the `vmo-manager` StatefulSet after you save it. |
| Metrics URL scheme               | `monitoring.splunk_hec_url` supports HTTP or HTTPS. Use HTTPS in production. Use HTTP only for testing against a local Splunk instance that does not expose TLS.                                                                                                                   |

## Palette Audit Trail Forwarding

The **Metrics and Logs** page covers the appliance. If your organization also runs Palette, Palette forwards its own
control plane audit events through a separate path that you configure in Palette under **Tenant Settings** > **Audit
Trails**. That path supports Splunk HEC as a destination and is independent of the appliance's metrics push and
OpenTelemetry Collector log delivery. Refer to [Audit Logs](../../audit-logs/audit-logs.md) for those steps.

## Next Steps

Review the appliance [Audit Trail](./system/audit.md) to confirm which actions VMO records, and which of those records
your central logging system now retains beyond the 30-day window that the appliance enforces.
