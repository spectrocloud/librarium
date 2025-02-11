---
sidebar_label: "Annoucements"
title: "Annoucements"
description: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["breaking-changes", "deprecations"]
---

This page lists the upcoming breaking changes, deprecations, and removals in Palette and Palette VerteX. You can also
find previously implemented changes in the [Implemented Changes](#implemented-changes) section.

<!-- vale off -->

## Upcoming Breaking Changes

<!-- vale on -->

Stay informed about the upcoming breaking changes in Palette and Palette VerteX. Use the information below to prepare
for the changes in your environment.

| Change                        | Target Date | Published Date |
| ----------------------------- | ----------- | -------------- |
| No upcoming breaking changes. | -           | -              |

<!-- vale off -->

## Upcoming Deprecations and Removals

<!-- vale on -->

The table below lists the upcoming deprecations and removals in Palette and Palette VerteX. Review the information to
below and take necessary actions to avoid any disruptions in your environment.

| Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Target Date    | Published Date     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| The EdgeForge build process utility, CanvOS, has an argument variable named `PROXY_CERT_PATH`. This variable is deprecated and no longer the recommended way to pass proxy certificates to the CanvOS build process. Use the **certs** folder in the root of the project directory to store proxy certificates. The **certs** folder is automatically included in the CanvOS build process. Refer to the [Build Provider Images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md) for guidance on using the **certs** folder to pass proxy certificates to the CanvOS build process.                                                                                                                                                                                                                         | March 15, 2025 | December 7, 2024   |
| Palette's internal message communication between components transitioned from NATS to gRPC. The previous usage of NATS has been deprecated and will be removed in a future release. This change primarily affects customers using Palette agents on versions older than 4.0. If your clusters still use agents on version 3.x or older, [resume agent upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) to avoid disrupting critical functions such as health monitoring and heartbeat publishing. To learn more about Palette's internal network architecture, refer to the [Network Ports](../architecture/networking-ports.md) page. If you are using network proxies, we recommend you review the [gRPC and Proxies](../architecture/grps-proxy.md) documentation for potential issues. | March 15, 2025 | September 14, 2024 |

## Implemented Changes

You can review previously implemented changes in Palette and VerteX in the following table. Refer to respective release
version's [Release Notes](./release-notes.md) for more information.

| Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |     | Release | Date             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------- | ---------------- |
| The Palette CLI now requires an encryption passphrase for various commands. The passphrase can be set as an environment variable or using a CLI command flag. The passphrase encrypts and decrypts sensitive data, such as secrets, in the CLI configuration files. Refer to the [Palette CLI Encryption](../automation/palette-cli/palette-cli.md#encryption) section to learn more about the encryption passphrase.                                                                                                          |     | 4.5.20  | January 18, 2024 |
| The Terraform resource, `spectrocloud_cluster_import` is removed. To import a cluster deployed outside of the context of Palette, refer to the [Import a Cluster](../clusters/imported-clusters/cluster-import.md) guide.                                                                                                                                                                                                                                                                                                      |     | 4.5.20  | January 18, 2024 |
| Due to Google's decision to deprecate the `gcr.io` container registry, we are adding a new image registry that Palette agents will use to pull images. The new registry is `us-docker.pkg.dev`. If you have network restrictions in place, ensure that the new registry is allowed. Ensure network connections to `grc.io` are allowed until the migration is complete. The new registry is available for use starting with this release. Refer to the Proxy Requirements for a complete list of domains that must be allowed. |     | 4.5.3   | October 13, 2024 |
| In this release, Palette aligns Google Cloud Platform GKE behavior with Azure AKS and AWS EKS and removes the ability to specify a patch version when creating a cluster profile for AKS, EKS, and GKE. Only the major and minor versions are available for selection. The underlying cloud provider will automatically select the latest patch version available for the selected major and minor version.                                                                                                                    |     | 4.4.6   | Jun 15, 2024     |
