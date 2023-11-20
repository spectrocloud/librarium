
# Palette Datadog Integration

## Prerequisites:

1. Access to Palette
2. Kubernetes Cluster
3. Datadog account with API key

## Installation

This documents permits to integrate Palette and Datadog: export logs from Kubernetes clusters managed by Palette to Datadog instance

### Datadog preparation

1. If you don’t already have access to Datadog, open [https://app.datadoghq.eu/signup](https://app.datadoghq.eu/signup) choose appropriate region (for example, EU1), give your name, email address and company name, and press “Sign up”

![alt_text](/audit-logs_datadog-01_datadog_signup.png "Datadog Signup" )

2. Fill in information on the next page and choose “Kubernetes” on the following page. Note that Datadog will provide an API key, take a note of it. Also note at the bottom of the page that it’s waiting for the first agent to report.

![alt_text](/audit-logs_datadog-02_datadog_apikey.png "Datadog APIkey")

### Palette configuration

1. Login to Palette and add datadog Helm repo: click on “Tenant Settings” on the left, then on “Registries”, then on “Add New Helm Registry” and add new Helm registry with the name “Datadog” and endpoint “[https://helm.datadoghq.com](https://helm.datadoghq.com)”. It will take a couple of minutes to synchronize. (this document was written at the end of June 2023 when the Palette Datadog Pack was still in development. When it is released, the recommended approach may change)

![alt_text](/audit-logs_datadog-03_helm_repository.png "Helm Repository")

2. When the repository is synced, go ahead and create a new addon Datadog profile via Helm chart: Click on “Profiles”, then “Add Cluster Profile”, give the profile name “datadog” and choose “Add-on” type. Then click on “Add new pack”, choose Pack Type “Helm Chart” and Registry as “Datadog”. Then pick the “datadog” chart and its latest version.

![alt_text](/audit-logs_datadog-04_helm_chart.png "Helm Chart")

3. This will open a Helm chart modification window, a couple of changesi need to be done here so that Datadog installation collects all the necessary data:

![alt_text](/audit-logs_datadog-05_helm_modifications.png "Helm modifications")
1. choose namespace on line 2
2. add api key on line 36: _your_api_key_here_
3. site: 'datadoghq.eu' on line 117 (choose your regional Datadog website)
4. change _false_ to _true_ on line 403 (enable logs collector)
5. change _false_ to _true_ on line 408 (activating containerCollectAll)
6. change _false_ to _true_ on line 546 (enable process collection)
7. change _false_ to _true_ on line 655 (enable network monitoring)
8. change _false_ to _true_ on line 659 (enable service monitoring)
9. change _false_ to _true_ on line 669 (enable security agent)

    Logs are now ready, let’s enable audit logs:

10. paste the following stanza around lines 1109 and Line 1546

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

11. paste the following stanza around lines 1115 and 1564

```yaml
  volumeMounts:
      - name: auditdir
        mountPath: /var/log/apiserver
      - name: dd-agent-config
        mountPath: /conf.d/kubernetes_audit.d 
```

(make sure mountPath and path for apiserver are corresponding to what is in kube-apiserver-arg arguments of your Kubernetes cluster)

Don’t forget so save the profile after making all these changes!

4. Now apply new created profile to the cluster: go to “Profiles” of the cluster, click on blue “plus” sign, choose “datadog” profile and click on “confirm”

![alt_text](/audit-logs_datadog-06_profile_confirm.png "Profile")

5. After some time, the Datadog agent should start reporting, now click “Finish” to get to the Datadog Panel and verify that logs are indeed being transferred to it.

![alt_text](/audit-logs_datadog-07_datadog_agent.png "Datadog agent")

6. Enable configmap for the cluster to collect data: create a datadog-configmap.yaml file with the following content:

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
and apply it as so with the proper kubeconfig file from the Kubernetes cluster: 

```bash
kubectl -n datadog apply -f datadog-configmap.yaml
```
(make sure path for apiserver corresponds to what is in kube-apiserver-arg arguments of the Kubernetes cluster, in case of k3s it is /var/log/apiserver)

## Validation

Open Datadog console by clicking “Logs” on the left hand side and make sure Kubernetes logs flowing to it

![alt_text](/audit-logs_datadog-08_datadog_example.png "Datadog Example")

Resources:

* [https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging](https://docs.spectrocloud.com/audit-logs/kube-api-audit-logging)
* [https://docs.datadoghq.com/integrations/kubernetes_audit_logs/](https://docs.datadoghq.com/integrations/kubernetes_audit_logs/)
