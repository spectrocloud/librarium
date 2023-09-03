---
sidebar_label: 'Ubuntu-K3s'
title: 'Ubuntu Lightweight Kubernetes K3s'
description: 'Choosing K3s with Ubuntu within the Palette console'
hiddenFromNav: true
type: "integration"
category: ['system app']
logoUrl: 'https://registry.spectrocloud.com/v1/ubuntu-k3s/blobs/sha256:10c291a69f428cc6f42458e86cf07fd3a3202c3625cc48121509c56bdf080f38?type=image/png'
---





# Lightweight Kubernetes on Ubuntu
K3s is a purpose-built container orchestrator for running Kubernetes on bare-metal servers. With the bloat stripped out, the CNCF (Cloud Native Computing Foundation) accredited Kubernetes distribution orchestrator makes installation and application deployment faster. Palette supports this Lightweight Kubernetes and Ubuntu pack versions to run at scale.

<br />

## Version Supported

<br />

## Ubuntu K3s
<br />
<Tabs>
<TabItem label="Ubuntu-K3s-1.22.x" value="Ubuntu-K3s-1.22.x">

<br />
<br />

Name: **Ubuntu-K3s**
Version: **Ubuntu-K3s-1.22.9-k3s0**


<br />
<br />


</TabItem>
<TabItem label="Ubuntu-K3s-1.21.x" value="Ubuntu-K3s-1.21.x">

<br />
<br />

Name: **Ubuntu-K3s**
Version: **Ubuntu-K3s-1.21.12-k3s0**

<br />
<br />

</TabItem>
</Tabs>


## Manifest Parameters


```yaml
pack:
  spectrocloud.com/install-priority: "0"
#k3sconfig:
#  disable:
#    - metrics-server
#  service-cidr: "10.40.0.0/16"
#  cluster-cidr: "10.45.0.0/16"
```



# References

[Rancher](https://rancher.com/docs/k3s/latest/en/)
