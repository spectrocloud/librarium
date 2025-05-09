---
sidebar_label: "Appliance Studio"
title: "Appliance Studio"
description: "Overview of Appliance Studio."
hide_table_of_contents: false
sidebar_position: 5
tags: ["edge"]
---

Appliance Studio is a lightweight and standalone configuration Graphic User Interface (GUI) for EdgeForge. It runs
locally on your machine and allows you to build, save, edit, and manage the two configuration files that are essential
to the EdgeForge process fast with zero risk of syntax errors. It also allows you to create presets, which are templates
that you can reuse to create new configuration files.

:::preview

:::

## Deploy Appliance Studio

The Appliance Studio is released as a Docker image. Follow this guide to download the image and run it on your local
machine.

### Prerequisites

- [Git](https://git-scm.com/downloads). You can confirm git installation by issuing the `git --version` command.

- [Docker](https://docker.io) is installed and available.

<Tabs group="method">

<IabItem value="Helm">

- [Helm](https://helm.sh/docs/intro/install/) is installed and available.

</TabItem>

<IabItem value="Docker Compose">

</TabItem>

</Tabs>

### Procedure

1. Clone the `appliance-studio` repository.

   ```shell
   git clone
   ```

<Tabs group="method">

<IabItem value="Helm">

2. Issue the following command to create a `kind` cluster.

   ```shell
   kind create cluster --name appliance-studio
   ```

3. Issue the following command to install the Nginx ingress controller.

   ```shell
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
   ```

4. Issue the following command to label the control plane node `ingress-ready=true`

   ```shell
   kubectl label nodes appliance-studio-control-plane ingress-ready=true --overwrite
   ```

5. Issue the following command to ensure that the ingress controller is ready before proceeding to the next step. This
   may take a few minutes. When the ingress controller is ready, kubectl will alert you in the terminal that the
   condition has been met.

   ```shell
   kkubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=300s
   ```

   ```shell
   pod/ingress-nginx-controller-54c4d66db9-fsl57 condition met
   ```

6. Issue the following command to deploy Appliance Studio on Helm.

   ```shell
   helm upgrade --install appliance-studio ./deploy/charts/appliance-studio \
        --namespace appliance-studio --create-namespace
   ```

</TabItem>

<IabItem value="Docker Compose">

</TabItem>

</Tabs>

### Validate

## Presets

## Resources

- [Prepare User Data and Argument Files](./prepare-user-data.md)

- [Edge Installer Reference](../edge-configuration/installer-reference.md)

- [EdgeForge Build Configuration](./palette-canvos/arg.md)
