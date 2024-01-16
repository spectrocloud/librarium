---
sidebar_label: "Deploy a Stateless Frontend Application With Kubernetes"
title: "Deploy a Stateless Frontend Application With Kubernetes"
description: "One of the key benefits of using Kubernetes is that it provides a consistent and reliable way to deploy applications across different environments, including on-premises data centers and cloud infrastructure. Learn how to deploy a stateless frontend application in Kubernetes."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
hiddenFromNav: false
tags: ["tutorial", "k8s-tips"]
---

# Deploy a Stateless Frontend App with Kubernetes

Kubernetes is a container orchestration platform that is widely used for deploying and managing containerized applications.

One of the key benefits of using Kubernetes is that it provides a consistent and reliable way to deploy applications across different environments, including on-prem data centers and cloud infrastructure.

Deploying a stateless frontend application with Kubernetes can be a straightforward process, although it requires an understanding of the key concepts and best practices of Kubernetes.

In this tutorial, you will containerize a date suggester app built in React and deploy it with Kubernetes. This application is bootstrapped with [Create React App](https://create-react-app.dev/).

## Prerequisites

- An installation of [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine. Node is a Javascript runtime environment and will enable React to run on your machine.

- A clone of the application from the [date suggestions app](https://github.com/Princesso/date-buddy.git) on GitHub. Cloning the application will enable you to follow this tutorial step by step.

- A Docker account and a [Docker installation](https://docs.docker.com/engine/install/ubuntu/) on your machine.

- An active Kubernetes cluster. Check out the [Deploy a Cluster with Palette](../../clusters/public-cloud/deploy-k8s-cluster.md) tutorial to get started.

- An installation of the [kubectl command-line tool](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) on your machine and connected to your cluster.
- A LoadBalancer. You can [create a LoadBalancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/) with a public cloud provider, or use the [minikube tunnel](https://minikube.sigs.k8s.io/docs/commands/tunnel/) to trick a local cluster into exposing a resource.

## About the Application

The date suggester app is written in React. It takes a single date input on when a user will like to go on a date and displays a date idea for the selected date.

The app data comes from a JSON file that lives on the frontend app.

## Clone the Application.

Use the command shown below to clone the application from GitHub.

<br />

```bash
git clone https://github.com/spectrocloud/date-buddy
```

If you prefer to use a different stateless frontend app, you can do so. You may, however, get different results than in this tutorial. This tutorial only serves as a guide.

## Create a Dockerfile on the App’s Root Directory.

Before continuing this step, ensure Docker is installed on your machine. In the app's root directory, create a file named **Dockerfile**.

<br />

```bash
touch Dockerfile
```

In a text editor, add the lines below to the Dockerfile.

<br />

```bash
FROM node:12

WORKDIR /date-suggestions

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Also, create a **.dockerignore** file and add the following lines to it.

```bash
/node_modules
/.pnp
.pnp.js
/coverage
```

## Build a Docker Image of the Application.

This step packages the application into a portable image. To build the app’s image, run the Docker `build` command as shown.

<br />

```bash
docker build --tag date-suggestions .
```

## Create a Kubernetes Deployment.

Before continuing with this step, ensure that you have access to a Kubernetes cluster, as explained in the [prerequisites](#prerequisites).

In the application's root directory, create a Kubernetes Deployment file using the `kubectl` command below.

<br />

```bash
kubectl create deploy date-suggestions --image=date-suggestions --replicas=2 --port=3000 --dry-run=client --output yaml
```

The command output is a YAML representation of the deployment, similar to the lines below.

<br />

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: date-suggestions
spec:
  selector:
    matchLabels:
      app: date-suggestions
  replicas: 2
  template:
    metadata:
      labels:
        app: date-suggestions
    spec:
      containers:
        - name: date-suggestions
          image: date-suggestions
          ports:
            - containerPort: 3000
```

You can use the output YAML to create a deployment file. Use the redirect operator `>` to turn the command output into a **deployment.yaml** file.

<br />

```bash
kubectl create deploy date-suggestions --image=date-suggestions --replicas=2 --port=3000 --dry-run=client --output yaml > deployment.yaml
```

Alternatively, you can use the `touch` command to create the **deployment.yaml** file, and then copy the YAML output from the command to create a deployment to it.

<br />

```bash
touch deployment.yaml
```

## Create a Kubernetes Service.

Create and populate a Kubernetes Service file in the app's root directory. By default, your application will only be accessible within the cluster. You'll need to create a Kubernetes service resource to expose the application to resources outside the Kubernetes cluster. A service resource creates an abstraction over a set of pods that provides discovery and routing between them.

To create a service, use the `kubectl expose` command as shown below.

<br />

```bash
kubectl expose deployment date-suggestions --type=LoadBalancer --port=80 --target-port=3000 --name=date-suggestion-service --dry-run=client --output yaml
```

The output of running the command will be similar to the YAML below.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: date-suggestions-service
spec:
  type: LoadBalancer
  selector:
    app: date-suggestions
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

If everything looks good, modify the command to redirect the output YAML to the file **service.yaml**.

```bash
kubectl expose deployment date-suggestions --type=LoadBalancer --port=80 --target-port=3000 --name=date-suggestion-service --dry-run=client --output yaml > service.yaml
```

You can also create a YAML file with the `touch` command and add the output of the `kubectl expose` command to it.

<br />

```bash
touch service.yaml
```

Copy and paste the following line of code to the service file.

## Deploy the Application.

Use the kubectl command-line connected to the cluster you created earlier, and deploy the application by applying the file's content to Kubernetes.

<br />

```bash
kubectl apply --file deployment.yaml --file service.yaml
```

## Confirm that deployment was successful.

Once the deployment and service files have been applied, you should be able to access your app by issuing the following command.

<br />

```bash
kubectl get service date-suggestions-service --output=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

This will display the URL of your app that you can use to can access it in a web browser.

## Next Steps

Deploying a stateless frontend application with Kubernetes can be a straightforward process if you understand the fundamental concepts of Kubernetes.

In this tutorial, you containerized a stateless React-based app and deployed it with Kubernetes by creating a Dockerfile, building a Docker image, creating a Kubernetes deployment, and creating a Kubernetes service.

To learn more about Kubernetes, you can join our [slack channel](https://join.slack.com/t/spectrocloudcommunity/shared_invite/zt-1mw0cgosi-hZJDF_1QU77vF~qNJoPNUQ). Learn from other Kubernetes users and get to know fellow community members.
