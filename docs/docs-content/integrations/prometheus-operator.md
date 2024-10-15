---
sidebar_label: "Prometheus Operator"
title: "Prometheus Operator"
description: "Prometheus Operator Monitoring pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["monitoring", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image.webp"
tags: ["packs", "prometheus-operator", "monitoring"]
---

:::info

We recommend you use version v44.3.x or greater moving forward for a simplified and improved user experience when
creating a monitoring stack for your architecture. Starting with version v44.3.x the remote monitoring feature is
supported. Check out the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) to learn
more about the remote monitoring feature.

:::

## Versions Supported

<Tabs queryString="parent">
<TabItem label="51.0.x" value="51.0.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, you must remove the `grafana-piechart-panel` plugin. This
plugin is not included by default and requires an internet connection to download. The monitoring stack doesn't require
this plugin to function properly.

```yaml {5}
charts:
  kube-prometheus-stack:
    grafana:
      plugins:
        - grafana-piechart-panel
```

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, then by default a service with a load balancer will be created that exposes
port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

By default, Thanos Ruler event data is saved in object storage specified for Thanos, but you can specify a different
object storage for event data. Refer to the
[Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler) resource to learn more.

## Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation
point for all Kubernetes metrics. Enabling this feature will expose port 9090 of the _prometheus-operator-prometheus_
service. Use the generated service URL to provide other Kubernetes clusters with the installed
[Prometheus Agent](prometheus-agent.md) so that cluster metrics can be forwarded to the Prometheus server.

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can
change any configuration related to remote monitoring to fine-tune settings for your environment.

Refer to the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) resource to learn more
about configuration options.

To get started with remote monitoring, check out the
[Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) guide.

## Palette Resources Monitoring

<!-- prettier-ignore-start -->
You can access internal Palette metrics in Grafana by adding the <VersionedLink text="Spectro Cluster Metrics" url="/integrations/packs/?pack=spectro-cluster-metrics"/> pack to all your client clusters. Refer to the [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md) guide to learn more.
<!-- prettier-ignore-end -->

## Persistent Storage

You can configure the Prometheus Operator to use persistent storage. To enable persistent storage add the following code
snippet to the `kube-prometheus-stack.prometheus.prometheusSpec.storageSpec` configuration block in the pack's YAML
configuration file. The code snippet below creates a Persistent Volume Claim (PVC) for the Prometheus Operator.

```yaml
kube-prometheus-stack:
  prometheus:
    prometheusSpec:
      storageSpec:
        volumeClaimTemplate:
          metadata:
            name: prom-operator-pvc
          spec:
            storageClassName: spectro-storage-class
            accessModes: ["ReadWriteOnce"]
            resources:
              requests:
                storage: 5Gi
```

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/)

- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- Service monitors to scrape internal Kubernetes components

</TabItem>

<TabItem label="46.4.x" value="46.4.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, you must remove the `grafana-piechart-panel` plugin. This
plugin is not included by default and requires an internet connection to download. The monitoring stack doesn't require
this plugin to function properly.

```yaml {5}
charts:
  kube-prometheus-stack:
    grafana:
      plugins:
        - grafana-piechart-panel
```

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, then by default a service with a load balancer will be created that exposes
port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

By default, Thanos Ruler event data is saved in object storage specified for Thanos, but you can specify a different
object storage for event data. Refer to the
[Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler) resource to learn more.

## Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation
point for all Kubernetes metrics. Enabling this feature will expose port 9090 of the _prometheus-operator-prometheus_
service. Use the generated service URL to provide other Kubernetes clusters with the installed
[Prometheus Agent](prometheus-agent.md) so that cluster metrics can be forwarded to the Prometheus server.

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can
change any configuration related to remote monitoring to fine-tune settings for your environment.

Refer to the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) resource to learn more
about configuration options.

To get started with remote monitoring, check out the
[Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) guide.

## Palette Resources Monitoring

