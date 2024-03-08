---
sidebar_label: "Deployment with Custom Image Registries"
title: "Deployment with Custom Image Registries"
description: "Registry options for deploying Edge clusters."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

During Edge cluster deployment, the Palette agent must download the necessary images for cluster deployment. The Palette
agent divides images into two groups in terms of when and where to download the images:

- Provider images. These images are Kairos-based container images for each supported Operating System (OS) and
  Kubernetes combination built during EdgeForge and pushed to a provider image registry. Provider images are downloaded
  before all other images from the provider image registry.

- All other images. These images are for the network, storage and application layers of the cluster. These images are
  downloaded from external registries after the provider images have been downloaded.

## Provider Image Registry

Provider images are downloaded by the Palette agent from the _provider image registry_. You are required to provide the
location provider registry in the OS pack of your cluster profile. Palette supports downloading provider images from
authenticated registries. If your cluster needs to download provider images from a authenticated registry, you need to
provide the credentials to access the registry in the OS pack of the cluster profile. For more information, refer to
[Deploy Cluster with a Private Provider Registry](./deploy-private-registry.md).

## External Registry

After the provider images are downloaded, the Palette agent proceeds to download all other images required for the
cluster from _external registries_. Most packs in Palette's pack registries reference images in our public image
registries.

If you want to use a private image registry for applications on your Edge cluster, you can instruct the Palette agent to
download images from an _authenticated external registry_. You can specify an external registry in the user-data used to
build your Edge Installer ISO. For more information on how to deploy a cluster with an authenticated external registry,
refer to [Deploy Cluster with a Private External Registry](./deploy-external-registry.md).

## Local Harbor Registry

A local Harbor registry is a local registry that runs on your cluster. After the initial download of images from other
registries, all images except for the Container Storage Interface (CSI) and Container Network Interface (CNI) images
will be uploaded to the Harbor registry. CSI and CNI images are stored in [containerd](https://containerd.io/), a
container runtime service. Subsequently, all requests for application images from the cluster will be made to the Harbor
registry. For more information, refer to [Enable Local Harbor Image Registry](./local-registry.md).

## Limitations

There are limitations to using the local Harbor image registry and authenticated registries. The following table shows
you which combinations are supported or unsupported.

| Feature                         | Can be used with                                                   | Cannot be used with                                             |
| ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Local Harbor registry           | - Authenticated external registry <br/> - Public provider registry | Authenticated provider registry                                 |
| Authenticated external registry | - Local Harbor registry <br/> - Public provider registry           | Authenticated provider registry                                 |
| Authenticated provider registry | Public external registry                                           | - Authenticated external registry <br/> - Local Harbor registry |
