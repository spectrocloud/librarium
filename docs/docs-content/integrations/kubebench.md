---
sidebar_label: "kube-bench"
title: "kube-bench"
description: "kube-bench security pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: https://registry-addon.spectrocloud.com/v1/kube-bench/blobs/sha256:28c233e5ad884d5356a183c37f323263eb4acca860c28b326ecd99094b500c31?type=image/png
tags: ["packs", "kube-bench", "security"]
---

Palette executes kube-bench, a CIS Benchmark scanner by Aqua Security, for every Kubernetes pack to ensure the control
plane and worker nodes are configured securely. It is available as an Add-on layer within Palette.

kube-bench runs against a series of checks specified in a `controls` YAML file. For more information on how to write
tests and config files, refer to the [controls](https://github.com/aquasecurity/kube-bench/blob/main/docs/controls.md)
section.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="0.6.x" value="0.6.x">

- **0.6.8**

</TabItem>
</Tabs>

## References

- [kube-bench GitHub](https://github.com/aquasecurity/kube-bench/blob/main/docs/running.md#running-kube-bench)