<!-- prettier-ignore-start -->
You can access internal Palette metrics in Grafana by adding the <VersionedLink text="Spectro Cluster Metrics" url="/integrations/packs/?pack=spectro-cluster-metrics"/> pack to all your client clusters. Refer to the [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md) guide to learn more.
<!-- prettier-ignore-end -->

## Persistent Storage

You can configure the Prometheus Operator to use persistent storage. To enable persistent storage, add the following
code snippet to the `kube-prometheus-stack.prometheus.prometheusSpec.storageSpec` configuration block in the pack's YAML
configuration file. The code snippet below creates a Persistent Volume Claim (PVC) for the Prometheus Operator.

```yaml
kube-prometheus-stack:
  prometheus:
    prometheusSpec:
      storageSpec:
        volumeClaimTemplate:
          metadata:
            name: prom-operator-pvc
          spec:
            storageClassName: spectro-storage-class
            accessModes: ["ReadWriteOnce"]
            resources:
              requests:
                storage: 5Gi
```

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/)

- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- Service monitors to scrape internal Kubernetes components

</TabItem>

<TabItem label="45.25.x" value="45.25.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, you must remove the `grafana-piechart-panel` plugin. This
plugin is not included by default and requires an internet connection to download. The monitoring stack doesn't require
this plugin to function properly.

```yaml {5}
charts:
  kube-prometheus-stack:
    grafana:
      plugins:
        - grafana-piechart-panel
```

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, then by default a service with a load balancer will be created that exposes
port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

By default, Thanos Ruler event data is saved in object storage specified for Thanos, but you can specify a different
object storage for event data. Refer to the
[Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler) resource to learn more.

## Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation
point for all Kubernetes metrics. Enabling this feature will expose port 9090 of the _prometheus-operator-prometheus_
service. Use the generated service URL to provide other Kubernetes clusters with the installed
[Prometheus Agent](prometheus-agent.md), so that cluster metrics can be forwarded to the Prometheus server.

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can
change any configuration related to remote monitoring to fine-tune settings for your environment.

<!-- prettier-ignore-start -->
Refer to the <VersionedLink text="Spectro Cluster Metrics" url="/integrations/packs/?pack=spectro-cluster-metrics"/> resource to learn more
about the available configuration options.
<!-- prettier-ignore-end -->

To get started with remote monitoring, check out the
[Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) guide.

## Palette Resources Monitoring

<!-- prettier-ignore-start -->
You can access internal Palette metrics in Grafana by adding the <VersionedLink text="Spectro Cluster Metrics" url="/integrations/packs/?pack=spectro-cluster-metrics"/> pack to all your client clusters. Refer to the [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md) guide to learn more.
<!-- prettier-ignore-end -->

## Persistent Storage

You can configure the Prometheus Operator to use persistent storage. To enable persistent storage add the following code
snippet to the `kube-prometheus-stack.prometheus.prometheusSpec.storageSpec` configuration block in the pack's YAML
configuration file. The code snippet below creates a Persistent Volume Claim (PVC) for the Prometheus Operator.

```yaml
kube-prometheus-stack:
  prometheus:
    prometheusSpec:
      storageSpec:
        volumeClaimTemplate:
          metadata:
            name: prom-operator-pvc
          spec:
            storageClassName: spectro-storage-class
            accessModes: ["ReadWriteOnce"]
            resources:
              requests:
                storage: 5Gi
```

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/)

- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- Service monitors to scrape internal Kubernetes components

</TabItem>

<TabItem label="45.4.x" value="45.4.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Airgap Palette and VerteX

In the context of an airgap Palette or VerteX installation, you must remove the `grafana-piechart-panel` plugin. This
plugin is not included by default and requires an internet connection to download. The monitoring stack doesn't require
this plugin to function properly.

```yaml {5}
charts:
  kube-prometheus-stack:
    grafana:
      plugins:
        - grafana-piechart-panel
```

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, then by default a service with a load balancer will be created that exposes
port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

