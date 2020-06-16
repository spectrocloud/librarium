---
title: "Adding a custom pack"
metaTitle: "Adding a custom pack"
metaDescription: "How to create and use custom made packs and registries in Spectro Cloud"
icon: ""
---

# Add custom packs

Spectro Cloud allows users to create their own custom packs for reasons such as having a hardened OS, an integration or an add-on that has been modified for a specific use, etc.

# Steps to create a custom pack

1. Create a directory with the same name as the custom pack name needed. All the pack contents should reside in this directory.
2. Create a metadata file named `pack.json` which describes the pack.
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

3. Create a file named `values.yaml` which contains the pack parameters or the heml charts values.
4. A pack must have the logo file named `logo.png` and must be copied into the pack directory.
5. With this, all the required files for a pack are created and are eligible for uploading to the registry. This is the simplest pack that does not contain the manifests, helm charts or ansible roles. With the help of Spectro CLI, a newly created pack can be pushed to the custom registry.

```
$spectro pack push [PACK_DIR_LOCATION] --registry-server [REGISTRY_SERVER]
```

6. The pack can be configured to have the Kubernetes manifest files, Ansible roles, or Helm charts and are referred in the metadata file `pack.json` as shown in the above example. After the pack is configured, using Spectro CLI the existing pack in the registry can be overwritten using the force option.

```
$spectro pack push [PACK_DIR_LOCATION] -f --registry-server [REGISTRY_SERVER]
```