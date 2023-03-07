---
title: 'Prometheus Operator'
metaTitle: 'Prometheus Operator'
metaDescription: 'Prometheus Operator Monitoring pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Prometheus Operator

Prometheus is an open-source monitoring system that is designed to collect and analyze metrics from various sources, such as applications, servers, and networks. It is widely used in the DevOps world to monitor the health and performance of applications and infrastructure. Prometheus stores metrics in a time-series database and provides a query language for analyzing the data. It also includes a powerful alerting system that can notify operators when thresholds are breached.

The Prometheus Operator is a tool that simplifies the deployment and management of Prometheus in a Kubernetes cluster. It automates tasks such as configuring Prometheus, creating and managing Prometheus rules and alerts and scaling Prometheus instances based on demand. The Operator uses Kubernetes' custom resources to define and manage Prometheus instances and related resources, such as ServiceMonitors, which enable Prometheus to discover and monitor services running in the cluster.

You can use the Prometheus Operator to create a monitoring stack that other host clusters point to and forward metrics to. Check out the guide [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) to learn how to create a monitoring stack with Prometheus for your Palette environment.

<br />

<InfoBox>

We recommend you use version v44.3.x or greater moving forward for a simplified and improved user experience when creating a monitoring stack for your architecture. Starting with version v44.3.x the remote monitoring feature is supported. Check out the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) to learn more about the remote monitoring feature. 

</InfoBox>

## Versions Supported
<Tabs>

<Tabs.TabPane tab="44.3.x" key="44.3.x">

## Prerequisites

* Kubernetes v1.16 or greater.


* The minimum required size for the Prometheus server is 4 CPU, 8 GB Memory, and 10 GB of Storage. We recommend the monitoring stack have 1.5x to 2x the minimum required size - 8 CPU, 16 GB Memory, and 20 GB of Storage. As new clusters with the Prometheus agent are added to your environment, review the resource utilization and consider increasing resources if needed. As the Prometheus documentation recommends, each additional agent requires the following resources from the monitoring stack, 0.1 CPU,  250 MiB Memory, and 1 GB storage.
Refer to the [Prometheus Operational aspects](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects) documentation for additional guidance.

## Parameters

The Prometheus operator supports all the parameters exposed by the kube-prometheus-stack Helm Chart. Refer to the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stackn) documentation for details.

The Prometheus Operator pack has one parameter you must initialize `grafana.adminPassword`:

<br />

```yaml
charts:
  kube-prometheus-stack:
    grafana:
      adminPassword: ""
```

Use the `grafana.adminPassword` parameter to assign a password to the Grafana admin user `admin`. 

Additional parameters you should be aware of can be found by expanding the **Presets** view of the pack. You can modify the preset settings during the profile creation process or the cluster deployment process when reviewing the cluster profile.
![A view of the pack's preset drawer expanded with radio buttons](/integrations_prometheus-operator_operator-preset-view-expanded.png)

Review the usage section below to learn more about each preset option.

<br />

## Usage

Check out the guide [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) to learn how to create a monitoring stack with Prometheus for your Palette environment.

<br />

#### Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

<br />

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

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/) documentation to learn more about Alertmanager.

<br />

#### Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to enable HTTPS and require authentication for all Prometheus API requests. 

By default, a service with a load balancer, exposing port 80 is created unless the ingress option is enabled. 

Toggle the **Enable** button to enable the use of Ingress.

<br />


#### Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/operator/thanos/) is an open-source system for running large-scale, distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods by enabling data to be stored in object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale horizontally without needing to worry about running out of local storage space.

Toggle the **Enable** button to enable the use of Thanos.

<br />

#### Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use of object storage with Thanos. Refer to the [Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about how to configure each object storage.

<br />

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

#### Thanos Ruler Object Store