By default, Thanos Ruler event data is saved in object storage specified for Thanos, but you can specify a different
object storage for event data. Refer to the
[Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler) resource to learn more.

## Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation
point for all Kubernetes metrics. Enabling this feature will expose port 9090 of the _prometheus-operator-prometheus_
service. Use the generated service URL to provide other Kubernetes clusters with the installed
[Prometheus Agent](prometheus-agent.md) so that cluster metrics can be forwarded to the Prometheus server.

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can
change any configuration related to remote monitoring to fine-tune settings for your environment.

Refer to the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) resource to learn more
about configuration options.

To get started with remote monitoring, check out the
[Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) guide.

## Palette Resources Monitoring

<!-- prettier-ignore-start -->
You can access internal Palette metrics in Grafana by adding the <VersionedLink text="Spectro Cluster Metrics" url="/integrations/packs/?pack=spectro-cluster-metrics"/> pack to all your client clusters. Refer to the
[Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md) guide to learn more.
<!-- prettier-ignore-end -->

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/)

- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- Service monitors to scrape internal Kubernetes components

</TabItem>

<TabItem label="44.3.x" value="44.3.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, then by default a service with a load balancer will be created that exposes
port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

By default, Thanos Ruler event data is saved in object storage specified for Thanos, but you can specify a different
object storage for event data. Refer to the
[Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler) resource to learn more.

## Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation
point for all Kubernetes metrics. Enabling this feature will expose port 9090 of the _prometheus-operator-prometheus_
service. Use the generated service URL to provide other Kubernetes clusters with the
[Prometheus Agent](prometheus-agent.md) installed so that cluster metrics can be forwarded to the Prometheus server.

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can
change any configuration related to remote monitoring to fine-tune settings for your environment.

Refer to the [Prometheus Remote Write](https://prometheus.io/docs/practices/remote_write/) resource to learn more about
configuration options.

To get started with remote monitoring, check out the
[Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) guide.

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- and the service monitors to scrape internal Kubernetes components.

</TabItem>

<TabItem label="40.0.x" value="40.0.x">

Check out the guide [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) to
learn how to create a monitoring stack with Prometheus for your Palette environment.

## Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to
enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

```yaml
charts:
  kube-prometheus-stack:
    alertmanager:
      config:
        receivers:
          - name: email-alert
            email_configs:
              - to: <reciever>@<domainname>.com
                send_resolved: true
                from: <sender>@<domainname>.com
                smarthost: smtp.<domainname>.com:587
                auth_username: <sender>@<domainname>.com
                auth_identity: <sender>@<domainname>.com
                auth_password: <sender_passwd>
```

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
documentation to learn more about Alertmanager.

## Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to
enable HTTPS and require authentication for all Prometheus API requests.

If you do not enable the ingress option, by default a service with a load balancer will be created that exposes port 80.

Toggle the **Enable** button to enable the use of Ingress.

## Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/platform/thanos/) is an open source system for running large-scale,
distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods in
object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale
horizontally without the risk of using up local storage space.

Toggle the **Enable** button to enable the use of Thanos.

## Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use
of object storage with Thanos. Refer to the
[Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about
how to configure each object storage.

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

## Thanos Ruler Object Store

You can specify a different object storage to store the Thanos Ruler event data. Defaults to the object storage
specified for Thanos. Refer to the [Thanos Ruler](https://prometheus-operator.dev/docs/platform/thanos/#thanos-ruler)
resource to learn more.

## Dependencies

The Prometheus Operator pack installs the following dependencies:

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
- [Prometheus](https://prometheus.io/)
- [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
- [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
- [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
- [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
- and the service monitors to scrape internal Kubernetes components.

</TabItem>

</Tabs>

## Terraform

You can reference the Prometheus Operator pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "prometheus-operator" {
  name         = "prometheus-opeartor"
  version      = "57.0.1"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
