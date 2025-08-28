---
sidebar_label: "Retrieve Images from a Private Registry"
title: "Retrieve Images from a Private Registry"
description: "Create a Kubernetes Secret to retrieve images from a private registry."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
hiddenFromNav: false
unlisted: true
tags: ["how-to", "k8s-tips"]
---

## How To Retrieve Images from a Private Registry in Kubernetes

Kubernetes is an open source container orchestration platform that enables efficient management, deployment, and scaling
of containerized applications.

By default, Docker and Kubernetes allow a limited number of unauthenticated pulls from a Docker registry, such as Docker
Hub. When you exceed this limit, you will not be able to pull any more images until the limit resets.

The limit is based on the IP address of the machine that is making the pulls, so it applies to all containers running on
that machine.

To avoid this issue, we recommend that you authenticate with the Docker registry before pulling images, especially if
you are pulling from a private registry. This ensures you have access to the images you need and can pull them without
restrictions or limitations.

To log into a Docker registry from Kubernetes, you must create a secret that contains your registry credentials. You can
use this secret in a Kubernetes deployment configuration to pull images from the registry.

In this how-to guide, you will log into a private docker registry to pull existing images of an application that you
will deploy in Kubernetes.

## Prerequisites

- The kubectl [command-line tool](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/). Kubectl allows you to
  connect to, configure and work with your clusters through the command line.
- Access to a private registry. [DockerHub](https://hub.docker.com/) offers a single private registry on the free tier.
  If you do not have a personal registry account, you can use DockerHub.
- Access to a running Kubernetes cluster. To learn how to create clusters in different environments using Palette,
  review guides listed under [Clusters](../../clusters/clusters.md) or visit the
  [Getting Started](../../getting-started/getting-started.md) section. To learn how to create a Kubernetes cluster from
  scratch, check out the [Create a Cluster](https://kubernetes.io/docs/tutorials/kubernetes-basics/create-cluster/)
  Kubernetes resource.

The following example explains how you can create a secret and use it in a Kubernetes deployment.

## Create a Credentials JSON File

First, create a file called **registry-creds.json** that contains your registry credentials in the following format.

<br />

```json
{
  "auths": {
    "example.registry.com": {
      "username": "username",
      "password": "password"
    }
  }
}
```

Keeping passwords in plain text is unsafe. Kubernetes automatically encodes passwords used to create a secret in base64.
Encoding passwords does not mean your passwords cannot be decoded.

## Create a Kubernetes Secret

Use the `kubectl` command-line tool to generate a secret from the **registry-creds.json** file.

<br />

```bash
kubectl create secret generic myregistrykey --from-file=registry-creds.json
```

You can use the command below to view the secret created in detail.

<br />

```bash
kubectl get secret/myregistrykey --output json
```

The command output displays the content of the **registry-creds.json** file as base 64 encoded.

<br />

```json
{
  "apiVersion": "v1",
  "data": {
    "registry-creds.json": "ewogICJhdXRocyI6IHsKICAgICJleGFtcGxlLnJlZ2lzdHJ5LmNvbSI6IHsKICAgICAgInVzZXJuYW1lIjogInRlc3RfdXNlcm5hbWUiLAogICAgICAicGFzc3dvcmQiOiAidGVzdF9wYXNzd29yZCIKICAgIH0KICB9Cn0K"
  },
  "kind": "Secret",
  "metadata": {
    "creationTimestamp": "2023-03-22T08:44:26Z",
    "name": "myregistrykey",
    "namespace": "default",
    "resourceVersion": "1552285",
    "uid": "ccfb047b-67c8-446b-a69a-6eb762c3100f"
  },
  "type": "Opaque"
}
```

Invoke the following command to decode the secret you created to verify that secrets are not secure.

<br />

```bash
kubectl get secret myregistrykey --output jsonpath='{.data.registry-creds\.json}' | base64 --decode
```

The output of issuing the command above is the content of the JSON file you used to create the secret.

<br />

```json
{
  "auths": {
    "example.registry.com": {
      "username": "username",
      "password": "password"
    }
  }
}
```

## Add Secret to Deployment Config

In your Kubernetes deployment configuration, specify the name of the secret you just created for the imagePullSecrets
parameter.

<br />

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-container
          image: registry.example.com/my-image
          imagePullSecrets:
            - name: myregistrykey
```

## Apply the Deployment Configuration

<br />

```bash
kubectl apply --file deployment.yaml
```

With this configuration in place, Kubernetes will use the registry credentials in the `myregistrykey` secret to log into
the registry and pull the specified image when deploying the application.

## Other Docker Registry Authentication Methods

An alternative way to log into a Docker registry from Kubernetes is by using the command line.

Authenticate to the private registry. Here’s an example of how to do this.

<br />

```bash
$ kubectl create secret docker-registry <secret-name> \
    --docker-server=<registry-url> \
    --docker-username=<username> \
    --docker-password=<password> \
    --docker-email=<email>
```

In the snippet above, **`<secret-name>`** refers to a unique name for the secret, **`<registry-url>`** is the URL of the
private registry. Replace the **`<username>`** with the username for authentication and **`<password>`** with the
password for authentication. Also, replace **`<email>`** with the email associated with the authentication credentials.

Add the secret created in the previous step to the default service account with the following code.

<br />

```bash
kubectl patch serviceaccount default \
    --port '{"imagePullSecrets": [{"name": "<secret-name>"}]}'
```

Replace **`<secret-name>`** with the secret created in the previous step.

Once you are authenticated and have added the secret to your default service account, you can use the `kubectl` command
to pull images from the registry and deploy them to your Kubernetes cluster as follows.

<br />

```bash
kubectl run <deployment-name> \
    --image=<registry-url>/<image-name>:<tag> \
    --port=<container-port>
```

The line above will create a new deployment using the image specified from the private registry.

## Next Steps

Accessing images from a private registry in Kubernetes can be challenging due to the need to authenticate with the
registry.

To solve this challenge, you have learned how to create a Kubernetes secret with your Docker registry credentials and
use it in a Kubernetes deployment configuration. This allows you to pull images from your private registry without
restrictions or limitations.

To learn more about Kubernetes and how to use it to deploy your application, check out
[Palette's Dev Engine](../../tutorials/pde/deploy-app.md) and how it can reduce the challenges often encountered with
deploying apps to Kubernetes. You can also read about
[how to deploy a stateless frontend application](/kubernetes-knowlege-hub/tutorials/deploy-stateless-frontend-app) on
Kubernetes or join our
[slack channel](https://join.slack.com/t/spectrocloudcommunity/shared_invite/zt-1mw0cgosi-hZJDF_1QU77vF~qNJoPNUQ). Learn
from other Kubernetes users and get to know fellow community members.
