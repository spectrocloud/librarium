---
sidebar_label: "ngrok"
title: "ngrok"
description: "Learn about using ngrok Kubernetes Ingress to access applications and services in Spectro Cloud."
hide_table_of_contents: true
type: "integration"
category: ["ingress", "kubernetes"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: ""
tags: ["packs", "ngrok", "network", "kubernetes"]
---

The ngrok [Ingress Controller for Kubernetes](https://github.com/ngrok/kubernetes-ingress-controller) is the official
controller for adding public and secure ingress traffic to your k8s services. This open source [Ingress
Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) works with Spectro Cloud to
provide ingress to your applications, APIs, or other services while also offloading network ingress and middleware
execution to ngrok's platform.

# Versions Supported

- 0.9.0

## Prerequisites

- An active [ngrok account](https://ngrok.com/signup).
  - Your ngrok authentication token (`AUTHTOKEN`), which you can find under under [**Your
   Authtoken**](https://dashboard.ngrok.com/get-started/your-authtoken) in the ngrok dashboard.
  - An API key (`API_KEY`), which you can generate in the [**API** section](https://dashboard.ngrok.com/api) of the
    ngrok dashboard.
- A static subdomain (`NGROK_DOMAIN`), which you can obtain by navigating to the [**Domains**
   section](https://dashboard.ngrok.com/cloud-edge/domains) of the ngrok dashboard and clicking **Create Domain** or
   **New Domain**.

## Parameters

To deploy properly, the ngrok Kubernetes Ingress Controller requires your ngrok authentication `API_KEY` and
`AUTHTOKEN`, which you can add to your preset or running profile.

```yaml
charts:  
  kubernetes-ingress-controller:
    credentials:
      apiKey: API_KEY
      authtoken: AUTHTOKEN
```

:::tip

Free ngrok accounts can have only one ngrok agent running at a time. If you have a free ngrok account, change
the number of replicas to `1`, like the following:

```yaml
charts:
  kubernetes-ingress-controller:
    replicaCount: 1
```

:::

## Usage

The following `.yaml` file demonstrates an example deployment using the [2048](https://github.com/gabrielecirulli/2048)
game and the ngrok Kubernetes Ingress Controller. 

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
