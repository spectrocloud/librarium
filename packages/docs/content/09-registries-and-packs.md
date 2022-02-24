---
title: "Registries and packs"
metaTitle: "Registries and packs"
metaDescription: "Pack management options for Kubernetes on Spectro Cloud. Use the built-in packs or BYO packs to make Kubernetes truly yours."
icon: "nodes"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Packs

## Overview

A pack is a collection of files such as manifests, helm charts, ansible roles, configuration files, etc. It is the building block of a cluster profile to create layers such as operating systems, Kubernetes, network, storage, and add-ons.  Ansible roles if provided, are used to customize cluster VM images whereas Kubernetes manifests and helm charts are applied to the Kubernetes clusters after deployment.

## Structure

Spectro Cloud provides a rich collection of out-of-the-box packs for various integrations and also offers extensibility through custom-built packs. The following is a typical structure of a pack:

    | - PACKNAME           ==> pack directory name
        | - pack.json        ==> mandatory : pack config
        | - values.yaml      ==> mandatory : pack params + values.yaml from charts + templated params from ansible-roles + all config from manifests
        | - logo.png         ==> optional : pack logo
        | - manifests        ==> optional : manifest files for the pack
        | - ansible-roles    ==> optional : ansible-roles used to install the pack
        | - charts           ==> optional : charts to be deployed for the pack

# Registries

## Overview

The pack registry is a server-side application to store and serve packs to its clients. Packs from a pack registry are retrieved and presented as options during the creation of a cluster profile. Spectro Cloud supports the configuration of multiple registries.

## Default Registry

The default pack registry is Spectro Cloud’s public pack registry. It consists of several packs that make it easy for a user to quickly create a cluster profile and launch a Kubernetes cluster with their choice of integrations. Spectro Cloud maintains all packs in this pack registry and takes care of upgrading packs in the pack registry whenever required.

## Custom Pack Registry

Users can set up a custom pack registry using a docker image provided by Spectro Cloud to upload and maintain custom packs. Spectro Cloud provides a CLI tool to interact with and manage pack content in the pack registry. Custom registries offer a mechanism of extending the capabilities of a platform by defining additional integrations.

# Spectro CLI

## Overview

Spectro CLI is a Command Line Interface to interact with the Spectro Cloud Pack Registry server for uploads and downloads of packs. CLI must authenticate with the pack registry before executing any CLI command.

## Download

Spectro CLI is currently available in two platforms - OSX & Linux:

OSX     : https://spectro-cli.s3.amazonaws.com/v2.3.0/osx/spectro

Linux   : https://spectro-cli.s3.amazonaws.com/v2.3.0/linux/spectro
