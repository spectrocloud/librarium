---
sidebar_label: "Services"
title: "Services"
description: "Palette Dev Engine App Services"
hide_table_of_contents: false
tags: ["devx", "app mode", "pde"]
---

Palette offers you different types of services to help you model all the dependencies and resources required to deploy
an application. You can choose from several different service types in Palette.

## Container Deployment

[Containers](https://www.docker.com/resources/what-container/) are methods of building, packaging, and deploying an
application. A container includes the code, run-time, libraries, and all the dependencies required by a containerized
workload. Containers are deployed to their target environment. For steps on how to deploy a container in Palette, refer
to [Container Deployment](../../profiles/app-profiles/create-app-profiles/container-deployment.md).

## Helm

Palette provides out-of-the-box Helm registries and allows you to add registries. For more information, visit
[Palette Helm Registry](../../registries-and-packs/helm-charts.md).

## Manifest

You can construct App Profile layers using raw manifests to provision Kubernetes resources that are unavailable in
Palette or Helm Charts. Pack Manifests provide a pass-through mechanism to orchestrate Kubernetes resources in a
cluster. For example, specific integrations may require the creation of secrets or Custom Resource Definitions (CRDs).
To achieve this, you can attach a Manifest file to the layer.

## Out-of-the-box Services

Palette also offers a set of common services or resources that application authors frequently use to expand or add
capabilities to an application. These services are managed by Palette and help reduce the burden of maintaining and
deploying resources required by your application.

### Messaging System Services

A messaging system service is a platform that enables the exchange of messages between users. It allows people to send
and receive messages in real time using different devices and communication channels.

<br />

### Object Storage Services

Object storage is a data storage solution for unlimited, unstructured data like images, videos, and backups. Uploaded
data is managed as objects, not files or blocks, and is scalable and durable.

<br />

### Database Services

A database stores structured data electronically for fast search and retrieval. It's commonly used for applications and
websites to store information such as user data, transactions, and analytics.

<br />

## Available Services

Check out the available service offerings in Palette by visiting the
[Service Listings](service-listings/service-listings.mdx) resource.
