---
title: "Adding a custom pack"
metaTitle: "Adding a custom pack"
metaDescription: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
---

# Add custom packs

Custom packs are built by users and deployed to custom registries using Spectro Cloud’s CLI tool.

# Steps to create a custom pack

1. Create a directory with a suitable name for all the pack contents. Example: `prmoetheus_1_0`
2. Create a metadata file named `pack.json` to describe the pack. Example:
    * An example of a `pack.json` is shown below:
    ```
    {
        "annotations": {
            "name": "value",
        },
        "ansibleRoles": [],
        "displayName": "<PACK_DISPLAY_NAME>",
        "eol": "2028-04-30",
        "group": "<PACK_GROUP>",
        "kubeManifests": [
            "manifests/deployment.yaml"
        ],
        "layer": "<LAYER>",
        "name": "<PACK_NAME>",
        "version": "<PACK_VERSION>"
    }
    ```

An explanation for the parameters of the JSON is given in the table below:

| Property Name | Data type | Required | Description |
| --- | --- | --- | --- |
| name | String | True | Name of the pack |
| displayName | String | True | Name of the pack as it is to be displayed on the Spectro Cloud Dashboard |
| layer | String | True | Pack type like os, k8s, cni, csi, addon |
| version | String | True | Pack version |
| cloudTypes | Array | True | Supported cloud types like aws, azure, vmware, all |
| group | String | False | Packs having the same names can be grouped together |
| annotations | Array | False | Optional key-value pairs required during pack installation |
| eol | String | False | Pack expiry date |
| kubeManifests | Array | False | Reference to the Kubernetes manifest files |
| ansibleRoles | Array | False | Reference to the Ansible roles |

3. Create a file named “values.yaml”. This file consists of configurable parameters that need to be exposed to the end users during creation of a cluster profile. Parameters for all charts, manifests and Ansible roles defined in the pack are defined in this file. Helm charts natively support values override. Any values defined are merged with those defined within a chart. Manifests and Ansible roles need to be explicitly templatized if parameter configuration is desired.
```
pack:
  namespace : <default namespace for charts and manifests>
charts:
  chart1:
    <configurable chart1 parameters>
  chart2:
    <configurable chart2 parameters>
manifests:
  manifest1:
  	<templatized manifest1 parameters>
  manifest2:
  	<templatized manifest2 parameters>
ansibleRoles:
  role1:
    <templatized role1 parameters>
  role2:
  	<templatized role2 parameters>
```

4. A pack must have the logo file named `logo.png` and must be copied into the pack directory.
5. Push the newly defined pack to the registry using the following command:

```
$spectro pack push [PACK_DIR_LOCATION] --registry-server [REGISTRY_SERVER]
```

6. To overwrite contents of a previously deployed pack, use the force option as follows:

```
$spectro pack push [PACK_DIR_LOCATION] -f --registry-server [REGISTRY_SERVER]
```

# Adding an OS Pack

The OS is one of the core layers in a cluster profile. An OS pack can be built to use a custom OS image for cluster nodes. This might be desirable if an organization wants to use an approved hardened OS image for their infrastructure. There are typically the following two scenarios for the OS image:

1. Pre-Installed K8s - The OS image has the desired version of kubernetes components like kubelet, kubectl etc installed.
2. Vanilla OS Image - Kubernetes components are not installed.

Additionally, for both the scenarios additional components or packages may need to be installed at runtime to prepare the final OS image. The following are a few examples of building custom OS pack to cover the some of these scenarios.

A few sample pack manifests for building a custom OS pack are shown below. These are examples for images that do not have Kubernetes components pre-installed. Spectro Cloud installs these components at the time of provisioning. The version of Kubernetes that gets installed depends on the Kubernetes pack configuration in the cluster profile. If Kubernetes is pre-installed in the image, the flag `skipK8sInstall` should be set to true.

# Example 1 - AWS Custom-OS Pack

```
{
    "annotations": {
        "cloudRegion": "us-east-1", 
        "imageId": "ami-071f6fc516c53fca1", 
        "imageOwner": "421085264799", 
        "osName": "centos", 
        "os_spectro_version": "0", 
        "sshUsername": "centos",
        "skipK8sInstall": "false"
    }, 
    "ansibleRoles": [
        "harden_os"
    ], 
    "cloudTypes": ["aws"], 
    "displayName": "CentOS", 
    "eol": "2024-06-30", 
    "group": "", 
    "kubeManifests": [], 
    "layer": "os", 
    "name": "golden-centos-aws", 
    "version": "7.7.1908"
}
```

# Example 2 - VMWare Custom OS Pack - Local Image

```
{
    "annotations": {
        "folder": "spectro-templates", 
        "imageId": "/Datacenter/vm/spectro-templates/base-images/centos-7-vanilla-with-vm-tools", 
        "osName": "centos", 
        "os_spectro_version": "0", 
        "sshPassword": "password", 
        "sshUsername": "root",
        "skipK8sInstall": "false"
    }, 
    "ansibleRoles": [
        "harden_os"
    ], 
    "cloudTypes": ["vsphere"], 
    "displayName": "CentOS", 
    "eol": "2024-06-30", 
    "group": "", 
    "kubeManifests": [], 
    "layer": "os", 
    "name": "golden-centos-vsphere", 
    "version": "7.7.1908"
}
```

# Example 3 - VMWare Custom OS Pack - Remote Image

