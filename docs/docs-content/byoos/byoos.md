---
sidebar_label: "Bring Your Own OS (BYOOS)"
title: "Bring Your Own OS (BYOOS)"
description: "Learn how to add your own OS images to a Palette cluster profile."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "person-walking-luggage"
tags: ["operating system", "byoos", "profiles", "cluster profiles"]
---

Palette allows the flexibility to bring your own Operating System (OS) to use with your Kubernetes clusters. Use the
**Bring Your Own OS (BYOOS)** pack to upload your own OS images, configure drivers, and customize the OS to meet your
specific requirements. This feature is especially useful for organizations with strict requirements around security,
compliance, or specific hardware configurations.

The ability to bring your own OS to Palette gives you more control over dependencies in your environment and ensures
compatibility with your existing applications. The OS you bring can be commercial or an open source distribution.

## Get Started

To get started with BYOOS, you need to create an OS image and make it available to Palette or VerteX. Review the
[Create Images with Image Builder](../byoos/image-builder/image-builder.md) guide to learn how to create an OS image
using the Kubernetes Image Builder (KIB) project.

## CAPI Image Builder

:::preview

:::

An alternative to the default image building process that uses the Kubernetes Image Builder (KIB) project is the CAPI
Image Builder. The CAPI Image Builder is a tool we develop and maintain to reduce the challenges of creating images for
Kubernetes clusters. Check out the [Create Images with CAPI Image Builder](./capi-image-builder/capi-image-builder.md)
guide to learn how to use the [CAPI Image Builder](https://github.com/kubernetes-sigs/image-builder) project to create
images for Palette and VerteX.

## Resources

- [Create Images with Image Builder](../byoos/image-builder/image-builder.md)

- [Create Images with CAPI Image Builder](capi-image-builder/capi-image-builder.md)

- <VersionedLink text="BYOOS Pack" url="/integrations/packs/?pack=generic-byoi" />

{/* PERSONA-CHECK-TEST: temporary section, remove before merge (DOC-2473) */}

## Choose Between Commercial and Open Source Images

This section is temporary, made-up content added to test the persona-check workflow. When you bring
your own operating system, you can use either a commercial distribution or an open source
distribution. The right choice depends on your support requirements, compliance posture, and budget.

Commercial distributions, such as a vendor-supported enterprise Linux, include paid support contracts
and certified update channels. These distributions suit organizations that need a guaranteed response
time for security patches and a clear chain of accountability for compliance audits.

Open source distributions give you full control over the image contents and remove licensing costs.
They suit teams that have the in-house expertise to maintain their own patch cadence and that prefer
to avoid vendor lock-in.

Consider the following factors before you decide:

- **Support model**: Commercial images include vendor support, while open source images rely on
  community resources or your own team.

- **Patch cadence**: Confirm how quickly each option delivers security updates for your hardware.

- **Compliance**: Verify that your chosen image can meet the controls required by your industry.
