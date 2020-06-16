---
title: "Example: Adding an OS pack"
metaTitle: "Example: Adding an OS pack"
metaDescription: "How to create a custom made OS pack in Spectro Cloud"
icon: ""
---

# Adding an OS Pack

The OS pack is the base layer in the cluster profile. The below example shows how to build a Ubuntu OS pack and push it to the custom registry server. For a pack to be eligible to be pushed into a registry, it *must* have the metadata file, the yaml file of the values, and a logo file.

1. Create a directory named `ubuntu`. This will be the pack directory. All the required files should be under this directory.
2. Create a metadata file named `pack.json` and provide the details of the Ubuntu pack.
```
{
    "annotations": {
        "osName": "ubuntu",
        "os_spectro_version": "1",
        "os_version": "u-18044",
        "skipK8sInstall": "true",
        "sshUsername": "ubuntu"
    },
    "ansibleRoles": [],
    "cloudTypes": ["aws"],
    "displayName": "Ubuntu",
    "eol": "2028-04-30",
    "group": "LTS",
    "kubeManifests": [],
    "layer": "os:,
    "name": "ubuntu-aws",
    "version": "18.04.4"
}
```

3. Copy the ubuntu logo to a file named “logo.png” under the pack directory.
4. Create a file named “values.yaml” and add any pack params if required.

```
$touch values.yaml
```

5. Now the pack is built and ready to be pushed to the custom registry server using the Spectro CLI command.

```
$spectro pack push ubuntu --registry-server [REGISTRY-SERVER]
```