```
{
    "annotations": {
        "folder": "spectro-templates", 
        "imageId": "https://cloud-images.ubuntu.com/releases/18.04/release/ubuntu-18.04-server-cloudimg-amd64.ova", 
        "osName": "ubuntu", 
        "os_spectro_version": "0", 
        "sshUsername": "ubuntu",
        "skipK8sInstall": "false"
    }, 
    "ansibleRoles": [
        "harden_os"
    ], 
    "cloudTypes": ["vsphere"], 
    "displayName": "Ubuntu", 
    "eol": "2028-04-30", 
    "group": "LTS", 
    "kubeManifests": [], 
    "layer": "os", 
    "name": "golden-ubuntu-vsphere", 
    "version": "18.04.4"
}
```

# Example 4 - Azure Custom OS Pack

```
{
    "annotations": {
        "imageOffer": "CentOS", 
        "imagePublisher": "OpenLogic", 
        "imageSKU": "7.7", 
        "osName": "centos", 
        "os_spectro_version": "0", 
        "sshUsername": "centos",
        "skipK8sInstall": "true"
    }, 
    "ansibleRoles": [
        "harden_os"
    ], 
    "cloudTypes": ["azure"], 
    "displayName": "CentOS", 
    "eol": "2024-06-30", 
    "group": "", 
    "kubeManifests": [], 
    "layer": "os", 
    "name": "golden-centos-azure", 
    "version": "7.7.1908"
}
```

In all the examples above, additional customization in the form of an Ansible role called `harden_os` is specified in the pack manifest. The tasks and other files for the implementation of this role need to be included in the pack. The final directory structure of for the pack would be as follows:
```
./pack.json
./logo.png
./values.yaml
./harden_os
./harden_os/tasks
./harden_os/tasks/main.yml
./harden_os/files
./harden_os/files/sec_harden.sh
```

Ansible roles are optional and only required if additional runtime customization is required. Once an OS pack is constructed, push it to the pack registry using the Spectro CLI tool.

> A `values.yaml` file is mandatory for every pack. For an OS pack, there are typically no configurable parameters, but an empty file still needs to be added to the OS pack.
>
> During the image customization phase of a cluster deployment, failures related to missing packages or package version mismatch might occur when using a custom OS pack. These errors are presented on the console. The image needs to updated to resolve any such issues.

# Add-on packs using helm charts

An add-on pack defines deployment specifics of a kubernetes application to be installed on a running Kubernetes cluster. Spectro Cloud provides several add-on packs out of the box for various layers of the kubernetes stack. For example:

Logging  - elastic search, fluentd

Monitoring -  kubernetes dashboard, prometheus

Load Balancers - Citrix

Security  - Dex, Vault, Permissions manager), 

Service Mesh - Istio

Custom add-on packs can be built to extend the list of integrations.

The following example shows how build the Prometheus-Grafana monitoring pack and push to a pack registry server using the Spectro Cloud CLI:

1. Create the pack directory named "prometheus-grafana"
2. Create the metadata file named `pack.json`.
```
{
    "addonType": "monitoring",
    "annotations": {
    },
    "ansibleRoles": [
    ],
    "cloudTypes": ["all"],
    "displayName": "Prometheus-Grafana",
    "eol": " ",
    "group": " ",
    "kubeManifests": [
    ],
    "charts": [
        "charts/prometheus-grafana.tgz"
    ],
    "layer":"addon",
    "name": "prometheus-grafana",
    "version": "9.7.2"
}
```

3. Download the desired version of prometheus-grafana helm charts archive.
4. Create a sub-directory called ‘charts’ and copy the downloaded helm chart archive to this directory.  Refer to the relative location of this archive in the pack manifest file, pack.json as shown the step 2.
5. Create a file called ‘values.yaml’ for configurable chart parameters. This can be a subset of the values.yaml file shipped within the chart. Copy the entire file as is if all chat parameters need to be made configurable. For the promethus-grafana pack, the values.yaml could look like this:-
```
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
        #           {{ range .Labels.SortedPairs }} • *{{ .Name }}:* `{{ .Value }}`
        #           {{ end }}

        ingress:
            enabled: false
    ...
```

6. Using Spectro CLI, push the newly built pack to the pack registry:

```
$spectro pack push prometheus-grafana --registry-server [REGISTRY-SERVER]
```


# Add-on packs using manifests

Add-on packs can be built using Kubernetes manifests. These manifest contain deployment specifications for Kuberntes objects like pods, services, deployments, namespaces, secrets etc.

The example below shows how to build the Permission Manager auth pack and push to the pack registry server using the Spectro Cloud CLI.

1. Create the pack directory named `permission-manager`.
2. Create the metadata file named `pack.json`.
```
{
  "addonType":"authentication",
  "cloudTypes": ["all"],
  "displayName": "Permission Manager",
  "kubeManifests": [
    "manifests/permission-manager.yaml"
  ],
  "layer": "addon",
  "name": "permission-manager",
  "version": "1.0.0"
}
```

3. Create a sub-directory called `manifests`.
4. Copy the desired manifest files to the `manifests` directory and reference them in `pack.json` as shown in step 2. If configurability of the manifest is desired, then the manifest files must be templatized to introduce parameters, for example, *{{ .Values.namespace}}*. These parameters are defined with default values in the `values.yaml` file and can be overridden in the cluster profile.

permission-manager.yaml (partial)
```
---

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

5.  Create a file called “values.yaml” to provide configurable manifest parameters.

values.yaml
```
manifests:
  permission-manager:
  
    #Namespace under which permission-manager will be deployed
    namespace: "permission-manager"

    #Login password for permission-manager
    authPassword: "welcome123"
```

6. Using Spectro Cloud CLI  push the newly built pack to the pack registry:

```
$spectro pack push permission-manager --registry-server [REGISTRY-SERVER]
```
