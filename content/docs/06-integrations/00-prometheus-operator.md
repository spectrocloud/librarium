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

The Prometheus Operator is a tool that simplifies the deployment and management of Prometheus in a Kubernetes cluster. It automates tasks such as configuring Prometheus, creating and managing Prometheus rules and alerts, and scaling Prometheus instances based on demand. The Operator uses Kubernetes' custom resources to define and manage Prometheus instances and related resources, such as ServiceMonitors, which enable Prometheus to discover and monitor services running in the cluster.

You can use the Prometheus Operator to create a monitoring stack that other host clusters point to and forward metrics to. 

<br />

<InfoBox>

We recommend you use version v44.3.x or greater moving forward for a simplified and improved user experience when creating a monitoring stack for your architecture. Starting with version v44.3.x the remote monitoring feature is supported. Check out the [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/) to learn more about the remote monitoring feature. 

</InfoBox>

## Versions Supported
<Tabs>

<Tabs.TabPane tab="44.3.x" key="44.3.x">

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

## Usage

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


<br />


#### Thanos SideCar

[Thanos](https://prometheus-operator.dev/docs/operator/thanos/) is an open-source system for running large-scale, distributed, and highly available Prometheus setups. Thanos allows Prometheus to store data for extended periods by enabling data to be stored in object storage, such as Amazon S3 or Google Cloud Storage, instead of a local disk. This enables Prometheus to scale horizontally without needing to worry about running out of local storage space.

Toggle the **Enable** button to enable the use of Thanos.


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


</Tabs.TabPane>

<Tabs.TabPane tab="40.0.x" key="40.0.x">

* **40.5.0**

</Tabs.TabPane>

<Tabs.TabPane tab="37.0.x" key="37.0.x">

* **37.2.0**

</Tabs.TabPane>

<Tabs.TabPane tab="35.5.x" key="35.5.x">

* **35.5.1**

</Tabs.TabPane>

<Tabs.TabPane tab="30.2.x" key="30.2.x">

</Tabs.TabPane>
</Tabs>

<!-- ## Contents

A default integration will install the following components:
* [prometheus-operator](https://github.com/coreos/prometheus-operator)
* [prometheus](https://prometheus.io/)
* [alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter)
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics)
* [grafana](https://github.com/helm/charts/tree/master/stable/grafana)
* and the service monitors to scrape internal Kubernetes components:

    * kube-apiserver
    * kube-scheduler
    * kube-controller-manager
    * etcd
    * kube-dns/coredns
    * kube-proxy

This integration also includes dashboards and alerts.

## Custom Secrets for Alertmanager

For Alertmanager to work, the alerting configuration file should be set while deploying the integration. This configuration file includes sensitive information like SMTP credentials. If you want to skip entering SMTP credentials in plain text, you can do so by following the steps below:



1. Add **Prometheus-Operator** integration in the Cluster profile with changes to the following values:

    |**Parameter**| **Description**|
    |---------|---------------|
    |alertmanager.alertmanagerSpec.useExistingSecret| Set to true. This will skip creating the default Alertmanager secret.|
    |alertmanager.alertmanagerSpec.configSecret | Provide the name of the custom Kubernetes Secret<br /> (should exist in the same namespace as the Alertmanager object) <br /> which contains configuration for the Alertmanager instance.|
    ||

2. Deploy the cluster with Prometheus-Operator integration. At this point, the Alertmanager pod will crash (as the custom secret defined is not yet available).


3. Manually, create the secret in the same namespace as that of the Alertmanager object.


4. Prepare the alertmanager.yaml contents:

  ```yaml
       global:
         resolve_timeout: 5m
       receivers:
        - email_configs:
          - auth_identity: noreply@spectrocloud.com
            auth_password: abcd
            auth_username: noreply@spectrocloud.com
            from: noreply@spectrocloud.com
            send_resolved: true
            smarthost: smtp.gmail.com:587
            to: mark@spectrocloud.com
          name: prom-alert
       route:
         group_by:
         - job
         group_interval: 5m
         group_wait: 30s
         receiver: prom-alert
         repeat_interval: 4h
         routes:
         - match:
             alertname: Watchdog
           receiver: prom-alert
  ```

5. Create the Secret using the Alertmanager config prepared above.

   ```
  kubectl create secret generic alertmanager-secret -n monitoring --from-file=./alertmanager.yaml
   ```

6. Alertmanager pod will recover from the crash in the next reconciliation.

## Configure Metrics

Due to security reasons, controller-manager, kube-schedule, and etcd run in the localhost causing Prometheus to fail when attempting to scrape metrics. Therefore, these targets are indicated as being down in Prometheus. Change the following in the Kubernetes pack layer in the cluster profile to scrape metrics for these services.


```yaml
    kubeadmconfig:
      controllerManager:
        extraArgs:
            ...
          bind-address: "0.0.0.0"
      scheduler:
        extraArgs:
          ...
          bind-address: "0.0.0.0"
      etcd:
        local:
          extraArgs:
            listen-metrics-urls: "http://0.0.0.0:2381"
```

## Ingress

Follow the below steps to configure Ingress on Grafana.

1. Change serviceType from **LoadBalancer** to **ClusterIP** (line #427).
2. Ingress (line #438).
   * Enable Ingress; change enabled from **false** to **true**.
   * Set Ingress rules like annotations, path, hosts, etc.

With these changes, you can access the Grafana service on the Ingress Controller LoadBalancer hostname/IP. -->

# References

- [Prometheus Operator GitHub](https://github.com/coreos/prometheus-operator)

- [Prometheus Remote Write Tuning](https://prometheus.io/docs/practices/remote_write/)

- [Thanos & Prometheus](https://prometheus-operator.dev/docs/operator/thanos/)
