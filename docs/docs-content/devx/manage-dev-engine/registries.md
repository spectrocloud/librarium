---
sidebar_label: "Dev Engine Registries"
title: "Dev Engine Registries"
description: "Palette Dev Engine Registries"
hide_table_of_contents: false
sidebar_position: 10
tags: ["devx", "app mode", "pde"]
---

The Pack registry is a server-side application that stores and serves packs to its clients. Packs from a pack registry
are retrieved and presented as options during the creation of a cluster profile. Palette supports the configuration of
multiple registries.

## Default Registry

The default pack registry is the public pack registry. It consists of several packs that reduce the friction for a user
to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. We maintain all
the packs in the default pack registry, this includes taking care of upgrades in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a Docker image provided by Spectro Cloud to upload and maintain custom
packs. You can use the [Packs Registry CLI](../../registries-and-packs/spectro-cli-reference.md) tool to interact with
and manage pack content in the pack registry. Custom registries offer a mechanism for extending the capabilities of a
platform by defining additional integrations.

Palette Dev Engine supports the following types of custom registries:

- [Helm Registry](../../registries-and-packs/helm-charts.md)

- [OCI Registry](../../registries-and-packs/oci-registry/oci-registry.md)
