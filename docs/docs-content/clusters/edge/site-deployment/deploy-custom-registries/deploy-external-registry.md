---
sidebar_label: "Deploy Cluster with a Private External Registry"
title: "Deploy Cluster with a Private External Registry"
description: "Instructions for deploying an Edge cluster with a private external registry."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

Palette Edge provides support for downloading images from authenticated external registries. You can instruct the
Palette agent to download images from an authenticated external registry by specifying the address and the credentials
for the registry in the user data used to build your Edge Installer ISO.

Once you specify an external registry, images for all elements of the cluster are expected to be in the external
registry. This includes the provider images, images for the network and storage layer, and images for all application
layers. All images specified in the cluster profile will have their registry URL prefixed by the registry URL of the
external image registry. For example, if your OS pack specified that the provider images be downloaded from
`quay.io/kairos/core-ubuntu-20-lts-rke2:v1.25.2-rke2r1`, but in your user data, you have specified an external registry
`10.10.254.254:8000/spectro-images/`. The Palette agent will automatically download the image using the tag
`10.10.254.254:8000/spectro-images/quay.io/kairos/core-ubuntu-20-lts-rke2:v1.25.2-rke2r1` instead of looking for the
image in the original registry.

:::tip

You can use a private external registry together with a local Harbor image registry by adding the Harbor Edge-Native
Config pack to your cluster profile. All images for add-on layers of the cluster will be stored in the local Harbor
registry after the initial download, which allows you to reduce the bandwidth use and protect against outages. For more
information, refer to [Enable Local Harbor Registry](./local-registry.md).

:::

## Limitations

- Palette Edge supports basic username/password authentication. Token authentication schemes used by services such as
  AWS ECR and Google Artifact Registry are not supported.

## Prerequisites

- Specifying the external registry and providing credentials happens during the EdgeForge process. You should become
  familiar with EdgeForge before following this guide. Refer to
  [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md) to learn how to build Edge Installer
  ISO and provider images.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version.

  - You should have root-level or `sudo` privileges on your Linux machine to create privileged containers.

- A [Palette](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../site-installation/create-registration-token.md) guide.

- A private external registry that stores all images required by your cluster.

## Deploy Cluster with a Private External Registry

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. In the user data file, provide the URL and the credentials in `stylus.registryCredentials`. The following is an
   example:

   ```yaml
   #cloud-config
   stylus:
     registryCredentials:
       domain: 10.10.254.254:8000/spectro-images
       username: ubuntu
       password: *******
       insecure: true
   ```

   Refer to [Installer Configuration](../../edge-configuration/installer-reference.md#external-registry) for a
   description of each field.

4. Follow the rest of the [Build Edge Artifact](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide and
   build the Installer ISO with the user data containing the registry credentials.

5. Follow the [Perform Site Install](../site-installation/site-installation.md) guide to perform the installation.

6. Log in to [Palette](https://console.spectrocloud.com).

7. From the left **Main Menu**, click on **Profiles**. Then select the profile you are using to deploy the cluster.

8. Go through each layer of the profile and ensure that all images referenced in the profile are present in the external
   registry. If you do not want to do this manually image by image, refer to
   [Upload Cluster Images to External Registry with Palette Edge CLI](./upload-images-to-registry.md) to learn how to
   use the Palette Edge CLI to upload all images in a cluster profile to an external registry.

9. In the Kubernetes layer of your cluster profile, remove `AlwaysPullImages` from
   `cluster.config.clusterConfiguration.apiServer.extraArgs.enable-admission-plugins` and add it to
   `cluster.config.clusterConfiguration.apiServer.extraArgs.enable-admission-plugins`.

   The resulting layer configuration should look like the following.

   ```yaml
   disable-admission-plugins: AlwaysPullImages,AlwaysAdmit
   enable-admission-plugins: NamespaceLifecycle,ServiceAccount,NodeRestriction
   ```

10. Follow the [Create Cluster Definition](../site-installation/cluster-deployment.md) guide and deploy your cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Clusters**.

3. Verify that the cluster you provisioned is in running status. Since your cluster profile only references images in
   the private external registry, you can confirm that the images were downloaded successfully.
