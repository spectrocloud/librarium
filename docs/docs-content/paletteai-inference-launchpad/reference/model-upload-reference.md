---
sidebar_label: "Model Upload Reference"
title: "PaletteAI Inference Launchpad Model Upload Reference"
description:
  "Reference for the Palette CLI model download and upload commands and the model metadata file used to place models on
  an air-gapped PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.5
tags: ["paletteai-inference-launchpad", "reference", "models", "air-gapped"]
keywords: ["launchpad", "ai", "palette cli", "model upload", "metadata", "huggingface", "air-gapped"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This reference lists the flags for the Palette CLI model commands and the fields of the model metadata file. It supports
the [Upload a Model (Air-Gapped)](../how-to-guides/upload-a-model-air-gapped.md) how-to, which walks through the
download and upload flow.

{/* NEEDS REVIEW: `palette content model download` and `palette content model upload` are a new command surface from the engineering source and are not yet in the published Palette CLI reference. Confirm the command names, flags, and defaults before publishing. */}

## palette content model download

Downloads a model from Hugging Face into a local directory on a connected workstation and records a completion manifest
that a later upload validates against.

| **Flag**                   | **Description**                                                                                          | **Required** |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ------------ |
| `--metadata`, `-f`         | Path to the model metadata YAML (from Artifact Studio), or a `.tar.gz` bundle of the metadata and files. | Yes          |
| `--model-dir`              | Local directory to download into. The model lands at `<model-dir>/<name>/<version>/`.                    | Yes          |
| `--hf-token` (`$HF_TOKEN`) | Hugging Face token for gated or private repositories.                                                    | No           |

## palette content model upload

Ships an already-downloaded model directory to one appliance node over `rsync` and SSH. By default the upload never
contacts Hugging Face and fails if `--model-dir` is missing or incomplete; pass `--download` to fetch the model first.

**Required flags**

| **Flag**                        | **Description**                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--metadata`, `-f`              | Path to the model metadata YAML, or a `.tar.gz` bundle of the metadata and files.                                        |
| `--model-dir`                   | Local directory holding the model at `<model-dir>/<name>/<version>/`. Required unless `--download` or `--metadata-only`. |
| `--ssh-user`                    | SSH user on the target appliance node.                                                                                   |
| `--ssh-host`                    | Address (IP or DNS name) of the target appliance node.                                                                   |
| `--ssh-key` or `--ssh-password` | SSH authentication. Mutually exclusive; `--ssh-password` is supported on Unix workstations only.                         |

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

The metadata file is the operator's contract with the appliance. Only `name`, `version`, and `huggingface.repo` are
required; everything else is optional. The parser rejects unknown top-level fields.

| **Field**              | **Description**                                                                                                                             | **Required** |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`                 | Model name. Sets the `<name>` path segment on the appliance.                                                                                | Yes          |
| `version`              | Model version. Sets the `<version>` path segment on the appliance.                                                                          | Yes          |
| `huggingface.repo`     | Source Hugging Face repository.                                                                                                             | Yes          |
| `huggingface.files`    | One or more globs selecting which repository files to download. When omitted, every file is downloaded.                                     | No           |
| `huggingface.revision` | Hugging Face revision (branch, tag, or commit). Defaults to `main`.                                                                         | No           |
| `huggingface.logo`     | Path inside the Hugging Face repository to a logo image, downloaded alongside the weights.                                                  | No           |
| `logo`                 | A logo bundled from local disk. Mutually exclusive with `huggingface.logo`.                                                                 | No           |
| `launchpad`            | Optional gateway tuning block (engine, variants, and so on). The Palette CLI ships it to the appliance unchanged and does not interpret it. | No           |

The following example downloads a set of GGUF weights from a Hugging Face repository and includes a `launchpad` tuning
block.

```yaml
name: llama-3-8b-instruct
version: 1.0.0
displayName: "Llama 3 8B Instruct"
description: "Meta's Llama 3 8B instruct-tuned model."
author: Meta AI
license: llama-3

huggingface:
  repo: bartowski/Llama-3.2-1B-Instruct-GGUF
  revision: main
  files:
    - "*.gguf"
  logo: assets/logo.png # optional: pulled from the Hugging Face repo, saved as logo.<ext>

# logo: ./local-logo.png # OR bundle a local file from disk (mutually exclusive with huggingface.logo)

launchpad: # optional: gateway tuning block, shipped verbatim (the Palette CLI does not interpret it)
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

After a successful upload, the model directory on the appliance node has the following layout.

```text
/usr/local/spectrocloud/content/models/<name>/<version>/
├── ...model files...   # written first (per huggingface.files globs)
├── metadata.yaml       # written last — readiness signal
└── logo.<ext>          # optional (local or Hugging Face-sourced)
```

{/* NEEDS REVIEW: the appliance path /usr/local/spectrocloud/content/models/<name>/<version>/ is from the engineering source. Confirm before publishing. */}

## Resources

- [Upload a Model (Air-Gapped)](../how-to-guides/upload-a-model-air-gapped.md) walks through the download and upload
  flow.
- [Deploy a Model](../how-to-guides/deploy-a-model.md) deploys an uploaded model and verifies it is serving.
