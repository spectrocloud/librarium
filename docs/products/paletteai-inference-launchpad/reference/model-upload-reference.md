---
sidebar_label: "Model Upload Reference"
title: "PaletteAI Inference Launchpad Model Upload Reference"
description:
  "Reference for the Palette CLI model download and upload commands and the model metadata file used to place models on
  a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.5
tags: ["paletteai-inference-launchpad", "reference", "models"]
keywords: ["launchpad", "ai", "palette cli", "model upload", "metadata", "huggingface", "air-gapped"]
---

This reference lists the flags for the Palette CLI model commands and the fields of the model metadata file. It supports
the [Upload a Model](../how-to-guides/upload-a-model.md) how-to and
[Bring Your Own Model](../how-to-guides/bring-your-own-model.md).

{/* NEEDS REVIEW: `palette content model download` and `palette content model upload` are a new command surface from the engineering source and are not yet in the published Palette CLI reference. Confirm the command names, flags, and defaults before publishing. */}

## palette content model download

Downloads a model from Hugging Face into a local directory on a connected workstation and records a completion manifest
that a later upload validates against.

| **Flag**                   | **Description**                                                                                                                                                                   | **Required** |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `--metadata`, `-f`         | Path to the model metadata YAML (from Artifact Studio), or a `.tar.gz` bundle of the metadata and files.                                                                          | Yes          |
| `--model-dir`              | Parent directory to download into. Not the model's own directory: the model lands at `<model-dir>/<name>/<version>/`, where `<name>` and `<version>` come from the metadata YAML. | Yes          |
| `--hf-token` (`$HF_TOKEN`) | Hugging Face token for gated or private repositories.                                                                                                                             | No           |

## palette content model upload

Ships an already-downloaded model directory to one appliance node over `rsync` and SSH. By default the upload never
contacts Hugging Face and fails if `--model-dir` is missing or incomplete; pass `--download` to fetch the model first.

**Required flags**

| **Flag**                        | **Description**                                                                                                                                                                                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--metadata`, `-f`              | Path to the model metadata YAML, or a `.tar.gz` bundle of the metadata and files.                                                                                                                                                                                      |
| `--model-dir`                   | Parent directory holding the model at `<model-dir>/<name>/<version>/`. Not the model's own directory: passing the `<name>/` directory yields `model dir <...>/<name>/<name>/<version>/ is not a complete download`. Required unless `--download` or `--metadata-only`. |
| `--ssh-user`                    | SSH user on the target appliance node.                                                                                                                                                                                                                                 |
| `--ssh-host`                    | Address (IP or DNS name) of the target appliance node.                                                                                                                                                                                                                 |
| `--ssh-key` or `--ssh-password` | SSH authentication. Mutually exclusive; `--ssh-password` is supported on Unix workstations only.                                                                                                                                                                       |

**Optional flags**

| **Flag**                         | **Description**                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--download`                     | Fetch (or resume) the model from Hugging Face when `--model-dir` is not already complete, then upload. Mutually exclusive with `--metadata-only`.   |
| `--metadata-only`                | Sync only `metadata.yaml` (and any logo); skip the weights. Mutually exclusive with `--download`.                                                   |
| `--ssh-port`                     | SSH port. Defaults to `22`.                                                                                                                         |
| `--hf-token` (`$HF_TOKEN`)       | Hugging Face token, used with `--download` or to fetch a logo hosted on Hugging Face.                                                               |
| `--keep-model-dir`               | Retain a temporary model directory after a successful upload. Applies only when `--model-dir` is omitted; an explicit `--model-dir` is always kept. |
| `--insecure-skip-host-key-check` | Disable SSH host key verification.                                                                                                                  |

## Model Metadata File

The metadata file is the operator's contract with the appliance. The appliance enforces `name` and `version`. A file
missing either one never reaches the deploy catalog. The appliance does not enforce `huggingface.repo`, but the download
command has no source without it, so a working file sets all three. Every other field is optional.

Unknown fields are ignored rather than rejected, so that a file written by a newer authoring tool still parses. A
misspelled field name is therefore dropped without an error, and the model is served with the default that the field was
meant to override.

