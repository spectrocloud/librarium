---
sidebar_label: "Disable Webhook to Customize Image Pull Behavior"
title: "Disable Webhook to Customize Image Pull Behavior"
description: "Learn how to disable the Palette agent webhook to give you greater freedom in designing registry image
  pull behavior.
  "
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

Palette Edge allows you to deploy clusters to an external registry and use a local Harbor registry without manually
configuring rewrites. This is possible because the Palette agent uses a webhook to redirect image pulls to the
appropriate locations depending on your configuration.

While the webhook makes using an external registry or the local Harbor registry more streamlined, it can limit your
flexibility to configure your own image pull behavior. This guide guides you through how to disable the Palette agent
webhook and provides a few example configurations to customize image pull for your cluster.

## What Happens When You Disable the Webhook

When the agent webhook is disabled, the Palette agent will not redirect any image pull operation by default. This means
that even if you specify an external registry in the **user-data**, the Palette agent will not pull images from that
registry unless it is otherwise configured to do so. This also means that the Palette agent will not pull images from
the local Harbor registry, even if the images are downloaded and stored in the registry, unless it is otherwise
configured to do so. Disabling the webhook removes restrictions, but does place the burden of ensuring that images are
pulled from the correct locations on yourself.

You may consider disabling the webhook if you want to configure your cluster to pull images from multiple authenticated
registries, or you simply do not want the default behavior that forces image pulls to be redirected to the local Harbor
registry. Once the webhook is disabled, you can then take advantage of the rewrite features of some Kubernetes
distributions such as K3s and RKE2, or other redirect mechanism that you implement on your own to customize the image
pull behavior.

## Prerequisites

- The process to disable webhook is based on the EdgeForge process. We recommend that you familiarize yourself with
  [EdgeForge](../../edgeforge-workflow/edgeforge-workflow.md) and the process to build Edge artifacts.

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

## Procedure

### Disable Webhook

1. Clone the **CanvOS** repository.

   ```shell
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change into the **CanvOS** directory.

   ```shell
   cd CanvOS
   ```

3. View the available tags and use the latest available tag. This guide uses `v4.5.0` as an example.

   ```shell
   git tag
   git checkout v4.5.0
   ```

4. In your **user-data** file, set `stylus.webhook.enable` to `false`.

   ```yaml {7}
   #cloud-config
   stylus:
     site:
       edgeHostToken: XXXXXXXXXXXXXX
       paletteEndpoint: XXXXXX
       projectUid: XXXXXX
     imageRedirectWebhook:
       enable: false
   ```

5. Follow the rest of the [Build Edge Artifact](../../edgeforge-workflow/palette-canvos/palette-canvos.md) guide and
   build the Installer ISO with the user data configurations. The Edge clusters provisioned with the ISO will no longer
   automatically redirect image pull requests to the external registry or the local Harbor registry.

   From this point on, you can customize redirect behavior yourself. The process to redirect image pulls vary by
   Kubernetes distribution as well as your registry setup.

## Validate

1. Use the ISO to install Palette Edge on an Edge host. For more information, refer to
   [Installation](../site-installation/site-installation.md).

2. Create a cluster profile and include **Harbor Edge-Native Config** pack.

3.
