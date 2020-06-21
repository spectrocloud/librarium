---
title: "Registries and packs"
metaTitle: "Registries and packs"
metaDescription: "Pack management options for Kubernetes on Spectro Cloud. Use the built-in packs or BYO packs to make Kubernetes truly yours."
icon: "audits"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# About Packs, Layers and Registries

As detailed in the [Concept Overviews](introduction/concept-overviews) section, [Cluster Profiles](http://localhost:8010/introduction/concept-overviews#clusterprofiles) are one of the unique and smart features of the Spectro Cloud solution. This profile based management of Kubernetes infrastructure (and its packs) enables organizations to have control through flexibilty. Users define cluster profiles customized for their own integrations and requirements based on what is needed for their organizations. Since cluster profiles can be different from group to group and can be setup in a flash, they help you avoid the complexity and scalability of a do-it-yourself project. To have a clear understanding of a pack in this context, please have a look at what a [layer](/integrations#layers) is.

# Packs

## Overview

A pack is a collection of files like manifest files, helm charts, ansible roles, configuration files, etc. It is the building block of a cluster profile to create layers such as the operating systems, Kubernetes, network, storage, and add-ons. Ansible roles, if provided, are used to customize cluster VM images whereas Kubernetes manifests and helm charts are applied to the Kubernetes clusters after deployment.

It is a collection of metadata definition as an implementation for a layer. In other words, a pack is a set of options for the layers. It has to be remembered that the packs can only contain non-conflicting layer options. For example, a pack can have either Calico or Flannel for the CNI layer, but not both.

Read more about packs [here](/introduction/concept-overviews#packregistry-publicandprivate).

## Structure

Spectro Cloud provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom built packs. The following is a typical structure of a pack:

    | - PACKNAME           ==> pack directory name
        | - pack.json        ==> mandatory : pack config
        | - values.yaml      ==> mandatory : pack params + values.yaml from charts + templated params from ansible-roles + all config from manifests
        | - logo.png         ==> optional : pack logo
        | - manifests        ==> optional : manifest files for the pack
        | - ansible-roles    ==> optional : ansible-roles used to install the pack
        | - charts           ==> optional : charts to be deployed for the pack

# Registries

## Overview

The registry is a server-side application to store and serve packs to its clients. Packs from a registry are retrieved and presented as options during the creation of a cluster profile. Spectro Cloud supports configuration of multiple registries.

## Default Registry

The default registry is Spectro Cloud’s public registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Spectro Cloud maintains all packs in this registry and takes care of upgrading packs in the registry whenever required.

## Custom Registry

Users can set up a custom registry using a docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

# Spectro CLI

## Overview

Spectro CLI is a Command Line Interface to interact with the Spectro Cloud Registry server for uploads and downloads of packs. CLI must authenticate with the registry before executing any CLI command.

## Download

Spectro CLI is currently available in two platforms - OSX & Linux:

OSX     : https://spectro-cli.s3.amazonaws.com/v1.0.0/osx/spectro

Linux   : https://spectro-cli.s3.amazonaws.com/v1.0.0/linux/spectro