You can specify a different object storage to store the Thanos Ruler event data.  Defaults to the object storage specified for Thanos. Refer to the [Thanos Ruler](https://prometheus-operator.dev/docs/operator/thanos/?#thanos-ruler) resource to learn more.

<br />

#### Remote Monitoring

You can configure the Prometheus server to accept metrics from Prometheus agents and become a centralized aggregation point for all Kubernetes metrics. Enabling this feature will expose the *prometheus-operator-prometheus* service's port 9090. Use the generated service URL to provide other Kubernetes clusters with the [Prometheus Agent](/integrations/prometheus-agent) installed so that cluster metrics can be forwarded to the Prometheus server. 

The remote monitoring feature is configured with defaults to help you consume this feature out-of-the-box. You can change any configuration related to remote monitoring to fine-tune settings for your environment.
Check out the [Prometheus Remote Write](https://prometheus.io/docs/practices/remote_write/) resource to learn more about configuration options.

### Dependencies

The Prometheus Operator pack installs the following dependencies: 

* [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
* [Prometheus](https://prometheus.io/)
* [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components.


</Tabs.TabPane>

<Tabs.TabPane tab="40.0.x" key="40.0.x">

## Prerequisites

* Kubernetes v1.16 or greater.

## Parameters

The Prometheus operator supports all the parameters exposed by the kube-prometheus-stack Helm Chart. Refer to the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stackn) documentation for details.

The Prometheus Operator pack has one parameter you must initialize `grafana.adminPassword`:

<br />

```yaml
charts:
  kube-prometheus-stack:
    grafana:
      adminPassword: ""
```

Use the `grafana.adminPassword` parameter to assign a password to the Grafana admin user `admin`. 

Additional parameters you should be aware can be found by expanding the **Presets** view of the pack. You can modify the preset settings during the profile creation process or the cluster deployment process when reviewing the cluster profile.
![A view of the pack's preset drawer expanded with radion buttons](/integrations_prometheus-operator_operator-preset-view-expanded.png)

Review the usage section below to learn more about each preset option.

<br />

#### Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

<br />

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

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/) documentation to learn more about Alertmanager.

<br />

#### Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to enable HTTPS and require authentication for all Prometheus API requests. 

By default, a service with a load balancer, exposing port 80 is created unless the ingress option is enabled. 

Toggle the **Enable** button to enable the use of Ingress.

<br />


#### Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/operator/thanos/) is an open-source system for running large-scale, distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods by enabling data to be stored in object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale horizontally without needing to worry about running out of local storage space.

Toggle the **Enable** button to enable the use of Thanos.

<br />

#### Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use of object storage with Thanos. Refer to the [Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about how to configure each object storage.

<br />

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

#### Thanos Ruler Object Store

You can specify a different object storage to store the Thanos Ruler event data.  Defaults to the object storage specified for Thanos. Refer to the [Thanos Ruler](https://prometheus-operator.dev/docs/operator/thanos/?#thanos-ruler) resource to learn more.

<br />


### Dependencies

The Prometheus Operator pack installs the following dependencies: 

* [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
* [Prometheus](https://prometheus.io/)
* [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components.

</Tabs.TabPane>

<Tabs.TabPane tab="37.0.x" key="37.0.x">

## Prerequisites

* Kubernetes v1.16 or greater.

## Parameters

The Prometheus operator supports all the parameters exposed by the kube-prometheus-stack Helm Chart. Refer to the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stackn) documentation for details.

The Prometheus Operator pack has one parameter you must initialize `grafana.adminPassword`:

<br />

```yaml
charts:
  kube-prometheus-stack:
    grafana:
      adminPassword: ""
```

Use the `grafana.adminPassword` parameter to assign a password to the Grafana admin user `admin`. 

Additional parameters you should be aware can be found by expanding the **Presets** view of the pack. You can modify the preset settings during the profile creation process or the cluster deployment process when reviewing the cluster profile.
![A view of the pack's preset drawer expanded with radio buttons](/integrations_prometheus-operator_operator-preset-view-expanded.png)

Review the usage section below to learn more about each preset option.

<br />

#### Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

<br />

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

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/) documentation to learn more about Alertmanager.

<br />

#### Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to enable HTTPS and require authentication for all Prometheus API requests. 

By default, a service with a load balancer, exposing port 80 is created unless the ingress option is enabled. 

Toggle the **Enable** button to enable the use of Ingress.

<br />


#### Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/operator/thanos/) is an open-source system for running large-scale, distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods by enabling data to be stored in object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale horizontally without needing to worry about running out of local storage space.

Toggle the **Enable** button to enable the use of Thanos.

<br />

#### Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use of object storage with Thanos. Refer to the [Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about how to configure each object storage.

<br />

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```

#### Thanos Ruler Object Store

You can specify a different object storage to store the Thanos Ruler event data.  Defaults to the object storage specified for Thanos. Refer to the [Thanos Ruler](https://prometheus-operator.dev/docs/operator/thanos/?#thanos-ruler) resource to learn more.

<br />


### Dependencies

The Prometheus Operator pack installs the following dependencies: 

* [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
* [Prometheus](https://prometheus.io/)
* [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components.


</Tabs.TabPane>

<Tabs.TabPane tab="35.5.x" key="35.5.x">

## Prerequisites

* Kubernetes v1.16 or greater.

## Parameters

The Prometheus operator supports all the parameters exposed by the kube-prometheus-stack Helm Chart. Refer to the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stackn) documentation for details.

The Prometheus Operator pack has one parameter you must initialize `grafana.adminPassword`:

<br />

```yaml
charts:
  kube-prometheus-stack:
    grafana:
      adminPassword: ""
```

Use the `grafana.adminPassword` parameter to assign a password to the Grafana admin user `admin`. 

Additional parameters you should be aware can be found by expanding the **Presets** view of the pack. You can modify the preset settings during the profile creation process or the cluster deployment process when reviewing the cluster profile.
![A view of the pack's preset drawer expanded with radion buttons](/integrations_prometheus-operator_operator-preset-view-expanded.png)

Review the usage section below to learn more about each preset option.

<br />

#### Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

<br />

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

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/) documentation to learn more about Alertmanager.

<br />

#### Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to enable HTTPS and require authentication for all Prometheus API requests. 

By default, a service with a load balancer, exposing port 80 is created unless the ingress option is enabled. 

Toggle the **Enable** button to enable the use of Ingress.

<br />


#### Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/operator/thanos/) is an open-source system for running large-scale, distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods by enabling data to be stored in object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale horizontally without needing to worry about running out of local storage space.

Toggle the **Enable** button to enable the use of Thanos.

<br />

#### Object Store

Select the Thanos object storage type you will use. Review the `thanos.objstoreConfig` parameters to configure the use of object storage with Thanos. Refer to the [Thanos Object Storage](https://github.com/thanos-io/thanos/blob/main/docs/storage.md) documentation to learn more about how to configure each object storage.

<br />

```yaml
charts:
  kube-prometheus-stack:
    prometheus:
      prometheusSpec:
        thanos:
          objstoreConfig:
```
### Dependencies

The Prometheus Operator pack installs the following dependencies: 

* [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
* [Prometheus](https://prometheus.io/)
* [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components.


</Tabs.TabPane>

<Tabs.TabPane tab="30.2.x" key="30.2.x">


## Prerequisites

* Kubernetes v1.16 or greater.

## Parameters

The Prometheus operator supports all the parameters exposed by the kube-prometheus-stack Helm Chart. Refer to the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stackn) documentation for details.

The Prometheus Operator pack has one parameter you must initialize `grafana.adminPassword`:

<br />

```yaml
charts:
  kube-prometheus-stack:
    grafana:
      adminPassword: ""
```

Use the `grafana.adminPassword` parameter to assign a password to the Grafana admin user `admin`. 

Additional parameters you should be aware can be found by expanding the **Presets** view of the pack. You can modify the preset settings during the profile creation process or the cluster deployment process when reviewing the cluster profile.
![A view of the pack's preset drawer expanded with radion buttons](/integrations_prometheus-operator_operator-preset-view-expanded.png)

Review the usage section below to learn more about each preset option.

<br />

#### Email Alerts

You can configure the Prometheus server to send email alerts to a set of contacts. Toggle the **Email Alerts** button to enable email alerting. Update the `alertmanager.config.receivers` settings with all the required email setting values.

<br />

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

Refer to the [Prometheus Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/) documentation to learn more about Alertmanager.

<br />

#### Grafana Ingress

You can enable an ingress endpoint for Grafana that will deploy an NGINX ingress controller. This feature can be used to enable HTTPS and require authentication for all Prometheus API requests. 

By default, a service with a load balancer, exposing port 80 is created unless the ingress option is enabled. 

Toggle the **Enable** button to enable the use of Ingress.

<br />

### Dependencies

The Prometheus Operator pack installs the following dependencies: 

* [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)
* [Prometheus](https://prometheus.io/)
* [Prometheus Alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [Grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components.

</Tabs.TabPane>

<Tabs.TabPane tab="Deprecated" key="Deprecated">

All versions less than v30.2.X are considered deprecated. Upgrade to a newer version to take advantage of new features.

</Tabs.TabPane>

</Tabs>

# Terraform

You can retrieve details about the Prometheus operator pack by using the following Terraform code.

<br />

```terraform
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "pack-info" {
  name         = "prometheus-opeartor"
  version      = "44.3.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack)

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)

- [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/)

- [Thanos & Prometheus](https://prometheus-operator.dev/docs/operator/thanos/)

- [Prometheus FAQ](https://prometheus.io/docs/introduction/faq)
