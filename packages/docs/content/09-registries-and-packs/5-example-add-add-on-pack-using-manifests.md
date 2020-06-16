---
title: "Example: Adding an add-on pack using manifests"
metaTitle: "Example: Adding an add-on pack using manifests"
metaDescription: "How to create an add-on pack in Spectro Cloud using manifests"
icon: ""
---

# Add-on packs

An add-on pack is an integration layer that will be installed on top of the Kubernetes stack. Examples of add-on packs are logging, monitoring, load balancers, security, etc. The below example shows how to build the Permission Manager auth pack and how to push it to the custom registry server using Spectro CLI commands.

1. Create the pack directory named “permission-manager”.
2. Create the metadata file named `pack.json`.
```
{
  "addonType":"authentication",
  "cloudType": "all",
  "displayName": "Permission Manager",
  "kubeManifests": [
    "manifests/permission-manager.yaml"
  ],
  "layer": "addon",
  "name": "permission-manager",
  "version": "1.0.0"
}
```

3. Create the `manifests` directory under the pack directory.
4. Copy the manifest files into the `manifests` directory and refer the manifest in the `pack.json` as shown in step 2.
5. Copy all the parameters or values to the `values.yaml`.
6. The following Spectro CLI command can be used to push the custom built pack into the custom registry:

```
$spectro pack push prometheus-grafana --registry-server [REGISTRY-SERVER]
```
