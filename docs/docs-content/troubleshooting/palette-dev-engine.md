---
sidebar_label: "Palette Dev Engine"
title: "Palette Dev Engine"
description: "Troubleshooting steps for errors encountered with Palette Dev Engine."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["troubleshooting", "pde", "app mode"]
---

# Palette Dev Engine (PDE)

Use the following content to help you troubleshoot issues you may encounter when using Palette Dev Engine (PDE).

<br />

## Resource Requests

All [Cluster Groups](../clusters/cluster-groups/cluster-groups.md) are configured with a default [_LimitRange_](https://kubernetes.io/docs/concepts/policy/limit-range/). The LimitRange configuration is in the Cluster Group's Virtual Cluster configuration section. Packs deployed to a virtual cluster should have the `resources:` section defined in the **values.yaml** file. Pack authors must specify the `requests` and `limits` or omit the section entirely to let the system manage the resources.

If you specify `requests` but not `limits`, the default limits imposed by the LimitRange will likely be lower than the requests, causing the following error.

<br />

```shell hideClipboard
Invalid value: "300m": must be less than or equal to CPU limit spec.containers[0].resources.requests: Invalid value: "512Mi": must be less than or equal to memory limit
```

<br />

The workaround is to define both the `requests` and `limits`.

<br />
