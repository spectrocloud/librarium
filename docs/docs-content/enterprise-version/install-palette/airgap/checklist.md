---
sidebar_label: "Checklist"
title: "Checklist"
description:
  "An airgap installation of Palette requires a few steps to be completed before the installation can begin. This
  checklist will help you prepare for the installation."
icon: ""
sidebar_position: 40
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap"]
---

Use the following checklist to ensure you have completed all the required steps before deploying the airgap Palette
installation.

<Tabs queryString="platform">

<TabItem label="Kubernetes" value="k8s">

- [ ] `oras` CLI v1.0.0 is installed and available.

- [ ] `aws` CLI v2 or greater CLI is installed and available.

- [ ] `zip` is installed and available.

- [ ] Downloaded the airgap setup binary from the support team.

- [ ] Created a private repository with the name `spectro-packs` in your OCI registry. You can use a different name if
      you prefer.

- [ ] Created a public repository with the name `spectro-images` in your OCI registry. You can use a different name if
      you prefer.

- [ ] Authenticated with your OCI registry and acquired credentials to both repositories.

- [ ] Set the required environment variables for the airgap setup binary. The values are different depending on what
      type of OCI registry you use.

- [ ] Started the airgap setup binary and verified the setup completed successfully.

- [ ] Reviewed the list of pack binaries to download and upload to your OCI registry.

- [ ] Extracted the manifest content from the airgap setup binary to an HTTP file server.

- [ ] Ensured the manifest content is hosted on an HTTP file server that is accessible from the environment you are
      installing Palette.

</TabItem>

<TabItem label="VMware vSphere" value="vsphere">

- [ ] Create a vSphere VM and Template folder named `spectro-templates`.

- [ ] Import the Operating System and Kubernetes distribution OVA required for the installation and place the OVA in the
      `spectro-templates` folder.

- [ ] Append the `r_` prefix and remove the `.ova` suffix from the OVA name after the import.

- [ ] Start the airgap setup binary and verify the setup is completed successfully.

- [ ] Review the list of [pack binaries](./supplemental-packs.md) to download and upload to your OCI registry.

</TabItem>

</Tabs>
