---
sidebar_label: "Create Images with Image Builder"
title: "Create Images with Image Builder"
description: "Learn how to use the Image Builder project to create images for Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["operating system", "byoos", "profiles", "cluster profiles"]
---

You can create and deploy custom images to most infrastructure providers using various tools. Many infrastructure
providers have tools that you can use to create custom images for the platform, such as
[AWS EC2 Image Builder](https://aws.amazon.com/image-builder/) for AWS or
[Azure VM Image Builder](https://azure.microsoft.com/en-us/products/image-builder) for Azure. You can also use platform
agnostic tools, such as [HashiCorp Packer](https://developer.hashicorp.com/packer), or something more tailored to
Kubernetes, such as the [Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) (KIB) project.

## Kubernetes Image Builder

KIB is a project designed to help users create images for various platforms. The project is a consolidation of multiple
tools that together work to create an artifact, or in simpler terms, a custom image.

You can use the custom images created by KIB with Palette, assuming the infrastructure provider is supported in Palette.
Use the following diagram to understand how you can use KIB to create custom images that you can use with Palette.

![A diagram displaying the steps for creating a custom image](/cluster-profiles_byoos_image-builder_workflow-diagram.webp)

1. Download the KIB project and configure the image builder's **packer.json** file.

2. Use the `make` command to create a custom image containing a specific Operating System (OS) version and flavor.

3. The custom image is created and distributed to the target regions you specified in the **packer.json** file.

4. Create a cluster profile that points to your custom image.

5. Deploy a host cluster using your cluster profile that contains the custom image.

## Resources

- Check out the [Use Cases](./usecases/usecases.md) page to learn how to create a custom OS image for different
  infrastructure providers.
