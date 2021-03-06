---
title: 'Portworx'
metaTitle: 'Portworx Integration with Spectro Cloud'
metaDescription: 'Portworx storage integration for on-prem installations'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-portworx/blobs/sha256:e27bc9aaf22835194ca38062061c29b5921734eed922e57d693d15818ade7486?type=image/png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Portworx

[Portworx](https://portworx.com/) is a software-defined persistent storage solution designed and purpose-built for applications deployed as containers, via container orchestrators such as Kubernetes.

# Prerequisites

For deploying Portworx storage on vSphere environments, make sure to configure the following properties in the pack
* vsphereConfig
* storageType
* k8sVersion

## Contents

The default installation of Portworx will deploy the following components in the Kubernetes cluster
* Portworx
* CSI Provisioner
* [Lighthouse](https://docs.portworx.com/reference/lighthouse/)
* [Stork](https://github.com/libopenstorage/stork)
* Storage class making use of portworx-volume provisioner  

## Integrating to an external etcd

By default, Portworx is set to use internal KVDB. You can integrate Portworx to an external etcd server by following the steps below.

1. Enable `useExternalKvdb` flag by setting it to true
2. Configure the external etcd endpoints in `externalKvdb.endpoints`

If the external etcd server is configured to authenticate via certificates, additionally you may want to set up the following

* Enable `externalKvdb.useCertsForSSL` flag by setting it to true
* Setup certificate related configuration in `externalKvdb.cacert`, `externalKvdb.cert` & `externalKvdb.key`

<WarningBox>

Make sure to follow the correct indentation style, otherwise certificates will not be imported correctly and will result in a Portworx deployment failure.

</WarningBox>

## References

https://docs.portworx.com/portworx-install-with-kubernetes/
https://docs.portworx.com/reference/lighthouse/
