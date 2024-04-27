---
sidebar_label: "Checklist"
title: "Checklist"
description:
  "An airgap installation of Palette requires a few steps to be completed before the installation can begin. This
  checklist will help you prepare for the installation."
icon: ""
sidebar_position: 30
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap"]
keywords: ["self-hosted", "enterprise"]
---

Use the following checklist to ensure you have completed all the required steps before deploying the airgap Palette
installation.

- [ ] Create a vSphere VM and Template folder named `spectro-templates`.

- [ ] Import the Operating System and Kubernetes distribution OVA required for the installation and place the OVA in the
      `spectro-templates` folder.

- [ ] Append the `r_` prefix and remove the `.ova` suffix from the OVA name after the import.

- [ ] Start the airgap setup binary and verify the setup is completed successfully.

- [ ] Review the list of [pack binaries](../../airgap/supplemental-packs.md) to download and upload to your OCI
      registry.
