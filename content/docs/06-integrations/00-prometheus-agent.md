---
title: 'Prometheus Agent'
metaTitle: 'Prometheus Agent'
metaDescription: 'Prometheus Agent Monitoring Pack'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image/png'
---


# Prometheus Agent

Prometheus is an open-source monitoring and alerting system that is designed to collect and analyze metrics from various systems and services. 

Prometheus is built around a time-series database that stores metrics data. It uses a flexible querying language called PromQL to extract and process metrics data. Prometheus also has a powerful alerting system that can be used to send notifications when specific conditions are met.

Prometheus can be used to monitor a wide range of systems and services, including servers, containers, databases, and applications. It can be deployed in a variety of environments, including on-premises, cloud, and hybrid setups.

The Prometheus Agent pack works in tandem with the [Prometheus Operator pack](/integrations/prometheus-operator). Review the usage section for more details.


# Versions Supported

**19.0.X**

# Prerequisites

* A host cluster that has the [Prometheus Operator pack](/integrations/prometheus-operator) installed.

# Parameters

The Prometheus agent supports all the parameters exposed by the Prometheus Helm Chart. Refer to the [Prometheus Helm Chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus#configuration) documentation for details.

From a Palette perspective, there is one required parameter you must provide a value:

<br />

```yaml
charts:
  prometheus:
    server:
      remoteWrite:
        - url: ""  
```

The `remoteWrite.url` is exposed by the [Prometheus Operator pack](/integrations/prometheus-operator) when installed in a cluster. The Prometheus server URL can be found by reviewing the details of the host cluster hosting the Prometheus server. Use the URL exposed by the Prometheus service.

# Usage

The Prometheus agent pack works out of the box and only requires you to provide a Prometheus server URL. Add the Prometheus agent pack to a cluster profile to get started with Prometheus. You can create a new cluster profile that has the Prometheus agent as an addon pack or you can [update an existing cluster profile](/cluster-profiles/task-update-profile) by adding the Prometheus agent pack.


# Terraform

You can retrieve details about the Prometheus agent pack by using the following Terraform code.

```tf
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "pack-info" {
  name         = "prometheus-agent"
  version      = "19.0.2"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Prometheus Operator pack](/integrations/prometheus-operator)


- [Prometheus Helm Chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus#configuration) 
