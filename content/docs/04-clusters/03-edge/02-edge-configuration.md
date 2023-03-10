---
title: "Install Configuration"
metaTitle: "Install Configuration"
metaDescription: "Learn about the possible Palette Edge install configurations available."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

The Edge installation process accepts two types of configurations that you can use to customize the installation:

# Edge OS Configuration

The Edge installation process supports the ability for you to customize your operating system (OS) through the usage of cloud-init stages. You can supply Edge configurations during the edge host installation with the Edge Installer and at the operating system (OS) layer by customizing the OS pack. Once the edge host installation process is complete, the OS stages take effect during the boot-up process.

To make effective use of the Edge Installer, we recommend you review the Edge [installer configuration](/clusters/edge/edge-configuration/installer-reference) page so you gain an overview of all the available parameters.



# Edge Installer Configuration

The Edge installation process expects certain installation properties which can be supplied in multiple stages. Common instalaltion configuration that applies for all your sites can be supplied during manufacturing or staging phase. Additional site specific configuration can be augmented by the site operator at the site during site installation. The configuration provided in various stages is merged together to create the final configuration for the edge host.


# Install Order of Operations

The Edge installation can be summarized at a high level  

Use the following diagram to help you understand the Edge installation order of operations.

![The boot order sequence, listing 9 steps that flow in a sequential order ](/clusters_edge_cloud-init_boot-order-squence.png)

# Resources

- [Edge OS Configuration: Cloud-Init Stages](/clusters/edge/edge-configuration/cloud-init)

- [Edge Install Configuration](/clusters/edge/edge-configuration/stylus-reference)
