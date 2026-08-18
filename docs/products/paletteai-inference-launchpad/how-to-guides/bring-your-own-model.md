---
sidebar_label: "Bring Your Own Model"
title: "Bring Your Own Model"
description:
  "Step-by-step guidance for platform operators on how to bring a model that is not in the certified catalog onto a
  PaletteAI Inference Launchpad appliance: author metadata.yaml, download from Hugging Face, upload to the appliance,
  and deploy."
hide_table_of_contents: false
sidebar_position: 1.6
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "bring your own model", "metadata", "huggingface", "upload", "deploy"]
---

This guide explains how to bring a model that is not in the certified catalog onto a PaletteAI Inference Launchpad
appliance. You author `metadata.yaml`, download the weights from Hugging Face onto a jumpbox, upload them to the
appliance, and deploy the model. Download, upload, and deploy match the certified-model flow. The extra step is
authoring the metadata file instead of downloading it from Artifact Studio.

Spectro Cloud has not validated a model you bring yourself. You confirm that it fits your GPUs and that it serves
requests on your hardware. For what certification covers, refer to
[Model Certification](../explanation/model-certification.md). For the certified list, refer to
[Certified Models by Hardware](../reference/certified-models-by-hardware.md).

|                              | **Certified model**                                           | **Your own model**                           |
| ---------------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| **Metadata**                 | Download `metadata.yaml` from Artifact Studio.                | Author `metadata.yaml` yourself.             |
| **Download, upload, deploy** | Follow [Upload a Model](./upload-a-model.md), then deploy.    | The same steps, using the file you authored. |
| **Validation**               | Spectro Cloud has tested it on the listed GPU configurations. | You validate it on your hardware.            |

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- A jumpbox with the Palette CLI, `rsync`, SSH access to the appliance, and network access to Hugging Face. Refer to
  [Upload a Model](./upload-a-model.md#prerequisites).
- The Hugging Face repository for the model, and a token if the repository is gated or private.
- Enough GPU memory on the appliance for the model. Refer to
  [Suggested Hardware](../reference/hardware-requirements.md).

## Create the Metadata File

On the jumpbox, create a YAML file for the model. Only `name`, `version`, and `huggingface.repo` are required. The
Palette CLI uses `name` and `version` as the path `<model-dir>/<name>/<version>/`. The appliance uses `name` as the
catalog name.

The following example is a starting point. Replace the repository, version, and GPU fields with values for your model
and hardware. For every field, refer to
[Model Metadata File](../reference/model-upload-reference.md#model-metadata-file).

```yaml
name: my-model
version: 1.0.0

huggingface:
  repo: org/my-model
  revision: main
  files:
    - "*.safetensors"
    - "*.json"
    - "tokenizer*"

launchpad:
  engine: vllm
  variants:
    - vendor: nvidia
      gpu_product: NVIDIA-H200
      vram_gb: 141
      min_gpus: 4
      serve:
        tensor_parallel_size: 4
```

`launchpad` is optional. Include it when you need to pin an engine or describe which GPUs can host the model. The
Palette CLI ships the block to the appliance unchanged.

Save the file, for example as `my-model.yaml`. Pass that path as `--metadata` in the download and upload commands.

:::info

The parser rejects unknown top-level fields. Stay with the fields listed in
[Model Metadata File](../reference/model-upload-reference.md#model-metadata-file).

:::

## Download the Model from Hugging Face

On the jumpbox, download the model from Hugging Face into a writable local directory. Do not use a read-only NFS mount.

1. Run the download command, using the path to the metadata file you authored and the directory to download into.

   ```bash
   palette content model download \
       --metadata my-model.yaml \
       --model-dir ./models
   ```

   The model downloads to `<model-dir>/<name>/<version>/`, where `<name>` and `<version>` come from the metadata file.

2. _(Gated or private Hugging Face repositories)_ Provide a Hugging Face token through the `HF_TOKEN` environment
   variable.

   ```bash
   HF_TOKEN=<hugging-face-token> palette content model download \
       --metadata my-model.yaml \
       --model-dir ./models
   ```

## Upload the Model to the Appliance

Ship the downloaded directory from the jumpbox to the appliance over SSH. On a multi-node appliance, upload to a single
node; the appliance syncs the model to the remaining nodes automatically.

1. Run the upload command with the model directory and the appliance's SSH details.

   ```bash
   palette content model upload \
       --metadata my-model.yaml \
       --model-dir ./models \
       --ssh-user <ssh-user> \
       --ssh-host <appliance-host> \
       --ssh-key <private-key-path>
   ```

   Replace `<ssh-user>` and `<appliance-host>` with the appliance's SSH user and address, and `<private-key-path>` with
   the path to your private key, such as `~/.ssh/id_ed25519`.

   :::warning `--model-dir` points at the parent, not the model's own directory

   `--model-dir` is the directory that _contains_ `<name>/<version>/`, not the directory named after the model. For a
   model at `./models/my-model/1.0.0/`, pass `--model-dir ./models`. Refer to
   [Upload a Model](./upload-a-model.md#upload-the-model-to-the-appliance).

   :::

For the full flag list, refer to
[Model Upload Reference](../reference/model-upload-reference.md#palette-content-model-upload).

## Deploy the Model

1. In the appliance console, select **Cluster** from the left main menu, then select **Deploy model**.

2. Open the model drop-down menu and confirm the model you uploaded is listed. On a single-node appliance, the model
   appears on the next catalog scan after the upload finishes. On a multi-node appliance, the catalog shows the model's
   cluster-wide state: `Available` when the model is ready on every node, `Pending N/M` while nodes are still syncing,
   or `Missing`. Only an **Available** model can be deployed.

3. Deploy and verify the model. Refer to [Deploy a Model](./deploy-a-model.md).

## Next Steps

- [Upload a Model](./upload-a-model.md)
- [Deploy a Model](./deploy-a-model.md)
- [Model Upload Reference](../reference/model-upload-reference.md)
- [Model Certification](../explanation/model-certification.md)
