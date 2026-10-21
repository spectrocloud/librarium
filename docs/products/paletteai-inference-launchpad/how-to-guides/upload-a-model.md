---
sidebar_label: "Upload a Model"
title: "Upload a Model"
description:
  "Step-by-step guidance for platform operators on how to upload a model recipe and the model weights from a jumpbox to
  a PaletteAI Inference Launchpad appliance with the Palette CLI, so that the model appears in the deploy catalog."
hide_table_of_contents: false
sidebar_position: 0.9
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "model upload",
    "model recipe",
    "jumpbox",
    "palette cli",
    "huggingface",
    "rsync",
    "ssh",
    "air-gapped",
  ]
---

{/* NEEDS REVIEW: per SME review, the model-upload flow is expected to change due to storage constraints and requirements. Revisit this guide when the new flow lands. */}

PaletteAI Inference Launchpad is a self-contained appliance with no outbound internet access, so you bring models to it
rather than having the appliance pull them at deploy time. For a certified model, you work from a model recipe that you
download from Artifact Studio. You upload the recipe to the appliance, then download the model weights onto a jumpbox
and upload them to the appliance over SSH, after which the model appears in the appliance's deploy catalog. For what a
recipe contains and why the upload takes two steps, refer to [Model Recipes](../explanation/model-recipes.md).

This guide is for a certified model, which comes with a model recipe. If you bring your own model, follow
[Bring Your Own Model](./bring-your-own-model.md) instead.

After the upload, the model appears in the deploy catalog, and you serve it by following
[Deploy a Model](./deploy-a-model.md). For the full command flags and metadata file fields, refer to
[Model Upload Reference](../reference/model-upload-reference.md).

:::info