| **Field**                   | **Description**                                                                                                                                                                                                                    | **Required** |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`                      | Model name. Sets the `<name>` path segment on the appliance and the name the model appears under in the deploy catalog.                                                                                                            | Yes          |
| `version`                   | Model version. Sets the `<version>` path segment on the appliance.                                                                                                                                                                 | Yes          |
| `displayName`               | Human-readable model name for the console. Defaults to `name`.                                                                                                                                                                     | No           |
| `description`               | Short description of the model, surfaced in the console.                                                                                                                                                                           | No           |
| `author`                    | Publisher of the model, surfaced in the console.                                                                                                                                                                                   | No           |
| `license`                   | License identifier for the model, surfaced in the console.                                                                                                                                                                         | No           |
| `huggingface.repo`          | Source Hugging Face repository. The only source the download command reads.                                                                                                                                                        | Yes          |
| `huggingface.files`         | One or more globs selecting which repository files to download. When omitted, every file is downloaded.                                                                                                                            | No           |
| `huggingface.revision`      | Hugging Face revision (branch, tag, or commit). Defaults to `main`.                                                                                                                                                                | No           |
| `huggingface.logo`          | Path inside the Hugging Face repository to a logo image, downloaded alongside the weights.                                                                                                                                         | No           |
| `huggingface.file_manifest` | Generated list of the repository's files, sizes, and checksums at the pinned revision, which lets a staged copy be verified without network access. Generated, not hand-written.                                                   | No           |
| `logo`                      | A logo bundled from local disk. Mutually exclusive with `huggingface.logo`.                                                                                                                                                        | No           |
| `launchpad`                 | Serving recipe: engine, GPU requirements, per-hardware variants, and engine settings. The Palette CLI ships it to the appliance unchanged, and the appliance reads it to pick a variant for each node and to configure the engine. | No           |

The following example downloads GLM 5.2 weights from a Hugging Face repository and includes a `launchpad` tuning block.

```yaml
name: glm-5.2
version: 1.0.0
displayName: "GLM 5.2"
description: "Zhipu AI GLM 5.2, served on the appliance for coding assistants."
author: Zhipu AI
license: mit

huggingface:
  repo: zai-org/GLM-5.2
  revision: main
  files:
    - "*.safetensors"
    - "*.json"
    - "tokenizer*"
  logo: assets/logo.png # optional: pulled from the Hugging Face repo, saved as logo.<ext>

# logo: ./local-logo.png # OR bundle a local file from disk (mutually exclusive with huggingface.logo)

launchpad: # optional: serving recipe, shipped verbatim by the Palette CLI
  engine: vllm
  min_engine_version: "0.23.0"
  variants:
    - vendor: amd
      gpu_product: MI325X
      vram_gb: 256
      min_gpus: 8
      serve:
        image: rocm/vllm-dev:nightly
        tensor_parallel_size: 8
```

{/* NEEDS REVIEW: the GLM 5.2 example values (the zai-org/GLM-5.2 repository, file globs, and license) are representative. Confirm the canonical repository, weight files, and license with an SME before publishing. */}

### The `launchpad` Block

The `launchpad` block is the serving recipe. Fields set directly on the block are defaults, and each entry in `variants`
overrides them for one hardware cell. When the block is absent, the appliance serves the model with the `vllm` engine
and a floor of one GPU.

| **Field**            | **Description**                                                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `engine`             | Inference engine that serves the model. Defaults to `vllm`.                                                                                                     |
| `min_gpus`           | Minimum number of GPUs the model needs. This is a floor, not the width the model runs at. A node with fewer GPUs does not fit the variant.                      |
| `widths`             | Tensor-parallel widths the deploy picker offers. When omitted, the picker offers `min_gpus` only.                                                               |
| `vram_gb`            | Floor on per-GPU memory, in GB. Checked at deploy time against the memory the nodes advertise. A floor higher than the hardware provides blocks the deployment. |
| `size_gb`            | Approximate on-disk size of the model, surfaced in the console.                                                                                                 |
| `min_driver`         | Minimum GPU driver version. If no node advertises a driver version, the deployment is blocked rather than allowed through unverified.                           |
| `min_engine_version` | Minimum version of the inference engine.                                                                                                                        |
| `rationale`          | Prose explaining why these values were chosen, surfaced in the deploy picker.                                                                                   |
| `serve`              | Engine settings for the cell. Refer to the following table.                                                                                                     |
| `tools`              | The model's tool-calling, structured-output, and reasoning capabilities, which decide the parser flags the engine starts with.                                  |
| `variants`           | List of per-hardware cells. Each entry accepts every field in this table, plus `vendor` and `gpu_product`.                                                      |

Each entry in `variants` may additionally pin the hardware it applies to.

| **Field**     | **Description**                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vendor`      | GPU vendor the cell applies to, such as `nvidia` or `amd`. When unset, the cell applies to any vendor.                                                                                                                                                             |
| `gpu_product` | GPU product label the cell applies to, matched against the node's own label by exact string match. Use the label value the node publishes, such as `NVIDIA-H200` or `AMD_Instinct_MI325_OAM`, not a marketing name. When unset, the cell applies to any GPU model. |

