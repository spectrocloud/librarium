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
<Tabs.TabPane tab="12.3.x" key="12.3.x">

* **12.3.0** 

</Tabs.TabPane>
<Tabs.TabPane tab="9.7.x" key="9.7.x">

  * **9.7.2**

</Tabs.TabPane>
</Tabs>

## Contents

A Default integration will install the following components:
* [prometheus-operator](https://github.com/coreos/prometheus-operator).
* [prometheus](https://prometheus.io/).
* [alertmanager](https://www.prometheus.io/docs/alerting/latest/alertmanager/).
* [node-exporter](https://github.com/helm/charts/tree/master/stable/prometheus-node-exporter).
* [kube-state-metrics](https://github.com/helm/charts/tree/master/stable/kube-state-metrics).
* [grafana](https://github.com/helm/charts/tree/master/stable/grafana).
* service monitors to scrape internal Kubernetes components:
    * kube-apiserver.
    * kube-scheduler.
    * kube-controller-manager.
    * etcd.
    * kube-dns/coredns.
    * kube-proxy.

This integration also includes dashboards and alerts.

## Use custom secrets for alertmanager

For Alertmanager to work fine, alerting config should be set while deploying the integration. This config also includes sensitive information like SMTP credentials. If you want to skip entering SMTP credentials in plain text, you can do so by following the procedure below

* Add Prometheus-Operator integration in the Cluster profile with changes to the following values
   * `alertmanager.alertmanagerSpec.useExistingSecret` - Set to true. This will skip creating the default Alertmanager secret
   * `alertmanager.alertmanagerSpec.configSecret` - Provide the name of the custom Kubernetes Secret (should exist in the same namespace as the Alertmanager object) which contains configuration for the Alertmanager instance
* Deploy the cluster with Prometheus-Operator integration. At this point, Alertmanager pod will crash (as the custom secret defined is not yet available)
* Create the secret manually in the same namespace as that of Alertmanager object

   **Prepare alertmanager.yaml contents**
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

   **Create the Secret using the Alertmanager config prepared above**
   ```
   kubectl create secret generic alertmanager-secret -n monitoring --from-file=./alertmanager.yaml
   ```
* Alertmanager pod will recover from the crash in the next reconciliation

# Ingress

Follow below steps to configure Ingress on Grafana

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #427)
2. Ingress (line #438)
   * Enable Ingress; change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts, etc.

With these changes, you can access Grafana service on the Ingress Controller LoadBalancer hostname / IP

## References

https://github.com/coreos/prometheus-operator
