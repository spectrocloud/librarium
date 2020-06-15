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

A pack is a collection of files with metadata definition as an implementation for a layer. In other words, a pack is a set of options for the layers. It has to be remembered that the packs can only contain non-conflicting layer options. For example, a pack can have either Calico or Flannel for the CNI layer, but not both.

Read more about packs [here](/introduction/concept-overviews#packregistry-publicandprivate).

# Registries

A registry is a central location where resources are stored and maintained. Generally, Kubernetes as well as all associated add-ons are maintained in public registries. However, there are options available to use private registries, for example, if a user wants to have their own hardened security OS. Spectro Cloud makes it easy to pull add-ons from private registries within the packs by using a CLI. The details are found in the [CLI based pack management](/registries-and-packs/cli-pack-mgmt-custom-registry) section.
