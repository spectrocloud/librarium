---
sidebar_label: "Required Network Rules"
title: "Required Network Rules"
description: "Cox Edge deployments require the following network rules for a successful Palette deployment."
hide_table_of_contents: false
sidebar_position: 20
tags: ["public cloud", "cox edge"]
---

To successfully deploy a host cluster to Cox Edge with Palette, you must add the following network rules to each
deployment.

## Inbound

The following inbound network rules are required for Palette to deploy and manage a Cox Edge cluster.

| Port | Protocol | Source    | Description                                                                   |
| ---- | -------- | --------- | ----------------------------------------------------------------------------- |
| 22   | TCP      | 0.0.0.0/0 | To support the secure shell (SSH) protocol.                                   |
| 179  | TCP      | 0.0.0.0/0 | Required for the Border Gateway Protocol (BGP).                               |
| 6443 | TCP      | 0.0.0.0/0 | Required for Palette to communicate with the cluster's Kubernetes API server. |
| 4789 | UDP      | 0.0.0.0/0 | Required for networking with VXLAN.                                           |
