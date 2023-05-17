---
title: "BYOOS"
metaTitle: "Bring your own OS"
metaDescription: "Customize your Edge host deployment with your own Operating System."
hiddenFromNav: true
type: "integration"
category: ["byoos"]
logoUrl: ""
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Bring Your Own Operating System (BYOOS) 

BYOOS (Bring Your Own Operating System) enables you to deploy and customize the operating system in your environment, offering greater flexibility and control over the infrastructure. BYOOS feature optimizes infrastructure and streamlines workflows, allowing users to specify a host runtime operating system, thus providing customization options to meet specific needs.

Spectro Cloud offers BYOOS support for both Edge and non-Edge environments.

To learn how to use BYOOS in Edge and non-Edge environments, check out the []() and [] () guides.

# Versions Supported

**1.0.x**

## Prerequisites 

To use the non-Edge BYOOS pack, you must have the following:
<br />

- Access to a non-Edge repository that contains the generic BYOOS pack.

## Parameters

## Installer Parameters

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `pack:content:` | Specifies the content of the **BYOS Edge OS** pack. |
| `pack.content.images` | Specifies the list of OS images to use for the pack. |
| `pack.content.images.-  images` | Specifies a specific OS image to use for the pack. |


## User Data Parameters

| Parameter            | Description                                            |
|----------------------|--------------------------------------------------------|
| `options.system.uri:` | The system URI specifying the location of the BYOOS image. |
| `image.registry` | The domain of the registry where the BYOOS image is stored. |
| `image.repo` | The name of the BYOOS image repository. |
| `image.palette.edge.version` | The Palette Edge software version used in the BYOOS container image. |
| `image.client.tag` |  The tag given to the image used for the BYOOS, specifying its version. |

## Usage

# Troubleshooting

# Terraform

# References