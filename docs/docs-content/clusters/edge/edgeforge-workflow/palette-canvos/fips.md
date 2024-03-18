---
sidebar_label: "Build FIPS-Enabled Edge Artifacts"
title: "Build FIPS-Enabled Edge Artifacts"
description: "Learn how to build Edge Installer ISO and provider images to install FIPS-compliant Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge supports Federal Information Processing Standards (FIPS)-compliant Edge clusters. To deploy a
FIPS-compliant Edge cluster, you need to build FIPS-enabled Edge artifacts. Both the Edge Installer ISO and the provider
images must be FIPS-enabled.

This page guides you through the process of building FIPS-enabled Edge artifacts.

## Prerequisites

## Build FIPS-Enabled Edge Artifacts

### Clone CanvOS Repository

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

2. Change to the **CanvOS/** directory.

```bash
cd CanvOS
```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

```bash
git tag
```

4. Check out the newest available tag. This guide uses the tag **v4.3.0** as an example.

```shell
git checkout v4.3.0
```

### Build FIPS-Enabled Provider Image

Palette supports the Operating Systems (OS) Red Hat Enterprise Linux (RHEL) and Ubuntu for FIPS-enabled provider image.
Choose the OS that you want to build the provider image with.

<Tabs>

<TabItem label="Red Hat Enterprise Linux" value="rhel">

5. Change into the **rhel-fips** directory.

6. In the file **Dockerfile**, provide your RHEL subscription username and password.

   ```text
   ARG USERNAME=name@spectrocloud.com
   ARG PASSWORD=***********
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

8. Push the provider image to a repository where it can be access by the Edge host during installation.

</TabItem>

<TabItem label="Ubuntu" value="ubuntu">

5. Change into the **ubuntu-fips** directory.

6. In the file **pro-attach-config.yaml**, provide your Ubuntu Pro subscription token.

   ```yaml
   token: *******
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

8. Push the provider image to a repository where it can be access by the Edge host during installation.

</TabItem>

### Build Edge Installer ISO

9. Return to the **CanvOS** directory.
