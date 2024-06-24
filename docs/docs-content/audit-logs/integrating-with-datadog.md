---
sidebar_label: 'Palette with Datadog'
title: 'Export audit logs to Datadog'
description: 'Set up exporting audit logs to Datadog'
icon: ""
hide_table_of_contents: false
sidebar_position: 100
hiddenFromNav: false
tags: ["audit-logs", "Datadog"]
---


# Palette Datadog Integration

Datadog is a monitoring and analytics tool. You can set up Palette to export audit logs from your Kubernetes clusters managed by Palette to Datadog. This guide will walk you through the steps to accomplish this through installing Datadog Helm chart and configuring it.

## Prerequisites:

1. Access to Palette as a user

2. Kubernetes Cluster with admin rights under Palette control

3. Datadog account with API key

4. Kubectl installed and configured to access your Kubernetes cluster.

### Datadog configuration

1. Ensure you have access to Datadog console, navigate to [https://app.datadoghq.eu/signup](https://app.datadoghq.eu/signup) to obtain a free trial. Pick appropriate region (for example, EU1), provide your name, email address and company name, and click **Sign up**

![alt_text](/datadog/audit-logs_datadog-01_datadog_signup.png "Datadog Signup" )

2. Once logged in to Datadog, pick Kubernetes and click **Next** at the bottom of the page.

Datadog will provide you with an API key, record it for the future

![alt_text](/datadog/audit-logs_datadog-02_datadog_apikey.png "Datadog APIkey")

:::info
Note at the bottom of the page that Datadog waiting for the first agent to report.
:::

Datadog is now ready to accept audit logs from Kubernetes clusters

### Palette configuration

1. Ensure you can access your Kubernetes cluster using the kubectl CLI. Refer to the [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for guidance on how to access your cluster with the `kubectl` CLI.

2. Log in to Palette and add datadog Helm repo: click on **Tenant Settings** on the left, then on **Registries**, then on **Add New Helm Registry** and add new Helm registry with the name Datadog and endpoint [https://helm.datadoghq.com](https://helm.datadoghq.com). The synchronization takes a couple of minutes.

:::tip

At the moment of writing, Palette Datadog Pack was still in development. Verify in the [Packs list](https://docs.spectrocloud.com/integrations/) if it's completed. If it is available, install the pack rather than Helm chart

:::

![alt_text](/datadog/audit-logs_datadog-03_helm_repository.png "Helm Repository")

3. When the repository is synchronized, create a new addon Datadog profile via Helm chart: in Palette, click on **Profiles**, then **Add Cluster Profile**, give the profile name `datadog` and choose **Add-on** type.

  Then click on **Add new pack**, choose Pack Type **Helm Chart** and Registry **Datadog** Then pick the **Datadog** chart and its latest version.

![alt_text](/datadog/audit-logs_datadog-04_helm_chart.png "Helm Chart")


4. This will open a Helm chart modification window, so that Datadog installation collects all the necessary data, you need to modify a number of parameters and to add two YAML stanzas to the Helm chart

![alt_text](/datadog/audit-logs_datadog-05_helm_modifications.png "Helm modifications")

:::tip

Line numbers can change in Datadog Helm chart, if there's no exact match, please search for corresponding linesa in close vicinity

:::

|**Line**| **Modification**|
|---|---|
|2   | choose namespace for Datadog install, for example: namespace: "datadog"|
|36  | add your Datadog API key saved earlier |
|117 | choose your regional Datadog website, for example datadoghq.eu, please refer to [Datadog Documentation](https://docs.datadoghq.com/) for the full list
|403 | change _false_ to _true_ to enable logs collector
|408 | change _false_ to _true_ to activate containerCollectAll
|546 | change _false_ to _true_ to enable process collection
|655 | change _false_ to _true_ to enable network monitoring
|659 | change _false_ to _true_ to enable service monitoring
|669 | change _false_ to _true_ to enable security agent

To enable volume, paste the following stanza around lines 1109 and Line 1546

```yaml
  volumes:
      - hostPath:
          path: /var/log/apiserver
        name: auditdir
      - name: dd-agent-config
        configMap:
          name: dd-agent-config
          items:
            - key: kubernetes-audit-log
              path: conf.yaml
```

To enable volume mounts paste the following stanza around lines 1115 and 1564

```yaml
  volumeMounts:
      - name: auditdir
        mountPath: /var/log/apiserver
      - name: dd-agent-config
        mountPath: /conf.d/kubernetes_audit.d 
```


:::tip
Make sure `mountPath` and `path` for apiserver correspond to what is set up in `kube-apiserver-arg` argument of your Kubernetes cluster, you can look it up in Kubernetes profile in Palette. In case of k3s it is `/var/log/apiserver`
:::

:::caution
Make sure to save the profile after making these changes!
:::

5. Now apply new created profile to the cluster: go to **Profiles** of the cluster, click on blue **+** sign, choose `datadog` profile and click on **Confirm**

![alt_text](/datadog/audit-logs_datadog-06_profile_confirm.png "Profile")

6. After some time, the Datadog agent should start reporting, click **Finish** to get to the Datadog Panel and verify that audit logs are indeed being transferred to it.

![alt_text](/datadog/audit-logs_datadog-07_datadog_agent.png "Datadog agent")

7. Enable configmap for the cluster to collect data: create a `datadog-configmap.yaml` file with the following content:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
    name: dd-agent-config
    namespace: default
data:
    kubernetes-audit-log: |-
        logs:
          - type: file
            path: /var/log/apiserver/audit.log
            source: kubernetes.audit
            service: audit      
```
and apply it with the kubeconfig file for the Kubernetes cluster from which you want to obtain audit logs: 

```bash
kubectl -n datadog apply -f datadog-configmap.yaml
```

:::tip
Make sure path for apiserver corresponds to what is in `kube-apiserver-arg` argument of the Kubernetes cluster, you can look it up in Kubernetes profile in Palette. In case of k3s it is `/var/log/apiserver`
:::

## Validate

Open Datadog console by clicking **Logs** on the left hand side and make sure you're seeing Kubernetes audit logs flowing in

![alt_text](/datadog/audit-logs_datadog-08_datadog_example.png "Datadog Example")

## Resources:

- [https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging](https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging)

- [https://docs.datadoghq.com/integrations/kubernetes_audit_logs/](https://docs.datadoghq.com/integrations/kubernetes_audit_logs/)
