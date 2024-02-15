---
sidebar_label: "Deploy Same Pack to Multiple Layers"
title: "Deploy Same Pack to Multiple Layers"
description: "Learn how to deploy the same pack to multiple layers in a Palette cluster profile."
hide_table_of_contents: false
sidebar_position: 30
tags: ["profiles", "cluster profiles"]
---

Palette allows you to add a pack multiple times to the same cluster profile, which can be required in certain scenarios
where an integration needs to be installed more than once with different configurations. For example, you may need to
deploy two instances of the same microservice or application but with different configurations. In this case, you will
need to launch the Postgres application twice with different configurations.

:::warning

Depending on the application, you might have to place the repeated pack in a different namespace, as resource conflicts
could arise from the original pack having Kubernetes resources named identical to the one the second pack would create.

:::

In order to allow packs to be added multiple times in a profile, add the `spectrocloud.com/display-name: <custom_name>`
key to the pack values in the YAML editor. The key `<custom_name>` is a name unique across a cluster profile and the
cluster.

```yaml hideClipboard
pack:
namespace: "external-dns"
spectrocloud.com/display-name: "dns-1"
```

If the same pack is needed at another layer, repeat the above block with the same namespace but a different name such as
`dns-2`. Display names used for a pack across layers should be unique.

By default Palette uses the Helm chart release name in the format `packName-chartName`. In cases where a lengthy release
name causes an issue, you can customize Helm chart `releaseNames` using the format below.

```yaml hideClipboard
pack:
  namespace: kube-system
  releaseNameOverride:
    actual_chart_name1: custom_name1
    actual_chart_name2: custom_name2
```
