---
sidebar_label: "Enable Local Harbor Image Registry"
title: "Enable Local Harbor Image Registry"
description: "Guide to enabling a local harbor registry on an Edge deployment."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge allows you provision a local Harbor image registry as part of your Edge deployment. When your Edge cluster is created for the first time, all images downloaded from the cloud are stored locally in the Harbor registry. This allows your Edge cluster to reboot containers or add new nodes without being connected to the external network. 

## Limitations

## Prerequisites
- At least one Edge host with an x86_64 processor architecture. 

- Each of your Edge hosts must have at least 2 CPUs, 8 GB of RAM, and your cluster needs at least 160 GB of persistent storage. We recommend that your host have 4 CPUs, 8 GB of RAM, and the cluster has at least 160 HB of  persistent storage. 