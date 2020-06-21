---
title: 'Permission Manager'
metaTitle: 'Permission Manager'
metaDescription: 'Permission Manager Authentication pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['authentication']
logoUrl: 'http://marketing-assets.spectrocloud.com.s3-website-us-west-2.amazonaws.com/website/logo_landscape_v6.png'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Permission Manager

This integration provides a graphical user interface for RBAC management in Kubernetes. You can create users, assign namespaces/permissions, and distribute Kubeconfig YAML files quickly.

# Configuration

| Name | Supported Value | Description |
| --- | --- | --- |
| namespace| Any valid namespace string | The namespace under which this integration should be deployed onto|
| authPassword | | Login password for the web interface |

## How to customize the permission templates?

Create a ClusterRole starting with `template-namespaced-resources___` or `template-cluster-resources___` and apply it to the cluster. Permission manager will honor any custom resources with this naming convention and will populate on the user interface.

## References
https://github.com/sighupio/permission-manager
