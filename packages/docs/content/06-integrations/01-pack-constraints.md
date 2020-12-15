---
title: "Pack Constraints"
metaTitle: "Pack Constraints"
metaDescription: "Description of pack constraints and their usages within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# About

Pack constraints are a set of rules defined at the pack level to validate the packs for a Profile or a Cluster *before* it gets created or updated. Packs must be validated before the cluster is submitted to ensure a successful deployment.

# Pack Values Constraints

A Spectro Pack currently supports various configurations through a configuration file called `values.yaml`. The values defined in the config file are applied while deploying the Kubernetes cluster. The values defined in the pack are default values and can be overridden in the Cluster Profile or during the Cluster deployment.

Since the default pack values can be overridden, users may inadvertently set incorrect values leading to cluster deployment failure. These failures can occur at any point during the cluster deployment process. If the system is capable of detecting invalid pack values before the cluster is submitted for deployment, then deployment failures can be overcome to some extent.

Pack value constraints are additional information provided through a template file called `schema.yaml` in the pack. They define the schema format of the pack values. The pack constraints framework auto-checks for any schema constraints defined in the pack and validates the pack values. This checking occurs while creating or updating Cluster Profiles and Clusters.

## Schema Constraints

Every schema constraint consists of a key name and the schema template. The key name must be the complete path of the parameter which is defined in the config file.

**Required**

Defines whether the pack value is optional or required.

```bash
registry.hostname:
 schema: '{{ required }}'
```

**Format**

Defines the pack value format: the value is valid only when the value format matches the format defined in the pack.

**Format Syntax**

A format template consists of one or more format types along with the optional regex and number range values.

```bash
registry.hostname:
  schema: '{{ required | format "${FORMAT_TYPE:/REGEX/ OR [NUMBER RANGE] OR [LIST_OPTIONS]}" }}'
```

<WarningBox>

