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

A model recipe is a single archive that carries everything that the appliance needs to serve a certified model, except
the model weights. It holds two things:

- The model metadata file, `metadata.yaml`, which names the model and its version, tells the Palette CLI which weights
  to download from Hugging Face, and tells the appliance how to serve the model.

- The inference engine image that the metadata file names, such as a vLLM build for one GPU vendor.

A recipe holds no model weights. Weights are often hundreds of gigabytes, so they get downloaded and uploaded
separately.

Each recipe targets one GPU vendor, because the engine image differs between NVIDIA and AMD GPUs even when the model
metadata is the same. A model certified for both vendors has two recipes, and you use the one that matches the GPU
vendor of your hardware.

A model recipe is not the serving recipe, which is the `launchpad` block of engine settings inside the metadata file.
Refer to [The `launchpad` Block](../reference/model-upload-reference.md#the-launchpad-block).

## Why Model Recipes Exist

New models and new inference engine versions arrive more often than PaletteAI Inference Launchpad releases. The content
bundle that installs the appliance carries one default engine, so a recipe is how any other engine version reaches the
appliance.

A recipe decouples model support from the product release cycle. Spectro Cloud publishes a recipe when a model or its
engine is ready, and you add it to a running appliance without upgrading the platform. Switching a model to a different
engine build, such as a vendor-optimized one, changes the recipe only.

Recipes also give you one artifact to work from. The recipe is the only model artifact you download for a certified
model. Its metadata drives the weights download, and its engine image travels with it, so the metadata and the engine it
names cannot drift apart.

## Where Model Recipes Come From

Spectro Cloud builds recipes for certified models and publishes them to Artifact Studio, independent of product
releases. NVIDIA and AMD recipes are separate artifacts. You do not build or edit a recipe yourself.

A model you bring yourself has no recipe. You author its metadata file and upload the weights with that file instead.
For how certified models and your own models differ, refer to [Model Certification](./model-certification.md).

## How a Model Reaches the Appliance

A certified model reaches the appliance in two uploads. The first is the recipe. The second is the model weights, which
the recipe does not contain. The recipe's metadata tells the Palette CLI which weights to download.

| **Upload** | **What it carries**                                                                                                          | **Command**                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Recipe     | The recipe, uploaded as content. The appliance loads the engine image and places the metadata file in the model's directory. | `palette content upload`, or a content upload in Local UI           |
| Weights    | The model weights, downloaded from Hugging Face on the jumpbox and transferred to the appliance over SSH.                    | `palette content model download` and `palette content model upload` |

The two uploads use different paths for practical reasons. The recipe carries a container image, so it uploads as
content, the same way the content bundle reaches the appliance, and the appliance loads the image into its local
registry. The weights are too large for a reliable content upload, so they use the resumable `rsync` transfer over SSH,
which survives a broken connection. The weights upload reads the model name and version from the recipe, so you do not
keep a separate copy of the metadata file.

### Two Commands or One for the Weights

The Palette CLI moves the weights in two commands or in one. With two commands, `palette content model download` stages
the weights on the jumpbox, and `palette content model upload` transfers them to the appliance as a separate step. With
one command, `palette content model upload --download` downloads any weights that are missing from the model directory,
then transfers them. Both forms use the same model directory, and a finished download leaves a `.download-complete`
marker, so neither form repeats a download that already completed.

The two-command form keeps the download and the transfer apart. You can confirm that the download finished before the
transfer starts, run the two at different times, and upload the same downloaded weights to more than one appliance. The
one-command form saves a step when you upload to a single appliance and the jumpbox can reach both Hugging Face and the
appliance in the same session.

## The State Between the Two Uploads

After the recipe upload and before the weights upload, the model does not appear in the appliance's deploy catalog. This
is by design, not a failure.

The appliance lists a model once its version directory holds the metadata file and at least one other file, which it
counts as weights. After the recipe upload, the directory holds only `metadata.yaml`, so the appliance does not list the
model. An engine started on an empty model directory fails. Because one weight file is enough, the model can appear in
the catalog before the weights upload finishes.

## Model Recipes and Metadata Files

For a certified model, the recipe is the only file you download. The `--model-recipe` flag on the model download and
upload commands reads the metadata out of the recipe, so you do not keep a separate metadata file.

The `--metadata` flag passes a metadata file directly. You use it for a model you bring yourself, and you can keep using
a metadata file you already have. A metadata file does not carry an engine image, so that flow relies on an engine image
that is already on the appliance, such as the default engine in the content bundle. For the commands in both flows,
refer to [Upload a Model](../how-to-guides/upload-a-model.md).

## Resources

- [Upload a Model](../how-to-guides/upload-a-model.md) walks through downloading a recipe and running both uploads.

- [Model Upload Reference](../reference/model-upload-reference.md) lists the recipe archive properties and every flag of
  the model commands.

- [Model Certification](./model-certification.md) explains how certified models differ from models you bring yourself.

- [Inference Engines](./inference-engines.md) explains the engines that a recipe's image provides.
