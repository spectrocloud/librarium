---
sidebar_label: "Additional OVAs"
title: "Additional OVAs"
description: "Learn how to download and install additional OVAs for an airgapped self-hosted Palette environment."
sidebar_position: 20
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap", "downloads"]
keywords: ["self-hosted", "enterprise"]
---

The following tables list additional OVAs you may need depending on the Kubernetes version and distribution you want to
use for the workload clusters.

<PartialsComponent category="self-hosted" name="airgap-additional-ovas" />

## Usage Instructions

Use the provided download URL to download the OVA and upload it to your vSphere environment. The OVA must be uploaded to
the `spectro-templates ` so Palette can access it.

One additional note about uploaded OVAs, the OVA name must be prefixed with `r_` to be recognized by Palette. You can
rename the OVA before you upload it or after you upload it to vSphere. Use the following command examples to download
and rename the necessary OVA files with `curl` or `wget`.

<Tabs>
<TabItem label="curl" value="curl">

```shell
curl --output r_u-2204-0-k-12610-0.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
```

</TabItem>

<TabItem label="wget" value="wget">

```shell
wget --quiet --show-progress \
--output-document=r_u-2204-0-k-12610-0.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
```

</TabItem> 
</Tabs>
