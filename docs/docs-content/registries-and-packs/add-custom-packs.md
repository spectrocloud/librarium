---
sidebar_label: "Add a Custom Pack"
title: "Add a Custom Pack"
description: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
---

# Add a Custom Pack

Custom packs are built by users and deployed to custom registries using the Spectro Cloud CLI tool. To get started with
Spectro Cloud CLI, review the Spectro Cloud CLI installation [instructions](spectro-cli-reference.md).

## Prerequsites

The following items are required to create a custom pack.

- [Spectro Cloud CLI](spectro-cli-reference.md)
- A Spectro Cloud [account](https://www.spectrocloud.com/)
- [Custom Pack registry](adding-a-custom-registry.md)

## JSON Schema

Each pack contains a metadata file named `pack.json`. The table below explains in greater detail the JSON schema
attributes.

| Property Name | Data type | Required | Description                                                                                                                                                                                                                                                                                                                               |
| ------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | String    | True     | Name of the pack                                                                                                                                                                                                                                                                                                                          |
| displayName   | String    | True     | Name of the pack as it is to be displayed on the Palette management console.                                                                                                                                                                                                                                                              |
| layer         | String    | True     | Relevant layer that this pack should be part of; such as os, k8s, cni, csi, addon                                                                                                                                                                                                                                                         |
| addonType     | String    | False    | Addon-type must be set for packs that have the layer set to Addon. The value must be one of the following: logging, monitoring, load balancer, authentication, ingress, security. Setting a relevant correct addon type ensures packs are organized correctly on the management console making it easy for profile authors to find packs. |
| version       | String    | True     | A Semantic version for the pack. It is recommended that the pack version be the same as the underlying integration it is being created for. For example, the version for the pack that will install Prometheus 2.3.4, should set to 2.3.4.                                                                                                |
| cloudTypes    | Array     | True     | You can provide one or more types for a pack. Supported values are as follows: <br /><br />**all**, **aws**, **azure**, **gcp**, **tencent**, **vsphere**, **openstack**, **baremetal**, **maas**, **aks**, **eks**, **tke**, **edge**, **edge-native**, **coxedge**, and **libvirt** (virtualized edge).                                 |
| group         | String    | False    | Optional categorization of packs. For example, LTS can be set for Ubuntu OS packs.                                                                                                                                                                                                                                                        |
| annotations   | Array     | False    | Optional key-value pairs required during pack installation. Typically, custom packs do not need to set annotations. Some packs like the ones for OS require annotations that need to be set with an image id.                                                                                                                             |
| eol           | String    | False    | End of life date for integration.                                                                                                                                                                                                                                                                                                         |
| KubeManifests | Array     | False    | Relative path to Kubernetes manifest yaml files.                                                                                                                                                                                                                                                                                          |
| ansibleRoles  | Array     | False    | Relative part to the Ansible role folders. These folders should contain all the artifacts required by Ansible. Please refer to the Ansible documentation for more details on how Ansible roles are constructed.                                                                                                                           |
|               |           |          | In Palette, Ansible roles are used to customize the OS image used for cluster nodes. Typically, these are roles that perform tasks like hardening the OS, installing monitoring agents, etc.                                                                                                                                              |
| charts        | Array     | False    | Relative path to the helm chart archives.                                                                                                                                                                                                                                                                                                 |

The following is the JSON schema for packs. Review the schema to ensure your JSON configuration is defined correctly.

<br />

```json
{
  "type": "object",
  "required": ["name", "displayName", "version", "layer"],
  "properties": {
    "name": {
      "$ref": "#/definitions/nonEmptyString"
    },
    "displayName": {
      "$ref": "#/definitions/nonEmptyString"
    },
    "version": {
      "$ref": "#/definitions/nonEmptyString"
    },
    "layer": {
      "$ref": "#/definitions/layer"
    },
    "group": {
      "type": "string"
    },
    "cloudTypes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "all",
          "aws",
          "azure",
          "gcp",
          "vsphere",
          "openstack",
          "baremetal",
          "maas",
          "aks",
          "eks",
          "tencent",
          "tke",
          "edge",
          "libvirt",
          "edge-native",
          "coxedge"
        ]
      }
    },
    "cloudType": {
      "type": "string",
      "enum": [
        "all",
        "aws",
        "azure",
        "gcp",
        "vsphere",
        "openstack",
        "baremetal",
        "maas",
        "aks",
        "eks",
        "tencent",
        "tke",
        "edge",
        "libvirt",
        "edge-native",
        "coxedge"
      ]
    },
    "eol": {
      "type": "string"
    },
    "addonType": {
      "type": "string"
    },
    "addonSubType": {
      "type": "string"
    },
    "ansibleRoles": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "charts": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "kubeManifests": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "annotations": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "constraints": {
      "$ref": "#/definitions/constraints"
    }
  },
  "definitions": {
    "nonEmptyString": {
      "type": "string",
      "minLength": 1
    },
    "layer": {
      "type": "string",
      "enum": ["kernel", "os", "k8s", "cni", "csi", "addon"]
    },
    "constraints": {
      "type": "object",
      "properties": {
        "dependencies": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/dependency"
          }
        },
        "resources": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/resource"
          }
        }
      }
    },
    "dependency": {
      "type": "object",
      "required": ["packName", "layer", "type"],
      "properties": {
        "packName": {
          "$ref": "#/definitions/nonEmptyString"
        },
        "layer": {
          "$ref": "#/definitions/layer"
        },
        "minVersion": {
          "type": "string"
        },
        "maxVersion": {
          "type": "string"
        },
        "type": {
          "type": "string",
          "enum": ["required", "optional", "notSupported", "upgrade"]
        }
      }
    },
    "resource": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["cpu", "memory", "diskSize"]
        },
        "minLimit": {
          "type": "number"
        },
        "components": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/component"
          }
        }
      }
    },
    "component": {
      "type": "object",
      "required": ["scheduleType"],
      "properties": {
        "scheduleType": {
          "type": "string",
          "enum": ["all", "master", "worker"]
        },
        "resourceRequestParamRef": {
          "type": "string"
        },
        "replicaCountParamRef": {
          "type": "string"
        }
      }
    }
  }
}
```

## Create a Custom Pack

Follow the steps below to create a custom pack.

1. Create a directory with a suitable name for all the pack contents.

   Example: `prometheus_1_0`

2. Create a metadata file named `pack.json` to describe the pack.

   Example:

   ```json
   {
     "annotations": {
       "name": "value"
     },
     "ansibleRoles": [],
     "displayName": "<PACK_DISPLAY_NAME>",
     "eol": "2028-04-30",
     "group": "<PACK_GROUP>",
     "kubeManifests": ["manifests/deployment.yaml"],
     "layer": "<LAYER>",
     "name": "<PACK_NAME>",
     "version": "<PACK_VERSION>"
   }
   ```

3. Create a file named `values.yaml`. This file consists of configurable parameters that need to be exposed to the
   end-users during the creation of a cluster profile.

:::info

A values.yaml file is mandatory for every pack. For an OS pack, there are typically no configurable parameters, but an
empty file still needs to be added to the OS pack.

:::

Parameters for all charts, manifests, and Ansible roles defined in the pack are defined in the `values.yaml` file.
_Helm_ charts natively support values override. Any values defined are merged with those defined within a chart.
_Manifests_ and _Ansible_ roles need to be explicitly templatized if parameter configuration is desired.

```yaml
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

4. A pack must have the logo file named `logo.webp` and must be copied into the pack directory.

5. Login to the pack registry using the following command:

   ```bash
    spectro registry login [REGISTRY_SERVER]
   ```

6. Push the newly defined pack to the pack registry using the following command:

   ```bash
    spectro pack push [PACK_DIR_LOCATION] --registry-server [REGISTRY_SERVER]
   ```

7. To overwrite contents of a previously deployed pack, use the force option as follows:

   ```bash
    spectro pack push [PACK_DIR_LOCATION] -f --registry-server [REGISTRY_SERVER]
   ```

## Adding an OS Pack

The OS is one of the Core Layers in a cluster profile. An OS pack can be built to use a custom OS image for cluster
nodes. This might be desirable if an organization wants to use an approved hardened OS image for their infrastructure.
There are typically the following two scenarios for the OS image:

<br />

1. **Pre-Installed Kubernetes** - The OS image has the desired version of Kubernetes components like kubelet, kubectl,
   etc installed.

2. **Vanilla OS Image** - Kubernetes components are not installed.

Additionally, for both scenarios additional components or packages may need to be installed at runtime to prepare the
final OS image. This can be done by specifying one or more Ansible roles in the pack. The following are a few examples
of building custom OS pack to cover the some of these scenarios.

A few sample pack manifests for building a custom OS pack are shown in the following examples. These are examples for
images that do not have Kubernetes components pre-installed. Palette installs these components at the time of
provisioning. The version of Kubernetes that gets installed depends on the Kubernetes pack configuration in the cluster
profile. If Kubernetes is pre-installed in the image, set the flag `skipK8sInstall` to true.

## Examples

<Tabs>

<TabItem label="AWS Custom OS Pack" value="aws_custom_os_pack">

### AWS Custom-OS Pack

```yaml
{
  "annotations":
    {
      "cloudRegion": "us-east-1",
      "imageId": "ami-071f6fc516c53fca1",
      "imageOwner": "421085264799",
      "osName": "centos",
      "os_spectro_version": "0",
      "sshUsername": "centos",
      "skipK8sInstall": "false",
    },
  "ansibleRoles": ["harden_os"],
  "cloudTypes": ["aws"],
  "displayName": "CentOS",
  "eol": "2024-06-30",
  "group": "",
  "kubeManifests": [],
  "layer": "os",
  "name": "golden-centos-aws",
  "version": "7.7.1908",
}
```

</TabItem>

<TabItem label="Azure Custom OS Pack" value="azure_custom_os_pack">

### Azure Custom OS Pack

```yaml
{
  "annotations":
    {
      "imageOffer": "CentOS",
      "imagePublisher": "OpenLogic",
      "imageSKU": "7.7",
      "osName": "centos",
      "os_spectro_version": "0",
      "sshUsername": "centos",
      "skipK8sInstall": "true",
    },
  "ansibleRoles": ["harden_os"],
  "cloudTypes": ["azure"],
  "displayName": "CentOS",
  "eol": "2024-06-30",
  "group": "",
  "kubeManifests": [],
  "layer": "os",
  "name": "golden-centos-azure",
  "version": "7.7.1908",
}
```

</TabItem>

<TabItem label="VMware Custom OS Pack" value="vmware_custom_os_pack">

### VMware Custom OS Pack - Local Image

```yaml
{
  "annotations":
    {
      "folder": "spectro-templates",
      "imageId": "/Datacenter/vm/spectro-templates/base-images/centos-7-vanilla-with-vm-tools",
      "osName": "centos",
      "os_spectro_version": "0",
      "sshPassword": "password",
      "sshUsername": "root",
      "skipK8sInstall": "false",
    },
  "ansibleRoles": ["harden_os"],
  "cloudTypes": ["vsphere"],
  "displayName": "CentOS",
  "eol": "2024-06-30",
  "group": "",
  "kubeManifests": [],
  "layer": "os",
  "name": "golden-centos-vsphere",
  "version": "7.7.1908",
}
```

### VMware Custom OS Pack - Remote Image

```yaml
{
  "annotations":
    {
      "folder": "spectro-templates",
      "imageId": "https://cloud-images.ubuntu.com/releases/18.04/release/ubuntu-18.04-server-cloudimg-amd64.ova",
      "osName": "ubuntu",
      "os_spectro_version": "0",
      "sshUsername": "ubuntu",
      "skipK8sInstall": "false",
    },
  "ansibleRoles": ["harden_os"],
  "cloudTypes": ["vsphere"],
  "displayName": "Ubuntu",
  "eol": "2028-04-30",
  "group": "LTS",
  "kubeManifests": [],
  "layer": "os",
  "name": "golden-ubuntu-vsphere",
  "version": "18.04.4",
}
```

</TabItem>

</Tabs>

## Ansible Roles

In all the previous examples, additional customization in the form of an Ansible role called `harden_os` is specified in
the pack manifest. The tasks and other files for the implementation of this role need to be included in the pack. The
final directory structure of for the pack would be as follows:

```
./pack.json
./logo.webp
./values.yaml
./harden_os
./harden_os/tasks
./harden_os/tasks/main.yml
./harden_os/files
./harden_os/files/sec_harden.sh
```

Ansible roles are optional and only required if additional runtime customization is required. Once an OS pack is
constructed, push it to the pack registry using the Spectro CLI tool.

:::warning

During the image customization phase of a cluster deployment, failures related to missing packages or package version
mismatch could occur when using a custom OS pack. These errors are presented on the console. The image needs to be
updated to resolve any such issues.

:::
