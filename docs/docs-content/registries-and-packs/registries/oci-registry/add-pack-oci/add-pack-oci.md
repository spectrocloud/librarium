---
sidebar_label: "Add a Pack to an OCI Registry"
title: "Add a Pack to an OCI Registry"
description: "Learn how to upload packs to OCI registries."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
---

Palette supports the use of Open Container Initiative (OCI) registries. You can register a private OCI registry with
Palette, publish custom packs, and then use the packs in your cluster profiles.

Two types of OCI authentication are available: registries that support basic authentication, such as
[Harbor](https://goharbor.io/), and [AWS Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/), which is
supported as a third-party registry provider. To upload packs to OCI registries, you can use
[ORAS](https://oras.land/docs/), a CLI tool for pushing and pulling OCI artifacts to and from OCI registries. To learn
more about OCI registries and how they work in Palette, refer to the [OCI Registry](../oci-registry.md) page.

## Resources

The following pages provide detailed instructions on how to push packs to OCI-compliant registries.

- [Add a Pack to a Basic OCI Registry](./add-pack-oci-basic.md)
- [Add a Pack to an ECR Registry](./add-pack-oci-ecr.md)
