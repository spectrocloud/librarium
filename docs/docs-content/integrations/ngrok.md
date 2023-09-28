---
sidebar_label: "ngrok"
title: "ngrok"
description: "Learn about using ngrok Kubernetes Ingress to access applications and services in Palette."
hide_table_of_contents: true
type: "integration"
category: ["ingress", "kubernetes"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: ""
tags: ["packs", "ngrok", "network", "kubernetes"]
---

The ngrok [Ingress Controller for Kubernetes](https://github.com/ngrok/kubernetes-ingress-controller) adds public and
secure ingress traffic to Kubernetes services. This open-source [Ingress
Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) works with Palette to provide
ingress to your applications, APIs, or other services while also offloading network ingress and middleware execution to
ngrok's platform.

# Versions Supported

- 0.9.0

## Prerequisites

- An active [ngrok account](https://ngrok.com/signup).
  - An ngrok authentication token. You can find your token in the dashboard. Visit the [**Your Authtoken**](https://dashboard.ngrok.com/get-started/your-authtoken) section to review our access token.
  - An ngrok API key. You can generate an API key from the ngrok dashboard. Visit the [**API** section](https://dashboard.ngrok.com/api) of the dashboard to create and review existing key.
- A static subdomain. You can obtain a static subdomain by navigating to the [**Domains**
section](https://dashboard.ngrok.com/cloud-edge/domains) of the ngrok dashboard and clicking on **Create Domain** or **New Domain**.

## Parameters

To properly deploy the ngrok Kubernetes Ingress Controller, you need to add your ngrok authentication `API_KEY` and `AUTHTOKEN` to your preset or active profile.

```yaml
charts:  
  kubernetes-ingress-controller:
    credentials:
      apiKey: API_KEY
      authtoken: AUTHTOKEN
```

:::caution

If you have a free ngrok account, you can only have one ngrok agent active at a time. This means that you will need to set the number of replicas to `1` to ensure that your ngrok agent operates properly.

```yaml
charts:
  kubernetes-ingress-controller:
    replicaCount: 1
```

:::

## Usage

The following YAML content demonstrates a deployment using the [2048](https://github.com/gabrielecirulli/2048)

:::tip

Make sure you edit line 45 of the manifest below, which contains the `NGROK_DOMAIN` variable, with the ngrok subdomain
you created in the previous step. It should look something like `one-two-three.ngrok-free.app`.

:::

```yaml
apiVersion: v1
kind: Service
metadata:
  name: game-2048
  namespace: ngrok-ingress-controller
spec:
  ports:
    - name: http
      port: 80
      targetPort: 80
  selector:
    app: game-2048
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: game-2048
  namespace: ngrok-ingress-controller
spec:
  replicas: 1
  selector:
    matchLabels:
      app: game-2048
  template:
    metadata:
      labels:
        app: game-2048
    spec:
      containers:
        - name: backend
          image: alexwhen/docker-2048
          ports:
            - name: http
              containerPort: 80
---
# ngrok Ingress Controller Configuration
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: game-2048-ingress
  namespace: ngrok-ingress-controller
spec:
  ingressClassName: ngrok
  rules:
    - host: NGROK_DOMAIN
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: game-2048
                port:
                  number: 80
```

Apply the `2048.yaml` manifest to your cluster in Palette.

```bash
kubectl apply -f 2048.yaml
```

Access your 2048 demo app by navigating to the your `NGROK_DOMAIN`, e.g. `https://one-two-three.ngrok-free.app`. ngrok's
edge and your Ingress Controller will route traffic to your app from any device or external network.

## References

- [Ingress Controller for Kubernetes on GitHub](https://github.com/ngrok/kubernetes-ingress-controller)
- [ngrok documentation](https://ngrok.com/docs/)
- [Get started with the ngrok Ingress Controller for Kubernetes](https://ngrok.com/docs/using-ngrok-with/k8s/#get-started-with-the-ngrok-ingress-controller-for-kubernetes)
- [ngrok Pack GitHub](https://github.com/spectrocloud/pack-central/tree/main/packs/ngrok-ingress-controller-0.9.0)
- [ngrok Ingress Controller Helm Documentation](https://github.com/ngrok/kubernetes-ingress-controller/tree/main/docs)
