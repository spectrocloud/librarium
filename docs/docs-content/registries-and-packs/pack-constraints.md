---
sidebar_label: "Pack Constraints"
title: "Pack Constraints"
description: "Description of pack constraints and their usages within Spectro Cloud"
icon: ""
hide_table_of_contents: false
sidebar_position: 50
---

Pack constraints are a set of rules defined at the pack level to validate the packs for a Profile or a Cluster _before_
it gets created or updated. Packs must be validated before the cluster is submitted to ensure a successful deployment.

<br />

:::info

You can find information about the JSON schema for the pack metadata file in the
[JSON schema](add-custom-packs.md#json-schema) section of the documentation.

:::

## Pack Values Constraints

A Spectro Pack currently supports various configurations through a configuration file called `values.yaml`. The values
defined in the config file are applied while deploying the Kubernetes cluster. The values defined in the pack are
default values and can be overridden in the Cluster Profile or during the Cluster deployment.

Since the default pack values can be overridden, users may inadvertently set incorrect values leading to cluster
deployment failure. These failures can occur at any point during the cluster deployment process. If the system is
capable of detecting invalid pack values before the cluster is submitted for deployment, then deployment failures can be
overcome to some extent.

Pack value constraints are additional information provided through a template file called `schema.yaml` in the pack.
They define the schema format of the pack values. The pack constraints framework auto-checks for any schema constraints
defined in the pack and validates the pack values. This checking occurs while creating or updating Cluster Profiles and
Clusters.

## Schema Constraints

Every schema constraint consists of a key name and the schema template. The key name must be the complete path of the
parameter which is defined in the config file.

**Required**

Defines whether the pack value is optional or required.

```bash
registry.hostname:
 schema: '{{ required }}'
```

**Read only**

The pack value is not editable if marked as read only.

```bash
registry.hostname:
 schema: '{{ readonly }}'
```

**Format**

Defines the pack value format: the value is valid only when the value format matches the format defined in the pack.

**Format Syntax**

A format template consists of one or more format types along with the optional regex and number range values.

```bash
registry.hostname:
  schema: '{{ required | format "${FORMAT_TYPE:/REGEX/ OR [NUMBER RANGE] OR [LIST_OPTIONS]}" }}'
```

:::warning

The syntax of the regex accepted is the same general syntax used by Perl, Python, and other languages. More precisely,
it is the syntax accepted by RE2 and described [here](https://golang.org/s/re2syntax).

:::

**Format Types**

<Tabs queryString="Pack Constraints Format Types">

<TabItem label="string" value="pack_constraint_format_string">

The string format type checks if the input value is a string and supports the regex in the template. If regex is
specified in the template then the input value must match the regex.

```bash
registry.hostname:
  schema: '{{ format "${string}" }}'
registry.hostname:
  schema: '{{ format "${string:/^([a-z0-9].*)$/}" }}'
```

</TabItem>

<TabItem label="number" value="pack_constraint_format_number">

The number format type checks if the input value is a number, and supports the regex and the number range in the
template.

```bash
registry.port:
  schema: '{{ format "${number}" }}'
registry.port:
  schema: '{{ format "${number:[5000-5005]}" }}'
registry.port:
  schema: '{{ format "${number:/^(500[0-5])$/}" }}'
```

</TabItem>

<TabItem label="boolean" value="pack_constraint_format_boolean">

The bool format type checks if the input value is true or false.

```bash
registry.private:
  schema: '{{ format "${boolean}" }}'
```

</TabItem>

<TabItem label="password" value="pack_constraint_format_password">

The password format is a string type with masked values in the pack parameters of Cluster profiles and Clusters.

```bash
registry.password:
  schema: '{{ format "${password}" }}'
registry.password:
  schema: '{{ format "${password:/^([a-z0-9].*)$/}" }}'
```

</TabItem>

<TabItem label="list" value="pack_constraint_format_list">

The list format checks if the input value matches with any of the options specified in the template.

```bash
registry.type:
 schema: '{{ format "${list:[PACK,GIT,CHART]}" }}'
```

</TabItem>

<TabItem label="ipv4" value="pack_constraint_format_ipv4">

The ipv4 format type checks if the input value is a valid ipv4.

```bash
registry.hostIp:
  schema: '{{ format "${ipv4}" }}'
```

</TabItem>

<TabItem label="version" value="pack_constraint_format_version">

The version format type checks if the input value is a semantic version.

```bash
registry.version:
  schema: '{{ required | format "${version}" }}'
```

</TabItem>

<TabItem label="hints" value="pack_constraint_format_hints">

Hints are optional short descriptions of the parameter. If defined in the schema template, these descriptions are
visible in the UI while configuring the pack parameters in the Profile or the Cluster. One or more descriptions can be
combined by using the pipe(|) separator.

```bash
registry.type:
 schema: '{{ hints "description A" "description B" }}'
```

</TabItem>

</Tabs>

**Examples**

Schema constraints can be combined to support multiple validations using a single template.

<Tabs queryString="Pack Constraints Examples">

<TabItem label="IP Range" value="pack_constraint_example_iprange">

```bash
registry.addresses.$[]:
 schema: '{{ required | format "${ipv4} - ${ipv4}" | hints "ip pool range"}}'
```

`registry.addresses.$[]` is an array data type in the config file. The schema template defines that the value is
required and the format must match - `${ipv4} - ${ipv4}`

**Examples**:

10.10.10.10 - 10.10.10.255 → valid

10.10.10.10 → invalid

10.10.10.10-10.10.10.255 → invalid

</TabItem>

<TabItem label="String regex" value="pack_constraint_example_stringregex">

```bash
storageType:
 schema: '{{ required | format "${string}, ${string:/size=\d+/}" }}'
```

**Examples**:

type-zeroedthick, size=150 → valid

type-zeroedthick, size=150 → invalid

type-zeroedthick, size=s → invalid

</TabItem>

</Tabs>

## Pack Dependency Constraints

Spectro Cloud provides the flexibility to choose any pack of any version in the profile. Clusters are deployed based on
the packs selected in the profile. While this works for most of the cases, it is sometimes required to select a minimum
or maximum pack version, or to have dependencies between the packs to ensure the Kubernetes cluster is deployed
successfully as desired.

Pack dependency constraints are the rules defined in the pack metadata file `pack.json`. They are used to define the
minimum and maximum supported versions, and also to specify which pack is required or not supported. The pack
constraints framework auto-checks for any schema constraints defined in the pack and validates the pack values. This
checking occurs while creating or updating Cluster Profiles and Clusters.

## Pack metadata JSON

Pack dependency constraints must be defined in the `pack.json` file. The sample pack metadata shown below defines the
dependencies under `constraints` key.

```json
{
  "addonType": "system app",
  "cloudTypes": ["all"],
  "displayName": "Test Pack",
  "kubeManifests": [],
  "layer": "addon",
  "name": "pack-constraints-test",
  "version": "1.0.0",
  "constraints": {
    "dependencies": [
      {
        "packName": "vault",
        "layer": "addon",
        "minVersion": "0.6.0",
        "maxVersion": "",
        "type": "optional"
      },
      {
        "packName": "csi-vsphere-volume",
        "layer": "csi",
        "minVersion": "1.0.0",
        "maxVersion": "",
        "type": "notSupported"
      },
      {
        "packName": "kubernetes",
        "layer": "k8s",
        "minVersion": "1.17.0",
        "maxVersion": "1.18.6",
        "type": "required"
      }
    ]
  }
}
```

:::warning

If the minimum and maximum versions are not mentioned, the validation is skipped.

:::

## Pack Dependency Attributes

A pack can have one or more dependencies defined in the `dependencies` array. Each dependency consists of the following
attributes.

| Attribute    | Description                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| `packName`   | Name of the dependent pack.                                                                                    |
| `layer`      | The layer type of the dependent pack. Refer to the [Layer Types](#layer-types) section to learn more.          |
| `minVersion` | Minimum supported dependent pack version, any version below the minimum version is not valid.                  |
| `maxVersion` | Maximum supported dependent pack version, any version above the maximum version is not valid.                  |
| `type`       | The defined type for the dependency. Refer to the [Dependency Types](#dependency-types) section to learn more. |

In the example code snippet from earlier, the three dependent packs are identified by unique pack names such as `vault`,
`csi-vsphere-volume`, and `kubernetes`. A `minVersion`, `maxVersion`, and `type` are defined for each dependent pack.

```json {3,10,17} hideClipboard
"dependencies": [
    {
      "packName": "vault",
      "layer": "addon",
      "minVersion": "0.6.0",
      "maxVersion": "",
      "type": "optional"
    },
    {
      "packName": "csi-vsphere-volume",
      "layer": "csi",
      "minVersion": "1.0.0",
      "maxVersion": "",
      "type": "notSupported"
    },
    {
      "packName": "kubernetes",
      "layer": "k8s",
      "minVersion": "1.17.0",
      "maxVersion": "1.18.6",
      "type": "required"
    }
  ]
```

#### Layer Types

The `layer` attribute defines the layer where the dependent pack can be found in the Cluster Profile. The following
table lists the different layer types.

<!-- prettier-ignore-start -->

| Layer   | Description                                                                                                                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `os`    | The dependent pack can only be found in the operating system layer of the Cluster Profile. The `os` layer contains packs such as Ubuntu, CentOS or Bring Your Own OS (BYOOS).                                    |
| `k8s`   | The dependent pack can only be found in the Kubernetes layer of the Cluster Profile. The `k8s` layer contains packs such as <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" />, RKE2, k3s or MicroK8s. |
| `cni`   | The dependent pack can only be found in the network layer of the Cluster Profile. The `cni` layer contains packs such as Calico, Cilium, Flannel and Antrea.                                                     |
| `csi`   | The dependent pack can only be found in the storage layer of the Cluster Profile. The `csi` layer contains packs such as vSphere CSI, Amazon EBS CSI, Amazon EFS, Azure Disk and Portworx.                       |
| `addon` | The dependent pack can only be found in the add-on layers of the Cluster Profile. The types of packs include `logging`, `monitoring`, `load balancer`, `authentication`, `ingress`, `security`, `ai`, `app services`, `network`, `storage`, `registry`, `servicemesh`, and `system app`. The `addon` layer contains packs such as ArgoCD, Vault, Nginx, and many more.                                                  |

<!-- prettier-ignore-end -->

#### Dependency Types

The `type` attribute defines the type of dependency. The following table lists the different dependency types.

| Type           | Description                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `optional`     | The dependent pack is optional but validates minimum or maximum versions if the pack is selected. In the example, the `vault` pack is optional.                                                                                                                                                                     |
| `required`     | The dependent pack is mandatory and must contain a version within the minimum or maximum supported versions, if defined. In the example, the `kubernetes` pack is required with a minimum version of `1.17.0` and a max version of `1.18.6`. Any Kubernetes version below `1.17.0` and above `1.18.6` is not valid. |
| `notSupported` | The pack versions within the range of the mentioned minimum and maximum are not supported. The `csi-vsphere-volume` pack is not supported if the version selected falls within the min and max versions.                                                                                                            |

## Pack Resource Constraints

A successful Kubernetes Cluster deployment is possible only when the cluster has sufficient hardware requirements. We
consider the CPU, Memory, and Disk size as the hardware requirements. The minimum resource requests can be varied
depending on the workload to be deployed in the cluster. Spectro Cloud users are allowed to select the desired instance
type, and the disk size while configuring the machine pool in the Cluster deployment procedure. If the user selects the
instance type which does not satisfy the minimum CPU or Memory or Disk size requirements, then there is a high
probability that the cluster deployment may not succeed due to insufficient CPU or Memory or Disk size.

Pack Resource Constraints are a set of rules defined in the pack metadata `pack.json` to specify the minimum CPU,
Memory, and Disk size requirements. The pack constraints framework auto-checks the resource constraints and validates
the user-selected instance type specifications before the cluster is submitted for deployment. The total input resource
capacity is evaluated against the machine pool size with the actual hardware specifications of a selected instance type.

## Pack metadata JSON

Pack resource constraints must be defined in the `pack.json` file. The sample pack metadata is shown below to define the
`resources` under `constraints` key.

```json
{
  "addonType": "system app",
  "cloudTypes": ["all"],
  "displayName": "Test Pack",
  "kubeManifests": [],
  "layer": "addon",
  "name": "pack-constraints-test",
  "version": "1.0.0",
  "constraints": {
    "resources": [
      {
        "type": "cpu",
        "minLimit": 2000,
        "components": [
          {
            "resourceRequestParamRef": "requests.cpu",
            "replicaCountParamRef": "replicas",
            "scheduleType": "all"
          }
        ]
      },
      {
        "type": "memory",
        "minLimit": 2048,
        "components": [
          {
            "resourceRequestParamRef": "requests.memory",
            "replicaCountParamRef": "replicas",
            "scheduleType": "worker"
          }
        ]
      },
      {
        "type": "diskSize",
        "minLimit": 10
      }
    ]
  }
}
```

## Pack Resources Attributes

<Tabs queryString="Pack Resource Attributes">

<TabItem label="type" value="pack_resources_type">

The type of resource

- CPU
- Memory
- Disk size

</TabItem>

<TabItem label="minimum limit" value="pack_resources_minLimit">

The minimum limit of the resource will be considered during the machine pool validation. The resource limit value is
required to have the below unit depending on the resource type. Any change of unit will cause inaccurate computation of
the total minimum requirement.

- CPU - Millicore (m)
- Memory - Mibibyte (Mi)
- Disk size - Gigabyte (GB)

</TabItem>

<TabItem label="components" value="pack_resources_components">

The minimum limit is the minimum resource requirement for each worker pool in the cluster. This value is sufficient for
the basic resource validation, but in some cases where the pack contains one or more associated components, then each
component can define its CPU or memory resource requests in the config file `values.yaml`. In this case, a single
`minLimit` value is not sufficient as the minimum requirements can be different for each component.

:::info

If the components are defined then `minLimit` is ignored during resource validation.

:::

The `components` field is an array of the component which consists of these attributes.

<Tabs queryString="Pack Resource Components">

<TabItem label="resourceRequestParamRef" value="pack_resources_resourceRequestParamRef">

Resource requests and limits can be defined in the pack `values.yaml`. It is required for the pack constraints framework
to know the parameter name from where the resource request value can be read during the resource validation. So, the
`resourceRequestParamRef` is the configuration parameter name of the resource request defined in the `values.yaml`.

</TabItem>

<TabItem label="replicaCountParamRef" value="pack_resources_replicaCountParamRef">

The Kubernetes pod can run in one or more replicas based on the replica count configured in the `values.yaml` file. The
resource request values defined in `values.yaml` are for one replica, and the requests must be multiplied by the number
of replicas which gives the actual minimum requirement. So, the `replicaCountParamRef` is the configuration parameter
name of the replica count defined in the `values.yaml`

</TabItem>

<TabItem label="scheduleType" value="pack_resources_scheduleType">

Kubernetes provides a way to schedule the pods on the control plane and worker nodes. Pack Constraints framework must
know where the pods are scheduled because the resource validation validates only the control plane machine pool when the
pods are scheduled on control plane nodes. Similarly, if the pods are scheduled on worker nodes, then only the worker
machine pool will be validated. In the case of daemon sets, the pods are scheduled in both control plane and worker
nodes, and the framework validates both control plane and worker machine pool configurations before the cluster is
submitted for deployment.

- `control-plane` - pods are scheduled only on control plane nodes
- `worker` - pods are scheduled only on worker nodes
- `all` - pods are scheduled on both control plane and worker nodes

</TabItem>

</Tabs>

</TabItem>

</Tabs>

## Pack Presets

Pack Presets are the predefined values in a file called `presets.yaml` in the pack. It contains an array of the presets
for the pack, and is visible in the pack parameters of the Cluster profile and the Cluster. Users can select any preset
from the available pack presets, and the predefined values of a selected preset are applied automatically by the Spectro
Cloud UI. Presets make pack configuration much easier as multiple pack values are updated at a time and the user does
not need to understand all the configuration parameters which get changed depending on various factors.

## Presets Metadata YAML

This `presets.yaml` shows two presets

- `privatePackRegistry`
- `publicPackRegistry`

with a different set of pre-defined values.

```bash
presets:
- name: "privatePackRegistry"
  displayName: "Private Registry"
  group: "registry"
  remove: ["registry.ingress.host"]
  add: |
    registry:
      private: true
      type: "PACK"
      host:
       ip: "127.0.0.1"
       port: 5000
- name: "publicPackRegistry"
  displayName: "Public Registry"
  group: "registry"
  remove: ["registry.ingress.host"]
  add: |
    registry:
      private: false
      type: "PACK"
      host:
       ip: "13.233.2.255"
       port: 80
```

## Preset Attributes

<Tabs queryString="Preset Attributes">

<TabItem label="name" value="preset_attributes_name">

_Name of the preset._ It must be unique.

</TabItem>

<TabItem label="displayName" value="preset_attributes_displayName">

_Name of the preset._ It is visible in the parameters configuration

</TabItem>

<TabItem label="remove" value="preset_attributes_remove">

_An array of parameter names._ These are removed from the pack values when a preset is selected.

</TabItem>

<TabItem label="add" value="preset_attributes_add">

_A set of values in YAML format._ These are added/updated in the pack values when a preset is selected.

</TabItem>

<TabItem label="group" value="preset_attributes_group">

One or more presets can be categorized into a common group, but only one preset can be selected from the same group of
presets.

</TabItem>

</Tabs>

## Pack Macros

Pack macros are the variables defined in the Cluster profile or in Cluster pack values, and these variables are resolved
only at the cluster deployment time.

## Types of Macros

<Tabs queryString="Pack Macros Types">

<TabItem label="System Macros" value="system_macros">

System macros are variables defined by the system. Users are allowed to use these variables and the system is capable of
resolving all the variables to values at the time of cluster deployment.

<Tabs queryString="System Macros">

<TabItem label="Syntax" value="system_macros_syntax">

```bash
user:
 name: "{{ .spectro.system.[VARIABLE_NAME] }}"
```

### Supported Variables

| Macro                                              | Description                                                                                                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{{.spectro.system.user.name}}`                    | The name of the user currently logged in.                                                                                                                                      |
| `{{.spectro.system.user.uid}}`                     | The unique identifier of the user currently logged in.                                                                                                                         |
| `{{.spectro.system.user.email}}`                   | The email address of the user currently logged in.                                                                                                                             |
| `{{.spectro.system.tenant.uid}}`                   | The unique identifier of the current tenant.                                                                                                                                   |
| `{{.spectro.system.project.name}}`                 | The name of the project.                                                                                                                                                       |
| `{{.spectro.system.project.uid}}`                  | The unique identifier of the project.                                                                                                                                          |
| `{{.spectro.system.clusterprofile.name}}`          | The name of the cluster profile associated with the current project.                                                                                                           |
| `{{.spectro.system.clusterprofile.uid}}`           | The unique identifier of the cluster profile the pack is part of.                                                                                                              |
| `{{.spectro.system.clusterprofile.version}}`       | The current version of the cluster profile the pack is part of.                                                                                                                |
| `{{.spectro.system.cluster.name}}`                 | The name of the cluster.                                                                                                                                                       |
| `{{.spectro.system.cluster.uid}}`                  | The unique identifier of the cluster.                                                                                                                                          |
| `{{.spectro.system.cloudaccount.name}}`            | The name of the cloud account associated with the current project.                                                                                                             |
| `{{.spectro.system.cloudaccount.uid}}`             | The unique identifier of the cloud account associated with the current project.                                                                                                |
| `{{.spectro.system.kubernetes.version}}`           | The version of Kubernetes currently running on the cluster.                                                                                                                    |
| `{{.spectro.system.reverseproxy.server}}`          | The hostname of the reverse proxy server.                                                                                                                                      |
| `{{.spectro.system.reverseproxy.port}}`            | The port number of the reverse proxy server.                                                                                                                                   |
| `{{.spectro.system.reverseproxy.protocol}}`        | The protocol used by the reverse proxy server, either HTTP or HTTPS.                                                                                                           |
| `{{.spectro.system.reverseproxy.vhostport}}`       | The port number used by the virtual host on the reverse proxy server.                                                                                                          |
| `{{.spectro.system.cloud.type }}`                  | The type of cloud provider being used, such as AWS, GCP, Azure or other providers.                                                                                             |
| `{{.spectro.system.cloud.region }}`                | The region where the cloud resources are located.                                                                                                                              |
| `{{.spectro.system.clusterprofile.infra.name}}`    | The name of the cluster profile.                                                                                                                                               |
| `{{.spectro.system.clusterprofile.infra.uid}}`     | The unique identifier of the cluster profile.                                                                                                                                  |
| `{{.spectro.system.clusterprofile.infra.version}}` | The version of the cluster profile.                                                                                                                                            |
| `{{.spectro.system.cluster.kubevip}}`              | The IP address of the virtual IP (VIP) assigned to the cluster and load balancer for the control plane. This macro is only available for Edge and vSphere cluster deployments. |

</TabItem>

<TabItem label="Examples" value="system_macros_examples">

```bash
user:
 name: "{{ .spectro.system.user.name }}"
 uid: "{{ .spectro.system.user.uid}}"
```

</TabItem>

</Tabs>

</TabItem>

<TabItem label="Pack Reference Macros" value="pack_reference_macros">

Pack reference macros are custom variables that must be defined in a pack and then can be used as a variable in any
pack. If the variable is not defined with a value, then the default value is applied, if specified. If the default value
is not specified, then the variable will be resolved to an empty value.

<Tabs queryString="Pack Reference Macros">

<TabItem label="Syntax" value="reference_macros_syntax">

```bash
k8s:
 version: "{{ .spectro.pack.[PACK_NAME].[VARIABLE_NAME] }}"
```

`PACK_NAME` - the name of the pack where the variable is defined

`VARIABLE_NAME` - the fully qualified name of the variable defined in the pack

</TabItem>

<TabItem label="Examples" value="reference_macros_examples">

Referencing Kubernetes pack variable version in CentOS pack values:

```bash title="CentOS values.yaml"
k8s:
 version: "{{ .spectro.pack.kubernetes.version }}"
```

```bash title="Kubernetes values.yaml"
version: 1.18.0
```

</TabItem>

</Tabs>

</TabItem>

</Tabs>

## Additional Capabilities

### Sprig Template Functions

Users are allowed to use the [sprig template functions](http://masterminds.github.io/sprig/) to modify the resolved
variable value.

**Examples**

```bash
user:
 name: "{{ .spectro.system.user.name | upper }}"
```

`upper` - sprig template function which converts resolved user name to upper case

### How to set the default value?

```bash
k8s:
 version: "{{ .spectro.pack.kubernetes.version | default \"1.19.0\"}}"
```

:::info

If the variable `version` is not defined in the pack `kubernetes`, then the default value `1.19.0` will be applied at
deployment. In case the default value is not specified then the empty value will be applied.

:::
