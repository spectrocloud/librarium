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

- [ ] Downloaded the airgap setup binary from the support team.

- [ ] Created a private repository with the name `spectro-packs` in your OCI registry. You can use a different name if
      you prefer.

- [ ] Created a public repository with the name `spectro-images` in your OCI registry. You can use a different name if
      you prefer.

- [ ] Authenticated with your OCI registry and acquired credentials to both repositories.

- [ ] Download the Certificate Authority (CA) certificate from your OCI registry.

- [ ] Set the required environment variables for the airgap setup binary. The values are different depending on what
      type of OCI registry you use.

- [ ] Start the airgap setup binary and verified the setup completed successfully.

- [ ] Reviewed the list of pack binaries to download and upload to your OCI registry.

- [ ] Extracted the manifest content from the airgap setup binary to an HTTP file server.

- [ ] Ensure the manifest content is hosted on an HTTP file server accessible from the environment to which you are
      installing Palette.
