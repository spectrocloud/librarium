---
title: "Example: Adding an OS pack"
metaTitle: "Example: Adding an OS pack"
metaDescription: "How to create a custom made OS pack in Spectro Cloud"
icon: ""
---

# Adding an OS Pack

The OS is one of the core layers in a cluster profile. An OS pack can be built to use a custom OS image for cluster nodes. This might be desirable if an organization wants to use an approved hardened OS image for their infrastructure. There are typically the following two scenarios for the OS image:

1. Pre-Installed K8s - The OS image has the desired version of kubernetes components like kubelet, kubectl etc installed.
2. Vanilla OS Image - Kubernetes components are not installed.

Additionally, for both the scenarios additional components or packages may need to be installed at runtime to prepare the final OS image. The following are a few examples of building custom OS pack to cover the some of these scenarios.

# Example 1 - Pre-installed K8s (VMWare)

# Example 2 - Pre-installed K8s with additional hardening performed  (VMWare)

# Example 3 - Kubernetes components installed runtime without any additional components or packages  (VMWare)

# Example 4 - Kubernetes components installed runtime with additional components or packages (VMWare)

1. Create a directory named “ubuntu” and this will be the pack directory, all required files should be created under this directory.
2. Create a metadata file named “pack.json” and provide details of the ubuntu pack.

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
