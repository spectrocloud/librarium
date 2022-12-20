---
title: 'Prometheus Operator'
metaTitle: 'Prometheus Operator'
metaDescription: 'Prometheus Operator Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
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

The Prometheus Operator uses Kubernetes [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to simplify the deployment and configuration of Prometheus, Alertmanager, and related monitoring components. The default installation is intended to suit monitoring a Kubernetes cluster the chart is deployed onto.

## Versions Supported
<Tabs>

<Tabs.TabPane tab="40.0.x" key="40.0.x">

**40.5.0**

</Tabs.TabPane>

<Tabs.TabPane tab="37.0.x" key="37.0.x">

* **37.2.0**

</Tabs.TabPane>

<Tabs.TabPane tab="35.5.x" key="35.5.x">

* **35.5.1**

</Tabs.TabPane>

<Tabs.TabPane tab="30.2.x" key="30.2.x">

* **30.2.0**

</Tabs.TabPane>


<Tabs.TabPane tab="30.0.x" key="30.0.x">

* **30.0.3**

</Tabs.TabPane>

<Tabs.TabPane tab="19.2.x" key="19.2.x">

* **19.2.3**

</Tabs.TabPane>
<Tabs.TabPane tab="12.3.x" key="12.3.x">

* **12.3.0** 

</Tabs.TabPane>
<Tabs.TabPane tab="9.7.x" key="9.7.x">

  * **9.7.2**

</Tabs.TabPane>
</Tabs>

## Contents

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

With these changes, you can access the Grafana service on the Ingress Controller LoadBalancer hostname/IP.

# References

[Prometheus-operator](https://github.com/coreos/prometheus-operator)
