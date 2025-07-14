---
sidebar_label: "SSH Keys"
title: "SSH Keys"
description: "Learn how to create and manage SSH keys in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster management"]
---

This section describes creating and managing SSH Keys in the Palette Management Console.

## Scope of SSH Key

Palette groups clusters for logical separation into [Projects](../../../tenant-settings/projects/projects.md). Users and
teams can be assigned roles within a project for granular control over permissions within the project scope. SSH key
authentication is scoped to a project. Multiple users can gain access to a single project. To access a cluster with SSH,
you need a public SSH key registered in Palette.

## Limitations

- Only RSA SSH keys are supported for [Azure AKS clusters](../../public-cloud/azure/aks.md) deployed using Palette.

## Prerequisites

- Access to a terminal window.

- The utility ssh-keygen or similar SSH key generator software.

## Create and Upload an SSH Key

<PartialsComponent category="palette-setup" name="generate-ssh-key" />

## Validate

You can validate that the SSH public key is available in Palette by attempting to deploy a host cluster. During the host
cluster creation wizard, you will be able to assign the SSH key to the cluster. Refer to the
[Getting Started](/getting-started/) tutorials for additional guidance.
