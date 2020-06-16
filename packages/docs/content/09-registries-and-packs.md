---
title: "Registries and packs"
metaTitle: "Registries and packs"
metaDescription: "Pack management options for Kubernetes on Spectro Cloud. Use the built-in packs or BYO packs to make K8s truly yours."
icon: ""
hideToC: true
fullWidth: false
---

# About Packs, Layers and Registries

As detailed in the [Concept Overviews](introduction/concept-overviews) section, [Cluster Profiles](http://localhost:8010/introduction/concept-overviews#clusterprofiles) are one of the unique and smart features of the Spectro Cloud solution. This profile based management of Kubernetes infrastructure (and its packs) enables organisations to have control through flexibilty. Users define cluster profiles customised for their own integrations and requirements based on what is needed for their organisations. Since cluster profiles can be different from group to group and can be setup in a flash, avoiding the complexity and scalability of a do-it-yourself project. To have a clear understanding of a pack in this context, please have a look at what a [layer](/integrations#layers) is.

# Packs

## Overview

A pack is a collection of files like manifest files, helm charts, ansible roles, configuration files, etc. It is the building block of a cluster profile to create layers like os, kubernetes, network, storage, and addon. It is a collection of metadata definition as an implementation for a layer. In other words, a pack is a set of options for the layers. It has to be remembered that the packs can only contain non-conflicting layer options. For example, a pack can have either Calico or Flannel for the CNI layer, but not both.

Read more about packs [here](/introduction/concept-overviews#packregistry-publicandprivate).

## Structure

Spectro Cloud provides a rich collection of out-of-the-box packs, but a pack can also be custom-built by following the structure shown below:

    | - PACKNAME           ==> pack directory name
        | - pack.json        ==> mandatory : pack config
        | - values.yaml      ==> mandatory : pack params + values.yaml from charts + templated params from ansible-roles + all config from manifests
        | - logo.png         ==> optional : pack logo
        | - manifests        ==> optional : manifest files for the pack
        | - ansible-roles    ==> optional : ansible-roles used to install the pack
        | - charts           ==> optional : charts to be deployed for the pack

# Registries

## Overview

The registry is a server-side application that stores the packs locally or external file system and distribution of packs to the clients. It can be though of as a central location where resources are stored and maintained. Generally, Kubernetes as well as all associated add-ons are maintained in public registries. However, there are options available to use private registries, for example, if a user wants to have their own hardened security OS. Spectro Cloud makes it easy to pull add-ons from private registries within the packs by using a CLI. The details are found in the [CLI based pack management](/registries-and-packs/cli-pack-mgmt-custom-registry) section.

## Default Registry

The default registry is public and managed by Spectro Cloud. All the basic packs are available by default and make it easier for a user to launch a cluster without any additional setup. Spectro Cloud also takes care of upgrading the existing packs in the registry whenever upgrades are available.

## Custom Registry

In addition to the default registry, a user can set up the custom registry easily using the Spectro registry docker image and upload the custom packs using the Spectro CLI. A custom registry is suitable mainly for users who want to have a tight control over the registry and packs content.

# Spectro CLI

## Overview

Spectro CLI is a Command Line Interface to the Spectro registry server for uploading or downloading the packs using commands. CLI must authenticate with the registry before performing executing any CLI command.

## Download

Spectro CLI is currently available in two platforms - OSX & Linux:

OSX     : https://spectro-cli.s3.amazonaws.com/v1.0.0/osx/spectro

Linux   : https://spectro-cli.s3.amazonaws.com/v1.0.0/linux/spectro