You run every step in this guide from a **jumpbox**: a separate machine (also called the administrative workstation)
with outbound internet access and SSH access to the appliance. The jumpbox downloads the model recipe, which includes
the vLLM engine image, and the model weights from the internet. The appliance never downloads models itself. For how to
provision the jumpbox, refer to
[Administrative Workstation](../reference/hardware-requirements.md#administrative-workstation).

:::

## Prerequisites

- A **jumpbox** (administrative workstation) on the appliance network, provisioned with the Palette CLI, an SSH client
  and key pair (or password authentication), and enough local disk to stage model downloads.

- Outbound internet access from the jumpbox. The jumpbox downloads the model recipe, including its vLLM engine image,
  from Artifact Studio and the model weights from Hugging Face. For details, refer to
  [Administrative Workstation](../reference/hardware-requirements.md#administrative-workstation) and
  [Model Download Access](../reference/hardware-requirements.md#model-download-access-recommended).

- `rsync` on the jumpbox. The Palette CLI uses it to transfer the model weights to the appliance over SSH.

- The appliance's SSH host address (IP or DNS name) and an SSH user with `sudo` access, which you use to read the node's
  upload token and to transfer the weights.

- Network access from the jumpbox to the appliance node on TCP port `5082`, which the Palette CLI uses to upload the
  model recipe to the node's Local UI API, or on TCP port `5080` to upload it from Local UI in a browser.

- Access to Artifact Studio, Spectro Cloud's artifact download portal, to download the model recipe.

- _(Gated or private Hugging Face repositories)_ A Hugging Face access token.

{/* NEEDS REVIEW: the source specifies rsync 3.2.3+ and OpenSSH 8.4+ on the jumpbox. Confirm the minimum versions before publishing. */}

## Download the Model Recipe

1. In Artifact Studio, download the model recipe for the model you intend to run. NVIDIA and AMD recipes are separate
   artifacts, so choose the recipe that matches the GPU vendor of your hardware.

2. Save the recipe on the jumpbox. You use it twice. First, you upload the recipe to the appliance. Then the weights
   commands read the model's name, version, and Hugging Face source from it.

## Upload the Model Recipe

Upload the recipe to the appliance as content. The appliance loads the inference engine image from the recipe and places
the model's metadata file in the model's directory. On a multi-node appliance, upload the recipe to the
[leader](../reference/glossary.md#leader) node. Content uploaded on the leader synchronizes automatically to every
linked host. You can upload with the Palette CLI or from Local UI. Select the tab for your method.

<Tabs groupId="method">

<TabItem label="Palette CLI" value="cli">

The Palette CLI authenticates to the node with a per-node upload token, so you do not sign in to Palette for this step.

1. From the jumpbox, read the upload token from the leader node and store it in an environment variable.

   ```bash
   export AIL_NODE_TOKEN=$(ssh <ssh-user>@<appliance-host> sudo cat /opt/spectrocloud/.upload-auth-token)
   ```

   Replace `<ssh-user>` with the appliance's SSH user and `<appliance-host>` with the leader node's address.

   The command prints nothing when it succeeds. If SSH prompts for a password, enter the SSH user's password.

2. Upload the recipe to the leader node.

   ```bash
   palette content upload \
     --file <model-recipe-file> \
     --token "$AIL_NODE_TOKEN" \
     <appliance-host>
   ```

   Replace `<model-recipe-file>` with the path to the recipe on the jumpbox and `<appliance-host>` with the leader
   node's address. The command targets port `5082` by default.

   ```bash hideClipboard title="Expected output"
   response: Uploaded content successfully
   ```

   After the transfer completes, the node unpacks the recipe and imports the engine image into its local registry. Wait
   for the node to finish before you continue.

</TabItem>

<TabItem label="Local UI" value="ui">

1. Open Local UI on the leader node at `https://<appliance-host>:5080` and sign in. Replace `<appliance-host>` with the
   leader node's address.

2. From the left main menu, select **Content** > **Actions** > **Upload Content**.

3. Select the recipe file and start the upload.

4. After the upload reaches 100 percent, wait for the node to finish unpacking the recipe before you continue.

</TabItem>

</Tabs>

## Download and Upload the Model Weights

After the recipe upload, the model does not appear in the deploy catalog until its weights arrive. This is expected. For
the reason, refer to
[The State Between the Two Uploads](../explanation/model-recipes.md#the-state-between-the-two-uploads).

Choose one of the following options. Both options download the weights from Hugging Face onto the jumpbox and upload
them to the appliance over SSH, so use only one. For when to use each, refer to
[Two Commands or One for the Weights](../explanation/model-recipes.md#two-commands-or-one-for-the-weights).

- [Option 1: Download, Then Upload](#option-1-download-then-upload) runs two commands.
- [Option 2: Download and Upload in One Command](#option-2-download-and-upload-in-one-command) runs one command.

On a multi-node appliance, upload the weights to a single node; the appliance syncs the model to the remaining nodes
automatically. You can use the leader node again.

### Option 1: Download, Then Upload

Download the weights into a writable local directory on the jumpbox, then ship them to the appliance. Do not use a
read-only NFS mount. The Palette CLI reads the model name, version, and Hugging Face source from the recipe.

1. Run the download command with the path to the recipe and the directory to download into.

   ```bash
   palette content model download \
     --model-recipe <model-recipe-file> \
     --model-dir ./models
   ```

   Replace `<model-recipe-file>` with the path to the recipe on the jumpbox.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   ...
   Downloaded <name>@<version> to models/<name>/<version>
   ```

   The model downloads to `<model-dir>/<name>/<version>/`, where `<name>` and `<version>` come from the metadata inside
   the recipe.

   For a gated or private Hugging Face repository, set the `HF_TOKEN` environment variable to your Hugging Face access
   token before you run the command.

2. Run the upload command with the recipe, the model directory, and the appliance's SSH details.

   ```bash
   palette content model upload \
     --model-recipe <model-recipe-file> \
     --model-dir ./models \
     --ssh-user <ssh-user> \
     --ssh-host <appliance-host> \
     --ssh-key <private-key-path>
   ```

   Replace `<model-recipe-file>` with the path to the recipe, `<ssh-user>` and `<appliance-host>` with the appliance's
   SSH user and address, and `<private-key-path>` with the path to your private key, such as `~/.ssh/id_ed25519`.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   Model dir models/<name>/<version> already complete (per .download-complete); skipping HuggingFace download
   ...
   metadata.yaml: already up to date on remote, nothing sent
   Uploaded <name>@<version> to <appliance-host>:/opt/data/spectrocloud/models/<name>/<version> (full)
   ```

   Because the recipe upload already placed the metadata file, the metadata line usually reports that nothing was sent.
   The line `metadata.yaml: transferred` also indicates success.

   :::warning

   `--model-dir` points at the parent directory that _contains_ `<name>/<version>/`, not at the directory named after
   the model. The Palette CLI composes the model path as `<model-dir>/<name>/<version>/` from the `name` and `version`
   fields in the model metadata. For a model at `./models/my-model/1.0.0/`, pass `--model-dir ./models`. Passing
   `--model-dir ./models/my-model` produces an error that begins
   `model dir models/my-model/my-model/1.0.0 is not a complete download for my-model@1.0.0`, with the model name doubled
   in the path.

   :::

The upload command accepts other flags, including metadata-only sync (`--metadata-only`). For the full list, refer to
[Model Upload Reference](../reference/model-upload-reference.md#palette-content-model-upload).

### Option 2: Download and Upload in One Command

Use this option instead of [Option 1](#option-1-download-then-upload). The upload command downloads any weights that are
missing from the model directory, then transfers them to the appliance.

1. Run the upload command with `--download`. This example uses password authentication, which needs
   `--insecure-skip-host-key-check` when the jumpbox does not yet trust the node's SSH host key.

   ```bash
   palette content model upload \
     --model-recipe <model-recipe-file> \
     --model-dir ./models \
     --download \
     --ssh-user <ssh-user> \
     --ssh-password <ssh-password> \
     --ssh-host <appliance-host> \
     --insecure-skip-host-key-check
   ```

   Replace `<model-recipe-file>` with the path to the recipe, `<ssh-user>` and `<appliance-host>` with the appliance's
   SSH user and address, and `<ssh-password>` with the SSH user's password.

   For a gated or private Hugging Face repository, set the `HF_TOKEN` environment variable to your Hugging Face access
   token before you run the command.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   ...
   metadata.yaml: already up to date on remote, nothing sent
   Uploaded <name>@<version> to <appliance-host>:/opt/data/spectrocloud/models/<name>/<version> (full)
   ```

## Verify the Model and Deploy It

1. In the appliance console, select **Cluster** from the left main menu, then select the **Models** tab.

2. Select **Deploy Model** to open the **Deploy a model** wizard.

3. Open the model drop-down menu and confirm the model you uploaded is listed. Each entry shows the model name, followed
   by details such as its engine and size. The model can appear in the list before all its weights have landed. Wait
   until the upload command reports `Uploaded <name>@<version>` before you deploy it.

4. Deploy the model by following [Deploy a Model](./deploy-a-model.md).

## Move from a Metadata File to a Model Recipe

Artifact Studio publishes a model recipe in place of the standalone metadata file. If your workflow downloads
`metadata.yaml` for a certified model, change it as follows.

1. Download the model recipe for your GPU vendor instead of the metadata file.

2. Upload the recipe as content, as described in [Upload the Model Recipe](#upload-the-model-recipe). This step is new.
   It brings the model's inference engine image to the appliance.

3. In the download and upload commands, replace `--metadata <metadata-file>` with `--model-recipe <model-recipe-file>`.
   Every other flag stays the same.

A metadata file that you already have keeps working with `--metadata`. It does not carry an engine image. For what that
means for the appliance's network access, refer to [Upload with a Metadata File](#upload-with-a-metadata-file). For a
certified model that has a recipe, use the recipe.

## Upload with a Metadata File

Use a metadata file for a model you bring yourself, which has no recipe. For a certified model, this is the prior flow,
which the recipe replaces. The `--metadata` and `--model-recipe` flags are mutually exclusive, so pass exactly one of
them.

:::warning

A metadata file does not carry the vLLM engine image that the model runs on, and the appliance's air-gapped content
includes no vLLM image. The engine image must be downloaded from the internet, so this flow works only in an environment
with internet access. The jumpbox also needs internet access to download the model weights from Hugging Face. For a
certified model, use the model recipe, which brings the engine image to the appliance.

:::

1. On the jumpbox, download the model from Hugging Face with the path to your metadata file.

   ```bash
   palette content model download \
     --metadata <metadata-file> \
     --model-dir ./models
   ```

   Replace `<metadata-file>` with the path to your metadata file. For a gated or private Hugging Face repository, set
   the `HF_TOKEN` environment variable to your Hugging Face access token before you run the command.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   ...
   Downloaded <name>@<version> to models/<name>/<version>
   ```

2. Upload the model to the appliance over SSH.

   ```bash
   palette content model upload \
     --metadata <metadata-file> \
     --model-dir ./models \
     --ssh-user <ssh-user> \
     --ssh-host <appliance-host> \
     --ssh-key <private-key-path>
   ```

   Replace `<metadata-file>` with the path to your metadata file, `<ssh-user>` and `<appliance-host>` with the
   appliance's SSH user and address, and `<private-key-path>` with the path to your private key.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   Model dir models/<name>/<version> already complete (per .download-complete); skipping HuggingFace download
   ...
   metadata.yaml: transferred
   Uploaded <name>@<version> to <appliance-host>:/opt/data/spectrocloud/models/<name>/<version> (full)
   ```

   To download and upload in one command, add `--download`. For when to use each form, refer to
   [Two Commands or One for the Weights](../explanation/model-recipes.md#two-commands-or-one-for-the-weights). Then
   verify and deploy the model as described in [Verify the Model and Deploy It](#verify-the-model-and-deploy-it).

## Next Steps

- To deploy the uploaded model and verify that it is serving, follow [Deploy a Model](./deploy-a-model.md).

- To remove the current model from a node and deploy this one instead, follow [Replace a Model](./replace-a-model.md).

- If you uploaded a vision model to use with a text-only model, follow
  [Enable Vision Preprocessing](./enable-vision-preprocessing.md).
