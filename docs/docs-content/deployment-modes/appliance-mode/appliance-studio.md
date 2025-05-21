---
sidebar_label: "Appliance Studio"
title: "Appliance Studio"
description: "Overview of Appliance Studio."
hide_table_of_contents: false
sidebar_position: 1
tags: ["edge"]
---

Appliance Studio is a lightweight and standalone configuration Graphic User Interface (GUI) for EdgeForge. It runs
locally on your machine and allows you to build, save, edit, and manage the two configuration files that are essential
to the EdgeForge process, with zero risk of syntax errors.

It also allows you to create presets, which are optional building blocks that you can reuse to create new configuration
files.

:::preview

:::

## Deploy Appliance Studio

You can deploy Appliance Studio locally either through Docker or Podman. Both AMD64 and ARM64 processor architectures
are supported.

### Prerequisites

- (Optional) [Git](https://git-scm.com/downloads). You can confirm Git installation by issuing the `git --version`
  command. Git is only required if you want to clone the Appliance Studio GitHub repository.

<Tabs groupId="method">

<TabItem value="Docker Compose">

- [Docker](https://docker.io) and [Docker Compose](https://docs.docker.com/compose/install/) are installed and
  available.

</TabItem>

<TabItem value="Podman Compose">

- [Podman](https://podman.io/docs/installation) and
  [Podman Compose](https://podman-desktop.io/docs/compose/setting-up-compose) are installed and available.

- You have at least one active Podman machine.

</TabItem>

</Tabs>

### Procedure

1. Clone the `appliance-studio` repository and change into the `/deploy` directory.

   ```shell
   git clone https://github.com/spectrocloud/appliance-studio.git
   cd appliance-studio/deploy
   ```

   If you do not want to clone the repository, you can also download the Docker Compose file from the
   [Releases](https://github.com/spectrocloud/appliance-studio/releases) page of the repository.

<Tabs groupId="method">

<!-- <TabItem value="Helm">

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

</TabItem> -->

<TabItem value="Docker Compose">

2. (Optional) Modify the persistent data directory. By default, the `docker-compose.yml` file configures the
   `deploy/appliance-studio-data` directory as the persistent data directory. You may change this to point to any other
   directory by modifying the `services.server.volumes` field. If you did not clone the repository, you need to create a
   directory named `appliance-studio-data` in the same directory as your `docker-compose.yml` file to match the default
   configuration.

   Change the path before the `:` sign to point to the directory you want to mount. You can use an absolute path or a
   relative path. If you use a relative path, the path is relative to the `docker-compose.yml` file, not the directory
   from which you issue the `docker compose up` command.

   ```yaml {11} title="Example" hideClipboard
   services:
     server:
       container_name: appliance-studio-server
       ports:
         - "4500:4500"
       networks:
         - appliance-studio-net
       restart: unless-stopped
       volumes:
         # Mount a host directory to /data inside the container for persistent storage.
         # IMPORTANT: Ensure the host directory (e.g., ./appliance-studio-data below) exists locally before running 'docker-compose up'.
         # You can change './appliance-studio-data' to any path on your host machine.
         - ./appliance-studio-data/additional-path:/data
   ```

   The data stored in the data directory includes your saved configurations and presets.

3. If you did not modify the persistent data mount directory, skip this step.

   If you modified the persistent data mount directory, ensure that the directory exists before proceeding to the next
   step. Create the directory if it does not exist.

4. Issue the following command to bring up Appliance Studio.

   ```shell
   docker compose up -d
   ```

</TabItem>

<TabItem value="Podman Compose">

3. (Optional) Modify the persistent data directory. By default, the `docker-compose.yml` file configures the
   `deploy/appliance-studio-data` directory as the persistent data directory. You may change this to point to any other
   directory by modifying the `services.server.volumes` field. If you did not clone the repository, you need to create a
   directory named `appliance-studio-data` in the same directory as your `docker-compose.yml` file to match the default
   configuration.

   Change the path before the `:` sign to point to the directory you want to mount. You can use an absolute path or a
   relative path. If you use a relative path, the path is relative to the `docker-compose.yml` file, not the directory
   from which you issue the `podman compose up` command.

   ```yaml {11} title="Example" hideClipboard
   services:
     server:
       container_name: appliance-studio-server
       ports:
         - "4500:4500"
       networks:
         - appliance-studio-net
       restart: unless-stopped
       volumes:
         # Mount a host directory to /data inside the container for persistent storage.
         # IMPORTANT: Ensure the host directory (e.g., ./appliance-studio-data below) exists locally before running 'docker-compose up'.
         # You can change './appliance-studio-data' to any path on your host machine.
         - ./appliance-studio-data/additional-path:/data
   ```

4. If you did not modify the persistent data mount directory, skip this step.

   If you modified the persistent data mount directory, ensure that the directory exists before proceeding to the next
   step. Create the directory if it does not exist.

5. Issue the following command to bring up Appliance Studio.

   ```shell
   podman compose up -d
   ```

</TabItem>

</Tabs>

### Validate

1. Visit port 8443 of your machine to access the Appliance Studio UI. You can do this by opening a web browser and
   entering the URL of `http://localhost:8443`.

2. Confirm that Appliance Studio is accessible.

## Next Steps

Refer to [Prepare User Data and Argument Files](../../clusters/edge/edgeforge-workflow/prepare-user-data.md) to learn
how to use Appliance Studio to prepare your EdgeForge configuration files.

Issue the following commands to bring down Application Studio once you are done. Your saved presets and configurations
will persist when you bring it up again.

<Tabs groupId="method">

<TabItem value="Docker Compose">

```shell
docker compose down
```

</TabItem>

<TabItem value="Podman Compose">

```shell
podman compose down
```

</TabItem>

</Tabs>

## Resources

Appliance Studio can help you prepare the two essential configuration files used during the EdgeForge process. Refer to
the following pages for more information on the `.arg` file and `user-data` file.

- [Prepare User Data and Argument Files](../../clusters/edge/edgeforge-workflow/prepare-user-data.md)

- [Edge Installer Reference](../../clusters/edge/edge-configuration/installer-reference.md)

- [EdgeForge Build Configuration](../../clusters/edge/edgeforge-workflow/palette-canvos/arg.md)