The syntax of the regex accepted is the same general syntax used by Perl, Python, and other languages. More precisely, it is the syntax accepted by RE2 and described [here](https://golang.org/s/re2syntax).

</WarningBox>

**Format Types**

<Tabs identifier="Pack Constraints Format Types">

<Tabs.TabPane tab="string" key="pack_constraint_format_string">

The string format type checks if the input value is a string and supports the regex in the template. If regex is specified in the template then the input value must match the regex.

```bash
registry.hostname:
  schema: '{{ format "${string}" }}'
registry.hostname:
  schema: '{{ format "${string:/^([a-z0-9].*)$/}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="number" key="pack_constraint_format_number">

The number format type checks if the input value is a number, and supports the regex and the number range in the template.

```bash
registry.port:
  schema: '{{ format "${number}" }}'
registry.port:
  schema: '{{ format "${number:[5000-5005]}" }}'  
registry.port:
  schema: '{{ format "${number:/^(500[0-5])$/}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="boolean" key="pack_constraint_format_boolean">

The bool format type checks if the input value is true or false.

```bash
registry.private:
  schema: '{{ format "${boolean}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="password" key="pack_constraint_format_password">

The password format is a string type with masked values in the pack parameters of Cluster profiles and Clusters.

```bash
registry.password:
  schema: '{{ format "${password}" }}'
registry.password:
  schema: '{{ format "${password:/^([a-z0-9].*)$/}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="list" key="pack_constraint_format_list">

The list format checks if the input value matches with any of the options specified in the template.

```bash
registry.type:
 schema: '{{ format "${list:[PACK,GIT,CHART]}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="ipv4" key="pack_constraint_format_ipv4">

The ipv4 format type checks if the input value is a valid ipv4.

```bash
registry.hostIp:
  schema: '{{ format "${ipv4}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="version" key="pack_constraint_format_version">

The version format type checks if the input value is a semantic version.

```bash
registry.version:
  schema: '{{ required | format "${version}" }}'
```

</Tabs.TabPane>

<Tabs.TabPane tab="hints" key="pack_constraint_format_hints">

Hints are optional short descriptions of the parameter. If defined in the schema template, these descriptions are visible in the UI while configuring the pack parameters in the Profile or the Cluster. One or more descriptions can be combined by using the pipe(|) separator.

```bash
registry.type:
 schema: '{{ hints "description A" "description B" }}'
```

</Tabs.TabPane>

</Tabs>

**Examples**

Schema constraints can be combined to support multiple validations using a single template.

<Tabs identifier="Pack Constraints Examples">

<Tabs.TabPane tab="IP Range" key="pack_constraint_example_iprange">

```bash
registry.addresses.$[]:
 schema: '{{ required | format "${ipv4} - ${ipv4}" | hints "ip pool range"}}'
```

`registry.addresses.$[]` is an array data type in the config file. The schema template defines that the value is required and the format must match - `${ipv4} - ${ipv4}`

**Examples**:

10.10.10.10 - 10.10.10.255  → valid

10.10.10.10  → invalid

10.10.10.10-10.10.10.255  → invalid

</Tabs.TabPane>

<Tabs.TabPane tab="String regex" key="pack_constraint_example_stringregex">

```bash
storageType:
 schema: '{{ required | format "${string}, ${string:/size=\d+/}" }}'
```

**Examples**:

type-zeroedthick, size=150 → valid

type-zeroedthick, size=150 → invalid

type-zeroedthick, size=s → invalid

</Tabs.TabPane>

</Tabs>

# Pack Dependency Constraints

Spectro Cloud provides the flexibility to choose any pack of any version in the profile. Clusters are deployed based on the packs selected in the profile. While this works for most of the cases, it is sometimes required to select a minimum or maximum pack version, or to have dependencies between the packs to ensure the Kubernetes cluster is deployed successfully as desired.

Pack dependency constraints are the rules defined in the pack metadata file `pack.json`. They are used to define the minimum and maximum supported versions, and also to specify which pack is required or not supported. The pack constraints framework auto-checks for any schema constraints defined in the pack and validates the pack values. This checking occurs while creating or updating Cluster Profiles and Clusters.

## Pack metadata JSON

Pack dependency constraints must be defined in the `pack.json` file. The sample pack metadata shown below defines the dependencies under `constraints` key.

```json
{
  "addonType": "system app",
  "cloudTypes": [
    "all"
  ],
  "displayName": "Test Pack",
  "kubeManifests": [],
  "layer": "addon",
  "name": "pack-constraints-test",
  "version": "1.0.0",
  "constraints": {
    "dependencies": [
      {
        "packName": "vault",
        "minVersion": "0.6.0",
        "maxVersion": "",
        "type": "optional"
      },
      {
        "packName": "csi-vsphere-volume",
        "minVersion": "1.0.0",
        "maxVersion": "",
        "type": "notSupported"
      },
      {
        "packName": "kubernetes",
        "minVersion": "1.17.0",
        "maxVersion": "1.18.6",
        "type": "required"
      }
    ]
  }
}
```

<WarningBox>

If the minimum and maximum versions are not mentioned, the validation is skipped.

</WarningBox>

## Pack Dependency Attributes

<Tabs identifier="Pack Dependency Attributes">

<Tabs.TabPane tab="packName" key="pack_dependency_attribute_packName">

Name of the dependent pack.

**Example**: In the example, the three dependent packs are identified by unique pack names such as `vault`, `csi-vsphere-volume`, and `kubernetes`.

</Tabs.TabPane>

<Tabs.TabPane tab="minVersion" key="pack_dependency_attribute_minVersion">

Minimum supported dependent pack version, any version below the minimum version is not valid.

**Example**: pack `pack-constraints-test` must require pack `vault` of min version `0.6.0`.

</Tabs.TabPane>

<Tabs.TabPane tab="maxVersion" key="pack_dependency_attribute_maxVersion">

Maximum supported dependent pack version, any version above the maximum version is not valid.

**Example**: pack `pack-constraints-test` must require pack `kubernetes` of min version `1.18.6`.

</Tabs.TabPane>

<Tabs.TabPane tab="type" key="pack_dependency_attribute_type">

<Tabs identifier="Pack dependency types">

<Tabs.TabPane tab="optional" key="pack_dependency_optional">

The dependent pack is optional but validates minimum or maximum versions if the pack is selected.

**Example**: `vault` pack is optional.

</Tabs.TabPane>

<Tabs.TabPane tab="required" key="pack_dependency_required">

The dependent pack is mandatory and must contain a version within the minimum or maximum supported versions, if defined.

**Example**: `kubernetes` pack must be required of min version `1.17.0` and max version `1.18.6`. Any Kubernetes version below `1.17.0` and above `1.18.6` is not valid.

</Tabs.TabPane>

<Tabs.TabPane tab="notSupported" key="pack_dependency_notSupported">

Pack versions within the range of the mentioned minimum and maximum (including the minimum and maximum) are not supported.

**Example**: `csi-vsphere-volume` pack is not supported if the version selected falls within the min and max versions.

</Tabs.TabPane>

</Tabs>

</Tabs.TabPane>

</Tabs>

# Pack Resource Constraints

A successful Kubernetes Cluster deployment is possible only when the cluster has sufficient hardware requirements. We consider the CPU, Memory, and Disk size as the hardware requirements. The minimum resource requests can be varied depending on the workload to be deployed in the cluster. Spectro Cloud users are allowed to select the desired instance type, and the disk size while configuring the machine pool in the Cluster deployment procedure. If the user selects the instance type which does not satisfy the minimum CPU or Memory or Disk size requirements, then there is a high probability that the cluster deployment may not succeed due to insufficient CPU or Memory or Disk size.

Pack Resource Constraints are a set of rules defined in the pack metadata `pack.json` to specify the minimum CPU, Memory, and Disk size requirements. The pack constraints framework auto-checks the resource constraints and validates the user-selected instance type specifications before the cluster is submitted for deployment. The total input resource capacity is evaluated against the machine pool size with the actual hardware specifications of a selected instance type.

## Pack metadata JSON

Pack resource constraints must be defined in the `pack.json` file. The sample pack metadata is shown below to define the `resources` under `constraints` key.

```json
{
  "addonType": "system app",
  "cloudTypes": [
    "all"
  ],
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

<Tabs identifier="Pack Resource Attributes">

<Tabs.TabPane tab="type" key="pack_resources_type">

The type of resource

* cpu
* memory
* diskSize

</Tabs.TabPane>

<Tabs.TabPane tab="minLimit" key="pack_resources_minLimit">

The minimum limit of the resource will be considered during the machine pool validation. The resource limit value is required to have the below unit depending on the resource type. Any change of unit will cause inaccurate computation of the total minimum requirement.

* cpu  - millicore (m)
* memory - Mibibyte (Mi)
* diskSize - Gigabyte (GB)

</Tabs.TabPane>

<Tabs.TabPane tab="components" key="pack_resources_components">

The minLimit is the minimum resource requirement for each worker pool in the cluster. This value is sufficient for the basic resource validation, but in some cases where the pack contains one or more associated components, then each component can define its CPU or memory resource requests in the config file `values.yaml`. In this case, a single `minLimit` value is not sufficient as the minimum requirements can be different for each component.

<InfoBox>

If the components are defined then `minLimit` is ignored during resource validation.

</InfoBox>

The `components` field is an array of the component which consists of these attributes.

<Tabs identifier="Pack Resource Components">

<Tabs.TabPane tab="resourceRequestParamRef" key="pack_resources_resourceRequestParamRef">

Resource requests and limits can be defined in the pack `values.yaml`. It is required for the pack constraints framework to know the parameter name from where the resource request value can be read during the resource validation. So, the `resourceRequestParamRef` is the configuration parameter name of the resource request defined in the `values.yaml`.

</Tabs.TabPane>

<Tabs.TabPane tab="replicaCountParamRef" key="pack_resources_replicaCountParamRef">

The Kubernetes pod can run in one or more replicas based on the replica count configured in the `values.yaml` file. The resource request values defined in `values.yaml` are for one replica, and the requests must be multiplied by the number of replicas which gives the actual minimum requirement. So, the `replicaCountParamRef` is the configuration parameter name of the replica count defined in the `values.yaml`

</Tabs.TabPane>

<Tabs.TabPane tab="scheduleType" key="pack_resources_scheduleType">

Kubernetes provides a way to schedule the pods on master/worker nodes or both. Pack Constraints framework must know where the pods are scheduled because the resource validation validates only the master machine pool when the pods are scheduled on master nodes. Similarily, if the pods are scheduled on worker nodes, then only the worker machine pool will be validated. In the case of daemon sets, the pods are scheduled in both master and worker nodes, and the framework validates both master and worker machine pool configurations before the cluster is submitted for deployment.

* master - pods are scheduled only on master nodes
* worker - pods are scheduled only on worker nodes
* all -  pods are scheduled on both master and worker nodes

</Tabs.TabPane>

</Tabs>

</Tabs.TabPane>

</Tabs>

# Pack Presets

Pack Presets are the predefined values in a file called `presets.yaml` in the pack. It contains an array of the presets for the pack, and is visible in the pack parameters of the Cluster profile and the Cluster. Users can select any preset from the available pack presets, and the predefined values of a selected preset are applied automatically by the Spectro Cloud UI. Presets make pack configuration much easier as multiple pack values are updated at a time and the user does not need to understand all the configuration parameters which get changed depending on various factors.

## Presets Metadata YAML

This `presets.yaml` shows two presets

* `privatePackRegistry`
* `publicPackRegistry`

with a different set of pre-defined values.

```bash
presets:
- name: "privatePackRegistry"
  displayName: "Private Registry"
  group: "registry"
  remove: []
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
  remove: []
  add: |
    registry:
      private: false
      type: "PACK"
      host:
       ip: "13.233.2.255"
       port: 80
```

## Preset Attributes

<Tabs identifier="Preset Attributes">

<Tabs.TabPane tab="name" key="preset_attributes_name">

*Name of the preset.* It must be unique.

</Tabs.TabPane>

<Tabs.TabPane tab="displayName" key="preset_attributes_displayName">

*Name of the preset.* It is visible in the parameters configuration

</Tabs.TabPane>

<Tabs.TabPane tab="remove" key="preset_attributes_remove">

*An array of parameter names.* These are removed from the pack values when a preset is selected.

</Tabs.TabPane>

<Tabs.TabPane tab="add" key="preset_attributes_add">

*A set of values in YAML format.* These are added/updated in the pack values when a preset is selected.

</Tabs.TabPane>

<Tabs.TabPane tab="group" key="preset_attributes_group">

One or more presets can be categorized into a common group, but only one preset can be selected from the same group of presets.

</Tabs.TabPane>

</Tabs>

# Pack Macros

Pack macros are the variables defined in the Cluster profile or in Cluster pack values, and these variables are resolved only at the cluster deployment time.

## Types of Macros

<Tabs identifier="Pack Macros Types">

<Tabs.TabPane tab="System Macros" key="system_macros">

System macros are variables defined by the system. Users are allowed to use these variables and the system is capable of resolving all the variables to values at the time of cluster deployment.

<Tabs identifier="System Macros">

<Tabs.TabPane tab="Syntax" key="system_macros_syntax">

```bash
user:
 name: "{{ .spectro.system.[VARIABLE_NAME] }}"
```

**Supported Variables**

* user.name
* user.uid
* project.name
* project.uid
* clusterprofile.name
* clusterprofile.uid
* cluster.name
* cluster.uid

</Tabs.TabPane>

<Tabs.TabPane tab="Examples" key="system_macros_examples">

```bash
user:
 name: "{{ .spectro.system.user.name }}"
 uid: "{{ .spectro.system.user.uid}}"
```

</Tabs.TabPane>

</Tabs>

</Tabs.TabPane>

<Tabs.TabPane tab="Pack Reference Macros" key="pack_reference_macros">

Pack reference macros are custom variables that must be defined in a pack and then can be used as a variable in any pack. If the variable is not defined with a value, then the default value is applied, if specified. If the default value is not specified, then the variable will be resolved to an empty value.

<Tabs identifier="Pack Reference Macros">

<Tabs.TabPane tab="Syntax" key="reference_macros_syntax">

```bash
k8s:
 version: "{{ .spectro.pack.[PACK_NAME].[VARIABLE_NAME] }}"
```

`PACK_NAME` - the name of the pack where the variable is defined

`VARIABLE_NAME` - the fully qualified name of the variable defined in the pack

</Tabs.TabPane>

<Tabs.TabPane tab="Examples" key="reference_macros_examples">

Referencing Kubernetes pack variable version in CentOS pack values:

centos values.yaml

```bash
k8s:
 version: "{{ .spectro.pack.kubernetes.version }}"
```

kubernetes values.yaml

```bash
version: 1.18.0
```

</Tabs.TabPane>

</Tabs>

</Tabs.TabPane>

</Tabs>

## Additional Capabilities

### Sprig Template Functions

Users are allowed to use the [sprig template functions](http://masterminds.github.io/sprig/) to modify the resolved variable value.

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

<InfoBox>

If the variable `version` is not defined in the pack `kubernetes`, then the default value `1.19.0` will be applied at deployment. In case the default value is not specified then the empty value will be applied.

</InfoBox>
