---
sidebar_label: "Bring Your Own Model"
title: "Bring Your Own Model"
description:
  "Step-by-step guidance for platform operators on how to bring a model that is not in the certified catalog onto a
  PaletteAI Inference Launchpad appliance by authoring its metadata file, then uploading and deploying it."
hide_table_of_contents: false
sidebar_position: 1.6
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "bring your own model", "metadata", "huggingface", "upload", "deploy"]
---

This guide explains how to bring a model that is not in the certified catalog onto a PaletteAI Inference Launchpad
appliance. The download, upload, and deploy steps are the same as for a certified model. The addition is the metadata
file. Because there is no Artifact Studio download for an uncertified model, you author the file yourself, and that file
is where you tell the appliance which weights to fetch and what the model needs to run.

Spectro Cloud has not tested a model you bring yourself on your hardware. Confirming that it loads, serves requests, and
answers acceptably is yours to do. For what certification covers and how the two paths differ, refer to
[Model Certification](../explanation/model-certification.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.

- A jumpbox that meets the prerequisites in [Upload a Model](./upload-a-model.md#prerequisites), including the Palette
  CLI, `rsync`, SSH access to the appliance, and network access to Hugging Face.

- The Hugging Face repository that holds the model, and an access token if the repository is gated or private.

- Enough free GPU memory on the appliance for the model. Refer to
  [Suggested Hardware](../reference/hardware-requirements.md).

## Author the Metadata File

The metadata file tells the Palette CLI which weights to download and tells the appliance how to serve them. The CLI
reads `name` and `version` to build the model path `<model-dir>/<name>/<version>/`, and the appliance reads the same
file after the upload to place the model in the deploy catalog under `name`.

Create the file on the jumpbox. You choose the filename, for example `my-model.yaml`, and pass its path as `--metadata`
in the commands that follow.

1. Start with the model identity and the source of the weights. A working file cannot omit `name`, `version`, or
   `huggingface.repo`.

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
   ```

   The `files` globs narrow the download to the weight, configuration, and `tokenizer*` files rather than every file in
   the repository. Omit `files` to download the whole repository.

2. _(Optional)_ Add a `launchpad` block to describe what the model needs to run. Refer to
   [Describe the Hardware the Model Needs](#describe-the-hardware-the-model-needs).

   Without the block, the appliance serves the model with vLLM and treats it as needing at least one GPU.

3. Check every field name against [Model Metadata File](../reference/model-upload-reference.md#model-metadata-file),
   then save the file.

:::warning

The appliance ignores fields it does not recognize instead of rejecting them. A misspelled field name is therefore
dropped without an error, and the model deploys with the default the field was meant to override. Only `name` and
`version` are enforced, and a file missing either one never reaches the deploy catalog.

:::

### Describe the Hardware the Model Needs

Inside `launchpad`, `variants` is a list of per-hardware tuning cells. The appliance detects each node's GPU product,
GPU count, and per-GPU memory, then selects the single variant that fits that node. Fields set at the `launchpad` level
are defaults, and a variant overrides them.

```yaml
launchpad:
  engine: vllm
  min_gpus: 4
  variants:
    - min_gpus: 4
      vram_gb: 141
      serve:
        tensor_parallel_size: 4
        max_model_len: 32768
```

This example sets a floor of four GPUs, requires 141 GB of memory per GPU, and spreads the model across four GPUs at a
32,768-token context. It leaves `vendor` and `gpu_product` unset, so the variant fits any node that meets the GPU floor.
For what each field does, refer to [The launchpad Block](../reference/model-upload-reference.md#the-launchpad-block).

:::warning

The appliance compares `vendor` and `gpu_product` against the GPU labels a node publishes by exact string match, so the
value has to be the node's own product label, such as `NVIDIA-H200` or `AMD_Instinct_MI325_OAM`, rather than a marketing
name such as `H200`. A value that no node publishes does not fail quietly: the model appears in the deploy catalog
marked as not deployable, with a reason naming what the variant needs against what the node has. Leave both fields unset
unless you know the exact label your nodes publish.

:::

## Download and Upload the Model

The download and upload commands are the same ones a certified model uses, with your authored file as `--metadata`. For
the full flag list, password authentication, and the one-step `--download` form, refer to
[Upload a Model](./upload-a-model.md#upload-the-model-to-the-appliance).

1. On the jumpbox, download the model from Hugging Face into a writable local directory. Do not use a read-only NFS
   mount.

   ```bash
   palette content model download \
       --metadata my-model.yaml \
       --model-dir ./models
   ```

   The model lands at `<model-dir>/<name>/<version>/`, where `<name>` and `<version>` come from your metadata file.

2. _(Gated or private Hugging Face repositories)_ Provide a Hugging Face token through the `HF_TOKEN` environment
   variable instead.

   ```bash
   HF_TOKEN=<hugging-face-token> palette content model download \
       --metadata my-model.yaml \
       --model-dir ./models
   ```

3. Upload the downloaded directory to the appliance over SSH. On a multi-node appliance, upload to a single node, and
   the appliance syncs the model to the remaining nodes.

   ```bash
   palette content model upload \
       --metadata my-model.yaml \
       --model-dir ./models \
       --ssh-user <ssh-user> \
       --ssh-host <appliance-host> \
       --ssh-key <private-key-path>
   ```

   Replace `<ssh-user>` and `<appliance-host>` with the appliance's SSH user and address, and `<private-key-path>` with
   the path to your private key, such as `~/.ssh/id_ed25519`. Pass the parent directory to `--model-dir`, not the
   directory named after the model.

## Deploy and Validate the Model

1. Deploy the model by following [Deploy a Model](./deploy-a-model.md). The model appears in the deploy catalog on the
   next catalog scan after the upload finishes, and only a model in the `Available` state can be deployed.

2. Confirm the model reaches the `ready` or `serving` state and reports `N/N healthy`. If it does not, refer to
   [Troubleshoot a Model That Does Not Deploy](#troubleshoot-a-model-that-does-not-deploy).

3. Send the workload you intend to run against the model and review the responses. A certified model arrives with
   Spectro Cloud's own testing on a given GPU configuration, and a model you bring yourself does not, so this step is
   where you establish that the model is fit for your use case.

## Troubleshoot a Model That Does Not Deploy

A model whose metadata does not match your hardware is never hidden. It appears in the deploy catalog marked as not
deployable, with a reason. Use the following table to map the reason to the field to change.

| **What you observe**                                                                                                                   | **What it means**                                                                                                                                                                                   | **What to change**                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| The model does not appear in the deploy catalog at all.                                                                                | The upload has not finished, or the file sets no `name` or `version`. The appliance treats `metadata.yaml` as the last file of an upload, so the model surfaces only once the weights are in place. | Confirm the upload completed, and confirm the file sets both `name` and `version`.                          |
| The model is listed as not deployable, with a reason such as `needs 8+ GPU NVIDIA-H200 141GB VRAM; this node has 4x NVIDIA-L40S 46GB`. | No variant in your file fits the node.                                                                                                                                                              | Lower `min_gpus`, correct `gpu_product` or `vendor`, or remove those two pins so the variant fits any node. |
| The deployment is blocked with `no node in this cluster advertises GPU product <product>`.                                             | `gpu_product` is not a label any node in the cluster publishes.                                                                                                                                     | Correct the value to the node's exact GPU product label, or remove the field.                               |
| The deployment is blocked with `MinVRAMGB <n> exceeds the <memory> per GPU advertised by nodes running <product>`.                     | `vram_gb` is higher than the per-GPU memory your GPUs advertise.                                                                                                                                    | Lower `vram_gb` to the memory your GPUs provide.                                                            |
| The deployment is blocked with `no node advertises a driver version; MinDriver <version> cannot be verified`.                          | `min_driver` is set, but the appliance cannot read a driver version from any node.                                                                                                                  | Remove `min_driver`, or confirm the GPU driver is installed and reporting its version.                      |
| The model deploys but reaches the `failed` or `verification failed` state.                                                             | The engine started but never became ready. For an uncertified model, the usual cause is that the weights and the requested context length do not fit the GPU memory.                                | Lower `serve.max_model_len`, or raise `serve.tensor_parallel_size` to spread the model across more GPUs.    |

For deploy reasons that are about cluster capacity rather than your metadata, refer to
[Resolve a Blocked Deployment](./deploy-a-model.md#resolve-a-blocked-deployment).

## Limitations

- Spectro Cloud does not test or support a model you bring yourself. Certification covers a model, an engine version,
  and a GPU configuration together, and none of that applies to a model you author metadata for.

- The appliance selects one variant per node from the hardware it detects, and it expects every node to carry the same
  GPU model. Author variants for the hardware in your cluster rather than for a mixed fleet.

{/* NEEDS REVIEW: per the epic, day-2 operations for an uncertified model are not supported. Confirm which day-2 operations are excluded, and add them to Limitations. */}

## Next Steps

Now that the model is serving, put it in front of clients.

- **Give a client access:** To route a client to the model, refer to
  [Manage a Client's Model Access](./manage-client-model-access.md).

- **Tune the metadata:** For every field the metadata file accepts, refer to
  [Model Upload Reference](../reference/model-upload-reference.md).
