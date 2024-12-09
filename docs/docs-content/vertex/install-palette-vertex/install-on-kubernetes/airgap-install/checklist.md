---
sidebar_label: "Checklist"
title: "Airgap VerteX Installation Checklist"
description:
  "An airgap installation of Palette requires a few steps to be completed before the installation can begin. This
  checklist will help you prepare for the installation."
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["vertex", "enterprise", "airgap", "kubernetes"]
keywords: ["self-hosted", "vertex"]
---

Use the following checklist to ensure you have completed all the required steps before deploying the airgap Palette
installation.

- [ ] `oras` CLI v1.0.0 is installed and available.

- [ ] `aws` CLI v2 or greater CLI is installed and available.

- [ ] `zip` is installed and available.

- [ ] Download the airgap setup binary from the support team.

- [ ] Create a private repository named `spectro-packs` in your OCI registry. You can use a different name if you
      prefer.

- [ ] Create a public repository named `spectro-images` in your OCI registry. You can use a different name if you
      prefer.

- [ ] Authenticate with your OCI registry and acquired credentials to both repositories.

- [ ] Download the Certificate Authority (CA) certificate from your OCI registry.

- [ ] Set the required environment variables for the airgap setup binary. The values are different depending on what
      type of OCI registry you use.

- [ ] Start the airgap setup binary and verified the setup completed successfully.

- [ ] Review the list of pack binaries to download and upload to your OCI registry.
