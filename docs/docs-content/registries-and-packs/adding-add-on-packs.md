---
sidebar_label: "Add an Add-on Pack"
title: "Add an Add-on Pack"
description: "How to create custom made packs using Helm Charts and Manifests in Spectro Cloud"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
---

An Add-on Pack defines deployment specifics of a Kubernetes application to be installed on a running Kubernetes cluster.
Palette provides several Add-on packs out of the box for various layers of the Kubernetes stack. For example:

- **Logging** - elastic search, fluentd

- **Monitoring** - Kubernetes dashboard, Prometheus

- **Load Balancers** - Citrix

- **Security** - Dex, Vault, Permissions manager

- **Service Mesh** - Istio

Custom Add-on packs can be built to extend the list of integrations. Two different methods are used in the following
examples to create custom add-on packs.

- [Helm Charts](#helm-charts)

- [Manifests](#manifests)

<br />

## Helm Charts

The following example shows how to build the Prometheus-Grafana monitoring pack and push to a pack registry server using
the Spectro Cloud CLI:

1. Create the pack directory named _prometheus-grafana_.

2. Create the metadata file named `pack.json`.

   ```json
   {
     "addonType": "monitoring",
     "annotations": {},
     "ansibleRoles": [],
     "cloudTypes": ["all"],
     "displayName": "Prometheus-Grafana",
     "eol": " ",
     "group": " ",
     "kubeManifests": [],
     "charts": ["charts/prometheus-grafana.tgz"],
     "layer": "addon",
     "name": "prometheus-grafana",
     "version": "9.7.2"
   }
   ```

3. Download the desired version of the Prometheus-Grafana Helm charts archive.

4. Create a subdirectory called **charts** and copy the downloaded Helm chart archive to this directory. Refer to the
   relative location of this archive in the pack manifest file, `pack.json` as shown in step 2.

5. Create a file called `values.yaml` for configurable chart parameters. This can be a subset of the `values.yaml` file
   shipped within the chart. Copy the entire file as is, if all chart parameters need to be made configurable. For the
   Prometheus-Grafana pack, the `values.yaml` could look like this:

   ```yaml
   pack:
     #The namespace (on the target cluster) to install this chart
     #When not found, a new namespace will be created
     namespace: "monitoring"

   charts:
     prometheus-operator:

       # Default values for prometheus-operator.
       # This is a YAML-formatted file.
       # Declare variables to be passed into your templates.

       ## Provide a name in place of prometheus-operator for `app:` labels
       ##
       nameOverride: ""

       ## Provide a name to substitute for the full names of resources
       ##
       fullnameOverride: "prometheus-operator"

       ## Labels to apply to all resources
       ##
       commonLabels: {}
       # scmhash: abc123
       # myLabel: aakkmd

       ## Create default rules for monitoring the cluster
       ##
       defaultRules:
         create: true
         rules:
           alertmanager: true
           etcd: true
           general: true
           k8s: true
           kubeApiserver: true
           kubePrometheusNodeAlerting: true
           kubePrometheusNodeRecording: true
           kubernetesAbsent: true
           kubernetesApps: true
           kubernetesResources: true
           kubernetesStorage: true
           kubernetesSystem: true
           kubeScheduler: true
           network: true
           node: true
           prometheus: true
           prometheusOperator: true
           time: true

         ## Labels for default rules
         labels: {}
         ## Annotations for default rules
         annotations: {}

       ## Provide custom recording or alerting rules to be deployed into the cluster.
       ##
       additionalPrometheusRules: []
       #  - name: my-rule-file
       #    groups:
       #      - name: my_group
       #        rules:
       #        - record: my_record
       #          expr: 100 * my_record

       ##
       global:
         rbac:
           create: true
           pspEnabled: true

         ## Reference to one or more secrets to be used when pulling images
         ## ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
         ##
         imagePullSecrets: []
         # - name: "image-pull-secret"

       ## Configuration for alertmanager
       ## ref: https://prometheus.io/docs/alerting/alertmanager/
       ##
       alertmanager:

         ## Deploy alertmanager
         ##
         enabled: true

         ## Service account for Alertmanager to use.
         ## ref: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
         ##
         serviceAccount:
           create: true
           name: ""

         ## Configure pod disruption budgets for Alertmanager
         ## ref: https://kubernetes.io/docs/tasks/run-application/configure-pdb/#specifying-a-poddisruptionbudget
         ## This configuration is immutable once created and will require the PDB to be deleted to be changed
         ## https://github.com/kubernetes/kubernetes/issues/45398
         ##
         podDisruptionBudget:
           enabled: false
           minAvailable: 1
           maxUnavailable: ""

         ## Alertmanager configuration directives
         ## ref: https://prometheus.io/docs/alerting/configuration/#configuration-file
         ##      https://prometheus.io/webtools/alerting/routing-tree-editor/
         ##
         config:
           global:
             resolve_timeout: 5m
           route:
             group_by: ['job']
             group_wait: 30s
             group_interval: 5m
             repeat_interval: 12h
             receiver: 'null'
             routes:
               - match:
                   alertname: Watchdog
                 receiver: 'null'
           receivers:
             - name: 'null'

         ## Pass the Alertmanager configuration directives through Helm's templating
         ## engine. If the Alertmanager configuration contains Alertmanager templates,
         ## they'll need to be properly escaped so that they are not interpreted by
         ## Helm
         ## ref: https://helm.sh/docs/developing_charts/#using-the-tpl-function
         ##      https://prometheus.io/docs/alerting/configuration/#%3Ctmpl_string%3E
         ##      https://prometheus.io/docs/alerting/notifications/
         ##      https://prometheus.io/docs/alerting/notification_examples/
         tplConfig: false

         ## Alertmanager template files to format alerts
         ## ref: https://prometheus.io/docs/alerting/notifications/
         ##      https://prometheus.io/docs/alerting/notification_examples/
         ##
         templateFiles: {}
         #
         ## An example template:
         #   template_1.tmpl: |-
         #       {{ define "cluster" }}{{ .ExternalURL | reReplaceAll ".*alertmanager\\.(.*)" "$1" }}{{ end }}
         #
         #       {{ define "slack.myorg.text" }}
         #       {{- $root := . -}}
         #       {{ range .Alerts }}
         #         *Alert:* {{ .Annotations.summary }} - `{{ .Labels.severity }}`
         #         *Cluster:*  {{ template "cluster" $root }}
         #         *Description:* {{ .Annotations.description }}
         #         *Graph:* <{{ .GeneratorURL }}|:chart_with_upwards_trend:>
         #         *Runbook:* <{{ .Annotations.runbook }}|:spiral_note_pad:>
         #         *Details:*
         #           {{ range .Labels.SortedPairs }} * *{{ .Name }}:* `{{ .Value }}`
         #           {{ end }}

         ingress:
           enabled: false
    ...
   ```

6. Log in to the pack registry using the following command:

   ```bash
    spectro registry login [REGISTRY_SERVER]
   ```

7. Using the Spectro CLI, push the newly built pack to the pack registry:

   ```bash
    spectro pack push prometheus-grafana --registry-server [REGISTRY-SERVER]
   ```

<br />

<!-- </TabItem>

<TabItem label="Using Manifests" value="add_on_packs_manifests"> -->

## Manifests

Add-on packs can be built using Kubernetes manifests as well. These manifests contain deployment specifications for
Kubernetes objects like pods, services, deployments, namespaces, or secrets.

The example below shows how to build the Permission Manager auth pack and push to the pack registry server using the
Spectro Cloud CLI.

1. Create the pack directory named **permission-manager**.

2. Create the metadata file named `pack.json`.

   ```json
   {
     "addonType": "authentication",
     "cloudTypes": ["all"],
     "displayName": "Permission Manager",
     "kubeManifests": ["manifests/permission-manager.yaml"],
     "layer": "addon",
     "name": "permission-manager",
     "version": "1.1.0"
   }
   ```

3. Create a sub-directory called **manifests**.

4. Copy the desired manifest files to the **manifests** directory and reference them in `pack.json` as shown in step 2.
   If the configurability of the manifest is desired, then the manifest files must be templatized to introduce
   parameters. For example, _\{\{.Values.namespace}}_. These parameters are defined with default values in the
   `values.yaml` file and can be overridden in the cluster profile.

   **permission-manager.yaml (partial)**

   ```yaml
       apiVersion: v1
       kind: Namespace
       metadata:
         name: {{ .Values.namespace | quote }}

       ---

       apiVersion: v1
       kind: Secret
       metadata:
         name: auth-password-secret
         namespace: {{ .Values.namespace | quote }}
       type: Opaque
       stringData:
         password: {{ .Values.authPassword }}

       ---

       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRole
       metadata:
         name: template-namespaced-resources___operator
       rules:
         - apiGroups:
             - "*"
           resources:
             - "*"
           verbs:
             - "*"

       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRole
       metadata:
         name: template-namespaced-resources___developer
       rules:
         - apiGroups:
             - "*"
           resources:
             # - "bindings"
             - "configmaps"
             - "endpoints"
             # - "limitranges"
             - "persistentvolumeclaims"
             - "pods"
             - "pods/log"
             - "pods/portforward"
             - "podtemplates"
             - "replicationcontrollers"
             - "resourcequotas"
             - "secrets"
             # - "serviceaccounts"
             - "services"
             # - "controllerrevisions"
             # - "statefulsets"
             # - "localsubjectaccessreviews"
             # - "horizontalpodautoscalers"
             # - "cronjobs"
             # - "jobs"
             # - "leases"
             - "events"
             - "daemonsets"
             - "deployments"
             - "replicasets"
             - "ingresses"
             - "networkpolicies"
             - "poddisruptionbudgets"
             # - "rolebindings"
             # - "roles"
           verbs:
             - "*"

       ---

       apiVersion: rbac.authorization.k8s.io/v1
       kind: ClusterRole
       metadata:
         name: template-namespaced-resources___read-only
       rules:
         - apiGroups:
             - "*"
           resources:
             - "configmaps"
             - "endpoints"
             - "persistentvolumeclaims"
             - "pods"
             - "pods/log"
             - "pods/portforward"
             - "podtemplates"
             - "replicationcontrollers"
             - "resourcequotas"
             - "secrets"
             - "services"
             - "statefulsets"
             - "cronjobs"
             - "jobs"
             - "events"
             - "daemonsets"
             - "deployments"
             - "replicasets"
             - "ingresses"
             - "networkpolicies"
             - "poddisruptionbudgets"
           verbs: ["get", "list", "watch"]

       ---
       ...
   ```

5. Create a file called `values.yaml` to provide configurable manifest parameters.

   **values.yaml:**

   ```yaml
   manifests:
     permission-manager:
       #Namespace under which permission-manager will be deployed
       namespace: "permission-manager"

       #Log in password for permission-manager
       authPassword: "welcome123"
   ```

6. Log in to the pack registry using the following command:

   ```bash
    spectro registry login [REGISTRY_SERVER]
   ```

7. Using Spectro Cloud CLI push the newly built pack to the pack registry:

   ```bash
    spectro pack push permission-manager --registry-server [REGISTRY-SERVER]
   ```
