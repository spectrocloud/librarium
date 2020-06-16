---
title: "Example: Adding an add-on pack using charts"
metaTitle: "Example: Adding an add-on pack using charts"
metaDescription: "How to create an add-on pack in Spectro Cloud using charts"
icon: ""
---

# Add-on packs

An add-on pack is an integration layer that will be installed on top of the Kubernetes stack. Examples of add-on packs are logging, monitoring, load balancers, security, etc. The below example shows how to build the Prometheus Grafana monitoring pack and how to push it to the custom registry server using Spectro CLI commands.

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

3. Download the Prometheus Grafana Helm Charts.
4. Copy the downloaded heml charts to the charts directory and refere the chart in the `pack.json` as shown in step 2.
5. Copy all the helm charts parameters or values into the `values.yaml`.
6. The following Spectro CLI command can be used to push the custom built pack into the custom registry:

```
$spectro pack push prometheus-grafana --registry-server [REGISTRY-SERVER]
```
