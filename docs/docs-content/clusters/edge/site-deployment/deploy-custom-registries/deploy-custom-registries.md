---
sidebar_label: "Deployment with Custom Image Registries"
title: "Deployment with Custom Image Registries"
description: "Registry options for deploying Edge clusters."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

During Edge cluster deployment, the Palette agent must download the necessary images required by the cluster. The
Palette agent divides the images into two categories in terms of when and from where to download them:

- Provider images. These images are Kairos-based container images for each supported Operating System (OS) and
  Kubernetes combination built during EdgeForge and pushed to an image registry. Provider images are always downloaded
  first.

- All other images. These images are for the network, storage, and application layers of the cluster.

The Palette agent decides on where to download the images from depending on whether you have specified an external
registry and whether you have enabled a local Harbor registry on your cluster.

## Provider Image Registry

Provider images are always downloaded first by the Palette agent. You are required to provide the location of the
provider image in the OS pack of your cluster profile. If an external registry is not specified in the
[user data](../../edgeforge-workflow/prepare-user-data.md) during EdgeForge, provider images will be downloaded from the
provider image registry specified in the OS pack of the cluster profile.

Palette supports downloading provider images from authenticated registries. If your cluster needs to download provider
images from a authenticated registry, you need to provide the credentials to access the registry in the OS pack of the
cluster profile. For more information, refer to
[Deploy Cluster with a Private Provider Registry](./deploy-private-registry.md).

## External Registry

After the provider images are downloaded, the Palette agent proceeds to download all other images required for the
cluster from registries that are specified in each pack's YAML configuration. However, you can specify an _external
registry_ as the registry from which all images used by the cluster will be downloaded, including the provider images.

When an external registry is provided in the user data, the Palette agent will append the URL of the external registry
to the URL of every image. For example, if your OS pack specified that the provider images be downloaded from
`quay.io/kairos/core-ubuntu-20-lts-rke2:v1.25.2-rke2r1`, but in your user data, you have specified an external registry
`10.10.254.254:8000/spectro-images`. The Palette agent will automatically download the image using the tag
`10.10.254.254:8000/spectro-images/quay.io/kairos/core-ubuntu-20-lts-rke2:v1.25.2-rke2r1` instead of looking for the
image in the original registry.

If you want to use a private image registry for applications on your Edge cluster, you can instruct the Palette agent to
download images from an _authenticated external registry_. You can specify an external registry in the user-data used to
build your Edge Installer ISO. For more information on how to deploy a cluster with an authenticated external registry,
refer to [Deploy Cluster with a Private External Registry](./deploy-external-registry.md).

## Local Harbor Registry

A local Harbor registry is a local registry that runs on your cluster. After the initial download of images from other
registries, all images except for infrastructure layer images will be uploaded to the Harbor registry. Subsequently, all
requests for application images from the cluster will be made to the Harbor registry. For more information, refer to
[Enable Local Harbor Image Registry](./local-registry.md).

## Limitations

There are limitations to using the local Harbor image registry and authenticated registries. The following table shows
you which combinations are supported.

| Feature                         | Can be used with                                                   | Cannot be used with                                             |
| ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Local Harbor registry           | - Authenticated external registry <br/> - Public provider registry | Authenticated provider registry                                 |
| Authenticated external registry | - Local Harbor registry <br/> - Public provider registry           | Authenticated provider registry.                                |
| Authenticated provider registry | N/A                                                                | - Authenticated external registry <br/> - Local Harbor registry |
