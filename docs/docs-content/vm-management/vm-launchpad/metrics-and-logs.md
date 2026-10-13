---
sidebar_label: "Metrics and Logs"
title: "Metrics and Logs"
description:
  "Forward PaletteAI VM Launchpad appliance metrics and logs to Splunk HTTP Event Collector or an OpenTelemetry Protocol
  (OTLP) backend from one Settings page."
icon: " "
hide_table_of_contents: false
sidebar_position: 7
tags: ["vmo", "vm launchpad", "logging", "metrics", "splunk", "opentelemetry", "configuration"]
---

The PaletteAI VM Launchpad appliance forwards its metrics and logs from the **Metrics and Logs** page under **Settings**
and **Configuration**. The **Metrics** section sends appliance metrics, and the **Logs** section sends appliance logs.
Each section can send to a Splunk HTTP Event Collector (HEC) endpoint or to any backend that accepts the OpenTelemetry
Protocol (OTLP) over HTTP. VMO detects the protocol from the **Forwarding URL**, so you do not select it. Both toggles
emit audit events. Metrics changes apply without a pod restart.

The two sections share their settings by default:

- If you leave the **Logs** settings empty, logs go to the metrics receiver with the metrics token and CA certificate.
  Each empty log setting falls back to its metrics value, except **Skip TLS Verification**.