The appliance detects each node's GPU vendor, product, count, and per-GPU memory, then selects the single variant that
fits that node. It expects every node in the cluster to carry the same GPU model. A model that no variant fits still
appears in the deploy catalog, marked as not deployable, with a reason naming what the variant needs against what the
node has.

The following `serve` fields are the ones a serving recipe most often sets.

| **Field**              | **Description**                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `image`                | Container image the engine runs. Pin it by digest for a reproducible deployment.                              |
| `tensor_parallel_size` | Number of GPUs the engine spreads the model across.                                                           |
| `max_model_len`        | Maximum context length the engine serves. A longer context reserves more GPU memory for the key-value cache.  |
| `gpu_memory_util`      | Fraction of each GPU's memory the engine may use.                                                             |
| `quantization`         | Quantization the engine applies to the weights.                                                               |
| `shm_size`             | Size of the shared-memory volume. Multi-GPU serving needs more than the Kubernetes default of 64 Mi.          |
| `env`                  | Environment variables set on the engine.                                                                      |
| `extra_args`           | Additional command-line arguments passed to the engine verbatim.                                              |
| `probe`                | Health-probe budgets as durations: `startup_timeout`, `liveness_timeout`, `interval`, and `response_timeout`. |
| `volumes`              | Additional volumes the engine mounts. Each entry sets `mount_path` and exactly one source.                    |

After a successful upload, the model directory on the appliance node has the following layout.

```text
/usr/local/spectrocloud/content/models/<name>/<version>/
├── ...model files...   # written first (per huggingface.files globs)
├── metadata.yaml       # written last—readiness signal
└── logo.<ext>          # optional (local or Hugging Face-sourced)
```

{/* NEEDS REVIEW: the appliance path /usr/local/spectrocloud/content/models/<name>/<version>/ is from the engineering source. Confirm before publishing. */}

## Upload behavior

Before starting a transfer, the Palette CLI checks that the target host has enough free disk space to hold the model. It
verifies file checksums during the transfer and resumes an interrupted download or upload from where it stopped rather
than starting over.

The CLI writes the weight files first and `metadata.yaml` last, so the presence of `metadata.yaml` on the appliance node
is the "upload complete" signal for that host.

On a multi-node cluster, the CLI uploads to a single node. The appliance then synchronizes the model to the other hosts,
reconciling about every two minutes. In the deploy catalog, a model shows one of the following states, and only
**Available** models are selectable for deployment.

| **State**     | **Meaning**                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| **Available** | The model is ready on every node in the cluster and can be deployed.              |
| **Pending**   | The model is uploaded but the appliance is still synchronizing it to every node.  |
| **Missing**   | The appliance has metadata for the model but the weights are not yet on the node. |

## Resources

- [Upload a Model](../how-to-guides/upload-a-model.md) walks through the download and upload flow for a certified model.
- [Bring Your Own Model](../how-to-guides/bring-your-own-model.md) authors metadata, then downloads, uploads, and
  deploys a model that is not in the certified catalog.
- [Deploy a Model](../how-to-guides/deploy-a-model.md) deploys an uploaded model and verifies it is serving.
