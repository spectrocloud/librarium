---
title: "Edge Configuration"
metaTitle: "Review Edge Configruation"
metaDescription: "Learn about the Palette Edge configuration."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

The Edge installation process accepts the following 2 kinds of conifguration as input:

## Edge OS Configuration

The Edge installation process supports the ability for you to customize your OS through Edge OS Configuration which is defined using cloud-init stages. You can supply edge configuration during the edge host installation with Edge Installer and at the operating system (OS) layer by customizing the OS pack. Once the edge host installation process is complete, the OS stages take effect during the boot-up process.

To make effective use of edge configuration, it would be really useful to review various cloud init stages and the boot order sequence.

![The boot order sequence, listing 9 steps that flow in a sequential order ](/clusters_edge_cloud-init_boot-order-squence.png)

## Edge Installer Configuration

The Edge installation process expects certain installation properties which can be supplied in multiple stages. Common instalaltion configuration that applies for all your sites can be supplied during manufacturing or staging phase. Additional site specific configuration can be augmented by the site operator at the site during site installation. The configuration provided in various stages is merged together to create the final configuration for the edge host.

# Resources

- [Edge OS Configuration: Cloud-Init Stages](/clusters/edge/edge-configuration/cloud-init)

- [Edge Install Configuration](/clusters/edge/edge-configuration/stylus-reference)
