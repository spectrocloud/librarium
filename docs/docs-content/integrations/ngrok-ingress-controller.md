---
sidebar_label: "ngrok"
title: "ngrok"
description: "Learn about using ngrok Kubernetes Ingress to access applications in Palette."
hide_table_of_contents: true
type: "integration"
category: ["ingress", "amd64", "community"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/ngrok-ingress-controller/blobs/sha256:a723399d53d716c5441d57d021a7975d961e5b7db79ccb2bc10f7524ba7e67c1?type=image.webp"
tags: ["packs", "ngrok", "network", "kubernetes"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="0.9.x" value="0.9.x">

## Configure Ingress Service Definition

To use the ngrok Ingress Controller pack, first create a new
[add-on cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md),
search for the **ngrok Ingress Controller** pack, and overwrite the default pack configuration with your API key and
authentication token like the following example YAML content:

```yaml
charts:
  kubernetes-ingress-controller:
    ...
    credentials:
      apiKey: API_KEY
      authtoken: AUTHTOKEN
```

Next, you must create an ingress service definition for your application, which requires a new manifest layer. Click on
the **Add Manifest** button to create a new manifest layer.

The following YAML content demonstrates an example ingress service where the ngrok Ingress Controller creates a new edge
to route traffic on your ngrok subdomain `example.com` to an existing `example-app` deployed on your Kubernetes cluster
in Palette.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  namespace: ngrok-ingress-controller
spec:
  ingressClassName: ngrok
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: example-app
                port:
                  number: 80
```

Once you have defined the ngrok Ingress Controller pack, you can add it to an existing cluster profile, as an add-on
profile, or as a new add-on layer to a deployed cluster.

:::warning

If you have a free ngrok account, you can only have one ngrok agent active at a time. This means that you will need to
set the number of replicas to `1` to ensure that your ngrok agent operates properly.

```yaml
charts:
  kubernetes-ingress-controller:
    replicaCount: 1
```

:::

</TabItem>

</Tabs>

## Terraform

You can reference the ngrok Ingress Controller pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack_simple" "ngrok-ingress" {
  name    = "ngrok-ingress-controller"
  version = "0.9.0"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