- To send logs to a different receiver or tenant, set the log **Forwarding URL**, **Forwarding Token**, or **CA
  Certificate**.

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
[Extend the OpenTelemetry Collector Probe](#extend-the-opentelemetry-collector-probe).

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

The `vmo-node-agent` DaemonSet scrapes each node and ships OTLP metrics to the per-node OpenTelemetry Collector. The
Collector forwards the metrics to Victoria Metrics for the built-in dashboards and to the `vmo-manager` service's OTLP
receiver. Inside `vmo-manager`, a ring buffer receives every point. When the **Metrics Forwarding** toggle is enabled
and **Forwarding URL** is set, the ring buffer POSTs each point to the receiver. `vmo-manager` detects the protocol from
the **Forwarding URL** path:

- A URL that contains `/services/collector`, or a URL with no path, is treated as Splunk HEC. `vmo-manager` posts the
  points under `sourcetype=vmo:metric`.

- A URL with any other path, such as `/v1/metrics`, is treated as OTLP over HTTP.

Forwarding is additive. The local ring buffer and any Victoria Metrics target keep receiving points, and a failed push
to the receiver does not affect them.

### Logs Path

`vmo-manager` writes structured log lines to container standard output, which Kubernetes stores under `/var/log/pods` on
the node. The OpenTelemetry Collector's `filelog/vmo` receiver tails those files through a `hostPath` mount.

VMO configures the Collector's log exporters from the **Logs** settings. It writes the resolved URL, token, CA
certificate, and **Skip TLS Verification** value into the `splunk-hec-credentials` Secret in the `kube-system`
namespace, and then restarts the Collector DaemonSet. VMO checks the settings about every 60 seconds.

VMO selects the log exporter from the URL:

- A Splunk HEC URL routes logs through the `splunk_hec/vmo-logs` exporter under `sourcetype=vmo:log`.

- An OTLP URL routes logs through the `otlphttp/vmo-logs` exporter. If the URL ends in `/v1/metrics`, VMO replaces that
  suffix with `/v1/logs`. If the URL has no signal suffix, VMO appends `/v1/logs`.

Logs leave the appliance only when a URL and a token are set, either in the **Logs** section or through the metrics
values, and one of the following is also true:

- **Metrics Forwarding** is enabled. Any log setting that you leave empty uses its metrics value.

- **Log Forwarding** is enabled and the log **Forwarding URL** is set.

Enabling **Log Forwarding** without setting the log **Forwarding URL** does not send logs.

## Prerequisites

- The Palette VMO pack **OpenTelemetry Collector** addon deployed in the appliance cluster. The addon carries the OTLP
  receiver, the `filelog/vmo` log receiver, the `otlphttp/vmo` metrics exporter that feeds `vmo-manager`, and the log
  exporters that VMO configures.

- A Splunk HEC endpoint and token, or an endpoint that accepts OTLP over HTTP and its credential, to receive the metrics
  and logs.

- Network connectivity from the `vmo-manager` StatefulSet to the metrics receiver, and from the OpenTelemetry Collector
  DaemonSet to the logs receiver.

- A VMO account with the **Platform Admin** role, which holds the `vmo:config:read` and `vmo:config:write` permissions.

- (Optional) Access to the appliance cluster with [kubectl](https://kubernetes.io/docs/tasks/tools/) to verify delivery.

## Configure Metrics Forwarding

The following steps configure forwarding to Splunk HEC. To forward to an OpenTelemetry backend instead, refer to
[Forward to an OpenTelemetry Backend](#forward-to-an-opentelemetry-backend).

1. Sign in to VMO.

2. From the left main menu, select **Settings** > **Configuration** > **Metrics and Logs**.

3. In the **Metrics** section, select **Add** next to **Forwarding URL**, enter your Splunk HEC endpoint, such as
   `https://splunk.example.com:8088`, and select the save icon.

4. Select **Add** next to **Forwarding Token**, enter your Splunk HEC token, and select the save icon.

   The token is stored as a masked field.

5. (Optional) If the Splunk HEC endpoint presents a certificate that the appliance's system trust store does not already
   trust, such as one issued by a private or internal CA, select **Add** next to **CA Certificate**, paste the
   PEM-encoded CA-signing certificate, and select the save icon. Leave it empty to verify against the system trust
   store.

6. Leave **Skip TLS Verification** off. When it is on, the appliance accepts the receiver's certificate without
   verifying it. Turn it on only to test against a receiver whose certificate you cannot verify.

7. Flip the **Metrics Forwarding** toggle to **Enabled**.

   VMO writes a `monitoring.splunk_hec.toggled` audit event that captures the previous value, the new value, and your
   identity. Metric points start flowing to Splunk under `sourcetype=vmo:metric` on the next scrape cycle.

:::warning

Enabling **Metrics Forwarding** also starts log delivery. Unless you configure the **Logs** section separately, the
appliance logs go to the same receiver with the same token. Refer to [Logs Path](#logs-path).

:::

### Forward to an OpenTelemetry Backend

The **Metrics** section forwards to any backend that accepts OTLP over HTTP, such as Datadog, Grafana Cloud, New Relic,
or a generic OpenTelemetry Collector. It uses the same **Forwarding URL**, **Forwarding Token**, and **Metrics
Forwarding** controls. VMO uses OTLP automatically when the **Forwarding URL** includes a path other than
`/services/collector`.

1. Sign in to VMO.

2. From the left main menu, select **Settings** > **Configuration** > **Metrics and Logs**.

3. In the **Metrics** section, select **Add** next to **Forwarding URL**, enter the receiver's OTLP metrics endpoint
   including the explicit path, for example `https://<receiver-host>/v1/metrics`, and select the save icon.

   Replace `<receiver-host>` with the host name of your OTLP receiver.

   :::warning

   A URL with no path, such as `https://otlp.example.com`, is treated as Splunk HEC and posted to
   `/services/collector/event`, which an OTLP receiver rejects.

   :::

4. Select **Add** next to **Forwarding Token**, enter the receiver's credential, and select the save icon. The field
   accepts two formats:

   - A plain token, which VMO sends as an `Authorization: Bearer <token>` header. Use this for a receiver that expects a
     bearer token.

   - One or more comma-separated `Key=Value` pairs, which VMO sends as literal HTTP headers. Use this for a receiver
     that needs a specific header, such as Datadog (`DD-API-KEY=<datadog-api-key>`), Grafana Cloud
     (`Authorization=Basic <credentials>`), or New Relic (`api-key=<license-key>`).

5. (Optional) If the receiver presents a TLS certificate issued by a private or internal CA, select **Add** next to **CA
   Certificate**, paste the PEM-encoded CA-signing certificate, and select the save icon. Public receivers such as
   Datadog, Grafana Cloud, and New Relic use publicly trusted certificates and do not need this.

6. Leave **Skip TLS Verification** off. When it is on, the appliance accepts the receiver's certificate without
   verifying it. Turn it on only to test against a receiver whose certificate you cannot verify.

7. Flip the **Metrics Forwarding** toggle to **Enabled**.

#### Forward Metrics to Datadog

The following steps forward metrics to Datadog.

1. Select **Add** next to **Forwarding URL**, enter `https://api.datadoghq.com/api/v2/otlp/v1/metrics`, and select the
   save icon. For a Datadog site other than US1, use your site's API host. Refer to the
   [Datadog OTLP documentation](https://docs.datadoghq.com/opentelemetry/) for the exact host.

2. Select **Add** next to **Forwarding Token**, enter `DD-API-KEY=<datadog-api-key>`, and select the save icon. VMO
   sends it as a literal `DD-API-KEY` header.

   Replace `<datadog-api-key>` with your Datadog API key.

3. Flip the **Metrics Forwarding** toggle to **Enabled**.

The metrics appear in Datadog on the next scrape cycle, tagged with `service.name:vmo-manager` and `k8s.cluster.name`.

Log forwarding to Datadog or Grafana Cloud is not supported, because log forwarding sends its credential only as a plain
bearer token. To forward logs, point the **Logs** section at a receiver that accepts a plain bearer token or a Splunk
HEC token. Refer to [Configure Log Forwarding](#configure-log-forwarding).

#### OTLP Receiver Formats

The following table lists the metrics **Forwarding URL** and **Forwarding Token** formats for common OTLP receivers.

| **Receiver**            | **Forwarding URL**                                                                       | **Forwarding Token**                    |
| ----------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| Datadog                 | `https://api.datadoghq.com/api/v2/otlp/v1/metrics` (US1; other sites use their own host) | `DD-API-KEY=<datadog-api-key>`          |
| Grafana Cloud           | `https://otlp-gateway-<region>.grafana.net/otlp/v1/metrics`                              | `Authorization=Basic <credentials>`     |
| New Relic               | US `https://otlp.nr-data.net/v1/metrics`, EU `https://otlp.eu01.nr-data.net/v1/metrics`  | `api-key=<license-key>`                 |
| OpenTelemetry Collector | `https://<receiver-host>/v1/metrics`                                                     | Plain token or `Key=Value` header pairs |

Replace `<datadog-api-key>` with your Datadog API key, `<region>` with your Grafana Cloud region, `<license-key>` with
your New Relic license key, and `<receiver-host>` with the host name of your OpenTelemetry Collector.

Grafana Cloud rejects a plain token sent as a bearer token. For Grafana Cloud, replace `<credentials>` with the Base64
encoding of your Grafana Cloud instance ID and API token, joined by a colon. Use the following command to generate the
value.

```shell
echo -n '<instance-id>:<api-token>' | base64
```

Replace `<instance-id>` with your Grafana Cloud instance ID and `<api-token>` with your Grafana Cloud API token.

To label the forwarded metrics with a recognizable cluster name, set the `clusterName` pack value
(`charts.virtual-machine-orchestrator.vmo-manager.clusterName`). VMO emits it as the `k8s.cluster.name` resource
attribute on each OTLP payload. If you leave the value empty, VMO reads the name from the cluster's `kubeadm-config`
ConfigMap. If that lookup also returns nothing, VMO uses `local`, which is the same on every cluster in a multi-cluster
fleet.

:::info

VMO emits all metrics as OTLP Gauge values, which represent an instantaneous observation. On the receiver, use a
rate-over-gauge query rather than a rate-over-counter query.

:::

## Configure Log Forwarding

By default, the **Logs** section sends appliance logs to the metrics receiver. Configure it to send logs to a different
receiver, or to change the log format.

1. Sign in to VMO.

2. From the left main menu, select **Settings** > **Configuration** > **Metrics and Logs**.

3. In the **Logs** section, select the edit icon next to **Log Format** and select `json`. Save.

   JSON encoding gives the receiver discrete fields for the timestamp, level, message, and any structured context,
   instead of one free-form string that the receiver has to parse at search time. VMO swaps the log encoder immediately
   without a pod restart.

4. Select **Add** next to the log **Forwarding URL**, enter the receiver's URL, and select the save icon. For an OTLP
   receiver, include the `/v1/logs` path. For Splunk HEC, a base URL such as `https://splunk.example.com:8088` works.

   The **Log Forwarding** toggle sends logs only when the log **Forwarding URL** is set. To send logs to the metrics
   receiver while **Metrics Forwarding** is off, enter the metrics URL.

   :::warning

   Do not enter a token, password, or other credential in **Forwarding URL**. Every administrator who can read the
   logging configuration can read this value. Use **Forwarding Token** for the credential.

   :::

5. (Optional) If the log receiver needs a different credential from the metrics receiver, select **Add** next to the log
   **Forwarding Token**, enter the credential, and select the save icon. The log side accepts a bearer token for an OTLP
   receiver, or a Splunk HEC token for a Splunk HEC URL.

6. (Optional) If the log receiver presents a certificate issued by a private or internal CA, select **Add** next to the
   log **CA Certificate**, paste the PEM-encoded CA-signing certificate, and select the save icon. Leave it empty to use
   the metrics **CA Certificate**.

7. Leave the log **Skip TLS Verification** off. Unlike the other log settings, it does not use the metrics value, so you
   set it separately for each section. Turn it on only to test against a receiver whose certificate you cannot verify.

8. Flip the **Log Forwarding** toggle to **Enabled**.

   VMO writes a `logging.forwarding.toggled` audit event that captures the previous value, the new value, and your
   identity. Log lines start flowing to the receiver after VMO updates the OpenTelemetry Collector, which takes up to a
   few minutes.

## Settings Reference

The **Metrics and Logs** page exposes the following settings. Configuration keys reflect the appliance's persistent
storage in the `VMOConfig` custom resource.

### Metrics Section

| **Setting**               | **Configuration Key**                        | **Default** | **Sensitive** | **Description**                                                                                                                                                                                                       |
| ------------------------- | -------------------------------------------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Metrics Forwarding**    | `monitoring.splunk_hec_enabled`              | `false`     | No            | Network gate. When enabled with a URL set, `vmo-manager` POSTs each metric point to the receiver. Also starts log delivery, and each empty log setting uses its metrics value. Emits `monitoring.splunk_hec.toggled`. |
| **Forwarding URL**        | `monitoring.splunk_hec_url`                  | Empty       | No            | Splunk HEC or OTLP receiver URL. The path decides the protocol. An empty value disables the metrics push regardless of the toggle state.                                                                              |
| **Forwarding Token**      | `monitoring.splunk_hec_token`                | Empty       | **Yes**       | Splunk HEC token, or the OTLP credential as a plain bearer token or `Key=Value` header pairs. Masked in GET responses; the UI renders `(set)` in place of the value.                                                  |
| **CA Certificate**        | `monitoring.splunk_hec_ca_cert`              | Empty       | No            | Optional PEM CA-signing certificate used to verify the receiver's TLS certificate. An empty value verifies against the container's system trust store.                                                                |
| **Skip TLS Verification** | `monitoring.splunk_hec_insecure_skip_verify` | `false`     | No            | When enabled, the metrics push accepts the receiver's TLS certificate without verification. Leave it off in production.                                                                                               |

### Logs Section

| **Setting**               | **Configuration Key**                     | **Default** | **Description**                                                                                                                                      |
| ------------------------- | ----------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Log Format**            | `logging.format`                          | `text`      | Encoding of the appliance logs. Accepts `text` and `json`. Applied immediately without a pod restart.                                                |
| **Log Forwarding**        | `logging.forwarding_enabled`              | `false`     | Starts log delivery when the log **Forwarding URL** is also set. On its own, does not send logs. Emits `logging.forwarding.toggled` on every change. |
| **Forwarding URL**        | `logging.forwarding_endpoint`             | Empty       | Splunk HEC or OTLP receiver URL for logs. The path decides the protocol. An empty value uses the metrics **Forwarding URL**.                         |
| **Forwarding Token**      | `logging.forwarding_token`                | Empty       | Bearer token for an OTLP receiver, or a Splunk HEC token. An empty value uses the metrics **Forwarding Token**.                                      |
| **CA Certificate**        | `logging.forwarding_ca_cert`              | Empty       | Optional PEM CA-signing certificate for the log receiver. An empty value uses the metrics **CA Certificate**.                                        |
| **Skip TLS Verification** | `logging.forwarding_insecure_skip_verify` | `false`     | When enabled, log delivery accepts the receiver's TLS certificate without verification. Does not use the metrics value. Leave it off in production.  |

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

Replace `<path-to-appliance-kubeconfig>` with the path to the appliance cluster's kubeconfig file.

1. Confirm that VMO emits JSON after you change **Log Format**.

   ```shell
   kubectl logs --namespace vm-dashboard --selector app.kubernetes.io/name=vmo-manager --tail=5
   ```

2. Confirm that the receiver gets the metrics push.

   - For Splunk HEC, run the following query in your Splunk search head.

     ```spl
     sourcetype=vmo:metric | head 10
     ```

   - For an OTLP receiver, search for metrics with the `service.name` resource attribute set to `vmo-manager`.

   Recent metric points from the appliance appear within a scrape interval of the toggle flip.

3. Confirm that the receiver gets the log push.

   - For Splunk HEC, run the following query in your Splunk search head.

     ```spl
     sourcetype=vmo:log | head 10
     ```

   - For an OTLP receiver, search for recent log records from the `vmo-manager` pods.

   Recent log lines appear after VMO updates the OpenTelemetry Collector, which takes up to a few minutes.

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
| Metrics forwarding airgap safety | The toggle is the network gate. If the toggle is off, or the URL is empty, `vmo-manager` sends zero bytes to the receiver for metrics.                                                                                                                                             |
| Rejected URLs                    | VMO rejects receiver URLs that point at `localhost`, `127.0.0.1`, `::1`, `0.0.0.0`, or a link-local or cloud metadata address, such as `169.254.169.254`. VMO also rejects URLs with a scheme other than HTTP or HTTPS.                                                            |
| Removing a metrics setting       | A new metrics value applies immediately. Removing a value can take up to 15 seconds, during which metrics forwarding to the previous receiver can continue. To stop forwarding metrics immediately, turn off **Metrics Forwarding** instead.                                       |
| Multi-replica log format changes | A **Log Format** change made in the UI applies to the replica that handled the request. The remaining replicas keep their previous encoding until they restart. To apply an encoding change across every replica at once, restart the `vmo-manager` StatefulSet after you save it. |
| Metrics URL scheme               | `monitoring.splunk_hec_url` supports HTTP or HTTPS. Use HTTPS in production. Use HTTP only for testing against a receiver that does not expose TLS.                                                                                                                                |

## Palette Audit Trail Forwarding

The **Metrics and Logs** page covers the appliance. If your organization also runs Palette, Palette forwards its own
control plane audit events through a separate path that you configure in Palette under **Tenant Settings** > **Audit
Trails**. That path supports Splunk HEC as a destination and is independent of the appliance's metrics and log
forwarding. Refer to [Audit Logs](../../audit-logs/audit-logs.md) for those steps.

## Next Steps

Review the appliance [Audit Trail](./system/audit.md) to confirm which actions VMO records, and which of those records
your central logging system now retains beyond the 30-day window that the appliance enforces.
