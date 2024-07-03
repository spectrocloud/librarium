---
sidebar_label: "Permission Manager"
title: "Permission Manager"
description: "Permission Manager Authentication pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["authentication", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/permission-manager/blobs/sha256:15d08b02d78823c12616b72d1b5adb0520940016b89bae1f758e6f1a105597ff?type=image.webp"
tags: ["packs", "permission-manager", "security"]
---

This integration provides a graphical user interface for RBAC management in Kubernetes. You can create users, assign
namespaces/permissions, and distribute Kubeconfig YAML files quickly.

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.0.x" value="1.0.x">

- **1.0.0**

</TabItem>
</Tabs>

## Configuration

| Name         | Supported Value            | Description                                                        |
| ------------ | -------------------------- | ------------------------------------------------------------------ |
| namespace    | Any valid namespace string | The namespace under which this integration should be deployed onto |
| authPassword |                            | Login password for the web interface                               |

## Customizing the permission templates

Create a ClusterRole starting with `template-namespaced-resources___` or `template-cluster-resources___` and apply it to
the cluster. Permission manager will honor any custom resources with this naming convention and will populate on the
user interface.

## Ingress

Follow below steps to configure Ingress on Permission Manager

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #10)
2. Ingress (line #13)
   - Enable Ingress; Change enabled from false to "true"
   - Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access Permission manager service on the Ingress Controller LoadBalancer hostname /
IP

## References

- [Permission Manager GitHub](https://github.com/sighupio/permission-manager)
