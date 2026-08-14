---
sidebar_label: "Upload a Model"
title: "Upload a Model"
description:
  "Step-by-step guidance for platform operators on how to download a model on a jumpbox and upload it to a PaletteAI
  Inference Launchpad appliance with the Palette CLI over SSH."
hide_table_of_contents: false
sidebar_position: 1.5
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "model upload", "jumpbox", "palette cli", "huggingface", "rsync", "ssh", "air-gapped"]
---

{/* NEEDS REVIEW: per SME review, the model-upload flow is expected to change due to storage constraints and requirements. Revisit this guide when the new flow lands. */}

PaletteAI Inference Launchpad is a self-contained appliance with no outbound internet access, so you bring models to it
rather than having the appliance pull them at deploy time. You download a model onto a jumpbox and transfer it to the
appliance over SSH, after which the model appears in the appliance's deploy catalog.

This guide comes before [Deploy a Model](./deploy-a-model.md): the upload puts the model in the catalog, and the deploy
serves it. For the full command flags and metadata file fields, refer to
[Model Upload Reference](../reference/model-upload-reference.md).

:::info

You run every step in this guide from a **jumpbox**: a separate machine (also called the administrative workstation)
with network access to your model source, such as Hugging Face, and SSH access to the appliance. The appliance never
downloads models itself. For how to provision the jumpbox, refer to
[Administrative Workstation](../reference/hardware-requirements.md#administrative-workstation).

:::

## Prerequisites

- A **jumpbox** (administrative workstation) on the appliance network, provisioned with the Palette CLI, an SSH client
  and key pair (or password authentication), enough local disk to stage model downloads, and network access to your
  model source, such as Hugging Face. For details, refer to
  [Administrative Workstation](../reference/hardware-requirements.md#administrative-workstation) and
  [Model Download Access](../reference/hardware-requirements.md#model-download-access-recommended).
- `rsync` on the jumpbox. The Palette CLI uses it to transfer the model to the appliance over SSH.
- The metadata YAML for the model you intend to upload, obtained from Artifact Studio. For its fields, refer to
  [Model Metadata File](../reference/model-upload-reference.md#model-metadata-file).
- The appliance's SSH host address (IP or DNS name) and an SSH user.
- _(Gated or private Hugging Face repositories)_ A Hugging Face access token.

{/* NEEDS REVIEW: the source specifies rsync 3.2.3+ and OpenSSH 8.4+ on the jumpbox. Confirm the minimum versions before publishing. */}

## Download the Model

On the jumpbox, download the model from Hugging Face into a writable local directory. Do not use a read-only NFS mount.

1. Run the download command, using the path to your metadata file and the directory to download into.

   ```bash
   palette content model download \
       --metadata model.yaml \
       --model-dir ./models
   ```

   The model downloads to `<model-dir>/<name>/<version>/`, where `<name>` and `<version>` come from the metadata file.

2. _(Gated or private Hugging Face repositories)_ Provide a Hugging Face token through the `HF_TOKEN` environment
   variable.

   ```bash
   HF_TOKEN=<hugging-face-token> palette content model download \
       --metadata model.yaml \
       --model-dir ./models
   ```

## Upload the Model to the Appliance

Ship the downloaded directory from the jumpbox to the appliance over SSH. On a multi-node appliance, upload to a single
node; the appliance syncs the model to the remaining nodes automatically.

1. Run the upload command with the model directory and the appliance's SSH details.

   ```bash
   palette content model upload \
       --metadata model.yaml \
       --model-dir ./models \
       --ssh-user <ssh-user> \
       --ssh-host <appliance-host> \
       --ssh-key <private-key-path>
   ```

   Replace `<ssh-user>` and `<appliance-host>` with the appliance's SSH user and address, and `<private-key-path>` with
   the path to your private key, such as `~/.ssh/id_ed25519`.

   :::warning `--model-dir` points at the parent, not the model's own directory

   `--model-dir` is the directory that _contains_ `<name>/<version>/`, not the directory named after the model. The
   Palette CLI composes the model path as `<model-dir>/<name>/<version>/` from the `name` and `version` fields in your
   metadata YAML. For a model at `./models/my-model/1.0.0/`, pass `--model-dir ./models`. Passing
   `--model-dir ./models/my-model` produces the error
   `model dir ./models/my-model/my-model/1.0.0 is not a complete download for my-model@1.0.0`, with the model name
   doubled in the path.

   :::

The upload command accepts other flags, including password authentication (`--ssh-password`, optionally with
`--insecure-skip-host-key-check`), one-step download and upload (`--download`), and metadata-only sync
(`--metadata-only`). For the full list, refer to
[Model Upload Reference](../reference/model-upload-reference.md#palette-content-model-upload).

## Verify the Model and Deploy It

:::warning

The appliance surfaces an uploaded model only when it matches an entry in the appliance's curated model catalog. If you
upload a model that is not in the curated catalog, the upload succeeds but the model does not appear in the deploy
catalog.

:::

{/* NEEDS REVIEW: per the source, an uploaded model that does not match a curated catalog entry is logged but not surfaced today, with a schema-gap follow-up planned. Confirm current behavior before publishing. */}

{/* NEEDS REVIEW: multi-node catalog states and automatic peer sync are from the engineering source. Confirm the labels and behavior before publishing. */}

1. In the appliance console, select **Cluster** from the left main menu, then select **Deploy model** to open the deploy
   panel.

2. Open the model drop-down menu and confirm the model you uploaded is listed. On a single-node appliance, the model
   appears on the next catalog scan after the upload finishes. On a multi-node appliance, the catalog shows the model's
   cluster-wide state: `Available` when the model is ready on every node, `Pending N/M` while nodes are still syncing,
   or `Missing`. Only an `Available` model can be deployed.

3. Deploy the model by following [Deploy a Model](./deploy-a-model.md).

## Next Steps

- **Deploy the model:** Follow [Deploy a Model](./deploy-a-model.md) to deploy the uploaded model and verify it is
  serving.
- **Review the reference:** Refer to [Model Upload Reference](../reference/model-upload-reference.md) for the full
  command flags and metadata file fields.
- **Enable vision preprocessing:** If you uploaded a vision model to use with a text-only model, follow
  [Enable Vision Preprocessing](./enable-vision-preprocessing.md).
