---
sidebar_label: "Upload a Model"
title: "Upload a Model"
description:
  "Step-by-step guidance for platform operators on how to upload a model recipe and the model weights from a jumpbox to
  a PaletteAI Inference Launchpad appliance with the Palette CLI, so that the model appears in the deploy catalog."
hide_table_of_contents: false
sidebar_position: 1.5
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

This guide comes before [Deploy a Model](./deploy-a-model.md): the upload puts the model in the catalog, and the deploy
serves it. For a model that is not in the certified catalog, author `metadata.yaml` first, then follow
[Upload with a Metadata File](#upload-with-a-metadata-file). Refer to [Bring Your Own Model](./bring-your-own-model.md).
For the full command flags and metadata file fields, refer to
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

- `rsync` on the jumpbox. The Palette CLI uses it to transfer the model weights to the appliance over SSH.

- The appliance's SSH host address (IP or DNS name) and an SSH user with `sudo` access, which you use to read the node's
  upload token and to transfer the weights.

- Network access from the jumpbox to the appliance node on TCP port `5082`, which the Palette CLI uses to upload the
  model recipe to the node's Local UI API.

- Access to Artifact Studio, Spectro Cloud's artifact download portal, to download the model recipe.

- _(Gated or private Hugging Face repositories)_ A Hugging Face access token.

{/* NEEDS REVIEW: the source specifies rsync 3.2.3+ and OpenSSH 8.4+ on the jumpbox. Confirm the minimum versions before publishing. */}

## Download the Model Recipe

1. In Artifact Studio, download the model recipe for the model you intend to run. NVIDIA and AMD recipes are separate
   artifacts, so choose the recipe that matches the GPU vendor of your appliance.

2. Save the recipe on the jumpbox. You use the same file for both uploads in this guide.

{/* NEEDS REVIEW: the engineering dev test uploaded a recipe file ending in -retag.tar.zst with palette content upload and the plain recipe file with palette content model upload. The ticket, the epic, and the build pipeline all describe one published file per model and vendor. Confirm that operators receive one file and use it for both uploads, and confirm its filename and extension as downloaded from Artifact Studio. */}

## Upload the Model Recipe

Upload the recipe to the appliance as content. The appliance loads the inference engine image from the recipe and places
the model's metadata file in the model's directory. You can upload with the Palette CLI or from Local UI.

{/* NEEDS REVIEW: confirm which node receives the recipe on a multi-node appliance (the leader, as for the content bundle), and whether the weights upload must target the same node. */}

### Upload with the Palette CLI

The Palette CLI authenticates to the node with a per-node upload token, so you do not sign in to Palette for this step.

1. From the jumpbox, read the upload token from the node and store it in an environment variable.

   ```bash
   export AIL_NODE_TOKEN=$(ssh <ssh-user>@<appliance-host> sudo cat /opt/spectrocloud/.upload-auth-token)
   ```

   Replace `<ssh-user>` with the appliance's SSH user and `<appliance-host>` with the node's address.

   ```bash hideClipboard title="Expected output"

   ```

   The command prints nothing when it succeeds. If SSH prompts for a password, enter the SSH user's password.

2. Upload the recipe to the node.

   ```bash
   palette content upload \
     --file <model-recipe-file> \
     --token "$AIL_NODE_TOKEN" \
     <appliance-host>
   ```

   Replace `<model-recipe-file>` with the path to the recipe on the jumpbox and `<appliance-host>` with the node's
   address. The command targets port `5082` by default.

   ```bash hideClipboard title="Expected output"
   response: Uploaded content successfully
   ```

   After the transfer completes, the node unpacks the recipe and imports the engine image into its local registry. Wait
   for the node to finish before you continue.

### Upload from Local UI

1. Open Local UI on the node at `https://<appliance-host>:5080` and sign in. Replace `<appliance-host>` with the node's
   address.

2. From the left main menu, select **Content** > **Actions** > **Upload Content**.

3. Select the recipe file and start the upload.

4. After the upload reaches 100 percent, wait for the node to finish unpacking the recipe before you continue.

{/* NEEDS REVIEW: the Local UI labels come from the content bundle upload in Install the Appliance. No source confirms them for a recipe, and the epic lists the Local UI recipe upload as needing a test. Confirm the labels and that a recipe uploads through Local UI. */}

## Download the Model Weights

After the recipe upload, the model does not appear in the deploy catalog yet. This is expected and is not a failure. The
model's directory on the appliance holds only `metadata.yaml` until the weights arrive, and the appliance lists a model
only when its weights are present. The model appears after you upload the weights in
[Upload the Model to the Appliance](#upload-the-model-to-the-appliance).

On the jumpbox, download the model weights from Hugging Face into a writable local directory. Do not use a read-only NFS
mount. The Palette CLI reads the model name, version, and Hugging Face source from the recipe.

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

2. _(Gated or private Hugging Face repositories)_ Provide a Hugging Face token through the `HF_TOKEN` environment
   variable.

   ```bash
   HF_TOKEN=<hugging-face-token> palette content model download \
     --model-recipe <model-recipe-file> \
     --model-dir ./models
   ```

   Replace `<hugging-face-token>` with your Hugging Face access token and `<model-recipe-file>` with the path to the
   recipe.

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   ...
   Downloaded <name>@<version> to models/<name>/<version>
   ```

## Upload the Model to the Appliance

Ship the downloaded weights from the jumpbox to the appliance over SSH. On a multi-node appliance, upload to a single
node; the appliance syncs the model to the remaining nodes automatically.

1. Run the upload command with the recipe, the model directory, and the appliance's SSH details.

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

   :::warning `--model-dir` points at the parent, not the model's own directory

   `--model-dir` is the directory that _contains_ `<name>/<version>/`, not the directory named after the model. The
   Palette CLI composes the model path as `<model-dir>/<name>/<version>/` from the `name` and `version` fields in the
   model metadata. For a model at `./models/my-model/1.0.0/`, pass `--model-dir ./models`. Passing
   `--model-dir ./models/my-model` produces the error
   `model dir ./models/my-model/my-model/1.0.0 is not a complete download for my-model@1.0.0`, with the model name
   doubled in the path.

   :::

2. _(Optional)_ To download and upload the weights in one command instead of running the download command first, add
   `--download`. This example uses password authentication, which needs `--insecure-skip-host-key-check` when the
   jumpbox does not yet trust the node's SSH host key.

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

   ```bash hideClipboard title="Expected output"
   Model: <name>@<version> (HuggingFace: <hugging-face-repository>@<revision>)
   ...
   metadata.yaml: already up to date on remote, nothing sent
   Uploaded <name>@<version> to <appliance-host>:/opt/data/spectrocloud/models/<name>/<version> (full)
   ```

The upload command accepts other flags, including metadata-only sync (`--metadata-only`). For the full list, refer to
[Model Upload Reference](../reference/model-upload-reference.md#palette-content-model-upload).

## Verify the Model and Deploy It

1. In the appliance console, select **Cluster** from the left main menu, then select the **Models** tab and **Deploy New
   Model** to open the **Deploy model** dialog.

2. Open the model drop-down menu and confirm the model you uploaded is listed. Each entry renders as
   `<Name> · <N>+GPU · <size>GB`. The model appears on the next catalog scan after the weights upload finishes.

3. Deploy the model by following [Deploy a Model](./deploy-a-model.md).

## Upload with a Metadata File

Before model recipes, you downloaded a standalone metadata file and passed it to the Palette CLI with `--metadata`. This
prior flow still works. Use it for a model you bring yourself, which has no recipe, or for a metadata file you already
have. The `--metadata` and `--model-recipe` flags are mutually exclusive, so pass exactly one of them.

### Move from a Metadata File to a Model Recipe

Artifact Studio publishes a model recipe in place of the standalone metadata file. If you used to download
`metadata.yaml`, change your workflow as follows.

- Download the model recipe for your GPU vendor instead of the metadata file.

- Upload the recipe as content, as described in [Upload the Model Recipe](#upload-the-model-recipe). This step is new.
  It brings the model's inference engine image to the appliance.

- In the download and upload commands, replace `--metadata <metadata-file>` with `--model-recipe <model-recipe-file>`.
  Every other flag stays the same.

A metadata file that you already have keeps working with `--metadata`. It does not carry an engine image, so the model
runs only if the engine image it names is already on the appliance. For a certified model that has a recipe, use the
recipe.

{/* NEEDS REVIEW: confirm when Artifact Studio stops publishing the standalone metadata file. An epic comment says recipes replace it with the 1.2.0 release, and that 1.1.x releases keep the metadata file. */}

### Download and Upload with a Metadata File

1. On the jumpbox, download the model from Hugging Face with the path to your metadata file.

   ```bash
   palette content model download \
     --metadata <metadata-file> \
     --model-dir ./models
   ```

   Replace `<metadata-file>` with the path to your metadata file. For a gated or private Hugging Face repository, set
   the `HF_TOKEN` environment variable.

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

   To download and upload in one command, add `--download`. Then verify and deploy the model as described in
   [Verify the Model and Deploy It](#verify-the-model-and-deploy-it).

## Next Steps

- **Deploy the model:** Follow [Deploy a Model](./deploy-a-model.md) to deploy the uploaded model and verify it is
  serving.
- **Bring your own model:** Follow [Bring Your Own Model](./bring-your-own-model.md) to author metadata for a model that
  is not in the certified catalog, then download, upload, and deploy it.
- **Replace a serving model:** Follow [Replace a Model](./replace-a-model.md) to remove the current model from a node
  and deploy this one instead.
- **Understand model recipes:** Refer to [Model Recipes](../explanation/model-recipes.md) for what a recipe contains and
  why the upload takes two steps.
- **Review the reference:** Refer to [Model Upload Reference](../reference/model-upload-reference.md) for the full
  command flags and metadata file fields.
- **Enable vision preprocessing:** If you uploaded a vision model to use with a text-only model, follow
  [Enable Vision Preprocessing](./enable-vision-preprocessing.md).
