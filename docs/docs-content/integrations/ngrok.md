---
sidebar_label: "ngrok"
title: "ngrok"
description: "Learn about using ngrok Kubernetes Ingress to access applications in Palette."
hide_table_of_contents: true
type: "integration"
category: ["ingress", "kubernetes", "amd64", 'community']
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/ngrok-ingress-controller/blobs/sha256:a723399d53d716c5441d57d021a7975d961e5b7db79ccb2bc10f7524ba7e67c1?type=image/png"
tags: ["packs", "ngrok", "network", "kubernetes"]
---

The ngrok [Ingress Controller for Kubernetes](https://github.com/ngrok/kubernetes-ingress-controller) adds public and
secure ingress traffic to Kubernetes applications. Enforce authentication and authorization at the edge with ngrok, preventing unauthorized traffic from ever reaching your cluster and rogue webhooks from looping and spamming your service. This open-source [Ingress
Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) works with Palette to provide
ingress to your applications, APIs, or other resources while also offloading network ingress and middleware execution to
ngrok's platform. Balance traffic between multiple redundant Points of Presence (PoPs) in ngrok’s global network, and rely on ngrok’s built-in global service load balancer to automatically route traffic to the PoP with the lowest latency. The ngrok Ingress Controller for Kubernetes equips you to serve apps and APIs without needing to configure networking details such as ELBs, IPs, network interfaces, or VPC routing, radically simplifying ingress into Kubernetes.

# Versions Supported

- 0.9.0

## Prerequisites

- An active [ngrok account](https://ngrok.com/signup).
  - An ngrok authentication token. You can find your token in the dashboard. Visit the [**Your Authtoken**](https://dashboard.ngrok.com/get-started/your-authtoken) section to review your access token.
  - An ngrok API key. You can generate an API key from the ngrok dashboard. Visit the [**API** section](https://dashboard.ngrok.com/api) of the dashboard to review existing keys.
- A static subdomain. You can obtain a static subdomain by navigating to the [**Domains**
section](https://dashboard.ngrok.com/cloud-edge/domains) of the ngrok dashboard and clicking on **Create Domain** or **New Domain**.

## Parameters

To deploy the ngrok Ingress Controller, you need to set, at minimum, the following parameters in the pack's YAML.

| Name  | Description |
| --- | --- |
| `kubernetes-ingress-controller.credentials.apiKey` | Your ngrok API key for this application and domain. |
| `kubernetes-ingress-controller.credentials.authtoken` | The authentication token for your active ngrok account. |
| `kubernetes-ingress-controller.rules.host` | A static subdomain hosted by ngrok and associated with your account. |
| `kubernetes-ingress-controller.rules.http.paths.path` | The path at which to route traffic to your application. For more advanced configurations, you can set multiple paths with corresponding `pathType`, `backend.service.name`, and `backend.service.name` parameters. |
| `kubernetes-ingress-controller.rules.host.paths.pathType` | Specify how ingress paths should be [matched by type](https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types). `Prefix` matches based on a URL path prefix split by `/`. `Exact` matches the URL path exactly and with case sensitivity. |
| `kubernetes-ingress-controller.rules.host.backend.service.name` | The name you've given to the application for which the ngrok Ingress Controller should handle traffic. |
| `kubernetes-ingress-controller.rules.host.backend.service.port.number` | The port number for the deployed `service.name`. |

Review the [common overrides](https://github.com/ngrok/kubernetes-ingress-controller/blob/main/docs/deployment-guide/common-helm-k8s-overrides.md) document for more details on parameters. Refer to the [user guide](https://github.com/ngrok/kubernetes-ingress-controller/tree/main/docs/user-guide) for advanced configurations.

:::caution

If you have a free ngrok account, you can only have one ngrok agent active at a time. This means that you will need to set the number of replicas to `1` to ensure that your ngrok agent operates properly.

```yaml
charts:
  kubernetes-ingress-controller:
    replicaCount: 1
```

:::

## Usage

To use the ngrok Ingress Controller pack, first create a new [add-on cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md), search for the **ngrok Ingress Controller** pack, and overwrite the default pack configuration with your API key and authentication token like the following example YAML content:

```yaml
charts:  
  kubernetes-ingress-controller:
    ...
    credentials:
      apiKey: API_KEY
      authtoken: AUTHTOKEN
```

Next, you must create an ingress service definition for your application, which requires a new manifest layer. Click on the **Add Manifest** button to create a new manifest layer. 

The following YAML content demonstrates an example ingress service where the ngrok Ingress Controller creates a new edge to route traffic on your ngrok subdomain `example.com` to an existing `example-app` deployed on your Kubernetes cluster in Palette.

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

Once you have defined the ngrok Ingress Controller pack, you can add it to an existing cluster profile, as an add-on profile, or as a new add-on layer to a deployed cluster.

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

## References

- [Ingress Controller for Kubernetes on GitHub](https://github.com/ngrok/kubernetes-ingress-controller)
- [ngrok documentation](https://ngrok.com/docs/)
- [Get started with the ngrok Ingress Controller for Kubernetes](https://ngrok.com/docs/using-ngrok-with/k8s/)
- [ngrok Pack GitHub](https://github.com/spectrocloud/pack-central/tree/main/packs/ngrok-ingress-controller-0.9.0)
- [ngrok Ingress Controller Helm Documentation](https://github.com/ngrok/kubernetes-ingress-controller/tree/main/docs)
