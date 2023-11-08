---
sidebar_label: 'Argo CD'
title: 'Argo CD'
description: 'Argo CD for Spectro Cloud Palette'

type: "integration"
category: ['system app', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/argo-cd/blobs/sha256:647cd3df6fec421e6580589ea7229762d8e828c77036f835f14f4c15c2a44c4c?type=image/png'
tags: ["packs", "argo-cd", "system app"]
---

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) is a declarative, GitOps continuous delivery tool for Kubernetes. Argo CD follows the GitOps pattern of using Git repositories as the source of truth for defining the desired application state. Argo CD automates the deployment of the desired application states in the specified target environments. Application deployments can track updates to branches, tags, or pinned to a specific version of manifests at a Git commit. Start using Argo CD with Palette today by consuming this pack.


## Prerequisites

- Kubernetes 1.7+

## Version Supported

<Tabs queryString="version">
<TabItem label="3.3.x" value="3.3.x">

* **3.3.5**



</TabItem>

<TabItem label="3.2.x" value="3.2.x">

* **3.2.6**

</TabItem>
</Tabs>


## Notable Parameters

| Parameter             | Description                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| global.image.repository     | The repository that is the source of truth. |
| global.image.tag             | The image tag to pull.                     |
| global.image.imagePullPolicy | If defined, a imagePullPolicy applied to all ArgoCD deployments. Defaults to ` IfNotPresent`                              |
| global.securityContext | A list of security contexts
|imagePullSecrets| If defined, uses a Secret to pull an image from a private Docker registry or repository.
|hostAliases| A list of mapping between IP and hostnames that will be injected as entries in the pod's hosts files



## References

- [Argo CD](https://argo-cd.readthedocs.io/en/stable/)
