---
sidebar_label: "Model Recipes"
title: "PaletteAI Inference Launchpad Model Recipes"
description:
  "An explanation of model recipes in PaletteAI Inference Launchpad: what a recipe contains, why recipes exist, how one
  recipe reaches the appliance in two uploads, and why the model is not in the catalog between them."
hide_table_of_contents: false
sidebar_position: 3.5
tags: ["paletteai-inference-launchpad", "models", "explanation"]
keywords: ["launchpad", "ai", "model recipe", "metadata", "inference engine", "vLLM", "artifact studio"]
---

This page explains what a model recipe is, why PaletteAI Inference Launchpad uses recipes to deliver certified models,
and what happens on the appliance as a recipe is uploaded. It gives you the background for
[Upload a Model](../how-to-guides/upload-a-model.md), where you run the two uploads that a recipe needs.

## Model Recipe Overview

A model recipe is a single archive that carries everything the appliance needs to serve a certified model, except the
model weights. It holds two things:

- The model metadata file, `metadata.yaml`, which names the model and its version, tells the Palette CLI which weights
  to download from Hugging Face, and tells the appliance how to serve the model.

- The inference engine image that the metadata file names, such as a vLLM build for one GPU vendor.

A recipe holds no model weights. Weights are often hundreds of gigabytes, so they travel separately, on the same
download and upload path that the Palette CLI has always used for weights.

Each recipe targets one GPU vendor, because the engine image differs between NVIDIA and AMD GPUs even when the model
metadata is the same. A model certified for both vendors has two recipes, and you use the one that matches the GPUs in
your appliance.

A model recipe is a different thing from the `launchpad` block inside the metadata file, which the
[Model Upload Reference](../reference/model-upload-reference.md#the-launchpad-block) calls the serving recipe. The
serving recipe is a set of engine settings. The model recipe is the archive that delivers the metadata file, including
that block, together with the engine image.

## Why Model Recipes Exist

New models and new inference engine versions arrive far more often than PaletteAI Inference Launchpad releases. Before
recipes, the engine image shipped inside the content bundle that installs the appliance, so moving to a new engine
version meant waiting for a product release, even when the change only mattered to one model.

A recipe decouples model support from the product release cycle. Spectro Cloud publishes a recipe when a model or its
engine is ready, and you add it to a running appliance without upgrading the platform. Switching a model to a different
engine build, such as a vendor-optimized one, changes the recipe only. The content bundle keeps its default engine, and
every other engine version reaches the appliance through a recipe.

Recipes also give you one artifact to work from. The recipe is the only model artifact you download for a certified
model. Its metadata drives the weights download, and its engine image travels with it, so the metadata and the engine it
names cannot drift apart.

## Where Model Recipes Come From

Spectro Cloud builds recipes for certified models and publishes them to Artifact Studio, independent of product
releases. NVIDIA and AMD recipes are separate artifacts. You do not build or edit a recipe yourself.

{/* NEEDS REVIEW: the ticket says Artifact Studio lists recipes as their own artifact type, while a later epic comment says the recipe replaces the metadata file in the same Artifact Studio tile. Confirm how Artifact Studio presents recipes, and when recipes for the 1.2.0 models are published. */}

A model you bring yourself has no recipe. You author its metadata file and upload the weights with that file instead.
For how certified models and your own models differ, refer to [Model Certification](./model-certification.md).

## How a Recipe Reaches the Appliance

One recipe drives two uploads, and no single command does both.

| **Upload**  | **What it carries**                                                                                                          | **Command**                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| The recipe  | The recipe, uploaded as content. The appliance loads the engine image and places the metadata file in the model's directory. | `palette content upload`, or a content upload in Local UI           |
| The weights | The model weights, downloaded from Hugging Face on the jumpbox and transferred to the appliance over SSH.                    | `palette content model download` and `palette content model upload` |

The two uploads use different paths for practical reasons. The recipe carries a container image, so it uploads as
content, the same way the content bundle reaches the appliance, and the appliance loads the image into its local
registry. The weights are too large for a reliable content upload, so they use the resumable `rsync` transfer over SSH,
which survives a broken connection. The weights upload reads the model name and version from the recipe, so you do not
keep a separate copy of the metadata file.

## The State Between the Two Uploads

After the recipe upload and before the weights upload, the model does not appear in the appliance's deploy catalog. This
is by design, not a failure.

The appliance lists a model only when its version directory holds both the metadata file and at least one weight file.
After the recipe upload, the directory holds only `metadata.yaml`, so the appliance waits for the weights rather than
offering a model that cannot load. When the weights upload finishes, the model appears on the next catalog scan.

The order matters for the same reason during an ordinary weights upload. The Palette CLI writes the weight files first
and the metadata file last, so the metadata file marks a finished upload.

## Model Recipes and Metadata Files

Before recipes, Artifact Studio published a standalone metadata file for each certified model, and you passed it to the
Palette CLI with `--metadata`. The recipe replaces that download. The `--model-recipe` flag on the model download and
upload commands reads the metadata out of the recipe, so the recipe is the only file you keep.

The `--metadata` flag still works. You use it for a model you bring yourself, and you can keep using a metadata file you
already have. A metadata file does not carry an engine image, so that flow relies on an engine image that is already on
the appliance, such as the default engine in the content bundle. For the commands in both flows, refer to
[Upload a Model](../how-to-guides/upload-a-model.md).

## Resources

- [Upload a Model](../how-to-guides/upload-a-model.md)
- [Model Upload Reference](../reference/model-upload-reference.md)
- [Model Certification](./model-certification.md)
- [Inference Engines](./inference-engines.md)
