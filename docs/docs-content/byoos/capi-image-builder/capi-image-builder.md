---
sidebar_label: "CAPI Image Builder"
title: "CAPI Image Builder"
description: "Learn how to use the CAPI Image Builder project to create images for Palette and VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["operating system", "byoos", "capi iamge builder"]
---

The CAPI Image Builder is a tool we developed and maintain to reduce the challenges associated with creating images for
Kubernetes clusters. It is based on the upstream
[Kubernetes Image Builder (KIB)](https://image-builder.sigs.k8s.io/introduction.html) project.

The tool includes all the dependencies required to build FIPS and non-FIPS images within a Docker container, eliminating
the need to install any dependencies on your local machine.

:::preview

:::

## Get Started

Refer to the [Build Image for VMware vSphere](./build-image-vmware/build-image-vmware.md) guide to learn how to use the
CAPI Image Builder tool to create an OS image for Kubernetes clusters that target VMware vSphere.

## Resources

- [Build Image for VMware vSphere](./build-image-vmware/build-image-vmware.md)

- [Configuration Reference](./config-reference.md)
