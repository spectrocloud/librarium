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
