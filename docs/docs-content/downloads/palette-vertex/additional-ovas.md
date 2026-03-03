---
sidebar_label: "Additional OVAs"
title: "Additional OVAs"
description: "Learn how to download and install additional OVAs for an airgapped Palette VerteX environment."
sidebar_position: 20
hide_table_of_contents: false
tags: ["palette", "airgap", "downloads", "vertex"]
keywords: ["enterprise", "vertex"]
---

The following tables list additional OVAs you may need depending on the Kubernetes version and distribution you want to
use for the workload clusters.

<PartialsComponent category="vertex" name="airgap-additional-ovas" />

## Usage Instructions

Use the provided download URL to download the OVA and upload it to your vSphere environment. The OVA must be uploaded to
the `spectro-templates ` so VerteX can access it. One additional note about uploaded OVAs, the OVA name must be prefixed
with `r_` to be recognized by VerteX. You can rename the OVA before you upload it or after you upload it to vSphere.

<Tabs>
<TabItem label="curl" value="curl">

The following example shows how to download the `u-2004-0-k-1259-fips.ova` OVA and rename it to
`r_u-2004-0-k-1259-fips.ova` using `curl` and the `--output` flag.

```shell
curl --output r_u-2004-0-k-1259-fips.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-1259-fips.ova
```

</TabItem>

<TabItem label="wget" value="wget">

The following example shows how to download the `u-2004-0-k-1259-fips.ova` OVA and rename it to
`r_u-2004-0-k-1259-fips.ova` using `wget` and the `--output-document` flag.

```shell
wget --quiet --show-progress \
--output-document=r_u-2004-0-k-1259-fips.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-1259-fips.ova
```

</TabItem> 
</Tabs>
