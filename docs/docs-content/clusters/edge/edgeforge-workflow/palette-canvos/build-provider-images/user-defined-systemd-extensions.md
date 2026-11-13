---
sidebar_label: "Add User-Defined Extensions"
title: "Add User-Defined systemd Extensions"
description:
  "Learn how to build your own systemd extension and add it to a Palette Edge cluster to run custom software, such as a
  security agent or a VPN client, on your Edge hosts."
icon: ""
hide_table_of_contents: false
sidebar_position: 6
tags: ["edge"]
---

:::preview

:::

In addition to the Kubernetes and Palette Agent binaries that Palette delivers through
[systemd extensions](./systemd-extensions.md), you can build and add your own systemd extensions to run custom software
on your Edge hosts. User-defined extensions are useful for software that must run on the host operating system rather
than in a container, such as an endpoint security agent or a VPN client.

A user-defined extension is a `.sysext.raw` image that layers your software onto the read-only host filesystem at
runtime, without modifying the base operating system or rebuilding the provider image. Common examples include an
endpoint security agent, such as [CrowdStrike Falcon](https://www.crowdstrike.com), and a mesh VPN, such as
[Tailscale](https://tailscale.com).

## Support Requirements

User-defined extensions have the same host and agent requirements as the extensions that Palette delivers. Refer to
[Support Requirements](./systemd-extensions.md#support-requirements) on the Deliver Kubernetes and Agent Binaries via
systemd Extensions page before you continue.

## Build the Extension

Palette uses the upstream Kairos system-extension format. Follow the
[Kairos sys-extensions guide](https://kairos.io/docs/advanced/sys-extensions) to package your software into a
`.sysext.raw` image.

Include the metadata file `/usr/lib/extension-release.d/extension-release.<name>` in the image, where `<name>` matches
the extension name. Set the release identifier to match your host operating system, or set `ID=_any` to allow the
extension on any operating system.

<!-- TODO(DOC-3261): confirm whether the palette-sysext CLI is the recommended build tool or whether users follow the upstream Kairos flow directly (Chris Paap, Q4). -->

## Add the Extension to a Cluster

You declare a user-defined extension in the cluster profile. Palette stages the extension on each host, and
`systemd-sysext` overlays it at boot alongside the extensions that Palette delivers.

<!-- TODO(DOC-3261): document the supported declaration path and exact schema, pending Engineering confirmation (Chris Paap, Q1-Q2).
  Candidate paths: `stylus.extensions` in the OS/user-data layer, or `pack.content.extensions` in a custom pack.
  Need: the exact fields (name, version, source), the supported source schemes (`oci://` and `file:///`), and which path to document for 4.10.
  Add the verified YAML example here once confirmed. -->

## Supply Configuration and Secrets

Keep mutable configuration and secrets out of the `.sysext.raw` image. A system extension is read-only, and its contents
are available to anyone who can inspect the image. Supply values such as a Tailscale authentication key or a CrowdStrike
customer ID through cloud-config so that they are written to `/etc/` on the host during provisioning.

<!-- TODO(DOC-3261): add the cloud-config example once the declaration schema is confirmed. -->

## Examples

<!-- TODO(DOC-3261): add worked examples for CrowdStrike Falcon and Tailscale once the declaration schema and the cloud-config pattern are confirmed. -->
